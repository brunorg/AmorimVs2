//Murano Design 


var userID = usuarioId;
var alunoID = getAlunoByUsuario(userID);
//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD
// var dataAlunos 					=	getData("Alunos", null);

if(usuario == "Aluno")
{
	var dataUsuario 				=	getData("Usuario/aluno", alunoID);
	var dataAlunoVariavel 			=	getData("AlunoVariavel/aluno", alunoID);
} else {
	var dataUsuario 				=	0;
	var dataAlunoVariavel 			=	0;
}

var dataObjetivo 				=	getData("Objetivo", null);
var dataAtividade 				=	getData("Atividade", null);

var dataProducaoAluno 			=	getData("ProducaoAluno", null);
var dataPlanejamentoRoteiro 	=	getData("PlanejamentoRoteiro/aluno" , alunoID);  

if(dataPlanejamentoRoteiro.constructor !== Array){

var aux = dataPlanejamentoRoteiro;
dataPlanejamentoRoteiro = new Array(1);
dataPlanejamentoRoteiro[0] = aux;


}


if(dataAlunoVariavel.constructor !== Array){
	
	var aux = dataAlunoVariavel;
	dataAlunoVariavel = new Array(1);
	dataAlunoVariavel[0] = aux;


}

var dataRecursoAprendizagem 	=	getData("RecursoAprendizagem", null);

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado


var alunoVariavelID = getAlunoVariavelByAluno();
var AnoEstudoAno;


var PlanoEstudoSessionID = getData("PlanoEstudo/aluno", alunoID);


if(PlanoEstudoSessionID != 0){
	if(PlanoEstudoSessionID.constructor !== Array){	
		var aux = PlanoEstudoSessionID;
		PlanoEstudoSessionID = new Array(1);
		PlanoEstudoSessionID[0] = aux;
	}
}


if(PlanoEstudoSessionID[0] != undefined){
	PlanoEstudoSessionID = PlanoEstudoSessionID[0].idplanoEstudo;
}

var PortifolioVariavel = 0;
var roteiroAcionado = 0;


//------------------------------------------------------------------------------------------------------------------------

//Carrega variaveis padrao

var IdObjetivo = new Array();
var IdRoteiro = new Array();
var IdsRoteiroPendente = new Array();

//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery

$(document).ready(function(){
	LoadRoteiro();
	VerificaObjetivosCompletos();



	if(PlanoEstudoSessionID == 0 && usuario == "Aluno")
	{
		/*mensagem("Primeiro, precisa criar um Plano de Estudo","OK","bt_ok","erro");
		window.setTimeout(function(){
			window.location = "planoDeEstudo.html";
		},5000);*/

		mensagemF("Primeiro, precisa criar um Plano de Estudo","OK","bt_ok","alerta","redirect();");
	}


	GerarUpload($("#foto"), $("#Arquivo_Foto_Aluno"), $("#Dados_Foto_Aluno"));



	//setTimeout(function() {LoadAtividade();}, 1100);
});


function redirect()
{
	window.location = 'planoDeEstudo.html';
}

//-----------------------------------------------------------------------------------------------------------------------------------------------

function getElementObjetivoId(IDobjetivo)
{

	var Encontrado = false;
    var ConteudoRetornado = "";



    	for(var a=0; a< dataPlanejamentoRoteiro.length; a++)    	{

	    	if(dataPlanejamentoRoteiro[a].objetivo.idobjetivo == IDobjetivo)
	    	{

	    		if(dataPlanejamentoRoteiro[a].status == 0)
				
	    		{
		//			console.log(dataPlanejamentoRoteiro[a].status);
    				ConteudoRetornado="<div class='titulo_infos_roteiro_caixa_branco' </div>";
	    		}

	    		else if(dataPlanejamentoRoteiro[a].status == 1)
	    		{
								//	console.log(dataPlanejamentoRoteiro[a].status);
	    			ConteudoRetornado="<div class='titulo_infos_roteiro_caixa_laranja'>"+dataPlanejamentoRoteiro[a].objetivo.numero+"</div>";
	    		}

	    		else if(dataPlanejamentoRoteiro[a].status == 2)
	    		{
								//	console.log(dataPlanejamentoRoteiro[a].status);
	    			ConteudoRetornado="<div class='titulo_infos_roteiro_caixa_verde'>"+dataPlanejamentoRoteiro[a].objetivo.numero+"</div>";
	    		}

	    		else if(dataPlanejamentoRoteiro[a].status == 3)
	    		{
							//		console.log(dataPlanejamentoRoteiro[a].status);
	    			ConteudoRetornado="<div class='titulo_infos_roteiro_caixa_verde_tk' >"+dataPlanejamentoRoteiro[a].objetivo.numero+"</div>";
	    		}
	    		Encontrado = true;

	    	}

    	}


	if(!Encontrado)
	{
		return "<div class='titulo_infos_roteiro_caixa_branco' ></div>";
	}

	return ConteudoRetornado;

}




//-----------------------------------------------------------------------------------------------------------------------------------------------


function VerificaObjetivosCompletos()
{

	var NaoEncontrado;

	

	for(var a=0; a < $('.roteiro_nome_tabela_selecionado').length; a++)
	{

		NaoEncontrado = false;


		if($(document.getElementsByClassName('roteiro_nome_tabela_selecionado')[a]).find('td').length > 0)
		{
			
			for(var b=1; b < $(document.getElementsByClassName('roteiro_nome_tabela_selecionado')[a]).find('td').length+1; b++)
			{
				if($(document.getElementsByClassName('roteiro_nome_tabela_selecionado')[a]).find('td:nth-child('+b+')').hasClass('td_roteiro_verde') || $(document.getElementsByClassName('roteiro_nome_tabela_selecionado')[a]).find('td:nth-child('+b+')').hasClass('td_roteiro_laranja') || $(document.getElementsByClassName('roteiro_nome_tabela_selecionado')[a]).find('td:nth-child('+b+')').hasClass('td_roteiro_branco'))
				{
					NaoEncontrado = true;
				}
			}
		}

		if(!NaoEncontrado)
		{
			//Roteiro_Id_
			SubstituirObjetivos($(document.getElementsByClassName('roteiro_nome_tabela_selecionado')[a]).find('td').parent());
		}
	}

}


//-----------------------------------------------------------------------------------------------------------------------------------------------


function SubstituirObjetivos(Classe)
{
	var RoteiroID = ($(Classe).closest( ".roteiro_nome_tabela_selecionado" ).attr("id")).substring(11);
	$(Classe).empty();
	$(Classe).attr("Cmpl","true");
  	if($(Classe).closest( ".roteiro_nome_tabela_selecionado" ).attr("id") != undefined)
  	{ 
  		var PortifolioExistenteUpload 	= verificaProducaoExistente(5, RoteiroID);
  		var FichasExistenteUpload 		= verificaProducaoExistente(4, RoteiroID);
  	 
  	 	/*if(PortifolioExistenteUpload == "" && FichasExistenteUpload == "")
  	  	{
  	  		$(Classe).append('<td id="producaoTD" style="color:white;font-style:italic;"><div class="botoesPortfolio"> | Portfólio<div class="icone"></div></div><div class="botoesPortfolio">Ficha de Finalização<div class="icone"></div></div></td>');
  	  	} else if(PortifolioExistenteUpload != "" && FichasExistenteUpload != "") {
				$(Classe).append('<td id="producaoTD">'+PortifolioExistenteUpload+' | '+FichasExistenteUpload+'</td>');
  	  	} else {
  	  		$(Classe).append('<td id="producaoTD">'+PortifolioExistenteUpload+' '+FichasExistenteUpload+'</td>');
  	  	}*/

  	  	HtmlContent = "";
  	  	HtmlContent += ('<td id="producaoTD">');
  	  	if (PortifolioExistenteUpload == "")
  	  	{
  	  		HtmlContent += ('<a style="text-align:right;color:white" onclick="showUpload(1,'+RoteiroID+');" href="#"><div class="botoesPortfolio">Portfólio </div></a>');
  	  	}
  	  	else
  	  	{
  	  		switch (PortifolioExistenteUpload.status)
  	  		{
  	  			case 1:
  	  			{
  	  				HtmlContent += ('<div class="botoesPortfolio">Portfólio<div class="icone entregue"></div></div>');
  	  				break;
  	  			}

  	  			case 2:
  	  			{
  	  				HtmlContent += ('<div class="botoesPortfolio">Portfólio<div class="icone observacao" onclick="responderObservacao('+PortifolioExistenteUpload.mensagens.idmensagens+')"></div></div>');
  	  				break;
  	  			}

  	  			case 3:
  	  			{
  	  				HtmlContent += ('<div class="botoesPortfolio">Portfólio<div class="icone corrigido"></div></div>');
  	  				break;
  	  			}
  	  		}
  	  	}
  	  	var existeFicha;
  	  	$.ajax({
  	  		url: path + "FichaFinalizacao/" + RoteiroID,
  	  		async: false,
  	  		crossDomain: true,
  	  		type: "GET",
  	  		success: function(data){
  	  			existeFicha = data;
  	  		}
  	  	});
  	  	if (FichasExistenteUpload == "" && existeFicha.length > 0)
  	  	{
  	  		HtmlContent += ('<a href="#" style="text-align:right;color:white" onclick="abreCaixaFicha('+RoteiroID+');"><div class="botoesPortfolio">Ficha de Finalização | </div></a>');
  	  	}
  	  	else if (existeFicha.length > 0)
  	  	{
  	  		switch (FichasExistenteUpload.status)
  	  		{
  	  			case 1:
  	  			{
  	  				HtmlContent += ('<div class="botoesPortfolio">Ficha de Finalização | <div class="icone entregue"></div></div>');
  	  				break;
  	  			}

  	  			case 2:
  	  			{
  	  				HtmlContent += ('<div class="botoesPortfolio">Ficha de Finalização | <div class="icone observacao" onclick="responderObservacao('+FichasExistenteUpload.mensagens.idmensagens+')"></div></div>');
  	  				break;
  	  			}

  	  			case 3:
  	  			{
  	  				HtmlContent += ('<div class="botoesPortfolio"> Ficha de Finalização | <div class="icone corrigido"></div></div>');
  	  				break;
  	  			}
  	  		}
  	  	}
  	  	HtmlContent += ("</td>");
  	  	$(Classe).append(HtmlContent);
  	}  
}



