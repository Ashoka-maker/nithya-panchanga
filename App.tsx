
import React, { useState } from 'react';
import { PanchangaData, PANCHANGA_LISTS } from './types';
import { fetchPanchangaFromAI } from './services/geminiService';
import PosterTemplate from './components/PosterTemplate';
import { Loader2, RefreshCw, Download, Languages, Edit3, UserCircle } from 'lucide-react';

declare var html2canvas: any;

const ASTROLOGER_NAME = "Karthik Joshi";

const INITIAL_DATA: PanchangaData = {
  language: 'telugu',
  date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
  samvatsara: "విశ్వావసు",
  ayana: "దక్షిణాయనం",
  rutu: "హేమంత",
  masa: "పుష్యమాసం",
  paksha: "కృష్ణ",
  tithi: "నవమి",
  nakshatra: "స్వాతి",
  vaara: "సోమవారం",
  yoga: "ధృతి",
  karana: "గరజ",
  shraddhaTithi: "దశమి",
  visesha: "శ్రీ రామరక్షా స్తోత్రం చదవడం ఉత్తమం.",
  shubhaSamayam: "11 AM - 12 PM",
  uthamaRashulu: "వృషభ, కర్కా, కన్యా",
  viseshamNote: "శ్రీ గోపాల దాసవారి ఉత్తరారాధన"
};

