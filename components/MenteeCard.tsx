import React from 'react';
import { motion } from 'framer-motion';
import { Mentee, TaskStatus } from '../types';
import ProgressBar from './ProgressBar';
import ChecklistProgressBar from './ChecklistProgressBar';
import { MEETING_LEGENDS } from '../constants';
import { Trash2 } from 'lucide-react';

interface MenteeCardProps {
  mentee: Mentee;
  onSelect: (mentee: Mentee) => void;
  onDeleteRequest: (mentee: Mentee) => void;
}

const MenteeCard: React.FC<MenteeCardProps> = ({ mentee, onSelect, onDeleteRequest }) => {
  const completedTasks = mentee.tarefas.filter(t => t.status === TaskStatus.Completed).length;
  const totalTasks = mentee.tarefas.length;

  const cardBgClass = mentee.isMentor
    ? 'bg-sky-900/50 border-sky-700'
    : 'bg-brand-card border-brand-border';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className={`${cardBgClass} rounded-lg p-5 flex flex-col space-y-4 cursor-pointer hover:border-brand-accent hover:shadow-lg transition-all relative`}
      onClick={() => onSelect(mentee)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDeleteRequest(mentee);
        }}
        className="absolute top-3 right-3 text-brand-text-secondary hover:text-red-500 z-10 p-1 rounded-full hover:bg-brand-border/50 transition-colors"
        aria-label={`Deletar ${mentee.nome}`}
        title={`Deletar ${mentee.nome}`}
      >
        <Trash2 size={16} />
      </button>
      
      <div>
        <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-brand-text truncate">{mentee.nome}</h3>
            {mentee.isMentor && (
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-sky-500 text-white flex-shrink-0">MENTOR</span>
            )}
        </div>
        <p className="text-sm text-brand-accent">{mentee.instagram}</p>
      </div>
      {!mentee.isMentor && (
        <p className="text-sm text-brand-text-secondary">
          <span className="font-semibold">Último Mentor:</span> {mentee.mentor || 'N/A'}
        </p>
      )}
      
      {!mentee.isMentor && (
          <div className="space-y-3">
              <div>
                  <p className="text-xs text-brand-text-secondary mb-2">Reuniões Concluídas</p>
                  <div className="flex space-x-2">
                    {Object.keys(MEETING_LEGENDS).map((reuniaoNum) => (
                      <div
                        key={`completed-${reuniaoNum}`}
                        title={MEETING_LEGENDS[reuniaoNum]}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${mentee.reunioes[reuniaoNum] ? 'bg-green-500' : 'bg-gray-600'}`}
                      >
                        {reuniaoNum}
                      </div>
                    ))}
                  </div>
              </div>
              <div>
                 <p className="text-xs text-brand-text-secondary mb-2">Próxima Reunião</p>
                 <div className="flex space-x-2">
                    {Object.keys(MEETING_LEGENDS).map((reuniaoNum) => {
                         const num = parseInt(reuniaoNum, 10);
                         return (
                             <div
                                key={`next-${reuniaoNum}`}
                                title={MEETING_LEGENDS[reuniaoNum]}
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${mentee.reuniaoSeguinte === num ? 'bg-brand-accent' : 'bg-gray-600'}`}
                              >
                                {reuniaoNum}
                            </div>
                         )
                    })}
                  </div>
              </div>
          </div>
      )}

      {!mentee.isMentor && (
        <div className="pt-4 mt-4 border-t border-brand-border/50 space-y-4">
            <ChecklistProgressBar checklist={mentee.checklistFunil} />
        
            <div className="flex justify-between text-sm">
                <div className="text-center">
                    <p className="text-xs text-brand-text-secondary">Cachê Inicial</p>
                    <p className="font-bold text-brand-text">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mentee.cacheInicial)}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-brand-text-secondary">Cachê Atual</p>
                    <p className="font-bold text-green-400">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mentee.cacheAtual)}
                    </p>
                </div>
            </div>
        </div>
      )}


      {totalTasks > 0 && <ProgressBar completed={completedTasks} total={totalTasks} />}
    </motion.div>
  );
};

export default MenteeCard;