$(document).ready(function() {
	$(".aba_oficina").click(function(){
		toggleTabOficina(this);
	});

	$(".oficina_planejamento").click(function(){
		triggerAccordion(this);
	});

	$(".aba_box_lateral").click(function() {
		toggleTabLateral(this);
	});

	$(".aba_oficina").filter(":first").trigger("click");
	$(".aba_box_lateral").filter(":first").trigger("click");

	$("#blog_oficina_container").mCustomScrollbar({axis: "y"});
});

function toggleTabOficina(tab) {
	$(".aba_oficina").removeClass("aba_ativa");
	$(tab).addClass("aba_ativa");

	var classAbaAtiva = $(tab).attr("class").split(/\s+/)[1];
	toggleBarOficina(classAbaAtiva);
}

function toggleBarOficina(classOficina) {
	var oficina = classOficina.slice(4);
	$("#faixa_oficina").css("background-image","url(img/alfabetizacao/faixa_"+oficina+".png)");
}

function triggerAccordion(accordionItem) {
	$(".oficina_planejamento").not(accordionItem).each(function(){
		$(this).removeClass("planejamento_aberto");
		$(this).find(".roteiro_conteudo").slideUp();
	});

	if ( $(accordionItem).hasClass("planejamento_aberto") ) {
		$(accordionItem).removeClass("planejamento_aberto");
		$(accordionItem).find(".roteiro_conteudo").slideUp();
	} else {
		$(accordionItem).addClass("planejamento_aberto");
		$(accordionItem).find(".roteiro_conteudo").slideDown();
	}
}

function toggleTabLateral(tab) {
	var classeBox = $(tab).attr("class").split(/\s+/)[1];
	var box = classeBox.slice(4);

	$(".aba_box_lateral").removeClass("aba_ativa");
	$(".box_lateral").hide();

	$(tab).addClass("aba_ativa");
	$(".box_"+box).show();
}