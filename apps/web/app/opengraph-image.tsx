import { ImageResponse } from 'next/og';

export const alt = 'Sawdagar Dokanpat, a multi-vendor marketplace for Bangladesh';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Shared social card for every route: brand name, pitch and demo notice. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#faf7f2',
        color: '#141414',
        padding: '72px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 56, height: 56, background: '#c2410c', display: 'flex' }} />
        <div style={{ fontSize: 30, letterSpacing: 4, textTransform: 'uppercase' }}>
          Sawdagar Dokanpat
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 76, lineHeight: 1.05, maxWidth: 980 }}>
          Every dokan, one marketplace.
        </div>
        <div style={{ marginTop: 28, fontSize: 30, color: '#57534e' }}>
          Twelve departments from independent Bangladeshi sellers.
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24 }}>
        <div style={{ color: '#57534e' }}>Independent sellers across Bangladesh</div>
        <div style={{ color: '#c2410c' }}>sawdagar-dokanpart.vercel.app</div>
      </div>
    </div>,
    size,
  );
}
