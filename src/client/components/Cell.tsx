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

  // Obstacle styling
  if (cell.isObstacle) {
    return (
      <div className="relative flex items-center justify-center aspect-square rounded-xl border-2 border-gray-600 bg-gray-800">
        <div className="text-2xl">🚫</div>
        <div className="absolute inset-0 bg-red-500/20 rounded-xl"></div>
        <div className="absolute bottom-1 right-1 text-xs text-red-400 font-bold">X</div>
      </div>
    );
  }

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

  // Get threshold indicator color
  const getThresholdColor = () => {
    switch (cell.thresholdType) {
      case 'low':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-red-400';
      default:
        return 'text-white/40';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || !isValid}
      className={`
        relative flex items-center justify-center aspect-square rounded-xl border
        transition-all duration-75
        ${getBaseClass()}
        ${getHighlightColor()}
        ${isValid && !disabled ? 'cursor-pointer active:scale-95' : 'cursor-default opacity-75'}
        ${isNearCritical ? 'animate-pulse' : ''}
      `}
    >
      <div className={`absolute bottom-1 left-1 text-[10px] font-mono font-bold ${getThresholdColor()}`}>
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