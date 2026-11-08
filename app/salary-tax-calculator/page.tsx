import SalaryTaxCalculator from '@/components/calculators/SalaryTaxCalculator';

export const metadata = {
  title: 'Salary & Net Paycheck Calculator - Federal, FICA, & State Taxes',
  description: 'Calculate take-home pay after federal tax brackets, FICA taxes, and deductions.',
};

export default function SalaryTaxPage() {
  return <SalaryTaxCalculator />;
}
