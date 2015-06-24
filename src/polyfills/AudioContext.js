//Audio context polyfill
//By Chuck
window.AudioContext = window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext ||
    window.msAudioContext;
