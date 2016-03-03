var acabouDeCarregarTutoria = false;
var contAlunosTutoria = 0;
var idAgrupamento = 0;
var alunosId = "";

$(document).ready(function(){
    salvarTutoria();
    carregaTutor();    
    carregaCicloTutoria();
    atribuiChangeTutoria();
    atribuiFuncoesRolagemGrupo();    
});

function salvarAluno(agrupamento){
    $(".btn_Salvar_Aluno").click(function(){
        agrupamento = idAgrupamento;
        var alunos = $(".Aluno_Ano_Check:checked");
        carregarAlunos();
    
        if (alunos.length == '0') {
            mensagem("A tutoria deve ter pelo menos 1 aluno.","OK","bt_ok","erro");
        } else {
            $.ajax({
                url: path + "AlunoVariavel/alunoGrupo",
                type: "POST",
                data:"alunos=" + alunosId + "&grupo=" + agrupamento,
                async: false,
                crossDomain:true,
                beforeSend: function(){
                    loading("inicial"); 
                },
                success: function(){
                    $(".Area_Select_Tutoria").hide();
                    displayAlunos();
                    $(".btn_Nova_Tutoria").click(function(){
                        resetarTutoria();
                    });
                    mensagem("Aluno(s) cadastrado(s) com sucesso.","OK","bt_ok","sucesso");
                },
                complete:function(){
                    loading("final");
                }
            });
        } 
        alunosId = "";
    });    
} 

function salvarTutoria(){
    $("#btn_Salvar_Tutoria").click(function() {
        var professorId = $("#tutorTutoria :selected").val();
        var ciclo = $("#cicloTutoria :selected").val();
        ciclo = ciclo.split('_');
        var periodoId = $("#periodoTutoria :selected").val();
         var periodo = $("#periodoTutoria :selected").text();
        periodo = periodo[0];
        if (ciclo != '0' &&
            periodoId != '0' &&
            professorId == '0'
            ){            
            mensagem("Você deve escolher um professor.","OK","bt_ok","erro");
        } else if (ciclo != '0' &&
            periodoId == '0' &&
            professorId != '0'
            ){            
            mensagem("Você deve escolher um periodo.","OK","bt_ok","erro");
        } else if (ciclo == '0' &&
            periodoId != '0' &&
            professorId != '0'
            ){            
            mensagem("Você deve escolher um ciclo.","OK","bt_ok","erro");
        } else if (periodoId == '0' ||
            ciclo == '0' ||
            professorId == "0"
            ) {
            mensagem("Você deve preencher todos os campos.","OK","bt_ok","erro");
        } else{
            $.ajax({
                url: path + "Grupo",
                type: "POST",
                async: false,
                crossDomain: true,
                data:"action=create&status=0&anoEstudo=0&periodo="+periodo+"&idProfessor="+professorId+"&lider=0&id=0"+"&idPeriodo="+periodoId+"&ciclo="+ciclo[0],           
                beforeSend: function(){
                    loading("inicial");
                },
                success: function(data){      
                    $("#Container_Cadastro_Tutoria").css('display','none')
                    mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");
                    idAgrupamento = data;
                    displayHeader();
                    $(".btn_Salvar_Aluno").show();
                    $("#btn_Salvar_Tutoria").hide();
                    salvarAluno(data);
                    editarTutoria(data);
                },
                complete: function(){
                    loading("final");
                }
            });
        }
    });    
}

function carregaCicloTutoria(){
    var HtmlCiclo = '<option value="0"></option>'; //Variável que recebe o select de ciclo
    $.ajax({
        url: path + "Ciclo", //Caminho para o banco de dados, ou página que o ajax vai requisitar
        type: "GET", // Tipo get, dados do banco serão consultados
        async: false, //Significa este bloco ajax vai ser rodado antes do restante dos scripts
        crossDomain: true,
        dataType: 'json',
        success: function (data) { //Função que vai ser requisitada após sucesso
            for (var i = 0; i < data.length; i++) {
                HtmlCiclo += '<option class="opcaoCI" value="'+data[i].sigla+'_'+data[i].idciclos+'">'+data[i].ciclo+'</option>';
               // console.log("Sigla do ciclo: " + data[i].sigla);
            };
        }
    });
    $('#cicloTutoria').append(HtmlCiclo);
}

