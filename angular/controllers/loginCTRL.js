
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
						localStorage.setItem("alunoId",a.aluno.idAluno);
						window.location = "areaAluno.html";										
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