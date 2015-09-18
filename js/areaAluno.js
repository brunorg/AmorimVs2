//Murano Design


//------------------------------------------------------------------------------------------------------------------------

//Carregas as variaveis padrao

var Limite;
var HtmlContent;
var a;
var contador;
var largura;
var ContadorPA;
var d = new Date();
var ObjetivoCompletosAdd =0;
var RoteirosCompletosAdd = 0;

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

var alunoID = getAlunoByUsuario(usuarioId);
localStorage.setItem("alunoEdt",alunoID);

var alunoVariavelID;
$.ajax({
	url: path+"AlunoVariavel/aluno/"+ alunoID,
	type: "GET",
	async:false,
	crossDomain: true,
	success: function(data)
	{
		alunoVariavelID = data;
	}
});

var dataPlanejamentoRoteiro;
$.ajax({
	url: path+"PlanejamentoRoteiro/aluno/"+ alunoID,
	type: "GET",
	async:false,
	crossDomain: true,
	success: function(data)
	{
		dataPlanejamentoRoteiro = data;
	}
});

var AnoEstudoID = alunoVariavelID.anoEstudo.idanoEstudo;

var contadorRoteirosTotal = 0;
var contadorObjetivosTotal = 0;


//------------------------------------------------------------------------------------------------------------------------


//Carrega os valores utilizados do BD
var dataRoteiro;
$.ajax({
	url: path+"Roteiro/RoteiroAno/"+ alunoVariavelID.anoEstudo.idanoEstudo,
	type: "GET",
	async:false,
	crossDomain: true,
	success: function(data)
	{
		dataRoteiro = data;
	}
});

var dataProducaoAluno;
$.ajax({
	url: path+"ProducaoAluno/Aluno/"+alunoID,
	type: "GET",
	async:false,
	crossDomain: true,
	success: function(data)
	{
		dataProducaoAluno = data;
	}
});

//------------------------------------------------------------------------------------------------------------------------
//Carrega a tabela Calendario Eventos

function CarregaServicoCalendarioEventos()
{
	$.ajax({
		url: path+"Calendario/Evento/" + 46,
		type: "GET",
		async:true,
		crossDomain: true,
		success: function(dataCalendario) {
			HtmlContent = "";
			var serviceCalendarioEventos = dataCalendario;
			for(var a = 0; a < serviceCalendarioEventos.length; a++){		
				var foto = serviceCalendarioEventos[a].imagem;
				if (a<5){
					HtmlContent += '<div class="Conteudo_Coluna3_Agenda_Evento">';
					
					HtmlContent += '<div class="Conteudo_Coluna3_Agenda_Evento_Conteudo">'+ serviceCalendarioEventos[a].evento;
					HtmlContent += '<div class="Conteudo_Coluna3_Agenda_Evento_Titulo">' + 
					serviceCalendarioEventos[a].dataInicio.substring(8, 10)+"/"+ serviceCalendarioEventos[a].dataInicio.substring(5, 7)+"/"+ serviceCalendarioEventos[a].dataInicio.substring(0, 4)+ '</div>';
					HtmlContent +='<div class="Conteudo_Coluna3_Agenda_Evento_Hora">'+
						dataCalendario[a].hora+
					'</div>';				
					
					if(serviceCalendarioEventos[a].imagem != "" && serviceCalendarioEventos[a].imagem != null && serviceCalendarioEventos[a].imagem != undefined)
					{
						HtmlContent +='<br /><img src="'+foto+'" width="80%" style="margin-left: 14px;"/>';
					}			
					HtmlContent+='</div>';
					HtmlContent += "</div>";
					
				}else{
		
					HtmlContent += '<div class="Conteudo_Coluna3_Agenda_Evento AgendaNulo">';
					HtmlContent += '<div class="Conteudo_Coluna3_Agenda_Evento_Titulo">' + 
					serviceCalendarioEventos[a].dataInicio.substring(8, 10)+"/"+ serviceCalendarioEventos[a].dataInicio.substring(5, 7)+"/"+ serviceCalendarioEventos[a].dataInicio.substring(0, 4)+ '</div>';
		
		
					HtmlContent += '<div class="Conteudo_Coluna3_Agenda_Evento_Conteudo">'+ serviceCalendarioEventos[a].evento;
		
					if(serviceCalendarioEventos[a].imagem != "" && serviceCalendarioEventos[a].imagem != null && serviceCalendarioEventos[a].imagem != undefined){
						HtmlContent +='<br /><img src="'+foto+'" width="100%" />';
					}
		
					HtmlContent+='</div>';
		
					HtmlContent += "</div>";
				}
			}
					
			$('#Conteudo_Coluna3_Agenda_Evento_Content').append(HtmlContent);
			OrdenarPor("Conteudo_Coluna3_Agenda_Evento_Titulo");
			$(".Conteudo_Coluna3_Agenda_Evento").css("display","none");
		
			for(var l = 0; l < 5; l++)
			{
				if (document.getElementsByClassName("Conteudo_Coluna3_Agenda_Evento")[l]!=undefined)
				{
					document.getElementsByClassName("Conteudo_Coluna3_Agenda_Evento")[l].style.display="block";
				}
		
			}
		}
	});
	
}


