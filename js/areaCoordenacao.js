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

		$('#iconeNovaPostagem').show()

		getAjax("MuralCoordenacao", "GET", "", false, function(result){
			console.log(result)

			var htmlPost="";

			result.forEach(function(postMuralGestao){

				htmlPost += "<section class=\"mural_post_item\">";
				htmlPost += "<main class=\"mural_post_mensagem\">";
				htmlPost += "<span class=\"post_mural_mensagem\">";
				htmlPost += postMuralGestao.mensagem;;
				htmlPost += "<\/span>";
				htmlPost += "<\/main>";
				htmlPost += "<aside class=\"mural_post_cabecalho\">";
				htmlPost += "<span class=\"post_mural_usuario\">Ciclo I - Manhã<\/span> | <span class=\"post_mural_data\">"+postMuralGestao.data+"<\/span> <span class=\"post_mural_horario\">"+postMuralGestao.hora+"<\/span>";
				htmlPost += "<\/aside>";
				htmlPost += "<aside class=\"mural_post_btns\">";
				htmlPost += "<span class=\"mural_btn btn_editar\" onclick=\"muralgestao.edit("+postMuralGestao.idMuralCoordenacao+")\"><\/span><span class=\"mural_btn btn_excluir\" onclick=\"muralgestao.delete("+postMuralGestao.idMuralCoordenacao+")\"><\/span>";
				htmlPost += "<\/aside>";
				htmlPost += "<\/section>";

			})

			$('#conteudoMuralGestao').html(htmlPost)
			$('#conteudoMuralGestao2').hide()
			$('#conteudoMuralGestao').show()
		})
	}


	self.new = function(idPost) {

		var htmlPost="";

		htmlPost += "<select class=\"box_select\">"
        htmlPost += "<option value=\"0\" selected disabled>Escolha o filtro</option>"
		htmlPost += "<\/select>"
		htmlPost += "<textarea class=\"box_textarea textarea_mural_gestao\" name=\"mural_gestao_mensagem\" id=\"\" placeholder=\"Digite o texto da mensagem\"><\/textarea>";
		htmlPost += "<aside class=\"box_ic\">";
		htmlPost += "<span class=\"ic_cancelar\" onclick=\"muralGestao.refresh()\">&nbsp;<\/span>";
		htmlPost += "<span class=\"ic_salvar\">&nbsp;<\/span>";
		htmlPost += "<\/aside>";


		$('#conteudoMuralGestao2').html(htmlPost)
		$('#conteudoMuralGestao2').show()
		$('#conteudoMuralGestao').hide()
		$('#iconeNovaPostagem').hide()

	}

	self.edit = function(idPost) {
		console.log("editar "+ idPost)
	}

	self.delete = function(idPost) {
		console.log("deletar "+ idPost)
	}

}

var muralGestao = new MuralGestao();


window.onload = function() {
	$('.scroll_receiver').mCustomScrollbar({
		axis: 'y',
	});

	// Educadores
	carregarListaProfessores()


	// Mural Gestão
	muralGestao.refresh();
}



