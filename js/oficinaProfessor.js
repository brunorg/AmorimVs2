var IDProfessor = localStorage.getItem("professorId");
var oficina = JSON.parse(localStorage.getItem("oficinaProfessor"));

console.log(oficina);

$(document).ready(function(){

	htmlMenuAgrup = '';
	htmlContAgrup = '';
//	console.log(oficina);

		$.ajax({
			url: path + 'Oficina/AlunosAgrupamento/'+oficina.idoficina_professor,
			type: "GET",
			async: false,
			crossDomain: true,
			dataType: 'json',
			success: function (data) {
				console.log(data);

				htmlMenuAgrup += ' <span id="abaAgrupamento'+oficina.oficina.idoficina+'" idOficinaProf="'+oficina.idoficina_professor+'" class="aba_agrupamento abaAgrupamento">'+data.nome+'</span> ';
				
				if (data.alunos != undefined){
					htmlContAgrup += '<div id="containerAgrupamento'+oficina.idoficina_professor+'" class="agrupamento">';

					for (var j = 0; j < data.alunos.length; j++){
						htmlContAgrup += '<div class="agrupamento_aluno">'+
											'<img src="'+data.alunos[j].foto+'" alt="'+data.alunos[j].nome+'">'+
											'<span>'+data.alunos[j].nome+'</span>'+
										 '</div>';
					}

				}
				htmlContAgrup += '</div>';
			}
		});
		
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