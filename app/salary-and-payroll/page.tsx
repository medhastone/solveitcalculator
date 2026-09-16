import { Metadata } from 'next';
import SalaryAndPayrollClient from './SalaryAndPayrollClient';

export const metadata: Metadata = {
  title: 'Salary, Wages & Payroll Calculators – Free Paycheck, Hourly & Take-Home Pay Tools',
  description: '26+ precision financial workbenches for calculating take-home pay, hourly conversions, gross-to-net payroll, overtime multipliers, and employer hiring burdens across US, UK, CA, AU, and IN jurisdictions.',
};

export default function SalaryAndPayrollPage() {
  return <SalaryAndPayrollClient />;
}
