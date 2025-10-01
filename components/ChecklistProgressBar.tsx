import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { ChecklistFunil } from '../types';

interface ChecklistProgressBarProps {
  checklist: ChecklistFunil;
}

const ChecklistProgressBar: React.FC<ChecklistProgressBarProps> = ({ checklist }) => {
  const totalSteps = Object.keys(checklist).length;
  const completedSteps = Object.values(checklist).filter(Boolean).length;
  const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div>
      <h4 className="text-sm font-semibold text-brand-text mb-2 flex items-center gap-2">
        <TrendingUp size={18} className="text-brand-accent" />
        Progresso
      </h4>
      <div className="flex justify-between items-center mb-1 text-sm text-brand-text-secondary">
        <span>{completedSteps}/{totalSteps} etapas</span>
        <span className="font-bold text-brand-text">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <motion.div
          className="bg-brand-accent h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default ChecklistProgressBar;
