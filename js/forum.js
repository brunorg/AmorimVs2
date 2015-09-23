//Murano Design

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

	var aluno=1;
    var alunoID = 2;
    var UsuarioAtivo = 2;

//------------------------------------------------------------------------------------------------------------------------

//


//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD

	var dataForumResposta 			=	getData("ForumResposta", null);

//------------------------------------------------------------------------------------------------------------------------

	
//Carrega a funçao de Load do JQuery

$(document).ready(function(){
	
	$("body").delegate(".barra_titulo span", "mouseover", function() {
		
		//if ($(this).text() == 'ALIMENTAÇÃO'){
		if ($(this).parent().hasClass('aparecer')){

			var tamTexto = $(this).css('width');
			var tamDiv = $('.barra_titulo').css('width');
			var tamLink = $('.btn_topico').css('width'); 
//			console.log('texto: '+tamTexto);
//			console.log('Div: '+tamDiv);
//			console.log('Link: '+tamLink);
			
			tamTexto = tamTexto.substring(0,(tamTexto.length - 2));
			tamDiv = tamDiv.substring(0,(tamDiv.length - 2));
			tamLink = tamLink.substring(0,(tamLink.length - 2));
			
			var espacoTexto = tamDiv - tamLink;
			var diferenca = -(tamTexto - espacoTexto)-20;

			if (espacoTexto < tamTexto){
				var texto = $(this).text();
				var span = $(this).attr('id');
				$(this).css('position','relative');
				$(this).animate({
					left: diferenca+'px'
				},1000, function() {
					setTimeout(function(){
						$('#'+span).css('left','0px');
						$('#'+span).css('position','');
					},1000
					)
				});
			}
		}
				
	});

	carregaForumCompleto();
	carregaAnoEstudo();

	$('#PesqAnoEstudo').change(function() {
		recarregaForumAnoEstudo($(this).val());
	});

});

function buscaForum () {
	if ($('#buscaForum').val() != "")
		$.ajax({
    	    url: path + "Roteiro/ListaLikeRoteiro/" + $('#buscaForum').val(),
			type: "GET",
			async: false,
			crossDomain: true,
			dataType: 'json',
			beforeSend: function() {
				loading('inicial');
			},
			success: function (forumBusca) {
				HtmlContentBusca = '';
				for (var i = 0; i < forumBusca.length; i++) {
					HtmlContentBusca+= '<div class="secao_forum" id="btn'+forumBusca[i].idroteiro+'">';
					HtmlContentBusca+= '<a href="#" class="barra_titulo accordion"><span id="'+forumBusca[i].idroteiro+'">'+forumBusca[i].nome+'</span>' + getCountQuestoes(forumBusca[i].idroteiro) + '</a>';
					if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
    	    		{
    	        		HtmlContentBusca+= '<a href="mForumSecao.html?IdRoteiro='+base64_encode(""+forumBusca[i].idroteiro)+'" class="btn_topico">criar novo tópico<span class="criar_topico"></span></a>';
    	    		}
    	    		else
    	    		{
    	    			HtmlContentBusca+= '<a href="forumSecao.html?IdRoteiro='+base64_encode(""+forumBusca[i].idroteiro)+'" class="btn_topico">criar novo tópico<span class="criar_topico"></span></a>';
    	    		}
					HtmlContentBusca+= '<div class="info_secao_forum">';
	
					HtmlContentBusca+= getResultadoForumQuestao(forumBusca[i].idroteiro);
	
					HtmlContentBusca+= '</div>';
					HtmlContentBusca+= '</div>';
				}
	
				$('#box_forum').html(HtmlContentBusca);
				window.setTimeout(function(){
					abreAcoordion();
				}, 1000);
	
			},
			complete: function() {
				loading('final');
			}
    	});
	else
		carregaForumCompleto();
}

function carregaForumCompleto () {
	$.ajax({
        url: path + "Roteiro",
		type: "GET",
		async: false,
		crossDomain: true,
		dataType: 'json',
		beforeSend: function() {
			loading('inicial');
		},
		success: function (forumData) {
			Html = '';
			for (var i = 0; i < forumData.length; i++) {
				Html+= '<div class="secao_forum" id="btn'+forumData[i].idroteiro+'">';
				Html+= '<a href="#" class="barra_titulo accordion"><span id="'+forumData[i].idroteiro+'">'+forumData[i].nome+'</span>' + getCountQuestoes(forumData[i].idroteiro) + '</a>';
				if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
        		{
            		Html+= '<a href="mForumSecao.html?IdRoteiro='+base64_encode(""+forumData[i].idroteiro)+'" class="btn_topico">criar novo tópico<span class="criar_topico"></span></a>';
        		}
        		else
        		{
        			Html+= '<a href="forumSecao.html?IdRoteiro='+base64_encode(""+forumData[i].idroteiro)+'" class="btn_topico">criar novo tópico<span class="criar_topico"></span></a>';
        		}
				Html+= '<div class="info_secao_forum">';

				Html+= getResultadoForumQuestao(forumData[i].idroteiro);

				Html+= '</div>';
				Html+= '</div>';
			}

			$('#box_forum').html(Html);
			window.setTimeout(function(){
				abreAcoordion();
			}, 1000);
		},
		complete: function() {
			loading('final');
		}
    });
}

