
import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  completed: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-1 text-xs text-brand-text-secondary">
        <span>Progresso</span>
        <span>{completed}/{total} tarefas</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <motion.div
          className="bg-green-500 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
