# Remove Non-Functional Regional Measurement Boxes from Live Rates

Review and remove the static, non-clickable "Standard Regional Measurement Conventions" display block from the header's live currency exchange rate feature.

---

## 1. Analysis & Review

- **Current State**:
  The `Standard Regional Measurement Conventions` section in `components/CurrencyUnitSearchCard.tsx` renders a 4-column grid of cards:
  - *Road Speed*: e.g., "Miles per hour (mph)"
  - *Distance*: e.g., "Miles (roads) & Metres"
  - *Mass & Weight*: e.g., "Kilograms (official) & Stones/Pounds (informal)"
  - *Temperature*: e.g., "Celsius (°C)"
- **Functionality Check**:
  These elements are static `<div>` containers. They do not trigger conversions, allow unit swapping, or link to calculators. Following the removal of the active converter apply row, they look like interactive buttons or options but have no functionality.
- **Decision**:
  Remove this entire static block so the live rates dropdown is cleanly dedicated to real-time currency exchange rates and verified grounding sources.

---

## 2. Proposed Changes

### `components/CurrencyUnitSearchCard.tsx`
- Remove the `Regional Unit Standards Matrix` section (the `straighten` header and the 4 static boxes for Road Speed, Distance, Mass & Weight, and Temperature).
- Retain the clean, compact summary banner, the live currency exchange rate cards (with live indicators and reverse rates), and the Google Search Grounding verified sources.
- Clean up any unused properties or imports in the component.

---

## 3. Verification Plan

1. **Linting**: Run `lint_applet` to confirm 0 errors or broken references.
2. **Server Test**: Verify that the header renders cleanly with HTTP 200 via `curl`.
3. **UI Verification**: Ensure the live rates feature displays the location header, live market currency cards, and verified sources without the non-functional measurement boxes.