//------------------------------------------------------------------------------------------------------------------------

//Carrega a tabela Mensagens

function CarregaServicoMensagens(){
	$.ajax({
		url: path+"Mensagens/Proprietario/"+usuarioId,
		type: "GET",
		async:true,
		crossDomain: true,
		success: function(dataMensagens) {
			Limite = dataMensagens.length;	
			HtmlContent = '';
			contador=0;
			var cB= 0;
			
			for(var b=0; b<dataMensagens.length; b++){
				if(usuario == "Aluno")
				{	
					if(dataMensagens[b].lida == "N" && dataMensagens[b].cxEntrada == "S"){contador++;}
				}
			}
		
			for(var a = Limite-1; cB != contador; a--)
			{
				if(dataMensagens[a].cxEntrada == "S" && dataMensagens[a].lida == "N" && usuario == "Aluno")
				{	
					cB++;
					HtmlContent += '<tr>';
					HtmlContent += '<td class="dataMsg" onClick="window.location=\'mensagens.html?ID='+dataMensagens[a].idmensagens+'\';" style=" line-height: 13px;""><h4 class="user">'+ (dataMensagens[a].remetente.aluno != null ? dataMensagens[a].remetente.aluno.nome:dataMensagens[a].remetente.professor.nome) +'</h4>'+ dataMensagens[a].assunto.substring(0,40)+(dataMensagens[a].assunto.length<40 ? "</td>":"...</td>");
					HtmlContent += "</tr>";
				}
			}
			$('.mensagensTabela').append(HtmlContent);
		
			if(contador <= 9)
			{
				$('.Mensagens_Cabecalho_Imagem_Contador').html(contador);
			} else {
				$('.Mensagens_Cabecalho_Imagem_Contador').html("9+");
			}
		}
	});
}
//-----------------------------------------------------------------------------------------------------------------------------------------------


function VerificaObjetivosCompletos()
{
	//var NaoEncontrado;

	var totalObjetivos;

	for(a = 0; a < $('.Objetivos_Semana_Conteudo_Tarefas').length; a++)
	{

		$.ajax({
			url: path+"Objetivo/ObjetivoRoteiroTotal/" + $('.Objetivos_Semana_Conteudo_Tarefas:nth-child('+(a+1)+')').attr("id"),
			type: "GET",
			async:false,
			crossDomain: true,
			beforeSend: function(){
				loading("inicial");
			},
			success: function(data){
				totalObjetivos = data;
			},
			complete: function(){
				loading("final");
			}
		});

		if ($('.Objetivos_Semana_Conteudo_Tarefas:nth-child('+(a+1)+') td.td_roteiro_verde_tk').length == totalObjetivos)
		{

			$('.Objetivos_Semana_Conteudo_Tarefas:nth-child('+(a+1)+') .tabela_colorida_roteiro_Area_Aluno').remove();
			$('.Objetivos_Semana_Conteudo_Tarefas:nth-child('+(a+1)+') table').append("<tr><td>Roteiro Completo</td></tr>")
			RoteirosCompletosAdd++;
		}
	}

}


