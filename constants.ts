import { TaskStatus, ChecklistFunil } from './types';

export const MEETING_LEGENDS: { [key:string]: string } = {
  '1': 'Diferencial Artístico',
  '2': 'Montar Pacotes',
  '3': 'Roteirizar Anúncios',
  '4': 'Revisão de Funil',
  '5': 'Revisão Geral',
};

export const TASK_STATUS_OPTIONS: TaskStatus[] = [
  TaskStatus.NotStarted,
  TaskStatus.InProgress,
  TaskStatus.Completed,
];

export const CHECKLIST_FUNIL_ITEMS: { [key in keyof ChecklistFunil]: string } = {
  reuniaoInicial: 'Teve Reunião Inicial?',
  propostaIrresistivel: 'Fez a Proposta Irresistível?',
  roteirizouAnuncios: 'Roteirizou Anúncios?',
  cursoTrafego: 'Assistiu o Curso de Tráfego?',
  aulasEssenciais: 'Assistiu Aulas Essenciais?',
  storytelling: 'Fez o Storytelling?',
  validouProposta: 'Validou a Proposta?',
  criativosSaga: 'Fez Criativos método SAGA?',
  subiuCampanha: 'Subiu a Campanha Inicial?',
  fechandoPacotes: 'Está fechando os 3 tipos de Pacotes?',
};

export const CHECKLIST_FUNIL_ORDER: (keyof ChecklistFunil)[] = [
  'reuniaoInicial',
  'storytelling',
  'propostaIrresistivel',
  'validouProposta',
  'roteirizouAnuncios',
  'criativosSaga',
  'cursoTrafego',
  'subiuCampanha',
  'aulasEssenciais',
  'fechandoPacotes',
];