//-----------------------------------------------------------------------------------------------------------------------------------------------

function verificaProducaoExistente(tipo, IDRoteiroLocal)
{
	var producao;

	$.ajax({
		url: path + "ProducaoAluno/Filtos/"+ alunoID + "/" + tipo +"/" + IDRoteiroLocal,
		async: false,
		crossDomain: true,
		type: "GET",
		success: function(data){
			producao = data;
		}

	});

	return ((producao.length > 0) ? producao[0] : "" );
}


//-----------------------------------------------------------------------------------------------------------------------------------------------

function abreCaixaFicha(idRoteiro){
	$(".boxGlobal").css("display","block");
	var dataFichaFinalizacao = getData("FichaFinalizacao", idRoteiro);
		
	var html = '<div id="caixaFicha">'+
			'<a href="#" id="fecharCaixa"><img src="img/cancela_x.png" width="15" height="15" onclick="fecharCaixa()";/></a>'+
			'<a class="caixaTxt" id="txt1" target="_blank" href="'+dataFichaFinalizacao[0].local+'">Responder ficha de finalização</a>'+ 
			'<a class="caixaTxt" id="txt2" onclick="showUpload(2,'+idRoteiro+');" href="#">Upload ficha de finalização</a>'+
			'</div>';
	$(".boxGlobal").html(html);
}

function fecharCaixa(){
	$(".boxGlobal").css("display","none");
}

function getAnoLetivo(formato){
	var dataSalvaPortifolio = new Date();
	var anoAtual;
	
	if(formato == "idAnoLetivo"){		
		var dataAnoLetivo = getData("AnoLetivo",null);
		for(var i=0;i<dataAnoLetivo.length;i++){
			var anoLetivo = dataAnoLetivo[i].ano;
			anoLetivo = anoLetivo.split("-");		
			if(anoLetivo[0]==dataSalvaPortifolio.getUTCFullYear()){
				anoAtual = dataAnoLetivo[i].idanoLetivo;
			}
		}	
	}else if(formato == "anoAnoLetivo"){
		anoAtual = dataSalvaPortifolio.getUTCFullYear();
	}
	
	return anoAtual;
}

