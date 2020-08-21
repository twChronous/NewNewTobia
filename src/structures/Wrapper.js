module.exports = class Wrapper {
    constructor (name) {
      this.name = name
      Object.defineProperty(this, 'envVars', { value: [], writable: true })
    }
  
    async load () {
      return this
    }
  }