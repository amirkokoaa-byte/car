import React, { useState } from 'react';
import { Car, Theme } from '../types';
import { Plus, Search, Edit, Trash2, Eye, Calendar, DollarSign } from 'lucide-react';
import CarForm from './CarForm';

interface CarManagerProps {
  cars: Car[];
  brands: string[];
  theme: Theme;
  onAddCar: (car: Car) => void;
  onUpdateCar: (car: Car) => void;
  onDeleteCar: (id: string) => void;
  onAddBrand: (brand: string) => void;
  onViewCar: (car: Car) => void; // Added prop
}

const CarManager: React.FC<CarManagerProps> = ({ 
  cars, brands, theme, onAddCar, onUpdateCar, onDeleteCar, onAddBrand, onViewCar
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | undefined>(undefined);

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          car.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || car.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

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
    theme === 'glass' ? 'hover:bg-white/5 border-b border-white/5' :
    theme === 'win10' ? 'hover:bg-blue-900/20 border-b border-gray-700' :
    theme === 'ios' ? 'hover:bg-gray-50 border-b border-gray-100 text-black' :
    'hover:bg-gray-800 border-b border-gray-700'
  }`;

  const cardClass = `p-4 rounded-xl flex flex-col gap-3 shadow-md
    ${theme === 'ios' ? 'bg-white text-black' : 
      theme === 'glass' ? 'bg-white/10 border border-white/10' :
      'bg-gray-800 border border-gray-700'}`;

  return (
    <div className="h-full flex flex-col p-4">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full lg:w-1/3">
          <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="بحث عن سيارة..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pr-10 pl-4 py-2 rounded-lg outline-none
               ${theme === 'ios' ? 'bg-gray-100 focus:bg-white border-transparent' : 'bg-gray-800 border border-gray-700 focus:border-blue-500 text-white'}`}
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-end">
          <select 
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className={`px-4 py-2 rounded-lg outline-none cursor-pointer flex-grow lg:flex-grow-0
              ${theme === 'ios' ? 'bg-gray-100 text-black' : 'bg-gray-800 text-white border border-gray-700'}`}
          >
            <option value="all">كل الماركات</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <button 
            onClick={() => { setEditingCar(undefined); setIsFormOpen(true); }}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg transition-all active:scale-95 flex-grow lg:flex-grow-0"
          >
            <Plus size={20} />
            <span>أضف سيارة</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={`flex-1 overflow-y-auto rounded-xl shadow-xl p-1
         ${theme === 'glass' ? 'bg-white/5 backdrop-blur-md' :
           theme === 'ios' ? 'bg-gray-50' :
           'bg-gray-900 border border-gray-800'
         }`}>
        
        {/* Mobile View: Cards */}
        <div className="md:hidden grid grid-cols-1 gap-4 p-2">
            {filteredCars.length === 0 ? (
                 <div className="text-center opacity-50 p-8">لا توجد بيانات</div>
            ) : filteredCars.map(car => (
                <div key={car.id} className={cardClass}>
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-xs opacity-60 bg-white/10 px-2 py-0.5 rounded">{car.brand}</span>
                            <h3 className="font-bold text-lg">{car.name}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${car.isAvailable ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                           {car.isAvailable ? 'متاح' : 'غير متاح'}
                        </span>
                    </div>
                    
                    <div className="flex gap-4 text-sm opacity-80 my-1">
                        <div className="flex items-center gap-1">
                           <Calendar size={14}/> {car.year}
                        </div>
                        <div className="flex items-center gap-1 text-green-400 font-mono">
                           <DollarSign size={14}/> {Math.min(...car.categories.map(c => c.price || 99999999)).toLocaleString()}
                        </div>
                    </div>

                    <div className="flex gap-2 mt-2 pt-2 border-t border-gray-600/30">
                        <button onClick={() => onViewCar(car)} className="flex-1 py-2 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 flex justify-center items-center gap-1">
                            <Eye size={16}/> التفاصيل
                        </button>
                        <button onClick={() => handleEdit(car)} className="p-2 bg-yellow-500/10 text-yellow-400 rounded hover:bg-yellow-500/20">
                            <Edit size={16}/>
                        </button>
                        <button onClick={() => onDeleteCar(car.id)} className="p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20">
                            <Trash2 size={16}/>
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block w-full">
            <table className="w-full border-collapse">
            <thead>
                <tr>
                <th className={tableHeaderClass}>الشركة</th>
                <th className={tableHeaderClass}>الموديل</th>
                <th className={tableHeaderClass}>السنة</th>
                <th className={tableHeaderClass}>السعر (يبدأ من)</th>
                <th className={tableHeaderClass}>الحالة</th>
                <th className={tableHeaderClass}>إجراءات</th>
                </tr>
            </thead>
            <tbody>
                {filteredCars.length === 0 ? (
                <tr>
                    <td colSpan={6} className="p-8 text-center opacity-50">لا توجد سيارات مطابقة للبحث</td>
                </tr>
                ) : filteredCars.map(car => (
                <tr key={car.id} className={tableRowClass}>
                    <td className="p-3">{car.brand}</td>
                    <td className="p-3 font-bold">{car.name}</td>
                    <td className="p-3">{car.year}</td>
                    <td className="p-3 font-mono text-green-500 font-bold">
                    {Math.min(...car.categories.map(c => c.price || 99999999)).toLocaleString()}
                    </td>
                    <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${car.isAvailable ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {car.isAvailable ? 'متاح' : 'غير متاح'}
                    </span>
                    </td>
                    <td className="p-3 flex gap-2 justify-end">
                    <button onClick={() => onViewCar(car)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded transition" title="عرض التفاصيل">
                        <Eye size={18}/>
                    </button>
                    <button onClick={() => handleEdit(car)} className="p-2 text-yellow-400 hover:bg-yellow-500/10 rounded transition" title="تعديل">
                        <Edit size={18}/>
                    </button>
                    <button onClick={() => onDeleteCar(car.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded transition" title="حذف">
                        <Trash2 size={18}/>
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>

      {/* Form Popup */}
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