import re

with open('app/daily-wage-calculator/DailyWageClient.tsx', 'r') as f:
    content = f.read()

# 1. Update populateMasterTable function
new_populate_fn = '''    // Master Table Data Generation
    const salarySlabs = [
      10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 
      60000, 70000, 75000, 80000, 90000, 100000, 120000, 150000, 
      175000, 200000, 250000, 300000, 400000, 500000
    ];

    function populateMasterTable(filterVal = "") {
      const tbody = document.getElementById('master-table-body');
      const countEl = document.getElementById('table-slab-count');
      if (!tbody) return;

      const trimmedFilter = filterVal.trim().toLowerCase();
      const filtered = salarySlabs.filter(s => {
        if (!trimmedFilter) return true;
        return s.toString().includes(trimmedFilter) || 
               s.toLocaleString().toLowerCase().includes(trimmedFilter) ||
               (s >= 1000 && (s/1000).toString().includes(trimmedFilter));
      });

      if (countEl) {
        countEl.textContent = `${filtered.length} of ${salarySlabs.length} Slabs`;
      }

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="p-space-lg text-center bg-surface-container-lowest">
              <div class="flex flex-col items-center justify-center py-6 space-y-2">
                <span class="material-symbols-outlined text-outline text-[36px]">search_off</span>
                <p class="font-body-md text-on-surface font-semibold">No salary slabs match "${filterVal}"</p>
                <p class="font-body-sm text-xs text-on-surface-variant">Try searching for 25000, 50000, 100000 or click a quick filter chip.</p>
                <button type="button" onclick="document.getElementById('table-filter-input').value=''; populateMasterTable('');" class="mt-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-colors">
                  Clear Filter
                </button>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = filtered.map((sal, idx) => {
        const d26 = (sal / 26).toFixed(2);
        const d22 = (sal / 22).toFixed(2);
        const d21 = (sal / 21.67).toFixed(2);
        const d30 = (sal / 30).toFixed(2);
        const isAlternate = idx % 2 === 1;

        return `
          <tr class="group hover:bg-primary/5 transition-all duration-150 border-b border-surface-container/60 last:border-b-0 ${isAlternate ? 'bg-surface-container-lowest' : 'bg-surface-container-low/30'}">
            <td class="p-space-md font-data-mono font-bold text-on-surface text-sm sm:text-base">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary group-hover:scale-125 transition-all"></span>
                <span>${currentCurrency}${sal.toLocaleString()}</span>
              </div>
            </td>
            <td class="p-space-md font-data-mono font-bold text-primary bg-primary/5 group-hover:bg-primary/10 transition-colors">
              <span class="inline-flex items-center gap-1">
                ${currentCurrency}${Number(d26).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
            </td>
            <td class="p-space-md font-data-mono font-medium text-on-surface">
              ${currentCurrency}${Number(d22).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </td>
            <td class="p-space-md font-data-mono font-medium text-on-surface">
              ${currentCurrency}${Number(d21).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </td>
            <td class="p-space-md font-data-mono text-on-surface-variant">
              ${currentCurrency}${Number(d30).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </td>
            <td class="p-space-md text-right whitespace-nowrap">
              <button 
                type="button" 
                onclick="loadSalaryIntoTab1(${sal})" 
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary font-body-sm text-xs font-semibold shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer ring-1 ring-primary/30 group/btn"
                title="Load ${currentCurrency}${sal.toLocaleString()} into calculator"
              >
                <span class="material-symbols-outlined text-[15px] group-hover/btn:-translate-y-0.5 transition-transform">arrow_upward</span>
                <span>Load in Calc</span>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Quick preset click handler
    (window as any).filterMasterTablePreset = function(val: string) {
      const input = document.getElementById('table-filter-input') as HTMLInputElement;
      if (input) {
        input.value = val;
        populateMasterTable(val);
      }
    };

    // Table filter listener
    function initTableFilter() {
      const input = document.getElementById('table-filter-input');
      if (input) {
        input.addEventListener('input', (e) => {
          populateMasterTable((e.target as HTMLInputElement).value);
        });
      }
    }'''

# Replace the old populateMasterTable function
pattern = r'    // Master Table Data Generation.*?    function initTableFilter\(\) \{.*?\}\s*\}'
content = re.sub(pattern, new_populate_fn, content, flags=re.DOTALL)

with open('app/daily-wage-calculator/DailyWageClient.tsx', 'w') as f:
    f.write(content)

print("Updated script logic successfully!")
