import React, { useState, useEffect } from 'react';
import { Theme, View, Car, GlobalSettings } from './types';
import { INITIAL_BRANDS, DEFAULT_DOC_LINES } from './constants';
import DigitalClock from './components/DigitalClock';
import Sidebar from './components/Sidebar';
import CarManager from './components/CarManager';
import LoanCalculator from './components/LoanCalculator';
import PriceAnalysis from './components/PriceAnalysis';
import DocumentsManager from './components/DocumentsManager';
import MathCalculator from './components/MathCalculator';
import InstallmentScenarios from './components/InstallmentScenarios';
import CarComparison from './components/CarComparison';
import CarDetailsModal from './components/CarDetailsModal';
import { Menu } from 'lucide-react';

// قاعدة بيانات السيارات المستخرجة من الملفات
const CARS_DATABASE: any[] = [
  // AUDI
  { b: 'Audi', y: 2019, n: 'A3 Premium', p: 520000, s: '1000 Turbo, 116 HP, S-Tronic 7, شاشة MMI' },
  { b: 'Audi', y: 2019, n: 'A3 Prestige', p: 570000, s: '1000 Turbo, 116 HP, فتحة سقف بانوراما، كاميرا' },
  { b: 'Audi', y: 2019, n: 'A4 Luxury', p: 680000, s: '1400 Turbo, 150 HP, جنوط 17، كراسي كهرباء' },
  { b: 'Audi', y: 2019, n: 'Q3 Standard', p: 675000, s: '1400 Turbo, 150 HP, S-Tronic 6, مثبت سرعة' },
  { b: 'Audi', y: 2021, n: 'A3 Sedan Premium', p: 475000, s: '1000 Turbo, 115 HP, 6 وسائد هوائية' },
  { b: 'Audi', y: 2021, n: 'Q8 P1', p: 2000000, s: '3000 Turbo, 340 HP, كواترو، جنوط 21، أبواب شفط' },
  { b: 'Audi', y: 2024, n: 'Q8 e-tron', p: 4990000, s: 'كهرباء بالكامل، SUV، أداء جبار' },
  { b: 'Audi', y: 2025, n: 'Q7 S-Line 3.0L', p: 6950000, s: '3000 Turbo, 340 HP, 500 NM, فخامة مطلقة' },
  
  // BMW
  { b: 'BMW', y: 2019, n: '320i G20', p: 1750000, s: '2000 Turbo, 184 HP, Steptronic 8, عدادات ديجيتال' },
  { b: 'BMW', y: 2020, n: '520i G30', p: 2600000, s: '2000 Turbo, 184 HP, Adaptive LED, ستائر كهرباء' },
  { b: 'BMW', y: 2022, n: 'X5 xDrive40i', p: 5200000, s: '3000 Turbo, 340 HP, تعليق هوائي، شاشات خلفية' },
  { b: 'BMW', y: 2024, n: '740i Pure Excellence', p: 9900000, s: '3000 Turbo, 381 HP, Theater Screen 31 inch' },
  { b: 'BMW', y: 2025, n: 'i5 eDrive40', p: 6200000, s: 'Electric, 340 HP, Range 580km, Interaction Bar' },

  // GEELY
  { b: 'Geely', y: 2019, n: 'Emgrand 7', p: 189000, s: '1500 CC, 107 HP, Manual, ABS+EBD' },
  { b: 'Geely', y: 2021, n: 'Coolray Premium', p: 370000, s: '1500 Turbo, 175 HP, كاميرا 360، باركينج ذاتي' },
  { b: 'Geely', y: 2024, n: 'Starray Sport', p: 1699000, s: '1500 Turbo, 174 HP, تصميم مستقبلي، شاشة 13.2' },
  { b: 'Geely', y: 2025, n: 'Geometry C GF+', p: 1699900, s: 'Electric, 201 HP, 550km range, Bose Sound' },

  // HONDA
  { b: 'Honda', y: 2019, n: 'Civic', p: 1100000, s: '1600 CC i-VTEC, 123 HP, CVT, بصمة، فتحة سقف' },
  { b: 'Honda', y: 2021, n: 'City New Shape', p: 1050000, s: '1500 CC, 121 HP, Apple CarPlay, تشغيل عن بعد' },
  { b: 'Honda', y: 2024, n: 'Accord', p: 2450000, s: '1500 Turbo, 188 HP, عزل صوتي نشط، 8 وسائد' },
  { b: 'Honda', y: 2025, n: 'ZR-V EX', p: 2300000, s: '1500 Turbo, 180 HP, Bose 12 speakers, Sensing' },

  // HYUNDAI
  { b: 'Hyundai', y: 2019, n: 'Tucson GLS Plus', p: 1330000, s: '1600 GDI, 130 HP, تكييف ثنائي، بصمة' },
  { b: 'Hyundai', y: 2021, n: 'Elantra CN7 Modern', p: 1450000, s: '1600 CC, 127 HP, عدادات ديجيتال، LED' },
  { b: 'Hyundai', y: 2024, n: 'Tucson Collector', p: 2950000, s: '1600 Turbo, 180 HP, DCT 7, كاميرات 360' },
  { b: 'Hyundai', y: 2025, n: 'Accent RB Highline', p: 920000, s: '1600 CC, 125 HP, جنوط 16، فتحة سقف' },

  // LADA
  { b: 'Lada', y: 2019, n: 'Granta Auto', p: 350000, s: '1600 CC, 105 HP, Jatco Auto, 2 Airbags' },
  { b: 'Lada', y: 2024, n: 'Niva Legend', p: 625000, s: '1700 CC, 83 HP, 4x4, ABS, تصميم كلاسيكي' },

  // MERCEDES
  { b: 'Mercedes', y: 2015, n: 'C180 W205', p: 1800000, s: '1600 Turbo, 156 HP, AMG Line' },
  { b: 'Mercedes', y: 2020, n: 'E200 EQ Boost', p: 2350000, s: '2000 Turbo, 197 HP, Widescreen, 64 colors' },
  { b: 'Mercedes', y: 2022, n: 'S500 4Matic', p: 4600000, s: '3000 Turbo, 435 HP, OLED, Rear Steering' },
  { b: 'Mercedes', y: 2024, n: 'EQS 450+', p: 7800000, s: 'Electric, 360 HP, Hyperscreen, Range 780km' },

  // NISSAN
  { b: 'Nissan', y: 2019, n: 'Sunny Super Saloon', p: 620000, s: '1500 CC, 108 HP, بصمة، تكييف تاتش' },
  { b: 'Nissan', y: 2022, n: 'Qashqai Tekna', p: 1200000, s: '1300 Turbo, 160 HP, سقف بانوراما، كاميرا 360' },
  { b: 'Nissan', y: 2025, n: 'Qashqai e-POWER', p: 1884000, s: 'Electric Motor Hybrid, 330 NM, تقنية القيادة الكهربائية' },

  // TOYOTA
  { b: 'Toyota', y: 2020, n: 'Corolla Smart', p: 1550000, s: '1600 CC, 120 HP, شاشة 8، بصمة، حساسات' },
  { b: 'Toyota', y: 2022, n: 'Fortuner Elegance', p: 2900000, s: '4000 CC V6, 234 HP, 4x4, كراسي كهرباء' },
  { b: 'Toyota', y: 2025, n: 'Urban Cruiser Comfort', p: 1490000, s: '1500 CC, 103 HP, سقف بانوراما، شاشة 9' },

  // VOLKSWAGEN
  { b: 'Volkswagen', y: 2019, n: 'Passat Highline', p: 1600000, s: '1400 Turbo, 125 HP, عدادات ديجيتال، LED' },
  { b: 'Volkswagen', y: 2021, n: 'Tiguan R-Line', p: 1850000, s: '1400 Turbo, 150 HP, سقف بانوراما، جنوط 19' },
  { b: 'Volkswagen', y: 2024, n: 'Touareg R-Line', p: 4500000, s: '2000 Turbo, 250 HP, دفع كلي، شاشة 15' },
];

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [activeView, setActiveView] = useState<View>('models');
  const [showMathCalc, setShowMathCalc] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewingCar, setViewingCar] = useState<Car | undefined>(undefined);

  const [cars, setCars] = useState<Car[]>(() => {
    try {
      const saved = localStorage.getItem('fb_cars');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    
    // تحويل قاعدة البيانات الخام إلى كائنات سيارات
    return CARS_DATABASE.map((item, idx) => ({
      id: `db-${idx}`,
      brand: item.b,
      year: item.y,
      name: item.n,
      description: item.s,
      descLines: item.s.split(', '),
      categories: [{ id: `cat-${idx}`, name: 'الفئة الرسمية', price: item.p }],
      installment: {
        basePrice: item.p,
        downPayment: Math.round(item.p * 0.3),
        interestRate: 18,
        years: 5,
        monthlyInstallment: Math.round((item.p * 0.7 * 1.9) / 60)
      },
      isAvailable: true,
      notes: "بيانات مستخرجة من التقارير الرسمية",
      noteLines: [],
      requiredPapers: [],
      createdAt: Date.now()
    }));
  });

  const [settings, setSettings] = useState<GlobalSettings>(() => {
    try {
      const saved = localStorage.getItem('fb_settings');
      return saved ? JSON.parse(saved) : { brands: INITIAL_BRANDS, documents: Array(DEFAULT_DOC_LINES).fill('') };
    } catch (e) {
       return { brands: INITIAL_BRANDS, documents: Array(DEFAULT_DOC_LINES).fill('') };
    }
  });

  useEffect(() => { localStorage.setItem('fb_cars', JSON.stringify(cars)); }, [cars]);
  useEffect(() => { localStorage.setItem('fb_settings', JSON.stringify(settings)); }, [settings]);

  const handleAddCar = (car: Car) => setCars([...cars, car]);
  const handleUpdateCar = (updatedCar: Car) => setCars(cars.map(c => c.id === updatedCar.id ? updatedCar : c));
  const handleDeleteCar = (id: string) => { if (window.confirm('هل أنت متأكد من حذف هذه السيارة؟')) setCars(cars.filter(c => c.id !== id)); };
  const handleAddBrand = (brand: string) => setSettings(prev => ({ ...prev, brands: [...prev.brands, brand] }));
  const handleUpdateDocuments = (docs: string[]) => setSettings(prev => ({ ...prev, documents: docs }));

  const getAppStyle = () => {
    switch (theme) {
      case 'glass': return 'bg-gradient-to-br from-gray-900 to-blue-900 text-white';
      case 'win10': return 'bg-[#121212] text-white font-sans';
      case 'ios': return 'bg-gray-100 text-black font-sans';
      case 'dark': default: return 'bg-black text-white font-sans';
    }
  };

  return (
    <div className={`w-full h-screen overflow-hidden flex flex-col md:flex-row ${getAppStyle()} transition-colors duration-500`} dir="rtl">
      <div className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)} />
      <div className={`fixed top-0 right-0 h-full z-40 transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl`}>
        <Sidebar currentView={activeView} onChangeView={setActiveView} onOpenCalculator={() => setShowMathCalc(true)} onCloseSidebar={() => setIsSidebarOpen(false)} theme={theme} />
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden w-full">
        <header className={`h-16 md:h-20 flex items-center justify-between px-4 md:px-8 z-10 flex-shrink-0 ${theme === 'glass' ? 'bg-white/5 backdrop-blur-sm' : theme === 'ios' ? 'bg-white shadow-sm' : 'bg-opacity-50 bg-black'}`}>
           <div className="flex items-center gap-4">
             <button className="md:hidden p-2 rounded hover:bg-white/10" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
             <h2 className="text-xl font-bold md:hidden">Four Brothers</h2>
             <div className="hidden sm:flex gap-2">
               {(['dark', 'glass', 'win10', 'ios'] as Theme[]).map(t => (
                 <button key={t} onClick={() => setTheme(t)} className={`px-3 py-1 rounded text-xs font-bold uppercase transition ${theme === t ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{t}</button>
               ))}
             </div>
           </div>
           <DigitalClock />
        </header>

        <main className="flex-1 overflow-hidden relative w-full">
          {activeView === 'models' && <CarManager cars={cars} brands={settings.brands} theme={theme} onAddCar={handleAddCar} onUpdateCar={handleUpdateCar} onDeleteCar={handleDeleteCar} onAddBrand={handleAddBrand} onViewCar={setViewingCar} />}
          {activeView === 'installments' && <InstallmentScenarios theme={theme} />}
          {activeView === 'comparison' && <CarComparison cars={cars} theme={theme} />}
          {activeView === 'loanCalc' && <LoanCalculator theme={theme} />}
          {activeView === 'priceAnalysis' && <PriceAnalysis cars={cars} brands={settings.brands} theme={theme} onCarClick={setViewingCar} />}
          {activeView === 'documents' && <DocumentsManager documents={settings.documents} onSave={handleUpdateDocuments} theme={theme} />}
        </main>
        <footer className={`h-8 flex-shrink-0 flex items-center justify-center text-xs opacity-50 ${theme === 'ios' ? 'bg-gray-200 text-black' : 'bg-black text-white'}`}>Developed by Amir Lamay</footer>
      </div>

      {showMathCalc && <MathCalculator onClose={() => setShowMathCalc(false)} theme={theme} />}
      {viewingCar && <CarDetailsModal car={viewingCar} onClose={() => setViewingCar(undefined)} theme={theme} />}
    </div>
  );
};

export default App;
