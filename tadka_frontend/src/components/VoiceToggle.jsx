import React from 'react'
import { motion } from 'framer-motion'
import { MicrophoneIcon } from '@heroicons/react/24/outline'
import { useLanguage } from './LanguageProvider'

const VoiceToggle = ({ onToggle, isActive }) => {
  const { t } = useLanguage()

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onToggle}
      className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-large z-40 transition-all duration-200 ${
        isActive 
          ? 'bg-accent-500 text-white animate-pulse' 
          : 'bg-primary-500 text-white hover:bg-primary-600'
      }`}
      title={t('voiceAssistant')}
    >
      <MicrophoneIcon className="w-6 h-6 mx-auto" />
    </motion.button>
  )
}

export default VoiceToggle
