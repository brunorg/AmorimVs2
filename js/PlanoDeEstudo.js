var userID = usuarioId;
var alunoID = RetornaAlunoPlano();

var usuarioPerfil = ((dadosUsuario.aluno == null)? 'Professor' : 'Aluno');

//Procedimento para pegar a data atual
var data = new Date();
	var ano = data.getFullYear();
	var mes = data.getMonth()+1;
	if (mes < 10){
		mes = '0'+mes;
	}
	var dia = data.getDate();
	if (dia < 10){
		dia = '0'+dia;
	}

var dataAtual = Date.UTC(ano, mes, dia);  

var IdentificadorPlanoEstudo = getUltimoPlanoEstudo();
//Carregas as variaveis padrao
var Salvo = false;
var UltimoIdRegistroDiario;
var campos;
var RetornoRD;
var List = [];
var confData = '';



//---------------------------------------------------------------------------------------------------------------

// Carrega valores do BD

var dataAlunoVariavel;
var dataUsuario;
	
$.ajax({
	url: path + "AlunoVariavel/aluno/" + alunoID,
	type: "GET",
	async:false,
	crossDomain: true,
	success: function(data)
	{
		dataAlunoVariavel = data;
	}
});
$.ajax({
	url: path + "Usuario/" + usuarioId,
	type: "GET",
	async:false,
	crossDomain: true,
	success: function(data)
	{
		dataUsuario = data;
	}
});

//--------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery

$(document).ready(function() {
	
	verificarAtribuirRoteirosPassados();
	
	$("body").delegate(".planoPassado","click", function(){
		mensagem("Crie um plano de estudos para essa semana! Para isso, clique no botão “novo”.","OK","bt_ok","alerta");
		return false;
	})
	
	/* Chama a função de edição ao clicar no botão btnSubmit */
  	$("#btnSubmit").click(function () {
	    editar();
	});
	
	
	/*janelas no menu barra plano de estudo "historico e Novo"*/
	$(".historico").click(function(){
		$("#box_novo").removeClass("exibir");
		$("#box_historico").toggleClass("exibir");
		$(".novo").removeClass("novo_ativo");	
		$(".historico").toggleClass("historico_ativo");
	});

	$(".novo").click(function(){
		if(usuarioPerfil == "Aluno")
		{
			if($('#box_novo').hasClass("exibir"))
			{
				$("#box_novo").css("height", "130px");
				$("#botoes").hide();
			}				
			$("#box_historico").removeClass("exibir");
			$("#box_novo").toggleClass("exibir");
			$(".historico").removeClass("historico_ativo");
			$(".novo").toggleClass("novo_ativo");
		}
	});	
	
	$("#cancelar").click(function(){
		$("#box_novo").removeClass("exibir");
		$(".novo").removeClass("novo_ativo");
		$("#box_novo").css("height", "130px");
		$("#botoes").hide();
		$('#data_inicio').val("");
		$('#data_fim').val("");
	});

	$("#L_Novo_Plano").click(function(){
		
			document.getElementsByClassName('novo')[0].click();
		
	});

	$("#enviar").click(function(){
		
		var erro = false;
		var dataInicio = $('#data_inicio').val();
		var dataFim = $('#data_fim').val();
		
		if (verificaData(dataInicio) == false || verificaData(dataFim) == false){
			mensagem("Data inválida! Verifique os campos!","OK","bt_ok","erro");
			return false;
		}
		
		var dataInicioV = Date.UTC(dataInicio.split("/")[2].toString(), dataInicio.split("/")[1].toString(), dataInicio.split("/")[0].toString());
		var dataFimV = Date.UTC(dataFim.split("/")[2].toString(), dataFim.split("/")[1].toString(), dataFim.split("/")[0].toString());
		
		
		
		
		if (dataInicioV > dataFimV) {
		   mensagem("Data ínicio deve ser menor que data de término!","OK","bt_ok","erro");
		   erro = true;
		}
		if (dataAtual > dataInicioV){
			 mensagem("Data ínicio deve ser maior que a data de hoje!","OK","bt_ok","erro");
			 erro = true;
		}
		if (diasEntre(new Date(dataInicio.split("/")[2], dataInicio.split("/")[1] - 1, dataInicio.split("/")[0]), new Date(dataFim.split("/")[2], dataFim.split("/")[1] - 1, dataFim.split("/")[0])) > 15)
		{
			mensagem("O plano não deve durar mais do que 15 dias","OK","bt_ok","erro");
			erro = true;
		}
		
		if (erro == true){
			return false;
		}else {
			
			$.ajax({
				url: path+"PlanoEstudo/",
				type: "POST",
				crossDomain: true,
				beforeSend: function(){
					loading("inicial");
					$("#box_novo").removeClass("exibir");
					$(".novo").removeClass("novo_ativo");
					$("#box_novo").css("height", "130px");
					$("#botoes").hide();
					$(".planoPassado").removeClass("planoPassado");
					$('#data_inicio').val("");
					$('#data_fim').val("");
				},
				data: "action=create&dataInicio="+dataInicio+"&objetivoTutoria=&objetivoPessoal=&tarefaDeCasa=&autoAvaliacao=&observacoesTutor=&observacoesPais=&status=1&dataFim="+dataFim+"&aluno="+alunoID,
				success: function(d) {
					if (d>0){
					IdentificadorPlanoEstudo = d;
						confData = '';
						InitSetPlanoEstudo();
						loadHistorico();
						loading("final");
						return mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");
						
					}else{
						loading("final");
						return mensagem("Data do plano de estudo deve ser maior que o último cadastrado!","OK","bt_ok","erro");
					}
				}
			});
		}

	});
	
	$( "#data_inicio" ).datepicker({
		showOn: "button",
		beforeShow: function () {
			$("#box_novo").css("height", "285px");
		},
		onClose: function () {
			$("#box_novo").css("height", "130px");
			if(!($("#data_inicio").val() != "" && $("#data_fim").val() != ""))
			{
				$("#box_novo").css("height", "130px");
			}
			else
			{
				$("#box_novo").css("height", "130px");
				$("#botoes").show();
			}
		},
		buttonImage: "img/calendario.png",
		buttonImageOnly: true,
		buttonText: "Select date",
		dateFormat: 'dd/mm/yy',
		showOtherMonths:true,
		dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
		monthNames: ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO',
					 'SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO']	
	});
	
	$( "#data_fim" ).datepicker({
		showOn: "button",
		beforeShow: function () {
			$("#box_novo").css("height", "285px");
		},
		onClose: function () {
			if(!($("#data_inicio").val() != "" && $("#data_fim").val() != ""))
			{
				$("#box_novo").css("height", "130px");
			}
			else
			{
				$("#box_novo").css("height", "130px");
				$("#botoes").show();
			}
		},
		buttonImage: "img/calendario.png",
		buttonImageOnly: true,
		buttonText: "Select date",
		dateFormat: 'dd/mm/yy',
		showOtherMonths:true,
		dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
		monthNames: ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO',
					 'SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO']	
	});
	
	/*$(".ui-datepicker-trigger").click(function(){
		$("#box_novo").css("height", "285px");
	});*/
	$(".Conteudo_Coluna").scroll(function(){
		console.log("Coluna");
		$("#box_novo").removeClass("exibir");
	});
	$(".conteudo_plano").scroll(function(){
		console.log("conteudo");
		$("#box_novo").removeClass("exibir");
	});
	$(".Plano_Estudo_Content").scroll(function(){
		console.log("Content");
		$("#box_novo").removeClass("exibir");
	});
	
	/*fim menu*/

	/*Inicia o banco*/
	
	//InitSetPlanoEstudo();  // No MudarNovoPlano() já chama essa função!! 
	loadHistorico();
	MudarNovoPlano();
	

	if(usuarioPerfil == "Professor" || usuarioPerfil == "Coordenacao")
	{
		$(".novo").css("opacity","0.5");
		$(".Plano_Estudo_Content_Titulo_Categoria_Titulo_Laranja a").removeAttr('href');
	
	
		if (dataAlunoVariavel.grupo.tutoria.tutor.idprofessorFuncionario != dataUsuario.professor.idprofessorFuncionario)
		{
			$("textarea").prop("disabled", true);
			$("#btnSubmit").prop("disabled", true);
			$("#content_btn_Registro_Diario").css("display", "none");
		}

	}

	if(localStorage.getItem("novoPlano") != null && localStorage.getItem("novoPlano") != "")
	{
		$('.novo')[0].click();
	}

	localStorage.setItem("novoPlano", '');

});

