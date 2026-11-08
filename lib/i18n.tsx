'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { usePathname } from 'next/navigation';
import {
  EXTENDED_EXACT_DICTIONARY,
  EXTENDED_PHRASE_DICTIONARY,
} from './i18nExtendedCatalog';
import { translateWithGrammarEngine } from './i18nGrammarEngine';

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'hi';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'es', label: 'Español', nativeName: 'Español' },
  { code: 'fr', label: 'Français', nativeName: 'Français' },
  { code: 'de', label: 'Deutsch', nativeName: 'Deutsch' },
  { code: 'hi', label: 'हिन्दी', nativeName: 'हिन्दी' },
];

export const LANG_STORAGE_KEY = 'solveit_language_code';

type TranslationTuple = [es: string, fr: string, de: string, hi: string];

/**
 * Exact UI, Page, Tool, Category, and FAQ translations mapped from English source text
 * to [Español, Français, Deutsch, हिन्दी].
 */
const EXACT_DICTIONARY: Record<string, TranslationTuple> = {
  // Header & Navigation
  Home: ['Inicio', 'Accueil', 'Startseite', 'होम'],
  'All Calculators': [
    'Todas las Calculadoras',
    'Toutes les Calculatrices',
    'Alle Rechner',
    'सभी कैलकुलेटर',
  ],
  Math: ['Matemáticas', 'Mathématiques', 'Mathematik', 'गणित'],
  Finance: ['Finanzas', 'Finance', 'Finanzen', 'वित्त'],
  Search: ['Buscar', 'Rechercher', 'Suche', 'खोजें'],
  Guides: ['Guías', 'Guides', 'Ratgeber', 'गाइड्स'],
  'For Communities': [
    'Para Comunidades',
    'Pour les Communautés',
    'Für Gemeinschaften',
    'समुदायों के लिए',
  ],
  Converters: ['Convertidores', 'Convertisseurs', 'Umrechner', 'कन्वर्टर'],
  About: ['Acerca de', 'À propos', 'Über uns', 'हमारे बारे में'],
  Blog: ['Blog', 'Blog', 'Blog', 'ब्लॉग'],
  Contact: ['Contacto', 'Contact', 'Kontakt', 'संपर्क करें'],
  Menu: ['Menú', 'Menu', 'Menü', 'मेनू'],
  Close: ['Cerrar', 'Fermer', 'Schließen', 'बंद करें'],
  'Language:': ['Idioma:', 'Langue :', 'Sprache:', 'भाषा:'],
  'Salary & Tax': [
    'Salario e Impuestos',
    'Salaire et Impôts',
    'Gehalt & Steuern',
    'वेतन और कर',
  ],
  Workspace: [
    'Espacio de Trabajo',
    'Espace de Travail',
    'Arbeitsbereich',
    'वर्कस्पेस',
  ],
  Construction: ['Construcción', 'Construction', 'Bauwesen', 'निर्माण'],
  Recipe: ['Recetas', 'Recettes', 'Rezepte', 'रेसिपी'],
  'Search Calculators': [
    'Buscar Calculadoras',
    'Rechercher des Calculatrices',
    'Rechner suchen',
    'कैलकुलेटर खोजें',
  ],
  'Guides & Formulas': [
    'Guías y Fórmulas',
    'Guides et Formules',
    'Ratgeber & Formeln',
    'गाइड और सूत्र',
  ],
  'Calculation Workspace': [
    'Espacio de Cálculo',
    'Espace de Calcul',
    'Berechnungs-Arbeitsbereich',
    'कैलकुलेशन वर्कस्पेस',
  ],
  'Calculator Categories & Tools': [
    'Categorías y Herramientas de Cálculo',
    'Catégories et Outils de Calcul',
    'Rechner-Kategorien & Werkzeuge',
    'कैलकुलेटर श्रेणियां और टूल्स',
  ],
  'Calculation Workspace (History & Totals)': [
    'Espacio de Cálculo (Historial y Totales)',
    'Espace de Calcul (Historique et Totaux)',
    'Berechnungs-Arbeitsbereich (Verlauf & Summen)',
    'कैलकुलेशन वर्कस्पेस (इतिहास और कुल योग)',
  ],
  'Country Salary & Net Pay Calculator': [
    'Calculadora de Salario y Sueldo Neto por País',
    'Calculateur de Salaire Brut et Net par Pays',
    'Gehalts- und Nettolohnrechner nach Land',
    'देशानुसार वेतन और शुद्ध आय कैलकुलेटर',
  ],
  'Construction Project Calculator': [
    'Calculadora de Proyectos de Construcción',
    'Calculateur de Projets de Construction',
    'Bauprojekt-Rechner',
    'निर्माण परियोजना कैलकुलेटर',
  ],
  'Recipe Converter (Servings & Grams)': [
    'Convertidor de Recetas (Porciones y Gramos)',
    'Convertisseur de Recettes (Portions et Grammes)',
    'Rezept-Umrechner (Portionen & Gramm)',
    'रेसिपी कन्वर्टर (सर्विंग्स और ग्राम)',
  ],
  'How SolveItCalculator Works (About)': [
    'Cómo Funciona SolveItCalculator (Acerca de)',
    'Comment Fonctionne SolveItCalculator (À propos)',
    'Wie SolveItCalculator funktioniert (Über uns)',
    'SolveItCalculator कैसे काम करता है (परिचय)',
  ],
  'Calculation Methodology': [
    'Metodología de Cálculo',
    'Méthodologie de Calcul',
    'Berechnungsmethodik',
    'गणना कार्यप्रणाली',
  ],
  'Privacy & Accessibility': [
    'Privacidad y Accesibilidad',
    'Confidentialité et Accessibilité',
    'Datenschutz & Barrierefreiheit',
    'गोपनीयता और पहुंच',
  ],
  'Contact & Report an Error': [
    'Contacto y Reportar un Error',
    'Contact et Signaler une Erreur',
    'Kontakt & Fehler melden',
    'संपर्क करें और त्रुटि बताएं',
  ],
  'Math & Percentage Calculators': [
    'Calculadoras de Matemáticas y Porcentajes',
    'Calculatrices Mathématiques et Pourcentages',
    'Mathematik- & Prozentrechner',
    'गणित और प्रतिशत कैलकुलेटर',
  ],
  'Finance & Tax Calculators': [
    'Calculadoras de Finanzas e Impuestos',
    'Calculatrices Financières et Fiscales',
    'Finanz- & Steuerrechner',
    'वित्त और कर कैलकुलेटर',
  ],
  'Business & Margin Calculators': [
    'Calculadoras de Negocios y Márgenes',
    'Calculatrices d’Entreprise et de Marge',
    'Geschäfts- & Margenrechner',
    'व्यापार और मार्जिन कैलकुलेटर',
  ],
  'Retirement & Super Calculators': [
    'Calculadoras de Jubilación y Pensión',
    'Calculatrices de Retraite et Épargne',
    'Renten- & Vorsorgerechner',
    'सेवानिवृत्ति और पेंशन कैलकुलेटर',
  ],
  'Unit & Measurement Converters': [
    'Convertidores de Unidades y Medidas',
    'Convertisseurs d’Unités et de Mesures',
    'Einheiten- & Maßumrechner',
    'इकाई और माप कन्वर्टर',
  ],
  'Date & Time Calculators': [
    'Calculadoras de Fecha y Hora',
    'Calculatrices de Date et d’Heure',
    'Datums- &erdauer-Rechner',
    'दिनांक और समय कैलकुलेटर',
  ],
  'Home & Construction Calculators': [
    'Calculadoras de Hogar y Construcción',
    'Calculatrices Maison et Construction',
    'Haus- & Baurechner',
    'घर और निर्माण कैलकुलेटर',
  ],
  'Health & Fitness Calculators': [
    'Calculadoras de Salud y Fitness',
    'Calculatrices Santé et Forme',
    'Gesundheits- & Fitnessrechner',
    'स्वास्थ्य और फिटनेस कैलकुलेटर',
  ],
  'Science & Lab Calculators': [
    'Calculadoras de Ciencia y Laboratorio',
    'Calculatrices Scientifiques et de Laboratoire',
    'Wissenschafts- & Laborrechner',
    'विज्ञान और प्रयोगशाला कैलकुलेटर',
  ],

  // Footer
  'Free Calculators for a Smarter Life.': [
    'Calculadoras gratuitas para una vida más inteligente.',
    'Des calculatrices gratuites pour une vie plus intelligente.',
    'Kostenlose Rechner für ein klügeres Leben.',
    'स्मार्ट जीवन के लिए निःशुल्क कैलकुलेटर।',
  ],
  'Salary Calculator': [
    'Calculadora de Salario',
    'Calculateur de Salaire',
    'Gehaltsrechner',
    'वेतन कैलकुलेटर',
  ],
  'Construction Calculator': [
    'Calculadora de Construcción',
    'Calculateur de Construction',
    'Baurechner',
    'निर्माण कैलकुलेटर',
  ],
  'Recipe Converter': [
    'Convertidor de Recetas',
    'Convertisseur de Recettes',
    'Rezept-Umrechner',
    'रेसिपी कन्वर्टर',
  ],
  Accessibility: [
    'Accesibilidad',
    'Accessibilité',
    'Barrierefreiheit',
    'पहुंच-योग्यता (Accessibility)',
  ],
  'Privacy Policy': [
    'Política de Privacidad',
    'Politique de Confidentialité',
    'Datenschutzerklärung',
    'गोपनीयता नीति',
  ],
  'Terms of Service': [
    'Términos de Servicio',
    'Conditions d’Utilisation',
    'Nutzungsbedingungen',
    'सेवा की शर्तें',
  ],
  '. All rights reserved.': [
    '. Todos los derechos reservados.',
    '. Tous droits réservés.',
    '. Alle Rechte vorbehalten.',
    '. सर्वाधिकार सुरक्षित।',
  ],
  'Make Better Decisions with Accurate Calculations.': [
    'Tome mejores decisiones con cálculos precisos.',
    'Prenez de meilleures décisions grâce à des calculs précis.',
    'Treffen Sie bessere Entscheidungen mit präzisen Berechnungen.',
    'सटीक गणनाओं के साथ बेहतर निर्णय लें।',
  ],

  // Homepage
  'What would you like to': [
    '¿Qué te gustaría',
    'Que souhaitez-vous',
    'Was möchten Sie',
    'आप क्या',
  ],
  'calculate?': ['calcular?', 'calculer ?', 'berechnen?', 'गणना करना चाहेंगे?'],
  'What would you like to calculate?': [
    '¿Qué te gustaría calcular?',
    'Que souhaitez-vous calculer ?',
    'Was möchten Sie berechnen?',
    'आप क्या गणना करना चाहेंगे?',
  ],
  'Free calculators with clear answers, explicit formulas, and simple explanations.': [
    'Calculadoras gratuitas con respuestas claras, fórmulas explícitas y explicaciones sencillas.',
    'Calculatrices gratuites avec des réponses claires, des formules explicites et des explications simples.',
    'Kostenlose Rechner mit klaren Antworten, expliziten Formeln und einfachen Erklärungen.',
    'स्पष्ट उत्तर, सटीक सूत्र और सरल व्याख्याओं के साथ निःशुल्क कैलकुलेटर।',
  ],
  'Search calculators (e.g. percentage, flooring, workspace, loan, BMI)...': [
    'Buscar calculadoras (ej. porcentaje, pisos, espacio de cálculo, préstamo, IMC)...',
    'Rechercher des calculatrices (ex. pourcentage, revêtement de sol, prêt, IMC)...',
    'Rechner suchen (z. B. Prozent, Bodenbelag, Arbeitsbereich, Kredit, BMI)...',
    'कैलकुलेटर खोजें (जैसे प्रतिशत, फ्लोरिंग, वर्कस्पेस, लोन, बीएमआई)...',
  ],
  'Try:': ['Probar:', 'Essayer :', 'Probieren Sie:', 'आजमाएं:'],
  Percentage: ['Porcentaje', 'Pourcentage', 'Prozent', 'प्रतिशत'],
  'Construction Project': [
    'Proyecto de Construcción',
    'Projet de Construction',
    'Bauprojekt',
    'निर्माण परियोजना',
  ],
  Flooring: ['Pisos y Suelos', 'Revêtement de Sol', 'Bodenbelag', 'फ्लोरिंग'],
  Loan: ['Préstamo', 'Prêt', 'Kredit', 'ऋण (Loan)'],
  Age: ['Edad', 'Âge', 'Alter', 'आयु'],
  BMI: ['IMC', 'IMC', 'BMI', 'बीएमआई (BMI)'],
  'Unit Converter': [
    'Convertidor de Unidades',
    'Convertisseur d’Unités',
    'Einheitenumrechner',
    'यूनिट कन्वर्टर',
  ],
  '100% Free': ['100% Gratis', '100 % Gratuit', '100 % Kostenlos', '100% निःशुल्क'],
  'No signup or paywall': [
    'Sin registro ni muros de pago',
    'Sans inscription ni abonnement',
    'Ohne Registrierung oder Bezahlschranke',
    'कोई साइनअप या शुल्क नहीं',
  ],
  'Transparent Math': [
    'Matemáticas Transparentes',
    'Mathématiques Transparentes',
    'Transparente Mathematik',
    'पारदर्शी गणित',
  ],
  'Explicit formulas & assumptions': [
    'Fórmulas y supuestos explícitos',
    'Formules et hypothèses explicites',
    'Explizite Formeln & Annahmen',
    'स्पष्ट सूत्र और मान्यताएं',
  ],
  'Built for Everyday Use': [
    'Diseñado para el Uso Diario',
    'Conçu pour un Usage Quotidien',
    'Für den Alltag entwickelt',
    'दैनिक उपयोग के लिए निर्मित',
  ],
  'Mobile, desktop & keyboard ready': [
    'Listo para móvil, escritorio y teclado',
    'Compatible mobile, ordinateur et clavier',
    'Für Mobilgeräte, Desktop & Tastatur optimiert',
    'मोबाइल, डेस्कटॉप और कीबोर्ड के लिए तैयार',
  ],
  'Popular & Frequently Used Calculators': [
    'Calculadoras Populares y de Uso Frecuente',
    'Calculatrices Populaires et Fréquemment Utilisées',
    'Beliebte & häufig genutzte Rechner',
    'लोकप्रिय और बार-बार उपयोग किए जाने वाले कैलकुलेटर',
  ],
  'Direct access to our most frequently used everyday calculation tools.': [
    'Acceso directo a nuestras herramientas de cálculo diario más utilizadas.',
    'Accès direct à nos outils de calcul quotidien les plus utilisés.',
    'Direkter Zugriff auf unsere am häufigsten genutzten Alltagsrechner.',
    'हमारे सबसे अधिक उपयोग किए जाने वाले दैनिक गणना उपकरणों तक सीधी पहुंच।',
  ],
  'View All Calculators': [
    'Ver Todas las Calculadoras',
    'Voir Toutes les Calculatrices',
    'Alle Rechner anzeigen',
    'सभी कैलकुलेटर देखें',
  ],
  'Percentage Calculator': [
    'Calculadora de Porcentajes',
    'Calculatrice de Pourcentage',
    'Prozentrechner',
    'प्रतिशत कैलकुलेटर',
  ],
  'Calculate percentages, increases, decreases, and proportions.': [
    'Calcule porcentajes, aumentos, disminuciones y proporciones.',
    'Calculez les pourcentages, augmentations, réductions et proportions.',
    'Berechnen Sie Prozentsätze, Erhöhungen, Senkungen und Verhältnisse.',
    'प्रतिशत, वृद्धि, कमी और अनुपात की गणना करें।',
  ],
  'Multi-step expressions, running totals, and reusable history.': [
    'Expresiones de varios pasos, totales acumulados e historial reutilizable.',
    'Expressions à plusieurs étapes, totaux cumulés et historique réutilisable.',
    'Mehrstufige Ausdrücke, laufende Summen und wiederverwendbarer Verlauf.',
    'बहु-चरणीय समीकरण, चल रहे कुल योग और पुनः प्रयोज्य इतिहास।',
  ],
  'Guided 4-step estimator for area, concrete slabs, post holes, waste & cost.': [
    'Estimador guiado de 4 pasos para área, losas de concreto, postes, desperdicio y costo.',
    'Estimateur guidé en 4 étapes pour surface, dalles de béton, poteaux, pertes et coûts.',
    'Geführter 4-Schritte-Rechner für Fläche, Betonplatten, Pfostenlöcher, Verschnitt & Kosten.',
    'क्षेत्रफल, कंक्रीट स्लैब, पोस्ट होल, अपव्यय और लागत के लिए 4-चरणीय अनुमानक।',
  ],
  'Loan Payment Calculator': [
    'Calculadora de Pagos de Préstamo',
    'Calculateur de Mensualités de Prêt',
    'Kreditraten-Rechner',
    'ऋण भुगतान कैलकुलेटर',
  ],
  'Estimate monthly loan payments and total interest.': [
    'Estime los pagos mensuales del préstamo y el interés total.',
    'Estimez les mensualités de prêt et le total des intérêts.',
    'Schätzen Sie monatliche Kreditraten und Gesamtzinsen.',
    'मासिक ऋण भुगतान और कुल ब्याज का अनुमान लगाएं।',
  ],
  'Unit Conversion Calculator': [
    'Calculadora de Conversión de Unidades',
    'Calculateur de Conversion d’Unités',
    'Einheiten-Umrechnungsrechner',
    'इकाई रूपांतरण कैलकुलेटर',
  ],
  'Convert length, weight, volume, area, and temperature.': [
    'Convierta longitud, peso, volumen, área y temperatura.',
    'Convertissez la longueur, le poids, le volume, la surface et la température.',
    'Rechnen Sie Länge, Gewicht, Volumen, Fläche und Temperatur um.',
    'लंबाई, वजन, आयतन, क्षेत्रफल और तापमान बदलें।',
  ],
  'Discount Calculator': [
    'Calculadora de Descuentos',
    'Calculateur de Remise',
    'Rabattrechner',
    'छूट (डिस्काउंट) कैलकुलेटर',
  ],
  'Find the final sale price and total money saved.': [
    'Encuentre el precio final de venta y el ahorro total.',
    'Trouvez le prix final après remise et le montant total économisé.',
    'Ermitteln Sie den Endverkaufspreis und die gesamte Ersparnis.',
    'अंतिम बिक्री मूल्य और कुल बचत राशि जानें।',
  ],
  'Age Calculator': [
    'Calculadora de Edad',
    'Calculateur d’Âge',
    'Altersrechner',
    'आयु कैलकुलेटर',
  ],
  'Find your exact age in years, months, weeks, and days.': [
    'Encuentre su edad exacta en años, meses, semanas y días.',
    'Trouvez votre âge exact en années, mois, semaines et jours.',
    'Berechnen Sie Ihr genaues Alter in Jahren, Monaten, Wochen und Tagen.',
    'वर्षों, महीनों, सप्ताहों और दिनों में अपनी सटीक आयु जानें।',
  ],
  'BMI Calculator': [
    'Calculadora de IMC',
    'Calculateur d’IMC',
    'BMI-Rechner',
    'बीएमआई (BMI) कैलकुलेटर',
  ],
  'Check your body mass index, daily calories, and healthy weight.': [
    'Consulte su índice de masa corporal, calorías diarias y peso saludable.',
    'Vérifiez votre indice de masse corporelle, vos calories quotidiennes et votre poids idéal.',
    'Prüfen Sie Ihren Body-Mass-Index, täglichen Kalorienbedarf und Ihr Idealgewicht.',
    'अपना बॉडी मास इंडेक्स, दैनिक कैलोरी और स्वस्थ वजन जांचें।',
  ],
  'Browse by Category': [
    'Explorar por Categoría',
    'Parcourir par Catégorie',
    'Nach Kategorie durchsuchen',
    'श्रेणी के अनुसार ब्राउज़ करें',
  ],
  'Explore all 9 calculator categories across math, finance, home projects, units, health, and science.': [
    'Explore las 9 categorías de calculadoras en matemáticas, finanzas, hogar, unidades, salud y ciencia.',
    'Explorez les 9 catégories de calculatrices : maths, finance, maison, unités, santé et sciences.',
    'Entdecken Sie alle 9 Rechnerkategorien aus Mathematik, Finanzen, Hausbau, Einheiten, Gesundheit und Wissenschaft.',
    'गणित, वित्त, गृह निर्माण, इकाइयों, स्वास्थ्य और विज्ञान की सभी 9 कैलकुलेटर श्रेणियां देखें।',
  ],
  'Full A–Z Directory': [
    'Directorio Completo A–Z',
    'Répertoire Complet A–Z',
    'Vollständiges A–Z-Verzeichnis',
    'संपूर्ण A–Z निर्देशिका',
  ],
  'Math Calculators': [
    'Calculadoras de Matemáticas',
    'Calculatrices Mathématiques',
    'Mathematik-Rechner',
    'गणित कैलकुलेटर',
  ],
  'Percentages, fractions, ratios, algebra, and workspace.': [
    'Porcentajes, fracciones, razones, álgebra y espacio de cálculo.',
    'Pourcentages, fractions, ratios, algèbre et espace de travail.',
    'Prozente, Brüche, Verhältnisse, Algebra und Arbeitsbereich.',
    'प्रतिशत, भिन्न, अनुपात, बीजगणित और वर्कस्पेस।',
  ],
  'Finance Calculators': [
    'Calculadoras Financieras',
    'Calculatrices Financières',
    'Finanzrechner',
    'वित्त कैलकुलेटर',
  ],
  'Loans, mortgages, interest, salary, tax, and savings.': [
    'Préstamos, hipotecas, intereses, salario, impuestos y ahorros.',
    'Prêts, hypothèques, intérêts, salaire, impôts et épargne.',
    'Kredite, Hypotheken, Zinsen, Gehalt, Steuern und Ersparnisse.',
    'ऋण, मॉर्गेज, ब्याज, वेतन, कर और बचत।',
  ],
  'Home & Construction': [
    'Hogar y Construcción',
    'Maison et Construction',
    'Haus & Bauwesen',
    'घर और निर्माण',
  ],
  'Construction workflow, flooring estimator, room area & concrete.': [
    'Flujo de construcción, estimador de pisos, área de habitaciones y concreto.',
    'Flux de construction, estimateur de sol, surface de pièce et béton.',
    'Bauablauf, Bodenbelagsrechner, Raumfläche & Beton.',
    'निर्माण कार्यप्रवाह, फ्लोरिंग अनुमानक, कमरे का क्षेत्रफल और कंक्रीट।',
  ],
  'Unit Conversion': [
    'Conversión de Unidades',
    'Conversion d’Unités',
    'Einheitenumrechnung',
    'इकाई रूपांतरण',
  ],
  'Length, weight, area, volume, temperature, and speed.': [
    'Longitud, peso, área, volumen, temperatura y velocidad.',
    'Longueur, poids, surface, volume, température et vitesse.',
    'Länge, Gewicht, Fläche, Volumen, Temperatur und Geschwindigkeit.',
    'लंबाई, वजन, क्षेत्रफल, आयतन, तापमान और गति।',
  ],
  'Date & Time': ['Fecha y Hora', 'Date et Heure', 'Datum & Uhrzeit', 'दिनांक और समय'],
  'Exact age, date difference, workdays, and shift duration.': [
    'Edad exacta, diferencia de fechas, días laborables y duración de turnos.',
    'Âge exact, différence de dates, jours ouvrés et durée de poste.',
    'Genaues Alter, Datumsdifferenz, Arbeitstage und Schichtdauer.',
    'सटीक आयु, तिथियों का अंतर, कार्यदिवस और शिफ्ट की अवधि।',
  ],
  'Health & Fitness': [
    'Salud y Fitness',
    'Santé et Forme',
    'Gesundheit & Fitness',
    'स्वास्थ्य और फिटनेस',
  ],
  'BMI, daily calorie needs (TDEE), BMR, and body fat.': [
    'IMC, necesidades calóricas diarias (TDEE), TMB y grasa corporal.',
    'IMC, besoins caloriques quotidiens (TDEE), MB et masse grasse.',
    'BMI, täglicher Kalorienbedarf (TDEE), Grundumsatz (BMR) und Körperfett.',
    'बीएमआई, दैनिक कैलोरी आवश्यकता (TDEE), बीएमआर और शरीर की चर्बी।',
  ],
  'Business Calculators': [
    'Calculadoras de Negocios',
    'Calculatrices d’Entreprise',
    'Geschäftsrechner',
    'व्यापार कैलकुलेटर',
  ],
  'Profit margin, gross margin, markup, break-even, and ROI.': [
    'Margen de beneficio, margen bruto, recargo, punto de equilibrio y ROI.',
    'Marge bénéficiaire, marge brute, majoration, seuil de rentabilité et ROI.',
    'Gewinnspanne, Bruttomarge, Aufschlag, Break-Even und ROI.',
    'लाभ मार्जिन, सकल मार्जिन, मार्कअप, ब्रेक-ईवन और आरओआई (ROI)।',
  ],
  'Science Calculators': [
    'Calculadoras de Ciencia',
    'Calculatrices Scientifiques',
    'Wissenschaftsrechner',
    'विज्ञान कैलकुलेटर',
  ],
  "Density, force, Ohm's law, molarity, and percent error.": [
    'Densidad, fuerza, ley de Ohm, molaridad y error porcentual.',
    'Densité, force, loi d’Ohm, molarité et erreur en pourcentage.',
    'Dichte, Kraft, Ohmsches Gesetz, Molarität und prozentualer Fehler.',
    'घनत्व, बल, ओम का नियम, मोलरता और प्रतिशत त्रुटि।',
  ],
  'Retirement & Super': [
    'Jubilación y Pensión',
    'Retraite et Épargne',
    'Rente & Altersvorsorge',
    'सेवानिवृत्ति और पेंशन',
  ],
  '401(k) match, Roth vs. Traditional, RMD, and FIRE planning.': [
    'Aporte 401(k), Roth vs. Tradicional, RMD y planificación FIRE.',
    'Abondement 401(k), Roth vs Traditionnel, RMD et planification FIRE.',
    '401(k)-Zuschuss, Roth vs. Traditionell, RMD und FIRE-Planung.',
    '401(k) मैच, रोथ बनाम पारंपरिक, RMD और FIRE योजना।',
  ],
  'Find by Everyday Goal': [
    'Buscar por Objetivo Diario',
    'Trouver par Objectif Quotidien',
    'Nach Alltags-Ziel finden',
    'दैनिक आवश्यकता के अनुसार खोजें',
  ],
  'Not sure which calculator you need? Jump straight to tools grouped by common real-world tasks.': [
    '¿No está seguro de qué calculadora necesita? Vaya directamente a las herramientas agrupadas por tareas reales.',
    'Vous ne savez pas quelle calculatrice choisir ? Accédez aux outils regroupés par tâches courantes.',
    'Nicht sicher, welchen Rechner Sie brauchen? Springen Sie direkt zu Werkzeugen für typische Alltagsaufgaben.',
    'निश्चित नहीं हैं कि आपको किस कैलकुलेटर की आवश्यकता है? सामान्य कार्यों के अनुसार समूहीकृत टूल्स पर जाएं।',
  ],
  'Shopping, Discounts & Running Totals': [
    'Compras, Descuentos y Totales Acumulados',
    'Achats, Remises et Totaux Cumulés',
    'Einkaufen, Rabatte & Laufende Summen',
    'खरीदारी, छूट और चल रहे कुल योग',
  ],
  'Compare store markdowns, calculate tax, or add up multiple items with a live running subtotal.': [
    'Compare rebajas en tiendas, calcule impuestos o sume varios artículos con un subtotal en vivo.',
    'Comparez les démarques en magasin, calculez les taxes ou additionnez plusieurs articles en direct.',
    'Vergleichen Sie Ladenrabatte, berechnen Sie Steuern oder addieren Sie mehrere Artikel mit Zwischensumme.',
    'स्टोर छूट की तुलना करें, कर की गणना करें, या लाइव सबटोटल के साथ कई वस्तुओं को जोड़ें।',
  ],
  'Home Renovation & Construction Measurements': [
    'Renovación del Hogar y Medidas de Construcción',
    'Rénovation domiciliaire et Mesures de Construction',
    'Hausrenovierung & Baumaße',
    'गृह नवीनीकरण और निर्माण माप',
  ],
  'Calculate rectangular areas, concrete slabs, or post holes, add waste allowance, and estimate costs.': [
    'Calcule áreas rectangulares, losas de concreto o agujeros para postes, agregue margen de desperdicio y estime costos.',
    'Calculez des surfaces rectangulaires, dalles de béton ou trous de poteaux, ajoutez la perte et estimez les coûts.',
    'Berechnen Sie rechteckige Flächen, Betonplatten oder Pfostenlöcher inklusive Verschnitt und Kosten.',
    'आयताकार क्षेत्र, कंक्रीट स्लैब या पोस्ट होल की गणना करें, अपव्यय भत्ता जोड़ें और लागत का अनुमान लगाएं।',
  ],
  'Loans, Mortgages & Take-Home Pay': [
    'Préstamos, Hipotecas y Sueldo Neto',
    'Prêts, Hypothèques et Salaire Net',
    'Kredite, Hypotheken & Nettogehalt',
    'ऋण, मॉर्गेज और शुद्ध वेतन',
  ],
  'Check monthly PITI house payments, compare loan amortization, or estimate net paycheck income.': [
    'Verifique pagos mensuales de vivienda PITI, compare amortizaciones de préstamos o estime su sueldo neto.',
    'Vérifiez les mensualités immobilières PITI, comparez l’amortissement d’un prêt ou estimez votre salaire net.',
    'Prüfen Sie monatliche Immobilienraten, vergleichen Sie Kreditamortisationen oder schätzen Sie Ihr Nettoeinkommen.',
    'मासिक आवास भुगतान जांचें, ऋण परिशोधन की तुलना करें, या शुद्ध वेतन आय का अनुमान लगाएं।',
  ],
  'Homework, Algebra & Science Labs': [
    'Tareas, Álgebra y Laboratorios de Ciencias',
    'Devoirs, Algèbre et Laboratoires de Sciences',
    'Hausaufgaben, Algebra & Wissenschaftslabore',
    'होमवर्क, बीजगणित और विज्ञान प्रयोगशाला',
  ],
  'Check step-by-step fraction arithmetic, PEMDAS order of operations, or lab percent error.': [
    'Verifique paso a paso la aritmética de fracciones, el orden de operaciones PEMDAS o el error porcentual de laboratorio.',
    'Vérifiez étape par étape les fractions, l’ordre des opérations PEMDAS ou l’erreur en pourcentage.',
    'Prüfen Sie Schritt für Schritt Bruchrechnung, Punkt-vor-Strich-Regeln (PEMDAS) oder den prozentualen Laborfehler.',
    'चरण-दर-चरण भिन्न अंकगणित, संक्रियाओं का क्रम (PEMDAS), या प्रयोगशाला प्रतिशत त्रुटि जांचें।',
  ],
  'Formulas, Accuracy & Privacy': [
    'Fórmulas, Precisión y Privacidad',
    'Formules, Précision et Confidentialité',
    'Formeln, Genauigkeit & Datenschutz',
    'सूत्र, सटीकता और गोपनीयता',
  ],
  'How SolveItCalculator computes results and handles your browser data.': [
    'Cómo calcula resultados SolveItCalculator y cómo protege los datos de su navegador.',
    'Comment SolveItCalculator calcule les résultats et gère les données de votre navigateur.',
    'Wie SolveItCalculator Ergebnisse berechnet und Ihre Browserdaten schützt.',
    'SolveItCalculator परिणामों की गणना कैसे करता है और आपके ब्राउज़र डेटा को कैसे संभालता है।',
  ],
  'Calculation Methodology →': [
    'Metodología de Cálculo →',
    'Méthodologie de Calcul →',
    'Berechnungsmethodik →',
    'गणना कार्यप्रणाली →',
  ],
  'Privacy & Accessibility →': [
    'Privacidad y Accesibilidad →',
    'Confidentialité et Accessibilité →',
    'Datenschutz & Barrierefreiheit →',
    'गोपनीयता और पहुंच →',
  ],
  'Standard Mathematical Formulas': [
    'Fórmulas Matemáticas Estándar',
    'Formules Mathématiques Standards',
    'Mathematische Standardformeln',
    'मानक गणितीय सूत्र',
  ],
  'Every calculator displays the exact mathematical equation, operator precedence, and unit conversion factors used to produce your result so you can verify steps independently.': [
    'Cada calculadora muestra la ecuación matemática exacta, la precedencia de operadores y los factores de conversión utilizados para que pueda verificar cada paso.',
    'Chaque calculatrice affiche l’équation mathématique exacte, la priorité des opérateurs et les facteurs de conversion utilisés afin que vous puissiez vérifier chaque étape.',
    'Jeder Rechner zeigt die exakte mathematische Gleichung, die Operatorrangfolge und die Umrechnungsfaktoren an, damit Sie alle Schritte unabhängig nachvollziehen können.',
    'प्रत्येक कैलकुलेटर आपके परिणाम के लिए उपयोग किए गए सटीक गणितीय समीकरण और इकाई रूपांतरण गुणकों को प्रदर्शित करता है।',
  ],
  'Documented Assumptions & Rounding': [
    'Supuestos Documentados y Redondeo',
    'Hypothèses Documentées et Arrondis',
    'Dokumentierte Annahmen & Rundung',
    'प्रलेखित मान्यताएं और पूर्णांकन (Rounding)',
  ],
  'Where an estimate depends on a convention—such as compounding frequency, pack rounding, or waste percentage—the assumption is stated next to the result.': [
    'Cuando una estimación depende de una convención —como la frecuencia de capitalización, el redondeo de paquetes o el porcentaje de desperdicio—, el supuesto se indica junto al resultado.',
    'Lorsqu’une estimation dépend d’une convention — comme la fréquence de capitalisation, l’arrondi par paquet ou le pourcentage de perte — l’hypothèse est indiquée à côté du résultat.',
    'Wenn eine Schätzung von einer Konvention abhängt – wie Zinseszinsintervall, Paketrundung oder Verschnittprozent –, wird diese Annahme direkt neben dem Ergebnis angegeben.',
    'जहां कोई अनुमान किसी मानक (जैसे चक्रवृद्धि आवृत्ति, पैक राउंडिंग या अपव्यय प्रतिशत) पर निर्भर करता है, वहां परिणाम के साथ उसका उल्लेख किया जाता है।',
  ],
  'In-Browser Calculation & Local History': [
    'Cálculo en el Navegador e Historial Local',
    'Calcul dans le Navigateur et Historique Local',
    'Berechnung im Browser & Lokaler Verlauf',
    'ब्राउज़र में गणना और स्थानीय इतिहास',
  ],
  'Calculations run directly in your browser. Optional features like Calculation Workspace history use local browser storage on your device and can be cleared anytime.': [
    'Los cálculos se ejecutan directamente en su navegador. Funciones opcionales como el historial del Espacio de Cálculo usan almacenamiento local en su dispositivo y pueden borrarse en cualquier momento.',
    'Les calculs s’exécutent directement dans votre navigateur. Les fonctions optionnelles comme l’historique utilisent le stockage local de votre appareil et peuvent être effacées à tout moment.',
    'Berechnungen erfolgen direkt in Ihrem Browser. Optionale Funktionen wie der Arbeitsbereich-Verlauf nutzen den lokalen Speicher Ihres Geräts und können jederzeit gelöscht werden.',
    'गणनाएं सीधे आपके ब्राउज़र में चलती हैं। कैलकुलेशन वर्कस्पेस इतिहास जैसी सुविधाएं आपके डिवाइस के लोकल स्टोरेज का उपयोग करती हैं और कभी भी मिटाई जा सकती हैं।',
  ],
  'Accurate. Simple. Useful for Real Life.': [
    'Preciso. Sencillo. Útil para la Vida Real.',
    'Précis. Simple. Utile au Quotidien.',
    'Präzise. Einfach. Nützlich für das echte Leben.',
    'सटीक। सरल। वास्तविक जीवन के लिए उपयोगी।',
  ],
  'Browse our full directory of calculators or open the Calculation Workspace to chain multiple calculations together.': [
    'Explore nuestro directorio completo de calculadoras o abra el Espacio de Cálculo para encadenar múltiples cálculos.',
    'Parcourez notre répertoire complet de calculatrices ou ouvrez l’Espace de Calcul pour enchaîner plusieurs calculs.',
    'Durchsuchen Sie unser gesamtes Rechnerverzeichnis oder öffnen Sie den Arbeitsbereich, um mehrere Berechnungen zu verknüpfen.',
    'कैलकुलेटर की हमारी पूरी निर्देशिका ब्राउज़ करें या कई गणनाओं को एक साथ जोड़ने के लिए कैलकुलेशन वर्कस्पेस खोलें।',
  ],
  'Explore All Calculators': [
    'Explorar Todas las Calculadoras',
    'Explorer Toutes les Calculatrices',
    'Alle Rechner entdecken',
    'सभी कैलकुलेटर एक्सप्लोर करें',
  ],

  // Recipe Converters Category Page (DESIGN PROMPT 01)
  'Recipe Converters': [
    'Convertidores de Recetas',
    'Convertisseurs de Recettes',
    'Rezept-Umrechner',
    'रेसिपी कन्वर्टर',
  ],
  'Convert cooking measurements, scale ingredients, and adjust recipes with simple, accurate calculations.': [
    'Convierta medidas de cocina, escale ingredientes y ajuste recetas con cálculos sencillos y precisos.',
    'Convertissez les mesures de cuisine, ajustez les portions et adaptez vos recettes avec des calculs simples et précis.',
    'Rechnen Sie Küchenmaße um, skalieren Sie Zutaten und passen Sie Rezepte mit einfachen, genauen Berechnungen an.',
    'सरल और सटीक गणनाओं के साथ खाना पकाने के माप बदलें, सामग्री को स्केल करें और रेसिपी समायोजित करें।',
  ],
  'Search recipe converters...': [
    'Buscar convertidores de recetas...',
    'Rechercher des convertisseurs de recettes...',
    'Rezept-Umrechner suchen...',
    'रेसिपी कन्वर्टर खोजें...',
  ],
  Cups: ['Tazas', 'Tasses', 'Tassen', 'कप (Cups)'],
  Tablespoons: [
    'Cucharadas',
    'Cuillères à soupe',
    'Esslöffel',
    'बड़े चम्मच (Tbsp)',
  ],
  Teaspoons: [
    'Cucharaditas',
    'Cuillères à café',
    'Teelöffel',
    'छोटे चम्मच (Tsp)',
  ],
  Grams: ['Gramos', 'Grammes', 'Gramm', 'ग्राम (Grams)'],
  Milliliters: [
    'Mililitros',
    'Millilitres',
    'Milliliter',
    'मिलीलीटर (mL)',
  ],
  Ounces: ['Onzas', 'Onces', 'Unzen', 'औंस (Ounces)'],
  'Recipe Scaling': [
    'Escalado de Recetas',
    'Adaptation des Portions',
    'Rezept-Skalierung',
    'रेसिपी स्केलिंग',
  ],
  'Show All': ['Mostrar Todo', 'Tout Afficher', 'Alle anzeigen', 'सभी दिखाएं'],
  'Popular Recipe Tools': [
    'Herramientas de Recetas Populares',
    'Outils de Recettes Populaires',
    'Beliebte Rezept-Werkzeuge',
    'लोकप्रिय रेसिपी टूल्स',
  ],
  'Explore our most used recipe converters.': [
    'Explore nuestros convertidores de recetas más utilizados.',
    'Découvrez nos convertisseurs de recettes les plus utilisés.',
    'Entdecken Sie unsere meistgenutzten Rezept-Umrechner.',
    'हमारे सबसे अधिक उपयोग किए जाने वाले रेसिपी कन्वर्टर देखें।',
  ],
  'Recipe Scaler': [
    'Escalador de Recetas',
    'Adaptateur de Portions',
    'Rezept-Skalierer',
    'रेसिपी स्केलर',
  ],
  'Increase or decrease ingredient amounts for any serving size.': [
    'Aumente o disminuya las cantidades de ingredientes para cualquier número de porciones.',
    'Augmentez ou réduisez les quantités d’ingrédients pour n’importe quel nombre de portions.',
    'Erhöhen oder verringern Sie Zutatenmengen für jede gewünschte Portionsgröße.',
    'किसी भी सर्विंग आकार के लिए सामग्री की मात्रा बढ़ाएं या घटाएं।',
  ],
  'Cups to Grams Converter': [
    'Convertidor de Tazas a Gramos',
    'Convertisseur Tasses en Grammes',
    'Tassen-in-Gramm-Umrechner',
    'कप से ग्राम कन्वर्टर',
  ],
  'Convert cups to grams for different ingredients.': [
    'Convierta tazas a gramos según la densidad de cada ingrediente.',
    'Convertissez des tasses en grammes selon chaque ingrédient.',
    'Rechnen Sie Tassen für verschiedene Zutaten präzise in Gramm um.',
    'विभिन्न सामग्रियों के लिए कप को ग्राम में बदलें।',
  ],
  'Grams to Cups Converter': [
    'Convertidor de Gramos a Tazas',
    'Convertisseur Grammes en Tasses',
    'Gramm-in-Tassen-Umrechner',
    'ग्राम से कप कन्वर्टर',
  ],
  'Convert grams to cups for baking and cooking ingredients.': [
    'Convierta gramos a tazas para ingredientes de repostería y cocina.',
    'Convertissez des grammes en tasses pour la pâtisserie et la cuisine.',
    'Rechnen Sie Gramm in Tassen für Back- und Kochzutaten um.',
    'बेकिंग और खाना पकाने की सामग्री के लिए ग्राम को कप में बदलें।',
  ],
  'Tablespoons to Grams Converter': [
    'Convertidor de Cucharadas a Gramos',
    'Convertisseur Cuillères à Soupe en Grammes',
    'Esslöffel-in-Gramm-Umrechner',
    'बड़े चम्मच (Tbsp) से ग्राम कन्वर्टर',
  ],
  'Convert tablespoons to grams for accurate measurements.': [
    'Convierta cucharadas a gramos para obtener mediciones exactas.',
    'Convertissez des cuillères à soupe en grammes pour des mesures précises.',
    'Rechnen Sie Esslöffel in Gramm für genaue Küchenmessungen um.',
    'सटीक माप के लिए बड़े चम्मच (Tablespoons) को ग्राम में बदलें।',
  ],
  'Teaspoons to Milliliters Converter': [
    'Convertidor de Cucharaditas a Mililitros',
    'Convertisseur Cuillères à Café en Millilitres',
    'Teelöffel-in-Milliliter-Umrechner',
    'छोटे चम्मच (Tsp) से मिलीलीटर कन्वर्टर',
  ],
  'Convert teaspoons to milliliters quickly and easily.': [
    'Convierta cucharaditas a mililitros de forma rápida y sencilla.',
    'Convertissez des cuillères à café en millilitres rapidement et facilement.',
    'Rechnen Sie Teelöffel schnell und einfach in Milliliter um.',
    'छोटे चम्मच (Teaspoons) को जल्दी और आसानी से मिलीलीटर में बदलें।',
  ],
  'Cups to Milliliters Converter': [
    'Convertidor de Tazas a Mililitros',
    'Convertisseur Tasses en Millilitres',
    'Tassen-in-Milliliter-Umrechner',
    'कप से मिलीलीटर कन्वर्टर',
  ],
  'Convert cups to milliliters for liquid and dry ingredients.': [
    'Convierta tazas a mililitros para ingredientes líquidos y secos.',
    'Convertissez des tasses en millilitres pour ingrédients liquides et secs.',
    'Rechnen Sie Tassen für flüssige und trockene Zutaten in Milliliter um.',
    'तरल और सूखी सामग्री के लिए कप को मिलीलीटर में बदलें।',
  ],
  'Ounces to Grams Converter': [
    'Convertidor de Onzas a Gramos',
    'Convertisseur Onces en Grammes',
    'Unzen-in-Gramm-Umrechner',
    'औंस से ग्राम कन्वर्टर',
  ],
  'Convert ounces to grams for cooking and baking.': [
    'Convierta onzas a gramos para cocinar y hornear.',
    'Convertissez des onces en grammes pour la cuisine et la pâtisserie.',
    'Rechnen Sie Unzen zum Kochen und Backen in Gramm um.',
    'खाना पकाने और बेकिंग के लिए औंस को ग्राम में बदलें।',
  ],
  'Butter Measurement Converter': [
    'Convertidor de Medidas de Mantequilla',
    'Convertisseur de Mesures de Beurre',
    'Butter-Maßumrechner',
    'मक्खन माप कन्वर्टर',
  ],
  'Convert butter measurements (cups, tablespoons, grams, etc.).': [
    'Convierta medidas de mantequilla (barras, tazas, cucharadas, gramos, etc.).',
    'Convertissez les mesures de beurre (tasses, cuillères à soupe, grammes, etc.).',
    'Rechnen Sie Buttermaße um (Tassen, Esslöffel, Gramm usw.).',
    'मक्खन के माप बदलें (कप, बड़े चम्मच, ग्राम, आदि)।',
  ],
  'Open Calculator': [
    'Abrir Calculadora',
    'Ouvrir la Calculatrice',
    'Rechner öffnen',
    'कैलकुलेटर खोलें',
  ],
  'Find the right recipe converter for your needs.': [
    'Encuentre el convertidor de recetas adecuado para sus necesidades.',
    'Trouvez le convertisseur de recettes adapté à vos besoins.',
    'Finden Sie den passenden Rezept-Umrechner für Ihren Bedarf.',
    'अपनी आवश्यकता के अनुसार सही रेसिपी कन्वर्टर चुनें।',
  ],
  'Adjust recipes for different servings': [
    'Ajuste recetas para diferentes porciones',
    'Ajustez les recettes pour différents nombres de portions',
    'Rezepte für verschiedene Portionsgrößen anpassen',
    'विभिन्न सर्विंग्स के लिए रेसिपी समायोजित करें',
  ],
  'Ingredient Conversions': [
    'Conversión de Ingredientes',
    'Conversions d’Ingrédients',
    'Zutaten-Umrechnungen',
    'सामग्री रूपांतरण',
  ],
  'Convert between different ingredients': [
    'Convierta según la densidad de cada ingrediente',
    'Convertissez selon la densité des différents ingrédients',
    'Zwischen verschiedenen Zutaten nach Dichte umrechnen',
    'विभिन्न सामग्रियों के बीच रूपांतरण करें',
  ],
  'Volume Conversions': [
    'Conversiones de Volumen',
    'Conversions de Volume',
    'Volumen-Umrechnungen',
    'आयतन रूपांतरण',
  ],
  'Cups, tablespoons, teaspoons, milliliters and more': [
    'Tazas, cucharadas, cucharaditas, mililitros y más',
    'Tasses, cuillères à soupe, cuillères à café, millilitres et plus',
    'Tassen, Esslöffel, Teelöffel, Milliliter und mehr',
    'कप, बड़े चम्मच, छोटे चम्मच, मिलीलीटर और अधिक',
  ],
  'Weight Conversions': [
    'Conversiones de Peso',
    'Conversions de Poids',
    'Gewichts-Umrechnungen',
    'वजन रूपांतरण',
  ],
  'Grams, ounces, pounds and more': [
    'Gramos, onzas, libras y más',
    'Grammes, onces, livres et plus',
    'Gramm, Unzen, Pfund und mehr',
    'ग्राम, औंस, पाउंड और अधिक',
  ],
  'Baking Measurements': [
    'Medidas de Repostería',
    'Mesures de Pâtisserie',
    'Backmaße',
    'बेकिंग माप',
  ],
  'Flour, sugar, butter and baking ingredients': [
    'Harina, azúcar, mantequilla e ingredientes para hornear',
    'Farine, sucre, beurre et ingrédients de pâtisserie',
    'Mehl, Zucker, Butter und Backzutaten',
    'आटा, चीनी, मक्खन और बेकिंग सामग्री',
  ],
  'Cooking Measurements': [
    'Medidas de Cocina',
    'Mesures de Cuisine',
    'Kochmaße',
    'खाना पकाने के माप',
  ],
  'Common kitchen measurements': [
    'Medidas comunes de cocina',
    'Mesures courantes en cuisine',
    'Übliche Küchenmaße',
    'सामान्य रसोई माप',
  ],
  'Make Recipe Measurements': [
    'Haga las Medidas de sus Recetas',
    'Rendez les Mesures de Recettes',
    'Machen Sie Rezept-Messungen',
    'रेसिपी माप को बनाएं',
  ],
  Easier: ['Más Fáciles', 'Plus Simples', 'Einfacher', 'और आसान'],
  'Simple tools to help you cook, bake, and adjust recipes with confidence.': [
    'Herramientas sencillas para ayudarle a cocinar, hornear y ajustar recetas con confianza.',
    'Des outils simples pour cuisiner, pâtisser et adapter vos recettes en toute confiance.',
    'Einfache Werkzeuge, mit denen Sie sicher kochen, backen und Rezepte anpassen können.',
    'आत्मविश्वास के साथ खाना पकाने, बेक करने और रेसिपी समायोजित करने में मदद करने वाले सरल टूल्स।',
  ],
  'Adjust recipes for different serving sizes.': [
    'Ajuste recetas para diferentes tamaños de porción.',
    'Adaptez vos recettes à différents nombres de portions.',
    'Passen Sie Rezepte an unterschiedliche Portionsgrößen an.',
    'विभिन्न सर्विंग आकारों के लिए रेसिपी समायोजित करें।',
  ],
  'Easily scale ingredient amounts up or down without manual calculations.': [
    'Escale fácilmente las cantidades de ingredientes hacia arriba o hacia abajo sin cálculos manuales.',
    'Multipliez ou divisez facilement les quantités d’ingrédients sans calculs manuels.',
    'Skalieren Sie Zutatenmengen mühelos nach oben oder unten ohne manuelles Rechnen.',
    'बिना मैनुअल गणना के सामग्री की मात्रा को आसानी से बढ़ाएं या घटाएं।',
  ],
  'Convert ingredients using ingredient-specific measurements.': [
    'Convierta ingredientes utilizando densidades específicas por ingrediente.',
    'Convertissez les ingrédients grâce à des mesures propres à chaque aliment.',
    'Rechnen Sie Zutaten mit zutatenspezifischen Dichtewerten um.',
    'सामग्री-विशिष्ट मापों का उपयोग करके सामग्री बदलें।',
  ],
  'Get accurate conversions for flour, sugar, butter, and more.': [
    'Obtenga conversiones precisas para harina, azúcar, mantequilla y más.',
    'Obtenez des conversions précises pour la farine, le sucre, le beurre et plus encore.',
    'Erhalten Sie genaue Umrechnungen für Mehl, Zucker, Butter und mehr.',
    'आटा, चीनी, मक्खन और अन्य सामग्री के लिए सटीक रूपांतरण प्राप्त करें।',
  ],
  'Switch between common metric and US customary units.': [
    'Cambie entre unidades métricas comunes y unidades tradicionales de EE. UU.',
    'Basculez entre les unités métriques courantes et les unités américaines.',
    'Wechseln Sie zwischen gängigen metrischen und US-amerikanischen Einheiten.',
    'सामान्य मीट्रिक और अमेरिकी इकाइयों के बीच आसानी से स्विच करें।',
  ],
  'Convert between cups, grams, ounces, milliliters and more.': [
    'Convierta entre tazas, gramos, onzas, mililitros y más.',
    'Convertissez entre tasses, grammes, onces, millilitres et plus encore.',
    'Rechnen Sie zwischen Tassen, Gramm, Unzen, Millilitern und mehr um.',
    'कप, ग्राम, औंस, मिलीलीटर और अन्य के बीच रूपांतरण करें।',
  ],
  'Why ingredient-specific conversions matter': [
    'Por qué importan las conversiones específicas por ingrediente',
    'Pourquoi les conversions spécifiques aux ingrédients sont importantes',
    'Warum zutatenspezifische Umrechnungen wichtig sind',
    'सामग्री-विशिष्ट रूपांतरण क्यों महत्वपूर्ण हैं',
  ],
  'Not all ingredients have the same weight, even if they use the same cup measurement. A cup of flour is much lighter than a cup of sugar or butter. Using ingredient-specific conversions gives you more accurate results and better tasting recipes.': [
    'No todos los ingredientes pesan lo mismo, aunque ocupen la misma medida de taza. Una taza de harina es mucho más ligera que una taza de azúcar o mantequilla. Usar conversiones específicas por ingrediente le brinda resultados más precisos y mejores recetas.',
    'Tous les ingrédients n’ont pas le même poids pour un même volume en tasse. Une tasse de farine est beaucoup plus légère qu’une tasse de sucre ou de beurre. Utiliser des conversions spécifiques par ingrédient garantit des résultats plus précis.',
    'Nicht alle Zutaten haben dasselbe Gewicht, selbst wenn sie dieselbe Tassengröße füllen. Eine Tasse Mehl ist deutlich leichter als eine Tasse Zucker oder Butter. Zutatenspezifische Umrechnungen sorgen für präzisere Backergebnisse.',
    'सभी सामग्रियों का वजन एक समान नहीं होता, भले ही वे एक ही कप माप का उपयोग करें। एक कप आटा एक कप चीनी या मक्खन की तुलना में बहुत हल्का होता है। सामग्री-विशिष्ट रूपांतरण आपको अधिक सटीक परिणाम देते हैं।',
  ],
  '1 cup flour': ['1 taza de harina', '1 tasse de farine', '1 Tasse Mehl', '1 कप आटा'],
  '≈ 120 grams': ['≈ 120 gramos', '≈ 120 grammes', '≈ 120 Gramm', '≈ 120 ग्राम'],
  '1 cup sugar': ['1 taza de azúcar', '1 tasse de sucre', '1 Tasse Zucker', '1 कप चीनी'],
  '≈ 200 grams': ['≈ 200 gramos', '≈ 200 grammes', '≈ 200 Gramm', '≈ 200 ग्राम'],
  '1 cup butter': [
    '1 taza de mantequilla',
    '1 tasse de beurre',
    '1 Tasse Butter',
    '1 कप मक्खन',
  ],
  '≈ 227 grams': ['≈ 227 gramos', '≈ 227 grammes', '≈ 227 Gramm', '≈ 227 ग्राम'],
  '1 cup milk': ['1 taza de leche', '1 tasse de lait', '1 Tasse Milch', '1 कप दूध'],
  '≈ 240 grams': ['≈ 240 gramos', '≈ 240 grammes', '≈ 240 Gramm', '≈ 240 ग्राम'],
  'Related Links': [
    'Enlaces Relacionados',
    'Liens Associés',
    'Verwandte Links',
    'संबंधित लिंक',
  ],
  'Cooking Measurement Guide': [
    'Guía de Medidas de Cocina',
    'Guide des Mesures de Cuisine',
    'Leitfaden für Küchenmaße',
    'खाना पकाने के माप की गाइड',
  ],
  'Baking Ingredient Substitutions': [
    'Sustituciones de Ingredientes para Hornear',
    'Substitutions d’Ingrédients de Pâtisserie',
    'Ersatzzutaten beim Backen',
    'बेकिंग सामग्री के विकल्प',
  ],
  'US to Metric Conversion Guide': [
    'Guía de Conversión de EE. UU. a Métrico',
    'Guide de Conversion US vers Métrique',
    'Umrechnungsleitfaden US in Metrisch',
    'यूएस से मीट्रिक रूपांतरण गाइड',
  ],
  'Common Kitchen Measurements': [
    'Medidas Comunes de Cocina',
    'Mesures Courantes en Cuisine',
    'Häufige Küchenmaße',
    'सामान्य रसोई माप',
  ],
  'How to Scale a Recipe': [
    'Cómo Escalar una Receta',
    'Comment Adapter les Portions d’une Recette',
    'Wie man ein Rezept skaliert',
    'रेसिपी को कैसे स्केल करें',
  ],
  FAQ: ['Preguntas Frecuentes', 'FAQ', 'Häufige Fragen (FAQ)', 'सामान्य प्रश्न (FAQ)'],
  'Frequently Asked Questions': [
    'Preguntas Frecuentes',
    'Questions Fréquemment Posées',
    'Häufig gestellte Fragen',
    'अक्सर पूछे जाने वाले प्रश्न',
  ],
  'Are these conversions accurate for all ingredients?': [
    '¿Son precisas estas conversiones para todos los ingredientes?',
    'Ces conversions sont-elles précises pour tous les ingrédients ?',
    'Sind diese Umrechnungen für alle Zutaten genau?',
    'क्या ये रूपांतरण सभी सामग्रियों के लिए सटीक हैं?',
  ],
  'Why do different ingredients weigh different amounts?': [
    '¿Por qué diferentes ingredientes pesan cantidades distintas?',
    'Pourquoi différents ingrédients ont-ils des poids différents ?',
    'Warum wiegen verschiedene Zutaten unterschiedlich viel?',
    'विभिन्न सामग्रियों का वजन अलग-अलग क्यों होता है?',
  ],
  'Can I use these converters for baking?': [
    '¿Puedo usar estos convertidores para repostería y horneado?',
    'Puis-je utiliser ces convertisseurs pour la pâtisserie ?',
    'Kann ich diese Umrechner zum Backen verwenden?',
    'क्या मैं बेकिंग के लिए इन कन्वर्टर्स का उपयोग कर सकता हूँ?',
  ],
  'What measurement system is used?': [
    '¿Qué sistema de medición se utiliza?',
    'Quel système de mesure est utilisé ?',
    'Welches Maßsystem wird verwendet?',
    'किस माप प्रणाली का उपयोग किया जाता है?',
  ],
  'Can I scale an entire recipe?': [
    '¿Puedo escalar una receta completa?',
    'Puis-je adapter les portions d’une recette entière ?',
    'Kann ich ein ganzes Rezept skalieren?',
    'क्या मैं पूरी रेसिपी को स्केल कर सकता हूँ?',
  ],
  'How much does a gallon of milk weigh?': [
    '¿Cuánto pesa un galón de leche?',
    'Combien pèse un gallon de lait ?',
    'Wie viel wiegt eine Gallone Milch?',
    'एक गैलन दूध का वजन कितना होता है?',
  ],
  'How do you convert conventional oven temperature to an air fryer?': [
    '¿Cómo se convierte la temperatura del horno convencional a freidora de aire?',
    'Comment convertir la température d’un four traditionnel pour une friteuse à air (Air Fryer) ?',
    'Wie rechnet man Backofentemperaturen für die Heißluftfritteuse (Airfryer) um?',
    'पारंपरिक ओवन के तापमान को एयर फ्रायर में कैसे बदलें?',
  ],

  // Common Calculator UI Controls & Sections
  Calculate: ['Calcular', 'Calculer', 'Berechnen', 'गणना करें'],
  Reset: ['Restablecer', 'Réinitialiser', 'Zurücksetzen', 'रीसेट करें'],
  Clear: ['Limpiar', 'Effacer', 'Löschen', 'साफ़ करें'],
  Copy: ['Copiar', 'Copier', 'Kopieren', 'कॉपी करें'],
  Copied: ['Copiado', 'Copié', 'Kopiert', 'कॉपी हो गया'],
  Print: ['Imprimir', 'Imprimer', 'Drucken', 'प्रिंट करें'],
  Share: ['Compartir', 'Partager', 'Teilen', 'शेयर करें'],
  Download: ['Descargar', 'Télécharger', 'Herunterladen', 'डाउनलोड करें'],
  'Swap Units': [
    'Intercambiar Unidades',
    'Inverser les Unités',
    'Einheiten tauschen',
    'इकाइयां बदलें',
  ],
  From: ['De', 'De', 'Von', 'से (From)'],
  To: ['A', 'Vers', 'Nach', 'में (To)'],
  Value: ['Valor', 'Valeur', 'Wert', 'मान'],
  Result: ['Resultado', 'Résultat', 'Ergebnis', 'परिणाम'],
  Formula: ['Fórmula', 'Formule', 'Formel', 'सूत्र'],
  Example: ['Ejemplo', 'Exemple', 'Beispiel', 'उदाहरण'],
  'How to Use': [
    'Cómo Usar',
    'Comment Utiliser',
    'Anleitung zur Nutzung',
    'उपयोग कैसे करें',
  ],
  'How the Calculation Works': [
    'Cómo Funciona el Cálculo',
    'Comment Fonctionne le Calcul',
    'Wie die Berechnung funktioniert',
    'गणना कैसे काम करती है',
  ],
  'Understanding Your Result': [
    'Entendiendo su Resultado',
    'Comprendre Votre Résultat',
    'Ihr Ergebnis verstehen',
    'अपने परिणाम को समझें',
  ],
  'Related Calculators': [
    'Calculadoras Relacionadas',
    'Calculatrices Associées',
    'Verwandte Rechner',
    'संबंधित कैलकुलेटर',
  ],
  'Popular Conversions': [
    'Conversiones Populares',
    'Conversions Populaires',
    'Beliebte Umrechnungen',
    'लोकप्रिय रूपांतरण',
  ],
  'Common Values Reference Table': [
    'Tabla de Referencia de Valores Comunes',
    'Tableau de Référence des Valeurs Courantes',
    'Referenztabelle häufiger Werte',
    'सामान्य मान संदर्भ तालिका',
  ],
  'View Common Values Table ↓': [
    'Ver Tabla de Valores Comunes ↓',
    'Voir le Tableau des Valeurs Courantes ↓',
    'Tabelle häufiger Werte anzeigen ↓',
    'सामान्य मान तालिका देखें ↓',
  ],
  'Open Live Calculator': [
    'Abrir Calculadora Interactiva',
    'Ouvrir la Calculatrice Interactive',
    'Interaktiven Rechner öffnen',
    'लाइव कैलकुलेटर खोलें',
  ],
  'Hide Calculator': [
    'Ocultar Calculadora',
    'Masquer la Calculatrice',
    'Rechner ausblenden',
    'कैलकुलेटर छिपाएं',
  ],

  // Unit Converter Categories & Units
  Length: ['Longitud', 'Longueur', 'Länge', 'लंबाई'],
  Weight: ['Peso', 'Poids', 'Gewicht', 'वजन'],
  Temperature: ['Temperatura', 'Température', 'Temperatur', 'तापमान'],
  Volume: ['Volumen', 'Volume', 'Volumen', 'आयतन'],
  Area: ['Área', 'Surface', 'Fläche', 'क्षेत्रफल'],
  Speed: ['Velocidad', 'Vitesse', 'Geschwindigkeit', 'गति'],
  'Fuel Economy': [
    'Consumo de Combustible',
    'Consommation de Carburant',
    'Kraftstoffverbrauch',
    'ईंधन दक्षता',
  ],
  Cooking: ['Cocina', 'Cuisine', 'Kochen', 'रसोई माप'],
  Data: ['Datos Digitales', 'Données Numériques', 'Datenmenge', 'डेटा'],
  Pressure: ['Presión', 'Pression', 'Druck', 'दबाव'],
  Energy: ['Energía', 'Énergie', 'Energie', 'ऊर्जा'],
  Power: ['Potencia', 'Puissance', 'Leistung', 'शक्ति (Power)'],
  Millimeters: ['Milímetros', 'Millimètres', 'Millimeter', 'मिलीमीटर'],
  Centimeters: ['Centímetros', 'Centimètres', 'Zentimeter', 'सेंटीमीटर'],
  Meters: ['Metros', 'Mètres', 'Meter', 'मीटर'],
  Kilometers: ['Kilómetros', 'Kilomètres', 'Kilometer', 'किलोमीटर'],
  Inches: ['Pulgadas', 'Pouces', 'Zoll (Inches)', 'इंच'],
  Feet: ['Pies', 'Pieds', 'Fuß (Feet)', 'फीट'],
  Yards: ['Yardas', 'Yards', 'Yards', 'गज (Yards)'],
  Miles: ['Millas', 'Miles', 'Meilen', 'मील'],
  Kilograms: ['Kilogramos', 'Kilogrammes', 'Kilogramm', 'किलोग्राम'],
  Pounds: ['Libras', 'Livres', 'Pfund', 'पाउंड'],
  Milligrams: ['Miligramos', 'Milligrammes', 'Milligramm', 'मिलीग्राम'],
  'Metric Tons': [
    'Toneladas Métricas',
    'Tonnes Métriques',
    'Metrische Tonnen',
    'मीट्रिक टन',
  ],
  Stone: ['Stone (Piedras)', 'Stone', 'Stone', 'स्टोन (Stone)'],
  Celsius: ['Celsius (°C)', 'Celsius (°C)', 'Celsius (°C)', 'सेल्सियस (°C)'],
  Fahrenheit: [
    'Fahrenheit (°F)',
    'Fahrenheit (°F)',
    'Fahrenheit (°F)',
    'फ़ारेनहाइट (°F)',
  ],
  Kelvin: ['Kelvin (K)', 'Kelvin (K)', 'Kelvin (K)', 'केल्विन (K)'],
  Liters: ['Litros', 'Litres', 'Liter', 'लीटर'],
  'US Gallons': [
    'Galones estadounidenses',
    'Gallons US',
    'US-Gallonen',
    'यूएस गैलन',
  ],
  'US Quarts': [
    'Cuartos estadounidenses',
    'Quarts US',
    'US-Quarts',
    'यूएस क्वार्ट',
  ],
  'US Pints': ['Pintas estadounidenses', 'Pintes US', 'US-Pints', 'यूएस पिंट'],
  'US Cups': ['Tazas estadounidenses', 'Tasses US', 'US-Tassen', 'यूएस कप'],
  'US Fluid Ounces': [
    'Onzas líquidas (EE. UU.)',
    'Onces liquides US',
    'US-Flüssigunzen',
    'यूएस फ्लूइड औंस',
  ],

  // Flooring & Construction Calculators
  'Flooring Project Calculator': [
    'Calculadora de Proyectos de Pisos',
    'Calculateur de Projet de Revêtement de Sol',
    'Bodenbelags-Projektrechner',
    'फ्लोरिंग प्रोजेक्ट कैलकुलेटर',
  ],
  'Laminate Flooring': [
    'Piso Laminado',
    'Sol Stratifié',
    'Laminatboden',
    'लैमिनेट फ्लोरिंग',
  ],
  'Solid / Engineered Hardwood': [
    'Madera Maciza / Ingeniería',
    'Parquet Massif / Contrecollé',
    'Massivholz / Fertigparkett',
    'हार्डवुड फ्लोरिंग',
  ],
  'Luxury Vinyl Plank (LVP)': [
    'Tablones de Vinilo de Lujo (LVP)',
    'Lames de Vinyle de Luxe (LVP)',
    'Design-Vinylboden (LVP)',
    'लक्जरी विनाइल प्लैंक (LVP)',
  ],
  'Ceramic / Porcelain Tile': [
    'Azulejo de Cerámica / Porcelanato',
    'Carrelage Céramique / Grès Cérame',
    'Keramik- / Feinsteinzeugfliesen',
    'सिरेमिक / पोर्सिलेन टाइल',
  ],
  'Broadloom / Carpet Tiles': [
    'Alfombra en Rollo / Losetas',
    'Moquette en Rouleau / Dalles',
    'Teppichboden / Teppichfliesen',
    'कार्पेट / कालीन टाइल्स',
  ],
  'How to measure a room?': [
    '¿Cómo medir una habitación?',
    'Comment mesurer une pièce ?',
    'Wie misst man einen Raum aus?',
    'कमरे को कैसे मापें?',
  ],
  'What is waste allowance?': [
    '¿Qué es el margen de desperdicio?',
    'Qu’est-ce que la marge de perte ?',
    'Was ist der Verschnittzuschlag?',
    'अपव्यय भत्ता (Waste Allowance) क्या है?',
  ],
  'How is the cost estimated?': [
    '¿Cómo se estima el costo?',
    'Comment le coût est-il estimé ?',
    'Wie werden die Kosten geschätzt?',
    'लागत का अनुमान कैसे लगाया जाता है?',
  ],
  'Common flooring materials': [
    'Materiales comunes para pisos',
    'Matériaux de sol courants',
    'Gängige Bodenbeläge',
    'सामान्य फ्लोरिंग सामग्री',
  ],
  'Room Dimensions': [
    'Dimensiones de la Habitación',
    'Dimensions de la Pièce',
    'Raumabmessungen',
    'कमरे के आयाम',
  ],
  'Materials & Waste': [
    'Materiales y Desperdicio',
    'Matériaux et Pertes',
    'Material & Verschnitt',
    'सामग्री और अपव्यय',
  ],
  'Cost Estimate': [
    'Estimación de Costos',
    'Estimation des Coûts',
    'Kostenschätzung',
    'लागत अनुमान',
  ],
  'Total Material Needed': [
    'Material Total Necesario',
    'Matériau Total Nécessaire',
    'Gesamter Materialbedarf',
    'कुल आवश्यक सामग्री',
  ],
  'Estimated Total Cost': [
    'Costo Total Estimado',
    'Coût Total Estimé',
    'Geschätzte Gesamtkosten',
    'अनुमानित कुल लागत',
  ],
  'Room Area': [
    'Área de la Habitación',
    'Surface de la Pièce',
    'Raumfläche',
    'कमरे का क्षेत्रफल',
  ],
  'Waste Allowance': [
    'Margen de Desperdicio',
    'Marge de Perte',
    'Verschnittzuschlag',
    'अपव्यय भत्ता',
  ],

  // All Calculators, Guides, About, Contact, Privacy
  'All Calculators Directory': [
    'Directorio de Todas las Calculadoras',
    'Répertoire de Toutes les Calculatrices',
    'Verzeichnis aller Rechner',
    'सभी कैलकुलेटर निर्देशिका',
  ],
  'Search calculators...': [
    'Buscar calculadoras...',
    'Rechercher des calculatrices...',
    'Rechner suchen...',
    'कैलकुलेटर खोजें...',
  ],
  'About Us': [
    'Sobre Nosotros',
    'À Propos de Nous',
    'Über Uns',
    'हमारे बारे में',
  ],
  'Contact Us': [
    'Contáctenos',
    'Contactez-Nous',
    'Kontaktieren Sie uns',
    'संपर्क करें',
  ],
  'Conversion Charts': [
    'Tablas de Conversión',
    'Tableaux de Conversion',
    'Umrechnungstabellen',
    'रूपांतरण चार्ट',
  ],
  Sitemap: ['Mapa del Sitio', 'Plan du Site', 'Sitemap', 'साइटमैप'],
  Disclaimer: [
    'Aviso Legal',
    'Clause de Non-Responsabilité',
    'Haftungsausschluss',
    'अस्वीकरण (Disclaimer)',
  ],
  Resources: ['Recursos', 'Ressources', 'Ressourcen', 'संसाधन'],
  Calculators: ['Calculadoras', 'Calculatrices', 'Rechner', 'कैलकुलेटर'],
  'Unit Converters': [
    'Convertidores de Unidades',
    'Convertisseurs d’Unités',
    'Einheitenumrechner',
    'यूनिट कन्वर्टर',
  ],
  'Percentage Calculators': [
    'Calculadoras de Porcentajes',
    'Calculatrices de Pourcentage',
    'Prozentrechner',
    'प्रतिशत कैलकुलेटर',
  ],
  'Health Calculators': [
    'Calculadoras de Salud',
    'Calculatrices de Santé',
    'Gesundheitsrechner',
    'स्वास्थ्य कैलकुलेटर',
  ],

  // SingleCalculatorPageShell & CategoryHubPageClient UI Strings
  'Live Result': [
    'Resultado en Vivo',
    'Résultat en Direct',
    'Live-Ergebnis',
    'लाइव परिणाम',
  ],
  'Your result': [
    'Su resultado',
    'Votre résultat',
    'Ihr Ergebnis',
    'आपका परिणाम',
  ],
  'is:': ['es:', 'est :', 'ist:', 'है:'],
  'Copy result': [
    'Copiar resultado',
    'Copier le résultat',
    'Ergebnis kopieren',
    'परिणाम कॉपी करें',
  ],
  'Copied!': ['¡Copiado!', 'Copié !', 'Kopiert!', 'कॉपी हो गया!'],
  'Formula & Live Calculation:': [
    'Fórmula y Cálculo en Vivo:',
    'Formule et Calcul en Direct :',
    'Formel & Live-Berechnung:',
    'सूत्र और लाइव गणना:',
  ],
  'Jump to:': ['Ir a:', 'Aller à :', 'Springen zu:', 'यहाँ जाएं:'],
  'Formula & Example': [
    'Fórmula y Ejemplo',
    'Formule et Exemple',
    'Formel & Beispiel',
    'सूत्र और उदाहरण',
  ],
  'How It Works': [
    'Cómo Funciona',
    'Comment Ça Marche',
    'Funktionsweise',
    'यह कैसे काम करता है',
  ],
  FAQs: [
    'Preguntas Frecuentes',
    'FAQ',
    'Häufige Fragen',
    'सामान्य प्रश्न (FAQs)',
  ],
  'Share Calculator': [
    'Compartir Calculadora',
    'Partager la Calculatrice',
    'Rechner teilen',
    'कैलकुलेटर शेयर करें',
  ],
  'Link Copied!': [
    '¡Enlace Copiado!',
    'Lien Copié !',
    'Link kopiert!',
    'लिंक कॉपी हो गया!',
  ],
  '100% Local Browser Calculation': [
    'Cálculo 100% Local en el Navegador',
    'Calcul 100 % Local dans le Navigateur',
    '100 % Lokale Browser-Berechnung',
    '100% लोकल ब्राउज़र गणना',
  ],
  'Reference Scenario': [
    'Escenario de Referencia',
    'Scénario de Référence',
    'Referenzszenario',
    'संदर्भ परिदृश्य',
  ],
  'Scale / Factor': [
    'Escala / Factor',
    'Échelle / Facteur',
    'Skala / Faktor',
    'स्केल / गुणक',
  ],
  'Calculated Value': [
    'Valor Calculado',
    'Valeur Calculée',
    'Berechneter Wert',
    'गणना किया गया मान',
  ],
  'Formula / Verification Note': [
    'Fórmula / Nota de Verificación',
    'Formule / Note de Vérification',
    'Formel / Prüfhinweis',
    'सूत्र / सत्यापन नोट',
  ],
  'Half Scale (0.50× Baseline)': [
    'Mitad de Escala (0.50× Base)',
    'Demi-Échelle (0,50× Base)',
    'Halber Maßstab (0,50× Basis)',
    'आधा स्केल (0.50× आधार)',
  ],
  '50% of Current Result': [
    '50% del Resultado Actual',
    '50 % du Résultat Actuel',
    '50 % des aktuellen Ergebnisses',
    'वर्तमान परिणाम का 50%',
  ],
  'Reduced Scale (−10% Sensitivity)': [
    'Escala Reducida (−10% Sensibilidad)',
    'Échelle Réduite (−10 % Sensibilité)',
    'Reduzierter Maßstab (−10 % Sensitivität)',
    'घटाया गया स्केल (−10% संवेदनशीलता)',
  ],
  '90% of Current Result': [
    '90% del Resultado Actual',
    '90 % du Résultat Actuel',
    '90 % des aktuellen Ergebnisses',
    'वर्तमान परिणाम का 90%',
  ],
  'Active Calculation Result (1.00×)': [
    'Resultado del Cálculo Activo (1.00×)',
    'Résultat du Calcul Actif (1,00×)',
    'Aktives Berechnungsergebnis (1,00×)',
    'सक्रिय गणना परिणाम (1.00×)',
  ],
  '100% Baseline': [
    '100% Línea Base',
    '100 % Valeur de Base',
    '100 % Basiswert',
    '100% आधार मान',
  ],
  'Increased Scale (+10% Sensitivity)': [
    'Escala Aumentada (+10% Sensibilidad)',
    'Échelle Augmentée (+10 % Sensibilité)',
    'Erhöhter Maßstab (+10 % Sensitivität)',
    'बढ़ाया गया स्केल (+10% संवेदनशीलता)',
  ],
  '110% of Current Result': [
    '110% del Resultado Actual',
    '110 % du Résultat Actuel',
    '110 % des aktuellen Ergebnisses',
    'वर्तमान परिणाम का 110%',
  ],
  'Double Scale (2.00× Baseline)': [
    'Doble Escala (2.00× Base)',
    'Double Échelle (2,00× Base)',
    'Doppelter Maßstab (2,00× Basis)',
    'दोगुना स्केल (2.00× आधार)',
  ],
  '200% of Current Result': [
    '200% del Resultado Actual',
    '200 % du Résultat Actuel',
    '200 % des aktuellen Ergebnisses',
    'वर्तमान परिणाम का 200%',
  ],
  'Value to Convert': [
    'Valor a Convertir',
    'Valeur à Convertir',
    'Umzurechnender Wert',
    'बदलने के लिए मान',
  ],
  'From Unit': [
    'Unidad de Origen',
    'Unité de Départ',
    'Ausgangseinheit',
    'प्रारंभिक इकाई (From)',
  ],
  'To Unit': [
    'Unidad de Destino',
    'Unité d’Arrivée',
    'Zieleinheit',
    'लक्ष्य इकाई (To)',
  ],
  'Convert & Save to History': [
    'Convertir y Guardar en el Historial',
    'Convertir et Enregistrer dans l’Historique',
    'Umrechnen & im Verlauf speichern',
    'बदलें और इतिहास में सहेजें',
  ],
  'Recent Conversions (Stored in this browser)': [
    'Conversiones Recientes (Guardadas en este navegador)',
    'Conversions Récentes (Enregistrées dans ce navigateur)',
    'Letzte Umrechnungen (In diesem Browser gespeichert)',
    'हाल के रूपांतरण (इस ब्राउज़र में सहेजे गए)',
  ],
  'On-page pair presets · Zero duplicate URLs': [
    'Pares predefinidos en página · Cero URLs duplicadas',
    'Paires prédéfinies sur la page · Zéro URL dupliquée',
    'Direkte Einheitenpaare · Keine doppelten URLs',
    'ऑन-पेज प्रीसेट जोड़े · कोई डुप्लिकेट URL नहीं',
  ],
  Active: ['Activo', 'Actif', 'Aktiv', 'सक्रिय'],
  'Load ⇄': ['Cargar ⇄', 'Charger ⇄', 'Laden ⇄', 'लोड करें ⇄'],
  Load: ['Cargar', 'Charger', 'Laden', 'लोड करें'],
  'Conversion Query': [
    'Consulta de Conversión',
    'Requête de Conversion',
    'Umrechnungsabfrage',
    'रूपांतरण प्रश्न',
  ],
  'Input Value': [
    'Valor de Entrada',
    'Valeur d’Entrée',
    'Eingabewert',
    'इनपुट मान',
  ],
  'Converted Output': [
    'Resultado Convertido',
    'Résultat Converti',
    'Umgerechnetes Ergebnis',
    'परिवर्तित परिणाम',
  ],
  'Formula Working': [
    'Desarrollo de la Fórmula',
    'Détail de la Formule',
    'Rechenweg der Formel',
    'सूत्र प्रक्रिया',
  ],
  Action: ['Acción', 'Action', 'Aktion', 'कार्रवाई'],
  Unit: ['Unidad', 'Unité', 'Einheit', 'इकाई'],
  Symbol: ['Símbolo', 'Symbole', 'Symbol', 'प्रतीक'],
  System: ['Sistema', 'Système', 'System', 'प्रणाली'],
  'Base Equivalent': [
    'Equivalente Base',
    'Équivalent de Base',
    'Basisäquivalent',
    'आधार समतुल्य',
  ],
  'Common Uses': [
    'Usos Comunes',
    'Utilisations Courantes',
    'Typische Anwendungen',
    'सामान्य उपयोग',
  ],
  'Key difference: ': [
    'Diferencia clave: ',
    'Différence clé : ',
    'Hauptunterschied: ',
    'मुख्य अंतर: ',
  ],
  'Other Canonical Unit Converters': [
    'Otros Convertidores de Unidades',
    'Autres Convertisseurs d’Unités',
    'Weitere Einheitenumrechner',
    'अन्य इकाई कन्वर्टर',
  ],
  'Instant Step-by-Step Formulas': [
    'Fórmulas Instantáneas Paso a Paso',
    'Formules Instantanées Étape par Étape',
    'Sofortige Schritt-für-Schritt-Formeln',
    'तुरंत चरण-दर-चरण सूत्र',
  ],
  'Jump to Subcategory:': [
    'Ir a Subcategoría:',
    'Aller à la Sous-Catégorie :',
    'Springen zu Unterkategorie:',
    'उप-श्रेणी पर जाएं:',
  ],
  'Formula Cheat Sheet': [
    'Hoja de Referencia de Fórmulas',
    'Aide-Mémoire des Formules',
    'Formel-Kurzübersicht',
    'सूत्र चीट शीट',
  ],
  'Open calculator': [
    'Abrir calculadora',
    'Ouvrir la calculatrice',
    'Rechner öffnen',
    'कैलकुलेटर खोलें',
  ],
  'Reset Filters': [
    'Restablecer Filtros',
    'Réinitialiser les Filtres',
    'Filter zurücksetzen',
    'फ़िल्टर रीसेट करें',
  ],
  'Measurement / Calculation': [
    'Medición / Cálculo',
    'Mesure / Calcul',
    'Messung / Berechnung',
    'माप / गणना',
  ],
  'Standard Formula / Factor': [
    'Fórmula / Factor Estándar',
    'Formule / Facteur Standard',
    'Standardformel / Faktor',
    'मानक सूत्र / गुणक',
  ],
  'Worked Benchmark Example': [
    'Ejemplo Práctico de Referencia',
    'Exemple de Référence Détaillé',
    'Berechnetes Referenzbeispiel',
    'हल किया गया उदाहरण',
  ],
  'Related Calculator Categories': [
    'Categorías de Calculadoras Relacionadas',
    'Catégories de Calculatrices Associées',
    'Verwandte Rechnerkategorien',
    'संबंधित कैलकुलेटर श्रेणियां',
  ],
  'Open Calculation Workspace': [
    'Abrir Espacio de Cálculo',
    'Ouvrir l’Espace de Calcul',
    'Berechnungs-Arbeitsbereich öffnen',
    'कैलकुलेशन वर्कस्पेस खोलें',
  ],
  All: ['Todos', 'Tous', 'Alle', 'सभी'],
  Tool: ['Herramienta', 'Outil', 'Werkzeug', 'टूल'],
  Tools: ['Herramientas', 'Outils', 'Werkzeuge', 'टूल्स'],
};

