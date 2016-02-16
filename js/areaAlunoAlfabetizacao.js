function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

$(document).ready(function() {
<<<<<<< HEAD
=======
	$('#conteudo_oficina').load('oficinasAlfabetizacao.html');

>>>>>>> origin/master
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
	$("#destinatarios_container").find(".destinatario").change(function() {
		countDestinatarios();
	});
	$(".mensagem_recebida").click(function() {
		toggleMensagemRecebida(this);
	});
	$(".mensagem_enviada").click(function() {
		toggleMensagemEnviada(this);
	});
<<<<<<< HEAD
=======
	$("#destinatarios_trigger").click(function() {
		$(this).toggleClass("destinatarios_ativo");
	});
	$("#nova_mensagem").click(function() {
		showFormularioNovaMensagem();
	});
	$("#cancelar_acao").click(function() {
		verifyFormulario("cancelar");
	});

	$(".aba_mural").click(function(){
		toggleTabMural();
	});
>>>>>>> origin/master

	$(".aba_oficina").filter(":first").trigger("click");
	$(".aba_box_lateral").filter(":first").trigger("click");
	$("#abas_mensagens").children("span").filter(":first").trigger("click");

	$("#blog_oficina_container").mCustomScrollbar({axis: "y"});
	$("#mural_container").mCustomScrollbar({axis: "y"});

	var urlParams = getQueryParams(document.location.search)

	if (urlParams["aba"]) {
		$('#parteDoC2').hide()
	} else {
		$('#Conteudo_Area').hide()
	}

	cr_createRuntime("c2canvas");

});

window.onload = function() {

}

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

	if ($(accordionItem).hasClass("planejamento_aberto")) {
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

	if ($(tab).is(":nth-child(1)")) {
		$("#mensagens_entrada").show();
		$("#mensagens_enviadas").hide();
	} else {
		$("#mensagens_entrada").hide();
		$("#mensagens_enviadas").show();
	}
}
function toggleMensagemRecebida(item) {
	$(".mensagem_recebida").not(item).removeClass("post_ativo");
	$(".mensagem_recebida").not(item).next(".mensagem_recebida_conteudo").slideUp();

	if ($(item).hasClass("post_ativo")) {
		$(item).removeClass("post_ativo");
<<<<<<< HEAD
		$(".mensagem_post").show();
		$(".mensagem_post_conteudo").hide();
=======
		$(item).next(".mensagem_recebida_conteudo").slideUp();

		switchBotoes("back")
>>>>>>> origin/master
	} else {
		$(".mensagem_post").not(item).hide();
		$(item).addClass("post_ativo");
<<<<<<< HEAD
		$(item).next(".mensagem_post_conteudo").show();
=======
		$(item).next(".mensagem_recebida_conteudo").slideDown();

		switchBotoes("read_inbox");
>>>>>>> origin/master
	}

	if ($(item).hasClass("mensagem_nao_lida")) {
		$(item).removeClass("mensagem_nao_lida");
	}
}
<<<<<<< HEAD



