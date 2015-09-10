var StoredCamposini = [];
var StoredCamposfim = [];

$(document).ready(function(){

	$('.close_upload_producao').click(function(){
		$(".blackPainel").css("display","none");	
	});

	GerarUpload($("#foto"), $("#fotoAluno"), $("#fotoAluno"));	

});

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

$('#frmCadastroAluno').click(function(){selecao();});


function selecao(){
	var perfil = $("#perfil").val(); // recebe o valor do elemento de ID estado        
	if(perfil==1){
		$("#linha4").removeClass("ocultar");
		$("#linha5").removeClass("ocultar");
		$("#linha6").addClass("ocultar");
		$("#buscaAluno").removeClass("ocultar");
		$("#buscaProfessor").addClass("ocultar");	
		
		//executa as funções
		carregaAnoEstudo();
		carregaPeriodo("aluno");
		carregaAluno("todos");
		var abaAtiva = $(".abas_ativa").attr("id");
		$("#"+abaAtiva).removeClass("abas_ativa");
		$("#abaCadAluno").addClass("abas_ativa");
		
	}else{
		$("#linha4").addClass("ocultar");
		$("#linha5").addClass("ocultar");
		$("#linha6").removeClass("ocultar");
		$("#buscaProfessor").removeClass("ocultar");
		$("#buscaAluno").addClass("ocultar");
		carregaPeriodo("professor");
		carregaProfessor("todos");
		var abaAtiva = $(".abas_ativa").attr("id");
		$("#"+abaAtiva).removeClass("abas_ativa");
		$("#abaCadProfessor").addClass("abas_ativa");
	}	
}

function carregaAluno(todos){
	/*lista alunos*/
	var dataAlunoVariavel = getData("AlunoVariavel", null);	
	var HtmlContent = "";
	var anoEstudo = $("#PesqAnoEstudo").val();
	var periodo = $("#periodo").val();	
	
	for(var a=0;a<dataAlunoVariavel.length; a++){	
		if((dataAlunoVariavel[a].anoEstudo.idanoEstudo == anoEstudo ||(anoEstudo == ""))&&(dataAlunoVariavel[a].periodo.idperiodo == periodo || periodo == "")){			
			var temFoto;
			if(dataAlunoVariavel[a].aluno.fotoAluno != "http://177.55.99.90/files/Masc.png" && dataAlunoVariavel[a].aluno.fotoAluno != "http://177.55.99.90/files/Fem.png" && dataAlunoVariavel[a].aluno.fotoAluno != null ){
				temFoto ='style="background:#E80000"';
			}else{
				temFoto="";
			}
				HtmlContent += '<tr id="aluno'+dataAlunoVariavel[a].aluno.idAluno+'" '+temFoto+' onClick="abreBoxSalvarFoto('+dataAlunoVariavel[a].aluno.idAluno+',\'aluno\')">'+
								'<td class="alunoNome">'+dataAlunoVariavel[a].aluno.nome+'</td>'+
								'<td class="alunoAno">'+dataAlunoVariavel[a].anoEstudo.ano+'º Ano</td>'+
								'<td class="alunoPeriodo">'+dataAlunoVariavel[a].periodo.periodo+'</td>'+
							   '</tr>';
		}else if (todos == "todos"){
			HtmlContent += '<tr id="aluno""'+dataAlunoVariavel[a].aluno.idAluno+' '+temFoto+' onClick="abreBoxSalvarFoto('+dataAlunoVariavel[a].aluno.idAluno+',\'aluno\')">'+
								'<td class="alunoNome">'+dataAlunoVariavel[a].aluno.nome+'</td>'+
								'<td class="alunoAno">'+dataAlunoVariavel[a].anoEstudo.ano+'º Ano</td>'+
								'<td class="alunoPeriodo">'+dataAlunoVariavel[a].periodo.periodo+'</td>'+
							  '</tr>';
		}
	}	
	$('#lista').html(HtmlContent);
}
function carregaProfessor(todos){
	/*lista alunos*/
	var dataProfessorFV = getData("ProfessorFuncionarioVariavel", null);	
	var HtmlContentP = "";
	var periodoP = $("#periodoP").val();	
	
	for(var d=0;d<dataProfessorFV.length; d++)
	{	
		//console.log(dataProfessorFV[d].periodo.idperiodo,periodoP);	
		if(todos == "todos"){
			HtmlContentP += '<tr id="aluno" onClick="editarProfessor('+dataProfessorFV[d].idprofessorFuncionarioVariavel+');" >'+
								'<td class="alunoNome">'+dataProfessorFV[d].professorFuncionario.nome+'</td>'+
								'<td class="alunoPeriodo"></td>'+
							  '</tr>';
		}else{
			if(dataProfessorFV[d].periodo.idperiodo == periodoP){
				HtmlContentP += '<tr id="aluno" onClick="editarProfessor('+dataProfessorFV[d].professorFuncionario.idprofessorFuncionario+');">'+
								'<td class="alunoNome">'+dataProfessorFV[d].professorFuncionario.nome+'</td>'+
								'<td class="alunoPeriodo">'+dataProfessorFV[d].periodo.periodo+'</td>'+
							  '</tr>';
			}
		}
	}	
	$('#lista').html(HtmlContentP);
}


