
import React, { useRef, useState } from 'react';
import { Car, Theme } from '../types';
import { FileUp, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface UploadManagerProps {
  theme: Theme;
  onDataExtracted: (cars: Car[]) => void;
  brands: string[];
}

const UploadManager: React.FC<UploadManagerProps> = ({ theme, onDataExtracted, brands }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const excelInputRef = useRef<HTMLInputElement>(null);
  const txtInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 10));

  const parseData = (text: string, type: 'excel' | 'txt') => {
    setIsProcessing(true);
    addLog(`بدء معالجة ملف ${type === 'excel' ? 'إكسيل' : 'نصي'}...`);

    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const extractedCars: Car[] = [];
    let currentBrand = brands[0] || 'Unknown';
    let currentYear = new Date().getFullYear();

    lines.forEach((line, index) => {
      const yearMatch = line.match(/(20\d{2})/);
      if (yearMatch) currentYear = parseInt(yearMatch[0]);

      const foundBrand = brands.find(b => line.toLowerCase().includes(b.toLowerCase()));
      if (foundBrand) currentBrand = foundBrand;

      const parts = line.split(/\t|,|\s{2,}/).map(p => p.trim()).filter(p => p.length > 0);

      if (parts.length >= 3) {
        const priceStr = line.replace(/,/g, '').match(/(\d{3,}(?:\.\d+)?)/);
        const price = priceStr ? parseFloat(priceStr[0]) : 0;

        if (price > 0) {
          const name = parts[0] + (parts[1] ? ` ${parts[1]}` : '');
          extractedCars.push({
            id: `upload-${Date.now()}-${index}`,
            brand: currentBrand,
            year: currentYear,
            name: name,
            description: line,
            descLines: parts.slice(0, 8),
            categories: [{ id: `cat-${index}`, name: 'الفئة المستخرجة', price: price }],
            installment: {
              basePrice: price,
              downPayment: Math.round(price * 0.3),
              interestRate: 20,
              years: 5,
              monthlyInstallment: Math.round((price * 0.7 * 2.0) / 60)
            },
            isAvailable: true,
            notes: "تم استيراد هذه البيانات من ملف خارجي.",
            noteLines: [],
            requiredPapers: [],
            images: [], // Initialize with empty array
            createdAt: Date.now()
          });
        }
      }
    });

    setTimeout(() => {
      if (extractedCars.length > 0) {
        onDataExtracted(extractedCars);
        addLog(`نجاح! تم استخراج ${extractedCars.length} موديل بنجاح.`);
      } else {
        addLog("خطأ: لم نتمكن من التعرف على بيانات صحيحة في هذا الملف.");
      }
      setIsProcessing(false);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'excel' | 'txt') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      parseData(content, type);
    };
    reader.readAsText(file);
  };

  const btnClass = `flex-1 flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all hover:scale-105 active:scale-95
    ${theme === 'ios' ? 'bg-white border-blue-200 hover:border-blue-500 text-black' : 'bg-white/5 border-white/20 hover:border-blue-500 text-white'}`;

  return (
    <div className="h-full p-6 md:p-12 overflow-y-auto animate-fade-in">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">مركز رفع البيانات</h2>
          <p className="opacity-60">ارفع ملفاتك لاستيراد موديلات السيارات والبيانات آلياً</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <input type="file" ref={excelInputRef} className="hidden" accept=".csv,.xlsx,.xls" onChange={(e) => handleFileUpload(e, 'excel')} />
          <button onClick={() => excelInputRef.current?.click()} className={btnClass}>
             <FileUp size={48} className="mb-4 text-green-400" />
             <span className="text-xl font-bold">ارفع ملف إكسيل</span>
             <span className="text-xs opacity-50 mt-2">يدعم ملفات .CSV و .XLSX</span>
          </button>

          <input type="file" ref={txtInputRef} className="hidden" accept=".txt" onChange={(e) => handleFileUpload(e, 'txt')} />
          <button onClick={() => txtInputRef.current?.click()} className={btnClass}>
             <FileText size={48} className="mb-4 text-blue-400" />
             <span className="text-xl font-bold">ارفع ملف TXT</span>
             <span className="text-xs opacity-50 mt-2">استيراد نصوص الموديلات والتفاصيل</span>
          </button>
        </div>

        {isProcessing && (
          <div className="flex items-center justify-center gap-3 p-6 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
             <Loader2 className="animate-spin" />
             <span className="font-bold">جارِ تحليل الملف واستخراج البيانات...</span>
          </div>
        )}

        <div className={`p-4 rounded-xl border ${theme === 'ios' ? 'bg-gray-100 border-gray-200' : 'bg-black/40 border-gray-700'}`}>
           <h3 className="text-sm font-bold mb-4 opacity-50">سجل العمليات الأخير:</h3>
           <div className="space-y-2">
              {log.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                   {item.includes('نجاح') ? <CheckCircle size={14} className="text-green-500" /> : <AlertCircle size={14} className="text-blue-400" />}
                   <span>{item}</span>
                </div>
              ))}
              {log.length === 0 && <p className="text-xs opacity-30 text-center py-4">لا توجد عمليات حالية</p>}
           </div>
        </div>
      </div>
    </div>
  );
};

export default UploadManager;
