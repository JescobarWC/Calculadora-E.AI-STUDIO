import { Coefficients } from './types';

export const TERMS: number[] = [24, 36, 48, 60, 72, 84, 96, 108, 120];

export const CONTADO_COEFFICIENTS: Coefficients = {
  24: 0.0482992,
  36: 0.0333337,
  48: 0.0258705,
  60: 0.0214201,
  72: 0.0184802,
  84: 0.0163969,
  96: 0.0148665,
  108: 0.0136140,
  120: 0.0126620,
};

export const FINANCIADO_COEFFICIENTS: Coefficients = {
  24: 0.0508023,
  36: 0.0358878,
  48: 0.0284919,
  60: 0.0241171,
  72: 0.0212585,
  84: 0.0192596,
  96: 0.0178195,
  108: 0.0168177,
  120: 0.0160917,
};

// --- GARANTÍAS ---
export const WARRANTY_PRICES = {
  premium: {
    standard: { 1: 750, 2: 1500, 3: 2250 },
    suv: { 1: 900, 2: 1800, 3: 2700 },
  },
  gran_ocasion: {
    standard: { 1: 499, 2: 1295 },
    suv: { 1: 599, 2: 1395 },
  },
};
