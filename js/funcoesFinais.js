
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
var ano = 2016

var listaMes = [0, "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", 1]

function verificarMudarMes1() {
    verificarMudarMes(-1)
}

function verificarMudarMes2() {
    verificarMudarMes(1)
}

function verificarMudarMes(qtd) {
    var novoMes = mesAtual + qtd
    if (typeof listaMes[novoMes] === "string") {
        mesAtual = novoMes
    } else {
        if (listaMes[novoMes] === 1) {
            mesAtual = 1
            ano += 1
        } else {
            mesAtual = 12
            ano -= 1
        }
    }
    mudarMes(mesAtual)
}

function mudarMes(novoMes) {
    $(".Calendario .center").html(listaMes[novoMes] + " " + ano)
    document.getElementById('setaEsquerda').addEventListener ("click", verificarMudarMes1, false);
    document.getElementById('setaDireita').addEventListener ("click", verificarMudarMes2, false);
    refreshCalendario(novoMes)
}

function getAjax(url, postOrGet, data, async, callback) {

    if (async === undefined)     { async = false; }
    if (postOrGet === undefined) { postOrGet = "GET"; }
    if (data === undefined)      { data = ""; }

    $.ajax({
        url: path + url,
        async: async,
        crossDomain: true,
        type: postOrGet,
        data: data,
        success: function(resultado) {
            callback(resultado);
        }
    });

}

function refreshCalendario(novoMes) {

    getAjax("Calendario/Mes/"+novoMes+"/"+ano, "GET", "", false, function(resultado) {

        htmlNoticias = ""

        resultado.forEach(function(noticia){

            htmlNoticias += "<div class=\"info\">";
            htmlNoticias += "<div class=\"Titulo\">";
            htmlNoticias += noticia.dataInicio + " | " + noticia.hora;
            htmlNoticias += "<\/div>";
            htmlNoticias += "<div class=\"Texto\">";
            htmlNoticias += noticia.descricao;
            htmlNoticias += "<\/div>";
            htmlNoticias += "<\/div>";

        })

        $('#containerNoticiasCalendario #mCSB_1 #mCSB_1_container').html(htmlNoticias)
    })

}


window.onload = function() {
    var d = new Date()
    var mesHoje = d.getMonth() + 1
    mudarMes(mesHoje)
}















