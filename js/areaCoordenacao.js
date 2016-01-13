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
        	console.log(resultado)
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

window.onload = function() {
	$('.scroll_receiver').mCustomScrollbar({
		axis: 'y',
	});

	carregarListaProfessores()

}



