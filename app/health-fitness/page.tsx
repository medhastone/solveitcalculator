import type { Metadata } from 'next';
import CategoryHubPageClient, {
  CategoryHubConfig,
} from '@/components/CategoryHubPageClient';

export const metadata: Metadata = {
  title:
    'Health & Fitness Calculators — BMI, BMR, TDEE Daily Calories & Ideal Weight | SolveItCalculator',
  description:
    'Free health and fitness calculators using WHO BMI standards and Mifflin-St Jeor BMR/TDEE equations. Estimate daily calorie needs, healthy weight ranges, and target heart rate zones.',
  alternates: {
    canonical: 'https://solveitcalculator.com/health-fitness',
  },
  openGraph: {
    title:
      'Health & Fitness Calculators — BMI, Calorie (TDEE) & BMR Estimators | SolveItCalculator',
    description:
      'Calculate Body Mass Index (BMI), Basal Metabolic Rate (BMR), and Total Daily Energy Expenditure (TDEE) with clinical formula explanations.',
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
    'Check your Body Mass Index (BMI), estimate daily calorie needs (TDEE), review Basal Metabolic Rate (BMR), and explore healthy weight ranges using standard clinical formulas.',
  searchPlaceholder: 'Find a health or fitness calculator',
  headerIconName: 'heart',
  heroBadgeTopLeft: 'BMI',
  heroBadgeBottomLeft: 'kcal',
  filters: [
    'All',
    'Body Mass & Weight',
    'Calories & Nutrition',
    'Fitness & Pace',
    'Age & Wellness',
  ],
  tools: [
    {
      id: 'bmi-calculator',
      name: 'BMI Calculator (Body Mass Index)',
      description:
        'Calculate your Body Mass Index using metric or imperial height and weight and view WHO adult health categories.',
      href: '/bmi-calculator',
      category: 'Body Mass & Weight',
      displayBadge: 'Body Mass',
      iconName: 'heart',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'daily-calorie-tdee-calculator',
      name: 'Daily Calorie & TDEE Calculator',
      description:
        'Estimate your Total Daily Energy Expenditure (TDEE) based on activity level to maintain, lose, or gain weight.',
      href: '/bmi-calculator?mode=tdee',
      category: 'Calories & Nutrition',
      displayBadge: 'Calories',
      iconName: 'flame',
      iconBg: 'bg-[#FFF0EE]',
      iconColor: 'text-[#E54D37]',
      isPopular: true,
    },
    {
      id: 'bmr-calculator',
      name: 'Basal Metabolic Rate (BMR) Calculator',
      description:
        'Compute your resting calorie burn using the Mifflin-St Jeor equation in both metric and US units.',
      href: '/bmi-calculator?mode=bmr',
      category: 'Calories & Nutrition',
      displayBadge: 'Metabolism',
      iconName: 'activity',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
      isPopular: true,
    },
    {
      id: 'healthy-weight-range-calculator',
      name: 'Ideal & Healthy Weight Range Calculator',
      description:
        'See the recommended healthy weight range (BMI 18.5 to 24.9) for your exact height in pounds or kilograms.',
      href: '/bmi-calculator?mode=ideal-weight',
      category: 'Body Mass & Weight',
      displayBadge: 'Body Mass',
      iconName: 'scale',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
      isPopular: true,
    },
    {
      id: 'body-fat-navy-calculator',
      name: 'Body Fat Percentage Calculator (U.S. Navy Method)',
      description:
        'Estimate your body fat percentage, fat mass, and lean body mass from waist, neck, and height measurements.',
      href: '/bmi-calculator?mode=body-fat',
      category: 'Body Mass & Weight',
      displayBadge: 'Composition',
      iconName: 'heart',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'weight-change-percentage-calculator',
      name: 'Weight Loss & Body Change Percentage Calculator',
      description:
        'Calculate the exact percentage of body weight lost or gained between your starting weight and current weight.',
      href: '/math/percentage-change-calculator',
      category: 'Body Mass & Weight',
      displayBadge: 'Progress',
      iconName: 'percent',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
      isPopular: true,
    },
    {
      id: 'chronological-age-calculator',
      name: 'Exact Chronological Age Calculator',
      description:
        'Determine your exact age in years, months, weeks, and days for fitness benchmarks and health screenings.',
      href: '/age-calculator',
      category: 'Age & Wellness',
      displayBadge: 'Age & Wellness',
      iconName: 'calendar',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'workout-duration-pace-timer',
      name: 'Workout & Interval Time Duration Calculator',
      description:
        'Calculate total training session duration in hours, minutes, and seconds between start and finish times.',
      href: '/time-duration-calculator',
      category: 'Fitness & Pace',
      displayBadge: 'Fitness & Pace',
      iconName: 'clock',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
    },
    {
      id: 'body-weight-unit-converter',
      name: 'Body Weight & Height Unit Converter (kg/lb & cm/ft)',
      description:
        'Convert body weight between kilograms, pounds, and stones, or height between feet/inches and centimeters.',
      href: '/unit-converter?category=weight',
      category: 'Fitness & Pace',
      displayBadge: 'Measurements',
      iconName: 'arrow-left-right',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
    },
  ],
  relatedCategories: [
    {
      name: 'Unit Conversion',
      href: '/unit-conversion',
      iconName: 'arrow-left-right',
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
    {
      name: 'Science Calculators',
      href: '/science',
      iconName: 'flask',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
    },
    {
      name: 'Math Calculators',
      href: '/math',
      iconName: 'calculator',
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
      name: 'Home & Construction',
      href: '/home-construction',
      iconName: 'home',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
    },
  ],
  chooseGuideHeading: 'How to choose the right health or fitness calculator',
  chooseSteps: [
    {
      step: 1,
      title: 'Select your health metric',
      description:
        'Choose whether you want to check weight-to-height ratio (BMI) or daily energy needs (BMR and TDEE).',
    },
    {
      step: 2,
      title: 'Choose metric or imperial units',
      description:
        'Enter your height in feet/inches or centimeters and weight in pounds or kilograms.',
    },
    {
      step: 3,
      title: 'Open the calculator',
      description:
        'Select the appropriate calculator from the directory list above.',
    },
    {
      step: 4,
      title: 'Review reference ranges',
      description:
        'Compare your result with standard World Health Organization (WHO) reference ranges and formulas.',
    },
  ],
  faqs: [
    {
      question: 'How is Body Mass Index (BMI) calculated?',
      answer:
        'In metric units, BMI equals your weight in kilograms divided by the square of your height in meters (kg/m²). In US units, BMI equals 703 × weight (lbs) ÷ [height (in)]². For example, 160 lbs at 5 ft 8 in (68 in) gives 703 × 160 ÷ 4,624 = 24.3.',
    },
    {
      question: 'What is considered a normal adult BMI range?',
      answer:
        'According to the World Health Organization (WHO), a standard healthy adult BMI falls between 18.5 and 24.9. Values below 18.5 are classified as underweight, 25.0–29.9 as overweight, and 30.0 or above as obesity.',
    },
    {
      question: 'What is the difference between BMR and TDEE?',
      answer:
        'Basal Metabolic Rate (BMR) is the number of calories your body needs at complete rest to maintain vital functions. Total Daily Energy Expenditure (TDEE) multiplies your BMR by an activity multiplier (1.2 to 1.9) to estimate total calories burned in a full day.',
    },
    {
      question: 'How does the Mifflin-St Jeor equation calculate daily calorie needs?',
      answer:
        'Mifflin-St Jeor calculates resting BMR as (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years), plus 5 for men or minus 161 for women. That BMR is then multiplied by your physical activity level to find maintenance calories.',
    },
    {
      question: 'How many calories should I eat per day to lose 1 pound per week?',
      answer:
        'One pound of body fat stores roughly 3,500 kilocalories of energy. Eating 500 calories below your maintenance TDEE each day (a 3,500-calorie weekly deficit) produces approximately 1 pound of weight loss per week.',
    },
    {
      question: 'Does BMI distinguish between muscle mass and body fat?',
      answer:
        'No. BMI is a screening ratio based only on height and total body weight. Strength athletes or individuals with high lean muscle mass may register an overweight BMI despite having low body fat percentage.',
    },
    {
      question: 'What is a healthy waist-to-height ratio alongside BMI?',
      answer:
        'Clinicians often pair BMI with waist-to-height ratio (waist circumference divided by height in the same units). Keeping your waist measurement under half your height (a ratio below 0.50) is associated with lower cardiometabolic risk.',
    },
    {
      question: 'How do I calculate my maximum and target heart rate zones?',
      answer:
        'A common estimate for maximum heart rate (HRmax) is 220 minus your age (or 208 − 0.7 × age using the Tanaka formula). Moderate aerobic Zone 2 training typically targets 60% to 70% of HRmax.',
    },
  ],
};

export default function HealthFitnessCategoryPage() {
  return <CategoryHubPageClient config={HEALTH_FITNESS_CONFIG} />;
}
