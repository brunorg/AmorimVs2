var IDProfessor = localStorage.getItem("professorId");
var oficina = JSON.parse(localStorage.getItem("oficinaProfessor"));

$(document).ready(function(){

	//Variáveis para receber os htmls com o agrupamento.
	htmlMenuAgrup = '';
	htmlContAgrup = '';

	//Serviço para buscar os agrupamentos do professor e seus respectivos grupos
	$.ajax({
		url: path + 'Oficina/AlunosAgrupamento/'+oficina.oficina.idoficina,
		type: "GET",
		async: false,
		crossDomain: true,
		dataType: 'json',
		success: function (data) {

			if (data.length > 0){
				
				//Percorre os agrupamentos criando os botões do menu e do conteúdo
				for (var i = 0; i < data.length; i++){ 
					htmlMenuAgrup += ' <span id="abaAgrupamento'+data[i].id+'" idOficinaProf="'+data[i].id+'" class="aba_agrupamento abaAgrupamento">'+data[i].nome+'</span> ';
					htmlContAgrup += '<div id="containerAgrupamento'+data[i].id+'" class="agrupamento">';

					//Percorre os alunos do grupo listando-os
					for (var j = 0; j < data[i].alunos.length; j++){
						htmlContAgrup += '<div class="agrupamento_aluno">'+
											'<img src="'+data[i].alunos[j].foto+'" alt="'+data[i].alunos[j].nome+'">'+
											'<span>'+abreviaNome(data[i].alunos[j].nome)+'</span>'+
										 '</div>';
					}
						
					htmlContAgrup += '</div>';
				}
			}
		}
	})
		
	//Colocando o conteúdo nas divs correspondentes
	$('.abas_agrupamentos').html(htmlMenuAgrup);
	$('.agrupamento_container').html(htmlContAgrup);

	// Navegação por abas
	$('.abaAgrupamento').click(function(){
		var agrupId = $(this).attr('idOficinaProf');

		$('.abaAgrupamento').removeClass('aba_ativa');
		$(this).addClass('aba_ativa');

		$('.agrupamento').hide();
		console.log("#containerAgrupamento"+agrupId);
		$("#containerAgrupamento"+agrupId).show();
	});

	$($('.abaAgrupamento').get(0)).trigger('click');
	// Fim navegação por abas
});