import React, { useState } from 'react';
import { Car, Theme } from '../types';
import { ArrowUp, ArrowDown, Search, Wallet, Eye, Filter } from 'lucide-react';

interface PriceAnalysisProps {
  cars: Car[];
  brands: string[];
  onCarClick: (car: Car) => void;
  theme: Theme;
}

const PriceAnalysis: React.FC<PriceAnalysisProps> = ({ cars, brands, onCarClick, theme }) => {
  const [viewMode, setViewMode] = useState<'brands' | 'budget'>('brands');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  
  // Budget State
  const [minBudget, setMinBudget] = useState<string>('');
  const [maxBudget, setMaxBudget] = useState<string>('');

  // --- Filtering Logic ---
  const brandsToShow = selectedBrand === 'all' ? brands : [selectedBrand];

  const getBrandStats = (brandName: string) => {
    const brandCars = cars.filter(c => c.brand === brandName);
    if (brandCars.length === 0) return null;

    const sorted = [...brandCars].sort((a, b) => {
        const minA = Math.min(...a.categories.map(cat => cat.price || 999999999));
        const minB = Math.min(...b.categories.map(cat => cat.price || 999999999));
        return minA - minB;
    });

    return {
        brand: brandName,
        lowest: sorted[0],
        highest: sorted[sorted.length - 1],
        all: sorted
    };
  };

  const getBudgetCars = () => {
    const min = Number(minBudget) || 0;
    const max = Number(maxBudget) || 999999999;

    return cars.filter(car => {
      // Get the lowest price configuration for this car
      const carStartPrice = Math.min(...car.categories.map(c => c.price));
      // Check if the car's starting price falls within the user's budget range
      return carStartPrice >= min && carStartPrice <= max;
    });
  };

  const budgetResults = getBudgetCars();

  // --- Styling ---
  const cardClass = `p-4 rounded-lg flex flex-col gap-2 transition cursor-pointer hover:bg-opacity-80
    ${theme === 'glass' ? 'bg-white/5 hover:bg-white/10 border border-white/10' :
      theme === 'win10' ? 'bg-[#252526] border border-gray-600 hover:border-blue-500' :
      theme === 'ios' ? 'bg-white shadow-sm hover:shadow-md text-black' :
      'bg-gray-800 border border-gray-700'}`;

  const inputClass = `p-2 rounded outline-none border transition-all w-32 or-auto
    ${theme === 'ios' ? 'bg-white text-black border-gray-300' : 'bg-gray-800 text-white border-gray-600 focus:border-blue-500'}`;

  const toggleBtnClass = (active: boolean) => `px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-bold text-sm
    ${active 
      ? 'bg-blue-600 text-white shadow-lg' 
      : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'}`;

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Header & Controls */}
      <div className={`mb-6 sticky top-0 z-20 pb-4 pt-2 border-b border-gray-700/30 backdrop-blur-md flex flex-col gap-4`}>
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold hidden md:block">تحليل الأسعار</h2>
            
            {/* View Toggle */}
            <div className="flex bg-black/20 p-1 rounded-xl">
               <button onClick={() => setViewMode('brands')} className={toggleBtnClass(viewMode === 'brands')}>
                 <Search size={16}/> حسب الماركة
               </button>
               <button onClick={() => setViewMode('budget')} className={toggleBtnClass(viewMode === 'budget')}>
                 <Wallet size={16}/> سعر معين (ميزانية)
               </button>
            </div>
         </div>

         {/* Filters based on View Mode */}
         <div className="flex flex-wrap gap-4 items-center bg-white/5 p-4 rounded-xl">
            {viewMode === 'brands' ? (
              <>
                 <label className="font-bold text-sm opacity-70">اختر الشركة:</label>
                 <select 
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className={inputClass}
                    style={{width: '200px'}}
                 >
                    <option value="all">كل الشركات</option>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                 </select>
              </>
            ) : (
              <>
                 <div className="flex items-center gap-2">
                   <label className="font-bold text-sm opacity-70">أقل مبلغ:</label>
                   <input 
                     type="number" 
                     value={minBudget} 
                     onChange={(e) => setMinBudget(e.target.value)} 
                     className={inputClass}
                     placeholder="0"
                   />
                 </div>
                 <div className="flex items-center gap-2">
                   <label className="font-bold text-sm opacity-70">أقصى مبلغ:</label>
                   <input 
                     type="number" 
                     value={maxBudget} 
                     onChange={(e) => setMaxBudget(e.target.value)} 
                     className={inputClass}
                     placeholder="مثال: 2000000"
                   />
                 </div>
                 <div className="flex-1 text-left text-xs opacity-50 px-2">
                    * يتم البحث عن السيارات التي يبدأ سعرها داخل هذا النطاق
                 </div>
              </>
            )}
         </div>
      </div>

      {/* Content: Brand Stats View */}
      {viewMode === 'brands' && (
        <div className="space-y-8 animate-fade-in">
          {brandsToShow.map(brand => {
              const stats = getBrandStats(brand);
              if (!stats) return null;

              return (
                  <div key={brand} className={`p-6 rounded-xl ${theme === 'ios' ? 'bg-gray-50' : 'bg-white/5'}`}>
                      <h3 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2 text-blue-400">{brand}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Lowest Price */}
                          <div onClick={() => onCarClick(stats.lowest)} className={`${cardClass} border-l-4 border-l-green-500`}>
                              <div className="flex justify-between items-start">
                                  <span className="font-bold text-lg">{stats.lowest.name}</span>
                                  <span className="bg-green-500 text-black text-xs px-2 py-1 rounded font-bold flex items-center gap-1">
                                      <ArrowDown size={12}/> الأقل سعراً
                                  </span>
                              </div>
                              <div className="text-sm opacity-70">{stats.lowest.year}</div>
                              <div className="font-mono text-xl text-green-400">
                                  {Math.min(...stats.lowest.categories.map(c => c.price)).toLocaleString()} ج.م
                              </div>
                          </div>

                          {/* Highest Price */}
                          <div onClick={() => onCarClick(stats.highest)} className={`${cardClass} border-l-4 border-l-red-500`}>
                               <div className="flex justify-between items-start">
                                  <span className="font-bold text-lg">{stats.highest.name}</span>
                                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold flex items-center gap-1">
                                      <ArrowUp size={12}/> الأعلى سعراً
                                  </span>
                              </div>
                              <div className="text-sm opacity-70">{stats.highest.year}</div>
                              <div className="font-mono text-xl text-red-400">
                                  {Math.max(...stats.highest.categories.map(c => c.price)).toLocaleString()} ج.م
                              </div>
                          </div>

                          {/* Button to see all cars of this brand */}
                          <div className="flex items-center justify-center">
                              <button 
                                  onClick={() => setSelectedBrand(brand)}
                                  className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/40 transition flex items-center gap-2"
                              >
                                  <Search size={16} />
                                  عرض كل سيارات {brand}
                              </button>
                          </div>
                      </div>

                      {/* If specific brand selected, show all sorted by price */}
                      {selectedBrand === brand && (
                          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
                              {stats.all.map(car => (
                                  <div key={car.id} onClick={() => onCarClick(car)} className={cardClass}>
                                      <div className="font-bold">{car.name}</div>
                                      <div className="text-sm opacity-60">{car.year}</div>
                                      <div className="mt-2 font-mono">
                                          {Math.min(...car.categories.map(c => c.price)).toLocaleString()} ج.م
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              );
          })}
        </div>
      )}

      {/* Content: Budget View */}
      {viewMode === 'budget' && (
        <div className="animate-fade-in">
           {budgetResults.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 opacity-50">
               <Filter size={48} className="mb-4" />
               <p className="text-xl">لا توجد سيارات في هذا النطاق السعري</p>
               <p className="text-sm">حاول توسيع نطاق البحث</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {budgetResults.map(car => {
                  const minPrice = Math.min(...car.categories.map(c => c.price));
                  return (
                    <div key={car.id} className={`${cardClass} hover:scale-[1.02] relative group`}>
                       <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs opacity-60 bg-white/10 px-2 py-0.5 rounded">{car.brand}</span>
                            <h3 className="font-bold text-lg">{car.name}</h3>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${car.isAvailable ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                              {car.isAvailable ? 'متاح' : 'غير متاح'}
                          </span>
                       </div>

                       <div className="mt-2 text-sm opacity-70 line-clamp-2">
                         {car.description}
                       </div>
                       
                       <div className="mt-auto pt-4 border-t border-gray-600/30">
                          <div className="flex justify-between items-center mb-3">
                             <span className="text-xs">يبدأ من:</span>
                             <span className="font-mono font-bold text-lg text-green-400">{minPrice.toLocaleString()}</span>
                          </div>
                          
                          <button 
                             onClick={() => onCarClick(car)}
                             className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition flex items-center justify-center gap-2"
                          >
                             <Eye size={18} />
                             عرض التفاصيل
                          </button>
                       </div>
                    </div>
                  );
                })}
             </div>
           )}
        </div>
      )}

    </div>
  );
};

export default PriceAnalysis;