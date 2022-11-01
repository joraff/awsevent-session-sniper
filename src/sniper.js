import { getFavorites } from './favorites'
import { getMatchingSessions, findAvailableSessions } from './sessions'
import { emailMatches } from './mail'

export const SessionSniper = (eventId, token, to) => {
    const request = (query, variables) => {
        return fetch("https://api.us-east-1.prod.events.aws.a2z.com/attendee/graphql", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': token
            },
            body: JSON.stringify({
              query,
              variables,
            })
        })
    }

    const findSessions = async () => {

        let favorites = await getFavorites(eventId, request)
        let matches   = await findAvailableSessions(favorites)

        if (matches.length > 0) {
            await emailMatches(to, matches)
        }
        return matches
    }

    return {
        findSessions,
        request
    }
}
