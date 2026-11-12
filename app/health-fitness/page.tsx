import type { Metadata } from 'next';
import CategoryHubPageClient, {
  CategoryHubConfig,
} from '@/components/CategoryHubPageClient';

export const metadata: Metadata = {
  title: 'Health & Fitness Calculators: BMI, TDEE, BMR | SolveIt',
  description:
    'Calculate Body Mass Index (BMI), Total Daily Energy Expenditure (TDEE), Basal Metabolic Rate (BMR), U.S. Navy Body Fat Percentage, and Ideal Body Weight.',
  alternates: {
    canonical: 'https://solveitcalculator.com/health-fitness',
  },
  openGraph: {
    title: 'Health & Fitness Calculators: BMI, TDEE, BMR | SolveIt',
    description:
      'Calculate BMI, daily calorie needs (TDEE), resting BMR, body fat percentage, and ideal weight in Metric or US Imperial units.',
    url: 'https://solveitcalculator.com/health-fitness',
    type: 'website',
  },
};

const HEALTH_FITNESS_CONFIG: CategoryHubConfig = {
  id: 'health-fitness',
  breadcrumbLabel: 'Health & Fitness',
  title: 'Health & Fitness Calculators',
  shortTitle: 'Health & Fitness',
  introduction:
    'Select the body-composition or metabolic calculator that matches your goal—check whether your weight falls within the WHO adult BMI range, find your resting BMR and daily TDEE calorie target for fat loss or muscle gain, or measure body fat percentage with a tape measure.',
  searchPlaceholder:
    'Find a health calculator (e.g. BMI, TDEE calories, BMR, body fat %, ideal weight...)',
  headerIconName: 'heart',
  heroBadgeTopLeft: 'BMI',
  heroBadgeBottomLeft: 'kcal',
  filters: [
    'All',
    'Body Composition',
    'Calories & Metabolism',
  ],
  tools: [
    {
      id: 'bmi-calculator',
      name: 'BMI Calculator (Body Mass Index)',
      description:
        'Calculate your adult Body Mass Index (kg/m²) and WHO weight category in Metric or US Imperial units.',
      href: '/bmi-calculator',
      category: 'Body Composition',
      displayBadge: 'WHO BMI Standard',
      iconName: 'heart',
      symbolText: 'BMI',
      iconBg: 'bg-[#FFF0EE]',
      iconColor: 'text-[#E11D48]',
      isPopular: true,
    },
    {
      id: 'body-fat-calculator',
      name: 'Body Fat Percentage Calculator (U.S. Navy Method)',
      description:
        'Estimate body fat percentage, fat mass, and lean body mass from waist, neck, and hip measurements.',
      href: '/body-fat-calculator',
      category: 'Body Composition',
      displayBadge: 'Lean vs. Fat Mass',
      iconName: 'activity',
      symbolText: 'BF%',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
      isPopular: true,
    },
    {
      id: 'ideal-weight-calculator',
      name: 'Ideal Body Weight Calculator (Devine, Robinson, Miller & WHO)',
      description:
        'Compare your healthy target weight range across four clinical height-and-sex formulas.',
      href: '/ideal-weight-calculator',
      category: 'Body Composition',
      displayBadge: 'Target Weight',
      iconName: 'scale',
      symbolText: 'IBW',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'tdee-calculator',
      name: 'TDEE & Daily Calorie Calculator',
      description:
        'Estimate Total Daily Energy Expenditure (TDEE) and daily calorie targets for maintenance, weight loss, or muscle gain.',
      href: '/tdee-calculator',
      category: 'Calories & Metabolism',
      displayBadge: 'Daily Calories',
      iconName: 'flame',
      symbolText: 'kcal',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
      isPopular: true,
    },
    {
      id: 'bmr-calculator',
      name: 'BMR Calculator (Basal Metabolic Rate)',
      description:
        'Calculate resting daily calorie burn using the Mifflin-St Jeor and Revised Harris-Benedict equations.',
      href: '/bmr-calculator',
      category: 'Calories & Metabolism',
      displayBadge: 'Resting Burn',
      iconName: 'activity',
      symbolText: 'BMR',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
      isPopular: true,
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
      name: 'Date & Time Calculators',
      href: '/date-time',
      iconName: 'calendar',
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
  chooseGuideHeading: 'Which health or calorie calculator should I use?',
  chooseSteps: [
    {
      step: 1,
      title: 'BMI Calculator vs. Body Fat Percentage Calculator',
      description:
        'Use the BMI Calculator for a quick height-to-weight screening against WHO adult thresholds (18.5–24.9). If you lift weights or carry above-average muscle mass, use the U.S. Navy Body Fat Percentage Calculator instead—it uses neck, waist, and hip tape measurements to separate lean muscle from fat.',
    },
    {
      step: 2,
      title: 'BMR Calculator vs. TDEE Daily Calorie Calculator',
      description:
        'Use the BMR Calculator to see the minimum calories your body burns at complete rest. Use the TDEE Calculator when planning your diet—it multiplies your BMR by your weekly exercise level (1.2x to 1.9x) to show how many calories you actually burn in a full day.',
    },
    {
      step: 3,
      title: 'Ideal Weight Calculator vs. BMI Healthy Range',
      description:
        'Use the Ideal Weight Calculator when you want to compare clinical target weights side-by-side (Devine, Robinson, and Miller equations) alongside the broader WHO BMI 18.5–24.9 weight window.',
    },
  ],
  matchingGuides: [
    {
      title: 'How to Calculate BMI and Daily Calorie Needs (TDEE)',
      description:
        'Step-by-step worked examples for the WHO BMI equation, Mifflin-St Jeor BMR formula, and activity multipliers.',
      href: '/guides/how-to-calculate-bmi-and-daily-calories',
    },
    {
      title: 'How to Convert Metric and Imperial Units Accurately',
      description:
        'Convert body weight between kilograms and pounds and height between centimeters and feet/inches.',
      href: '/guides/how-to-convert-metric-and-imperial-units',
    },
  ],
  faqs: [
    {
      question: 'How is Body Mass Index (BMI) calculated in Metric and Imperial units?',
      answer:
        'In metric units, divide your weight in kilograms by your height in meters squared: BMI = kg ÷ m². In US imperial units, multiply your weight in pounds by 703 and divide by your height in inches squared: BMI = 703 × lbs ÷ in².',
    },
    {
      question: 'What is a healthy adult BMI range according to the WHO?',
      answer:
        'For adults aged 20 and older, the World Health Organization classifies BMI below 18.5 as Underweight, 18.5 to 24.9 as Normal healthy weight, 25.0 to 29.9 as Overweight, and 30.0 or higher as Obesity.',
    },
    {
      question: 'What is the difference between BMR and TDEE?',
      answer:
        'Basal Metabolic Rate (BMR) is the energy your body expends at complete rest just to maintain vital organs. Total Daily Energy Expenditure (TDEE) equals your BMR multiplied by your physical activity factor (1.2 for sedentary up to 1.9 for athletes).',
    },
    {
      question: 'How big of a calorie deficit should I use to lose 1 pound per week?',
      answer:
        'One pound of body fat stores roughly 3,500 kilocalories. Eating 500 kcal per day below your maintenance TDEE creates a 3,500 kcal weekly deficit for approximately 1 lb (0.45 kg) of weight loss per week.',
    },
    {
      question: 'Why is the Mifflin-St Jeor equation preferred for BMR?',
      answer:
        'The Academy of Nutrition and Dietetics recommends the Mifflin-St Jeor equation (10×kg + 6.25×cm − 5×Age + 5 for men or −161 for women) because clinical studies show it estimates resting energy expenditure within 10% of measured calorimetry more consistently than older formulas.',
    },
  ],
};

export default function HealthFitnessCategoryPage() {
  return <CategoryHubPageClient config={HEALTH_FITNESS_CONFIG} />;
}
