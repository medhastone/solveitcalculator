const fs = require('fs');
const file = 'app/finance/emi-calculator/EmiCalculatorClient.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `      {seoData && (
        <section className="w-full py-space-2xl px-gutter-mobile lg:px-gutter-desktop bg-surface-container-low">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="mb-space-xl max-w-3xl">
              <span className="font-label-caps text-label-caps uppercase text-outline">Borrower Advisory</span>
              <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface">
                {seoData.meta.h2s[0]}
              </h2>
              <div className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line mt-4">
                {seoData.editorial}
              </div>
            </div>
          </div>
        </section>
      )}

      {seoData && (
        <section className="w-full py-space-2xl px-gutter-mobile lg:px-gutter-desktop bg-surface-container-low">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="mb-space-xl max-w-3xl">
              <span className="font-label-caps text-label-caps uppercase text-outline">Actuarial Knowledge Base</span>
              <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-space-sm max-w-3xl">
              {seoData.faqs.map((faq, idx) => (
                <div key={idx} className="rounded-xl bg-surface-container-lowest overflow-hidden shadow-sm">
                  <button className="w-full p-space-md text-left flex items-center justify-between gap-4 font-semibold text-sm text-on-surface" onClick={() => toggleFaq(idx)} type="button">
                    <span>{faq.question}</span>
                    <span className={\`material-symbols-outlined text-outline transition-transform duration-200 \${openFaqs[idx] ? 'rotate-180' : ''}\`}>expand_more</span>
                  </button>
                  {openFaqs[idx] && (
                    <div className="faq-content p-space-md pt-0 text-xs text-on-surface-variant leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {seoData?.citation && (
        <section className="w-full py-space-2xl px-gutter-mobile lg:px-gutter-desktop bg-surface border-t border-outline/10">
          <div className="max-w-max-width-canvas mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">policy</span>
              <h3 className="font-headline-md text-headline-md text-on-surface text-base">Statutory Authority &amp; Entity Citations</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm text-xs text-on-surface-variant">
              <div className="p-2.5 rounded-lg bg-surface-container-low">
                <a href={seoData.citation.url} target="_blank" rel="noopener noreferrer" className="font-bold text-primary block hover:underline">{seoData.citation.name}</a>
              </div>
            </div>
          </div>
        </section>
      )}`;

// We will find the start of the Borrower Advisory section and replace until the end of the citation section.
const startIdx = content.indexOf('<section className="w-full py-space-2xl px-gutter-mobile lg:px-gutter-desktop bg-surface-container-low">\n        <div className="max-w-max-width-canvas mx-auto">\n          <div className="mb-space-xl max-w-3xl">\n            <span className="font-label-caps text-label-caps uppercase text-outline">Borrower Advisory</span>');
const endIdx = content.indexOf('</section>', content.indexOf('Statutory Authority &amp; Entity Citations')) + 10;

if (startIdx !== -1 && endIdx > startIdx) {
  content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
  fs.writeFileSync(file, content);
  console.log('Patched Bottom Sections');
} else {
  console.log('Could not find indices', startIdx, endIdx);
}
