import React from 'react';
import type { Metadata } from 'next';
import PetAgeConverterClient from './PetAgeConverterClient';

export const metadata: Metadata = {
  title: 'Pet Age Calculator | Dog, Cat & Pet Years | SolveItCalculator',
  description:
    'Estimate a pet\'s human-age equivalent using species, size, and life-stage assumptions. Compare results for dogs, cats, and other common pets.',
  keywords: [
    'pet age converter',
    'pet age calculator',
    'dog age calculator',
    'cat age calculator',
    'dog years to human years',
    'cat years to human years',
    'pet biological age',
    'veterinary pet age calculator',
    'canine lifespan calculator',
    'feline age converter'
  ],
  authors: [{ name: 'SolveIt Veterinary & Actuarial Research Team' }],
  creator: 'SolveIt Calculator',
  publisher: 'SolveIt Calculator',
  category: 'Veterinary Science & Pet Health',
  alternates: {
    canonical: 'https://solveitcalculator.com/pet-age-converter',
  },
  openGraph: {
    title: 'Pet Age Calculator | Dog, Cat & Pet Years | SolveItCalculator',
    description:
      'Estimate a pet\'s human-age equivalent using species, size, and life-stage assumptions. Compare results for dogs, cats, and other common pets.',
    url: 'https://solveitcalculator.com/pet-age-converter',
    siteName: 'SolveIt Calculator',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pet Age Calculator | Dog, Cat & Pet Years | SolveItCalculator',
    description:
      'Estimate a pet\'s human-age equivalent using species, size, and life-stage assumptions. Compare results for dogs, cats, and other common pets.',
    creator: '@SolveItCalc',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/pet-age-converter/#app',
      name: 'Pet Age Converter & Veterinary Longevity Calculator',
      alternateName: [
        'Dog Age Calculator',
        'Cat Age Calculator',
        'Pet Years to Human Years Calculator',
        'Canine & Feline Epigenetic Longevity Calculator',
      ],
      url: 'https://solveitcalculator.com/pet-age-converter/',
      applicationCategory: 'HealthApplication',
      applicationSubCategory: 'Veterinary Medicine & Companion Animal Health',
      operatingSystem: 'All',
      inLanguage: 'en-US',
      description:
        'A scientific, peer-reviewed pet age calculator converting chronological pet calendar years to human equivalent biological age for 80+ dog and cat breeds, rabbits, pocket pets, and birds with AAHA life-stage milestones.',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      softwareVersion: '2.5',
      featureList: [
        'Epigenetic canine DNA methylation mathematical aging model (16 * ln(age) + 31)',
        '80+ verified dog and cat breed lifespan and senior milestone profiles',
        'Body Condition Score (BCS 1-9) longevity acceleration adjustments',
        'Spay and neuter demographic life expectancy calibrator',
        'Feline indoor vs outdoor lifestyle hazard modeling',
        'Household multi-pet companion tracker and biological comparison',
        'Comprehensive clinical life stage classification (Pediatric to Geriatric)',
        'Direct links to peer-reviewed scientific studies and AAHA veterinary guidelines',
        'Exportable veterinary wellness summary report',
      ],
      author: {
        '@type': 'Organization',
        name: 'SolveIt Calculator',
        url: 'https://solveitcalculator.com/',
      },
    },
    {
      '@type': 'TechArticle',
      '@id': 'https://solveitcalculator.com/pet-age-converter/#article',
      headline: 'Veterinary Epigenetic Aging Models & Comparative Pet-to-Human Life Stage Guide',
      description:
        'Comprehensive veterinary analysis of canine, feline, lagomorph, and avian biological aging rates, debunking the traditional 1:7 year myth through UC San Diego DNA methylation studies and AAHA life-stage protocols.',
      inLanguage: 'en-US',
      about: [
        { '@type': 'Thing', name: 'Canine Aging & Epigenetics' },
        { '@type': 'Thing', name: 'Feline Life Stages' },
        { '@type': 'Thing', name: 'Veterinary Geriatrics' },
        { '@type': 'Thing', name: 'Body Condition Score & Longevity' },
      ],
      citation: [
        {
          '@type': 'CreativeWork',
          name: 'Quantitative Translation of Dog-to-Human Epigenetic Aging by Chromatin Methylation',
          author: 'Tina Wang, Trey Ideker, et al.',
          publisher: 'Cell Systems (Cell Press)',
          url: 'https://www.cell.com/cell-systems/fulltext/S2405-4712(20)30203-9',
          identifier: 'DOI: 10.1016/j.cels.2020.06.006',
        },
        {
          '@type': 'CreativeWork',
          name: 'AAHA Canine Life Stage Guidelines & Senior Care Protocols',
          author: 'American Animal Hospital Association (AAHA)',
          url: 'https://www.aaha.org/resources/life-stage-guidelines/',
        },
        {
          '@type': 'CreativeWork',
          name: 'Senior Pet Care FAQ and Longevity Insights',
          author: 'American Veterinary Medical Association (AVMA)',
          url: 'https://www.avma.org/resources-tools/pet-owners/petcare/senior-pets-faq',
        },
        {
          '@type': 'CreativeWork',
          name: 'The Special Needs of the Senior Cat & Feline Life Stages',
          author: 'Cornell Feline Health Center, Cornell University College of Veterinary Medicine',
          url: 'https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center',
        },
        {
          '@type': 'CreativeWork',
          name: 'Longitudinal Determinants of Canine Health and Aging',
          author: 'The Dog Aging Project (University of Washington & Texas A&M)',
          url: 'https://dogagingproject.org/',
        },
        {
          '@type': 'CreativeWork',
          name: 'Effects of Diet Restriction on Life Span and Age-Related Changes in Dogs',
          author: 'Kealy, R. D. et al., Journal of the American Veterinary Medical Association (JAVMA)',
          url: 'https://petobesityprevention.org/',
        },
      ],
    },
    {
      '@type': 'HowTo',
      '@id': 'https://solveitcalculator.com/pet-age-converter/#howto',
      name: 'How to Calculate Your Pet’s True Biological Age in Human Years',
      description:
        'Follow these four veterinary-calibrated steps to determine your companion animal’s biological age, life stage, and senior wellness timeline.',
      totalTime: 'PT1M',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Select Companion Species & Breed',
          text: 'Select your pet’s species (Canine, Feline, Rabbit, Pocket Pet, or Bird) and pick from over 80 verified dog and cat breeds to calibrate breed-specific median lifespan and aging velocity.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Input Chronological Calendar Age',
          text: 'Enter your companion’s age in years and months using the precise numeric steppers or quick milestone presets (e.g., Puppy, Adolescent, Mature Adult, Senior).',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Calibrate Physiological Health Modifiers',
          text: 'Fine-tune the computation by specifying sterilization status (spayed/neutered), Body Condition Score (BCS 1 to 9), and living environment (indoor vs. outdoor).',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Review Biological Milestones & Veterinary Guidelines',
          text: 'Examine your pet’s human-equivalent age, life stage, remaining lifespan horizon, and recommended clinical preventative checkup cadence.',
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://solveitcalculator.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Time & Date Calculators',
          item: 'https://solveitcalculator.com/time-date/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Pet Age Converter',
          item: 'https://solveitcalculator.com/pet-age-converter/',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Why do giant dog breeds age so much faster than toy breeds?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Giant breeds grow at extraordinary rates during their first year of life—often multiplying their birth weight by 60 to 100 times. This explosive cellular proliferation creates high oxidative stress, elevated free radicals, accelerated telomere attrition, and abnormally high concentrations of IGF-1. As a result, giant breeds experience cellular breakdown and age-related chronic diseases (such as osteosarcoma and dilated cardiomyopathy) significantly earlier.',
          },
        },
        {
          '@type': 'Question',
          name: 'At what exact calendar age does a dog or cat become a “senior”?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Veterinary medicine defines senior onset as entering the final 25% of the species or breed’s expected lifespan. For a Great Dane, senior status starts around age 5 to 6. For a medium dog (e.g., Beagle), it begins around age 7 to 8. For small dogs and indoor cats, senior status is typically reached between ages 10 and 11.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does spaying or neutering genuinely alter biological lifespan?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Actuarial veterinary studies across over 40,000 domestic dogs indicate that sterilized female dogs live an average of 26.3% longer and sterilized males live 13.8% longer. Spaying eliminates life-threatening uterine infections (pyometra) and mammary tumors, while neutering drastically curtails roam-seeking trauma and testicular neoplasia.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why do indoor cats live dramatically longer than outdoor cats?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Free-roaming outdoor cats are continually exposed to high-velocity hazards: motor vehicle trauma, predator attacks (coyotes, dogs), ingestion of commercial rodenticides, and infectious diseases such as Feline Leukemia Virus (FeLV) and Feline Immunodeficiency Virus (FIV). These hazards compress outdoor cat median life expectancies down to 3–7 years, whereas indoor cats routinely achieve 15–19 years.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I decelerate my pet’s biological aging curve?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'While genetics establish the baseline, environmental factors hold massive sway. The single most proven intervention is keeping your pet lean (BCS 4–5), which extends life by up to 1.8 years. Other high-impact interventions include annual professional dental cleanings (preventing chronic systemic bacteremia from infecting cardiac valves and renal tissue) and routine screening blood panels.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the UC San Diego epigenetic formula differ from the traditional 7-year rule?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The UC San Diego formula (Human Age = 16 * ln(Dog Age) + 31) is based on DNA methylation patterns shared between humans and canines. It shows that puppies age at an astonishing rate during their first year—a 1-year-old dog has cellular epigenetic marks comparable to a 31-year-old human—after which the rate slows down considerably, debunking the folklore linear 1:7 ratio.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do rabbit, pocket pet, and avian aging rates compare to cats and dogs?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Small mammals have heightened metabolic rates: rabbits reach adulthood by 6-9 months and enter their senior years around age 6 to 8 (lifespan ~8-12 years). Pocket pets such as hamsters age extremely rapidly (~26 human years per calendar year, lifespan 2-4 years). In contrast, psittacine birds (parrots and cockatiels) possess unique cellular resistance to oxidative damage and can live 15 to 60+ years, aging much more gradually in human terms.',
          },
        },
      ],
    },
  ],
};

export default function PetAgeConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PetAgeConverterClient />
    </>
  );
}
