//Murano Design


//------------------------------------------------------------------------------------------------------------------------

//Carregas as variaveis padrao

var Limite;
var HtmlContent;
var a;
var contador;
var largura;
var ContadorPA;
var idPlanoEstudoSession;
var d = new Date();
var ObjetivoCompletosAdd =0;
var RoteirosCompletosAdd = 0;

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

localStorage.setItem("alunoEdt",alunoID);
var alunoVariavelID = JSON.parse(localStorage.getItem("objetoAlunoVariavel"));

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

		var dataProducaoAluno;
		$.ajax({
			url: path+"ProducaoAluno/alunoPortifolio/"+alunoID,
			type: "GET",
			async:false,
			crossDomain: true,
			success: function(data)
			{
				dataProducaoAluno = data;
			}
		});

		if(dataProducaoAluno!=""){
			for (var a = 0; a < dataProducaoAluno.length; a++) {			
				if ( ContadorPA != 3 ) {
					if ( ContadorPA == 0 ) {
						HtmlContent += '<div class="Portfolio_Conteudo_Container">';
					}

					var apresentacao = "";
					var capaDiv;

		    		if(dataProducaoAluno[a].capa != null) {
		    			capaDiv = '<div class="Img_Roteiro" id="'+dataProducaoAluno[a].idproducaoAluno+'">'
						apresentacao = '<img src="'+dataProducaoAluno[a].capa+'" class="capa" width="auto" height="100%"/>';
					}
					else
					{
						capaDiv = '<div class="Img_Roteiro uploadAtivo" id="'+dataProducaoAluno[a].idproducaoAluno+'">'
						apresentacao = '<img src="img/foto.png" class="upload_capa" width="100%" height="auto"/>';
					}
						HtmlContent += '<div class="Portfolio_Conteudo_Box">';
			        	HtmlContent += '<div class="portfolio_link" href="'+dataProducaoAluno[a].arquivo+'" target="_blank">';
			        	HtmlContent += capaDiv;
						HtmlContent += apresentacao;
						HtmlContent += '</div>';
						HtmlContent += '<div class="Nome_Roteiro">';
						HtmlContent += dataProducaoAluno[a].roteiro.nome;
						HtmlContent += '</div>';
						HtmlContent += '</div>';
						HtmlContent += '</div>';
					
					ContadorPA++;

				} else {
					HtmlContent += '</div>';
					HtmlContent += '<div class="Portfolio_Conteudo_Container">';
					var apresentacao = "";
					var capaDiv;

		    		if(dataProducaoAluno[a].capa != null) {
		    			capaDiv = '<div class="Img_Roteiro" id="'+dataProducaoAluno[a].idproducaoAluno+'">'
						apresentacao = '<img src="'+dataProducaoAluno[a].capa+'" class="capa" width="auto" height="100%"/>';
					}
					else
					{
						capaDiv = '<div class="Img_Roteiro uploadAtivo" id="'+dataProducaoAluno[a].idproducaoAluno+'">'
						apresentacao = '<img src="img/foto.png" class="upload_capa" width="100%" height="auto"/>';
					}
					HtmlContent += '<div class="Portfolio_Conteudo_Box">';
			        HtmlContent += '<div class="portfolio_link" href="'+dataProducaoAluno[a].arquivo+'" target="_blank">';
			        HtmlContent += capaDiv;
					HtmlContent += apresentacao;
					HtmlContent += '</div>';
					HtmlContent += '<div class="Nome_Roteiro">';
					HtmlContent += dataProducaoAluno[a].roteiro.nome;
					HtmlContent += '</div>';
					HtmlContent += '</div>';
					HtmlContent += '</div>';
					ContadorPA = 1;

				}
			}
		}	

		if (ContadorPA == 1)
			HtmlContent += '</div>';

		
		$('#Portfolio_Conteudo').append(HtmlContent);
		$('#Portfolio_Conteudo').microfiche({ bullets: false });

	$('.microfiche-next-button').click(function() {
		if ((parseInt($('.microfiche-film').css('transform').split(',')[4])/592 > - ($('.microfiche-film .Portfolio_Conteudo_Container').length - 1)))
			$('.microfiche-film').css('transform', 'matrix(1,0,0,1,'+ (parseInt($('.microfiche-film').css('transform').split(',')[4]) -592) + ',0)');
	});

	$('.microfiche-prev-button').prop("disabled", false);

	$('.microfiche-prev-button').click(function() {
		if ((parseInt($('.microfiche-film').css('transform').split(',')[4]) < 0))
			$('.microfiche-film').css('transform', 'matrix(1,0,0,1,'+ (parseInt($('.microfiche-film').css('transform').split(',')[4]) + 592) + ',0)');
	});

	$('.microfiche-film').css('width', '5000px');

}