function abreAcoordion(){	
	$('a.accordion').click(function(){
		$(this).toggleClass('aparecer');
		$(this).parent().find('div.info_secao_forum').slideToggle("slow");
		$(this).find('.label_titulo').toggleClass('label_escondido');
		var btn = $(this).closest('div.secao_forum').attr('id') ;
		$("#"+btn+" .btn_topico").toggleClass("aparecer")
	});
}


function getResultadoForumQuestao(ID)
{
	HtmlContent = "";

	var dataForumQuestao;

	$.ajax({
		url: path + 'ForumQuestao/ListaPorRoteiro/' + ID,
		crossDomain: true,
		async: false,
		type: "GET",
		beforeSend: function() {
			loading('inicial');
		},
		success: function(d) {
			dataForumQuestao = d;
		},
		complete: function() {
			loading('final');
		}
	});

	for(var b = 0; b < dataForumQuestao.length; b++)
	{

			HtmlContent+= '<div class="info_secao_forum_div">';
			if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
        	{
        	    HtmlContent+= '	<a href="mForumSecao.html?IdRoteiro='+base64_encode(""+ID)+'&IdQuestao='+base64_encode(""+dataForumQuestao[b].idforumQuestao)+'" class="btn_forum">';
        	}
        	else
        	{
        		HtmlContent+= '	<a href="forumSecao.html?IdRoteiro='+base64_encode(""+ID)+'&IdQuestao='+base64_encode(""+dataForumQuestao[b].idforumQuestao)+'" class="btn_forum">';
        	}
			HtmlContent+= '		<div class="esquerda">'+dataForumQuestao[b].questao+'</div>';
			HtmlContent+= '		<div class="direita2"> | Professor: '+getResultadoForumResposta(dataForumQuestao[b].idforumQuestao, "professor")+'<span class="star_forum_prof"></span></div>';
			HtmlContent+= '		<div class="direita1">'+getResultadoForumResposta(dataForumQuestao[b].idforumQuestao, "aluno")+' respostas</div>';
			HtmlContent+= '		<div style="clear:both"></div>';
			HtmlContent+= '	</a>';
			HtmlContent+= '</div>';
	}

	return HtmlContent;
}

function carregaAnoEstudo(){
	/*lista anoEstudo*/
	var dataAnoEstudo = getData("AnoEstudo", null);	
	HtmlContent = ""; 
	for(var b=0;b<dataAnoEstudo.length; b++)
	{
		HtmlContent += "<option value='"+dataAnoEstudo[b].idanoEstudo+"'>"+(dataAnoEstudo[b].ano)+"º</option>";
	} 
	$('#PesqAnoEstudo').html("<option></option>"+HtmlContent);
}

function recarregaForumAnoEstudo (ano) {
	console.log(ano);
	var HtmlContentRecarregar = '';
	$.ajax({
		url: path + "Roteiro/RoteiroAno/" + ano,
		type: "GET",
		async: false,
		crossDomain: true,
		beforeSend: function() {
			loading('inicial');
		},
		success: function (forumAno) {
			for (var i = 0; i < forumAno.length; i++) {
				HtmlContentRecarregar+= '<div class="secao_forum" id="btn'+forumAno[i].idroteiro+'">';
				HtmlContentRecarregar+= '<a href="#" class="barra_titulo accordion"><span id="'+forumAno[i].idroteiro+'">'+forumAno[i].nome+'</span>' + getCountQuestoes(forumAno[i].idroteiro) + '</a>';
				if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
        		{
            		HtmlContentRecarregar+= '<a href="mForumSecao.html?IdRoteiro='+base64_encode(""+forumAno[i].idroteiro)+'" class="btn_topico">criar novo tópico<span class="criar_topico"></span></a>';
        		}
        		else
        		{
        			HtmlContentRecarregar+= '<a href="forumSecao.html?IdRoteiro='+base64_encode(""+forumAno[i].idroteiro)+'" class="btn_topico">criar novo tópico<span class="criar_topico"></span></a>';
        		}
				HtmlContentRecarregar+= '<div class="info_secao_forum">';

				HtmlContentRecarregar+= getResultadoForumQuestao(forumAno[i].idroteiro);

				HtmlContentRecarregar+= '</div>';
				HtmlContentRecarregar+= '</div>';
			}

			$('#box_forum').html(HtmlContentRecarregar);
			window.setTimeout(function(){
				abreAcoordion();
			}, 1000);

		},
		complete: function() {
			loading('final');
		}

	});
	

}

function getResultadoForumResposta(ID, usuario)
{
	var Numero = 0;

	$.ajax({
		url: path + "ForumResposta/ListarPorQuestao/" + ID,
		async: false,
		crossDomain: true,
		type: "GET",
		beforeSend: function() {
			loading("inicial");
		},
		success: function(d) {
			for(var a=0; a< d.length; a++)
			{
				if(usuario == "aluno")
				{
					Numero++;
				}
				else if(usuario == "professor" && d[a].usuario.perfil.perfil == "Professor"){
					Numero++;
				}
			}
		},
		complete: function() {
			loading("final");
		}
	});

	return Numero;
}

function getCountQuestoes(ID) {

	HtmlContent = "";

	var count;

	$.ajax({
		url: path + 'ForumQuestao/ListaPorRoteiro/' + ID,
		crossDomain: true,
		async: false,
		type: "GET",
		beforeSend: function() {
			loading('inicial');
		},
		success: function(d) {
			count = d.length;
		},
		complete: function() {
			loading('final');
		}
	});

	return count > 0? '<span class="label_titulo">' + count + '</span>' : '';

}