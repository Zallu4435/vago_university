import { Input } from "../../Input";

interface APSectionProps {
  apDate: string;
  setApDate: (v: string) => void;
  apSubject: string;
  setApSubject: (v: string) => void;
  apScore: string;
  setApScore: (v: string) => void;
  // Add more props if you have a table or modal for multiple AP subjects
}

const APSection: React.FC<APSectionProps> = ({
  apDate, setApDate,
  apSubject, setApSubject,
  apScore, setApScore,
}) => (
  <div className="mb-8 bg-white rounded-lg border border-cyan-100 overflow-hidden">
    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
      <h3 className="text-lg font-medium text-cyan-900">AP Test Score</h3>
    </div>
    
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col">
          <span className="text-cyan-700 text-sm font-medium mb-2">Test Type</span>
          <span className="text-cyan-900">Advanced Placement (AP)</span>
        </div>
        <Input
          id="apDate"
          label="Date Taken"
          value={apDate}
          onChange={e => setApDate(e.target.value)}
          placeholder="MM/YYYY"
          className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
          labelClassName="text-cyan-700"
        />
      </div>

      <div className="border border-cyan-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-cyan-50 border-b border-cyan-200">
              <th className="text-left p-3 text-cyan-800 font-medium">Subject</th>
              <th className="text-left p-3 text-cyan-800 font-medium">Score</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-cyan-100">
              <td className="p-3">
                <Input
                  id="apSubject"
                  value={apSubject}
                  onChange={e => setApSubject(e.target.value)}
                  placeholder="AP Subject Name"
                  className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                />
              </td>
              <td className="p-3">
                <Input
                  id="apScore"
                  value={apScore}
                  onChange={e => setApScore(e.target.value)}
                  placeholder="1-5"
                  className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default APSection;