import React, { useEffect, useState } from 'react';
import { AchievementQuestions } from './AchievementQuestions';
import { questions } from './options';
import { AchievementList } from './AchievementList';
import { AchievementModal } from './AchievementModal';
import { AchievementSection } from '../../../../domain/types/formTypes';

interface Props {
  initialData?: AchievementSection;
  onSave: (data: AchievementSection) => void;
}

export const Achievements: React.FC<Props> = ({ initialData, onSave }) => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>(
    questions.reduce((acc, q) => ({ ...acc, [q.id]: '' }), {})
  );

  const handleAnswerChange = (questionId: number, value: string) => {
    if (value.length <= questions.find(q => q.id === questionId)?.maxLength!) {
      setAnswers(prev => ({ ...prev, [questionId]: value }));
    }
  };

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement>({
    activity: '',
    level: '',
    levelOfAchievement: '',
    positionHeld: '',
    organizationName: '',
    fromDate: '',
    toDate: '',
    description: '',
  });

  const [referenceContact, setReferenceContact] = useState({
    firstName: '',
    lastName: '',
    position: '',
    email: '',
    phone: {
      country: '',
      area: '',
      number: ''
    }
  });

  const [hasNoAchievements, setHasNoAchievements] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleEdit = (achievement: Achievement, index: number) => {
    setNewAchievement(achievement);
    setReferenceContact(achievement.reference || {
      firstName: '',
      lastName: '',
      position: '',
      email: '',
      phone: {
        country: '',
        area: '',
        number: ''
      }
    });
    setEditingIndex(index);
    setShowModal(true);
  };

  const handleSubmitAchievement = () => {
    if (editingIndex !== null) {
      const updatedAchievements = [...achievements];
      updatedAchievements[editingIndex] = {
        ...newAchievement,
        reference: referenceContact
      };
      setAchievements(updatedAchievements);
    } else if (achievements.length < 4) {
      setAchievements([...achievements, {
        ...newAchievement,
        reference: referenceContact
      }]);
    }
    setShowModal(false);
    setEditingIndex(null);
    setNewAchievement({
      activity: '',
      level: '',
      levelOfAchievement: '',
      positionHeld: '',
      organizationName: '',
      fromDate: '',
      toDate: '',
      description: '',
    });
    setReferenceContact({
      firstName: '',
      lastName: '',
      position: '',
      email: '',
      phone: {
        country: '',
        area: '',
        number: ''
      }
    });
  };

    useEffect(() => {
    onSave({
      questions: answers,
      achievements,
      hasNoAchievements
    });
  }, [answers, achievements, hasNoAchievements]);

  const handleToggleNoAchievements = () => {
    setHasNoAchievements(!hasNoAchievements);
    if (!hasNoAchievements) {
      setAchievements([]);
    }
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl border border-cyan-100">
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
          <h2 className="text-xl font-semibold text-cyan-900">Achievements & Extra-Curricular Activities</h2>
        </div>

        <div className="p-6">
          <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded mb-6">
            <p className="text-sm text-cyan-800">
              For better evaluation of your application, please provide information about your achievements 
              and activities. This helps us understand your capabilities beyond academic performance.
            </p>
          </div>

          <AchievementQuestions
            questions={questions}
            answers={answers}
            onAnswerChange={handleAnswerChange}
          />

          <div className="mt-8">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-cyan-900">List of Achievements</h3>
                <div className="text-sm text-cyan-600">Contact: record@university.edu</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-cyan-200">
              <p className="text-cyan-800 mb-4">
                Please list up to four achievements that may include:
              </p>
              
              <div className="space-y-2 mb-6 text-cyan-700">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Co-curricular activities</li>
                  <li>Non-academic activities (e.g., social work, competitive sports)</li>
                  <li>International Olympiad medals</li>
                  <li>National-level representations</li>
                  <li>Leadership positions</li>
                  <li>Relevant work experience or internships</li>
                  <li>Significant projects or contributions</li>
                </ul>
              </div>

              <div className="bg-cyan-50/50 border border-cyan-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-cyan-800">
                  <span className="font-medium">Note:</span> If you have no achievements to report, 
                  please select <span className="inline-block bg-cyan-100 px-2 py-1 text-xs rounded text-cyan-700">Not Applicable</span>
                </p>
              </div>
            </div>

            <AchievementList
              achievements={achievements}
              onAdd={() => {
                setNewAchievement({
                  activity: '',
                  level: '',
                  levelOfAchievement: '',
                  positionHeld: '',
                  organizationName: '',
                  fromDate: '',
                  toDate: '',
                  description: '',
                });
                setShowModal(true);
              }}
              onEdit={handleEdit}
              max={4}
              hasNoAchievements={hasNoAchievements}
              onToggleNoAchievements={handleToggleNoAchievements}
            />
          </div>
        </div>
      </div>

      <AchievementModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitAchievement}
        newAchievement={newAchievement}
        setNewAchievement={setNewAchievement}
        referenceContact={referenceContact}
        setReferenceContact={setReferenceContact}
      />
    </div>
  );
};