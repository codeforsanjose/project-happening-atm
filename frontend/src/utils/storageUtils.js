export const getLocalStorageItemByKey = (key) => {
    return window.localStorage.getItem(key);
}

export const setLocalStorageItemByKey = (key, item) => {
    return window.localStorage.setItem(key, item);
}