function ordenaPorRoteiro(arrayObjetivos){
	//var ordenados = arrayObjetivos;
	var ordenados=[];
	var roteiros=[];
	var cRot;
	var primeiraOcorrencia;
	var posNoRoteiros;

	//percorre os objetivos
	for (var i = 0; i < arrayObjetivos.length;i++)
	{
		cRot=0;
		// //procura o roteiro correspondente no roteiros
		for (j = 0; j < roteiros.length; j++)
		{
			if (arrayObjetivos[i].objetivo.roteiro.nome == roteiros[j][1])
			{
				aux = roteiros[j][0];
				posNoRoteiros = j;
				cRot = 1;
			}	
		}

		if (cRot == 0)
		{
			roteiros[roteiros.length]=new Array(2);
			roteiros[roteiros.length-1][0]=ordenados.length;
			roteiros[roteiros.length-1][1]=arrayObjetivos[i].objetivo.roteiro.nome;
			ordenados[ordenados.length]=arrayObjetivos[i];
		}

		if (cRot == 1)
		{
			for (var j = ordenados.length; j > aux+1; j--)
			{
				ordenados[j-1]=ordenados[j];
			}

			ordenados[aux] = arrayObjetivos[i];

			for(var j = posNoRoteiros; j < roteiros.length; j++ )
			{
				roteiros[j][0] = roteiros[j][0] + 1;
			}
		}
	}
	return ordenados;

}


function selecionaPlano(aluno, dataSelecionada,planos)
{
	aux = [];

	
	//Se dataSelecionada é passada como String ela é transformada em um object Date
	if((typeof dataSelecionada) == 'string' ){
		var auxData = dataSelecionada;
		dataSelecionada = new Date();
		dataSelecionada.setFullYear((auxData.split('-'))[0]);
		dataSelecionada.setDate((auxData.split('-'))[2]);
		dataSelecionada.setMonth(((auxData.split('-'))[1])-1);
	}

	//seleciona todos os planos deste aluno
		for (var i = 0; i < planos.length; i++){
			if (planos[i].aluno.idAluno == alunoID){
				aux[aux.length] = planos[i];
			}
		}
		planos = aux;
		aux = [];	

		var dataInicio = new Date();
		var dataAux = new Date();
		
		//procura os roteiros que se encaixam na data selecionada
	
	for (var i = 1; i < planos.length;i++){

			dataInicio.setFullYear(((planos[i].dataInicio.split('-'))[0]));
			dataInicio.setDate(((planos[i].dataInicio.split('-'))[2]));
			dataInicio.setMonth(((planos[i].dataInicio.split('-'))[1])-1);


			
			
			// ESSE IF TEM QUE SELECIONAR O PLANO MAIS ATUAL AO INVES DE PROCURAR UM NA DATA SELECIONADA ( não vai mais existir data selecionada)
			//vai selecionar 1 plano, não um array
			if(dataInicio < dataAux){
				aux = planos[i];
				dataAux = dataInicio;
				//console.log("atualiza plano: ");
				//console.log(aux);
			}
	}
		planos = aux;
	aux = [];

	if (planos.length<1){
		 //alert("não foi encontrado nenhum roteiro nesse período!");
	}
	
	if (planos.length>1){
		 //alert("Existe mais de um planejamento para a data especificada!");
		return null;
	}


	return planos[0];
}
	

