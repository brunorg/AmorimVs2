$(document).ready(function(){
	var cont=2;
	$("#cabecalho_pesquisa").click(function(){
		$("#Pesquisa").css("display","block");
		$("#Roteiro").css("display","none");
		carregaRoteiro();
	});
	$("#cabecalho_roteiro").click(function(){
		$("#Roteiro").css("display","block");
		$("#Pesquisa").css("display","none");
	});

	var abas = document.getElementById('roteiros_content').getElementsByClassName('aba_roteiro');
	for(var i = 0; i<abas.length; i++){
		if(i == 0){
			$(abas[i]).show();
		}
		else{
			$(abas[i]).hide();
		}
	}

	$("#btnNovoOB").click(function() {
		$("#Inserir_roteiro").append('<div class="linha3">'+
		      	'<div class="celulaGrandeOB">'+
		      	'<div class="infoM"> Objetivo </div>'+
		      	'<div class="infoValueM">'+
		      		'<input type="text" id="val_objetivo_'+cont+'" class="infoValueM objetivos">'+
		      	'</div>' +  
		      	'</div>'+
		      	'</div>');
		cont++;
	});	



	$("#btnSalvar").click(function(){

		var roteiro= $("#val_roteiro").val();
		var descricao= $("#val_descricao").val();

		$.ajax({
			url: path + "RoteiroAula",
			type: "POST",
			async: false,
			crossDomain: true,
			dataType: 'json',
			data:'action=create&roteiro='+roteiro+'&descricao='+descricao+'&objetivoAula=1',
			success: function (data) {
				$('#linha1').html('<input type="hidden" id="idRoteiro" value="'+data+'">');
				$("#linha1,#linha2,#btnSalvar").css("display","none");
				$("#roteiroSalvo").html(roteiro).css("display","block");
				$("#descricaoSalvo").html(descricao).css("display","block");
				mensagem('Roteiro salvo com sucesso!','OK','bt_ok','sucesso');
				MostrarObjetivo();
			}
		});
	});

	function MostrarObjetivo(){
        $(".celulaGrandeOB").show();
        $("#btnSalvarObjetivo,#btnNovoOB").css("display","block");
    }

    $("#btnSalvarObjetivo").click(function(){
    	var objetivos = $('.objetivos');
    	var IdRoteiro = $('#idRoteiro').val();
    	for (var i = 0; i < objetivos.length; i++) {
    		$.ajax({
				url: path + "ObjetivoAula",
				type: "POST",
				async: false,
				crossDomain: true,
				dataType: 'json',
				data:'action=create&objetivoAula='+objetivos[i].value+ '&status=1&roteiro='+IdRoteiro,
				success: function (data) {
					$('#linha3').html('<input type="hidden" id="idObjetivo" value="'+data+'">');
				}
			});

			if((i+1)==objetivos.length){
				mensagem('Objetivo(s) salvo com sucesso!','OK','bt_ok','sucesso');
			}
    	};
    })	
	})

	function carregaRoteiro(){
		var roteiroHTML="";
    	$.ajax({
		url: path + "RoteiroAula",
		type: "GET",
		async: false,
		crossDomain: true,
		dataType: 'json',
		success: function (data) {

			for (var i = 0 ; i < data.length; i++) {
				roteiroHTML += '<div class="roteiroAula" onclick="exibirRoteiro('+data[i].idroteiro_aula+')">'+
                                 '<p id="roteiroId_'+data[i].idroteiro_aula+'" ><span>Roteiro:</span>'+data[i].roteiro+'</p>'+
                               '</div>';
			};

			$('#box_roteiroAula').html(roteiroHTML);
		}
	});

}
	
function exibirRoteiro(idRoteiroAula){
		$("#Pesquisa").css("display","none");
		$("#Roteiro").css("display","block");

		$.ajax({
			url: path+"ObjetivoAula/ListarPorRoteiro/"+idRoteiroAula,
			type: "GET",
			async: false,
			crossDomain: true,
			dataType:'json',
			success: function(data){
				for (var i = 0 ;i < data.length; i++) {
					console.log(i);
					if(i==0){
						$("#val_roteiro").val(data[i].roteiro.roteiro);
						$("#val_descricao").val(data[i].roteiro.descricao);
						$("#btnSalvar").css("display","none");
						$("#btnEdit").css("display","block");

					}
					addObjetivo(data[i].objetivo,data[i].idobjetivo_aula);
				};
				

			}

		})
  }
$("#btnEdit").click(function(){

		var roteiro= $("#val_roteiro").val();
		var descricao= $("#val_descricao").val();
    	var IdRoteiro = $('#idRoteiro').val();

    	console.log(roteiro,descricao,IdRoteiro);



		$.ajax({
			url: path + "RoteiroAula",
			type: "POST",
			async: false,
			crossDomain: true,
			dataType: 'json',
			data:'action=update&roteiro='+roteiro+'&descricao='+descricao+'&idroteiro_aula'+idRoteiro,
			success: function (data) {
			}
		});
	});
function addObjetivo(objetivoA,idObjetivoA){
	$("#Inserir_roteiro").append('<div class="linha3">'+
		      	'<div class="celulaGrandeOB">'+
		      	'<div class="infoM"> Objetivo </div>'+
		      	'<div class="infoValueM">'+
		      		'<input type="text"  value="'+objetivoA+'" id="val_objetivo_'+idObjetivoA+'" class="infoValueM objetivos">'+
		      	'</div>' +  
		      	'</div>'+
		      	'</div>');
}