//------------------------------------------------------------------------------------------------------------------------

//Carrega a tabela ProducaoAluno

function CarregaServicoProducaoAluno()
{
		largura = 0;
	    ContadorPA = 0;

		HtmlContent = "";
		for (var a = 0; a < dataProducaoAluno.length; a++) {			
			if(dataProducaoAluno[a].tipo.idtipoProducaoAluno == 5) {
				if ( ContadorPA != 2 ) {
					if ( ContadorPA == 0 ) {
						HtmlContent += '<div class="Portfolio_Conteudo_Container">';
					}

					var apresentacao = "";

		    		if(dataProducaoAluno[a].arquivo != null) {


						var arquivo = dataProducaoAluno[a].arquivo;
						arquivo =  arquivo.split(".");
						
						if(arquivo[4]=="pdf"){
							apresentacao = '<img src="img/icone_portfolio.png" width="auto" height="100%"/>';
						} else if (arquivo[4]=="png" || arquivo[4]=="jpg" || arquivo[4]=="jpeg" || arquivo[4]=="gif") {
							apresentacao = '<img src="'+dataProducaoAluno[a].arquivo+'" width="auto" height="100%"/>';
						} else if (arquivo[4]=="mp3" || arquivo[4]=="wma" || arquivo[4]=="wav" || arquivo[4]=="ogg") {
							apresentacao = '<img src="img/icone_audio.png" width="auto" height="100%"/>';
						} else if (arquivo[4]=="mp4" || arquivo[4]=="avi" || arquivo[4]=="wmv"){
							apresentacao = '<img src="img/icone_video.png" width="auto" height="100%"/>';
						}
						
					}
						HtmlContent += '<div class="Portfolio_Conteudo_Box">';
			        	HtmlContent += '<a href="'+dataProducaoAluno[a].arquivo+'" target="_blank">';
						HtmlContent += '<div class="Nome_Roteiro">';
						HtmlContent += dataProducaoAluno[a].roteiro.nome;
						HtmlContent += '</div>';
						HtmlContent += '<div class="Img_Roteiro">';
						HtmlContent += apresentacao;
						HtmlContent += '</div>';
						HtmlContent += '</a>';
						HtmlContent += '</div>';
					
					ContadorPA++;

				} else {
					HtmlContent += '</div>';
					ContadorPA = 0;
				}
			}
		}

		
		$('#Portfolio_Conteudo').append(HtmlContent);
		$('#Portfolio_Conteudo').microfiche({ bullets: false });

	$('.microfiche-next-button').click(function() {
		if ((parseInt($('.microfiche-film').css('transform').split(',')[4])/293 > - ($('.microfiche-film .Portfolio_Conteudo_Container').length - 1)))
			$('.microfiche-film').css('transform', 'matrix(1,0,0,1,'+ (parseInt($('.microfiche-film').css('transform').split(',')[4]) -592) + ',0)');
	});

	$('.microfiche-prev-button').prop("disabled", false);

	$('.microfiche-prev-button').click(function() {
		console.log("Teste");
		if ((parseInt($('.microfiche-film').css('transform').split(',')[4]) < 0))
			$('.microfiche-film').css('transform', 'matrix(1,0,0,1,'+ (parseInt($('.microfiche-film').css('transform').split(',')[4]) + 592) + ',0)');
	});

	$('.microfiche-film').css('width', '5000px');

}

//------------------------------------------------------------------------------------------------------------------------

function AtivaBotoesPortfolio(a){

	/*$('.microfiche-next-button').click(function() {
		if ((parseInt($('.microfiche-film').css('transform').split(',')[4])/232 > - ($('.SlidePort a').length - 3)))
			$('.microfiche-film').css('transform', 'matrix(1,0,0,1,'+ (parseInt($('.microfiche-film').css('transform').split(',')[4]) -232) + ',0)');
	});

	$('.microfiche-prev-button').prop("disabled", false);

	$('.microfiche-prev-button').click(function() {
		if ((parseInt($('.microfiche-film').css('transform').split(',')[4]) < 0))
			$('.microfiche-film').css('transform', 'matrix(1,0,0,1,'+ (parseInt($('.microfiche-film').css('transform').split(',')[4]) + 232) + ',0)');
	});*/

}
//------------------------------------------------------------------------------------------------------------------------

