export interface CalculatorSystemFormulaVariable {
  symbol: string;
  name: string;
  unit: string;
  description: string;
}

export interface CalculatorSystemFormula {
  equation: string;
  description: string;
  variables: CalculatorSystemFormulaVariable[];
  assumptions: string[];
}

export interface CalculatorSystemWorkedExample {
  title: string;
  scenario: string;
  inputs: Record<string, string>;
  stepByStep: string[];
  finalResult: string;
  interpretation: string;
}

export interface CalculatorSystemSourceReference {
  organization: string;
  standardName: string;
  citation: string;
  versionOrDate: string;
}

export interface CalculatorSystemData {
  id: string;
  slug: string;
  name: string;
  h1: string;
  category: string;
  categoryName: string;
  categoryPath: string;
  subcategory?: string;
  subcategoryName?: string;
  subcategoryPath?: string;
  canonicalUrl: string;
  shortAnswer: string;
  formula: CalculatorSystemFormula;
  workedExample: CalculatorSystemWorkedExample;
  howToUse: string[];
  howItIsCalculated: string[];
  whenToUse: string[];
  limitations: string[];
  sourceReference: CalculatorSystemSourceReference;
  relatedToolIds: string[];
  relatedConversionPaths: { label: string; path: string }[];
  relatedGuidePaths: { title: string; path: string }[];
  faqs: { question: string; answer: string }[];
}
