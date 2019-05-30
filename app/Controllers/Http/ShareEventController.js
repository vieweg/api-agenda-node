'use strict'
const kue = use('Kue')
const EventMailShare = use('App/Jobs/EventMailShare')
const Event = use('App/Models/Event')

class ShareEventController {
  async share ({ params, auth, request }) {
    const event = await Event.findOrFail(params.id)
    await event.load('user')

    const sendTo = request.input('sendTo')

    const attempts = 5
    const data = { event, sendTo }

    kue.dispatch(EventMailShare.key, data, { attempts })

    return { msg: 'compartilhado com sucesso' }
  }
}

module.exports = ShareEventController
