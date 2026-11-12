import type { Metadata } from 'next';
import CategoryHubPageClient, {
  CategoryHubConfig,
} from '@/components/CategoryHubPageClient';

export const metadata: Metadata = {
  title: 'Home & Construction Calculators: Concrete, Area | SolveIt',
  description:
    'Estimate concrete cubic yards and pre-mixed bags, room square footage, flooring boxes with waste allowance, mortgage payments, and home affordability.',
  alternates: {
    canonical: 'https://solveitcalculator.com/home-construction',
  },
  openGraph: {
    title: 'Home & Construction Calculators: Concrete, Area | SolveIt',
    description:
      'Estimate concrete slabs, room flooring materials with cut waste, and home financing costs.',
    url: 'https://solveitcalculator.com/home-construction',
    type: 'website',
  },
};

const HOME_CONSTRUCTION_CONFIG: CategoryHubConfig = {
  id: 'home-construction',
  breadcrumbLabel: 'Home & Construction',
  title: 'Home & Construction Calculators',
  shortTitle: 'Home & Construction',
  introduction:
    'Choose the right estimator for your renovation or home purchase—calculate cubic yards and 80-lb bag counts for concrete pours, measure room square footage and flooring cartons with a 10% waste buffer, or compare monthly mortgage payments, refinancing, and rent-vs-buy costs.',
  searchPlaceholder:
    'Find a home or construction calculator (e.g. concrete, flooring, mortgage, refinance...)',
  headerIconName: 'home',
  heroBadgeTopLeft: 'yd³',
  heroBadgeBottomLeft: 'ft²',
  filters: [
    'All',
    'Building Materials',
    'Home Financing',
  ],
  tools: [
    {
      id: 'construction-project-calculator',
      name: 'Concrete, Slab Volume & Material Cost Calculator (Cubic Yards & Bags)',
      description:
        'Calculate cubic yards (yd³), cubic feet, and 80 lb / 60 lb pre-mixed concrete bags for slabs, footings, and post holes.',
      href: '/construction-project-calculator',
      category: 'Building Materials',
      displayBadge: 'Concrete & Slabs',
      iconName: 'hammer',
      symbolText: 'yd³',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'flooring-calculator',
      name: 'Flooring, Tile & Room Square Footage Calculator',
      description:
        'Calculate net room area (sq ft & m²), add 5%–15% cut waste allowance, and estimate flooring boxes and project cost.',
      href: '/home-construction/flooring-calculator',
      category: 'Building Materials',
      displayBadge: 'Flooring & Area',
      iconName: 'layers',
      symbolText: 'ft²',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
      isPopular: true,
    },
    {
      id: 'mortgage-calculator',
      name: 'Mortgage Payment Calculator (PITI, Taxes, Insurance & PMI)',
      description:
        'Estimate monthly principal, interest, property tax, homeowners insurance, HOA fees, and amortization schedule.',
      href: '/mortgage-calculator',
      category: 'Home Financing',
      displayBadge: 'Mortgage PITI',
      iconName: 'home',
      symbolText: 'PITI',
      iconBg: 'bg-[#FFF0EE]',
      iconColor: 'text-[#E11D48]',
      isPopular: true,
    },
    {
      id: 'home-affordability-calculator',
      name: 'Home Affordability Calculator (28/36 Debt-to-Income Rule)',
      description:
        'Determine the maximum house purchase price and loan size you can afford based on income, down payment, and monthly debts.',
      href: '/finance/home-affordability-calculator',
      category: 'Home Financing',
      displayBadge: '28/36 Rule',
      iconName: 'landmark',
      symbolText: '28/36',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
      isPopular: true,
    },
    {
      id: 'refinance-calculator',
      name: 'Mortgage Refinance & Break-Even Calculator',
      description:
        'Compare your existing mortgage against a new interest rate and closing costs to find your exact break-even month.',
      href: '/finance/refinance-calculator',
      category: 'Home Financing',
      displayBadge: 'Refinance',
      iconName: 'trending-up',
      symbolText: 'Refi',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
    },
    {
      id: 'rent-vs-buy-calculator',
      name: 'Rent vs. Buy Home Comparison Calculator',
      description:
        'Compare the net cost and equity build of buying a house versus renting over 5 to 30 years.',
      href: '/finance/rent-vs-buy-calculator',
      category: 'Home Financing',
      displayBadge: 'Rent vs. Buy',
      iconName: 'scale',
      symbolText: 'R↔B',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
    },
    {
      id: 'roofing-pitch-shingle-calculator',
      name: 'Roofing Squares, Pitch & Shingle Bundle Calculator',
      description:
        'Estimate roof surface area adjusted for pitch multiplier, roofing squares (100 sq ft), and shingle bundles.',
      href: '',
      category: 'Building Materials',
      displayBadge: 'Roofing',
      iconName: 'home',
      symbolText: 'Roof',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      isComingSoon: true,
    },
    {
      id: 'drywall-paint-gallon-estimator',
      name: 'Paint Gallon & Drywall Sheet Coverage Estimator',
      description:
        'Calculate wall surface area minus doors and windows, primer/paint gallons at 350 sq ft/gal, and 4×8 drywall sheets.',
      href: '',
      category: 'Building Materials',
      displayBadge: 'Paint & Walls',
      iconName: 'paint-bucket',
      symbolText: 'Gal',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      isComingSoon: true,
    },
  ],
  relatedCategories: [
    {
      name: 'Unit Conversion Calculators',
      href: '/conversions',
      iconName: 'arrow-left-right',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
    },
    {
      name: 'Finance Calculators',
      href: '/finance',
      iconName: 'coins',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
    },
    {
      name: 'Math Calculators',
      href: '/math',
      iconName: 'calculator',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
    },
    {
      name: 'Science Calculators',
      href: '/science',
      iconName: 'flask',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
    },
  ],
  chooseGuideHeading: 'Which home or construction calculator should I use?',
  chooseSteps: [
    {
      step: 1,
      title: 'Concrete & Slab Calculator vs. Flooring & Room Area Calculator',
      description:
        'Use the Concrete Project Calculator for 3D pours measured by length, width, and thickness in inches (converting cubic feet to cubic yards and 80-lb bags). Use the Flooring Calculator for 2D floor surfaces measured in square feet or square meters with carton rounding.',
    },
    {
      step: 2,
      title: 'Home Affordability Calculator vs. Mortgage Payment Calculator',
      description:
        'Start with the Home Affordability Calculator if you are still shopping and want to know your maximum budget under the 28/36 debt-to-income rule. Switch to the Mortgage Payment Calculator once you have a specific home price and want the full monthly PITI breakdown.',
    },
    {
      step: 3,
      title: 'Refinance Calculator vs. Rent vs. Buy Calculator',
      description:
        'Use the Refinance Calculator if you already own a home and want to check how many months it takes for a lower interest rate to pay back closing costs. Use Rent vs. Buy if you are deciding whether to sign another lease or purchase a property.',
    },
  ],
  matchingGuides: [
    {
      title: 'How to Measure Room Area, Flooring, and Paint Coverage',
      description:
        'Step-by-step instructions for measuring rectangular and L-shaped rooms, adding 10% cut waste, and converting to cubic yards.',
      href: '/guides/how-to-measure-room-area-and-flooring',
    },
    {
      title: 'How to Calculate Monthly Loan and Mortgage Payments',
      description:
        'Understand the standard amortization formula, PITI components, and how extra principal payments shorten your loan.',
      href: '/guides/how-to-calculate-loan-and-mortgage-payments',
    },
  ],
  faqs: [
    {
      question: 'How do I calculate cubic yards of concrete for a slab?',
      answer:
        'Multiply Length (feet) × Width (feet) × Thickness (in feet, i.e. inches ÷ 12) to get cubic feet, then divide by 27 to convert into cubic yards. For example, a 10 ft × 12 ft slab that is 4 inches (0.333 ft) thick equals 40 ft³ ÷ 27 = 1.48 cubic yards.',
    },
    {
      question: 'How many 80 lb or 60 lb bags of concrete equal 1 cubic yard?',
      answer:
        'One cubic yard (27 cubic feet) of concrete requires approximately forty-five 80-pound bags (each yielding ~0.60 ft³) or sixty 60-pound bags (each yielding ~0.45 ft³). Always add 5% to 10% extra for subgrade unevenness and spillage.',
    },
    {
      question: 'How much extra flooring should I add for waste and cuts?',
      answer:
        'Add 7% to 10% extra square footage for straight-lay hardwood, laminate, or LVP planks in rectangular rooms. Increase the waste factor to 12%–15% for diagonal installations, herringbone patterns, or rooms with many closets and angles.',
    },
    {
      question: 'How do I measure the square footage of an L-shaped room?',
      answer:
        'Split the L-shaped room into two separate rectangles (Section A and Section B). Multiply Length × Width for each rectangle individually, then add the two areas together before applying your waste percentage.',
    },
    {
      question: 'What is the 28/36 rule for home affordability?',
      answer:
        'Most conventional mortgage lenders require your total monthly housing payment (principal, interest, taxes, insurance, and HOA) to stay at or below 28% of your gross monthly income, and your total debt payments (housing + auto + student loans + credit cards) to stay at or below 36%.',
    },
  ],
};

export default function HomeConstructionCategoryPage() {
  return <CategoryHubPageClient config={HOME_CONSTRUCTION_CONFIG} />;
}
