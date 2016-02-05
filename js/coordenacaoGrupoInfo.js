
//Get Usuario Efetivado

    var alunoID = 2;
    var UsuarioAtivo = 2;

//Carrega os valores utilizados do BD

	var dataProfessorFuncionario    =   getData("ProfessorFuncionario", null);
	var dataPeriodo 				=	getData("Periodo", null);
//	var dataAnoEstudo 				=	getData("AnoEstudo", null);

//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery
var idAgendamento = "";
var timeHandler = "";
var idAgrup = "";
var idOficina = "";
var idAlunoV = "";
var alunosId = [];
$(document).ready(function() {	

	carregaOficineiros();
	carregaTutores();
	pesquisaGrupoAluno();
	carregarProfessoresByPeriodo('8');
	carregaEditAgrupamento();
	carregaEditDiaSemana();
	carregaHorarioEdit();
	carregaSalaEdit();
	
	//Logado como coordenação, na página grupo.html, não encontrei um select com esse id. Verificar em outras páginas
	$( "#anoEstudo" ).change(function() {
		MostrarGrupos();
	});
	
	$("#S_Periodo").change(function(){
		carregarProfessoresByPeriodo($("#S_Periodo").val());
	})

	$(".pesqTutOfi").change(function(){
		changePesquisa();
	});

	$(".tutoriaT").change(function() {
		MostrarGrupos();
	});

	$(".oficinaO").change(function() {
		mostrarAgrupamentos();
	});
	$("#txtPesq").keyup(function(){ //Evento que acontece toda vez que o usuário solta uma tecla
		window.clearTimeout(timeHandler); //Evento que limpa o timeOut
		timeHandler = window.setTimeout(function(){ //Evento que seta um tempo para a função pesquisarGrupoAluno acontecer
			pesquisaGrupoAluno();
		},1000); //1000 é o tempo, significa 1 segundo.
		$(".tutoriaT").val(0);
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
			
		});
	});
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

function carregaTutores(){
	var anoAtual = new Date().getFullYear();
	var HtmlContent = "";
	HtmlContent += '<option value="0" selected disabled>Selecione</option>';
	$.ajax({
		url: path + "Tutoria/TutoriaAno/" + anoAtual,
		type: "GET",
		async: false,
		crossDomain: true,
		dataType: 'json',
		success: function(dataTutoria){
			for(var i = 0; i < dataTutoria.length; i++){
				HtmlContent += '<option value="' + dataTutoria[i].idtutoria + '">' + dataTutoria[i].tutor.nome + '</option>';
			}
		}
	});
	$(".tutoriaT").append(HtmlContent);
}
function carregaOficineiros(){
	var htmlOficina = "<option value='0' selected disabled>Selecione um oficineiro</option>";
	$.ajax({
		url: path + "OficinaProfessor/ListarOficineiros/",
		type: "GET",
		async: false,
		crossDomain:true,
		dataType: 'json',
		success: function(dataOficina){
			for(var i = 0; i < dataOficina.length; i++){
				htmlOficina += '<option value="'+dataOficina[i].idprofessorFuncionario+'">'+dataOficina[i].nome+'</option>';
			}
		}
	});
	$(".oficinaO").append(htmlOficina);
}

