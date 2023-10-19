import { Person, app } from '../data'
import { useAuth } from '../state'
import { useInitializer, useOnPageLeave } from '../behaviors'
import { useState } from 'react'
import './WhosHere.css'

export interface WhosHereProps {
  path: string
}

export const WhosHere = (props: WhosHereProps) => {
  const whosHere = useWhosHere(props)

  return (
    <>
      <h2>Who's Here?</h2>
      <ol className="pl-5">
        {whosHere.people.map((visitor) => (
          <li key={visitor.id} className="flex items-center my-3 text-lg animate-blip">
            <img src={visitor.avatarUrl || 'assets/user.png'} className="w-10 aspect-square mr-2 rounded-full" />
            {visitor.name}
          </li>
        ))}
      </ol>
    </>
  )
}

const useWhosHere = (settings: WhosHereProps) => {
  const auth = useAuth()
  const [people, setPeople] = useState<Person[]>([])
  const [alreadyCleanedUp, setAlreadyCleanedUp] = useState(false)

  let leave: Awaited<ReturnType<typeof app.whosHere.enter>> | undefined
  let forget: Awaited<ReturnType<typeof app.whosHere.listen>> | undefined
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
    ;(async () => {
      leave = await app.whosHere.enter(settings.path, auth.person!)

      const onUpdatePeople = (updatedPeople: Person[]) => setPeople(updatedPeople)
      forget = await app.whosHere.listen(settings.path, onUpdatePeople)
    })()

    return cleanup
  })

  useOnPageLeave(cleanup)

  return {
    people,
  }
}
