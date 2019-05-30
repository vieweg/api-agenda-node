'use strict'

const Antl = use('Antl')

class Store {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      email: 'required|email|unique:users,email',
      username: 'required|unique:users,username',
      password: 'required|confirmed'
    }
  }
  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Store
