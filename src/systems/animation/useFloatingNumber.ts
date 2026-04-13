import { useCallback, useEffect, useRef, useState } from 'react';

import { isFeatureEnabled } from '../featureFlags';

export interface FloatingItem {
  id: string;
  value: number;
  label: string;
  x: number;
  y: number;
  color: 'green' | 'red' | 'amber';
  createdAt: number;
}

const MAX_ITEMS = 8;
const LIFETIME_MS = 1500;

export function useFloatingNumbers(): {
  items: FloatingItem[];
  spawn: (value: number, label: string, anchorId?: string) => void;
  clearAll: () => void;
} {
  const [items, setItems] = useState<FloatingItem[]>([]);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    const t = timeoutsRef.current.get(id);
    if (t) {
      clearTimeout(t);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current.clear();
    setItems([]);
  }, []);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(t => clearTimeout(t));
      timeoutsRef.current.clear();
    };
  }, []);

  const spawn = useCallback(
    (value: number, label: string, anchorId?: string) => {
      if (!isFeatureEnabled('enableFloatingNumbers')) return;
      if (value === 0) return;

      let x = window.innerWidth / 2;
      let y = window.innerHeight * 0.22;

      if (anchorId) {
        const el = document.getElementById(anchorId);
        if (el) {
          const r = el.getBoundingClientRect();
          x = r.left + r.width / 2;
          y = r.top + r.height * 0.35;
        }
      }

      const color: FloatingItem['color'] =
        value > 0 ? 'green' : value < 0 ? 'red' : 'amber';

      const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const item: FloatingItem = {
        id,
        value,
        label,
        x,
        y,
        color,
        createdAt: Date.now(),
      };

      setItems(prev => {
        let list = prev;
        if (prev.length >= MAX_ITEMS) {
          const dropped = prev[0]!;
          const tt = timeoutsRef.current.get(dropped.id);
          if (tt) {
            clearTimeout(tt);
            timeoutsRef.current.delete(dropped.id);
          }
          list = prev.slice(1);
        }
        return [...list, item];
      });

      const t = setTimeout(() => removeItem(id), LIFETIME_MS);
      timeoutsRef.current.set(id, t);
    },
    [removeItem]
  );

  return { items, spawn, clearAll };
}
