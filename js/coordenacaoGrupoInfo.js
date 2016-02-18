
//Get Usuario Efetivado
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
	carregaEditDiaSemana();
	carregaHorarioEdit();
	carregaSalaEdit();
	editarOficina();
	editarRotina();
		
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
		$('.area_rotinas_oficina').click(function() {
			if($(this).find('.container_rotinas').css('display') === 'none')
			{
				$(this).find('.btn_drop').attr('src', 'img/ic_retract_claro.png');
				$(this).find('.container_rotinas').slideDown();
			}
			else
			{
				$(this).find('.btn_drop').attr('src', 'img/ic_drop_claro.png');
				$(this).find('.container_rotinas').slideUp();
			}
		});
	});
	//Verificar funcionamento.
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
	$("#box_grupo_info").html("");
	$.ajax({
		url: path + "OficinaProfessor/listarProfessor/" + oficineiroOficina,
		type: "GET",
		async: false,
		crossDomain: true,
		success: function(dataOficinaProfessor) {
			//htmlOficina +=	'<div class="lista_agrupamentos">';
			for (var i = 0; i < dataOficinaProfessor.length; i++){
				var htmlOficina = "";
				htmlOficina +=	'<section id="idOficina_'+dataOficinaProfessor[i].oficina.idoficina+'" class="oficina_info">';
				htmlOficina += 		'<header class="tipo_oficina">';
				htmlOficina +=			'<h1 style="color:'+dataOficinaProfessor[i].oficina.tipoOficina.cor.forte+'">'+dataOficinaProfessor[i].oficina.tipoOficina.nome+ '</h1>';
				htmlOficina +=		'</header>';
				htmlOficina +=		'<main>';
				htmlOficina +=			'<article class="ciclo_periodo_oficina">';
				htmlOficina +=				'<p class="ciclo_periodo"> Ciclo:';
				htmlOficina +=					'<span id="ciclo_span_'+dataOficinaProfessor[i].oficina.ciclo.idciclos+'" class="ciclo">'+dataOficinaProfessor[i].oficina.ciclo.ciclo+'</span>';
				htmlOficina +=					' | Período: <span id="periodo_span_'+dataOficinaProfessor[i].oficina.periodo.idperiodo+'" class="periodo">'+dataOficinaProfessor[i].oficina.periodo.periodo+'</span>';
				htmlOficina +=				'</p>';
				htmlOficina +=				'<span class="editar editar_rotina" onclick="editarModal(\'oficina\','+dataOficinaProfessor[i].oficina.idoficina+')"> &nbsp; </span>';
				htmlOficina +=			'</article>';
				htmlOficina +=			'<article class="oficineiros_oficina">';
				htmlOficina +=				'<p class="oficineiro"> Professor(es):';
				$.ajax({
					url: path + "OficinaProfessor/listarPorOficina/" + dataOficinaProfessor[i].oficina.idoficina,
					type: "GET",
					async: false,
					crossDomain: true,
					success: function(professoresOficina) {
						for (var j = 0; j < professoresOficina.length; j++) {
							htmlOficina += '<span> '+professoresOficina[j].professor.nome +'</span>';
							//Verifica se a lista de professores está na ultima posição, se sim, não poem vírgula, se não, poem vírgula.
							htmlOficina += professoresOficina.length - 1 != j ?',':'';
						};
					}
				});
				htmlOficina +=				'</p>';
				htmlOficina +=			'</article>';
				htmlOficina += 			'<article class="area_rotinas_oficina">';
				// $.ajax({
				// 	url: path + "Rotina/ListarOficina/" + dataOficinaProfessor[i].oficina.idoficina,
				// 	type: "GET",
				// 	async: false,
				// 	crossDomain: true,
				// 	success: function(dataRotina) {
				// 		htmlOficina +=		'<span class="caracteristica btn_mostrar_rotinas"> Rotina <img class="btn_drop" src="img/ic_drop_claro.png"></span>'
				// 		htmlOficina +=		'<div class="container_rotinas">';
				// 		for (var j = 0; j < dataRotina.length; j++) {
				// 			htmlOficina += 	  '<div class="dados_rotina">';
				// 			htmlOficina += 		'<article  class="rotina_oficina" id="idRotina_'+dataRotina[i].idrotina+'">';
				// 			htmlOficina += 			'<p><span class="rotina_dia" id="rotina_dia_'+dataRotina[i].dia.idsemana+'">'+dataRotina[i].dia.dia+'</span> - <span class="rotina_horario" id="rotina_horario_'+dataRotina[i].hora+'">'+dataRotina[i].hora+':00 - </span>';
				// 			$.ajax({
				// 				url: path + "AgendamentoSala/ListarRotina/" + dataRotina[i].idrotina,
				// 				type: "GET",
				// 				async: false,
				// 				crossDomain: true,
				// 				success: function(dataAgendamento) {
				// 					if(dataAgendamento.idagendamento_sala == 0){	
				// 						htmlOficina +=	'<span id="sala_0_0" class="rotina_sala">&nbsp;</span></p>';
				// 					} else {
				// 						htmlOficina +=	'<span id="sala_'+dataAgendamento.sala.idsalas+'_'+dataAgendamento.idagendamento_sala+'" class="rotina_sala"> '+dataAgendamento.sala.sala+' </span></p>';	
				// 					}
				// 				}
				// 			});
				// 			htmlOficina += 			'<span class="editar editar_rotina" onclick="editarModal(\'rotina\','+dataOficinaProfessor[i].oficina.idoficina+')"> &nbsp; </span>'
				// 			htmlOficina +=		'</article>';
				// 			htmlOficina +=		'<article class="agrupamento_oficina">';
				// 			htmlOficina +=			'<p>';
				// 			htmlOficina +=				'<span id="agrupamento_'+dataRotina[i].agrupamento.idagrupamento+'" class="agrupamento">Agrupamento '+dataRotina[i].agrupamento.nome+' </span>';
				// 			htmlOficina +=			'</p>';
				// 			htmlOficina +=			'<span class="editar editar_agrupamento" onclick="editarModal(\'agrupamento\','+dataRotina[i].oficina.idoficina+')"> &nbsp; </span>';
				// 			htmlOficina +=		'</article>';
				// 			htmlOficina += 	  '</div>'			
				// 		}
				// 		htmlOficina += 			'<p class="nova_rotina" onclick="habilitarModalEdicaoRotina(0, '+dataOficinaProfessor[i].oficina.idoficina+', 0, 0, 0, 0, 0)">Criar Nova Rotina</p>';
				// 		htmlOficina += 		'</div>';
				// 	}
				// });
				htmlOficina +=			'</article>';
				htmlOficina +=		'</main>';
				htmlOficina +=	'</section>';
				$("#box_grupo_info").append(htmlOficina);
				adicionarRotinasOficina(dataOficinaProfessor[i].oficina.idoficina);
			}
		}
	});
	return false;
}

