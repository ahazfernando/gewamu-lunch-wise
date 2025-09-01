import { useState, useEffect } from 'react';

interface ExchangeRate {
  usd_to_lkr: number;
  lastUpdated: string;
}

export const useCurrencyConverter = () => {
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({
    usd_to_lkr: 320, // Default rate
    lastUpdated: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExchangeRate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Using a free API for currency conversion
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }
      
      const data = await response.json();
      const lkrRate = data.rates.LKR;
      
      if (lkrRate) {
        setExchangeRate({
          usd_to_lkr: lkrRate,
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (err) {
      setError('Failed to fetch current exchange rate');
      console.error('Exchange rate fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRate();
  }, []);

  const convertUSDToLKR = (usdAmount: number): number => {
    return usdAmount * exchangeRate.usd_to_lkr;
  };

  const convertLKRToUSD = (lkrAmount: number): number => {
    return lkrAmount / exchangeRate.usd_to_lkr;
  };

  const formatCurrency = (amount: number, currency: 'USD' | 'LKR'): string => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    return formatter.format(amount);
  };

  return {
    exchangeRate,
    isLoading,
    error,
    convertUSDToLKR,
    convertLKRToUSD,
    formatCurrency,
    refreshRate: fetchExchangeRate
  };
};