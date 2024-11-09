import { useState } from 'react';

interface EnemyCardProps {
  id: number;
  name: string;
  hp: number;
  maxHp: number;
  stunDuration: number;
  onHpChange: (id: number, value: number) => void;
  onStun: (id: number, duration: number) => void;
  onRemove: (id: number) => void;
}

export default function EnemyCard({
  id,
  name,
  hp,
  maxHp,
  stunDuration,
  onHpChange,
  onStun,
  onRemove
}: EnemyCardProps) {
  const [hpAmount, setHpAmount] = useState<number>(10);
  const [stunTurns, setStunTurns] = useState<number>(1);
  const isStunned = stunDuration > 0;

  return (
    <div className={`
      relative bg-gradient-to-b from-amber-900/80 to-amber-950/90
      p-8 rounded-lg border-4 border-yellow-900/60
      shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]
      backdrop-blur-sm
      before:content-[''] before:absolute before:inset-0
      before:border-8 before:border-yellow-700/20 before:rounded-lg
      before:bg-[url('/texture.png')] before:opacity-10
      transform transition-all duration-300 hover:scale-[1.02]
      ${hp <= 0 ? 'grayscale opacity-75 after:content-["☠️"] after:absolute after:top-1/2 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/2 after:text-8xl after:rotate-12 after:transition-opacity after:duration-300' : ''}
      ${isStunned ? 'grayscale' : ''}
    `}>
      <div className="relative">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-medievalsharp text-yellow-100 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            {name}
          </h2>
          <button
            onClick={() => onRemove(id)}
            className="text-red-500 hover:text-red-400 transition-colors"
            title="Supprimer l'ennemi"
          >
            ❌
          </button>
          {isStunned && (
            <span className="bg-red-900/70 text-yellow-100 px-4 py-1 rounded-full 
              text-sm font-cinzel border border-red-700/50 animate-pulse shadow-lg">
              ⚔️ Immobilisé ({stunDuration})
            </span>
          )}
        </div>

        <div className="mb-6 space-y-4">
          {/* Section Vitalité */}
          <div className="flex items-center justify-between">
            <span className="font-cinzel text-yellow-100/90">
              Vitalité: {hp}/{maxHp}
            </span>
          </div>

          {/* Barre de PV */}
          <div className="h-3 bg-yellow-900/30 rounded-full border-2 border-yellow-800/50 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-red-800 to-red-600 rounded-full
                transition-all duration-300 relative overflow-hidden
                before:absolute before:inset-0 before:bg-gradient-to-b 
                before:from-white/20 before:to-transparent"
              style={{ width: `${(hp / maxHp) * 100}%` }}
            />
          </div>

          {/* Contrôles de PV */}
          <div className="flex items-center justify-center gap-4">
            <input
              type="number"
              value={hpAmount}
              onChange={(e) => setHpAmount(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-16 px-2 py-1.5 bg-yellow-900/50 text-yellow-100 rounded 
                border-2 border-yellow-800/50 text-center focus:ring-2 
                focus:ring-yellow-600 focus:outline-none shadow-inner"
              min="1"
            />
            
            <button 
              onClick={() => onHpChange(id, -hpAmount)}
              className="w-20 px-2 py-1.5 bg-red-900/80 text-yellow-100 rounded
                border-2 border-red-800/50 hover:bg-red-800/80 
                active:bg-red-700/80 transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed font-cinzel
                shadow-lg hover:shadow-red-900/50"
              disabled={isStunned}
            >
              -{hpAmount}
            </button>
            
            <button 
              onClick={() => onHpChange(id, hpAmount)}
              className="w-20 px-2 py-1.5 bg-green-900/80 text-yellow-100 rounded
                border-2 border-green-800/50 hover:bg-green-800/80
                active:bg-green-700/80 transition-colors duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed font-cinzel
                shadow-lg hover:shadow-green-900/50"
              disabled={isStunned}
            >
              +{hpAmount}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="number"
            value={stunTurns}
            onChange={(e) => setStunTurns(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-20 px-3 py-2 bg-yellow-900/50 text-yellow-100 rounded
              border-2 border-yellow-800/50 text-center focus:ring-2
              focus:ring-yellow-600 focus:outline-none shadow-inner"
            min="1"
          />
          <button 
            onClick={() => onStun(id, stunTurns)}
            className="flex-grow px-4 py-2 bg-purple-900/80 text-yellow-100 rounded
              border-2 border-purple-800/50 hover:bg-purple-800/80
              active:bg-purple-700/80 transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed font-cinzel
              shadow-lg hover:shadow-purple-900/50"
            disabled={isStunned}
          >
            🗡️ Immobiliser
          </button>
        </div>
      </div>
    </div>
  );
}