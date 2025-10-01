import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  menteeName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, menteeName }) => {
  const [password, setPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const correctPassword = "SAGA";

  useEffect(() => {
    if (isOpen) {
      setPassword('');
    }
  }, [isOpen]);

  useEffect(() => {
    setIsPasswordCorrect(password === correctPassword);
  }, [password]);
  
  const handleConfirm = () => {
    if (isPasswordCorrect) {
      onConfirm();
    }
  }

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
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <div className="flex flex-col items-center text-center">
                <div className="bg-red-100 p-3 rounded-full">
                    <AlertTriangle className="text-red-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold mt-4">Deletar Usuário</h2>
                <p className="mt-2 text-gray-600">
                    Você tem certeza que deseja deletar <strong>{menteeName}</strong>? Esta ação é irreversível.
                </p>
                <div className="w-full mt-6">
                    <label htmlFor="delete-password" className="block text-sm font-medium text-gray-700 text-left">
                        Digite a senha para confirmar
                    </label>
                    <input
                        id="delete-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        placeholder="Senha"
                    />
                </div>
                 <div className="flex w-full space-x-4 mt-6">
                     <button
                        type="button"
                        onClick={onClose}
                        className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!isPasswordCorrect}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed"
                      >
                        Confirmar Deleção
                      </button>
                 </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;