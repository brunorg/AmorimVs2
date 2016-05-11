var contAlunos = 0;
var acabouDeCarregar = false;

$(document).ready(function(){
    carregaPeriodo();
    carregaCiclo();
    //carregaAlunos();
    atribuiChange();
    atribuiFuncoesRolagem();
    salvarAgrupamento();

    $("#txtPesqAgrup").keyup(function(){
        window.clearTimeout(timeHandler);
        timeHandler = window.setTimeout(function(){
            resetArea();
            carregaAlunos();
        },1000);
    });
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
        $("#txtPesqAgrup").val("");
        carregaAlunos();
    });

    $("#periodoGrupo").change(function () {
        resetArea();
        $("#txtPesqAgrup").val("");
        carregaAlunos();
    });
    
}

function carregaAlunos(){
    var urlServico = "";
    var html = "";
    var idCiclo = $("#cicloGrupo").val();
    var idPeriodo = $("#periodoGrupo").val();
    var nmAluno = $("#txtPesqAgrup").val();

    if (idCiclo != '0' && idPeriodo != '0') 
        urlServico = "AlunoVariavel/listarCicloPeriodoRange/" + idCiclo + "/" + idPeriodo + "/" + contAlunos * 20 + "/19";
    else if (idCiclo != '0')
        urlServico = "AlunoVariavel/listarCicloRange/" + idCiclo + "/" + contAlunos * 20 + "/19";
    else
        urlServico = "AlunoVariavel/listarPeriodoRange/" + idPeriodo + "/" + contAlunos * 20 + "/19";

    if(nmAluno != "")
        urlServico = "AlunoVariavel/buscarAgrupamentoHtml/" + nmAluno;

    $.ajax({
        url: path + urlServico,
        type: "GET",
        async: false,
        crossDomain: true,
        dataType: "html",
        success: function(dataAluno){
            if(dataAluno == "")
                acabouDeCarregar = true;
            else
                $("#Area_Alunos").append(dataAluno);
            contAlunos++;
        }
    });
}

function resetArea () {
    contAlunos = 0;
    acabouDeCarregar = false;
    $('#Area_Alunos').empty();
}

function atribuiFuncoesRolagem () {
    $(".Area_Alunos_Container").mCustomScrollbar({
        axis:"y", // vertical and horizontal scrollbar
        // scrollButtons:{
        //     enable:true
        // },
        callbacks:{
            alwaysTriggerOffsets: false,
            onTotalScrollOffset: 500,
            whileScrolling: function() {
                if(this.mcs.topPct > 95 && !acabouDeCarregar){
                    //debugger;
                    carregaAlunos();
                }

            },
            onTotalScroll:function(){
                if (!acabouDeCarregar){
                    carregaAlunos();
                }
            }
        }
    });
}

function salvarAgrupamento() {
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
                    limparAgrupamento();
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
//$("#aluno_"+idaluno).attr("id")
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

function limparAgrupamento(){
    $("#Area_Alunos").empty();
    $("#cicloGrupo").val("0");
    $("#periodoGrupo").val("0");
    $("#nomeGrupo").val("");
}