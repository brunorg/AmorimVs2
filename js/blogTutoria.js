$(document).ready(function(){
	requestTutoriaAluno();
});

function requestTutoriaAluno(){

	var alunoObjVariavel = JSON.parse(localStorage.getItem('objetoAlunoVariavel')).grupo.tutoria.tutor.idprofessorFuncionario;
	acessarTutoria(alunoObjVariavel);
}

function acessarTutoria(idProfessor){
	var postagens = requestBlogPostagensPorTutoria(idProfessor);
	$("#postagensContainer").html(postagens);
}

function requestBlogPostagensPorTutoria(idProfessor){
	var blog = getBlogPostagensPorTutoria(idProfessor);
	var htmlBlog = new String();

	if(blog.length > 0){
		htmlBlog += "<div class=\"postagens_container\">";

		for ( var i in blog ) {
			var dia 	 = blog[i].data.slice(8);
			var mes		 = blog[i].data.slice(5,7);
			var ano 	 = blog[i].data.slice(0,4);
			var conteudo = blog[i].descricao.split('\n');

			htmlBlog += "<article class=\"cx_postagem\">";
	        htmlBlog +=	   	"<h1 class=\"cx_titulo\">"+blog[i].titulo+"</h1>";
	        htmlBlog +=	   	"<h2 class=\"cx_info\">"+dia+'/'+mes+'/'+ano+"</h2>";

	        if ( blog[i].imagem ) {
	        	var imagem = requestImagemPorPostagem(blog[i].idblog);

	        	htmlBlog += imagem;
	        }

    	    for ( var j in conteudo ) { htmlBlog += conteudo[j] ? "<p class=\"cx_texto\">"+conteudo[j]+"</p>": ""; }

			htmlBlog += 	"<hr class=\"fim_postagem\" />";
        	htmlBlog +=	"</article>";
		}

		htmlBlog += "</div>";
	} else {
		htmlBlog +=	"<p class=\"feedback_oficinas_false\">Ainda não foram realizadas postagens para esta tutoria.</p>";
	}
	return htmlBlog;
}

function getBlogPostagensPorTutoria(idProfessor){
	var retorno;

	$.ajax({
		url: path + "Blog/BlogTutoria/" + idProfessor,
		async: false,
		type: "GET",
		crossDomain: true,
		beforeSend: function(){loading("inicial");},
		success: function(dataBlog){retorno = dataBlog;},
		complete: function(){loading("final");}
	});

	return retorno;
}

function requestImagemPorPostagem(idpostagem) {
	var imagem = getImagemPorPostagem(idpostagem);
	var htmlImagem = new String();

	if (imagem.length) { htmlImagem += "<img src=\""+imagem+"\" class=\"img_postagem\" />"; }

	return htmlImagem;
}

function getImagemPorPostagem(idpostagem) {
	var retorno;

	$.ajax({
		url: path + "Blog/ImagemMed/" + idpostagem,
		type: "GET",
		async: false,
		crossDomain: true,
		success: function(dImagem) { retorno = dImagem; }
	});

	return retorno;
}
