import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { MyLandPage } from './pages/MyLandPage';
import { FarmingAdvicePage } from './pages/FarmingAdvicePage';
import { AskQuestionPage } from './pages/AskQuestionPage';
import { ProfilePage } from './pages/ProfilePage';
import { TabType, Field } from './types';
import { api } from './services/api';

export const App: React.FC = () => {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [initialAdviceSubTab, setInitialAdviceSubTab] = useState<string>('choose');
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFields = async () => {
    try {
      const data = await api.getFields();
      setFields(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFields();
  }, []);

  const activeField = fields.find(f => f.is_active) || (fields.length > 0 ? fields[0] : null);

  const handleSetActiveField = async (id: number) => {
    try {
      await api.setActiveField(id);
      await loadFields();
    } catch (e) {
      console.error(e);
    }
  };

  const handleNavigateTab = (tab: TabType, initialSubTab?: string) => {
    if (initialSubTab) {
      setInitialAdviceSubTab(initialSubTab);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col text-[#2A080C] selection:bg-[#6B0F1A] selection:text-[#FAF6F0]">
      {/* Global Persistent Header with Language & Help + Desktop Navigation */}
      <Header activeTab={activeTab} onTabChange={handleNavigateTab} />

      {/* Main Content Area — Full screen on mobile, expansive on desktop */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-5 sm:py-8 pb-safe-nav md:pb-12">
        {activeTab === 'home' && (
          <HomePage
            activeField={activeField}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'land' && (
          <MyLandPage
            fields={fields}
            activeField={activeField}
            onRefreshFields={loadFields}
            onSetActiveField={handleSetActiveField}
          />
        )}

        {activeTab === 'advice' && (
          <FarmingAdvicePage
            activeField={activeField}
            initialSubTab={initialAdviceSubTab}
          />
        )}

        {activeTab === 'ask' && (
          <AskQuestionPage
            activeField={activeField}
          />
        )}

        {activeTab === 'profile' && (
          <ProfilePage
            onRefreshFields={loadFields}
          />
        )}
      </main>

      {/* Mobile-First 5-Tab Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => handleNavigateTab(tab)}
      />
    </div>
  );
};

export default App;
