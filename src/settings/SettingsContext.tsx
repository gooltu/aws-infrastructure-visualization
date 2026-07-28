import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { GraphSettings, Tier } from './types';
import { DEFAULT_SETTINGS } from './defaults';

const STORAGE_KEY = 'aws-viz-settings';

function loadSettings(): GraphSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS;
}

function saveSettings(s: GraphSettings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

interface SettingsContextValue {
  settings: GraphSettings;
  setShowEdges: (v: boolean) => void;
  setPublicSubnetsFirst: (v: boolean) => void;
  moveTierUp: (id: string) => void;
  moveTierDown: (id: string) => void;
  updateTierTypes: (id: string, types: string[]) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GraphSettings>(loadSettings);

  const update = useCallback((next: GraphSettings) => {
    setSettings(next);
    saveSettings(next);
  }, []);

  const setShowEdges = useCallback((v: boolean) => {
    update({ ...settings, showEdges: v });
  }, [settings, update]);

  const setPublicSubnetsFirst = useCallback((v: boolean) => {
    update({ ...settings, publicSubnetsFirst: v });
  }, [settings, update]);

  const moveTierUp = useCallback((id: string) => {
    const tiers = [...settings.tiers];
    const idx = tiers.findIndex(t => t.id === id);
    if (idx <= 0) return;
    [tiers[idx - 1], tiers[idx]] = [tiers[idx], tiers[idx - 1]];
    update({ ...settings, tiers });
  }, [settings, update]);

  const moveTierDown = useCallback((id: string) => {
    const tiers = [...settings.tiers];
    const idx = tiers.findIndex(t => t.id === id);
    if (idx < 0 || idx >= tiers.length - 1) return;
    [tiers[idx], tiers[idx + 1]] = [tiers[idx + 1], tiers[idx]];
    update({ ...settings, tiers });
  }, [settings, update]);

  const updateTierTypes = useCallback((id: string, types: string[]) => {
    const tiers = settings.tiers.map((t: Tier) => t.id === id ? { ...t, resourceTypes: types } : t);
    update({ ...settings, tiers });
  }, [settings, update]);

  return (
    <SettingsContext.Provider value={{ settings, setShowEdges, setPublicSubnetsFirst, moveTierUp, moveTierDown, updateTierTypes }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
