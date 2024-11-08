import { useState } from 'react';
import PlayerCard from './components/PlayerCard';
import EnemyCard from './components/EnemyCard';

interface Player {
  id: number;
  name: string;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  stunDuration: number;
  summonDuration: number;
}

interface Enemy {
  id: number;
  name: string;
  hp: number;
  maxHp: number;
  stunDuration: number;
}

const initialPlayers: Player[] = [
  { id: 1, name: 'Guerrier', hp: 100, maxHp: 100, mana: 50, maxMana: 50, stunDuration: 0, summonDuration: 0 },
  { id: 2, name: 'Mage', hp: 70, maxHp: 70, mana: 100, maxMana: 100, stunDuration: 0, summonDuration: 0 },
  { id: 3, name: 'Prêtre', hp: 80, maxHp: 80, mana: 80, maxMana: 80, stunDuration: 0, summonDuration: 0 },
  { id: 4, name: 'Voleur', hp: 75, maxHp: 75, mana: 60, maxMana: 60, stunDuration: 0, summonDuration: 0 },
  { id: 5, name: 'Druide', hp: 85, maxHp: 85, mana: 70, maxMana: 70, stunDuration: 0, summonDuration: 0 },
];

const initialEnemies: Enemy[] = [
  { id: 1, name: 'Dragon', hp: 200, maxHp: 200, stunDuration: 0 },
  { id: 2, name: 'Gobelin', hp: 50, maxHp: 50, stunDuration: 0 },
  { id: 3, name: 'Troll', hp: 150, maxHp: 150, stunDuration: 0 },
  { id: 4, name: 'Sorcier Noir', hp: 80, maxHp: 80, stunDuration: 0 },
];

function App() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [enemies, setEnemies] = useState<Enemy[]>(initialEnemies);
  const [currentTurn, setCurrentTurn] = useState<number>(1);

  const handlePlayerHpChange = (playerId: number, change: number) => {
    setPlayers(players.map(player => {
      if (player.id === playerId) {
        const newHp = Math.min(Math.max(0, player.hp + change), player.maxHp);
        return { ...player, hp: newHp };
      }
      return player;
    }));
  };

  const handleEnemyHpChange = (enemyId: number, change: number) => {
    setEnemies(enemies.map(enemy => {
      if (enemy.id === enemyId) {
        const newHp = Math.min(Math.max(0, enemy.hp + change), enemy.maxHp);
        return { ...enemy, hp: newHp };
      }
      return enemy;
    }));
  };

  const handleManaChange = (playerId: number, change: number) => {
    setPlayers(players.map(player => {
      if (player.id === playerId) {
        const newMana = Math.min(Math.max(0, player.mana + change), player.maxMana);
        return { ...player, mana: newMana };
      }
      return player;
    }));
  };

  const handlePlayerStun = (playerId: number, duration: number) => {
    setPlayers(players.map(player => {
      if (player.id === playerId) {
        return { ...player, stunDuration: Math.max(0, player.stunDuration + duration) };
      }
      return player;
    }));
  };

  const handleEnemyStun = (enemyId: number, duration: number) => {
    setEnemies(enemies.map(enemy => {
      if (enemy.id === enemyId) {
        return { ...enemy, stunDuration: Math.max(0, enemy.stunDuration + duration) };
      }
      return enemy;
    }));
  };

  const handleSummon = (playerId: number, duration: number) => {
    setPlayers(players.map(player => {
      if (player.id === playerId) {
        return { ...player, summonDuration: Math.max(0, player.summonDuration + duration) };
      }
      return player;
    }));
  };

  const handleNextTurn = () => {
    setCurrentTurn(prev => prev + 1);
    setPlayers(players.map(player => ({
      ...player,
      stunDuration: Math.max(0, player.stunDuration - 1),
      summonDuration: Math.max(0, player.summonDuration - 1)
    })));
    setEnemies(enemies.map(enemy => ({
      ...enemy,
      stunDuration: Math.max(0, enemy.stunDuration - 1)
    })));
  };

  const handleReset = () => {
    setPlayers(initialPlayers);
    setEnemies(initialEnemies);
    setCurrentTurn(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestionnaire RPG</h1>
            <p className="text-lg text-gray-600 mt-2">Tour actuel: {currentTurn}</p>
          </div>
          <div className="space-x-4">
            <button
              onClick={handleNextTurn}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tour suivant
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ennemis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {enemies.map(enemy => (
              <EnemyCard
                key={enemy.id}
                {...enemy}
                onHpChange={handleEnemyHpChange}
                onStun={handleEnemyStun}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Joueurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map(player => (
              <PlayerCard
                key={player.id}
                {...player}
                onHpChange={handlePlayerHpChange}
                onManaChange={handleManaChange}
                onStun={handlePlayerStun}
                onSummon={handleSummon}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;