
import React, { useState } from 'react';
import { Car, Theme } from '../types';
import { X, Share2, ImageIcon, ChevronRight, ChevronLeft } from 'lucide-react';

interface CarDetailsModalProps {
  car: Car;
  onClose: () => void;
  theme: Theme;
}

const CarDetailsModal: React.FC<CarDetailsModalProps> = ({ car, onClose, theme }) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const handleShare = () => {
    const text = `
*${car.brand} - ${car.name} (${car.year})*
------------------
${car.description}

*المواصفات:*
${car.descLines.filter(l => l).map(l => `- ${l}`).join('\n')}

*الأسعار:*
${car.categories.map(c => `${c.name}: ${c.price.toLocaleString()} ج.م`).join('\n')}
    `.trim();

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const nextImg = () => {
    if (car.images && car.images.length > 0) {
      setActiveImageIdx((prev) => (prev + 1) % car.images.length);
    }
  };

  const prevImg = () => {
    if (car.images && car.images.length > 0) {
      setActiveImageIdx((prev) => (prev - 1 + car.images.length) % car.images.length);
    }
  };

  const containerClass = theme === 'ios' 
    ? 'bg-white text-black' 
    : theme === 'win10'
    ? 'bg-[#1f1f1f] border-2 border-blue-600 text-white rounded-none'
    : 'bg-gray-900 text-white border border-gray-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={onClose}>
      <div 
        className={`w-full max-w-5xl max-h-[95vh] overflow-y-auto p-4 md:p-8 rounded-2xl shadow-2xl relative animate-fade-in ${containerClass}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6 sticky top-0 bg-inherit z-10 pt-2 pb-2">
           <button onClick={onClose} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition">
              <X size={20}/>
           </button>
           <div className="flex gap-2">
             <button onClick={handleShare} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition font-bold">
               <Share2 size={18}/>
               <span>واتساب</span>
             </button>
           </div>
        </div>

        {/* Car Image Gallery */}
        <div className="flex flex-col gap-4 mb-8">
            <div className="w-full aspect-video md:h-96 rounded-2xl overflow-hidden bg-white/5 border border-white/10 relative flex items-center justify-center group">
               {car.images && car.images.length > 0 ? (
                 <>
                    <img src={car.images[activeImageIdx]} className="w-full h-full object-contain" alt={`${car.name} ${activeImageIdx}`} />
                    {car.images.length > 1 && (
                       <>
                         <button onClick={prevImg} className="absolute left-4 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft size={24}/></button>
                         <button onClick={nextImg} className="absolute right-4 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight size={24}/></button>
                         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-xs text-white">
                           {activeImageIdx + 1} / {car.images.length}
                         </div>
                       </>
                    )}
                 </>
               ) : (
                 <div className="flex flex-col items-center gap-2 opacity-20">
                   <ImageIcon size={64} />
                   <span className="font-bold">لا توجد صور</span>
                 </div>
               )}
            </div>
            
            {car.images && car.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                 {car.images.map((img, i) => (
                   <button 
                    key={i} 
                    onClick={() => setActiveImageIdx(i)}
                    className={`w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${activeImageIdx === i ? 'border-blue-500 scale-105' : 'border-transparent opacity-50'}`}
                   >
                     <img src={img} className="w-full h-full object-cover" />
                   </button>
                 ))}
              </div>
            )}
        </div>

        <h2 className="text-3xl font-bold mb-2">{car.brand} - {car.name}</h2>
        <div className="flex gap-2 mb-8">
           <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">{car.year}</span>
           <span className={`px-3 py-1 rounded-full ${car.isAvailable ? 'bg-green-600' : 'bg-red-600'} text-white text-sm font-bold`}>
               {car.isAvailable ? 'متاح للبيع' : 'غير متاح'}
           </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3 border-b border-gray-700 pb-2">المواصفات الفنية</h3>
              <p className="mb-6 text-sm opacity-80 whitespace-pre-wrap">{car.description}</p>
              <ul className="grid grid-cols-1 gap-2 text-sm opacity-80">
                 {car.descLines.filter(l => l).map((l, i) => (
                   <li key={i} className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                     {l}
                   </li>
                 ))}
              </ul>
           </div>

           <div className="flex flex-col gap-6">
              <div className={`p-6 rounded-2xl ${theme === 'ios' ? 'bg-gray-50' : 'bg-white/5'}`}>
                <h3 className="text-xl font-bold text-green-400 mb-4">قائمة الأسعار</h3>
                <div className="space-y-3">
                   {car.categories.map((c, i) => (
                     <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                        <span className="font-bold">{c.name}</span>
                        <span className="font-mono font-bold text-lg">{c.price.toLocaleString()} ج.م</span>
                     </div>
                   ))}
                </div>
              </div>

              <div className={`p-6 rounded-2xl ${theme === 'ios' ? 'bg-blue-50' : 'bg-blue-900/10 border border-blue-500/20'}`}>
                 <h3 className="text-xl font-bold text-blue-300 mb-4">نظام التقسيط المسجل</h3>
                 <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>سعر السيارة:</span> <span>{car.installment.basePrice.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>المقدم:</span> <span>{car.installment.downPayment.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>الفائدة:</span> <span>{car.installment.interestRate}%</span></div>
                    <div className="flex justify-between border-t border-white/10 pt-2 mt-2 font-bold text-lg text-yellow-400">
                       <span>القسط الشهري:</span>
                       <span>{car.installment.monthlyInstallment.toLocaleString()} ج.م</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 opacity-80">
           <div>
              <h3 className="text-xl font-bold text-gray-400 mb-3">ملاحظات إضافية</h3>
              <div className="space-y-1">
                 {car.notes && <p className="text-sm mb-4">{car.notes}</p>}
                 {car.noteLines.filter(l => l).map((l, i) => <p key={i} className="text-sm">• {l}</p>)}
              </div>
           </div>
           <div>
              <h3 className="text-xl font-bold text-gray-400 mb-3">الأوراق المطلوبة</h3>
              <div className="grid grid-cols-1 gap-1">
                 {car.requiredPapers.filter(p => p).map((p, i) => (
                   <p key={i} className="text-sm flex items-center gap-2">
                     <span className="opacity-30">{i+1}.</span> {p}
                   </p>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsModal;
