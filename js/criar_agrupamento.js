var contAlunos = 0;
var acabouDeCarregar = false;

$(document).ready(function(){
    carregaPeriodo();
    carregaCiclo();
    carregaAlunos();
    atribuiChange();
    atribuiFuncoesRolagem();
    salvarAgrupamento();
});

function carregaCiclo(){
    var HtmlCiclo = '<option value="0"></option>';
    $.ajax({
        url: path + "Ciclo",
        type: "GET",
        async: false,
        crossDomain: true,
        dataType: 'json',
        success: function (dataCi) {
            for (var i = 0; i < dataCi.length; i++) {
                HtmlCiclo += '<option class="opcaoCI" value="'+dataCi[i].idciclos+'">'+dataCi[i].ciclo+'</option>';
                //console.log(dataCi[i].idciclos);
            };
        }
    });
    $('.Ciclo_Select').append(HtmlCiclo);
}

function carregaPeriodo(){
    var HtmlPeriodo = '<option value="0"></option>';
    $.ajax({
        url: path + "Periodo",
        type: "GET",
        async: false,
        crossDomain: true,
        dataType: 'json',
        success: function (dataPe) {
            for (var i = 0; i < dataPe.length; i++) {
                HtmlPeriodo += '<option class="opcaoPE" value="'+dataPe[i].idperiodo+'">'+dataPe[i].periodo+'</option>';
            };
        }
    });
    $('.Periodo_Select').append(HtmlPeriodo);
}

function atribuiChange() {

    $("#cicloGrupo").change(function () {
        resetArea();
        carregaAlunos();
    });

    $("#periodoGrupo").change(function () {
        resetArea();
        carregaAlunos();
    });
    
}

function carregaAlunos(){

    if ($("#cicloGrupo").val() != '0' && $("#periodoGrupo").val() != '0')
        buscarCicloPeriodo();
    else if ($("#cicloGrupo").val() != '0')
        buscarCiclo();
    else
        buscarPeriodo();
}

function resetArea () {
    contAlunos = 0;
    acabouDeCarregar = false;
    $('#Area_Alunos').empty();
}

function buscarCicloPeriodo () {
    $.ajax({
        url: path + "AlunoVariavel/listarCicloPeriodoRange/" + $("#cicloGrupo").val() + "/" + $("#periodoGrupo").val() + "/" + contAlunos * 20 + "/19",
        type: "GET",
        async: false,
        crossDomain: true,
        dataType: 'html',
        success: function(dataAlunos) {
            if (dataAlunos == '')
                acabouDeCarregar = true;
            else
                $('#Area_Alunos').append(dataAlunos);
            contAlunos++;
        }
    });
}

function buscarCiclo () {
    $.ajax({
        url: path + "AlunoVariavel/listarCicloRange/" + $("#cicloGrupo").val() + "/" + contAlunos * 20 + "/19",
        type: "GET",
        async: false,
        crossDomain: true,
        dataType: 'html',
        success: function(dataAlunos) {
            if (dataAlunos == '')
                acabouDeCarregar = true;
            else
                $('#Area_Alunos').append(dataAlunos);
            contAlunos++;
        }
    });
}

function buscarPeriodo () {
    $.ajax({
        url: path + "AlunoVariavel/listarPeriodoRange/" + $("#periodoGrupo").val() + "/" + contAlunos * 20 + "/19",
        type: "GET",
        async: false,
        crossDomain: true,
        dataType: 'html',
        success: function(dataAlunos) {
            if (dataAlunos == '')
                acabouDeCarregar = true;
            else
                $('#Area_Alunos').append(dataAlunos);
            contAlunos++;
        }
    });
}

function atribuiFuncoesRolagem () {
    $("#Area_Alunos_Container").mCustomScrollbar({
        axis:"y", // vertical and horizontal scrollbar
        scrollButtons:{
            enable:true
        },
        callbacks:{
            alwaysTriggerOffsets: false,
            onTotalScrollOffset: 500,
            whileScrolling: function() {
                if (this.mcs.topPct > 95 && !acabouDeCarregar)
                    carregaAlunos();

            },
            onTotalScroll:function(){
                if (!acabouDeCarregar)
                    carregaAlunos();
            }
        }
    });
}

function salvarAgrupamento () {
    $('.btn_Salvar_Grupo').click(function() {
        var cicloAgrup = $("#cicloGrupo").val();
        if (geraNome() != '' && $('.Aluno_Ano_Check:checked').length > 0)
        {
            $.ajax({
                url: path + "Agrupamento/",
                type: "POST",
                data: "action=create&nome=" + geraNome() + "&anoLetivo=" + getIdAnoLetivo() + "&ciclo=" + cicloAgrup,
                async: false,
                crossDomain: true,
                beforeSend: function() {
                    loading("inicial");
                },
                success: function(idAgrupamento){
                    for (var a = 0; a < $('.Aluno_Ano_Check:checked').length; a++)
                    {
                        var alunoId =  $('.Aluno_Ano_Check:checked')[a].id.split("_")[2];
                        salvaAlunoAgrupamento(idAgrupamento, alunoId);
                    }
                    mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso"); 
                },
                complete: function() {
                    loading("final");
                }
            });
        }
        else if (geraNome() == '' && $('.Aluno_Ano_Check:checked').length == 0)
            mensagem("O grupo deve possuir um nome e ao menos um aluno!","OK","bt_ok","erro");
        else if (geraNome() == '')
            mensagem("O grupo deve possuir um nome!","OK","bt_ok","erro");
        else
            mensagem("O grupo deve possuir ao menos um aluno!","OK","bt_ok","erro");
    });
}

function salvaAlunoAgrupamento (idAgrupamento, alunoId) {
    $.ajax({
        url: path + "AlunoAgrupamento/",
        type: "POST",
        data: "action=create&Aluno="+alunoId+"&idAgrupamento="+idAgrupamento,
        async: false,
        crossDomain: true
    });
}

function geraNome () {
    return $('#nomeGrupo').val();
}

function getIdAnoLetivo () {
    var idAnoLetivo;
    $.ajax({
        url: path + 'AnoLetivo/ano/' + (new Date()).getFullYear(),
        async: false,
        crossDomain: true,
        type: 'GET',
        beforeSend: function() {
            loading('inicial');
        },
        success: function(d) {
            idAnoLetivo = d;
        },
        complete: function() {
            loading('final');
        }
    });

    return idAnoLetivo;
}