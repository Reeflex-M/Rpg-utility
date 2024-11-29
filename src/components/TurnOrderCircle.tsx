import React from 'react';

interface TurnOrderCircleProps {
  turnOrder: Array<any>;
  currentTurnIndex: number;
}

export default function TurnOrderCircle({ turnOrder, currentTurnIndex }: TurnOrderCircleProps) {
  if (!turnOrder.length) return null;

  return (
    <div className="fixed bottom-4 right-4 w-48 h-48"> {/* Réduit la taille */}
      <div className="relative w-full h-full">
        {turnOrder.map((entity, index) => {
          const angle = (index * 360) / turnOrder.length;
          const isCurrentTurn = index === currentTurnIndex;

          return (
            <div
              key={`${entity.id}-${entity.name}`}
              className={`absolute w-12 h-12 -ml-6 -mt-6 transition-all duration-300
                ${isCurrentTurn ? 'scale-125 z-10' : 'scale-100 z-0'}`}
              style={{
                left: '50%',
                top: '50%',
                transform: `rotate(${angle}deg) translate(5rem) rotate(-${angle}deg)` // Réduit le rayon
              }}
            >
              <div
                className={`
                  relative w-full h-full rounded-full flex items-center justify-center
                  ${isCurrentTurn ? 'ring-4 ring-green-500 ring-opacity-50' : ''}
                  ${('mana' in entity)
                    ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200'
                    : 'bg-gradient-to-br from-amber-900 to-amber-950 border-2 border-yellow-900'
                  }
                  shadow-lg backdrop-blur-sm
                  group hover:scale-110 transition-transform duration-200
                `}
              >
                <span className={`text-lg ${('mana' in entity) ? 'text-amber-900' : 'text-yellow-100'}`}>
                  {('mana' in entity) ? '👤' : '👹'}
                </span>

                {/* Tooltip avec le nom */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
                  bg-black/75 text-white px-2 py-1 rounded-full text-xs font-cinzel
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  shadow-lg backdrop-blur-sm">
                  {entity.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}