//------------------------------------------------------------------------------------------------------------------------
var diasSemana = {
	"1" : "Segunda-Feira",
	"2" : "Terça-Feira",
	"3" : "Quarta-Feira",
	"4" : "Quinta-Feira",
	"5" : "Sexta-Feira"
}

var d = new Date
var diaHoje = d.getDay()
var horarios = [7, 8, 9, 10, 11]

//Preencher Rotina Semanal
function CarregarRotina() {

	$('#Rotina_Semanal_Dia').html(diasSemana[diaHoje])
		$.ajax({
		url: path+"Rotina/RotinaDiariaAluno/"+alunoVariavelID.idalunoVariavel+"/"+diaHoje,
		type: "GET",
		async: false,
		crossDomain: true,
		success: function(result) {

			horarios.forEach(function(horario) {
                $('#Rotina_Semanal_Linha' + horario + ' .Rotina_Semanal_Materia').html(" ")
                $('#Rotina_Semanal_Linha' + horario + ' .Rotina_Semanal_Professor').html(" ")
                $('#Rotina_Semanal_Linha' + horario + ' .Rotina_Semanal_Local').html(" ")
            })
			console.log(result)
			result.forEach(function(rotina){
				$('#Rotina_Semanal_Linha' + rotina.hora + ' .Rotina_Semanal_Materia').html(rotina.oficina.nome)
				$('#Rotina_Semanal_Linha' + rotina.hora + ' .Rotina_Semanal_Materia').css("background-color", rotina.oficina.tipoOficina.cor.forte)

				$('#Rotina_Semanal_Linha' + rotina.hora + ' .Rotina_Semanal_Professor').html(rotina.professor.split(" ")[0])
				//$('#Rotina_Semanal_Linha' + rotina.hora + ' .Rotina_Semanal_Professor').html(rotina.professor) //Descomentar e deletar linha acima caso for mostrar nome inteiro do professor

				$('#Rotina_Semanal_Linha' + rotina.hora + ' .Rotina_Semanal_Professor').css("background-color", rotina.oficina.tipoOficina.cor.medio)
				$('#Rotina_Semanal_Linha' + rotina.hora + ' .Rotina_Semanal_Local').html(rotina.sala[0].sala.sala)
				$('#Rotina_Semanal_Linha' + rotina.hora + ' .Rotina_Semanal_Local').css("background-color", rotina.oficina.tipoOficina.cor.fraco)
			})
		},
		error: function (a, status, error) {
			console.log(status + " /// " + error)
		}
	});	

}

function rotinaMudarDia(quanto) {

	horarios.forEach(function(horario) {
                $('#Rotina_Semanal_Linha' + horario + ' .Rotina_Semanal_Materia').html("Carregando")
                $('#Rotina_Semanal_Linha' + horario + ' .Rotina_Semanal_Professor').html("Carregando")
                $('#Rotina_Semanal_Linha' + horario + ' .Rotina_Semanal_Local').html("Carregando")
            })

	diaHoje = (diaHoje + quanto)
	if (diaHoje > 5) {diaHoje = 1};
	if (diaHoje < 1) {diaHoje = 5}
	CarregarRotina()
}


