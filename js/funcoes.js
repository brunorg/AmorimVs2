var scrollBarMensagem;
var dataAlunoVariavel;
var dataUsuario;
var Arquivo;
var saveChamada;
var saveObjetivo;
var contAlunos = 1;
var acabouDeCarregar = false;

var toType = function(obj){
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// JavaScript Document	
$(document).ready(function(){	

	ativaMenu();


	
	$(function(){
		if($("#frm_Envia_Mensagens select").length > 0)
		{
			 formselect = $("#frm_Envia_Mensagens select").css("width","350px");
			 formselect = $("#frm_Envia_Mensagens select").multiselect().multiselectfilter();
			 
		}
	});
	
	$('#trocarOficina').click(function(){
		$(this).toggleClass('down');
		$('#box_oficinas').toggleClass('exibe');
	});
	
	$(".scroll_receiver").mCustomScrollbar({
		axis: "y",
		scrollButtons:{
			enable:true
		}
	});

	$("#btn_fechar_evento").click(function(){
		$("#Evento").hide();
	});	
	
	$("#btn_cancela").click(function(){
		$("#presenca_prof").hide();
	});
	
	$(".ui-state-highlight").attr('id','diaCorrido');
	
	$("#calendario_relatorio .ui-state-highlight").attr('id','diaCorridoRelatorio');
	
	$('#presenca_prof').load("presenca_professor.html");
	
	//Se usuário logado for um aluno e o mesmo for um lider ele abre botão de marcar presença do grupo
	if((typeof dadosUser != 'undefined') && (dadosUser.grupo != null))
	{
		if(dadosUser.grupo.lider != null){
			if(dadosUser.grupo.lider.idAluno == dadosUsuario.aluno.idAluno){
				$("#rodape_calendario").css("display","block");
				$("#rodape_calendario p").show();
			}	
		}						
	}	
	
	//Abre uma caixa se o perfil for aluno e uma página se for professor, porém as duas para marcar presença
	$("#apontar").click(function(){
		if (dadosUsuario.perfil.perfil == "Aluno"){
			$("#boxMensagemGeral").html("");
			$("#boxMensagemGeral").load("presencaAluno.html").show();
		}else if (dadosUsuario.perfil.perfil == "Professor"){
			window.location.href = "presencaGrupos.html";
		}			
	});			
	
	//Inclui o calendário nas páginas HTML
	$( ".boxCalendarioProfessor" ).load( "presencaProfessor.html" );
	
	$("#content_central").mCustomScrollbar({
		axis:"y",
		scrollButtons:{
			enable:true
		}
	});	
	
	var valor=0;
	$("#box_cadastro").mCustomScrollbar({
		axis:"y", // vertical and horizontal scrollbar
		scrollButtons:{
			enable:true
		},
		callbacks:{
			alwaysTriggerOffsets: false,
		    onTotalScrollOffset: 500,
		    whileScrolling: function() {
		    	if (this.mcs.topPct > 95 && 
		    		$('.abas_ativa')[0].id == 'abaPesquisa' && 
		    		$('#perfil').val() == 1 &&
		    		!acabouDeCarregar)
		    	{
		    		$.ajax({
						url: path + "Alunos/html/" + 20*contAlunos + "/" + 19,
						type: "GET",
						async: false,
						crossDomain: true,
						dataType: 'html',
						success: function (data) {
							if (data == '')
								acabouDeCarregar = true;
							else
								$('#lista').append(data);
						},
						error: function (data) {
							console.log("ERRO");
						}
		
					});
					contAlunos++;
		    	}
		    },
		    onTotalScroll:function(){
		    	if ($('.abas_ativa')[0].id == 'abaPesquisa' && 
		    		$('#perfil').val() == 1 &&
		    		!acabouDeCarregar)
		    	{
		    		$.ajax({
						url: path + "Alunos/html/" + 20*contAlunos + "/" + 19,
						type: "GET",
						async: false,
						crossDomain: true,
						dataType: 'html',
						success: function (data) {
							if (data == '')
								acabouDeCarregar = true;
							else
								$('#lista').append(data);
						},
						error: function (data) {
							console.log("ERRO");
						}
		
					});
					contAlunos++;
		    	}
		    }
		}
	});

	$("#blocoGeral").mCustomScrollbar({
		axis:"y", // vertical and horizontal scrollbar
		scrollButtons:{
			enable:true
		}
	});		
	
	$("#content_central_1").mCustomScrollbar({
		axis:"y", // vertical and horizontal scrollbar
		scrollButtons:{
			enable:true
		}
	});	
	
	$("#presenca_opcao_box").mCustomScrollbar({
		axis:"y", // vertical and horizontal scrollbar
		scrollButtons:{
			enable:true
		}
	});	

	$("#box_barra").mCustomScrollbar({
		axis:"y", // vertical and horizontal scrollbar
		scrollButtons:{
			enable:true
		}
	});
	
	$("#listagemAtribuirRoteiroExtra").mCustomScrollbar({
		axis:"y", // vertical and horizontal scrollbar
	});	
	
	$("#box_barra1").mCustomScrollbar({
		axis:"y", // vertical and horizontal scrollbar
		scrollButtons:{
			enable:true
		}
	});	
	$("#box_barra2").mCustomScrollbar({
		axis:"y", // vertical and horizontal scrollbar
		scrollButtons:{
			enable:true
		}
	});			
	
	$("#box_geral_observacao").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar
	});	
	
	$("#boxResultado").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar
	});

	$("#Container_Conteudo_Content_Central").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar
	});
	
	$("#boxBarra").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar
	});
	
	$("#boxBarraRec").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar
	});

	$("#barra_aluno").mCustomScrollbar({
		axis:"y",
		scrollButtons: {
			enable: true
		}
	});
	
	$(".boxROA").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar
	});
	
	$(".boxObj").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar
	});
	
	$(".boxAtv").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar
	});	
	
	$(".boxAgenda").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar
	});
		
	$("#boxCaixa").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar
	});
	
	$("#boxResp").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar
	});	

	$(".Light_Mural_Conteudo").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar
	});

	$(".Light_Forum_Conteudo").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar
	});

	$("#content_central_fixa").mCustomScrollbar({
	  	axis:"y",
		scrollButtons:{
			enable:true
		}
	 });

	
	$("#portifolio_aluno_content").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar
	});
	
	$("#box_agenda").mCustomScrollbar({
		axis:"y",
		scrollButtons:{
			enable:true
		}
	});
	
	$("#boxMensagem").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar	
	});	
	
	$("#conteudo_principal_roteiro").mCustomScrollbar({
		axis: "y",
		scrollButtons:{
			enable:true
		}
	})

	$("#boxRoteiros").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar	
	});	
	
	$("#Area_Alunos_Container").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar	
	});	
		
	$("#menu_lateral_atividade").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar
	});	
	
	$("#Mural_Conteudo").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar
	});
	$(".Oficinas_Conteudo").mCustomScrollbar({
		axis:"y" // vertical scrollbar
	})
	$("#PlanoEstudo_Conteudo").mCustomScrollbar({
		axis:"y" // vertical scrollbar
	})
	$(".Light_Eventos_Conteudo").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar
	});

	$('#menu_lateral_portfolio').mCustomScrollbar({
		axis:"y"
	});
	
	$("#box_grupo_info_barra").mCustomScrollbar({
		axis:"y" // vertical and horizontal scrollbar
	});

	$(".cx_tema_1").mCustomScrollbar({
		axis: "y",
		scrollButtons:{
			enable:true
		}
	})
	$("#Blog_Oficina").mCustomScrollbar({
		axis: "y",
		scrollButtons:{
			enable:true
		}
	})

	$(".hangAlunos").mCustomScrollbar({
		axis:"x" // vertical and horizontal scrollbar
	});	
	
	$(".Grade_Aluno_Grafico").mCustomScrollbar({
		axis:"x",
		mouseWheel:{ enable: false } // vertical and horizontal scrollbar
	});
		
	$("#btn_fechar").click(function(){
		$(".tela_over").hide();	
	});

	//$.ajax({url: "http://plataformaamorim.org:8090/plataformaAmorim/AmorimVS2015/js/falme.js",dataType: "script"});
	//$.getScript( "http://plataformaamorim.org:8090/plataformaAmorim/AmorimVS2015/js/falme.js", function() {});
	
	$('#rodape_calendario').before('<a href="index.html?ref=calendario" id="linkParaAgenda" target="_blank">VER AGENDA COMPLETA</a>')

});	

