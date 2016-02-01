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
		for(a in data){

			html+='<div class="blocoInd">'+                             
                        '<p class="horaJeiff">'+changeDatePosition(data[a].data_reuniao, 2 , '/')+'</p>'+
                        '<p class="tituloJeiff">'+data[a].professorFuncionario.nome+'</p>'+
                        '<div class="textJeiff">'+data[a].ata+'</div>'+
                        '<p class="barra"></p>'+                                
                    '</div>';

            if(data[a].arquivo){
            	htmlDocumentos += '<p class="docJeiff">'+
                                    '<a href="'+data[a].arquivo+'" target="_blank" class="linkJeiff">'+data[a].descricao+'</a>'+
                              	   '</p>';
            }
            
		}
		$('#registroJeffConteudo').html(html);
		$('#documentoJeffConteudo').html(htmlDocumentos);
	})
	.fail(function(data) {
		console.log("error");
	})	
}