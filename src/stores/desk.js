import {
    defineStore
} from 'pinia'
import {
    reactive,
    ref,
    watch
} from 'vue'

export const useDeskStore = defineStore('desk', () => {
    let windowZIndex = 1

    const apps = ref([])
    const bar = reactive({
        title: '',
        icon: ''
    })

    function incrementZ() {
        windowZIndex++
        return windowZIndex
    }

    function setBar(title, icon) {
        bar.title = title
        bar.icon = icon
    }

    function setApps(apps0) {
        apps.value = apps0
    }

    function autoIncrementZ(zIndex, bar) {
        if (zIndex.value < windowZIndex) {
            zIndex.value = incrementZ()
            setBar(bar.title, bar.icon)
        }
    }

    watch(apps, () => {
        console.log('---')
        let deskstr = localStorage.getItem('desk')
        let desk = deskstr ? JSON.parse(deskstr) : {}
        desk.apps = apps.value
        localStorage.setItem('desk', JSON.stringify(desk))
    }, {
        deep: true
    })

    return {
        autoIncrementZ,
        bar,
        clearBar: () => {
            setBar()
        },
        apps,
        setApps
    }
})