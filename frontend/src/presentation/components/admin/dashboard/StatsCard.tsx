import React from 'react';
import { StatsCardProps } from '../../../../domain/types/dashboard/admin';

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, trend, icon: Icon, bgGradient, iconBg, trendUp, delay = 0, loading }) => (
  <div
    className="group relative"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className={`${bgGradient} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden backdrop-blur-xl`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-700 blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full -translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-600 blur-lg"></div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`${iconBg} p-3 rounded-xl shadow-inner border border-white/30`}>
              <Icon className="h-7 w-7 text-white drop-shadow-sm" />
            </div>
            <div className="ml-4">
              <p className="text-white text-opacity-90 text-sm font-medium">{title}</p>
              <p className="text-3xl font-bold text-white drop-shadow-sm">{loading ? '---' : value}</p>
            </div>
          </div>
          <div className="text-right">
            <svg className="h-5 w-5 text-white opacity-70 animate-pulse" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-white text-opacity-80 text-sm">{subtitle}</p>
          <div className={`flex items-center rounded-full px-3 py-1 backdrop-blur-sm ${trendUp ? 'bg-emerald-100/30' : 'bg-red-100/30'}`}>
            {trendUp ? (
              <svg className="h-4 w-4 text-emerald-400 mr-1" fill="none" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            ) : (
              <svg className="h-4 w-4 text-red-400 mr-1" fill="none" viewBox="0 0 24 24"><path d="M19 12l-5 5L4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            )}
            <span className={`text-sm font-semibold ${trendUp ? 'text-emerald-300' : 'text-red-300'}`}>{trend}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default StatsCard; 