import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PaperSize = 'a4' | 'letter' | 'legal' | 'f4';

const STORAGE_KEY = 'campaper.paperSize';
const DEFAULT_SIZE: PaperSize = 'a4';

// Point dimensions at 72 PPI, matching expo-print's `width`/`height` options.
export const PAPER_SIZES: Record<PaperSize, { widthPt: number; heightPt: number }> = {
  a4: { widthPt: 595, heightPt: 842 },
  letter: { widthPt: 612, heightPt: 792 },
  legal: { widthPt: 612, heightPt: 1008 },
  f4: { widthPt: 612, heightPt: 936 },
};

function isPaperSize(value: string | null): value is PaperSize {
  return value === 'a4' || value === 'letter' || value === 'legal' || value === 'f4';
}

type PaperSizeContextValue = {
  paperSize: PaperSize;
  setPaperSize: (size: PaperSize) => void;
};

const PaperSizeContext = createContext<PaperSizeContextValue | null>(null);

export function PaperSizeProvider({ children }: { children: ReactNode }) {
  const [paperSize, setPaperSizeState] = useState<PaperSize>(DEFAULT_SIZE);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (isPaperSize(stored)) setPaperSizeState(stored);
    });
  }, []);

  function setPaperSize(next: PaperSize) {
    setPaperSizeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <PaperSizeContext.Provider value={{ paperSize, setPaperSize }}>
      {children}
    </PaperSizeContext.Provider>
  );
}

export function usePaperSize(): PaperSizeContextValue {
  const context = useContext(PaperSizeContext);
  if (!context) {
    throw new Error('usePaperSize must be used within a PaperSizeProvider');
  }
  return context;
}
