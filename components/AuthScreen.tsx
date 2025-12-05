import React, { useState } from 'react';
import { Button } from './Button';

interface AuthScreenProps {
  onLogin: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === 'crimescene') {
      onLogin();
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-2 border-black shadow-neo p-8 relative">
        {/* Corner Decorations */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-black"></div>
        <div className="absolute top-2 right-2 w-2 h-2 bg-black"></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-black"></div>
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-black"></div>

        <h1 className="text-6xl font-display mb-2 tracking-widest uppercase text-center text-ink">
          PROTO PLANNER
        </h1>
        <div className="h-2 w-full bg-accent border-y-2 border-black mb-6"></div>
        
        <p className="font-mono text-sm mb-6 text-muted text-center uppercase font-bold">
          Järjestelmän käyttö vaatii tunnistautumisen.<br/>
          Syötä salasana jatkaaksesi.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <label className="block font-bold text-xs mb-1 uppercase text-muted">Salasana</label>
            <input
              type="password"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(false);
              }}
              className="w-full bg-zinc-50 text-ink border-2 border-black p-3 font-mono focus:outline-none focus:bg-white focus:shadow-neo transition-all placeholder-zinc-400"
              placeholder="..."
              autoFocus
            />
            {error && (
              <div className="absolute top-full left-0 mt-2 w-full bg-black text-white p-2 text-xs font-bold border-2 border-red-500">
                [!] PÄÄSY EVÄTTY. VIRHEELLINEN SALASANA.
              </div>
            )}
          </div>

          <Button type="submit" label="KIRJAUDU" className="w-full mt-4 bg-accent text-ink" />
        </form>

        <div className="mt-8 text-[10px] text-muted font-mono text-center border-t-2 border-dashed border-zinc-300 pt-4">
          VERSIO: 1.0.0 // ALUE: FI-HELSINKI
        </div>
      </div>
    </div>
  );
};