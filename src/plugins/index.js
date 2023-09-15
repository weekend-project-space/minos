import {
    createPinia,
} from 'pinia'
import apps from '@/apps'

const pinia = createPinia()
const plugins = [pinia, apps]
export default {
    install(app, options) {
        plugins.forEach(plugin => app.use(plugin))
    }
}