//Preencher Rotina Semanal
function CarregarRotina() {
	var professores1 = ['Flávia','Bruna','Maria Eugênia','','Luciana','Luciana Cássia'];
	var professores2 = ['Luciana Cássia','Maria','Kevyn','','Luciana','Flávia'];

	var materias1 = ['Pesquisa', 'Artes', 'Inglês', '', 'Roda de Conversa', 'Pesquisa'];
	var materiasIDs1 = ['Rotina_Pesquisa', 'Rotina_Artes', 'Rotina_Ingles', '', 'Rotina_Roda_Conversa', 'Rotina_Pesquisa'];

	var materias2 = ['Matemática', 'Artes', 'Leitura e Escrita','', 'Roda de Conversa', 'Pesquisa'];
	var materiasIDs2 = ['Rotina_Matematica', 'Rotina_Artes', 'Rotina_Leitura_Escrita','', 'Rotina_Roda_Conversa', 'Rotina_Pesquisa'];

	var locais = ['Salão','Ateliê','Sala 12','','Salão','Salão'];
	var dia = 'segunda';
								
	var linhas = document.getElementById("Rotina_Semanal_Tabela").getElementsByClassName("Rotina_Semanal_Linha");
	$("#Rotina_Seta_Proximo").click(function() {
		if (dia === 'segunda') {
			dia = 'terça';
			for ( var i = 0; i < linhas.length; i++ ) {
				if ( i !== 3 ) {
					$($('.Rotina_Semanal_Linha').get(i)).removeClass(materiasIDs1[i]);
					$($('.Rotina_Semanal_Linha').get(i)).addClass(materiasIDs2[i]);
					$('#Rotina_Semanal_Dia').html(dia.toUpperCase());
					$('#Rotina_Semanal_Linha'+ (i+1) + ' td.Rotina_Semanal_Materia').html(materias2[i]);
					$('#Rotina_Semanal_Linha'+ (i+1) + ' td.Rotina_Semanal_Professor').html(professores2[i]);
					$('#Rotina_Semanal_Linha'+ (i+1) + ' td.Rotina_Semanal_Local').html(locais[i]);
				}
			}
		}
	});
	$("#Rotina_Seta_Anterior").click(function() {
		if (dia === 'terça') {
			dia = 'segunda';
			for ( var i = 0; i < linhas.length; i++ ) {
				if ( i !== 3 ) {
					$($('.Rotina_Semanal_Linha').get(i)).removeClass(materiasIDs2[i]);
					$($('.Rotina_Semanal_Linha').get(i)).addClass(materiasIDs1[i]);
					$('#Rotina_Semanal_Dia').html(dia.toUpperCase());
					$('#Rotina_Semanal_Linha'+ (i+1) + ' td.Rotina_Semanal_Materia').html(materias1[i]);
					$('#Rotina_Semanal_Linha'+ (i+1) + ' td.Rotina_Semanal_Professor').html(professores1[i]);
					$('#Rotina_Semanal_Linha'+ (i+1) + ' td.Rotina_Semanal_Local').html(locais[i]);
				}
			}
		}
	});
}

//------------------------------------------------------------------------------------------------------------------------

//Preencher Mural
function CarregarMural() {
	var muralNomes = ["Luciana Caparro", "Massumi", "Cássia"];
	var muralData = "23/02/2014";
	var muralHorario = "10:40";
	var muralMsgs = [
		"A partir de maio as oficinas de matemática serão na sala de informática.",
		"Para a próxima aula tragam garrafas pet e tampas de plástico colorido.",
		"Hoje faremos uma contação de histórias na sala de aula."
	];

	for (var i = 0; i < muralNomes.length; i++) {
		var muralLinha = '<div class="Mural_Conteudo_Linha">'+
					'<div class="Mural_Linha_Cabecalho">'+
						'<span class="Mural_Nome">'+muralNomes[i]+'</span>'+
						'<span class="Mural_Data"> '+muralData+'</span>'+
						'<span class="Mural_Horario"> '+muralHorario+'</span>'+
					'</div>'+
					'<div class="Mural_Linha_Texto">'+
						'<p class="Mural_Texto">'+muralMsgs[i]+'</p>'+
					'</div>'+
				'</div>';
		$("#Mural_Conteudo_Container").append(muralLinha);
	};
};
//------------------------------------------------------------------------------------------------------------------------

