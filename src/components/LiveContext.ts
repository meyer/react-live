import { Language, PrismTheme } from 'prism-react-renderer';
import { createContext } from 'react';

interface LiveContextItems {
  code: string;
  language?: Language;
  theme?: PrismTheme;
  disabled?: boolean;
  error?: any;
  element?: any;
  onError?: (err: any) => void;
  onChange?: (newValue: string) => void;
}

export const LiveContext = createContext<LiveContextItems>({} as any);
