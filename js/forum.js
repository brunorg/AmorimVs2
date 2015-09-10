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

	var dataRoteiro 				=	getData("Roteiro", null);
	var dataForumQuestao 			=	getData("ForumQuestao", null);
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

	HtmlContent = "";


	for(var a=0; a< dataRoteiro.length; a++)
	{
		HtmlContent+= '<div class="secao_forum" id="btn'+dataRoteiro[a].idroteiro+'">';
		HtmlContent+= '<a href="#" class="barra_titulo accordion"><span id="'+dataRoteiro[a].idroteiro+'">'+dataRoteiro[a].nome+'</span></a>';
		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
        {
            HtmlContent+= '<a href="mForumSecao.html?IdRoteiro='+base64_encode(""+dataRoteiro[a].idroteiro)+'" class="btn_topico">criar novo tópico<span class="criar_topico"></span></a>';
        }
        else
        {
        	HtmlContent+= '<a href="forumSecao.html?IdRoteiro='+base64_encode(""+dataRoteiro[a].idroteiro)+'" class="btn_topico">criar novo tópico<span class="criar_topico"></span></a>';
        }
		HtmlContent+= '<div class="info_secao_forum">';

		HtmlContent+= getResultadoForumQuestao(dataRoteiro[a].idroteiro);

		HtmlContent+= '</div>';
		HtmlContent+= '</div>';
	}

	$('#box_forum').html(HtmlContent);
	window.setTimeout(function(){
		abreAcoordion();
	}, 1000);

		
	function abreAcoordion(){	
		$('a.accordion').click(function(){
			//alert('t');
			$(this).toggleClass('aparecer');
			$(this).parent().find('div.info_secao_forum').slideToggle("slow");
			var btn = $(this).closest('div.secao_forum').attr('id') ;
			$("#"+btn+" .btn_topico").toggleClass("aparecer")
		});
	}

	window.setTimeout(function(){
		$(".info_secao_forum p").each(function(){
			//$(this).css("height", 36 + 18 * Math.floor(($(this).find(".esquerda").html().length)/45));
			//$(this).parent().siblings('a.accordion').trigger("click");
			//$(this).css("height", 18 + $(this).find(".esquerda").height());
			//$(this).parent().siblings('a.accordion').trigger("click");
		});
	}, 1000);
});


function getResultadoForumQuestao(ID)
{
	HtmlContent = "";

	for(var b=0; b< dataForumQuestao.length; b++)
	{
		if(dataForumQuestao[b].roteiro.idroteiro == ID)
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
	}

	return HtmlContent;
}

function getResultadoForumResposta(ID, usuario)
{
	var Numero = 0;

	for(var a=0; a< dataForumResposta.length; a++)
	{
		if(dataForumResposta[a].forumQuestao.idforumQuestao == ID)
		{
			if(usuario == "aluno")
			{
				Numero++;
			} else if(usuario == "professor" && dataForumResposta[a].usuario.perfil.perfil == "Professor"){
				Numero++;
			}
		}
	}

	return Numero;
}