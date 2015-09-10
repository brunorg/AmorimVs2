var StoredCamposini = [];
var StoredCamposfim = [];

$(document).ready(function(){	
	$(".box_margin_barra").load( "cadastroAluno.html");
    $(".abas").click(function(){
		var aba = $(this).attr("id");
		if(aba == "abaCadAluno"){
			$(".box_margin_barra").load( "cadastroAluno.html");
			$("#box_cadastro").css("background","#F1F1EC");
		}else if(aba == "abaCadProfessor"){
			$(".box_margin_barra").load( "cadastroProfessor.html");
			$("#box_cadastro").css("background","#F1F1EC");
			$('.dataFixaSalva').remove();
		}else if(aba == "abaPesquisa"){
			$(".box_margin_barra").load( "pesquisa.html");
			$("#box_cadastro").css("background","#e5e5dc");
		}
		var abaAtiva = $(".abas_ativa").attr("id");
		$("#"+abaAtiva).removeClass("abas_ativa");
		$("#"+aba).addClass("abas_ativa");		
	});	
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
		
	}else{
		$("#linha4").addClass("ocultar");
		$("#linha5").addClass("ocultar");
		$("#linha6").removeClass("ocultar");
		$("#buscaProfessor").removeClass("ocultar");
		$("#buscaAluno").addClass("ocultar");
		carregaPeriodo("professor");
		carregaProfessor("todos");
	}	
}

