//Murano Design

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

    var alunoID = 2;
    var UsuarioAtivo = 2;

//------------------------------------------------------------------------------------------------------------------------

//Carregas as variaveis padrao


//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD

	var dataTutoria 				=	getData("Tutoria", null);
	var dataProfessorFuncionario    =   getData("ProfessorFuncionario", null);
	var dataAlunoVariavel 			=	getData("AlunoVariavel", null);
	var dataPeriodo 				=	getData("Periodo", null);
	var dataAnoEstudo 				=	getData("AnoEstudo", null);
	var dataGrupos					=	getData("Grupo", null);

//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery



$(document).ready(function() {	
	/*Listagem dos anos de estudo*/

		var Limite = dataAnoEstudo.length;	   
		var HtmlContent = "";

		for(var a = 0; a < Limite; a++)
		{
			HtmlContent += '<option value="'+dataAnoEstudo[a].ano+'">'+dataAnoEstudo[a].ano+'º</option>';
		}		
		$('#anoEstudo').html(HtmlContent);

	/*Listagem dos Professores para atribuir tutoria*/
	//var LimiteC = dataProfessorFuncionario.length;
	//var HtmlContentC = "";
	//HtmlContentC += '<option value="-1">Selecione</option>';
	//for(var a = 0; a < LimiteC; a++){
	//	HtmlContentC += '<option value="'+dataProfessorFuncionario[a].idprofessorFuncionario+'">'+dataProfessorFuncionario[a].nome+'</option>';
	//}		
	//HtmlContentC += '<option value="N_A">Não Atribuido</option>';
	//$('.tutoria').html(HtmlContentC);	

	/*Listagem dos Tutores já com uma tutoria atribuida*/
	var Limite = dataTutoria.length;
	var HtmlContent = "";
	HtmlContent += '<option value="Todas">Todas</option>';
	for(var a = 0; a < Limite; a++){
		HtmlContent += '<option value="'+dataTutoria[a].idtutoria+'">'+dataTutoria[a].tutor.nome+'</option>';
	}		
	HtmlContent += '<option value="N_A">Não Atribuido</option>';
	$('.tutoriaT').html(HtmlContent);	
	MostrarGrupos();  
	carregarProfessoresByPeriodo('8');
	
	//Logado como coordenação, na página grupo.html, não encontrei um select com esse id. Verificar em outras páginas
	$( "#anoEstudo" ).change(function() {
		MostrarGrupos()
	});
	
	$("#S_Periodo").change(function(){
		carregarProfessoresByPeriodo($("#S_Periodo").val());
	})

	$( ".tutoriaT" ).change(function() {
		MostrarGrupos()
	});
	
	//Limpa os campos para o novo cadastro!!
	$('body').delegate(".bt_Inserir_Ativo_Grupo","click", function(){

		$("#editarGrupo").hide();
		$("#cadastrarGrupo").show();

		if ($("#S_Periodo").val() == '8'){
			$("#tutoria option").eq(0).attr('selected','selected');
		}else {
			$("#S_Periodo option").eq(0).attr('selected','selected');
			carregarProfessoresByPeriodo('8');
		}

		//Procedimento para limpar os campos dos alunos
		Linha = 3;		//As linhas dos alunos começam da linha 3 
		$('.S_Aluno').each(function(){
			id = $(this).attr('id');
			if (Linha<8){//Enquanto a linha for menor que 8, zera o resultado
				$("#"+id+" option").eq(0).attr('selected','selected');
			}else{ //Remove as linhas com id maior que 7 e deixa apenas 5 mostrando!!
				$("#linha"+Linha).remove();
			}
			Linha =Linha+1;
			
		})

		if ($("#S_AnoEstudo option").eq(0).val() != $("#S_AnoEstudo").val()){
			$("#S_AnoEstudo option").eq(0).attr('selected','selected');
			SetValoresAlunoVariavel();
		}


	})

});