function MostrarGrupos() {	
	var tutorTutoria = $(".tutoriaT").val();
	var HtmlContent = "";
	$('#box_grupo_info').html('');
		//Busca os alunos pertencentes ao grupo
		$.ajax({
			url: path + "Tutoria/TutoriaGrupos/" + tutorTutoria,
			type: "GET",
			async: false,
			crossDomain: true,
			success: function(dataAlunoVariavel){
				for(var  a = 0; a < dataAlunoVariavel.length; a++){

					HtmlContent += '<div class="boxGrupo'+dataAlunoVariavel[a].GrupoId+' linha" id="'+dataAlunoVariavel[a].GrupoId+'">';
						HtmlContent += '<div class="grupoCaixa">';
							HtmlContent += '<div class="grupoTitulo">'+dataAlunoVariavel[a].NomeGrupo+'</div>';
							HtmlContent += '<div class="Aluno_Grupo nomes'+dataAlunoVariavel[a].GrupoId+'"><span class="titulo">Alunos:</span>';
								HtmlContent += dataAlunoVariavel[a].alunos;
							HtmlContent += '</div>';
							HtmlContent += '<div class="tutor"> Tutor:</div>';
							HtmlContent += '<div class="tutor_nome">'+ dataAlunoVariavel[a].nomeTutor + '</div>';
						HtmlContent += '</div>';
						HtmlContent += '<div class="btEditar" onclick="montagemEdicao('+dataAlunoVariavel[a].GrupoId+');"></div>';
						HtmlContent += '<div class="btExcluir" onclick="montagemExclusao('+dataAlunoVariavel[a].GrupoId+');"></div>';
					HtmlContent += '</div>';
				}
				$('#box_grupo_info').append(HtmlContent);

			}
		});	
	
	return false;
}

function mostrarAgrupamentos(){
	var oficineiroOficina = $(".oficinaO").val();
	var htmlOficina = "";
	$("#box_grupo_info").html("");
	$.ajax({
		url: path + "OficinaProfessor/ListarOficinaProfessorRotina/" + oficineiroOficina,
		type: "GET",
		async: false,
		crossDomain: true,
		success: function(dataAgrupamentos){
			htmlOficina += '<div class="lista_agrupamentos">';

			for(var i = 0; i < dataAgrupamentos.length; i++){
				htmlOficina += 		'<section id="idOficina_'+dataAgrupamentos[i].rotina.oficina.idoficina+'" class="oficina_info">';
				htmlOficina +=			'<header class="tipo_oficina">';
				htmlOficina +=				'<h1 style="color:'+dataAgrupamentos[i].rotina.oficina.tipoOficina.cor.forte+'">'+dataAgrupamentos[i].rotina.oficina.tipoOficina.nome+ '</h1>';
				htmlOficina +=			'</header>';
				htmlOficina +=			'<main>';
				htmlOficina +=				'<article class="oficineiros_oficina">';
				htmlOficina +=					'<p class="oficineiro"> Professor(es):';
				for(var j = 0; j < dataAgrupamentos[i].professores.length; j++){
									htmlOficina += '<span> '+dataAgrupamentos[i].professores[j].nome +'</span>';
									htmlOficina += dataAgrupamentos[i].professores.length - 1 != j ?',':''; //If resumido, ternário. Verifica se a lista de professores está na ultima posição, se sim, não poem vírgula, se não, poem vírgula.
				}
				htmlOficina +=					'</p>';
				htmlOficina +=				'</article>';
				htmlOficina +=				'<article class="ciclo_periodo_oficina">';
				htmlOficina +=					'<p class="ciclo_periodo"> Ciclo:';
				htmlOficina +=						'<span id="ciclo_span_'+dataAgrupamentos[i].rotina.oficina.ciclo.idciclos+'" class="ciclo">'+dataAgrupamentos[i].rotina.oficina.ciclo.ciclo+'</span>';
				htmlOficina +=						' | Período: <span id="periodo_span_'+dataAgrupamentos[i].rotina.oficina.periodo.idperiodo+'" class="periodo">'+dataAgrupamentos[i].rotina.oficina.periodo.periodo+'</span>';
				htmlOficina +=					'</p>';
				htmlOficina +=					'<span class="editar editar_rotina" onclick="editarModal(\'oficina\','+dataAgrupamentos[i].rotina.oficina.idoficina+')"> &nbsp; </span>';
				htmlOficina +=				'</article>';
				htmlOficina +=				'<article id="idRotina_'+dataAgrupamentos[i].rotina.idrotina+'" class="rotina_oficina"> Rotina:';
				htmlOficina +=					'<span id="rotina_dia_'+dataAgrupamentos[i].rotina.dia.idsemana+'" class="rotina_dia"> '+dataAgrupamentos[i].rotina.dia.dia+'</span>';
				htmlOficina +=					'<span id="rotina_horario_'+dataAgrupamentos[i].rotina.hora+'" class="rotina_horario"> '+dataAgrupamentos[i].rotina.hora+':00 </span>';
				if((dataAgrupamentos[i].sala) == ""){
					
					htmlOficina += '<span id="sala_0_0" class="rotina_sala">&nbsp;</span>';
				} else {
					htmlOficina +=				'<span id="sala_'+dataAgrupamentos[i].sala.sala.idsalas+'_'+dataAgrupamentos[i].sala.idagendamento_sala+'" class="rotina_sala"> '+dataAgrupamentos[i].sala.sala.sala+' </span>';	
				}

				htmlOficina +=					'<span class="editar editar_rotina" onclick="editarModal(\'rotina\','+dataAgrupamentos[i].rotina.oficina.idoficina+')"> &nbsp; </span>';
				htmlOficina +=				'</article>';
				htmlOficina +=				'<article class="agrupamento_oficina">';
				htmlOficina +=					'<p> Agrupamento:';
				htmlOficina +=						'<span id="agrupamento_'+dataAgrupamentos[i].rotina.agrupamento.idagrupamento+'" class="agrupamento"> '+dataAgrupamentos[i].rotina.agrupamento.nome+' </span>';
				htmlOficina +=					'</p>';
				htmlOficina +=					'<span class="editar editar_agrupamento" onclick="editarModal(\'agrupamento\','+dataAgrupamentos[i].rotina.oficina.idoficina+')"> &nbsp; </span>';
				htmlOficina +=				'</article>';
				htmlOficina +=			'</main>';
				htmlOficina +=		'</section>';
			}
			htmlOficina +=	'</div>';

			$("#box_grupo_info").append(htmlOficina);
		}
	});
	return false;
}

