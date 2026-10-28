'use server';

import { randomBytes, randomUUID } from 'node:crypto';
import { formatOrderNumber } from '@sd/domain';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPrisma } from '../../lib/prisma';
import { requestDetails } from '../auth/audit';
import { requireViewer } from '../auth/session';
import { getCartCoupon, getCartId, readCartItems } from '../shop/queries';
import { addressSchema, checkoutFormSchema, readAddress } from './inputs';
import { createMockPayToken, PaymentConfigurationError } from './mockPayToken';
import { CheckoutFailure, placeOrderInDatabase, type RequestDetails } from './orderPlacement';
import { completeMockPayment, failMockPayment } from './payments';
import { getPaymentForViewer } from './queries';
import type { CheckoutState } from './state';

/**
 * Validates the address and payment choice, prices the cart on the server and
 * creates the order. The browser never sends a price, user id or role.
 */
export async function placeOrder(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const viewer = await requireViewer('/checkout');
  const parsedForm = checkoutFormSchema.safeParse({
    paymentMethod: formData.get('paymentMethod'),
    addressId: formData.get('addressId') ?? '',
    notes: formData.get('notes') ?? '',
  });
  if (!parsedForm.success) {
    return { status: 'invalid', field: parsedForm.error.issues[0]?.path.join('.') };
  }

  const prisma = getPrisma();
  let address;
  let addressId: string | null = null;

  if (parsedForm.data.addressId) {
    address = await prisma.address.findFirst({
      where: { id: parsedForm.data.addressId, userId: viewer.id },
    });
    if (!address) return { status: 'invalid', field: 'addressId' };
    addressId = address.id;
  } else {
    const parsedAddress = addressSchema.safeParse(readAddress(formData));
    if (!parsedAddress.success) {
      return { status: 'invalid', field: parsedAddress.error.issues[0]?.path.join('.') };
    }
    address = parsedAddress.data;
  }

  const cartId = await getCartId(viewer.id);
  if (!cartId) return { status: 'empty' };

  const items = await readCartItems(cartId);
  if (items.length === 0) return { status: 'empty' };

  const coupon = await getCartCoupon(cartId, items);
  const now = new Date();
  const orderNumber = formatOrderNumber(now, randomBytes(3).toString('hex').toUpperCase());
  const paymentId = randomUUID();

  let paymentToken: string | null = null;
  if (parsedForm.data.paymentMethod === 'mockpay') {
    try {
      paymentToken = createMockPayToken(paymentId, now.getTime());
    } catch (error) {
      if (error instanceof PaymentConfigurationError) return { status: 'config' };
      return { status: 'failed' };
    }
  }

  const requestHeaders = await headers();
  const request: RequestDetails = requestDetails(requestHeaders);

  try {
    await placeOrderInDatabase({
      userId: viewer.id,
      email: viewer.email,
      cartId,
      items,
      coupon,
      paymentMethod: parsedForm.data.paymentMethod,
      addressId,
      address,
      notes: parsedForm.data.notes,
      orderNumber,
      paymentId,
      request,
      now,
    });
  } catch (error) {
    if (error instanceof CheckoutFailure) {
      return error.code === 'empty'
        ? { status: 'empty' }
        : { status: 'stock', productTitle: error.productTitle };
    }
    return { status: 'failed' };
  }

  revalidatePath('/checkout');
  revalidatePath('/');
  revalidatePath('/account');

  if (parsedForm.data.paymentMethod === 'mockpay') {
    redirect(`/checkout/pay/${paymentId}?token=${encodeURIComponent(paymentToken ?? '')}`);
  }
  redirect(`/orders/${orderNumber}?placed=1`);
}

/** Completes a MockPay payment from the demo gateway page. */
export async function payMockPaymentAction(formData: FormData): Promise<void> {
  const viewer = await requireViewer('/checkout');
  const paymentId = String(formData.get('paymentId') ?? '');
  const token = String(formData.get('token') ?? '');
  const payment = await getPaymentForViewer(paymentId, viewer.id);
  if (!payment) redirect('/account');

  const result = await completeMockPayment(paymentId, token);
  if (!result.ok || !result.orderNumber) {
    redirect(`/orders/${payment.order.number}?payment=failed`);
  }
  redirect(`/orders/${result.orderNumber}?payment=paid`);
}

/** Simulates a failed MockPay attempt without changing the reserved stock. */
export async function failMockPaymentAction(formData: FormData): Promise<void> {
  const viewer = await requireViewer('/checkout');
  const paymentId = String(formData.get('paymentId') ?? '');
  const token = String(formData.get('token') ?? '');
  const payment = await getPaymentForViewer(paymentId, viewer.id);
  if (!payment) redirect('/account');

  await failMockPayment(paymentId, token);
  redirect(`/orders/${payment.order.number}?payment=cancelled`);
}
