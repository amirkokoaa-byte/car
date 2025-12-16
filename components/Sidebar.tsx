import React from 'react';
import { View, Theme } from '../types';
import { Car, Calculator, FileText, TrendingUp, Calculator as CalcIcon, X } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
  onOpenCalculator: () => void;
  onCloseSidebar?: () => void; // New prop for mobile
  theme: Theme;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onOpenCalculator, onCloseSidebar, theme }) => {
  
  const menuItems = [
    { id: 'models', label: 'موديلات السيارات', icon: Car },
    { id: 'loanCalc', label: 'حاسبة القروض', icon: Calculator },
    { id: 'priceAnalysis', label: 'أعلى وأقل سعر', icon: TrendingUp },
    { id: 'documents', label: 'الأوراق المطلوبة', icon: FileText },
  ];

  const btnBaseClass = `w-full flex items-center gap-4 p-4 transition-all duration-300 relative overflow-hidden group`;
  
  const getActiveClass = (isActive: boolean) => {
    if (!isActive) return 'opacity-60 hover:opacity-100 hover:bg-white/5';
    
    switch (theme) {
      case 'glass': return 'bg-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.2)] border-r-4 border-white';
      case 'win10': return 'bg-[#0078d7] text-white border-l-4 border-white';
      case 'ios': return 'bg-blue-500 text-white rounded-xl mx-2 shadow-lg';
      case 'dark': return 'bg-blue-900/50 text-blue-300 border-r-2 border-blue-500';
      default: return '';
    }
  };

  const containerClass = theme === 'glass' ? 'bg-black/80 backdrop-blur-xl border-l border-white/10' :
         theme === 'win10' ? 'bg-[#1e1e1e] border-l border-black' :
         theme === 'ios' ? 'bg-gray-50 border-l border-gray-200' :
         'bg-black border-l border-gray-800';

  return (
    <div className={`h-full flex flex-col py-6 w-64 ${containerClass}`}>
      
      <div className="px-6 mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-mono tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
          Four Brothers
        </h1>
        {/* Mobile Close Button */}
        <button onClick={onCloseSidebar} className="md:hidden text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onChangeView(item.id as View);
              if (onCloseSidebar) onCloseSidebar();
            }}
            className={`${btnBaseClass} ${getActiveClass(currentView === item.id)}`}
          >
            <item.icon size={24} className={currentView === item.id ? 'animate-pulse' : ''} />
            <span className="font-bold text-lg">{item.label}</span>
          </button>
        ))}

        <div className="border-t border-gray-700 my-4 mx-4"></div>

        <button
           onClick={() => {
             onOpenCalculator();
             if (onCloseSidebar) onCloseSidebar();
           }}
           className={`${btnBaseClass} text-yellow-500 hover:bg-yellow-500/10`}
        >
           <CalcIcon size={24} />
           <span className="font-bold text-lg">الآلة الحاسبة</span>
        </button>
      </nav>

      <div className="px-6 text-center text-xs opacity-40 mt-auto">
         v1.0.0
      </div>
    </div>
  );
};

export default Sidebar;