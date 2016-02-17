var userID = usuarioId;
var professorID = localStorage.getItem("professorId");;
var confEdita = false;
var dataUsuario;
var planoAula;
var nomeOficina	= '';
var corForte 	= '';
var corMedia 	= '';
var corFraca 	= '';

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

var List = [];
var confData = '';

$.ajax({
	url: path + "PlanoAula/Ultimo/"+professorID,
	type: "GET",
	async:false,
	crossDomain: true,
	success: function(data)
	{
		planoAula = data;
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

	if (planoAula != ''){
		carregarPlano();
	}

	$("body").delegate(".planoPassado","click", function(){
		mensagem("Crie um plano de aula para essa semana! Para isso, clique no botão “novo”.","OK","bt_ok","alerta");
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
		$(".novo").css("background-color",corForte);
		$(".historico").toggleClass("historico_ativo");
		if ($(".historico").hasClass("historico_ativo")) {
			$(".historico").css("background-color",corMedia);
		} else {
			$(".historico").css("background-color",corForte);
		}
	});

	$(".novo").click(function(){
		if($('#box_novo').hasClass("exibir")){
			$("#box_novo").css("height", "130px");
			$("#botoes").hide();
		}		$("#box_historico").removeClass("exibir");
		$("#box_novo").toggleClass("exibir");
		$(".historico").removeClass("historico_ativo");
		$(".historico").css("background-color",corForte);
		$(".novo").toggleClass("novo_ativo");
		if ($('.novo').hasClass('novo_ativo')) {
			$(".novo").css("background-color",corMedia);
		} else {
			$(".novo").css("background-color",corForte);
		}
	});

	$("#cancelar").click(function(){
		$("#box_novo").removeClass("exibir");
		$(".novo").removeClass("novo_ativo");
		$(".novo").css("background-color",corForte);
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
		dataInicio = changeDatePosition(dataInicio, 1, '-');
		dataFim = changeDatePosition(dataFim, 1, '-');
		if (erro == true){
			return false;
		}else {

			$.ajax({
				url: path+"PlanoAula/",
				type: "POST",
				crossDomain: true,
				beforeSend: function(){
					loading("inicial");

				},

				data: "action=create&data_ini="+dataInicio+"&objetivos=&idBlog=&tarefa_casa=&registro_atividade=&data_fim="+dataFim+"&idProfessor="+professorID,
				success: function(d) {
					if (d>0){
					//IdentificadorPlanoEstudo = d;
						$("#box_novo").removeClass('exibir');
						loading("final");
						reSetPlano(d);
						return mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");
					}else{
						loading("final");
						return mensagem("Data do plano de estudo deve ser maior que o último cadastrado!","OK","bt_ok","erro");
					}
				}
			});
		}

	});
	$(".dataPassada").click(function(){
		mensagem("Crie um plano de aula para essa semana! Para isso, clique no botão “novo”.","OK","bt_ok","alerta");
		return false;
	});
	$( "#data_inicio" ).datepicker({
		showOn: "button",
		beforeShow: function () {
			$("#box_novo").css("height", "285px");
			window.setTimeout(estilizarCalendario, 1);
		},
		onChangeMonthYear: function() {
			window.setTimeout(estilizarCalendario, 1);
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
	}).next(".ui-datepicker-trigger").css('background-color',corMedia);

	$( "#data_fim" ).datepicker({
		showOn: "button",
		beforeShow: function () {
			$("#box_novo").css("height", "285px");
			window.setTimeout(estilizarCalendario, 1);
		},
		onChangeMonthYear: function() {
			window.setTimeout(estilizarCalendario, 1);
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
	}).next(".ui-datepicker-trigger").css('background-color',corMedia);






	function recolorCalendar(){
		$(".ui-datepicker-title").css("background-color", corFraca);
		$(".ui-datepicker th").css("background-color", corMedia);
		//$(".ui-corner-all").css("background-color", corForte);
	}






	$(".Conteudo_Coluna").scroll(function(){
		$("#box_novo").removeClass("exibir");
	});
	$(".conteudo_plano").scroll(function(){
		$("#box_novo").removeClass("exibir");
	});
	$(".Plano_Estudo_Content").scroll(function(){
		$("#box_novo").removeClass("exibir");
	});

	loadHistorico();
	returnOficinaProfessor();
});



function listaObjetivos(idPlanoAula){
	$.ajax({
		url: path+"PlanejamentoAula/listarStatus/"+idPlanoAula,
		type: "GET",
		crossDomain: true,
		success: function(d) {

			htmlContent ='<div class="box_roteiros">';
			if (d.length > 0){
				htmlContent +='<div class="Objetivos_Semana_Conteudo_Tarefas_Content">';
				for(var i=0;i< d.length; i++){
					htmlContent += '<div class="Objetivos_Semana_Conteudo_Tarefas">'
							htmlContent += '<div class="Objetivos_Semana_Conteudo_Tarefas_Numero';
					if(d[i].status == 2){
						htmlContent += ' Selected_Tarefas';
					}else if (d[i].status == 1){
						htmlContent += '';
					}else if (d[i].status == 3){
						htmlContent += ' Selected_Tarefas finalizado_estado_Objetivo';
					}
					htmlContent += '"></div>';
						htmlContent += '<div class="Objetivos_Semana_Conteudo_Tarefas_Texto">'+d[i].objetivo+ '</div> </div>';
				}
				htmlContent += '</div>'
			}else{
				htmlContent +='<div class="Objetivos_Semana_Conteudo_Tarefas_Content">Nenhum objetivo planejado!!</div>';
			}
			htmlContent += '</div>'
			$(".Plano_Estudo_Content_Planejamento_Content").html(htmlContent);

			return false;
			}
	});
}

function editar() {

	var DF = $('#dataFim').val();
	var DI = $('#dataInicio').val();

	$.ajax({
		url: path+"PlanoAula/",
		type: "POST",
		crossDomain: true,
		data: "id="+$("#id").val()+"&action=update&data_ini="+DI+"&objetivos="+$('#objetivo').val()+"&idBlog=&tarefa_casa="+$('#tarefaDeCasa').val()+"&registro_atividade="+$("#regAtividade").val()+"&data_fim="+DF+"&idProfessor="+professorID,
		beforeSend:function(){
			loading("inicial");
		},
		success: function(d) {
			loading("final");
			mensagem("Editado com sucesso!","OK","bt_ok","sucesso");
			setTimeout(function(){
				$("#boxMensagemGeral").css("display","none");
			}, 5000);

		}
	});
}

function reSetPlano(ID) {
	$.ajax({
		url: path + "PlanoAula/" + ID,
		type: "GET",
		async:false,
		crossDomain: true,
		success: function(data)
		{
			planoAula = data;
		}
	});

	$("#box_novo").removeClass("exibir");
	$("#box_historico").removeClass("exibir");
	$(".novo").removeClass("novo_ativo");
	$(".novo").css("background-color",corForte);
	$(".historico").removeClass("historico_ativo");

	$('.dadosObjetivos').empty();
	carregarPlano();

}

function loadHistorico(){

	var HtmlConteudo;
	var DataASerSalva = 0;

	$.ajax({
	    type: "GET",
	    crossDomain: true,

	    url: path+"PlanoAula/ProfessorData/" + professorID,
    }).then(function(data) {

	    $('.historicoData').remove();
	    var comprimento = 4;

		for(var a=0; a < data.length; a++){
				HtmlConteudo = "";

				HtmlConteudo+='<p class="historicoData"><a onclick="reSetPlano('+data[a].idplano_aula+');">'+data[a].data_ini.substring(8,10)+'/'+(data[a].data_ini.substring(5,7))+' a '+data[a].data_fim.substring(8,10)+'/'+(data[a].data_fim.substring(5,7))+'</a></p>';
				DataASerSalva = parseInt(data[a].data_ini.substring(5,7));
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
}

function RetornaProfessorPlano()
{
	var retorno;
	if(base64_decode(GetURLParameter('ID')) == undefined)
	{
		$.ajax({
			url: path+"ProfessorFuncionario/"+userID,
			// url: path+"ProfessorFuncionario/98",
			type: "GET",
			async:false,
			crossDomain: true,
			success: function(d) {

				retorno = d.idprofessorFuncionario;
			}
		});
	} else
	{
		retorno = base64_decode(GetURLParameter('ID'));
	}
	return retorno;
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

//----------------------------------------------------------------------------

function returnOficinaProfessor() {
	var dataOficina = JSON.parse(localStorage.getItem("oficinaProfessor"));

	nomeOficina = dataOficina.oficina.tipoOficina.nome;
	corForte 	= dataOficina.oficina.tipoOficina.cor.forte;
	corMedia	= dataOficina.oficina.tipoOficina.cor.medio;
	corFraca	= dataOficina.oficina.tipoOficina.cor.fraco;

	$('.Plano_Estudo_Content_Titulo').css('background-color',dataOficina.oficina.tipoOficina.cor.forte);
	$('.Bg_Imagem_Calendario').css('background-color',dataOficina.oficina.tipoOficina.cor.forte);
	$('.Bg_Imagem_Planejamento').css('background-color',dataOficina.oficina.tipoOficina.cor.forte);
	$('#btnSubmit').css('background-color',dataOficina.oficina.tipoOficina.cor.forte);
	$('.input_data').css('background-color',dataOficina.oficina.tipoOficina.cor.forte);
	$('#data_inicio').css('background-color',dataOficina.oficina.tipoOficina.cor.fraco);
	$('#data_fim').css('background-color',dataOficina.oficina.tipoOficina.cor.fraco);
	$('.Plano_Estudo_Content_Titulo_Categoria_Titulo_Texto1').css('color',dataOficina.oficina.tipoOficina.cor.forte);
	$('.Plano_Estudo_Content_Titulo_Categoria_Titulo_Texto2').css('color',dataOficina.oficina.tipoOficina.cor.forte);
	$('#box_novo').css('border', '1px solid '+dataOficina.oficina.tipoOficina.cor.forte);
	$('#box_historico').css('border', '1px solid '+dataOficina.oficina.tipoOficina.cor.forte);
	$('.titulo').text('Plano de aula | Oficina de ' + dataOficina.oficina.tipoOficina.nome);
	$('.ui-datepicker-trigger').css('background-color',dataOficina.oficina.tipoOficina.cor.medio);
	$('.ui-datepicker-title').css('background-color',dataOficina.oficina.tipoOficina.cor.forte);
	$('.ui-widget-header').css('background-color',dataOficina.oficina.tipoOficina.cor.forte);

}
//----------------------------------------------------------------------------

function trataDatas(data_ini, data_fim){
	dataInicio = data_ini;
	dataFim =  data_fim;
	mesInicio = dataInicio.substr(5,2)
	mesFim = dataFim.substr(5,2)
	diaInicio = dataInicio.substr(8)
	diaFim = dataFim.substr(8)
	anoInicio = dataInicio.substr(0,4)
	anoFim = dataFim.substr(0,4)

	if (mesInicio == mesFim){
		mes = retornaMesByNumero(parseInt(mesFim));
		if (diaInicio != diaFim){
			$("#Periodo_Plano_Estudo").text(diaInicio+' a '+diaFim+' de '+mes+' de '+anoInicio);
		}else{
			$("#Periodo_Plano_Estudo").text(diaInicio+' de '+mes);
		}
	}else{
		mesI = retornaMesByNumero(parseInt(mesInicio));
		mesF = retornaMesByNumero(parseInt(mesFim));
		if (anoInicio == anoFim){
			$("#Periodo_Plano_Estudo").text(diaInicio+' de '+mesI+' a '+diaFim+' de '+mesF+' de '+anoInicio);
		}else{
			$("#Periodo_Plano_Estudo").text(diaInicio+' de '+mesI+' de '+anoInicio+' a '+diaFim+' de '+mesF+' de '+anoFim);
		}
	}
}

function carregarPlano(){

	var dataN = Date.UTC(planoAula[0].data_fim.split("-")[0].toString(), planoAula[0].data_fim.split("-")[1].toString(), planoAula[0].data_fim.split("-")[2].toString());
	if (dataN >= dataAtual) confEditar = true;
	else confEditar = false;

	trataDatas(planoAula[0].data_ini, planoAula[0].data_fim);

	$('#divObjetivos').html("<textarea name='objetivo' id='objetivo' >"+planoAula[0].objetivos+"</textarea>");
	$('#divTarefas').html("<textarea name='tarefaDeCasa' id='tarefaDeCasa' >"+planoAula[0].tarefa_casa+"</textarea>");
	$('#divRegAtividade').html("<textarea name='regAtividade' id='regAtividade' >"+planoAula[0].registro_atividade+"</textarea>");
	if (confEditar == true) {
		$('#roteiros').attr('href','roteirosPlanejamentoAula.html?planoAula='+planoAula[0].idplano_aula);
		$('#roteiros').removeClass('dataPassada');
		$('#btnSubmit').show();
	}else {
		$('#roteiros').attr('href','#');
		$('#roteiros').addClass('dataPassada');
		$('textarea').attr('readonly','true');
		$('#btnSubmit').hide();
	}
	listaObjetivos(planoAula[0].idplano_aula);

	$('#id').val(planoAula[0].idplano_aula);
	$('#dataInicio').val(planoAula[0].data_ini);
	$('#dataFim').val(planoAula[0].data_fim);

}

function estilizarCalendario () {
	$('div#ui-datepicker-div .ui-widget-header').css('background-color', corForte);
	$('div#ui-datepicker-div .ui-datepicker-title').css('background-color', corMedia);
	$('div#ui-datepicker-div .ui-datepicker-calendar > thead > tr > th').css('color', corForte);
	$('div#ui-datepicker-div .ui-datepicker-calendar > thead > tr > th').css('background-color', '#DDD8D8');
	$('div#ui-datepicker-div .ui-datepicker-calendar > thead > tr > th.ui-datepicker-week-end').css('background-color', '#DDD8D8');
	$('div#ui-datepicker-div .ui-datepicker-calendar > thead > tr > th.ui-datepicker-week-end').css('color', corForte);
	$('div#ui-datepicker-div .ui-datepicker-calendar > thead > tr').css('background-color', '#DDD8D8');
	$('div#ui-datepicker-div .ui-datepicker-calendar > tbody > tr > td.ui-datepicker-week-end ').css('background-color', '#DDD8D8');
	$('div#ui-datepicker-div .ui-datepicker-calendar > tbody > tr').css('background-color', corFraca);
	$('div#ui-datepicker-div table.ui-datepicker-calendar').css('margin-bottom', '0');
}