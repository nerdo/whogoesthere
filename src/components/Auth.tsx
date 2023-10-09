import { Person, dataLayer } from '../data'
import { create } from 'zustand'
import { ReactNode, useState } from 'react'

export interface AuthProps {
  children?: ReactNode
}

export interface AuthState {
  person?: Person
  setPerson: (person: Person) => void
}

export const Auth = (props: AuthProps) => {
  const auth = useAuth()
  const [name, setName] = useState('')

  if (auth.person) {
    return props.children
  }

  return (
    <>
      <div>
        <h2>Who goes there?</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
              ; (async () => {
                const person = await dataLayer.auth.authenticate(name)
                auth.setPerson(person)
              })()
          }}
        >
          <div>
            Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="enter your name" />
          </div>
          <div>
            <input type="submit" value="Enter" />
          </div>
        </form>
      </div>
    </>
  )
}

export const useAuth = create<AuthState>()((set) => ({
  person: undefined,
  setPerson: (person) => set({ person }),
}))
