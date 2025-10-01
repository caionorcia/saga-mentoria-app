
import React from 'react';
import { motion } from 'framer-motion';
import { Icon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color }) => {
  return (
    <motion.div
      className="bg-brand-card border border-brand-border rounded-lg p-4 flex items-center space-x-4"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className={`p-3 rounded-full`} style={{ backgroundColor: color, color: '#fff' }}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-brand-text-secondary text-sm">{label}</p>
        <p className="text-brand-text text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