function carregarProfessoresByPeriodo(idPeriodo){
	professoresPeriodo = getData("Tutoria/TutoriaPerido", idPeriodo);
	$('#tutoria').html('');
	var htmlContent = '';
	for(a = 0; a<professoresPeriodo.length; a++){
		htmlContent += "<option value='"+professoresPeriodo[a].tutor.idprofessorFuncionario+"'>"+professoresPeriodo[a].tutor.nome+"</option>";
	}
	$('#tutoria').html(htmlContent);
	
}

function MostrarGrupos()
{

	var Limite = dataGrupos.length;
	
	$('#box_grupo_info').html('');
	
	//Percorre todos os grupos
	for(var  a = 0; a< Limite; a++){
		//Verifica se o grupo está ativo
		if (dataGrupos[a].status != 1){
			
			if  ($('.tutoriaT').val() == dataGrupos[a].tutoria.idtutoria || $('.tutoriaT').val() == "Todas"){
			
				//Busca os alunos pertencentes ao grupo
				dataAlunosGrupo = getData('AlunoVariavel/grupo',dataGrupos[a].idgrupo);
				//Verifica se o grupo possui alunos
				if (dataAlunosGrupo.length > 0){
					
					//Monta o Html do grupo
					HtmlContent = '<div class="boxGrupo'+dataAlunosGrupo[0].grupo.idgrupo+' linha" id="'+dataAlunosGrupo[0].grupo.idgrupo+'">';
					HtmlContent += '<div class="grupoCaixa">';
					HtmlContent += '<div class="grupoTitulo">'+dataAlunosGrupo[0].grupo.nomeGrupo+'</div>';
					HtmlContent += '<div class="Aluno_Grupo nomes'+dataAlunosGrupo[0].grupo.idgrupo+'"><span class="titulo">Alunos:</span>';
					//percorre os alunos do grupo colocando o nome.
					for(var b = 0; b < dataAlunosGrupo.length; b++){
						if (b != 0)	HtmlContent += ', '+dataAlunosGrupo[b].aluno.nome;
							else HtmlContent += dataAlunosGrupo[b].aluno.nome;
					}
					//Termina de montar o Html
					HtmlContent += '</div>'
					HtmlContent += '<div class="tutor"> Tutor:</div>';
					HtmlContent += '<div class="tutor_nome">'+(dataAlunosGrupo[0].grupo.tutoria != null ? (dataAlunosGrupo[0].grupo.tutoria.tutor.nome):'Não Atribuido')+'</div>';
					HtmlContent += '</div>';
					HtmlContent += '<div class="btEditar" onclick="montagemEdicao('+dataAlunosGrupo[0].grupo.idgrupo+');"></div>';
					HtmlContent += '<div class="btExcluir" onclick="montagemExclusao('+dataAlunosGrupo[0].grupo.idgrupo+');"></div>';
					HtmlContent += '</div>';
					
					$('#box_grupo_info').append(HtmlContent);
				}
			}
		}
	}
	return false;
}
	
//	var Limite = dataAlunoVariavel.length;	
//	   
//	var grupo;
//	var aluno;
//	var Linha_N_A = false;		
//	
//	$('#box_grupo_info').html('');
//	
//	for(var a = 0; a < Limite; a++)
//	{
//		var HtmlContent = "";
//
//		var Encontrado = false;
//
//		//console.log(dataAlunoVariavel[a]);
//		//return false;
//		if(dataAlunoVariavel[a].grupo != null && 
//			$('#periodo').val() == dataAlunoVariavel[a].periodo.idperiodo &&
//			($('.tutoriaT').val() == dataAlunoVariavel[a].grupo.tutoria.idtutoria || $('.tutoriaT').val() == "Todas"))
//		{
//			if(dataAlunoVariavel[a].idalunoVariavel == '497') console.log('*');
//			
//			for(var b=0; b < $('.linha').length; b++)
//			{
//				if((dataAlunoVariavel[a].grupo.nomeGrupo).substr(2) == $(document.getElementsByClassName('linha')[b]).attr("id"))
//				{
//					Encontrado = true;
//				}
//			
//			}
//
//			if(!Encontrado){
//			//	console.log(dataAlunoVariavel[a]);
//				aluno=dataAlunoVariavel[a].aluno.nome;
//				HtmlContent += '<div class="boxGrupo'+dataAlunoVariavel[a].grupo.idgrupo+' linha" id="'+dataAlunoVariavel[a].grupo.idgrupo+'">';
//				HtmlContent += '<div class="grupoCaixa">';
//				HtmlContent += '<div class="grupoTitulo">'+dataAlunoVariavel[a].grupo.nomeGrupo+'</div>';
//				HtmlContent += '<div class="Aluno_Grupo nomes'+dataAlunoVariavel[a].grupo.idgrupo+'"><span class="titulo">Alunos:</span> '+aluno+'</div>';
//				HtmlContent += '<div class="tutor"> Tutor:</div>';
//				HtmlContent += '<div class="tutor_nome">'+(dataAlunoVariavel[a].grupo.tutoria != null ? (dataAlunoVariavel[a].grupo.tutoria.tutor.nome):'Não Atribuido')+'</div>';
//				HtmlContent += '</div>';
//				HtmlContent += '<div class="btEditar" onclick="montagemEdicao('+dataAlunoVariavel[a].grupo.idgrupo+');"></div>';
//				HtmlContent += '<div class="btExcluir" onclick="montagemExclusao('+dataAlunoVariavel[a].grupo.idgrupo+');"></div>';
//				HtmlContent += '</div>';
//				grupo=dataAlunoVariavel[a].grupo.idgrupo;
//				
//				$('#box_grupo_info').append(HtmlContent);
//
//			} else {
//				$('.linha[id='+(dataAlunoVariavel[a].grupo.nomeGrupo).substr(2)+']').find('.Aluno_Grupo').append('; '+dataAlunoVariavel[a].aluno.nome);
//			}
//		
//		} else if((dataAlunoVariavel[a].grupo == null && ($('.tutoriaT').val() == "N_A" || $('.tutoriaT').val() == "Todas")) && 
//			$('#anoEstudo').val() == dataAlunoVariavel[a].anoEstudo.ano &&
//			$('#periodo').val() == dataAlunoVariavel[a].periodo.idperiodo){
//			
//			for(var b=0; b < $('.linha').length; b++)
//			{
//				if(dataAlunoVariavel[a].grupo != null)
//				{
//					if(dataAlunoVariavel[a].grupo.idgrupo == document.getElementsByClassName('linha')[b].id)
//					{
//						Encontrado = true;
//					}
//				}
//				
//			}
//			
//			
//			if((!Encontrado) && (dataAlunoVariavel[a].grupo != null)){
//
//				aluno=dataAlunoVariavel[a].aluno.nome;
//				HtmlContent += '<div class="boxGrupo'+dataAlunoVariavel[a].grupo.idgrupo+' linha" id="'+dataAlunoVariavel[a].grupo.idgrupo+'">';
//				HtmlContent += '<div class="grupoCaixa">';
//				HtmlContent += '<div class="grupoTitulo">'+dataAlunoVariavel[a].grupo.nomeGrupo+'</div>';
//				HtmlContent += '<div class="Aluno_Grupo nomes'+dataAlunoVariavel[a].grupo.idgrupo+'"><span class="titulo">Alunos:</span> '+aluno+'</div>';
//				HtmlContent += '<div class="tutor"> Tutor:</div>';
//				HtmlContent += '<div class="tutor_nome">Não Atribuido</div>';
//				HtmlContent += '</div>';
//				HtmlContent += '<div class="btEditar" onclick="montagemEdicao('+dataAlunoVariavel[a].grupo.idgrupo+');"></div>';			
//				HtmlContent += '</div>';
//				grupo=dataAlunoVariavel[a].grupo.idgrupo;
//				
//				$('#box_grupo_info').append(HtmlContent);
//
//			} else {
//
//				if(!Linha_N_A)
//				{
//
//					HtmlContent += '<div class="boxGrupo_N_A" linha" id="N_A">';
//					HtmlContent += '<div class="grupoCaixa">';
//					HtmlContent += '<div class="grupoTitulo"></div>';
//					HtmlContent += '<div class="Aluno_Grupo"><span class="titulo">Alunos:</span> '+dataAlunoVariavel[a].aluno.nome+'</div>';
//					HtmlContent += '<div class="tutor"> Tutor:</div>';
//					HtmlContent += '<div class="tutor_nome">Não Atribuido</div>';
//					HtmlContent += '</div>';
//					HtmlContent += '<div class="btEditar"></div>';				
//					HtmlContent += '</div>';
//					
//					$('#box_grupo_info').append(HtmlContent);
//
//					Linha_N_A = true;
//				} else {
//					
//					$('.boxGrupo_N_A').find('.Aluno_Grupo').append('; '+dataAlunoVariavel[a].aluno.nome);
//					$('#box_grupo_info').append($('.boxGrupo_N_A'));
//				}
//
//			}
//
//		}
//	
//	}		
//} 

