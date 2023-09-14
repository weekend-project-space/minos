export function debounce(fn, wait) {
    let timeout = null;
    return function (args) {
        if (timeout !== null)
            clearTimeout(timeout);
        timeout = setTimeout(() => fn(args), wait);
    }
}