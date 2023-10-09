import { Person } from '../data/blueprint'
import { dataLayer } from '../data'
import { useInitializer, useOnPageLeave } from '../hooks'
import { useAuth } from './Auth'
import { useState } from 'react'

export interface WhosHereProps {
  path: string
}

export const WhosHere = (props: WhosHereProps) => {
  const whosHere = useWhosHere(props)
  const { path } = props

  return (
    <>
      <h2>Who's Here</h2>
      <p>
        path = <em>{path}</em>
      </p>
      <ul>
        {whosHere.people.map((person) => (
          <li key={person.id}>{person.name}</li>
        ))}
      </ul>
    </>
  )
}

const useWhosHere = (settings: WhosHereProps) => {
  const auth = useAuth()
  const [people, setPeople] = useState<Person[]>([])
  const [alreadyCleanedUp, setAlreadyCleanedUp] = useState(false)

  let leave: Awaited<ReturnType<typeof dataLayer.whosHere.enter>> | undefined
  let forget: Awaited<ReturnType<typeof dataLayer.whosHere.listen>> | undefined
  const cleanup = () => {
    if (alreadyCleanedUp) {
      return
    }
    if (leave) {
      leave()
    }
    if (forget) {
      forget()
    }
    setAlreadyCleanedUp(true)
  }

  useInitializer(() => {
    ; (async () => {
      leave = await dataLayer.whosHere.enter(settings.path, auth.person!)

      const onUpdatePeople = (updatedPeople: Person[]) => setPeople(updatedPeople)
      forget = await dataLayer.whosHere.listen(settings.path, onUpdatePeople)
    })()

    return cleanup
  })

  useOnPageLeave(cleanup)

  return {
    people,
  }
}
