import re

with open('components/conversion/GramsHubClient.tsx', 'r') as f:
    code = f.read()

card_code = """
{/*  8.5 Grams to Milliliters (Dedicated Tool)  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm border border-outline-variant/30 hover:border-secondary transition-all flex flex-col justify-between group">
  <div className="flex items-start justify-between gap-2 mb-2">
    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
      <span className="material-symbols-outlined text-[18px]">science</span>
    </div>
    <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Metric Volume</span>
  </div>
  <div>
    <h4 className="font-headline-md text-[18px] text-on-surface font-semibold">Grams to Milliliters</h4>
    <div className="font-data-mono text-label-caps text-secondary mb-2">g → mL (Density Dependent)</div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
      Advanced mass-to-volume calculator with specialized ingredient densities (water, flour, sugar, milk).
    </p>
    <div className="bg-surface-container-low p-2.5 rounded-lg text-body-sm font-data-mono mb-3 space-y-1">
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Formula (Water):</span>
        <span className="text-on-surface font-semibold">1 g = 1 mL</span>
      </div>
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Benchmark:</span>
        <span className="text-secondary font-bold">100 g = 100 mL</span>
      </div>
    </div>
  </div>
  <Link href="/conversion/grams-to-milliliters" className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-secondary hover:text-on-secondary text-secondary font-body-sm font-medium transition-all flex items-center justify-center gap-1.5">
    <span className="">Open Calculator</span>
    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
  </Link>
</div>
"""

# Find "{/*  9. Grams to Liters  */}" and insert the card before it
code = code.replace("{/*  9. Grams to Liters  */}", card_code + "{/*  9. Grams to Liters  */}")

with open('components/conversion/GramsHubClient.tsx', 'w') as f:
    f.write(code)

