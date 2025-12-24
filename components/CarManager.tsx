
import React, { useState } from 'react';
import { Car, Theme } from '../types';
import { Plus, Search, Edit, Trash2, Eye, Calendar, DollarSign, Filter, Image as ImageIcon } from 'lucide-react';
import { YEARS } from '../constants';
import CarForm from './CarForm';

interface CarManagerProps {
  cars: Car[];
  brands: string[];
  theme: Theme;
  onAddCar: (car: Car) => void;
  onUpdateCar: (car: Car) => void;
  onDeleteCar: (id: string) => void;
  onAddBrand: (brand: string) => void;
  onViewCar: (car: Car) => void;
}

const CarManager: React.FC<CarManagerProps> = ({ 
  cars, brands, theme, onAddCar, onUpdateCar, onDeleteCar, onAddBrand, onViewCar
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | undefined>(undefined);
  const [isSearching, setIsSearching] = useState(false);

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          car.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || car.brand === selectedBrand;
    const matchesYear = selectedYear === 'all' || car.year === parseInt(selectedYear);
    return matchesSearch && matchesBrand && matchesYear;
  });

  const handleSearchClick = () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 800);
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setIsFormOpen(true);
  };

  const handleSave = (car: Car) => {
    if (editingCar) {
      onUpdateCar(car);
    } else {
      onAddCar(car);
    }
    setIsFormOpen(false);
    setEditingCar(undefined);
  };

  const tableHeaderClass = `p-3 text-right font-bold border-b ${theme === 'ios' ? 'border-gray-200 text-gray-500' : 'border-gray-700 text-gray-400'}`;
  const tableRowClass = `transition-colors ${
    theme === 'glass' ? 'hover:bg-white/5 border-b border-white/5 text-white' :
    theme === 'win10' ? 'hover:bg-blue-900/20 border-b border-gray-700 text-white' :
    theme === 'ios' ? 'hover:bg-gray-50 border-b border-gray-100 text-black' :
    'hover:bg-gray-800 border-b border-gray-700 text-white'
  }`;

  const selectClass = `px-4 py-2 rounded-lg outline-none cursor-pointer flex-grow lg:flex-grow-0 transition-all
    ${theme === 'ios' ? 'bg-gray-100 text-black' : 'bg-gray-800 text-white border border-gray-700 focus:border-blue-500'}`;

  return (
    <div className="h-full flex flex-col p-4 overflow-hidden">
      <div className="flex flex-col gap-4 mb-6 flex-shrink-0">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute right-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="بحث بالاسم..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pr-10 pl-4 py-2 rounded-lg outline-none
                 ${theme === 'ios' ? 'bg-gray-100 focus:bg-white border-transparent' : 'bg-gray-800 border border-gray-700 focus:border-blue-500 text-white'}`}
            />
          </div>

          <button 
            onClick={() => { setEditingCar(undefined); setIsFormOpen(true); }}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg transition-all active:scale-95 w-full lg:w-auto font-bold"
          >
            <Plus size={20} />
            <span>إضافة سيارة</span>
          </button>
        </div>

        <div className={`p-4 rounded-xl flex flex-wrap items-center gap-4 ${theme === 'ios' ? 'bg-white shadow-sm' : 'bg-white/5 border border-white/10'}`}>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-blue-400" />
            <span className="font-bold text-sm hidden sm:inline">فلتر الموديلات:</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[10px] opacity-60 mr-1">اسم الشركة</label>
              <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className={selectClass}>
                <option value="all">كل الشركات</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[10px] opacity-60 mr-1">سنة الصنع</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className={selectClass}>
                <option value="all">كل السنوات</option>
                {YEARS.filter(y => y >= 2010 && y <= 2025).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <button 
              className={`mt-5 px-8 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all flex items-center justify-center gap-2 self-end font-bold shadow-lg active:scale-95 ${isSearching ? 'animate-pulse' : ''}`}
              onClick={handleSearchClick}
            >
              <Search size={18} />
              بحث
            </button>
          </div>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto rounded-xl shadow-xl p-1
         ${theme === 'glass' ? 'bg-white/5 backdrop-blur-md' :
           theme === 'ios' ? 'bg-gray-50' :
           'bg-gray-900 border border-gray-800'
         }`}>
        
        {/* Desktop View */}
        <div className="hidden md:block w-full">
            <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-inherit">
                <tr>
                <th className={tableHeaderClass}>الصورة</th>
                <th className={tableHeaderClass}>الشركة</th>
                <th className={tableHeaderClass}>الموديل والفئة</th>
                <th className={tableHeaderClass}>السنة</th>
                <th className={tableHeaderClass}>السعر</th>
                <th className={tableHeaderClass}>إجراءات</th>
                </tr>
            </thead>
            <tbody>
                {filteredCars.length === 0 ? (
                <tr>
                    <td colSpan={6} className="p-12 text-center opacity-50">لا توجد بيانات متاحة حالياً</td>
                </tr>
                ) : filteredCars.map(car => (
                <tr key={car.id} className={tableRowClass}>
                    <td className="p-3">
                      <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center border border-white/10">
                        {(car.images && car.images.length > 0) ? <img src={car.images[0]} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="opacity-20" />}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-white/10 rounded text-xs">{car.brand}</span>
                    </td>
                    <td className="p-3 font-bold">{car.name}</td>
                    <td className="p-3 opacity-70">{car.year}</td>
                    <td className="p-3 font-mono text-green-500 font-bold">
                      {Math.min(...car.categories.map(c => c.price)).toLocaleString()} ج.م
                    </td>
                    <td className="p-3 flex gap-2 justify-end">
                      <button onClick={() => onViewCar(car)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded"><Eye size={18}/></button>
                      <button onClick={() => handleEdit(car)} className="p-2 text-yellow-400 hover:bg-yellow-500/10 rounded"><Edit size={18}/></button>
                      <button onClick={() => onDeleteCar(car.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded"><Trash2 size={18}/></button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden grid grid-cols-1 gap-4 p-2">
            {filteredCars.map(car => (
                <div key={car.id} className={`p-4 rounded-xl flex flex-col gap-2 ${theme === 'ios' ? 'bg-white shadow text-black' : 'bg-white/5 border border-white/10 text-white'}`}>
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-20 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center border border-white/10 flex-shrink-0">
                         {(car.images && car.images.length > 0) ? <img src={car.images[0]} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="opacity-20" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg">{car.brand} {car.name}</h3>
                            <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">{car.year}</span>
                        </div>
                        <div className="font-bold text-green-500 font-mono mt-1">
                          {Math.min(...car.categories.map(c => c.price)).toLocaleString()} ج.م
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2 pt-2 border-t border-white/5">
                        <button onClick={() => onViewCar(car)} className="flex-1 py-2 bg-blue-500/10 text-blue-400 rounded text-sm font-bold">التفاصيل</button>
                        <button onClick={() => handleEdit(car)} className="p-2 bg-yellow-500/10 text-yellow-400 rounded"><Edit size={16}/></button>
                        <button onClick={() => onDeleteCar(car.id)} className="p-2 bg-red-500/10 text-red-400 rounded"><Trash2 size={16}/></button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {isFormOpen && (
        <CarForm 
          car={editingCar}
          brands={brands}
          onSave={handleSave}
          onClose={() => setIsFormOpen(false)}
          onAddBrand={onAddBrand}
          theme={theme}
        />
      )}
    </div>
  );
};

export default CarManager;
