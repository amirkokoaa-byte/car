import React, { useState } from 'react';
import { Car, Theme } from '../types';
import { Search, ArrowRightLeft } from 'lucide-react';

interface CarComparisonProps {
  cars: Car[];
  theme: Theme;
}

const CarComparison: React.FC<CarComparisonProps> = ({ cars, theme }) => {
  const [car1Id, setCar1Id] = useState<string>('');
  const [car2Id, setCar2Id] = useState<string>('');
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');

  const car1 = cars.find(c => c.id === car1Id);
  const car2 = cars.find(c => c.id === car2Id);

  const filteredCars1 = cars.filter(c => 
    (c.name.includes(searchTerm1) || c.brand.includes(searchTerm1)) && c.id !== car2Id
  );

  const filteredCars2 = cars.filter(c => 
    (c.name.includes(searchTerm2) || c.brand.includes(searchTerm2)) && c.id !== car1Id
  );

  const inputClass = `w-full p-2 rounded outline-none border mb-2
    ${theme === 'ios' ? 'bg-gray-100 text-black border-transparent' : 'bg-gray-800 text-white border-gray-600'}`;
  
  const selectClass = `w-full p-2 rounded outline-none border
    ${theme === 'ios' ? 'bg-white text-black border-gray-300' : 'bg-gray-900 text-white border-gray-700'}`;

  const renderCarColumn = (car: Car | undefined, isLeft: boolean) => {
    if (!car) return <div className="p-10 text-center opacity-30">اختر سيارة</div>;

    const minPrice = Math.min(...car.categories.map(c => c.price));
    const maxPrice = Math.max(...car.categories.map(c => c.price));

    return (
      <div className="flex flex-col gap-4">
        <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
           <h3 className="text-xl font-bold">{car.brand} {car.name}</h3>
           <div className="text-sm opacity-70">{car.year}</div>
        </div>

        <div className="space-y-4">
           <div>
             <label className="text-xs opacity-50 block mb-1">نطاق السعر</label>
             <div className="font-mono font-bold text-green-400">
               {minPrice.toLocaleString()} - {maxPrice.toLocaleString()}
             </div>
           </div>

           <div>
             <label className="text-xs opacity-50 block mb-1">الوصف</label>
             <p className="text-sm leading-relaxed opacity-80">{car.description}</p>
           </div>
           
           <div>
             <label className="text-xs opacity-50 block mb-1">المواصفات</label>
             <ul className="list-disc list-inside text-sm space-y-1">
               {car.descLines.filter(l => l).map((l, i) => <li key={i}>{l}</li>)}
             </ul>
           </div>
        </div>
      </div>
    );
  };

  const getDifferences = () => {
    if (!car1 || !car2) return null;
    
    // Find lines in car1 not in car2
    const uniqueTo1 = car1.descLines.filter(l => l && !car2.descLines.includes(l));
    const uniqueTo2 = car2.descLines.filter(l => l && !car1.descLines.includes(l));
    
    const minPrice1 = Math.min(...car1.categories.map(c => c.price));
    const minPrice2 = Math.min(...car2.categories.map(c => c.price));
    const priceDiff = minPrice1 - minPrice2;

    return (
      <div className={`mt-8 p-6 rounded-xl border ${theme === 'ios' ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-gray-700'}`}>
         <h3 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
           <ArrowRightLeft size={20}/>
           <span>نقاط الاختلاف</span>
         </h3>

         <div className="grid grid-cols-2 gap-8">
            <div>
               <h4 className="font-bold text-blue-400 mb-2">مميزات {car1.name} (غير موجودة في الأخرى)</h4>
               <ul className="text-sm space-y-1 list-disc list-inside opacity-80">
                 {uniqueTo1.length > 0 ? uniqueTo1.map((l, i) => <li key={i}>{l}</li>) : <li>لا توجد فروقات جوهرية مسجلة</li>}
               </ul>
               <div className="mt-4 text-sm">
                  {priceDiff > 0 
                    ? <span className="text-red-400">أغلى بـ {priceDiff.toLocaleString()} ج.م</span> 
                    : <span className="text-green-400">أرخص بـ {Math.abs(priceDiff).toLocaleString()} ج.م</span>
                  }
               </div>
            </div>

            <div>
               <h4 className="font-bold text-blue-400 mb-2">مميزات {car2.name} (غير موجودة في الأخرى)</h4>
               <ul className="text-sm space-y-1 list-disc list-inside opacity-80">
                 {uniqueTo2.length > 0 ? uniqueTo2.map((l, i) => <li key={i}>{l}</li>) : <li>لا توجد فروقات جوهرية مسجلة</li>}
               </ul>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="h-full p-4 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">مقارنة السيارات</h2>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-lg bg-black/20">
           <label className="block mb-2 font-bold text-blue-300">السيارة الأولى</label>
           <div className="relative mb-2">
             <Search className="absolute right-2 top-2.5 text-gray-400" size={16}/>
             <input 
               type="text" 
               placeholder="بحث سريع..." 
               value={searchTerm1}
               onChange={e => setSearchTerm1(e.target.value)}
               className={`${inputClass} pr-8`}
             />
           </div>
           <select 
             value={car1Id} 
             onChange={e => setCar1Id(e.target.value)}
             className={selectClass}
           >
             <option value="">اختر السيارة...</option>
             {filteredCars1.map(c => <option key={c.id} value={c.id}>{c.brand} - {c.name}</option>)}
           </select>
        </div>

        <div className="p-4 rounded-lg bg-black/20">
           <label className="block mb-2 font-bold text-green-300">السيارة الثانية</label>
           <div className="relative mb-2">
             <Search className="absolute right-2 top-2.5 text-gray-400" size={16}/>
             <input 
               type="text" 
               placeholder="بحث سريع..." 
               value={searchTerm2}
               onChange={e => setSearchTerm2(e.target.value)}
               className={`${inputClass} pr-8`}
             />
           </div>
           <select 
             value={car2Id} 
             onChange={e => setCar2Id(e.target.value)}
             className={selectClass}
           >
             <option value="">اختر السيارة...</option>
             {filteredCars2.map(c => <option key={c.id} value={c.id}>{c.brand} - {c.name}</option>)}
           </select>
        </div>
      </div>

      {/* Comparison View */}
      {car1 && car2 ? (
        <div className="animate-fade-in">
           <div className="grid grid-cols-2 gap-4 md:gap-8 border-t border-gray-700 pt-6">
              <div className="border-l border-gray-700 pl-4 md:pl-8">
                {renderCarColumn(car1, true)}
              </div>
              <div>
                {renderCarColumn(car2, false)}
              </div>
           </div>

           {getDifferences()}
        </div>
      ) : (
        <div className="text-center opacity-30 mt-10">
          الرجاء اختيار سيارتين للمقارنة
        </div>
      )}
    </div>
  );
};

export default CarComparison;