const availableActions = ["RESERVABLE", "WAITLISTABLE"]

export const getMatchingSessions = async (eventId, favorites, request) => {
    var query = `
    query listAttendeeSessions($input: ListAttendeeSessionsInput!) {
        listAttendeeSessions(input: $input) {
        results {
            ...SessionFragment
            __typename
        }
        totalCount
        nextToken
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
    const vars = {
        input: {
            eventId,
            filters:[
                ...(favorites.map(fav => { return { value: fav, groupName: "sessionId", "type": "sessionId" } }))
            ]
        }
    }
    
    const sessions = await request({
        document: query,
        variables: vars,
    })

    return request(
        query,
        vars
    )
    .then(r => {
        if (!r.ok) { throw new Error("Could not load sessions") }
        return r.json()
    })
    .then(data => {
        // console.log("getSessions: " + JSON.stringify(data))
        if (!data.data.listAttendeeSessions.results) { throw new Error("Invalid sessions response") }
        return data.data.listAttendeeSessions.results
    })
}

export const findAvailableSessions = (sessions) => {
    return sessions.filter((session) => {
        if (availableActions.includes(session.action)) {
            console.log("Session \"" + session.name + "\" is " + session.action)
            return true
        }
    })
}
