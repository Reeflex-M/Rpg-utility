import { useState } from 'react';

interface EnemyCardProps {
  id: number;
  name: string;
  hp: number;
  maxHp: number;
  stunDuration: number;
  bleedDamage: number;
  onHpChange: (id: number, value: number) => void;
  onStun: (id: number, duration: number) => void;
  onRemove: (id: number) => void;
  onBleed: (id: number, damage: number) => void;
  isActive: boolean;
}

export default function EnemyCard({ ...props }: EnemyCardProps) {
  const [hpAmount, setHpAmount] = useState<number>(10);
  const [stunTurns, setStunTurns] = useState<number>(1);
  const [bleedAmount, setBleedAmount] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const isStunned = props.stunDuration > 0;

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
      ${props.hp <= 0 ? 'grayscale opacity-75 after:content-["☠️"] after:absolute after:top-1/2 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/2 after:text-8xl after:rotate-12 after:transition-opacity after:duration-300' : ''}
      ${isStunned ? 'grayscale' : ''}
      ${props.isActive ? 'border-4 border-green-500' : ''}
    `}>
      <div className="relative">
        {/* Modification de la section des états */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex justify-between items-start">
            <h2 className="text-3xl font-medievalsharp text-yellow-100 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              {props.name}
            </h2>
            <button
              onClick={() => props.onRemove(props.id)}
              className="text-red-500 hover:text-red-400 transition-colors"
              title="Supprimer l'ennemi"
            >
              ❌
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {isStunned && (
              <span className="bg-red-900/70 text-yellow-100 px-3 py-1 rounded-full 
                text-sm font-cinzel border border-red-700/50 animate-pulse shadow-lg
                whitespace-nowrap">
                ⚔️ Immobilisé ({props.stunDuration})
              </span>
            )}
            {props.bleedDamage > 0 && (
              <span className="bg-red-900/70 text-yellow-100 px-3 py-1 rounded-full 
                text-sm font-cinzel border border-red-700/50 animate-pulse shadow-lg
                whitespace-nowrap">
                🩸 Saignement ({props.bleedDamage})
              </span>
            )}
          </div>
        </div>

        <div className="mb-6 space-y-4">
          {/* Section Vitalité */}
          <div className="flex items-center justify-between">
            <span className="font-cinzel text-yellow-100/90">
              Vitalité: {props.hp}/{props.maxHp}
            </span>
          </div>

          {/* Barre de PV */}
          <div className="h-3 bg-yellow-900/30 rounded-full border-2 border-yellow-800/50 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-red-800 to-red-600 rounded-full
                transition-all duration-300 relative overflow-hidden
                before:absolute before:inset-0 before:bg-gradient-to-b 
                before:from-white/20 before:to-transparent"
              style={{ width: `${(props.hp / props.maxHp) * 100}%` }}
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
              onClick={() => props.onHpChange(props.id, -hpAmount)}
              className="w-20 px-2 py-1.5 bg-red-900/80 text-yellow-100 rounded
                border-2 border-red-800/50 hover:bg-red-800/80 
                active:bg-red-700/80 transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed font-cinzel
                shadow-lg hover:shadow-red-900/50"
            >
              -{hpAmount}
            </button>

            <button
              onClick={() => props.onHpChange(props.id, hpAmount)}
              className="w-20 px-2 py-1.5 bg-green-900/80 text-yellow-100 rounded
                border-2 border-green-800/50 hover:bg-green-800/80
                active:bg-green-700/80 transition-colors duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed font-cinzel
                shadow-lg hover:shadow-green-900/50"
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
            onClick={() => props.onStun(props.id, stunTurns)}
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

        <div className="flex items-center gap-3 mt-4">
          <input
            type="number"
            value={bleedAmount}
            onChange={(e) => setBleedAmount(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-20 px-3 py-2 bg-yellow-900/50 text-yellow-100 rounded
              border-2 border-yellow-800/50 text-center focus:ring-2
              focus:ring-yellow-600 focus:outline-none shadow-inner"
            min="1"
          />
          <button
            onClick={() => props.onBleed(props.id, bleedAmount)}
            className="flex-grow px-4 py-2 bg-red-900/80 text-yellow-100 rounded
              border-2 border-red-800/50 hover:bg-red-800/80
              active:bg-red-700/80 transition-colors duration-200
              font-cinzel shadow-lg hover:shadow-red-900/50"
          >
            🩸 Saignement
          </button>
        </div>
        <div className="mt-4">
          <label className="block text-yellow-100 font-cinzel mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 bg-yellow-900/50 text-yellow-100 rounded border-2 border-yellow-800/50 focus:ring-2 focus:ring-yellow-600 focus:outline-none shadow-inner"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}