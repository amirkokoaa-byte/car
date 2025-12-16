import React, { useState } from 'react';
import { X, Delete, Equal } from 'lucide-react';

interface MathCalculatorProps {
  onClose: () => void;
  theme: string;
}

const MathCalculator: React.FC<MathCalculatorProps> = ({ onClose, theme }) => {
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState('');

  const handleClick = (value: string) => {
    setDisplay((prev) => prev + value);
  };

  const handleClear = () => {
    setDisplay('');
    setResult('');
  };

  const handleCalculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const res = eval(display.replace('x', '*').replace('÷', '/'));
      setResult(res.toString());
      setDisplay(res.toString());
    } catch (e) {
      setResult('Error');
    }
  };

  const btnClass = `h-12 w-full font-bold text-lg rounded transition-colors ${
    theme === 'glass' ? 'bg-white/20 hover:bg-white/30 text-white' :
    theme === 'win10' ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600' :
    theme === 'ios' ? 'bg-gray-200 hover:bg-gray-300 text-black rounded-full' :
    'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
  }`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`relative w-80 p-4 rounded-xl shadow-2xl flex flex-col gap-4
        ${theme === 'glass' ? 'bg-black/60 backdrop-blur-xl border border-white/20 text-white' :
          theme === 'win10' ? 'bg-[#1f1f1f] border-2 border-blue-500 text-white rounded-none' :
          theme === 'ios' ? 'bg-white text-black rounded-3xl' :
          'bg-gray-900 border border-gray-700 text-white'
        }`}>
        
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg">الآلة الحاسبة</h3>
          <button onClick={onClose} className="p-1 hover:bg-red-500 rounded-full hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        <div className={`w-full h-20 text-right p-2 rounded text-3xl font-mono overflow-hidden flex flex-col justify-end
           ${theme === 'ios' ? 'bg-gray-100 text-black' : 'bg-black/40 text-white'}`}>
          <span className="text-sm opacity-50 h-6">{result}</span>
          <span>{display || '0'}</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button onClick={handleClear} className={`${btnClass} text-red-400 col-span-2`}>AC</button>
          <button onClick={() => setDisplay(prev => prev.slice(0, -1))} className={btnClass}><Delete size={18} className="mx-auto"/></button>
          <button onClick={() => handleClick('/')} className={`${btnClass} text-blue-400`}>÷</button>

          <button onClick={() => handleClick('7')} className={btnClass}>7</button>
          <button onClick={() => handleClick('8')} className={btnClass}>8</button>
          <button onClick={() => handleClick('9')} className={btnClass}>9</button>
          <button onClick={() => handleClick('*')} className={`${btnClass} text-blue-400`}>x</button>

          <button onClick={() => handleClick('4')} className={btnClass}>4</button>
          <button onClick={() => handleClick('5')} className={btnClass}>5</button>
          <button onClick={() => handleClick('6')} className={btnClass}>6</button>
          <button onClick={() => handleClick('-')} className={`${btnClass} text-blue-400`}>-</button>

          <button onClick={() => handleClick('1')} className={btnClass}>1</button>
          <button onClick={() => handleClick('2')} className={btnClass}>2</button>
          <button onClick={() => handleClick('3')} className={btnClass}>3</button>
          <button onClick={() => handleClick('+')} className={`${btnClass} text-blue-400`}>+</button>

          <button onClick={() => handleClick('0')} className={`${btnClass} col-span-2`}>0</button>
          <button onClick={() => handleClick('.')} className={btnClass}>.</button>
          <button onClick={handleCalculate} className={`${btnClass} bg-blue-600 hover:bg-blue-500 text-white border-none`}>=</button>
        </div>
      </div>
    </div>
  );
};

export default MathCalculator;