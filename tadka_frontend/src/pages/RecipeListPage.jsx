import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useLanguage } from '../components/LanguageProvider'
import api from '../utils/api'

const RecipeListPage = () => {
  const { t, language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [favorites, setFavorites] = useState([])
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const categories = [
    { id: 'all', name: 'All Categories', nameHi: 'सभी श्रेणियां' },
    { id: 'breakfast', name: 'Breakfast', nameHi: 'नाश्ता' },
    { id: 'lunch', name: 'Lunch', nameHi: 'दोपहर का भोजन' },
    { id: 'dinner', name: 'Dinner', nameHi: 'रात का भोजन' },
    { id: 'snacks', name: 'Snacks', nameHi: 'नाश्ता' },
    { id: 'desserts', name: 'Desserts', nameHi: 'मिठाई' },
    { id: 'beverages', name: 'Beverages', nameHi: 'पेय' }
  ]

  const difficulties = [
    { id: 'all', name: 'All Levels', nameHi: 'सभी स्तर' },
    { id: 'easy', name: 'Easy', nameHi: 'आसान' },
    { id: 'medium', name: 'Medium', nameHi: 'मध्यम' },
    { id: 'hard', name: 'Hard', nameHi: 'कठिन' }
  ]

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/api/recipes/')
        // Normalize minimal fields the UI expects
        const mapped = (data?.results || data || []).map((r) => ({
          id: r.id,
          title: r.title || r.name,
          titleHi: r.title_hi || r.title_hi || r.title,
          image: r.main_image || r.image || r.images?.[0] || 'https://via.placeholder.com/400x300?text=Recipe',
          time: r.prep_time ? `${r.prep_time} min` : (r.cook_time ? `${r.cook_time} min` : '—'),
          difficulty: (r.difficulty || 'medium').toString().toLowerCase(),
          rating: r.rating ?? '—',
          category: (r.category || 'other').toString().toLowerCase(),
          description: r.description || '',
          descriptionHi: r.description_hi || r.description || '',
        }))
        setRecipes(mapped)
      } catch (e) {
        setError('Failed to load recipes')
      } finally {
        setLoading(false)
      }
    }
    fetchRecipes()
  }, [])

  const toggleFavorite = (recipeId) => {
    setFavorites(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    )
  }

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.titleHi.includes(searchQuery)
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

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
            {t('recipes')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover delicious recipes from around the world, carefully curated for your culinary journey.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search')}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {language === 'en' ? category.name : category.nameHi}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="input-field"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.id} value={difficulty.id}>
                    {language === 'en' ? difficulty.name : difficulty.nameHi}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          {loading ? (
            <p className="text-gray-600">Loading recipes...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <p className="text-gray-600">
              Showing {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Recipe Grid */}
        {!loading && !error && filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe, index) => (
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
                      {language === 'en' 
                        ? categories.find(c => c.id === recipe.category)?.name
                        : categories.find(c => c.id === recipe.category)?.nameHi
                      }
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(recipe.id)
                      }}
                      className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      {favorites.includes(recipe.id) ? (
                        <HeartIconSolid className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-gray-600" />
                      )}
                    </motion.button>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {language === 'en' ? recipe.title : recipe.titleHi}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {language === 'en' ? recipe.description : recipe.descriptionHi}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>{recipe.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <UserGroupIcon className="w-4 h-4" />
                          <span className="capitalize">{recipe.difficulty}</span>
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
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FunnelIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default RecipeListPage
