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

// Data transformation from the provided file
const SAMPLE_CARS: Car[] = [
  {
    id: '1',
    brand: 'MG',
    year: 2010,
    name: 'ZS',
    description: 'سيارة MG ZS بمواصفات تيربو ونظام أمان متطور.',
    descLines: ['محرك 1500 سي سي تيربو', 'نظام صوتي عادي', 'إضاءة LED', 'جنوط 16 بوصة', 'ناقل حركة 8 سرعات', 'شاشة 11 بوصة', 'فتحة سقف بانوراما', 'شنطة كهربائية', 'كراسي كهرباء'],
    categories: [{ id: 'c1', name: 'Standard', price: 850000 }],
    installment: { basePrice: 850000, downPayment: 250000, interestRate: 18, years: 3, monthlyInstallment: 22000 },
    isAvailable: true,
    notes: 'السعر تقريبي',
    noteLines: [],
    requiredPapers: [],
    createdAt: Date.now()
  },
  {
    id: '2',
    brand: 'Honda',
    year: 2010,
    name: 'CR-V',
    description: 'هوندا CR-V الاعتمادية والقوة.',
    descLines: ['محرك 2000 سي سي', 'نظام صوتي Infinity', 'إضاءة LED', 'جنوط 16 بوصة', 'ناقل حركة 8 سرعات', 'شاشة 10.25 بوصة', 'فتحة سقف متوفرة', 'شنطة يدوية', 'كراسي يدوية'],
    categories: [{ id: 'c2', name: 'EX', price: 950000 }],
    installment: { basePrice: 950000, downPayment: 300000, interestRate: 18, years: 5, monthlyInstallment: 18500 },
    isAvailable: true,
    notes: '',
    noteLines: [],
    requiredPapers: [],
    createdAt: Date.now() - 1000
  },
  {
    id: '3',
    brand: 'Hyundai',
    year: 2010,
    name: 'Elantra',
    description: 'هيونداي النترا الكهربائية المتطورة.',
    descLines: ['محرك كهربائي', 'نظام صوتي JBL', 'إضاءة Xenon', 'جنوط 18 بوصة', 'ناقل حركة أوتوماتيكي', 'شاشة 12 بوصة', 'فتحة سقف غير متوفرة', 'شنطة يدوية', 'كراسي كهرباء'],
    categories: [{ id: 'c3', name: 'EV Standard', price: 1200000 }],
    installment: { basePrice: 1200000, downPayment: 400000, interestRate: 15, years: 3, monthlyInstallment: 31000 },
    isAvailable: true,
    notes: '',
    noteLines: [],
    requiredPapers: [],
    createdAt: Date.now() - 2000
  },
  {
    id: '4',
    brand: 'NIO',
    year: 2010,
    name: 'ET7',
    description: 'نيو ET7 تكنولوجيا المستقبل.',
    descLines: ['محرك 1500 سي سي تيربو', 'نظام صوتي Harman Kardon', 'إضاءة Xenon', 'جنوط 18 بوصة', 'ناقل حركة 8 سرعات', 'شاشة 12 بوصة', 'فتحة سقف غير متوفرة', 'شنطة يدوية', 'كراسي يدوية'],
    categories: [{ id: 'c4', name: 'Luxury', price: 2500000 }],
    installment: { basePrice: 2500000, downPayment: 1000000, interestRate: 12, years: 5, monthlyInstallment: 42000 },
    isAvailable: true,
    notes: '',
    noteLines: [],
    requiredPapers: [],
    createdAt: Date.now() - 3000
  },
  {
    id: '5',
    brand: 'BYD',
    year: 2010,
    name: 'Song',
    description: 'بي واي دي سونج العائلية.',
    descLines: ['محرك 1500 سي سي تيربو', 'نظام صوتي عادي', 'إضاءة LED', 'جنوط 18 بوصة', 'ناقل حركة 8 سرعات', 'شاشة 11 بوصة', 'فتحة سقف غير متوفرة', 'شنطة كهربائية', 'كراسي كهرباء'],
    categories: [{ id: 'c5', name: 'Comfort', price: 1100000 }],
    installment: { basePrice: 1100000, downPayment: 300000, interestRate: 18, years: 5, monthlyInstallment: 24000 },
    isAvailable: true,
    notes: '',
    noteLines: [],
    requiredPapers: [],
    createdAt: Date.now() - 4000
  },
  {
    id: '6',
    brand: 'Volkswagen',
    year: 2010,
    name: 'Passat',
    description: 'فولكس فاجن باسات الأناقة الألمانية.',
    descLines: ['محرك 1500 سي سي تيربو', 'نظام صوتي Infinity', 'إضاءة Xenon', 'جنوط 17 بوصة', 'ناقل حركة 8 سرعات', 'شاشة 7 بوصة', 'فتحة سقف بانوراما', 'شنطة يدوية', 'كراسي كهرباء'],
    categories: [{ id: 'c6', name: 'Business', price: 1350000 }],
    installment: { basePrice: 1350000, downPayment: 500000, interestRate: 16, years: 4, monthlyInstallment: 28000 },
    isAvailable: true,
    notes: '',
    noteLines: [],
    requiredPapers: [],
    createdAt: Date.now() - 5000
  },
  {
    id: '7',
    brand: 'Kia',
    year: 2010,
    name: 'Sportage',
    description: 'كيا سبورتاج الكهربائية.',
    descLines: ['محرك كهربائي', 'نظام صوتي Infinity', 'إضاءة إضاءة محيطية', 'جنوط 19 بوصة', 'ناقل حركة 8 سرعات', 'شاشة 8 بوصة', 'فتحة سقف غير متوفرة', 'شنطة يدوية', 'كراسي يدوية'],
    categories: [{ id: 'c7', name: 'EV Comfort', price: 1600000 }],
    installment: { basePrice: 1600000, downPayment: 600000, interestRate: 15, years: 5, monthlyInstallment: 28000 },
    isAvailable: true,
    notes: '',
    noteLines: [],
    requiredPapers: [],
    createdAt: Date.now() - 6000
  },
  {
    id: '8',
    brand: 'Toyota',
    year: 2010,
    name: 'Camry',
    description: 'تويوتا كامري القوة اليابانية.',
    descLines: ['محرك 1500 سي سي تيربو', 'نظام صوتي عادي', 'إضاءة Xenon', 'جنوط 17 بوصة', 'ناقل حركة أوتوماتيكي', 'شاشة 11 بوصة', 'فتحة سقف غير متوفرة', 'شنطة كهربائية', 'كراسي يدوية'],
    categories: [{ id: 'c8', name: 'GLE', price: 1400000 }],
    installment: { basePrice: 1400000, downPayment: 500000, interestRate: 18, years: 5, monthlyInstallment: 26000 },
    isAvailable: true,
    notes: '',
    noteLines: [],
    requiredPapers: [],
    createdAt: Date.now() - 7000
  },
  {
    id: '9',
    brand: 'Geely',
    year: 2010,
    name: 'Atlas',
    description: 'جيلي أطلس تكنولوجيا الصين المتطورة.',
    descLines: ['محرك 1600 سي سي تيربو', 'نظام صوتي Infinity', 'إضاءة LED', 'جنوط 18 بوصة', 'ناقل حركة 6 سرعات', 'شاشة 7 بوصة', 'فتحة سقف متوفرة', 'شنطة يدوية', 'كراسي كهرباء'],
    categories: [{ id: 'c9', name: 'Premium', price: 950000 }],
    installment: { basePrice: 950000, downPayment: 300000, interestRate: 18, years: 3, monthlyInstallment: 28000 },
    isAvailable: true,
    notes: '',
    noteLines: [],
    requiredPapers: [],
    createdAt: Date.now() - 8000
  },
  {
    id: '10',
    brand: 'Chery',
    year: 2010,
    name: 'Tiggo 7',
    description: 'شيري تيجو 7 سيارة دفع رباعي مريحة.',
    descLines: ['محرك 1500 سي سي تيربو', 'نظام صوتي Infinity', 'إضاءة LED', 'جنوط 18 بوصة', 'ناقل حركة 6 سرعات', 'شاشة 10 بوصة', 'فتحة سقف متوفرة', 'شنطة يدوية', 'كراسي كهرباء'],
    categories: [{ id: 'c10', name: 'Highline', price: 880000 }],
    installment: { basePrice: 880000, downPayment: 250000, interestRate: 18, years: 5, monthlyInstallment: 19000 },
    isAvailable: true,
    notes: '',
    noteLines: [],
    requiredPapers: [],
    createdAt: Date.now() - 9000
  },
  // Adding sample rows for 2024/2025 to satisfy the high year request
  {
    id: '11',
    brand: 'Hyundai',
    year: 2024,
    name: 'Elantra',
    description: 'الجيل الجديد من النترا.',
    descLines: ['محرك كهربائي', 'نظام صوتي Infinity', 'إضاءة إضاءة محيطية', 'جنوط 19 بوصة', 'ناقل حركة أوتوماتيكي', 'شاشة 8 بوصة', 'فتحة سقف متوفرة', 'شنطة يدوية', 'كراسي يدوية'],
    categories: [{ id: 'c11', name: 'Luxury EV', price: 1900000 }],
    installment: { basePrice: 1900000, downPayment: 700000, interestRate: 14, years: 5, monthlyInstallment: 32000 },
    isAvailable: true,
    notes: '',
    noteLines: [],
    requiredPapers: [],
    createdAt: Date.now() - 10000
  }
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
    return SAMPLE_CARS;
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
  const handleDeleteCar = (id: string) => { if (window.confirm('هل أنت متأكد؟')) setCars(cars.filter(c => c.id !== id)); };
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
          {(theme === 'glass' || theme === 'dark') && <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none"><div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div><div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div></div>}
        </main>
        <footer className={`h-8 flex-shrink-0 flex items-center justify-center text-xs opacity-50 ${theme === 'ios' ? 'bg-gray-200 text-black' : 'bg-black text-white'}`}>Developed by Amir Lamay</footer>
      </div>

      {showMathCalc && <MathCalculator onClose={() => setShowMathCalc(false)} theme={theme} />}
      {viewingCar && <CarDetailsModal car={viewingCar} onClose={() => setViewingCar(undefined)} theme={theme} />}
    </div>
  );
};

export default App;
