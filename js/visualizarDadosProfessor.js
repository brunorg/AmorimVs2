var StoredCamposini = [];
var StoredCamposfim = [];

/* Pegar Valor GET da URL */
function GetURLParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}

function listadados(){
    
    var a;      
    var idAluno = $("#idAluno").val();      
    if(localStorage.getItem("professorEdt") != ""){         
        /*resgata os dados do aluno selecionado*/
        var dataProfessor;
        $.ajax({
            url: path + "ProfessorFuncionario/" + localStorage.getItem("professorEdt"),
            type: "GET",
            async: false,
            crossDomain: true,
            success: function(data){
                dataProfessor = data;
            }
        });
        var dataUsuario = getData("Usuario", null);
        
        /*exibe as combos que estavam ocultas*/
        $("#frmCadastroProfessorVariavel").css("display","block");
        //$("#aluno").val(alunoEdt);  
        //$("#idAluno").val(alunoEdt);        
        
        /*Aqui será carregado todos os dados do aluno no formulário para que possa ser editado*/    
        /*dados pessoais*/
        
        $("#nome").val(dataProfessor.nome);
        if (dataProfessor.ativo == "S")
            { $("#ativo").val("Ativo"); }
        else
            { $("#ativo").val("Inativo"); }
        $("#dataEntradaEscola").val(dataProfessor.dataEntradaEscola);
        $("#dataEntradaPrefeitura").val(dataProfessor.dataEntradaPrefeitura);
        $("#naturalidadeEstado").val(dataProfessor.naturalidadeEstado);
        $("#naturalidadePais").val(dataProfessor.naturalidadePais);
        $("#rua").val(dataProfessor.rua);
        $("#bairro").val(dataProfessor.bairro);
        $("#numero").val(dataProfessor.numero);
        $("#complemento").val(dataProfessor.complemento);
        $("#cep").val(dataProfessor.cep);
        $("#estado").val(dataProfessor.estado);
        $("#cidade").val(dataProfessor.cidade);
        $("#observacao").val(dataProfessor.observacao);

        var dataProfessorVariavel;

        $.ajax({
            url: path + "ProfessorFuncionarioVariavel/Professor/" + dataProfessor.idprofessorFuncionario,
            type: "GET",
            async: false,
            crossDomain: true,
            success: function(data){
                dataProfessorVariavel = data;
            }
        });

        $("#formacao").val(dataProfessorVariavel[0].formacao);
        $("#cargo").val(dataProfessorVariavel[0].cargo);
        $("#qpe").val(dataProfessorVariavel[0].qpe);
        $("#letra").val(dataProfessorVariavel[0].letra);
        $("#periodo").val(dataProfessorVariavel[0].periodo.periodo);
        $("#anoLetivo").val(dataProfessorVariavel[0].anoLetivo.ano.split("-")[0]);
    }
}