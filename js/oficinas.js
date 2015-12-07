var htmlContent = '';
var alunoVarObj = localStorage.objetoAlunoVariavel;
var alunoVar = parseInt(alunoVarObj.substring(19).split(",",1));
var listaOficinasAluno = [];
var listaIdOficinas = [];
var listaRotOficina = [];

function carregarOficinasAluno() {
	var htmlListaOficinas = '';

	$.ajax({
		url: path + "Oficina/ListarPorAluno/" + alunoVar,
		async: false,
		type: "GET",
		crossDomain: true,
		beforeSend: function(){
			loading("inicial");
		},
		success: function(data) {
			if ( data.length > 0 ) {
				
				//Cria o campo para as abas de oficina
				htmlListaOficinas +=
				'<table>'+
					'<tr>';

				//Inicia a listagem de oficinas
				for ( i in data ) {

					//Cria uma lista com as oficinas listadas
					listaOficinasAluno[i] = data[i];

					//Quebra o nome da oficina
					var nomeOficina = data[i].Nome.split(" ",1).toString();

					htmlListaOficinas += 
		        		'<td>'+
		        			'<div class="aba_oficina" onclick="ativarAba('+i+')">'+
		        				'<p class="barra_cor_of" style="background:'+data[i].CorForte+'">&nbsp;</p>'+
		        				'<p class="titulo_of">'+nomeOficina+'</p>'+
		        			'</div>'+
		        		'</td>';
				}

				//Fecha o campo para as abas de oficinas
				htmlListaOficinas +=
					'</tr>'+
				'</table>';
			} else {
				//Mensagem indicando que o aluno não está em nenhuma oficina
				mensagem("Você ainda não está matriculado em nenhuma oficina.","OK","bt_ok","alerta");
			}
		},
		complete: function(){
			loading("final");
		}
	});

	if ( listaOficinasAluno.length > 0 ) {
		$("#lista_oficinas").html(htmlListaOficinas);
		ativarAba(0);
	} else {
		$("#lista_oficinas").remove();
	}
}

function retornarBlogOficina(indexOficina) {
	var htmlBlog = '';
	
	for ( a in listaOficinasAluno ) {
		if ( a == indexOficina ) {
			$.ajax({
				url: path + "Blog/BlogOficina/" + listaOficinasAluno[a].idOficina,
				async: false,
				type: "GET",
				crossDomain: true,
				beforeSend: function() {
					loading("inicial");
				},
				success: function(d) {
					//Verifica se existe alguma postagem
					if ( d.length > 0 ) {
						//Inicia a seção de blog			
						htmlBlog +=
							'<section class="Postagens_Container">';

						//Varre e retorna as postagens
						for ( var i in d ) {
							//Divide a data da postagem em dia, mês e ano
							if ( d[i].data ) {
								dia = d[i].data.slice(8);
								mes = d[i].data.slice(5,7);
								ano = d[i].data.slice(0,4);
							}

							//Quebra a postagem em parágrafos
							var post = d[i].descricao.split('\n');

							//Cria a postagem e adiciona o título e a data
							htmlBlog +=
								'<article class="cx_postagem">'+
					        	   	'<h1 class="cx_titulo">'+d[i].titulo+'</h1>'+
					        	   	'<h2 class="cx_info">'+dia+'/'+mes+'/'+ano+'</h2>';

					        if ( d[i].imagem ) {
					        	//Carrega a imagem, se existir alguma.
					        	htmlBlog +=
				        	    	'<img src="'+d[i].imagem+'" class="img_postagem" />';
			        	    }

			        	    //Cria as tags <p> para cada parágrafo.
			        	    for ( j in post ) {
			        	    	if ( post[j] != '' ) {
			        	    		htmlBlog +=
				        			'<p class="cx_texto">'+post[j]+'</p>';
				        		}
				        	}

				        	//Encerra a postagem
							htmlBlog +=
				        	    	'<hr class="fim_postagem" />'+
				        		'</article>';
						}
						//Encerra a área do blog
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

function retornarRoteirosOficina(indexOficina) {
	var htmlRoteirosOficina = '';

	for ( a in listaOficinasAluno ) {
		if ( a == indexOficina ) {
			$.ajax({
				url: path + "ObjetivoAula/ListarPorOficinaHash/" + listaOficinasAluno[a].idOficina,
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

	for ( var i = 0; i < abas.length; i++ ) {
		if ( i == indexOficina ) {
			//Verifica se a aba clicada não está ativa
			if ( !$($(abas).get(i)).hasClass('aba_ativa') ) {
				$($(abas).get(i)).addClass('aba_ativa');
			}
		} else {
			//Inativa as outras abas
			$($(abas).get(i)).removeClass('aba_ativa');
		}
	}

	var roteiros = retornarRoteirosOficina(indexOficina);
	if ( roteiros ) {
		$('.Acordeon_Oficina').html(roteiros);
	} else {
		var roteirosVazio =
		 '<div class="Mensagem_Roteiro_Vazio">'+
		 	'No momento, não existe nenhum roteiro associado a esta oficina.'+
		 '</div>';
		 $('.Acordeon_Oficina').html(roteirosVazio);
	}

	var blog = retornarBlogOficina(indexOficina);
	if ( blog ) {
		$('#Postagens_Oficina').html(blog);
	} else {
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
	carregarOficinasAluno();
});