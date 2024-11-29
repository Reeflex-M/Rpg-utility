import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import PlayerCard from './components/PlayerCard';
import EnemyCard from './components/EnemyCard';
import TurnOrderCircle from './components/TurnOrderCircle';

interface Player {
  id: number;
  name: string;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  stunDuration: number;
  summonDuration: number;
  bleedDamage: number;
}

interface Enemy {
  id: number;
  name: string;
  hp: number;
  maxHp: number;
  stunDuration: number;
  bleedDamage: number;
}

const initialPlayers: Player[] = [
  { id: 1, name: 'Aragorn', hp: 75, maxHp: 75, mana: 60, maxMana: 60, stunDuration: 0, summonDuration: 0, bleedDamage: 0 },
  { id: 2, name: 'Legolas', hp: 75, maxHp: 75, mana: 60, maxMana: 60, stunDuration: 0, summonDuration: 0, bleedDamage: 0 },
  { id: 3, name: 'Gimli', hp: 75, maxHp: 75, mana: 60, maxMana: 60, stunDuration: 0, summonDuration: 0, bleedDamage: 0 },
  { id: 4, name: 'Gandalf', hp: 75, maxHp: 75, mana: 60, maxMana: 60, stunDuration: 0, summonDuration: 0, bleedDamage: 0 },
  { id: 5, name: 'Vor', hp: 75, maxHp: 75, mana: 60, maxMana: 60, stunDuration: 0, summonDuration: 0, bleedDamage: 0 }
];

const initialEnemies: Enemy[] = [
  { id: 1, name: 'Dragon', hp: 200, maxHp: 200, stunDuration: 0, bleedDamage: 0 },
  { id: 2, name: 'Gobelin', hp: 50, maxHp: 50, stunDuration: 0, bleedDamage: 0 },
  { id: 3, name: 'Troll', hp: 150, maxHp: 150, stunDuration: 0, bleedDamage: 0 },
  { id: 4, name: 'Sorcier Noir', hp: 80, maxHp: 80, stunDuration: 0, bleedDamage: 0 },
];

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

import { DropResult } from '@hello-pangea/dnd';

type DragEndResult = DropResult;

