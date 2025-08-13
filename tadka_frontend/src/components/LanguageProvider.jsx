import React, { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    recipes: 'Recipes',
    favorites: 'Favorites',
    profile: 'Profile',
    search: 'Search recipes...',
    
    // Home Page
    welcome: 'Welcome to Tadka Tales',
    subtitle: 'Your personal recipe assistant with voice guidance',
    getStarted: 'Get Started',
    exploreRecipes: 'Explore Recipes',
    popularRecipes: 'Popular Recipes',
    quickStart: 'Quick Start',
    
    // Recipe Details
    ingredients: 'Ingredients',
    instructions: 'Instructions',
    prepTime: 'Prep Time',
    cookTime: 'Cook Time',
    servings: 'Servings',
    difficulty: 'Difficulty',
    saveRecipe: 'Save Recipe',
    startCooking: 'Start Cooking',
    step: 'Step',
    of: 'of',
    
    // Voice Assistant
    voiceAssistant: 'Voice Assistant',
    startVoice: 'Start Voice Guide',
    stopVoice: 'Stop Voice Guide',
    listening: 'Listening...',
    speakNow: 'Speak now...',
    
    // Profile
    myProfile: 'My Profile',
    savedRecipes: 'Saved Recipes',
    cookingHistory: 'Cooking History',
    preferences: 'Preferences',
    language: 'Language',
    notifications: 'Notifications',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    
    // Difficulty levels
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    
    // Categories
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snacks: 'Snacks',
    desserts: 'Desserts',
    beverages: 'Beverages',
    
    // Actions
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    shareRecipe: 'Share Recipe',
    printRecipe: 'Print Recipe',
    
    // Messages
    recipeSaved: 'Recipe saved to favorites!',
    recipeRemoved: 'Recipe removed from favorites!',
    voiceEnabled: 'Voice assistant enabled',
    voiceDisabled: 'Voice assistant disabled',
  },
  hi: {
    // Navigation
    home: 'होम',
    recipes: 'रेसिपी',
    favorites: 'पसंदीदा',
    profile: 'प्रोफाइल',
    search: 'रेसिपी खोजें...',
    
    // Home Page
    welcome: 'तड़का टेल्स में आपका स्वागत है',
    subtitle: 'आपका व्यक्तिगत रेसिपी सहायक वॉइस गाइडेंस के साथ',
    getStarted: 'शुरू करें',
    exploreRecipes: 'रेसिपी देखें',
    popularRecipes: 'लोकप्रिय रेसिपी',
    quickStart: 'त्वरित शुरुआत',
    
    // Recipe Details
    ingredients: 'सामग्री',
    instructions: 'निर्देश',
    prepTime: 'तैयारी का समय',
    cookTime: 'पकाने का समय',
    servings: 'सर्विंग्स',
    difficulty: 'कठिनाई',
    saveRecipe: 'रेसिपी सेव करें',
    startCooking: 'खाना बनाना शुरू करें',
    step: 'स्टेप',
    of: 'का',
    
    // Voice Assistant
    voiceAssistant: 'वॉइस असिस्टेंट',
    startVoice: 'वॉइस गाइड शुरू करें',
    stopVoice: 'वॉइस गाइड बंद करें',
    listening: 'सुन रहा है...',
    speakNow: 'अब बोलें...',
    
    // Profile
    myProfile: 'मेरी प्रोफाइल',
    savedRecipes: 'सेव की गई रेसिपी',
    cookingHistory: 'खाना बनाना इतिहास',
    preferences: 'वरीयताएं',
    language: 'भाषा',
    notifications: 'सूचनाएं',
    
    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    cancel: 'रद्द करें',
    save: 'सेव करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    back: 'वापस',
    next: 'अगला',
    previous: 'पिछला',
    close: 'बंद करें',
    
    // Difficulty levels
    easy: 'आसान',
    medium: 'मध्यम',
    hard: 'कठिन',
    
    // Categories
    breakfast: 'नाश्ता',
    lunch: 'दोपहर का भोजन',
    dinner: 'रात का भोजन',
    snacks: 'नाश्ता',
    desserts: 'मिठाई',
    beverages: 'पेय',
    
    // Actions
    addToFavorites: 'पसंदीदा में जोड़ें',
    removeFromFavorites: 'पसंदीदा से हटाएं',
    shareRecipe: 'रेसिपी शेयर करें',
    printRecipe: 'रेसिपी प्रिंट करें',
    
    // Messages
    recipeSaved: 'रेसिपी पसंदीदा में सेव की गई!',
    recipeRemoved: 'रेसिपी पसंदीदा से हटा दी गई!',
    voiceEnabled: 'वॉइस असिस्टेंट सक्षम',
    voiceDisabled: 'वॉइस असिस्टेंट अक्षम',
  }
}

export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  const t = (key) => {
    return translations[language][key] || key
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en')
  }

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    translations
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
