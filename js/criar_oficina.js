$(document).ready(function(){
    carregarTipoOficina();
    salvarOficina();
    atribuiChangeOficina();
});

function carregarTipoOficina() {
    $.ajax({
        url: path + 'TipoOficina',
        type: 'GET',
        async: false,
        crossDomain: true,
        success: function(data) {
            var html = '<option value="0"></option>';

            for (a in data) {
                html +=
                    '<option value="'+data[a].idTipoOficina+'">'+data[a].nome+'</option>';
            }

            $('#oficinaOficina').html(html);
            $('#selectTipoOficina').html(html);
        }
    });
}

function salvarOficina () {
    $('.btn_Salvar_Oficina').click(function() {

        var tipoOficina = $("#oficinaOficina").val()
        var nomeOficina = $("#nomeOficina").val();
        var periodo = $("#periodoOficina").val();
        var ciclo = $("#cicloOficina").val();

        var cicloNome = $("#cicloOficina option:selected").text();
        periodoNome = $("#periodoOficina option:selected").text();

        if (tipoOficina == '0' ||
            periodo == '0' ||
            ciclo == '0')
        {
            mensagem("Escolha um tipo para a oficina!","OK","bt_ok","erro");
        }
        else if (tipoOficina == 'Outras' && nomeOficina == '')
        {
            mensagem("A oficina deve possuir um nome!","OK","bt_ok","erro");
        }
        else
        {
            $.ajax({
                url: path + "Oficina",
                type: "POST",
                async: false,
                crossDomain: true,
                data: "action=create&tipo="+tipoOficina+"&nome="+nomeOficina+"&periodo="+periodo+"&ciclo="+ciclo+"&anoLetivo="+getIdAnoLetivo(),
                beforeSend: function() {
                    loading('inicial');
                },
                success: function(idOficina) {
                    $("#Container_Cadastro_Oficina").css('display', 'none');
                    mensagem("Oficina criada com sucesso! Cadastre os professores para esta oficina!","OK","bt_ok","sucesso");   
                    displayNome();
                    $.ajax({
                        url: path + "TipoOficina/" + tipoOficina,
                        type: "GET",
                        async: false,
                        crossDomain: true,
                        success: function(tipoOficinaData) {
                            adicionaInformacoesFichaOficina(tipoOficinaData, cicloNome, periodoNome);
                            $('.oficina_nome').css('color', tipoOficinaData.cor.forte);
                        }
                    });
                    adicionarFuncoesFeedBack(idOficina, ciclo, periodo);
                    cadastrarProfessorOficina(idOficina);
                },
                complete: function() {
                    loading('final');
                }
            });
        }
    });
}

function atribuiChangeOficina (argument) {
    $("#oficinaOficina").change(function () {
        if ($("#oficinaOficina").val() == 'outras')
        {
            $("#nomeLinha").css('display', 'block');
            $("#nomeOficina").val('');
        }
        else
        {
            $("#nomeLinha").css('display', 'none');
            $("#nomeOficina").val($("#oficinaOficina option:selected").text());
        }
    });
}

function displayNome () {
    var abrev = $("#oficinaOficina").val();
    var cicloNome = $( "#cicloOficina option:selected" ).text();
    var periodoNome = $( "#periodoOficina option:selected" ).text();
    var nomeOficina;

    if ($("#oficinaOficina option:selected").text() == "Outras")
        nomeOficina = $("#nomeOficina").val();
    else
        nomeOficina = $("#oficinaOficina option:selected").text();

    var conteudoNome =  '<span>' + cicloNome + ' | </span>'+
                        '<span> ' + periodoNome + ' | </span>'+
                        '<span class="oficina_nome"> Oficina ' + nomeOficina + '</span> |';
    $("#Area_Nome_Oficina").html(conteudoNome);
    $("#Area_Nome_Oficina").css('display', 'block');
}

function adicionaInformacoesFichaOficina (tipoOficina, nomeCiclo, nomePeriodo) {
    $('#oficina_tipo').html(tipoOficina.nome);
    $('#oficina_tipo').css('color', tipoOficina.cor.forte);
    $('#oficina_ciclo').html(nomeCiclo);
    $('#oficina_periodo').html(nomePeriodo);
}

function adicionarFuncoesFeedBack (idOficina, ciclo, periodo) {
    $('.btn_editar_oficina').click(function() {
        habilitarModalEdicaoOficina(idOficina, ciclo, periodo);
    });

    $('.btn_atribuir_rotina').click(function() {
        debugger;
        habilitarModalEdicaoRotina(0, idOficina, 0, 0, 0, 0, 0);
        carregaEditAgrupamento();
    });
    $('.btn_nova_oficina').click(function() {
        resetarPaginas();
    });
}

function cadastrarProfessorOficina (idOficina) {
    $("#Container_Cadastro_Oficina_Professor").css('display', 'block');
    atribuiAddProfessor();
    addLinhaProfessor();
    atribuiSalvarProfessorOficina(idOficina);
}

function atribuiAddProfessor () {
    $('.btAdd_Professor').click(function() {
        addLinhaProfessor();
    });
}

