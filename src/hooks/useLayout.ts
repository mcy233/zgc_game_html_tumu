import { useState } from 'react';

export type Tab = 'HOME' | 'DAILY' | 'CONSTRUCTION' | 'TEAM' | 'ASSETS';
export type RightTab = 'LOGS' | 'MOMENTS' | 'HONORS';
export type LayoutZone = 'ARCHIVE' | 'MAIN' | 'FEED';

export function useLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('HOME');
  const [rightTab, setRightTab] = useState<RightTab>('LOGS');
  const [layoutZone, setLayoutZone] = useState<LayoutZone>('MAIN');

  return { activeTab, setActiveTab, rightTab, setRightTab, layoutZone, setLayoutZone };
}
