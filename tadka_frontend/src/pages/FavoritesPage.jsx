import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  HeartIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  TrashIcon,
  ShareIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useLanguage } from '../components/LanguageProvider'

const FavoritesPage = () => {
  const { t, language } = useLanguage()
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      title: 'Butter Chicken',
      titleHi: 'बटर चिकन',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
      time: '45 min',
      difficulty: 'Medium',
      rating: 4.8,
      category: 'Main Course',
      addedDate: '2024-01-15'
    },
    {
      id: 3,
      title: 'Masala Dosa',
      titleHi: 'मसाला दोसा',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop',
      time: '30 min',
      difficulty: 'Easy',
      rating: 4.6,
      category: 'Breakfast',
      addedDate: '2024-01-10'
    },
    {
      id: 4,
      title: 'Paneer Tikka',
      titleHi: 'पनीर टिक्का',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
      time: '25 min',
      difficulty: 'Easy',
      rating: 4.7,
      category: 'Snacks',
      addedDate: '2024-01-08'
    }
  ])

  const removeFavorite = (recipeId) => {
    setFavorites(prev => prev.filter(recipe => recipe.id !== recipeId))
  }

  const shareRecipe = (recipe) => {
    // Mock share functionality
    console.log('Sharing recipe:', recipe.title)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            {t('favorites')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your collection of favorite recipes, saved for quick access and easy cooking.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartIconSolid className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{favorites.length}</h3>
                <p className="text-gray-600">Saved Recipes</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClockIcon className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {favorites.reduce((total, recipe) => {
                    const time = parseInt(recipe.time.split(' ')[0])
                    return total + time
                  }, 0)} min
                </h3>
                <p className="text-gray-600">Total Cooking Time</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <StarIcon className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {(favorites.reduce((total, recipe) => total + recipe.rating, 0) / favorites.length).toFixed(1)}
                </h3>
                <p className="text-gray-600">Average Rating</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
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
                    <div className="absolute top-3 left-3">
                      <HeartIconSolid className="w-6 h-6 text-red-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {language === 'en' ? recipe.title : recipe.titleHi}
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

                    <div className="text-xs text-gray-500">
                      Added on {new Date(recipe.addedDate).toLocaleDateString()}
                    </div>
                  </div>
                </Link>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.preventDefault()
                      shareRecipe(recipe)
                    }}
                    className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <ShareIcon className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.preventDefault()
                      removeFavorite(recipe.id)
                    }}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span className="text-sm">Remove</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartIcon className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">Start exploring recipes and save your favorites!</p>
            <Link to="/recipes">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                Explore Recipes
              </motion.button>
            </Link>
          </motion.div>
        )}

        {/* Quick Actions */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-xl font-display font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ClockIcon className="w-6 h-6 text-primary-500" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Start Cooking</p>
                    <p className="text-sm text-gray-600">Begin with your first recipe</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ShareIcon className="w-6 h-6 text-secondary-500" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Share Collection</p>
                    <p className="text-sm text-gray-600">Share your favorites</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-6 h-6 text-red-500" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Clear All</p>
                    <p className="text-sm text-gray-600">Remove all favorites</p>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default FavoritesPage
