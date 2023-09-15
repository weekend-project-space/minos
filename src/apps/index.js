import SoftStore from './SoftStore.vue'

export default {
    install(app, options) {
        app.component('soft-store', SoftStore)
    }
}