import { redirect } from 'next/navigation';

export default function GSTCalculatorIndexRedirect() {
  redirect('/tax-calculator/australia');
}
