"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const prompts_1 = __importDefault(require("prompts"));
const fetchExchangeRates = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, node_fetch_1.default)('https://api.coingecko.com/api/v3/exchange_rates');
    const data = (yield response.json());
    const rates = [];
    Object.entries(data.rates).forEach((exchangeRate) => {
        rates.push({
            symbol: exchangeRate[0],
            name: exchangeRate[1].name,
            value: exchangeRate[1].value,
        });
    });
    return rates;
});
const app = () => __awaiter(void 0, void 0, void 0, function* () {
    const exchangeRates = yield fetchExchangeRates();
    const response = yield (0, prompts_1.default)([
        {
            type: 'select',
            name: 'fromCurrency',
            message: 'Select currency to convert from: ',
            choices: exchangeRates.map((exchangeRate) => {
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
            choices: exchangeRates.map((exchangeRate) => {
                return {
                    title: exchangeRate.name,
                    value: exchangeRate,
                };
            }),
        },
    ]);
    const btcValue = response.amount / response.fromCurrency.value;
    const endCurrencyValue = btcValue * response.toCurrency.value;
    console.log(`${response.amount} ${response.fromCurrency.symbol} is equal to ${btcValue} BTC and ${endCurrencyValue} ${response.toCurrency.symbol}.`);
});
app();