function editar() {	

	// Edição de dados gerais do plano de estudo, exceto o Registro Diário
	var DI = $('.Plano_Estudo_Content #dataInicio').val().substring(8, 10)+"/"+$('.Plano_Estudo_Content #dataInicio').val().substring(5, 7)+"/"+$('.Plano_Estudo_Content #dataInicio').val().substring(0, 4);
	var DF = $('.Plano_Estudo_Content #dataFim').val().substring(8, 10)+"/"+$('.Plano_Estudo_Content #dataFim').val().substring(5, 7)+"/"+$('.Plano_Estudo_Content #dataFim').val().substring(0, 4);
	
	$.ajax({
		url: path+"PlanoEstudo/",
		type: "POST",		
		crossDomain: true,		
		data: "id="+$('.Plano_Estudo_Content #id').val()+"&dataInicio="+DI+"&action="+$('.Plano_Estudo_Content #action').val()+"&objetivoTutoria="+$('.Plano_Estudo_Content #objetivoTutoria').val()+"&objetivoPessoal="+$('.Plano_Estudo_Content #objetivoPessoal').val()+"&tarefaDeCasa="+$('.Plano_Estudo_Content #tarefaDeCasa').val()+"&autoAvaliacao="+$('.Plano_Estudo_Content #autoAvaliacao').val()+"&observacoesTutor="+$('.Plano_Estudo_Content #observacoesTutor').val()+"&observacoesPais="+$('.Plano_Estudo_Content #observacoesPais').val()+"&status="+$('.Plano_Estudo_Content #status').val()+"&dataFim="+DF+"&aluno="+$('.Plano_Estudo_Content #aluno').val(),
		beforeSend:function(){
			loading("inicial");	
		},
		success: function(d) {
			loading("final");
			mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso"); 
			setTimeout(function(){ 
				$("#boxMensagemGeral").css("display","none");
			}, 5000);
			
		}
	});
}

function SalvaRegistros () {
	var registros = ".Plano_Estudo_Content_Registro_Diario_Tabela";
	var registrosData = ".Plano_Estudo_Content_Registro_Diario_Tabela_Data";
	var registrosText = ".Plano_Estudo_Content_Registro_Diario_Tabela_Textarea";

	for (var a = 0; a < registros.length; a++)
	{
		if($(registros + ' ' + registrosText)[a].id != "")
		{
			var diaMes = $(registros + ' ' + registrosText)[a].getAttribute("mes") + "-" + $(registros + ' ' + registrosText)[a].getAttribute("dia");
			editarRegistroDiario($(registros + ' ' + registrosText)[a].id, diaMes)
		}
		else
		{
			if ($(registros + ' ' + registrosText)[a].value != '')
			{
				var diaMes = $(registros + ' ' + registrosText)[a].getAttribute("mes") + "-" + $(registros + ' ' + registrosText)[a].getAttribute("dia");
				criarRegistroDiario(diaMes)
			}
		}
	}
}

function editarRegistroDiario(Identificador, DataRegistro)
{
	//Edicao do Registro diário específico

	var dataPostagem = new Date().getFullYear() + "-" + DataRegistro;
	var DataCampoDia = DataRegistro.split('-')[1];
	var DataCampoMes = DataRegistro.split('-')[0];
	var campoTexto = $('[dia='+DataCampoDia+'][mes='+DataCampoMes+']');

	$.ajax({
		url: path+"RegistroDiario/",
		type: "POST",
		crossDomain: true,
		data: "id="+Identificador+"&action=update&registro="+$('#'+Identificador).val()+"&planoEstudo="+IdentificadorPlanoEstudo+"&data="+dataPostagem,
		beforeSend: function(){
			loading("inicial");	
		},success: function(d) {
			mensagem("Alterado com sucesso!","OK","bt_ok","sucesso");
		},complete: function(){
			loading("final");	
		},error: function() {
			console.log("Não modificado, verifique os campos.");
		}
	});	

}
function criarRegistroDiario(DataRegistro)
{
	var dataPostagem = new Date().getFullYear() + "-" + DataRegistro;
	var DataCampoDia = DataRegistro.split('-')[1];
	var DataCampoMes = DataRegistro.split('-')[0];
	var campoTexto = $('[dia='+DataCampoDia+'][mes='+DataCampoMes+']');

	$.ajax({
		url: path+"RegistroDiario/",
		type: "POST",
		crossDomain: true,
		async: false,
		data: "action=create&registro="+campoTexto.val()+"&planoEstudo="+IdentificadorPlanoEstudo+"&data="+dataPostagem,
		beforeSend: function(){
			loading("inicial");	
		},success: function(d) {
			UltimoRegistro = d;
			mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");
		},complete: function(){
			loading("final");	
		},error: function() {
			console.log("Não Criados, verifique os campos.");
		}
	});	    
}

function MudarNovoPlano(IdPlanoNovo)
{
	for(var a=0;a< List.length; a++)
	{
		$.ajax({
			url: path+"PlanejamentoRoteiro/",
			type: "POST",
			crossDomain: true,
			dataType: 'json',
			data: List[a]+""+IdPlanoNovo,
			success: function(d) {
				//alert("Dados alterados com sucesso!");
			},error: function() {
				console.log("Não modificado, verifique os campos.");
			}
		});
	}

	$('#content_btn_Registro_Diario').empty();
	InitSetPlanoEstudo();	
}

