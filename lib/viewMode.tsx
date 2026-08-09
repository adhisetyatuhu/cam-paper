import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ViewMode = 'compact' | 'detail' | 'grid';

const STORAGE_KEY = 'campaper.viewMode';
const DEFAULT_MODE: ViewMode = 'detail';

function isViewMode(value: string | null): value is ViewMode {
  return value === 'compact' || value === 'detail' || value === 'grid';
}

type ViewModeContextValue = {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
};

const ViewModeContext = createContext<ViewModeContextValue | null>(null);

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ViewMode>(DEFAULT_MODE);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (isViewMode(stored)) setModeState(stored);
    });
  }, []);

  function setMode(next: ViewMode) {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  }

  return <ViewModeContext.Provider value={{ mode, setMode }}>{children}</ViewModeContext.Provider>;
}

export function useViewMode(): ViewModeContextValue {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}
