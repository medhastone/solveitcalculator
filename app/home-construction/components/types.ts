export type UnitSystem = 'us' | 'metric' | 'imperial';

export interface ProjectAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  desc: string;
  defaultTool: string;
  keyMaterials: string[];
  typicalWaste: string;
}

export interface SubCategory {
  title: string;
  description: string;
  tools: {
    name: string;
    description: string;
    targetCalculator: string;
    badge?: string;
  }[];
}

export interface CategoryGroup {
  id: string;
  title: string;
  icon: string;
  desc: string;
  subcategories: SubCategory[];
  relatedTools: { name: string; href: string }[];
}

export type PopularCalcId =
  | 'concrete'
  | 'roofing'
  | 'flooring'
  | 'paint'
  | 'drywall'
  | 'lumber'
  | 'deck'
  | 'fence'
  | 'gravel'
  | 'mulch';
