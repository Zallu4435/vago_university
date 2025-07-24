import { useState, useEffect } from 'react';
import { 
  FiSun, 
  FiMoon, 
  FiMonitor, 
  FiEye, 
  FiSliders,
  FiSettings,
  FiCheck,
  FiGlobe,
  FiSave
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { usePreferences } from '../../../../application/context/PreferencesContext';

interface Theme {
  id: string;
  name: string;
  icon: IconType;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    border: string;
  };
}

export default function PreferenceSettings() {
  const { theme: currentTheme, fontSize: currentFontSize, setTheme, setFontSize, resetPreferences } = usePreferences();
  
  const [previewTheme, setPreviewTheme] = useState(currentTheme);
  const [previewFontSize, setPreviewFontSize] = useState(currentFontSize);
  const [language, setLanguage] = useState('english');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    setPreviewTheme(currentTheme);
    setPreviewFontSize(currentFontSize);
  }, [currentTheme, currentFontSize]);

  const handleSave = () => {
    setTheme(previewTheme);
    setFontSize(previewFontSize);
  };

  const handleReset = () => {
    resetPreferences();
    setPreviewTheme(currentTheme);
    setPreviewFontSize(currentFontSize);
  };

  const themes: Theme[] = [
    {
      id: 'light',
      name: 'Light Mode',
      icon: FiSun,
      description: 'Clean and bright interface',
      colors: {
        primary: 'bg-white',
        secondary: 'bg-slate-50',
        text: 'text-slate-800',
        border: 'border-slate-200'
      }
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      icon: FiMoon,
      description: 'Easy on the eyes in low light',
      colors: {
        primary: 'bg-slate-900',
        secondary: 'bg-slate-800',
        text: 'text-slate-100',
        border: 'border-slate-700'
      }
    },
    {
      id: 'system',
      name: 'System Default',
      icon: FiMonitor,
      description: 'Follows your device settings',
      colors: {
        primary: 'bg-gradient-to-br from-slate-100 to-white',
        secondary: 'bg-slate-50',
        text: 'text-slate-800',
        border: 'border-slate-200'
      }
    }
  ];

  const languages = [
    { id: 'english', name: 'English', flag: '🇺🇸' },
    { id: 'spanish', name: 'Español', flag: '🇪🇸' },
    { id: 'french', name: 'Français', flag: '🇫🇷' },
    { id: 'german', name: 'Deutsch', flag: '🇩🇪' },
    { id: 'chinese', name: '中文', flag: '🇨🇳' },
    { id: 'japanese', name: '日本語', flag: '🇯🇵' }
  ];

  const fontSizes = [
    { id: 'small', name: 'Small', size: 'text-sm', preview: '14px' },
    { id: 'medium', name: 'Medium', size: 'text-base', preview: '16px' },
    { id: 'large', name: 'Large', size: 'text-lg', preview: '18px' },
    { id: 'extra-large', name: 'Extra Large', size: 'text-xl', preview: '20px' }
  ];

  const PreviewCard = ({ themeOption }: { themeOption: Theme }) => (
    <div className={`w-full h-32 rounded-xl border-2 transition-all duration-200 overflow-hidden ${
      previewTheme === themeOption.id 
        ? 'border-sky-400 shadow-md shadow-sky-100' 
        : 'border-slate-200 hover:border-slate-300'
    }`}>
      <div className={`h-full ${themeOption.colors.primary} ${themeOption.colors.text} p-4 relative`}>
        <div className={`absolute inset-0 ${themeOption.colors.secondary} opacity-30`}></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className={`w-6 h-6 ${themeOption.colors.secondary} rounded-full flex items-center justify-center`}>
              <themeOption.icon className="w-3 h-3" />
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            </div>
          </div>
          <div className={`text-xs font-medium mb-1 ${themeOption.colors.text}`}>
            {themeOption.name}
          </div>
          <div className={`w-16 h-1 ${themeOption.colors.secondary} rounded-full mb-2`}></div>
          <div className={`w-12 h-1 ${themeOption.colors.secondary} rounded-full opacity-60`}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full overflow-hidden">
        <div className="bg-gradient-to-r from-sky-50 to-slate-50 p-6 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center shadow-sm">
              <FiSliders className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Preferences</h1>
              <p className="text-slate-600">Customize your experience to match your style</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-sky-500 rounded-lg flex items-center justify-center">
                  <FiEye className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Theme</h3>
              </div>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
              >
                <FiEye className="w-4 h-4 mr-2" />
                {previewMode ? 'Exit Preview' : 'Preview Mode'}
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4">Choose your preferred appearance</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themes.map((themeOption) => (
                <div key={themeOption.id} className="space-y-3">
                  <PreviewCard themeOption={themeOption} />
                  <button
                    onClick={() => setPreviewTheme(themeOption.id as 'light' | 'dark' | 'system')}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      previewTheme === themeOption.id
                        ? 'border-sky-400 bg-sky-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                          previewTheme === themeOption.id ? 'bg-sky-500' : 'bg-slate-200'
                        }`}>
                          <themeOption.icon className={`w-3 h-3 ${
                            previewTheme === themeOption.id ? 'text-white' : 'text-slate-600'
                          }`} />
                        </div>
                        <div className={`font-medium ${
                          previewTheme === themeOption.id ? 'text-sky-900' : 'text-slate-800'
                        }`}>
                          {themeOption.name}
                        </div>
                      </div>
                      {previewTheme === themeOption.id && (
                        <div className="w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center">
                          <FiCheck className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{themeOption.description}</p>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
                <FiGlobe className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Language</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">Select your preferred language</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    language === lang.id
                      ? 'border-emerald-400 bg-emerald-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <span className={`font-medium ${
                        language === lang.id ? 'text-emerald-900' : 'text-slate-800'
                      }`}>
                        {lang.name}
                      </span>
                    </div>
                    {language === lang.id && (
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <FiCheck className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                <FiSettings className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Display</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">Adjust text size and display preferences</p>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Font Size</label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {fontSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setPreviewFontSize(size.id as 'small' | 'medium' | 'large' | 'extra-large')}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                        previewFontSize === size.id
                          ? 'border-purple-400 bg-purple-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className={`${size.size} font-medium mb-1 ${
                        previewFontSize === size.id ? 'text-purple-900' : 'text-slate-800'
                      }`}>
                        Aa
                      </div>
                      <div className="text-xs text-slate-600">{size.name}</div>
                      <div className="text-xs text-slate-500">{size.preview}</div>
                      {previewFontSize === size.id && (
                        <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center mx-auto mt-2">
                          <FiCheck className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
            <button 
              onClick={handleReset}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Reset to Default
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center"
            >
              <FiSave className="w-4 h-4 mr-2" />
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}