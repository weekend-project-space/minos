import {
    defineStore
} from 'pinia'
import {
    reactive
} from 'vue'

export const useDeskStore = defineStore('desk', () => {
    let windowZIndex = 1
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

    function autoIncrementZ(zIndex, bar) {
        if (zIndex.value < windowZIndex) {
            zIndex.value = incrementZ()
            setBar(bar.title, bar.icon)
        }
    }

    return {
        autoIncrementZ,
        bar,
        clearBar: () => {
            setBar()
        }
    }
})