function LoadRoteiro(){	
	//Traz os roteiros pendentes do aluno
	var HtmlContent;
	var dataRoteiroPendente = getData("PlanejamentoRoteiro/status", alunoID);

	HtmlContent = "";	
	for(var i = 0; i < dataRoteiroPendente.length; i++){

		if ((jQuery.inArray( dataRoteiroPendente[i].objetivo.roteiro.idroteiro, IdsRoteiroPendente )) == -1){

			IdsRoteiroPendente.push(dataRoteiroPendente[i].objetivo.roteiro.idroteiro)

			HtmlContent = "";
			HtmlContent += "<div class='Content_Roteiro_Aluno_"+dataRoteiroPendente[i].objetivo.roteiro.idroteiro+"'>";	
			HtmlContent += "<div id='Roteiro_Id_"+dataRoteiroPendente[i].objetivo.roteiro.idroteiro+"' class='roteiro_nome_tabela_anterior'>"
			HtmlContent += "<div class='roteiro_nome_tabela_texto' onclick='ApareceObj("+dataRoteiroPendente[i].objetivo.roteiro.idroteiro+")'>";
			HtmlContent += dataRoteiroPendente[i].objetivo.roteiro.nome;
			HtmlContent += "</div>";
			HtmlContent += "<div class='tabela_colorida_roteiro'>";
			HtmlContent += "<table>";
			HtmlContent += "<tr class='QuadObj_"+dataRoteiroPendente[i].objetivo.roteiro.idroteiro+"'>";
			HtmlContent += "</tr>";
			HtmlContent += "</table>";
			HtmlContent += "</div>";
			HtmlContent += "</div>";

			$('.total').append(HtmlContent);
	
			HtmlContent = "";
			//Here Objectives
				HtmlContent +=_getObjetivos(dataRoteiroPendente[i].objetivo.roteiro.idroteiro);

			//end
			HtmlContent += "</div>";
			HtmlContent += "<div class='box_rigth box_"+dataRoteiroPendente[i].objetivo.roteiro.idroteiro+"'>";	
			HtmlContent += "<div class='td_titulo_recurso'>Recursos de aprendizagem</div>";
			HtmlContent += "<table class='tb_right'>";
			HtmlContent += getRecursosDeRoteiro(dataRoteiroPendente[i].objetivo.roteiro.idroteiro);
			HtmlContent += "</table>";
			HtmlContent += "</div>" ;
			HtmlContent += "<div style='clear: both;''> </div>"			
		
			$('.total').append(HtmlContent);
		}
	}

	//Fim roteiros pendentes
	
	//Traz os roteiros do ano atual
	var dataRoteiro = getData("Roteiro/RoteiroAno/"+AnoEstudoAno, null);
	
	idRoteiro = new Array();
	for(var a = 0; a < dataRoteiro.length; a++){
		IdRoteiro[a] = dataRoteiro[a].idroteiro;	
		HtmlContent = "";
		HtmlContent += "<div class='Content_Roteiro_Aluno_"+dataRoteiro[a].idroteiro+"' style='background:red'>";	
		HtmlContent += "<div id='Roteiro_Id_"+dataRoteiro[a].idroteiro+"' class='roteiro_nome_tabela_selecionado'>"
		HtmlContent += "<div class='roteiro_nome_tabela_texto' onclick='ApareceObj("+dataRoteiro[a].idroteiro+")'>";
		HtmlContent += dataRoteiro[a].nome;
		HtmlContent += "</div>";
		HtmlContent += "<div class='tabela_colorida_roteiro'>";
		HtmlContent += "<table>";
		HtmlContent += "<tr class='QuadObj_"+dataRoteiro[a].idroteiro+"'>";
		HtmlContent += "</tr>";
		HtmlContent += "</table>";
		HtmlContent += "</div>";
		HtmlContent += "</div>";
		
		$('.total').append(HtmlContent);
		
		HtmlContent = "";
		//Here Objectives
			HtmlContent +=_getObjetivos(dataRoteiro[a].idroteiro);
		//end
		HtmlContent += "</div>";
		HtmlContent += "<div class='box_rigth box_"+dataRoteiro[a].idroteiro+"'>";	
		HtmlContent += "<div class='td_titulo_recurso'>Recursos de aprendizagem</div>";
		HtmlContent += "<table class='tb_right'>";
		HtmlContent += getRecursosDeRoteiro(dataRoteiro[a].idroteiro);
		HtmlContent += "</table>";
		HtmlContent += "</div>" ;
		HtmlContent += "<div style='clear: both;''> </div>"			
		
		$('.total').append(HtmlContent);
	}
	
	//Fim roteiros atuais
	var anoLetivo = getAnoLetivo("anoAnoLetivo");
	
	
	//Traz os roteiros que foram atribuidos a ele
	var dataRoteiroAtribuidos = getData("Roteiro/RoteiroAluno/"+alunoID+"/"+anoLetivo, null);
	
	for(var k = 0; k < dataRoteiroAtribuidos.length; k++){
		IdRoteiro[a] = dataRoteiroAtribuidos[k].roteiro.idroteiro;	
		if ((jQuery.inArray( IdRoteiro[a], IdsRoteiroPendente )) > -1){

			$('.Content_Roteiro_Aluno_'+IdRoteiro[a]).remove();
		}
		
		HtmlContent = "";
		HtmlContent += "<div class='Content_Roteiro_Aluno_"+dataRoteiroAtribuidos[k].roteiro.idroteiro+"'>";	
		HtmlContent += "<div id='Roteiro_Id_"+dataRoteiroAtribuidos[k].idroteiro+"' class='roteiro_nome_tabela_atribuido'>"
		HtmlContent += "<div class='roteiro_nome_tabela_texto' onclick='ApareceObj("+dataRoteiroAtribuidos[k].roteiro.idroteiro+")'>";
		HtmlContent += dataRoteiroAtribuidos[k].roteiro.nome;
		HtmlContent += "</div>";
		HtmlContent += "<div class='tabela_colorida_roteiro'>";
		HtmlContent += "<table>";
		HtmlContent += "<tr class='QuadObj_"+dataRoteiroAtribuidos[k].roteiro.idroteiro+"'>";
		HtmlContent += "</tr>";
		HtmlContent += "</table>";
		HtmlContent += "</div>";
		HtmlContent += "</div>";
		
		$('.total').append(HtmlContent);
	
		HtmlContent = "";
		//Here Objectives
			HtmlContent +=_getObjetivos(dataRoteiroAtribuidos[k].roteiro.idroteiro);
		//end
		HtmlContent += "</div>";
		HtmlContent += "<div class='box_rigth box_"+dataRoteiroAtribuidos[k].roteiro.idroteiro+"'>";	
		HtmlContent += "<div class='td_titulo_recurso'>Recursos de aprendizagem</div>";
		HtmlContent += "<table class='tb_right'>";
		HtmlContent += getRecursosDeRoteiro(dataRoteiroAtribuidos[k].roteiro.idroteiro);
		HtmlContent += "</table>";
		HtmlContent += "</div>" ;
		HtmlContent += "<div style='clear: both;''> </div>"			
		
		$('.total').append(HtmlContent);
	}
	
	//Fim roteiros atribuidos

	htmlPopUpContent = '<div class="blackPainel">'+
							'<div id="JanelaUploadPortifolio">'+
								'<div class="Titulo_janela_upload">'+
									'Upload de Portifolios'+
									'<div class="close_upload_producao">'+
									'</div>'+
								'</div>'+
								'<div id="foto">'+
								'</div>'+
								'<div id="LegendaUpload">Aguardando Arquivo</div>'+
								'<form id="Cadastro_Producao_Aluno">'+
									'<input type="hidden" id="id" name="id" />'+
									'<input type="hidden" id="action" name="action" value="create" />'+
									'<input type="hidden" id="Dados_Foto_Aluno" />'+
									'<input type="file" id="Arquivo_Foto_Aluno" name="arquivo1" />'+
									'<div class="campoConfirmaUpload">'+
										'<input class="btn_submit" onclick="SalvarPortifolio()" type="button" value="" />'+
									'</div>'+
								'</form>'+
							'</div>'+
						'</div>';

	$('.total').append(htmlPopUpContent);

	$("#Arquivo_Foto_Aluno").change(function(e){
		$("#LegendaUpload").html("Arquivo Carregado");
	});

	$('.close_upload_producao').click(function(){
		$('.blackPainel').hide();
		$('#Dados_Foto_Aluno').val('');
		$('#Arquivo_Foto_Aluno').val('');
		$('#foto').css("background-image","url(img/foto.png)");
		$("#LegendaUpload").html("Aguardando Arquivo");
	});
	
	LoadAtividade();
}

