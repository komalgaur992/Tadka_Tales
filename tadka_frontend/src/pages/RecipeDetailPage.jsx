import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  HeartIcon,
  ShareIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useLanguage } from '../components/LanguageProvider'

const RecipeDetailPage = () => {
  const { id } = useParams()
  const { t, language } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Mock recipe data
  const recipe = {
    id: parseInt(id),
    title: 'Butter Chicken',
    titleHi: 'बटर चिकन',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=400&fit=crop',
    time: '45 min',
    difficulty: 'Medium',
    rating: 4.8,
    servings: 4,
    description: 'A rich and creamy Indian curry made with tender chicken pieces in a tomato-based sauce.',
    descriptionHi: 'टमाटर आधारित सॉस में नरम चिकन के टुकड़ों से बनी समृद्ध और क्रीमी भारतीय करी।',
    ingredients: [
      { name: 'Chicken breast', nameHi: 'चिकन ब्रेस्ट', amount: '500g' },
      { name: 'Yogurt', nameHi: 'दही', amount: '1/2 cup' },
      { name: 'Ginger-garlic paste', nameHi: 'अदरक-लहसुन पेस्ट', amount: '2 tbsp' },
      { name: 'Tomato puree', nameHi: 'टमाटर प्यूरी', amount: '1 cup' },
      { name: 'Heavy cream', nameHi: 'हैवी क्रीम', amount: '1/2 cup' },
      { name: 'Butter', nameHi: 'मक्खन', amount: '3 tbsp' },
      { name: 'Spices', nameHi: 'मसाले', amount: 'As needed' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Marinate the chicken',
        titleHi: 'चिकन को मैरीनेट करें',
        description: 'Mix chicken with yogurt, ginger-garlic paste, and spices. Let it marinate for 30 minutes.',
        descriptionHi: 'चिकन को दही, अदरक-लहसुन पेस्ट और मसालों के साथ मिलाएं। इसे 30 मिनट के लिए मैरीनेट करें।',
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
        video: 'https://example.com/video1.mp4'
      },
      {
        step: 2,
        title: 'Cook the chicken',
        titleHi: 'चिकन पकाएं',
        description: 'Grill or pan-fry the marinated chicken until golden brown and cooked through.',
        descriptionHi: 'मैरीनेट किए गए चिकन को गोल्डन ब्राउन और पूरी तरह से पकने तक ग्रिल या पैन-फ्राई करें।',
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
        video: 'https://example.com/video2.mp4'
      },
      {
        step: 3,
        title: 'Prepare the sauce',
        titleHi: 'सॉस तैयार करें',
        description: 'In a pan, heat butter and add tomato puree. Cook until it thickens and oil separates.',
        descriptionHi: 'एक पैन में मक्खन गर्म करें और टमाटर प्यूरी डालें। इसे तब तक पकाएं जब तक यह गाढ़ा न हो जाए और तेल अलग न हो जाए।',
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
        video: 'https://example.com/video3.mp4'
      },
      {
        step: 4,
        title: 'Combine and simmer',
        titleHi: 'मिलाएं और उबालें',
        description: 'Add the cooked chicken to the sauce along with cream. Simmer for 10-15 minutes.',
        descriptionHi: 'सॉस में पका हुआ चिकन क्रीम के साथ डालें। 10-15 मिनट तक उबालें।',
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
        video: 'https://example.com/video4.mp4'
      }
    ]
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const nextStep = () => {
    if (currentStep < recipe.instructions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link to="/recipes" className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Recipes
          </Link>
        </motion.div>

        {/* Recipe Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-soft overflow-hidden mb-8"
        >
          <div className="relative h-64 md:h-96">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-4 right-4 flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleFavorite}
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              >
                {isFavorite ? (
                  <HeartIconSolid className="w-6 h-6 text-red-500" />
                ) : (
                  <HeartIcon className="w-6 h-6 text-gray-600" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              >
                <ShareIcon className="w-6 h-6 text-gray-600" />
              </motion.button>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
                  {language === 'en' ? recipe.title : recipe.titleHi}
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl">
                  {language === 'en' ? recipe.description : recipe.descriptionHi}
                </p>
              </div>
              <div className="mt-4 lg:mt-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg px-8 py-3"
                >
                  {t('startCooking')}
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <ClockIcon className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">{t('prepTime')}</p>
                <p className="font-semibold text-gray-900">{recipe.time}</p>
              </div>
              <div className="text-center">
                <UserGroupIcon className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">{t('servings')}</p>
                <p className="font-semibold text-gray-900">{recipe.servings}</p>
              </div>
              <div className="text-center">
                <StarIcon className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">{t('difficulty')}</p>
                <p className="font-semibold text-gray-900">{recipe.difficulty}</p>
              </div>
              <div className="text-center">
                <StarIcon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Rating</p>
                <p className="font-semibold text-gray-900">{recipe.rating}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="card p-6">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                {t('ingredients')}
              </h2>
              <div className="space-y-4">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">
                      {language === 'en' ? ingredient.name : ingredient.nameHi}
                    </span>
                    <span className="font-semibold text-primary-600">{ingredient.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-gray-900">
                  {t('instructions')}
                </h2>
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlay}
                    className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    {isPlaying ? (
                      <PauseIcon className="w-5 h-5" />
                    ) : (
                      <PlayIcon className="w-5 h-5" />
                    )}
                    <span>{isPlaying ? 'Pause' : 'Start'} Voice Guide</span>
                  </motion.button>
                </div>
              </div>

              {/* Step Navigation */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {t('step')} {currentStep + 1} {t('of')} {recipe.instructions.length}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={previousStep}
                    disabled={currentStep === 0}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeftIcon className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextStep}
                    disabled={currentStep === recipe.instructions.length - 1}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeftIcon className="w-5 h-5 rotate-180" />
                  </motion.button>
                </div>
              </div>

              {/* Current Step */}
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={recipe.instructions[currentStep].image}
                    alt={`Step ${currentStep + 1}`}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <div className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Step {currentStep + 1}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {language === 'en' 
                      ? recipe.instructions[currentStep].title 
                      : recipe.instructions[currentStep].titleHi
                    }
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'en' 
                      ? recipe.instructions[currentStep].description 
                      : recipe.instructions[currentStep].descriptionHi
                    }
                  </p>
                </div>

                {/* Voice Assistant Status */}
                {isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 p-4 bg-primary-50 rounded-lg"
                  >
                    <SpeakerWaveIcon className="w-5 h-5 text-primary-500 animate-pulse" />
                    <span className="text-primary-700 font-medium">
                      {t('listening')} - Step {currentStep + 1}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailPage
