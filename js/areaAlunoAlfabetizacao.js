//----------------Variaveis-----------------------------------------

	var d = new Date
	var diaHoje = d.getDay() != (0 || 6) ? d.getDay():1;
	var horarios = [7, 8, 9, 10, 11]

	var diasSemana = {
		"1" : "Segunda",
		"2" : "Terça",
		"3" : "Quarta",
		"4" : "Quinta",
		"5" : "Sexta"
	}

	//Blog Oficina

	var categorias = {
		"aba_roteiros" : 102,
		"aba_tutoria" : 102,
		"aba_leitura_escrita" : 102,
		"aba_educacao_fisica" : 104,
		"aba_artes" : 102,
		"aba_matematica" : 102,
		"aba_ingles" : 102,
		"aba_arte_ciencia" : 102

	}

//---------------------------------------------------------
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
	

	$("body").click(function(){
		$("#menu_Aluno_Dropdown").removeClass("on_Menu_Aluno_Dropdown");
		$("#Menu_Dropdown_Lista_Aluno").hide();
	});
	

	$("#Menu_Superior_Nome_Aluno, #menu_Aluno_Dropdown").click(function(event){
		event.stopPropagation();
		toggleMenuAlunoDireita();
	});



	var urlParams = getQueryParams(document.location.search)

	//loading("inicial");

	if (urlParams["aba"]) {

		loadContent(urlParams["aba"]);
		$("#parteDoC2").remove();

	} else {
		
		loadC2();
	}

});