export default function App() {
  const [players, setPlayers] = useState<Player[]>(() => {
    const savedPlayers = localStorage.getItem('players');
    return savedPlayers ? JSON.parse(savedPlayers) : initialPlayers;
  });
  const [enemies, setEnemies] = useState<Enemy[]>(() => {
    const savedEnemies = localStorage.getItem('enemies');
    return savedEnemies ? JSON.parse(savedEnemies) : initialEnemies;
  });
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    hp: 75,
    maxHp: 75,
    mana: 60,
    maxMana: 60
  });
  const [showAddEnemy, setShowAddEnemy] = useState(false);
  const [newEnemy, setNewEnemy] = useState({
    name: '',
    maxHp: 50
  });

  const [turnOrder, setTurnOrder] = useState<(Player | Enemy)[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentPlayerName, setCurrentPlayerName] = useState<string>('');
  const [currentRound, setCurrentRound] = useState<number>(1);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [manualOrder, setManualOrder] = useState<(Player | Enemy)[]>([]);
  const [isManualOrder, setIsManualOrder] = useState(false);

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('enemies', JSON.stringify(enemies));
  }, [enemies]);

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

  const handleBleed = (id: number, damage: number, isEnemy: boolean) => {
    if (isEnemy) {
      setEnemies(enemies.map(enemy => {
        if (enemy.id === id) {
          return { ...enemy, bleedDamage: Math.max(0, (enemy.bleedDamage || 0) + damage) };
        }
        return enemy;
      }));
    } else {
      setPlayers(players.map(player => {
        if (player.id === id) {
          return { ...player, bleedDamage: Math.max(0, (player.bleedDamage || 0) + damage) };
        }
        return player;
      }));
    }
  };

  const handleNextPlayer = () => {
    const nextIndex = (currentTurnIndex + 1) % turnOrder.length;

    // Si on revient au premier joueur
    if (nextIndex === 0) {
      // Appliquer les effets de fin de tour
      setPlayers(players.map(player => ({
        ...player,
        hp: Math.max(0, player.hp - (player.bleedDamage || 0)),
        stunDuration: Math.max(0, player.stunDuration - 1),
        summonDuration: Math.max(0, player.summonDuration - 1)
      })));

      setEnemies(enemies.map(enemy => ({
        ...enemy,
        hp: Math.max(0, enemy.hp - (enemy.bleedDamage || 0)),
        stunDuration: Math.max(0, enemy.stunDuration - 1)
      })));

      // Incrémenter le tour directement
      setCurrentRound(currentRound + 1);
    }

    // Mettre à jour le nom du joueur actuel et l'index
    setCurrentPlayerName(turnOrder[nextIndex].name);
    setCurrentTurnIndex(nextIndex);
  };

  const handleReset = () => {
    setPlayers(initialPlayers);
    setEnemies(initialEnemies);
    setCurrentRound(1);
    setGameStarted(false);
    setCurrentPlayerName('');
    setCurrentTurnIndex(0);
    setIsManualOrder(false); // Réinitialiser l'indicateur d'ordre manuel
    setManualOrder([]); // Réinitialiser l'ordre manuel
  };

  const startGame = () => {
    if (!isManualOrder) {
      // Si on n'utilise pas l'ordre manuel, on mélange aléatoirement
      const combined = [...players, ...enemies];
      const gameOrder = shuffleArray(combined);
      setTurnOrder(gameOrder);
      setCurrentPlayerName(gameOrder[0].name);
    } else {
      // Si on utilise l'ordre manuel, on utilise directement manualOrder
      setTurnOrder(manualOrder);
      setCurrentPlayerName(manualOrder[0].name);
    }
    setGameStarted(true);
    setCurrentTurnIndex(0);
  };


  const onDragEnd = (result: DragEndResult) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      manualOrder,
      result.source.index,
      result.destination.index
    );

    setManualOrder(items);
  };

  const openOrderModal = () => {
    setManualOrder([...players, ...enemies]);
    setShowOrderModal(true);
  };

  const handleAddPlayer = () => {
    if (newPlayer.name.trim()) {
      const playerToAdd: Player = {
        id: players.length + 1,
        ...newPlayer,
        stunDuration: 0,
        summonDuration: 0,
        bleedDamage: 0
      };
      setPlayers([...players, playerToAdd]);
      setNewPlayer({
        name: '',
        hp: 75,
        maxHp: 75,
        mana: 60,
        maxMana: 60
      });
      setShowAddPlayer(false);
    }
  };

  const handlePlayerRemove = (id: number) => {
    setPlayers(players.filter(player => player.id !== id));
  };

  const handleAddEnemy = () => {
    if (newEnemy.name.trim()) {
      const enemyToAdd: Enemy = {
        id: enemies.length + 1,
        name: newEnemy.name,
        hp: newEnemy.maxHp,
        maxHp: newEnemy.maxHp,
        stunDuration: 0,
        bleedDamage: 0
      };
      setEnemies([...enemies, enemyToAdd]);
      setNewEnemy({
        name: '',
        maxHp: 50
      });
      setShowAddEnemy(false);
    }
  };

  const handleEnemyRemove = (id: number) => {
    setEnemies(enemies.filter(enemy => enemy.id !== id));
  };

  const getOrderedCards = () => {
    if (!gameStarted || turnOrder.length === 0) {
      return {
        players: players,
        enemies: enemies
      };
    }

    const orderedPlayers = turnOrder
      .filter(entity => 'mana' in entity) // Filtre pour les joueurs
      .map(player => players.find(p => p.id === player.id))
      .filter(Boolean) as Player[];

    const orderedEnemies = turnOrder
      .filter(entity => !('mana' in entity)) // Filtre pour les ennemis
      .map(enemy => enemies.find(e => e.id === enemy.id))
      .filter(Boolean) as Enemy[];

    return {
      players: orderedPlayers,
      enemies: orderedEnemies
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900/90 to-amber-950/95 flex">
      {/* Navbar latérale améliorée */}
      <div className="w-72 h-screen bg-gradient-to-b from-amber-900/80 to-amber-950/90 
        border-r-4 border-yellow-900/60 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]
        p-6 flex flex-col fixed left-0 top-0 z-20">
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-medievalsharp text-yellow-100 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]
            bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
            Gestionnaire RPG
          </h1>
          <div className="bg-gradient-to-r from-amber-950/50 to-amber-900/50 p-4 rounded-lg border border-yellow-900/30">
            <p className="text-xl text-yellow-100/90 font-cinzel">
              Tour {currentRound}
            </p>
            {gameStarted && (
              <>
                <p className="text-lg text-yellow-100/90 mt-2 font-cinzel">
                  Tour de: <span className="text-yellow-400">{currentPlayerName}</span>
                </p>
                {/* Nouvelle section pour l'ordre de jeu */}
                <div className="mt-4 pt-4 border-t border-yellow-900/30">
                  <p className="text-sm text-yellow-100/70 mb-2 font-cinzel">Ordre de jeu:</p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
                    {turnOrder.map((entity, index) => (
                      <div
                        key={`${entity.id}-${entity.name}-order`}
                        className={`
                          flex items-center gap-2 px-3 py-1.5 rounded
                          ${index === currentTurnIndex ? 'bg-yellow-900/50' : 'bg-yellow-900/20'}
                          ${('mana' in entity) ? 'text-amber-100' : 'text-yellow-200'}
                          transition-colors duration-200
                        `}
                      >
                        <span className="text-sm">{index + 1}.</span>
                        <span className="text-xs">
                          {('mana' in entity) ? '👤' : '👹'}
                        </span>
                        <span className="text-sm font-cinzel truncate">
                          {entity.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Reste des boutons avec style amélioré */}
        <div className="flex flex-col gap-4">
          {!gameStarted ? (
            <>
              <button
                onClick={openOrderModal}
                className="w-full px-4 py-3 bg-yellow-900/80 text-yellow-100 rounded
                  border-2 border-yellow-800/50 hover:bg-yellow-800/80
                  active:bg-yellow-700/80 transition-colors duration-200
                  font-cinzel shadow-lg hover:shadow-yellow-900/50"
              >
                📋 Configurer l'ordre de jeu
              </button>
              <button
                onClick={startGame}
                className="w-full px-4 py-3 bg-green-900/80 text-yellow-100 rounded
                  border-2 border-green-800/50 hover:bg-green-800/80
                  active:bg-green-700/80 transition-colors duration-200
                  font-cinzel shadow-lg hover:shadow-green-900/50"
              >
                🎲 {isManualOrder ? 'Commencer avec ordre personnalisé' : 'Commencer avec ordre aléatoire'}
              </button>
            </>
          ) : (
            <button
              onClick={handleNextPlayer}
              className="w-full px-4 py-3 bg-blue-900/80 text-yellow-100 rounded
                border-2 border-blue-800/50 hover:bg-blue-800/80
                active:bg-blue-700/80 transition-colors duration-200
                font-cinzel shadow-lg hover:shadow-blue-900/50"
            >
              👤 Prochain joueur
            </button>
          )}
          <button
            onClick={handleReset}
            className="w-full px-4 py-3 bg-red-900/80 text-yellow-100 rounded
              border-2 border-red-800/50 hover:bg-red-800/80
              active:bg-red-700/80 transition-colors duration-200
              font-cinzel shadow-lg hover:shadow-red-900/50"
          >
            🔄 Réinitialiser
          </button>
          <button
            onClick={() => setShowAddPlayer(true)}
            className="w-full px-4 py-3 bg-green-900/80 text-yellow-100 rounded
              border-2 border-green-800/50 hover:bg-green-800/80
              active:bg-green-700/80 transition-colors duration-200
              font-cinzel shadow-lg hover:shadow-green-900/50"
          >
            👥 Nouveau Joueur
          </button>
          <button
            onClick={() => setShowAddEnemy(true)}
            className="w-full px-4 py-3 bg-red-900/80 text-yellow-100 rounded
              border-2 border-red-800/50 hover:bg-red-800/80
              active:bg-red-700/80 transition-colors duration-200
              font-cinzel shadow-lg hover:shadow-red-900/50"
          >
            👹 Nouvel Ennemi
          </button>
        </div>
      </div>

      {/* Contenu principal avec padding ajusté */}
      <div className="ml-72 flex-1 p-6">
        <div className="max-w-[1800px] mx-auto space-y-6">
          {/* Section Ennemis */}
          <div>
            <h2 className="text-2xl font-medievalsharp text-yellow-100 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mb-2">
              Ennemis
            </h2>
            <div className="grid grid-cols-5 gap-2">
              {getOrderedCards().enemies.map(enemy => (
                <div key={enemy.id} className={`
                  transform-gpu transition-all duration-300
                  ${gameStarted && turnOrder[currentTurnIndex]?.id === enemy.id && !('mana' in turnOrder[currentTurnIndex])
                    ? 'animate-pulse shadow-[0_0_15px_5px_rgba(34,197,94,0.3)]'
                    : ''}`}
                >
                  <EnemyCard
                    {...enemy}
                    isActive={gameStarted && turnOrder[currentTurnIndex]?.id === enemy.id && !('mana' in turnOrder[currentTurnIndex])}
                    onHpChange={handleEnemyHpChange}
                    onStun={handleEnemyStun}
                    onRemove={handleEnemyRemove}
                    onBleed={(id, damage) => handleBleed(id, damage, true)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section Joueurs */}
          <div>
            <h2 className="text-2xl font-medievalsharp text-yellow-100 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mb-2">
              Joueurs
            </h2>
            <div className="grid grid-cols-5 gap-2">
              {getOrderedCards().players.map(player => (
                <div key={player.id} className={`
                  transform-gpu transition-all duration-300
                  ${gameStarted && turnOrder[currentTurnIndex]?.id === player.id && 'mana' in turnOrder[currentTurnIndex]
                    ? 'animate-pulse shadow-[0_0_15px_5px_rgba(34,197,94,0.3)]'
                    : ''}`}
                >
                  <PlayerCard
                    {...player}
                    isActive={gameStarted && turnOrder[currentTurnIndex]?.id === player.id && 'mana' in turnOrder[currentTurnIndex]}
                    onHpChange={handlePlayerHpChange}
                    onManaChange={handleManaChange}
                    onStun={handlePlayerStun}
                    onSummon={handleSummon}
                    onPlayerRemove={handlePlayerRemove}
                    onBleed={(id, damage) => handleBleed(id, damage, false)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ajout du cercle des tours */}
      {gameStarted && (
        <TurnOrderCircle
          turnOrder={turnOrder}
          currentTurnIndex={currentTurnIndex}
        />
      )}

      {/* ...existing modals code... */}
      {showAddPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-amber-50/95 to-amber-100/90 p-6 rounded-lg border-4 border-amber-200/60 shadow-lg w-96">
            <h2 className="text-2xl font-medievalsharp text-slate-800 mb-4">Créer un Personnage</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-cinzel mb-1">Nom</label>
                <input
                  type="text"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 text-slate-800 rounded 
                    border-2 border-slate-200 focus:ring-2 
                    focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-cinzel mb-1">Points de Vie Max</label>
                <input
                  type="number"
                  value={newPlayer.maxHp}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setNewPlayer({
                      ...newPlayer,
                      maxHp: value,
                      hp: value
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-100 text-slate-800 rounded 
                    border-2 border-slate-200 focus:ring-2 
                    focus:ring-amber-400 focus:outline-none"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-cinzel mb-1">Mana Max</label>
                <input
                  type="number"
                  value={newPlayer.maxMana}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setNewPlayer({
                      ...newPlayer,
                      maxMana: value,
                      mana: value
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-100 text-slate-800 rounded 
                    border-2 border-slate-200 focus:ring-2 
                    focus:ring-amber-400 focus:outline-none"
                  min="0"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddPlayer(false)}
                className="px-4 py-2 bg-slate-500 text-white rounded
                  hover:bg-slate-600 active:bg-slate-700
                  transition-colors duration-200 font-cinzel"
              >
                Annuler
              </button>
              <button
                onClick={handleAddPlayer}
                className="px-4 py-2 bg-green-500 text-white rounded
                  hover:bg-green-600 active:bg-green-700
                  transition-colors duration-200 font-cinzel"
                disabled={!newPlayer.name.trim()}
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddEnemy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-amber-50/95 to-amber-100/90 p-6 rounded-lg border-4 border-amber-200/60 shadow-lg w-96">
            <h2 className="text-2xl font-medievalsharp text-slate-800 mb-4">Créer un Ennemi</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-cinzel mb-1">Nom</label>
                <input
                  type="text"
                  value={newEnemy.name}
                  onChange={(e) => setNewEnemy({ ...newEnemy, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 text-slate-800 rounded 
                    border-2 border-slate-200 focus:ring-2 
                    focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-cinzel mb-1">Points de Vie Max</label>
                <input
                  type="number"
                  value={newEnemy.maxHp}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setNewEnemy({
                      ...newEnemy,
                      maxHp: value
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-100 text-slate-800 rounded 
                    border-2 border-slate-200 focus:ring-2 
                    focus:ring-amber-400 focus:outline-none"
                  min="1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddEnemy(false)}
                className="px-4 py-2 bg-slate-500 text-white rounded
                  hover:bg-slate-600 active:bg-slate-700
                  transition-colors duration-200 font-cinzel"
              >
                Annuler
              </button>
              <button
                onClick={handleAddEnemy}
                className="px-4 py-2 bg-green-500 text-white rounded
                  hover:bg-green-600 active:bg-green-700
                  transition-colors duration-200 font-cinzel"
                disabled={!newEnemy.name.trim()}
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-amber-50/95 to-amber-100/90 p-6 rounded-lg 
              border-4 border-amber-200/60 shadow-lg w-[600px]">
            <h2 className="text-2xl font-medievalsharp text-slate-800 mb-4">
              Configurer l'ordre de jeu
            </h2>

            <div className="mb-4 text-sm text-slate-600">
              Glissez et déposez les éléments pour réorganiser l'ordre de jeu
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable-list" type="TURN_ORDER">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2 max-h-[50vh] overflow-y-auto bg-white/50 rounded-lg p-2"
                  >
                    {manualOrder.map((entity, index) => {
                      const id = `${entity.id}-${('mana' in entity ? 'player' : 'enemy')}`;
                      return (
                        <Draggable key={id} draggableId={id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`
                                flex items-center gap-2 p-3 rounded-lg select-none
                                ${snapshot.isDragging ? 'bg-amber-100 shadow-lg' : 'bg-white'}
                                border-2 border-amber-200/60
                                transform transition-transform duration-200
                                cursor-grab active:cursor-grabbing
                              `}
                            >
                              <span className="text-amber-800">☰</span>
                              <span className="font-medievalsharp text-lg">
                                {index + 1}.
                              </span>
                              <span className="flex-grow font-cinzel">
                                {entity.name}
                              </span>
                              {'mana' in entity ? (
                                <span className="text-blue-600">👤</span>
                              ) : (
                                <span className="text-red-600">👹</span>
                              )}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowOrderModal(false);
                  setIsManualOrder(false);
                }}
                className="px-4 py-2 bg-slate-500 text-white rounded
                  hover:bg-slate-600 active:bg-slate-700
                  transition-colors duration-200 font-cinzel"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setShowOrderModal(false);
                  setIsManualOrder(true);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded
                  hover:bg-green-600 active:bg-green-700
                  transition-colors duration-200 font-cinzel"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}