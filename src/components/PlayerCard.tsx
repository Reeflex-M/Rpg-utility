import { useState } from 'react';

interface PlayerCardProps {
  id: number;
  name: string;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  stunDuration: number;
  summonDuration: number;
  bleedDamage: number;
  onHpChange: (id: number, value: number) => void;
  onManaChange: (id: number, value: number) => void;
  onStun: (id: number, duration: number) => void;
  onSummon: (id: number, duration: number) => void;
  onBleed: (id: number, damage: number) => void;
  onPlayerRemove: (id: number) => void;
  isActive: boolean;
}

export default function PlayerCard({ ...props }: PlayerCardProps) {
  const [hpAmount, setHpAmount] = useState<number>(10);
  const [manaAmount, setManaAmount] = useState<number>(10);
  const [stunTurns, setStunTurns] = useState<number>(1);
  const [summonTurns, setSummonTurns] = useState<number>(1);
  const [bleedAmount, setBleedAmount] = useState<number>(1);
  const [showManaAlert, setShowManaAlert] = useState(false);
  const [notes, setNotes] = useState<string>('');

  const isStunned = props.stunDuration > 0;

  const handleManaChange = (change: number) => {
    if (props.mana + change < 0) {
      setShowManaAlert(true);
      setTimeout(() => setShowManaAlert(false), 2000);
      return;
    }
    props.onManaChange(props.id, change);
  };

  return (
    <div className={`
      relative bg-gradient-to-b from-amber-50/95 to-amber-100/90
      p-4 rounded-lg border-4 border-amber-200/60
      shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]
      backdrop-blur-sm
      before:content-[''] before:absolute before:inset-0
      before:border-8 before:border-amber-100/20 before:rounded-lg
      before:bg-[url('/texture.png')] before:opacity-5
      transform transition-all duration-300 hover:scale-[1.02]
      ${props.hp <= 0 ? 'grayscale opacity-75 after:content-["☠️"] after:absolute after:top-1/2 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-1/2 after:text-8xl after:rotate-12 after:transition-opacity after:duration-300' : ''}
      ${isStunned ? 'grayscale' : ''}
      ${props.isActive ? 'border-4 border-green-500' : ''}
    `}>
      <div className="relative"> {/* Conteneur pour le positionnement */}
        {/* Bouton de suppression */}
        <button
          onClick={() => props.onPlayerRemove(props.id)}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center
            bg-red-500 hover:bg-red-600 active:bg-red-700
            text-white rounded-full transition-colors duration-200
            text-xl font-bold shadow-sm z-50" // Ajoutez z-50 ici
          title="Supprimer le joueur"
        >
          ×
        </button>

        {/* Reste du contenu de la carte */}
        {/* ... */}
        <div className="relative">
          {/* Modification de la section des états */}
          <div className="flex flex-col gap-2 mb-6">
            <h2 className="text-3xl font-medievalsharp text-slate-800 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
              {props.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {isStunned && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full 
                  text-sm font-cinzel border border-red-200 animate-pulse shadow-sm
                  whitespace-nowrap">
                  ⚔ Immobilisé ({props.stunDuration})
                </span>
              )}
              {props.summonDuration > 0 && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full 
                  text-sm font-cinzel border border-purple-200 animate-pulse shadow-sm
                  whitespace-nowrap">
                  🌟 Invocation ({props.summonDuration})
                </span>
              )}
              {props.bleedDamage > 0 && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full 
                  text-sm font-cinzel border border-red-200 animate-pulse shadow-sm
                  whitespace-nowrap">
                  🩸 Saignement ({props.bleedDamage})
                </span>
              )}
            </div>
          </div>

          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-cinzel text-slate-700">Vitalité: {props.hp}/{props.maxHp}</span>
              <span className="font-cinzel text-slate-700">Mana: {props.mana}/{props.maxMana}</span>
            </div>

            <div className="h-3 bg-slate-200 rounded-full border-2 border-slate-300 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full
                  transition-all duration-300 relative overflow-hidden
                  before:absolute before:inset-0 before:bg-gradient-to-b 
                  before:from-white/20 before:to-transparent"
                style={{ width: `${(props.hp / props.maxHp) * 100}%` }}
              />
            </div>

            <div className="h-3 bg-slate-200 rounded-full border-2 border-slate-300 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full
                  transition-all duration-300 relative overflow-hidden
                  before:absolute before:inset-0 before:bg-gradient-to-b 
                  before:from-white/20 before:to-transparent"
                style={{ width: `${(props.mana / props.maxMana) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={hpAmount}
              onChange={(e) => setHpAmount(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 bg-slate-100 text-slate-800 rounded 
                  border-2 border-slate-200 text-center focus:ring-2 
                  focus:ring-slate-400 focus:outline-none shadow-inner"
              min="1"
            />
            <div className="flex gap-2">
              <button
                onClick={() => props.onHpChange(props.id, -hpAmount)}
                className="w-24 px-4 py-2 bg-red-500 text-white rounded
                    border hover:bg-red-600 active:bg-red-700 
                    transition-colors duration-200 font-cinzel shadow-sm"
              >
                -{hpAmount}
              </button>
              <button
                onClick={() => props.onHpChange(props.id, hpAmount)}
                className="w-24 px-4 py-2 bg-green-500 text-white rounded
                    border hover:bg-green-600 active:bg-green-700
                    transition-colors duration-200 font-cinzel shadow-sm"
              >
                +{hpAmount}
              </button>
            </div>
          </div>

          {/* Contrôles de Mana */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={manaAmount}
              onChange={(e) => setManaAmount(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 bg-slate-100 text-slate-800 rounded 
                    border-2 border-slate-200 text-center focus:ring-2 
                    focus:ring-slate-400 focus:outline-none shadow-inner"
              min="1"
            />
            <div className="flex gap-2 relative">
              <button
                onClick={() => handleManaChange(-manaAmount)}
                className="w-24 px-4 py-2 bg-blue-500 text-white rounded
                      border hover:bg-blue-600 active:bg-blue-700 
                      transition-colors duration-200 font-cinzel shadow-sm"
                disabled={isStunned}
              >
                -{manaAmount}
              </button>
              <button
                onClick={() => handleManaChange(manaAmount)}
                className="w-24 px-4 py-2 bg-blue-500 text-white rounded
                      border hover:bg-blue-600 active:bg-blue-700
                      transition-colors duration-200 font-cinzel shadow-sm"
                disabled={isStunned}
              >
                +{manaAmount}
              </button>

              {/* Alerte mana */}
              {showManaAlert && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 
                      bg-red-100/90 backdrop-blur-sm text-red-800 px-6 py-2 rounded-lg
                      border-2 border-red-200 font-cinzel text-sm whitespace-nowrap
                      animate-[fadeInOut_2s_ease-in-out] shadow-lg z-10
                      before:content-[''] before:absolute before:left-1/2 before:-bottom-2
                      before:w-4 before:h-4 before:bg-red-100/90 before:rotate-45
                      before:-translate-x-1/2 before:border-b-2 before:border-r-2
                      before:border-red-200">
                  ⚡ Mana Insuffisant!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={stunTurns}
            onChange={(e) => setStunTurns(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 bg-slate-100 text-slate-800 rounded
                  border-2 border-slate-200 text-center focus:ring-2
                  focus:ring-slate-400 focus:outline-none shadow-inner"
            min="1"
          />
          <button
            onClick={() => props.onStun(props.id, stunTurns)}
            className="px-4 py-2 bg-slate-500 text-white rounded
                  border hover:bg-slate-600 active:bg-slate-700
                  transition-colors duration-200 font-cinzel shadow-sm"
            disabled={isStunned}
          >
            🗡️ Immobiliser
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={summonTurns}
            onChange={(e) => setSummonTurns(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 bg-slate-100 text-slate-800 rounded
                  border-2 border-slate-200 text-center focus:ring-2
                  focus:ring-slate-400 focus:outline-none shadow-inner"
            min="1"
          />
          <button
            onClick={() => props.onSummon(props.id, summonTurns)}
            className="px-4 py-2 bg-purple-500 text-white rounded
                  border hover:bg-purple-600 active:bg-purple-700
                  transition-colors duration-200 font-cinzel shadow-sm"
            disabled={isStunned || props.mana < 20}
          >
            🌟 Invoquer
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={bleedAmount}
            onChange={(e) => setBleedAmount(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 bg-slate-100 text-slate-800 rounded
                  border-2 border-slate-200 text-center focus:ring-2
                  focus:ring-slate-400 focus:outline-none shadow-inner"
            min="1"
          />
          <button
            onClick={() => props.onBleed(props.id, bleedAmount)}
            className="px-4 py-2 bg-red-500 text-white rounded
                  border hover:bg-red-600 active:bg-red-700
                  transition-colors duration-200 font-cinzel shadow-sm"
          >
            🩸 Saignement
          </button>
        </div>

        <div className="mt-4">
          <label className="block text-slate-700 font-cinzel mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 bg-slate-100 text-slate-800 rounded border-2 border-slate-200 focus:ring-2 focus:ring-slate-400 focus:outline-none shadow-inner"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}