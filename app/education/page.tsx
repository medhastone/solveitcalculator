import React from 'react';
import { Metadata } from 'next';
import EducationClient from './EducationClient';

export const metadata: Metadata = {
  title: 'Education Calculators & Academic Planning Tools | GPA, Grades & Study Calculators | SolveItCalculator',
  description: 'Use free education calculators for GPA, grades, CGPA, study planning, exam scores, attendance, scholarships, student loans, and academic success.',
  keywords: [
    'education calculators',
    'GPA calculator',
    'CGPA calculator',
    'grade calculator',
    'attendance calculator',
    'academic planning tools',
    'student calculator',
    'final grade calculator',
    'exam score calculator',
    'scholarship calculator',
    'student loan calculator',
    'study planner calculator',
    'academic performance calculator',
    'percentage calculator',
    'semester GPA calculator',
    'college planning calculator',
    'student calculator tools'
  ],
  alternates: {
    canonical: '/education-calculators-academic-planning-tools/',
  },
  openGraph: {
    type: 'website',
    title: 'Education Calculators & Academic Planning Tools | Free Student Calculators',
    description: 'Calculate GPA, grades, attendance, exam scores, study hours, student loans, scholarships, and academic performance with free tools from SolveItCalculator.',
    url: '/education-calculators-academic-planning-tools/',
    siteName: 'SolveItCalculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Education Calculators & Academic Planning Tools | Free Student Calculators',
    description: 'Free calculators for GPA, grades, attendance, study planning, exam scores, scholarships, and academic success.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Education Calculators & Academic Planning Tools',
  url: 'https://solveitcalculator.com/education-calculators-academic-planning-tools/',
  description: 'Use free education calculators for GPA, grades, CGPA, study planning, exam scores, attendance, scholarships, student loans, and academic success.',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'GPA Calculators',
    'CGPA Calculators',
    'Grade Calculators',
    'Final Exam Calculators',
    'Attendance Calculators',
    'Percentage Calculators',
    'Study Time Calculators',
    'Scholarship Calculators',
    'Student Loan Calculators',
    'College Cost Calculators',
    'Academic Planning Tools',
    'Exam Score Calculators'
  ]
};

export default function EducationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EducationClient />
    </>
  );
}