//-------------------------------------------------------------------------------------------------------------------------------------

function SalvarPortifolio(){
   	var dataSalvaPortifolio = new Date();	
	var anoLetivo = getAnoLetivo("idAnoLetivo");
	var tamanhoArquivo;
	if(localStorage.getItem("tamanhoArquivo")){
		tamanhoArquivo = localStorage.getItem("tamanhoArquivo");
	}
	if(tamanhoArquivo == "menor"){
		if(Arquivo != "" && Arquivo != undefined) {	
			$.ajax({
				url: path+"ProducaoAluno/",
				type: "POST",
				crossDomain: true,	
				data: "action=create&anoLetivo="+anoLetivo+"&texto="+$('#Roteiro_Id_'+roteiroAcionado+' .roteiro_nome_tabela_texto').html()+"&data="+dataSalvaPortifolio.getUTCFullYear()+"-"+(dataSalvaPortifolio.getUTCMonth()+1)+"-"+dataSalvaPortifolio.getUTCDate()+"&aluno="+getAlunoByUsuario(usuarioId)+"&tipo="+PortifolioVariavel+"&categoria=1&roteiro="+roteiroAcionado,	
				beforeSend: function(){
					loading("inicial");
				}, 
				success: function(d) {
					addFileTo(d, PortifolioVariavel);	
					$('.blackPainel').hide();
				},
				complete: function() {
					loading("final");
				}
			}); 
		} else {
			mensagem("Insira um arquivo!","OK","bt_ok","alerta");
		}
		localStorage.setItem("tamanhoArquivo","");
	}else{
		localStorage.setItem("tamanhoArquivo","");
		mensagem("Tamanho máximo permitido 30Mb!","OK","bt_ok","alerta");	
	}
  	
}

