import {
    createPinia,
} from 'pinia'


const pinia = createPinia()

export default {
    install(app, options) {
        app.use(pinia)
    }
}