function addLinhaProfessor () {
    $(".Container_Professores").append(getNovaLinhaProfessor());
    removeProfessores();
    addEventsSelect();
}

function atribuiSalvarProfessorOficina (idOficina) {
    $(".btn_Salvar_Oficina_Professor").click(function() {
        var profCadastrado = false;
        for (var a = 0; a < $('.Professor_Select').length; a++)
        {
            var idProfessor = $('.Professor_Select')[a].value;
            var nomeProfessor = $('.Professor_Select')[a].options[$('.Professor_Select')[a].selectedIndex].text;
            if (idProfessor != "0")
            {
                salvarProfessorOficina(idOficina, idProfessor);
                adicionaInformacoesFichaOficinaProfessor(nomeProfessor);
                concluirOficina(idProfessor);
                profCadastrado = true;
                mensagem("Professores cadastrados com sucesso! Crie uma rotina para esta oficina!","OK","bt_ok","sucesso"); 
            }
        }
        if (profCadastrado)
        {
            $("#Container_Cadastro_Oficina_Professor").css('display', 'none');
            $('#Container_Oficina_Completa').css('display', 'block');
        }
        else
            mensagem("Cadastre ao menos um professor para essa oficina!","OK","bt_ok","erro");
    });
}

function getNovaLinhaProfessor () {

    var returnHtml;

    $.ajax({
        url: path + 'ProfessorFuncionario',
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(dataProfessor) {

            var listaProfessoresOption = '';

            for (var a = 0; a < dataProfessor.length; a++)
                    listaProfessoresOption += '<option value="'+dataProfessor[a].idprofessorFuncionario+'">'+dataProfessor[a].nome+'</option>';

            returnHtml =    '<div class="Area_Select_Grupo">'+
                                '<div class="Box_Area_Select Unico_Linha">'+
                                    '<p class="Select_Grupo">Professor</p>'+
                                    '<span class="Select_Grupo_Input">'+
                                        '<select name="Oficina" class="Professor_Select">'+
                                            '<option value="0"></option>'+    
                                            listaProfessoresOption+
                                        '</select>'+
                                    '</span>'+
                                '</div>'+
                            '</div>';
        }
    });
    return returnHtml;
}

function addEventsSelect () {
    $('.Professor_Select').unbind('focus').unbind('change');
    $(".Professor_Select").focus(function () {
        previous = this.value;
    }).change(function() {
        console.log(this.value);
        if (previous != '0')
        {
            $(".Professor_Select [value="+previous+"]").css('display', 'block');
        }
        if (this.value != '0')
        {
            $(".Professor_Select [value="+this.value+"]").css('display', 'none');
        }                
        previous = this.value;
    });
}

function removeProfessores () {
    for (var a = 0; a < $('.Professor_Select').length; a++)
    {

        if ($('.Professor_Select')[a].value != '0')
        {
            $(".Professor_Select [value="+$('.Professor_Select')[a].value+"]").css('display', 'none');
        }
    }
}

function salvarProfessorOficina (idOficina, idProfessor) {
    $.ajax({
        url: path + 'OficinaProfessor',
        type: "POST",
        async: false,
        crossDomain: true,
        data: 'action=create&idOficina='+idOficina+"&idProfessor="+ idProfessor,
        beforeSend: function() {
            loading('inicial');
        },
        complete: function() {
            loading('final');
        }
    });
}

function adicionaInformacoesFichaOficinaProfessor(nomeProfessor){
    if ($('#oficina_professores').is(':empty'))
        $('#oficina_professores').html(nomeProfessor);
    else
        $('#oficina_professores').append(', ' + nomeProfessor);
}

function concluirOficina (idProfessor) {
    $('.btn_concluir_oficina').click(function() {
        $('#Pesquisa').trigger('click');
        $('.pesqTutOfi').val(1);
        $('.pesqTutOfi').trigger('change');
        $('.oficinaO').val(idProfessor);
        $('.oficinaO').trigger('change');
    });
}

function cadastrarRotina (idOficina) {
    $('#Container_Cadastro_Rotina').css('display', 'block');
    carregaAgrupamentos();
    carregaDiasSemana();
    carregaHorarios();
    carregaSalas();
    atribuiSalvarRotina(idOficina);
}

function carregaAgrupamentos () {
    var htmlOption = '<option value="0"></option>';
    $.ajax({
        url: path + 'Agrupamento/AnoLetivo/' + getIdAnoLetivo(),
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(dataAgrupamentos) {
            for (var a = 0; a < dataAgrupamentos.length; a++)
                htmlOption += '<option value ="'+dataAgrupamentos[a].idagrupamento+'">'+dataAgrupamentos[a].nome+'</option>';
        }
    });

    $('#Agrupamento_Select').html(htmlOption);
}

function carregaDiasSemana () {
    var htmlOption = '<option value="0"></option>';
    $.ajax({
        url: path + 'Semana',
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(dataSemana) {
            for (var a = 0; a < dataSemana.length; a++)
                htmlOption += '<option value ="'+dataSemana[a].idsemana+'">'+dataSemana[a].dia+'</option>';
        }
    });

    $('#Dia_Semana_Select').html(htmlOption);
}

