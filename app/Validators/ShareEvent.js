'use strict'

const Antl = use('Antl')

class ShareEvent {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      sendTo: 'required|email'
    }
  }
  get messages () {
    return Antl.list('validation')
  }
}

module.exports = ShareEvent