function InitSetPlanoEstudo()
{
	Salvo = false;
	
	if(IdentificadorPlanoEstudo > 0){
		$.ajax({
			url: path+"PlanoEstudo/"+IdentificadorPlanoEstudo,
			type: "GET",
       		async:false,
       		crossDomain: true,			
			success: function(data) {
				$('#Registro_Diario').empty();
				//Seta os campos com seus respectivos valores
				$('.Plano_Estudo_Content #id').val(IdentificadorPlanoEstudo);
				$('.Plano_Estudo_Content #dataInicio').val(data.dataInicio);
				$('.Plano_Estudo_Content #action').val("update");
				$('.Plano_Estudo_Content #objetivoTutoria').val(data.objetivoTutoria);
				$('.Plano_Estudo_Content #objetivoPessoal').val(data.objetivoPessoal);
				$('.Plano_Estudo_Content #tarefaDeCasa').val(data.tarefaDeCasa);
				$('.Plano_Estudo_Content #autoAvaliacao').val(data.autoAvaliacao);
				$('.Plano_Estudo_Content #observacoesTutor').val(data.observacoesTutor);
				$('.Plano_Estudo_Content #observacoesPais').val(data.observacoesPais);
				$('.Plano_Estudo_Content #status').val(data.status);
				$('.Plano_Estudo_Content #dataFim').val(data.dataFim);
				$('.Plano_Estudo_Content #aluno').val(alunoID);
	
	
				//preenche campo OBJETIVO TUTORIA
				$('.Plano_Estudo_Content_Objetivos_Conteudo_Texto').empty(); 
	
				if(usuarioPerfil == "Aluno"){
					$('.Plano_Estudo_Content_Objetivos_Conteudo_Texto').append("<input type='hidden' name='objetivoTutoria' id='objetivoTutoria' value='"+data.objetivoTutoria+"' />"+data.objetivoTutoria);
				} else if(usuarioPerfil == "Professor" || usuarioPerfil == "Coordenacao"){
					$('.Plano_Estudo_Content_Objetivos_Conteudo_Texto').append("<textarea class='Plano_Estudo_Content_Registro_Diario_Tabela_Textarea' name='objetivoTutoria' id='objetivoTutoria'>"+data.objetivoTutoria+"</textarea>");
				} 
	
	
				//preenche campo OBJETIVO Persona
				$('.Plano_Estudo_Content_Objetivos_Pessoal_Conteudo_Texto').empty(); 
				//$('.Plano_Estudo_Content_Objetivos_Pessoal_Conteudo_Texto').append(data.objetivoPessoal); 
				if(usuarioPerfil == "Aluno"){
					$('.Plano_Estudo_Content_Objetivos_Pessoal_Conteudo_Texto').append("<textarea class='Plano_Estudo_Content_Registro_Diario_Tabela_Textarea' name='objetivoPessoal' id='objetivoPessoal'>"+data.objetivoPessoal+"</textarea>");
				}
				else if(usuarioPerfil == "Professor" || usuarioPerfil == "Coordenacao")	{
					$('.Plano_Estudo_Content_Objetivos_Pessoal_Conteudo_Texto').append("<input type='hidden' name='objetivoPessoal' id='objetivoPessoal' value='"+data.objetivoPessoal+"' />"+data.objetivoPessoal);
				} 
	
	
				//preenche campo TAREFA DE CASA
				$('.Plano_Estudo_Content_Tarefas_Casa_Conteudo_Texto').empty(); 
				$('.Plano_Estudo_Content_Tarefas_Casa_Conteudo_Texto').append("<textarea class='Plano_Estudo_Content_Registro_Diario_Tabela_Textarea_H' name='tarefaDeCasa' id='tarefaDeCasa'>"+data.tarefaDeCasa+"</textarea>"); 
				
				Limitacao(document.getElementById('tarefaDeCasa'), 200);
				$('#contadorLimite').html(200 - $('#tarefaDeCasa').val().length);
	
				//preenche campo OBSERVACOES TUTOR
				$('#Observacoes_Tutor .Plano_Estudo_Content_Registro_Diario_Tabela_Texto').empty();  
	
				if(usuarioPerfil == "Professor" || usuarioPerfil == "Coordenacao")	{$('#Observacoes_Tutor .Plano_Estudo_Content_Registro_Diario_Tabela_Texto').append("<textarea class='Plano_Estudo_Content_Registro_Diario_Tabela_Textarea' name='observacoesTutor' id='observacoesTutor'>"+data.observacoesTutor+"</textarea>");}
				else if(usuarioPerfil == "Aluno")	{$('#Observacoes_Tutor .Plano_Estudo_Content_Registro_Diario_Tabela_Texto').append("<input type='hidden' name='observacoesTutor' id='observacoesTutor' value='"+data.observacoesTutor+"' />"+data.observacoesTutor);} 
	
	
				//preenche campo OBSERVACOES PAIS
				$('#Observacao_Pais .Plano_Estudo_Content_Registro_Diario_Tabela_Texto').empty(); 
	
				if(usuarioPerfil == "Aluno")			{$('#Observacao_Pais .Plano_Estudo_Content_Registro_Diario_Tabela_Texto').append("<textarea class='Plano_Estudo_Content_Registro_Diario_Tabela_Textarea' name='observacoesPais' id='observacoesPais'>"+data.observacoesPais+"</textarea>");}
				else if(usuarioPerfil == "Professor" || usuarioPerfil == "Coordenacao")	{$('#Observacao_Pais .Plano_Estudo_Content_Registro_Diario_Tabela_Texto').append("<input type='hidden' name='observacoesPais' id='observacoesPais' value='"+data.observacoesPais+"' />"+data.observacoesPais);} 
	
				//preenche campo Auto Avaliacao
				$('.Plano_Estudo_Content_Auto_Avaliacao_Content').empty(); 
	
				if(usuarioPerfil == "Aluno")			{$('.Plano_Estudo_Content_Auto_Avaliacao_Content').append('<textarea class="Plano_Estudo_Content_Registro_Diario_Tabela_Textarea" name="autoAvaliacao" id="autoAvaliacao">'+data.autoAvaliacao+'</textarea>');}
				else if(usuarioPerfil == "Professor" || usuarioPerfil == "Coordenacao")	{$('.Plano_Estudo_Content_Auto_Avaliacao_Content').append("<input type='hidden' name='autoAvaliacao' id='autoAvaliacao' value='"+data.autoAvaliacao+"' />"+data.autoAvaliacao);}
			
				$('#Periodo_Plano_Estudo').empty();
				
				
				preencheData(data.dataInicio, data.dataFim);
				
				//Verifica se a data atual é menor que a final. Se for, desabilita o link, senão o link funcionará normal
				var dataFinal = Date.UTC(data.dataFim.split('-')[0], data.dataFim.split('-')[1], data.dataFim.split('-')[2]);
				
				if (dataFinal < dataAtual){
					console.log('DF Menor q a data atual. Não pode ter o link');
					$('.Plano_Estudo_Content_Titulo_Categoria_Titulo_Laranja a').attr('href','#');
					
					if (confData == ''){
						console.log('Prieira verificação!!');
						$('.Plano_Estudo_Content_Titulo_Categoria_Titulo_Laranja a').addClass('planoPassado');
						confData = dataFinal;
					}else {
						console.log('Clicou em um plano do historico!!');
						$('.Plano_Estudo_Content_Titulo_Categoria_Titulo_Laranja a').removeClass('planoPassado');
						
					}
					
				}else{
					console.log('Plano com a data OK');
					confData = dataFinal;		
					$('.Plano_Estudo_Content_Titulo_Categoria_Titulo_Laranja a').attr('href','roteirosPlanejamento.html');
				}
			}
		});    	

		//valor qualquer provisorio;
	   
        var auxTeste;


		$('.Plano_Estudo_Content_Planejamento_Content').empty();
        var htmlcontent = '';
		var titulo ='';
		var m;
		var k;
	
		$.ajax({
			url: path+"PlanejamentoRoteiro/RoteirosAtivos/"+IdentificadorPlanoEstudo,
			type: "GET",
			async:false,
			crossDomain: true,
			success: function(planejamentos){
				
				for (var i = 0; i < planejamentos.length; i++) 
				{
					//nome do roteiro  
					if (titulo != planejamentos[i].objetivo.roteiro.nome){			    
						if(titulo==""){
							
						}else{
							htmlcontent += '</div>';
						}
						htmlcontent += '<div class="box_roteiros">';
						htmlcontent += '<div class="Objetivos_Semana_Conteudo_Titulo_Tarefas">' + planejamentos[i].objetivo.roteiro.nome + '</div>';
						titulo = planejamentos[i].objetivo.roteiro.nome;
					}
					
					//cria a div onde vão ficar os objetivos planejados e a div onde fica o unico objetivo do exemplo
					htmlcontent +='<div class="Objetivos_Semana_Conteudo_Tarefas_Content"><div class="Objetivos_Semana_Conteudo_Tarefas">'
					var atividades = planejamentos[i].objetivo.nome;
	
					htmlcontent += '<div class="Objetivos_Semana_Conteudo_Tarefas_Numero';
	
					if(planejamentos[i].status == 2){
						htmlcontent += ' Selected_Tarefas';
					}else if (planejamentos[i].status == 1){
						htmlcontent += '';
					}else if (planejamentos[i].status == 3){
						htmlcontent += ' Selected_Tarefas finalizado_estado_Objetivo';
					}else{
	
					}
					htmlcontent += '">'+ planejamentos[i].objetivo.numero + '</div>';
					htmlcontent += '<div class="Objetivos_Semana_Conteudo_Tarefas_Texto">'+planejamentos[i].objetivo.nome+ '</div> </div> </div>';		
		
				};
			}
		});

   		$('.Plano_Estudo_Content_Planejamento_Content').append(htmlcontent);

		
		if (dataAlunoVariavel.grupo != null && dataUsuario.professor != null ){
			if (dataAlunoVariavel.grupo.tutoria.tutor.idprofessorFuncionario != dataUsuario.professor.idprofessorFuncionario)
			{
				$("textarea").prop("disabled", true);
				$("#btnSubmit").prop("disabled", true);
				$("#content_btn_Registro_Diario").css("display", "none");
			}
		}
	}
}


