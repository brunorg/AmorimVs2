$(document).ready(function() {
    $('.btnMenu.Active').click(function(){
        trocarConteudoInicial($(this).index());
        $(".btnMenu.Active").removeClass("btClicked");
        $(this).addClass("btClicked");
    });

    
    $('#Conteudo_Corpo .rightSide .contentRightSide .contentItem').mouseover(function(){
        $(this).addClass("MouseHover");
    }).mouseout(function(){
        $(this).removeClass("MouseHover");
    });

    $('#Conteudo_Corpo .rightSide .contentRightSide .contentItem.ativo').click(function(){
        ShowPopUp("PopupProducao");
    });


    $('#Conteudo_Corpo .Selecao5 .Conteudo .Icones .Icone.Ativo').click(function(){
        ShowPopUp("PopupCalendario");
    });

    $('#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .btn_close').click(function(){
        trocarConteudoInicial(4);
    });

    $('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .btn_close').click(function(){
        trocarConteudoInicial(5);
    });

    $('#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .MainSlide .Arrow').click(function(){
        NextFrameSlide($(this).index());
    });

    $('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .MainSlide .Arrow').click(function(){
        NextFrameSlideCalendario($(this).index());
    });

    $("#Conteudo_Corpo .Selecoes.Selecao3.rightSide .contentRightSide .listaComissao .opcaoComissao").click(function(){
        $("#Conteudo_Corpo .Selecoes.Selecao3.rightSide .contentRightSide .listaComissao .opcaoComissao").removeClass("Ativo");
        $(this).addClass("Ativo");
        List($(this).index());
    });
});

