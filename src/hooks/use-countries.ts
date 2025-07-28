import { useEffect, useState } from 'react';

interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  }
}

export interface CountryOption {
  value: string;
  label: string;
}

export function useCountries() {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json() as Country[];
        
        const sortedCountries = data
          .map(country => ({
            value: country.name.common,
            label: country.name.common
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        
        setCountries(sortedCountries);
        setError(null);
      } catch (err) {
        setError('Failed to load countries. Using fallback list.');
        setCountries([
          'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 
          'Spain', 'Italy', 'Netherlands', 'Australia', 'New Zealand', 
          'Singapore', 'India', 'Brazil', 'Mexico'
        ].map(country => ({ value: country, label: country })));
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { 
    countries: countries || [], 
    loading, 
    error 
  };
}