function adicionarRotinasOficina (idOficina) {
	htmlOficina = '';
	$.ajax({
		url: path + "Rotina/ListarOficina/" + idOficina,
		type: "GET",
		async: false,
		crossDomain: true,
		success: function(dataRotina) {
			htmlOficina +=		'<span class="caracteristica btn_mostrar_rotinas"> Rotina <img class="btn_drop" src="img/ic_drop_claro.png"></span>'
			htmlOficina +=		'<div class="container_rotinas">';
			for (var j = 0; j < dataRotina.length; j++) {
				htmlOficina += 	  '<div class="dados_rotina">';
				htmlOficina += 		'<article  class="rotina_oficina" id="idRotina_'+dataRotina[j].idrotina+'">';
				htmlOficina += 			'<p><span class="rotina_dia" id="rotina_dia_'+dataRotina[j].dia.idsemana+'">'+dataRotina[j].dia.dia+'</span> - <span class="rotina_horario" id="rotina_horario_'+dataRotina[j].hora+'">'+dataRotina[j].hora+':00 - </span>';
				$.ajax({
					url: path + "AgendamentoSala/ListarRotina/" + dataRotina[j].idrotina,
					type: "GET",
					async: false,
					crossDomain: true,
					success: function(dataAgendamento) {
						if(dataAgendamento.idagendamento_sala == 0){	
							htmlOficina +=	'<span id="sala_0_0" class="rotina_sala">&nbsp;</span></p>';
						} else {
							htmlOficina +=	'<span id="sala_'+dataAgendamento.sala.idsalas+'_'+dataAgendamento.idagendamento_sala+'" class="rotina_sala"> '+dataAgendamento.sala.sala+' </span></p>';	
						}
					}
				});
				htmlOficina += 			'<span class="editar editar_rotina" onclick="editarModal(\'rotina\','+idOficina+')"> &nbsp; </span>'
				htmlOficina +=		'</article>';
				htmlOficina +=		'<article class="agrupamento_oficina">';
				htmlOficina +=			'<p>';
				htmlOficina +=				'<span id="agrupamento_'+dataRotina[j].agrupamento.idagrupamento+'" class="agrupamento">Agrupamento '+dataRotina[j].agrupamento.nome+' </span>';
				htmlOficina +=			'</p>';
				htmlOficina +=			'<span class="editar editar_agrupamento" onclick="editarModal(\'agrupamento\','+dataRotina[j].oficina.idoficina+')"> &nbsp; </span>';
				htmlOficina +=		'</article>';
				htmlOficina += 	  '</div>'			
			}
			htmlOficina += 			'<p class="nova_rotina" onclick="habilitarModalEdicaoRotina(0, '+idOficina+', 0, 0, 0, 0, 0)">Criar Nova Rotina</p>';
			htmlOficina += 		'</div>';
		}
	});
	$('#idOficina_'+idOficina+' .area_rotinas_oficina').html(htmlOficina);
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

function habilitarModalEdicaoOficina(idOficina, ciclo, periodo) {
	$('#boxModaisEdicao').show();
	$('.modal_edicao_oficina').show();
	$('#editar_id_oficina').val(idOficina);
	$('#cicloOficinaEditar').val(ciclo);
	$('#periodoOficinaEditar').val(periodo);
}

function habilitarModalEdicaoRotina (idRotina, idOficina, agrupamento, dia, horario, sala, agendamento) {
	$('#boxModaisEdicao').show();
	$('.modal_edicao_rotina').show();
	$('#id_rotina').val(idRotina);
	$('#editar_id_rotina').val(idOficina);
	$('#agrupamentoEdit').val(agrupamento);
	$('#Dia_Semana_Edit').val(dia);
	$('#Horario_Edit').val(horario);
	$('#Sala_Edit').val(sala);
	$('#id_agendamento').val(agendamento);
}

function habilitarModalEdicaoAgrupamento () {
	$('#boxModaisEdicao').show();
	$('.modal_edicao_agrupamento').show();
}

function editarModal(modal,id){
	if(modal == "oficina"){
		$('#editar_id_oficina').val(id);
		// var idOficina = $('.modal_edicao_oficina #editar_id_oficina').val();
		var conteudoCiclo = $("#idOficina_"+id).find(".ciclo").attr('id').split('_')[2];
		var conteudoPeriodo = $("#idOficina_"+id).find(".periodo").attr('id').split('_')[2];
		habilitarModalEdicaoOficina(id, conteudoCiclo, conteudoPeriodo);	
	} else if(modal == "rotina"){
		$('#editar_id_rotina').val(id);
		// var idOficina = $('.modal_edicao_rotina #editar_id_rotina').val();
		var agrupamento = $("#idOficina_"+id).find(".agrupamento").attr('id').split('_')[1];
		var dia = $("#idOficina_"+id).find(".rotina_dia").attr('id').split('_')[2];
		var horario = $("#idOficina_"+id).find(".rotina_horario").attr('id').split('_')[2];
		var sala = $("#idOficina_"+id).find(".rotina_sala").attr('id').split('_')[1];
		var agendamento = $("#idOficina_"+id).find(".rotina_sala").attr('id').split('_')[2];
		var idRotina = $(".rotina_oficina").attr('id').split('_')[1];
		habilitarModalEdicaoRotina(idRotina, id, agrupamento, dia, horario, sala, agendamento);
	} else if(modal == "agrupamento"){
		$('#boxModaisEdicao').show();
		$('.modal_edicao_agrupamento').show();
		$('#editar_id_agrupamento').val(id);
		editarAgrupamento();
	}
	centralizarModal();	
}

function editarOficina(){
	$('#salvarOficina').click(function(){

		var ciclo = $("#cicloOficinaEditar").val();
		var periodo = $("#periodoOficinaEditar").val();
		var idOficina = $('#editar_id_oficina').val();

		$.ajax({
			url: path+"Oficina",
			type:"POST",
			async:false,
			dataType:"json",
			crossDomain:true,
			data:"action=update&ciclo="+ciclo+"&periodo="+periodo+"&id="+idOficina, 
			success: function(d){
				$('#boxModaisEdicao').css('display','none');
				$('#oficina_periodo').html($("#periodoOficinaEditar option:selected").text());
				$('#oficina_ciclo').html($("#cicloOficinaEditar option:selected").text);
				mensagem("Oficina alterada com sucesso!","OK","bt_ok","sucesso"); 	
			}	
		})		
	});	
}

function editarRotina(){
	$(".btn_Edit_Rotina").click(function(){

		var idRotina = $('#id_rotina').val();
		var idOficina = $('#editar_id_rotina').val();
		var agrupamento = $('#agrupamentoEdit').val();
		var dia = $('#Dia_Semana_Edit').val();
		var horario = $('#Horario_Edit').val();
		var sala = $('#Sala_Edit').val();
		var agendamento = $('#id_agendamento').val();
		var anoLetivo = getIdAnoLetivo();

		if (agrupamento != '0' &&
			dia != '0' &&
			horario != '0' &&
			sala != '0')
		{
			$.ajax({
				url: path + "Rotina",
				async: false,
				crossDomain: true,
				type: "POST",
				data: "action=create&idOficina="+idOficina+"&idAgrupamento="+agrupamento+"&idDia="+dia+"&Hora="+horario+"&idSala="+sala+"&anoLetivo="+anoLetivo+"&id="+idRotina,
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
						data: "action=create&Hora="+horario+"&dia="+dia+"&idsala="+sala+"&idrotina="+idRotina+"&id="+agendamento,
						success: function() {
							adicionarRotinasOficina(idOficina);
						}
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

