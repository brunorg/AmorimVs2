function getQueryParams(qs) {
        qs = qs.split('+').join(' ');

        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    }

var urlParams = getQueryParams(document.location.search)

if (urlParams["ref"] === "calendario") {
    var buttons = document.getElementsByClassName('btnMenu')

    for (var i = buttons.length - 1; i >= 0; i--) {

    	if (buttons[i].innerText == "início") {
    		buttons[i].className = 'btnMenu Active'
    	}
    	
    	if (buttons[i].innerText == "calendário") {
    		buttons[i].className +=' btClicked'
    	}
    };

    $('.Selecoes.Selecao7').css("display", "none")
    $('.Selecoes.Selecao6').css("display", "none")
    $('.Selecoes.Selecao5').css("display", "block")

}

