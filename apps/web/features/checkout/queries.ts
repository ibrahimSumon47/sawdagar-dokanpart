import type { CouponRule } from '@sd/domain';
import { getPrisma } from '../../lib/prisma';
import { getCartCoupon, getCartId, readCartItems } from '../shop/queries';
import type { CartLine } from '../shop/types';

export interface AddressRecord {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  division: string;
  district: string;
  upazila: string;
  area: string | null;
  addressLine: string;
  isDefault: boolean;
}

export interface CheckoutData {
  cartId: string | null;
  items: CartLine[];
  coupon: CouponRule | null;
  addresses: AddressRecord[];
}

export interface OrderItemRecord {
  id: string;
  titleEn: string;
  titleBn: string;
  variantNameEn: string;
  variantNameBn: string;
  sku: string;
  tone: string;
  unitPriceMinor: number;
  quantity: number;
  lineTotalMinor: number;
  productSlug: string;
}

export interface SubOrderRecord {
  id: string;
  number: string;
  status: string;
  vendorName: string;
  vendorSlug: string;
  subtotalMinor: number;
  shippingMinor: number;
  discountMinor: number;
  totalMinor: number;
  items: OrderItemRecord[];
}

export interface PaymentRecord {
  id: string;
  provider: string;
  status: string;
  amountMinor: number;
  providerRef: string | null;
  failureCode: string | null;
  createdAt: Date;
  paidAt: Date | null;
}

export interface OrderRecord {
  id: string;
  number: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  currency: string;
  subtotalMinor: number;
  shippingMinor: number;
  discountMinor: number;
  vatMinor: number;
  totalMinor: number;
  couponCode: string | null;
  shippingName: string;
  shippingPhone: string;
  shippingDivision: string;
  shippingDistrict: string;
  shippingUpazila: string;
  shippingArea: string | null;
  shippingLine: string;
  notes: string | null;
  placedAt: Date;
  confirmedAt: Date | null;
  cancelledAt: Date | null;
  subOrders: SubOrderRecord[];
  payments: PaymentRecord[];
}

/** Addresses in the order the checkout page offers them, default first. */
export async function getAddresses(userId: string): Promise<AddressRecord[]> {
  const rows = await getPrisma().address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });

  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    recipientName: row.recipientName,
    phone: row.phone,
    division: row.division,
    district: row.district,
    upazila: row.upazila,
    area: row.area,
    addressLine: row.addressLine,
    isDefault: row.isDefault,
  }));
}

/** Everything the checkout page needs for one signed-in buyer. */
export async function getCheckoutData(userId: string): Promise<CheckoutData> {
  const cartId = await getCartId(userId);
  const [items, addresses] = await Promise.all([
    cartId ? readCartItems(cartId) : Promise.resolve([]),
    getAddresses(userId),
  ]);
  const coupon = await getCartCoupon(cartId, items);

  return { cartId, items, coupon, addresses };
}

/** Loads one order only when it belongs to the viewer. */
export async function getOrderForViewer(
  number: string,
  userId: string,
): Promise<OrderRecord | null> {
  const order = await getPrisma().order.findFirst({
    where: { number, userId },
    include: {
      subOrders: {
        orderBy: { number: 'asc' },
        include: {
          organization: { select: { name: true, slug: true } },
          items: {
            orderBy: { titleEn: 'asc' },
            include: { product: { select: { slug: true } } },
          },
        },
      },
      payments: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!order) return null;

  return {
    id: order.id,
    number: order.number,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    currency: order.currency,
    subtotalMinor: order.subtotalMinor,
    shippingMinor: order.shippingMinor,
    discountMinor: order.discountMinor,
    vatMinor: order.vatMinor,
    totalMinor: order.totalMinor,
    couponCode: order.couponCode,
    shippingName: order.shippingName,
    shippingPhone: order.shippingPhone,
    shippingDivision: order.shippingDivision,
    shippingDistrict: order.shippingDistrict,
    shippingUpazila: order.shippingUpazila,
    shippingArea: order.shippingArea,
    shippingLine: order.shippingLine,
    notes: order.notes,
    placedAt: order.placedAt,
    confirmedAt: order.confirmedAt,
    cancelledAt: order.cancelledAt,
    subOrders: order.subOrders.map((subOrder) => ({
      id: subOrder.id,
      number: subOrder.number,
      status: subOrder.status,
      vendorName: subOrder.organization.name,
      vendorSlug: subOrder.organization.slug,
      subtotalMinor: subOrder.subtotalMinor,
      shippingMinor: subOrder.shippingMinor,
      discountMinor: subOrder.discountMinor,
      totalMinor: subOrder.totalMinor,
      items: subOrder.items.map((item) => ({
        id: item.id,
        titleEn: item.titleEn,
        titleBn: item.titleBn,
        variantNameEn: item.variantNameEn,
        variantNameBn: item.variantNameBn,
        sku: item.sku,
        tone: item.tone,
        unitPriceMinor: item.unitPriceMinor,
        quantity: item.quantity,
        lineTotalMinor: item.lineTotalMinor,
        productSlug: item.product.slug,
      })),
    })),
    payments: order.payments.map((payment) => ({
      id: payment.id,
      provider: payment.provider,
      status: payment.status,
      amountMinor: payment.amountMinor,
      providerRef: payment.providerRef,
      failureCode: payment.failureCode,
      createdAt: payment.createdAt,
      paidAt: payment.paidAt,
    })),
  };
}

export interface MailRecord {
  id: string;
  toEmail: string;
  subject: string;
  bodyText: string;
  status: string;
  createdAt: Date;
  orderNumber: string | null;
}

/** Recent in-app messages for one buyer, newest first. */
export async function getMailForUser(userId: string): Promise<MailRecord[]> {
  const rows = await getPrisma().mailOutbox.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { order: { select: { number: true } } },
  });

  return rows.map((row) => ({
    id: row.id,
    toEmail: row.toEmail,
    subject: row.subject,
    bodyText: row.bodyText,
    status: row.status,
    createdAt: row.createdAt,
    orderNumber: row.order?.number ?? null,
  }));
}

/** Payment page data, including the buyer id used to check ownership. */
export async function getPaymentForViewer(paymentId: string, userId: string) {
  return getPrisma().payment.findFirst({
    where: { id: paymentId, order: { userId } },
    include: {
      order: {
        select: { number: true, totalMinor: true, status: true, userId: true, placedAt: true },
      },
    },
  });
}
