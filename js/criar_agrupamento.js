var contAlunos = 0;
var acabouDeCarregar = false;
var arraySelecionados = [];

$(document).ready(function(){
    carregaPeriodo();
    carregaCiclo();
    atribuiChange();
    salvarAgrupamento();
    atribuiRolagemAgrup();
    $("#txtPesqAgrup").keyup(function(){
        window.clearTimeout(timeHandler);
        timeHandler = window.setTimeout(function(){
            arraySelecionados = resetArea();
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
        arraySelecionados = resetArea();
        $("#txtPesqAgrup").val("");
        carregaAlunos();
    });

    $("#periodoGrupo").change(function () {
        arraySelecionados = resetArea();
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

    if(nmAluno != "")
        urlServico = "AlunoVariavel/buscarAgrupamentoHtml/" + nmAluno;
    else if(idCiclo != '0' && idPeriodo != '0') 
        urlServico = "AlunoVariavel/listarCicloPeriodoRange/" + idCiclo + "/" + idPeriodo + "/" + contAlunos * 20 + "/19";
        else if(idCiclo != '0')
            urlServico = "AlunoVariavel/listarCicloRange/" + idCiclo + "/" + contAlunos * 20 + "/19";
        else
            urlServico = "AlunoVariavel/listarPeriodoRange/" + idPeriodo + "/" + contAlunos * 20 + "/19";

    $.ajax({
        url: path + urlServico,
        type: "GET",
        async: false,
        crossDomain: true,
        dataType: "html",
        success: function(dataAluno){
            if(dataAluno == ""){
                acabouDeCarregar = true;
            }else{
                $("#Area_Alunos").append(dataAluno);
                if(arraySelecionados != ""){
                    var lstAluno = $(".Aluno_Ano_Check");
                    for(var i = 0; i < lstAluno.length; i++){
                        var lstAlunoId = $(".Aluno_Ano_Check")[i].id.split("_")[2];
                        for(var j = 0; j < arraySelecionados.length; j++){
                            if(lstAlunoId == arraySelecionados[j]  && lstAluno[i].checked != true){ //Verifica se o input atual já foi selecionado E se ele não está marcado
                                $(lstAluno.get(i)).parent(".Grupo_Aluno_Linha").addClass("target"); //Se ele não estiver marcado e já foi selecionado, é um input repetido e recebe a classe 'target'
                                break;                      
                            }
                        }   
                    }
                $(".target").remove(); //Após as verificações, todos os inputs que contém a classe target são removidos, evitando alunos repetidos nas listas.
                }
            }                
            contAlunos++;
            arraySelecionados = [];
        }
    });
}

function resetArea() {
    contAlunos = 0;
    acabouDeCarregar = false;
    var arrayAlunoId = [];
    var arrayChecked = [];
    var lstCheck = $(".Aluno_Ano_Check"); //Array com inputs de alunos carregados
    for(var i = 0; i < lstCheck.length; i++){
        arrayAlunoId.push(lstCheck[i].id.split("_")[2]); //Array com seus id's
        if(lstCheck[i].checked != true){ // Verifica quais inputs NÃO estão marcados
            $("#Aluno_Check_"+arrayAlunoId[i]).parent(".Grupo_Aluno_Linha").remove(); //Remove a linha do input que não estiver marcado
        } else {
            arrayChecked.push(lstCheck[i].id.split("_")[2]); //Caso o input esteja marcado, seu id é add ao vetor arrayChecked
        }        
    }
    return arrayChecked; //Retorna um vetor com os id's de inputs marcados.
}

function atribuiRolagemAgrup () {
    $("#viewAlunos").mCustomScrollbar({
        axis:"y", // vertical and horizontal scrollbar
        scrollButtons:{
            enable:true
        },
        callbacks:{
            alwaysTriggerOffsets: false,
            onTotalScrollOffset: 500,
            whileScrolling: function() {
                if(this.mcs.topPct > 95 && !acabouDeCarregar)
                {
                    //arraySelecionados = resetArea();
                    if($('#txtPesqAgrup').val() == "")
                        carregaAlunos();   
                }
            },
            onTotalScroll:function(){
                if (!acabouDeCarregar)
                {
                    //arraySelecionados = resetArea();
                    if($('#txtPesqAgrup').val() == "")
                        carregaAlunos();
                }
            }
        }
    });
}

function salvarAgrupamento() {
    $('.btn_Salvar_Grupo').click(function() {
        // var alunos = $(".Grupo_Aluno_Linha");
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
                },
                erro: function(){
                    mensagem("Erro, não cadastrado.","OK","bt_ok","alerta");
                }
            });
        }
        else if (geraNome() == '' && $('.Aluno_Ano_Check:checked').length == 0)
            mensagem("O grupo deve possuir um nome e ao menos um aluno!","OK","bt_ok","erro");
        else if (geraNome() == '')
            mensagem("O grupo deve possuir um nome!","OK","bt_ok","erro");
        else if($.trim($("#Area_Alunos").html())=='')
            mensagem("O grupo deve possuir ao menos um aluno!","OK","bt_ok","erro");
    });
}

function salvaAlunoAgrupamento (idAgrupamento, alunoId) {
    $.ajax({
        url: path + "AlunoAgrupamento/",
        type: "POST",
        data: "action=create&Aluno="+alunoId+"&idAgrupamento="+idAgrupamento,
        async: false,
        crossDomain: true,
        erro: function(){
            mensagem("Erro, aluno(s) não cadastrado(s).","OK","bt_ok","alerta");
        }
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

function limparAgrupamento(){
    $("#Area_Alunos").empty();
    $("#cicloGrupo").val("0");
    $("#periodoGrupo").val("0");
    $("#nomeGrupo").val("");
}

