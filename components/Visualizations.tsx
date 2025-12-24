import React, { useState, useRef } from 'react';
import { SimulationResult, SimulationStep, DcaInputs } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatBtc, formatCurrency, formatSats } from '../utils/calculations';
import { Share2, TrendingUp, Download, X, Wallet, CircleDollarSign } from 'lucide-react';
import html2canvas from 'html2canvas';

interface VisualizationsProps {
  results: SimulationResult;
  inputs: DcaInputs;
}

const Visualizations: React.FC<VisualizationsProps> = ({ results, inputs }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);
  
  const currentYear = new Date().getFullYear();
  const projectedYear = currentYear + inputs.years;

  // --- Components for Main View ---

  const renderProjectedPrice = () => (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-beaver-red" />
          <h3 className="text-lg font-bold text-beaver-red">Projected BTC Price in {projectedYear}</h3>
        </div>
        <div className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          {formatCurrency(results.finalBtcPrice)}
        </div>
      </div>
      <div className="text-right md:text-left">
         <p className="text-sm font-semibold text-slate-500">
           Assumed Growth Rate
         </p>
         <p className="text-lg font-bold text-slate-700">
           {inputs.growthRate}% per year
         </p>
      </div>
    </div>
  );

  const renderPortfolioGraph = (data: any[], height: number = 400, showTooltip: boolean = true) => (
    <div className="h-full w-full">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart
            data={data}
            margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A6192E" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#A6192E" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorInvested" x1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A0A0A" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#0A0A0A" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="period" 
              tickFormatter={(val) => {
                const year = Math.floor(val / 12);
                return val % 12 === 0 ? `Y${year}` : '';
              }}
              minTickGap={40}
              stroke="#cbd5e1"
              tick={{fontSize: 12, fill: '#64748b'}}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              yAxisId="left" 
              tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`}
              stroke="#cbd5e1"
              tick={{fontSize: 12, fill: '#64748b'}}
              tickLine={false}
              axisLine={false}
            />
            {showTooltip && (
              <Tooltip 
                formatter={(value: number, name: string) => [formatCurrency(value), name]}
                labelFormatter={(label) => `Month ${label}`}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  padding: '12px 16px',
                  fontFamily: 'Inter, sans-serif'
                }}
                itemStyle={{ fontWeight: 600 }}
              />
            )}
            <Legend wrapperStyle={{paddingTop: '20px'}} />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="portfolioValue" 
              name="Portfolio Value"
              stroke="#A6192E" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#A6192E' }}
              isAnimationActive={false}
            />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="totalInvested" 
              name="Total Invested"
              stroke="#0A0A0A" 
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1} 
              fill="url(#colorInvested)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#0A0A0A' }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
    </div>
  );

  const renderTable = (data: SimulationStep[]) => (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-slate-100 bg-white">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Year
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                BTC Stacked
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Invested
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Avg Cost Basis
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Projected BTC Price
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Estimated Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, idx) => (
              <tr key={row.label} className={`hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                  {row.label}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-mono">
                  {formatBtc(row.btcStacked)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                  {formatCurrency(row.totalInvested)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                  {formatCurrency(row.avgCostBasis)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                  {formatCurrency(row.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-beaver-red">
                  {formatCurrency(row.portfolioValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const generateShareImage = async () => {
    if (!shareCardRef.current) return;
    setIsCapturing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 50));

      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        onclone: (doc) => {
            const el = doc.getElementById('share-card-content');
            if (el) el.style.visibility = 'visible';
        }
      });

      const url = canvas.toDataURL("image/png");
      setPreviewUrl(url);
      setShowModal(true);
    } catch (error) {
      console.error("Screenshot failed:", error);
      alert("Failed to create image. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `beaver-bitcoin-dca-${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareOnX = () => {
    const text = `Buying ${formatCurrency(inputs.monthlyDca)}/mo of bitcoin for ${inputs.years} years accumulates ${formatBtc(results.totalBtc)} BTC worth ${formatCurrency(results.finalValue)} CAD 🚀

Source: bitcoindca.ca`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full mt-16 relative">
      
      {/* 
        MINIMAL SOCIAL SHARING GRAPHIC - FINAL V6 REFINEMENT
        Heading changed to "TOTAL SATS".
        Removed "SATS" suffix from number.
        Maintained bold labels and CAGR context.
      */}
      <div 
        style={{ position: 'absolute', top: 0, left: '-9999px', width: '1080px' }}
        ref={shareCardRef}
      >
        <div 
          id="share-card-content" 
          className="bg-white p-24 font-sans flex flex-col items-center w-full"
          style={{ height: '1080px', justifyContent: 'space-between' }}
        >
          
          {/* Header - Single Line */}
          <div className="flex w-full justify-between items-center border-b border-slate-50 pb-8">
            <span className="text-xl font-bold text-slate-400 uppercase tracking-[0.3em]">DCA Calculator</span>
            <span className="text-xl font-black text-slate-900 tracking-tighter">BitcoinDCA.ca</span>
          </div>

          {/* Main Stacked Content */}
          <div className="flex flex-col items-center w-full space-y-16">
            
            <div className="flex flex-col items-center text-center">
              <span className="text-lg font-black text-slate-900 uppercase tracking-widest mb-4">
                The Strategy <span className="ml-4 font-black opacity-60">(ASSUMING {inputs.growthRate}% CAGR)</span>
              </span>
              <h2 className="text-6xl font-black text-slate-900 leading-tight">
                 Buying <span className="text-beaver-red">{formatCurrency(inputs.monthlyDca)}</span> monthly <br/> for <span className="text-beaver-red">{inputs.years} Years</span>
              </h2>
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="text-lg font-black text-slate-900 uppercase tracking-widest mb-4">Total Sats</span>
              <div className="text-[90px] font-black text-beaver-red leading-none tracking-tighter flex items-baseline">
                {formatSats(results.totalSats)}
              </div>
            </div>

            <div className="flex w-full max-w-5xl justify-around border-t border-slate-100 pt-16">
                <div className="flex flex-col items-center text-center">
                   <span className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-4">Total Invested</span>
                   <div className="text-6xl font-black text-slate-900">{formatCurrency(results.totalInvested)}</div>
                </div>

                <div className="flex flex-col items-center text-center">
                   <span className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-4">Future Value</span>
                   <div className="text-6xl font-black text-slate-900">{formatCurrency(results.finalValue)}</div>
                </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex flex-col items-center text-center pb-8">
             <p className="text-2xl text-slate-400 font-semibold mb-4">Start stacking sats today.</p>
             <p className="text-6xl font-black text-beaver-red tracking-tight">beaverbitcoin.com</p>
          </div>
        </div>
      </div>

      {renderProjectedPrice()}

      <div className="animate-fade-in-up space-y-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-900 mb-4">Portfolio Value vs. Invested</h3>
           {renderPortfolioGraph(results.steps, 400, true)}
        </div>
        {renderTable(results.yearlySteps)}
      </div>

      {/* Action Buttons */}
      <div 
        className="flex flex-col items-center gap-6 mt-12 mb-8" 
        data-html2canvas-ignore="true"
      >
         <a 
           href="https://www.beaverbitcoin.com/" 
           target="_blank"
           rel="noopener noreferrer"
           className="bg-beaver-red hover:bg-beaver-dark text-white font-bold py-4 px-12 rounded-full shadow-xl transition-all transform hover:scale-105 flex items-center gap-3 text-lg"
         >
           Buy Bitcoin with Beaver
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
         </a>

         <button 
           onClick={generateShareImage}
           disabled={isCapturing}
           className="flex items-center gap-2 text-slate-500 font-semibold hover:text-beaver-red transition-colors group disabled:opacity-50"
         >
           <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
           {isCapturing ? 'Generating Preview...' : 'Share Results'}
         </button>
      </div>

      {/* Modal Overlay */}
      {showModal && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl">
            
            {/* Preview Section */}
            <div className="flex-1 bg-slate-100 p-8 md:p-12 flex items-center justify-center overflow-auto min-h-[400px]">
               <img 
                 src={previewUrl} 
                 alt="Result Preview" 
                 className="max-w-full max-h-[70vh] shadow-2xl rounded-2xl border-4 border-white object-contain transform transition-transform hover:scale-[1.01]"
               />
            </div>
            
            {/* Controls Section */}
            <div className="w-full md:w-[400px] bg-white p-8 md:p-10 flex flex-col justify-center gap-8 border-l border-slate-100 z-10 shadow-xl">
               <div>
                 <h3 className="text-3xl font-bold text-slate-900 mb-3">Ready to Share</h3>
                 <p className="text-slate-500 text-base leading-relaxed mb-6">
                   Here is a snapshot of your Bitcoin DCA strategy. Share it with your network!
                 </p>
               </div>

               <div className="flex flex-col gap-4">
                 <button 
                   onClick={handleDownload}
                   className="w-full bg-beaver-red hover:bg-beaver-dark text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg hover:scale-[1.02]"
                 >
                   <Download className="w-5 h-5" />
                   Download Image
                 </button>

                 <button 
                   onClick={handleShareOnX}
                   className="w-full bg-black hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg hover:scale-[1.02]"
                 >
                    {/* X Logo */}
                   <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
                   Share on X
                 </button>

                 <button 
                   onClick={() => setShowModal(false)}
                   className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 px-6 rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-colors mt-2"
                 >
                   <X className="w-5 h-5" />
                   Close
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Visualizations;