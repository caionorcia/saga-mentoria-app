import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, FileText, ClipboardCheck } from 'lucide-react';
import { Mentee } from '../types';

interface NeuroscientificReportProps {
  mentee: Mentee;
  onBack: () => void;
}

const NeuroscientificReport: React.FC<NeuroscientificReportProps> = ({ mentee, onBack }) => {

  const parseName = (fullName: string) => {
    const match = fullName.match(/(.*?)\s*\((.*?)\)/);
    if (match) {
      return {
        nomeCompleto: match[1].trim(),
        nomeArtistico: match[2].trim()
      };
    }
    return {
      nomeCompleto: fullName,
      nomeArtistico: 'N/A'
    };
  };
  
  const { nomeCompleto, nomeArtistico } = parseName(mentee.nome);
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) {
      return 'Não definida';
    }
    // Input type="date" gives YYYY-MM-DD. Parsing this with new Date() can lead to timezone issues.
    // Adding time and accounting for timezone offset ensures it's parsed as the intended local date.
    const date = new Date(dateString);
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return utcDate.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const reportPlaceholder = `Digite aqui o relatório neurocientífico completo do mentorado... Sugestões de tópicos para abordar:
• Perfil comportamental observado
• Padrões cognitivos identificados
• Aspectos emocionais relevantes
• Estratégias recomendadas de mentoria
• Potenciais bloqueios ou dificuldades
• Pontos fortes a serem desenvolvidos
• Recomendações específicas para o mentor
• Observações sobre progresso e evolução
• Sugestões de abordagens personalizadas`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-gray-100 text-gray-800 p-6 overflow-y-auto flex flex-col"
    >
        <header className="flex justify-between items-center mb-6 flex-shrink-0">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Relatório Neurocientífico</h1>
                    <p className="text-gray-500">Avaliação Comportamental por Dra. Larissa Galli, Neurocientista</p>
                </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                <Save size={18} /> Salvar Relatório
            </button>
        </header>

        <main className="space-y-6 flex-grow">
            {/* Patient Info Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <FileText size={28} className="text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Informações do Paciente</h2>
                        <p className="text-gray-500">Dados básicos para contexto do relatório</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Nome Completo</p>
                        <p className="text-lg font-semibold text-gray-900">{nomeCompleto}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Nome Artístico</p>
                        <p className="text-lg font-semibold text-gray-900">{nomeArtistico}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Data de Entrada</p>
                        <p className="text-lg font-semibold text-gray-900">{formatDate(mentee.dataEntrada)}</p>
                    </div>
                </div>
            </div>

            {/* Assessment Card */}
            <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-200 rounded-full">
                        <ClipboardCheck size={28} className="text-green-700" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-green-800">Avaliação Neurocientífica Completa</h2>
                        <p className="text-green-700 font-medium">Responsável: Dra. Larissa Galli, Neurocientista Comportamental</p>
                    </div>
                </div>
                <div className="mt-6 border-t border-green-200 pt-6">
                    <h3 className="font-semibold text-gray-700 mb-2">Relatório Detalhado - Análise Comportamental e Cognitiva</h3>
                    <div className="bg-white p-4 rounded-md border border-gray-200 text-sm text-gray-600 mb-4">
                        <strong>Instruções:</strong> Documente aqui observações sobre padrões comportamentais, aspectos cognitivos, recomendações terapêuticas e estratégias de desenvolvimento baseadas na avaliação neurocientífica do mentorado.
                    </div>
                    <textarea
                        rows={15}
                        className="w-full p-4 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm bg-brand-card text-brand-text border-brand-border placeholder-brand-text-secondary"
                        placeholder={reportPlaceholder}
                    ></textarea>
                </div>
            </div>
        </main>
    </motion.div>
  );
};

export default NeuroscientificReport;