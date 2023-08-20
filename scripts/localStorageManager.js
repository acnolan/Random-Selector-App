/**
 * Utility Functions for Managing Local Storage
 */

function storeLocalData (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function checkIfLocallyStored (key) {
    return !(localStorage.getItem(key) === null);
}

function loadLocalData (key) {
    return JSON.parse(localStorage.getItem(key));
}