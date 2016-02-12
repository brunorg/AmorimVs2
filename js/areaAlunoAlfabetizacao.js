var perfis_selecionados = new Array();

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

	$("#abas_mensagens").children("span").click(function() {
		toggleTabMensagens(this);
	});
	$(".mensagem_post").click(function() {
		toggleMensagem(this);
	});

	$("#destinatarios_trigger").click(function() {
		$(this).toggleClass("destinatarios_ativo");
	});

	$("#nova_mensagem").click(function() {
		showFormularioNovaMensagem();
	});

	$(".aba_oficina").filter(":first").trigger("click");
	$(".aba_box_lateral").filter(":first").trigger("click");
	$("#abas_mensagens").children("span").filter(":first").trigger("click");

	$("#blog_oficina_container").mCustomScrollbar({axis: "y"});
	$("#mural_container").mCustomScrollbar({axis: "y"});
	$("#destinatarios_container").mCustomScrollbar({axis: "y"});
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

function toggleTabMensagens(tab) {
	$("#abas_mensagens").find("span").removeClass("aba_mensagem_ativa");
	$(tab).addClass("aba_mensagem_ativa");
}
function toggleMensagem(item) {
	if ($(item).hasClass("post_ativo")) {
		$(item).removeClass("post_ativo");
		$(".mensagem_post_conteudo").slideUp();
	} else {
		$(item).addClass("post_ativo");
		$(item).next(".mensagem_post_conteudo").slideDown();
	}

	if ($(item).hasClass("mensagem_nao_lida")) {
		$(item).removeClass("mensagem_nao_lida");
	}
}
function showFormularioNovaMensagem() {
	$("#nova_mensagem").hide();
	$("#abas_mensagens").hide();
	$("#conteudo_mensagens").hide();
	$("#formulario_mensagem").show();
}

function hideFormularioNovaMensagem() {
	$("#formulario_mensagem").hide();
	$("#nova_mensagem").show();
	$("#abas_mensagens").show();
	$("#conteudo_mensagens").show();
}

















