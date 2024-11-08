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
  onHpChange: (id: number, value: number) => void;
  onManaChange: (id: number, value: number) => void;
  onStun: (id: number, duration: number) => void;
  onSummon: (id: number, duration: number) => void;
}

export default function PlayerCard({
  id,
  name,
  hp,
  maxHp,
  mana,
  maxMana,
  stunDuration,
  summonDuration,
  onHpChange,
  onManaChange,
  onStun,
  onSummon
}: PlayerCardProps) {
  const [hpAmount, setHpAmount] = useState<number>(10);
  const [manaAmount, setManaAmount] = useState<number>(10);
  const [stunTurns, setStunTurns] = useState<number>(1);
  const [summonTurns, setSummonTurns] = useState<number>(1);

  const isStunned = stunDuration > 0;
  const hasSummon = summonDuration > 0;

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${isStunned ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-bold">{name}</h2>
        <div className="flex flex-col gap-2">
          {isStunned && (
            <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-sm">
              Immobilisé ({stunDuration} tours)
            </span>
          )}
          {hasSummon && (
            <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-sm">
              Invocation active ({summonDuration} tours)
            </span>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">PV: {hp}/{maxHp}</span>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={hpAmount}
              onChange={(e) => setHpAmount(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-16 px-2 py-1 border rounded text-center"
              min="1"
            />
            <button 
              onClick={() => onHpChange(id, -hpAmount)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              disabled={isStunned}
            >
              -{hpAmount}
            </button>
            <button 
              onClick={() => onHpChange(id, hpAmount)}
              className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={isStunned}
            >
              +{hpAmount}
            </button>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-red-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(hp / maxHp) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Mana: {mana}/{maxMana}</span>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={manaAmount}
              onChange={(e) => setManaAmount(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-16 px-2 py-1 border rounded text-center"
              min="1"
            />
            <button 
              onClick={() => onManaChange(id, -manaAmount)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              disabled={isStunned}
            >
              -{manaAmount}
            </button>
            <button 
              onClick={() => onManaChange(id, manaAmount)}
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={isStunned}
            >
              +{manaAmount}
            </button>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(mana / maxMana) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={stunTurns}
            onChange={(e) => setStunTurns(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-16 px-2 py-1 border rounded text-center"
            min="1"
          />
          <button 
            onClick={() => onStun(id, stunTurns)}
            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex-grow"
            disabled={isStunned}
          >
            Immobiliser
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={summonTurns}
            onChange={(e) => setSummonTurns(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-16 px-2 py-1 border rounded text-center"
            min="1"
          />
          <button 
            onClick={() => onSummon(id, summonTurns)}
            className="px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 flex-grow"
            disabled={hasSummon || isStunned}
          >
            Invoquer
          </button>
        </div>
      </div>
    </div>
  );
}