//-----------------------------------------------------------------------------------------------------------------------------------------------


function VerificaObjetivosCompletos()
{

	var NaoEncontrado;


	for(var a=0; a < $('.box_roteiros').length; a++)
	{

		NaoEncontrado = false;

		if($('.box_roteiros:nth-child('+(a+1)+') .Objetivos_Semana_Conteudo_Tarefas_Content').length > 0)
		{
			for(var b=0; b < $('.box_roteiros:nth-child('+(a+1)+') .Objetivos_Semana_Conteudo_Tarefas_Content').length; b++)
			{

				if(!$('.box_roteiros:nth-child('+(a+1)+') .Objetivos_Semana_Conteudo_Tarefas_Content:nth-child('+(b+1+1)+') .Objetivos_Semana_Conteudo_Tarefas_Numero').hasClass('finalizado_estado_Objetivo'))
				{
					NaoEncontrado = true;
				}
			}
		}    
	}

}


//------------------------------------------------------------------------------------------------------------------------


function preencheData(dataInicio, dataFinal)
{
	dataInicioSplt = dataInicio.split("-");
	dataFinalSplt = dataFinal.split("-");
		 
	switch(dataInicioSplt[1]) 
	{
		case '01':
		    dataInicioSplt[1] = "Janeiro"; 
			break;
		case '02':
		    dataInicioSplt[1] = "Fevereiro"; 
			break;
		case '03':
		    dataInicioSplt[1] = "Março"; 
			break;		 
		case '04':
		    dataInicioSplt[1] = "Abril"; 
			break;		 		 
		case '05':
		    dataInicioSplt[1] = "Maio"; 
			break;	
		case '06':
		    dataInicioSplt[1] = "Junho"; 
			break;	
		case '07':
		    dataInicioSplt[1] = "Julho"; 
			break;	
		case '08':
		    dataInicioSplt[1] = "Agosto"; 
			break;	
		case '09':
		    dataInicioSplt[1] = "Setembro"; 
			break;	
		case '10':
		    dataInicioSplt[1] = "Outubro"; 
			break;	
		case '11':
		    dataInicioSplt[1] = "Novembro"; 
			break;	
		case '12':
		    dataInicioSplt[1] = "Dezembro"; 
			break;			 
	}

	switch(dataFinalSplt[1]) 
	{
	    case '01':
	        dataFinalSplt[1] = "Janeiro"; 
			break;
	   case '02':
	        dataFinalSplt[1] = "Fevereiro"; 
			break;
	   case '03':
	        dataFinalSplt[1] = "Março"; 
			break;		 
	   case '04':
	        dataFinalSplt[1] = "Abril"; 
			break;		 		 
	   case '05':
	        dataFinalSplt[1] = "Maio"; 
			break;	
	   case '06':
	        dataFinalSplt[1] = "Junho"; 
			break;	
	   case '07':
	        dataFinalSplt[1] = "Julho"; 
			break;	
	   case '08':
	        dataFinalSplt[1] = "Agosto"; 
			break;	
	   case '09':
	        dataFinalSplt[1] = "Setembro"; 
			break;	
	   case '10':
	        dataFinalSplt[1] = "Outubro"; 
			break;	
	   case '11':
	        dataFinalSplt[1] = "Novembro"; 
			break;	
	   case '12':
	        dataFinalSplt[1] = "Dezembro"; 
			break;			 
	}
	 
	 
	var htmlRegistroDiario = '';
	var dataAux = new Date(((dataInicio.split("-"))[0]), ( ( (dataInicio.split("-") ) [1] ) -1 ), ((dataInicio.split("-"))[2]));
	var dataAuxFim = new Date(((dataFinal.split("-"))[0]), ( ( ( dataFinal.split("-" ) ) [1])-1), ((dataFinal.split("-"))[2]));
	var contadorRegistros = 1;
	
	console.log(dataAux, dataAuxFim, IdentificadorPlanoEstudo, alunoID);

	callRegistroHtml(dataAux, dataAuxFim, IdentificadorPlanoEstudo, alunoID);			

	var periodoPlano = dataInicioSplt[2] + " de " + dataInicioSplt[1] + " a " +   dataFinalSplt[2] + " de " + dataFinalSplt[1];

	$('#Periodo_Plano_Estudo').append(periodoPlano);		
		 
}

