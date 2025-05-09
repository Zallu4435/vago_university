import { Input } from "../../Input";

interface ACTSectionProps {
  actDate: string;
  setActDate: (v: string) => void;
  actComposite: string;
  setActComposite: (v: string) => void;
  actEnglish: string;
  setActEnglish: (v: string) => void;
  actMath: string;
  setActMath: (v: string) => void;
  actReading: string;
  setActReading: (v: string) => void;
  actScience: string;
  setActScience: (v: string) => void;
}

const ACTSection: React.FC<ACTSectionProps> = ({
  actDate, setActDate,
  actComposite, setActComposite,
  actEnglish, setActEnglish,
  actMath, setActMath,
  actReading, setActReading,
  actScience, setActScience,
}) => (
  <div className="mb-8 bg-white rounded-lg border border-cyan-100 overflow-hidden">
    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
      <h3 className="text-lg font-medium text-cyan-900">ACT Test Score</h3>
    </div>
    
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col">
          <span className="text-cyan-700 text-sm font-medium mb-2">Test Type</span>
          <span className="text-cyan-900">ACT</span>
        </div>
        <Input
          id="actDate"
          label="Date Taken"
          value={actDate}
          onChange={e => setActDate(e.target.value)}
          placeholder="MM/YYYY"
          className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
          labelClassName="text-cyan-700"
        />
      </div>

      <div className="border border-cyan-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-cyan-50 border-b border-cyan-200">
              <th className="text-left p-3 text-cyan-800 font-medium">Component</th>
              <th className="text-left p-3 text-cyan-800 font-medium">Score</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-cyan-100">
              <td className="p-3 text-cyan-800">ACT Composite</td>
              <td className="p-3">
                <Input
                  id="actComposite"
                  value={actComposite}
                  onChange={e => setActComposite(e.target.value)}
                  placeholder="1-36"
                  className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                />
              </td>
            </tr>
            <tr className="border-b border-cyan-100">
              <td className="p-3 text-cyan-800">ACT English</td>
              <td className="p-3">
                <Input
                  id="actEnglish"
                  value={actEnglish}
                  onChange={e => setActEnglish(e.target.value)}
                  placeholder="1-36"
                  className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                />
              </td>
            </tr>
            <tr className="border-b border-cyan-100">
              <td className="p-3 text-cyan-800">ACT Math</td>
              <td className="p-3">
                <Input
                  id="actMath"
                  value={actMath}
                  onChange={e => setActMath(e.target.value)}
                  placeholder="1-36"
                  className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                />
              </td>
            </tr>
            <tr className="border-b border-cyan-100">
              <td className="p-3 text-cyan-800">ACT Reading</td>
              <td className="p-3">
                <Input
                  id="actReading"
                  value={actReading}
                  onChange={e => setActReading(e.target.value)}
                  placeholder="1-36"
                  className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                />
              </td>
            </tr>
            <tr className="border-b border-cyan-100">
              <td className="p-3 text-cyan-800">ACT Science</td>
              <td className="p-3">
                <Input
                  id="actScience"
                  value={actScience}
                  onChange={e => setActScience(e.target.value)}
                  placeholder="1-36"
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

export default ACTSection;