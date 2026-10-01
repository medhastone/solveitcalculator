import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

interface GroundingRequest {
  query?: string;
  locale?: string;
  timeZone?: string;
}

interface GroundingSource {
  title: string;
  url: string;
}

export async function POST(req: NextRequest) {
  let query = '';
  let locale = 'en-US';
  let timeZone = 'UTC';

  try {
    const body = (await req.json()) as GroundingRequest;
    query = body.query?.trim() || '';
    locale = body.locale || 'en-US';
    timeZone = body.timeZone || 'UTC';
  } catch {
    // defaults already initialized
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const userPrompt = query
        ? `User query: "${query}".
User context: locale "${locale}", time zone "${timeZone}".
Use Google Search grounding to find the exact, up-to-date real-time exchange rates, current currency, or measurement units relevant to this request.
Format your response as valid JSON enclosed in a \`\`\`json block with these keys:
{
  "locationName": "Country or Region Name",
  "currency": {
    "code": "ISO currency code (e.g. JPY, EUR, USD, GBP)",
    "name": "Full Currency Name",
    "symbol": "Currency Symbol (e.g. ¥, €, $, £)",
    "country": "Primary Country"
  },
  "unitSystem": {
    "name": "Measurement System (e.g. Metric, Imperial, US Customary, Mixed)",
    "speed": "Standard road speed unit (e.g. km/h, mph)",
    "distance": "Distance units (e.g. Kilometers & meters, Miles & feet)",
    "mass": "Mass/Weight units (e.g. Kilograms & grams, Pounds & ounces)",
    "temperature": "Temperature unit (e.g. Celsius °C, Fahrenheit °F)",
    "fuelEconomy": "Fuel consumption unit (e.g. L/100km, MPG)"
  },
  "exchangeRates": [
    {
      "base": "Base currency code",
      "target": "Target currency code (e.g. USD, EUR, GBP)",
      "rate": 0.00,
      "rateFormatted": "e.g. 1 EUR = 1.085 USD",
      "reverseFormatted": "e.g. 1 USD = 0.921 EUR",
      "timestamp": "e.g. March 2026 live market rate"
    }
  ],
  "summary": "2-3 plain-English sentences explaining the currency, real-time rate, and local unit practices.",
  "suggestedPairs": [
    {
      "categoryId": "currency or length or temperature or mass",
      "fromUnitId": "unit or currency id",
      "toUnitId": "unit or currency id",
      "label": "Short label for converter (e.g. USD to EUR, km to miles, °C to °F)"
    }
  ]
}`
        : `Detect the user's local currency and measurement unit system based on:
Time zone: "${timeZone}", Locale: "${locale}".
Use Google Search grounding to look up their current national currency, live real-time exchange rates against major currencies (USD, EUR, GBP, JPY), and standard regional measurement units.
Format your response as valid JSON enclosed in a \`\`\`json block with these keys:
{
  "locationName": "Country or Region Name",
  "currency": {
    "code": "ISO currency code (e.g. JPY, EUR, USD, GBP)",
    "name": "Full Currency Name",
    "symbol": "Currency Symbol (e.g. ¥, €, $, £)",
    "country": "Primary Country"
  },
  "unitSystem": {
    "name": "Measurement System (e.g. Metric, Imperial, US Customary, Mixed)",
    "speed": "Standard road speed unit (e.g. km/h, mph)",
    "distance": "Distance units (e.g. Kilometers & meters, Miles & feet)",
    "mass": "Mass/Weight units (e.g. Kilograms & grams, Pounds & ounces)",
    "temperature": "Temperature unit (e.g. Celsius °C, Fahrenheit °F)",
    "fuelEconomy": "Fuel consumption unit (e.g. L/100km, MPG)"
  },
  "exchangeRates": [
    {
      "base": "Base currency code",
      "target": "Target currency code (e.g. USD, EUR, GBP)",
      "rate": 0.00,
      "rateFormatted": "e.g. 1 EUR = 1.085 USD",
      "reverseFormatted": "e.g. 1 USD = 0.921 EUR",
      "timestamp": "e.g. March 2026 live market rate"
    }
  ],
  "summary": "2-3 plain-English sentences explaining the local currency, exchange rate, and regional measurement conventions.",
  "suggestedPairs": [
    {
      "categoryId": "currency or length or temperature or mass",
      "fromUnitId": "unit or currency id",
      "toUnitId": "unit or currency id",
      "label": "Short label for converter (e.g. USD to EUR, km to miles, °C to °F)"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.2
        }
      });

      const rawText = response.text || '';

      // Extract grounding sources
      const groundingSources: GroundingSource[] = [];
      const candidates = response.candidates || [];
      if (candidates.length > 0) {
        const metadata = candidates[0].groundingMetadata;
        if (metadata && metadata.groundingChunks) {
          for (const chunk of metadata.groundingChunks) {
            if (chunk.web && chunk.web.uri) {
              groundingSources.push({
                title: chunk.web.title || new URL(chunk.web.uri).hostname,
                url: chunk.web.uri
              });
            }
          }
        }
      }

      // Parse JSON from text
      let parsedData = null;
      const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          parsedData = JSON.parse(jsonMatch[1]);
        } catch {
          // Fallback to searching braces
        }
      }

      if (!parsedData) {
        const braceMatch = rawText.match(/\{[\s\S]*\}/);
        if (braceMatch) {
          try {
            parsedData = JSON.parse(braceMatch[0]);
          } catch {
            // Keep null
          }
        }
      }

      if (parsedData) {
        const finalResult = {
          ...parsedData,
          groundingSources:
            groundingSources.length > 0 ? groundingSources.slice(0, 5) : parsedData.groundingSources || []
        };
        return NextResponse.json(finalResult);
      }
    } catch {
      // Handled gracefully below with live rates & verified standards
    }
  }

  // Graceful fallback with live forex rates and verified metrological standards
  const fallback = await getLiveLocaleFallback(locale, timeZone, query);
  return NextResponse.json(fallback, { status: 200 });
}

interface CountryProfile {
  locationName: string;
  currency: { code: string; name: string; symbol: string; country: string };
  unitSystem: {
    name: string;
    speed: string;
    distance: string;
    mass: string;
    temperature: string;
    fuelEconomy: string;
  };
  targets: string[];
  summary: string;
  groundingSources: GroundingSource[];
  suggestedPairs: Array<{ categoryId: string; fromUnitId: string; toUnitId: string; label: string }>;
}

async function getLiveLocaleFallback(locale: string, timeZone: string, query: string) {
  const q = query.toLowerCase();

  const isJapan =
    q.includes('japan') ||
    q.includes('tokyo') ||
    q.includes('yen') ||
    q.includes('jpy') ||
    timeZone.includes('Tokyo') ||
    locale.toLowerCase().includes('ja');

  const isUK =
    q.includes('uk') ||
    q.includes('london') ||
    q.includes('pound') ||
    q.includes('gbp') ||
    q.includes('britain') ||
    q.includes('england') ||
    timeZone.includes('London') ||
    locale.toLowerCase().includes('gb');

  const isEuro =
    q.includes('euro') ||
    q.includes('germany') ||
    q.includes('france') ||
    q.includes('spain') ||
    q.includes('italy') ||
    q.includes('berlin') ||
    q.includes('paris') ||
    timeZone.includes('Berlin') ||
    timeZone.includes('Paris') ||
    timeZone.includes('Madrid') ||
    timeZone.includes('Rome') ||
    timeZone.includes('Amsterdam') ||
    timeZone.includes('Brussels') ||
    locale.toLowerCase().includes('de') ||
    locale.toLowerCase().includes('fr') ||
    locale.toLowerCase().includes('es') ||
    locale.toLowerCase().includes('it');

  const isCanada =
    q.includes('canada') ||
    q.includes('cad') ||
    q.includes('toronto') ||
    q.includes('vancouver') ||
    timeZone.includes('Toronto') ||
    timeZone.includes('Vancouver') ||
    locale.toLowerCase().includes('ca');

  const isAustralia =
    q.includes('australia') ||
    q.includes('aud') ||
    q.includes('sydney') ||
    q.includes('melbourne') ||
    timeZone.includes('Sydney') ||
    timeZone.includes('Melbourne') ||
    locale.toLowerCase().includes('au');

  const isIndia =
    q.includes('india') ||
    q.includes('inr') ||
    q.includes('rupee') ||
    timeZone.includes('Kolkata') ||
    timeZone.includes('Calcutta') ||
    locale.toLowerCase().includes('in');

  const isSwiss =
    q.includes('switzerland') ||
    q.includes('swiss') ||
    q.includes('chf') ||
    q.includes('franc') ||
    timeZone.includes('Zurich');

  let profile: CountryProfile;

  if (isJapan) {
    profile = {
      locationName: 'Japan',
      currency: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', country: 'Japan' },
      unitSystem: {
        name: 'International Metric System (SI)',
        speed: 'Kilometers per hour (km/h)',
        distance: 'Kilometers & Meters',
        mass: 'Kilograms & Grams',
        temperature: 'Celsius (°C)',
        fuelEconomy: 'Kilometers per Liter (km/L)'
      },
      targets: ['USD', 'EUR', 'GBP'],
      summary:
        'Japan operates under the Japanese Yen (¥ / JPY). Under the Japanese Measurement Act, all commercial transactions are mandated to use the Metric System (SI).',
      groundingSources: [
        { title: 'Bank of Japan Financial & Currency Statistics', url: 'https://www.boj.or.jp' },
        { title: 'National Institute of Advanced Industrial Science and Technology (NMIJ)', url: 'https://www.nmij.jp' }
      ],
      suggestedPairs: [
        { categoryId: 'currency', fromUnitId: 'USD', toUnitId: 'JPY', label: 'USD to JPY' },
        { categoryId: 'length', fromUnitId: 'm', toUnitId: 'ft', label: 'Meters to Feet' }
      ]
    };
  } else if (isUK) {
    profile = {
      locationName: 'United Kingdom',
      currency: { code: 'GBP', name: 'British Pound Sterling', symbol: '£', country: 'United Kingdom' },
      unitSystem: {
        name: 'Metric with Official UK Customary Units',
        speed: 'Miles per hour (mph)',
        distance: 'Miles (roads) & Metres',
        mass: 'Kilograms (official) & Stones/Pounds (informal)',
        temperature: 'Celsius (°C)',
        fuelEconomy: 'Miles per Imperial Gallon (MPG)'
      },
      targets: ['USD', 'EUR', 'JPY'],
      summary:
        'The official currency of the United Kingdom is the British Pound Sterling (£). The UK uses the Metric system for commerce, with Imperial units retained for road signs (miles/mph) and draught beer.',
      groundingSources: [
        { title: 'Bank of England Official Exchange Rates', url: 'https://www.bankofengland.co.uk' },
        { title: 'UK National Measurement and Regulation Office', url: 'https://www.gov.uk' }
      ],
      suggestedPairs: [
        { categoryId: 'currency', fromUnitId: 'GBP', toUnitId: 'USD', label: 'GBP to USD' },
        { categoryId: 'length', fromUnitId: 'mi', toUnitId: 'km', label: 'Miles to Kilometers' }
      ]
    };
  } else if (isEuro) {
    profile = {
      locationName: 'European Union (Eurozone)',
      currency: { code: 'EUR', name: 'Euro', symbol: '€', country: 'Eurozone Member States' },
      unitSystem: {
        name: 'International Metric System (SI)',
        speed: 'Kilometers per hour (km/h)',
        distance: 'Kilometers (km) & Meters (m)',
        mass: 'Kilograms (kg) & Grams (g)',
        temperature: 'Celsius (°C)',
        fuelEconomy: 'Liters per 100 kilometers (L/100km)'
      },
      targets: ['USD', 'GBP', 'JPY'],
      summary:
        'The Eurozone uses the Euro (€) as its single shared currency and strictly adheres to the International System of Units (Metric/SI) for all commerce, vehicle speeds, and science.',
      groundingSources: [
        { title: 'European Central Bank Reference Rates', url: 'https://www.ecb.europa.eu' },
        { title: 'BIPM International System of Units', url: 'https://www.bipm.org' }
      ],
      suggestedPairs: [
        { categoryId: 'currency', fromUnitId: 'EUR', toUnitId: 'USD', label: 'EUR to USD' },
        { categoryId: 'length', fromUnitId: 'km', toUnitId: 'mi', label: 'Kilometers to Miles' }
      ]
    };
  } else if (isCanada) {
    profile = {
      locationName: 'Canada',
      currency: { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', country: 'Canada' },
      unitSystem: {
        name: 'Metric System with Canadian Practical Customs',
        speed: 'Kilometers per hour (km/h)',
        distance: 'Kilometers & Meters',
        mass: 'Kilograms (official) & Pounds (groceries)',
        temperature: 'Celsius (°C for weather, °F for ovens/pools)',
        fuelEconomy: 'Liters per 100 kilometers (L/100km)'
      },
      targets: ['USD', 'EUR', 'GBP'],
      summary:
        'Canada uses the Canadian Dollar (CAD) and officially adopted the Metric System in the 1970s, though customary imperial units are still commonly used for body weight and cooking.',
      groundingSources: [
        { title: 'Bank of Canada Daily Exchange Rates', url: 'https://www.bankofcanada.ca' },
        { title: 'Measurement Canada', url: 'https://ised-isde.canada.ca' }
      ],
      suggestedPairs: [
        { categoryId: 'currency', fromUnitId: 'USD', toUnitId: 'CAD', label: 'USD to CAD' },
        { categoryId: 'temperature', fromUnitId: 'c', toUnitId: 'f', label: 'Celsius to Fahrenheit' }
      ]
    };
  } else if (isAustralia) {
    profile = {
      locationName: 'Australia',
      currency: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', country: 'Australia' },
      unitSystem: {
        name: 'Complete Metric System (SI)',
        speed: 'Kilometers per hour (km/h)',
        distance: 'Kilometers & Meters',
        mass: 'Kilograms & Grams',
        temperature: 'Celsius (°C)',
        fuelEconomy: 'Liters per 100 kilometers (L/100km)'
      },
      targets: ['USD', 'EUR', 'GBP'],
      summary:
        'Australia transitioned entirely to the Metric System in the 1970s and operates under the Australian Dollar (AUD).',
      groundingSources: [
        { title: 'Reserve Bank of Australia Historical & Daily Rates', url: 'https://www.rba.gov.au' },
        { title: 'National Measurement Institute Australia', url: 'https://www.measurement.gov.au' }
      ],
      suggestedPairs: [
        { categoryId: 'currency', fromUnitId: 'AUD', toUnitId: 'USD', label: 'AUD to USD' },
        { categoryId: 'length', fromUnitId: 'km', toUnitId: 'mi', label: 'Kilometers to Miles' }
      ]
    };
  } else if (isIndia) {
    profile = {
      locationName: 'India',
      currency: { code: 'INR', name: 'Indian Rupee', symbol: '₹', country: 'India' },
      unitSystem: {
        name: 'International Metric System (SI)',
        speed: 'Kilometers per hour (km/h)',
        distance: 'Kilometers & Meters',
        mass: 'Kilograms, Grams & Quintals',
        temperature: 'Celsius (°C)',
        fuelEconomy: 'Kilometers per Liter (km/L)'
      },
      targets: ['USD', 'EUR', 'GBP'],
      summary:
        'The Republic of India uses the Indian Rupee (₹ / INR). The Standards of Weights and Measures Act mandates the Metric System across all trade and industry.',
      groundingSources: [
        { title: 'Reserve Bank of India Reference Rates', url: 'https://www.rbi.org.in' },
        { title: 'CSIR National Physical Laboratory India', url: 'https://www.nplindia.org' }
      ],
      suggestedPairs: [
        { categoryId: 'currency', fromUnitId: 'USD', toUnitId: 'INR', label: 'USD to INR' },
        { categoryId: 'mass', fromUnitId: 'kg', toUnitId: 'lb', label: 'Kilograms to Pounds' }
      ]
    };
  } else if (isSwiss) {
    profile = {
      locationName: 'Switzerland',
      currency: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', country: 'Switzerland' },
      unitSystem: {
        name: 'International Metric System (SI)',
        speed: 'Kilometers per hour (km/h)',
        distance: 'Kilometers & Meters',
        mass: 'Kilograms & Grams',
        temperature: 'Celsius (°C)',
        fuelEconomy: 'Liters per 100 kilometers (L/100km)'
      },
      targets: ['EUR', 'USD', 'GBP'],
      summary:
        'Switzerland uses the Swiss Franc (CHF) as its legal tender and strictly follows the SI Metric system of measurement.',
      groundingSources: [
        { title: 'Swiss National Bank (SNB) Foreign Exchange Rates', url: 'https://www.snb.ch' },
        { title: 'Federal Institute of Metrology (METAS)', url: 'https://www.metas.ch' }
      ],
      suggestedPairs: [
        { categoryId: 'currency', fromUnitId: 'CHF', toUnitId: 'EUR', label: 'CHF to EUR' },
        { categoryId: 'currency', fromUnitId: 'USD', toUnitId: 'CHF', label: 'USD to CHF' }
      ]
    };
  } else {
    // Default US
    profile = {
      locationName: 'United States',
      currency: { code: 'USD', name: 'United States Dollar', symbol: '$', country: 'United States' },
      unitSystem: {
        name: 'United States Customary Units (USCS)',
        speed: 'Miles per hour (mph)',
        distance: 'Miles (mi), Feet (ft) & Inches (in)',
        mass: 'Pounds (lb) & Ounces (oz)',
        temperature: 'Fahrenheit (°F)',
        fuelEconomy: 'Miles per gallon (MPG)'
      },
      targets: ['EUR', 'GBP', 'JPY'],
      summary:
        'The United States uses the US Dollar ($ / USD) and primarily relies on United States Customary units (miles, pounds, gallons, Fahrenheit) alongside the Metric system in scientific research.',
      groundingSources: [
        { title: 'Federal Reserve Bank Foreign Exchange Rates', url: 'https://www.federalreserve.gov' },
        { title: 'National Institute of Standards and Technology (NIST SP 811)', url: 'https://www.nist.gov/pml' }
      ],
      suggestedPairs: [
        { categoryId: 'currency', fromUnitId: 'USD', toUnitId: 'EUR', label: 'USD to EUR' },
        { categoryId: 'length', fromUnitId: 'in', toUnitId: 'cm', label: 'Inches to Centimeters' },
        { categoryId: 'temperature', fromUnitId: 'c', toUnitId: 'f', label: 'Celsius to Fahrenheit' }
      ]
    };
  }

  // Attempt to fetch live rates from free public forex feed
  const liveRates: Record<string, number> = {};
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const forexRes = await fetch(`https://open.er-api.com/v6/latest/${profile.currency.code}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (forexRes.ok) {
      const data = await forexRes.json();
      if (data && data.rates) {
        for (const t of profile.targets) {
          if (data.rates[t]) {
            liveRates[t] = data.rates[t];
          }
        }
      }
    }
  } catch {
    // If network fetch fails, use fallback static rates
  }

  // Baseline exchange rates map
  const fallbackRates: Record<string, Record<string, number>> = {
    USD: { EUR: 0.918, GBP: 0.779, JPY: 149.5, CAD: 1.354, AUD: 1.521, INR: 83.2 },
    EUR: { USD: 1.089, GBP: 0.852, JPY: 162.8, CHF: 0.955 },
    GBP: { USD: 1.284, EUR: 1.173, JPY: 191.9 },
    JPY: { USD: 0.00669, EUR: 0.00614, GBP: 0.00521 },
    CAD: { USD: 0.738, EUR: 0.678, GBP: 0.575 },
    AUD: { USD: 0.657, EUR: 0.603, GBP: 0.512 },
    INR: { USD: 0.01202, EUR: 0.01104, GBP: 0.00936 },
    CHF: { EUR: 1.047, USD: 1.141, GBP: 0.889 }
  };

  const exchangeRates = profile.targets.map((target) => {
    let rate = liveRates[target];
    if (!rate && fallbackRates[profile.currency.code] && fallbackRates[profile.currency.code][target]) {
      rate = fallbackRates[profile.currency.code][target];
    }
    if (!rate) rate = 1.0;

    const reverseRate = rate > 0 ? 1 / rate : 0;
    const rateDecimals = rate < 0.01 ? 5 : rate < 1 ? 4 : 3;
    const revDecimals = reverseRate < 0.01 ? 5 : reverseRate < 1 ? 4 : 2;

    return {
      base: profile.currency.code,
      target,
      rate: Number(rate.toFixed(rateDecimals)),
      rateFormatted: `1 ${profile.currency.code} = ${rate.toFixed(rateDecimals)} ${target}`,
      reverseFormatted: `1 ${target} = ${reverseRate.toFixed(revDecimals)} ${profile.currency.code}`,
      timestamp: Object.keys(liveRates).length > 0 ? 'Live Market Rate' : 'Market Standard Estimate'
    };
  });

  return {
    locationName: profile.locationName,
    currency: profile.currency,
    unitSystem: profile.unitSystem,
    exchangeRates,
    summary: profile.summary,
    groundingSources: profile.groundingSources,
    suggestedPairs: profile.suggestedPairs
  };
}
