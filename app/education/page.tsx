import React from 'react';
import { Metadata } from 'next';
import EducationClient from './EducationClient';

export const metadata: Metadata = {
  title: 'Education Calculators | GPA, Grades, Exams & Study Tools | SolveItCalculator',
  description: 'Use free education calculators for GPA, CGPA, grades, final exams, attendance, study time, college costs, scholarships, and academic planning.',
  keywords: [
    'education calculators',
    'GPA calculator',
    'CGPA calculator',
    'grade calculator',
    'final grade calculator',
    'final exam calculator',
    'attendance calculator',
    'study time calculator',
    'scholarship calculator',
    'college cost calculator',
    'degree progress calculator',
    'academic planning tools',
    'CGPA to percentage converter',
    'target GPA calculator',
    'weighted GPA calculator',
    'unweighted GPA calculator',
    'SAT ACT concordance'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/education/',
  },
  openGraph: {
    type: 'website',
    title: 'Education Calculators | GPA, Grades, Exams & Study Tools | SolveItCalculator',
    description: 'Use free education calculators for GPA, CGPA, grades, final exams, attendance, study time, college costs, scholarships, and academic planning.',
    url: 'https://solveitcalculator.com/education/',
    siteName: 'SolveItCalculator',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Education Calculators | GPA, Grades, Exams & Study Tools | SolveItCalculator',
    description: 'Use free education calculators for GPA, CGPA, grades, final exams, attendance, study time, college costs, scholarships, and academic planning.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://solveitcalculator.com/education/#webpage',
      url: 'https://solveitcalculator.com/education/',
      name: 'Education Calculators | GPA, Grades, Exams & Study Tools | SolveItCalculator',
      description: 'Use free education calculators for GPA, CGPA, grades, final exams, attendance, study time, college costs, scholarships, and academic planning.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://solveitcalculator.com/#website',
        name: 'SolveItCalculator',
        url: 'https://solveitcalculator.com/'
      }
    },
    {
      '@type': 'CollectionPage',
      '@id': 'https://solveitcalculator.com/education/#collection',
      url: 'https://solveitcalculator.com/education/',
      name: 'Education Calculators for GPA, Grades, Exams & Study Planning',
      description: 'Free calculators for GPA, grades, final exams, attendance, study time, college costs, and academic planning.',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'GPA Calculator',
            description: 'Calculate cumulative semester and degree GPA on weighted (5.0) and unweighted (4.0) scales.'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Grade Calculator',
            description: 'Calculate overall class grades using weighted assignments, quizzes, midterms, and projects.'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Final Grade Calculator',
            description: 'Determine the exact final exam score needed to reach your target letter grade.'
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'CGPA Calculator & Converter',
            description: 'Convert 10.0 scale CGPA to percentage or standard 4.0 grade point averages.'
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: 'Attendance Calculator',
            description: 'Evaluate attendance percentages and estimate class absence buffers against required institutional thresholds.'
          },
          {
            '@type': 'ListItem',
            position: 6,
            name: 'Study Time Calculator',
            description: 'Estimate weekly study hours based on course credit loads and subject difficulty.'
          },
          {
            '@type': 'ListItem',
            position: 7,
            name: 'Exam Score Calculator',
            description: 'Calculate curved test scores, standard score conversions, and test pacing metrics.'
          },
          {
            '@type': 'ListItem',
            position: 8,
            name: 'Scholarship & Tuition Net Price Calculator',
            description: 'Estimate college cost of attendance, scholarship offsets, and net tuition expenses.'
          }
        ]
      }
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://solveitcalculator.com/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Education Calculators',
          item: 'https://solveitcalculator.com/education/'
        }
      ]
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How is GPA calculated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'GPA (Grade Point Average) is calculated by multiplying each course credit hours by the numeric grade points earned, summing those quality points, and dividing by the total attempted credits: GPA = Total Quality Points / Total Attempted Credits. Many institutions use this model, but grading policies and point mappings vary by school.'
          }
        },
        {
          '@type': 'Question',
          name: 'What is the difference between GPA and CGPA?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'GPA typically represents your academic performance in a single term, trimester, or semester (often called SGPA). CGPA (Cumulative Grade Point Average) is the overall weighted average across all completed semesters throughout your entire degree program.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I calculate my final grade needed?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'To find the score required on a final exam: Required Score = [Target Grade % - (Current Grade % × (1 - Final Exam Weight %))] / Final Exam Weight %. For example, if you have an 85% and the final is worth 20% to get a 90% overall, you need: [90 - (85 × 0.80)] / 0.20 = 110% (requiring extra credit).'
          }
        },
        {
          '@type': 'Question',
          name: 'How is attendance percentage calculated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Attendance percentage is calculated as: (Classes Attended / Total Classes Held) × 100. To find how many future classes you must attend to reach a required threshold (e.g., 75%), or how many classes you can miss while remaining above it, compare your attended classes against the required percentage of total course sessions.'
          }
        },
        {
          '@type': 'Question',
          name: 'Can I customize my grading scale?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. SolveItCalculator tools allow you to adjust grading scales (such as 4.0 standard, 4.33 plus/minus, 5.0 AP/IB weighted, 10.0 CGPA, or custom percentage ranges) to match your specific school, college, or university grading rubric.'
          }
        },
        {
          '@type': 'Question',
          name: 'Are GPA calculations the same at every university?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. While credit-weighted point totals are widely used, grading policies, letter-to-point mappings, plus/minus modifiers, course retake rules, and honors weightings vary significantly across schools, districts, and international universities. Always verify your official transcript policies with your registrar.'
          }
        },
        {
          '@type': 'Question',
          name: 'Can I use these calculators for different countries?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. SolveItCalculator provides tools and regional methodologies supporting systems from the United States (4.0/5.0 GPA), India (10.0 CGPA & percentage conversions), the United Kingdom (UK Honours classifications and UCAS points), Canada (4.0/4.33/9.0 scales), and global percentage-based grading.'
          }
        }
      ]
    }
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


