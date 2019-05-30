'use strict'

const Mail = use('Mail')

class EventMailShare {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'EventMailShare-job'
  }

  // This is where the work is done.
  async handle (data) {
    const { event, sendTo } = data

    console.log('EventMailShare-job started')

    await Mail.send('emails.share', { event }, message => {
      message.from(event.user.email, event.user.username)
      message.to(sendTo)
      message.subject(`${event.user.username} compartilhou um evento`)
    })

    console.log('EventMailShare-job ended')
  }
}

module.exports = EventMailShare