function carregaTutor(){
    var html = '<option value="0"></option>'; 
    $.ajax({
        url: path + "ProfessorFuncionario",
        type: "GET",
        async: false,
        crossDomain:true,
        dataType: 'json',
        success: function(data){
            for (var i=0; i<data.length; i++) {
                html+="<option value=\""+data[i].idprofessorFuncionario+"\">"+data[i].nome+"</option>";
             //   console.log("Id Tutoria: " + data[i].idprofessor_funcionario + "\nNome: " + data[i].tutoria);
            };            
        }
    });
    $("#tutorTutoria").html(html); //Joga o conteúdo da variável html no elemento de ID tutorTutoria do documento html
    //$("#tutorTutoria").append(html); //append soma o conteúdo anterior do html com o novo.
}

function atribuiChangeTutoria(){
    $("#cicloAluno").change(function() {
        limparArea();
        listarAlunosGruposTutoria();
        // cleanSelected(); - Descomentar caso alunos de ciclos diferentes NÃO possam ser incluídos nos mesmos grupos.
    });

    $("#periodoIdAluno").change(function(){
        limparArea();
        listarAlunosGruposTutoria();
    });
}

function listarAlunosGruposTutoria() {    
    var cicloId = $("#cicloAluno").val();
    var periodoIdAluno = $("#periodoIdAluno").val();
    var urlDinamica = "";
    
    if ($("#cicloAluno").val() != '0' && $("#periodoIdAluno").val() != '0') {
        urlDinamica = "AlunoVariavel/listarCicloPeriodoRangeObjeto/" +cicloId+ "/" +periodoIdAluno+ "/";
    } else if($("#cicloAluno").val() != '0'){
        urlDinamica = "AlunoVariavel/listarCicloRangeObjeto/" +cicloId+ "/";  
    } else {
        urlDinamica = "AlunoVariavel/listarPeriodoRangeObjeto/" +periodoIdAluno+ "/";
    };

    var htmlAluno = '';
   $.ajax({        
        url: path + urlDinamica + contAlunosTutoria * 20 + "/19",
        type: "GET",
        async: false,
        crossDomain: true,
        dataType: 'json',
        success: function(dataAlunosG) {
        
            for(var i = 0; i < dataAlunosG.length; i++ ) {

                var isOnList = false; //Booleano que verifica se aluno já está na lista                
                var arraySelected = carregaSelected(); //Retorno da função com uma lista de alunos selecionados

                for (var j = 0; j < arraySelected.length; j++) {
                    if(dataAlunosG[i].idalunoVariavel == arraySelected[j]){
                        arraySelected.splice(j, 1); //Remove o aluno já selecionado que estiver na lista a ser carregada
                        isOnList = true; //Se ele encontrar, a variável recebe o valor true
                        break;  //Faz com que ele pare o for quando encontra algo
                    }  
                }

                if (!isOnList) //Verifica se Não está na lista de selecionados, aí carrega
                    htmlAluno += '<div class="Grupo_Aluno_Linha">'+
                                   '<span class="Nome_Aluno">' + 
                                       dataAlunosG[i].aluno.nome + 
                                   '</span>' +
                                   '<input type="checkbox" id="Aluno_Ano_Check_'+dataAlunosG[i].idalunoVariavel+'" class="Aluno_Ano_Check" />' +
                                   '<label for="Aluno_Ano_Check_'+dataAlunosG[i].idalunoVariavel+'">'+
                                       '<span>&nbsp;</span>' +
                                   '</label>'+
                                   '<span class="Ano_Aluno">'+
                                       dataAlunosG[i].anoEstudo.ano+'º ano'+
                                   '</span>'+
                                '</div>';                      
            }
            $("#boxAluno").append(htmlAluno);        
            
            if (dataAlunosG == ''){
                acabouDeCarregarTutoria = true;
            }else{
                var selecionados = $('.Selected');
                var listaAlunos = $('.Aluno_Ano_Check');
                var linha="";

                for(var j=0;j<selecionados.length;j++){
                    for(var i=0;i<listaAlunos.length;i++){            
                        if(selecionados[j].id == listaAlunos[i].id){
                            linha += '<div class="Grupo_Aluno_Linha">'+ $('#'+listaAlunos[i].id).parent().html()+'</div>';
                        }
                    }
                }
                $('#boxAluno').append(linha);

                for(var j=0;j<selecionados.length;j++){
                    $('#'+selecionados[j].id).prop("checked",true);
                }
            }        
            contAlunosTutoria++;
            isSelected();
            
        }
    }); 
}

