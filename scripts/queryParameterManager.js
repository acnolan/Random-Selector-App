/**
 * Utility functions to manage query parameters
 */

const OPTIONS = 'options';

function checkIfQueryParameters () {
    const urlParams = new URLSearchParams(window.location.search);
    return !(urlParams.get(OPTIONS) === null) && Array.isArray(JSON.parse(decodeURIComponent(urlParams.get(OPTIONS))));
}

function getQueryParameters () {
    const urlParams = new URLSearchParams(window.location.search);
    const options = urlParams.get(OPTIONS);
    return JSON.parse(decodeURIComponent(options));
}

function generateURLWithQueryParameters (options) {
    const url = new URL(window.location);
    const urlParams = url.searchParams;
    urlParams.set(OPTIONS, encodeURIComponent(JSON.stringify(options)));
    url.searchParams = urlParams;
    return url.toString();
}