import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;      // Action for "Continue Editing"
  onSave: () => void;       // Action for "Save and Exit"
  onDiscard: () => void;    // Action for "Exit Without Saving"
}

const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({ isOpen, onClose, onSave, onDiscard }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative text-gray-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
                <div className="bg-yellow-100 p-3 rounded-full">
                    <AlertTriangle className="text-yellow-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold mt-4">Alterações Não Salvas</h2>
                <p className="mt-2 text-gray-600">
                    Você tem alterações não salvas. Deseja salvá-las antes de sair?
                </p>
                 <div className="flex w-full space-x-4 mt-8">
                     <button
                        type="button"
                        onClick={onDiscard}
                        className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Sair sem Salvar
                      </button>
                      <button
                        type="button"
                        onClick={onSave}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Salvar e Sair
                      </button>
                 </div>
                 <button
                    type="button"
                    onClick={onClose}
                    className="mt-4 text-sm font-medium text-gray-600 hover:text-gray-800"
                 >
                    Continuar Editando
                 </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UnsavedChangesModal;