//------------------------------------------------------------------------------------------------------------------------

//Preencher Mural

function CarregarMural() {

	$.ajax({
		url: path+"MuralAluno/ListarAluno/"+alunoVariavelID.idalunoVariavel,
		type: "GET",
		async: false,
		crossDomain: true,
		success: function(dadosMural) {
			for (var i = 0; i < dadosMural.length; i++) {
				var dataMural = dadosMural[0]["mural"]["data"].split('-');
				var ano = dataMural[0];
				var mes = dataMural[1];
				var dia = dataMural[2]; 
				dataMural = dia+'/'+mes+'/'+ano;

				var muralLinha = '<div class="Mural_Conteudo_Linha '+ (dadosMural.length > 2 ? 'Linha_Scroll' : '') +'">'+
							'<div class="Mural_Linha_Cabecalho">'+
								'<span class="Mural_Nome">'+abreviaNome(dadosMural[i]["mural"]["professor"]["nome"])+'</span>'+
								'<span class="Mural_Data"> '+dataMural+'</span>'+
								'<span class="Mural_Horario"></span>'+
							'</div>'+
							'<div class="Mural_Linha_Texto">'+
								'<p class="Mural_Texto">'+dadosMural[i]["mural"]["mensagem"]+'</p>'+
							'</div>'+
						'</div>';
				$("#Mural_Conteudo_Container").append(muralLinha);
			};

		},
		error: function (a, status, error) {
			console.log(stats + " /// " + error)
		}
	});	
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

	idPlanoEstudoSession = dataPlanoEstudo.idplanoEstudo;

	if (getUTC(dataPlanoEstudo.dataFim) >= Date.UTC(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()))
	{
		//Colocar Data
		var semanaPlano = dataPlanoEstudo.dataInicio.split('-')[1] + '/' +  dataPlanoEstudo.dataInicio.split('-')[2] + " - " + dataPlanoEstudo.dataFim.split('-')[1] + '/' +  dataPlanoEstudo.dataFim.split('-')[2]
		$('#PlanoEstudo_Semana').html(semanaPlano);
	
		//Carregar planejamentos referentes a esse plano
	
		var dataPlanejamento;
	
		$.ajax({
			url: path+"PlanejamentoRoteiro/RoteirosAtivos/"+idPlanoEstudoSession,
			type: "GET",
			async: false,
			crossDomain: true,
			success: function(d) {
				dataPlanejamento = d;
			}
		});
	
		//Colocar planejamentos no quadro
	
		for (var i  = 0; i < dataPlanejamento.length; i++)
		{
			planoLinha = ''
			if ($("#Roteiro" + dataPlanejamento[i].objetivo.roteiro.idroteiro).length > 0)
			{
				if($("#Roteiro" + dataPlanejamento[i].objetivo.roteiro.idroteiro + " .PlanoEstudo_Num").length % 8 == 0)
				{
					$("#Roteiro" + dataPlanejamento[i].objetivo.roteiro.idroteiro).append('<div class="PlanoEstudo_Linha_Conteudo"></div>');
				}
				$("#Roteiro" + dataPlanejamento[i].objetivo.roteiro.idroteiro + " .PlanoEstudo_Linha_Conteudo:last-of-type").append(getPlanejamento(dataPlanejamento[i]));
			}
			else
			{
				planoLinha = '<div class="PlanoEstudo_Linha" id="Roteiro' + dataPlanejamento[i].objetivo.roteiro.idroteiro + '">' +
									'<div class="PlanoEstudo_Linha_Cabecalho">'+
										'<p class="PlanoEstudo_Nome">'+dataPlanejamento[i].objetivo.roteiro.nome+'</p>'+
									'</div>'+
									'<div class="PlanoEstudo_Linha_Conteudo">' +
									'</div>' +
								'</div>';
				$("#PlanoEstudo_Conteudo_Container").append(planoLinha);
				$("#Roteiro" + dataPlanejamento[i].objetivo.roteiro.idroteiro + " .PlanoEstudo_Linha_Conteudo:last-of-type").append(getPlanejamento(dataPlanejamento[i]));
			}
		}
	
		$('.planejado').click(function(){
			alteraEstado($(this));
		});

		// carregar registros
		var dataRegistros

		d = new Date();
		for (var i = 4; i >= 1; i--)
		{
			var daysBefore = new Date(d.getTime());
			daysBefore.setDate(daysBefore.getDate() - i);

			if (Date.UTC(daysBefore.getFullYear(), daysBefore.getMonth() + 1, daysBefore.getDate()) >= getUTC(dataPlanoEstudo.dataInicio))
			{
				HtmlContent = '<div class="dia_registro_box"><div class="dia_registro" id="'+ (daysBefore.getMonth() + 1) + '-' + daysBefore.getDate() +'">'+ daysBefore.getDate() + '/' + (daysBefore.getMonth() + 1) +'</div></div>'
				//inserir
			}
			$('.linha_datas_registro').append(HtmlContent);
		}

		HtmlContent = '<div class="dia_registro_box"><div class="dia_registro dia_ativo" id="'+ (d.getMonth() + 1) + '-' + d.getDate() +'">'+ d.getDate() + '/' + (d.getMonth() + 1) +'</div></div>';
		$('.linha_datas_registro').append(HtmlContent);
		getRegistroDia((d.getMonth() + 1) + '-' + d.getDate());

		$('.dia_registro').click(function() {
			$('.dia_ativo').removeClass('dia_ativo');
			$(this).addClass('dia_ativo');
			getRegistroDia($(this)[0].id);
		});
		$('.editar_button').click(function() {
			salvarRegistroAtual();
		});

		$('.textarea_registro textarea').removeAttr('disabled');
	}
	else
	{
		HtmlContent = '<div class="botao_novo_plano">' +
                      	'<img src="img/plano_estudo_novo_normal.png">' +
                      '</div>'+
                      '<div style="clear: both"></div>';
		$('.PlanoEstudo_Cabecalho_Nome').append(HtmlContent);
		HtmlContentData = '<div class="dia_registro_box"><div class="dia_registro">'+ (new Date()).getDate() + '/' + ((new Date()).getMonth() + 1) +'</div></div>'
		$('.linha_datas_registro').append(HtmlContentData);
		$('.botao_novo_plano').click(function () {
			localStorage.setItem("novoPlano", 'true');
    		window.location.href = "planoDeEstudo.html";
		});
	}
};

//------------------------------------------------------------------------------------------------------------------------

function alteraEstado (planejamento) {
	if (!planejamento.hasClass('revisado'))
		mensagem("Deseja entregar esse planejamento?","Cancelar","bt_cancelar","confirm", '', planejamento.prop('id'), "alteraEstadoIndividual");
}

function alteraEstadoIndividual (servico, id) {
	var dataPlanejamento;

	$.ajax({
	    url: path+"PlanejamentoRoteiro/" + id,
	    type: "GET",
	    async: false,
	    crossDomain: true,
	    dataType: 'json',
	    success: function(d) {
	    	dataPlanejamento = d;
	    }
	});

	if(dataPlanejamento.status == 1)
		statusVariavel = 2;
	else
		statusVariavel = 1;
	$.ajax({
	    url: path+"PlanejamentoRoteiro/",
	    type: "POST",
	    crossDomain: true,
	    dataType: 'json',
	    data: "id="+dataPlanejamento.idplanejamentoRoteiro+"&action=update&status="+statusVariavel+"&objetivo="+dataPlanejamento.objetivo.idobjetivo+"&planoEstudo="+dataPlanejamento.planoEstudo.idplanoEstudo+"&idAluno="+alunoID,
	    beforeSend: function() {
	    	$( "#boxMensagemGeral" ).hide();
	    	loading('inicial');
	    },
	    success: function() {
	    	mensagem("Dados alterados com sucesso!!","OK","bt_ok","sucesso");
	    },
	    error: function() {
	    	mensagem("Não modificado.","OK","bt_ok","erro");
	    },
	    complete: function() {
	    	loading('final');
	    }
	});
	if (statusVariavel == 1)
	    $("#"+id).removeClass('iniciado');
	else
	    $("#"+id).addClass('iniciado');

}