//Preencher Plano de Estudos
function CarregarPlanos() {

	//Carregar plano de estudo mais recente
	var dataPlanoEstudo;

	$.ajax({
		url: path+"PlanoEstudo/aluno/"+alunoID,
		type: "GET",
		async: false,
		crossDomain: true,
		success: function(d) {
			dataPlanoEstudo = d[0];			
		}
	});

	//Colocar Data
	var semanaPlano = dataPlanoEstudo.dataInicio.split('-')[1] + '/' +  dataPlanoEstudo.dataInicio.split('-')[2] + " - " + dataPlanoEstudo.dataFim.split('-')[1] + '/' +  dataPlanoEstudo.dataFim.split('-')[2]
	$('#PlanoEstudo_Semana').html(semanaPlano);

	//Carregar planejamentos referentes a esse plano

	var dataPlanejamento;

	$.ajax({
		url: path+"PlanejamentoRoteiro/RoteirosAtivos/"+dataPlanoEstudo.id,
		type: "GET",
		async: false,
		crossDomain: true,
		success: function(d) {
			dataPlanoEstudo = d[0];
		}
	});

	//

	var planoNome = "As transformações dos materiais";
	for (var i = 0; i < 5; i++) {
		var planoLinha = '<div class="PlanoEstudo_Linha">'+
							'<div class="PlanoEstudo_Linha_Cabecalho">'+
								'<p class="PlanoEstudo_Nome">'+planoNome+'</p>'+
							'</div>'+
							'<div class="PlanoEstudo_Linha_Conteudo">'+
								'<div class="PlanoEstudo_Num iniciado revisado">1</div>'+
								'<div class="PlanoEstudo_Num iniciado">2</div>'+
								'<div class="PlanoEstudo_Num iniciado">3</div>'+
								'<div class="PlanoEstudo_Num iniciado">4</div>'+
								'<div class="PlanoEstudo_Num iniciado">5</div>'+
								'<div class="PlanoEstudo_Num iniciado">6</div>'+
							'</div>'+
						'</div>';
		$("#PlanoEstudo_Conteudo_Container").append(planoLinha);
	};
};

//------------------------------------------------------------------------------------------------------------------------

//Preencher Oficinas
function CarregarOficinas() {
	var oficinasNomes = ["Matematica", "Leitura_Escrita", "Artes", "Ingles", "Matematica", "Leitura_Escrita", "Artes", "Ingles"];
	var oficinasTemas = [
		"ADIÇÃO COM NÚMEROS INTEIROS",
		"CONTOS BRASILEIROS",
		"MOLDAGEM COM ARGILA",
		"ANIMALS",
		"ADIÇÃO COM NÚMEROS INTEIROS",
		"CONTOS BRASILEIROS",
		"MOLDAGEM COM ARGILA",
		"ANIMALS"
	];
	for (var i = 0; i <= oficinasNomes.length*2; i++) {
		var oficinaLinha = '<div class="Oficinas_Conteudo_Linha">' +
					'<div class="Oficina_Nome" id="Oficina_Nome_'+oficinasNomes[i]+'">'+oficinasNomes[i].toUpperCase()+'</div>'+
					'<div class="Oficina_Tema" id="Oficina_Tema_'+oficinasNomes[i]+'">'+
						'<p class="Oficina_Tema_Texto">'+oficinasTemas[i]+'</p>'+
					'</div>'+
				'</div>';
		$(".Oficinas_Conteudo_Container").append(oficinaLinha);
	};
};

//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery

$(document).ready(function() {
	//Chamada de funcoes dos serviços

	contadorRoteirosTotal = contagemRoteiro();
	contadorObjetivosTotal = contagemObjetivo();

	CarregaServicoCalendarioEventos();
	CarregaServicoMensagens();
	CarregarRotina();
	CarregarMural();
	CarregarPlanos();
	CarregaServicoProducaoAluno();
	CarregarOficinas()
	AtivaBotoesPortfolio("oi");

});



//------------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------------------------------------------------

//Ordena os roteiros impedindo que eles criem dados desnecessarios (dois roteiros com objetivos diferentes)

function ordenaPorRoteiro(arrayObjetivos)
{

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
		//procura o roteiro correspondente no roteiros
		for (j = 0; j < roteiros.length; j++)
		{
			
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



//------------------------------------------------------------------------------------------------------------------------


//Verifica se tal Roteiro esta Completo

function GetBooleanRoteiroCompleto(ID)
{

	var dataObjetivoRoteiro;
	var totalCompletos = 0;

	$.ajax({
		url: path+"Objetivo/ObjetivoRoteiroTotal/"+ ID,
		type: "GET",
		async:false,
		crossDomain: true,
		success: function(data)
		{
			dataObjetivoRoteiro = data;
		}
	});

	for(var b=0; b<dataPlanejamentoRoteiro.length; b++)
	{
		if(dataPlanejamentoRoteiro[b].objetivo.idobjetivo == ID)
		{
			if(dataPlanejamentoRoteiro[b].status == 2 || dataPlanejamentoRoteiro[b].status == 3)
			{
				totalCompletos++;
			}
		}
	}

	return (totalCompletos == dataObjetivoRoteiro);
}

//------------------------------------------------------------------------------------------------------------------------

//Some com a imagem do garoto na area portifolios [GreenArea]

function someImagemGaroto(){
	$('.microfiche-controls').addClass('appear');
}

//------------------------------------------------------------------------------------------------------------------------

//Funcao pra ordenar as classes e afins pela sua ordem alfabetica

function OrdenarPor(TString)
{				

	$('#Conteudo_Coluna3_Agenda_Evento_Content').find('.Conteudo_Coluna3_Agenda_Evento').sort(function(x,b){
		//console.log(x,b);
        		return x.getElementsByClassName(TString)[0].innerHTML.substring(8, 10)+x.getElementsByClassName(TString)[0].innerHTML.substring(5, 7)+x.getElementsByClassName(TString)[0].innerHTML.substring(0, 2) > b.getElementsByClassName(TString)[0].innerHTML.substring(8, 10) + b.getElementsByClassName(TString)[0].innerHTML.substring(5, 7) + b.getElementsByClassName(TString)[0].innerHTML.substring(0, 2);
       }).appendTo($('#Conteudo_Coluna3_Agenda_Evento_Content'));
}

function getUltimoPE(ID)
{
	
	$.ajax({
		url: path+"PlanoEstudo/aluno/"+ID,
		type: "GET",
		async: false,
		crossDomain: true,
		success: function(d) {
			max = d;			
		},error: function() {
			max = "erro";
		}
	});

	return max[0].idplanoEstudo;
}

function contagemRoteiro()
{

	var contagemRetorno = 0;


	for(var a=0; a < dataRoteiro.length; a++)
	{
		if(dataRoteiro[a].ativo == "1")
		{
			contagemRetorno++;
		}
	}

	$.ajax({
		url: path + "Roteiro/RoteiroAluno/" + alunoID + "/" + d.getFullYear(),
		type: "GET",
		async:false,
		crossDomain: true,
		success: function (data)
		{
			for (var i = 0; i < data.length; i++) {
				contagemRetorno++;
			};
		}

	});


	return contagemRetorno;

}


function contagemObjetivo()
{

	var contagem;

	$.ajax({
		url: path + "Objetivo/ObjetivoAluno/" + alunoVariavelID.idalunoVariavel,
		type: "GET",
		async: false,
		crossDomain: true,
		success: function (data){
			contagem = data;
		}

	});

	return contagem;
}

