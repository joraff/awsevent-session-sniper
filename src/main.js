import { SessionSniper } from './sniper'
import { getAccessToken } from './auth'

export default {
  async fetch(request, environment, context) {
    return handler(request, environment, context)
  },
  async scheduled(request, environment, context) {
    return handler(request, environment, context)
  }
}

const handler = async (request, environment, context) => {
  let accessToken = await getAccessToken(environment.REFRESH_TOKEN, environment.CLIENT_ID)

  let sniper = SessionSniper(environment.EVENT_ID, accessToken, environment.TO)
  try {
    const sessions = await sniper.findSessions()
    return new Response(JSON.stringify(sessions))
  } catch (e) {
    console.error(e)
    console.log(JSON.stringify(data.request))
    return new Response(e)
  }
}
