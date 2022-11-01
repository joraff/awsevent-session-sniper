export const getFavorites = ( eventId, request ) => {
    var query = `
    query MyFavorites($eventId: ID!) {
        event(id: $eventId) {
            eventId
            name
            myFavorites(limit: 100) {
              items {
                  sessionId
              }
              __typename
            }
            __typename
        }
    }
    `
    return request(
        query,
        { eventId }
    )
    .then(r => {
        if (!r.ok) { throw new Error("Could not load favorites") }
        return r.json()
    })
    .then(data => {
        // console.log("getFavorites: " + JSON.stringify(data))
        if (!data.data.event.myFavorites.items) { throw new Error("Invalid favorites response") }
        return data.data.event.myFavorites.items.map((item) => item.sessionId)
    })
}