function myFunction() {
  	document.getElementById('roteiro_nome_tabela_selecionado').style.cssText = 'background-color: red; color: white; font-size: 44px';
}

function CarregaServicoMural()
{
	HtmlContent = "";
	for(var a=0; a< dataCalendarioEventos.length; a++)
	{
		if(dataCalendarioEventos[a].dataInicio != null && dataCalendarioEventos[a].tipoEvento != null)
        {
			if(dataCalendarioEventos[a].tipoEvento.tipoEvento == "Mural")
			{
				HtmlContent+='<tr>'+
								'<td class="dataMsg" onclick="window.location=\'#\';" style="background-color:rgb(247, 242, 222); line-height: 13px;">'+
									'<h2 style="color:rgb(218,93,48); margin-top:0px;">'+dataCalendarioEventos[a].evento+'</h2>'+
									'<h3 style="margin-bottom:0px;font-weight: 100;">'+dataCalendarioEventos[a].descricao+'</h3>'+
								'</td>'+
							'</tr>';
			}
        }
	}

	$('#Light_MuralTabela').html(HtmlContent);
}

function OrdenarPorNome(TagPai, TagParaOrdenar)
{
	$(TagPai).append($(TagParaOrdenar).remove().sort(function(a, b) {
	    var at = $(a).text(), bt = $(b).text();
	    return (at > bt)?1:((at < bt)?-1:0);
	}));
}

