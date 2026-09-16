import * as math from 'mathjs';
import React from 'react';

export type InputType = 'number' | 'text' | 'select';

export interface ToolInput {
  id: string;
  label: string;
  placeholder: string;
  type: InputType;
  options?: { value: string; label: string }[];
  defaultValue?: string;
}

export interface ToolConfig {
  inputs: ToolInput[];
  solve: (inputs: Record<string, string>) => React.ReactNode;
}

function parseNumber(val: string): number {
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
}

export function getToolConfig(slug: string): ToolConfig {
  switch (slug) {
    case 'quadratic-formula-solver-with-steps':
      return {
        inputs: [
          { id: 'a', label: 'Coefficient a', type: 'number', placeholder: 'e.g. 2' },
          { id: 'b', label: 'Coefficient b', type: 'number', placeholder: 'e.g. -4' },
          { id: 'c', label: 'Constant c', type: 'number', placeholder: 'e.g. -6' }
        ],
        solve: (values) => {
          const a = parseNumber(values.a);
          const b = parseNumber(values.b);
          const c = parseNumber(values.c);
          
          if (a === 0) return "Not a quadratic equation (a cannot be 0).";
          
          const delta = b * b - 4 * a * c;
          let root1, root2;
          let steps = [];
          
          steps.push(`1. Identify coefficients: a=${a}, b=${b}, c=${c}`);
          steps.push(`2. Calculate Discriminant (Δ = b² - 4ac): (${b})² - 4(${a})(${c}) = ${b*b} - ${4*a*c} = ${delta}`);
          
          if (delta > 0) {
            root1 = (-b + Math.sqrt(delta)) / (2 * a);
            root2 = (-b - Math.sqrt(delta)) / (2 * a);
            steps.push(`3. Two real roots exist since Δ > 0.`);
            steps.push(`4. x₁ = (-${b} + √${delta}) / ${2*a} = ${root1.toFixed(4)}`);
            steps.push(`5. x₂ = (-${b} - √${delta}) / ${2*a} = ${root2.toFixed(4)}`);
            return (
              <div className="space-y-4">
                <div className="font-bold text-lg text-primary">x₁ = {root1.toFixed(4)}, x₂ = {root2.toFixed(4)}</div>
                <div className="text-sm bg-surface-container p-4 rounded-md">
                  <div className="font-semibold mb-2">Steps:</div>
                  {steps.map((s, i) => <div key={i}>{s}</div>)}
                </div>
              </div>
            );
          } else if (delta === 0) {
            root1 = -b / (2 * a);
            steps.push(`3. One real root exists since Δ = 0.`);
            steps.push(`4. x = -${b} / ${2*a} = ${root1.toFixed(4)}`);
            return (
              <div className="space-y-4">
                <div className="font-bold text-lg text-primary">x = {root1.toFixed(4)}</div>
                <div className="text-sm bg-surface-container p-4 rounded-md">
                  <div className="font-semibold mb-2">Steps:</div>
                  {steps.map((s, i) => <div key={i}>{s}</div>)}
                </div>
              </div>
            );
          } else {
            const realPart = (-b / (2 * a)).toFixed(4);
            const imagPart = (Math.sqrt(-delta) / (2 * a)).toFixed(4);
            steps.push(`3. Two complex roots exist since Δ < 0.`);
            steps.push(`4. x₁ = ${realPart} + ${imagPart}i`);
            steps.push(`5. x₂ = ${realPart} - ${imagPart}i`);
            return (
              <div className="space-y-4">
                <div className="font-bold text-lg text-primary">x₁ = {realPart} + {imagPart}i, x₂ = {realPart} - {imagPart}i</div>
                <div className="text-sm bg-surface-container p-4 rounded-md">
                  <div className="font-semibold mb-2">Steps:</div>
                  {steps.map((s, i) => <div key={i}>{s}</div>)}
                </div>
              </div>
            );
          }
        }
      };

    case 'system-of-linear-equations-2x2-3x3':
      return {
        inputs: [
          { id: 'type', label: 'System Type', type: 'select', options: [{value: '2', label: '2x2'}, {value: '3', label: '3x3'}], defaultValue: '2', placeholder: '' },
          { id: 'eq1', label: 'Equation 1', type: 'text', placeholder: 'e.g. 2x + 3y = 5' },
          { id: 'eq2', label: 'Equation 2', type: 'text', placeholder: 'e.g. 4x - y = 3' },
          { id: 'eq3', label: 'Equation 3 (if 3x3)', type: 'text', placeholder: 'e.g. x + y + z = 6' },
        ],
        solve: (values) => {
          return <div>Advanced system solver requires manual coefficient entry. Future update will parse strings using mathjs.</div>;
        }
      };

    case 'pythagorean-theorem-a-b-c':
    case 'right-triangle-hypotenuse-calculator':
      return {
        inputs: [
          { id: 'a', label: 'Side a', type: 'number', placeholder: 'e.g. 3' },
          { id: 'b', label: 'Side b', type: 'number', placeholder: 'e.g. 4' }
        ],
        solve: (values) => {
          const a = parseNumber(values.a);
          const b = parseNumber(values.b);
          if (a <= 0 || b <= 0) return 'Sides must be positive numbers.';
          const c = Math.sqrt(a*a + b*b);
          return (
            <div>
              <div className="font-bold text-lg text-primary">Hypotenuse (c) = {c.toFixed(4)}</div>
              <div className="text-sm mt-2 text-on-surface-variant">Using a² + b² = c² -\&#62; {a}² + {b}² = c² -\&#62; {a*a} + {b*b} = {a*a + b*b} -\&#62; c = √{a*a + b*b}</div>
            </div>
          );
        }
      };

    case 'circle-sector-segment-calculator':
      return {
        inputs: [
          { id: 'r', label: 'Radius (r)', type: 'number', placeholder: 'e.g. 5' },
          { id: 'angle', label: 'Central Angle (degrees)', type: 'number', placeholder: 'e.g. 90' }
        ],
        solve: (values) => {
          const r = parseNumber(values.r);
          const deg = parseNumber(values.angle);
          if (r <= 0) return 'Radius must be greater than 0';
          if (deg <= 0 || deg > 360) return 'Angle must be between 0 and 360';
          
          const area = Math.PI * r * r;
          const circumference = 2 * Math.PI * r;
          const sectorArea = (deg / 360) * area;
          const arcLength = (deg / 360) * circumference;
          
          return (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface p-3 rounded shadow-sm border border-outline-variant/30">Total Area: <span className="font-bold">{area.toFixed(4)}</span></div>
              <div className="bg-surface p-3 rounded shadow-sm border border-outline-variant/30">Circumference: <span className="font-bold">{circumference.toFixed(4)}</span></div>
              <div className="bg-surface p-3 rounded shadow-sm border border-outline-variant/30">Sector Area: <span className="font-bold">{sectorArea.toFixed(4)}</span></div>
              <div className="bg-surface p-3 rounded shadow-sm border border-outline-variant/30">Arc Length: <span className="font-bold">{arcLength.toFixed(4)}</span></div>
            </div>
          );
        }
      }

    case '2d-area-perimeter-polygons-ellipses':
      return {
        inputs: [
          { id: 'shape', label: 'Shape', type: 'select', options: [
            {value: 'rectangle', label: 'Rectangle (Needs w, h)'},
            {value: 'triangle', label: 'Triangle (Needs b, h)'},
            {value: 'ellipse', label: 'Ellipse (Needs a, b)'}
          ], defaultValue: 'rectangle', placeholder: '' },
          { id: 'val1', label: 'Value 1 (Width/Base/Axis a)', type: 'number', placeholder: 'e.g. 10' },
          { id: 'val2', label: 'Value 2 (Height/Axis b)', type: 'number', placeholder: 'e.g. 5' }
        ],
        solve: (values) => {
          const v1 = parseNumber(values.val1);
          const v2 = parseNumber(values.val2);
          if (v1 <= 0 || v2 <= 0) return 'Values must be greater than 0';
          
          let area = 0;
          let perimeter = 0;
          if (values.shape === 'rectangle') {
            area = v1 * v2;
            perimeter = 2 * (v1 + v2);
          } else if (values.shape === 'triangle') {
            area = 0.5 * v1 * v2;
            perimeter = 0; // Requires 3 sides
          } else if (values.shape === 'ellipse') {
            area = Math.PI * v1 * v2;
            // Ramanujan approximation
            perimeter = Math.PI * (3*(v1+v2) - Math.sqrt((3*v1 + v2)*(v1 + 3*v2)));
          }
          
          return (
            <div>
              <div className="font-bold text-lg text-primary">Area: {area.toFixed(4)}</div>
              {perimeter > 0 && <div className="font-bold text-lg text-primary">Perimeter (approx): {perimeter.toFixed(4)}</div>}
            </div>
          );
        }
      }

    case 'logarithm-natural-log-ln-calculator':
      return {
        inputs: [
          { id: 'base', label: 'Base (Leave empty for e)', type: 'number', placeholder: 'e.g. 10' },
          { id: 'val', label: 'Value', type: 'number', placeholder: 'e.g. 100' }
        ],
        solve: (values) => {
          const val = parseNumber(values.val);
          if (val <= 0) return 'Logarithm undefined for values <= 0';
          
          let res;
          let formula;
          if (!values.base) {
            res = Math.log(val);
            formula = `ln(${val}) = ${res.toFixed(6)}`;
          } else {
            const base = parseNumber(values.base);
            if (base <= 0 || base === 1) return 'Base must be > 0 and not 1';
            res = Math.log(val) / Math.log(base);
            formula = `log__{${base}}(${val}) = ${res.toFixed(6)}`;
          }
          return <div className="font-bold text-lg text-primary">{formula}</div>;
        }
      }

    // Fallback: Generic Math Evaluator
    default:
      return {
        inputs: [
          { id: 'expr', label: 'Mathematical Expression', type: 'text', placeholder: 'e.g. 2 * sin(45 deg) ^ 2 + 5' }
        ],
        solve: (values) => {
          if (!values.expr) return 'Please enter an expression.';
          try {
            const result = math.evaluate(values.expr);
            const formatted = math.format(result, { precision: 14 });
            return (
              <div className="space-y-2">
                <div className="font-bold text-xl text-primary">{formatted}</div>
                <div className="text-sm text-on-surface-variant font-data-mono">math.evaluate("{values.expr}")</div>
              </div>
            );
          } catch (err: any) {
            return (
              <div className="text-error font-semibold">
                Invalid math expression: {err.message}
              </div>
            );
          }
        }
      };
  }
}
