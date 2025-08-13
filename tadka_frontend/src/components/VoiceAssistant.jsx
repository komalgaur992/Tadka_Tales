import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MicrophoneIcon, 
  SpeakerWaveIcon,
  XMarkIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline'
import { useLanguage } from './LanguageProvider'

const VoiceAssistant = ({ isActive, onToggle }) => {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const { t, language } = useLanguage()

  // Mock voice recognition (replace with actual Web Speech API)
  const startListening = () => {
    setIsListening(true)
    setTranscript('')
    
    // Simulate voice recognition
    setTimeout(() => {
      setTranscript(language === 'en' ? 'I want to cook butter chicken' : 'मैं बटर चिकन बनाना चाहता हूं')
      setIsListening(false)
    }, 3000)
  }

  const stopListening = () => {
    setIsListening(false)
  }

  const startSpeaking = () => {
    setIsSpeaking(true)
    // Simulate text-to-speech
    setTimeout(() => {
      setIsSpeaking(false)
    }, 2000)
  }

  const closeAssistant = () => {
    setIsListening(false)
    setIsSpeaking(false)
    setTranscript('')
    onToggle()
  }

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-large border border-gray-200 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <SpeakerWaveIcon className="w-4 h-4" />
                </div>
                <span className="font-semibold">{t('voiceAssistant')}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeAssistant}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Status */}
            <div className="mb-4">
              {isListening && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="flex items-center space-x-2 text-primary-600"
                >
                  <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">{t('listening')}</span>
                </motion.div>
              )}
              {isSpeaking && (
                <div className="flex items-center space-x-2 text-secondary-600">
                  <SpeakerWaveIcon className="w-4 h-4 animate-pulse" />
                  <span className="text-sm font-medium">Speaking...</span>
                </div>
              )}
            </div>

            {/* Transcript */}
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-gray-50 rounded-lg"
              >
                <p className="text-sm text-gray-700">{transcript}</p>
              </motion.div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              {!isListening && !isSpeaking && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startListening}
                  className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <MicrophoneIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">{t('startVoice')}</span>
                </motion.button>
              )}

              {isListening && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopListening}
                  className="flex items-center space-x-2 bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors"
                >
                  <PauseIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">{t('stopVoice')}</span>
                </motion.button>
              )}

              {transcript && !isSpeaking && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startSpeaking}
                  className="flex items-center space-x-2 bg-secondary-500 text-white px-4 py-2 rounded-lg hover:bg-secondary-600 transition-colors"
                >
                  <PlayIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Respond</span>
                </motion.button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Quick Actions:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  language === 'en' ? 'Start cooking' : 'खाना बनाना शुरू करें',
                  language === 'en' ? 'Next step' : 'अगला कदम',
                  language === 'en' ? 'Repeat instruction' : 'निर्देश दोहराएं'
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs bg-gray-100 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors"
                  >
                    {action}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default VoiceAssistant
