import React from 'react';
import { Metadata } from 'next';
import EducationClient from '../education/EducationClient';

export const metadata: Metadata = {
  title: 'Education Calculators | GPA, Grades, Exams & Study Tools | SolveItCalculator',
  description: 'Use free education calculators for GPA, CGPA, grades, final exams, attendance, study time, college costs, scholarships, and academic planning.',
  alternates: {
    canonical: 'https://solveitcalculator.com/education',
  },
  openGraph: {
    type: 'website',
    title: 'Education Calculators | GPA, Grades, Exams & Study Tools | SolveItCalculator',
    description: 'Use free education calculators for GPA, CGPA, grades, final exams, attendance, study time, college costs, scholarships, and academic planning.',
    url: 'https://solveitcalculator.com/education/',
    siteName: 'SolveItCalculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Education Calculators | GPA, Grades, Exams & Study Tools | SolveItCalculator',
    description: 'Use free education calculators for GPA, CGPA, grades, final exams, attendance, study time, college costs, scholarships, and academic planning.',
  },
};

export default function EducationHubCanonicalPage() {
  return <EducationClient />;
}

