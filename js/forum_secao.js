//Murano Design

//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD

	var dataAluno 						=	getData("Alunos", null);
	var dataUsuario 					=	getData("Usuario", null);
	var dataRoteiro 					=	getData("Roteiro", null);
	var dataForumQuestao 				=	getData("ForumQuestao", null);
	var dataAlunoVariavel 				=	getData("AlunoVariavel", null);
	var dataForumResposta 				=	getData("ForumResposta", null);
	var dataProfessorFuncionario 		=	getData("ProfessorFuncionario", null);
	
	var dados;

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

	var userID = usuarioId;
	var IdAluno = getAlunoByUsuario();

//------------------------------------------------------------------------------------------------------------------------

//Carrega os dados da URL GET

	var IdRoteiro = base64_decode(GetURLParameter('IdRoteiro'));
	var IdQuestao = base64_decode(GetURLParameter('IdQuestao'));

	var unicoNomeRoteiro = getData("Roteiro", IdRoteiro);

//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery

$(document).ready(function(){
	

	//Se a Questão inicial existe ou não, caso não exista, está para criar um novo

	if(IdQuestao == undefined)
	{
		//StringHTML para o campo "Nova Questão"
		FirstBoxhtml = '<form id="frmCadastro_Questao">'+
							'<div class="Box_perguntar_wrap">'+
						'<div class="foto_aluno Me"> </div>'+
						'<div class="box_perguntar">'+
							'<div class="perguntar_header">'+
								'<div class="nome_serie_aluno">  </div>'+
							'</div>'+
							'<input type="hidden" name="id" id="id"  /> '+
							'<input type="hidden" name="action" id="action"   value="create"/>'+
							'<input type="text" name="questao" id="questao" class="Pergunta_Input" />'+
							'<input type="hidden" name="usuario" id="usuario" value="'+usuarioId+'">'+
							'<input type="hidden" name="roteiro" id="roteiro" value="'+IdRoteiro+'" >'+
							'<input type="file" name="anexo" id="anexo" size="45" style="display:none;" />'+
							'</div>'+
							'<div><input id="bt_pergunta_enviar" type="submit" value="Enviar" /></div>'+
							'</div>'+
						'</form>';

		$('#FORUM').append(FirstBoxhtml);
	}
	

	// Criando box da pergunta //
	$("#bt_pergunta_enviar").click(function(){
		
		//$('body').prepend('<div id="loader"><h2>Carregando...</h2></div>');

		var Pergunta = $("input.Pergunta_Input").val();
		var dt = new Date();
		var agora = dt.getDay() +"/"+ dt.getMonth() +"/"+ dt.getFullYear() +" "+ dt.getHours() +":"+ dt.getMinutes();
		var boxHtml = "";
		
		//Verifica se a pergunta é muito curta
		if($(".Pergunta_Input").val().length >= 10)
		{

	    	for(var a=0;a<dataAluno.length; a++)
	    	{

	    		//Se o usuario for um aluno
	    		if(dataAluno[a].idAluno == IdAluno && usuario == "Aluno")
	    		{
				
					/*Cadastro Questao*/
	    			dados = dataAluno[a];
					$("#frmCadastro_Questao").unbind('submit').on("submit", function(event) {
                    	
						
						
                    	event.preventDefault();

                    	var formData = new FormData($(this)[0]);

                    	$.ajax({
	                    url: path+"ForumQuestao/",
	                    type: "POST",
	                    mimeType:"multipart/form-data",
					    contentType: false,
				        cache: false,
				        processData:false,
	                    data: formData,

	                    	beforeSend: function(){
	                    		loading("inicial");
	                    	},
	                        
	            			success: function(d) {


	            				mensagem("Pergunta feita com sucesso!","OK","bt_ok","sucesso");
	            				//console.log('------');

	            				
	            				//$("#loader").remove();            				

	            				//$("#content_central").mCustomScrollbar("scrollTo",$('.Pergunta_Resposta_Container:last-child .Pergunta'));
					    		
								boxHtml = ' '+
	    						'<div class="Pergunta_Resposta_Container"> '+
	    						'<div class="Box_pergunta_wrap"> '+
	    							'<div class="foto_aluno" style="background-image:url('+dados.fotoAluno+')"> </div>'+
	    							'<div class="box_pergunta"> '+
	    								'<div class="pergunta_header"> '+
	    									'<div class="nome_serie_aluno"> '+dados.nome+" | "+getSerieAluno()+"º Série - "+getPeriodoAluno()+' </div> '+
	    									(IdAluno == dados.idAluno ? '<div id="bt_fechar" onclick="deletarMensagemQ('+ d + ')" style="float:right"></div>':'')+
	    								'</div> '+
	    								'<div class="Pergunta"> '+
	    								'</div> '+
	    							'</div> '+
	    						'</div> '+
	    						'<div class="respostas R_aparecer"> </div> '+
	    						'<div class="responder_ocultar bt_responder"> Responder </div>';
								
								
								$("#FORUM").append(boxHtml)
								
								$("#FORUM .Pergunta_Resposta_Container").last().attr("id","Q_S_"+d);
	            				$("#FORUM .Pergunta_Resposta_Container").last().find('a').attr("href",""+getFile(d , "ForumQuestao"));
						
								$("input.Pergunta_Input").val("");
								$(".Pergunta_Resposta_Container:last-child .Pergunta").html(Pergunta);
								
								
								return false;
	            			},error: function() {
	            				//console.log("Não modificado, verifique os campos.");
	            			},
	            			complete: function(){
	            				loading("final");
	            			}
	            		});	  

                	});

					
					
					
					
					
					//Se o usuario for um Professor
	    		} else if((dataProfessorFuncionario[a] != undefined ? (dataProfessorFuncionario[a].idprofessorFuncionario == IdAluno && usuario == "Professor"):false))
	    		{
	    			//console.log('aqui');

	    			boxHtml = ' '+
	    						'<div class="Pergunta_Resposta_Container" id="Q_S_0"> '+
	    						'<div class="Box_pergunta_wrap"> '+
	    							'<div class="foto_aluno" style="background-image:url('+dataProfessorFuncionario[a].fotoProfessorFuncionario+')"> </div> '+
	    							'<div class="box_pergunta"> '+
	    								'<div class="pergunta_header"> '+
	    									'<div class="nome_serie_aluno"> '+dataProfessorFuncionario[a].nome+' - Professor </div> '+
	    									(IdAluno == dataProfessorFuncionario[a].idprofessorFuncionario ? '<div id="bt_fechar" style="float:right"></div>':'')+

	    								'</div> '+
	    								'<div class="Pergunta"> '+
	    								'</div> '+
	    							'</div> '+
	    						'</div> '+
	    						'<div class="respostas R_aparecer"> </div> '+
	    						'<div class="responder_ocultar bt_responder"> Responder </div>';

					
					/*Cadastro Questao*/

					$("#frmCadastro_Questao").unbind('submit').on("submit", function(event) {
                    	
                    	event.preventDefault();

                    	var formData = new FormData($(this)[0]);

                    	$.ajax({
	                    url: path+"ForumQuestao/",
	                    type: "POST",
	                    mimeType:"multipart/form-data",
					    contentType: false,
				        cache: false,
				        processData:false,
	                    data: formData,

	                    beforeSend: function(){
	                    	loading("inicial");
	                    },
	                        
	            			success: function(d) {
	            				//console.log("Dados alterados com sucesso!");
                    		
                    			mensagem("Pergunta feita com sucesso!","OK","bt_ok","sucesso");
	            				
	            				$("#FORUM").append(boxHtml)

	            				$("#FORUM .Pergunta_Resposta_Container").last().attr("id","Q_S_"+d);
	            				$("#FORUM .Pergunta_Resposta_Container").last().attr("onclick", "deletarMensagemQ("+ d + ")");
	            				$("#FORUM .Pergunta_Resposta_Container").last().find('a').attr("href",""+getFile(d , "ForumQuestao"));
						
								$("input.Pergunta_Input").val("");
								$(".Pergunta_Resposta_Container:last-child .Pergunta").html(Pergunta);
								//$("#content_central").mCustomScrollbar("scrollTo",$('.Pergunta_Resposta_Container:last-child .Pergunta'));
					    		

	            			},error: function() {
	            				alert("Não modificado, verifique os campos.");
	            				
	            			},
	            			complete: function(){
	            				loading("final");
	            			}
	            		});

	            		$("#loader").remove();	  

                	});

	    		}



	    	}

		}
			//Caso a pergunta seja muito curta.
		else{ 

			$("#frmCadastro_Questao").unbind('submit').on("submit", function(event) {

				event.preventDefault();

			});

	//		alert("Sua pergunta está muito curta");
			mensagem("Sua pergunta está muito curta!","OK","bt_ok","erro");
			$("#loader").remove();
		}

	});
	
	// Criando box para responder //
	$(document).on('click', '.bt_responder', function() {

		//Mostr as Respostas antes de responder
		$(".selecionado .respostas").show();
		$(".selecionado .mostrar_respostas").removeClass("mostrar_respostas").addClass("ocultar_respostas").html("ocultar respostas");
	
		
			//Recebe dados JSON da tabela Alunos
			for(var a=0;a<dataAluno.length; a++)
	    	{
				var id = $('.selecionado').attr('id');
				id = id.split("_");
				
	    		if(dataAluno[a].idAluno == IdAluno && usuario == "Aluno")
	    		{
															
	    			htmlResposta = '<form class="frmCadastro_Resposta" id="Qr_S_0">'+
						    			'<div class="Box_resposta_wrap"> '+
							    			'<div class="foto_aluno" style="background-image:url('+dataAluno[a].fotoAluno+')"> </div> '+
								    			'<div class="box_resposta"> '+
									    			'<div class="resposta_header"> '+
										    			'<div class="nome_serie_aluno"> '+dataAluno[a].nome+" | "+getSerieAluno()+"º Série - "+getPeriodoAluno()+' </div> '+
									    			'</div> '+
								    				'<input type="hidden" name="action" id="action" value="create"> </input> '+
								    				'<input class="msg_input" name="resposta" id="resposta" type="text" placeholder="Escreva seu comentário."> </input> '+
													'<input type="file" name="anexo" id="anexo" size="45" style="display:none;" />'+

								    				'<input type="hidden" name="usuario" id="usuario" value="'+usuarioId+'"> </input> '+
								    				'<input type="hidden" name="forumQuestao" id="forumQuestao" value="'+id[2]+'"> </input> '+
								    			'</div> '+
								    			'<div class="bt_resposta_enviar_cancelar">'+
								    				'<input type="submit" class="enviar" value="enviar"></input> | <span class="cancelar"> cancelar </span> '+
								    			'</div> '+
							    			'</div> '+
						    			'</div>'+
					    			'</form>';
					

					$(".selecionado .respostas").append(htmlResposta);
					$(".selecionado .responder_ocultar").remove();
				} else if((dataProfessorFuncionario[a] != null ? dataProfessorFuncionario[a].idprofessorFuncionario == IdAluno && usuario == "Professor":false))
	    		{
					
	    			htmlResposta = '<form class="frmCadastro_Resposta" id="Qr_S_0">'+
						    			'<div class="Box_resposta_wrap"> '+
							    			'<div class="foto_aluno" style="background-image:url('+dataProfessorFuncionario[a].fotoProfessorFuncionario+')"> </div> '+
								    			'<div class="box_resposta"> '+
									    			'<div class="resposta_header"> '+
										    			'<div class="nome_serie_aluno"> '+dataProfessorFuncionario[a].nome+' - Professor </div> '+
									    			'</div> '+
								    				'<input type="hidden" name="action" id="action" value="create"> </input> '+
								    				'<input class="msg_input" name="resposta" id="resposta" type="text" placeholder="Escreva seu comentário."> </input> '+
													'<input type="file" name="anexo" id="anexo" size="45" style="display:none;" />'+
								    				'<input type="hidden" name="usuario" id="usuario" value="'+usuarioId+'"> </input> '+
								    				'<input type="hidden" name="forumQuestao" id="forumQuestao" value="'+id[2]+'"> </input> '+
								    			'</div> '+
								    			'<div class="bt_resposta_enviar_cancelar">'+
								    				'<input type="submit" class="enviar" value="enviar"></input> | <span class="cancelar"> cancelar </span> '+
								    			'</div> '+
							    			'</div> '+
						    			'</div>'+
					    			'</form>';
					

					$(".selecionado .respostas").append(htmlResposta);
					$(".selecionado .responder_ocultar").remove();
				}
			}
	});
	
	$(document).on("click", "span.cancelar", function(){
		$(".selecionado .respostas .Box_resposta_wrap").last("Box_resposta_wrap").remove();
		$(".selecionado").append('<div class="responder_ocultar"> <span class="bt_responder"> Responder </span> | <span class="ocultar_respostas"> ocultar respostas </span> </div>');
	});
	
	$(document).on("click", "span.ocultar_respostas", function(){
		$(".selecionado .respostas").hide();
		$(".selecionado .ocultar_respostas").removeClass("ocultar_respostas").addClass("mostrar_respostas").html("mostrar respostas");
	});
	
	$(document).on("click", "span.mostrar_respostas", function(){
		$(".selecionado .respostas").show();
		$(".selecionado .mostrar_respostas").removeClass("mostrar_respostas").addClass("ocultar_respostas").html("ocultar respostas");
	});
	
	// Sinalizando qual box de pergunta está sendo respondida //
	$("body").on('click', '.Pergunta_Resposta_Container', function() {
		$("div.Pergunta_Resposta_Container").removeClass("selecionado");
		$(this).removeClass("selecionado").addClass("selecionado");
	});

	$.ajax({
	    type: "GET",
	    crossDomain: true,
	    url: path+"ForumQuestao"
	        
	    }).then(function(data) {

	    	for(var a=0; a< data.length; a++)
	    	{

	    		//console.log(IdRoteiro, data[a].roteiro.idroteiro);

		    	if(data[a].roteiro.idroteiro == IdRoteiro)
		    	{

		    		var Respostas = getResposta(data[a].idforumQuestao);

		    		if(IdQuestao == data[a].idforumQuestao || IdQuestao == undefined)
		    		{
			    		
						if(data[a].usuario.aluno != undefined)
						{

							HtmlQuestoes = '<div class="Pergunta_Resposta_Container" id="Q_S_'+data[a].idforumQuestao+'"> '+
							'<div class="Box_pergunta_wrap"> '+
							'<div class="foto_aluno" style="background-image:url('+data[a].usuario.aluno.fotoAluno+')"> '+
							'</div> '+

							'<div class="box_pergunta">'+
							'<div class="pergunta_header">'+

							'<div class="nome_serie_aluno">'+data[a].usuario.aluno.nome+" | "+getSerieAluno(data[a].usuario.aluno.idAluno)+"º Série - "+getPeriodoAluno(data[a].usuario.aluno.idAluno)+' </div> '+
							(IdAluno == data[a].usuario.aluno.idAluno ? '<div id="bt_fechar" onclick="deletarMensagemQ('+data[a].idforumQuestao+');" style="float:right"></div>':'')+
							'</div> '+
							'<div class="Pergunta"> '+data[a].questao+' </div> '+
							'</div> '+
							'</div> '+
							'<div class="respostas'+(Respostas != "" ? "":" R_aparecer")+'"> '+Respostas+' </div> '+ (Respostas != "" ? '<div class="responder_ocultar"> <span class="bt_responder"> Responder </span> | <span class="mostrar_respostas"> mostrar respostas </span> </div>':'<div class="responder_ocultar bt_responder"> Responder </div>')
						
						} else if(data[a].usuario.professor != undefined){

							HtmlQuestoes = '<div class="Pergunta_Resposta_Container" id="Q_S_'+data[a].idforumQuestao+'"> '+
							'<div class="Box_pergunta_wrap"> '+
							'<div class="foto_aluno" style="background-image:url('+data[a].usuario.professor.fotoProfessorFuncionario+')"> '+
							'</div> '+
							'<div class="box_pergunta">'+
							'<div class="pergunta_header">'+
							'<div class="nome_serie_aluno">'+data[a].usuario.professor.nome+" | "+data[a].usuario.perfil.perfil+' </div> '+
							(IdAluno == data[a].usuario.professor.idprofessorFuncionario ? '<div id="bt_fechar" onclick="deletarMensagemQ('+data[a].idforumQuestao+');" style="float:right"></div>':'')+
							'</div> '+
							'<div class="Pergunta"> '+data[a].questao+' </div> '+
							'</div> '+
							'</div> '+
							'<div class="respostas'+(Respostas != "" ? "":" R_aparecer")+'"> '+Respostas+' </div> '+ (Respostas != "" ? '<div class="responder_ocultar"> <span class="bt_responder"> Responder </span> | <span class="mostrar_respostas"> mostrar respostas </span> </div>':'<div class="responder_ocultar bt_responder"> Responder </div>')
							
						}


						$('#FORUM').append(HtmlQuestoes);


		    		}


		    	}
		    		$('#Secao_forum_Titulo').html("<a id='Bk_Rot' href='forumSecao.html?IdRoteiro="+base64_encode(""+IdRoteiro)+"'>"+unicoNomeRoteiro.nome+"</a>"+( IdQuestao == undefined ? "":" > "+getNomeQuestao(IdQuestao)));
		    		/*console.log(data[a].roteiro.nome);
		    		$('#Secao_forum_Titulo').html(unicoNomeRoteiro.nome+"!!!");*/	    		
	    	}
	});
	
	
	// Criando box da resposta //

	$(document).on('click', '.frmCadastro_Resposta input.enviar', function() {
		if( $(".Pergunta_Resposta_Container.selecionado .msg_input").val() != "")
		{

		var msg = $(".Pergunta_Resposta_Container.selecionado input").val();
		var dt = new Date();
		var agora = dt.getDay() +"/"+ dt.getMonth() +"/"+ dt.getFullYear() +" "+ dt.getHours() +":"+ dt.getMinutes();

		$(".Pergunta_Resposta_Container.selecionado .Box_resposta_wrap").css("padding", "20px");
		$(".Pergunta_Resposta_Container.selecionado").append('<div class="responder_ocultar"> <span class="bt_responder"> Responder </span> | <span class="ocultar_respostas"> ocultar respostas </span> </div>');

			/*Cadastro Resposta*/
			
			$(this).parent().parent().parent().unbind('submit').on("submit", function(event) {  	
	            event.preventDefault();

	            var header = $(this).find('.resposta_header');

				var formData = new FormData($(this)[0]);

				$.ajax({
					url: path+"ForumResposta/",
					type: "POST",
					mimeType:"multipart/form-data",
					contentType: false,
					cache: false,
					processData:false,
					data: formData,
					success: function(d) {

						$(".bt_resposta_enviar_cancelar").remove();
						$(header.parent()).find('#resposta').attr("disabled","true");
						$(header.parent()).find('#resposta').attr("class","msg");
						$(header).append('<div id="bt_fechar" onclick="deletarMensagemR('+d+');" style="float:right"></div>');
						
						$('#Qr_S_0').attr("id","Qr_S_"+d);
						
					},error: function() {
						//console.log("Dados não salvos, favor verificar");
					}
				});

	        });
		}
	});

	for(var a=0;a<dataAluno.length; a++)
	{
		if(dataAluno[a].idAluno == IdAluno && usuario == "Aluno")
		{

	    	$('.foto_aluno').css("background-image", "url("+dataAluno[a].fotoAluno+")");
	    	$('.nome_serie_aluno').html(dataAluno[a].nome+" | "+getSerieAluno()+"º Série - "+getPeriodoAluno());

		} else if((dataProfessorFuncionario[a] != undefined ? (dataProfessorFuncionario[a].idprofessorFuncionario == IdAluno && usuario == "Professor"):false))
		{
			$('.foto_aluno').css("background-image", "url("+dataProfessorFuncionario[a].fotoProfessorFuncionario+")");
	    	$('.nome_serie_aluno').html(dataProfessorFuncionario[a].nome+" - Professor");
		}
	}
	
});

