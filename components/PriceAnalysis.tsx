import React, { useState } from 'react';
import { Car, Theme } from '../types';
import { ArrowUp, ArrowDown, Search } from 'lucide-react';

interface PriceAnalysisProps {
  cars: Car[];
  brands: string[];
  onCarClick: (car: Car) => void;
  theme: Theme;
}

const PriceAnalysis: React.FC<PriceAnalysisProps> = ({ cars, brands, onCarClick, theme }) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  const filteredCars = selectedBrand === 'all' 
    ? cars 
    : cars.filter(c => c.brand === selectedBrand);

  // Group by brand if 'all' is selected, or just show list
  // The requirement says: "Separate each company... Hyundai Low/High, Mercedes Low/High"
  
  const brandsToShow = selectedBrand === 'all' ? brands : [selectedBrand];

  const getBrandStats = (brandName: string) => {
    const brandCars = cars.filter(c => c.brand === brandName);
    if (brandCars.length === 0) return null;

    // Determine price by lowest category price
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

  const cardClass = `p-4 rounded-lg flex flex-col gap-2 transition cursor-pointer hover:bg-opacity-80
    ${theme === 'glass' ? 'bg-white/5 hover:bg-white/10 border border-white/10' :
      theme === 'win10' ? 'bg-[#252526] border border-gray-600 hover:border-blue-500' :
      theme === 'ios' ? 'bg-white shadow-sm hover:shadow-md text-black' :
      'bg-gray-800 border border-gray-700'}`;

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-inherit z-10 py-2 backdrop-blur-md">
         <h2 className="text-2xl font-bold">تحليل الأسعار (أعلى وأقل سعر)</h2>
         <select 
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className={`p-2 rounded ${theme === 'ios' ? 'bg-gray-200 text-black' : 'bg-gray-800 text-white border border-gray-600'}`}
         >
            <option value="all">كل الشركات</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
         </select>
      </div>

      <div className="space-y-8">
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
    </div>
  );
};

export default PriceAnalysis;