import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  UserIcon,
  CogIcon,
  BellIcon,
  GlobeAltIcon,
  HeartIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { useLanguage } from '../components/LanguageProvider'

const ProfilePage = () => {
  const { t, language, toggleLanguage } = useLanguage()
  const [notifications, setNotifications] = useState(true)

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    joinDate: 'January 2024',
    totalRecipes: 15,
    favorites: 8,
    cookingTime: '24h 30m'
  }

  const stats = [
    { label: 'Recipes Cooked', value: user.totalRecipes, icon: ChartBarIcon },
    { label: 'Favorites', value: user.favorites, icon: HeartIcon },
    { label: 'Total Cooking Time', value: user.cookingTime, icon: ClockIcon }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            {t('myProfile')}
          </h1>
          <p className="text-xl text-gray-600">
            Manage your profile and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="card p-6 text-center">
              <div className="mb-6">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
                  {user.name}
                </h2>
                <p className="text-gray-600 mb-1">{user.email}</p>
                <p className="text-sm text-gray-500">Member since {user.joinDate}</p>
              </div>

              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <stat.icon className="w-5 h-5 text-primary-500" />
                      <span className="text-gray-700">{stat.label}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="space-y-6">
              {/* Preferences */}
              <div className="card p-6">
                <h3 className="text-xl font-display font-bold text-gray-900 mb-6 flex items-center">
                  <CogIcon className="w-6 h-6 mr-2 text-primary-500" />
                  {t('preferences')}
                </h3>

                <div className="space-y-6">
                  {/* Language Setting */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <GlobeAltIcon className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{t('language')}</p>
                        <p className="text-sm text-gray-600">Choose your preferred language</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleLanguage}
                      className="btn-secondary"
                    >
                      {language === 'en' ? 'English' : 'हिंदी'}
                    </motion.button>
                  </div>

                  {/* Notifications Setting */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BellIcon className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{t('notifications')}</p>
                        <p className="text-sm text-gray-600">Receive cooking reminders and updates</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications}
                        onChange={(e) => setNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card p-6">
                <h3 className="text-xl font-display font-bold text-gray-900 mb-6">
                  Quick Actions
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <HeartIcon className="w-6 h-6 text-red-500" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{t('savedRecipes')}</p>
                      <p className="text-sm text-gray-600">View your favorite recipes</p>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ClockIcon className="w-6 h-6 text-primary-500" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{t('cookingHistory')}</p>
                      <p className="text-sm text-gray-600">See your cooking journey</p>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Account Actions */}
              <div className="card p-6">
                <h3 className="text-xl font-display font-bold text-gray-900 mb-6">
                  Account
                </h3>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-gray-900">Edit Profile</span>
                    <UserIcon className="w-5 h-5 text-gray-500" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-gray-900">Change Password</span>
                    <CogIcon className="w-5 h-5 text-gray-500" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-red-600">Delete Account</span>
                    <UserIcon className="w-5 h-5 text-red-500" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