var db = {
	"Calendario": {
		"FestaDaCultura" : [
			{"Ano" : 2015, "Tema" : "A", "ImagemCapa": "siteAmorim/img/IMG_6401.jpg", "SlideImg" : [
					{"Imagem" : "siteAmorim/img/desenho/img1.jpg", "Descricao" : "elit ipsum Lorem sit amet, consectetur adipiscing elit. Aliquam ac tempor nisi. venenatis venenatis at eros dolor sagittis. Donec maximus metus finibus dui Sed,"},
					{"Imagem" : "siteAmorim/img/desenho/img2.jpg", "Descricao" : "in Lorem dolor sit amet, consectetur adipiscing elit. Aliquam ac tempor nisi. Sed venenatis at eros in ipsum. Donec maximus metus finibus dui consectetur,"},
					{"Imagem" : "siteAmorim/img/desenho/img3.jpg", "Descricao" : "Lorem ipsum dolor consectetur amet, consectetur adipiscing elit. Aliquam ac sagittis nisi. Sed venenatis sit eros in sagittis. Donec maximus metus tempor dui consectetur,"},
					{"Imagem" : "siteAmorim/img/desenho/img4.jpg", "Descricao" : "at ipsum dolor sit amet, consectetur adipiscing elit. Lorem ac tempor finibus. Sed venenatis at eros in sagittis. Donec maximus Aliquam finibus dui consectetur,"},
					{"Imagem" : "siteAmorim/img/desenho/img5.jpg", "Descricao" : "nisi ipsum dolor sit Lorem, consectetur adipiscing elit. Aliquam ac tempor nisi. Sed venenatis at metus in sagittis. Donec amet metus finibus eros consectetur,"},
					{"Imagem" : "siteAmorim/img/desenho/img6.jpg", "Descricao" : "maximus ipsum dolor sit amet, consectetur adipiscing elit. Aliquam Lorem tempor nisi. Sed venenatis at eros in sagittis. dui maximus metus finibus dui consectetur,"},
					{"Imagem" : "siteAmorim/img/desenho/img7.jpg", "Descricao" : "ac ipsum dolor sit amet, consectetur Donec Lorem. Aliquam ac tempor nisi. Sed adipiscing at eros in sagittis. Donec maximus metus finibus dui consectetur,"}
				]
			},
			{"Ano" : 2014, "Tema" : "B", "ImagemCapa": "siteAmorim/img/IMG_6401.jpg", "SlideImg" : [
					
				]
			},
			{"Ano" : 2013, "Tema" : "C", "ImagemCapa": "siteAmorim/img/IMG_6401.jpg", "SlideImg" : [
					{"Imagem" : "siteAmorim/img/desenho/img2.jpg", "Descricao" : "in Lorem dolor sit amet, consectetur adipiscing elit. Aliquam ac tempor nisi. Sed venenatis at eros in ipsum. Donec maximus metus finibus dui consectetur,"}
					
				]
			},
			{"Ano" : 2012, "Tema" : "D", "ImagemCapa": "siteAmorim/img/IMG_6401.jpg", "SlideImg" : [
					{"Imagem" : "siteAmorim/img/desenho/img7.jpg", "Descricao" : "ac ipsum dolor sit amet, consectetur Donec Lorem. Aliquam ac tempor nisi. Sed adipiscing at eros in sagittis. Donec maximus metus finibus dui consectetur,"},
					{"Imagem" : "siteAmorim/img/desenho/img2.jpg", "Descricao" : "in Lorem dolor sit amet, consectetur adipiscing elit. Aliquam ac tempor nisi. Sed venenatis at eros in ipsum. Donec maximus metus finibus dui consectetur,"}
					
				]
			}
		]
	},
	"Producao": {
		"OficinaCinema" : [
			{"Categoria" : "Chamada", 	"Tipo" : "Video",	"ImagemCapa":"btn_slide1.png",	"SlideImg": [], "Video" : "https://player.vimeo.com/video/139168939"},
			{"Categoria" : "Efeitos Visuais", 	"Tipo" : "Imagem",	"ImagemCapa":"btn_slide2.png",	"SlideImg": [
					{ "Image" : "efeitos/img1.jpg", "Descricao" : "sagittis ipsum venenatis sit amet, consectetur adipiscing elit. Aliquam ac tempor nisi. elit elit at eros dolor sagittis. Donec maximus metus finibus dui Sed,"},
					{ "Image" : "efeitos/img2.jpg", "Descricao" : "elit ipsum Lorem elit amet, venenatis elit Donec. Aliquam ac elit nisi. venenatis venenatis at eros venenatis sagittis. Donec maximus elit elit dui Sed,"},
					{ "Image" : "efeitos/img3.jpg", "Descricao" : "Lorem elit Lorem sit venenatis, consectetur adipiscing venenatis. elit ac tempor sit. consectetur venenatis at adipiscing dolor elit. Donec tempor metus finibus dui Sed,"},
					{ "Image" : "efeitos/img4.jpg", "Descricao" : "dolor ipsum metus sit amet, consectetur finibus elit. Aliquam ac ipsum nisi. venenatis amet at eros elit sagittis. Aliquam maximus metus finibus dui Sed,"}
				]
			},
			{"Categoria" : "Stop-Motion", "Tipo" : "Imagem",	"ImagemCapa":"btn_slide3.png",	"SlideImg": [
					{ "Image" : "stopmotion/img1.jpg", "Descricao" : "nisi ipsum Lorem sit venenatis, consectetur eros sagittis. Aliquam ac tempor maximus. venenatis elit at eros dolor sagittis. Donec maximus metus finibus dui Sed,"},
					{ "Image" : "stopmotion/img2.jpg", "Descricao" : "Lorem ipsum Lorem adipiscing amet, consectetur adipiscing elit. Aliquam ac tempor nisi. venenatis venenatis at eros dolor venenatis. Donec maximus metus dolor dui Donec,"},
					{ "Image" : "stopmotion/img3.jpg", "Descricao" : "elit ipsum amet sit amet, adipiscing adipiscing elit. Aliquam nisi tempor nisi. venenatis venenatis at elit sit sagittis. Donec elit metus finibus tempor Sed,"},
					{ "Image" : "stopmotion/img4.jpg", "Descricao" : "sagittis finibus Lorem sit Sed, consectetur adipiscing elit. Lorem ac tempor nisi. consectetur venenatis elit eros dolor ac. venenatis maximus metus finibus dui Sed,"},
					{ "Image" : "stopmotion/img5.jpg", "Descricao" : "eros ipsum dolor sit amet, consectetur adipiscing maximus. Aliquam ac tempor dui. venenatis elit at eros ipsum sagittis. Donec maximus amet finibus elit Sed,"}
				]
			},
			{"Categoria" : "Filmagem", 	"Tipo" : "Imagem",	"ImagemCapa":"btn_slide4.png",	"SlideImg": [
					{ "Image" : "filmagem/img1.jpg", "Descricao" : "Aliquam ipsum Lorem sit amet, consectetur adipiscing venenatis. Aliquam ac tempor nisi. venenatis venenatis at eros dolor sagittis. at maximus sagittis finibus dui Sed,"},
					{ "Image" : "filmagem/img2.jpg", "Descricao" : "Donec ipsum Lorem sit amet, consectetur adipiscing elit. Aliquam ac Lorem nisi. venenatis elit at eros dolor sagittis. Donec maximus metus finibus dui Sed,"},
					{ "Image" : "filmagem/img3.jpg", "Descricao" : "nisi ipsum Lorem venenatis amet, consectetur adipiscing dolor. Aliquam ac tempor nisi. venenatis venenatis at metus dolor sagittis. Donec dui metus elit dui Donec,"},
					{ "Image" : "filmagem/img4.jpg", "Descricao" : "metus ipsum Lorem sit amet, consectetur adipiscing elit. elit ac tempor nisi. tempor venenatis at eros dolor venenatis. Donec maximus metus finibus dui Sed,"},
					{ "Image" : "filmagem/img5.jpg", "Descricao" : "elit ipsum Lorem sit amet, consectetur adipiscing elit. Aliquam ac tempor nisi. venenatis venenatis at eros dolor sagittis. sit maximus eros finibus dui Sed,"}
				]
			},
			{"Categoria" : "Desenho", 	"Tipo" : "Imagem",	"ImagemCapa":"btn_slide5.png",	"SlideImg": [
					{ "Image" : "desenho/img1.jpg", "Descricao" : "maximus ipsum Lorem sit amet, consectetur adipiscing elit. Aliquam ac tempor nisi. venenatis venenatis at eros dolor sagittis. Donec maximus metus finibus dui Sed,"},
					{ "Image" : "desenho/img2.jpg", "Descricao" : "Sed ipsum Lorem sit amet, finibus adipiscing elit. Aliquam ac tempor nisi. venenatis venenatis at eros dolor Aliquam. Donec elit metus sagittis dui Sed,"},
					{ "Image" : "desenho/img3.jpg", "Descricao" : "venenatis ipsum Lorem sit amet, consectetur adipiscing elit. Donec ac tempor nisi. venenatis metus at elit dolor sagittis. Donec maximus metus finibus dui Sed,"},
					{ "Image" : "desenho/img4.jpg", "Descricao" : "elit ipsum elit sit amet, consectetur adipiscing elit. Aliquam ac tempor nisi. venenatis venenatis at eros consectetur sagittis. Donec maximus sagittis finibus dui Sed,"},
					{ "Image" : "desenho/img5.jpg", "Descricao" : "maximus ipsum Lorem sit amet, consectetur adipiscing finibus. Aliquam ac tempor nisi. venenatis elit at eros dolor sagittis. elit maximus metus finibus dui Sed,"},
					{ "Image" : "desenho/img6.jpg", "Descricao" : "Aliquam ipsum Lorem sit amet, consectetur adipiscing venenatis. Aliquam ac tempor nisi. eros venenatis at elit dolor elit. Donec maximus metus finibus dui Sed,"},
					{ "Image" : "desenho/img7.jpg", "Descricao" : "Lorem ipsum Lorem sit amet, consectetur adipiscing elit. Aliquam ac tempor nisi. venenatis venenatis at eros dolor sagittis. Donec maximus metus finibus dui Sed,"}
				]
			},
			{"Categoria" : "Animacao", 			"Tipo" : "Imagem",	"ImagemCapa":"btn_slide6.png",	"SlideImg": [
					{ "Image" : "animacao/img1.jpg", "Descricao" : "dolor ipsum Lorem sit amet, consectetur adipiscing metus. Aliquam ac tempor nisi. venenatis venenatis at eros dolor sagittis. Donec maximus metus finibus dui Sed,"},
					{ "Image" : "animacao/img2.jpg", "Descricao" : "elit ipsum Lorem sit amet, consectetur adipiscing venenatis. Aliquam ac tempor nisi. venenatis Donec at eros dolor sagittis. elit maximus metus finibus dui Sed,"},
					{ "Image" : "animacao/img3.jpg", "Descricao" : "elit ipsum Lorem sit amet, consectetur adipiscing elit. Aliquam ac tempor nisi. eros venenatis at eros dolor sagittis. Donec maximus metus finibus dui Sed,"}
				]
			}
		]
	},
	"Gremio": ["lkajsdkl jalkssd jalksdj klshilusdh aishf iah fiah iuh <br /><img src='siteAmorim/img/Cartaz.jpg' width='230'>","fqw efqw fqwe qwefqwefqewf q fqwe f"," uijk ghj kg kjghjk gh kjk gh jkjg kghjk jk "]
}






