import React from 'react';
import { DcaInputs } from '../types';
import { NumberInput, SliderInput, GrowthRateSlider } from './ui/Input';

interface CalculatorFormProps {
  inputs: DcaInputs;
  setInputs: React.Dispatch<React.SetStateAction<DcaInputs>>;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ inputs, setInputs }) => {
  
  const handleChange = (field: keyof DcaInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-6 md:p-10 -mt-24 relative z-20 border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        
        {/* Initial Investment */}
        <NumberInput
          label="Initial Investment (CAD)"
          value={inputs.initialInvestment === 0 ? '' : inputs.initialInvestment}
          onChange={(e) => handleChange('initialInvestment', Number(e.target.value))}
          prefix="$"
          placeholder="0"
          tooltip="Starting amount you want to invest today in CAD."
        />

        {/* Monthly DCA */}
        <NumberInput
          label="Monthly DCA Amount (CAD)"
          value={inputs.monthlyDca === 0 ? '' : inputs.monthlyDca}
          onChange={(e) => handleChange('monthlyDca', Number(e.target.value))}
          prefix="$"
          placeholder="500"
          tooltip="Amount you plan to buy every month in CAD."
        />

        {/* Growth Rate Slider - Spans full width */}
        <div className="md:col-span-2 pt-4 pb-2">
          <GrowthRateSlider 
            value={inputs.growthRate}
            onChange={(val) => handleChange('growthRate', val)}
          />
        </div>
        
        {/* Time Horizon Slider - Spans full width */}
        <div className="md:col-span-2 pt-2">
          <SliderInput
            label="Time Horizon (Years)"
            value={inputs.years}
            min={1}
            max={30}
            onChange={(val) => handleChange('years', val)}
            tooltip="Number of years you plan to accumulate bitcoin."
          />
        </div>
      </div>
    </div>
  );
};

export default CalculatorForm;