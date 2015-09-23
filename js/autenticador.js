// JavaScript Document
var usuario = localStorage.getItem("usuarioTipo");
var usuarioId = localStorage.getItem("usuarioId");
var confTutor;
var dadosUser;
var retorno;

function getAlunoByUsuario(){
	$.ajax({
		url: path+'Usuario/'+usuarioId,
		type: "GET",
		async:false,
		success: function(d) {
			if(usuario == "Aluno" && d.aluno != null){
				retorno = d.aluno.idAluno;			
			} else if(usuario == "Professor" && d.professor != null){
				retorno = d.professor.idprofessorFuncionario;			
			}
		}
	});
	return retorno;
}


if(usuario == "Aluno"){
	$.ajax({
		url: path+"AlunoVariavel/aluno/"+getAlunoByUsuario(),
		type: "GET",
		async:false,
		crossDomain: true,
		success: function(d) {
			dadosUser = d;
		}		
	});
}
	
if((localStorage.getItem("usuarioTipo") == "semTipo" || localStorage.getItem("usuarioTipo") == undefined) && 
	(localStorage.getItem("usuarioId") == "semId" || localStorage.getItem("usuarioId") == undefined) )
{
	alert("Deve-se logar antes");
	localStorage.setItem("usuarioTipo","semTipo");
	localStorage.setItem("usuarioId","semId");
	window.location = 'index.html';
}
$(document).ready(function(){
	var menu = "";	
	$.ajax({
		url: path+"Usuario/"+usuarioId,
		type: "GET",
		async:true,
		crossDomain: true,
		success: function (dadosUsuario) {
			localStorage.setItem("user",dadosUsuario.login);
			
			if ((usuario == 'Professor')||(usuario == 'Coordenacao')){	
				
				if (verificaTutor(dadosUsuario.professor.idprofessorFuncionario) == 1) {
					confTutor = true;
				}else {
		        	
		        	confTutor = false;
				}			
			}		
			
			$.ajax({
				url: path+"Mensagens/ProprietarioCount/"+dadosUsuario.idusuario,
				type: "GET",
				async:false,
				crossDomain: true,
				success: function(d) {
					//mensagensNaoLidas = d;
					if (d > 0){
		        		textoMsgNLida = '<div class="label" id="num_msg_nLidas">'+d+'</div>';
		        	}else textoMsgNLida = '';
				}		
			});

			switch (usuario){
			    case "Aluno":	
			    	var textoMsgNLida;
			    	var alunoId = localStorage.setItem("alunoId",dadosUsuario.aluno.idAluno);			
			        var aluno = abreviaNome(dadosUsuario.aluno.nome)+" | "+dadosUser.anoEstudo.ano+"º ano";
			        
			        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
			        {
			            menu = '<div class="row">'+
                					'<div class="row-height Menu_Container">'+
                						'<div class="Content_lateral_Menu_Opcao col-2 col-height">'+
											'<a href="planoDeEstudo.html" class="plano">Plano de estudo</a>'+
										'</div>'+
										'<div class="Content_lateral_Menu_Opcao col-2 col-height">'+
											'<a href="recursosAprendizagem.html" class="recurso">Recursos de aprendizagem</a>'+
										'</div>'+
										'<div class="Content_lateral_Menu_Opcao col-2 col-height">'+
											'<a href="tutoriaAluno.html" class="tutoria">Tutoria</a>'+
										'</div>'+
										'<div class="Content_lateral_Menu_Opcao col-2 col-height">'+
											'<a href="oficinas.html" class="oficinas">Oficinas</a>'+
										'</div>'+
										'<div class="Content_lateral_Menu_Opcao col-2 col-height">'+
											'<a href="producoesAluno.html" class="prodAluno">Produções do aluno</a>'+
										'</div>'+
										'<div class="Content_lateral_Menu_Opcao col-2 col-height">'+
											textoMsgNLida+
											'<a href="mensagens.html" class="mensagens">Mensagens</a>'+
										'</div>'+
										'<div class="Content_lateral_Menu_Opcao col-2 col-height">'+
											'<a href="forum.html" class="forum">Fórum</a>'+
										'</div>'+
									'</div>'+
								'</div>';
			        }
			        else
			        {
			        	
			        	
			            menu = '<div class="Content_lateral_Menu_Opcao plano">'+
									'<a href="planoDeEstudo.html">Plano de estudo</a>'+
								'</div>'+
								'<div class="Content_lateral_Menu_Opcao rows2 recurso">'+
									'<a href="recursosAprendizagem.html"><span id="menu_recurso">Recursos de aprendizagem</span></a>'+
								'</div>'+
								'<div class="Content_lateral_Menu_Opcao tutoria">'+
									'<a href="tutoriaAluno.html">Tutoria</a>'+
								'</div>'+
								'<div class="Content_lateral_Menu_Opcao oficinas">'+
									'<a href="oficinas.html">Oficinas</a>'+
								'</div>'+
								'<div class="Content_lateral_Menu_Opcao prodAluno">'+
									'<a href="producoesAluno.html">Produções do aluno</a>'+
								'</div>'+
								'<div class="Content_lateral_Menu_Opcao mensagens">'+
									textoMsgNLida+
									'<a href="mensagens.html">Mensagens</a>'+
								'</div>'+
								'<div class="Content_lateral_Menu_Opcao forum">'+
									'<div class="label" id="num_forum_nLidas"></div>'+ // <-- Essa linha gera os labels
									'<a href="forum.html">Fórum</a>'+
								'</div>'+
							'<div class="Content_lateral_Menu_Opcao calendario" id="menuCalendario">'+
								'<a href="pageCalendario.html">Calendário</a>'+
							'</div>';
			        }

			       if(dadosUsuario.banner == 0){
					    $('#box_msg_alter_banner').css('display', 'block');
			        }
					$("#Content_lateral_Menu").html(menu);
					$( "#Cabecalho_Perfil_Area_Foto" ).html("<img id='_foto' src='"+dadosUsuario.aluno.fotoAluno+"'/>");
					$( "#Cabecalho_Perfil_Area_Descricao" ).html(aluno);
					$("#home").attr('href', 'areaAluno.html');
					$("#area_acesso").html("Área do Aluno");
					
										
					if((typeof dadosUser != 'undefined') && (dadosUser.grupo != null))
					{
						if(dadosUser.grupo.lider != null){
							if(dadosUser.grupo.lider.idAluno == dadosUsuario.aluno.idAluno)
							{
								$("#rodape_calendario").css("display","block");
								$("#rodape_calendario p").show();
							}	
						}						
					}
				break;
				case "Professor":
					if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
                	{
                		menu = '<div class="row">'+                				
                					'<div class="row-height Menu_Container">'+
                						'<div class="Content_lateral_Menu_Opcao col-2 col-height">'+
											'<a href="grupoTutoria.html" class="tutoria">Tutoria</a>'+
										'</div>'+
										'<div class="Content_lateral_Menu_Opcao col-2 col-height">'+
											'<a href="recursosAprendizagem.html" class="recurso">Recursos de aprendizagem</a>'+
										'</div>'+
										'<div class="Content_lateral_Menu_Opcao col-2 col-height">'+
											'<a href="roteirosProfessor.html" class="roteiros">Roteiros</a>'+
										'</div>'+
										'<div class="Content_lateral_Menu_Opcao col-2 col-height">'+
											'<a href="forum.html" class="forum">Fórum</a>'+
										'</div>'+
										'<div class="Content_lateral_Menu_Opcao col-2 col-height">'+
											textoMsgNLida+
											'<a href="mensagens.html" class="mensagens">Mensagens</a>'+
										'</div>'+
									'</div>'+
								'</div>';
                	}
                	else
                	{
						menu = '<div class="Content_lateral_Menu_Opcao plano">'+
    							'<a href="planoDeAula.html">Plano de aula</a>'+
    							'</div>'+
								'<div class="Content_lateral_Menu_Opcao rows2 recurso">'+
									'<a href="recursosAprendizagem.html"><span id="menu_recurso">Recursos de aprendizagem</span></a>'+
								'</div>'+
								'<div class="Content_lateral_Menu_Opcao roteiros">'+
									'<a href="roteirosProfessor.html">Roteiros de aula</a>'+
								'</div>'+
								'<div class="Content_lateral_Menu_Opcao tutores">'+
								   '<a href="grupoTutoria.html">Tutoria</a>'+
								'</div>'+
								'<div class="Content_lateral_Menu_Opcao grupos">'+
    							'<a href="gruposProfessor.html">Grupos</a>'+
    							'</div>'+
								'<div class="Content_lateral_Menu_Opcao mensagens">'+
									textoMsgNLida+
									'<a href="mensagens.html">Mensagens</a>'+
								'</div>'+
								'<div class="Content_lateral_Menu_Opcao forum">'+
								'<div class="label" id="num_msg_nLidas"></div>'+
									'<a href="forum.html">Fórum</a>'+
								'</div>';
					}	
							
					$("#Content_lateral_Menu").html(menu);
					$("#Cabecalho_Perfil_Area_Foto" ).html("<img id='_foto' src='"+dadosUsuario.professor.fotoProfessorFuncionario+"' />");
					$("#Cabecalho_Perfil_Area_Descricao").html(abreviaNome(dadosUsuario.professor.nome)); 
					$("#home").attr('href', 'areaProfessor.html');	
					$("#area_acesso").html("Área do Professor");
					$(".total").addClass("semTop");
					if(confTutor==true){
						$("#rodape_calendario").css("display","block");
						$("#rodape_calendario p").show();
					}					
					localStorage.setItem("professorId",dadosUsuario.professor.idprofessorFuncionario);
					
				break;
				case "Coordenacao":
					if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
					{
						menu = '<div class="row">'+
                					'<div class="row-height Menu_Container">'+
                						'<div class="Content_lateral_Menu_Opcao col-2 col-height">'+
											'<a href="tutorias.html" class="tutores">Tutores</a>'+
										'</div>'+
										'<div class="Content_lateral_Menu_Opcao col-2 col-height">'+
											'<a href="recursosAprendizagem.html" class="recurso">Recursos de aprendizagem</a>'+
										'</div>'+
										'<div class="Content_lateral_Menu_Opcao col-2 col-height">'+
											'<a href="roteiros.html" class="roteiros">Roteiros</a>'+
										'</div>'+
										'<div class="Content_lateral_Menu_Opcao col-2 col-height">'+
											'<a href="grupo.html" class="grupos">Grupos</a>'+
										'</div>'+
										'<div class="Content_lateral_Menu_Opcao col-2 col-height">'+
											textoMsgNLida+
											'<a href="mensagens.html" class="mensagens">Mensagens</a>'+
										'<div>'+
									'</div>'+
								'</div>';
					}	
					else
					{
						menu = '<div class="Content_lateral_Menu_Opcao tutores">'+
								'<a href="tutorias.html">Tutores</a>'+
							'</div>'+
							'<div class="Content_lateral_Menu_Opcao rows2 recurso">'+
								'<a href="recursosAprendizagem.html"><span id="menu_recurso">Recursos de aprendizagem</span></a>'+
							'</div>'+
							'<div class="Content_lateral_Menu_Opcao roteiros">'+
								'<a href="roteiros.html">Roteiros</a>'+
							'</div>'+
							'<div class="Content_lateral_Menu_Opcao grupos">'+
								'<a href="grupo.html">Grupos</a>'+
							'</div>'+
							'<div class="Content_lateral_Menu_Opcao mensagens">'+
								textoMsgNLida+
								'<a href="mensagens.html">Mensagens</a>'+
							'</div>';
					}
												
					$( "#Content_lateral_Menu" ).html(menu);
					$( "#Cabecalho_Perfil_Area_Foto" ).html("<img id='_foto' src='"+dadosUsuario.professor.fotoProfessorFuncionario+"' />");
					$( "#Cabecalho_Perfil_Area_Descricao" ).html(abreviaNome(dadosUsuario.professor.nome));			
					$("#home").attr('href', 'areaCoordenacao.html');	
					$("#bt_Inserir").show();
					$("#area_acesso").html("Área da Coordenação");
					$("#cad_observacoes").remove();
					$("#box_geral_observacao").css("height","308px");
				break;
				case "Secretaria":
					menu = '<div class="Content_lateral_Menu_Opcao cadastro">'+
							   '<a href="cadastros.html">Cadastro</a>'+
							'</div>'+
							'<div class="Content_lateral_Menu_Opcao agenda">'+
								'<a href="agenda.html">Agenda</a>'+
							'</div>'+
							'<div class="Content_lateral_Menu_Opcao presenca">'+
								'<a href="presenca.html">Presença</a>'+
							'</div>'+
							'<div class="Content_lateral_Menu_Opcao carteirinhas" style="pointer-events: none;cursor: default;">'+
								'<a href="carteirinhas.html">Carterinhas</a>'+
							'</div>'+
							'<div class="Content_lateral_Menu_Opcao mensagens">'+
								'<a href="mensagens.html">Mensagens</a>'+
								textoMsgNLida+
							'</div>'+
							'<div class="Content_lateral_Menu_Opcao" id="menuCalendario">'+
								'<a href="pageCalendario.html" class="calendario">Calendário</a>'+
							'</div>';
							
					$( "#Content_lateral_Menu" ).html(menu);
					$( "#Cabecalho_Perfil_Area_Foto" ).html("<img id='_foto' src='"+dadosUsuario.professor.fotoProfessorFuncionario+"' />");
					$( "#Cabecalho_Perfil_Area_Descricao" ).html(abreviaNome(dadosUsuario.professor.nome));			
					$("#home").attr('href', 'cadastros.html');
					$("#area_acesso").html("Área da Secretaria");
										
					if(usuarioId == 1173)
					{
						$("#rodape_calendario").html("<p id='mudarSenha'><a href='alterarSenhaAluno.html'  style='color: #FFF;text-decoration: none;font-size: 16px;'>Alterar Senha</a></p>").css("display","block");
						$("#rodape_calendario p").show();
					}
								
				break;
			}
		},error: function() {
			retorno = "erro";
		}
	});
	
	$("#logout").click(function(){

		$.ajax({
			url: path+ "Usuario/logout" +usuarioId,
			type: "POST",
			async:false,
			crossDomain: true,
			success: function () {
			}
		});

		localStorage.setItem("usuarioTipo","semTipo");
		localStorage.setItem("usuarioId","semId");
		window.location = 'index.html';
	});

});

/*Function que abrevia nome do usuário*/
function abreviaNome(nome){
	nome = nome.split(" ");
	var nomeFinal = new Array();
	var nomeAbreviado = "";
	nome = nome.filter(function(item, index, array){
		if(item != "de" && item != "De"){
			return item;
		}		
	});	
	for(var i=0;i<nome.length;i++){
		if(i<1){
			nomeFinal[i] = nome[i];
		}else if(i==nome.length-1){
			nomeFinal[i] = nome[i];
		}else{
			nomeFinal[i] = nome[i].substring(0, 1)+"."; 
		}
		nomeAbreviado += nomeFinal[i]+" ";
	}	
	return nomeAbreviado;
}
