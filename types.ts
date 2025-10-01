export enum TaskStatus {
  Completed = "Concluída",
  InProgress = "Em Andamento",
  NotStarted = "Não Iniciada",
}

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  createdAt: string; // ISO string
}

export interface Observation {
  id: string;
  date: string; // ISO string
  mentor: string;
  text: string;
}

export interface ChecklistFunil {
  reuniaoInicial: boolean;
  propostaIrresistivel: boolean;
  roteirizouAnuncios: boolean;
  cursoTrafego: boolean;
  aulasEssenciais: boolean;
  storytelling: boolean;
  validouProposta: boolean;
  criativosSaga: boolean;
  subiuCampanha: boolean;
  fechandoPacotes: boolean;
}

export interface Mentee {
  id: number;
  nome: string;
  instagram: string;
  mentor: string | null;
  reunioes: { [key: string]: boolean };
  reuniaoSeguinte: number | null;
  tarefas: Task[];
  observacoes: Observation[];
  isMentor: boolean;
  cacheInicial: number;
  cacheAtual: number;
  checklistFunil: ChecklistFunil;
  dataEntrada: string | null; // YYYY-MM-DD format
}