function grupoNovo(){

	var anoEstudo = $("#S_AnoEstudo option:selected").text();
	var periodo = $("#S_Periodo option:selected").text();
	var periodoId = $("#S_Periodo").val();
	var professorId = $("#tutoria").val();
	var elementos = $('.S_Aluno');
	var bool = false;
	var msg;
	
	anoEstudo = anoEstudo.substring(0, 1);
	periodo = periodo.substring(0, 1);
	
	for (var i = 0; i < elementos.length; i++) {				
		if($("#"+elementos[i].id).val() != "-1"){			
			bool = true;				
		}else{
			msg = "Escolha pelo menos um aluno!";
		}					
	}
	if(professorId=="-1"){
		msg = "Escolha um tutor!";
	}
	
	if(professorId!="-1" && bool == true){
		$.ajax({
			url: path+"Grupo/",
			type: "POST",
			async:false,
			crossDomain: true,
			dataType: 'json',
			contentType: false,	
			beforeSend: function(){
				//$('.boxGlobal').css("display","block");
				loading("inicial");
			},
			data:"action=create&status=0&anoEstudo="+anoEstudo+"&periodo="+periodo+"&idProfessor="+professorId+"&lider=0&id=0"+"&idPeriodo="+periodoId,
			success: function(data) {	
				loading("inicial");
				//aqui pego todos os elementos por classe				
				var alunos=""; 
				var valores=new Array();
				var contId=0;						
				
				for (var i = 0; i < elementos.length; i++) {				
					if(($("#"+elementos[i].id).val() != "")&&($("#"+elementos[i].id).val() != "-1")){
						valores[contId] = $("#"+elementos[i].id).val();
						contId++;		
					}						
				}
				
				for (var x = 0; x < valores.length; x++) {	
					if(x == valores.length-1){
						alunos += valores[x];
					}else{
						alunos += valores[x]+";";
					}
				}
				
				$.ajax({
					url: path+"AlunoVariavel/alunoGrupo/",
					type: "POST",
					async:false,
					crossDomain: true,
					dataType: 'json',
					contentType: false,	
					data:"action=update&alunos="+alunos+"&grupo="+data,			
					success: function(data) {						
//						dataTutoria 				=	getData("Tutoria", null);
//						dataAlunoVariavel 			=	getData("AlunoVariavel", null);
//						dataPeriodo 				=	getData("Periodo", null);
//						dataAnoEstudo 				=	getData("AnoEstudo", null);	
						dataGrupos					=	getData("Grupo", null);
						
						
						/*Limpa as combobox*/							
						var opcaoLimpar = $('.S_Aluno');
					 	opcaoLimpar.val(opcaoLimpar.find('option[value="-1"]').val());					
						var opcaoTutoria = $('.tutoria');
						opcaoTutoria.val(opcaoTutoria.find('option[value="Todas"]').val());
						MostrarGrupos();
						mensagem("Grupo cadastrado com sucesso!","OK","bt_ok","sucesso");
						
					},
				});										
			},
			complete: function(){
				//$('.boxGlobal').css("display","none");
				loading("final");
			}
		});	
	}else{
		mensagem(msg,"OK","bt_ok","alerta"); 
		loading("final");
	}	
}