/**
 * Multi-word phrase patterns for dynamic/composite text across all calculators and guides.
 */
const PHRASE_DICTIONARY: Array<{
  en: string;
  es: string;
  fr: string;
  de: string;
  hi: string;
}> = [
  {
    en: 'Yes. Unlike basic volume converters that assume every ingredient weighs the same as water, our recipe converters use verified ingredient-specific bulk densities from USDA FoodData Central and King Arthur Baking charts (for example, 1 US cup of all-purpose flour is 120 g, granulated sugar is 200 g, and butter is 227 g).',
    es: 'Sí. A diferencia de los convertidores de volumen básicos que asumen que cada ingrediente pesa lo mismo que el agua, nuestros convertidores de recetas utilizan densidades específicas verificadas por USDA FoodData Central y King Arthur Baking (por ejemplo, 1 taza de harina equivale a 120 g, el azúcar granulado a 200 g y la mantequilla a 227 g).',
    fr: 'Oui. Contrairement aux convertisseurs de volume classiques qui supposent que chaque ingrédient a la densité de l’eau, nos convertisseurs utilisent les densités vérifiées de l’USDA FoodData Central et de King Arthur Baking (par exemple, 1 tasse de farine pèse 120 g, le sucre en poudre 200 g et le beurre 227 g).',
    de: 'Ja. Im Gegensatz zu einfachen Volumenumrechnern, die für jede Zutat die Dichte von Wasser annehmen, nutzen unsere Rezept-Umrechner geprüfte Schüttdichten von USDA FoodData Central und King Arthur Baking (z. B. 1 US-Tasse Weizenmehl = 120 g, Kristallzucker = 200 g, Butter = 227 g).',
    hi: 'हाँ। सामान्य आयतन कन्वर्टर्स के विपरीत जो हर सामग्री का वजन पानी के समान मानते हैं, हमारे रेसिपी कन्वर्टर USDA FoodData Central और King Arthur Baking के सत्यापित घनत्व मानों का उपयोग करते हैं (उदाहरण के लिए, 1 कप मैदा = 120 ग्राम, दानेदार चीनी = 200 ग्राम, और मक्खन = 227 ग्राम)।',
  },
  {
    en: 'Each ingredient has a different physical density and particle packing structure. Fine, airy powders like sifted flour or cocoa trap air between particles and weigh much less per cup than dense crystalline sugar, solid butter, or viscous liquids like honey (339 g per cup).',
    es: 'Cada ingrediente tiene una densidad física y una estructura de compactación diferente. Los polvos finos y aireados como la harina tamizada o el cacao atrapan aire entre sus partículas y pesan mucho menos por taza que el azúcar cristalino, la mantequilla sólida o líquidos densos como la miel (339 g por taza).',
    fr: 'Chaque ingrédient possède une densité physique et une structure de tassement différentes. Les poudres fines et aérées comme la farine tamisée ou le cacao retiennent l’air et pèsent beaucoup moins par tasse que le sucre cristallisé, le beurre solide ou le miel (339 g par tasse).',
    de: 'Jede Zutat hat eine eigene physikalische Dichte und Partikelstruktur. Feine, luftige Pulver wie gesiebtes Mehl oder Kakao schließen Luft ein und wiegen pro Tasse deutlich weniger als dichter Kristallzucker, feste Butter oder Honig (339 g pro Tasse).',
    hi: 'प्रत्येक सामग्री का भौतिक घनत्व और कण संरचना अलग होती है। छाने हुए आटे या कोको पाउडर जैसे महीन पाउडर हवा को रोकते हैं और प्रति कप चीनी, ठोस मक्खन या शहद (339 ग्राम प्रति कप) की तुलना में बहुत कम वजन रखते हैं।',
  },
  {
    en: 'Absolutely. Baking requires precise ratios of flour, fat, sugar, and liquids. Converting volumetric cups and spoons into grams lets you weigh ingredients on a digital kitchen scale for repeatable bakery-grade results.',
    es: 'Por supuesto. La repostería requiere proporciones exactas de harina, grasa, azúcar y líquidos. Convertir tazas y cucharas volumétricas a gramos le permite pesar los ingredientes en una báscula digital para obtener resultados profesionales repetibles.',
    fr: 'Absolument. La pâtisserie exige des proportions exactes de farine, de matière grasse, de sucre et de liquide. Convertir les tasses et cuillères en grammes vous permet de peser vos ingrédients sur une balance numérique avec une précision professionnelle.',
    de: 'Absolut. Backen erfordert präzise Verhältnisse von Mehl, Fett, Zucker und Flüssigkeit. Durch die Umrechnung von Tassen und Löffeln in Gramm können Sie alle Zutaten auf einer digitalen Küchenwaage für perfekte Ergebnisse abwiegen.',
    hi: 'बिल्कुल। बेकिंग में आटा, वसा, चीनी और तरल पदार्थों के सटीक अनुपात की आवश्यकता होती है। कप और चम्मच को ग्राम में बदलने से आप डिजिटल किचन स्केल पर सामग्री को सटीक रूप से तौल सकते हैं।',
  },
  {
    en: 'By default, conversions use US Customary kitchen units (1 US cup = 236.59 mL, 1 tbsp = 14.79 mL, 1 tsp = 4.93 mL). Inside the interactive calculator, you can switch between US Customary (236.59 mL), US Legal/FDA (240 mL), and Commonwealth Metric cups (250 mL).',
    es: 'Por defecto, las conversiones utilizan unidades de cocina tradicionales de EE. UU. (1 taza EE. UU. = 236.59 mL, 1 cucharada = 14.79 mL, 1 cucharadita = 4.93 mL). En la calculadora interactiva puede cambiar entre taza tradicional de EE. UU. (236.59 mL), taza legal FDA (240 mL) y taza métrica (250 mL).',
    fr: 'Par défaut, les conversions utilisent les unités américaines (1 tasse US = 236,59 mL, 1 c. à soupe = 14,79 mL, 1 c. à café = 4,93 mL). Dans la calculatrice interactive, vous pouvez basculer entre la tasse US (236,59 mL), la tasse légale FDA (240 mL) et la tasse métrique (250 mL).',
    de: 'Standardmäßig nutzen die Umrechnungen US-amerikanische Küchenmaße (1 US-Tasse = 236,59 mL, 1 EL = 14,79 mL, 1 TL = 4,93 mL). Im interaktiven Rechner können Sie zwischen US Customary (236,59 mL), US Legal/FDA (240 mL) und metrischen Tassen (250 mL) wechseln.',
    hi: 'डिफ़ॉल्ट रूप से, रूपांतरण यूएस कस्टमरी किचन इकाइयों (1 यूएस कप = 236.59 mL, 1 बड़ा चम्मच = 14.79 mL, 1 छोटा चम्मच = 4.93 mL) का उपयोग करते हैं। इंटरैक्टिव कैलकुलेटर में आप यूएस कस्टमरी (236.59 mL), यूएस लीगल (240 mL) और मीट्रिक कप (250 mL) के बीच स्विच कर सकते हैं।',
  },
  {
    en: 'Yes. Open the Recipe Scaler to enter your original and desired serving counts (or click ½×, 2×, or 3×). Every ingredient line is automatically scaled and converted into your target unit, ready to copy, print, or download as a shopping list.',
    es: 'Sí. Abra el Escalador de Recetas para ingresar las porciones originales y deseadas (o haga clic en ½×, 2× o 3×). Cada línea de ingrediente se escala y convierte automáticamente a su unidad objetivo, lista para copiar, imprimir o descargar.',
    fr: 'Oui. Ouvrez l’Adaptateur de Portions pour saisir le nombre de portions d’origine et souhaité (ou cliquez sur ½×, 2× ou 3×). Chaque ligne d’ingrédient est automatiquement ajustée et convertie dans l’unité choisie, prête à être copiée, imprimée ou téléchargée.',
    de: 'Ja. Öffnen Sie den Rezept-Skalierer, um die ursprüngliche und gewünschte Portionsanzahl einzugeben (oder klicken Sie auf ½×, 2× oder 3×). Jede Zutatenzeile wird automatisch skaliert und in Ihre Zieleinheit umgerechnet.',
    hi: 'हाँ। अपनी मूल और वांछित सर्विंग संख्या दर्ज करने के लिए रेसिपी स्केलर खोलें (या ½×, 2×, या 3× पर क्लिक करें)। प्रत्येक सामग्री स्वचालित रूप से स्केल और परिवर्तित हो जाती है, जिसे आप कॉपी, प्रिंट या डाउनलोड कर सकते हैं।',
  },
  {
    en: 'Enter a number, pick your starting and target units, or select a popular pair below.',
    es: 'Ingrese un número, elija sus unidades de origen y destino, o seleccione un par popular a continuación.',
    fr: 'Saisissez un nombre, choisissez vos unités de départ et d’arrivée, ou sélectionnez une paire populaire ci-dessous.',
    de: 'Geben Sie eine Zahl ein, wählen Sie Ausgangs- und Zieleinheit oder klicken Sie unten auf ein beliebtes Paar.',
    hi: 'एक संख्या दर्ज करें, अपनी प्रारंभिक और लक्ष्य इकाइयां चुनें, या नीचे दिए गए लोकप्रिय जोड़े में से चुनें।',
  },
  {
    en: 'Select a unit pair below to load its exact conversion factor and sample calculation above.',
    es: 'Seleccione un par de unidades a continuación para cargar su factor de conversión exacto y un cálculo de ejemplo arriba.',
    fr: 'Sélectionnez une paire d’unités ci-dessous pour charger son facteur de conversion exact et un exemple de calcul.',
    de: 'Wählen Sie unten ein Einheitenpaar aus, um den exakten Umrechnungsfaktor und ein Rechenbeispiel zu laden.',
    hi: 'सटीक रूपांतरण गुणक और उदाहरण गणना लोड करने के लिए नीचे एक इकाई जोड़ी चुनें।',
  },
  {
    en: 'Reference symbols, measurement systems, base unit factors, and practical applications for each unit.',
    es: 'Símbolos de referencia, sistemas de medición, factores de unidad base y aplicaciones prácticas para cada unidad.',
    fr: 'Symboles de référence, systèmes de mesure, facteurs d’unité de base et applications pratiques pour chaque unité.',
    de: 'Referenzsymbole, Maßsysteme, Basiseinheiten-Faktoren und praktische Anwendungen für jede Einheit.',
    hi: 'प्रत्येक इकाई के लिए संदर्भ प्रतीक, माप प्रणाली, आधार इकाई गुणक और व्यावहारिक उपयोग।',
  },
  {
    en: 'Side-by-side comparison of commonly confused measurement units.',
    es: 'Comparación lado a lado de unidades de medida que suelen confundirse.',
    fr: 'Comparaison côte à côte des unités de mesure souvent confondues.',
    de: 'Direkter Vergleich häufig verwechselter Maßeinheiten.',
    hi: 'अक्सर भ्रमित होने वाली माप इकाइयों की आमने-सामने तुलना।',
  },
  {
    en: 'Compare proportional scaling and benchmark reference values around your current calculation.',
    es: 'Compare el escalado proporcional y los valores de referencia alrededor de su cálculo actual.',
    fr: 'Comparez l’échelle proportionnelle et les valeurs de référence autour de votre calcul actuel.',
    de: 'Vergleichen Sie proportionale Skalierungen und Referenzwerte rund um Ihre aktuelle Berechnung.',
    hi: 'अपनी वर्तमान गणना के आसपास आनुपातिक स्केलिंग और संदर्भ मानों की तुलना करें।',
  },
  {
    en: 'How to use this calculator',
    es: 'Cómo usar esta calculadora',
    fr: 'Comment utiliser cette calculatrice',
    de: 'So verwenden Sie diesen Rechner',
    hi: 'इस कैलकुलेटर का उपयोग कैसे करें',
  },
  {
    en: 'How the calculation works',
    es: 'Cómo funciona el cálculo',
    fr: 'Comment fonctionne le calcul',
    de: 'Wie die Berechnung funktioniert',
    hi: 'गणना कैसे काम करती है',
  },
  {
    en: 'Understanding your result',
    es: 'Cómo interpretar su resultado',
    fr: 'Comprendre votre résultat',
    de: 'Ihr Ergebnis verstehen',
    hi: 'अपने परिणाम को समझें',
  },
  {
    en: 'Need a different calculator?',
    es: '¿Necesita una calculadora diferente?',
    fr: 'Besoin d’une autre calculatrice ?',
    de: 'Brauchen Sie einen anderen Rechner?',
    hi: 'क्या आपको किसी अन्य कैलकुलेटर की आवश्यकता है?',
  },
  {
    en: 'Formula & Worked Example',
    es: 'Fórmula y Ejemplo Práctico',
    fr: 'Formule et Exemple Détaillé',
    de: 'Formel & Rechenbeispiel',
    hi: 'सूत्र और हल किया गया उदाहरण',
  },
  {
    en: 'Quick Reference Table',
    es: 'Tabla de Referencia Rápida',
    fr: 'Tableau de Référence Rapide',
    de: 'Schnellreferenztabelle',
    hi: 'त्वरित संदर्भ तालिका',
  },
  {
    en: 'Quick-Reference & Sensitivity Table',
    es: 'Tabla de Referencia Rápida y Sensibilidad',
    fr: 'Tableau de Référence Rapide et de Sensibilité',
    de: 'Schnellreferenz- & Sensitivitätstabelle',
    hi: 'त्वरित संदर्भ और संवेदनशीलता तालिका',
  },
  {
    en: 'Quick-Reference Formulas & Conversion Chart',
    es: 'Fórmulas de Referencia Rápida y Tabla de Conversión',
    fr: 'Formules de Référence Rapide et Tableau de Conversion',
    de: 'Schnellreferenz-Formeln & Umrechnungstabelle',
    hi: 'त्वरित संदर्भ सूत्र और रूपांतरण चार्ट',
  },
  {
    en: 'Copy Result',
    es: 'Copiar Resultado',
    fr: 'Copier le Résultat',
    de: 'Ergebnis kopieren',
    hi: 'परिणाम कॉपी करें',
  },
  {
    en: 'Share Link',
    es: 'Compartir Enlace',
    fr: 'Partager le Lien',
    de: 'Link teilen',
    hi: 'लिंक शेयर करें',
  },
  {
    en: 'All-Purpose Flour',
    es: 'Harina de Trigo Todo Uso',
    fr: 'Farine Tout Usage',
    de: 'Weizenmehl (Type 405/550)',
    hi: 'मैदा (All-Purpose Flour)',
  },
  {
    en: 'Granulated White Sugar',
    es: 'Azúcar Blanco Granulado',
    fr: 'Sucre Blanc en Poudre',
    de: 'Kristallzucker (Weißer Zucker)',
    hi: 'दानेदार सफेद चीनी',
  },
  {
    en: 'Butter (Salted or Unsalted)',
    es: 'Mantequilla (Con o Sin Sal)',
    fr: 'Beurre (Doux ou Demi-Sel)',
    de: 'Butter (Gesalzen oder Ungesalzen)',
    hi: 'मक्खन (नमकीन या बिना नमक)',
  },
  {
    en: 'Brown Sugar (Light or Dark, Packed)',
    es: 'Azúcar Moreno (Claro u Oscuro, Compactado)',
    fr: 'Sucre Brun / Cassonade (Tassé)',
    de: 'Brauner Zucker (Fest gedrückt)',
    hi: 'ब्राउन शुगर (दबाकर भरा हुआ)',
  },
  {
    en: 'Chocolate Chips (Semi-Sweet)',
    es: 'Chispas de Chocolate (Semiamargo)',
    fr: 'Pépites de Chocolat',
    de: 'Schokodrops (Zartbitter)',
    hi: 'चॉकलेट चिप्स (सेमी-स्वीट)',
  },
  {
    en: 'Milk (Whole or 2%)',
    es: 'Leche (Entera o Semidesnatada 2%)',
    fr: 'Lait (Entier ou Demi-Écrémé)',
    de: 'Milch (Vollmilch oder fettarm)',
    hi: 'दूध (फुल क्रीम या 2%)',
  },
  {
    en: 'Unit Guide & Common Uses',
    es: 'Guía de Unidades y Usos Comunes',
    fr: 'Guide des Unités et Utilisations Courantes',
    de: 'Einheiten-Leitfaden & Typische Anwendungen',
    hi: 'इकाई गाइड और सामान्य उपयोग',
  },
  {
    en: 'Verified Calculators',
    es: 'Calculadoras Verificadas',
    fr: 'Calculatrices Vérifiées',
    de: 'Geprüfte Rechner',
    hi: 'सत्यापित कैलकुलेटर',
  },
  {
    en: 'View All',
    es: 'Ver Todo',
    fr: 'Voir Tout',
    de: 'Alle anzeigen',
    hi: 'सभी देखें',
  },
];

