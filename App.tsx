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

// Sample data to show when the app is loaded for the first time
const SAMPLE_CARS: Car[] = [
  {
    id: '1',
    brand: 'هيونداي',
    year: 2024,
    name: 'توسان NX4',
    description: 'سيارة عائلية رياضية متعددة الاستخدامات، تتميز بتصميم عصري وأداء قوي.',
    descLines: ['محرك 1600 سي سي تيربو', 'قوة 180 حصان', 'ناقل حركة 7 سرعات', 'شاشة 10.25 بوصة', 'فتحة سقف بانوراما'],
    categories: [
      { id: 'c1', name: 'Smart', price: 1750000 },
      { id: 'c2', name: 'Smart Plus', price: 1850000 },
      { id: 'c3', name: 'Modern', price: 1950000 },
      { id: 'c4', name: 'Premium', price: 2150000 }
    ],
    installment: { basePrice: 1750000, downPayment: 500000, interestRate: 15, years: 3, monthlyInstallment: 45000 },
    isAvailable: true,
    notes: 'شامل مصاريف الترخيص لسنة واحدة',
    noteLines: ['تأمين شامل هدية', 'صيانة مجانية 10,000 كم'],
    requiredPapers: [],
    createdAt: Date.now()
  },
  {
    id: '2',
    brand: 'كيا',
    year: 2024,
    name: 'سبورتاج',
    description: 'تصميم جريء ومقصورة داخلية واسعة مع أحدث تقنيات الأمان.',
    descLines: ['محرك 1600 تيربو', 'شنطة كهرباء', 'كراسي كهرباء', 'نظام صوتي Harman Kardon'],
    categories: [
      { id: 'k1', name: 'LX', price: 1800000 },
      { id: 'k2', name: 'EX', price: 1950000 },
      { id: 'k3', name: 'Highline', price: 2100000 },
      { id: 'k4', name: 'Topline', price: 2300000 }
    ],
    installment: { basePrice: 1800000, downPayment: 600000, interestRate: 14, years: 5, monthlyInstallment: 32000 },
    isAvailable: true,
    notes: '',
    noteLines: [],
    requiredPapers: [],
    createdAt: Date.now() - 10000
  },
  {
    id: '3',
    brand: 'مرسيدس',
    year: 2024,
    name: 'C 180',
    description: 'الفخامة والأداء في سيارة سيدان مدمجة.',
    descLines: ['محرك 1500 سي سي تيربو', 'نظام MBUX', 'إضاءة محيطية', 'جنوط 18 بوصة'],
    categories: [
      { id: 'm1', name: 'Avantgarde', price: 3500000 },
      { id: 'm2', name: 'Sport', price: 3750000 },
      { id: 'm3', name: 'AMG', price: 4000000 }
    ],
    installment: { basePrice: 3500000, downPayment: 1500000, interestRate: 12, years: 4, monthlyInstallment: 65000 },
    isAvailable: false,
    notes: 'الحجز مسبق',
    noteLines: ['استلام خلال 3 شهور'],
    requiredPapers: [],
    createdAt: Date.now() - 20000
  }
];