var SlideAtual;
var FrameAtual;

(function($){
    $(window).load(function(){
        $('#Conteudo_Corpo .Selecao5.rightSide .Calendario .infos').mCustomScrollbar();
        $('#Conteudo_Corpo .Selecoes.PopupCalendario .anos').mCustomScrollbar();
    });
})(jQuery);

function trocarConteudoInicial(numero)
{
	$('#Conteudo_Corpo .Selecoes').css('display','none');
	$('#Conteudo_Corpo .Selecoes.Selecao'+numero).css('display','block');
}



function NextFrameSlide(numero)
{
	if(numero == 0)
	{
		FrameAtual--;
		if(FrameAtual < 0){ FrameAtual = db.Producao.OficinaCinema[SlideAtual].SlideImg.length-1; }
	} else {
		FrameAtual++;
		if(FrameAtual > db.Producao.OficinaCinema[SlideAtual].SlideImg.length-1){ FrameAtual = 0; }

	}

	$('#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .MainSlide .ConteudoMain img').attr("src","siteAmorim/img/"+db.Producao.OficinaCinema[SlideAtual].SlideImg[FrameAtual].Image);
	$('#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .MainSlide .ConteudoMain .legenda').html(db.Producao.OficinaCinema[SlideAtual].SlideImg[FrameAtual].Descricao);
	
}

