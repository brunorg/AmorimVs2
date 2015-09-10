$(document).ready(function(){

	var remetente = "";
	var data = "";
	var assunto = "";
	
	$(".mensagem_item").click(function(){
			/* Mudando CSS da caixinha de mensagem para ativo e selecionado */
			$(".mensagem_item:nth-child(odd)").css("background-color", "#E5E4DD");
			$(".mensagem_item:nth-child(even)").css("background-color", "#F2F2EE");
			$(".mensagem_item").removeAttr("id");
			$(this).css("background-color", "cornsilk").attr('id', 'selecionado');
			$("#selecionado .mensagem_status_nao_lido").removeClass("mensagem_status_nao_lido").addClass("mensagem_status_lido");
			
			/* Mudando CSS da mensagem que será exibida */
			var remetente = $("#selecionado .Remetente_mensagens").text();
			var data = $("#selecionado .Data_mensagens").text();
			var assunto = $("#selecionado .Assunto_mensagens").text();
			
			$("#Remetente_mensagem").text(remetente);
			$("#Data_mensagem").text(data);
			$("#Mensagem p").text(msg);
	});

	$("#bt_Excluir").click(function(){
		$("#selecionado").remove();
		$(".mensagem_item:nth-child(odd)").css("background-color", "#E5E4DD");
		$(".mensagem_item:nth-child(even)").css("background-color", "#F2F2EE");
	});


});