import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  PlayIcon, 
  BookOpenIcon, 
  HeartIcon, 
  StarIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { useLanguage } from '../components/LanguageProvider'

const HomePage = () => {
  const { t } = useLanguage()

  const featuredRecipes = [
    {
      id: 1,
      title: 'Butter Chicken',
      titleHi: 'बटर चिकन',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
      time: '45 min',
      difficulty: 'Medium',
      rating: 4.8,
      category: 'Main Course'
    },
    {
      id: 2,
      title: 'Biryani',
      titleHi: 'बिरयानी',
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d8a9?w=400&h=300&fit=crop',
      time: '60 min',
      difficulty: 'Hard',
      rating: 4.9,
      category: 'Main Course'
    },
    {
      id: 3,
      title: 'Masala Dosa',
      titleHi: 'मसाला दोसा',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop',
      time: '30 min',
      difficulty: 'Easy',
      rating: 4.6,
      category: 'Breakfast'
    }
  ]

  const features = [
    {
      icon: PlayIcon,
      title: t('voiceAssistant'),
      description: 'Get step-by-step voice guidance while cooking'
    },
    {
      icon: BookOpenIcon,
      title: 'Step-by-Step Instructions',
      description: 'Detailed instructions with images and videos'
    },
    {
      icon: HeartIcon,
      title: 'Save Favorites',
      description: 'Save your favorite recipes for quick access'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
                {t('welcome')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
                {t('subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/recipes">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary text-lg px-8 py-4 bg-white text-primary-600 hover:bg-gray-50"
                  >
                    {t('getStarted')}
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-lg px-8 py-4 border-white text-white hover:bg-white/10"
                >
                  <PlayIcon className="w-5 h-5 inline mr-2" />
                  Watch Demo
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop"
                  alt="Cooking"
                  className="rounded-2xl shadow-large"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary-500 rounded-full opacity-20"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent-500 rounded-full opacity-20"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Why Choose Tadka Tales?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience cooking like never before with our innovative features designed to make your culinary journey enjoyable and successful.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-8 text-center hover:shadow-medium transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              {t('popularRecipes')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most loved recipes, carefully curated for you to enjoy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="recipe-card group"
              >
                <Link to={`/recipe/${recipe.id}`}>
                  <div className="relative mb-4 overflow-hidden rounded-xl">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                      {recipe.category}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {recipe.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>{recipe.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <UserGroupIcon className="w-4 h-4" />
                          <span>{recipe.difficulty}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{recipe.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/recipes">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-8 py-4"
              >
                {t('exploreRecipes')}
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary-500 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Ready to Start Your Culinary Adventure?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of home cooks who are already enjoying the Tadka Tales experience.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-secondary-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors text-lg"
            >
              {t('quickStart')}
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
