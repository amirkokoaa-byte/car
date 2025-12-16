import React, { useState } from 'react';
import { Theme } from '../types';

interface LoanCalculatorProps {
  theme: Theme;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({ theme }) => {
  const [price, setPrice] = useState<number>(0);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [interest, setInterest] = useState<number>(0);
  const [years, setYears] = useState<number>(1);

  const calculate = () => {
    const principal = price - downPayment;
    if (principal <= 0) return 0;
    const totalInterest = principal * (interest / 100) * years;
    const total = principal + totalInterest;
    return Math.round(total / (years * 12));
  };

  const monthly = calculate();

  const inputClass = `w-full p-3 text-lg rounded outline-none border transition-all 
    ${theme === 'glass' ? 'bg-white/10 border-white/20 focus:border-purple-400 text-white' : 
      theme === 'win10' ? 'bg-[#1f1f1f] border-gray-500 rounded-none focus:border-blue-500 text-white' :
      theme === 'ios' ? 'bg-gray-100 border-transparent focus:bg-white text-black rounded-xl' :
      'bg-gray-800 border-gray-700 text-white focus:border-blue-500'}`;

  const labelClass = `block mb-2 text-lg font-bold ${theme === 'ios' ? 'text-gray-600' : 'text-gray-300'}`;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className={`w-full max-w-2xl p-8 rounded-2xl shadow-2xl
        ${theme === 'glass' ? 'bg-white/5 backdrop-blur-xl border border-white/10' :
          theme === 'win10' ? 'bg-[#2d2d2d] border-2 border-blue-500 rounded-none' :
          theme === 'ios' ? 'bg-white text-black' :
          'bg-gray-900 border border-gray-700'}`}>
        
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          حاسبة القروض الذكية
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label className={labelClass}>سعر السيارة</label>
             <input type="number" value={price || ''} onChange={(e) => setPrice(Number(e.target.value))} className={inputClass} placeholder="0"/>
           </div>

           <div>
             <label className={labelClass}>المقدم</label>
             <input type="number" value={downPayment || ''} onChange={(e) => setDownPayment(Number(e.target.value))} className={inputClass} placeholder="0"/>
           </div>

           <div>
             <label className={labelClass}>نسبة الفائدة (%)</label>
             <input type="number" value={interest || ''} onChange={(e) => setInterest(Number(e.target.value))} className={inputClass} placeholder="0"/>
           </div>

           <div>
             <label className={labelClass}>عدد السنوات</label>
             <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className={inputClass} placeholder="1"/>
           </div>
        </div>

        <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center shadow-lg transform transition-all hover:scale-105">
           <div className="text-sm opacity-80 mb-1">القسط الشهري التقريبي</div>
           <div className="text-4xl font-mono font-bold">{monthly.toLocaleString()} <span className="text-xl">جنيه</span></div>
           <div className="text-xs mt-2 opacity-70">إجمالي المبلغ المتبقي: {(monthly * years * 12).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;