var contAlunosModal = 0;
var acabouDeCarregarModal = false;

$(document).ready(function(){
	atruiChangesModal();
});

function atruiChangesModal(){
    $("#cicloGrupoModal").change(function () {
        resetAreaModal();
        carregaAlunosModal();
    });

    $("#periodoGrupoModal").change(function () {
        resetAreaModal();
        carregaAlunosModal();
    });
}

function resetAreaModal () {
    contAlunos = 0;
    acabouDeCarregar = false;
    $('#Area_Alunos_Modal').empty();
}

// Editar agrupamento
function carregaAlunosModal(){

    if ($("#cicloGrupoModal").val() != '0' && $("#periodoGrupoModal").val() != '0')
        buscarCicloPeriodoModal();
    else if ($("#cicloGrupoModal").val() != '0')
        buscarCicloModal();
    else
        buscarPeriodoModal();
}
function buscarCicloPeriodoModal () {
    $.ajax({
        url: path + "AlunoVariavel/listarCicloPeriodoRange/" + $("#cicloGrupoModal").val() + "/" + $("#periodoGrupoModal").val() + "/" + contAlunos * 20 + "/19",
        type: "GET",
        async: false,
        crossDomain: true,
        dataType: 'html',
        success: function(dataAlunos) {
            if (dataAlunos == '')
                acabouDeCarregarModal = true;
            else
                $('#Area_Alunos_Modal').append(dataAlunos);
            contAlunos++;
        }
    });
}

function buscarCicloModal () {
    $.ajax({
        url: path + "AlunoVariavel/listarCicloRange/" + $("#cicloGrupoModal").val() + "/" + contAlunos * 20 + "/19",
        type: "GET",
        async: false,
        crossDomain: true,
        dataType: 'html',
        success: function(dataAlunos) {
            if (dataAlunos == '')
                acabouDeCarregarModal = true;
            else
                $('#Area_Alunos_Modal').append(dataAlunos);
            contAlunos++;
        }
    });
}

function buscarPeriodoModal () {
    $.ajax({
        url: path + "AlunoVariavel/listarPeriodoRange/" + $("#periodoGrupoModal").val() + "/" + contAlunos * 20 + "/19",
        type: "GET",
        async: false,
        crossDomain: true,
        dataType: 'html',
        success: function(dataAlunos) {
            if (dataAlunos == '')
                acabouDeCarregarModal = true;
            else
                $('#Area_Alunos_Modal').append(dataAlunos);
            contAlunos++;
        }
    });
}