function callRegistroHtml(PrimeiraData, SegundaData, IdentificadorPlano, IdentificadorAluno)
{
   	var d = new Date();	
	$.ajax({
		url: path+"RegistroDiario/PlanoEstudo/"+IdentificadorPlano,
		type: "GET",
		async:false,
		crossDomain: true,
		success: function(dataRegistroDiario) {
			
			//for(var a = 0; Date.UTC(PrimeiraData.getFullYear(), PrimeiraData.getMonth(), PrimeiraData.getDate() + a) <= Date.UTC(d.getFullYear() , d.getMonth(), d.getDate()); a++)
			
			for(var a = 0; Date.UTC(PrimeiraData.getFullYear(), PrimeiraData.getMonth(), PrimeiraData.getDate() + a) <= Date.UTC(SegundaData.getFullYear(), SegundaData.getMonth(), SegundaData.getDate()); a++)
			{
				var dataRegistro = new Date(PrimeiraData.getFullYear(), PrimeiraData.getMonth(), PrimeiraData.getDate() + a);
				dataRegistro = new Date(dataRegistro.getTime() /*+ (24 * 60 * 60 * 1000)*/);
				setRetornoRD('<tr class="Plano_Estudo_Content_Registro_Diario_Tabela"><td class="Plano_Estudo_Content_Registro_Diario_Tabela_Data">' + dataRegistro.getDate() +'/'+ (dataRegistro.getMonth() + 1) + '</td><td class="Plano_Estudo_Content_Registro_Diario_Tabela_Texto"><textarea class="Plano_Estudo_Content_Registro_Diario_Tabela_Textarea textarea_top" id="" dia="'+dataRegistro.getDate()+'" mes ="'+(dataRegistro.getMonth() + 1)+'"></textarea></td></tr>');
				$('#Registro_Diario').append(getRetornoRD());
			}
			for(var a=0; a<dataRegistroDiario.length; a++){
				var DataCampoDia = parseInt(dataRegistroDiario[a].data.split('-')[2]);
				var DataCampoMes = parseInt(dataRegistroDiario[a].data.split('-')[1]);
				var DataCampoAno = parseInt(dataRegistroDiario[a].data.split('-')[0]);
				var getRegistroDia = '[dia='+DataCampoDia+'][mes='+DataCampoMes+']';
				$(getRegistroDia).html(dataRegistroDiario[a].registro);
				$(getRegistroDia).attr('id', dataRegistroDiario[a].idregistroDiario);
				/*if(DataCampoDia == d.getDate() && DataCampoMes == (d.getMonth()+1))
				{
					setRetornoRD('<tr class="Plano_Estudo_Content_Registro_Diario_Tabela"><td class="Plano_Estudo_Content_Registro_Diario_Tabela_Data">' + DataCampoDia+'/'+ DataCampoMes + '</td><td class="Plano_Estudo_Content_Registro_Diario_Tabela_Texto"><textarea class="Plano_Estudo_Content_Registro_Diario_Tabela_Textarea" id="'+dataRegistroDiario[a].idregistroDiario+'" dia="'+dataRegistro.getDate()+'" mes ="'+(dataRegistro.getMonth() + 1)+'">'+dataRegistroDiario[a].registro+'</textarea></td></tr>');
					$('#Registro_Diario').append(getRetornoRD());
					PermitidoSalvarRegistro=true;
					Salvo = true;
				}*/

				console.log("oi");
					
				/*var DataCampoDia = parseInt(dataRegistroDiario[a].data.substring(8));
				var DataCampoMes = parseInt(dataRegistroDiario[a].data.substring(5,7));
				var DataCampoAno = parseInt(dataRegistroDiario[a].data.substring(0,4));

				if(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) >= Date.UTC(PrimeiraData.getFullYear(), PrimeiraData.getMonth(), PrimeiraData.getDate()) &&
				Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) <= Date.UTC(SegundaData.getFullYear(), SegundaData.getMonth(), SegundaData.getDate()))
				{

					if(DataCampoDia == d.getDate() && DataCampoMes == (d.getMonth()+1))
					{

						setRetornoRD('<tr class="Plano_Estudo_Content_Registro_Diario_Tabela"><td class="Plano_Estudo_Content_Registro_Diario_Tabela_Data">' + DataCampoDia+'/'+ DataCampoMes + '</td><td class="Plano_Estudo_Content_Registro_Diario_Tabela_Texto"><textarea class="Plano_Estudo_Content_Registro_Diario_Tabela_Textarea" id="Registro_Diario_Novo">'+dataRegistroDiario[a].registro+'</textarea></td></tr>');

						UltimoIdRegistroDiario = dataRegistroDiario[a].idregistroDiario; 
						Salvo = true;

					} else {

						setRetornoRD('<tr class="Plano_Estudo_Content_Registro_Diario_Tabela"><td class="Plano_Estudo_Content_Registro_Diario_Tabela_Data">' + DataCampoDia+'/'+ DataCampoMes + '</td><td class="Plano_Estudo_Content_Registro_Diario_Tabela_Texto"><textarea class="Plano_Estudo_Content_Registro_Diario_Tabela_Textarea textarea_top" id="Registro_'+dataRegistroDiario[a].idregistroDiario+'">'+dataRegistroDiario[a].registro+'</textarea></td></tr>');
					}

					$('#Registro_Diario').append(getRetornoRD());

				}*/
			}

			$('#Registro_Diario').append('<tr class="Plano_Estudo_Content_Registro_Diario_Tabela"><td></td><td><div id="content_btn_Registro_Diario"><div id="botaoChange" class="add_Registro_Btn" onclick="SalvaRegistros();"></div></div></td></tr>');
			document.getElementById('botaoChange').style.backgroundImage="url(img/enviar_bco.png)";

			/*if (Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) >= Date.UTC(PrimeiraData.getFullYear(), PrimeiraData.getMonth(), PrimeiraData.getDate()) &&
				Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) <= Date.UTC(SegundaData.getFullYear(), SegundaData.getMonth(), SegundaData.getDate()))
			{
				$('#Registro_Diario').append('<tr class="Plano_Estudo_Content_Registro_Diario_Tabela"><td></td><td><div id="content_btn_Registro_Diario"><div id="botaoChange" class="add_Registro_Btn" onclick="VerificaAcaoBtnRegistroDiario();"></div></div></td></tr>');
				if($(getRegistroDia).length <= 0){
					document.getElementById('botaoChange').style.backgroundImage="url(img/enviar_bco.png)";
				}
			}*/			
		},error: function() {
			retorno = "erro";
		}
	});			
}