function getFile(ID, Tabela)
{
	var retorno;
	$.ajax({
	    type: "GET",
	    async:false,
	    crossDomain: true,
	    url: path+""+Tabela+"/"+ID
	        
	    }).then(function(data) {

	    	retorno = data.anexo;

	    });

	    return retorno;
}


function getPeriodoAluno(valorAluno)
{
	var retornoPeriodo;
	if(valorAluno == undefined)
	{
		valorAluno=IdAluno
	}


	for(var a=0; a< dataAlunoVariavel.length; a++){

		if(dataAlunoVariavel[a].aluno.idAluno == valorAluno)
		{
			retornoPeriodo = dataAlunoVariavel[a].periodo.periodo;
		}
	
	}

	return retornoPeriodo;
}

function getSerieAluno(valorAluno)
{
	var retornoSerie;
	if(valorAluno == undefined)
	{
		valorAluno=IdAluno
	}

	for(var a=0; a< dataAlunoVariavel.length; a++){

		if(dataAlunoVariavel[a].aluno.idAluno == valorAluno)
		{
			retornoSerie = dataAlunoVariavel[a].anoEstudo.ano;
		}
	
	}

	return retornoSerie;
}


function getResposta(valorPergunta)
{
	var retornoResposta = "";

	for(var a=0; a< dataForumResposta.length; a++){

		if(dataForumResposta[a].forumQuestao.idforumQuestao == valorPergunta)
		{

			if(dataForumResposta[a].usuario.aluno != undefined)
			{
				retornoResposta += '<div class="Box_resposta_wrap" id="Qr_S_'+dataForumResposta[a].idforumResposta+'"> '+
				'<div class="foto_aluno" style="background-image:url('+dataForumResposta[a].usuario.aluno.fotoAluno+')"> </div> '+
				'<div class="box_resposta"> '+
				'<div class="resposta_header"> '+
				'<div class="nome_serie_aluno"> '+dataForumResposta[a].usuario.aluno.nome+" | "+getSerieAluno(dataForumResposta[a].usuario.aluno.idAluno)+"º Série - "+getPeriodoAluno(dataForumResposta[a].usuario.aluno.idAluno)+' </div> '+
				(IdAluno == dataForumResposta[a].usuario.aluno.idAluno ? '<div id="bt_fechar" onclick="deletarMensagemR('+dataForumResposta[a].idforumResposta+');" style="float:right"></div>':'')+
				'</div> '+
				'<div class="msg"> '+dataForumResposta[a].resposta+' </div> '+
				'</div>  '+
				'</div>';
			} else if(dataForumResposta[a].usuario.professor != undefined)
			{
				retornoResposta += '<div class="Box_resposta_wrap" id="Qr_S_'+dataForumResposta[a].idforumResposta+'"> '+
				'<div class="foto_aluno" style="background-image:url('+dataForumResposta[a].usuario.professor.fotoProfessorFuncionario+')"> </div> '+
				'<div class="box_resposta"> '+
				'<div class="resposta_header"> '+
				'<div class="nome_serie_aluno"> '+dataForumResposta[a].usuario.professor.nome+" | "+getSerieAluno(dataForumResposta[a].usuario.professor.idprofessorFuncionario)+"º Série - "+getPeriodoAluno(dataForumResposta[a].usuario.professor.idprofessorFuncionario)+' </div> '+
				(IdAluno == dataForumResposta[a].usuario.professor.idprofessorFuncionario ? '<div id="bt_fechar" onclick="deletarMensagemR('+dataForumResposta[a].idforumResposta+');" style="float:right"></div>':'')+
				'</div> '+
				'<div class="msg"> '+dataForumResposta[a].resposta+' </div> '+
				'</div> '+
				'</div>';
			}
	
		}
	
	}

	return retornoResposta;
}