=======
function toggleMensagemEnviada(item) {
	$(".mensagem_enviada").not(item).removeClass("post_ativo");
	$(".mensagem_enviada").not(item).next(".mensagem_enviada_conteudo").slideUp();

	if ($(item).hasClass("post_ativo")) {
		$(item).removeClass("post_ativo");
		$(item).next(".mensagem_enviada_conteudo").slideUp();

		switchBotoes("back")
	} else {
		$(item).addClass("post_ativo");
		$(item).next(".mensagem_enviada_conteudo").slideDown();

		switchBotoes("read_sent");
	}
}
function switchBotoes(estado) {
	switch (estado) {
		case "read_inbox":
			$("#bottom_btns").find("div:nth-child(1)").hide();
			$("#bottom_btns").find("div:nth-child(2)").show();
			$("#bottom_btns").find("div:nth-child(3)").hide();
			$("#bottom_btns").find("div:nth-child(4)").show();
			$("#bottom_btns").find("div:nth-child(5)").show();
		break;
		case "read_sent":
			$("#bottom_btns").find("div:nth-child(1)").hide();
			$("#bottom_btns").find("div:nth-child(2)").show();
			$("#bottom_btns").find("div:nth-child(3)").hide();
			$("#bottom_btns").find("div:nth-child(4)").hide();
			$("#bottom_btns").find("div:nth-child(5)").show();
		break;
		case "form":
			$("#bottom_btns").find("div:nth-child(1)").show();
			$("#bottom_btns").find("div:nth-child(2)").hide();
			$("#bottom_btns").find("div:nth-child(3)").show();
			$("#bottom_btns").find("div:nth-child(4)").hide();
			$("#bottom_btns").find("div:nth-child(5)").hide();
		break;
		case "back":
			$("#bottom_btns").find("div:nth-child(1)").hide();
			$("#bottom_btns").find("div:nth-child(2)").show();
			$("#bottom_btns").find("div:nth-child(3)").hide();
			$("#bottom_btns").find("div:nth-child(4)").hide();
			$("#bottom_btns").find("div:nth-child(5)").hide();
		break;
	}
}
function showFormularioNovaMensagem() {
	$("#nova_mensagem").hide();
	$("#abas_mensagens").hide();
	$("#conteudo_mensagens").hide();
	$("#formulario_mensagem").show();

	switchBotoes("form");
}
function hideFormularioNovaMensagem() {
	$("#formulario_mensagem").hide();
	$("#nova_mensagem").show();
	$("#abas_mensagens").show();
	$("#conteudo_mensagens").show();
}
>>>>>>> origin/master

function toggleTabMural() {

	$('#mural_posts_container').html("");

	$.ajax({
		url: path + "MuralAluno/ListarAluno/" + getAVariavelByAluno(alunoID),
		async: false,
		crossDomain: true,
		type: "GET",
		success: function (data){

			for(var valor of data)
			{
				var html = "";

				html += '<div class="mural_post">'
				html += '	<h1>'
				html += '		<span>'+valor.mural.professor.nome+'</span>'
				html += '		<span>'+(valor.mural.data).replace(/-/g,"/")+'</span>'
				html += '	</h1>'
				html += '	<p>'+valor.mural.mensagem+'</p>'
				html += '</div>	'
				
				$('#mural_posts_container').append(html);

			}
		
		}
	});

	cleraFormularioNovaMensagem();
	switchBotoes("back");
}
function countDestinatarios() {
	var selecionados = $("#destinatarios_container").find("input").filter(":checked");
	var idSelecionados = "";

	for (var a = 0; a < selecionados.length; a++ ) {
		if ( a < selecionados.length-1)
			idSelecionados += selecionados[a].id + ",";
		else
			idSelecionados += selecionados[a].id;
	}

	if (selecionados.length === 1)
		$("#destinatarios_trigger").val(selecionados.length + " selecionado");
	else if (selecionados.length > 1)
		$("#destinatarios_trigger").val(selecionados.length + " selecionados");
	else
		$("#destinatarios_trigger").val("");

	$("#destinatarios_mensagem").val(idSelecionados)
}
function verifyFormulario(acao) {
	if (acao === "cancelar") {
		if ( $("#destinatarios_trigger").val() != "" || $("#assunto_mensagem").val() != "" || $("#conteudo_mensagem").val() != "")
			mensagem("Tem certeza que deseja cancelar? Todo o progresso será perdido.", "OK", "bt_ok", "confirm", "", "", "hideFormularioNovaMensagem");
		else
			hideFormularioNovaMensagem();
	}
}
function cleraFormularioNovaMensagem() {
	$("#destinatarios_trigger").val("");
	$("#assunto_mensagem").val("");
	$("#conteudo_mensagem").val("");
	$("#destinatarios_mensagem").val("");
	$("#destinatarios_container").find("input:checkbox").prop("checked",false);
}