function carregaAluno(todos){
	/*lista alunos*/
	var dataAlunoVariavel = getData("AlunoVariavel", null);	
	var HtmlContent = "";
	var anoEstudo = $("#PesqAnoEstudo").val();
	var periodo = $("#periodo").val();	
	
	for(var a=0;a<dataAlunoVariavel.length; a++)
	{	
		if((dataAlunoVariavel[a].anoEstudo.idanoEstudo == anoEstudo ||(anoEstudo == ""))&&(dataAlunoVariavel[a].periodo.idperiodo == periodo || periodo == "")){
				HtmlContent += '<tr id="aluno" onClick="editarAluno('+dataAlunoVariavel[a].aluno.idAluno+')">'+
								'<td class="alunoNome">'+dataAlunoVariavel[a].aluno.nome+'</td>'+
								'<td class="alunoAno">'+dataAlunoVariavel[a].anoEstudo.ano+'º Ano</td>'+
								'<td class="alunoPeriodo">'+dataAlunoVariavel[a].periodo.periodo+'</td>'+
							   '</tr>';
		}else if (todos == "todos"){
			HtmlContent += '<tr id="aluno" onClick="editarAluno('+dataAlunoVariavel[a].aluno.idAluno+')">'+
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
								'<td class="alunoPeriodo">'+dataProfessorFV[d].periodo.periodo+'</td>'+
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

function editarProfessor(idProfessor){
	$(".box_margin_barra").load("cadastroProfessor.html");
	$("#box_cadastro").css("background","#F1F1EC");	
	localStorage.setItem("professorEdt",idProfessor);
	/*window.setTimeout(function(){
		$("#editarId").val(idProfessor);
	},10);*/
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

function editarAluno(idAluno){
	$(".box_margin_barra").load("cadastroAluno.html");
	$("#box_cadastro").css("background","#F1F1EC");	
	localStorage.setItem("alunoEdt",idAluno);
	window.setTimeout(function(){
		$("#editarId").val(idAluno);
	},10);
}

function listadados(){	
	var a;		
	var alunoEdt = localStorage.getItem("alunoEdt");
	
	var idAluno = $("#idAluno").val();		
	if((alunoEdt != null && alunoEdt!="")){		
		/*resgata os dados do aluno selecionado*/
		var dataAlunos = getData("Alunos", alunoEdt);	
		
		/*exibe as combos que estavam ocultas*/
		$(".opcaoFoto").css("display","block");
		$("#cadUsuario").css("display","block");	
		$("#cadAlunoVar").css("display","block");		
		$("#action").val("update");	
		$("#actionUser").val("update");
		$("#actionUserVar").val("update");
		$("#aluno").val(alunoEdt);	
		$("#idAluno").val(alunoEdt);		
		
		/*Aqui será carregado todos os dados do aluno no formulário para que possa ser editado*/	
		/*dados pessoais*/
		$("#nome").val(dataAlunos.nome);
		$("#email").val(dataAlunos.email);
		$("#sexo").val(dataAlunos.sexo);					
		$("#naturalPais").val(dataAlunos.naturalPais);		
		$("#rg").val(dataAlunos.rg);
		$("#cpf").val(dataAlunos.cpf);		
		$("#observacao").val(dataAlunos.observacao);		
		$("#celular").val(dataAlunos.celular);
		$("#endereco").val(dataAlunos.endereco);		
		$("#numero").val(dataAlunos.numero);
		$("#bairro").val(dataAlunos.bairro);		
		$("#complemento").val(dataAlunos.complemento);		
		$("#cep").val(dataAlunos.cep);		
		$("#dataMatricula").val(dataAlunos.dataMatricula);	
		$("#dataNascimento").val(dataAlunos.dataNascimento);
		$("#endereco").val(dataAlunos.endereco);
		$("#numero").val(dataAlunos.numero);
		$("#numeroEol").val(dataAlunos.numeroEol);
		$("#numeroRA").val(dataAlunos.numeroRA);		
		var opcaoEtinia = $("#etnia");
		opcaoEtinia.val(opcaoEtinia.find('option[value="'+dataAlunos.etnia+'"]').val());		
		
		if(dataAlunos.naturalCidade != ""){
			$("#naturalCidade").append('<option value="'+dataAlunos.naturalCidade+'">'+dataAlunos.naturalCidade+'</option>');
		}		
		var opcaoNaturalEstado = $("#naturalEstado");
		opcaoNaturalEstado.val(opcaoNaturalEstado.find('option[value="'+dataAlunos.naturalEstado+'"]').val());	
				
		var opcaoUf = $("#uf");
		opcaoUf.val(opcaoUf.find('option[value="'+dataAlunos.uf+'"]').val());
		
		if(dataAlunos.cidade != ""){
			$("#cidade").html('<option value="'+dataAlunos.cidade+'">'+dataAlunos.cidade+'</option>');
		}		
				
		/*Dados Mãe*/
		$("#nomeMae").val(dataAlunos.nomeMae);
		$("#complementoMae").val(dataAlunos.complementoMae);
		$("#email1Mae").val(dataAlunos.email1Mae);
		$("#email2Mae").val(dataAlunos.email2Mae);
		$("#enderecoMae").val(dataAlunos.enderecoMae);	
		$("#numeroMae").val(dataAlunos.numeroMae);	
		$("#telefoneCelularMae").val(dataAlunos.telefoneCelularMae);
		$("#telefoneComercialMae").val(dataAlunos.telefoneComercialMae);
		$("#telefoneResidencialMae").val(dataAlunos.telefoneResidencialMae);
				
		var opcaoUfMae = $("#ufMae");
		opcaoUfMae.val(opcaoUfMae.find('option[value="'+dataAlunos.ufMae+'"]').val());
		
		if(dataAlunos.cidadeMae != null){
			$("#cidadeMae").html('<option value="'+dataAlunos.cidadeMae+'">'+dataAlunos.cidadeMae+'</option>');
		}
		if(dataAlunos.cidadePai != null){
			$("#cidadePai").html('<option value="'+dataAlunos.cidadePai+'">'+dataAlunos.cidadePai+'</option>');
		}
		if(dataAlunos.cidadeResponsavel != null){
			$("#cidadeResponsavel").html('<option value="'+dataAlunos.cidadeResponsavel+'">'+dataAlunos.cidadeResponsavel+'</option>');
		}
		
		/*Dados Pai*/
		$("#nomePai").val(dataAlunos.nomePai);				
		$("#complementoPai").val(dataAlunos.complementoPai);	
		$("#email1Pai").val(dataAlunos.email1Pai);
		$("#email2Pai").val(dataAlunos.email2Pai);		
		$("#enderecoPai").val(dataAlunos.enderecoPai);
		$("#numeroPai").val(dataAlunos.numeroPai);
		$("#telefoneCelularPai").val(dataAlunos.telefoneCelularPai);	
		$("#telefoneComercialPai").val(dataAlunos.telefoneComercialPai);	
		$("#telefoneResidencialPai").val(dataAlunos.telefoneResidencialPai);	
		var opcaoUfPai = $("#ufPai");
		opcaoUfPai.val(opcaoUfPai.find('option[value="'+dataAlunos.ufPai+'"]').val());
				
		/*Dados Responsável*/				
		$("#complementoResponsavel").val(dataAlunos.complementoResponsavel);			
		$("#email1Responsavel").val(dataAlunos.email1Responsavel);		
		$("#email2Responsavel").val(dataAlunos.email2Responsavel);			
		$("#enderecoResponsavel").val(dataAlunos.enderecoResponsavel);			
		$("#nomeResponsavel").val(dataAlunos.nomeResponsavel);		
		$("#numeroResponsavel").val(dataAlunos.numeroResponsavel);			
		$("#responsaveisResponsavel").val(dataAlunos.responsaveisResponsavel);				
		$("#telefoneCelularResponsavel").val(dataAlunos.telefoneCelularResponsavel);				
		$("#telefoneComercialResponsavel").val(dataAlunos.telefoneComercialResponsavel);
		$("#parentescoResponsavel").val(dataAlunos.parentescoResponsavel);				
		
		$("#eresponsavelLegalMae").val(dataAlunos.eresponsavelLegalMae);
		$("#eresponsavelLegalPai").val(dataAlunos.eresponsavelLegalPai);
		$("#eresponsavelLegalResponsavel").val(dataAlunos.eresponsavelLegalResponsavel);			
		
		$("#fotoCad").css("display","block").html("<img id='_foto' src='"+dataAlunos.fotoAluno+"' width='150' height='150'/>");
		
		window.setTimeout(function(){
			if(dataAlunos.enecessidadeEspecial=="S"){
				$('.infoValueMm:contains("Sim")').filter(':first').next().trigger('click');
			}else if(dataAlunos.enecessidadeEspecial=="N"){
				$('.infoValueMm:contains("Não")').filter(':first').next().trigger('click'); 
			}			
			
			if(dataAlunos.eresponsavelLegalMae=="S"){
				 $('.resp:contains("Mãe")').filter(':first').next().trigger('click');
			}else if(dataAlunos.eresponsavelLegalPai=="S"){
				 $('.resp:contains("Pai")').filter(':first').next().trigger('click');
			}else if(dataAlunos.eresponsavelLegalResponsavel=="S"){
				 $('.resp:contains("Outro")').filter(':first').next().trigger('click');
			}
			
			if((dataAlunos.eresponsavelLegalMae==null || dataAlunos.eresponsavelLegalMae=="N") && (dataAlunos.eresponsavelLegalPai==null || dataAlunos.eresponsavelLegalPai=="N") && (dataAlunos.eresponsavelLegalResponsavel==null || dataAlunos.eresponsavelLegalResponsavel=="N")){
				var dataAniv = dataAlunos.dataNascimento.split("-");		
				var idadeAluno = idade(dataAniv[0],dataAniv[1],dataAniv[2]);
				if(idadeAluno>=18){
					$('.resp:contains("Aluno maior de idade")').filter(':first').next().trigger('click');
				}	
			}
			
		},10);		
		/*fim preenchimento formulário aluno*/
		/*Aqui será carregado todo os dados do usuário no formulário para que possa ser editado*/
		var dataUsuario = getData("Usuario/aluno", alunoEdt);
		if(dataUsuario.aluno != null){
			$("#login").val(dataUsuario.login);
			$("#senha").val(dataUsuario.senha);
			$("#emailUsuario").val(dataUsuario.email);
			$("#idEdtUser").val(dataUsuario.idusuario);				
			$("#alunoUser").val(dataUsuario.aluno.idAluno);
			$("#senha").attr("disabled","true");	
		}
	
		
		/*Aqui será carregado todo os dados do Aluno Variavel no formulário para que possa ser editado*/
		var dataAV = getData("AlunoVariavel/aluno", alunoEdt);				
			
		if(dataAV.aluno != null){								
			$("#idEdtUserVar").val(dataAV.idalunoVariavel);
			if(dataAV.grupo){
				$("#grupo").val(dataAV.grupo.idgrupo);
			}
					
			if(dataAV.programaSocial=="S"){
				$('.psOpcao:contains("Sim")').filter(':first').next().trigger('click');
			}else if(dataAV.programaSocial=="N"){
				$('.psOpcao:contains("Não")').filter(':first').next().trigger('click'); 
			}	
				
			localStorage.setItem("periodo",dataAV.periodo.idperiodo);	
			localStorage.setItem("anoLetivo",dataAV.anoLetivo.idanoLetivo);	
			localStorage.setItem("anoEstudo",dataAV.anoEstudo.idanoEstudo);	
			localStorage.setItem("ativo",dataAV.ativo);
				
			window.setTimeout(function(){
				$("#periodoCadAluno").find('option[value="'+(localStorage.getItem("periodo"))+'"]').attr("selected","selected");
				$("#anoLetivoCadAluno").find('option[value="'+(localStorage.getItem("anoLetivo"))+'"]').attr("selected","selected");
				$("#anoEstudoCadAluno").find('option[value="'+(localStorage.getItem("anoEstudo"))+'"]').attr("selected","selected");
				$("#ativoAV").find('option[value="'+(localStorage.getItem("ativo"))+'"]').attr("selected","selected");					
			},10);				
			$("#inicio").val(dataAV.inicio);				
		}		
	}	
	localStorage.setItem("alunoEdt","");
}