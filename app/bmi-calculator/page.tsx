import BmiCalculator from '@/components/calculators/BmiCalculator';

export const metadata = {
  title: 'BMI Calculator - Body Mass Index & Healthy Weight Range',
  description: 'Calculate Body Mass Index (BMI) using Metric or US Imperial units with healthy weight ranges.',
};

export default function BmiPage() {
  return <BmiCalculator />;
}