function dataSistema(){
	var data = new Date();		
	var diaCorrido = data.getFullYear()+"-"+(data.getMonth()+1)+"-"+data.getDate()
	return diaCorrido;
}

function getUrlVars()
{
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

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

/* Codificador/Decodificador Base64 */

/*Codificador*/
function base64_encode(data) {
	//  discuss at: http://phpjs.org/functions/base64_encode/
	// original by: Tyler Akins (http://rumkin.com)
	// improved by: Bayron Guevara
	// improved by: Thunder.m
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Rafał Kukawski (http://kukawski.pl)
	// bugfixed by: Pellentesque Malesuada
	//   example 1: base64_encode('Kevin van Zonneveld');
	//   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
	//   example 2: base64_encode('a');
	//   returns 2: 'YQ=='
	
	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	var o1;
	var o2;
	var o3;
	var h1;
	var h2;
	var h3;
	var h4;
	var bits;
	var i = 0;
	var ac = 0;
	var enc = '';
	var tmp_arr = [];
	
	if (!data) {
	return data;
	}
	
	do { // pack three octets into four hexets
	o1 = data.charCodeAt(i++);
	o2 = data.charCodeAt(i++);
	o3 = data.charCodeAt(i++);
	
	bits = o1 << 16 | o2 << 8 | o3;
	
	h1 = bits >> 18 & 0x3f;
	h2 = bits >> 12 & 0x3f;
	h3 = bits >> 6 & 0x3f;
	h4 = bits & 0x3f;
	
	// use hexets to index into b64, and append result to encoded string
	tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	} while (i < data.length);
	
	enc = tmp_arr.join('');
	
	var r = data.length % 3;
	
	return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}


/*Decodificador*/
function base64_decode(data) {
	//  discuss at: http://phpjs.org/functions/base64_decode/
	// original by: Tyler Akins (http://rumkin.com)
	// improved by: Thunder.m
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	//    input by: Aman Gupta
	//    input by: Brett Zamir (http://brett-zamir.me)
	// bugfixed by: Onno Marsman
	// bugfixed by: Pellentesque Malesuada
	// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	//   example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
	//   returns 1: 'Kevin van Zonneveld'
	//   example 2: base64_decode('YQ===');
	//   returns 2: 'a'
	
	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
	ac = 0,
	dec = '',
	tmp_arr = [];
	
	if (!data) {
	return data;
	}
	
	data += '';
	
	do { // unpack four hexets into three octets using index points in b64
	h1 = b64.indexOf(data.charAt(i++));
	h2 = b64.indexOf(data.charAt(i++));
	h3 = b64.indexOf(data.charAt(i++));
	h4 = b64.indexOf(data.charAt(i++));
	
	bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
	
	o1 = bits >> 16 & 0xff;
	o2 = bits >> 8 & 0xff;
	o3 = bits & 0xff;
	
	if (h3 == 64) {
	  tmp_arr[ac++] = String.fromCharCode(o1);
	} else if (h4 == 64) {
	  tmp_arr[ac++] = String.fromCharCode(o1, o2);
	} else {
	  tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
	}
	} while (i < data.length);
	
	dec = tmp_arr.join('');
	
	return dec.replace(/\0+$/, '');
}

/*Function que cria mensagens 	
	*Parâmetros da função
 	texto = Texto que será exibido na mensagem EX: 'Cadastrado com sucesso!'
	tipo_btn = Tipo do botão se vai ser EX: 'OK','CANCEL'
	class_btn = Estilo do botão 
	tipo_msg = Tipo da mensagem que será exibida e icone EX: 'sucesso','erro' 
 */

function centralizarModal(){
	var alturaBox = parseInt($('.box_mensagem').height());
	var marginTopBox = Math.floor(-alturaBox/2).toString() + 'px';

	$('.box_mensagem').css('margin-top', marginTopBox);

	var alturaModal;
	var marginTopModal;

	$('.modal').each(function(){
		alturaModal = $(this).height();
		marginTopModal = Math.floor(-alturaModal/2).toString() + 'px';

		$(this).css('margin-top', marginTopModal);
	});
}

function mensagem(texto,tipo_btn,class_btn,tipo_msg,servico,id,funcao){
	if(tipo_msg=="sucesso" || tipo_msg=="erro" || tipo_msg=="alerta")
	{
		var HtmlContent = '<div class="box_mensagem">'+
								'<div class="txt_mensagem">'+
									'<span id="'+tipo_msg+'"></span>'+texto
								+'</div>'+
								'<div class="btn_mensagem_1">'+
									'<input type="button" class="bt_ok left" value="'+tipo_btn+'" />'+
								'</div>'+
							'</div>';

		$( "#boxMensagemGeral" ).html(HtmlContent).show();
		centralizarModal();

		window.setTimeout(function(){
			botoes(tipo_btn,class_btn);
		}, 1000);
	
		//Verifica se o texto é o da mensagem enviada!! 
		//Se for cria um evento para o botão OK
		
	}else if(tipo_msg=="confirm")
	{
		var HtmlContent = '<div class="box_mensagem">'+
								'<div class="txt_mensagem">'+
									'<span id="'+tipo_msg+'"></span>'+texto
								+'</div>'+
								'<div class="btn_mensagem">'+
									'<input type="button" class="bt_ok left" value="OK" onclick="'+funcao+'(\''+servico+'\',\''+id+'\')"/>'+
									'<input type="button" class="bt_cancelar left" value="Cancelar" onclick="closeModal()"/>'+
								'</div>'+
							'</div>';

		$( "#boxMensagemGeral" ).html(HtmlContent).show();
		centralizarModal();

		window.setTimeout(function(){
			botoes(tipo_btn,class_btn);
		}, 1000);
	}
	//Chama uma função diferente para cada opção possível do usuário
	//Ambas as funções devem ter os mesmos argumentos
	else if(tipo_msg=="opcao")
	{
		var HtmlContent = '<div class="box_mensagem">'+
								'<div class="txt_mensagem">'+
									'<span id="'+tipo_msg+'"></span>'+texto
								+'</div>'+
								'<div class="btn_mensagem">'+
									'<input type="button" class="bt_ok left" value="'+tipo_btn+'" onclick="'+funcao[0]+'(\''+servico+'\',\''+id+'\')"/>'+
									'<input type="button" class="bt_cancelar left" value="Excluir" onclick="'+funcao[1]+'(\''+servico+'\',\''+id+'\')"/>'+
								'</div>'+
							'</div>';

		$( "#boxMensagemGeral" ).html(HtmlContent).show();
		centralizarModal();

		window.setTimeout(function(){
			botoes(tipo_btn,class_btn);
		}, 1000);
	}	
}
function closeModal() {
	$("#boxMensagemGeral").hide();
}
function mensagemF(texto,tipo_btn,class_btn,tipo_msg,funcao){	
	if(tipo_msg=="sucesso" || tipo_msg=="erro" || tipo_msg=="alerta")
	{
		var HtmlContent = '<div class="box_mensagem">'+
								'<div class="txt_mensagem">'+
									'<span id="'+tipo_msg+'"></span>'+texto
								+'</div>'+
								'<div class="btn_mensagem_1">'+
									'<input type="button" class="bt_ok left" value="'+tipo_btn+'" onclick="'+funcao+'" />'+
								'</div>'+
							'</div>';

		$( "#boxMensagemGeral" ).html(HtmlContent).show();

		window.setTimeout(function(){
			botoes(tipo_btn,class_btn);
		}, 1000);					
	
	}else if(tipo_msg=="confirm")
	{
		var HtmlContent = '<div class="box_mensagem">'+
								'<div class="txt_mensagem">'+
									'<span id="'+tipo_msg+'"></span>'+texto
								+'</div>'+
								'<div class="btn_mensagem">'+
									'<input type="button" class="bt_ok left" value="OK" onclick="'+funcao+'"/>'+
									'<input type="button" class="bt_cancelar left" value="Cancelar" />'+
								'</div>'+
							'</div>';

		$( "#boxMensagemGeral" ).html(HtmlContent).show();

		window.setTimeout(function(){
			botoes(tipo_btn,class_btn);
		}, 1000);
	}	
}

function botoes(tipo_btn,class_btn){

	switch (tipo_btn){
		case "OK":
			$("."+class_btn).click(function(){
				$( "#boxMensagemGeral" ).hide();
			});	
		break;
		
		case "Cancelar":
			$("."+class_btn).click(function(){
				$( "#boxMensagemGeral" ).hide();
			});	
		break;	
	}	
}
/*Fim function mensagem*/


/*Funçoes que manipula as combo-box de estado e cidade*/
function listarEstadoCidade(id){
	var estados= new Array();
	var HtmlContentEstados;
	$.ajax({
		type: "GET",
		async:false,
		crossDomain: true,		
		url: "js/estados&cidades.json"			
		}).then(function(data) {
			for(var f=0;f<data['estados'].length; f++)
			{
				HtmlContentEstados += "<option value='"+data['estados'][f].sigla+"'>"+data['estados'][f].nome+"</option>";
			}
		});
	$("#"+id).html("<option></option>"+HtmlContentEstados);;
}

function selectCidade(idEstado,idCidade){
	var HtmlContentCidades;
	var estado = $("#"+idEstado).val();
	var cidades	
	$.ajax({
		type: "GET",
		async:false,
		crossDomain: true,		
		url: "js/estados&cidades.json"			
		}).then(function(data) { 			
			for(var h=0;h<data['estados'].length; h++)
			{										 
				if(data['estados'][h].sigla == estado){									
					cidades = data['estados'][h].cidades;
					for(var k=0;k<cidades.length; k++)
					{
						HtmlContentCidades += "<option value='"+cidades[k]+"'>"+cidades[k]+"</option>";
					}
				}			
			}		
		});
	$("#"+idCidade).html(HtmlContentCidades);	
}
/*Fim funções estado e cidade*/

function getAVariavelByAluno(ID){
	var ValorRetorno;

	if(ID == undefined)
	{
		dataAlunoVariavel =getData("AlunoVariavel", null);
		AnoEstudoID = dataAlunoVariavel.anoEstudo.idanoEstudo;
    	ValorRetorno = dataAlunoVariavel;
	} else {		
		dataAlunoVariavel =getData("AlunoVariavel/aluno", alunoID);
		AnoEstudoID = dataAlunoVariavel.anoEstudo.idanoEstudo;
    	ValorRetorno = dataAlunoVariavel.idalunoVariavel;
	}

 //   dataAlunoVariavel = getData("AlunoVariavel", null);    
    return ValorRetorno;
}

// function getAlunoByUsuario(ID)
// {

	// if(ID == undefined)
	// {
		// dataUsuario = getData("Usuario", null);
		
		// return dataUsuario;
	// } else {

		// dataUsuario = getData("Usuario/aluno", ID);

		// return dataUsuario.aluno.idAluno;
	// }
	
function getAlunoByUsuario(ID){
var objUsuario = getData("Usuario", ID);

		if(usuario == "Aluno" && objUsuario.aluno != null)
		{
				
				return objUsuario.aluno.idAluno;
			
		} else if(usuario == "Professor" && objUsuario.professor != null){

				return objUsuario.professor.idprofessorFuncionario;
			
		}
	
}

function presencaAluno(IDaluno){

	var counter =0;

	if(saveChamada == null || saveChamada == undefined)
	{
		$.ajax({
			url: path+"Chamada/faltas/"+IDaluno,
			type: "GET",
			async:false,
			crossDomain: true,
			success: function(saveChamada)
			{
				counter = saveChamada;
			}
		});
	}	
	return counter;
}


//Não sei se funciona
function temPendenciaProf(IDaluno){

objetivos =[];

$.ajax({
    type: "GET",
    crossDomain: true,
    url: path+"Objetivo"
        
    }).then(function(data) {
    	objetivos = data;
});


	for(var i = 0; i < objetivos.length; i++){
		if (objetivos[i].aluno.idAluno == IDaluno && objetivos.status==2){
			return 1;
			
		}

	}

	return 0;
}

var erro;
function GerarUpload(DivImagem, InputFile, SaveDadosFile){
	/* Inicio */

	/* Ao clicar na imagem, abre uma janela pra fazer upload direto da escolha de seus arquivos */
	
	
	$( DivImagem ).click(function() {

        $(InputFile).trigger("click");

    });

    /*Quando houver mudanças no Input File*/

     $(InputFile).change(function(e){
		if ( this.files && this.files[0] ) 
		{
			if(this.files[0].size > 31457280){
				localStorage.setItem("tamanhoArquivo",this.files[0].size);
			}else{			
			 	localStorage.setItem("tamanhoArquivo","menor");
				var FR= new FileReader();
				FR.onload = function(e) {
					
					//$('#img').attr( "src", e.target.result );
					$(DivImagem).css("background-position","center");
					$(DivImagem).css("background-image","url("+e.target.result+")");
					$(SaveDadosFile).val(e.target.result);
	
				};       
	
					//console.log(this.files[0].type);
					Arquivo = this.files[0];
	
	
				if(this.files[0].type.match('image.*')){
					FR.readAsDataURL( this.files[0] );
				} else {
	
					if($(SaveDadosFile).val() != "" && $(SaveDadosFile).val() != undefined)
					{
	
						$(DivImagem).css("background-position","center");
						$(DivImagem).css("background-image","url("+$(SaveDadosFile).val()+")");
	
					} else {
						$(DivImagem).css("background-image","url(img/foto.png)");
							if(this.files[0].type+"" == "application/pdf")
							{
								$(DivImagem).css("background-image","url('img/logo-pdf.png')");
							}
					}
	
				}
	
			}
			return true;
		}	
    });

     /* Ao passar por cima, aparecer a imagem de "permite upload "*/

	$(DivImagem).on(
        'dragover',
        function(e) {
            e.preventDefault();
            e.stopPropagation();

            $(DivImagem).css("background-image","url(img/fotoAtivo.png)");
        }
    )

     /* Ao passar por fora, aparecer a imagem de "Não upload "*/

    $(DivImagem).on(
        'dragleave',
        function(e) {
            e.preventDefault();
            e.stopPropagation();

            if($(SaveDadosFile).val() != "" && $(SaveDadosFile).val() != undefined){

                //$('#foto').css("background-size","auto 100%");
                $(DivImagem).css("background-position","center");
                $(DivImagem).css("background-image","url("+$(SaveDadosFile).val()+")");
            } else {
                $(DivImagem).css("border","none");
                $(DivImagem).css("background-image","url(img/foto.png)");
            }
        }
    )

    $(DivImagem).on(
        'dragenter',
        function(e) {
            e.preventDefault();
            e.stopPropagation();
        }
    )

     $(DivImagem).on(
        'drop',
        function(e){
            if(e.originalEvent.dataTransfer){
                if(e.originalEvent.dataTransfer.files.length) {
                    e.preventDefault();
                    e.stopPropagation();

                  
                    var reader = new FileReader();

                    reader.onload = function(e) {
                    
                    //$('#foto').css("background-size","auto 100%");
                    $(DivImagem).css("background-position","center");
                    $(DivImagem).css("background-image","url("+reader.result+")");
                    $(SaveDadosFile).val(reader.result);
                    //console.log(reader.result);

                    }

                    //console.log(e.originalEvent.dataTransfer.files[0]);
                    Arquivo = e.originalEvent.dataTransfer.files[0];

                    if(e.originalEvent.dataTransfer.files[0].type.match('image.*')){
                        reader.readAsDataURL(e.originalEvent.dataTransfer.files[0]);
                        		
                    } else {

                        if($(SaveDadosFile).val() != "" && $(SaveDadosFile).val() != undefined){

                            $(DivImagem).css("background-position","center");
                            $(DivImagem).css("background-image","url("+$(SaveDadosFile).val()+")");
                        } else {
                            $(DivImagem).css("background-image","url(img/foto.png)");

                            if(e.originalEvent.dataTransfer.files[0].type+"" == "application/pdf")
	                    	{
	                    		$(DivImagem).css("background-image","url('img/logo-pdf.png')");
	                    	}

                        }

                    }
                }   
            }
        }
    );
	/* Fim */
}

function idade(ano_aniversario, mes_aniversario, dia_aniversario) {
    var d = new Date,
        ano_atual = d.getFullYear(),
        mes_atual = d.getMonth() + 1,
        dia_atual = d.getDate(),

        ano_aniversario = +ano_aniversario,
        mes_aniversario = +mes_aniversario,
        dia_aniversario = +dia_aniversario,

        quantos_anos = ano_atual - ano_aniversario;

    if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
        quantos_anos--;
    }

    return quantos_anos < 0 ? 0 : quantos_anos;
}

function chamaFormSenha(){
	$( "#boxMensagemGeral" ).css("display","block");
	$( "#boxMensagemGeral" ).load("AlterPass.html");
}

function atualizarCadastroModal(perfil){		 
	$(".box_margin_alter").css("display","block");

	if (perfil == 'aluno')
		$(".box_margin_alter").load("alterarCadastroAluno.html");
	else 
		$(".box_margin_alter").load("alterarCadastroProfessor.html");
			//Coordenador tem o mesmo procedimento do professor!!
			//secretaria altera de maneira diferente!!
	
	window.setTimeout(function(){
		$("#fecharAlter").css("display","block");
	}, 500);	
}

function fechaFormAtualizar(){
	$(".box_margin_alter").css("display","none");
}

function cancelaAlter(){
	$( "#boxMensagemGeral").css("display","none");
}

function diasEntre( data1, data2 ) {
  //Get 1 day in milliseconds
  var diaEmMilisegundos=1000*60*60*24;

  // Convert both dates to milliseconds
  var data1milisegundos = data1.getTime();
  var data2milisegundos = data2.getTime();

  // Calculate the difference in milliseconds
  var diferencamilisegundos = data2milisegundos - data1milisegundos;
    
  // Convert back to days and return
  return Math.round(diferencamilisegundos/diaEmMilisegundos); 
}


// function alterarSenha(){
	
// 	var user = $("#user").val();
// 	var senhaAtu = $("#senhaAtu").val();
// 	var senha = $("#senha").val();
	
// 	//console.log(email);
// 	var retorno;
// 	var valores =  "user="+user+"&senhaAtu="+senhaAtu+"&senha="+senha;
	
// 	retorno = getData("Logar/alterarSenha",valores);
	
// 	if(retorno != "erro"){
// 		return mensagem("Senha alterada com sucesso!","OK","bt_ok","sucesso");
// 	}else{
// 		//return console.log('erro');
// 	}
// }

/**
 * Modifica a posição do numero das datas caso seja cadastro em formato DD/MM/YYYY ou YYYY/MM/DD
 * tipo 1 : DD/MM/YYYY => YYYY/MM/DD
 * tipo 2 : YYYY/MM/DD => DD/MM/YYYY
 @return {[type]} [description]

 * @param  {string} Data      Data a ser inserida e modificada
 * @param  {Int} Numero    Tipo da modificação da Data inserida
 * @param  {String} Separador Tipo de separador dos numeros, traço ou barra (/ ou -)
 * @return {String}           Retorna a data modificada
 */
function changeDatePosition(Data, Numero, Separador){
	switch(Numero)
	{
		case 1:
			return (Data.substr(6,4)+Separador+Data.substr(3,2)+Separador+Data.substr(0,2));
		break;

		case 2:
			return (Data.substr(8,2)+Separador+Data.substr(5,2)+Separador+Data.substr(0,4));
		break;
	}
}


function carregaAgenda(anoAtual, mesAtual, direcao){
	//console.log("Ano: "+ano+"/r/nMes: "+(mesAtual)+"/r/nDireção: "+direcao);
	mesAtual = mesAtual + 1;

	if (direcao == 'prev'){
		if (mesAtual == '1'){
			mesAtual = 12;
		}else {
			mesAtual = mesAtual-1;
		}
	}
	
	if (direcao == 'next'){
		if (mesAtual == '12'){
			mesAtual = 1;
		}else {
			mesAtual = mesAtual + 1;
		}
	}
	
	var nomeMes = retornaMesByNumero(mesAtual);
	
	$.ajax({
        url: 'http://plataformaamorim.org/WebServicePlataformaAmorimTeste/Calendario',
        dataType: 'json',
        async: false,
        success: function(data){
			dataAtual = new Date();

			var html = '';
			var cont = 0;

			if($(".Conteudo_Coluna").hasClass("meio") == true){
				html += '<h3>Eventos de '+nomeMes+' de '+anoAtual+'</h3>';
				
				$.each(data, function(n, val){
					if(val.dataInicio!=null){
						dataEvento = val.dataInicio.split('-');
					}
					
					var ano = dataEvento[0];
					var mes = parseInt(dataEvento[1]);
					var dia = dataEvento[2];
					var d = new Date();					
					
					if(ano+""+mes+""+dia >= d.getFullYear()+""+(d.getMonth()+1)+""+(d.getDate().toString().length<2 ? "0"+d.getDate():d.getDate())){					
	
						if ((ano == anoAtual && mes == mesAtual)&&(val.tipoEvento.idtipoEvento == 45 || val.tipoEvento.idtipoEvento == 46)){
							if (cont%2 == 0) cor = 'style="background-color:rgb(221, 216, 216)"';
								else cor = 'style="background-color:rgb(236, 235, 229)"';
							cont++;

							html += '<div class="diaAgenda">'+dia+'</div><div class="nomeEvento" '+cor+'>'+val.evento+'</div>';

						}
					}
				});
				$('#Evento').hide();
				$('.meio').html(html);
			}
		}
	});
	return false;
}

function retornaMesByNumero(numMes){
	switch (numMes) {
		case 1:
			return 'Janeiro';
			break;
		case 2:
			return 'Fevereiro';
			break;
		case 3:
			return 'Março';
			break;
		case 4:
			return 'Abril';
			break;
		case 5:
			return 'Maio';
			break;
		case 6:
			return 'Junho';
			break;
		case 7:
			return 'Julho';
			break;
		case 8:
			return 'Agosto';
			break;
		case 9:
			return 'Setembro';
			break;
		case 10:
			return 'Outubro';
			break;
		case 11:
			return 'Novembro';
			break;
		case 12:
			return 'Dezembro';
			break;

	}
}

function diaDaSemana(diaSemana,formato){

	if(formato == 1){
		switch (diaSemana) {
			case 'Sun': return 'Dom'; break;
			case 'Mon': return 'Seg'; break;
			case 'Tue': return 'Ter'; break;
			case 'Wed': return 'Qua'; break;
			case 'Thu': return 'Qui'; break;
			case 'Fri': return 'Sex'; break;
			case 'Sat':	return 'Sab'; break;		
		}
	}else if(formato == 2){
		switch (diaSemana) {
			case 'Sun': return 'Domingo'; break;
			case 'Mon': return 'Segunda'; break;
			case 'Tue': return 'Terça'; break;
			case 'Wed': return 'Quarta'; break;
			case 'Thu': return 'Quinta'; break;
			case 'Fri': return 'Sexta'; break;
			case 'Sat':	return 'Sabado'; break;		
		}
	}else{
		switch (diaSemana) {
			case 'Sun': return 'Domingo'; break;
			case 'Mon': return 'Segunda-feira'; break;
			case 'Tue': return 'Terça-feira'; break;
			case 'Wed': return 'Quarta-feira'; break;
			case 'Thu': return 'Quinta-feira'; break;
			case 'Fri': return 'Sexta-feira'; break;
			case 'Sat':	return 'Sabado'; break;		
		}
	}	
}

function datas(SemanaDia){
	var Data = new Date();
	dia = Data.getDay();
	Dia = Data.getDate();
	Mes = Data.getMonth();
	Ano = Data.getFullYear();
	
	if(SemanaDia == 1){
		Dia_Atual = new Array(7)
		Dia_Atual[0] = "Domingo"
		Dia_Atual[1] = "Segunda-feira"
		Dia_Atual[2] = "Terça-feira"
		Dia_Atual[3] = "Quarta-feira"
		Dia_Atual[4] = "Quinta-feira"
		Dia_Atual[5] = "Sexta-feira"
		Dia_Atual[6] = "Sábado"
		
		for(a in Dia_Atual){
			if(a==dia){
				return Dia_Atual[a];
			}	
		}
	}else{
		Mes+=1;
		return Dia<10?"0"+Dia:Dia+"/"+(Mes<10?"0"+Mes:Mes)+"/"+Ano;
	}	
}



function retornaMesAbreviacaoByNumero(numMes){
	switch (numMes) {
		case 1:
			return 'Jan';
			break;
		case 2:
			return 'Fev';
			break;
		case 3:
			return 'Mar';
			break;
		case 4:
			return 'Abr';
			break;
		case 5:
			return 'Mai';
			break;
		case 6:
			return 'Jun';
			break;
		case 7:
			return 'Jul';
			break;
		case 8:
			return 'Ago';
			break;
		case 9:
			return 'Set';
			break;
		case 10:
			return 'Out';
			break;
		case 11:
			return 'Nov';
			break;
		case 12:
			return 'Dez';
			break;

	}
}

//Numero de mensagens recebidas
function ContadorMensagens(){
    $.ajax({
        url: path + "Mensagens/Proprietario/" + userID,
        type: "GET",
        async: false,
        crossDomain: true,
        success: function (dataMensagens) {
            Limite = dataMensagens.length;
            for (var b = 0; b < dataMensagens.length; b++) {
                if (dataMensagens[b].lida == "N" && dataMensagens[b].cxEntrada == "S" && dataMensagens[b].cxEnviada == "N") {
                    contador++;
                }
            }

            for (var a = Limite - 1; a >= 0 ; a--) {
                if (dataMensagens[a].lida == "N" && dataMensagens[a].cxEntrada == "S" && dataMensagens[a].cxEnviada == "N") {
                    HtmlContent += '<tr>';
                    HtmlContent += '<td class="dataMsg" onClick="window.location=\'mensagens.html?ID=' + dataMensagens[a].idmensagens + '\';" style=" line-height: 13px;""><h4 class="user">' + (dataMensagens[a].remetente.aluno != null ? dataMensagens[a].remetente.aluno.nome : dataMensagens[a].remetente.professor.nome) + '</h4>' + dataMensagens[a].assunto.substring(0, 40) + (dataMensagens[a].assunto.length < 40 ? "</td>" : "...</td>");

                }
            }

            HtmlContent += "</table>";
            $('.Mensagens_Conteudo').append(HtmlContent);
            if (contador <= 9) {
                $('.Mensagens_Cabecalho_Imagem_Contador').html(contador);
            } else {
                $('.Mensagens_Cabecalho_Imagem_Contador').html("9+");
            }
        }, error: function () {
            retorno = "erro";
        }
    });
}

function fecharJanela(){
    $('#box_msg_alter_banner').css('display', 'none');
}

function ativaMenu(){
	var url = window.location.href;
	var retorno = url.split("/"); 
	var classe = $('a[href="'+retorno[4]+'"] .Content_lateral_Menu_Opcao').attr("class");	
	$('.Content_lateral_Menu_Opcao a[href="'+retorno[4]+'"]').addClass(classe+'-active');
}