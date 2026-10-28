'use client';

export interface GlobalErrorProps {
  reset: () => void;
}

/**
 * Root error boundary. It replaces the whole document, so it carries its own
 * html and body, both languages and the retry action. It reads no cookies.
 */
export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body
        style={{ margin: 0, background: '#faf7f2', color: '#141414', fontFamily: 'sans-serif' }}
      >
        <main style={{ maxWidth: 640, margin: '0 auto', padding: '96px 24px' }}>
          <h1 style={{ fontSize: 32 }}>Something went wrong · কিছু ভুল হয়েছে</h1>
          <p style={{ color: '#57534e' }}>
            The storefront could not load this page. Try again, or open the catalog.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button
              type="button"
              onClick={reset}
              style={{
                background: '#c2410c',
                color: '#fff',
                border: 0,
                borderRadius: 2,
                padding: '12px 20px',
                fontSize: 15,
              }}
            >
              Try again
            </button>
            <a
              href="/catalog"
              style={{
                border: '1px solid #e7e1d8',
                borderRadius: 2,
                padding: '12px 20px',
                color: '#141414',
                textDecoration: 'none',
                fontSize: 15,
              }}
            >
              Catalog
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