function pesquisaGrupoAluno(){
	$("#box_grupo_info").html('');
	var nmAluno = $("#txtPesq").val();
	var htmlPesquisa = "";
	$.ajax({
		url: path + "Grupo/GrupoAluno/" + nmAluno,
		type: "GET",
		async: false,
		crossDomain: true,
		success: function(dataAlunoGrupo){
			var idGrupo = 0;
			for(var i = 0; i < dataAlunoGrupo.length; i++){
				idGrupo = dataAlunoGrupo[i].idgrupo;
				htmlPesquisa += '<div class="boxGrupo'+dataAlunoGrupo[i].idgrupo+' linha" id="'+dataAlunoGrupo[i].idgrupo+'">';
				htmlPesquisa += 	'<div class="grupoCaixa">';
				htmlPesquisa += 		'<div class="grupoTitulo">'+dataAlunoGrupo[i].nomeGrupo+'</div>';
				$.ajax({
					url: path + "Grupo/AlunoGrupo/" + idGrupo,
					type: "GET",
					async: false,
					crossDomain: true,
					success: function(dataGrupoAluno){
						for(var j = 0; j < dataGrupoAluno.length; j++) {
							htmlPesquisa += '<div class="Aluno_Grupo nomes'+dataGrupoAluno[j].aluno.nome+'"><span class="titulo">Aluno:</span>';
							htmlPesquisa += dataGrupoAluno[j].aluno.nome;
							htmlPesquisa += '</div>';
						}
					}
				});
				htmlPesquisa += 		'<div class="tutor"> Tutor:</div>';
				htmlPesquisa += 		'<div class="tutor_nome">'+ dataAlunoGrupo[i].tutoria.tutor.nome + '</div>';
				htmlPesquisa += '	</div>';
				htmlPesquisa += '</div>';
			}
			$("#box_grupo_info").append(htmlPesquisa);
		}
	});
return false;
}

function changePesquisa(){
	$("#box_grupo_info").empty();
	if($(".pesqTutOfi").val() == 2){
		$("#comboTut").show();
		$("#txtPesq").show();
		$("#comboOfi").hide();
	} else  if($(".pesqTutOfi").val() == 1){
		$("#comboTut").hide();
		$("#txtPesq").hide();
		$("#comboOfi").show();
	}
}

