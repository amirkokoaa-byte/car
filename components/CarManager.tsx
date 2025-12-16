import React, { useState } from 'react';
import { Car, Theme } from '../types';
import { Plus, Search, Edit, Trash2, Eye, X } from 'lucide-react';
import CarForm from './CarForm';

interface CarManagerProps {
  cars: Car[];
  brands: string[];
  theme: Theme;
  onAddCar: (car: Car) => void;
  onUpdateCar: (car: Car) => void;
  onDeleteCar: (id: string) => void;
  onAddBrand: (brand: string) => void;
}

const CarManager: React.FC<CarManagerProps> = ({ 
  cars, brands, theme, onAddCar, onUpdateCar, onDeleteCar, onAddBrand 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | undefined>(undefined);
  const [viewingCar, setViewingCar] = useState<Car | undefined>(undefined);

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

  return (
    <div className="h-full flex flex-col p-4">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/3">
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

        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className={`px-4 py-2 rounded-lg outline-none cursor-pointer
              ${theme === 'ios' ? 'bg-gray-100 text-black' : 'bg-gray-800 text-white border border-gray-700'}`}
          >
            <option value="all">كل الماركات</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <button 
            onClick={() => { setEditingCar(undefined); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg transition-all active:scale-95"
          >
            <Plus size={20} />
            <span>أضف سيارة</span>
          </button>
        </div>
      </div>

      {/* Grid/Table */}
      <div className={`flex-1 overflow-y-auto rounded-xl shadow-xl
         ${theme === 'glass' ? 'bg-white/5 backdrop-blur-md' :
           theme === 'ios' ? 'bg-white' :
           'bg-gray-900 border border-gray-800'
         }`}>
        
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
                  <button onClick={() => setViewingCar(car)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded transition" title="عرض التفاصيل">
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

      {/* Details View Popup */}
      {viewingCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={() => setViewingCar(undefined)}>
           <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-2xl relative
             ${theme === 'ios' ? 'bg-white text-black' : 'bg-gray-900 text-white border border-gray-700'}`} 
             onClick={e => e.stopPropagation()}>
             
             <button onClick={() => setViewingCar(undefined)} className="absolute left-4 top-4 p-2 bg-red-500 text-white rounded-full">
               <X size={20}/>
             </button>

             <h2 className="text-3xl font-bold mb-2">{viewingCar.brand} - {viewingCar.name} ({viewingCar.year})</h2>
             <div className="flex gap-2 mb-6">
                <span className={`px-3 py-1 rounded ${viewingCar.isAvailable ? 'bg-green-600' : 'bg-red-600'} text-white text-sm`}>
                    {viewingCar.isAvailable ? 'متاح للبيع' : 'غير متاح'}
                </span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <h3 className="text-xl font-bold text-blue-400 mb-3 border-b border-gray-700 pb-2">المواصفات</h3>
                   <p className="mb-4 text-sm opacity-80 whitespace-pre-wrap">{viewingCar.description}</p>
                   <ul className="list-disc list-inside space-y-1 text-sm opacity-80">
                      {viewingCar.descLines.filter(l => l).map((l, i) => <li key={i}>{l}</li>)}
                   </ul>
                </div>

                <div>
                   <h3 className="text-xl font-bold text-green-400 mb-3 border-b border-gray-700 pb-2">الأسعار والفئات</h3>
                   <div className="space-y-2">
                      {viewingCar.categories.map((c, i) => (
                        <div key={i} className="flex justify-between p-2 bg-white/5 rounded">
                           <span>{c.name}</span>
                           <span className="font-mono font-bold">{c.price.toLocaleString()} ج.م</span>
                        </div>
                      ))}
                   </div>

                   <h3 className="text-xl font-bold text-purple-400 mt-6 mb-3 border-b border-gray-700 pb-2">نظام التقسيط (مثال)</h3>
                   <div className="p-4 bg-white/5 rounded">
                      <div className="flex justify-between mb-2"><span>سعر السيارة الأساسي:</span> <span>{viewingCar.installment.basePrice.toLocaleString()}</span></div>
                      <div className="flex justify-between mb-2"><span>المقدم:</span> <span>{viewingCar.installment.downPayment.toLocaleString()}</span></div>
                      <div className="flex justify-between mb-2"><span>الفائدة:</span> <span>{viewingCar.installment.interestRate}%</span></div>
                      <div className="flex justify-between mb-2"><span>سنوات:</span> <span>{viewingCar.installment.years}</span></div>
                      <div className="border-t border-gray-600 mt-2 pt-2 flex justify-between font-bold text-lg text-yellow-400">
                         <span>القسط الشهري:</span>
                         <span>{viewingCar.installment.monthlyInstallment.toLocaleString()} ج.م</span>
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-400 mb-2">ملاحظات</h3>
                <p className="text-sm opacity-70 whitespace-pre-wrap">{viewingCar.notes}</p>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CarManager;