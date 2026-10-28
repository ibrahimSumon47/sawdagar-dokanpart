import { randomUUID } from 'node:crypto';
import {
  calculateCheckoutTotals,
  formatSubOrderNumber,
  formatTaka,
  type CouponRule,
} from '@sd/domain';
import { getPrisma } from '../../lib/prisma';
import type { CartLine } from '../shop/types';
import type { AddressInput, PaymentMethod } from './inputs';
import type { AddressRecord } from './queries';

/** One request detail kept with the order audit row. */
export interface RequestDetails {
  ipAddress: string | null;
  userAgent: string | null;
}

export interface PlaceOrderParams {
  userId: string;
  email: string;
  cartId: string;
  items: CartLine[];
  coupon: CouponRule | null;
  paymentMethod: PaymentMethod;
  addressId: string | null;
  address: AddressRecord | AddressInput;
  notes: string;
  orderNumber: string;
  paymentId: string;
  request: RequestDetails;
  now?: Date;
}

/** A checkout failure that the form can translate without exposing database errors. */
export class CheckoutFailure extends Error {
  constructor(
    readonly code: 'stock' | 'empty',
    readonly productTitle?: string,
  ) {
    super(code);
    this.name = 'CheckoutFailure';
  }
}

/**
 * Creates the order, one sub-order per seller, the payment row, stock
 * reservations, the coupon redemption and the confirmation mail in a single
 * transaction. Stock is decremented with a conditional update, so two buyers
 * racing for the last unit cannot both succeed.
 */
