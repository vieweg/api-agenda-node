'use strict'

const Event = use('App/Models/Event')
const moment = require('moment')

class EventController {
  async index ({ request, auth }) {
    const { page, date } = request.get()
    const user = await auth.getUser()

    if (date && moment(date).isValid()) {
      const dateMin = await moment(date)
        .startOf('day')
        .format()
      const dateMax = await moment(date)
        .endOf('day')
        .format()

      const events = await Event.query()
        .with('user')
        .where({ user_id: user.id })
        .whereBetween('due_date', [dateMin, dateMax])
        .paginate(page)

      return events
    }

    const events = await Event.query()
      .where({ user_id: user.id })
      .with('user')
      .paginate(page)

    return events
  }

  async store ({ request, response, auth }) {
    const data = request.only(['title', 'due_date', 'location'])
    const user = await auth.getUser()

    const hasEvent = await Event.findBy({
      due_date: data.due_date,
      user_id: user.id
    })

    if (hasEvent) {
      return response
        .status(400)
        .send({ error: { msg: 'Já existe um compromisso neste horário' } })
    }

    const event = await Event.create({ ...data, user_id: user.id })

    return event
  }

  async update ({ params, request, response, auth }) {
    try {
      const event = await Event.findOrFail(params.id)
      const user = await auth.getUser()
      const data = request.only(['title', 'due_date', 'location'])

      // Verifica se o evento pertence ao usuario
      if (event.user_id !== user.id) {
        return response.status(403).send({
          error: {
            msg: 'Você não possui permissões para alterar este registro'
          }
        })
      }
      // verifica se o compromisso já passou
      if (moment(event.due_date).isBefore(moment())) {
        return response.status(400).send({
          error: {
            msg: 'Não é possivel alterar compromissos que já passaram'
          }
        })
      }

      // Verifica se altera a data e neste caso se a nova data possui ja possui um evento
      if (data.due_date && !moment(event.due_date).isSame(data.due_date)) {
        const hasEvent = await Event.findBy({
          due_date: data.due_date,
          user_id: user.id
        })
        if (hasEvent) {
          return response
            .status(400)
            .send({ error: { msg: 'Já existe um compromisso neste horário' } })
        }
      }

      event.merge(data)
      await event.save()
      return event
    } catch (error) {
      return response
        .status(404)
        .send({ error: { msg: 'Registro não localizado' } })
    }
  }

  async destroy ({ params, response, auth }) {
    try {
      const event = await Event.findOrFail(params.id)
      const user = await auth.getUser()
      if (event.user_id !== user.id) {
        return response.status(403).send({
          error: {
            msg: 'Você não possui permissões para alterar este registro'
          }
        })
      }
      // verifica se o compromisso já passou
      if (moment(event.due_date).isBefore(moment())) {
        return response.status(400).send({
          error: {
            msg: 'Não é possivel alterar compromissos que já passaram'
          }
        })
      }
      await event.delete()
    } catch (error) {
      return response
        .status(404)
        .send({ error: { msg: 'Registro não localizado' } })
    }
  }
}

module.exports = EventController
