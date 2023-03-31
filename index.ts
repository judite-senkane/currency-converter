import fetch from 'node-fetch';
import prompts from 'prompts';

type ExchangeRate = {
  name: string;
  symbol: string;
  value: number;
};
type ExchangeRateResponse = {
  rates: ExchangeRate[];
};

const fetchExchangeRates = async (): Promise<ExchangeRate[]> => {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/exchange_rates'
  );
  const data = (await response.json()) as ExchangeRateResponse;

  const rates: ExchangeRate[] = [];

  Object.entries(data.rates).forEach((exchangeRate) => {
    rates.push({
      symbol: exchangeRate[0],
      name: exchangeRate[1].name,
      value: exchangeRate[1].value,
    });
  });
  return rates;
};

const app = async () => {
  const exchangeRates: ExchangeRate[] = await fetchExchangeRates();

  const response = await prompts([
    {
      type: 'select',
      name: 'fromCurrency',
      message: 'Select currency to convert from: ',
      choices: exchangeRates.map((exchangeRate: ExchangeRate) => {
        return {
          title: exchangeRate.name,
          value: exchangeRate,
        };
      }),
    },
    {
      type: 'number',
      name: 'amount',
      message: 'Enter amount to convert: ',
    },
    {
      type: 'select',
      name: 'toCurrency',
      message: 'Select currency to convert to: ',
      choices: exchangeRates.map((exchangeRate: ExchangeRate) => {
        return {
          title: exchangeRate.name,
          value: exchangeRate,
        };
      }),
    },
  ]);
  const btcValue = response.amount / response.fromCurrency.value;
  const endCurrencyValue = btcValue * response.toCurrency.value;

  console.log(
    `${response.amount} ${response.fromCurrency.symbol} is equal to ${btcValue} BTC and ${endCurrencyValue} ${response.toCurrency.symbol}.`
  );
};
app();
