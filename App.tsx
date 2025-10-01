import React, { useState, useMemo, FC, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Users, CheckCircle, Search, Wifi, WifiOff, Award, UserPlus, X, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

import { useMentees } from './hooks/useMentees';
import { Mentee, TaskStatus, ChecklistFunil } from './types';

import MenteeCard from './components/MenteeCard';
import MenteeDetailsModal from './components/MenteeDetailsModal';
import StatCard from './components/StatCard';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';


// Add/Edit Person Modal Component
interface AddPersonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddPerson: (personData: Omit<Mentee, 'id'>) => void;
    isMentor: boolean;
}

const AddPersonModal: FC<AddPersonModalProps> = ({ isOpen, onClose, onAddPerson, isMentor }) => {
    const [name, setName] = useState('');
    const [instagram, setInstagram] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const correctPassword = "SAGA";

    const handleSubmit = () => {
        if (password !== correctPassword) {
            setError("Senha incorreta.");
            return;
        }
        if (!name.trim()) {
            setError("O nome é obrigatório.");
            return;
        }

        onAddPerson({
            nome: name,
            instagram: instagram,
            mentor: null,
            reunioes: { "1": false, "2": false, "3": false, "4": false, "5": false },
            reuniaoSeguinte: null,
            tarefas: [],
            observacoes: [],
            isMentor: isMentor,
            cacheInicial: 0,
            cacheAtual: 0,
            dataEntrada: null,
            checklistFunil: {
              reuniaoInicial: false,
              propostaIrresistivel: false,
              roteirizouAnuncios: false,
              cursoTrafego: false,
              aulasEssenciais: false,
              storytelling: false,
              validouProposta: false,
              criativosSaga: false,
              subiuCampanha: false,
              fechandoPacotes: false,
            },
        });
        handleClose();
    };
    
    const handleClose = () => {
        setName('');
        setInstagram('');
        setPassword('');
        setError('');
        onClose();
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative text-gray-800"
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold">{isMentor ? 'Adicionar Novo Mentor' : 'Adicionar Novo Mentorado'}</h2>
                        <div className="space-y-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Instagram</label>
                                <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Senha de Confirmação</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Senha de confirmação" />
                            </div>
                        </div>
                         {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                        <div className="mt-6 flex justify-end">
                            <button onClick={handleSubmit} className="px-4 py-2 bg-brand-accent text-white rounded-md hover:bg-blue-700">
                                Adicionar
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


function App() {
  const {
    people,
    loading,
    error,
    isConnectedToSheets,
    updatePerson,
    deletePerson,
    addPerson,
    loadMenteesFromData,
  } = useMentees();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Mentee | null>(null);
  const [personToDelete, setPersonToDelete] = useState<Mentee | null>(null);
  const [activeMentorFilter, setActiveMentorFilter] = useState<string | null>(null);
  const [activeReunionFilter, setActiveReunionFilter] = useState<number | null>(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isAddingMentor, setIsAddingMentor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const { mentees, mentors } = useMemo(() => {
    const mentees = people.filter(p => !p.isMentor);
    const mentors = people.filter(p => p.isMentor);
    return { mentees, mentors };
  }, [people]);

  const mentorOptions = useMemo(() => mentors.map(m => m.nome), [mentors]);

  const filteredPeople = useMemo(() => {
    // Start with all people and apply the search filter
    let result = people.filter(person => {
      const searchLower = searchTerm.toLowerCase();
      return (
        person.nome.toLowerCase().includes(searchLower) ||
        person.instagram.toLowerCase().includes(searchLower)
      );
    });

    // If a specific mentor or meeting filter is active, we only want to see mentees that match.
    const isAnyFilterActive = activeMentorFilter || activeReunionFilter;

    if (isAnyFilterActive) {
      // Exclude all mentors from the result if any filter is on
      result = result.filter(person => !person.isMentor); 
      
      if (activeMentorFilter) {
        result = result.filter(person => person.mentor === activeMentorFilter);
      }
      
      if (activeReunionFilter) {
        // We can safely cast person here because we've already filtered out mentors.
        result = result.filter(person => person.reunioes[activeReunionFilter!]);
      }
    }
    
    return result;
  }, [people, searchTerm, activeMentorFilter, activeReunionFilter]);
  
  const { completedMenteesCount } = useMemo(() => {
    const count = mentees.filter(mentee => {
      const allMeetingsDone = Object.values(mentee.reunioes).every(status => status === true);
      const allChecklistDone = Object.values(mentee.checklistFunil).every(status => status === true);
      return allMeetingsDone && allChecklistDone;
    }).length;

    return {
      completedMenteesCount: count,
    };
  }, [mentees]);

  const handleSelectPerson = (person: Mentee) => {
    setSelectedPerson(person);
  };

  const handleCloseModal = () => {
    setSelectedPerson(null);
  };
  
  const toggleMentorFilter = (mentor: string) => {
      setActiveMentorFilter(prev => prev === mentor ? null : mentor);
  }

  const toggleReunionFilter = (reunionNum: number) => {
      setActiveReunionFilter(prev => prev === reunionNum ? null : reunionNum);
  }

  const openAddModal = (isMentor: boolean) => {
    setIsAddingMentor(isMentor);
    setAddModalOpen(true);
  }
  
  const handleConfirmDelete = () => {
    if (personToDelete) {
      deletePerson(personToDelete.id);
      setPersonToDelete(null);
    }
  };
  
  const handleImportClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const binaryStr = event.target?.result;
              
              // By using the ESM module of XLSX, we can call its methods directly.
              const workbook = XLSX.read(binaryStr, { type: 'binary' });
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
              const jsonData = XLSX.utils.sheet_to_json(worksheet);
              
              const defaultChecklist: ChecklistFunil = {
                  reuniaoInicial: false, propostaIrresistivel: false, roteirizouAnuncios: false,
                  cursoTrafego: false, aulasEssenciais: false, storytelling: false, validouProposta: false,
                  criativosSaga: false, subiuCampanha: false, fechandoPacotes: false,
              };

              const newMentees: Mentee[] = jsonData.map((row: any, index: number) => ({
                  id: Date.now() + index, // Simple unique ID
                  nome: row.nome || 'Nome não informado',
                  instagram: row.instagram || '',
                  mentor: row.mentor || null,
                  cacheInicial: Number(row.cacheInicial) || 0,
                  cacheAtual: Number(row.cacheAtual) || Number(row.cacheInicial) || 0,
                  dataEntrada: row.dataEntrada || null,
                  isMentor: false,
                  // Default values for other properties
                  reunioes: { "1": false, "2": false, "3": false, "4": false, "5": false },
                  reuniaoSeguinte: null,
                  tarefas: [],
                  observacoes: [],
                  checklistFunil: { ...defaultChecklist },
              }));
              
              loadMenteesFromData(newMentees);

          } catch (err) {
              console.error("Erro ao processar o arquivo:", err);
              alert("Ocorreu um erro ao processar a planilha. Verifique o formato do arquivo e das colunas.");
          }
      };
      reader.readAsBinaryString(file);
      
      // Reset file input to allow re-uploading the same file
      e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-text p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Controle de Mentores - SAGA</h1>
              <p className="text-brand-text-secondary mt-1">Acompanhe o progresso e gerencie suas sessões de mentoria</p>
            </div>
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium self-start sm:self-center ${isConnectedToSheets ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {isConnectedToSheets ? <Wifi size={14} /> : <WifiOff size={14} />}
                <span>{isConnectedToSheets ? 'Online' : 'Offline'}</span>
            </div>
        </header>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary" size={20} />
                <input
                    type="text"
                    placeholder="Buscar por nome ou instagram..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-brand-card border border-brand-border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-brand-accent focus:outline-none"
                />
            </div>
            <div className="flex items-center justify-end gap-3 flex-wrap">
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept=".xlsx, .xls"
                 />
                 <button onClick={handleImportClick} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-500 transition-colors">
                    <Upload size={18}/> Importar Planilha
                 </button>
                 <button onClick={() => openAddModal(false)} className="flex items-center gap-2 bg-brand-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-500 transition-colors">
                    <UserPlus size={18}/> Novo Mentorado
                 </button>
                 <button onClick={() => openAddModal(true)} className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-500 transition-colors">
                    <UserPlus size={18}/> Novo Mentor
                 </button>
            </div>
        </div>
        
        <div className="mb-6 space-y-4 p-4 bg-brand-card/50 rounded-lg border border-brand-border">
            <div className="space-y-2">
                <div>
                    <span className="text-sm font-medium text-brand-text-secondary mr-3">Filtrar por Mentor:</span>
                     <div className="inline-flex flex-wrap gap-2">
                         {mentorOptions.map(mentor => (
                             <button
                                key={mentor}
                                onClick={() => toggleMentorFilter(mentor)}
                                className={`px-3 py-1 text-sm rounded-full transition-colors ${activeMentorFilter === mentor ? 'bg-brand-accent text-white' : 'bg-brand-border'}`}
                            >
                                {mentor}
                            </button>
                         ))}
                     </div>
                </div>
                 <div>
                    <span className="text-sm font-medium text-brand-text-secondary mr-3">Filtrar por Reunião Concluída:</span>
                     <div className="inline-flex flex-wrap gap-2">
                         {[1, 2, 3, 4, 5].map(num => (
                             <button
                                key={num}
                                onClick={() => toggleReunionFilter(num)}
                                className={`px-3 py-1 text-sm rounded-full transition-colors w-10 h-10 ${activeReunionFilter === num ? 'bg-brand-accent text-white' : 'bg-brand-card hover:bg-brand-border'}`}
                            >
                                {num}
                            </button>
                         ))}
                     </div>
                </div>
            </div>
        </div>
        
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard icon={Users} label="Total de Mentorados" value={mentees.length} color="#3b82f6" />
            <StatCard icon={Award} label="Total de Mentores" value={mentors.length} color="#f97316" />
            <StatCard icon={CheckCircle} label="Mentorados Concluídos" value={completedMenteesCount} color="#22c55e" />
        </div>

        {loading && <div className="text-center py-8">Carregando...</div>}
        {error && <div className="text-center py-8 text-red-400">Erro ao carregar dados: {error.message}</div>}
        
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {!loading && !error && filteredPeople.map(person => (
                <MenteeCard key={person.id} mentee={person} onSelect={handleSelectPerson} onDeleteRequest={setPersonToDelete}/>
              ))}
            </AnimatePresence>
        </motion.div>
        
        {!loading && filteredPeople.length === 0 && (
            <div className="text-center py-12 text-brand-text-secondary">
                <h3 className="text-xl font-semibold">Nenhum resultado encontrado.</h3>
                <p>Tente ajustar seus filtros ou termo de busca.</p>
            </div>
        )}

      </div>
      
      <MenteeDetailsModal
        mentee={selectedPerson}
        mentorOptions={mentorOptions}
        onClose={handleCloseModal}
        onSave={(updatedMentee) => updatePerson(updatedMentee.id, updatedMentee)}
      />

      <AddPersonModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddPerson={addPerson}
        isMentor={isAddingMentor}
      />
      
      <DeleteConfirmationModal
        isOpen={!!personToDelete}
        onClose={() => setPersonToDelete(null)}
        onConfirm={handleConfirmDelete}
        menteeName={personToDelete?.nome || ''}
      />
    </div>
  );
}

export default App;