function grupoNovo(){

	//var anoEstudo = $("#S_AnoEstudo option:selected").text();
	var periodo = $("#S_Periodo option:selected").text();
	var periodoId = $("#S_Periodo").val();
	var professorId = $("#tutoria").val();
	var elementos = $('.S_Aluno');
	var bool = false;
	var msg;
	
	//anoEstudo = anoEstudo.substring(0, 1);
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
			data:"action=create&status=0&periodo="+periodo+"&idProfessor="+professorId+"&lider=0&id=0"+"&idPeriodo="+periodoId,
			beforeSend: function(){
				//$('.boxGlobal').css("display","block");
				loading("inicial");
			},			
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
						dataGrupos = getData("Grupo", null);	
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
				loading("final");
			}
		});	
	}else{
		mensagem(msg,"OK","bt_ok","alerta"); 
		loading("final");
	}	
}

function montagemEdicao(id) {
	var htmlEdit = "";
	var abaTutoria = $(".btn_abas")[2]; //Pega a aba da tutoria, terceira na ordem de abas
	$(".btn_abas").removeClass("bt_Ativo");
	$(abaTutoria).addClass("bt_Ativo");	
	$("#cx_conteudo div").removeClass("selecionado");
	containerAtivo = $(abaTutoria).attr('id');
	$('#container_'+containerAtivo).addClass('selecionado');
	$('#periodoTutoria').val();
	displayEdicao(id); //Mostra o cabecalho com o ciclo, periodo e tutor do grupo que o usuario clickar
	desabilitaFuncoes(); //função responsável por desabilitar os demais recursos do button de salvar
	atualizarAluno(id);
	$("#boxAluno").empty(); // limpa os alunos carregados, para que nao sejam duplicados
	$.ajax({
		url: path + "Grupo/AlunoGrupo/" + id,
		type: "GET",
		async: false,
		crossDomain: true,
		dataType: "json",
		success: function(dataAlunoEdicao){
			for(var i=0; i < dataAlunoEdicao.length; i++){
				htmlEdit += '<div class="Grupo_Aluno_Linha Selected">'+
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
			$("#boxAluno").append(htmlEdit);
			$(".Aluno_Ano_Check").prop("checked", true);
		}
	});

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

	for (var i = 0; (i < dataAlunoGrupo.length || i < $(".S_Aluno").length); i++)
	{
		if ( i >= $(".S_Aluno").length)
			$("#btAdd").trigger("click");
		if( i < dataAlunoGrupo.length)
			alimentaComboAluno("S_Aluno"+(i+1), dataAlunoGrupo[i]);
		else
			alimentaCombo("S_Aluno"+(i+1));
	}

	var tutor = dataAlunoGrupo[0].grupo.tutoria.tutor.idprofessorFuncionario;

	$("#tutoria option[value='"+tutor+"']").attr("selected","true");
	$(".tutoriaT").val("Todas"); //Retorna o valor do campo de tutores para o padrão
	$("#box_grupo_info").empty(); //Limpa a area para atualizar a consulta toda vez que o usuario clickar em editar.
}	

function desabilitaFuncoes(){
	$("#btn_Salvar_Tutoria").hide();
	$(".btn_EditPesq_Tutoria").show();
}

function displayEdicao(id){
	cicloEditar = $("#cicloTutoria");
	periodoEditar = $("#periodoTutoria");
	var conteudoeHeaderEdit = "";
	var cicloVariavel = "";

	$.ajax({
		url: path + "Grupo/" + id,
		type: "GET",
		async: false,
		crossDomain: true,
		datatype: 'html',
		success: function(dataGrupo){
			if(dataGrupo.ciclo == "C1"){
				cicloVariavel = '<span> Alfabetização | </span>';
			} else if(dataGrupo.ciclo == "C2") {
				cicloVariavel = '<span> Intermediário | </span>';
			} else {
				cicloVariavel = '<span> Fundamental 2 | </span>'; 
			}
			cntdHeaderEdit = cicloVariavel +
								 '<span> ' +dataGrupo.periodo.periodo+ '|</span>'+
								 '<span> ' +dataGrupo.tutoria.tutoria+ '|</span>';
			$("#Area_Nome_Tutoria").html(cntdHeaderEdit);
			$("#Container_Cadastro_Tutoria").css('display','none')
		    $("#Area_Nome_Tutoria").css('display', 'block');
		    $("#Container_Cadastro_Aluno").css('display','block');
		    
		    $("#listarAluno").css('display','block');
		}
	});
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

function montagemExclusao(id){
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
			//$("#S_AnoEstudo").trigger("change");	
			return false;
		},error: function(d) {
			mensagem("Erro ao excluir!","OK","bt_ok","erro");
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
	
	//$("#S_AnoEstudo").attr('disabled', false);
	$("#S_Periodo").attr('disabled', false);
		
	var dataGrupo = getData("Grupo",grupoId);	
	var lider="";
	if(dataGrupo.lider != null){
		lider = dataGrupo.lider.idAluno;
	}else{
		lider = 0;
	}	
	
	//var anoEstudo = $("#S_AnoEstudo option:selected").text();
	var periodo = $("#S_Periodo option:selected").text();
	var periodoId = $("#S_Periodo").val();
	var professorId = $("#tutoria").val();
	
	//anoEstudo = anoEstudo.substring(0, 1);
	periodo = periodo.substring(0, 1);
		
	$.ajax({
		url: path+"Grupo/",
		type: "POST",
		async:false,
		crossDomain: true,
		dataType: 'json',
		contentType: false,			
		data:"action=update&id="+grupoId+"&periodo="+periodo+"&idProfessor="+professorId+"&tutoria="+tutoria+"&lider="+lider+"&idPeriodo="+periodoId,				
		
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

					dataTutoria = getData("Tutoria", null);
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
					loading("final");
				}
			});			
		}
	});	
}

