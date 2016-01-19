//Murano Design

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

    var alunoID = 2;
    var UsuarioAtivo = 2;

//------------------------------------------------------------------------------------------------------------------------

//Carregas as variaveis padrao


//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD

	var dataProfessorFuncionario    =   getData("ProfessorFuncionario", null);
	var dataPeriodo 				=	getData("Periodo", null);
//	var dataAnoEstudo 				=	getData("AnoEstudo", null);

//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery



$(document).ready(function() {	

	carregaOficineiros();
	carregaTutores();
	carregarProfessoresByPeriodo('8');
	
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
	})
	
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

function carregaTutores(){
	var anoAtual = new Date().getFullYear();
	console.log(anoAtual);
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
		},
		error: function(){
			console.log("Erro!");
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
			for(var i = 0; i < dataAgrupamentos.length; i++){
				htmlOficina += '<div class="lista_agrupamentos">';
				htmlOficina += 		'<section class="oficina_info">';
				htmlOficina +=			'<header class="tipo_oficina">';
				htmlOficina +=				'<h1 style="color:'+dataAgrupamentos[i].oficina.tipoOficina.cor.forte+'">'+dataAgrupamentos[i].oficina.nome+ '</h1>';
				htmlOficina +=			'</header>';
				htmlOficina +=			'<main>';
				htmlOficina +=				'<article class="ciclo_periodo_oficina">';
				htmlOficina +=					'<p class="ciclo_periodo"> Ciclo:';
				htmlOficina +=						'<span class="ciclo">'+dataAgrupamentos[i].oficina.ciclo.ciclo+'</span>';
				htmlOficina +=						'| Período: <span class="periodo">'+dataAgrupamentos[i].oficina.periodo.periodo+'</span>';
				htmlOficina +=					'</p>';
				htmlOficina +=					'<span class="editar editar_rotina" onclick="editarModal(\'oficina\','+dataAgrupamentos[i].oficina.idoficina+')"> &nbsp; </span>';
				htmlOficina +=				'</artile>';
				htmlOficina +=				'<article class="rotina_oficina"> Rotina:';
				htmlOficina +=					'<span class="rotina_dia"> '+dataAgrupamentos[i].dia+'</span>';
				htmlOficina +=					'<span class="rotina_horario"> '+dataAgrupamentos[i].hora+':00 </span>';
				htmlOficina +=					'<span class="rotina_sala"> '+dataAgrupamentos[i].sala+' </span>';
				htmlOficina +=					'<span class="editar editar_rotina"> &nbsp; </span>';
				htmlOficina +=				'</article>';
				htmlOficina +=				'<article class="oficineiros_oficina">';
				htmlOficina +=					'<p class="oficineiro"> Professor(es):';
				for(var j = 0; j < dataAgrupamentos[i].professores.length; j++){
									htmlOficina += '<span> '+dataAgrupamentos[i].professores[j].nome +'</span>';
									htmlOficina += dataAgrupamentos[i].professores.length - 1 != j ?',':''; //If resumido, ternário. Verifica se a lista de professores está na ultima posição, se sim, não poem vírgula, se não, poem vírgula.
				}
				htmlOficina +=					'</p>';
				htmlOficina +=					'<span class="editar editar_oficineiro"> &nbsp; </span>';
				htmlOficina +=				'</article>';
				htmlOficina +=				'<article class="agrupamento_oficina">';
				htmlOficina +=					'<p class="agrupamento"> Agrupamento:';
				htmlOficina +=						'<span> '+dataAgrupamentos[i].agrupamento+' </span>';
				htmlOficina +=					'</p>';
				htmlOficina +=					'<span class="editar editar_agrupamento"> &nbsp; </span>';
				htmlOficina +=				'</article>';
				htmlOficina +=			'</main>';
				htmlOficina +=		'</section>';
				htmlOficina +=	'</div>';
			}
			$("#box_grupo_info").append(htmlOficina);
		}
	});
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

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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

	//console.log('Tutor: '+tutor);
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

function editarModal(modal,id){
	$('#boxModaisEdicao').show();
	$('.modal_edicao_'+modal).show();
	$('.modal_edicao_'+modal).prepend('<input type="hidden" value="'+id+'" id="editar_id">');
		
}

function salvarOficina(){
	$('.editar').attr('id');
}

