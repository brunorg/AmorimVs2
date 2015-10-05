// JavaScript Document
var confTutor;
var retorno;
var alunoNomeAno;
var alunoID = localStorage.getItem("alunoId");
var dadosUsuario = JSON.parse(localStorage.getItem("objetoUsuario"));
var usuario = dadosUsuario.perfil.perfil;
var usuarioId = dadosUsuario.idusuario;
var dadosUser;
var textoMsgNLida;	

switch (usuario){
	case 'Aluno':
		$.ajax({
			url: path+"AlunoVariavel/aluno/"+alunoID,
			type: "GET",
			async:false,
			crossDomain: true,
			success: function(d) {
				dadosUser = d;
				localStorage.setItem("objetoAlunoVariavel", JSON.stringify(d));			
			}		
		});
		msgNaoVistas(usuarioId);
		dadosForum(usuarioId);
	break;
	
	case 'Professor':
		verificaUsuarioTurtor(dadosUsuario.professor.idprofessorFuncionario);
		msgNaoVistas(usuarioId);
		dadosForum(usuarioId);
	break;
	
	case 'Coordenacao':
		verificaUsuarioTurtor(dadosUsuario.professor.idprofessorFuncionario);
		msgNaoVistas(usuarioId);
		dadosForum(usuarioId);
	break;
	
	case 'Secretaria':
		if(usuarioId == 1173)
		{
			$("#rodape_calendario").html("<p id='mudarSenha'><a href='alterarSenhaAluno.html'  style='color: #FFF;text-decoration: none;font-size: 16px;'>Alterar Senha</a></p>").css("display","block");
			$("#rodape_calendario p").show();
		}
	break;
}

//Verfica se o usuário é tutor
function verificaUsuarioTurtor(idProfessor){
	if (verificaTutor(idProfessor) == 1) {
		confTutor = true;
	}else {
		confTutor = false;
	}	
	
	return confTutor;
}

//Lista as mensagens não vistas do usuário e mostra no menu
function msgNaoVistas(usuarioId){
	$.ajax({
		url: path+"Mensagens/ProprietarioCount/"+usuarioId,
		type: "GET",
		async:false,
		crossDomain: true,
		success: function(d) {
			if (d > 0){
				textoMsgNLida = d;
			}else 
				textoMsgNLida = '';
		}		
	});
}

//Lista as questões criadas nos ultimos 3 meses,
//lista respostas das quetões que o usuário criou e que não fora vistas.
//e mostra no menu
function dadosForum(usuarioId){	
	var totalForum = 0;
	$.ajax({
		url: path+"ForumQuestao/RespostasNVistas/"+usuarioId,
		type: "GET",
		async:false,
		crossDomain: true,
		success: function(t1) {
			totalForum+=t1;
		}		
	});
	
	$.ajax({
		url: path+"ForumQuestao/RangeDataCount/",
		type: "GET",
		async:false,
		crossDomain: true,
		success: function(t2) {
			totalForum+=t2;
		}		
	});
	
	if (totalForum == 0){
		textoForum = '';
	}else{
		textoForum = totalForum;
	}
	localStorage.setItem("totalForum", totalForum);
	localStorage.setItem("textoMsgNLida", textoMsgNLida);
}
 
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
