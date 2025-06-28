import React, { useState } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { LaunchPage } from './components/LaunchPage';
import { ChainReactionGame } from './components/ChainReactionGame';

type AppState = 'loading' | 'launch' | 'game';

export const App = () => {
  const [appState, setAppState] = useState<AppState>('loading');

  const handleLoadingComplete = () => {
    setAppState('launch');
  };

  const handleEnterGame = () => {
    setAppState('game');
  };

  switch (appState) {
    case 'loading':
      return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
    case 'launch':
      return <LaunchPage onEnterGame={handleEnterGame} />;
    case 'game':
      return <ChainReactionGame />;
    default:
      return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }
};