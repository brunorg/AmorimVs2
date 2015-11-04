function alterarAba(index) {
	var abas = $('.aba_oficina');

	for ( var i = 0; i < abas.length; i++ ) {
		if ( i == index ) {
			if ( $($(abas).get(i)).hasClass('aba_ativa') ) {
				$($(abas).get(i)).removeClass('aba_ativa');
			} else {
				$($(abas).get(i)).addClass('aba_ativa');
			}
		} else {
			$($(abas).get(i)).removeClass('aba_ativa');
		}
	}
}

function acordeon(index) {
	var roteirosLista = $('.Oficina_Planejamento_Info');

	for ( var i = 0; i < roteirosLista.length; i++ ) {
		if ( i == index ) {
			if ( $($('.Oficina_Plan_Itens').get(i)).hasClass('expandido') ) {
				$($('.Oficina_Plan_Itens').get(i)).slideUp();
				$($('.Oficina_Plan_Itens').get(i)).removeClass('expandido');
			} else {
				$($('.Oficina_Plan_Itens').get(i)).slideDown();
				$($('.Oficina_Plan_Itens').get(i)).addClass('expandido');
			}
		} else {
			$($('.Oficina_Plan_Itens').get(i)).slideUp();
			$($('.Oficina_Plan_Itens').get(i)).removeClass('expandido');
		}
	}
}

function conferirEntrega(index) {
	if ( $($('.Oficina_Plan_Quadrado').get(index)).hasClass('Entregue') ) {
		$($('.Oficina_Plan_Quadrado').get(index)).removeClass('Entregue')
	} else {
		$($('.Oficina_Plan_Quadrado').get(index)).addClass('Entregue')
	}
}