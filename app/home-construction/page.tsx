import type { Metadata } from 'next';
import CategoryHubPageClient, {
  CategoryHubConfig,
} from '@/components/CategoryHubPageClient';

export const metadata: Metadata = {
  title:
    'Home & Construction Calculators — Concrete Yards, Flooring Area, Waste & Material Cost | SolveItCalculator',
  description:
    'Free construction and home improvement calculators for concrete slabs (cubic yards & bags), cylindrical post holes, square footage, flooring waste allowance, paint coverage, and mortgage payments.',
  alternates: {
    canonical: 'https://solveitcalculator.com/home-construction',
  },
  openGraph: {
    title:
      'Home & Construction Calculators — Material Quantity, Waste & Cost Estimators | SolveItCalculator',
    description:
      'Estimate square footage, cubic yards of concrete, bag counts, flooring boxes, and material costs with step-by-step formulas and reference charts.',
    url: 'https://solveitcalculator.com/home-construction',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home & Construction Calculators — Concrete Yards, Flooring Area, Waste & Material Cost | SolveItCalculator',
    description: 'Free construction and home improvement calculators for concrete slabs (cubic yards & bags), cylindrical post holes, square footage, flooring waste allowance, paint coverage, and mortgage payments.',
  },
};

const HOME_CONSTRUCTION_CONFIG: CategoryHubConfig = {
  id: 'home-construction',
  breadcrumbLabel: 'Home & Construction',
  title: 'Home & Construction Calculators',
  shortTitle: 'Home & Construction',
  introduction:
    'Plan home renovations, building projects, and property purchases accurately. Estimate square footage, cubic yards of concrete, paint coverage, and monthly housing costs.',
  searchPlaceholder: 'Find a home or construction calculator',
  headerIconName: 'home',
  heroBadgeTopLeft: 'ft²',
  heroBadgeBottomLeft: 'yd³',
  filters: [
    'All',
    'Area & Flooring',
    'Concrete & Volume',
    'Walls & Paint',
    'Home Financing',
    'Measurements',
  ],
  tools: [
    {
      id: 'construction-project-calculator',
      name: 'Construction Project Calculator (4-Step Guided Workflow)',
      description:
        'Estimate material quantities, adjustable waste allowances, package or bag counts, and project costs for rectangular areas, concrete slabs, and cylindrical post holes.',
      href: '/construction-project-calculator',
      category: 'Concrete & Volume',
      displayBadge: '4-Step Workflow',
      iconName: 'hammer',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
      isPopular: true,
    },
    {
      id: 'flooring-project-calculator',
      name: 'Estimate Your Flooring Project (3-Step Workflow)',
      description:
        'Calculate room area, add recommended waste allowance, and estimate total flooring material and project cost step by step.',
      href: '/home-construction/flooring-calculator',
      category: 'Area & Flooring',
      displayBadge: 'Area & Flooring',
      iconName: 'layers',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'square-footage-area-calculator',
      name: 'Square Footage & Room Area Calculator',
      description:
        'Convert and calculate room area between square feet, square meters, square yards, and acres for flooring or remodeling.',
      href: '/construction-project-calculator',
      category: 'Area & Flooring',
      displayBadge: 'Area & Flooring',
      iconName: 'layers',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
      isPopular: true,
    },
    {
      id: 'concrete-volume-calculator',
      name: 'Concrete Slab & Post Hole Volume Calculator',
      description:
        'Calculate concrete slab and cylindrical post hole volumes in cubic yards, cubic feet, and cubic meters with waste allowance and bag counts.',
      href: '/construction-project-calculator',
      category: 'Concrete & Volume',
      displayBadge: 'Concrete & Volume',
      iconName: 'hammer',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
      isPopular: true,
    },
    {
      id: 'paint-wall-coverage-calculator',
      name: 'Wall Area & Paint Volume Estimator',
      description:
        'Calculate wall surface area and convert paint quantities between gallons, quarts, and liters.',
      href: '/conversions/area',
      category: 'Walls & Paint',
      displayBadge: 'Walls & Paint',
      iconName: 'paint-bucket',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
      isPopular: true,
    },
    {
      id: 'mortgage-payment-calculator',
      name: 'Mortgage Payment Calculator',
      description:
        'Estimate monthly principal, interest, property taxes, homeowners insurance, and PMI for a home purchase.',
      href: '/mortgage-calculator',
      category: 'Home Financing',
      displayBadge: 'Home Financing',
      iconName: 'home',
      iconBg: 'bg-[#FFF0EE]',
      iconColor: 'text-[#E54D37]',
      isPopular: true,
    },
    {
      id: 'home-affordability-calculator',
      name: 'Home Affordability Calculator (28/36 Rule)',
      description:
        'Calculate the maximum house price you can comfortably afford based on gross income, down payment, and monthly debts.',
      href: '/finance/home-affordability-calculator',
      category: 'Home Financing',
      displayBadge: 'Home Financing',
      iconName: 'home',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'refinance-break-even-calculator',
      name: 'Mortgage Refinance & Break-Even Calculator',
      description:
        'Compare your current mortgage against a new loan rate and closing costs to find your exact break-even month.',
      href: '/finance/refinance-calculator',
      category: 'Home Financing',
      displayBadge: 'Home Financing',
      iconName: 'trending-up',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
    },
    {
      id: 'rent-vs-buy-calculator',
      name: 'Rent vs. Buy Home Comparison Calculator',
      description:
        'Compare the long-term net cost of renting versus buying a home including appreciation, maintenance, and opportunity cost.',
      href: '/finance/rent-vs-buy-calculator',
      category: 'Home Financing',
      displayBadge: 'Home Financing',
      iconName: 'scale',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
      isPopular: true,
    },
    {
      id: 'lumber-length-dimension-converter',
      name: 'Construction Length & Dimension Converter',
      description:
        'Convert blueprint dimensions between inches, feet, yards, millimeters, centimeters, and meters.',
      href: '/conversions/length',
      category: 'Measurements',
      displayBadge: 'Measurements',
      iconName: 'ruler',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
    },
    {
      id: 'flooring-waste-percentage-calculator',
      name: 'Material Overage & Waste Percentage Calculator',
      description:
        'Add 10% to 15% cutting waste to tile, hardwood flooring, or drywall material orders.',
      href: '/math/percentage-calculator',
      category: 'Area & Flooring',
      displayBadge: 'Area & Flooring',
      iconName: 'percent',
      iconBg: 'bg-[#FFF0EE]',
      iconColor: 'text-[#E54D37]',
    },
  ],
  relatedCategories: [
    {
      name: 'Unit Conversion',
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
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
    },
    {
      name: 'Business Calculators',
      href: '/finance/business',
      iconName: 'bar-chart',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
    },
    {
      name: 'Science Calculators',
      href: '/science',
      iconName: 'flask',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
    },
    {
      name: 'Date & Time Calculators',
      href: '/date-time',
      iconName: 'calendar',
      iconBg: 'bg-[#FFF0F0]',
      iconColor: 'text-[#E11D48]',
    },
  ],
  chooseGuideHeading: 'How to choose the right home or construction calculator',
  chooseSteps: [
    {
      step: 1,
      title: 'Measure your project dimensions',
      description:
        'Record the length, width, and depth of your room, wall, or slab in feet, inches, or meters.',
    },
    {
      step: 2,
      title: 'Choose surface area or volume',
      description:
        'Use square footage for flooring and paint, or cubic volume for concrete, gravel, and mulch.',
    },
    {
      step: 3,
      title: 'Open the calculator',
      description:
        'Select the appropriate measurement or home financing calculator from the list above.',
    },
    {
      step: 4,
      title: 'Include a 10% safety buffer',
      description:
        'When ordering physical building materials like tile or flooring, add 10% extra for cuts and waste.',
    },
  ],
  faqs: [
    {
      question: 'How do I calculate square footage for a room or floor?',
      answer:
        'Multiply the room length in feet by the width in feet. For example, a room that is 12 feet wide by 15 feet long has an area of 180 square feet (12 × 15 = 180 sq ft). If your measurements are in inches, divide (Length × Width in inches) by 144.',
    },
    {
      question: 'How many cubic feet are in a cubic yard of concrete or mulch?',
      answer:
        'There are exactly 27 cubic feet in 1 cubic yard (because 3 ft × 3 ft × 3 ft = 27 ft³). Multiply Length (ft) × Width (ft) × Depth (ft) and divide by 27 to get cubic yards.',
    },
    {
      question: 'How many 80-lb or 60-lb bags of concrete do I need for 1 cubic yard?',
      answer:
        'One cubic yard (27 cubic feet) of concrete requires forty-five 80-lb bags (each yields ~0.60 ft³), sixty 60-lb bags (each yields ~0.45 ft³), or ninety 40-lb bags (each yields ~0.30 ft³).',
    },
    {
      question: 'How much wall area does one gallon of interior paint cover?',
      answer:
        'One standard US gallon of interior latex paint covers approximately 350 to 400 square feet per coat on smooth, primed drywall. Rough stucco, bare drywall, or dramatic color changes typically require two coats.',
    },
    {
      question: 'How much extra flooring or tile material should I order for waste?',
      answer:
        'For straight-lay hardwood, laminate, LVP, or square tile installations, contractors recommend adding 10% for cutting waste. For diagonal layouts, herringbone patterns, or rooms with many alcoves, add 15%.',
    },
    {
      question: 'How many 4x8 sheets of drywall or plywood do I need?',
      answer:
        'A standard 4 ft × 8 ft sheet covers 32 square feet. Divide your total wall or subfloor square footage by 32 and round up to the next whole sheet, plus 10% extra for cutouts and waste.',
    },
    {
      question: 'How do I convert linear feet to square feet for boards or siding?',
      answer:
        'Multiply the linear footage by the exposed width of the board in feet (Width in inches ÷ 12). For example, 100 linear feet of 6-inch-wide planking covers 100 × (6 ÷ 12) = 50 square feet.',
    },
    {
      question: 'How many tons is 1 cubic yard of gravel, sand, or topsoil?',
      answer:
        'One cubic yard of crushed gravel or limestone weighs approximately 1.35 to 1.5 tons (2,700–3,000 lbs), dry sand weighs about 1.35 tons, and screened topsoil weighs roughly 1.0 to 1.2 tons depending on moisture.',
    },
  ],
};

export default function HomeConstructionCategoryPage() {
  return <CategoryHubPageClient config={HOME_CONSTRUCTION_CONFIG} />;
}
