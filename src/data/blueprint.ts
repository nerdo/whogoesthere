import { z } from 'zod'

export interface DataLayer {
  auth: AuthService
  whosHere: WhosHereService
}

export interface AuthService {
  authenticate: (name: string) => Promise<Person>
}

export interface LeaveFunction {
  (): Promise<any>
}

export type ForgetFunction = LeaveFunction

export interface WhosHereService {
  enter: (path: string, person: Person) => Promise<LeaveFunction>
  listen: (path: string, onUpdate: (people: Person[]) => any) => Promise<ForgetFunction>
}

export const zPerson = z.object({
  id: z.string(),
  name: z.string(),
})

export type Person = z.infer<typeof zPerson>
