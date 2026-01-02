
import React, { useState, useEffect } from 'react';
import { Shield, Edit3, ExternalLink, Pencil, CheckCircle2, X, BellRing, Smartphone, MapPin, Award } from 'lucide-react';
import { DataProvider, useData } from './context/DataContext';
import Header from './components/Header';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import NewsSection from './components/NewsSection';
import SafetyGuides from './components/SafetyGuides';
import AIAssistant from './components/AIAssistant';
import Footer from './components/Footer';
import TextEditorModal from './components/TextEditorModal';
import Messenger from './components/Messenger';
import MaintenanceModal from './components/MaintenanceModal';
import { StyledText } from './types';

const AppContent: React.FC = () => {
  const { isEditMode, setEditMode, recruitment, updateRecruitment, marqueeTexts, updateMarquee, currentUser, updateCurrentUser } = useData();
  const [editorState, setEditorState] = useState<{ isOpen: boolean, field: keyof typeof recruitment | 'marquee' | null, index?: number }>({ isOpen: false, field: null });
  const [showNotification, setShowNotification] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.interviewStatus === 'approved' && !currentUser.hasBeenNotified) {
        setShowNotification(true);
    }
  }, [currentUser]);

  const closeNotification = () => {
    setShowNotification(false);
    updateCurrentUser({ hasBeenNotified: true });
  };

  const handleSave = (styledData: StyledText) => {
    if (editorState.field === 'marquee' && editorState.index !== undefined) {
      const newTexts = [...marqueeTexts];
      newTexts[editorState.index] = styledData.text;
      updateMarquee(newTexts);
    } else if (editorState.field && editorState.field !== 'marquee') {
      updateRecruitment({ ...recruitment, [editorState.field]: styledData.text });
    }
  };

  const openEditor = (field: keyof typeof recruitment | 'marquee', index?: number) => {
    if (!isEditMode) return;
    setEditorState({ isOpen: true, field, index });
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-dsns-orange selection:text-dsns-blue font-sans antialiased">
      <Header />
      
      {isEditMode && (
        <div className="bg-dsns-blue text-white px-4 py-3 text-center text-[10px] font-black uppercase tracking-[0.2em] sticky top-24 z-[60] shadow-2xl border-b-2 border-dsns-orange flex items-center justify-center space-x-6">
          <Edit3 size={16} className="text-dsns-orange animate-pulse" />
          <span>РЕЖИМ РЕДАГУВАННЯ: ТИСНІТЬ НА ТЕКСТ</span>
          <button onClick={() => setEditMode(false)} className="bg-dsns-orange text-dsns-blue px-4 py-1 rounded-full font-black">ЗАКРИТИ</button>
        </div>
      )}

      {showNotification && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-dsns-blue/95 backdrop-blur-2xl">
            <div className="bg-white max-w-lg w-full rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white animate-in zoom-in duration-500">
                <div className="bg-dsns-orange p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 flex flex-wrap gap-4 rotate-12">
                        {Array.from({length: 20}).map((_, i) => <Shield key={i} size={40} />)}
                    </div>
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl relative z-10">
                        <Award size={48} className="text-dsns-orange" />
                    </div>
                    <h2 className="text-4xl font-black text-dsns-blue uppercase tracking-tighter italic leading-none mb-2 relative z-10">ВАС ПРИЙНЯТО!</h2>
                    <p className="text-dsns-blue/60 font-black uppercase text-xs tracking-widest relative z-10">ЛАСКАВО ПРОСИМО ДО ЛАВ ДСНС</p>
                </div>
                <div className="p-12 text-center">
                    <p className="text-slate-500 font-medium leading-relaxed mb-10">
                        Шановний кандидате! Ваша анкета була успішно розглянута та <span className="text-green-500 font-black">СХВАЛЕНА</span> Генералом СЦЗ. <br/><br/>
                        Вам необхідно явитися до Головного Управління ДСНС для отримання форми та проходження інструктажу.
                    </p>
                    <div className="flex gap-4">
                        <button onClick={closeNotification} className="flex-1 py-5 bg-dsns-blue text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg">
                            СЛУЖУ НАРОДУ УКРАЇНИ!
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {currentUser && currentUser.interviewStatus === 'approved' && (
        <button 
            onClick={() => setIsPhoneOpen(true)}
            className="fixed bottom-28 right-6 w-16 h-16 bg-dsns-blue text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 animate-bounce"
        >
            <Smartphone size={28} />
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">1</span>
        </button>
      )}

      <main className="flex-grow">
        <Hero />
        <StatsSection />
        
        <div className="bg-dsns-orange text-dsns-blue overflow-hidden py-6 border-y-4 border-dsns-blue shadow-2xl relative z-20">
          <div className="flex animate-marquee whitespace-nowrap">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center space-x-12 mx-8">
                {marqueeTexts.map((text, tIdx) => (
                  <React.Fragment key={tIdx}>
                    <span 
                      className={`font-black text-2xl uppercase italic tracking-tighter ${isEditMode ? 'cursor-pointer hover:underline' : ''}`}
                      onClick={() => openEditor('marquee', tIdx)}
                    >
                      {text}
                    </span>
                    <span className="w-4 h-4 bg-dsns-blue rounded-full"></span>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>

        <NewsSection />
        <SafetyGuides />

        <section className="py-32 bg-[#001835] relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <div className="inline-block p-6 rounded-[2.5rem] bg-dsns-orange/10 border border-dsns-orange/20 mb-10 shadow-2xl">
              <Shield className="w-16 h-16 text-dsns-orange mx-auto" />
            </div>
            <h2 className={`text-5xl md:text-7xl font-black mb-8 italic tracking-tighter uppercase ${isEditMode ? "cursor-pointer border-b border-dashed border-dsns-orange hover:bg-dsns-orange/5" : ""}`} onClick={() => openEditor('title')}>{recruitment.title}</h2>
            <p className={`text-xl md:text-2xl text-slate-400 mb-16 max-w-4xl mx-auto font-medium leading-relaxed ${isEditMode ? "cursor-pointer border-b border-dashed border-dsns-orange hover:bg-dsns-orange/5" : ""}`} onClick={() => openEditor('description')}>{recruitment.description}</p>
            <a href="https://forum.ukraine-gta.com.ua/forums/%D0%94%D0%A1%D0%9D%D0%A1.170/" target="_blank" className="bg-dsns-orange text-dsns-blue px-14 py-7 rounded-[2rem] font-black text-xl hover:scale-105 transition-all shadow-2xl inline-flex items-center gap-3">
              <span onClick={(e) => { if(isEditMode) { e.preventDefault(); openEditor('buttonText'); } }}>{recruitment.buttonText}</span>
              <ExternalLink size={20} />
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <AIAssistant />
      <Messenger isOpen={isPhoneOpen} onClose={() => setIsPhoneOpen(false)} />
      <MaintenanceModal />

      <TextEditorModal 
        isOpen={editorState.isOpen}
        onClose={() => setEditorState({ isOpen: false, field: null })}
        onSave={handleSave}
        initialData={
          editorState.field === 'marquee' && editorState.index !== undefined 
            ? marqueeTexts[editorState.index] 
            : (editorState.field && editorState.field !== 'marquee' ? recruitment[editorState.field] : '')
        }
        title="Професійний редактор"
      />

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
      `}</style>
    </div>
  );
};

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;
