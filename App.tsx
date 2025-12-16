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

const App: React.FC = () => {
  // --- State ---
  const [theme, setTheme] = useState<Theme>('dark');
  const [activeView, setActiveView] = useState<View>('models');
  const [showMathCalc, setShowMathCalc] = useState(false);

  // --- Data (Persisted in LocalStorage) ---
  const [cars, setCars] = useState<Car[]>(() => {
    const saved = localStorage.getItem('fb_cars');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<GlobalSettings>(() => {
    const saved = localStorage.getItem('fb_settings');
    return saved ? JSON.parse(saved) : {
      brands: INITIAL_BRANDS,
      documents: Array(DEFAULT_DOC_LINES).fill(''),
    };
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
  // Base App Container style based on theme
  const getAppStyle = () => {
    switch (theme) {
      case 'glass':
        return 'bg-gradient-to-br from-gray-900 to-blue-900 text-white';
      case 'win10':
        return 'bg-[#121212] text-white font-sans';
      case 'ios':
        return 'bg-gray-100 text-black font-sans';
      case 'dark':
      default:
        return 'bg-black text-white font-sans';
    }
  };

  return (
    <div className={`w-full h-screen overflow-hidden flex flex-col md:flex-row ${getAppStyle()} transition-colors duration-500`} dir="rtl">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 z-20 shadow-2xl">
        <Sidebar 
          currentView={activeView} 
          onChangeView={setActiveView} 
          onOpenCalculator={() => setShowMathCalc(true)}
          theme={theme}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <header className={`h-20 flex items-center justify-between px-8 z-10
           ${theme === 'glass' ? 'bg-white/5 backdrop-blur-sm' : 
             theme === 'ios' ? 'bg-white shadow-sm' : 
             'bg-opacity-50 bg-black'}`}>
           
           <div className="flex gap-2">
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

           <DigitalClock />
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-hidden relative">
          {activeView === 'models' && (
            <CarManager 
              cars={cars} 
              brands={settings.brands}
              theme={theme}
              onAddCar={handleAddCar}
              onUpdateCar={handleUpdateCar}
              onDeleteCar={handleDeleteCar}
              onAddBrand={handleAddBrand}
            />
          )}

          {activeView === 'loanCalc' && <LoanCalculator theme={theme} />}
          
          {activeView === 'priceAnalysis' && (
             <PriceAnalysis 
               cars={cars} 
               brands={settings.brands} 
               theme={theme}
               onCarClick={(car) => {
                 // In a real app we might navigate or open a modal. 
                 // For now, switch to Models view and maybe filter?
                 // Simple implementation: Alert details or we reuse the modal logic if refactored.
                 // Given the prompt structure, opening details in popup is required.
                 // Reusing the modal logic inside PriceAnalysis would be best, or lifting state.
                 // For simplicity, I'll allow PriceAnalysis to show the popup locally.
                 alert(`Selected: ${car.brand} ${car.name}\nPrice: ${Math.min(...car.categories.map(c => c.price))} EGP`);
               }}
             />
          )}

          {activeView === 'documents' && (
             <DocumentsManager 
               documents={settings.documents}
               onSave={handleUpdateDocuments}
               theme={theme}
             />
          )}

          {/* Background decoration for Glass/Dark themes */}
          {(theme === 'glass' || theme === 'dark') && (
            <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
               <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className={`h-8 flex items-center justify-center text-xs opacity-50
          ${theme === 'ios' ? 'bg-gray-200 text-black' : 'bg-black text-white'}`}>
           Developed by Amir Lamay
        </footer>
      </div>

      {/* Popups */}
      {showMathCalc && <MathCalculator onClose={() => setShowMathCalc(false)} theme={theme} />}

    </div>
  );
};

export default App;