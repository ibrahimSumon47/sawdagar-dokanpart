import { getPrisma } from '../../../../lib/prisma';
import { getViewer } from '../../../../features/auth/session';

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

/** Downloads one CSV row per variant for the signed-in store. */
export async function GET(): Promise<Response> {
  const viewer = await getViewer();
  if (!viewer) return new Response('Unauthorized', { status: 401 });

  const membership = await getPrisma().member.findFirst({
    where: { userId: viewer.id, role: 'owner' },
    select: { organizationId: true },
    orderBy: { createdAt: 'asc' },
  });
  if (!membership) return new Response('Forbidden', { status: 403 });

  const rows = await getPrisma().productVariant.findMany({
    where: { product: { organizationId: membership.organizationId } },
    orderBy: { sku: 'asc' },
    include: { product: { select: { slug: true, titleEn: true, status: true } } },
  });

  const header = ['sku', 'product', 'slug', 'status', 'price_minor', 'stock'];
  const lines = rows.map((row) =>
    [
      row.sku,
      row.product.titleEn,
      row.product.slug,
      row.product.status,
      String(row.priceMinor),
      String(row.stock),
    ]
      .map(csvCell)
      .join(','),
  );
  const csv = [header.join(','), ...lines].join('\n');
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="products-${date}.csv"`,
      'cache-control': 'private, no-store',
    },
  });
}