const App: React.FC = () => {
  // --- State ---
  const [theme, setTheme] = useState<Theme>('dark');
  const [activeView, setActiveView] = useState<View>('models');
  const [showMathCalc, setShowMathCalc] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  const [viewingCar, setViewingCar] = useState<Car | undefined>(undefined);

  // --- Data (Persisted in LocalStorage) ---
  const [cars, setCars] = useState<Car[]>(() => {
    try {
      const saved = localStorage.getItem('fb_cars');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to parse cars from local storage", e);
    }
    return SAMPLE_CARS;
  });

  const [settings, setSettings] = useState<GlobalSettings>(() => {
    try {
      const saved = localStorage.getItem('fb_settings');
      return saved ? JSON.parse(saved) : {
        brands: INITIAL_BRANDS,
        documents: Array(DEFAULT_DOC_LINES).fill(''),
      };
    } catch (e) {
       return {
        brands: INITIAL_BRANDS,
        documents: Array(DEFAULT_DOC_LINES).fill(''),
      };
    }
  });

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('fb_cars', JSON.stringify(cars));
  }, [cars]);

  useEffect(() => {
    localStorage.setItem('fb_settings', JSON.stringify(settings));
  }, [settings]);

  // --- Handlers ---
  const handleAddCar = (car: Car) => {
    setCars([...cars, car]);
  };

  const handleUpdateCar = (updatedCar: Car) => {
    setCars(cars.map(c => c.id === updatedCar.id ? updatedCar : c));
  };

  const handleDeleteCar = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه السيارة؟')) {
      setCars(cars.filter(c => c.id !== id));
    }
  };

  const handleAddBrand = (brand: string) => {
    setSettings(prev => ({ ...prev, brands: [...prev.brands, brand] }));
  };

  const handleUpdateDocuments = (docs: string[]) => {
    setSettings(prev => ({ ...prev, documents: docs }));
  };

  // --- Styling ---
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
      
      {/* Mobile Overlay & Sidebar */}
      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      
      {/* Sidebar Container */}
      <div className={`fixed top-0 right-0 h-full z-40 transition-transform duration-300 md:relative md:translate-x-0 
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl`}>
        <Sidebar 
          currentView={activeView} 
          onChangeView={setActiveView} 
          onOpenCalculator={() => setShowMathCalc(true)}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          theme={theme}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden w-full">
        
        {/* Header */}
        <header className={`h-16 md:h-20 flex items-center justify-between px-4 md:px-8 z-10 flex-shrink-0
           ${theme === 'glass' ? 'bg-white/5 backdrop-blur-sm' : 
             theme === 'ios' ? 'bg-white shadow-sm' : 
             'bg-opacity-50 bg-black'}`}>
           
           <div className="flex items-center gap-4">
             {/* Mobile Menu Button */}
             <button 
               className="md:hidden p-2 rounded hover:bg-white/10"
               onClick={() => setIsSidebarOpen(true)}
             >
               <Menu size={24} />
             </button>

             {/* Theme Switcher - Hidden on small mobile if needed, or wrapped */}
             <div className="hidden sm:flex gap-2">
               {(['dark', 'glass', 'win10', 'ios'] as Theme[]).map(t => (
                 <button 
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1 rounded text-xs font-bold uppercase transition
                    ${theme === t ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                 >
                   {t}
                 </button>
               ))}
             </div>
           </div>

           <DigitalClock />
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-hidden relative w-full">
          {activeView === 'models' && (
            <CarManager 
              cars={cars} 
              brands={settings.brands}
              theme={theme}
              onAddCar={handleAddCar}
              onUpdateCar={handleUpdateCar}
              onDeleteCar={handleDeleteCar}
              onAddBrand={handleAddBrand}
              onViewCar={setViewingCar}
            />
          )}

          {activeView === 'installments' && (
            <InstallmentScenarios theme={theme} />
          )}

          {activeView === 'comparison' && (
            <CarComparison cars={cars} theme={theme} />
          )}

          {activeView === 'loanCalc' && <LoanCalculator theme={theme} />}
          
          {activeView === 'priceAnalysis' && (
             <PriceAnalysis 
               cars={cars} 
               brands={settings.brands} 
               theme={theme}
               onCarClick={setViewingCar}
             />
          )}

          {activeView === 'documents' && (
             <DocumentsManager 
               documents={settings.documents}
               onSave={handleUpdateDocuments}
               theme={theme}
             />
          )}

          {/* Background decoration */}
          {(theme === 'glass' || theme === 'dark') && (
            <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
               <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className={`h-8 flex-shrink-0 flex items-center justify-center text-xs opacity-50
          ${theme === 'ios' ? 'bg-gray-200 text-black' : 'bg-black text-white'}`}>
           Developed by Amir Lamay
        </footer>
      </div>

      {/* Global Popups */}
      {showMathCalc && <MathCalculator onClose={() => setShowMathCalc(false)} theme={theme} />}
      
      {viewingCar && (
        <CarDetailsModal 
          car={viewingCar} 
          onClose={() => setViewingCar(undefined)} 
          theme={theme} 
        />
      )}

    </div>
  );
};

export default App;