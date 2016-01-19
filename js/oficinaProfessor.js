$(document).ready(function(){

	// Navegação por abas
	$('.abaAgrupamento').click(function(){
		var agrupId = $(this).attr('id').slice(14);

		$('.abaAgrupamento').removeClass('aba_ativa');
		$(this).addClass('aba_ativa');

		$('.agrupamento').hide();
		$("#containerAgrupamento"+agrupId).show();
	});

	$($('.abaAgrupamento').get(0)).trigger('click');
	// Fim navegação por abas
});