function montagemEdicao(id)
{

	var periodo = $("#periodo").val();
	$("#S_Periodo option[value='"+periodo+"']").attr("selected","true");
	//carregarProfessoresByPeriodo(periodo);
	
	$("#bt_Pesquisar").removeClass("bt_Pesquisar_Ativo");	
	$("#container_Pesquisa").css("display","none");
	$("#bt_Inserir").addClass("bt_Inserir_Ativo_Grupo");	
	$("#container_Inserir").css("display","block");	
	$("#editarGrupo").css("display","block");
	$("#cadastrarGrupo").css("display","none");		
	$("#action").val("update");
	$("#grupo").val(id);


	var dataAlunoGrupo;
	$.ajax({
		url: path + "Grupo/AlunoGrupo/" + id,
		async: false,
		crossDomain: true,
		type: "GET",
		success: function (data){
			dataAlunoGrupo = data;
		}
	});

	$("#S_AnoEstudo option[value='"+dataAlunoGrupo[0].anoEstudo.idanoEstudo+"']").attr("selected","true");

	for (var i = 0; (i < dataAlunoGrupo.length || i < $(".S_Aluno").length); i++)
	{
		if ( i >= $(".S_Aluno").length)
			$("#btAdd").trigger("click");
		if( i < dataAlunoGrupo.length)
			alimentaComboAluno("S_Aluno"+(i+1), dataAlunoGrupo[i]);
		else
			alimentaCombo("S_Aluno"+(i+1));
	}

	//console.log('Tutor: '+tutor);
	var tutor = dataAlunoGrupo[0].grupo.tutoria.tutor.idprofessorFuncionario;

	$("#tutoria option[value='"+tutor+"']").attr("selected","true");

}

function alimentaCombo(id){
	
	/*Limpa os valores na combo*/
	$("#"+id).html("");

	$.ajax({
        url: path+"AlunoVariavel/html/"+$('#S_AnoEstudo').val()+"/"+$('#S_Periodo').val(),
        dataType : 'html',
        success: function(d) {
            $('#'+id).html("<option value=-1></option>"+d);
        }
    });
}

function alimentaComboAluno(idCombo, AlunoVariavel){

	$("#"+idCombo).html("");

	$.ajax({
        url: path+"AlunoVariavel/html/"+AlunoVariavel.anoEstudo.idanoEstudo+"/"+AlunoVariavel.periodo.idperiodo,
        dataType : 'html',
        success: function(d) {
            $('#'+idCombo).html("<option value=-1></option>"+d+"<option value="+AlunoVariavel.idalunoVariavel+" selected>"+AlunoVariavel.aluno.nome+"</option>");
        }
    });

}

function montagemExclusao(id)
{
	var AlunoAtual = "";
	var b=0;

	for(var a=0; a< dataAlunoVariavel.length; a++)
	{
		if(dataAlunoVariavel[a].grupo != null)
		{
			if(dataAlunoVariavel[a].grupo.idgrupo == id)
			{
				AlunoAtual += (b == 0 ? (dataAlunoVariavel[a].idalunoVariavel):(';'+dataAlunoVariavel[a].idalunoVariavel));
				b++;
			}
		}
	}

	$.ajax({
		url: path+"Grupo",
		type: "POST",
		async:false,
		crossDomain: true,
		dataType: 'json',
		contentType: false,	
		data:"action=delete&idGrupo="+id,			
		success: function(data) {
			$('#'+id).remove();
			mensagem("Excluído com sucesso!","OK","bt_ok","success");
			$("#S_AnoEstudo").trigger("change");	
			return false;
		},error: function(d) {
			mensagem("Erro ao excluir!","OK","bt_ok","erro");
			return console.log("Erro ao excluir grupo");
		}
	});
	
	return false;
	

}

