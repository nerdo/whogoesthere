import { AuthService, DataLayer, Person, WhosHereService, zPerson } from './blueprint'
import { Surreal } from 'surrealdb.js'
import { z } from 'zod'

const db = new Surreal()
let hasConnected = false

const dbConnect = async () => {
  if (hasConnected) {
    await db.wait()
    return db
  }

  await db.connect(import.meta.env.VITE_NGROK_SUBDOMAIN ? `https://${import.meta.env.VITE_NGROK_SUBDOMAIN}db.ngrok.io` : 'http://localhost:8000')
  await db.use({ ns: 'whogoesthere', db: 'whogoesthere' })
  hasConnected = true

  return db
}

const zRelationResponse = z.object({
  id: z.string(),
  in: z.string(),
  out: z.string(),
})

const zQueryResult = z.object({
  result: z.any(),
  status: z.string(),
  time: z.string(),
})

const zListenLiveEvent = z.object({
  action: z.union([z.literal('CREATE'), z.literal('UPDATE'), z.literal('DELETE'), z.literal('CLOSE')]),
  result: z.any(),
})

const whosHere: WhosHereService = {
  async enter(path, person) {
    await dbConnect()
    const queryResults = z
      .array(zQueryResult)
      .parse(await db.query('RELATE ONLY $personId->isVisiting->$page', { personId: person.id, page: `page:\`${path}\`` }))
    const relation = zRelationResponse.parse(queryResults[0].result)

    return async () => {
      if (!relation) {
        return
      }
      await dbConnect()
      await db.delete(relation.id)
    }
  },
  async listen(path, onUpdate) {
    await dbConnect()

    // Note: this is vulnerable to SQL injection attacks.
    // The SurrealDB client does allow for query to use variables, but it doesn't seem to work with a LIVE SELECT query.
    const liveQueryResults = z
      .array(zQueryResult)
      .parse(await db.query(`LIVE SELECT id, in.name as name, in.avatarUrl as avatarUrl FROM isVisiting where out = page:\`${path}\``))
    const liveQueryId = z.string().parse(liveQueryResults[0]?.result)

    let buffer: Person[] = []
    const sortBuffer = () => buffer.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
    db.listenLive(liveQueryId, (incoming) => {
      const event = zListenLiveEvent.parse(incoming)
      if (event.action === 'CLOSE') {
        return async () => {}
      }
      if (event.action === 'DELETE') {
        const id = z.string().parse(event.result)
        buffer = buffer.filter((p) => p.id !== id)
      } else if (event.action === 'UPDATE') {
        const person = zPerson.parse(event.result)
        buffer = buffer.map((p) => (p.id == person.id ? person : p))
      } else if (event.action === 'CREATE') {
        const person = zPerson.parse(event.result)
        buffer = buffer.concat(person)
      }
      sortBuffer()
      onUpdate(buffer)
    })

    const queryResults = z.array(zQueryResult).parse(
      await db.query(`SELECT id, in.name as name, in.avatarUrl as avatarUrl FROM isVisiting where out = $page`, {
        page: `page:\`${path}\``,
      })
    )
    buffer = z.array(zPerson).parse(queryResults[0]?.result)
    sortBuffer()
    onUpdate(buffer)

    return async () => db.query('KILL $liveQueryId', { liveQueryId })
  },
}

const auth: AuthService = {
  async authenticate(newPerson) {
    await dbConnect()

    const [person] = await db.create('user', newPerson)

    // Tinkering with doing an upsert...
    // const queryResults = z.array(zQueryResult).parse(
    //   await db.query(
    //     `
    //       LET $user = (SELECT * FROM ONLY user where name = $name LIMIT 1);
    //       IF $user THEN
    //         (RETURN UPDATE $user SET avatarUrl = $avatarUrl)
    //       ELSE
    //         (RETURN CREATE user CONTENT { name: $name, avatarUrl: $avatarUrl })
    //       END;
    //     `,
    //     { ...newPerson }
    //   )
    // )
    // const [person] = z.array(zPerson).parse(queryResults[1]?.result)

    return person
  },
}

export const dataLayer: DataLayer = {
  auth,
  whosHere,
}
