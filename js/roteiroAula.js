var userID = usuarioId;
var IDProfessor = localStorage.getItem("professorId");
var objetoOficina =	JSON.parse(localStorage.getItem("oficinaProfessor"));
var IDOficinaProfessor = objetoOficina[0].idoficina_professor;

$(document).ready(function(){
	var cont=2;

	var abas = document.getElementById('roteiros_content').getElementsByClassName('aba_roteiro');
	var cabecalhoItem = document.getElementById('roteiros_cabecalho').getElementsByTagName('div');

	trocaAba(cabecalhoItem[0]);	

	function trocaAba(abaClicada) {
		if(abaClicada.id=="cabecalho_pesquisaOficial"){
			carregaRoteiroPesquisa();
		}else if(abaClicada.id=="cabecalho_pesquisa"){
			carregaRoteiro();
			 $( ".celulaGrandeOB" ).remove();
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

	$("#btnEdit").click(function(){
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
	$("#btnEdit").click(function(){
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
		}
		if(comboBusca=="professor"){
			$("#linha8,#linha10").css("display","block");
			$("#linha6,#linha7,#Inserir_pesquisa").css("display","none");
		}
	});
	$("#oficina").change(function(){
		$("#linha7").css("display","block");		
		var idOficina=$(this).val();
		exibirListaOficina(idOficina,0,IDProfessor);
	});

	$("#ciclo").change(function(){	
		var idOficina=$("#oficina").val();	
		var idCiclo=$(this).val();
		exibirListaOficina(idOficina,idCiclo,IDProfessor);
	});

	carregaCiclo();
	carregaPeriodo();
	carregaOficina();	

});//fecha document jquery
function MostrarObjetivo(){
	$(".celulaGrandeOB").show();
	$("#btnSalvarObjetivo,#btnNovoOB").css("display","block");
};
function adeclarar(){
	$.ajax({
		url: path + "RoteiroAula/ListarLikeRoteiroAula/"+idOficinaProfessor+letras,
		type: "GET",
		async: false,
		crossDomain: true,
		dataType: 'html',
		success: function (data) {
			$('#box_roteiroAula').html(data);
		}
	});   
}

function carregaRoteiro(){
	var rotPesq = $("#pesquisaRoteiro").val();
	var urlAj;
	console.log(pesquisaRoteiro);
	if(rotPesq==""){
		urlAj = path + 'RoteiroAula/ListarPorOficinaProfessor/'+IDOficinaProfessor+'/-';
	}
	else{
		urlAj = path + 'RoteiroAula/ListarPorOficinaProfessor/'+IDOficinaProfessor+'/'+rotPesq;
	}
	var rotHTML="";
	$.ajax({
		url: urlAj,
		type: "GET",
		async: false,
		crossDomain: true,
		dataType: 'json',
		success: function (data) {
			for (var i = 0 ; i < data.length; i++) {
				rotHTML += '<div class="item" id="Roteiro_'+data[i].idroteiro_aula+'">'+
				'<div class="titulo_roteiro">'+data[i].roteiro+'</div>'+ 
				'<span class="editar" onclick="utilizarRoteiroAula('+data[i].idroteiro_aula+')"></span>'+
				'<span class="excluir" onclick="excluirRoteiroAula('+data[i].idroteiro_aula+')"></span>'+
				'</div>';	
			};
			$('#box_roteiroAula').html(rotHTML);
		}
	});	
}
function carregaRoteiroPesquisa(){
	var roteiroPesquisa = $("#pesqRoteiro").val();
	var urlAjax;
	if(roteiroPesquisa==""){
		urlAjax = path + 'RoteiroAula/ListarNaoOficinaProfessor/'+IDOficinaProfessor+'/-';
	}else{
		urlAjax = path + 'RoteiroAula/ListarNaoOficinaProfessor/'+IDOficinaProfessor+'/'+roteiroPesquisa;
	}

	var roteiroHTML="";
	$.ajax({
		url: urlAjax,
		type: "GET",
		async: false,
		crossDomain: true,
		dataType: 'json',
		success: function (data) {
			for (var i = 0 ; i < data.length; i++) {
				roteiroHTML += '<div class="item">'+
				'<div class="titulo_roteiro1">'+data[i].roteiro+'</div>'+ 
				'<span class="listarObjetivo" id="setaObjetivo_'+data[i].idroteiro_aula+'" onclick="ListarObjetivos('+data[i].idroteiro_aula+','+i+')"></span>'+
				'<span class="utilizarRoteiro" onclick="clonarRoteiroAula('+data[i].idroteiro_aula+')"></span>'+
				'</div>'+
				'<div class="escondido" id="ListaObj_'+data[i].idroteiro_aula+'"></div>';	
			};
			$('#boxRoteiroAulaPesquisa').html(roteiroHTML);
		}
	});	
}
function excluirRoteiroAula(idRoteiroA){
	mensagem('Deseja excluir roteiro? ','Cancelar','bt_cancelar','confirm',idRoteiroA,'','excluirROT');
}
function excluirROT(idroteiroAulaa){	
	$.ajax({
		url: path + "RoteiroAula/status",
		type: "POST",
		async: false,
		crossDomain: true,
		dataType: 'json',
		data:'id='+idroteiroAulaa,
		success: function () {
			
		}
	})
	$('#Roteiro_'+idroteiroAulaa).remove();
	$("#boxMensagemGeral").css("display","none");
}

var setaOld;
function ListarObjetivos(idroteiroAula, index){
	console.log('old--'+setaOld,idroteiroAula);

	if(setaOld != idroteiroAula){
		$('#setaObjetivo_'+setaOld).removeClass('voltarObjetivo');
	}

	$("#ListaObj_"+idroteiroAula).toggleClass('aparecer');
	$('#setaObjetivo_'+idroteiroAula).toggleClass('voltarObjetivo');

	var objetivosHTML="";
	$.ajax({
		url: path+"ObjetivoAula/ListarPorRoteiroLazy/"+idroteiroAula,
		type: "GET",
		async: false,
		crossDomain: true,
		dataType:'json',
		success: function(data){
			console.log(data);
			for (var i = 0 ;i < data.length; i++) {
				objetivosHTML += "<p class='nomeObj'>"+data[i].objetivo+"</p>";
			}
			$("#ListaObj_"+idroteiroAula).html(objetivosHTML);
		}
	});		

	var listCont = $('#ListaObj_'+idroteiroAula+' .nomeObj').length;
	var alturaContainer = listCont*44;
	var listOBJid = $('.escondido');

	for(var a=0 ; a< listOBJid.length; a++ ){
		$($('.listarObjetivo').get(a)).removeClass('objetivoExpandido');
		$($(listOBJid).get(a)).css('height','0');
	}

	if ($("#ListaObj_"+idroteiroAula).height() == "0") {
		$("#ListaObj_"+idroteiroAula).css('height',alturaContainer.toString()+'px');
		$($(".listarObjetivo").get(index)).addClass('objetivoExpandido');
	} else {
		$("#ListaObj_"+idroteiroAula).css('height','0');
	}
	setaOld = idroteiroAula;
}

function clonarRoteiroAula(idRoteiroAula){
	var oficinaProfessor= IDOficinaProfessor;
	$.ajax({
		url: path+"ObjetivoAula/ClonarObjetivo",
		type: "POST",
		async: false,
		crossDomain: true,
		dataType:'json',
		data:'idOficinaProfessor='+oficinaProfessor+'&idRoteiroAula='+idRoteiroAula,
	});	
}
function utilizarRoteiroAula(idRoteiroAula){
	$("#Pesquisa").css("display","none");
	$("#Roteiro").css("display","block");
	$("#cabecalho_pesquisa").removeClass('cabecalho_ativo');
	$("#cabecalho_roteiro").addClass('cabecalho_ativo');
	$("#box_roteiroAula").html('');
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
					$("#btnNovoOB").css("display","block");
					$("#btnEdit").css("display","block");

				}
				addObjetivo(data[i].objetivo,data[i].idobjetivo_aula);
			};
			$("#roteiroSalvo").html(roteiro).css("display","block");
			$("#descricaoSalvo").html(descricao).css("display","block");
		}
	});
}
function exibirListaOficina(idOficina,idCiclo,IDProfessor){
	var oficinaHTML="";
	$.ajax({
		url: path + "RoteiroAula/ListarOficinaCiclo/"+idOficina+"/"+idCiclo+"/"+IDProfessor,
		type: "GET",
		async: false,
		crossDomain:true,
		dataType: 'json',
		success: function(data){
			for (var i = 0 ; i < data.length; i++) {
				oficinaHTML += '<div class="item">'+
				'<div class="titulo_roteiro">'+data[i].roteiro+'</div>'+ 
				'<span class="utilizarRoteiro" onclick="utilizarRoteiroAula('+data[i].idroteiro_aula+')"></span>'+
				'</div>';	
			};
			$('#boxRoteiroAulaPesquisa').html(oficinaHTML);
		}
	});
}
function buscaRoteirAula(){
	$.ajax({
		url: path + "RoteiroAula/ListarLikeRoteiro/"+$('#pesqRoteiro').val(),
		type: "GET",
		async: false,
		crossDomain: true,
		dataType: 'html',
		success: function (data) {
			$('#boxRoteiroAulaPesquisa').html(data);
		}
	});   
}
function buscaMeusRoteiros(){
	$.ajax({
		url: path + "RoteiroAula/ListarLikeRoteiro/"+$('#pesquisaRoteiro').val(),
		type: "GET",
		async: false,
		crossDomain: true,
		dataType: 'html',
		success: function (data) {
			$('#box_roteiroAula').html(data);
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
			for (var i = 0; i < dataC.length; i++) {
				HtmlCiclo += '<option class="opcaoCI" value="'+dataC[i].idciclos+'">'+dataC[i].ciclo+'</option>';
			};
		}
	});
	$('#ciclo').append(HtmlCiclo);
}
/*teste*/
