import React from 'react';
import { Orb } from './Orb';
import { CellData } from '../types/game';

interface CellProps {
  cell: CellData;
  row: number;
  col: number;
  isValid: boolean;
  onClick: () => void;
  disabled: boolean;
  playerColor: string;
  aiColor: string;
}

export const Cell: React.FC<CellProps> = ({
  cell,
  isValid,
  onClick,
  disabled,
  playerColor,
  aiColor,
}) => {
  const isNearCritical = cell.count >= cell.criticalMass - 1 && cell.count > 0;

  const getBaseClass = () => {
    if (cell.owner === 'empty') {
      return isValid ? 'bg-slate-600/40 hover:bg-slate-500/60' : 'bg-slate-700/30';
    }
    const baseColor = cell.owner === 'player' ? playerColor : aiColor;
    return isValid ? baseColor : `${baseColor} opacity-80`;
  };
  const getHighlightColor = () =>
    isValid && !disabled
      ? 'ring-2 ring-yellow-400'
      : isNearCritical && cell.owner === 'player'
        ? 'ring-2 ring-blue-400'
        : isNearCritical && cell.owner === 'ai'
          ? 'ring-2 ring-red-400'
          : 'ring-1 ring-slate-600';

  return (
    <button
      onClick={onClick}
      disabled={disabled || !isValid}
      className={`
        relative flex items-center justify-center aspect-square rounded-xl border
        ${getBaseClass()}
        ${getHighlightColor()}
        ${isValid && !disabled ? 'cursor-pointer' : 'cursor-default opacity-75'}
        ${isNearCritical ? 'animate-pulse' : ''}
      `}
    >
      <div className="absolute bottom-1 left-1 text-[10px] font-mono text-white/40">
        {cell.criticalMass}
      </div>
      <div className="relative w-full h-full flex items-center justify-center">
        {Array.from({ length: cell.count }, (_, index) => (
          <Orb
            key={index}
            owner={cell.owner}
            index={index}
            total={cell.count}
            isNearCritical={isNearCritical}
            aiColor={aiColor}
            playerColor={playerColor}
          />
        ))}
      </div>
    </button>
  );
};
