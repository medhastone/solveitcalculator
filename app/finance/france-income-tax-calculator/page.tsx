import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import CountryTaxTemplateClient from '@/components/calculator/CountryTaxTemplateClient';

export const metadata: Metadata = {
  title: 'France Income Tax Calculator (2025 DGFiP Barème & Cotisations Sociales) | SolveItCalculator',
  description:
    'Calculate 2025 French net salary after Cotisations Sociales (~22%), the 10% Abattement pour frais professionnels, Quotient Familial splitting, and DGFiP progressive Impôt sur le Revenu brackets.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/france-income-tax-calculator',
  },
  openGraph: {
    title: 'France Income Tax Calculator (2025 DGFiP Barème & Cotisations Sociales) | SolveItCalculator',
    description: 'Calculate 2025 French net salary after Cotisations Sociales (~22%), the 10% Abattement pour frais professionnels, Quotient Familial splitting, and DGFiP progressive Impôt sur le Revenu brackets.',
    url: 'https://solveitcalculator.com/finance/france-income-tax-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'France Income Tax Calculator (2025 DGFiP Barème & Cotisations Sociales) | SolveItCalculator',
    description: 'Calculate 2025 French net salary after Cotisations Sociales (~22%), the 10% Abattement pour frais professionnels, Quotient Familial splitting, and DGFiP progressive Impôt sur le Revenu brackets.',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'france-income-tax-calculator',
  slug: 'france-income-tax-calculator',
  name: 'France Income Tax Calculator',
  h1: 'France Income Tax & Net Salary Calculator (2025 DGFiP Barème)',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'taxes',
  subcategoryName: 'Taxes & Statutory Withholdings',
  subcategoryPath: '/finance',
  canonicalUrl: 'https://solveitcalculator.com/finance/france-income-tax-calculator',
  shortAnswer:
    'Calculate your 2025 French net salary after employee social contributions (Cotisations Sociales, CSG/CRDS), the 10% professional expense deduction, Quotient Familial parts, and DGFiP progressive income tax bands (0%, 11%, 30%, 41%, 45%).',
  formula: {
    equation: 'Net = Gross − Cotisations(22%) − Parts × Barème((Gross − Cotisations) × 0.90 / Parts)',
    description:
      'Subtracts employee social security contributions (~22%), applies the 10% statutory deduction for professional expenses, divides by Quotient Familial parts, and applies the 2025 DGFiP progressive schedule.',
    variables: [
      { symbol: 'Cotisations', name: 'Employee Social Contributions', unit: '~22% of Gross', description: 'CSG, CRDS, state pension, and AGIRC-ARRCO supplementary pension.' },
      { symbol: 'Barème', name: 'DGFiP Progressive Tax Schedule', unit: '0% / 11% / 30% / 41% / 45%', description: '0% up to €11,497 per part; 11% to €29,315; 30% to €83,823; 41% to €180,294; 45% above.' },
    ],
    assumptions: ['Models standard private-sector Cadre/Non-Cadre employee social contribution averages.'],
  },
  workedExample: {
    title: '€75,000 Gross Salary in France (Single, 1 Part)',
    scenario: 'Single professional in Paris earning €75,000 gross salary in 2025.',
    inputs: { 'Gross Salary': '€75,000', 'Quotient Familial': '1 Part (Single)' },
    stepByStep: [
      'Cotisations Sociales (22%) = €16,500 -> Net Imposable = €58,500.',
      'Less 10% Abattement (€5,850) = €52,650 Revenu Net Imposable.',
      'DGFiP Income Tax = €8,961 -> Annual Net Pay After Tax = €49,539 (€4,128/month).',
    ],
    finalResult: '€49,539/year Net After Prélèvement à la Source (€4,128/month)',
    interpretation: 'The Quotient Familial system substantially lowers the marginal rate for married couples (2 parts).',
  },
  howToUse: ['Enter your annual gross salary in Euros (€).', 'Choose Single (1 part) or Married Joint (2 parts).', 'Review your net salary, effective rate, and official impots.gouv.fr deadlines.'],
  howItIsCalculated: ['Applies verified 2025 DGFiP Barème de l’impôt sur le revenu and employee social contribution deductions.'],
  whenToUse: ['When comparing French gross-to-net salary offers (Salaire Brut vs Net Après Impôt).'],
  limitations: ['High-earner CEHR surtax (3%–4% above €250,000) and municipal property taxes are excluded.'],
  sourceReference: {
    organization: 'Direction générale des Finances publiques (DGFiP — impots.gouv.fr)',
    standardName: 'Loi de finances pour 2025 — Barème de l’impôt sur le revenu',
    citation: 'https://www.impots.gouv.fr/particulier/les-taux-limpot-sur-le-revenu',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['uk-paye-calculator', 'us-federal-income-tax-calculator', 'salary-to-hourly-calculator'],
  relatedConversionPaths: [
    { label: 'Germany Income Tax Calculator', path: '/finance/germany-income-tax-calculator' },
    { label: 'UAE Income Tax Calculator', path: '/finance/uae-income-tax-calculator' },
    { label: 'Singapore Income Tax Calculator', path: '/finance/singapore-income-tax-calculator' },
  ],
  relatedGuidePaths: [{ title: 'UK PAYE Calculator', path: '/finance/uk-paye-calculator' }],
  faqs: [
    {
      question: 'What is the difference between Salaire Net Imposable and Salaire Net Après Impôt in France?',
      answer: 'Salaire Net Imposable is your pay after social security contributions (~22%) before income tax. Salaire Net Après Impôt is your final take-home pay after Prélèvement à la Source (income tax withholding) is deducted.',
    },
  ],
};

export default function FranceTaxPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA} currencySymbol="€">
      <CountryTaxTemplateClient initialCountry="france" />
    </CalculatorPageSystem>
  );
}
