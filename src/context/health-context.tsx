import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { HealthRecord } from '../types/health';

interface HealthContextType {
  healthRecords: HealthRecord[];
  addHealthRecord: (record: HealthRecord) => void;
  getLatestRecord: () => HealthRecord | null;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export function HealthProvider({ children }: { children: ReactNode }) {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('health-records');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const loadedRecords = parsed.map((record: any) => ({
            ...record,
            timestamp: new Date(record.timestamp),
            assessment: record.assessment || undefined
          }));
          setHealthRecords(loadedRecords);
        } catch (e) {
          console.error('Failed to parse health records', e);
        }
      }
    }
  }, []);

  const addHealthRecord = (record: HealthRecord) => {
    setHealthRecords(prev => {
      const newRecords = [record, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('health-records', JSON.stringify(newRecords));
      }
      return newRecords;
    });
  };

  const getLatestRecord = () => {
    return healthRecords.length > 0 ? healthRecords[0] : null;
  };

  return (
    <HealthContext.Provider value={{ healthRecords, addHealthRecord, getLatestRecord }}>
      {children}
    </HealthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useHealth() {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
}