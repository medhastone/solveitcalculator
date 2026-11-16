import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

export const alt =
  'SolveItCalculator — Free Online Calculators, Step-by-Step Formulas & Reference Charts';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0F172A',
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(36, 87, 214, 0.35), transparent 50%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.25), transparent 50%)',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
          color: '#F8FAFC',
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
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #2457D6 55%, #1A44B8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 800,
                color: '#FFFFFF',
                border: '2px solid rgba(255,255,255,0.35)',
              }}
            >
              =
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.02em' }}>
                SolveItCalculator
              </span>
              <span style={{ fontSize: '14px', color: '#94A3B8' }}>
                solveitcalculator.com
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              backgroundColor: 'rgba(36, 87, 214, 0.28)',
              border: '1px solid rgba(96, 165, 250, 0.45)',
              color: '#93C5FD',
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Formula-Verified Calculators
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '980px' }}>
          <div
            style={{
              fontSize: '58px',
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
            }}
          >
            Free Online Calculators, Step-by-Step Formulas & Reference Charts
          </div>
          <div
            style={{
              fontSize: '25px',
              lineHeight: 1.45,
              color: '#CBD5E1',
              maxWidth: '900px',
            }}
          >
            Instant browser-based tools across Math, Finance & Salary Tax, Home & Construction, Unit Conversion, Date & Time, Health, and Science.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(148, 163, 184, 0.2)',
            paddingTop: '24px',
            fontSize: '16px',
            color: '#94A3B8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <span style={{ color: '#34D399', fontWeight: 700 }}>✓ 100% Transparent Formulas</span>
            <span>•</span>
            <span>✓ Worked Step-by-Step Examples</span>
            <span>•</span>
            <span>✓ NIST & Statutory Benchmarks</span>
          </div>
          <span style={{ color: '#E2E8F0', fontWeight: 600 }}>Free Interactive Tools</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