function NextFrameSlideCalendario(numero)
{
	var obj = '#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .MainSlide .IconSlide';
	var proximo = true;
	var id;

	if(numero == 3)
	{
		proximo = false;
	} 


	for(var a=0; a < $(obj).length; a++)
	{		
		if($($(obj).get(a)).hasClass("borderBottom"))
		{

			$(obj).removeClass("borderBottom");
			id = a;
		}
	}

	if(proximo)
	{
		if(id == $(obj).length-1)
		{
			$($(obj).get(0)).click();
			
		} else {
			$($(obj).get(id+1)).click();
		}
	} else {
		if(id == 0)
		{
			$($(obj).get($(obj).length-1)).click();
			
		} else {
			$($(obj).get(id-1)).click();
		}
	}
	 
}

/* ATT */

function ShowPopUp(classe)
{
	$('#Conteudo_Corpo .Selecoes').css('display','none');
    $('.Selecoes.'+classe).css('display','block');

    var SelecionarRecente = -1;
	
	if(classe == "PopupCalendario")
	{

		$("#Conteudo_Corpo .Selecoes.PopupCalendario .anos").html("");

		for(var a = 0; a< db.Calendario.FestaDaCultura.length; a++)
		{
			if(db.Calendario.FestaDaCultura[a].SlideImg.length > 0)
			{
				$("#Conteudo_Corpo .Selecoes.PopupCalendario .anos").append('<div class="boxAno" onclick="SelecionarSlideCalendario('+a+')"><div class="Titulo">'+db.Calendario.FestaDaCultura[a].Ano+' - '+db.Calendario.FestaDaCultura[a].Tema+'</div><div class="Imagem"><img width="100%" height="auto" src="'+db.Calendario.FestaDaCultura[a].ImagemCapa+'"></div></div>');
				if(SelecionarRecente == -1){ SelecionarRecente = a;}
			}
		}

		if(SelecionarRecente != -1){SelecionarSlideCalendario(SelecionarRecente);}
		else{ $('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .MainSlide').html("Não há imagens nessa galeria");}

	} else if(classe == "PopupProducao"){
		$('#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .SelectionSlides').html('');


		for(var a = 0; a< db.Producao.OficinaCinema.length; a++)
		{
			$("#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .SelectionSlides").append('<div class="IconSlide'+(a == 0 ? " borderBottom":"")+'" onclick="SelecionarImagemProducao(this, '+a+')" style="background-image: url(\'siteAmorim/img/'+db.Producao.OficinaCinema[a].ImagemCapa+'\')"></div>');
		}

	}
}

