import { Input } from "../../Input";

interface TOEFLSectionProps {
  toeflDate: string;
  setToeflDate: (v: string) => void;
  toeflGrade: string;
  setToeflGrade: (v: string) => void;
  toeflType: 'online' | 'paper' | '';
  setToeflType: (v: 'online' | 'paper' | '') => void;
}

const TOEFLSection: React.FC<TOEFLSectionProps> = ({
  toeflDate, setToeflDate,
  toeflGrade, setToeflGrade,
  toeflType, setToeflType
}) => (
  <div className="mb-8 bg-white rounded-lg border border-cyan-100 overflow-hidden">
    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
      <h3 className="text-lg font-medium text-cyan-900">TOEFL Test Score</h3>
    </div>

    <div className="p-6">
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="flex flex-col">
          <span className="text-cyan-700 text-sm font-medium mb-2">Test Type</span>
          <span className="text-cyan-900">TOEFL</span>
        </div>
        <Input
          id="toeflDate"
          label="Date Taken"
          value={toeflDate}
          onChange={e => setToeflDate(e.target.value)}
          placeholder="MM/YYYY"
          className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
          labelClassName="text-cyan-700"
        />
        <Input
          id="toeflGrade"
          label="Total Score"
          value={toeflGrade}
          onChange={e => setToeflGrade(e.target.value)}
          placeholder="Internet: 0-120; Paper: 310-677"
          className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
          labelClassName="text-cyan-700"
        />
      </div>

      <div className="flex items-center gap-6 p-4 bg-cyan-50/50 rounded-lg">
        <span className="text-cyan-700 text-sm font-medium">Test Format:</span>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="toefl_type"
            checked={toeflType === 'online'}
            onChange={() => setToeflType('online')}
            className="form-radio h-4 w-4 text-cyan-600 border-cyan-300 focus:ring-cyan-200"
          />
          <span className="ml-2 text-cyan-800">Online</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="toefl_type"
            checked={toeflType === 'paper'}
            onChange={() => setToeflType('paper')}
            className="form-radio h-4 w-4 text-cyan-600 border-cyan-300 focus:ring-cyan-200"
          />
          <span className="ml-2 text-cyan-800">Paper-Based</span>
        </label>
      </div>
    </div>
  </div>
);

export default TOEFLSection;