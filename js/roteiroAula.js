$(document).ready(function(){
	var userID = usuarioId;
	var IDProfessor = getAlunoByUsuario(userID);
	var cont=2;

	var abas = document.getElementById('roteiros_content').getElementsByClassName('aba_roteiro');
	var cabecalhoItem = document.getElementById('roteiros_cabecalho').getElementsByTagName('div');

	trocaAba(cabecalhoItem[0]);	

	function trocaAba(abaClicada) {
		if(abaClicada.id=="cabecalho_pesquisa"){
			carregaRoteiro();
		}
		for(var i = 0; i < cabecalhoItem.length; i++) {

			if(cabecalhoItem[i] === abaClicada) {
				$(abas[i]).show();
				$(cabecalhoItem[i]).addClass("cabecalho_ativo");
			} else {
				$(abas[i]).hide();
				$(cabecalhoItem[i]).removeClass("cabecalho_ativo");
			}
		}
	}

	for (var i = 0; i <cabecalhoItem.length; i++) {
		cabecalhoItem[i].onclick = function(){
			trocaAba(this);
			return false;
		};
		cabecalhoItem[i].onfocus = function(){
			trocaAba(this);
			return false;
		};
	}

	$("#btnNovoOB").click(function() {
		$("#box_objetivoAula").append('<div class="linha3">'+
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
			data:'action=create&roteiro='+roteiro+'&Descricao='+descricao+'&idOficinaProfessor=3',
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
				data:'action=create&objetivo='+objetivos[i].value+ '&status=1&roteiro='+IdRoteiro,
				success: function (data) {
					$('#linha3').html('');
				}
			});

			if((i+1)==objetivos.length){
				mensagem('Objetivo(s) salvo com sucesso!','OK','bt_ok','sucesso');
			}
    	};
    })

	$("#btnEditRot").click(function(){
		var roteiro= $("#val_roteiro").val();
		var descricao= $("#val_descricao").val();
    	var IdRoteiro = $('#idRoteiro').val();
    	var IdProfessor = $('#idOficinaProfessor').val();

		$.ajax({
			url: path + "RoteiroAula",
			type: "POST",
			async: false,
			crossDomain: true,
			dataType: 'json',
			data:'action=update&roteiro='+roteiro+'&Descricao='+descricao+'&id='+IdRoteiro+'&idOficinaProfessor=3',
			success: function (data) {
				$('#linha1','#linha2').html('<input type="hidden" id="idRoteiro" value="'+data+'">');
				mensagem('Alterações salvas com sucesso!','OK','bt_ok','sucesso');
			}
		});
	});
	$("#btnEditOB").click(function(){
		var IdRoteiro = $('#idRoteiro').val();
		var objetivos = $('.objetivos');

		for (var i = 0; i < objetivos.length; i++) {
    		$.ajax({
				url: path + "ObjetivoAula",
				type: "POST",
				async: false,
				crossDomain: true,
				dataType: 'json',
				data:'action=update&objetivo='+objetivos[i].value+ '&roteiro='+IdRoteiro+'&id='+objetivos[i].id,
				success: function (data) {
					$('#linha3').html('');
					mensagem('Alterações salvas com sucesso!','OK','bt_ok','sucesso');
				}
			});
    	};	
	});

	$('#buscaRoteiro').change(function(){
		var comboBusca = $('#buscaRoteiro option:selected').val();
		if(comboBusca=="oficina"){
			$("#linha6").css("display","block");
			$("#linha8,#Inserir_pesquisa,#linha10").css("display","none");
		}
		if(comboBusca=="professor"){
			$("#linha8,#linha10").css("display","block");
			$("#linha6,#linha7,#Inserir_pesquisa").css("display","none");
		}
	});
	$("#oficina").change(function(){
		$("#linha7").css("display","block");
	});
	carregaCiclo();
	carregaPeriodo();
	carregaOficina();	
});//fecha document jquery

function MostrarObjetivo(){
    $(".celulaGrandeOB").show();
    $("#btnSalvarObjetivo,#btnNovoOB").css("display","block");
};

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
				roteiroHTML += '<div class="item">'+
					'<div class="titulo_roteiro">'+data[i].roteiro+'</div>'+ 
					'<span class="editar" onclick="exibirRoteiro('+data[i].idroteiro_aula+')"></span>'+
					'</div>';	
			};
			$('#box_roteiroAula').html(roteiroHTML);
		}
	});	
}
function exibirRoteiro(idRoteiroAula){
	$("#Pesquisa").css("display","none");
	$("#Roteiro").css("display","block");
	$("#cabecalho_pesquisa").removeClass('cabecalho_ativo');
  	$("#cabecalho_roteiro").addClass('cabecalho_ativo');
	$("#box_objetivoAula").html('');
	$.ajax({
		url: path+"ObjetivoAula/ListarPorRoteiro/"+idRoteiroAula,
		type: "GET",
		async: false,
		crossDomain: true,
		dataType:'json',
		success: function(data){
			for (var i = 0 ;i < data.length; i++) {
				if(i==0){
					$("#idRoteiro").val(data[i].roteiro.idroteiro_aula);
					$("#val_roteiro").val(data[i].roteiro.roteiro);
					$("#val_descricao").val(data[i].roteiro.descricao);
					$("#btnSalvar").css("display","none");
					$("#btnSalvarObjetivo").css("display","none");
					$("#btnEditOB").css("display","block");
					$("#btnEditRot").css("display","block");
				}
				addObjetivo(data[i].objetivo,data[i].idobjetivo_aula);
			};
		}
	});
}

function addObjetivo(objetivoA,idObjetivoA){
	$("#box_objetivoAula").append('<div class="linha3">'+
		'<div class="celulaGrandeOB">'+
		'<div class="infoM"> Objetivo </div>'+
		'<div class="infoValueM">'+
			'<input type="text"  value="'+objetivoA+'" id="'+idObjetivoA+'" class="infoValueM objetivos">'+
		'</div>' +  
		'</div>'+
		'</div>');
};

function buscaRoteirAula(){
    $.ajax({
        url: path + "RoteiroAula/ListarLikeRoteiro/"+$('#pesqRoteiro').val(),
		type: "GET",
		async: false,
		crossDomain: true,
		dataType: 'html',
		success: function (data) {
			console.log(data);
		   $('#box_roteiroAula').html(data);
		}
    });   
}
function carregaOficina(){
	var HtmlConteudo;
	$.ajax({
		url: path + "Oficina",
		type: "GET",
		async: false,
		crossDomain: true,
		dataType: 'json',
		success: function (dataOF) {
			for (var i = 0; i < data.length; i++) {
				HtmlConteudo += '<option class="opcaoOF" value="'+dataOF[i].idoficina+'">'+dataOF[i].nome+'</option>';
			};
		}
	});
	$('#oficina').append(HtmlConteudo);
}
function carregaPeriodo(){
	var HtmlPeriodo;
	$.ajax({
		url: path + "Periodo",
		type: "GET",
		async: false,
		crossDomain: true,
		dataType: 'json',
		success: function (dataP) {
			for (var i = 0; i < data.length; i++) {
				HtmlPeriodo += '<option class="opcaoPE" value="'+dataP[i].idperiodo+'">'+dataP[i].periodo+'</option>';
			};
		}
	});
	$('#periodo').append(HtmlPeriodo);
}
function carregaCiclo(){
	var HtmlCiclo;
	$.ajax({
		url: path + "Ciclo",
		type: "GET",
		async: false,
		crossDomain: true,
		dataType: 'json',
		success: function (dataC) {
			console.log(dataC);
			for (var i = 0; i < dataC.length; i++) {
				HtmlCiclo += '<option class="opcaoCI" value="'+dataC[i].idciclos+'">'+dataC[i].ciclo+'</option>';
			};
		}
	});
	$('#ciclo').append(HtmlCiclo);
}
