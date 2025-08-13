import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const isAuthenticated = () => {
  const token = localStorage.getItem('tt_access_token')
  return Boolean(token)
}

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

export default ProtectedRoute
