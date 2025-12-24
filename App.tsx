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

const CARS_DATABASE: any[] = [
  // --- AUDI ---
  { b: 'Audi', y: 2019, n: 'A3 (Premium)', p: 520000, s: '1000 Turbo, 116 HP, S-Tronic 7, شاشة MMI' },
  { b: 'Audi', y: 2019, n: 'A3 (Prestige)', p: 570000, s: '1000 Turbo, 116 HP, فتحة سقف بانوراما، كاميرا' },
  { b: 'Audi', y: 2019, n: 'A4 (Luxury)', p: 680000, s: '1400 Turbo, 150 HP, جنوط 17، كراسي كهرباء' },
  { b: 'Audi', y: 2019, n: 'Q3 (Standard)', p: 675000, s: '1400 Turbo, 150 HP, S-Tronic 6, مثبت سرعة' },
  { b: 'Audi', y: 2020, n: 'A6 Luxury', p: 1250000, s: '2000 Turbo, 245 HP, صالون فاخر، شاشات مزدوجة' },
  { b: 'Audi', y: 2021, n: 'Q3 SB (Sportback) 2.0', p: 1050000, s: '2000 Turbo, 190 HP, دفع رباعي Quattro' },
  { b: 'Audi', y: 2022, n: 'Q8 S-Line Plus', p: 2280000, s: '3000 Turbo, 340 HP, رؤية ليلية، جنوط 21' },
  { b: 'Audi', y: 2024, n: 'RS e-tron GT', p: 6400000, s: 'كهرباء (قوة هائلة), S-Line Sport' },
  { b: 'Audi', y: 2025, n: 'A8 L S-Line Long', p: 9350000, s: '3000 Turbo, 340 HP, 500 NM' },

  // --- BMW ---
  { b: 'BMW', y: 2019, n: '320i (G20)', p: 1550000, s: '2000 Turbo, 184 HP, Steptronic 8, عدادات ديجيتال' },
  { b: 'BMW', y: 2019, n: 'X5 xDrive40i', p: 3400000, s: '3000 Turbo, 340 HP, شاشات خلفية، تعليق هوائي' },
  { b: 'BMW', y: 2020, n: '530i (G30)', p: 3000000, s: '2000 Turbo, 252 HP, أبواب شفط، ستائر كهرباء' },
  { b: 'BMW', y: 2021, n: 'X1 sDrive18i', p: 1650000, s: '1500 Turbo, 140 HP, Dual Clutch 7' },
  { b: 'BMW', y: 2022, n: '218i Gran Coupe', p: 1650000, s: '1500 Turbo, 140 HP, Frameless Doors' },
  { b: 'BMW', y: 2023, n: 'X1 (U11) New Shape', p: 2750000, s: '1500 Turbo, 140 HP, Curved Display' },
  { b: 'BMW', y: 2023, n: 'XM', p: 14000000, s: 'M Hybrid, قمة أداء بي إم دبليو' },
  { b: 'BMW', y: 2024, n: 'i5 (Electric)', p: 6200000, s: '340 HP, Range 580 km, Interaction Bar' },
  { b: 'BMW', y: 2025, n: '760i xDrive M-Sport', p: 13400000, s: 'V8 Turbo, Theater Screen, فخامة مطلقة' },

  // --- GEELY ---
  { b: 'Geely', y: 2019, n: 'Emgrand 7', p: 189000, s: '1500 CC, 107 HP, Manual, ABS+EBD' },
  { b: 'Geely', y: 2021, n: 'Coolray Premium', p: 370000, s: '1500 Turbo, 175 HP, كاميرا 360، ركن ذاتي' },
  { b: 'Geely', y: 2023, n: 'GX3 Pro Premium', p: 670000, s: '1500 CC, 103 HP, فتحة سقف، شاشة 8' },
  { b: 'Geely', y: 2024, n: 'Starray Sport+', p: 1769000, s: '1500 Turbo, 174 HP, سماعات بمسند الرأس' },
  { b: 'Geely', y: 2025, n: 'Geometry C GF+', p: 1699900, s: 'Electric, 550 km range, Bose Sound' },

  // --- HONDA ---
  { b: 'Honda', y: 2019, n: 'Civic', p: 1000000, s: '1600 CC i-VTEC, 123 HP, بصمة، فتحة سقف' },
  { b: 'Honda', y: 2021, n: 'City (New Shape)', p: 950000, s: '1500 CC, 121 HP, Apple CarPlay, تشغيل عن بعد' },
  { b: 'Honda', y: 2023, n: 'CR-V AWD', p: 2100000, s: '1500 Turbo, 188 HP, سقف بانوراما، شنطة كهرباء' },
  { b: 'Honda', y: 2024, n: 'Accord', p: 2300000, s: '1500 Turbo, 188 HP, عزل صوتي نشط، 8 وسائد' },
  { b: 'Honda', y: 2025, n: 'ZR-V EX', p: 2100000, s: '1500 Turbo, 180 HP, Honda Sensing, Bose 12' },

  // --- HYUNDAI ---
  { b: 'Hyundai', y: 2019, n: 'Tucson Turbo Limited', p: 1450000, s: '1600 Turbo, 175 HP, دفع رباعي، بانوراما' },
  { b: 'Hyundai', y: 2020, n: 'Elantra AD Exclusive', p: 1150000, s: '1600 CC, 127 HP, بصمة، كراسي جلد' },
  { b: 'Hyundai', y: 2021, n: 'Tucson NX4 Advanced', p: 1980000, s: '1600 Turbo, 180 HP, عدادات 10.25 بوصة' },
  { b: 'Hyundai', y: 2023, n: 'Elantra CN7 Premium', p: 2100000, s: 'رادار، تحذير خروج مسار، كراسي كهرباء' },
  { b: 'Hyundai', y: 2024, n: 'Accent RB Highline', p: 1070000, s: '1600 CC, 125 HP, جنوط 16، فتحة سقف' },
  { b: 'Hyundai', y: 2025, n: 'Santa Fe Executive', p: 3350000, s: 'SUV فاخرة، أحدث طرازات هيونداي' },

  // --- LADA ---
  { b: 'Lada', y: 2019, n: 'Granta Auto', p: 330000, s: '1600 CC, 105 HP, فتيس Jatco ياباني' },
  { b: 'Lada', y: 2021, n: 'Largus 7 Seats', p: 630000, s: '1600 CC, 3 صفوف مقاعد، عائلية اقتصادية' },
  { b: 'Lada', y: 2024, n: 'Niva Legend 4x4', p: 600000, s: '1700 CC, 83 HP, مخصصة للطرق الوعرة' },

  // --- MERCEDES ---
  { b: 'Mercedes', y: 2015, n: 'S400 (W222)', p: 2500000, s: '3000 Biturbo, 333 HP, الفئة الفارهة' },
  { b: 'Mercedes', y: 2019, n: 'C180 (W205 FL)', p: 4100000, s: 'Facelift, عدادات ديجيتال، LED جديد' },
  { b: 'Mercedes', y: 2020, n: 'E200 EQ Boost', p: 2200000, s: '2000 Turbo, 197 HP, Widescreen' },
  { b: 'Mercedes', y: 2021, n: 'G500', p: 8500000, s: 'V8 Biturbo, 422 HP, الشكل الجديد كلياً' },
  { b: 'Mercedes', y: 2022, n: 'C200 (W206) AMG', p: 2300000, s: 'شاشة 11.9 بوصة، نظام MBUX 2' },
  { b: 'Mercedes', y: 2024, n: 'E200 (W214)', p: 5500000, s: 'Superscreen, كاميرا سيلفي، مقابض مخفية' },
  { b: 'Mercedes', y: 2025, n: 'EQS 450+', p: 7500000, s: 'Electric, Range 780 km, Hyperscreen' },

  // --- NISSAN ---
  { b: 'Nissan', y: 2019, n: 'Sunny Super Saloon', p: 600000, s: '1500 CC, 108 HP, بصمة، تكييف تاتش' },
  { b: 'Nissan', y: 2021, n: 'Sentra Premium SV', p: 850000, s: '1600 CC, CVT, فتحة سقف، شاشة' },
  { b: 'Nissan', y: 2023, n: 'Qashqai Tekna', p: 1650000, s: '1300 Turbo, 160 HP, كاميرات 360، رادار' },
  { b: 'Nissan', y: 2024, n: 'Juke Tekna', p: 1400000, s: '1000 Turbo, 115 HP, Bose Sound 8' },
  { b: 'Nissan', y: 2025, n: 'Qashqai e-POWER', p: 1884000, s: 'محرك كهربائي (هجين), عزم 330 نيوتن' },

  // --- TOYOTA ---
  { b: 'Toyota', y: 2020, n: 'Corolla Elegance', p: 1650000, s: '1600 CC, 120 HP, فتحة سقف، تكييف ثنائي' },
  { b: 'Toyota', y: 2021, n: 'Fortuner 4.0 Elegance', p: 2900000, s: 'V6 4000 CC, 235 HP, دفع رباعي 4x4' },
  { b: 'Toyota', y: 2022, n: 'Belta Smart', p: 750000, s: '1500 CC, 103 HP, بصمة، LED ترحيبي' },
  { b: 'Toyota', y: 2024, n: 'Hilux Single Cab', p: 1700000, s: '2400 Turbo Diesel, 147 HP' },
  { b: 'Toyota', y: 2025, n: 'Urban Cruiser Comfort', p: 1490000, s: '1500 CC, 103 HP, سقف بانوراما، شاشة 9' },

  // --- VOLKSWAGEN ---
  { b: 'Volkswagen', y: 2019, n: 'Passat Highline', p: 1550000, s: '1400 Turbo, 125 HP, عدادات ديجيتال' },
  { b: 'Volkswagen', y: 2021, n: 'Golf 8 Highline', p: 1650000, s: '1400 Turbo, 150 HP, إضاءة 30 لون' },
  { b: 'Volkswagen', y: 2022, n: 'T-Roc R-Line', p: 1450000, s: '1400 Turbo, 150 HP, سقف بانوراما' },
  { b: 'Volkswagen', y: 2024, n: 'Touareg R-Line', p: 4350000, s: '2000 Turbo, 250 HP, دفع كلي، شاشة 15' },
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
        interestRate: 21, // الفائدة الحالية التقريبية
        years: 5,
        monthlyInstallment: Math.round((item.p * 0.7 * 2.1) / 60)
      },
      isAvailable: true,
      notes: "بيانات مستخرجة ومحدثة بناءً على تقارير السوق الرسمية.",
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