//get set retornando RetornoRD, referente ao Registro Diário

function setRetornoRD(Valor)
{
	RetornoRD = Valor;
}

function getRetornoRD()
{
	return RetornoRD;
}


function reSetPlano(ID)
{
	IdentificadorPlanoEstudo = ID;	
	InitSetPlanoEstudo();	
	$("#box_novo").removeClass("exibir");
	$("#box_historico").toggleClass("exibir");
	$(".novo").removeClass("novo_ativo");	
	$(".historico").toggleClass("historico_ativo");
}


function addHistorico(Inicio, Fim, ID)
{

	var HtmlConteudo='<p><a onclick="reSetPlano('+ID+');">'+Inicio+' a '+Fim+'</a></p>';
					
	DataASerSalva = parseInt(Inicio.substring(3,5));
	
	switch(DataASerSalva)
	{
		
		case 1:
			$('._janeiro').append(HtmlConteudo);
			break;
		
		case 2:
			$('._fevereiro').append(HtmlConteudo);
			break;
		
		case 3:
			$('._marco').append(HtmlConteudo);
			break;
		
		case 4:
			$('._abril').append(HtmlConteudo);
			break;
		
		case 5:
			$('._maio').append(HtmlConteudo);
			break;
		
		case 6:
			$('._junho').append(HtmlConteudo);
			break;
		
		case 7:
			$('._julho').append(HtmlConteudo);
			break;
		
		case 8:
			$('._agosto').append(HtmlConteudo);
			break;
		
		case 9:
			$('._setembro').append(HtmlConteudo);
			break;
		
		case 10:
			$('._outubro').append(HtmlConteudo);
			break;
		
		case 11:
			$('._novembro').append(HtmlConteudo);
			break;
		
		case 12:
			$('._dezembro').append(HtmlConteudo);
			break;

	}
}