function editarModal(modal,id){
	$('.modal_edicao_'+modal).show();
	$('.modal_edicao_'+modal).prepend('<input type="hidden" value="'+id+'" id="editar_id_'+modal+'">');	
	$('#boxModaisEdicao').show();
	if(modal == "oficina"){
		EditarOficina();		
	} else if(modal == "rotina"){
		editarRotina();
	} else if(modal == "agrupamento"){
		editarAgrupamento();
	}
	centralizarModal();	
}

function EditarOficina(){
	idOficina = $('.modal_edicao_oficina #editar_id_oficina').val();
	var conteudoCiclo = $("#idOficina_"+idOficina).find(".ciclo").attr('id').split('_')[2];
	var conteudoPeriodo = $("#idOficina_"+idOficina).find(".periodo").attr('id').split('_')[2];	

	$("#cicloOficinaEditar").val(conteudoCiclo);
	$("#periodoOficinaEditar").val(conteudoPeriodo);
	$('#salvarOficina').click(function(){
		$.ajax({
			url: path+"Oficina",
			type:"POST",
			async:false,
			dataType:"json",
			crossDomain:true,
			data:"action=update&ciclo="+$('#cicloOficinaEditar option:selected').val()+"&periodo="+$('#periodoOficinaEditar option:selected').val()+"&id="+idOficina, 
			success: function(d){
				$('#boxModaisEdicao').css('display','none');
				mensagem("Oficina alterada com sucesso!","OK","bt_ok","sucesso"); 	
			}	
		})		
	});	
}