//------------------------------------------------------------------------------------------------------------------------

function getPlanejamento (planejamento) {
	var planejamentoContent = '';

	if(planejamento.status == 1)
	{
	    planejamentoContent += '<div class="PlanoEstudo_Num planejado" id="' + planejamento.idplanejamentoRoteiro + '">'+ planejamento.objetivo.numero + '</div>';
	} else if(planejamento.status == 2){
	    planejamentoContent += '<div class="PlanoEstudo_Num iniciado" id="' + planejamento.idplanejamentoRoteiro + '">'+ planejamento.objetivo.numero+'</div>';
	} else if(planejamento.status == 3){
	    planejamentoContent += '<div class="PlanoEstudo_Num iniciado revisado" id="' + planejamento.idplanejamentoRoteiro + '">'+ 	planejamento.objetivo.numero+'</div>';
	}

	return planejamentoContent;
}

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
		var oficinaLinha = '<div class="Oficinas_Conteudo_Linha '+ (oficinasNomes.length > 4 ? 'Linha_Scroll' : '') +'">' +
					'<div class="Oficina_Nome" id="Oficina_Nome_'+oficinasNomes[i]+'">'+oficinasNomes[i]+'</div>'+
					'<div class="Oficina_Tema" id="Oficina_Tema_'+oficinasNomes[i]+'">'+
						'<p class="Oficina_Tema_Texto">'+oficinasTemas[i]+'</p>'+
					'</div>'+
				'</div>';
		$(".Oficinas_Conteudo_Container").append(oficinaLinha);
	};
};

//------------------------------------------------------------------------------------------------------------------------

function AtivaUploadCapa () {
	$('.portfolio_link').click(function() {
		var linkPortfolio = window.open($(this).attr('href'), '_blank');
		if(linkPortfolio){
		    linkPortfolio.focus();
		}
	});

	$('.uploadAtivo').click(function(e) {
		uploadCapa($(this).attr('id'))
	});
	$('.Img_Roteiro').click(function(e) {
		e.stopPropagation();
	});

	$('#blocoGeral').append('<div class="blackPainel"></div>');
}

//------------------------------------------------------------------------------------------------------------------------

function uploadCapa (id) {
	var HtmlContentUpload = '<div id="JanelaUploadPortifolio">'+
                           	    '<div class="Titulo_janela_upload">'+
                           	        'Upload de Capa'+
                           	        '<div class="close_upload_producao">'+
                           	        '</div>'+
                           	    '</div>'+
                           	    '<div id="foto">'+
                           	    '</div>'+
                           	    '<div id="LegendaUpload">Aguardando Arquivo</div>'+
                           	    '<form id="Cadastro_Producao_Aluno">'+
                           	        '<input type="hidden" id="id" name="id"/>'+
                           	        '<input type="hidden" id="action" name="action" value="create" />'+
                           	        '<input type="hidden" id="Dados_Foto_Capa" />'+
                           	        '<input type="file" id="Arquivo_Foto_Capa" name="arquivo1" style="display:none"/>'+
                           	        '<div class="campoConfirmaUpload">'+
                           	            '<input class="btn_submit" onclick="SalvarCapa('+id+')" type="button" value="" />'+
                           	        '</div>'+
                           	    '</form>'+
                           	'</div>';

    $('.blackPainel').html(HtmlContentUpload);
    $('.blackPainel').css('display', 'block');

    GerarUpload($("#foto"), $("#Arquivo_Foto_Capa"), $("#Dados_Foto_Capa"));

    $('.close_upload_producao').click(function(){
            $('.blackPainel').hide();
            $('#Dados_Foto_Aluno').val('');
            $('#Arquivo_Foto_Aluno').val('');
            $('#foto').css("background-image","url(img/foto.png)");
            $("#LegendaUpload").html("Aguardando Arquivo");
    });
}

