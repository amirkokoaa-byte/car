import React, { useState } from 'react';
import { Theme } from '../types';
import { Save } from 'lucide-react';

interface DocumentsManagerProps {
  documents: string[];
  onSave: (docs: string[]) => void;
  theme: Theme;
}

const DocumentsManager: React.FC<DocumentsManagerProps> = ({ documents, onSave, theme }) => {
  const [lines, setLines] = useState<string[]>(documents);

  const handleLineChange = (index: number, value: string) => {
    const newLines = [...lines];
    newLines[index] = value;
    setLines(newLines);
  };

  const handleSave = () => {
    onSave(lines);
    alert('تم حفظ قائمة الأوراق المطلوبة بنجاح');
  };

  const inputClass = `w-full p-3 rounded text-lg transition-all
    ${theme === 'glass' ? 'bg-white/10 border border-white/10 text-white focus:bg-white/20' :
      theme === 'win10' ? 'bg-[#1f1f1f] border border-gray-600 text-white rounded-none focus:border-blue-500' :
      theme === 'ios' ? 'bg-white border-b border-gray-200 text-black rounded-none focus:bg-gray-50' :
      'bg-gray-800 border border-gray-700 text-white focus:border-blue-500'}`;

  return (
    <div className="p-6 md:p-10 h-full overflow-y-auto animate-fade-in">
      <div className={`max-w-3xl mx-auto p-8 rounded-xl shadow-2xl
         ${theme === 'ios' ? 'bg-gray-50' : 'bg-white/5 border border-white/10'}`}>
        
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-3xl font-bold bg-gradient-to-l from-yellow-400 to-orange-500 bg-clip-text text-transparent">
             الأوراق المطلوبة
           </h2>
           <button 
             onClick={handleSave}
             className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-full flex items-center gap-2 shadow-lg transition-transform active:scale-95"
           >
             <Save size={20}/>
             <span>حفظ التعديلات</span>
           </button>
        </div>

        <div className="space-y-4">
          {lines.map((line, idx) => (
            <div key={idx} className="flex items-center gap-4">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                  ${theme === 'ios' ? 'bg-gray-200 text-gray-600' : 'bg-gray-700 text-white'}`}>
                 {idx + 1}
               </div>
               <input 
                 type="text" 
                 value={line}
                 onChange={(e) => handleLineChange(idx, e.target.value)}
                 className={inputClass}
                 placeholder={`مستند رقم ${idx + 1}`}
               />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentsManager;