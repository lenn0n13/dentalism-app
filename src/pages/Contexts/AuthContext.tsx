import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useCookie from '@hooks/useCookie'
import { jwtDecode } from "jwt-decode";

type AuthProps = {
  authentication: any,
  updateAuthentication: Function
}

type AuthContextProps = {
  children: React.ReactNode
}

const initialProps = {
  authentication: {
    token: ""
  },
  updateAuthentication: () => { }
}

export const AuthContextProvider = createContext<AuthProps>(initialProps)

const AuthContext = ({ children }: AuthContextProps) => {
  const [authentication, setAuthentication] = useState<AuthProps>(initialProps)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const { getCookie } = useCookie()
  const navigate = useNavigate()

  const updateAuthentication = (authItem: any) => {
    setAuthentication(authItem)
  }

  useEffect(() => {
    const path = window.location.pathname
    if (getCookie('token')) {
      const token = getCookie('token')
      const decoded = jwtDecode(token);
      updateAuthentication({ token, ...decoded })
      if (path === '/' || path === '/login') {
        navigate("/dashboard")
      }
    } else {
      if (path === '/dashboard') {
        navigate("/")
      }
    }
    setIsLoaded(true)
  }, [window.location.pathname])

  return (
    <>
      {isLoaded && <AuthContextProvider.Provider value={{ authentication, updateAuthentication }}>
        {children}
      </AuthContextProvider.Provider>}
    </>
  )
}

export default AuthContext