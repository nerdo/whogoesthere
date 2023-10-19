import { app } from '../data'
import { useAuth } from '../state'
import { ReactNode, useState } from 'react'

export interface AuthProps {
  children?: ReactNode
}

export const Auth = (props: AuthProps) => {
  const auth = useAuth()
  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  if (auth.person) {
    return props.children
  }

  return (
    <>
      <div>
        <h2>Who Goes There?</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            ;(async () => {
              const person = await app.auth.authenticate({
                name,
                avatarUrl: avatarUrl === '' ? undefined : avatarUrl,
              })
              auth.setPerson(person)
            })()
          }}
        >
          <ul>
            <li>
              Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="enter your name" />
            </li>
            <li>
              Avatar URL: <input type="text" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="http://example.com/avatar.png" />
            </li>
            <li>
              <input type="submit" value="Enter" />
            </li>
          </ul>
        </form>
      </div>
    </>
  )
}
