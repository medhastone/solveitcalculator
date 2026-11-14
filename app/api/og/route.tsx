import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

export async function GET() {
  const title = 'SolveItCalculator';
  const badge = 'Online Calculators';
  const subtitle =
    'Transparent formulas, lookup tables, and instant step-by-step answers.';
  const example = '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #1D4ED8 100%)',
          color: '#FFFFFF',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: '#2457D6',
                border: '2px solid rgba(255,255,255,0.28)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                fontWeight: 800,
                color: '#FFFFFF',
              }}
            >
              S
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.02em' }}>
                SolveItCalculator
              </span>
              <span style={{ fontSize: '15px', color: '#93C5FD', fontWeight: 600 }}>
                solveitcalculator.com
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              padding: '10px 20px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.24)',
              fontSize: '18px',
              fontWeight: 700,
              color: '#DBEAFE',
            }}
          >
            {badge}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '960px' }}>
          <div
            style={{
              fontSize: '58px',
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '26px',
              lineHeight: 1.4,
              color: '#CBD5E1',
              fontWeight: 500,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.16)',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {example ? (
              <div
                style={{
                  display: 'flex',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  background: '#065F46',
                  border: '1px solid #34D399',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#ECFDF5',
                }}
              >
                Example: {example}
              </div>
            ) : (
              <span style={{ fontSize: '20px', fontWeight: 600, color: '#93C5FD' }}>
                Instant Step-by-Step Math &amp; Lookup Tables
              </span>
            )}
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#CBD5E1' }}>
            100% Free · No Sign-up
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
