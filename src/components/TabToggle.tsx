'use client';

interface TabToggleProps {
  activeTab: 'fiction' | 'news';
  onTabChange: (tab: 'fiction' | 'news') => void;
}

const TabToggle = ({ activeTab, onTabChange }: TabToggleProps) => {
  return (
    <div className="flex justify-center mb-10">
      <div className="inline-flex bg-secondary rounded-full p-1 shadow-soft">
        <button
          onClick={() => onTabChange('fiction')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeTab === 'fiction'
              ? 'bg-background text-foreground shadow-card'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Fiction
        </button>
        <button
          onClick={() => onTabChange('news')}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeTab === 'news'
              ? 'bg-background text-foreground shadow-card'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          News
        </button>
      </div>
    </div>
  );
};

export default TabToggle;
