import React, { useState, useEffect } from 'react';
import { Theme } from '../types';

interface InstallmentScenariosProps {
  theme: Theme;
}

const InstallmentScenarios: React.FC<InstallmentScenariosProps> = ({ theme }) => {
  const [totalPrice, setTotalPrice] = useState<number>(1000000);
  const [downPayment, setDownPayment] = useState<number>(300000);
  const [interestRate, setInterestRate] = useState<number>(18);
  const [adminFeePct, setAdminFeePct] = useState<number>(2.5);
  const [insurancePct, setInsurancePct] = useState<number>(1);

  const calculateScenario = (years: number) => {
    const principal = totalPrice - downPayment;
    if (principal <= 0) return 0;

    const totalInterest = principal * (interestRate / 100) * years;
    const adminFee = principal * (adminFeePct / 100);
    const insurance = principal * (insurancePct / 100) * years;

    const grandTotal = principal + totalInterest + adminFee + insurance;
    const monthly = grandTotal / (years * 12);

    return {
      monthly: Math.round(monthly),
      totalInterest: Math.round(totalInterest),
      fees: Math.round(adminFee + insurance)
    };
  };

  const scenarios = [
    { label: 'سنة واحدة', years: 1 },
    { label: '3 سنوات', years: 3 },
    { label: '5 سنوات', years: 5 },
  ];

  const inputClass = `w-full p-2 rounded outline-none border transition-all text-center
    ${theme === 'ios' ? 'bg-gray-100 text-black border-transparent' : 'bg-gray-800 text-white border-gray-600 focus:border-blue-500'}`;
  
  const cardClass = `flex-1 p-6 rounded-xl flex flex-col items-center justify-center gap-4 transition-transform hover:scale-105 shadow-xl
    ${theme === 'ios' ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-white'}`;

  return (
    <div className="h-full w-full p-4 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">سيناريوهات التقسيط الفوري</h2>

      {/* Inputs */}
      <div className={`p-6 rounded-xl mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-lg
        ${theme === 'ios' ? 'bg-white' : 'bg-gray-900/50 border border-gray-700'}`}>
        
        <div className="md:col-span-1">
          <label className="block text-sm font-bold mb-2 opacity-70">سعر السيارة</label>
          <input 
            type="number" 
            value={totalPrice} 
            onChange={(e) => setTotalPrice(Number(e.target.value))} 
            className={`${inputClass} text-xl font-bold text-blue-500`} 
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-bold mb-2 opacity-70">المقدم المدفوع</label>
          <input 
            type="number" 
            value={downPayment} 
            onChange={(e) => setDownPayment(Number(e.target.value))} 
            className={`${inputClass} text-xl font-bold text-green-500`} 
          />
        </div>

        <div className="md:col-span-1 grid grid-cols-3 gap-2">
           <div>
             <label className="block text-xs text-center mb-1">فائدة %</label>
             <input type="number" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className={inputClass} />
           </div>
           <div>
             <label className="block text-xs text-center mb-1">إدارية %</label>
             <input type="number" value={adminFeePct} onChange={e => setAdminFeePct(Number(e.target.value))} className={inputClass} />
           </div>
           <div>
             <label className="block text-xs text-center mb-1">تأمين %</label>
             <input type="number" value={insurancePct} onChange={e => setInsurancePct(Number(e.target.value))} className={inputClass} />
           </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map(s => {
          const result = calculateScenario(s.years);
          return (
            <div key={s.years} className={cardClass}>
               <h3 className="text-xl font-bold opacity-80">{s.label}</h3>
               <div className="text-4xl font-mono font-bold text-yellow-400">
                 {result ? result.monthly.toLocaleString() : 0}
                 <span className="text-sm text-gray-400 mr-2">ج.م / شهر</span>
               </div>
               
               <div className="w-full mt-4 text-sm opacity-60 space-y-1">
                 <div className="flex justify-between">
                   <span>إجمالي الفوائد:</span>
                   <span>{result ? result.totalInterest.toLocaleString() : 0}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>مصاريف وتأمين:</span>
                   <span>{result ? result.fees.toLocaleString() : 0}</span>
                 </div>
               </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 text-center opacity-50 text-xs">
        * الحسابات تقريبية وقد تختلف قليلاً بناءً على سياسات البنك المحددة.
      </div>
    </div>
  );
};

export default InstallmentScenarios;