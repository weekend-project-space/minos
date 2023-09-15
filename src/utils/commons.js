export function debounce(fn, wait) {
    let timeout = null;
    return function (args) {
        if (timeout !== null)
            clearTimeout(timeout);
        timeout = setTimeout(() => fn(args), wait);
    }
}

export function findIndexs(apps, app) {
    return apps
        .map((o, i) => (((app.app && o.app == app.app) || o.title == app.title || (app.url && o.url == app.url)) ? i : -1))
        .filter((o) => o > -1);
}