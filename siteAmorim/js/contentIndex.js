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
					
				]
			},
			{"Ano" : 2012, "Tema" : "D", "ImagemCapa": "siteAmorim/img/IMG_6401.jpg", "SlideImg" : [
					
				]
			}
		]
	},
	"Producao": {
		"OficinaCinema" : [
			{"Categoria" : "Chamada", 			"Tipo" : "Video",	"ImagemCapa":"",	"SlideImg": [], "Video" : "<iframe src='https://player.vimeo.com/video/139168939' width='800' height='281' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>"},
			{"Categoria" : "Efeitos Visuais", 	"Tipo" : "Imagem",	"ImagemCapa":"",	"SlideImg": [{}]},
			{"Categoria" : "Stop-Motion", 		"Tipo" : "Imagem",	"ImagemCapa":"",	"SlideImg": [{}]},
			{"Categoria" : "Filmagem", 			"Tipo" : "Imagem",	"ImagemCapa":"",	"SlideImg": [{}]},
			{"Categoria" : "Desenho", 			"Tipo" : "Imagem",	"ImagemCapa":"",	"SlideImg": [{}]},
			{"Categoria" : "Animacao", 			"Tipo" : "Imagem",	"ImagemCapa":"",	"SlideImg": [{}]}
		]
	}
}
















var dirSlides = ["","efeitos","stopmotion","filmagem","desenho","animacao"];
var numeroSlides = [0,4,5,5,7,3];

var SlideAtual = 0;
var FrameAtual = 1;

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

function SelecionarItem(numero)
{
	SlideAtual = numero;
	FrameAtual = 1;
	if(numero == 0){ 
		$('#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .MainSlide .Arrow').css("display","none");
		$('#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .MainSlide .ConteudoMain').html('<iframe src="https://player.vimeo.com/video/139168939" width="800" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'); }
	else{
		$('#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .MainSlide .Arrow').css("display","block");
		$('#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .MainSlide .ConteudoMain').html('<img width="auto" height="100%" src="siteAmorim/img/'+dirSlides[numero]+'/img1.jpg">');
	}
}

function NextFrameSlide(numero)
{
	if(numero == 0)
	{
		FrameAtual--;
		if(FrameAtual < 1){ FrameAtual = numeroSlides[SlideAtual]; }
	} else {
		FrameAtual++;
		if(FrameAtual > numeroSlides[SlideAtual]){ FrameAtual = 1; }

	}
	
	$('#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .MainSlide .ConteudoMain').html('<img width="auto" height="100%" src="siteAmorim/img/'+dirSlides[SlideAtual]+'/img'+FrameAtual+'.jpg">');
}

function NextFrameSlideCalendario(numero)
{
	var proximo = true;
	var id;

	if(numero == 3)
	{
		proximo = false;
	} 


	for(var a=0; a < $('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .MainSlide .IconSlide').length; a++)
	{		
		if($($('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .MainSlide .IconSlide').get(a)).hasClass("borderBottom"))
		{

			$('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .MainSlide .IconSlide').removeClass("borderBottom");
			id = a;
		}
	}

	if(proximo)
	{
		if(id == $('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .MainSlide .IconSlide').length-1)
		{
			$($('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .MainSlide .IconSlide').get(0)).click();
			
		} else {
			$($('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .MainSlide .IconSlide').get(id+1)).click();
		}
	} else {
		if(id == 0)
		{
			$($('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .MainSlide .IconSlide').get($('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .MainSlide .IconSlide').length-1)).click();
			
		} else {
			$($('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .MainSlide .IconSlide').get(id-1)).click();
		}
	}
	 
}

/* ATT */

function ShowPopUp(classe)
{
	$('#Conteudo_Corpo .Selecoes').css('display','none');
    $('.Selecoes.'+classe).css('display','block');
	
	if(classe == "PopupCalendario")
	{

		$("#Conteudo_Corpo .Selecoes.PopupCalendario .anos").html("");

		for(var a = 0; a< db.Calendario.FestaDaCultura.length; a++)
		{
			$("#Conteudo_Corpo .Selecoes.PopupCalendario .anos").append('<div class="boxAno" onclick="SelecionarSlideCalendario('+a+')"><div class="Titulo">'+db.Calendario.FestaDaCultura[a].Ano+' - '+db.Calendario.FestaDaCultura[a].Tema+'</div><div class="Imagem"><img width="100%" height="auto" src="'+db.Calendario.FestaDaCultura[a].ImagemCapa+'"></div></div>');
		}

	} else if(classe == "PopupProducao"){
		$('#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .SelectionSlides').html('');


		for(var a = 0; a< db.Producao.OficinaCinema.length; a++)
		{
			$("#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .SelectionSlides").append('<div class="IconSlide" style="background-image: url(\''+db.Producao.OficinaCinema[a].ImagemCapa+'\')"></div>');
		}

	}
}

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