const App: React.FC = () => {
  const [data, setData] = useState<PanchangaData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleFetchData = async () => {
    setLoading(true);
    const aiData = await fetchPanchangaFromAI(selectedDate, data.language);
    if (aiData) {
      setData({ ...aiData, language: data.language });
    }
    setLoading(false);
  };

  const updateField = (field: keyof PanchangaData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleLanguage = () => {
    const newLang = data.language === 'telugu' ? 'kannada' : 'telugu';
    const lists = PANCHANGA_LISTS[newLang];
    
    setData({
      language: newLang,
      date: data.date,
      samvatsara: newLang === 'telugu' ? "విశ్వావసు" : "ವಿಶ್ವಾವಸು",
      ayana: lists.ayana[0],
      rutu: lists.rutu[0],
      masa: lists.masa[0],
      paksha: lists.paksha[0],
      tithi: lists.tithi[0],
      nakshatra: lists.nakshatra[0],
      vaara: lists.vaara[0],
      yoga: lists.yoga[0],
      karana: lists.karana[0],
      shraddhaTithi: lists.tithi[1],
      visesha: newLang === 'telugu' ? "వివరాలు ఇక్కడ వస్తాయి..." : "ವಿವರಗಳು ಇಲ್ಲಿ ಬರುತ್ತವೆ...",
      shubhaSamayam: "11 AM - 12 PM",
      uthamaRashulu: newLang === 'telugu' ? "వృషభ, కర్కా, కన్యా" : "ವೃಷಭ, ಕರ್ಕ, ಕನ್ಯಾ",
      viseshamNote: newLang === 'telugu' ? "గమనిక" : "ಸೂಚನೆ"
    });
  };

  const handleDownloadImage = async () => {
    const posterElement = document.getElementById('panchanga-poster');
    if (!posterElement) return;

    setDownloading(true);
    try {
      // Create a temporary container to render the poster at a fixed size for the capture
      // This ensures consistent high-quality export regardless of device screen size
      const canvas = await html2canvas(posterElement, {
        useCORS: true,
        scale: 3, 
        backgroundColor: '#FFFBEE',
        logging: false,
        onclone: (clonedDoc: Document) => {
          const el = clonedDoc.getElementById('panchanga-poster');
          if (el) {
            // Force the width for the export so it's always high-res 500px wide
            el.style.width = '500px';
            el.style.maxWidth = '500px';
            el.style.height = 'auto'; // Let it grow if content is long
            el.style.position = 'fixed';
            el.style.top = '0';
            el.style.left = '0';
            el.style.transform = 'none';
            el.style.margin = '0';
            el.style.zIndex = '9999';
          }
        }
      });
      
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = `Panchanga_${data.language}_${data.date}.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error("Error:", error);
      alert("Download failed. If on mobile, try taking a screenshot or use Chrome browser.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center">
      <header className="w-full max-w-7xl p-4 md:p-8 flex flex-col md:flex-row justify-between items-center no-print gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-5xl font-black text-[#8B0000] flex items-center justify-center md:justify-start gap-2 uppercase tracking-tight">
            <Edit3 size={24} className="md:w-11 md:h-11" /> Vyas Studio
          </h1>
          <div className="flex items-center gap-2 mt-1 text-stone-600 font-bold uppercase tracking-wider bg-stone-200/50 px-3 py-1 rounded-lg w-fit mx-auto md:mx-0">
            <UserCircle size={14} className="text-[#8B0000] md:w-5 md:h-5" />
            <span className="text-[10px] md:text-sm">Astrologer: {ASTROLOGER_NAME}</span>
          </div>
        </div>
        
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-6 py-2 md:py-4 bg-[#8B0000] text-white rounded-full font-black shadow-lg hover:bg-[#660000] transition-all active:scale-95 text-xs md:text-base"
        >
          <Languages size={16} className="md:w-7 md:h-7" />
          {data.language === 'telugu' ? 'SWITCH TO KANNADA' : 'SWITCH TO TELUGU'}
        </button>
      </header>

      <main className="w-full max-w-7xl px-4 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Live Preview - Shown first on Mobile */}
        <div className="flex flex-col items-center gap-4 lg:sticky lg:top-8 order-1 lg:order-2">
          <div className="w-full max-w-[500px] border-4 md:border-8 border-white rounded-3xl overflow-hidden shadow-2xl">
            <PosterTemplate data={data} astrologerName={ASTROLOGER_NAME} />
          </div>
          
          <div className="w-full max-w-md space-y-4 no-print mt-4">
            <button 
              onClick={handleDownloadImage}
              disabled={downloading}
              className="w-full bg-[#1B5E20] text-white py-4 md:py-7 rounded-2xl md:rounded-[32px] font-black text-lg md:text-2xl shadow-xl flex items-center justify-center gap-3 hover:bg-[#0C3E10] transition-all disabled:opacity-50 active:scale-95 border-b-4 md:border-b-8 border-black/30"
            >
              {downloading ? <Loader2 className="animate-spin" size={24} /> : <Download size={24} />}
              {downloading ? "PREPARING..." : "SAVE POSTER"}
            </button>
          </div>
        </div>

        {/* Editor Form - Shown after preview on Mobile */}
        <div className="bg-white p-4 md:p-8 rounded-3xl md:rounded-[40px] shadow-xl border-2 border-stone-200 no-print space-y-6 order-2 lg:order-1">
          <div className="bg-[#FFFBEE] p-4 rounded-2xl border-2 border-[#D4AF37]/40 flex gap-4 flex-wrap shadow-inner items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="text-[10px] font-black text-[#8B0000] uppercase mb-1 block tracking-widest">Auto-Fetch Data</label>
              <div className="flex gap-2">
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 p-3 bg-white border-2 border-stone-200 rounded-xl outline-none focus:border-[#8B0000] font-bold text-sm"
                />
                <button 
                  onClick={handleFetchData}
                  disabled={loading}
                  className="bg-[#8B0000] text-white px-4 rounded-xl hover:bg-[#660000] transition shadow-lg disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
                </button>
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <label className="text-[10px] font-black text-[#8B0000] uppercase mb-1 block tracking-widest">Display Date</label>
              <input 
                type="text" 
                value={data.date} 
                onChange={(e) => updateField('date', e.target.value)}
                className="w-full p-3 border-2 border-stone-200 rounded-xl outline-none focus:border-[#8B0000] font-bold text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <InputField label="Samvatsara" value={data.samvatsara} onChange={(v) => updateField('samvatsara', v)} lang={data.language} />
            <SelectField label="Ayana" value={data.ayana} options={PANCHANGA_LISTS[data.language].ayana} onChange={(v) => updateField('ayana', v)} lang={data.language} />
            <SelectField label="Masa" value={data.masa} options={PANCHANGA_LISTS[data.language].masa} onChange={(v) => updateField('masa', v)} lang={data.language} />
            <SelectField label="Paksha" value={data.paksha} options={PANCHANGA_LISTS[data.language].paksha} onChange={(v) => updateField('paksha', v)} lang={data.language} />
            <SelectField label="Tithi" value={data.tithi} options={PANCHANGA_LISTS[data.language].tithi} onChange={(v) => updateField('tithi', v)} lang={data.language} />
            <SelectField label="Nakshatra" value={data.nakshatra} options={PANCHANGA_LISTS[data.language].nakshatra} onChange={(v) => updateField('nakshatra', v)} lang={data.language} />
            <SelectField label="Vaara" value={data.vaara} options={PANCHANGA_LISTS[data.language].vaara} onChange={(v) => updateField('vaara', v)} lang={data.language} />
            <SelectField label="Yoga" value={data.yoga} options={PANCHANGA_LISTS[data.language].yoga} onChange={(v) => updateField('yoga', v)} lang={data.language} />
          </div>

          <div className="space-y-4 pt-4 border-t border-stone-100">
            <TextAreaField label="Daily Speciality" value={data.visesha} onChange={(v) => updateField('visesha', v)} lang={data.language} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Auspicious Time" value={data.shubhaSamayam} onChange={(v) => updateField('shubhaSamayam', v)} lang={data.language} />
              <InputField label="Lucky Zodiacs" value={data.uthamaRashulu} onChange={(v) => updateField('uthamaRashulu', v)} lang={data.language} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const InputField = ({ label, value, onChange, lang }: { label: string, value: string, onChange: (v: string) => void, lang: string }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] md:text-[11px] font-black text-stone-400 uppercase tracking-widest">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className={`p-3 bg-stone-50 border-2 border-stone-100 rounded-xl text-sm md:text-lg ${lang === 'telugu' ? 'telugu-font' : 'kannada-font'} focus:border-[#8B0000] outline-none font-bold`}
    />
  </div>
);

const SelectField = ({ label, value, options, onChange, lang }: { label: string, value: string, options: string[], onChange: (v: string) => void, lang: string }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] md:text-[11px] font-black text-stone-400 uppercase tracking-widest">{label}</label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className={`p-3 bg-stone-50 border-2 border-stone-100 rounded-xl text-sm md:text-lg ${lang === 'telugu' ? 'telugu-font' : 'kannada-font'} focus:border-[#8B0000] outline-none cursor-pointer font-bold appearance-none`}
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const TextAreaField = ({ label, value, onChange, lang }: { label: string, value: string, onChange: (v: string) => void, lang: string }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] md:text-[11px] font-black text-stone-400 uppercase tracking-widest">{label}</label>
    <textarea 
      rows={2}
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className={`p-3 bg-stone-50 border-2 border-stone-100 rounded-xl text-sm md:text-lg ${lang === 'telugu' ? 'telugu-font' : 'kannada-font'} focus:border-[#8B0000] outline-none w-full resize-none font-bold`}
    />
  </div>
);

export default App;