function carregaHorarios () {

    var primeiroHorario = 7;
    var ultimoHorario = 23;

    var htmlHorarios = '<option value="0"></option>w';

    for (var a = primeiroHorario; a <= ultimoHorario; a++)
    {
        htmlHorarios += '<option value="'+a+'">'+a+':00</option>';
    }

    $('#Horario_Select').html(htmlHorarios);
}

function carregaSalas () {

    var htmlOption = '<option value="0"></option>';
    $.ajax({
        url: path + 'Salas',
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(dataSalas) {
            for (var a = 0; a < dataSalas.length; a++)
                htmlOption += '<option value ="'+dataSalas[a].idsalas+'">'+dataSalas[a].sala+'</option>';
        }
    });

    $('#Sala_Rotina_Select').html(htmlOption);
}

function atribuiSalvarRotina (idOficina) {
    $('.btn_Salvar_Rotina').click(function() {

        var idAgrupamento = $('#Agrupamento_Select').val();
        var idDia = $('#Dia_Semana_Select').val();
        var horario = $('#Horario_Select').val();
        var idSala = $('#Sala_Rotina_Select').val();
        var anoLetivo = getIdAnoLetivo();

        if (idAgrupamento != '0' &&
            idDia != '0' &&
            horario != '0' &&
            idSala != '0')
        {
            $.ajax({
                url: path + "Rotina",
                async: false,
                crossDomain: true,
                type: "POST",
                data: "action=create&idOficina="+idOficina+"&idAgrupamento="+idAgrupamento+"&idDia="+idDia+"&Hora="+horario+"&idSala="+idSala+"&anoLetivo="+anoLetivo,
                beforeSend: function() {
                    loading('inicial');
                },
                success: function(idRotina) {
                    $('#Container_Cadastro_Rotina').css('display', 'none');
                    mensagem("Rotina criada com sucesso!","OK","bt_ok","sucesso");
                    $('#Container_Novo_Cadastro').css('display', 'block');
                    addNomeRotina();
                    $('.btn_Nova_Oficina').click(function() {
                       resetarPaginas();
                    });
                    $.ajax({
                        url: path + "AgendamentoSala",
                        async: false,
                        crossDomain: true,
                        type: "POST",
                        data: "action=create&Hora="+horario+"&dia="+idDia+"&idsala="+idSala+"&idrotina="+idRotina
                    });
                },
                complete: function() {
                    loading('final');
                }
            });
        }
        else
        {   
            mensagem("Todos os campos devem estar preenchidos!","OK","bt_ok","erro");
        }
    });
}

function addNomeRotina () {

    var agrupamento = $('#Agrupamento_Select option:selected').text();
    var diaSemana = $('#Dia_Semana_Select option:selected').text();
    var horario = $('#Horario_Select option:selected').text();
    var sala = $('#Sala_Rotina_Select option:selected').text();


    var conteudoNome =  '<span> ' + agrupamento + ' |</span>'+
                        '<span> ' + diaSemana + ' |</span>'+
                        '<span> ' + horario + ' |</span>'+
                        '<span> ' + sala + '</span>';

    $("#Area_Nome_Oficina").append(conteudoNome);
}

function resetarPaginas () {
    resetarCadastroOficina();
    resetarCadastroProfessores();
    resetarCadastroRotina();
    resetarFicha();
}

function resetarCadastroOficina () {
    $('#Container_Cadastro_Oficina').css('display', 'block');
    $('#Area_Nome_Oficina').empty();
    $("#Area_Nome_Oficina").css('display','none');
    $("#oficinaOficina").val('0');
    $("#nomeOficina").val('');
    $("#nomeOficina").css('display', 'none');
    $("#periodoOficina").val('0');
    $("#cicloOficina").val('0');
}

function resetarCadastroProfessores () {
    $('.Container_Professores').empty();
    $('.btAdd_Professor').unbind('click');
    $(".btn_Salvar_Oficina_Professor").unbind('click');
}

function resetarFicha () {
    $('#oficina_professores').empty();
    $('#Container_Oficina_Completa').hide();
}

function resetarCadastroRotina () {
    $('#Agrupamento_Select').empty();
    $('#Dia_Semana_Select').empty();
    $('#Horario_Select').empty();
    $('#Sala_Rotina_Select').empty();
    $('.btn_Salvar_Rotina').unbind('click');
    $('#Container_Novo_Cadastro').css('display', 'none');
}

/*----------------------------------------------------------------------------------------------*/

function callModalEdicao(etapa)
{
    "use strict";
    if ( etapa == 'oficina' )
    {
        callModalEditarOficina();
    }
    else if ( etapa == 'professor' )
    {
        callModalEditarProfessor();
    }
    else if ( etapa == 'rotina' )
    {
        callModalEditarRotina();
    }
    else if ( etapa == 'agrupamento' )
    {
        callModalEditarAgrupamento();
    }
    else
    {
        mensagem("Erro ao requerir a edição.","OK","bt_ok","erro");
    }

}

/*----------------------------------------------------------------------------------------------*/