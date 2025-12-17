import React from 'react';
import { Car, Theme } from '../types';
import { X, Share2, Printer } from 'lucide-react';

interface CarDetailsModalProps {
  car: Car;
  onClose: () => void;
  theme: Theme;
}

const CarDetailsModal: React.FC<CarDetailsModalProps> = ({ car, onClose, theme }) => {
  
  const handleShare = () => {
    const text = `
*${car.brand} - ${car.name} (${car.year})*
------------------
${car.description}

*المواصفات:*
${car.descLines.filter(l => l).map(l => `- ${l}`).join('\n')}

*الأسعار:*
${car.categories.map(c => `${c.name}: ${c.price.toLocaleString()} ج.م`).join('\n')}

*نظام التقسيط المقترح:*
مقدم: ${car.installment.downPayment.toLocaleString()}
قسط شهري: ${car.installment.monthlyInstallment.toLocaleString()}
    `.trim();

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const containerClass = theme === 'ios' 
    ? 'bg-white text-black' 
    : theme === 'win10'
    ? 'bg-[#1f1f1f] border-2 border-blue-600 text-white rounded-none'
    : 'bg-gray-900 text-white border border-gray-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={onClose}>
      <div 
        className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-2xl relative animate-fade-in ${containerClass}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
           <button onClick={onClose} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition">
              <X size={20}/>
           </button>
           <div className="flex gap-2">
             <button onClick={handleShare} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition">
               <Share2 size={18}/>
               <span>واتساب</span>
             </button>
           </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-2 pr-2">{car.brand} - {car.name} ({car.year})</h2>
        <div className="flex gap-2 mb-6">
           <span className={`px-3 py-1 rounded ${car.isAvailable ? 'bg-green-600' : 'bg-red-600'} text-white text-sm`}>
               {car.isAvailable ? 'متاح للبيع' : 'غير متاح'}
           </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3 border-b border-gray-700 pb-2">المواصفات</h3>
              <p className="mb-4 text-sm opacity-80 whitespace-pre-wrap">{car.description}</p>
              <ul className="list-disc list-inside space-y-1 text-sm opacity-80">
                 {car.descLines.filter(l => l).map((l, i) => <li key={i}>{l}</li>)}
              </ul>
           </div>

           <div>
              <h3 className="text-xl font-bold text-green-400 mb-3 border-b border-gray-700 pb-2">الأسعار والفئات</h3>
              <div className="space-y-2">
                 {car.categories.map((c, i) => (
                   <div key={i} className="flex justify-between p-2 bg-white/5 rounded text-sm md:text-base">
                      <span>{c.name}</span>
                      <span className="font-mono font-bold">{c.price.toLocaleString()} ج.م</span>
                   </div>
                 ))}
              </div>

              <h3 className="text-xl font-bold text-purple-400 mt-6 mb-3 border-b border-gray-700 pb-2">نظام التقسيط (المسجل)</h3>
              <div className="p-4 bg-white/5 rounded text-sm md:text-base">
                 <div className="flex justify-between mb-2"><span>سعر السيارة الأساسي:</span> <span>{car.installment.basePrice.toLocaleString()}</span></div>
                 <div className="flex justify-between mb-2"><span>المقدم:</span> <span>{car.installment.downPayment.toLocaleString()}</span></div>
                 <div className="flex justify-between mb-2"><span>الفائدة:</span> <span>{car.installment.interestRate}%</span></div>
                 <div className="flex justify-between mb-2"><span>سنوات:</span> <span>{car.installment.years}</span></div>
                 <div className="border-t border-gray-600 mt-2 pt-2 flex justify-between font-bold text-lg text-yellow-400">
                    <span>القسط الشهري:</span>
                    <span>{car.installment.monthlyInstallment.toLocaleString()} ج.م</span>
                 </div>
              </div>
           </div>
        </div>
        
        <div className="mt-6">
           <h3 className="text-xl font-bold text-gray-400 mb-2">ملاحظات</h3>
           <p className="text-sm opacity-70 whitespace-pre-wrap">{car.notes}</p>
        </div>

        <div className="mt-6">
           <h3 className="text-xl font-bold text-gray-400 mb-2">الأوراق المطلوبة</h3>
           <ul className="list-disc list-inside opacity-70">
              {car.requiredPapers.filter(p => p).map((p, i) => <li key={i}>{p}</li>)}
           </ul>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsModal;