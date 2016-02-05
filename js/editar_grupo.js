var contAlunosModal = 0;
var acabouDeCarregarModal = false;

$(document).ready(function(){
	atruiChangesModal();
    atribuiFuncoesRolagemModal();
});

function atruiChangesModal(){
    $("#cicloGrupoModal").change(function (){
        resetAreaModal();
        carregaAlunosModal();
        isSelectedModal();
    });
}

function carregaAlunosAgrupamento(){
    var htmlAluno = "";
    var idAlunoAgrupamento = [];
    $.ajax({
        url: path + "AlunoAgrupamento/listarAgrupamento/" + idAgrup,
        type: "GET",
        async: false,
        crossDomain: true,
        success: function(dataAlunos){
            for(var i in dataAlunos){
                htmlAluno += '<div id="AlunoV_'+dataAlunos[i].aluno.idalunoVariavel+'" class="Grupo_Aluno_Linha Selected" data-status="1">';
                htmlAluno +=    '<span class="Nome_Aluno">'+dataAlunos[i].aluno.aluno.nome+'</span>';
                htmlAluno +=    '<input type="checkbox" id="Aluno_Check_'+dataAlunos[i].aluno.idalunoVariavel+'" class="Aluno_Ano_Check" checked>';
                htmlAluno +=    '<label for="Aluno_Check_'+dataAlunos[i].aluno.idalunoVariavel+'"><span>&nbsp;</span></label>';
                htmlAluno +=    '<span class="Ano_Aluno">'+dataAlunos[i].aluno.anoEstudo.ano+'º ano </span>';
                htmlAluno += '</div>';
            }
            $('#Area_Alunos_Modal').append(htmlAluno);
            for(var i in dataAlunos){
                idAlunoAgrupamento.push(dataAlunos[i].aluno.idalunoVariavel);
            }
        }
    });
    return idAlunoAgrupamento;
}

function limparAlunosAgrup(){
    var grupoLinhaAgrup = $("[data-status='1']");
    for(var i = 0; i < grupoLinhaAgrup.length; i++){
        $(grupoLinhaAgrup)[i].remove();
    }
}
// Editar agrupamento
function carregaAlunosModal(){
    var cicloModal = $("#cicloGrupoModal").val();
    var periodoModal = $("#periodoGrupoModal").val();
    var urlDinamica = "";
    var htmlAlunos = "";
    var isOnList = "";

    if (cicloModal !== 0 && periodoModal !== 0)
        urlDinamica = "AlunoVariavel/listarCicloPeriodoRangeObjeto/" + cicloModal + "/"+ periodoModal + "/";
    else if ($("#cicloGrupoModal").val() !== 0)
        urlDinamica = "AlunoVariavel/listarCicloRangeObjeto/" + cicloModal + "/";
    else
        urlDinamica = "AlunoVariavel/listarPeriodoRangeObjeto/" + periodoModal + "/";

    $.ajax({
        url: path + urlDinamica + contAlunosModal * 20 + "/19",
        type: "GET",
        async: false,
        crossDomain: true,
        dataType: 'json',
        success: function(dataAlunos) {
            // if (!arraySelected.length > 0) {
            //     arraySelected = carregaAlunosAgrupamento(); trocar isso pra função de carregar alunos dos agrupamentos mais tarde
            // }

            for(var i = 0; i < dataAlunos.length; i++){
                var isOnList = false;
                var arraySelected = carregaSelectedModal();

                for(var j = 0; j < arraySelected.length; j++){
                    if(dataAlunos[i].idalunoVariavel == arraySelected[j]){
                        arraySelected.splice(j, 1);
                        isOnList = true;
                        break;
                    }
                }

                if(!isOnList){
                    htmlAlunos += '<div class="Grupo_Aluno_Linha" data-status="0">' + 
                                    '<span class="Nome_Aluno">' +dataAlunos[i].aluno.nome+ '</span>' +
                                    '<input type="checkbox" id="Aluno_Check_'+dataAlunos[i].idalunoVariavel+'" class="Aluno_Ano_Check">' + 
                                    '<label for="Aluno_Check_'+dataAlunos[i].idalunoVariavel+'">' + 
                                        '<span>&nbsp;</span>' + 
                                    '</label>' + 
                                    '<span class="Ano_Aluno">' +dataAlunos[i].anoEstudo.ano+ 'º ano</span>' +
                                  '</div>';
                }
            }
            $("#Area_Alunos_Modal").append(htmlAlunos);
            if (dataAlunos == ''){
                acabouDeCarregarModal = true;
            } else {
                var selectedModal = $(".Selected");
                var lstAlunos = $(".Aluno_Ano_Check");
                var linha = "";

                for(var i = 0; i < selectedModal.length; i++){
                    for(var j = 0; j < lstAlunos.length; j++){
                        if(selectedModal[i].id == lstAlunos[j].id){
                            linha += '<div class="Grupo_Aluno_Linha">'+$("#"+lstAlunos[j].id).parent().html()+'</div>';
                        }
                    }
                }
                $("#Area_Alunos_Modal").append(linha);
                for(var z = 0; z < selectedModal.length; z++){
                    $("#"+selectedModal[z].id).prop("checked", true);
                }
            }
            contAlunosModal++;
            isSelectedModal();   
        }
    });
}

function resetAreaModal(){
    contAlunosModal = 0;
    acabouDeCarregarModal = false;
    var grupoLinhas = $(".Grupo_Aluno_Linha");
    for(var i = 0; i < grupoLinhas.length; i++){
        if(!$($(grupoLinhas).get(i)).hasClass("Selected")){
            $($(grupoLinhas).get(i)).remove();
        }
    }
    //$('#Area_Alunos_Modal').empty();
    //arraySelected = []; //Lembre-se, isso serve pra carregar certinho os alunos dos agrupamentos
}

function isSelectedModal(){
    $(".Aluno_Ano_Check").unbind("click");
    $(".Aluno_Ano_Check").click(function(){
            var idAlunoCheck = $(this).attr('id');
            $("#" + idAlunoCheck).parent('.Grupo_Aluno_Linha').toggleClass("Selected");
    });
}

function carregaSelectedModal(){
    var selected = $(".Selected");
    var arraySelected = [];
    for(var i = 0; i < selected.length; i++){
        arraySelected.push($(".Selected .Aluno_Ano_Check")[i].id.split('_')[2]);
    }
    return arraySelected;
}

function atribuiFuncoesRolagemModal(){
    $(".Alunos_Container_Modal").mCustomScrollbar({
        axis:"y",
        scrollButtons:{
            enable:true
        },
        callbacks:{
            alwaysTriggerOffsets: false,
            onTotalScrollOffset: 500,
            whileScrolling: function(){
                if(this.mcs.topPct > 95 && !acabouDeCarregarModal){
                    carregaAlunosModal();
                    isSelectedModal();
                }
            },
            onTotalScroll: function(){
                if(!acabouDeCarregarModal){
                    carregaAlunosModal();
                    isSelectedModal();
                }
            }
        }
    });
}