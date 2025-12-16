import React, { useState, useEffect } from 'react';
import { Car, Category, InstallmentPlan } from '../types';
import { YEARS, MAX_DESC_LINES, DEFAULT_DESC_LINES } from '../constants';
import { X, Plus, Trash2, Save } from 'lucide-react';

interface CarFormProps {
  car?: Car;
  brands: string[];
  onSave: (car: Car) => void;
  onClose: () => void;
  onAddBrand: (brand: string) => void;
  theme: string;
}

const CarForm: React.FC<CarFormProps> = ({ car, brands, onSave, onClose, onAddBrand, theme }) => {
  // State Initialization
  const [brand, setBrand] = useState(car?.brand || brands[0] || '');
  const [year, setYear] = useState(car?.year || new Date().getFullYear());
  const [name, setName] = useState(car?.name || '');
  const [isAvailable, setIsAvailable] = useState(car ? car.isAvailable : true);
  
  // Description
  const [description, setDescription] = useState(car?.description || '');
  const [descLines, setDescLines] = useState<string[]>(car?.descLines || Array(DEFAULT_DESC_LINES).fill(''));

  // Categories
  const [categories, setCategories] = useState<Category[]>(car?.categories || [
    { id: '1', name: 'الفئة الأولى', price: 0 },
    { id: '2', name: 'الفئة الثانية', price: 0 },
    { id: '3', name: 'الفئة الثالثة', price: 0 },
  ]);

  // Installment
  const [installment, setInstallment] = useState<InstallmentPlan>(car?.installment || {
    basePrice: 0,
    downPayment: 0,
    interestRate: 0,
    years: 1,
    monthlyInstallment: 0
  });

  // Notes & Papers
  const [notes, setNotes] = useState(car?.notes || '');
  const [noteLines, setNoteLines] = useState<string[]>(car?.noteLines || Array(5).fill(''));
  const [requiredPapers, setRequiredPapers] = useState<string[]>(car?.requiredPapers || Array(10).fill(''));

  const [newBrandName, setNewBrandName] = useState('');
  const [showBrandInput, setShowBrandInput] = useState(false);

  // Styling helper
  const inputClass = `w-full p-2 rounded outline-none border transition-all 
    ${theme === 'glass' ? 'bg-white/10 border-white/20 focus:border-blue-400 text-white' : 
      theme === 'win10' ? 'bg-gray-800 border-gray-600 rounded-none focus:border-blue-500 text-white' :
      theme === 'ios' ? 'bg-gray-100 border-transparent focus:bg-white text-black rounded-lg' :
      'bg-gray-800 border-gray-700 text-white focus:border-blue-500'}`;

  const labelClass = `block mb-1 text-sm font-bold ${theme === 'ios' ? 'text-gray-500' : 'text-gray-300'}`;

  // Handlers
  const handleAddBrand = () => {
    if (newBrandName && !brands.includes(newBrandName)) {
      if (brands.length >= 30) {
        alert("لا يمكن إضافة أكثر من 30 شركة");
        return;
      }
      onAddBrand(newBrandName);
      setBrand(newBrandName);
      setNewBrandName('');
      setShowBrandInput(false);
    }
  };

  const addDescLine = () => {
    if (descLines.length < MAX_DESC_LINES) {
      setDescLines([...descLines, '']);
    }
  };

  const addCategory = () => {
    if (categories.length < 10) {
      setCategories([...categories, { id: Date.now().toString(), name: `الفئة ${categories.length + 1}`, price: 0 }]);
    }
  };

  const calculateInstallment = () => {
    const { basePrice, downPayment, interestRate, years } = installment;
    const principal = basePrice - downPayment;
    if (principal <= 0) return 0;
    const totalInterest = principal * (interestRate / 100) * years;
    const totalAmount = principal + totalInterest;
    const monthly = totalAmount / (years * 12);
    
    return Math.round(monthly);
  };

  useEffect(() => {
    const calculated = calculateInstallment();
    setInstallment(prev => ({ ...prev, monthlyInstallment: calculated }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [installment.basePrice, installment.downPayment, installment.interestRate, installment.years]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCar: Car = {
      id: car?.id || Date.now().toString(),
      brand,
      year,
      name,
      description,
      descLines,
      categories,
      installment,
      isAvailable,
      notes,
      noteLines,
      requiredPapers,
      createdAt: car?.createdAt || Date.now(),
    };
    onSave(newCar);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4 overflow-hidden">
      <div className={`relative w-full md:max-w-5xl h-[95vh] md:h-[90vh] overflow-y-auto p-4 md:p-6 shadow-2xl flex flex-col gap-6 rounded-t-2xl md:rounded-xl
         ${theme === 'glass' ? 'bg-slate-900/90 backdrop-blur-xl border border-white/10 text-white' :
           theme === 'win10' ? 'bg-[#1f1f1f] border-2 border-blue-600 text-white rounded-none' :
           theme === 'ios' ? 'bg-white text-black' :
           'bg-gray-900 border border-gray-700 text-white'
         }`}>
        
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 border-gray-600 sticky top-0 bg-inherit z-10 pt-2">
          <h2 className="text-xl md:text-2xl font-bold">{car ? 'تعديل سيارة' : 'إضافة سيارة جديدة'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-red-500 rounded-full transition-colors text-white bg-red-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
          
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
             <div>
               <label className={labelClass}>الشركة المصنعة</label>
               <div className="flex gap-2">
                 <select 
                  value={brand} 
                  onChange={(e) => setBrand(e.target.value)}
                  className={inputClass}
                 >
                   {brands.map(b => <option key={b} value={b}>{b}</option>)}
                 </select>
                 <button type="button" onClick={() => setShowBrandInput(!showBrandInput)} className="bg-green-600 text-white px-3 rounded hover:bg-green-700">
                    <Plus size={20}/>
                 </button>
               </div>
               {showBrandInput && (
                 <div className="mt-2 flex gap-2 animate-fade-in">
                   <input 
                    type="text" 
                    placeholder="اسم الشركة الجديدة" 
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    className={inputClass}
                   />
                   <button type="button" onClick={handleAddBrand} className="bg-blue-600 text-white px-4 rounded">أضف</button>
                 </div>
               )}
             </div>

             <div>
               <label className={labelClass}>موديل السنة</label>
               <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={inputClass}>
                 {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
               </select>
             </div>

             <div className="md:col-span-2">
               <label className={labelClass}>اسم السيارة</label>
               <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className={inputClass} 
                placeholder="مثال: النترا سي ان 7"
                required
               />
             </div>
          </div>

          <div className="border-t border-gray-700 my-4"></div>

          {/* Section 2: Description */}
          <div className="grid grid-cols-1 gap-4">
             <h3 className="text-lg md:text-xl text-blue-400 font-bold">وصف السيارة والمواصفات</h3>
             <textarea 
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               className={`${inputClass} h-24`}
               placeholder="وصف عام للسيارة..."
             />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
               {descLines.map((line, idx) => (
                 <div key={idx} className="flex gap-2 items-center">
                   <span className="text-xs text-gray-500 font-mono w-6">{idx + 1}</span>
                   <input 
                     type="text" 
                     value={line}
                     onChange={(e) => {
                       const newLines = [...descLines];
                       newLines[idx] = e.target.value;
                       setDescLines(newLines);
                     }}
                     className={inputClass}
                     placeholder={`مواصفة رقم ${idx + 1}`}
                   />
                 </div>
               ))}
             </div>
             {descLines.length < MAX_DESC_LINES && (
                <button type="button" onClick={addDescLine} className="text-blue-400 text-sm flex items-center gap-1 mt-2">
                  <Plus size={16}/> أضف مواصفة أخرى
                </button>
             )}
          </div>

          <div className="border-t border-gray-700 my-4"></div>

          {/* Section 3: Pricing Categories */}
          <div>
            <h3 className="text-lg md:text-xl text-green-400 font-bold mb-4">الفئات والأسعار (كاش)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat, idx) => (
                <div key={idx} className={`p-4 rounded border ${theme === 'ios' ? 'bg-gray-50' : 'bg-white/5 border-gray-600'}`}>
                  <input 
                    type="text" 
                    value={cat.name}
                    onChange={(e) => {
                      const newCats = [...categories];
                      newCats[idx].name = e.target.value;
                      setCategories(newCats);
                    }}
                    className={`${inputClass} mb-2 font-bold text-center`}
                  />
                  <label className="text-xs text-gray-400">السعر (كاش)</label>
                  <input 
                    type="number" 
                    value={cat.price}
                    onChange={(e) => {
                      const newCats = [...categories];
                      newCats[idx].price = Number(e.target.value);
                      setCategories(newCats);
                    }}
                    className={inputClass}
                  />
                </div>
              ))}
              {categories.length < 10 && (
                 <button type="button" onClick={addCategory} className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded p-4 hover:border-blue-500 hover:text-blue-500 transition h-32 md:h-auto">
                   <Plus size={24} />
                   <span>أضف فئة</span>
                 </button>
              )}
            </div>
            
            <div className="mt-4 flex flex-col md:flex-row md:items-center gap-2">
              <label className="text-sm">تطبيق سعر الفئة على التقسيط:</label>
              <select 
                className={inputClass} 
                style={{width: 'auto'}}
                onChange={(e) => setInstallment(prev => ({...prev, basePrice: Number(e.target.value)}))}
              >
                <option value={0}>اختر الفئة...</option>
                {categories.map((c, i) => <option key={i} value={c.price}>{c.name} - {c.price}</option>)}
              </select>
            </div>
          </div>

          <div className="border-t border-gray-700 my-4"></div>

          {/* Section 4: Installment Calculator */}
          <div className={`p-4 md:p-6 rounded-lg border ${theme === 'ios' ? 'bg-blue-50 border-blue-100' : 'bg-blue-900/20 border-blue-800'}`}>
             <h3 className="text-lg md:text-xl text-blue-300 font-bold mb-4">أنظمة التقسيط</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className={labelClass}>سعر السيارة</label>
                  <input 
                    type="number" 
                    value={installment.basePrice}
                    onChange={(e) => setInstallment({...installment, basePrice: Number(e.target.value)})}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>المقدم</label>
                  <input 
                    type="number" 
                    value={installment.downPayment}
                    onChange={(e) => setInstallment({...installment, downPayment: Number(e.target.value)})}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>الفائدة السنوية (%)</label>
                  <input 
                    type="number" 
                    value={installment.interestRate}
                    onChange={(e) => setInstallment({...installment, interestRate: Number(e.target.value)})}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>السنوات (1-7)</label>
                  <input 
                    type="number" 
                    min="1" max="7"
                    value={installment.years}
                    onChange={(e) => setInstallment({...installment, years: Number(e.target.value)})}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>القسط الشهري</label>
                  <input 
                    type="number" 
                    value={installment.monthlyInstallment}
                    onChange={(e) => setInstallment({...installment, monthlyInstallment: Number(e.target.value)})}
                    className={`${inputClass} font-bold text-yellow-400`}
                  />
                </div>
             </div>
             
             <div className="mt-4 flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <span className={isAvailable ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                    {isAvailable ? 'متاح للبيع' : 'غير متاح حالياً'}
                  </span>
                </label>
             </div>
          </div>

          <div className="border-t border-gray-700 my-4"></div>

          {/* Section 5: Notes */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-2">ملاحظات إضافية</h3>
            <textarea 
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               className={`${inputClass} h-24 mb-4`}
               placeholder="تفاصيل عن البنوك، الشروط العامة..."
             />
             <div className="grid grid-cols-1 gap-2">
                {noteLines.map((line, idx) => (
                   <div key={idx} className="flex gap-2">
                     <span className="w-6 text-center">{idx + 1}</span>
                     <input 
                       value={line}
                       onChange={(e) => {
                         const n = [...noteLines];
                         n[idx] = e.target.value;
                         setNoteLines(n);
                       }}
                       className={inputClass}
                     />
                   </div>
                ))}
             </div>
          </div>
          
           <div>
             <h3 className="text-lg md:text-xl font-bold mb-2">الأوراق المطلوبة (خاص)</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {requiredPapers.map((line, idx) => (
                  <div key={idx} className="flex gap-2">
                     <span className="w-6 text-center">{idx + 1}</span>
                     <input 
                       value={line}
                       onChange={(e) => {
                         const n = [...requiredPapers];
                         n[idx] = e.target.value;
                         setRequiredPapers(n);
                       }}
                       className={inputClass}
                       placeholder="مطلوب..."
                     />
                   </div>
                ))}
             </div>
           </div>

          {/* Actions - Sticky Bottom */}
          <div className="fixed md:sticky bottom-0 left-0 w-full bg-black/80 md:bg-black/50 p-4 border-t border-gray-600 flex justify-end gap-4 backdrop-blur-md rounded-none md:rounded-lg z-20">
             <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
               إلغاء
             </button>
             <button type="submit" className="px-8 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-500 shadow-lg flex items-center gap-2 transition">
               <Save size={20}/>
               حفظ
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarForm;