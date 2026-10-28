import { NextResponse, type NextRequest } from 'next/server';
import { completeMockPayment } from '../../../../features/checkout/payments';

export const runtime = 'nodejs';

interface MockPayCallback {
  paymentId?: unknown;
  token?: unknown;
}

/** Gateway callback for MockPay. The signed token is the only credential. */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: MockPayCallback;
  try {
    body = (await request.json()) as MockPayCallback;
  } catch {
    return NextResponse.json({ ok: false, code: 'invalid-body' }, { status: 400 });
  }

  if (typeof body.paymentId !== 'string' || typeof body.token !== 'string') {
    return NextResponse.json({ ok: false, code: 'invalid-body' }, { status: 400 });
  }

  const result = await completeMockPayment(body.paymentId, body.token);
  if (!result.ok) {
    const status = result.code === 'invalid-token' ? 401 : result.code === 'not-found' ? 404 : 409;
    return NextResponse.json({ ok: false, code: result.code }, { status });
  }

  return NextResponse.json({
    ok: true,
    orderNumber: result.orderNumber,
    alreadyPaid: result.alreadyPaid ?? false,
  });
}
