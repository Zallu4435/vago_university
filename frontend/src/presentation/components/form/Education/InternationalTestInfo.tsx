import React, { useState } from 'react';
import IELTSSection from './IELTSSection';
import TOEFLSection from './TOEFLSection';
import TOEFLEssentialsSection from './TOEFLEssentialsSection';
import PTESection from './PTESection';
import MappedTestsSection from './MappedTestsSection';
import SATSection from './SATSection';
import ACTSection from './ACTSection';
import APSection from './APSection';
import { Button } from '../../Button';

const InternationalTestInfo: React.FC = () => {
  // IELTS
  const [ieltsDate, setIeltsDate] = useState('');
  const [ieltsOverall, setIeltsOverall] = useState('');
  const [ieltsReading, setIeltsReading] = useState('');
  const [ieltsWriting, setIeltsWriting] = useState('');

  // TOEFL
  const [toeflDate, setToeflDate] = useState('');
  const [toeflGrade, setToeflGrade] = useState('');
  const [toeflType, setToeflType] = useState<'online' | 'paper' | ''>('');

  // TOEFL Essentials
  const [essentials1Date, setEssentials1Date] = useState('');
  const [essentials1Grade, setEssentials1Grade] = useState('');
  const [essentials2Date, setEssentials2Date] = useState('');
  const [essentials2Grade, setEssentials2Grade] = useState('');

  // PTE
  const [pteDate, setPteDate] = useState('');
  const [pteOverall, setPteOverall] = useState('');
  const [pteReading, setPteReading] = useState('');
  const [pteWriting, setPteWriting] = useState('');

  // Mapped Tests
  const [el1119Date, setEl1119Date] = useState('');
  const [el1119Grade, setEl1119Grade] = useState('');
  const [ceferDate, setCeferDate] = useState('');
  const [ceferGrade, setCeferGrade] = useState('');
  const [muetDate, setMuetDate] = useState('');
  const [muetGrade, setMuetGrade] = useState('');
  const [cambridgeDate, setCambridgeDate] = useState('');
  const [cambridgeGrade, setCambridgeGrade] = useState('');

  // SAT
  const [satDate, setSatDate] = useState('');
  const [satMath, setSatMath] = useState('');
  const [satReading, setSatReading] = useState('');
  const [satEssay, setSatEssay] = useState('');

  // ACT
  const [actDate, setActDate] = useState('');
  const [actComposite, setActComposite] = useState('');
  const [actEnglish, setActEnglish] = useState('');
  const [actMath, setActMath] = useState('');
  const [actReading, setActReading] = useState('');
  const [actScience, setActScience] = useState('');

  // AP
  const [apDate, setApDate] = useState('');
  const [apSubject, setApSubject] = useState('');
  const [apScore, setApScore] = useState('');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-sm rounded-xl border border-cyan-100">
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
          <h2 className="text-xl font-semibold text-cyan-900">International Test Information</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* English Language Tests */}
          <div className="space-y-6">
            <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded">
              <p className="text-sm text-cyan-800">
                Please provide your test scores for any of the following English language proficiency tests 
                that you have taken in the past 2 years.
              </p>
            </div>

            <IELTSSection
              ieltsDate={ieltsDate}
              setIeltsDate={setIeltsDate}
              ieltsOverall={ieltsOverall}
              setIeltsOverall={setIeltsOverall}
              ieltsReading={ieltsReading}
              setIeltsReading={setIeltsReading}
              ieltsWriting={ieltsWriting}
              setIeltsWriting={setIeltsWriting}
            />

            <TOEFLSection
              toeflDate={toeflDate}
              setToeflDate={setToeflDate}
              toeflGrade={toeflGrade}
              setToeflGrade={setToeflGrade}
              toeflType={toeflType}
              setToeflType={setToeflType}
            />

            <TOEFLEssentialsSection
              essentialsDate={essentials1Date}
              setEssentialsDate={setEssentials1Date}
              essentialsGrade={essentials1Grade}
              setEssentialsGrade={setEssentials1Grade}
              label="TOEFL Essentials 1"
            />

            <TOEFLEssentialsSection
              essentialsDate={essentials2Date}
              setEssentialsDate={setEssentials2Date}
              essentialsGrade={essentials2Grade}
              setEssentialsGrade={setEssentials2Grade}
              label="TOEFL Essentials 2"
            />

            <PTESection
              pteDate={pteDate}
              setPteDate={setPteDate}
              pteOverall={pteOverall}
              setPteOverall={setPteOverall}
              pteReading={pteReading}
              setPteReading={setPteReading}
              pteWriting={pteWriting}
              setPteWriting={setPteWriting}
            />

            <MappedTestsSection
              el1119Date={el1119Date}
              setEl1119Date={setEl1119Date}
              el1119Grade={el1119Grade}
              setEl1119Grade={setEl1119Grade}
              ceferDate={ceferDate}
              setCeferDate={setCeferDate}
              ceferGrade={ceferGrade}
              setCeferGrade={setCeferGrade}
              muetDate={muetDate}
              setMuetDate={setMuetDate}
              muetGrade={muetGrade}
              setMuetGrade={setMuetGrade}
              cambridgeDate={cambridgeDate}
              setCambridgeDate={setCambridgeDate}
              cambridgeGrade={cambridgeGrade}
              setCambridgeGrade={setCambridgeGrade}
            />
          </div>

          {/* Standardized Tests */}
          <div className="space-y-6 pt-6 border-t border-cyan-100">
            <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded">
              <p className="text-sm text-cyan-800">
                Please provide your scores for any standardized tests you have taken.
              </p>
            </div>

            <SATSection
              satDate={satDate}
              setSatDate={setSatDate}
              satMath={satMath}
              setSatMath={setSatMath}
              satReading={satReading}
              setSatReading={setSatReading}
              satEssay={satEssay}
              setSatEssay={setSatEssay}
            />

            <ACTSection
              actDate={actDate}
              setActDate={setActDate}
              actComposite={actComposite}
              setActComposite={setActComposite}
              actEnglish={actEnglish}
              setActEnglish={setActEnglish}
              actMath={actMath}
              setActMath={setActMath}
              actReading={actReading}
              setActReading={setActReading}
              actScience={actScience}
              setActScience={setActScience}
            />

            <APSection
              apDate={apDate}
              setApDate={setApDate}
              apSubject={apSubject}
              setApSubject={setApSubject}
              apScore={apScore}
              setApScore={setApScore}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export { InternationalTestInfo };