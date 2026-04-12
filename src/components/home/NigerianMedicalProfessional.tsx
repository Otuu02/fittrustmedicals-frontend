// src/components/home/NigerianMedicalProfessional.tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

// Add actual images of Nigerian medical professionals to your public folder
// or use stock photos with proper licensing

export default function NigerianMedicalProfessional() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="relative mt-4"
    >
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white">
          {/* Replace with actual image of Nigerian medical professional */}
          <div className="w-full h-full bg-gradient-to-br from-yellow-600 to-brown-600 flex items-center justify-center text-white text-lg font-bold">
            Dr
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold">Dr. Adeola Ogunlesi</p>
          <p className="text-[10px] text-white/70">Chief Medical Officer</p>
        </div>
        <div className="text-xl">🇳🇬</div>
      </div>
    </motion.div>
  );
}