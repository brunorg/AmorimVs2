$(document).ready(function(){
	$(".scroll_receiver").mCustomScrollbar({ axis: "y" });
	
	requestOficinasAluno();
});

function getOficinasAluno(idalunoVariavel) {
	var retorno;

	$.ajax({
		url: path + "Oficina/ListarPorAluno/" + idalunoVariavel,
		async: false,
		type: "GET",
		crossDomain: true,
		beforeSend:	function()		{ loading("inicial"); },
		success:	function(data)	{ retorno = data; },
		complete:	function()		{ loading("final"); }
	});

	return retorno;
}
function getBlogPostagensPorOficina(idoficina) {
	var retorno;

	$.ajax({
		url: path + "Blog/", //path + "Blog/BlogOficina/" + idoficina,
		async: false,
		type: "GET",
		crossDomain: true,
		beforeSend: function() 			{ loading("inicial"); },
		success: 	function(dBlog) 	{ retorno = dBlog; },
		complete: 	function() 			{ loading("final"); }
	});

	return retorno;
}
function getRoteirosPorOficina(idoficina) {
	var retorno;

	$.ajax({
		url: path + "RoteiroAula/", //path + "ObjetivoAula/ListarPorOficinaHash/" + idoficina,
		async: false,
		type: "GET",
		crossDomain: true,
		beforeSend: function() 			{ loading("inicial"); },
		success:	function(dRoteiros) { retorno = dRoteiros; },
		complete: 	function()		 	{ loading("final"); }
	})

	return retorno;
}
function getObjetivosPorRoteiro(idroteiro) {
	var retorno;

	$.ajax({
		url: path + 'ObjetivoAula/ListarPorRoteiro/' + idroteiro,
		async: false,
		type: "GET",
		crossDomain: true,
		beforeSend: function() { loading("inicial"); },
		success: function(dataObj) { retorno = dataObj },
		complete: function() { loading("final"); }
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

function requestOficinasAluno() {
	var alunoVarObj = JSON.parse(localStorage.objetoAlunoVariavel);

	var oficinas = getOficinasAluno(alunoVarObj.idalunoVariavel);
	var htmlOficinas = new String();

	if ( oficinas.length > 0 ) {
		htmlOficinas += "<table class=\"tabela_oficinas\">";
		htmlOficinas +=		"<tr class=\"linha_abas\">";


		for ( var i in oficinas ) {
			htmlOficinas += "<td class=\"aba_oficina\" id=\"oficina"+oficinas[i].idoficina+"\" onclick=\"accessOficina("+oficinas[i].idoficina+", \'"+oficinas[i].tipoOficina.cor.forte+"\', \'"+oficinas[i].tipoOficina.cor.medio+"\', \'"+oficinas[i].tipoOficina.cor.fraco+"\')\">";
			htmlOficinas += 	"<div class=\"fundo_aba\" style=\"background:"+oficinas[i].tipoOficina.cor.forte+"\">&nbsp;</div>";
			htmlOficinas +=		"<p class=\"oficina_titulo\">"+oficinas[i].tipoOficina.nome+"</p>";
			htmlOficinas +=	"</td>";
		}

		htmlOficinas +=		"</tr>";
		htmlOficinas += "</table>";
	} else {
		htmlOficinas = "<p class=\"feedback_oficinas_false\">Você ainda não está matriculado em nenhuma oficina.</p>";
		$(".oficina_boxes_container").remove();
	}

	$("#lista_oficinas").html(htmlOficinas);

	$(".aba_oficina:first-child").trigger("click");
}
function requestBlogPostagensPorOficina(idOficina) {
	var blog 	 = getBlogPostagensPorOficina(idOficina);
	var htmlBlog = new String();

	if ( blog.length > 0 ) {
		htmlBlog += "<div class=\"postagens_container\">";

		for ( var i = blog.length-1; i >= 0; i-- ) {
			var dia 	 = blog[i].data.slice(8);
			var mes		 = blog[i].data.slice(5,7);
			var ano 	 = blog[i].data.slice(0,4);
			var conteudo = blog[i].descricao.split('\n');

			htmlBlog += "<article class=\"cx_postagem\">";
	        htmlBlog +=	   	"<h1 class=\"cx_titulo\">"+blog[i].titulo+"</h1>";
	        htmlBlog +=	   	"<h2 class=\"cx_info\">"+dia+'/'+mes+'/'+ano+"</h2>";

	        if ( blog[i].imagem ) {
	        	var imagem = requestImagemPorPostagem(blog[i].idblog);

	        	htmlBlog += imagem;
	        }

    	    for ( j in conteudo ) { htmlBlog += conteudo[j] ? "<p class=\"cx_texto\">"+conteudo[j]+"</p>": ""; }

			htmlBlog += 	"<hr class=\"fim_postagem\" />";
        	htmlBlog +=	"</article>";
		}

		htmlBlog += "</div>";
	} else {
		htmlBlog +=	"<p class=\"feedback_oficinas_false\">Ainda não foram realizadas postagens para esta oficina.</p>";
	}

	return htmlBlog;
}
function requestRoteirosPorOficina(idoficina, corForte, corMedia, corFraca) {
	var roteiros 	 = getRoteirosPorOficina(idoficina);
	var htmlRoteiros = new String();

	if (roteiros.length > 0) {
		var roteiroNumero = 1;
		htmlRoteiros += "<h2 style=\"color: "+corForte+";\">Conteúdo</h2>";

		for ( var a in roteiros ) {
			htmlRoteiros += "<div id=\"roteiro_"+roteiros[a].idroteiro_aula+"\" class=\"oficina_planejamento\">";
			htmlRoteiros += 	"<div class=\"roteiro_info\"onclick=\"toggleRoteiro("+roteiros[a].idroteiro_aula+")\">";
    		htmlRoteiros +=			"<div class=\"roteiro_num_listagem\" style=\"background-color: "+corForte+";\">"+roteiroNumero+"</div>";
    		htmlRoteiros +=			"<div class=\"roteiro_nome\" style=\"background-color: "+corFraca+";\">"+roteiros[a].roteiro+"</div>";
    		htmlRoteiros +=		"</div>";
    		htmlRoteiros +=		"<div class=\"roteiro_conteudo\">";
    		htmlRoteiros +=			"<div class=\"roteiro_descricao roteiro_item\">Descrição: "+roteiros[a].descricao+"</div>";
			//htmlRoteiros +=			"<div class=\"roteiro_recursos roteiro_item\">";
			//htmlRoteiros +=				"<div class=\"roteiro_recurso recurso_livro\">Lorem ipsum dolor sit amet</div>";
			//htmlRoteiros +=				"<div class=\"roteiro_recurso recurso_video\">Consectetur adipiscing elit</div>";
			//htmlRoteiros +=			"</div>";
    		htmlRoteiros +=		"</div>";
    		htmlRoteiros +=	"</div>";

    		roteiroNumero++;
    	}
	} else {
		htmlRoteiros +=	"<p class=\"feedback_oficinas_false\">Ainda não há nenhum roteiro cadastrado para esta oficina.</p>";
	}
	return htmlRoteiros;
}
function requestObjetivosPorRoteiro(idroteiro) {
	var objetivos = getObjetivosPorRoteiro(idroteiro);
	var htmlObjetivos = new String();

	if (objetivos.length > 0) {
		for (var a in objetivos) {
			var classObj = new String();

			if (objetivos[a].status === 1)
				classObj = "objetivo_aberto";
			else if (objetivos[a].status === 2)
				classObj = "objetivo_entregue";

			htmlObjetivos += "<div class=\"roteiro_item roteiro_objetivo\">";
			htmlObjetivos += 	"Objetivo: "+objetivos[a].objetivo;
			htmlObjetivos +=	"<div class=\"objetivo_status "+classObj+"\">&nbsp;</div>";
			htmlObjetivos += "</div>";
		}
	} else {
		htmlObjetivos += "<div calss=\"roteiro_item roteiro_objetivo\">Nenhum objetivo associado a este roteiro.</div>";
	}

	return htmlObjetivos;
}
function requestImagemPorPostagem(idpostagem) {
	var imagem = getImagemPorPostagem(idpostagem);
	var htmlImagem = new String();

	if (imagem.length) { htmlImagem += "<img src=\""+imagem+"\" class=\"img_postagem\" />"; }

	return htmlImagem;
}

function accessOficina(idoficina, corForte, corMedia, corFraca) {
	$(".aba_oficina").removeClass("aba_ativa");
	$("#oficina"+idoficina).addClass("aba_ativa");

	var postagens 	= requestBlogPostagensPorOficina(idoficina);
	var roteiros 	= requestRoteirosPorOficina(idoficina,corForte,corMedia,corFraca);

	$("#postagensContainer").html(postagens);
	$(".Acordeon_Oficina").html(roteiros);
}
function toggleRoteiro(idroteiro) {
	$(".oficina_planejamento").not("#roteiro_"+idroteiro).removeClass("roteiro_expandido");
	$(".oficina_planejamento").not("#roteiro_"+idroteiro).find(".roteiro_conteudo").slideUp();

	if (!$("#roteiro_"+idroteiro).hasClass("objetivos_listados")) {
		var objetivos = requestObjetivosPorRoteiro(idroteiro);

		$("#roteiro_"+idroteiro).addClass("objetivos_listados");
		$("#roteiro_"+idroteiro).find(".roteiro_conteudo").append(objetivos);
	}

	if ($("#roteiro_"+idroteiro).hasClass("roteiro_expandido")) {
		$("#roteiro_"+idroteiro).removeClass("roteiro_expandido");
		$("#roteiro_"+idroteiro).find(".roteiro_conteudo").slideUp();
	} else {
		$("#roteiro_"+idroteiro).addClass("roteiro_expandido");
		$("#roteiro_"+idroteiro).find(".roteiro_conteudo").slideDown();
	}
}