function SalvarCapa (id) {
    var formData = new FormData($('#Cadastro_Producao_Aluno')[0]);
    formData.append("fotoAluno", Arquivo);

    $.ajax({
        url: path+"ProducaoAluno/upload/capa/"+id,
        type: "POST",
        mimeType:"multipart/form-data",
        contentType: false,
        cache: false,
        processData:false,
        data: formData,
        dataType: 'json',
        beforeSend: function() {
        	loading('inicial');
        },   
        success: function(d) {
        	$('.blackPainel').css('display', 'none');
        	$("#"+id).html('<img src="'+d.capa+'" class="capa" width="auto" height="100%">')
            mensagem("Arquivo enviado com sucesso!","OK","bt_ok","sucesso");          
        },error: function() {
            mensagem("Erro ao enviar arquivo!","OK","bt_ok","erro");
        },
        complete: function() {
        	loading('final');
        }

    });
}

function pendencias(alunoID){
	$.ajax({
		url: path+"PendenciasProducaoAluno/TotalPendencias/"+alunoID,
		type: "GET",
		dataType: 'json',
        success: function(d){
			if(d>0){
				$('#pendencias').css('display','block');
				$('#bolinha').html(d);
			}
		}
	});
}
//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery

$(document).ready(function() {
	//Chamada de funcoes dos serviços

	contadorRoteirosTotal = contagemRoteiro();
	contadorObjetivosTotal = contagemObjetivo();

	CarregaServicoCalendarioEventos();
	CarregaServicoMensagens();
	rotinaMudarDia(0);
	CarregarMural();
	CarregarPlanos();
	//CarregarRegistros();
	CarregaServicoProducaoAluno();
	AtivaUploadCapa();
	CarregarOficinas();

	pendencias(alunoID);
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

function getRegistroDia (dia) {
	$.ajax({
		url: path + "RegistroDiario/PlanoEstudoData/" + idPlanoEstudoSession + "/" + (new Date()).getFullYear() + "-" + dia,
		async: false,
		crossDomain: true,
		type: "GET",
		beforeSend: function() {
			loading('inicial');
		},
		success: function(dataRegistroDiario) {
			if (dataRegistroDiario.length > 0)
			{
				$('.textarea_registro textarea').html(dataRegistroDiario[0].registro);
				$('.textarea_registro textarea').attr('id', dataRegistroDiario[0].idregistroDiario);
			}
			else
			{
				$('.textarea_registro textarea').html('');
				$('.textarea_registro textarea').removeAttr('id');
			}			
		},
		complete: function() {
			loading('final');
		}
	});
}

function salvarRegistroAtual () {

	var identificador = $('.textarea_registro textarea').attr('id');
	var registro = $('.textarea_registro textarea').val();
	var dataPostagem = (new Date()).getFullYear() + '-' + $('.dia_ativo')[0].id;
	var action;

	if (identificador != undefined)
		action = 'update';
	else
		action = 'create';
	if($(".txtArea").val() == "") {
		mensagem("Você precisa preencher o campo vazio.","OK","bt_ok","erro");
	} else {
		$.ajax({
			url: path+"RegistroDiario/",
			type: "POST",
			crossDomain: true,
			data: "id="+identificador+"&action="+action+"&registro="+registro+"&planoEstudo="+idPlanoEstudoSession+"&data="+dataPostagem,
			beforeSend: function(){
				loading("inicial");	
			},success: function(d) {
				mensagem("Alterado com sucesso!","OK","bt_ok","sucesso");
				if (action = 'create')
					$('.textarea_registro textarea').attr('id', d);
			},complete: function(){
				loading("final");	
			},
		});	
	}
}

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

function getUTC (data) {
	return Date.UTC(data.split('-')[0], data.split('-')[1], data.split('-')[2])
}