function editarGrupoFun(){	
	loading("inicial");	

	var grupoId = $("#grupo").val();
	var alunosGrupo= new Array();
	var cont = 0;
	var alunos="";
	var valores = new Array();
	var contId = 0;
	var tutoria="";

	var vazio = false;
	//Verifica se existe alunos selecionados
	$(".S_Aluno").each(function(){
		if (!($(this).val() == '-1')){
			vazio = true;
		}
	})
	if (vazio == false){
		mensagem("Escolha pelo menos um aluno!","OK","bt_ok","erro");
		loading("final");	
		return false;
	}
	
	$("#S_AnoEstudo").attr('disabled', false);
	$("#S_Periodo").attr('disabled', false);
		
	var dataGrupo = getData("Grupo",grupoId);	
	var lider="";
	if(dataGrupo.lider != null){
		lider = dataGrupo.lider.idAluno;
	}else{
		lider = 0;
	}	
	
	var anoEstudo = $("#S_AnoEstudo option:selected").text();
	var periodo = $("#S_Periodo option:selected").text();
	var periodoId = $("#S_Periodo").val();
	var professorId = $("#tutoria").val();
	
	anoEstudo = anoEstudo.substring(0, 1);
	periodo = periodo.substring(0, 1);
		
	$.ajax({
		url: path+"Grupo/",
		type: "POST",
		async:false,
		crossDomain: true,
		dataType: 'json',
		contentType: false,			
		data:"action=update&id="+grupoId+"&anoEstudo="+anoEstudo+"&periodo="+periodo+"&idProfessor="+professorId+"&tutoria="+tutoria+"&lider="+lider,				
		
		success: function(d){
			//aqui pego todos os elementos por classe
			var elementos = $('.S_Aluno');					
			var alunos=""; 
			
			for (var i = 0; i < elementos.length; i++) {									
				if(($("#"+elementos[i].id).val() != "")&&($("#"+elementos[i].id).val() != "-1")){
					valores[contId] = $("#"+elementos[i].id).val();
					contId++;	
				}
			}
			
			for (var x = 0; x < valores.length; x++) {	
				if(x == valores.length-1){
					alunos += valores[x];
				}else{
					alunos += valores[x]+";";
				}
			}
								
			$.ajax({
				url: path+"AlunoVariavel/alunoGrupo/",
				type: "POST",
				async:false,
				crossDomain: true,
				dataType: 'json',
				contentType: false,	
				data:"alunos="+alunos+"&grupo="+grupoId,		
				success: function(data) {

					dataTutoria 				=	getData("Tutoria", null);
//					dataAlunoVariavel 			=	getData("AlunoVariavel", null);
//					dataPeriodo 				=	getData("Periodo", null);
//					dataAnoEstudo 				=	getData("AnoEstudo", null);	
//					dataProfessorFuncionario    =   getData("ProfessorFuncionario", null);

					
					
					
					
					/*Volta as combos da página de pesquisar para o ponto inicial*/
					var opcaoAno = $('#anoEstudo');
					opcaoAno.val(opcaoAno.find('option').eq(0).val());
					var opcaoPeriodo = $('#periodo');
					opcaoPeriodo.val(opcaoPeriodo.find('option[value="8"]').val());
					var opcaoTutoria = $('#tutoriaT');
					opcaoTutoria.val(opcaoTutoria.find('option[value="Todas"]').val());					
					
					/*Volta as combos da página de criar grupos para o ponto inicial*/
					var opcaoLimpar = $('.S_Aluno');
					opcaoLimpar.val(opcaoLimpar.find('option').eq(0).val());
					var opcaoTutoria = $('.tutoria');
					opcaoTutoria.val(opcaoTutoria.find('option[value="Todas"]').val());
					
					//Atualiza os grupos para exibis corretamente na pesquisa
					
					
					$("#box_grupo_info").html("");
					MostrarGrupos();
					mensagem("Grupo editado com sucesso!","OK","bt_ok","sucesso"); 
					loading("final");
				},error: function(d) {
					console.log("Erro update dos alunos");
					loading("final");
				}
			});	
			
		},error: function(d) {
			console.log("Erro update no nome do grupo");
			loading("final");
		}
	});	
}