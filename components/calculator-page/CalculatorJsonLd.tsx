import React from 'react';
export default function CalculatorJsonLd({ name, description, url, category = 'FinanceApplication', breadcrumbs = [], faqs = [] }) {
    const webAppSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name,
        description,
        url,
        applicationCategory: category,
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
        }
    };
    const breadcrumbSchema = breadcrumbs.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: item.name,
            item: item.url
        }))
    } : null;
    const faqSchema = faqs.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
            }
        }))
    } : null;
    return <><script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(webAppSchema)
    }}/>{breadcrumbSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema)
    }}/>}{faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema)
    }}/>}</>;
}
