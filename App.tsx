import React, { useState, useEffect, useRef } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Button } from './components/Button';
import { Modal } from './components/Modal';
import { AppData, DailyLog, Habit, CalendarDay, HabitState, WeatherType } from './types';

// Initial state helpers
const DEFAULT_HABITS: Habit[] = [
  { id: 'h1', name: 'TREENI' }
];

// Brutalist Pattern Palette for Habits (defined in index.html styles)
const HABIT_PATTERNS = [
  'pattern-stripe',
  'pattern-grid', 
  'pattern-cross',
  'pattern-hatch'
];

const INITIAL_DATA: AppData = {
  logs: {},
  habits: DEFAULT_HABITS,
  projectLog: "// JÄRJESTELMÄ ALUSTETTU\n// ALOITA LOKIMERKINTÄ...\n\n"
};

// Helper to get local YYYY-MM-DD string
const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDaysInMonth = (year: number, month: number): CalendarDay[] => {
  const date = new Date(year, month, 1);
  const days: CalendarDay[] = [];
  while (date.getMonth() === month) {
    const d = new Date(date);
    days.push({
      date: d,
      dateString: formatDateKey(d),
      dayName: d.toLocaleDateString('fi-FI', { weekday: 'short' }).toUpperCase(),
      dayNumber: d.getDate().toString().padStart(2, '0')
    });
    date.setDate(date.getDate() + 1);
  }
  return days;
};

// Icons
const GearIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="square" strokeLinejoin="miter" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="square" strokeLinejoin="miter" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="square" strokeLinejoin="miter" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6 text-black">
    <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PencilIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="square" strokeLinejoin="miter" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

