import { z } from 'zod'

export interface DataLayer {
  auth: AuthService
  whosHere: WhosHereService
}

export interface AuthService {
  authenticate: (person: Omit<Person, 'id'>) => Promise<Person>
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
  avatarUrl: z.optional(z.string().url().nullable()),
})

export type Person = z.infer<typeof zPerson>
