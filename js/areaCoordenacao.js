function getAjax(url, postOrGet, data, async, callback) {

	if (async === undefined) 	 { async = false };
	if (postOrGet === undefined) { postOrGet = "GET" };
	if (data === undefined) { data = "" };

	$.ajax({
        url: path + url,
        async: async,
        crossDomain: true,
        type: postOrGet,
        data: data,
        success: function(resultado) {
        	callback(resultado);
        }
    });

}

function carregarListaProfessores() {
	getAjax("Tutoria", "GET", "", false, function(result){
		result.forEach(function(professor){

			var professorId = base64_encode(""+professor.tutor.idprofessorFuncionario)
			var professorFoto = professor.tutor.fotoProfessorFuncionario
			var professorNome = professor.tutoria

			$('.lista_educadores').append(
										  '<section class="educador_info">'+
										  	  '<a href="grupoTutoria.html?ID='+professorId+'">'+
											      '<img src="'+professorFoto+'" alt="'+professorNome+'" class="educador_foto">'+
											      '<span class="educador_nome">'+professorNome+'</span>'+
										      '</a>'+
										  '</section>'
										  )
		})
	})
}

function MuralGestao() {

	self = this;

	self.refresh = function() {
		getAjax("MuralCoordenacao", "GET", "", false, function(result){
			console.log(result)

			var htmlPost="";

			result.forEach(function(postMuralGestao){

				htmlPost += "<section class=\"mural_post_item\">";
				htmlPost += "<main class=\"mural_post_mensagem\">";
				htmlPost += "<span class=\"post_mural_mensagem\">";
				htmlPost += postMuralGestao.mensagem;
				htmlPost += "<\/span>";
				htmlPost += "<\/main>";
				htmlPost += "<aside class=\"mural_post_cabecalho\">";
				htmlPost += "<span class=\"post_mural_usuario\">Professores<\/span> | <span class=\"post_mural_data\">"+postMuralGestao.data+"<\/span> <span class=\"post_mural_horario\">"+postMuralGestao.hora+"<\/span>";
				htmlPost += "<\/aside>";
				htmlPost += "<\/section>";

			})

			$('#conteudoMuralGestao').html(htmlPost)
		})
	}

}


window.onload = function() {
	$('.scroll_receiver').mCustomScrollbar({
		axis: 'y',
	});

	// Educadores
	carregarListaProfessores()


	// Mural Gestão
	var muralGestao = new MuralGestao();
	muralGestao.refresh();
}



