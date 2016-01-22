var htmlContent = '';
var alunoVarObj = localStorage.objetoAlunoVariavel;
var alunoVar = parseInt(alunoVarObj.substring(19).split(",",1));
var listaOficinasAluno = [];
var listaIdOficinas = [];
var listaRotOficina = [];

function getOficinasAluno() {
	var retorno;

	$.ajax({
		url: path + "Oficina/ListarPorAluno/" + alunoVar,
		async: false,
		type: "GET",
		crossDomain: true,
		beforeSend:	function()		{ loading("inicial"); },
		success:	function(data)	{ retorno = data; },
		complete:	function()		{ loading("final"); }
	});

	return retorno;
}

function getBlogOficina(indexOficina) {
	var htmlBlog = '';
	
	for ( a in listaOficinasAluno ) {
		if ( a == indexOficina ) {
			$.ajax({
				url: path + "Blog/BlogOficina/" + listaOficinasAluno[a].idoficina,
				async: false,
				type: "GET",
				crossDomain: true,
				beforeSend: function() {
					loading("inicial");
				},
				success: function(d) {
					if ( d.length > 0 ) {		
						htmlBlog +=
							'<section class="Postagens_Container">';

						for (var i = d.length-1; i >= 0; i--) {
							if ( d[i].data ) {
								dia = d[i].data.slice(8);
								mes = d[i].data.slice(5,7);
								ano = d[i].data.slice(0,4);
							}
							var post = d[i].descricao.split('\n');
							htmlBlog +=
								'<article class="cx_postagem">'+
					        	   	'<h1 class="cx_titulo">'+d[i].titulo+'</h1>'+
					        	   	'<h2 class="cx_info">'+dia+'/'+mes+'/'+ano+'</h2>';

					        if ( d[i].imagem ) {
					        	htmlBlog +=
				        	    	'<img src="'+d[i].imagem+'" class="img_postagem" />';
			        	    }
			        	    for ( j in post ) {
			        	    	if ( post[j] != '' ) {
			        	    		htmlBlog +=
				        			'<p class="cx_texto">'+post[j]+'</p>';
				        		}
				        	}
							htmlBlog +=
				        	    	'<hr class="fim_postagem" />'+
				        		'</article>';
						}
						htmlBlog +=
							'</section>';
					}
				},
				complete: function(){
					loading("final");
				}
			});
		}
	}
	return htmlBlog;
}

function getRoteirosOficina(indexOficina) {
	var htmlRoteirosOficina = '';

	for ( a in listaOficinasAluno ) {
		if ( a == indexOficina ) {
			$.ajax({
				url: path + "ObjetivoAula/ListarPorOficinaHash/" + listaOficinasAluno[a].idoficina,
				async: false,
				type: "GET",
				crossDomain: true,
				beforeSend: function(){
					loading("inicial");
				},
				success: function(data) {
					//Inicia a contagem dos números dos roteiros
					var numRot = 1;

					//Verifica se existe algum roteiro associado a essa oficina
					if ( data.length > 0 ) {

						//Varre e retorna os roteiros
						for (var b in data) {
							//Cria um array de roteiros listados dessa oficina, para posterior acesso quando listar objetivos
							listaRotOficina[b] = data[b];

							//Cria a o html da linha de roteiro e sua descrição
							htmlRoteirosOficina +=
								'<div id="Oficina_Plan_Linha_'+numRot+'" class="Oficina_Plan_Linha">'+
		        		    	    '<div id="Oficina_Plan_Info_'+numRot+'" class="Oficina_Planejamento_Info" style="background-color: '+listaOficinasAluno[indexOficina].CorFraca+';" onclick="acordeon('+(numRot-1)+')">'+
		        		    	    	'<div class="Oficina_Id_Roteiro">'+data[b].idRoteiro_aula+'</div>'+
		        		    	        '<div class="Oficina_Plan_Num" style="background-color: '+listaOficinasAluno[indexOficina].CorForte+';">'+numRot+'</div>'+
		        		    	        '<div class="Oficina_Plan_Nome">'+data[b].roteiro+'</div>'+
		        		    	    '</div>'+
		        		    	    '<div id="Oficina_Plan_Itens_'+numRot+'" class="Oficina_Plan_Itens">'+
		        		    	        '<div class="Oficina_Plan_Desc Oficina_Plan_Item">Descrição: '+data[b].descricao+'</div>';

		        		   	// Recursos de aprendizagem: 
							/*'<div class="Oficina_Plan_Recursos Oficina_Plan_Item">'+
						        '<div class="Oficina_Recurso Rec_Livro">Lorem ipsum dolor sit amet</div>'+
						        '<div class="Oficina_Recurso Rec_Video">Consectetur adipiscing elit</div>'+
						    '</div>'+*/

						    //Encerra o html da linha do roteiro
			        		htmlRoteirosOficina +=
		        		    	    '</div>'+
		        		    	'</div>';

		        		    //Incrementa o número dos roteiros
		        		   	numRot++;
		        		}
		        	}
				},
				complete: function(){
					loading("final");
				}
			});
		}
	}
	return htmlRoteirosOficina;
}

