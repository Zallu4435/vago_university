import React, { useState } from 'react';
import { Input } from '../../Input';
import { Select } from '../../Select';
import { Button } from '../../Button';
import { countryOptions, universityOptions } from './options';

export const TransferEducation: React.FC = () => {
  const [schoolName, setSchoolName] = useState('');
  const [country, setCountry] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [previousUniversity, setPreviousUniversity] = useState('');
  const [otherUniversity, setOtherUniversity] = useState('');
  const [creditsEarned, setCreditsEarned] = useState('');
  const [gpa, setGpa] = useState('');
  const [programStudied, setProgramStudied] = useState('');
  const [reasonForTransfer, setReasonForTransfer] = useState('');

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl border border-cyan-100">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <h2 className="text-xl font-semibold text-cyan-900">Transfer Student Education</h2>
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
          <Select 
            id="previousUniversity" 
            label="Previous University" 
            options={universityOptions} 
            value={previousUniversity} 
            onChange={e => setPreviousUniversity(e.target.value)} 
            required 
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
            labelClassName="text-cyan-700"
          />
          {previousUniversity === 'other' && (
            <Input 
              id="otherUniversity" 
              label="Other University Name" 
              value={otherUniversity} 
              onChange={e => setOtherUniversity(e.target.value)} 
              required 
              className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
              labelClassName="text-cyan-700"
            />
          )}
          <Input 
            id="creditsEarned" 
            label="Credits Earned" 
            value={creditsEarned} 
            onChange={e => setCreditsEarned(e.target.value)} 
            required 
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
            labelClassName="text-cyan-700"
          />
          <Input 
            id="gpa" 
            label="GPA" 
            value={gpa} 
            onChange={e => setGpa(e.target.value)} 
            required 
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
            labelClassName="text-cyan-700"
          />
          <Input 
            id="programStudied" 
            label="Program/Major Studied" 
            value={programStudied} 
            onChange={e => setProgramStudied(e.target.value)} 
            required 
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
            labelClassName="text-cyan-700"
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-cyan-700 mb-1">
              Reason for Transfer<span className="text-red-500">*</span>
            </label>
            <textarea
              id="reasonForTransfer"
              value={reasonForTransfer}
              onChange={e => setReasonForTransfer(e.target.value)}
              className="shadow-sm focus:ring-cyan-400 focus:border-cyan-400 block w-full sm:text-sm border-cyan-200 rounded-md bg-white"
              rows={3}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};