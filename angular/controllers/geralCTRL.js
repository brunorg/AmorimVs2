var app = angular.module('app',['ngRoute']);

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
				localStorage.setItem("professorId",dadosUsuario.professor.idprofessorFuncionario);							
									
				$scope.usuarioCabecalho = abreviaNome(dadosUsuario.professor.nome);
				$scope.usuarioFoto = dadosUsuario.professor.fotoProfessorFuncionario;
				$scope.usuarioNamePagina = "Área do Professor";
				$scope.usuarioPagina = "areaProfessor.html";
				$scope.menuInfoM = localStorage.getItem("textoMsgNLida");
				$scope.menuInfoF = localStorage.getItem("totalForum");
				$scope.oficina   = JSON.parse(localStorage.getItem("oficinaProfessor")); 
				$scope.menuHTML = [ 
					{label: 'Plano de aula', href: 'planoDeAula.html',class: 'mn_professor plano'}, 
					{label: 'Recursos de aprendizagem', href: 'recursosAprendizagem.html', class: 'mn_professor recurso rows2'},
					{label: 'Roteiros de aula', href: 'roteiroAula.html', class: 'mn_professor roteiros'},
					{label: 'Tutoria', href: 'grupoTutoria.html', class: 'mn_professor tutores'},
					{label: 'Oficina', href: 'oficinaProfessor.html', class: 'mn_professor oficinas'},
					{label: 'Registro JEIF/PEA', href: 'jeiffPea.html', class: 'mn_professor jeiff'},
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
		}
	}
});