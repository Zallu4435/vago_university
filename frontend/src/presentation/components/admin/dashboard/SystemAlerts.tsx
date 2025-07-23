import React from 'react';

interface Alert {
  id: string;
  title: string;
  message: string;
  type: string;
}

interface SystemAlertsProps {
  alertsData: Alert[];
  getAlertIcon: (type: string) => React.ReactNode;
  getAlertBgColor: (type: string) => string;
  getAlertBorderColor: (type: string) => string;
  getAlertTextColor: (type: string) => string;
  getAlertSubtextColor: (type: string) => string;
  dismissAlert: (id: string) => void;
}

const SystemAlerts: React.FC<SystemAlertsProps> = ({ alertsData, getAlertIcon, getAlertBgColor, getAlertBorderColor, getAlertTextColor, getAlertSubtextColor, dismissAlert }) => (
  <div className="space-y-4">
    {alertsData.length > 0 ? (
      alertsData.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-start space-x-3 p-3 ${getAlertBgColor(alert.type)} backdrop-blur-sm rounded-lg border-l-4 ${getAlertBorderColor(alert.type)} hover:opacity-80 transition-opacity duration-200 cursor-pointer`}
          onClick={() => dismissAlert(alert.id)}
        >
          {getAlertIcon(alert.type)}
          <div className="flex-1">
            <p className={`text-sm font-medium ${getAlertTextColor(alert.type)}`}>{alert.title}</p>
            <p className={`text-xs ${getAlertSubtextColor(alert.type)}`}>{alert.message}</p>
          </div>
        </div>
      ))
    ) : (
      <div className="text-center py-8">
        <span className="h-8 w-8 text-gray-500 mx-auto mb-2">🔔</span>
        <p className="text-gray-400">No system alerts</p>
      </div>
    )}
  </div>
);

export default SystemAlerts; 