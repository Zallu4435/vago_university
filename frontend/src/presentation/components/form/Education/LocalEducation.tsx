import React, { useState } from 'react';
import { Input } from '../../Input';
import { Select } from '../../Select';
import { Button } from '../../Button';
import { countryOptions } from './options';

export const LocalEducation: React.FC = () => {
  const [schoolName, setSchoolName] = useState('');
  const [country, setCountry] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [nationalID, setNationalID] = useState('');
  const [localSchoolCategory, setLocalSchoolCategory] = useState('');
  const [stateOrProvince, setStateOrProvince] = useState('');

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl border border-cyan-100">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <h2 className="text-xl font-semibold text-cyan-900">Local Student Education</h2>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <Input 
            id="schoolName" 
            label="Name of School/Institution" 
            value={schoolName} 
            onChange={e => setSchoolName(e.target.value)} 
            required 
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
            labelClassName="text-cyan-700"
          />
          <Select 
            id="country" 
            label="Country" 
            options={countryOptions} 
            value={country} 
            onChange={e => setCountry(e.target.value)} 
            required 
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
            labelClassName="text-cyan-700"
          />
          <Input 
            id="from" 
            label="From" 
            value={from} 
            onChange={e => setFrom(e.target.value)} 
            required 
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
            labelClassName="text-cyan-700"
          />
          <Input 
            id="to" 
            label="To" 
            value={to} 
            onChange={e => setTo(e.target.value)} 
            required 
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
            labelClassName="text-cyan-700"
          />
          <Input 
            id="nationalID" 
            label="National ID/Registration Number" 
            value={nationalID} 
            onChange={e => setNationalID(e.target.value)} 
            required 
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
            labelClassName="text-cyan-700"
          />
          <Input 
            id="localSchoolCategory" 
            label="School Category" 
            value={localSchoolCategory} 
            onChange={e => setLocalSchoolCategory(e.target.value)} 
            required 
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
            labelClassName="text-cyan-700"
          />
          <Input 
            id="stateOrProvince" 
            label="State/Province" 
            value={stateOrProvince} 
            onChange={e => setStateOrProvince(e.target.value)} 
            required 
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
            labelClassName="text-cyan-700"
          />
        </div>
 
      </div>
    </div>
  );
};