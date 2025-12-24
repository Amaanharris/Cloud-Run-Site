import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CalculatorForm from './components/CalculatorForm';
import ResultsSummary from './components/ResultsSummary';
import Visualizations from './components/Visualizations';
import SeoContent from './components/SeoContent';
import { DcaInputs, SimulationResult } from './types';
import { calculateDcaProjection } from './utils/calculations';

function App() {
  const [inputs, setInputs] = useState<DcaInputs>(() => {
    // Check for URL params to initialize state (for shared links)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const getParam = (key: string, fallback: number) => {
        const val = params.get(key);
        if (val === null) return fallback;
        const num = parseFloat(val);
        return isNaN(num) ? fallback : num;
      };

      return {
        initialInvestment: getParam('initial', 100),
        monthlyDca: getParam('dca', 500),
        years: getParam('years', 10),
        growthRate: getParam('growth', 20),
        currentBtcPrice: 0,
      };
    }
    
    return {
      initialInvestment: 100, 
      monthlyDca: 500,
      years: 10,
      growthRate: 20,
      currentBtcPrice: 0,
    };
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch live BTC price on mount and poll
  useEffect(() => {
    const fetchBtcPrice = async () => {
      let price = 0;
      let fetchedSuccessfully = false;

      // 1. Try Primary API (Beaver Bitcoin)
      try {
        const response = await fetch('https://api.prod.beaverbitcoin.com/bitcoin/price');
        if (response.ok) {
          const json = await response.json();
          // Parse price from JSON (handle string with commas or raw number)
          if (typeof json.price === 'string') {
             price = Number(json.price.replace(/,/g, ''));
          } else if (typeof json.price === 'number') {
             price = json.price;
          }

          // Heuristic: if price > 1,000,000, assume cents and divide by 100
          // Only apply this to the Beaver API as it may return cents
          if (price > 1000000) {
            price = price / 100;
          }
          
          if (price > 0) fetchedSuccessfully = true;
        }
      } catch (error) {
        console.warn("Primary API (Beaver) failed, trying backup:", error);
      }

      // 2. Try Backup API (Mempool.space) if primary failed
      if (!fetchedSuccessfully) {
        try {
          const response = await fetch('https://mempool.space/api/v1/prices');
          if (response.ok) {
            const json = await response.json();
            if (json.CAD) {
              price = json.CAD;
              fetchedSuccessfully = true;
            }
          }
        } catch (error) {
           console.warn("Backup API (Mempool) failed:", error);
        }
      }

      // 3. Update State or Fallback
      if (fetchedSuccessfully && price > 0) {
        setInputs(prev => ({ ...prev, currentBtcPrice: price }));
      } else {
         // Fallback only if we have no price yet and all APIs failed
         setInputs(prev => {
            if (prev.currentBtcPrice <= 0) {
                console.warn("All price APIs failed, using static fallback.");
                return { ...prev, currentBtcPrice: 135000 };
            }
            return prev;
        });
      }
      
      setIsLoading(false);
    };

    fetchBtcPrice();
    const interval = setInterval(fetchBtcPrice, 60000); // Update every 60s
    return () => clearInterval(interval);
  }, []);

  // Calculate results whenever inputs change
  // Wrap in useMemo to prevent unnecessary recalcs if we had other state
  const results: SimulationResult = useMemo(() => {
    return calculateDcaProjection(inputs);
  }, [inputs]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 pb-20">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* Main Calculator Card */}
          {isLoading ? (
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-20 -mt-24 relative z-20 border border-slate-100 flex flex-col items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-beaver-red mb-6"></div>
              <p className="text-slate-500 font-bold text-lg animate-pulse">Fetching live Bitcoin price...</p>
            </div>
          ) : (
            <CalculatorForm 
              inputs={inputs} 
              setInputs={setInputs} 
            />
          )}

          {/* Results Section - Wrapped for Screenshot */}
          {!isLoading && (
            <div id="results-container" className="pt-4 pb-8 rounded-3xl bg-gray-50">
               <div className="space-y-12 animate-fade-in-up">
                  <ResultsSummary 
                    results={results} 
                    monthlyDca={inputs.monthlyDca}
                    years={inputs.years}
                    growthRate={inputs.growthRate}
                  />
                  
                  <Visualizations results={results} inputs={inputs} />
                  
                  <SeoContent />
               </div>

               <div className="text-center pt-8">
                <p className="text-sm text-slate-400 max-w-2xl mx-auto">
                  Disclaimer: This calculator is for illustrative purposes only. All values are in CAD. 
                  Bitcoin price projections are hypothetical and do not guarantee future results. 
                  The calculations assume a constant growth rate, which does not reflect actual market volatility.
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;