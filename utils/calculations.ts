import { DcaInputs, SimulationResult, SimulationStep } from '../types';

export const calculateDcaProjection = (inputs: DcaInputs): SimulationResult => {
  const {
    initialInvestment,
    monthlyDca,
    years,
    growthRate,
    currentBtcPrice,
  } = inputs;

  // Safety check: If price is not yet loaded (0), return empty result to prevent NaN/Infinity
  if (currentBtcPrice <= 0) {
    return {
      totalBtc: 0,
      totalInvested: 0,
      finalValue: 0,
      totalSats: 0,
      finalBtcPrice: 0,
      steps: [],
      yearlySteps: []
    };
  }

  const steps: SimulationStep[] = [];
  const yearlySteps: SimulationStep[] = [];
  
  let currentBtc = 0;
  let totalInvested = 0;
  let currentPrice = currentBtcPrice; 
  
  // Initial Buy
  if (initialInvestment > 0) {
    currentBtc += initialInvestment / currentPrice;
    totalInvested += initialInvestment;
  }

  const totalMonths = years * 12;
  
  // Calculate effective rates
  // If growthRate is annual (e.g., 20%), monthly rate is (1 + r)^(1/12) - 1
  const annualRateDecimal = growthRate / 100;
  const monthlyRateDecimal = Math.pow(1 + annualRateDecimal, 1 / 12) - 1;

  // Helper: If we have no BTC (Start with 0 investment), average cost basis 
  // represents the market entry price (currentPrice) rather than 0.
  const getAvgCost = (invested: number, btc: number, marketPrice: number) => 
    btc > 0 ? invested / btc : marketPrice;

  // Add Month 0 (Start)
  steps.push({
    period: 0,
    label: 'Start',
    btcStacked: currentBtc,
    totalInvested: totalInvested,
    portfolioValue: currentBtc * currentPrice,
    price: currentPrice,
    avgCostBasis: getAvgCost(totalInvested, currentBtc, currentPrice)
  });

  // Year 0
  yearlySteps.push({
    period: 0,
    label: new Date().getFullYear().toString(),
    btcStacked: currentBtc,
    totalInvested: totalInvested,
    portfolioValue: currentBtc * currentPrice,
    price: currentPrice,
    avgCostBasis: getAvgCost(totalInvested, currentBtc, currentPrice)
  });

  for (let m = 1; m <= totalMonths; m++) {
    // 1. Update Price (Smooth monthly compounding of the annual rate)
    currentPrice = currentPrice * (1 + monthlyRateDecimal);

    // 2. Execute DCA Buy
    const btcPurchased = monthlyDca / currentPrice;
    currentBtc += btcPurchased;
    totalInvested += monthlyDca;

    // 3. Record Monthly Step
    steps.push({
      period: m,
      label: `Month ${m}`,
      btcStacked: currentBtc,
      totalInvested: totalInvested,
      portfolioValue: currentBtc * currentPrice,
      price: currentPrice,
      avgCostBasis: getAvgCost(totalInvested, currentBtc, currentPrice)
    });

    // 4. Record Yearly Step
    if (m % 12 === 0) {
      const currentYear = new Date().getFullYear() + (m / 12);
      yearlySteps.push({
        period: m / 12,
        label: currentYear.toString(),
        btcStacked: currentBtc,
        totalInvested: totalInvested,
        portfolioValue: currentBtc * currentPrice,
        price: currentPrice,
        avgCostBasis: getAvgCost(totalInvested, currentBtc, currentPrice)
      });
    }
  }

  return {
    totalBtc: currentBtc,
    totalInvested: totalInvested,
    finalValue: currentBtc * currentPrice,
    totalSats: Math.floor(currentBtc * 100_000_000),
    finalBtcPrice: currentPrice,
    steps,
    yearlySteps
  };
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(val);
};

export const formatBtc = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 8,
  }).format(val);
};

export const formatSats = (val: number) => {
  return new Intl.NumberFormat('en-US').format(val);
};