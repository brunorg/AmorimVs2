$(document).ready(function($) {
	carregaJeiffPea();
});

function carregaJeiffPea(){
	$.ajax({
		url: path+'JeiffPea',
		type: 'Get',
		dataType: 'json',
	})
	.done(function(data) {
		var html = "";
		var htmlDocumentos = "";
		if (data.length > 0) {
			for(a in data) {

				html+='<div class="blocoInd">'+
	                        '<p class="horaJeiff">'+changeDatePosition(data[a].data_reuniao, 2 , '/')+'</p>'+
	                        '<p class="tituloJeiff">'+data[a].professorFuncionario.nome+'</p>'+
	                        '<div class="textJeiff">'+data[a].ata+'</div>'+
	                        '<p class="barra"></p>'+
	                    '</div>';
	            debugger;
	            if(data[a].arquivo != null && data[a].descricao != null) {
	            	htmlDocumentos += '<p class="docJeiff">'+
	                                    '<a href="'+data[a].arquivo+'" target="_blank" class="linkJeiff">'+data[a].descricao+'</a>'+
	                              	   '</p>';
	            } else {
	            	htmlDocumentos += '<p class="docJeiff">'+
	            					  	'<a href="" target="_blank" class="linkJeiff"> (Sem Título) </a>'+
	            					  '</p>';
	            }
			};
		} else {
			html += '<div class="blocoInd">';
			html += 	'<p class="horaJeiff">Nenhuma ata registrada até o momento.</p>';
			html += '</div>';

			htmlDocumentos += '<p class="horaJeiff">Nenhuma documento cadastrado até o momento.</p>';
		}
		$('#registroJeffConteudo').html(html);
		$('#documentoJeffConteudo').html(htmlDocumentos);
	})
	.fail(function(data) {
		console.log("error");
	})
}