// Weather Icons - Updated to accept className for sizing
const SunIcon = ({ className = "w-5 h-5" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>;
const CloudIcon = ({ className = "w-5 h-5" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19c0-3.037-2.463-5.5-5.5-5.5S6.5 15.963 6.5 19"/><path d="M20.6 16c0-2.426-1.974-4.4-4.4-4.4-1.4 0-2.6.6-3.5 1.6-1.1-1.6-2.9-2.6-4.9-2.6-3.314 0-6 2.686-6 6"/></svg>;
const RainIcon = ({ className = "w-5 h-5" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 13v8"/><path d="M8 13v8"/><path d="M12 15v8"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>;
const SnowIcon = ({ className = "w-5 h-5" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="5.6" y1="5.6" x2="18.4" y2="18.4"/><line x1="5.6" y1="18.4" x2="18.4" y2="5.6"/></svg>;
const StormIcon = ({ className = "w-5 h-5" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;

const getWeatherIcon = (type: WeatherType, className?: string) => {
  switch (type) {
    case 'sun': return <SunIcon className={className} />;
    case 'cloud': return <CloudIcon className={className} />;
    case 'rain': return <RainIcon className={className} />;
    case 'snow': return <SnowIcon className={className} />;
    case 'storm': return <StormIcon className={className} />;
    default: return null;
  }
};

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // App Data State
  const [data, setData] = useState<AppData>(INITIAL_DATA);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // UI State
  const [activeModalDate, setActiveModalDate] = useState<string | null>(null);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  
  // Track selected date for the "Mission Data" panel context
  const [selectedDateString, setSelectedDateString] = useState<string>(formatDateKey(new Date()));
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('proto_planner_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed);
      } catch (e) {
        console.error("Data corruption detected. Resetting.");
      }
    }
    // Check session auth
    const auth = sessionStorage.getItem('proto_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('proto_planner_v1', JSON.stringify(data));
  }, [data]);

  // Actions
  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('proto_auth', 'true');
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.setItem('proto_auth', 'false');
  };

  const updateBrief = (dateString: string, val: string) => {
    setData(prev => ({
      ...prev,
      logs: {
        ...prev.logs,
        [dateString]: {
          ...(prev.logs[dateString] || { fieldReport: '', habits: {} }),
          brief: val
        }
      }
    }));
    setSelectedDateString(dateString);
  };

  // Tri-state logic: null (empty) -> 'done' (pattern) -> 'failed' (X) -> null
  const toggleHabit = (dateString: string, habitId: string) => {
    setData(prev => {
      const currentLog = prev.logs[dateString] || { brief: '', fieldReport: '', habits: {} };
      const currentState = currentLog.habits?.[habitId] || null;
      
      let nextState: HabitState = null;
      if (currentState === null || currentState === undefined) nextState = 'done';
      else if (currentState === 'done') nextState = 'failed';
      else nextState = null; // Reset

      return {
        ...prev,
        logs: {
          ...prev.logs,
          [dateString]: {
            ...currentLog,
            habits: {
              ...currentLog.habits,
              [habitId]: nextState
            }
          }
        }
      };
    });
    setSelectedDateString(dateString);
  };

  const updateWeather = (dateString: string, type: WeatherType) => {
    setData(prev => ({
      ...prev,
      logs: {
        ...prev.logs,
        [dateString]: {
          ...(prev.logs[dateString] || { brief: '', fieldReport: '', habits: {} }),
          weather: {
            ...(prev.logs[dateString]?.weather || { temp: '' }),
            type
          }
        }
      }
    }));
  };

  const updateTemp = (dateString: string, temp: string) => {
    setData(prev => ({
      ...prev,
      logs: {
        ...prev.logs,
        [dateString]: {
          ...(prev.logs[dateString] || { brief: '', fieldReport: '', habits: {} }),
          weather: {
            ...(prev.logs[dateString]?.weather || { type: null }),
            temp
          }
        }
      }
    }));
  };

  const updateFieldReport = (dateString: string, val: string) => {
    setData(prev => ({
      ...prev,
      logs: {
        ...prev.logs,
        [dateString]: {
          ...(prev.logs[dateString] || { brief: '', habits: {} }),
          fieldReport: val
        }
      }
    }));
  };

  const addNewHabit = () => {
    if (!newHabitName.trim()) return;
    const newId = `h${Date.now()}`;
    setData(prev => ({
      ...prev,
      habits: [...prev.habits, { id: newId, name: newHabitName.toUpperCase() }]
    }));
    setNewHabitName('');
    setIsHabitModalOpen(false);
  };

  const deleteHabit = (habitId: string) => {
    if (window.confirm('POISTETAANKO TAPA?')) {
        setData(prev => ({
            ...prev,
            habits: prev.habits.filter(h => h.id !== habitId)
        }));
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PROTO_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        // Basic validation could go here
        if (parsed.logs && parsed.habits) {
          setData(parsed);
          alert('TIETOJEN TUONTI ONNISTUI.');
          setIsSettingsOpen(false);
        } else {
          throw new Error('Invalid structure');
        }
      } catch (err) {
        alert('TUONTI EPÄONNISTUI: VIALLINEN TIEDOSTO.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Calendar Gen
  const currentDays = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const monthLabel = currentDate.toLocaleDateString('fi-FI', { month: 'long', year: 'numeric' }).toUpperCase();
  const todayString = formatDateKey(new Date());

  // Helper for current selected log
  const selectedLog = data.logs[selectedDateString] || { brief: '', habits: {}, fieldReport: '', weather: { type: null, temp: '' } };
  const currentWeather = selectedLog.weather || { type: null, temp: '' };

  if (!isAuthenticated) return <AuthScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen font-mono flex flex-col lg:flex-row p-2 lg:p-6 gap-6 overflow-hidden max-h-screen text-ink">
      
      {/* --- LEFT PAGE (TACTICAL / GRID) --- */}
      <div className="flex-1 flex flex-col bg-white border-2 border-black shadow-neo overflow-hidden">
        {/* Header Area */}
        <header className="bg-white border-b-2 border-black p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 z-20">
          <div>
            <div className="text-xs text-muted font-bold tracking-widest uppercase">YLEISKATSAUS</div>
            <div className="flex items-center gap-4 mt-1">
               <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="text-ink hover:bg-accent border-2 border-transparent hover:border-black active:translate-y-0.5 px-2 font-bold text-xl transition-all">{"<"}</button>
               <h2 className="text-3xl font-extrabold tracking-wide uppercase text-ink">{monthLabel}</h2>
               <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="text-ink hover:bg-accent border-2 border-transparent hover:border-black active:translate-y-0.5 px-2 font-bold text-xl transition-all">{">"}</button>
            </div>
          </div>
          
          <div className="flex gap-2">
             <Button label="+ TAPA" onClick={() => setIsHabitModalOpen(true)} className="text-xs" />
             <Button variant="icon" onClick={() => setIsSettingsOpen(true)} title="Asetukset">
                <GearIcon />
             </Button>
             <Button variant="icon" onClick={handleLogout} title="Lukitse">
                <LockIcon />
             </Button>
          </div>
        </header>

        {/* The Grid */}
        <div className="flex-grow overflow-auto bg-white">
          <table className="w-full border-collapse">
            <thead className="bg-zinc-50 sticky top-0 z-20 border-b-2 border-black shadow-sm">
              <tr>
                <th className="border-r-2 border-black p-3 w-16 text-left text-xs font-bold text-muted uppercase">PVM</th>
                <th className="border-r-2 border-black p-3 text-left text-xs font-bold text-muted uppercase">PÄIVÄKIRJA / MERKINNÄT</th>
                <th className="border-r-2 border-black p-1 w-12 text-center align-bottom pb-2">
                   <div className="flex justify-center w-full">
                     <PencilIcon className="w-4 h-4 text-muted" />
                   </div>
                </th>
                {data.habits.map(h => (
                  <th key={h.id} className="border-r-2 border-black p-0 w-10 bg-zinc-100 text-ink align-bottom">
                    <div 
                      className="w-10 py-3 flex items-center justify-center text-[10px] font-bold tracking-wider uppercase"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {h.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentDays.map((day) => {
                const dayLog = data.logs[day.dateString] || { brief: '', habits: {}, fieldReport: '', weather: { type: null, temp: '' } };
                const isToday = todayString === day.dateString;
                const isSelected = selectedDateString === day.dateString;
                const dayWeather = dayLog.weather;
                const hasReport = !!dayLog.fieldReport && dayLog.fieldReport.length > 0;

                // Determine row styling
                // Selected: Black BG, White Text (Inverted)
                // Today (Not selected): Yellow BG (Accent)
                // Default: White BG, Gray text
                let rowBgClass = '';
                
                if (isSelected) {
                   rowBgClass = 'bg-zinc-100'; // Row remains light to not hide inputs
                } else if (isToday) {
                   rowBgClass = 'bg-yellow-50';
                }

                return (
                  <tr key={day.dateString} className={`group hover:bg-zinc-50 ${rowBgClass}`}>
                    {/* Date Col */}
                    <td 
                      onClick={() => setSelectedDateString(day.dateString)}
                      className={`
                        border-r-2 border-b-2 border-black p-3 font-bold text-sm cursor-pointer transition-colors
                        ${isSelected ? 'bg-black text-white' : isToday ? 'bg-accent text-black' : 'text-zinc-500 hover:text-black'}
                      `}
                    >
                      {day.dayNumber} <span className="text-xs">{day.dayName}</span>
                    </td>
                    
                    {/* Brief Log Input & Weather Display */}
                    <td className="border-r-2 border-b-2 border-black p-0">
                      <div className="flex items-center w-full h-full pr-2">
                        <input 
                          type="text" 
                          value={dayLog.brief}
                          onFocus={() => setSelectedDateString(day.dateString)}
                          onChange={(e) => updateBrief(day.dateString, e.target.value)}
                          className="flex-grow h-full p-3 bg-transparent text-ink focus:shadow-[inset_0_0_0_2px_black] focus:bg-white focus:outline-none placeholder-zinc-300 text-sm font-mono min-w-0"
                          placeholder="..."
                        />
                        {/* Inline Weather Display - Cleaned up */}
                        {(dayWeather?.type || dayWeather?.temp) && (
                           <div className="flex items-center gap-1.5 text-sm font-bold text-ink shrink-0 select-none px-2">
                             {dayWeather.type && getWeatherIcon(dayWeather.type, "w-5 h-5")}
                             {dayWeather.temp && <span>{dayWeather.temp}</span>}
                           </div>
                        )}
                      </div>
                    </td>

                    {/* Field Report Trigger - Icon & Solid Background */}
                    <td className={`border-r-2 border-b-2 border-black p-0 text-center w-12 transition-colors ${hasReport ? 'bg-black' : ''}`}>
                       <button 
                         onClick={() => {
                           setActiveModalDate(day.dateString);
                           setSelectedDateString(day.dateString);
                         }}
                         className={`w-full h-full hover:bg-black/10 transition-colors flex items-center justify-center ${hasReport ? 'text-white' : 'text-zinc-400 hover:text-black'}`}
                       >
                         <PencilIcon className="w-5 h-5" />
                       </button>
                    </td>

                    {/* Habits - Cycling Patterns */}
                    {data.habits.map((h, hIndex) => {
                       const state = dayLog.habits[h.id];
                       // Select pattern based on index
                       const activePatternClass = HABIT_PATTERNS[hIndex % HABIT_PATTERNS.length];
                       
                       return (
                         <td key={h.id} className={`border-r-2 border-b-2 border-black p-0 text-center w-10 h-10 ${state === 'done' ? activePatternClass : ''}`}>
                           <button 
                             onClick={() => toggleHabit(day.dateString, h.id)}
                             className="w-full h-full flex items-center justify-center outline-none focus:outline-none"
                           >
                              {state === 'failed' && <XIcon />}
                           </button>
                         </td>
                       );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- RIGHT PAGE (MISSION DATA / LOGS) --- */}
      <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col bg-white border-2 border-black shadow-neo h-[50vh] lg:h-auto">
        <header className="bg-zinc-50 border-b-2 border-black p-4 flex justify-between items-center shrink-0">
           <div>
             <div className="text-xs text-muted font-bold tracking-widest uppercase">TEHTÄVÄDATA: {selectedDateString}</div>
             <h2 className="text-xl font-bold text-ink tracking-wide uppercase">MUISTIOT & LOKIT</h2>
           </div>
           <div className="w-3 h-3 bg-accent border-2 border-black animate-pulse"></div>
        </header>

        {/* WEATHER SECTION - Input Context */}
        <div className="border-b-2 border-black bg-zinc-50 p-3 flex items-center gap-4">
          <div className="flex gap-1">
             {[
               { type: 'sun', Icon: SunIcon },
               { type: 'cloud', Icon: CloudIcon },
               { type: 'rain', Icon: RainIcon },
               { type: 'snow', Icon: SnowIcon },
               { type: 'storm', Icon: StormIcon }
             ].map(({ type, Icon }) => (
               <button 
                key={type}
                onClick={() => updateWeather(selectedDateString, type as WeatherType)}
                className={`p-1 border-2 ${currentWeather.type === type ? 'bg-black text-white border-black' : 'bg-white border-transparent hover:border-black text-muted hover:text-ink'} transition-all`}
               >
                 <Icon />
               </button>
             ))}
          </div>
          <div className="h-6 w-[2px] bg-zinc-300"></div>
          <div className="flex items-center gap-2 flex-grow">
            <span className="text-xs font-bold text-muted uppercase">LÄMPÖ</span>
            <input 
              type="text" 
              className="w-full bg-white border-2 border-black p-1 px-2 text-sm font-bold text-ink focus:outline-none focus:shadow-neo-sm"
              placeholder="+20°C"
              value={currentWeather.temp || ''}
              onChange={(e) => updateTemp(selectedDateString, e.target.value)}
            />
          </div>
        </div>

        <div className="flex-grow relative bg-white">
           <textarea
             className="w-full h-full bg-white text-ink p-4 font-mono text-sm resize-none focus:outline-none leading-relaxed border-none"
             value={data.projectLog}
             onChange={(e) => setData(prev => ({ ...prev, projectLog: e.target.value }))}
             spellCheck={false}
           ></textarea>
        </div>
        <div className="bg-zinc-50 text-muted text-[10px] p-2 px-4 border-t-2 border-black flex justify-between font-bold uppercase">
           <span>Rivi {data.projectLog.split('\n').length}, Merkki {data.projectLog.length}</span>
           <span>UTF-8</span>
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* Field Report Modal */}
      <Modal 
        isOpen={!!activeModalDate} 
        onClose={() => setActiveModalDate(null)} 
        title={`RAPORTTI: ${activeModalDate}`}
      >
         <div className="flex flex-col gap-2 h-[50vh]">
            <div className="text-xs font-bold text-muted mb-2 uppercase">LISÄTIEDOT / HAVAINNOT</div>
            <textarea 
              className="w-full h-full p-4 border-2 border-black bg-zinc-50 text-ink focus:bg-white focus:outline-none focus:shadow-neo transition-all resize-none font-mono text-sm"
              placeholder="Kirjoita yksityiskohtainen raportti tähän..."
              value={data.logs[activeModalDate || '']?.fieldReport || ''}
              onChange={(e) => activeModalDate && updateFieldReport(activeModalDate, e.target.value)}
              autoFocus
            />
         </div>
      </Modal>

      {/* Add Habit Modal */}
      <Modal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        title="LUO UUSI TAPA"
      >
        <div className="flex flex-col gap-4">
          <label className="text-xs font-bold uppercase text-muted">Tavan nimi (Lyhyt)</label>
          <input 
            type="text"
            className="w-full border-2 border-black p-3 font-mono text-lg uppercase text-ink focus:outline-none focus:bg-zinc-50 focus:shadow-neo transition-all"
            placeholder="ESIM. MEDITAATIO"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && addNewHabit()}
            autoFocus
          />
          <div className="flex justify-end mt-4">
            <Button label="VAHVISTA" onClick={addNewHabit} />
          </div>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="ASETUKSET"
      >
        <div className="flex flex-col gap-6">
          <div className="p-4 border-2 border-black bg-zinc-50 shadow-neo-sm">
            <h3 className="font-bold uppercase mb-2 text-ink">TAPOJEN HALLINTA</h3>
            <div className="flex flex-col gap-2">
              {data.habits.map(h => (
                <div key={h.id} className="flex justify-between items-center border-2 border-black p-2 bg-white">
                  <span className="font-bold text-sm tracking-wider">{h.name}</span>
                  <button 
                     onClick={() => deleteHabit(h.id)}
                     className="bg-black text-white px-2 py-1 text-xs font-bold hover:bg-red-600 transition-colors"
                  >
                    POISTA
                  </button>
                </div>
              ))}
              {data.habits.length === 0 && <span className="text-xs text-muted font-mono">EI AKTIIVISIA TAPOJA.</span>}
            </div>
          </div>

          <div className="p-4 border-2 border-black bg-zinc-50 shadow-neo-sm">
            <h3 className="font-bold uppercase mb-2 text-ink">TIETOJEN HALLINTA</h3>
            <p className="text-xs text-muted mb-4">Lataa varmuuskopio tai palauta tiedot JSON-tiedostosta.</p>
            
            <div className="flex flex-col gap-3">
              <Button label="LATAA VARMUUSKOPIO (EXPORT)" onClick={handleExport} className="w-full" />
              
              <div className="relative">
                <Button label="PALAUTA TIEDOT (IMPORT)" onClick={() => fileInputRef.current?.click()} variant="secondary" className="w-full" />
                <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />
              </div>
            </div>
          </div>
          
          <div className="text-[10px] text-center text-muted uppercase">
            Järjestelmä ID: PROTO_PLANNER_V1<br/>
            Local Storage Persistence Active
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default App;