function ativarAba(indexOficina) {
	

	var abas = $('.aba_oficina');

	for ( var i = 0; i < abas.length; i++ )
	{
		if ( i == indexOficina )
		{
			if ( !$($(abas).get(i)).hasClass('aba_ativa') )
			{
				$($(abas).get(i)).addClass('aba_ativa');
			}
		}
		else
		{
			$($(abas).get(i)).removeClass('aba_ativa');
		}
	}

	var roteiros = getRoteirosOficina(indexOficina);
	if ( roteiros )
	{
		$('.Acordeon_Oficina').html(roteiros);
	}
	else
	{
		var roteirosVazio =
		 '<div class="Mensagem_Roteiro_Vazio">'+
		 	'No momento, não existe nenhum roteiro associado a esta oficina.'+
		 '</div>';
		 $('.Acordeon_Oficina').html(roteirosVazio);
	}

	var blog = getBlogOficina(indexOficina);
	if ( blog )
	{
		$('#Postagens_Oficina').html(blog);
	} 
	else 
	{
		var blogVazio = 
			'<div class="Mensagem_Blog_Vazio">'+
				'No momento, não existem postagens no blog desta oficina.'+
			'</div>';
		$('#Postagens_Oficina').html(blogVazio)
	}
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

$(document).ready(function(){
	requestOficinasAluno();
});


function requestOficinasAluno() {
	var oficinas = getOficinasAluno();
	var htmlOficinas = new String();

	if ( oficinas.length > 0 ) {
		htmlOficinas += "<table>";
		htmlOficinas +=		"<tr>";

		for ( i in oficinas ) {
			listaOficinasAluno[i] = oficinas[i];

			htmlOficinas += "<td>";
			htmlOficinas += 	"<div id=\"oficina"+oficinas[i].idoficina+"\" class=\"aba_oficina\" onclick=\"ativarAba("+i+")\">";
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
function requestBlogPorOficina(idOficina) {
	var blog = getBlogOficina(idOficina);
	var htmlBlog = new String();

	if ( blog.length > 0 ) {
		htmlBlog += "<div class=\"Postagens_Container\">";

		for ( var i = blog.length-1; i >= 0; i-- ) {
			var dia = blog[i].data.slice(8);
			var mes = blog[i].data.slice(5,7);
			var ano = blog[i].data.slice(0,4);
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
		htmlBlog =	"<div class=\"Postagens_Container\">";
		htmlBlog +=		"<p class=\"feedback_oficinas_false\">Ainda não foram realizadas postagens para esta oficina.</p>";
		htmlBlog += "</div>";
	}
}
/*


*/