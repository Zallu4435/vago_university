import { Input } from "../../Input";
interface TOEFLEssentialsSectionProps {
  essentialsDate: string;
  setEssentialsDate: (v: string) => void;
  essentialsGrade: string;
  setEssentialsGrade: (v: string) => void;
  label?: string;
}

const TOEFLEssentialsSection: React.FC<TOEFLEssentialsSectionProps> = ({
  essentialsDate, setEssentialsDate,
  essentialsGrade, setEssentialsGrade,
  label = "TOEFL Essentials"
}) => (
  <div className="mb-8 bg-white rounded-lg border border-cyan-100 overflow-hidden">
    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
      <h3 className="text-lg font-medium text-cyan-900">{label}</h3>
    </div>

    <div className="p-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col">
          <span className="text-cyan-700 text-sm font-medium mb-2">Test Type</span>
          <span className="text-cyan-900">{label}</span>
        </div>
        <Input
          id="essentialsDate"
          label="Date Taken"
          value={essentialsDate}
          onChange={e => setEssentialsDate(e.target.value)}
          placeholder="MM/YYYY"
          className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
          labelClassName="text-cyan-700"
        />
        <Input
          id="essentialsGrade"
          label="Score"
          value={essentialsGrade}
          onChange={e => setEssentialsGrade(e.target.value)}
          placeholder="Essential 1-12"
          className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
          labelClassName="text-cyan-700"
        />
      </div>
    </div>
  </div>
);

export default TOEFLEssentialsSection;