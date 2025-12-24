
import React, { useState, useEffect, useRef } from 'react';
import { Car, Category, InstallmentPlan } from '../types';
import { YEARS, MAX_DESC_LINES, DEFAULT_DESC_LINES } from '../constants';
import { X, Plus, Trash2, Save, Image as ImageIcon, Camera, CheckCircle2, AlertCircle, Calendar, DollarSign, Percent, Clock, FileText, AlignRight } from 'lucide-react';

interface CarFormProps {
  car?: Car;
  brands: string[];
  onSave: (car: Car) => void;
  onClose: () => void;
  onAddBrand: (brand: string) => void;
  theme: string;
}

const CarForm: React.FC<CarFormProps> = ({ car, brands, onSave, onClose, onAddBrand, theme }) => {
  const [brand, setBrand] = useState(car?.brand || brands[0] || '');
  const [year, setYear] = useState(car?.year || new Date().getFullYear());
  const [name, setName] = useState(car?.name || '');
  const [isAvailable, setIsAvailable] = useState(car ? car.isAvailable : true);
  const [images, setImages] = useState<string[]>(car?.images || []);
  
  const [description, setDescription] = useState(car?.description || '');
  // تأمين وجود 14 خانة دائماً
  const [descLines, setDescLines] = useState<string[]>(() => {
    const existing = car?.descLines || [];
    const lines = [...existing];
    while (lines.length < 14) lines.push('');
    return lines.slice(0, 14);
  });

  const [categories, setCategories] = useState<Category[]>(car?.categories || [
    { id: '1', name: 'الفئة الأولى', price: 0 },
    { id: '2', name: 'الفئة الثانية', price: 0 },
    { id: '3', name: 'الفئة الثالثة', price: 0 },
    { id: '4', name: 'الفئة الرابعة', price: 0 },
  ]);

  const [installment, setInstallment] = useState<InstallmentPlan>(car?.installment || {
    basePrice: 0,
    downPayment: 0,
    interestRate: 0,
    years: 1,
    monthlyInstallment: 0
  });

  const [notes, setNotes] = useState(car?.notes || '');
  const [noteLines, setNoteLines] = useState<string[]>(car?.noteLines?.length ? car.noteLines : Array(5).fill(''));
  const [requiredPapers, setRequiredPapers] = useState<string[]>(car?.requiredPapers || Array(10).fill(''));

  const [newBrandName, setNewBrandName] = useState('');
  const [showBrandInput, setShowBrandInput] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputClass = `w-full p-2 rounded outline-none border transition-all 
    ${theme === 'glass' ? 'bg-white/10 border-white/20 focus:border-blue-400 text-white' : 
      theme === 'win10' ? 'bg-gray-800 border-gray-600 rounded-none focus:border-blue-500 text-white' :
      theme === 'ios' ? 'bg-gray-100 border-transparent focus:bg-white text-black rounded-lg' :
      'bg-gray-800 border-gray-700 text-white focus:border-blue-500'}`;

  const labelClass = `block mb-1 text-sm font-bold ${theme === 'ios' ? 'text-gray-500' : 'text-gray-300'}`;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const remainingSlots = 20 - images.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots) as File[];

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string].slice(0, 20));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddBrand = () => {
    if (newBrandName && !brands.includes(newBrandName)) {
      onAddBrand(newBrandName);
      setBrand(newBrandName);
      setNewBrandName('');
      setShowBrandInput(false);
    }
  };

  const applyCategoryPrice = (index: number) => {
    if (categories[index]) {
      setInstallment(prev => ({ ...prev, basePrice: categories[index].price }));
    }
  };

  const calculateInstallment = () => {
    const { basePrice, downPayment, interestRate, years } = installment;
    const principal = basePrice - downPayment;
    if (principal <= 0) return 0;
    const totalInterest = principal * (interestRate / 100) * years;
    const totalAmount = principal + totalInterest;
    return Math.round(totalAmount / (years * 12));
  };

  useEffect(() => {
    const calculated = calculateInstallment();
    setInstallment(prev => ({ ...prev, monthlyInstallment: calculated }));
  }, [installment.basePrice, installment.downPayment, installment.interestRate, installment.years]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCar: Car = {
      id: car?.id || Date.now().toString(),
      brand, year, name, description, descLines, categories, installment, isAvailable, notes, noteLines, requiredPapers,
      images,
      createdAt: car?.createdAt || Date.now(),
    };
    onSave(newCar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4 overflow-hidden">
      <div className={`relative w-full md:max-w-5xl h-[95vh] md:h-[90vh] overflow-y-auto p-4 md:p-6 shadow-2xl flex flex-col gap-6 rounded-t-2xl md:rounded-xl
         ${theme === 'glass' ? 'bg-slate-900/90 backdrop-blur-xl border border-white/10 text-white' :
           theme === 'win10' ? 'bg-[#1f1f1f] border-2 border-blue-600 text-white rounded-none' :
           theme === 'ios' ? 'bg-white text-black' :
           'bg-gray-900 border border-gray-700 text-white'
         }`}>
        
        <div className="flex justify-between items-center border-b pb-4 border-gray-600 sticky top-0 bg-inherit z-10 pt-2">
          <h2 className="text-xl md:text-2xl font-bold">{car ? 'تعديل سيارة' : 'إضافة سيارة جديدة'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-red-500 rounded-full transition-colors text-white bg-red-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
          
          <div className="flex flex-col gap-6">
             {/* Multi-Image Upload Area */}
             <div className="w-full">
                <div className="flex justify-between items-end mb-2">
                   <label className={labelClass}>صور الموديل (حتى 20 صورة)</label>
                   <span className="text-xs opacity-60">{images.length} / 20</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                   {images.map((img, idx) => (
                     <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-white/10">
                        <img src={img} className="w-full h-full object-cover" alt={`Preview ${idx}`} />
                        <button 
                          type="button" 
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X size={14} />
                        </button>
                     </div>
                   ))}

                   {images.length < 20 && (
                     <button 
                       type="button"
                       onClick={() => fileInputRef.current?.click()}
                       className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/5
                         ${theme === 'ios' ? 'bg-gray-50 border-blue-200' : 'bg-white/5 border-gray-600 hover:border-blue-400'}`}
                     >
                       <Camera size={24} className="mb-2 opacity-50" />
                       <span className="text-xs font-bold opacity-70 text-center px-1">اضف صورة<br/><span className="text-[9px] font-normal">جميع الترددات والمقاسات</span></span>
                     </button>
                   )}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
             </div>

             {/* Basic Info */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className={labelClass}>الشركة المصنعة</label>
                 <div className="flex gap-2">
                   <select value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClass}>
                     {brands.map(b => <option key={b} value={b}>{b}</option>)}
                   </select>
                   <button type="button" onClick={() => setShowBrandInput(!showBrandInput)} className="bg-green-600 text-white px-3 rounded hover:bg-green-700">
                      <Plus size={20}/>
                   </button>
                 </div>
                 {showBrandInput && (
                   <div className="mt-2 flex gap-2 animate-fade-in">
                     <input type="text" placeholder="اسم الشركة" value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} className={inputClass} />
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
                 <label className={labelClass}>اسم السيارة والفئة</label>
                 <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="مثال: Audi A3 Prestige" required />
               </div>
               <div className="md:col-span-2">
                 <label className={labelClass}>حالة توفر السيارة</label>
                 <div className="flex gap-4">
                   <button 
                    type="button" 
                    onClick={() => setIsAvailable(true)} 
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${isAvailable ? 'bg-green-600/20 border-green-500 text-green-500 font-bold' : 'border-gray-700 opacity-40 hover:opacity-100'}`}
                   >
                     <CheckCircle2 size={20} /> متاح
                   </button>
                   <button 
                    type="button" 
                    onClick={() => setIsAvailable(false)} 
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${!isAvailable ? 'bg-red-600/20 border-red-500 text-red-500 font-bold' : 'border-gray-700 opacity-40 hover:opacity-100'}`}
                   >
                     <AlertCircle size={20} /> غير متاح
                   </button>
                 </div>
               </div>
             </div>
          </div>

          {/* New Description & Specs Section */}
          <div className="mt-8 border-t border-gray-700 pt-6">
            <h3 className="text-xl text-blue-400 font-bold mb-4 flex items-center gap-2">
              <FileText size={20} /> وصف السيارة والمواصفات
            </h3>
            
            <label className={labelClass}>الوصف التفصيلي (حتى 20,000 حرف)</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              maxLength={20000}
              className={`${inputClass} h-48 text-sm p-4 mb-6 leading-relaxed`} 
              placeholder="اكتب وصفاً مفصلاً للسيارة هنا..."
            />

            <label className={`${labelClass} mb-3`}>الخانات المسلسلة للمواصفات (14 خانة - 7 يمين و 7 يسار):</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {/* العمود الأول (1-7) */}
              <div className="space-y-3">
                {descLines.slice(0, 7).map((line, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-7 h-7 flex-shrink-0 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/30">
                      {idx + 1}
                    </span>
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
              
              {/* العمود الثاني (8-14) */}
              <div className="space-y-3">
                {descLines.slice(7, 14).map((line, idx) => (
                  <div key={idx + 7} className="flex items-center gap-3">
                    <span className="w-7 h-7 flex-shrink-0 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/30">
                      {idx + 8}
                    </span>
                    <input 
                      type="text" 
                      value={line} 
                      onChange={(e) => {
                        const newLines = [...descLines];
                        newLines[idx + 7] = e.target.value;
                        setDescLines(newLines);
                      }} 
                      className={inputClass} 
                      placeholder={`مواصفة رقم ${idx + 8}`} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className="mt-8 border-t border-gray-700 pt-6">
            <h3 className="text-xl text-green-400 font-bold mb-4 flex items-center gap-2">
              <DollarSign size={20} /> الفئات والأسعار
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {categories.map((cat, idx) => (
                <div key={idx} className={`p-4 rounded-xl border-2 ${theme === 'ios' ? 'bg-gray-50 border-gray-100' : 'bg-white/5 border-gray-700'}`}>
                  <label className="text-[10px] opacity-60 mb-1 block">الفئة رقم {idx+1}</label>
                  <input type="text" value={cat.name} onChange={(e) => {
                      const newCats = [...categories];
                      newCats[idx].name = e.target.value;
                      setCategories(newCats);
                    }} className={`${inputClass} mb-2 font-bold text-center text-sm`} placeholder="اسم الفئة" />
                  <input type="number" value={cat.price} onChange={(e) => {
                      const newCats = [...categories];
                      newCats[idx].price = Number(e.target.value);
                      setCategories(newCats);
                    }} className={`${inputClass} text-center font-mono`} placeholder="السعر" />
                </div>
              ))}
            </div>
          </div>

          {/* Apply Price Section */}
          <div className={`mt-6 p-6 rounded-2xl border-2 border-dashed ${theme === 'ios' ? 'bg-blue-50 border-blue-200' : 'bg-blue-900/10 border-blue-500/30'}`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-400">
               تطبيق سعر الفئة على التقسيط:
            </h3>
            <div className="flex flex-wrap gap-3">
               {categories.map((cat, idx) => (
                 <button 
                   key={idx}
                   type="button"
                   onClick={() => applyCategoryPrice(idx)}
                   className={`px-6 py-2 rounded-full font-bold transition-all active:scale-95 shadow-lg
                     ${theme === 'ios' ? 'bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white' : 'bg-blue-600/20 border border-blue-500/40 text-blue-400 hover:bg-blue-600 hover:text-white'}`}
                 >
                   الفئة {['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة'][idx] || (idx + 1)}
                 </button>
               ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8">
               <div className="md:col-span-5">
                 <h4 className="text-md font-bold mb-4 border-b border-white/10 pb-2">أنظمة التقسيط</h4>
               </div>
               
               <div className="flex flex-col gap-1">
                 <label className="text-xs opacity-60 flex items-center gap-1"><DollarSign size={12}/> سعر السيارة</label>
                 <input type="number" value={installment.basePrice} onChange={e => setInstallment({...installment, basePrice: Number(e.target.value)})} className={`${inputClass} font-mono font-bold text-lg`} />
               </div>

               <div className="flex flex-col gap-1">
                 <label className="text-xs opacity-60 flex items-center gap-1"><DollarSign size={12}/> المقدم</label>
                 <input type="number" value={installment.downPayment} onChange={e => setInstallment({...installment, downPayment: Number(e.target.value)})} className={`${inputClass} font-mono`} />
               </div>

               <div className="flex flex-col gap-1">
                 <label className="text-xs opacity-60 flex items-center gap-1"><Percent size={12}/> الفائدة السنوية (%)</label>
                 <input type="number" value={installment.interestRate} onChange={e => setInstallment({...installment, interestRate: Number(e.target.value)})} className={`${inputClass} font-mono`} />
               </div>

               <div className="flex flex-col gap-1">
                 <label className="text-xs opacity-60 flex items-center gap-1"><Calendar size={12}/> السنوات (1-7)</label>
                 <input type="number" min="1" max="7" value={installment.years} onChange={e => setInstallment({...installment, years: Number(e.target.value)})} className={`${inputClass} font-mono`} />
               </div>

               <div className="flex flex-col gap-1">
                 <label className="text-xs font-bold text-yellow-500 flex items-center gap-1"><Clock size={12}/> القسط الشهري</label>
                 <div className={`p-2 rounded font-mono font-bold text-xl text-center shadow-inner ${theme === 'ios' ? 'bg-white text-blue-600' : 'bg-black/40 text-yellow-400'}`}>
                   {installment.monthlyInstallment.toLocaleString()}
                 </div>
               </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-8 border-t border-gray-700 pt-6">
            <h3 className="text-xl text-yellow-400 font-bold mb-4">ملاحظات إضافية</h3>
            <textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              maxLength={20000}
              className={`${inputClass} h-40 text-sm p-4`} 
              placeholder="اكتب هنا أي ملاحظات إضافية (حتى 20,000 حرف)..."
            />
            
            <div className="mt-6 grid grid-cols-1 gap-3">
              <label className="text-sm font-bold opacity-70">نقاط سريعة (5 خانات مسلسلة):</label>
              {noteLines.map((line, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-yellow-600/20 text-yellow-500 flex items-center justify-center font-bold text-sm border border-yellow-500/30">
                    {idx + 1}
                  </span>
                  <input type="text" value={line} onChange={(e) => {
                      const newLines = [...noteLines];
                      newLines[idx] = e.target.value;
                      setNoteLines(newLines);
                    }} className={inputClass} placeholder={`ملاحظة رقم ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Final Actions */}
          <div className="fixed md:sticky bottom-0 left-0 w-full bg-black/80 md:bg-black/50 p-4 border-t border-gray-600 flex justify-end gap-4 backdrop-blur-md z-20">
             <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-600 text-white rounded">إلغاء</button>
             <button type="submit" className="px-8 py-2 bg-blue-600 text-white font-bold rounded shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95"><Save size={20}/> حفظ السيارة والبيانات</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarForm;