const LANG_INDEX: Record<Exclude<LanguageCode, 'en'>, 0 | 1 | 2 | 3> = {
  es: 0,
  fr: 1,
  de: 2,
  hi: 3,
};

const ALL_EXACT_DICTIONARY: Record<string, TranslationTuple> = {
  ...EXACT_DICTIONARY,
  ...EXTENDED_EXACT_DICTIONARY,
};

const ALL_PHRASE_DICTIONARY = [
  ...PHRASE_DICTIONARY,
  ...EXTENDED_PHRASE_DICTIONARY,
];

const LOWERCASE_EXACT_MAP: Map<string, TranslationTuple> = new Map(
  Object.entries(ALL_EXACT_DICTIONARY).map(([k, v]) => [
    k.replace(/\s+/g, ' ').trim().toLowerCase(),
    v,
  ])
);

export function translateString(raw: string, lang: LanguageCode): string {
  if (lang === 'en' || !raw) return raw;

  const trimmed = raw.trim();
  if (!trimmed) return raw;

  // Preserve leading and trailing whitespace
  const leadingLen = raw.indexOf(trimmed);
  const leading = raw.slice(0, leadingLen);
  const trailing = raw.slice(leadingLen + trimmed.length);

  // Collapse multi-line JSX whitespace so multi-line strings match exact & phrase rules
  const normalized = trimmed.replace(/\s+/g, ' ');
  const tupleIdx = LANG_INDEX[lang];

  // 1. Check exact dictionary match (case-sensitive then case-insensitive)
  const exact =
    ALL_EXACT_DICTIONARY[normalized] ??
    LOWERCASE_EXACT_MAP.get(normalized.toLowerCase());
  if (exact) {
    return `${leading}${exact[tupleIdx]}${trailing}`;
  }

  // 2. Check if string has a numbered prefix (e.g. "1. ") or trailing colon/arrow/unit (e.g. " ($):", ":")
  const wrapperMatch = normalized.match(
    /^(\d+\.\s+|•\s+)?(.+?)(\s*\([^()]+\)\s*:?|\s*[:→—–]|\s*\.\.\.)?$/
  );
  if (wrapperMatch) {
    const prefix = wrapperMatch[1] ?? '';
    const core = (wrapperMatch[2] ?? '').trim();
    const suffix = wrapperMatch[3] ?? '';
    if ((prefix || suffix) && core) {
      const coreExact =
        ALL_EXACT_DICTIONARY[core] ??
        LOWERCASE_EXACT_MAP.get(core.toLowerCase());
      if (coreExact) {
        return `${leading}${prefix}${coreExact[tupleIdx]}${suffix}${trailing}`;
      }
    }
  }

  // 3. Run single-pass protected phrase + vocabulary + morphology engine
  const working = translateWithGrammarEngine(
    normalized,
    lang,
    ALL_PHRASE_DICTIONARY
  );

  return `${leading}${working}${trailing}`;
}

interface LanguageContextValue {
  lang: LanguageCode;
  currentLanguage: LanguageOption;
  setLang: (next: LanguageCode) => void;
  t: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  currentLanguage: SUPPORTED_LANGUAGES[0],
  setLang: () => {},
  t: (text) => text,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

interface NodeMemory {
  raw: string;
  rendered: string;
}

interface AttrMemory {
  placeholder?: NodeMemory;
  title?: NodeMemory;
  ariaLabel?: NodeMemory;
}

const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'CODE',
  'PRE',
  'TEXTAREA',
]);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [lang, setLangState] = useState<LanguageCode>('en');
  const textMemoryRef = useRef<WeakMap<Text, NodeMemory>>(new WeakMap());
  const attrMemoryRef = useRef<WeakMap<Element, AttrMemory>>(new WeakMap());
  const isApplyingRef = useRef<boolean>(false);

  // Load initial language from localStorage
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(
        LANG_STORAGE_KEY
      ) as LanguageCode | null;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        setLangState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const setLang = useCallback((next: LanguageCode) => {
    setLangState(next);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next;
    }
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const t = useCallback(
    (text: string) => translateString(text, lang),
    [lang]
  );

  // DOM Walker that translates all visible text nodes and attributes
  // and cleanly restores original English when lang === 'en'
  const translateSubtree = useCallback(
    (rootNode: Node, activeLang: LanguageCode) => {
      if (typeof document === 'undefined' || isApplyingRef.current) return;
      isApplyingRef.current = true;

      try {
        const shouldSkipElement = (el: Element | null): boolean => {
          if (!el) return true;
          if (SKIP_TAGS.has(el.tagName)) return true;
          if (el.closest('[data-no-translate="true"]')) return true;
          return false;
        };

        // 1. Walk Text Nodes
        const walker = document.createTreeWalker(
          rootNode,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              const parent = node.parentElement;
              if (shouldSkipElement(parent)) {
                return NodeFilter.FILTER_REJECT;
              }
              if (!node.nodeValue || !node.nodeValue.trim()) {
                return NodeFilter.FILTER_SKIP;
              }
              return NodeFilter.FILTER_ACCEPT;
            },
          }
        );

        let currentNode = walker.nextNode() as Text | null;
        while (currentNode) {
          const currentVal = currentNode.nodeValue ?? '';
          let mem = textMemoryRef.current.get(currentNode);

          if (!mem) {
            mem = { raw: currentVal, rendered: currentVal };
            textMemoryRef.current.set(currentNode, mem);
          } else if (currentVal !== mem.rendered) {
            // React updated the underlying text node with a new English value
            mem.raw = currentVal;
          }

          const targetVal =
            activeLang === 'en'
              ? mem.raw
              : translateString(mem.raw, activeLang);

          if (currentNode.nodeValue !== targetVal) {
            currentNode.nodeValue = targetVal;
          }
          mem.rendered = targetVal;

          currentNode = walker.nextNode() as Text | null;
        }

        // 2. Walk Elements for placeholder, title, and aria-label attributes
        if (rootNode instanceof Element || rootNode instanceof Document) {
          const elements = rootNode.querySelectorAll(
            '[placeholder], [title], [aria-label]'
          );
          elements.forEach((el) => {
            if (shouldSkipElement(el)) return;
            let attrMem = attrMemoryRef.current.get(el);
            if (!attrMem) {
              attrMem = {};
              attrMemoryRef.current.set(el, attrMem);
            }

            // placeholder
            const placeholderVal = el.getAttribute('placeholder');
            if (placeholderVal) {
              if (!attrMem.placeholder) {
                attrMem.placeholder = {
                  raw: placeholderVal,
                  rendered: placeholderVal,
                };
              } else if (placeholderVal !== attrMem.placeholder.rendered) {
                attrMem.placeholder.raw = placeholderVal;
              }
              const nextPlaceholder =
                activeLang === 'en'
                  ? attrMem.placeholder.raw
                  : translateString(attrMem.placeholder.raw, activeLang);
              if (placeholderVal !== nextPlaceholder) {
                el.setAttribute('placeholder', nextPlaceholder);
              }
              attrMem.placeholder.rendered = nextPlaceholder;
            }

            // title
            const titleVal = el.getAttribute('title');
            if (titleVal) {
              if (!attrMem.title) {
                attrMem.title = { raw: titleVal, rendered: titleVal };
              } else if (titleVal !== attrMem.title.rendered) {
                attrMem.title.raw = titleVal;
              }
              const nextTitle =
                activeLang === 'en'
                  ? attrMem.title.raw
                  : translateString(attrMem.title.raw, activeLang);
              if (titleVal !== nextTitle) {
                el.setAttribute('title', nextTitle);
              }
              attrMem.title.rendered = nextTitle;
            }

            // aria-label
            const ariaVal = el.getAttribute('aria-label');
            if (ariaVal) {
              if (!attrMem.ariaLabel) {
                attrMem.ariaLabel = { raw: ariaVal, rendered: ariaVal };
              } else if (ariaVal !== attrMem.ariaLabel.rendered) {
                attrMem.ariaLabel.raw = ariaVal;
              }
              const nextAria =
                activeLang === 'en'
                  ? attrMem.ariaLabel.raw
                  : translateString(attrMem.ariaLabel.raw, activeLang);
              if (ariaVal !== nextAria) {
                el.setAttribute('aria-label', nextAria);
              }
              attrMem.ariaLabel.rendered = nextAria;
            }
          });
        }
      } finally {
        isApplyingRef.current = false;
      }
    },
    []
  );

  // Run translation when language or route changes, schedule post-hydration passes, and observe DOM mutations
  useEffect(() => {
    if (typeof document === 'undefined') return;

    translateSubtree(document.body, lang);

    const rafId = window.requestAnimationFrame(() => {
      translateSubtree(document.body, lang);
    });
    const timerFast = window.setTimeout(() => {
      translateSubtree(document.body, lang);
    }, 80);
    const timerSlow = window.setTimeout(() => {
      translateSubtree(document.body, lang);
    }, 280);

    const observer = new MutationObserver((mutations) => {
      if (isApplyingRef.current) return;
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((added) => {
            if (added.nodeType === Node.ELEMENT_NODE) {
              translateSubtree(added, lang);
            } else if (added.nodeType === Node.TEXT_NODE && added.parentElement) {
              translateSubtree(added.parentElement, lang);
            }
          });
        } else if (
          mutation.type === 'characterData' &&
          mutation.target.parentElement
        ) {
          translateSubtree(mutation.target.parentElement, lang);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timerFast);
      window.clearTimeout(timerSlow);
      observer.disconnect();
    };
  }, [lang, pathname, translateSubtree]);

  const currentLanguage =
    SUPPORTED_LANGUAGES.find((l) => l.code === lang) ?? SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ lang, currentLanguage, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