function limparArea(){
    contAlunosTutoria = 0;
    acabouDeCarregarTutoria = false;
    var linhas = $(".Grupo_Aluno_Linha");
    for (var i = 0; i < linhas.length; i++) {
        if (!$($(linhas).get(i)).hasClass("Selected")) {
            $($(linhas).get(i)).remove();
        }
    }    
    $("#listarAluno").show();
    if($("#cicloAluno").val() == 0 && $("#periodoIdAluno").val() == 0){
        $("#listarAluno").hide();
    }
} //Limpar area de alunos

//Comentada para que alunos de ciclos diferentes possam ser incluidos/alterados das tutorias.
// function cleanSelected(){ //Limpa alunos selecionados de acordo com ciclo.
//     var arrayChecked = $(".Grupo_Aluno_Linha.Selected");
//     for(var i = 0; i < arrayChecked.length; i++){
//         arrayChecked[i] += arrayChecked[i].classList.remove("Selected");
//     }
// }

function atribuiFuncoesRolagemGrupo () {
    $("#boxListaAluno").mCustomScrollbar({
        axis:"y", // vertical and horizontal scrollbar
        scrollButtons:{
            enable:true
        },
        callbacks:{
            alwaysTriggerOffsets: false,
            onTotalScrollOffset: 500,
            whileScrolling: function() {
                if (this.mcs.topPct > 95 && !acabouDeCarregarTutoria)
                {
                    var cicloAluno = $("#cicloAluno").val();
                    cicloAluno = cicloAluno.split('_')[1];
                    var periodoIdAluno = $("#periodoIdAluno").val();
                   listarAlunosGruposTutoria();
                   isSelected();
               }

            },
            onTotalScroll:function(){
                if (!acabouDeCarregarTutoria)
                {
                    var ciclo = $("#cicloAluno").val();
                    ciclo = ciclo.split('_')[1];
                    var periodoId = $("#periodoIdAluno").val();
                    listarAlunosGruposTutoria();
                    isSelected();
                }
            }
        }
    });
}

function isSelected(){ //Método 'está selecionado', vai ser chamado no onChange do check box de alunos 
    $(".Aluno_Ano_Check").unbind("click");
    $(".Aluno_Ano_Check").click(function(){
        var idAlunoCk = $(this).attr("id");
        var idAlunoC = idAlunoCk.split("_")[3];
        $("#"+ idAlunoCk).parent('.Grupo_Aluno_Linha').toggleClass("Selected");
    });
} 

function displayHeader(){
    var cicloTutoria = $("#cicloTutoria option:selected ").text();
    var periodoTutoria = $("#periodoTutoria option:selected ").text();
    var tutorTutoria = $("#tutorTutoria option:selected").text();
    var conteudoHeader =  '<span> ' +cicloTutoria+ ' |</span>'+
                        '<span> ' +periodoTutoria+ ' |</span>' +
                        '<span> ' +tutorTutoria+ ' |</span>';
    $("#Area_Nome_Tutoria").html(conteudoHeader);
    $("#Area_Nome_Tutoria").css('display', 'block');
    $("#Container_Cadastro_Aluno").css('display','block');
    $("#listarAluno").hide();
    $("#txtPesqTut").show();
    //$(".btn_Salvar_Tutoria").css('display','none');
    //$(".btn_Salvar_Aluno").css('display','block');   
}

function editarTutoria(agrupamento){
    $(".btn_Editar_Tutoria").click(function(){
        var htmlEditTut = "";
        $(".btn_Nova_Tutoria").hide();
        $("#btn_Salvar_Tutoria").hide();
        $(".btn_EditPesq_Tutoria").show();
        $("#Container_Cadastro_Aluno").show();
        $(".Area_Select_Tutoria").show();
        $("#periodoIdAluno").val("0");
        $("#cicloAluno").val("0");
        $("#listarSelect").hide();
        $("#boxAluno").empty();
        $("#boxSelect").empty();
        $("#listarAluno").show();
        $.ajax({
        url: path + "Grupo/AlunoGrupo/" + agrupamento,
        type: "GET",
        async: false,
        crossDomain: true,
        dataType: "json",
        success: function(dataAlunoEdicao){
            for(var i=0; i < dataAlunoEdicao.length; i++){
                htmlEditTut += '<div class="Grupo_Aluno_Linha Selected">'+
                                   '<span class="Nome_Aluno">' + 
                                       dataAlunoEdicao[i].aluno.nome + 
                                   '</span>' +
                                   '<input type="checkbox" id="Aluno_Ano_Check_'+dataAlunoEdicao[i].idalunoVariavel+'" class="Aluno_Ano_Check" />' +
                                   '<label for="Aluno_Ano_Check_'+dataAlunoEdicao[i].idalunoVariavel+'">'+
                                       '<span></span>' +
                                   '</label>'+
                                   '<span class="Ano_Aluno">'+
                                       dataAlunoEdicao[i].anoEstudo.ano+'º ano'+
                                   '</span>'+
                                '</div>';
            }
            $("#boxAluno").append(htmlEditTut);
            $(".Aluno_Ano_Check").prop("checked", true);
            atualizarAluno(agrupamento);
        }
        });
    });
}