function editarRotina(){
	idOficina = $('.modal_edicao_rotina #editar_id_rotina').val();
	var conteudoAgrupamento = $("#idOficina_"+idOficina).find(".agrupamento").attr('id').split('_')[1];
	var conteudoDia = $("#idOficina_"+idOficina).find(".rotina_dia").attr('id').split('_')[2];
	var conteudoHorario = $("#idOficina_"+idOficina).find(".rotina_horario").attr('id').split('_')[2];
	var conteudoSala = $("#idOficina_"+idOficina).find(".rotina_sala").attr('id').split('_')[1];

	idAgendamento = $("#idOficina_"+idOficina).find(".rotina_sala").attr('id').split('_')[2];
	$("#agrupamentoEdit").val(conteudoAgrupamento);
	$("#Dia_Semana_Edit").val(conteudoDia);
	$("#Horario_Edit").val(conteudoHorario);
	$("#Sala_Edit").val(conteudoSala);

	$(".btn_Edit_Rotina").click(function(){
		var idOficina = $(".modal_edicao_rotina #editar_id_rotina").val();
		var idAgrupamentoEdit = $("#agrupamentoEdit").val();
		var idDiaEdit = $("#Dia_Semana_Edit").val();
		var idHorarioEdit = $("#Horario_Edit").val();
		var idSalaEdit = $("#Sala_Edit").val();
		anoLetivo = getIdAnoLetivo();
		var idRotina = $(".rotina_oficina").attr('id').split('_')[1];

		if (idAgrupamentoEdit != '0' &&
			idDiaEdit != '0' &&
			idHorarioEdit != '0' &&
			idSalaEdit != '0')
		{
			$.ajax({
				url: path + "Rotina",
				async: false,
				crossDomain: true,
				type: "POST",
				data: "action=update&idOficina="+idOficina+"&idAgrupamento="+idAgrupamentoEdit+"&idDia="+idDiaEdit+"&Hora="+idHorarioEdit+"&idSala="+idSalaEdit+"&anoLetivo="+anoLetivo+"&id="+idRotina,
				beforeSend: function(){
					loading('inicial');
				},
				success: function(idRotina){
					$("#boxModaisEdicao").hide();
					mensagem("Rotina alterada com sucesso!","OK","bt_ok","sucesso");
					$.ajax({
						url: path + "AgendamentoSala",
						async: false,
						crossDomain: true,
						type: "POST",
						data: "action=create&Hora="+idHorarioEdit+"&dia="+idDiaEdit+"&idsala="+idSalaEdit+"&idrotina="+idRotina+"&id="+idAgendamento
					});
				},
				complete: function(){
					loading('final');
				}
			});
		} else {
			mensagem("Todos os campos devem ser preenchidos.","OK","bt_ok","erro");
		}
	});
}

function editarAgrupamento(){
	idOficina = $(".modal_edicao_agrupamento #editar_id_agrupamento").val();
	idAgrup = $("#idOficina_"+idOficina).find(".agrupamento").attr('id').split('_')[1];
	var conteudoCiclo = $("#idOficina_"+idOficina).find(".ciclo").attr('id').split('_')[2];
	var conteudoPeriodo = $("#idOficina_"+idOficina).find(".periodo").attr('id').split('_')[2];
	var conteudoNome = $("#idOficina_"+idOficina).find(".agrupamento").text().trim();
	
	$("#cicloGrupoModal").val(conteudoCiclo);
	$("#periodoGrupoModal").val(conteudoPeriodo);
	$("#periodoGrupoModal").prop('disabled',true);
	$("#nomeGrupoModal").val(conteudoNome);
	resetAreaModal();
	limparAlunosAgrup();
	carregaAlunosAgrupamento();		
	carregaAlunosModal();

	$(".btn_Edit_Agrupamento").click(function(){
		var cicloGrupo = $("#cicloGrupoModal").val();
		var seletorAluno = carregaAlunosSelecionados();
		var seletorAlunoAgrup = carregaAlunoAgrup();
		if(generateName() != "" && $(".Aluno_Ano_Check:checked").length > 0){
			$.ajax({
				url: path + "Agrupamento/",
				type: "POST",
				data: "action=update&nome=" + generateName() + "&anoLetivo=" + getIdAnoLetivo() + "&ciclo=" + cicloGrupo + "&id=" + idAgrup,
				async: false,
				crossDomain: true,
				beforeSend: function(){
					loading("inicial");
				},
				success: function(){
					for(var i = 0; i < $(".Aluno_Ano_Check:checked").length; i++){
						var alunosSelected = $(".Aluno_Ano_Check:checked")[i].id.split("_")[2];
						editarAlunoAgrupamento(idAgrup, alunosSelected,seletorAluno[i]);
					}
					for (var i = 0; i < $("[data-status='1']").length; i++){
						var alunosSelected = $("[data-status='1']")[i].id.split("_")[1];
						editarAlunoAgrupamento(idAgrup, alunosSelected,seletorAlunoAgrup[i]);
					}
					mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");
				},
				complete: function(){
					loading("final");
				}
			});	
			limparModalAgrupamento();
		}		
	});
}