/*Calendario*/

function SelecionarSlideCalendario(numero)
{

	$('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .AnoTitulo').html(db.Calendario.FestaDaCultura[numero].Ano);
	$('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .ConteudoMain img').attr("src", ""+db.Calendario.FestaDaCultura[numero].SlideImg[0].Imagem);
	$('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .ConteudoMain .legenda').html(db.Calendario.FestaDaCultura[numero].SlideImg[0].Descricao);

	$("#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .MainSlide .SelectionSlides").html("");
	
	for(var a = 0; a< db.Calendario.FestaDaCultura[numero].SlideImg.length; a++)
	{
		$("#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .MainSlide .SelectionSlides").append('<div class="IconSlide'+(a == 0 ? " borderBottom":"")+'" onclick="SelecionarImagemCalendario(this, '+numero+','+a+')" style="background-image: url(\''+db.Calendario.FestaDaCultura[numero].SlideImg[a].Imagem+'\')"></div>');
	}

}

function SelecionarImagemCalendario(obj, numero1, numero2)
{

    $('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .MainSlide .IconSlide').removeClass("borderBottom");
    $(obj).addClass("borderBottom");

    $('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .ConteudoMain .legenda').html(""+db.Calendario.FestaDaCultura[numero1].SlideImg[numero2].Descricao);
    $('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .ConteudoMain img').attr("src",db.Calendario.FestaDaCultura[numero1].SlideImg[numero2].Imagem);

}

/*Producao*/


function SelecionarImagemProducao(obj, numero)
{

	SlideAtual = numero;
	FrameAtual = 0;

    $('#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .SelectionSlides .IconSlide').removeClass("borderBottom");
    $(obj).addClass("borderBottom");

    if(db.Producao.OficinaCinema[numero].Tipo == "Imagem")
    {
		$('#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .MainSlide .Arrow').css("display","block");
		$('#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .MainSlide .ConteudoMain').html('<img width="auto" height="100%" src="siteAmorim/img/'+db.Producao.OficinaCinema[numero].SlideImg[0].Image+'">');
		$('#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .MainSlide .ConteudoMain').append('<div class="legenda">'+db.Producao.OficinaCinema[numero].SlideImg[0].Descricao+'</div>');

    } else {
		$('#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .MainSlide .Arrow').css("display","none");
		$('#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .MainSlide .ConteudoMain').html('<iframe src="'+db.Producao.OficinaCinema[numero].Video+'" width="800" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
    }
}


/** paisd oiajd ioad */

function List(numero)
{
	$("#Conteudo_Corpo .Selecoes.Selecao3.rightSide .contentRightSide .infoComissao").html(db.Gremio[numero]);
}