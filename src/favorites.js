export const getFavorites = ( eventId, request ) => {
    var query = `
    query MyFavorites($eventId: ID!) {
        event(id: $eventId) {
            eventId
            name
            myFavorites(limit: 100) {
              items {
                ...SessionFragment
                __typename
              }
              __typename
            }
            __typename
        }
    }

    fragment SessionFragment on Session {
        ...SessionFieldFragment
        isConflicting {
          reserved {
            eventId
            sessionId
            isPaidSession
            __typename
          }
          waitlisted {
            eventId
            sessionId
            isPaidSession
            __typename
          }
          __typename
        }
        __typename
    }
      
    fragment SessionFieldFragment on Session {
        action
        alias
        createdAt
        description
        duration
        endTime
        eventId
        isConflicting {
          reserved {
            alias
            createdAt
            eventId
            name
            sessionId
            type
            __typename
          }
          waitlisted {
            alias
            createdAt
            eventId
            name
            sessionId
            type
            __typename
          }
          __typename
        }
        isEmbargoed
        isFavoritedByMe
        isPaidSession
        level
        location
        myReservationStatus
        name
        sessionId
        startTime
        status
        type
        capacities {
          reservableRemaining
          waitlistRemaining
          __typename
        }
        customFieldDetails {
          name
          type
          visibility
          fieldId
          ... on CustomFieldValueFlag {
            enabled
            __typename
          }
          ... on CustomFieldValueSingleSelect {
            value {
              fieldOptionId
              name
              __typename
            }
            __typename
          }
          ... on CustomFieldValueMultiSelect {
            values {
              fieldOptionId
              name
              __typename
            }
            __typename
          }
          ... on CustomFieldValueHyperlink {
            text
            url
            __typename
          }
          __typename
        }
        package {
          itemId
          __typename
        }
        price {
          currency
          value
          __typename
        }
        venue {
          name
          __typename
        }
        room {
          name
          __typename
        }
        sessionType {
          name
          __typename
        }
        speakers {
          speakerId
          jobTitle
          companyName
          user {
            firstName
            lastName
            __typename
          }
          __typename
        }
        tracks {
          name
          __typename
        }
        __typename
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
        return data.data.event.myFavorites.items
    })
}
