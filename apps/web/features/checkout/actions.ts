'use server';

import { randomBytes, randomUUID } from 'node:crypto';
import { formatOrderCode, formatOrderNumber } from '@sd/domain';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { purgeCatalogCategories } from '../catalog/queries';
import { getPrisma } from '../../lib/prisma';
import { requestDetails } from '../auth/audit';
import { getViewer } from '../auth/session';
import { getCartCoupon, getCartId, readCartItems } from '../shop/queries';
import {
  addressSchema,
  checkoutFormSchema,
  guestContactSchema,
  readAddress,
  type AddressInput,
} from './inputs';
import { createMockPayToken, PaymentConfigurationError, verifyMockPayToken } from './mockPayToken';
import { CheckoutFailure, placeOrderInDatabase, type RequestDetails } from './orderPlacement';
import { completeMockPayment, failMockPayment } from './payments';
import { getPaymentById, getPaymentForViewer, type AddressRecord } from './queries';
import type { CheckoutState } from './state';

/**
 * Validates the address and payment choice, prices the cart on the server and
 * creates the order. Signed-in buyers use their account; guests supply contact
 * details on the same form. The browser never sends a price, user id or role.
 */
export async function placeOrder(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const viewer = await getViewer();
  const parsedForm = checkoutFormSchema.safeParse({
    paymentMethod: formData.get('paymentMethod'),
    deliveryMethod: formData.get('deliveryMethod') ?? 'standard',
    addressId: formData.get('addressId') ?? '',
    notes: formData.get('notes') ?? '',
  });
  if (!parsedForm.success) {
    return { status: 'invalid', field: parsedForm.error.issues[0]?.path.join('.') };
  }

  let guestEmail = '';
  let guestPhone: string | undefined;
  if (!viewer) {
    const parsedContact = guestContactSchema.safeParse({
      email: formData.get('email') ?? '',
      phone: formData.get('phone') ?? '',
    });
    if (!parsedContact.success) {
      return { status: 'invalid', field: parsedContact.error.issues[0]?.path.join('.') };
    }
    guestEmail = parsedContact.data.email;
    guestPhone = parsedContact.data.phone;
  }

  const prisma = getPrisma();
  let address: AddressRecord | AddressInput;
  let addressId: string | null = null;

  if (viewer && parsedForm.data.addressId) {
    const saved = await prisma.address.findFirst({
      where: { id: parsedForm.data.addressId, userId: viewer.id },
    });
    if (!saved) return { status: 'invalid', field: 'addressId' };
    address = saved;
    addressId = saved.id;
  } else {
    const parsedAddress = addressSchema.safeParse(readAddress(formData));
    if (!parsedAddress.success) {
      return { status: 'invalid', field: parsedAddress.error.issues[0]?.path.join('.') };
    }
    address = parsedAddress.data;
  }

  const cartId = await getCartId(viewer?.id ?? null);
  if (!cartId) return { status: 'empty' };

  const items = await readCartItems(cartId);
  if (items.length === 0) return { status: 'empty' };

  // Coupons are recorded per account, so a guest order is priced without one.
  const coupon = viewer ? await getCartCoupon(cartId, items) : null;
  const now = new Date();
  const orderNumber = formatOrderNumber(now, randomBytes(3).toString('hex').toUpperCase());
  const orderCode = formatOrderCode(now);
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
      userId: viewer?.id ?? null,
      email: viewer?.email ?? guestEmail,
      guestPhone,
      orderCode,
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
  // Stock changed, so the cached featured grid must be dropped too.
  purgeCatalogCategories();
  revalidatePath('/');
  revalidatePath('/account');

  if (parsedForm.data.paymentMethod === 'mockpay') {
    redirect(`/checkout/pay/${paymentId}?token=${encodeURIComponent(paymentToken ?? '')}`);
  }
  if (!viewer) redirect(`/order/confirmed?code=${orderCode}`);
  redirect(`/orders/${orderNumber}?placed=1`);
}

/**
 * Completes a MockPay payment from the gateway page. The signed token is the
 * credential, so guests can pay without a session; a signed-in buyer must also
 * own the order.
 */
export async function payMockPaymentAction(formData: FormData): Promise<void> {
  const paymentId = String(formData.get('paymentId') ?? '');
  const token = String(formData.get('token') ?? '');
  if (!verifyMockPayToken(paymentId, token)) redirect('/checkout');

  const viewer = await getViewer();
  const payment = viewer
    ? await getPaymentForViewer(paymentId, viewer.id)
    : await getPaymentById(paymentId);
  if (!payment) redirect(viewer ? '/account' : '/checkout');

  const result = await completeMockPayment(paymentId, token);
  if (!result.ok || !result.orderNumber) {
    redirect(viewer ? `/orders/${payment.order.number}?payment=failed` : '/checkout');
  }
  if (!viewer) redirect(`/order/confirmed?code=${payment.order.orderCode ?? ''}`);
  redirect(`/orders/${result.orderNumber}?payment=paid`);
}

/** Simulates a failed MockPay attempt without changing the reserved stock. */
export async function failMockPaymentAction(formData: FormData): Promise<void> {
  const paymentId = String(formData.get('paymentId') ?? '');
  const token = String(formData.get('token') ?? '');
  if (!verifyMockPayToken(paymentId, token)) redirect('/checkout');

  const viewer = await getViewer();
  const payment = viewer
    ? await getPaymentForViewer(paymentId, viewer.id)
    : await getPaymentById(paymentId);
  if (!payment) redirect(viewer ? '/account' : '/checkout');

  await failMockPayment(paymentId, token);
  redirect(viewer ? `/orders/${payment.order.number}?payment=cancelled` : '/checkout');
}
