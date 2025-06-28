import React, { useState } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { ChainReactionGame } from './components/ChainReactionGame';

type AppState = 'loading' | 'game';

export const App = () => {
  const [appState, setAppState] = useState<AppState>('loading');

  const handleLoadingComplete = () => {
    setAppState('game');
  };

  switch (appState) {
    case 'loading':
      return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
    case 'game':
      return <ChainReactionGame />;
    default:
      return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }
};