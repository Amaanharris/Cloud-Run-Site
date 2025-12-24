export interface DcaInputs {
  initialInvestment: number;
  monthlyDca: number;
  years: number;
  growthRate: number;
  currentBtcPrice: number; // Added for calculation accuracy
}

export interface SimulationStep {
  period: number; // Month number or Year number
  label: string;
  btcStacked: number;
  totalInvested: number;
  portfolioValue: number;
  price: number;
  avgCostBasis: number;
}

export interface SimulationResult {
  totalBtc: number;
  totalInvested: number;
  finalValue: number;
  totalSats: number;
  finalBtcPrice: number;
  steps: SimulationStep[];
  yearlySteps: SimulationStep[];
}