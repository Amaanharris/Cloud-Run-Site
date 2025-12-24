import React from 'react';
import { HelpCircle } from 'lucide-react';

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  prefix?: string;
  suffix?: string;
  tooltip?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({ 
  label, 
  prefix, 
  suffix, 
  tooltip, 
  className = '', 
  readOnly,
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <label className="text-sm font-bold text-slate-800 tracking-tight">{label}</label>
        {tooltip && (
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-slate-400 hover:text-beaver-red transition-colors cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-black text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
              {tooltip}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black"></div>
            </div>
          </div>
        )}
      </div>
      <div className="relative flex items-center group">
        {prefix && (
          <span className={`absolute left-3 font-medium z-10 ${readOnly ? 'text-slate-400' : 'text-slate-500'}`}>{prefix}</span>
        )}
        <input
          type="number"
          readOnly={readOnly}
          className={`w-full border rounded-xl py-3 px-4 font-bold shadow-sm transition-all
            ${readOnly 
              ? 'bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed focus:ring-0' 
              : 'bg-white text-slate-900 border-slate-300 focus:outline-none focus:ring-2 focus:ring-beaver-red focus:border-transparent group-hover:border-slate-400'
            }
            ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''}`}
          {...props}
        />
        {suffix && (
          <span className={`absolute right-3 font-medium z-10 ${readOnly ? 'text-slate-400' : 'text-slate-500'}`}>{suffix}</span>
        )}
      </div>
    </div>
  );
};

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  tooltip?: string;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  min,
  max,
  onChange,
  tooltip
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-3">
       <div className="flex items-center gap-2">
        <label className="text-sm font-bold text-slate-800 tracking-tight">{label}</label>
        {tooltip && (
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-slate-400 hover:text-beaver-red transition-colors cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-black text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
              {tooltip}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black"></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative flex-1 h-10 flex items-center">
          {/* 
            Native range input with a gradient background to handle the "fill" effect.
          */}
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-0"
            style={{
              backgroundImage: `linear-gradient(#A6192E, #A6192E)`,
              backgroundSize: `${percentage}% 100%`,
              backgroundRepeat: 'no-repeat'
            }}
          />
          <style dangerouslySetInnerHTML={{__html: `
            input[type=range]::-webkit-slider-thumb {
              -webkit-appearance: none;
              height: 24px;
              width: 24px;
              border-radius: 50%;
              background: #ffffff;
              border: 4px solid #A6192E;
              cursor: pointer;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              transition: transform 0.1s;
            }
            input[type=range]::-webkit-slider-thumb:hover {
              transform: scale(1.1);
            }
            input[type=range]::-moz-range-thumb {
              height: 24px;
              width: 24px;
              border-radius: 50%;
              background: #ffffff;
              border: 4px solid #A6192E;
              cursor: pointer;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }
          `}} />
        </div>
        
        <div className="w-20 shrink-0">
           <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full bg-white border border-slate-300 rounded-xl py-2 px-2 text-center text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-beaver-red shadow-sm"
          />
        </div>
      </div>
       <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
          <span>{min} Years</span>
          <span>{max} Years</span>
        </div>
    </div>
  );
};

export const SelectInput: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: string[]; tooltip?: string; }> = ({
  label,
  options,
  tooltip,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <label className="text-sm font-bold text-slate-800 tracking-tight">{label}</label>
        {tooltip && (
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-slate-400 hover:text-beaver-red transition-colors cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-black text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
              {tooltip}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black"></div>
            </div>
          </div>
        )}
      </div>
      <div className="relative group">
        <select
          className="w-full appearance-none bg-white text-slate-900 border border-slate-300 rounded-xl py-3 px-4 font-bold focus:outline-none focus:ring-2 focus:ring-beaver-red cursor-pointer shadow-sm group-hover:border-slate-400"
          {...props}
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-white text-slate-900">
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>
  );
}

interface GrowthRateSliderProps {
  value: number;
  onChange: (val: number) => void;
}

export const GrowthRateSlider: React.FC<GrowthRateSliderProps> = ({ value, onChange }) => {
  const min = 0;
  const max = 100;

  return (
    <div className="bg-beaver-red text-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight">Bitcoin Growth Rate</h3>
          <p className="text-white/80 text-xs sm:text-sm font-medium mt-1">Assumed Compound Annual Growth Rate (CAGR)</p>
        </div>
        <div className="text-5xl md:text-6xl font-extrabold tracking-tight self-start sm:self-auto">
          {value}%
        </div>
      </div>

      <div className="relative h-12 flex items-center mb-2">
        {/* Track */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 bg-black/30 rounded-full appearance-none cursor-pointer focus:outline-none z-10"
        />
        
        {/* Custom Thumb Styling */}
        <style dangerouslySetInnerHTML={{__html: `
            .bg-beaver-red input[type=range]::-webkit-slider-thumb {
              -webkit-appearance: none;
              height: 28px;
              width: 28px;
              border-radius: 50%;
              background: #ffffff;
              border: none;
              cursor: pointer;
              box-shadow: 0 4px 6px rgba(0,0,0,0.3);
              margin-top: -8px; 
            }
            .bg-beaver-red input[type=range]::-moz-range-thumb {
              height: 28px;
              width: 28px;
              border-radius: 50%;
              background: #ffffff;
              border: none;
              cursor: pointer;
              box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            }
          `}} />
      </div>

      <div className="flex justify-between items-end text-[9px] sm:text-xs md:text-sm font-bold uppercase text-white/75 mt-1">
        <span className="text-left leading-tight tracking-tighter md:tracking-normal">Matches S&P 500 (10%)</span>
        <span className="text-center leading-tight tracking-tighter md:tracking-normal px-1">Avg (~55%)</span>
        <span className="text-right leading-tight tracking-tighter md:tracking-normal whitespace-nowrap">Hyperbitcoinization (100%)</span>
      </div>
    </div>
  );
};