//Pegar Aluno pelo usuario

function getAlunoByUsuario()
{
	for(var a=0; a<dataUsuario.length;a++)
	{
		if(dataUsuario[a].idusuario == userID)
		{
			if(dataUsuario[a].aluno != null)
			{
				return dataUsuario[a].aluno.idAluno;
			} else if(dataUsuario[a].professor != null)
			{
				return dataUsuario[a].professor.idprofessorFuncionario;
			}
		}
	}
}

function getNomeQuestao(IdQuestao)
{
	for(var a=0; a<dataForumQuestao.length; a++)
	{
		if(dataForumQuestao[a].idforumQuestao == IdQuestao)
		{
			return dataForumQuestao[a].questao;
		}
	}
	return "";
} 


function deletarMensagemQ(idMensagem){


	$.ajax({
		type: "GET",
		crossDomain: true,
		async: false,
		url: path+"ForumResposta/",
    	success:function(data){

	    }
	}).then(function(data) {
        for(var a=0; a<data.length; a++)
        {
        	if(data[a].forumQuestao.idforumQuestao == idMensagem)
        	{
        		deletarMensagemR(data[a].idforumResposta);
        	}
        }

        $.ajax({
		type: "GET",
		crossDomain: true,
		async: false,
		url: path+"ForumQuestao/delete/"+idMensagem,
    	complete: function(xhr) {  
            $('#Q_S_'+idMensagem).remove();
        }
		});
    });

}


function deletarMensagemR(idMensagem){
	$.ajax({
		type: "GET",
		crossDomain: true,
		async: false,
		url: path+"ForumResposta/delete/"+idMensagem,
		complete: function(xhr) {  
            $('#Qr_S_'+idMensagem).remove();
        }
    });
}