function addFileTo(ID, tipo){
    var formData = new FormData($('#Cadastro_Producao_Aluno')[0]);
    formData.append("arquivo", Arquivo);

    $.ajax({
		url: path+"ProducaoAluno/upload/producaoAluno/arquivo/"+ID,
		type: "POST",
		mimeType:"multipart/form-data",
		contentType: false,
		cache: false,
		processData:false,
		data: formData,
        beforeSend: function() {
            loading("inicial");
        },	 
		success: function(d) {
			$('#Dados_Foto_Aluno').val('');
			$('#Arquivo_Foto_Aluno').val('');
			$('#foto').css("background-image","url(img/foto.png)");
			$("#LegendaUpload").html("Aguardando Arquivo");
			//var producaoExistenteUpload 	= verificaProducaoExistente(tipo, roteiroAcionado);

            //$('.QuadObj_'+roteiroAcionado+' .icone')[(tipo == 5)? 0 : 1].style.background = "url(img/1_entregue.png) no-repeat right";
            $('.QuadObj_'+roteiroAcionado+" .botoesPortfolio")[(tipo == 5)? 0 : 1].innerHTML = ((tipo == 5)? "Portfólio" : "Ficha de Finalização") + "<div class='icone entregue'></div>";
            $('.QuadObj_'+roteiroAcionado+' .icone')[(tipo == 5)? 0 : 1].parentNode.parentNode.onclick = "";
            $('.QuadObj_'+roteiroAcionado+' .icone')[(tipo == 5)? 0 : 1].parentNode.parentNode.style.cursor = "default";
		   
			/*if(PortifolioExistenteUpload == "" && FichasExistenteUpload == ""){
				$('.QuadObj_'+roteiroAcionado+' #producaoTD').html('<font style="color:white;font-style: italic;">Roteiro Completo e Corrigido</font>');
			} else if(PortifolioExistenteUpload != "" && FichasExistenteUpload != "") {
				$('.QuadObj_'+roteiroAcionado+' #producaoTD').html(PortifolioExistenteUpload+' | '+FichasExistenteUpload);
			} else {
				$('.QuadObj_'+roteiroAcionado+' #producaoTD').html(PortifolioExistenteUpload+' '+FichasExistenteUpload);
			}*/
			mensagem("Arquivo enviado com sucesso!","OK","bt_ok","sucesso");			
		},error: function() {
			mensagem("Erro ao enviar arquivo!","OK","bt_ok","erro");
		},
        complete: function(){
            loading("final");
        }

    }); 
}


//-----------------------------------------------------------------------------------------------------------------------------------------------

function showUpload(Numero, ID)
{
	$(".boxGlobal").css("display","none");
	if(Numero == 1)
	{
		$('.blackPainel').css("display","block");
		PortifolioVariavel = 5;

	} else if(Numero == 2)
	{
		$('.blackPainel').css("display","block");
		PortifolioVariavel = 4;
	}

  roteiroAcionado = ID;
}