//------------------------------------------------------------
//
//			INIT
//
//------------------------------------------------------------

	function loadC2(){

		$("#parteDoC2").css('position', 'relative');
		$("#c2canvasdiv").css('height', '628px');
		$('#Conteudo_Area').hide();

		//loading("final");

	}

	function loadContent(aba){

		listarDestinatarios();
		loadBlogCategorias();

		//------------------------------------------------------------------


			$(".aba_oficina").click(function(){
				//loading("inicial");
				var self = this;

				//if(!$(self).hasClass('aba_ativa'))
					$.when(function(){return loading("inicial");}).done(function(){ return toggleTabOficina(self);}).done(function(){ return loading("final");});
				
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
			$("#destinatarios_trigger").click(function() {
				$(this).toggleClass("destinatarios_ativo");
			});
			$("#nova_mensagem").click(function() {
				showFormularioNovaMensagem();
			});


			$("#enviar_mensagem").click(function() {
				ResponderMensagem();
			});



			$("#cancelar_acao").click(function() {
				verifyFormulario("cancelar","");
			});

			$("#responder_mensagem").click(function() {
				var numero = ($('.mensagem_post_conteudo:visible').attr('id')).replace('msgContent_','');
				replyMensagem(numero);
			});

			$("#deletar_mensagem").click(function() {
				var numero = ($('.mensagem_post_conteudo:visible').attr('id')).replace('msgContent_','');
			
				mensagem("Tem certeza que deseja excluir esta mensagem?", "OK", "bt_ok", "confirm", "", "", "hideFormularioNovaMensagem();deleteMensagem("+numero+");");
			});


			$(".mensagem_post").click(function() {
				toggleMensagem(this, true);
			});


			$('.tabela_rotina .seta_proximo').click(function(){
				mudarDataRotinaProxima();
			});

			$('.tabela_rotina .seta_anterior').click(function(){
				mudarDataRotinaAnterior();
			});

			$(".aba_mural").click(function(){
				toggleTabMural();
			});

			$(".aba_rotina").click(function(){
				toggleTabRotina();
			});


		//------------------------------------------------------------------

		$(".aba_box_lateral").filter(":first").trigger("click");
		$("#abas_mensagens").children("span").filter(":first").trigger("click");

		$("#acordeon_oficina_content").mCustomScrollbar({axis: "y"});
		$("#blog_oficina_container").mCustomScrollbar({axis: "y"});
		$("#conteudo_mensagens").mCustomScrollbar({axis: "y"});
		$("#mural_container").mCustomScrollbar({axis: "y"});


		$('#parteDoC2').hide();
		$("#Conteudo_Area").css('opacity', '1');

		$('.aba_'+aba).trigger("click");
		

		if(aba == "mensagens" ||
			aba == "rotina" ||
			aba == "mural")
			$(".aba_oficina").filter(":first").trigger("click");

		//loading("final");

	}


//------------------------------------------------------------
//
//			GETS
//
//------------------------------------------------------------

	function getObjetivosPorRoteiroOficina(idoficina, idroteiro) {
		var retorno;
		var d = new Date();
		var dataAtual = d.getFullYear() + "-" + ( (d.getMonth()+1) < 10 ? "0"+(d.getMonth()+1) : (d.getMonth()+1) ) + "-" + d.getDate();

		$.ajax({
			url: path + "ObjetivoAula/ListarOficinaRoteiroData/" + idoficina + "/" + idroteiro + "/" + dataAtual,
			async: false,
			type: "GET",
			crossDomain: true,
			//beforeSend: function() { loading("inicial"); },
			success: function(dataObj) { retorno = dataObj }
			//complete: function() { loading("final"); }
		});

		return retorno;
	}

	function getRoteirosPorOficinaData(idoficina) {
		var retorno;
		var d = new Date();
		var dataAtual = d.getFullYear() + "-" + ( (d.getMonth()+1) < 10 ? "0"+(d.getMonth()+1) : (d.getMonth()+1) ) + "-" + d.getDate();

		$.ajax({
			url: path + "RoteiroAula/ListarOficinaData/"+idoficina+"/"+dataAtual,
			async: false,
			type: "GET",
			crossDomain: true,
			//beforeSend: function()    { loading("inicial"); },
			success: function(dRoteiros) { retorno = dRoteiros; }
			//complete:  function()    { loading("final"); }
		})

		return retorno;
	}


	function getRoteiroAula() {
		var retorno;

		$.ajax({
			url: path + "RoteiroAula/",
			async: false,
			type: "GET",
			crossDomain: true,
			//beforeSend: function() 			{ loading("inicial"); },
			success: 	function(data) 		{ retorno = data; }
			//complete: 	function() 			{ loading("final"); }
		});

		return retorno;
	}

	function getOficinasAluno(idalunoVariavel) {
		var retorno;

		$.ajax({
			url: path + "Oficina/ListarPorAluno/" + idalunoVariavel,
			async: false,
			type: "GET",
			crossDomain: true,
			//beforeSend:	function()		{ loading("inicial"); },
			success:	function(data)	{ retorno = data; }
			//complete:	function()		{ loading("final"); }
		});

		return retorno;
	}


	function getImagemPorPostagem(idpostagem) {
		var retorno;

		$.ajax({
			url: path + "Blog/ImagemMed/" + idpostagem,
			type: "GET",
			async: false,
			crossDomain: true,
			success: function(dImagem) { retorno = dImagem; }
		});

		return retorno;
	}

	function getBlogPostagensPorOficina(idoficina) {
		var retorno;

		$.ajax({
			url: path + "Blog/BlogOficina/" + idoficina,
			async: false,
			type: "GET",
			crossDomain: true,
			//beforeSend: function() 			{ loading("inicial"); },
			success: 	function(data) 		{ retorno = data; }
			//complete: 	function() 			{ loading("final"); }
		});

		return retorno;
	}


	function getRotinaDiariaAluno(idalunoVariavel, dia) {
		var retorno;

		$.ajax({
			url: path+"Rotina/RotinaDiariaAluno/"+idalunoVariavel+"/"+dia,
			async: false,
			type: "GET",
			crossDomain: true,
			//beforeSend: function() 			{ loading("inicial"); },
			success: 	function(data) 		{ retorno = data; }
			//complete: 	function() 			{ loading("final"); }
		});

		return retorno;
	}


	function getMuralAluno(idalunoVariavel) {
		var retorno;

		$.ajax({
			url: path + "MuralAluno/ListarAluno/" + idalunoVariavel,
			async: false,
			type: "GET",
			crossDomain: true,
			//beforeSend: function() 			{ loading("inicial"); },
			success: 	function(data) 		{ retorno = data; }
			//complete: 	function() 			{ loading("final"); }
		});

		return retorno;
	}



	function getTipoOficina() {
		var retorno;

		$.ajax({
			url: path + "TipoOficina/",
			async: false,
			type: "GET",
			crossDomain: true,
			//beforeSend: function() 			{ loading("inicial"); },
			success: 	function(data) 		{ retorno = data; }
			//complete: 	function() 			{ loading("final"); }
		});

		return retorno;
	}

	function getMensagensUsuario(){
		var retorno;

		$.ajax({
			url: path+"Mensagens/Proprietario/"+usuarioId,
			async:false,
			type: "GET",
			crossDomain: true,
			success: function(dataMensagens) {retorno = dataMensagens;}
		});

		return retorno;
	}



	function getMensagemUnica(idMensagem){
		var retorno;

		$.ajax({
			url: path+"Mensagens/"+idMensagem,
			async:false,
			type: "GET",
			crossDomain: true,
			success: function(dataMensagens) {retorno = dataMensagens;}
		});

		return retorno;
	}


	function getDestinatariosUsuarios(){
		var retorno;

		$.ajax({
			url: path+"Usuario/ListarObjParte",
			async:false,
			type: "GET",
			crossDomain: true,
			success: function(data) {retorno = data;}
		});

		return retorno;
	}


	function getDestinatarioValores(usuario){
		var retorno;

		$.ajax({
			url: path+"Usuario/ListarUsuarioNome/"+usuario,
			async:false,
			type: "GET",
			crossDomain: true,
			success: function(data) {retorno = data;}
		});

		return retorno;
	}

	function mensagemLer(idMensagem){
		

		$.ajax({
			url: path+"Mensagens/update/lida/"+idMensagem+"/S",
			async:false,
			type: "POST",
			success: function(d) {
				//console.log(d);
			}
		}); 

	}



//------------------------------------------------------------
//
//			Abas Oficina (Left)
//
//------------------------------------------------------------



	function toggleTabOficina(tab) {

		$(".aba_oficina").removeClass("aba_ativa");
		$(tab).addClass("aba_ativa");

		var classAbaAtiva = $(tab).attr("class").split(/\s+/)[1];
		toggleBarOficina(classAbaAtiva);

		carregaServicoBlog(classAbaAtiva);

		loadRoteirosAlfabetizacao(classAbaAtiva);

	}

	function toggleBarOficina(classOficina) {
		var oficina = classOficina.slice(4);
		$("#faixa_oficina").css("background-image","url(img/alfabetizacao/faixa_"+oficina+".png)");
	}


//------------------------------------------------------------
//
//			Blog
//
//------------------------------------------------------------


	function loadBlogCategorias(){

		var data = getOficinasAluno(getAVariavelByAluno(alunoID));
				
		for(var valor of data)
		{
			switch(valor.tipoOficina.idTipoOficina)
			{
				case 1:
					//categorias.aba_roteiros = valor.idoficina;
					//categorias.aba_tutoria = valor.idoficina;
				break;
				case 2:
					categorias.aba_educacao_fisica = valor.idoficina;
				break;
				case 3:
					categorias.aba_matematica = valor.idoficina;
				break;
				case 4:
					categorias.aba_artes = valor.idoficina;
				break;
				case 5:
					categorias.aba_leitura_escrita = valor.idoficina;
				break;
				case 6:
				break;
				case 7:
				break;
				case 8:
					categorias.aba_ingles = valor.idoficina;
				break;
				case 10:
					categorias.aba_arte_ciencia = valor.idoficina;
				break;
			}
		}

	}



	function carregaServicoBlog(classe) {

		//loading("inicial");

		var campo = classe;
		var result = getBlogPostagensPorOficina(categorias[campo]);


		var html = "";

		if(result.length > 0)
		{


			for(var valor of result)
			{


				html+= '<div class="cx_postagem">';
				html+= '	<h1 class="cx_titulo">'+valor.titulo+'</h1>';
				html+= '	<h2 class="cx_info" title="'+valor.autor.nome+'">'+reverseDate((valor.data).replace(/-/g,"/"))+' por '+abreviaNome(valor.autor.nome)+'</h2>';
				if(valor.imagem){
					html+= '	<img class="img_postagem" src="'+getImagemPorPostagem(valor.idblog)+'" alt="Espaço Catavento" />';
				}

				var findA = "<p>";
				var findB = "</p>";

				valor.descricao = valor.descricao.replace(new RegExp(findA, 'g'), "");
				valor.descricao = valor.descricao.replace(new RegExp(findB, 'g'), "");

				var paragrafos = (valor.descricao).split('\n');

				for(var p of paragrafos)
				{
					html+= '	<p class="cx_texto">'+p+'</p>';
				}
				html+= '	<hr class="fim_postagem" />';
				html+= '</div>';

			}

		} else {
			html +=	"<p class=\"feedback_oficinas_false\">Ainda não foram realizadas postagens para esta oficina.</p>";
		}

		//console.log(campo, result, categorias[campo]);

		$("#blog_postagens_container").html(html);


	}



//------------------------------------------------------------
//
//			Roteiros
//
//------------------------------------------------------------



	function loadRoteirosAlfabetizacao(classAbaAtiva){

		var idTipoOficina;
		var idOficina;
		var corForte;
		var corMedia;
		var corFraca;

		switch(classAbaAtiva)
		{
			case 'aba_educacao_fisica':
				idTipoOficina = 2;
			break;
			case 'aba_matematica':
				idTipoOficina = 3;
			break;
			case 'aba_artes':
				idTipoOficina = 4;
			break;
			case 'aba_leitura_escrita':
				idTipoOficina = 5;
			break;
			case 'aba_ingles':
				idTipoOficina = 8;
			break;
			case 'aba_roteiros':
				//idTipoOficina = 1;
				idTipoOficina = 0;
			break;
			case 'aba_tutoria':
				//idTipoOficina = 1;
				idTipoOficina = 0;
			break;
			case 'aba_arte_ciencia':
				idTipoOficina = 10;
			break;
		}

		var data = getOficinasAluno(getAVariavelByAluno(alunoID));

		for(var valor of data)
		{
			if(valor.tipoOficina.idTipoOficina == idTipoOficina)
			{
				corForte = valor.tipoOficina.cor.medio;
				corMedia = valor.tipoOficina.cor.fraco;
				corFraca = valor.tipoOficina.cor.forte;
				idOficina = valor.idoficina;
			}
		}

		filtroRoteirosAlfabetizacao(idTipoOficina, idOficina, corForte, corMedia, corFraca);

		
		//loading("final");
		

	}




	function filtroRoteirosAlfabetizacao(idTipoOficina, idOficina, corForte, corMedia, corFraca){

		var data = idOficina ? getRoteirosPorOficinaData(idOficina):[];


		$(".acordeon_oficina_title").html('<h2 style="color: '+corForte+'">Conteúdo</h2>');
		var html = "";

		var conteudo = false;

		var contador=0;

		if(data.length > 0)
		{

			if(idTipoOficina != 0 && idOficina){
				for(var valor of data)
				{

					var objetivosPorOficina = getObjetivosPorRoteiroOficina(idOficina, valor.idroteiro_aula);
					//if(valor.oficinaprofessor.oficina.tipoOficina.idTipoOficina == idTipoOficina){

						html+= '<div id="roteiro_'+valor.idroteiro_aula+'" class="oficina_planejamento">';
						html+= '	<div class="roteiro_info">';
						html+= '		<div class="roteiro_num_listagem" style="background-color: '+corForte+'">'+(++contador)+'</div>';
						html+= '		<div class="roteiro_nome" style="background-color: '+corMedia+';">'+valor.roteiro+'</div>';
						html+= '	</div>';
						html+= '	<div class="roteiro_conteudo">';
						html+= '		<div class="roteiro_descricao roteiro_item">Descrição: '+valor.descricao+'"</div>';
						
						for(var objetivos of objetivosPorOficina)
						{
							html+= '		<div class="roteiro_item">'+objetivos.objetivo+'</div>';
						}

						//html+= '		<div class="roteiro_recursos roteiro_item">';
						//html+= '			<div class="roteiro_recurso recurso_livro">Dona chica e seus gatos</div>';
						//html+= '			<div class="roteiro_recurso recurso_video">Atirando o pau no gato</div>';
						//html+= '		</div>';
						html+= '	</div>';
						html+= '</div>';

						conteudo = true;
					//}

				}
			} 

		} 

		if(data.length < 1 || !conteudo) {
			html +=	"<p class=\"feedback_oficinas_false\">Ainda não há nenhum roteiro cadastrado para esta oficina.</p>";
		}

		$('.acordeon_oficina').html(html);

		$(".oficina_planejamento").click(function(){
			triggerAccordion(this);
		});
	}



//------------------------------------------------------------
//
//			Mensagens
//
//------------------------------------------------------------


	function carregaValoresMensagens(aba){

		//loading("inicial");
		var result = getMensagensUsuario();

		var html = "";

		for(var valor of result)
		{
			if((aba == "aba_entrada" && valor.cxEntrada == "S") || (aba == "aba_enviadas" && valor.cxEnviada == "S"))
			{

				html += '<div id="msg_'+valor.idmensagens+'" class="mensagem_post '+(valor.lida == "N" ? "mensagem_nao_lida":"")+' '+aba+'">';
					if(aba == "aba_entrada"){
						var nome = valor.remetente.aluno ? valor.remetente.aluno.nome:valor.remetente.professor.nome;
						html += '	<h2 title="'+nome+'">'+abreviaNome(nome)+'</h2>';
					} else {
						var valorDestinatario = getDestinatarioValores(valor.destinatarios);
						if(valorDestinatario)
							var nome = valorDestinatario[0].aluno ? valorDestinatario[0].aluno.nome:valorDestinatario[0].professor.nome;
							html += '	<h2 title="'+nome+'">'+ abreviaNome(nome)+'</h2>';
					}

				html += '	<h1>'+valor.assunto+'</h1>';
				html += '</div>';
				html += '<div id="msgContent_'+valor.idmensagens+'" class="mensagem_post_conteudo">';
				html += '	<h3>'+reverseDate((valor.data).replace(/-/g,"/"))+'</h3>';
				html += '	<p>'+valor.mensagem+'</p>';
				html += '</div>';
			}
		}

		$("#mensagens_entrada").html(html);

		$(".mensagem_post").click(function() {
			toggleMensagem(this, $(this).hasClass('aba_entrada'));
		});

		//loading("final");
		switchBotoes("back");
	}


	function toggleTabMensagens(tab) {

		$("#abas_mensagens").find("span").removeClass("aba_mensagem_ativa");
		$(tab).addClass("aba_mensagem_ativa");
		carregaValoresMensagens($(tab).attr("class").split(' ')[0]);

	}

	function toggleMensagem(item, type) {
		if ($(item).hasClass("post_ativo")) {
			$(item).removeClass("post_ativo");
			$(".mensagem_post").show();
			$(".mensagem_post_conteudo").hide();
			switchBotoes("back");
		} else {
			$(".mensagem_post").not(item).hide();
			$(item).addClass("post_ativo");
			$(item).next(".mensagem_post_conteudo").show();
			if(type)
				switchBotoes("read_inbox");
			else
				switchBotoes("read_sent");

		}


		if ($(item).hasClass("mensagem_nao_lida")) {
			var idmsg = ($(item).attr("id")).replace(/msg_/g,"");
			mensagemLer(idmsg);
			$(item).removeClass("mensagem_nao_lida");
		}
	}

	function showFormularioNovaMensagem() {

		var resultado = getDestinatariosUsuarios();

		$("#destinatarios").multiselect('uncheckAll');
		var html = "";

		for(var valor of resultado){

			html += '<div class="destinatario">';
			html += '<input type="checkbox" id="aluno'+valor.idUsuario+'" value="'+valor.idUsuario+'"/>';
			html += '<label for="aluno1">'+valor.nome+'</label>';
			html += '</div>';

		}

		$('#destinatarios_container .destinatarios_itens').html(html);

		$("#nova_mensagem").hide();
		$("#abas_mensagens").hide();
		$("#conteudo_mensagens").hide();
		$("#formulario_mensagem").show();

		switchBotoes("form");


	}

	function switchBotoes(estado) {
		switch (estado) {
			case "read_inbox":
				$("#bottom_btns").find("div:nth-child(1)").hide();
				$("#bottom_btns").find("div:nth-child(2)").hide();
				$("#bottom_btns").find("div:nth-child(3)").hide();
				$("#bottom_btns").find("div:nth-child(4)").show();
				$("#bottom_btns").find("div:nth-child(5)").show();
			break;
			case "read_sent":
				$("#bottom_btns").find("div:nth-child(1)").hide();
				$("#bottom_btns").find("div:nth-child(2)").hide();
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

				$(".mensagem_post").removeClass("post_ativo");
				$(".mensagem_post").show();
				$(".mensagem_post_conteudo").hide();
			break;
		}
	}

	function deleteMensagem(numero)
	{
		
		var numeroMSG = numero;

		
			$.ajax({
			type: "GET",
			async:false,
			crossDomain: true,		
			url: path+"Mensagens/delete/"+numeroMSG,
			success:function(data){
				mensagem("Mensagem excluida com sucesso!","OK","bt_ok","sucesso");
				loading('final');
				$('#msg_'+numeroMSG).remove();
				$('#msgContent_'+numeroMSG).remove();
			}
			}).then(function(data) {
				

				$('#msg_'+numeroMSG).remove();
				$('#msgContent_'+numeroMSG).remove();

				loading('final');
			});
		
	}


	function replyMensagem(numero)
	{
		var assuntoReply = "RE : "+$('#msg_'+numero).find('h1').html();
		var conteudoReply = $('#msgContent_'+numero).find('p').html();

		var datamsg = getMensagemUnica(numero);


		showFormularioNovaMensagem();
		
		$('#destinatarios').multiselect() 

		$("#destinatarios").find("option."+datamsg.remetente.idusuario).prop('selected', true)

		$("#destinatarios").multiselect('refresh');

		$("#assunto_mensagem").val(assuntoReply);
		$("#conteudo_mensagem").val(conteudoReply);

	}


	function hideFormularioNovaMensagem() {
		$("#formulario_mensagem").hide();
		$("#nova_mensagem").show();
		$("#abas_mensagens").show();
		$("#conteudo_mensagens").show();

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

	function verifyFormulario(acao, funcao) {
		if (acao === "cancelar") {
			if ($("#assunto_mensagem").val() != "" || $("#conteudo_mensagem").val() != "")
				mensagem("Tem certeza que deseja cancelar? Todo o progresso será perdido.", "OK", "bt_ok", "confirm", "", "", "hideFormularioNovaMensagem();"+funcao);
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


	function listarDestinatarios(){

		//Lista usuarios
		var arrayUsuariosID = [];
		var arrayUsuariosNome = [];

		var dataUsuario = getDestinatariosUsuarios();

		for(var a=0; a< dataUsuario.length; a++){
			if (dataUsuario != null){
				var encontro = false;
			
				if(typeof dataUsuario[a].idProfessor != "undefined"){
					arrayUsuariosID[arrayUsuariosID.length] = dataUsuario[a].idProfessor;
					arrayUsuariosNome[arrayUsuariosNome.length] = dataUsuario[a].nome;
					perfil = 'Professor';
					encontro = true;
				} else if(typeof(dataUsuario[a].idAluno) != "undefined"){
					arrayUsuariosID[arrayUsuariosID.length] = dataUsuario[a].idAluno;
					arrayUsuariosNome[arrayUsuariosNome.length] = dataUsuario[a].nome;
					perfil = 'Aluno';
					encontro = true;
				}
				if(encontro){
					$("#frm_Envia_Mensagens #destinatarios").append('<option title="'+perfil+'" class="'+dataUsuario[a].idUsuario+'" value="'+dataUsuario[a].idUsuario+'">'+arrayUsuariosNome[arrayUsuariosNome.length-1]+'</option>')
				}
			}
		}

		$("#frm_Envia_Mensagens #destinatarios").append($("#frm_Envia_Mensagens #destinatarios option").remove().sort(function(a, b) {
		    var at = $(a).text(), bt = $(b).text();
		    return (at > bt)?1:((at < bt)?-1:0);
		}));

		
	}


	//Responde uma nova mensagem
	function ResponderMensagem()
	{
			


		$('#frm_Envia_Mensagens #remetente').attr("value", ""+usuarioId);

		if($('#conteudo_mensagem').val() != "" && $('#assunto_mensagem').val() != "" && $("#frm_Envia_Mensagens #destinatarios :selected").length > 0)
		{
			$.ajax({
			    url: path+"Mensagens/",
			    type: "POST",
			    data: "id=0&action=create&lida=1&remetente="+usuarioId+"&assunto="+$('#frm_Envia_Mensagens #assunto_mensagem').val()+"&destinatarios="+$('#frm_Envia_Mensagens #destinatarios').val()+"&mensagem="+$('#frm_Envia_Mensagens #conteudo_mensagem').val(),
		    	beforeSend: function()    {loading('inicial');},
		    	success: function(d) {
			    	dataMensagens 	=	getMensagensUsuario();

			    	hideFormularioNovaMensagem();
			    	
			    	
			    	
			    	window.setTimeout(function(){carregaValoresMensagens("aba_entrada");loading('final');mensagem("Mensagem enviada com sucesso!","OK","bt_ok","sucesso", "", "", "console.log('');");}, 1000);

			    },error: function() {

			    	loading('final');
			    	mensagem("Erro ao enviar mensagem!","OK","bt_ok","erro");
			    	dataMensagens 	=	getMensagensUsuario();
			    }
			}); 
		} else {
			mensagem("Algum campo está vazio, favor preencher todos!","OK","bt_ok","erro");
			loading('final');
		}
	}



//------------------------------------------------------------
//
//			Rotina
//
//------------------------------------------------------------


	function mudarDataRotinaProxima () {
		diaHoje = diaHoje != 5 ? (diaHoje+1):1;
		carregaValoresRotina();
	}


	function mudarDataRotinaAnterior () {
		diaHoje = diaHoje != 1 ? (diaHoje-1):5;
		carregaValoresRotina();
	}




	function toggleTabRotina() {
		carregaValoresRotina();
	}

	function carregaValoresRotina(){

		//loading("inicial");

		$('.tabela_rotina thead tr th.rotina_dia').html(diasSemana[diaHoje]);

		var periodoNumero = JSON.parse(localStorage.getItem('objetoAlunoVariavel')).periodo.idperiodo;

		var result = getRotinaDiariaAluno(getAVariavelByAluno(alunoID),diaHoje);
		
		var posicaoAdd = 0;

		for(var i=0; i<6;i++)
		{

			var html = '';

			if((periodoNumero == 8 && i == 3) || (periodoNumero == 9 && i == 2))
			{

				// RECREIO

				html+=  '<td style="background-color:#FBB040">';
				html+= 	'	<img src="img/alfabetizacao/horario_'+(periodoNumero == 8 ? 10:15)+'h00.png" alt="'+(periodoNumero == 8 ? 10:15)+'h00">';
				html+= 	'</td>';
				html+= 	'<td class="recreio" colspan="2">';
				html+= 	'</td>';

			} else {
				html+= '<td></td><td style="background-color:#ebeae5;"></td><td></td>';
			}

			$('.tabela_rotina tbody').find('tr:nth-child('+(i+1)+')').html(html);
		}






		result.forEach(function(value, i){

			var html = '';

			posicaoAdd = 0;
			
			var horaCondicao = value.hora;

			if((periodoNumero == 8 && value.oficina.periodo.periodo == "Manhã" && horaCondicao == 0) || (periodoNumero == 9 && value.oficina.periodo.periodo == "Tarde" && horaCondicao == 0))
			{


				html+=  '<td style="background-color:#FBB040">';
				html+= 	'	<img src="img/alfabetizacao/horario_'+(periodoNumero == 8 ? 10:15)+'h00.png" alt="'+(periodoNumero == 8 ? 10:15)+'h00">';
				html+= 	'</td>';
				html+= 	'<td class="recreio" colspan="2">';
				html+= 	'</td>';

				posicaoAdd = (value.oficina.periodo.periodo == "Manhã" ? 3:2)

			} else {

				//AULA NORMAL

					if(horaCondicao == 7 || horaCondicao == 13){
						posicaoAdd = 0;
					} else if(horaCondicao == 8 || horaCondicao == 14)
					{
						posicaoAdd = 1;
					} else if(horaCondicao == 9){
						posicaoAdd = 2;

					} else if(horaCondicao == 15){
						posicaoAdd = 3;

					} else if(horaCondicao == 10 || horaCondicao == 16){
						posicaoAdd = 4;

					} else if(horaCondicao == 11 || horaCondicao == 17){
						posicaoAdd = 5;

					}


					//To String

					if(horaCondicao == 10 || horaCondicao == 15){

						horaCondicao = horaCondicao+"h30";

					} else {

						horaCondicao = (horaCondicao < 10 ? ("0"+horaCondicao):horaCondicao)+"h00";
					}

					html+= '<td>';
					html+= '	<img src="img/alfabetizacao/horario_'+horaCondicao+'.png" alt="'+horaCondicao+'">';
					html+= '</td>';
					html+= '<td style="background-color: '+value.sala[0].rotina.oficina.tipoOficina.cor.forte+'">';
					html+= '	<div>'+value.oficina.tipoOficina.nome+'</div>';
					html+= '	<div title="'+value.professor+'">'+abreviaNome(value.professor)+'</div>';
					html+= '</td>';
					html+= '<td title="SALA DE INFORMÁTICA">'+value.sala[0].sala.sala+'</td>';
			
			}




			$('.tabela_rotina tbody').find('tr:nth-child('+(posicaoAdd+1)+')').html(html);

		});


		//loading("final");
	}

//------------------------------------------------------------
//
//			Mural
//
//------------------------------------------------------------


	function toggleTabMural() {

		$('#mural_posts_container').html("");

		var data = getMuralAluno(getAVariavelByAluno(alunoID));


		for(var valor of data)
		{
			var html = "";

			html += '<div class="mural_post">'
			html += '	<h1>'
			html += '		<span>'+valor.mural.professor.nome+'</span>'
			html += '		<span>'+reverseDate((valor.mural.data).replace(/-/g,"/"))+'</span>'
			html += '	</h1>'
			html += '	<p>'+valor.mural.mensagem+'</p>'
			html += '</div>	'
			
			$('#mural_posts_container').append(html);

		}
			
	}

//------------------------------------------------------------
//
//			
//
//------------------------------------------------------------

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

function toggleMenuAlunoDireita(){
	var ativo = $("#menu_Aluno_Dropdown").hasClass('on_Menu_Aluno_Dropdown');

	if(ativo) {
		$("#menu_Aluno_Dropdown").removeClass("on_Menu_Aluno_Dropdown");
		$("#Menu_Dropdown_Lista_Aluno").hide();
	} else {
		$("#menu_Aluno_Dropdown").addClass("on_Menu_Aluno_Dropdown");
		$("#Menu_Dropdown_Lista_Aluno").show();
	}
}


/* Reverse Date */


function reverseDate(str){
   return str.split('/').reverse().join('/');
}

