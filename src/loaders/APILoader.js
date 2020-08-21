/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { FileUtils, Wrapper } = require('..')

module.exports = class APILoader {
    constructor(client) {
        this.apis = {}
        this.client = client;
    }

    async start() {
        this.loadAPIs()
        this.client.apis = await this.apis
        this.client.log(false, 'As APIs foram carregadas.', '[APILoader]')
    }

    loadAPIs() {
        return FileUtils('src/apis', async ({ file, required: NewAPI }) => {
            if (NewAPI.prototype instanceof Wrapper) {
                const api = new NewAPI()

                if (
                    !api.envVars.every(variable => {
                        if (!process.env[variable]) {
                            this.client.log(
                                true,
                                `failed to load - Required environment variable "${variable}" is not set.`,
                                this.name,
                                api.name
                            )
                        }
                        return !!process.env[variable]
                    })
                ) {
                    return false
                }

                this.apis[api.name] = await api.load()
                this.client.log(
                    false,
                    'Wrapper was successfully loaded!',
                    this.name,
                    api.name
                )
            } else {
                this.client.log(true, 'Not Wrapper!', this.name, file)
              }
            })
    }
}