//-----------------------------------------------------------------------------------------------------------------------------------------------
function LoadAtividade(){

	var Limite;
	var HtmlContent;
	var idativ = 0;


        Limite = dataAtividade.length;
       	HtmlContent = "";

        for(var a = 0; a < Limite; a++)
        {
        	HtmlContent = "";
    		
    		HtmlContent += "<div class='conteudo_do_roteiro ativ_"+dataAtividade[a].idatividade+"'>";
			HtmlContent += "<table class='TbAtiv'>";
		
			HtmlContent += "<tr>";
			HtmlContent += "<td class='td_ativ'>"+dataAtividade[a].descricao;
			
			if(dataAtividade[a].paginaLivro == "")
			{
				HtmlContent += ";</td>"
			}
			else
			{
				HtmlContent += ", p. "+dataAtividade[a].paginaLivro+";</td>";
			}

			HtmlContent += "</tr>";
			HtmlContent += "</table>";
			HtmlContent += "</div>";
			
			if(dataAtividade[a].objetivo!=null){
				$('.Obj_'+dataAtividade[a].objetivo.idobjetivo).append(HtmlContent);
			}
        	
        }

}
		 
//-----------------------------------------------------------------------------------------------------------------------------------------------


function getRecursosDeRoteiro(ID)
{
	var Retorno = "";

	for(var a=0; a< dataRecursoAprendizagem.length; a++)
	{
		// console.log(dataRecursoAprendizagem[a].roteiro.idroteiro, ID, dataRecursoAprendizagem[a].roteiro.idroteiro == ID);
		if(dataRecursoAprendizagem[a].roteiro.idroteiro == ID)
		{

			switch (dataRecursoAprendizagem[a].tipoRecursoAprendizagem.idtipoRecursoAprendizagem)
			{
				case 1:imagem ="ic_livro2_peq.png";break;
				case 2:imagem ="ic_video_peq";break;
				case 3:imagem ="ic_audio_peq";break;
				case 4:imagem ="ic_pgweb_peq";break;
				case 5:imagem ="ic_jogo_peq";break;
				case 6:imagem ="ic_foto_peq";break;
			}	


			Retorno += "<tr>";
      		Retorno += "<td class='titulo_recurso'>";
      		Retorno += "<img src='img/"+imagem+".png' width='15' height='auto' alt='"+dataRecursoAprendizagem[a].descricaoRecurso+"'/><a href='"+dataRecursoAprendizagem[a].link+"'>"+dataRecursoAprendizagem[a].nomeRecurso+"</a>";
      		Retorno += "</td>";
      		Retorno += "</tr>";
		}
	}

	return Retorno;
}


//-----------------------------------------------------------------------------------------------------------------------------------------------


function ApareceObj(IdObjs)
{
	var Limite;
	var antes = 0;
	var depois;

        Limite = dataObjetivo.length;
       	HtmlContent = "";
       	antes = 0;

       	if(!$(".QuadObj_"+IdObjs).attr("Cmpl"))
       	{

	        for(var a = 0; a < Limite; a++)
	        {	
	        	if (IdObjs == dataObjetivo[a].roteiro.idroteiro)
	        	{
	        		
	        		$('.Obj_'+dataObjetivo[a].idobjetivo).toggle();
	        		
	        		if (antes == 0)
	        		{
	        			$('.box_'+IdObjs).toggle();
	       			}

	       			antes = 1;
	        		
	        	}
	        }

       	}
}


function ApareceAtiv(IdAtivs)
{
	var Limite;

        Limite = dataAtividade.length;

        for(var a = 0; a < Limite; a++)
        {
			if( dataAtividade[a].objetivo!=null){
				if (IdAtivs == dataAtividade[a].objetivo.idobjetivo){
					$('.ativ_'+dataAtividade[a].idatividade).toggle();	
				}
			}        	
        }

}

/*MOD*/

