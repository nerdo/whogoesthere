import { Person } from '../data'
import { create } from 'zustand'

export interface AuthState {
  person?: Person
  setPerson: (person: Person) => void
}

export const useAuth = create<AuthState>()((set) => ({
  person: undefined,
  setPerson: (person) => set({ person }),
}))

export default useAuth
