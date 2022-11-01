import { mailLayout } from './templates/mail.js';

export const emailMatches = async (to, matches) => {
    console.log("Sending email to " + to)

    let content = mailLayout({ 
        matches,
        url: "https://portal.awsevents.com/events/reinvent2022/dashboard/event/sessions"
    })

    let sendRequest = new Request("https://api.mailchannels.net/tx/v1/send", {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: to }],
            },
          ],
          from: {
            email: 'joseph@joraff.net',
            name: 'AWS Re:Invent session notifications'
          },
          subject: 'AWS Re:Invent session availability alert',
          content: [
            {
                type: 'text/html',
                value: content
            }
          ]
        })
    })

    return fetch(sendRequest)
    .then(async (r) => {
        let text = await r.text();
        if(!r.ok) { throw new Error("Could not send email: " + r.status + " " + r.statusText + "\n\n" + text) }
        console.log("Email sent: " + r.statusText)
        return true
    })
    .catch(e => {
        console.log(e)
        return false
    })
}