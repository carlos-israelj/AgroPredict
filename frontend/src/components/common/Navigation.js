import React from 'react';
import { TrendingUp, Package, DollarSign } from 'lucide-react';

const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium transition-colors ${
      active 
        ? 'bg-green-600 text-white' 
        : 'bg-white text-green-600 border border-green-600'
    }`}
  >
    <Icon size={16} />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const Navigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'predicciones',
      label: 'Predicciones',
      icon: TrendingUp
    },
    {
      id: 'mis-tokens',
      label: 'Mis Tokens',
      icon: Package
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: DollarSign
    }
  ];

  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex">
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              active={activeTab === tab.id}
              onClick={onTabChange}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;