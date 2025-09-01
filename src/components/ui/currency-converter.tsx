import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, RefreshCw, DollarSign } from 'lucide-react';
import { useCurrencyConverter } from '@/hooks/useCurrencyConverter';

interface CurrencyConverterProps {
  defaultAmount?: number;
  defaultCurrency?: 'USD' | 'LKR';
  onConversion?: (usdAmount: number, lkrAmount: number) => void;
}

export const CurrencyConverter = ({ 
  defaultAmount = 0, 
  defaultCurrency = 'USD',
  onConversion 
}: CurrencyConverterProps) => {
  const { 
    exchangeRate, 
    isLoading, 
    error, 
    convertUSDToLKR, 
    convertLKRToUSD, 
    formatCurrency, 
    refreshRate 
  } = useCurrencyConverter();

  const [amount, setAmount] = useState(defaultAmount.toString());
  const [fromCurrency, setFromCurrency] = useState<'USD' | 'LKR'>(defaultCurrency);

  const numericAmount = parseFloat(amount) || 0;
  const convertedAmount = fromCurrency === 'USD' 
    ? convertUSDToLKR(numericAmount)
    : convertLKRToUSD(numericAmount);

  const toCurrency = fromCurrency === 'USD' ? 'LKR' : 'USD';

  const handleSwapCurrency = () => {
    setFromCurrency(fromCurrency === 'USD' ? 'LKR' : 'USD');
    setAmount(convertedAmount.toFixed(2));
  };

  const handleConvert = () => {
    const usdAmount = fromCurrency === 'USD' ? numericAmount : convertedAmount;
    const lkrAmount = fromCurrency === 'LKR' ? numericAmount : convertedAmount;
    onConversion?.(usdAmount, lkrAmount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Currency Converter
        </CardTitle>
        <CardDescription>
          Convert between USD and LKR at current exchange rates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Exchange Rate Info */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="text-sm">
            <div className="font-medium">1 USD = {exchangeRate.usd_to_lkr.toFixed(2)} LKR</div>
            <div className="text-muted-foreground">
              Last updated: {new Date(exchangeRate.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={refreshRate}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="text-sm text-destructive">{error}</div>
          </div>
        )}

        {/* Conversion Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1"
              />
              <Badge variant="secondary" className="px-3 py-2 min-w-[60px] justify-center">
                {fromCurrency}
              </Badge>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSwapCurrency}
              className="rounded-full"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <Label>Converted Amount</Label>
            <div className="flex gap-2">
              <Input
                value={convertedAmount.toFixed(2)}
                readOnly
                className="flex-1 bg-muted"
              />
              <Badge variant="secondary" className="px-3 py-2 min-w-[60px] justify-center">
                {toCurrency}
              </Badge>
            </div>
          </div>
        </div>

        {/* Formatted Display */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="text-center space-y-1">
            <div className="text-lg font-semibold">
              {formatCurrency(numericAmount, fromCurrency)}
            </div>
            <div className="text-sm text-muted-foreground">=</div>
            <div className="text-lg font-semibold text-primary">
              {formatCurrency(convertedAmount, toCurrency)}
            </div>
          </div>
        </div>

        {onConversion && (
          <Button onClick={handleConvert} className="w-full">
            Use This Conversion
          </Button>
        )}
      </CardContent>
    </Card>
  );
};