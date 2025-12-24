import React from 'react';
import { SimulationResult } from '../types';
import { formatBtc, formatCurrency, formatSats } from '../utils/calculations';
import { TrendingUp, Wallet, CircleDollarSign } from 'lucide-react';

interface ResultsSummaryProps {
  results: SimulationResult;
  monthlyDca: number;
  years: number;
  growthRate: number;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ results, monthlyDca, years, growthRate }) => {
  
  const btcDisplay = formatBtc(results.totalBtc);
  const valueDisplay = formatCurrency(results.finalValue);
  const investedDisplay = formatCurrency(results.totalInvested);
  const satsDisplay = formatSats(results.totalSats);

  return (
    <div className="space-y-10">
      
      {/* Explanation Text */}
      <div className="text-center max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">Results</h2>
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
          Your DCA strategy of <strong className="text-beaver-red whitespace-nowrap">{formatCurrency(monthlyDca)} per month</strong> will accumulate <strong className="text-beaver-red whitespace-nowrap">{btcDisplay} BTC</strong> over <strong className="text-beaver-red whitespace-nowrap">{years} years</strong> assuming an annual growth rate of {growthRate}%.
        </p>
      </div>

      {/* Cards Grid - Uses 2 columns to ensure even 10+ digit numbers fit comfortably */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        
        {/* Total BTC Stacked - Primary Highlight */}
        <div className="bg-white border-2 border-slate-100 hover:border-beaver-red/30 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center shadow-lg transition-colors group overflow-hidden">
           <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-100 group-hover:bg-beaver-red/10 flex items-center justify-center mb-4 transition-colors shrink-0">
              {/* Custom Bitcoin SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 md:w-9 md:h-9 text-beaver-red">
                <path d="M20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.7055 10.564C16.5323 11.6168 15.9806 12.1314 15.235 12.313C16.2271 12.8683 16.7046 13.7112 16.1938 15.1897C15.5586 17.044 14.1367 17.2122 12.2533 16.853L11.7684 18.81L10.6741 18.5388L11.159 16.5818C10.8606 16.5023 10.5571 16.4442 10.2602 16.359L9.77531 18.3161L8.683 18.0454L9.16786 16.0883L6.99194 15.4957L7.53278 14.1119C7.53278 14.1119 8.35407 14.3378 8.34133 14.3236C8.64595 14.3977 8.79489 14.1849 8.85591 14.0359L9.63237 10.8985L10.1975 8.66859C10.2219 8.42756 10.1464 8.11223 9.7013 7.99226C9.7316 7.97451 8.90007 7.7937 8.90007 7.7937L9.2241 6.48228L11.4667 7.03806L11.9416 5.12109L13.0714 5.40109L12.5965 7.31806C12.8882 7.38151 13.1711 7.45862 13.4625 7.53269L13.9374 5.61571L15.0367 5.88814L14.5493 7.85537C15.9358 8.36407 16.9345 9.11777 16.7055 10.564ZM11.6062 10.9543C12.2632 11.1517 14.2111 11.7371 14.5393 10.4337C14.8448 9.19469 13.1568 8.81617 12.3726 8.64033C12.2802 8.61959 12.2003 8.60168 12.1377 8.5855L11.5514 10.9378L11.6062 10.9543ZM10.5917 14.7743L10.6869 14.8025C11.4963 15.0433 13.793 15.7264 14.1045 14.4327C14.4254 13.1868 12.3607 12.7016 11.4363 12.4844C11.335 12.4606 11.2473 12.44 11.1781 12.422L10.5917 14.7743Z"></path>
              </svg>
           </div>
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total BTC Stacked</span>
           <span className="text-3xl md:text-4xl font-extrabold text-beaver-red whitespace-nowrap tracking-tight" title={btcDisplay}>
             {btcDisplay}
           </span>
        </div>

        {/* Total Value */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow overflow-hidden">
           <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 shrink-0">
              <TrendingUp className="w-7 h-7 md:w-9 md:h-9 text-black" />
           </div>
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Future Value</span>
           <span className="text-3xl md:text-4xl font-extrabold text-slate-900 whitespace-nowrap tracking-tight" title={valueDisplay}>
             {valueDisplay}
           </span>
        </div>

        {/* Total Invested */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow overflow-hidden">
           <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 shrink-0">
              <CircleDollarSign className="w-7 h-7 md:w-9 md:h-9 text-black" />
           </div>
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Invested</span>
           <span className="text-3xl md:text-4xl font-bold text-slate-900 whitespace-nowrap tracking-tight" title={investedDisplay}>
             {investedDisplay}
           </span>
        </div>

        {/* Sats */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow overflow-hidden">
           <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 shrink-0">
              <Wallet className="w-7 h-7 md:w-9 md:h-9 text-black" />
           </div>
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Sats</span>
           <span className="text-3xl md:text-4xl font-bold text-slate-900 whitespace-nowrap tracking-tight" title={satsDisplay}>
             {satsDisplay}
           </span>
        </div>

      </div>

    </div>
  );
};

export default ResultsSummary;