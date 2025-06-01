import { createContext } from 'react'

// =====================================================================================================================

// =========================================
// Interface
// =========================================
export interface IolocoContextType<AccessSession> {
  session: AccessSession | null
  isAuthenticated: boolean
  error: Error | null
}

// =========================================
// Create Ioloco Context
// =========================================
export function createIolocoContext<AccessSession>() {
  return createContext<IolocoContextType<AccessSession> | null>(null)
}
