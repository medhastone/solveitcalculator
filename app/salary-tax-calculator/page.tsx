import { permanentRedirect } from 'next/navigation';

export default function SalaryTaxCalculatorRedirectPage() {
  permanentRedirect('/finance/take-home-pay-calculator');
}
