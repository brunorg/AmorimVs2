
var app = angular.module('app.controllers',['ngRoute']);

app.controller('loginCTRL',function ($scope,$http) {
	 $scope.logar = function(){
		var b = navigator.userAgent;
		var data = "usuario="+$scope.usuario+"&senha="+$scope.senha+"&versao="+b;
		$http({
			method  : 'POST',
			url     : path + "Logar",
			data    : data,
			headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
		}).success(function(a,status) {
			if(status == 204){
				msgInicial("Login e senha inválidos!");
				okBotao();
			}else{
				localStorage.setItem("objetoUsuario", JSON.stringify(a));
				if (typeof a !== "undefined") {				
					if(a.perfil.perfil == "Aluno"){	
						var objAlunoVariavel = alunoVariavelByIdAluno(a.aluno.idAluno);

						if(objAlunoVariavel.anoEstudo.ano <= 2){
							window.location = "areaAlunoAlfabetizacao.html";
						}else{
							window.location = "areaAluno.html";
						}
						localStorage.setItem("alunoId",a.aluno.idAluno);										
					}
					else if(a.perfil.perfil == "Professor"){
						localStorage.setItem("professorId", a.professor.idprofessorFuncionario)	;
						window.location = "areaProfessor.html";
					}
					else if(a.perfil.perfil=="Coordenacao"){
						window.location = "areaCoordenacao.html";
						localStorage.setItem("professorId", a.professor.idprofessorFuncionario)	;					
					}
					else if(a.perfil.perfil=="Secretaria"){
						window.location = "cadastros.html";
						localStorage.setItem("professorId", a.professor.idprofessorFuncionario)	;					
					}
				}
			}
		});
	 }	
});

