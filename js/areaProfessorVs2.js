$(document).ready(function() {
    carregarDados();
    atribuirEventos();
});

function carregarDados () {
    carregaOficinaPostagens();
    carregaAnoPostagens();
    carregaGrupoMural();
}

function atribuirEventos () {
    atribuiClickNovo();
}

function carregaOficinaPostagens () {
    var htmlOficinas =  '<select>'+
                            '<option value="0"></option>';
    $.ajax({
        url: path + 'Oficina',
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(d) {
            for (var i = 0; i < d.length; i++)
            {
                htmlOficinas += '<option value="'+d[i].idoficina+'">'+d[i].nome+'</option>';
            }
        }
    });

    htmlOficinas += '</select>';

    $('#selectOficina').html(htmlOficinas);
}

function carregaAnoPostagens () {
    var htmlAno =  '<select>'+
                            '<option value="0"></option>';
    $.ajax({
        url: path + 'AnoEstudo',
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(d) {
            for (var i = 0; i < d.length; i++)
            {
                htmlAno += '<option value="'+d[i].idanoEstudo+'">'+d[i].ano+'º Ano</option>';
            }
        }
    });

    htmlAno += '</select>';

    $('#selectAno').html(htmlAno);
}

function carregaGrupoMural () {
    var htmlGrupo =  '<select>'+
                            '<option value="0"></option>';
    $.ajax({
        url: path + 'Agrupamento',
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(d) {
            for (var i = 0; i < d.length; i++)
            {
                htmlGrupo += '<option value="'+d[i].idagrupamento+'">'+d[i].nome+'</option>';
            }
        }
    });

    htmlGrupo += '</select>';

    $('#selectGrupo').html(htmlGrupo);
}

function atribuiClickNovo () {
    clickPostagens();
    cancelarPostagens();
    clickMural();
    cancelarMural();
}

function clickPostagens() {
    $("#novoPostagens").click(function() {
        $("#postagensConteudo").hide();
        $("#novoPostagens").hide();
        $("#postagensNova").show();
    });
}

function cancelarPostagens () {
    $("#cancelarPostagens").click(function() {
        $("#postagensConteudo").show();
        $("#novoPostagens").show();
        $("#postagensNova").hide();
    });
}

function clickMural () {
    $("#novoMural").click(function() {
        $("#muralConteudo").hide();
        $("#novoMural").hide();
        $("#muralNova").show();
    });
}

function cancelarMural () {
    $("#cancelarMural").click(function() {
        $("#muralConteudo").show();
        $("#novoMural").show();
        $("#muralNova").hide();
    });
}