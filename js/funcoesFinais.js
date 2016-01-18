
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

document.getElementById('setaEsquerda').addEventListener ("click", verificarMudarMes1, false);
document.getElementById('setaDireita').addEventListener ("click", verificarMudarMes2, false);

var mesAtual = 1

var listaMes = [0, "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", 0]

function verificarMudarMes1() {
    verificarMudarMes(-1)
}

function verificarMudarMes2() {
    verificarMudarMes(1)
}

function verificarMudarMes(qtd) {
    var novoMes = mesAtual + qtd
    if (listaMes[novoMes] !== 0) {
        mesAtual = novoMes
        mudarMes(mesAtual)
    }
}

function mudarMes(novoMes) {
    $(".Calendario .center").html(listaMes[novoMes] + " 2016")
    document.getElementById('setaEsquerda').addEventListener ("click", verificarMudarMes1, false);
    document.getElementById('setaDireita').addEventListener ("click", verificarMudarMes2, false);
    refreshCalendario()
}

function refreshCalendario() {
    $("#mCSB_1_container").html("oi")
}