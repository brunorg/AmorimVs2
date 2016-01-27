var listaOficinasAluno = [];

$(document).ready(function(){
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

function requestOficinasAluno() {
	var alunoVarObj = JSON.parse(localStorage.objetoAlunoVariavel);

	var oficinas = getOficinasAluno(alunoVarObj.idalunoVariavel);
	var htmlOficinas = new String();

	if ( oficinas.length > 0 ) {
		htmlOficinas += "<table>";
		htmlOficinas +=		"<tr>";


		for ( i in oficinas ) {
			listaOficinasAluno[i] = oficinas[i];
			console.info("Nome: "+oficinas[i].nome+", id: "+oficinas[i].idoficina);

			htmlOficinas += "<td>";
			htmlOficinas += 	"<div id=\"oficina"+oficinas[i].idoficina+"\" class=\"aba_oficina\" onclick=\"accessOficina("+oficinas[i].idoficina+", \'"+oficinas[i].tipoOficina.cor.forte+"\', \'"+oficinas[i].tipoOficina.cor.medio+"\', \'"+oficinas[i].tipoOficina.cor.fraco+"\')\">";
			htmlOficinas +=			"<p class=\"barra_cor_of\" style=\"background:"+oficinas[i].tipoOficina.cor.forte+"\">&nbsp;</p>";
			htmlOficinas +=			"<p class=\"titulo_of\">"+oficinas[i].tipoOficina.nome+"</p>";
			htmlOficinas +=		"</div>";
			htmlOficinas +=	"</td>";
		}

		htmlOficinas +=		"</tr>";
		htmlOficinas += "</table>";
	} else {
		htmlOficinas = "<p class=\"feedback_oficinas_false\">Você ainda não está matriculado em nenhuma oficina.</p>";
	}

	$("#lista_oficinas").html(htmlOficinas);
}
function requestBlogPostagensPorOficina(idOficina) {
	var blog 	 = getBlogPostagensPorOficina(idOficina);
	var htmlBlog = new String();

	if ( blog.length > 0 ) {
		htmlBlog += "<div class=\"Postagens_Container\">";

		for ( var i = blog.length-1; i >= 0; i-- ) {
			var dia 	 = blog[i].data.slice(8);
			var mes		 = blog[i].data.slice(5,7);
			var ano 	 = blog[i].data.slice(0,4);
			var conteudo = blog[i].descricao.split('\n');

			htmlBlog += "<article class=\"cx_postagem\">";
	        htmlBlog +=	   	"<h1 class=\"cx_titulo\">"+blog[i].titulo+"</h1>";
	        htmlBlog +=	   	"<h2 class=\"cx_info\">"+dia+'/'+mes+'/'+ano+"</h2>";

	        if ( blog[i].imagem ) { htmlBlog += "<img src=\""+blog[i].imagem+"\" class=\"img_postagem\" />" };
    	    for ( j in conteudo ) { htmlBlog += post[j] ? "<p class=\"cx_texto\">"+post[j]+"</p>": ""; }

			htmlBlog += 	"<hr class=\"fim_postagem\" />";
        	htmlBlog +=	"</article>";
		}
		htmlBlog += "</div>";
	} else {
		htmlBlog +=	"<div class=\"Postagens_Container\">";
		htmlBlog +=		"<p class=\"feedback_oficinas_false\">Ainda não foram realizadas postagens para esta oficina.</p>";
		htmlBlog += "</div>";
	}
}
function requestRoteirosPorOficina(idoficina, corForte, corMedia, corFraca) {
	var roteiros 	 = getRoteirosPorOficina(idoficina);
	var htmlRoteiros = new String();

	if (roteiros.length > 0) {
		var roteiroNumero = 1;
		for ( var a in roteiros ) {
			htmlRoteiros += "<div id=\"roteiro_"+roteiros[a].idroteiro_aula+"\" class=\"oficina_plan_linha\">";
			htmlRoteiros += 	"<div class=\"oficina_planejamento_info\" style=\"background-color: "+corFraca+";\" onclick=\"acordeon("+roteiros[a].idroteiro_aula+")\">";
    		htmlRoteiros +=			"<div class=\"Oficina_Plan_Num\" style=\"background-color: "+corForte+";\">"+roteiroNumero+"</div>";
    		htmlRoteiros +=			"<div class=\"Oficina_Plan_Nome\">"+roteiros[a].roteiro+"</div>";
    		htmlRoteiros +=		"</div>";
    		htmlRoteiros +=		"<div class=\"Oficina_Plan_Itens\">";
    		htmlRoteiros +=			"<div class=\"Oficina_Plan_Desc Oficina_Plan_Item\">Descrição: "+roteiros[a].descricao+"</div>";
			htmlRoteiros +=			"<div class=\"Oficina_Plan_Recursos Oficina_Plan_Item\">";
			htmlRoteiros +=				"<div class=\"Oficina_Recurso Rec_Livro\">Lorem ipsum dolor sit amet</div>";
			htmlRoteiros +=				"<div class=\"Oficina_Recurso Rec_Video\">Consectetur adipiscing elit</div>";
			htmlRoteiros +=			"</div>";
    		htmlRoteiros +=		"</div>";
    		htmlRoteiros +=	"</div>";

    		roteiroNumero++;
    	}
	} else {
		htmlRoteiros +=	"<p class=\"feedback_oficinas_false\">Ainda não há nenhum roteiro cadastrado para esta oficina.</p>";
	}
	return htmlRoteiros;
}

function accessOficina(idoficina, corForte, corMedia, corFraca) {
	$(".aba_oficina").removeClass("aba_ativa");
	$("#oficina"+idoficina).addClass("aba_ativa");

	var postagens 	= requestBlogPostagensPorOficina(idoficina);
	var roteiros 	= requestRoteirosPorOficina(idoficina,corForte,corMedia,corFraca);

	$("#Postagens_Oficina").html(postagens);
	$(".Acordeon_Oficina").html(roteiros);
}
function acordeon(index) {
	var roteirosLista = $('.Oficina_Planejamento_Info');
	var htmlObjContent = '';
	var numObj = 0;

	for ( var i = 0; i < roteirosLista.length; i++ ) {
		if ( i == index ) {
			if ( $($('.Oficina_Plan_Itens').get(i)).hasClass('expandido') ) {
				$($('.Oficina_Plan_Itens').get(i)).slideUp();
				$($('.Oficina_Plan_Itens').get(i)).removeClass('expandido');
			} else {
				if ( !$($('.Oficina_Plan_Itens').get(i)).hasClass('ObjsListados') ) {
					for ( c in listaRotOficina) {

						// Seleciona o que foi clicado
						if ( c == index ) {

							// Faz uma requisição para retornar os objetivos daquele roteiro
							$.ajax({
						    	url: path + 'ObjetivoAula/ListarPorRoteiro/' + listaRotOficina[c].idRoteiro_aula,
						    	async: false,
						    	type: "GET",
						    	crossDomain: true,
						   		beforeSend: function(){
						   			loading("inicial");
						   		},
						    	success: function(dataObj) {
						    		for ( a in dataObj ) {
						    			var classObj;

						    			// Verifica o status do objetivo
							    		switch (dataObj[a].status) {
											case 0:
												classObj = '';
											break;
											
											case 1: 
												classObj = ' Aberto';
											break;

											case 2: 
												classObj = ' Entregue';
											break;
										}

										// Gera o código html para os objetivos
										htmlObjContent +=
										'<div class="Oficina_Plan_Item Oficina_Plan_Obj">Objetivo: '+
											dataObj[a].objetivo+
											'<div class="Oficina_Plan_Quadrado'+classObj+'">&nbsp;</div>'+
										'</div>';
										numObj++;
						    		}
						    	},
								complete: function(){
									loading("final");
								}
							});
						}
					}
					$('#Oficina_Plan_Itens_'+(index+1)).append(htmlObjContent);
					$($('.Oficina_Plan_Itens').get(i)).addClass('ObjsListados');
				}
				$($('.Oficina_Plan_Itens').get(i)).slideDown();
				$($('.Oficina_Plan_Itens').get(i)).addClass('expandido');
			}
		} else {
			$($('.Oficina_Plan_Itens').get(i)).slideUp();
			$($('.Oficina_Plan_Itens').get(i)).removeClass('expandido');
		}
	}
}