function _getObjetivos(Identificador)
{

	var RetornoHtml = "";
	var Cor = "";
	var IDplanejamentoRoteiro; 
	var IDplanoEstudoAtual = getData("PlanoEstudo/aluno", alunoID);
	var contadorLocal = 0;


        for(var a = 0; a < dataObjetivo.length; a++){
        	
        	
        	if (Identificador == dataObjetivo[a].roteiro.idroteiro)
        	{
				    	var Encontrado = false;
					//	console.log(dataPlanejamentoRoteiro.length);
						//	console.log(" dataPlanejamentoRoteiro:" +dataPlanejamentoRoteiro.length +"  /  dataObjetivo " +  dataObjetivo.length);
				    	for(var b=0; b<dataPlanejamentoRoteiro.length; b++)
				    	{
					
				    		// if(dataObjetivo[a].idobjetivo == dataPlanejamentoRoteiro[b].objetivo.idobjetivo && dataPlanejamentoRoteiro[b].planoEstudo.idplanoEstudo == PlanoEstudoSessionID)
					//		console.log(dataObjetivo[a].idobjetivo+ "  --  "+ dataPlanejamentoRoteiro[b].objetivo.idobjetivo);
							if(dataObjetivo[a].idobjetivo == dataPlanejamentoRoteiro[b].objetivo.idobjetivo)
				    		{
				    			if(dataPlanejamentoRoteiro[b].status == "0" ||
				    				dataPlanejamentoRoteiro[b].status == "1" && IDplanoEstudoAtual[0].idplanoEstudo != dataPlanejamentoRoteiro[b].planoEstudo.idplanoEstudo)
				    			{
				    				Cor = "branco";

				    			}else if(dataPlanejamentoRoteiro[b].status == "1" && IDplanoEstudoAtual[0].idplanoEstudo == dataPlanejamentoRoteiro[b].planoEstudo.idplanoEstudo)
				    			{
				    				Cor = "laranja";

				    			} else if(dataPlanejamentoRoteiro[b].status == "2")
				    			{
				    				Cor = "verde";

				    			}  else if(dataPlanejamentoRoteiro[b].status == "3")
				    			{
				    				Cor = "verde_tk";

				    			} 

				    			IDplanejamentoRoteiro = dataPlanejamentoRoteiro[b].idplanejamentoRoteiro;
				    			IDplanoEstudo = dataPlanejamentoRoteiro[b].planoEstudo.idplanoEstudo;

				    			Encontrado = true;
				    		}

				    	}

				    	if(!Encontrado)
				    		{ Cor = "branco";}


        		RetornoHtml +='<div class="ObjLeft Obj_'+dataObjetivo[a].idobjetivo+'">'+
        							'<div class="titulo_infos_roteiro">'+
        								'<div class="td_roteiro_numero_tabela">'+
        									dataObjetivo[a].numero+
        								'</div>'+
	        							'<div class="td_titulo_tabela">'+
	        								'<a onclick="ApareceAtiv('+dataObjetivo[a].idobjetivo+')">'+
	        									dataObjetivo[a].nome+
	        								'</a>'+
	        								'<div class="titulo_infos_roteiro_botoes">'+
	        									'<div id="ObjStatus_'+dataObjetivo[a].idobjetivo+'" class="titulo_infos_roteiro_estrela">'+
	        										'<div class="titulo_infos_roteiro_caixa_'+Cor+'" id="td_objetivo_squr_'+dataObjetivo[a].idobjetivo+'" >'+
	        										//data[a].idobjetivo +
	        										'</div>'+
	        									'</div>'+
	        								'</div>'+
	        							'</div>'+
        							'</div>'+
        						'</div>';	


        		$('.QuadObj_'+dataObjetivo[a].roteiro.idroteiro).append('<td class="td_roteiro_'+Cor+'" id="td_roteiro_squr_'+dataObjetivo[a].idobjetivo+'">'+dataObjetivo[a].numero+'</td>');
        	}
        }

    return RetornoHtml;

}

//------------------------------------------------------------------------------------------------------------------------

//Pegar AlunoVariavel pelo Aluno

function getAlunoVariavelByAluno()
{
	for(var a=0; a<dataAlunoVariavel.length;a++)
	{
		if(usuario == "Aluno")
		{
			if(dataAlunoVariavel[a].aluno.idAluno == alunoID)
			{
				AnoEstudoAno = dataAlunoVariavel[a].anoEstudo.idanoEstudo;
				return dataAlunoVariavel[a].aluno.idAluno;
			}
		} else if(usuario == "Professor"){
			/*if(dataAlunos[a].idusuario == alunoID)
			{*/
				return 0;
			//}
		}
	}
}

function reSetObjetivo(IDObjetivo)
{
	var IDRoteiro = (($('#td_roteiro_squr_'+IDObjetivo).parent().attr("class")).substring(8));
	var IDplanejRoteiro;

	$.ajax({
    type: "GET",
    async: false,
	crossDomain: true,
	url: path+"PlanejamentoRoteiro/aluno/" + alunoID			        
    }).then(function(data) {

    	for(var a=0; a< data.length; a++)
    	{
    		if(data[a].objetivo.idobjetivo == IDObjetivo)
    		{

    			IDplanejRoteiro = data[a].idplanejamentoRoteiro;


    		}
    	}

    });
}

function responderObservacao (idMensagem) {
    localStorage.setItem("respostaObservacao", idMensagem);
    window.location.href = "mensagens.html";
}