app.controller('geralCTRL',function($scope,$http){
	
	$scope.usuario = function(){		
		switch (dadosUsuario.perfil.perfil){
			case "Aluno":
				var dadosAlunoVariavel = JSON.parse(localStorage.getItem("objetoAlunoVariavel"));			
				var alunoNomeAno = abreviaNome(dadosUsuario.aluno.nome)+" | "+dadosAlunoVariavel.anoEstudo.ano+"º ano";
								
				$scope.usuarioCabecalho = alunoNomeAno;
				$scope.usuarioFoto = dadosUsuario.aluno.fotoAluno;
				$scope.usuarioNamePagina = "Área do Aluno";
				$scope.usuarioPagina = "areaAluno.html";
				$scope.menuInfoM = localStorage.getItem("textoMsgNLida");
				$scope.menuInfoF = localStorage.getItem("totalForum");
				
				//var mobile = redirecionaMobile();
				//console.log(mobile);

				$scope.menuHTML = [ 
					{label: 'Plano de Estudo', href: 'planoDeEstudo.html',class: 'plano'}, 
					{label: 'Recursos de aprendizagem', href: 'recursosAprendizagem.html', class: 'recurso rows2'},
					{label: 'Tutoria', href: 'tutoriaAluno.html', class: 'tutoria'},
					{label: 'Oficinas', href: 'oficinas.html', class: 'oficinas'},
					{label: 'Produção do Aluno', href: 'producaoAluno.html', class: 'prodAluno'},
					{label: 'Mensagens', href: 'mensagens.html', class: 'mensagens'},
					{label: 'Fórum', href: 'forum.html', class: 'forum'}
				];										
			break;
			
			case "Professor":
				var oficinas = oficinaProfessor(dadosUsuario.professor.idprofessorFuncionario);
				if(localStorage.getItem("oficinaProfessor") == null) {					
					localStorage.setItem("oficinaProfessor", JSON.stringify(oficinas[0]));
					 oficinaAtivaP = oficinas[0];
				}else{
					 oficinaAtivaP = JSON.parse(localStorage.getItem("oficinaProfessor"));	
				}
				
				localStorage.setItem("professorId",dadosUsuario.professor.idprofessorFuncionario);							
									
				var oficinaAtivaP;
		
				if(oficinas.length > 1){
					$scope.oficinaHTML = [oficinas];
					$scope.mostra = true;							
				}	
				
				$scope.usuarioCabecalho = abreviaNome(dadosUsuario.professor.nome);
				$scope.usuarioFoto = dadosUsuario.professor.fotoProfessorFuncionario;
				$scope.usuarioNamePagina = "Área do Professor";
				$scope.usuarioPagina = "areaProfessor.html";
				$scope.menuInfoM = localStorage.getItem("textoMsgNLida");
				$scope.menuInfoF = localStorage.getItem("totalForum");										
				$scope.oficina   = oficinaAtivaP; 
				
				$scope.oficinaAtiva = oficinaAtivaP.oficina.tipoOficina.nome;
				
				$scope.menuHTML = [ 
					{label: 'Plano de aula', href: 'planoDeAula.html',class: 'mn_professor plano'}, 
					{label: 'Recursos de aprendizagem', href: 'recursosAprendizagem.html', class: 'mn_professor recurso rows2'},
					{label: 'Roteiros de aula', href: 'roteiroAula.html', class: 'mn_professor roteiros'},
					{label: 'Tutoria', href: 'grupoTutoria.html', class: 'mn_professor tutores'},
					{label: 'Oficina', href: 'oficinaProfessor.html', class: 'mn_professor oficinas'},
					{label: 'Registro JEIF/PEA', href: 'registroJeiffPea.html', class: 'mn_professor jeiff'},
					{label: 'Mensagens', href: 'mensagens.html', class: 'mn_professor mensagens'},
					{label: 'Fórum', href: 'forum.html', class: 'mn_professor forum'}
				];
				
				//Visibilidade do perfil
				$(".total").addClass("semTop");
				if(confTutor==true){
					$("#rodape_calendario").css("display","block");
					$("#rodape_calendario p").show();
				}			
			break;
			
			case "Coordenacao":								
				$scope.usuarioCabecalho = abreviaNome(dadosUsuario.professor.nome);
				$scope.usuarioFoto = dadosUsuario.professor.fotoProfessorFuncionario;
				$scope.usuarioNamePagina = "Área da Coordenação";
				$scope.usuarioPagina = "areaCoordenacao.html";
				$scope.menuInfoM = localStorage.getItem("textoMsgNLida");
				$scope.menuInfoF = localStorage.getItem("totalForum");
				$scope.menuHTML = [ 
					{label: 'Rotinas', href: 'rotinas.html',class: 'rotinas'}, 
					{label: 'Recursos de aprendizagem', href: 'recursosAprendizagem.html', class: 'recurso rows2'},
					{label: 'Roteiros', href: 'roteiros.html', class: 'roteiros'},
					{label: 'Tutorias', href: 'tutorias.html', class: 'tutoria'},
					{label: 'Grupos', href: 'grupo.html', class: 'grupos'},
					{label: 'Mensagens', href: 'mensagens.html', class: 'mensagens'},
					{label: 'Fórum', href: 'forum.html', class: 'forum'}
				];	
				
				//Visibilidade do perfil	
				$("#bt_Inserir").show();
				$("#cad_observacoes").remove();
				$("#box_geral_observacao").css("height","308px");
			break;
			
			case "Secretaria":
				$scope.usuarioCabecalho = abreviaNome(dadosUsuario.professor.nome);
				$scope.usuarioFoto = dadosUsuario.professor.fotoProfessorFuncionario;
				$scope.usuarioNamePagina = "Área da Secretaria";
				$scope.usuarioPagina = "cadastros.html";
				$scope.menuInfoM = localStorage.getItem("textoMsgNLida");
								
				$scope.menuHTML = [ 
					{label: 'Cadastro', href: 'cadastros.html',class: 'cadastro'}, 
					{label: 'Agenda', href: 'agenda.html', class: 'agenda'},
					{label: 'Presença', href: 'presenca.html', class: 'presenca'},
					{label: 'Carterinhas', href: 'carteirinhas.html', class: 'carteirinhas'},
					{label: 'Mensagens', href: 'mensagens.html', class: 'mensagens'},
				];
			break;
		}	
		//Logout do usuário
		$scope.logout = function(){
			localStorage.clear();		
			window.location = 'index.html';
		},
		
		$scope.alteraOficina = function(oficina){
			var oficinas = oficinaProfessor(dadosUsuario.professor.idprofessorFuncionario);	
			for( a in oficinas){
				if(oficinas[a].oficina.idoficina == oficina){
					localStorage.setItem("oficinaProfessor", JSON.stringify(oficinas[a]));
					$scope.oficina   = oficinas[a]; 				
					$scope.oficinaAtiva = oficinas[a].oficina.tipoOficina.nome;					
				}
			}
			location.reload();
		}
	}
});


function okBotao() {
	 $(".bt_ok").click(function() {
			$("#boxMensagemGeral").hide()
		})
}

function msgInicial(texto){
	var HtmlContent = '<div class="box_mensagem">'+
							'<div class="txt_mensagem">'+
								'<span id="erro"></span>'+texto+
							'</div>'+
							'<div class="btn_mensagem_1">'+
								'<input type="button" class="bt_ok left" value="OK" />'+
							'</div>'+
						'</div>';

	$( "#boxMensagemGeral" ).html(HtmlContent).show();	
}

function redirecionaMobile(){
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)){
	    return true;
	}else{
		return false;
	}
}


function alunoVariavelByIdAluno(idAluno){
	var dadosAlunoV;

	$.ajax({
		url: path+"AlunoVariavel/aluno/"+idAluno,
		type: "GET",
		async:false,
		crossDomain: true,
		success: function(d) {
			dadosAlunoV = d;
		}		
	});

	return dadosAlunoV;
}