export async function placeOrderInDatabase(params: PlaceOrderParams): Promise<string> {
  const now = params.now ?? new Date();
  const totals = calculateCheckoutTotals(
    params.items.map((item) => ({
      vendorId: item.vendorId,
      vendorSlug: item.vendor.slug,
      unitPriceMinor: item.priceMinor,
      quantity: item.quantity,
    })),
    params.coupon,
    params.address.district,
    now,
  );
  if (params.items.length === 0) throw new CheckoutFailure('empty');

  const method = params.paymentMethod;
  const paidOnline = method === 'mockpay';
  const orderStatus = paidOnline ? 'pending_payment' : 'confirmed';
  const subOrderStatus = paidOnline ? 'pending' : 'confirmed';
  const reservationStatus = paidOnline ? 'held' : 'confirmed';
  const reservationExpiry = paidOnline
    ? new Date(now.getTime() + 30 * 60 * 1000)
    : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return getPrisma().$transaction(
    async (tx) => {
      const orderId = randomUUID();
      let addressId = params.addressId;

      if (!addressId) {
        const addressCount = await tx.address.count({ where: { userId: params.userId } });
        const created = await tx.address.create({
          data: {
            id: randomUUID(),
            userId: params.userId,
            label: params.address.label || 'Delivery address',
            recipientName: params.address.recipientName,
            phone: params.address.phone,
            division: params.address.division,
            district: params.address.district,
            upazila: params.address.upazila,
            area: params.address.area || null,
            addressLine: params.address.addressLine,
            isDefault: addressCount === 0,
          },
        });
        addressId = created.id;
      }

      for (const item of params.items) {
        const variantUpdate = await tx.productVariant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (variantUpdate.count === 0) {
          throw new CheckoutFailure('stock', item.title.en);
        }

        const productUpdate = await tx.product.updateMany({
          where: { id: item.productId, totalStock: { gte: item.quantity } },
          data: { totalStock: { decrement: item.quantity } },
        });
        if (productUpdate.count === 0) {
          throw new CheckoutFailure('stock', item.title.en);
        }
      }

      await tx.order.create({
        data: {
          id: orderId,
          number: params.orderNumber,
          userId: params.userId,
          status: orderStatus,
          paymentStatus: 'pending',
          paymentMethod: method,
          subtotalMinor: totals.subtotalMinor,
          shippingMinor: totals.shippingMinor,
          discountMinor: totals.discountMinor,
          vatMinor: totals.vatMinor,
          totalMinor: totals.totalMinor,
          couponCode: params.coupon?.code ?? null,
          shippingName: params.address.recipientName,
          shippingPhone: params.address.phone,
          shippingDivision: params.address.division,
          shippingDistrict: params.address.district,
          shippingUpazila: params.address.upazila,
          shippingArea: params.address.area || null,
          shippingLine: params.address.addressLine,
          notes: params.notes || null,
          addressId,
          placedAt: now,
          confirmedAt: paidOnline ? null : now,
        },
      });

      for (const [index, vendor] of totals.vendors.entries()) {
        const lines = params.items.filter((item) => item.vendorId === vendor.vendorId);
        const subOrderId = randomUUID();
        await tx.subOrder.create({
          data: {
            id: subOrderId,
            number: formatSubOrderNumber(params.orderNumber, index + 1),
            orderId,
            organizationId: vendor.vendorId,
            status: subOrderStatus,
            subtotalMinor: vendor.subtotalMinor,
            shippingMinor: vendor.shippingMinor,
            discountMinor: vendor.discountMinor,
            totalMinor: vendor.totalMinor,
          },
        });
        await tx.orderItem.createMany({
          data: lines.map((line) => ({
            id: randomUUID(),
            orderId,
            subOrderId,
            productId: line.productId,
            variantId: line.variantId,
            titleEn: line.title.en,
            titleBn: line.title.bn,
            variantNameEn: line.variantName.en,
            variantNameBn: line.variantName.bn,
            sku: line.sku,
            tone: line.tone,
            unitPriceMinor: line.priceMinor,
            quantity: line.quantity,
            lineTotalMinor: line.priceMinor * line.quantity,
          })),
        });
      }

      await tx.payment.create({
        data: {
          id: params.paymentId,
          orderId,
          provider: method,
          status: 'pending',
          amountMinor: totals.totalMinor,
          providerRef: paidOnline ? params.paymentId : null,
          attempts: paidOnline
            ? {
                create: {
                  id: randomUUID(),
                  provider: 'mockpay',
                  status: 'initiated',
                  message: 'MockPay gateway opened.',
                },
              }
            : undefined,
        },
      });

      await tx.stockReservation.createMany({
        data: params.items.map((item) => ({
          id: randomUUID(),
          orderId,
          variantId: item.variantId,
          quantity: item.quantity,
          status: reservationStatus,
          expiresAt: reservationExpiry,
        })),
      });

      if (params.coupon) {
        const coupon = await tx.coupon.findUniqueOrThrow({
          where: { code: params.coupon.code },
          select: { id: true },
        });
        await tx.couponRedemption.create({
          data: {
            id: randomUUID(),
            couponId: coupon.id,
            couponCode: params.coupon.code,
            orderId,
            userId: params.userId,
            discountMinor: totals.couponSavingsMinor,
          },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: params.cartId } });
      await tx.cart.update({
        where: { id: params.cartId },
        data: { couponCode: null, expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) },
      });

      await tx.mailOutbox.create({
        data: {
          id: randomUUID(),
          userId: params.userId,
          orderId,
          toEmail: params.email,
          subject: `Order ${params.orderNumber} received`,
          bodyText: `Thank you. Your order ${params.orderNumber} totals ${formatTaka(
            totals.totalMinor,
          )}. Delivery is to ${params.address.recipientName}, ${params.address.addressLine}, ${
            params.address.upazila
          }, ${params.address.district}. This is a demo store; no payment will be captured outside the sandbox.`,
          status: 'queued',
        },
      });

      await tx.auditLog.create({
        data: {
          id: randomUUID(),
          actorUserId: params.userId,
          actorEmail: params.email,
          action: 'order.placed',
          targetType: 'order',
          targetId: params.orderNumber,
          ipAddress: params.request.ipAddress,
          userAgent: params.request.userAgent,
          metadata: { totalMinor: totals.totalMinor, paymentMethod: method },
        },
      });

      return params.orderNumber;
    },
    { maxWait: 10_000, timeout: 20_000 },
  );
}