//alterar código
function loadHistorico()
{
	var HtmlConteudo;
	var DataASerSalva = 0;

	$.ajax({
    type: "GET",
    crossDomain: true,
    url: path+"PlanoEstudo/alunoTotal/" + alunoID,
    }).then(function(data) {
    	
    $('.historicoData').remove();
    var comprimento = 4;
    	
		for(var a=0; a < data.length; a++)
		{
			HtmlConteudo = "";

			HtmlConteudo+='<p class="historicoData"><a onclick="reSetPlano('+data[a].idplanoEstudo+');">'+data[a].dataInicio.substring(8,10)+'/'+(data[a].dataInicio.substring(5,7))+' a '+data[a].dataFim.substring(8,10)+'/'+(data[a].dataFim.substring(5,7))+'</a></p>';
				
				DataASerSalva = parseInt(data[a].dataInicio.substring(5,7));
				//console.log("ID",data[a].idplanoEstudo);
				//console.log(DataASerSalva);
				
			switch(DataASerSalva)
			{
				
				case 1:
					$('._janeiro').append(HtmlConteudo);
					if ($('._janeiro .historicoData').length > comprimento)
					{
						comprimento++;
						$("#box_historico").css("height", (parseInt($("#box_historico").css("height").split("p")[0]) + 28) + "px");
					}
					break;
				
				case 2:
					$('._fevereiro').append(HtmlConteudo);
					if ($('._fevereiro .historicoData').length > comprimento)
					{
						comprimento++;
						$("#box_historico").css("height", (parseInt($("#box_historico").css("height").split("p")[0]) + 28) + "px");
					}
					break;
				
				case 3:
					$('._marco').append(HtmlConteudo);
					if ($('._marco .historicoData').length > comprimento)
					{
						comprimento++;
						$("#box_historico").css("height", (parseInt($("#box_historico").css("height").split("p")[0]) + 28) + "px");
					}
					break;
				
				case 4:
					$('._abril').append(HtmlConteudo);
					if ($('._abril .historicoData').length > comprimento)
					{
						comprimento++;
						$("#box_historico").css("height", (parseInt($("#box_historico").css("height").split("p")[0]) + 28) + "px");
					}
					break;
				
				case 5:
					$('._maio').append(HtmlConteudo);
					if ($('._maio .historicoData').length > comprimento)
					{
						comprimento++;
						$("#box_historico").css("height", (parseInt($("#box_historico").css("height").split("p")[0]) + 28) + "px");
					}
					break;
				
				case 6:
					$('._junho').append(HtmlConteudo);
					if ($('._junho .historicoData').length > comprimento)
					{
						comprimento++;
						$("#box_historico").css("height", (parseInt($("#box_historico").css("height").split("p")[0]) + 28) + "px");
					}
					break;
				
				case 7:
					$('._julho').append(HtmlConteudo);
					if ($('._julho .historicoData').length > comprimento)
					{
						comprimento++;
						$("#box_historico").css("height", (parseInt($("#box_historico").css("height").split("p")[0]) + 28) + "px");
					}
					break;
				
				case 8:
					$('._agosto').append(HtmlConteudo);
					if ($('._agosto .historicoData').length > comprimento)
					{
						comprimento++;
						$("#box_historico").css("height", (parseInt($("#box_historico").css("height").split("p")[0]) + 28) + "px");
					}
					break;
				
				case 9:
					$('._setembro').append(HtmlConteudo);
					if ($('._setembro .historicoData').length > comprimento)
					{
						comprimento++;
						$("#box_historico").css("height", (parseInt($("#box_historico").css("height").split("p")[0]) + 28) + "px");
					}
					break;
				
				case 10:
					$('._outubro').append(HtmlConteudo);
					if ($('._outubro .historicoData').length > comprimento)
					{
						comprimento++;
						$("#box_historico").css("height", (parseInt($("#box_historico").css("height").split("p")[0]) + 28) + "px");
					}
					break;
				
				case 11:
					$('._novembro').append(HtmlConteudo);
					if ($('._novembro .historicoData').length > comprimento)
					{
						comprimento++;
						$("#box_historico").css("height", (parseInt($("#box_historico").css("height").split("p")[0]) + 28) + "px");
					}
					break;
				
				case 12:
					$('._dezembro').append(HtmlConteudo);
					if ($('._dezembro .historicoData').length > comprimento)
					{
						comprimento++;
						$("#box_historico").css("height", (parseInt($("#box_historico").css("height").split("p")[0]) + 28) + "px");
					}
					break;
			}
		}

	});

	$('.HistoryPlano').click(function(){
		IdentificadorPlanoEstudo = $(this).attr("id");
		MudarNovoPlano();
	});

}

function RetornaAlunoPlano()
{
	var retorno;
	if(base64_decode(GetURLParameter('ID')) == undefined)
	{
		$.ajax({
			url: path+"Usuario/"+userID,
			type: "GET",
			async:false,
			crossDomain: true,
			success: function(d) {
				retorno = d.aluno.idAluno;
			}
		});
	} else 
	{
		retorno = base64_decode(GetURLParameter('ID'));
	}
	return retorno;
}

/* Independentes */

/* pegar ultimo plano Estudo (>ID)*/

function getUltimoPlanoEstudo(){
	var retorno;
	
	$.ajax({
		url: path+"PlanoEstudo/aluno/"+alunoID,
		type: "GET",
		async:false,
		crossDomain: true,
		success: function(d) {
			retorno =d[0].idplanoEstudo;
		}
	});	
	return retorno;
}

//Função que limita o campo de texto a numero de caracteres (limite de caracteres num input text, textarea...)
function Limitacao(objeto, Numero)
{
	objeto.maxLength = ""+Numero;
	$(objeto).parent().css("position", "relative");
	$(objeto).css("padding-right", "50px");


	$( "<div id='contadorLimite' style='width:50px;height:50px;position:absolute; bottom:0; right:0;'>"+Numero+"</div>" ).insertAfter( objeto );

	$( objeto ).keypress(function() {
		$('#contadorLimite').html(Numero - $(objeto).val().length);
	});

	$( objeto ).keyup(function() {
		$('#contadorLimite').html(Numero - $(objeto).val().length);
	});
}


function TrocaBtn()
{
	document.getElementById('botaoChange').style.backgroundImage="url(../img/enviar_bco.png)";
}
function verificaData(dataBr){
	
	 if(dataBr.length!=10) return false;   

	    var dia         = dataBr.substr(0,2);   
	    var barra1      = dataBr.substr(2,1);   
	    var mes         = dataBr.substr(3,2);   
	    var barra2      = dataBr.substr(5,1);   
	    var ano         = dataBr.substr(6,4);   
	    if(dataBr.length!=10||barra1!="/"||barra2!="/"||isNaN(dia)||isNaN(mes)||isNaN(ano)||dia>31||mes>12)return false;   
	    if((mes==4||mes==6||mes==9||mes==11) && dia==31)return false;   
	    if(mes==2 && (dia>29||(dia==29 && ano%4!=0)))return false;   
	    if(ano < 1900)return false;   
	    return true;   
  
}

function verificarAtribuirRoteirosPassados () {
	if (JSON.parse(localStorage.getItem("objetoAlunoVariavel")).verificarRoteiros > 0){
		$.ajax({
			url: path + "AtribuicaoRoteiroExtra/AtribuirRoteirosIncompletosAnoAnterior/" + localStorage.getItem("alunoId"),
			async: false,
			crossDomain: true,
			type: "GET",
			beforeSend: function() {
				loading("inicial");
			},
			complete: function() {
				loading("final");
			}
		});
	}
}