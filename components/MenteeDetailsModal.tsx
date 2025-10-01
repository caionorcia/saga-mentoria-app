import React, { useState, useEffect, FC, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Save, Plus, Calendar, User, ListChecks, ClipboardList, Eye } from 'lucide-react';
import { Mentee, Task, TaskStatus, Observation, ChecklistFunil } from '../types';
import { MEETING_LEGENDS, CHECKLIST_FUNIL_ITEMS, CHECKLIST_FUNIL_ORDER, TASK_STATUS_OPTIONS } from '../constants';
import PasswordPromptModal from './PasswordPromptModal';
import NeuroscientificReport from './NeuroscientificReport';
import UnsavedChangesModal from './UnsavedChangesModal';

interface MenteeDetailsModalProps {
  mentee: Mentee | null;
  mentorOptions: string[];
  onClose: () => void;
  onSave: (updatedMentee: Mentee) => void;
}

const Section: FC<{ title: string, icon: React.ElementType, children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
      <div className="pt-6">
        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-3 mb-4 flex items-center gap-3">
          <Icon className="text-gray-500" size={22} />
          {title}
        </h3>
        {children}
      </div>
  );

const MenteeDetailsModal: FC<MenteeDetailsModalProps> = ({ mentee, mentorOptions, onClose, onSave }) => {
  const [editedMentee, setEditedMentee] = useState<Mentee | null>(null);
  const [newObservation, setNewObservation] = useState('');
  const [newTask, setNewTask] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState(false);

  const [observationToDelete, setObservationToDelete] = useState<string | null>(null);
  const [isDeletePasswordModalOpen, setDeletePasswordModalOpen] = useState(false);
  const [showReportPasswordModal, setShowReportPasswordModal] = useState(false);
  const [isReportVisible, setIsReportVisible] = useState(false);
  
  const initialMenteeState = useRef<string | null>(null);

  useEffect(() => {
    if (mentee) {
      const menteeString = JSON.stringify(mentee);
      setEditedMentee(JSON.parse(menteeString));
      initialMenteeState.current = menteeString;
      setIsReportVisible(false); // Reset report view
    } else {
      setEditedMentee(null);
      initialMenteeState.current = null;
    }
     setHasUnsavedChanges(false); // Reset on mentee change
  }, [mentee]);

  useEffect(() => {
    if (editedMentee && initialMenteeState.current) {
        setHasUnsavedChanges(JSON.stringify(editedMentee) !== initialMenteeState.current);
    } else {
        setHasUnsavedChanges(false);
    }
  }, [editedMentee]);


  const handleSave = () => {
    if (editedMentee) {
      onSave(editedMentee);
      onClose();
    }
  };
  
  const handleCloseAttempt = () => {
    if (hasUnsavedChanges) {
      setIsUnsavedChangesModalOpen(true);
    } else {
      onClose();
    }
  };

  const handleSaveAndExit = () => {
    if (editedMentee) {
      onSave(editedMentee);
    }
    setIsUnsavedChangesModalOpen(false);
    onClose();
  };

  const handleDiscardAndExit = () => {
    setIsUnsavedChangesModalOpen(false);
    onClose();
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let finalValue: string | number | null = value;

    if (name === 'cacheInicial' || name === 'cacheAtual') {
        finalValue = value === '' ? 0 : Number(value);
    }
    if (name === 'dataEntrada' && value === '') {
        finalValue = null;
    }
    
    setEditedMentee(prev => prev ? { ...prev, [name]: finalValue } : null);
  };
  
  const handleMeetingChange = (reuniaoNum: string) => {
    setEditedMentee(prev => {
        if (!prev) return null;
        const newReunioes = { ...prev.reunioes, [reuniaoNum]: !prev.reunioes[reuniaoNum] };
        return { ...prev, reunioes: newReunioes };
    });
  };

  const handleNextMeetingChange = (reuniaoNum: number) => {
    setEditedMentee(prev => {
        if (!prev) return null;
        const newNextMeeting = prev.reuniaoSeguinte === reuniaoNum ? null : reuniaoNum;
        return { ...prev, reuniaoSeguinte: newNextMeeting };
    });
  };

  const handleChecklistChange = (item: keyof ChecklistFunil) => {
    setEditedMentee(prev => {
        if (!prev) return null;
        const newChecklist = { ...prev.checklistFunil, [item]: !prev.checklistFunil[item] };
        return { ...prev, checklistFunil: newChecklist };
    });
  };

  const handleAddTask = () => {
    if (newTask.trim() && editedMentee) {
      const task: Task = {
        id: `task-${Date.now()}`,
        name: newTask.trim(),
        status: TaskStatus.NotStarted,
        createdAt: new Date().toISOString(),
      };
      setEditedMentee(prev => prev ? { ...prev, tarefas: [...prev.tarefas, task] } : null);
      setNewTask('');
    }
  };

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setEditedMentee(prev => {
      if (!prev) return null;
      const updatedTasks = prev.tarefas.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      return { ...prev, tarefas: updatedTasks };
    });
  };

  const handleRemoveTask = (taskId: string) => {
    setEditedMentee(prev => {
      if (!prev) return null;
      const updatedTasks = prev.tarefas.filter(task => task.id !== taskId);
      return { ...prev, tarefas: updatedTasks };
    });
  };
  
  const handleAddObservation = () => {
    if (newObservation.trim() && editedMentee && editedMentee.mentor) {
        const observation: Observation = {
            id: `obs-${Date.now()}`,
            date: new Date().toISOString(),
            mentor: editedMentee.mentor,
            text: newObservation.trim()
        };
        setEditedMentee(prev => prev ? { ...prev, observacoes: [observation, ...prev.observacoes] } : null);
        setNewObservation('');
    }
  };
  
  const handleRequestRemoveObservation = (observationId: string) => {
    setObservationToDelete(observationId);
    setDeletePasswordModalOpen(true);
  };

  const handleConfirmRemoveObservation = () => {
    if (observationToDelete) {
      setEditedMentee(prev => {
          if (!prev) return null;
          const updatedObservations = prev.observacoes.filter(obs => obs.id !== observationToDelete);
          return { ...prev, observacoes: updatedObservations };
      });
    }
    setObservationToDelete(null); // clean up state
  };


  if (!mentee) return null;

  const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const btnPrimary = "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed";
  const btnSecondary = "px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors";
  
  const isMentorSelected = !!editedMentee?.mentor;

  return (
    <AnimatePresence>
      {mentee && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40 p-4" onClick={handleCloseAttempt}>
          <motion.div 
            layout
            initial={{ y: -50, opacity: 0, scale: 0.95 }} 
            animate={{ y: 0, opacity: 1, scale: 1 }} 
            exit={{ y: 50, opacity: 0, scale: 0.95 }} 
            transition={{ type: "spring", stiffness: 300, damping: 30 }} 
            className={`bg-white rounded-lg shadow-xl flex flex-col ${isReportVisible ? 'w-full max-w-6xl h-[95vh]' : 'w-full max-w-3xl max-h-[90vh]'} relative overflow-hidden`} 
            onClick={e => e.stopPropagation()}
          >
            {isReportVisible && editedMentee ? (
              <NeuroscientificReport mentee={editedMentee} onBack={() => setIsReportVisible(false)} />
            ) : editedMentee && (
              <>
                <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{editedMentee.isMentor ? 'Editar Mentor' : 'Editar Mentorado'}</h2>
                        <p className="text-sm text-gray-500">{editedMentee.nome}</p>
                    </div>
                     <div className="flex items-center gap-4">
                        {!editedMentee.isMentor && (
                            <button
                                onClick={() => setShowReportPasswordModal(true)}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-semibold"
                            >
                                Relatório
                            </button>
                        )}
                        <button onClick={handleCloseAttempt} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    </div>
                </div>
                
                <div className="p-6 text-gray-800 overflow-y-auto">
                    {editedMentee.isMentor ? (
                        <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                              <input type="text" name="nome" value={editedMentee.nome} onChange={handleChange} className={inputStyle} />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Instagram</label>
                              <input type="text" name="instagram" value={editedMentee.instagram} onChange={handleChange} className={inputStyle} />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 divide-y divide-gray-200">
                            <Section title="Informações Gerais" icon={User}>
                               <div className="space-y-4 pt-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                                        <input type="text" name="nome" value={editedMentee.nome} onChange={handleChange} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Instagram</label>
                                        <input type="text" name="instagram" value={editedMentee.instagram} onChange={handleChange} className={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Mentor</label>
                                        <select name="mentor" value={editedMentee.mentor || ''} onChange={handleChange} className={inputStyle}>
                                            <option value="">Nenhum</option>
                                            {mentorOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Data de Entrada</label>
                                        <input type="date" name="dataEntrada" value={editedMentee.dataEntrada || ''} onChange={handleChange} className={inputStyle} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cachê Inicial</label>
                                            <input type="number" name="cacheInicial" value={editedMentee.cacheInicial} onChange={handleChange} className={inputStyle} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cachê Atual</label>
                                            <input type="number" name="cacheAtual" value={editedMentee.cacheAtual} onChange={handleChange} className={inputStyle} />
                                        </div>
                                    </div>
                               </div>
                            </Section>

                            <Section title="Controle de Reuniões" icon={Calendar}>
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-2">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="font-bold text-gray-800">Reuniões Feitas</h4>
                                            <p className="text-sm text-gray-500 mb-4">Marque as reuniões já realizadas</p>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                {Object.keys(MEETING_LEGENDS).map((reuniaoNum) => (
                                                    <button key={`completed-${reuniaoNum}`} onClick={() => handleMeetingChange(reuniaoNum)} title={MEETING_LEGENDS[reuniaoNum]} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${editedMentee.reunioes[reuniaoNum] ? 'bg-green-500 focus:ring-green-400' : 'bg-gray-300 hover:bg-gray-400 focus:ring-gray-400'}`}>
                                                        {reuniaoNum}
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-3">{Object.values(editedMentee.reunioes).filter(Boolean).length} de 5 marcadas</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">Reunião Seguinte</h4>
                                            <p className="text-sm text-gray-500 mb-4">Marque qual será a próxima reunião</p>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                {Object.keys(MEETING_LEGENDS).map((reuniaoNumStr) => {
                                                    const reuniaoNum = parseInt(reuniaoNumStr, 10);
                                                    return (
                                                        <button key={`next-${reuniaoNum}`} onClick={() => handleNextMeetingChange(reuniaoNum)} title={MEETING_LEGENDS[reuniaoNumStr]} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${editedMentee.reuniaoSeguinte === reuniaoNum ? 'bg-blue-500 focus:ring-blue-400' : 'bg-gray-300 hover:bg-gray-400 focus:ring-gray-400'}`}>
                                                            {reuniaoNumStr}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-3">{editedMentee.reuniaoSeguinte ? '1' : '0'} de 5 marcadas</p>
                                        </div>
                                    </div>
                                </div>
                            </Section>

                            <Section title="Checklist de Etapas do Funil" icon={ListChecks}>
                                <div className="space-y-2 max-h-80 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-2">
                                    {CHECKLIST_FUNIL_ORDER.map(key => (
                                        <div key={key} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100">
                                            <label htmlFor={key} className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                                                {CHECKLIST_FUNIL_ITEMS[key]}
                                            </label>
                                            <input id={key} type="checkbox" checked={!!editedMentee.checklistFunil[key]} onChange={() => handleChecklistChange(key)} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"/>
                                        </div>
                                    ))}
                                </div>
                            </Section>

                            <Section title="Tarefas" icon={ClipboardList}>
                                <div className="max-h-80 flex flex-col mt-2">
                                    <div className="flex gap-2 mb-4">
                                        <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Nova tarefa..." className={`flex-grow ${inputStyle}`} onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}/>
                                        <button onClick={handleAddTask} className="px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"><Plus size={16}/></button>
                                    </div>
                                    <div className="space-y-3 overflow-y-auto pr-2 flex-1">
                                        {editedMentee.tarefas.map((task, index) => (
                                            <div key={task.id} className="flex items-start justify-between p-3 rounded-md bg-gray-50 border border-gray-200">
                                              <div className="flex-grow pr-4">
                                                  <p className={`text-sm font-medium ${task.status === TaskStatus.Completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>{index + 1}. {task.name}</p>
                                                  <p className="text-xs text-gray-500 mt-1">
                                                      Adicionada em: {new Date(task.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                                  </p>
                                              </div>
                                              <div className="flex items-center gap-2 flex-shrink-0">
                                                  <select 
                                                      value={task.status} 
                                                      onChange={(e) => handleTaskStatusChange(task.id, e.target.value as TaskStatus)} 
                                                      className="text-xs rounded border-gray-600 bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 py-1"
                                                      aria-label={`Status for task ${task.name}`}
                                                  >
                                                      {TASK_STATUS_OPTIONS.map(status => <option key={status} value={status} className="bg-gray-700 text-white">{status}</option>)}
                                                  </select>
                                                  <button onClick={() => handleRemoveTask(task.id)} className="text-gray-400 hover:text-red-500 p-1" aria-label={`Remove task ${task.name}`}>
                                                      <Trash2 size={16}/>
                                                  </button>
                                              </div>
                                            </div>
                                        ))}
                                        {editedMentee.tarefas.length === 0 && <p className="text-center text-sm text-gray-500 py-4">Nenhuma tarefa adicionada.</p>}
                                    </div>
                                </div>
                            </Section>

                            <Section title="Observações" icon={Eye}>
                                <div className="max-h-80 flex flex-col mt-2">
                                    <div className="mb-4">
                                        <textarea 
                                            value={newObservation} 
                                            onChange={(e) => setNewObservation(e.target.value)} 
                                            placeholder={isMentorSelected ? "Adicionar nova observação..." : "Selecione um Mentor para adicionar uma observação..."} 
                                            rows={3} 
                                            className={`w-full ${inputStyle}`}
                                            disabled={!isMentorSelected}
                                        />
                                        <button 
                                            onClick={handleAddObservation} 
                                            className={`${btnPrimary} mt-2`}
                                            disabled={!isMentorSelected || !newObservation.trim()}
                                        >
                                            Adicionar Observação
                                        </button>
                                    </div>
                                    <div className="space-y-3 overflow-y-auto pr-2 flex-1">
                                        {editedMentee.observacoes.map(obs => (
                                            <div key={obs.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-start gap-2">
                                                <div className="flex-grow">
                                                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{obs.text}</p>
                                                    <div className="text-xs text-gray-500 mt-2 flex justify-between">
                                                        <span>{obs.mentor}</span>
                                                        <span>{new Date(obs.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric'})}</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleRequestRemoveObservation(obs.id)} className="text-gray-400 hover:text-red-500 flex-shrink-0 p-1" title="Remover observação">
                                                    <Trash2 size={16}/>
                                                </button>
                                            </div>
                                        ))}
                                        {editedMentee.observacoes.length === 0 && <p className="text-center text-sm text-gray-500 py-4">Nenhuma observação registrada.</p>}
                                    </div>
                                </div>
                            </Section>
                        </div>
                    )}
                </div>
                
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end items-center flex-shrink-0">
                  <div className="flex space-x-4">
                      <button onClick={handleCloseAttempt} className={btnSecondary}>Cancelar</button>
                      <button onClick={handleSave} className={btnPrimary}>
                          <Save size={18} /> Salvar Alterações
                      </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
      <PasswordPromptModal
        isOpen={isDeletePasswordModalOpen}
        onClose={() => setDeletePasswordModalOpen(false)}
        onConfirm={handleConfirmRemoveObservation}
        title="Confirmar Deleção"
        message="Para deletar esta observação, por favor digite a senha."
      />
      <PasswordPromptModal
        isOpen={showReportPasswordModal}
        onClose={() => setShowReportPasswordModal(false)}
        onConfirm={() => setIsReportVisible(true)}
        title="Acesso ao Relatório"
        message="Para visualizar o relatório neurocientífico, por favor digite a senha."
      />
      <UnsavedChangesModal
        isOpen={isUnsavedChangesModalOpen}
        onClose={() => setIsUnsavedChangesModalOpen(false)}
        onSave={handleSaveAndExit}
        onDiscard={handleDiscardAndExit}
      />
    </AnimatePresence>
  );
};

export default MenteeDetailsModal;