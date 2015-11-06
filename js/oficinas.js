var htmlContent = '';
function alterarAba(index, abbrOficina, idCor) {
	$.ajax({
		url: path + "RoteiroAula",
		async: false,
		type: "GET",
		crossDomain: true,
		beforeSend: function(){
			loading("inicial");
		},
		success: function(data) {
			numRoteiro = 1;

			for (var i in data) {
				console.log(data[i]);
				if ( data[i].oficinaprofessor !== null && data[i].oficinaprofessor.oficina.cor.idcor == idCor ) {

					htmlContent +=
						'<div id="Oficina_Plan_Linha_'+numRoteiro+'" class="Oficina_Plan_Linha">'+
	        	    	    '<div id="Oficina_Plan_Info_'+numRoteiro+'" class="Oficina_Planejamento_Info OF_'+abbrOficina+'_C_bg" onclick="acordeon('+(numRoteiro-1)+')">'+
	        	    	        '<div class="Oficina_Plan_Num OF_'+abbrOficina+'_E_bg">'+numRoteiro+'</div>'+
	        	    	        '<div class="Oficina_Plan_Nome">'+data[i].roteiro+'</div>'+
	        	    	        '<div class="Oficina_Plan_Quadrado">&nbsp;</div>'+
	        	    	    '</div>'+
	        	    	    '<div id="Oficina_Plan_Itens_'+numRoteiro+'" class="Oficina_Plan_Itens">'+
	        	    	        '<div class="Oficina_Plan_Obj Oficina_Plan_Item">Descrição: '+data[i].descricao+'</div>'+
	        	    	        '<div class="Oficina_Plan_Recursos Oficina_Plan_Item">'+
	        	    	            '<div class="Oficina_Recurso Rec_Livro">Lorem ipsum dolor sit amet</div>'+
	        	    	            '<div class="Oficina_Recurso Rec_Video">Consectetur adipiscing elit</div>'+
	        	    	        '</div>'+
	        	    	    '</div>'+
	        	    	'</div>';
        	    	numRoteiro++
				}
        	}
		},
		complete: function(){
			loading("final");
		}
	});
	$('.Acordeon_Oficina').html(htmlContent);
	htmlContent = '';

	var abas = $('.aba_oficina');
	var roteiros = $('.Oficina_Planejamento_Info');
	var roteirosNums = $('.Oficina_Plan_Num');

	for ( var i = 0; i < abas.length; i++ ) {
		if ( i == index ) {
			if ( !$($(abas).get(i)).hasClass('aba_ativa') ) {
				$($(abas).get(i)).addClass('aba_ativa');
				$(roteiros).attr('class', 'Oficina_Planejamento_Info OF_'+abbrOficina+'_C_bg');
				$(roteirosNums).attr('class', 'Oficina_Plan_Num OF_'+abbrOficina+'_E_bg');
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

$(document).ready(function(){
	alterarAba(0, 'EduFis', 1)
})