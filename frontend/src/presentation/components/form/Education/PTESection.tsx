import { Input } from "../../Input";

interface PTESectionProps {
  pteDate: string;
  setPteDate: (v: string) => void;
  pteOverall: string;
  setPteOverall: (v: string) => void;
  pteReading: string;
  setPteReading: (v: string) => void;
  pteWriting: string;
  setPteWriting: (v: string) => void;
}

const PTESection: React.FC<PTESectionProps> = ({
  pteDate, setPteDate,
  pteOverall, setPteOverall,
  pteReading, setPteReading,
  pteWriting, setPteWriting
}) => (
  <div className="mb-8 bg-white rounded-lg border border-cyan-100 overflow-hidden">
    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
      <h3 className="text-lg font-medium text-cyan-900">PTE Academic Test Score</h3>
    </div>
    
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col">
          <span className="text-cyan-700 text-sm font-medium mb-2">Test Type</span>
          <span className="text-cyan-900">PTE Academic</span>
        </div>
        <Input
          id="pteDate"
          label="Date Taken"
          value={pteDate}
          onChange={e => setPteDate(e.target.value)}
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
            <tr>
              <td className="border-b border-cyan-200 p-3 text-cyan-900">PTE Overall</td>
              <td className="border-b border-cyan-200 p-3">
                <Input
                  id="pteOverall"
                  value={pteOverall}
                  onChange={e => setPteOverall(e.target.value)}
                  placeholder="<10 to 90 inclusive>"
                  className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                />
              </td>
            </tr>
            <tr>
              <td className="border-b border-cyan-200 p-3 text-cyan-900">PTE Reading</td>
              <td className="border-b border-cyan-200 p-3">
                <Input
                  id="pteReading"
                  value={pteReading}
                  onChange={e => setPteReading(e.target.value)}
                  placeholder="<10 to 90 inclusive>"
                  className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                />
              </td>
            </tr>
            <tr>
              <td className="p-3 text-cyan-900">PTE Writing</td>
              <td className="p-3">
                <Input
                  id="pteWriting"
                  value={pteWriting}
                  onChange={e => setPteWriting(e.target.value)}
                  placeholder="<10 to 90 inclusive>"
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

export default PTESection;