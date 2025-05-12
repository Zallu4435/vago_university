import React from 'react';

interface FormTab {
  id: string;
  label: string;
  isActive: boolean;
}

interface FormTabsProps {
  tabs: FormTab[];
  onTabClick: (tabId: string) => void;
}

export const FormTabs: React.FC<FormTabsProps> = ({ tabs }) => {
  return (
    <div className="flex overflow-x-auto bg-cyan-50 shadow-sm rounded-xl p-2 mb-8 border border-cyan-200">
      {tabs.map((tab, index) => (
        <React.Fragment key={tab.id}>
          <div
            className={`
              px-5 py-3 rounded-lg text-sm font-medium 
              transition-all duration-300 
              flex items-center justify-center
              ${tab.isActive 
                ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white shadow-sm transform scale-105' 
                : 'text-cyan-700 hover:bg-cyan-100 hover:text-cyan-900'
              }
              relative
              after:absolute 
              after:bottom-0 
              after:left-0 
              after:h-[2px] 
              after:bg-cyan-400
              after:transition-all
              after:duration-300
              ${tab.isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
              cursor-default
            `}
          >
            {tab.label}
          </div>
          {index < tabs.length - 1 && (
            <div className="mx-1 text-cyan-200">|</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
