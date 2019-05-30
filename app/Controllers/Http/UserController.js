'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class UserController {
  async index ({ request }) {
    const { page } = request.query || 1
    const users = await User.query().paginate(page)

    return users
  }

  async store ({ request }) {
    const data = request.only(['username', 'email', 'password'])

    const user = await User.create(data)

    return user
  }

  async update ({ params, request, response }) {
    const user = await User.findOrFail(params.id)
    const data = request.only(['username', 'password', 'password_old'])

    if (data.password_old) {
      const isSame = await Hash.verify(data.password_old, user.password)

      if (!isSame) {
        return response
          .status(401)
          .send({ error: { msg: 'A senha antiga não é valida' } })
      }
      if (!data.password) {
        return response
          .status(401)
          .send({ error: { msg: 'A senha nova não foi informada' } })
      }
    } else {
      delete data.password
    }

    delete data.password_old
    user.merge(data)
    await user.save()

    return user
  }

  async destroy ({ params }) {
    const user = await User.findOrFail(params.id)

    await user.delete()
  }
}

module.exports = UserController
