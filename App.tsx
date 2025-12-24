
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
import UploadManager from './components/UploadManager';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [activeView, setActiveView] = useState<View>('models');
  const [showMathCalc, setShowMathCalc] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewingCar, setViewingCar] = useState<Car | undefined>(undefined);

  const [cars, setCars] = useState<Car[]>(() => {
    try {
      const saved = localStorage.getItem('fb_cars');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
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

  const handleAddCar = (car: Car) => setCars([car, ...cars]);
  const handleUpdateCar = (updatedCar: Car) => setCars(cars.map(c => c.id === updatedCar.id ? updatedCar : c));
  const handleDeleteCar = (id: string) => { if (window.confirm('هل أنت متأكد من حذف هذه السيارة؟')) setCars(cars.filter(c => c.id !== id)); };
  const handleAddBrand = (brand: string) => setSettings(prev => ({ ...prev, brands: [...prev.brands, brand] }));
  const handleUpdateDocuments = (docs: string[]) => setSettings(prev => ({ ...prev, documents: docs }));

  const handleDataExtracted = (newCars: Car[]) => {
    setCars(prev => [...newCars, ...prev]);
    setActiveView('models');
    alert(`تم استيراد ${newCars.length} موديلات بنجاح إلى القائمة!`);
  };

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
          {activeView === 'upload' && <UploadManager theme={theme} onDataExtracted={handleDataExtracted} brands={settings.brands} />}
        </main>
        <footer className={`h-8 flex-shrink-0 flex items-center justify-center text-xs opacity-50 ${theme === 'ios' ? 'bg-gray-200 text-black' : 'bg-black text-white'}`}>Four Brothers System &copy; 2025</footer>
      </div>

      {showMathCalc && <MathCalculator onClose={() => setShowMathCalc(false)} theme={theme} />}
      {viewingCar && <CarDetailsModal car={viewingCar} onClose={() => setViewingCar(undefined)} theme={theme} />}
    </div>
  );
};

export default App;
