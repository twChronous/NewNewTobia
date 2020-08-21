/* eslint-disable no-unused-vars */
const FileUtils = require('../utils/FileUtils');

module.exports = class ListenerLoader {
  constructor(client) {
    this.client = client;
  }

  start() {
    this.initializeEvents().then(
    this.client.log(false, 'Todos os eventos foram carregados com sucesso.','[ListenerLoader]')
    )
  }

  initializeEvents() {
    return FileUtils('src/client/listeners', ({ file,required: NewListener }) => {
      const evt = new NewListener(this.client);
      const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
      evt.events.map((event) => {
        this.client.on(event, (...e) => evt[`on${capitalize(event)}`](...e));
        this.client.log(
          false,
          'Listener function was successfully loaded!',
          `[${event}]`
        )
      })
    });
  }
}