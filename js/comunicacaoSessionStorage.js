$(document).ready(function() {

    localStorage.setItem('getSessionStorage', Date.now());

    if (window.addEventListener) {
      window.addEventListener("storage", dataSetter);
    } else {
      window.attachEvent("onstorage", dataSetter);
    };
});

function dataSetter (event) {
    if (event.key == "getSessionStorage"){
        localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
        localStorage.removeItem('sessionStorage');
    }
    else if (event.key == 'sessionStorage'){
        var data = JSON.parse(event.newValue), value;
        for (key in data) {
            sessionStorage.setItem(key, data[key]);
        }
    }
}