function editarAlunoAgrupamento(idAgrupamento, idAluno, alunoObj){
	var acaoData = "";
	if($(alunoObj).attr("data-status") == "0" && $(alunoObj).hasClass("Selected")){
		acaoData = "action=create";
		crudAlunoAgrupamento(acaoData, idAluno);
	} else if($(alunoObj).attr("data-status") == "1" && !$(alunoObj).hasClass("Selected")){
		acaoData = "action=delete";
		crudAlunoAgrupamento(acaoData, idAluno);
	}

}

function crudAlunoAgrupamento(acaoData, idAluno){
	$.ajax({
		url: path + "AlunoAgrupamento/",
		type: "POST",
		data: acaoData + "&Aluno=" + idAluno + "&idAgrupamento=" + idAgrup,
		async: false,
		crossDomain: true,
		success: function(){
			$(".Grupo_Aluno_Linha.Selected").attr("data-status","1");
		}
	});
}

function carregaAlunosSelecionados(){
	var linhaSelected = [];
	for(var i = 0; i < $(".Grupo_Aluno_Linha").length; i++){
		if($(".Grupo_Aluno_Linha")[i].classList.contains("Selected")){
			linhaSelected.push($(".Grupo_Aluno_Linha")[i]);
		}
	}
	return linhaSelected;
}

function carregaAlunoAgrup(){
	var linhaAlunoAgrup = [];
	for(var i = 0; i < $("[data-status='1']").length; i++){
		linhaAlunoAgrup.push($("[data-status='1']")[i]);		
	}
	return linhaAlunoAgrup;
}

function generateName(){
	return $("#nomeGrupoModal").val();
}

function carregaEditAgrupamento(){
	var html = '<option value="0" disabled selected>Selecione</option>';
	$.ajax({
		url: path + "Agrupamento/AnoLetivo/" + getIdAnoLetivo(),
		async: false,
		crosDomain: true,
		type: "GET",
		success: function(dataAgrupamento){
			for(var i = 0; i < dataAgrupamento.length; i++){
				html += '<option value="'+dataAgrupamento[i].idagrupamento+'">'+dataAgrupamento[i].nome+'</option>';
			}
			$("#agrupamentoEdit").append(html);
		}
	});
}

function carregaEditDiaSemana(){
	var html = '<option value="0" disabled selected> Selecione </option>';
	$.ajax({
		url: path + "Semana",
		async: false,
		crossDomain: true,
		type: "GET",
		success: function(dataDia){
			for(var i =0; i < dataDia.length; i++){
				html += '<option value="'+dataDia[i].idsemana+'">'+dataDia[i].dia+'</option>';
			}
			$("#Dia_Semana_Edit").append(html);
		}
	})
}

function carregaHorarioEdit(){
	var html = '<option value="0" disabled selected> Selecione </option>';
	var primeiroHorario = 7;
	var ultimoHorario = 23;

	for(var i = primeiroHorario; i <= ultimoHorario; i++){
		html += '<option value="'+i+'">'+i+':00</option>';
	}
	$("#Horario_Edit").append(html);
}

function carregaSalaEdit(){
	var html = '<option value="0" disabled selected> Selecione </option>';
	$.ajax({
		url: path + "Salas",
		async: false,
		crossDomain: true,
		type: "GET",
		success: function(dataSalas){
			for(var i = 0; i < dataSalas.length; i++){
				html += '<option value="'+dataSalas[i].idsalas+'">'+dataSalas[i].sala+'</option>';
			}
			$("#Sala_Edit").append(html);
		}
	});
}

function limparModalAgrupamento(){
	$("#boxModaisEdicao").hide();
    seletorAluno = [];
    seletorAlunoAgrup = [];
}