function carregaPeriodo(pefil){
	/*lista Periodo*/
	var dataPeriodo = getData("Periodo", null);	
	HtmlContent = ""; 
	for(var c=0;c<dataPeriodo.length; c++)
	{
		HtmlContent += "<option value='"+dataPeriodo[c].idperiodo+"'>"+(dataPeriodo[c].periodo)+"</option>";
	}
	if(pefil=="aluno"){
		$('#periodo').html("<option></option>"+HtmlContent);
	}else{
		$('#periodoP').html("<option></option>"+HtmlContent);
	}	
}

function carregaAnoEstudo(){
	/*lista anoEstudo*/
	var dataAnoEstudo = getData("AnoEstudo", null);	
	HtmlContent = ""; 
	for(var b=0;b<dataAnoEstudo.length; b++)
	{
		HtmlContent += "<option value='"+dataAnoEstudo[b].idanoEstudo+"'>"+(dataAnoEstudo[b].ano)+"º</option>";
	}
	$('#PesqAnoEstudo').html("<option></option>"+HtmlContent);
}

function abreBoxSalvarFoto(id,perfil){
	$(".blackPainel").css("display","block");
	$("#idAluno").val(id);
}

function salvarFotoAluno(){
	var idAluno = $("#idAluno").val();
	var tipoArquivo = $("#fotoAluno").val();
		
	var extensao = (tipoArquivo.substring(tipoArquivo.lastIndexOf("."))).toLowerCase(); 
	var tipo = extensao.split('.');		
	
	
	if((tipo[1]=='jpg')||(tipo[1]=='png')||(tipo[1]=='jpeg')){
		var formData = new FormData($("#inserirArquivo")[0]);
		$.ajax({
			url: path+"Alunos/upload/aluno/"+idAluno,
			type: "POST",
			mimeType:"multipart/form-data",
			contentType: false,
			cache: false,
			processData:false,
			data: formData,
			success: function(d) {
				$("#aluno"+idAluno).css("background","#E80000");
				$("#foto").css("background","")
				mensagem("Arquivo salvo com sucesso!","OK","bt_ok","sucesso");
				$(".blackPainel").css("display","none");
			}
		});
	}else{
		mensagem("Este arquivo não é uma imagem!, verifique os campos!","OK","bt_ok","erro");
	}	
}

function salvarFotoProfessor(id){
    var idProfessor = $("#professorFuncionario").val();
    var tipoArquivo = $("#fotoAluno").val();
    $("#inserirArquivo .arquivo").attr("id", "imagem");
    $("#inserirArquivo .arquivo").attr("name", "imagem");

    var extensao = (tipoArquivo.substring(tipoArquivo.lastIndexOf("."))).toLowerCase(); 
    var tipo = extensao.split('.');         
    
    if((tipo[1]=='jpg')||(tipo[1]=='png')||(tipo[1]=='jpeg')){
        var formData = new FormData($("#inserirArquivo")[0]);
        $.ajax({
            url: path+"ProfessorFuncionario/upload/ProfessorFuncionario/imagem/"+idProfessor,
            type: "POST",
            mimeType:"multipart/form-data",
            contentType: false,
            cache: false,
            processData:false,
            data: formData,
            success: function(d) {
                $(".blackPainel").css("display","none");
                $("#cadUsuario").css("display","block");
                mensagem("Arquivo salvo com sucesso!","OK","bt_ok","sucesso");
                var dataProfessores = getData("ProfessorFuncionario", idProfessor);
                $("#fotoCad").css("display","block").html("<img id='_foto' src='"+dataProfessores.fotoProfessorFuncionario+"' width='150' height='150'/>");
                debugger;
            }
        });
    }else{
        mensagem("Este arquivo não é uma imagem!, verifique os campos!","OK","bt_ok","erro");
    }   
}