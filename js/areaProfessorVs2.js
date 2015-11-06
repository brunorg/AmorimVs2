$(document).ready(function() {
    carregarDados();
    atribuirEventos();
    carregarConteudo();
});

function carregarDados () {
    carregaOficinaPostagens();
    carregaAnoPostagens();
    carregaGrupoMural();
}

function atribuirEventos () {
    clickPostagens();
    cancelarPostagens();
    uploadImagemPostagem();
    novaPostagem();
    clickMural();
    cancelarMural();
}

function carregarConteudo () {
    carregarPostagens();
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

function uploadImagemPostagem () {
}

function novaPostagem () {
    $("#salvarPostagem").click(function() {
        var conteudo = $("#conteudoPostagens").val();
        var oficina = $("#selectOficina select").val();
        var ano = $("#selectAno select").val();
        var titulo = $("#tituloPostagens").val();

        if (ano != 0 && oficina != 0 && conteudo != '' && titulo != '')
        {
            $("#postagemTitulo").val(titulo);
            $("#postagemConteudo").val(conteudo);
            $("#postagemAno").val(ano);
            $("#postagemOficina").val(oficina);

            $.ajax({
                url: path + "Blog",
                async: false,
                crossDomain: true,
                type: "POST",
                data: $("#formPostagens").serialize(),
                beforeSend: function() {loading("inicial");},
                success: function() {mensagem("Postagem feita com sucesso!","OK","bt_ok","sucesso");},
                complete: function() {loading("final");}
            });
        }
        else
        {
            mensagem("Todos os campos devem ser preenchidos.","OK","bt_ok","erro");
        }
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