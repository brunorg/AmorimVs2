var dirSlides = ["","efeitos","stopmotion","filmagem","desenho","animacao"];
var numeroSlides = [0,4,5,5,7,3];

var SlideAtual = 0;
var FrameAtual = 1;

(function($){
        $(window).load(function(){
            $('#Conteudo_Corpo .Selecao5.rightSide .Calendario .infos').mCustomScrollbar();
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
		$('#Conteudo_Corpo .Selecoes.Selecao8.PopupProducao .contentSlide .MainSlide .Arrow').css("display","none");
		$('#Conteudo_Corpo .Selecoes.Selecao8.PopupProducao .contentSlide .MainSlide .ConteudoMain').html('<iframe src="https://player.vimeo.com/video/139168939" width="800" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'); }
	else{
		$('#Conteudo_Corpo .Selecoes.Selecao8.PopupProducao .contentSlide .MainSlide .Arrow').css("display","block");
		$('#Conteudo_Corpo .Selecoes.Selecao8.PopupProducao .contentSlide .MainSlide .ConteudoMain').html('<img width="auto" height="100%" src="siteAmorim/img/'+dirSlides[numero]+'/img1.jpg">');
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
	
	$('#Conteudo_Corpo .Selecoes.Selecao8.PopupProducao .contentSlide .MainSlide .ConteudoMain').html('<img width="auto" height="100%" src="siteAmorim/img/'+dirSlides[SlideAtual]+'/img'+FrameAtual+'.jpg">');
}