function atualizarAluno(agrupamento){
    $(".btn_EditPesq_Tutoria").click(function(){
        var alunosEdit = $(".Aluno_Ano_Check:checked");
        carregarAlunos();
        if(alunosEdit.length == '0'){
            mensagem("A tutoria deve ter pelo menos 1 aluno.","OK","bt_ok","erro");    
        } else {
            $.ajax({
                url: path + "AlunoVariavel/alunoGrupo",
                type: "POST",
                data: "alunos=" + alunosId + "&grupo=" + agrupamento,
                async: false,
                crossDomain: true,
                beforeSend: function(){
                    loading("inicial");
                },
                success: function(){
                    $(".Area_Select_Tutoria").hide();
                    displayAlunos();
                    $(".btn_EditPesq_Tutoria").hide();
                    mensagem("Grupo alterado com sucesso.","OK","bt_ok","sucesso");
                    $(".btn_Nova_Tutoria").click(function(){
                        resetarTutoria();
                    });
                    editarTutoria(agrupamento);
                },
                complete: function(){
                    loading("final");
                }
            });
        }
        alunosId = "";
    });
}

function carregarAlunos(){
    listaAlunoSelecionado = $(".Aluno_Ano_Check:checked");
    for (var i = 0; i < listaAlunoSelecionado.length; i++) {
        alunosId += $(".Aluno_Ano_Check:checked")[i].id.split("_")[3] + ";";        
    }
    listaAlunoSelecionado = "";
}

function displayAlunos(){
    var ifSelected = [];
    var linhas = $(".Grupo_Aluno_Linha");
    for (var i = 0; i < linhas.length; i++) {
        if ($($(linhas).get(i)).hasClass("Selected")) {
            ifSelected.push($($(linhas).get(i)));
        }        
    } 
    $("#boxSelect").append(ifSelected);
    $("#listarAluno").hide();
    $("#listarSelect").show();

    $(".Aluno_Ano_Check").each(function(){
        $(this).next('label').hide();
    }); 
    $("#txtPesqTut").hide();
    $("#btn_Salvar_Tutoria").hide();
    $(".btn_Nova_Tutoria").show();
    $(".btn_Editar_Tutoria").show();
    $(".btn_Salvar_Aluno").hide();

}

function carregaSelected(){
   var selected = $(".Selected");
    var arraySelected = [];
    for (var i = 0; i < selected.length; i++) {
        arraySelected.push($(".Selected .Aluno_Ano_Check")[i].id.split('_')[3]);
    }
    return arraySelected;    
}

function resetarTutoria(){
    resetarCadastroTutoria();
    resetarCadastroAluno();
}

function resetarCadastroTutoria(){
    $("#Container_Cadastro_Tutoria").css('display','block');
    $(".Area_Select_Tutoria").css('display','block');
    $("#Area_Nome_Tutoria").empty();
    $("#Area_Nome_Tutoria").css('display','none');
    $("#tutorTutoria").val('-1');
    $("#cicloTutoria").val('0');
    $("#periodoTutoria").val('0');
}

function resetarCadastroAluno(){
    $("#Container_Cadastro_Aluno").css('display','none');  
    $("#btn_Salvar_Tutoria").css('display','block');
    $(".btn_Nova_Tutoria").css('display', 'none');
    $(".btn_Editar_Tutoria").hide();
    $("#boxAluno").empty();
    $("#boxSelect").empty(); 
    $("#listarAluno").css('display','block');
    $("#listarSelect").css('display','none');
    $("#cicloAluno").val('0');
    $("#periodoIdAluno").val('0');
}
