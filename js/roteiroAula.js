var userID = usuarioId;
var IDProfessor = localStorage.getItem("professorId");
var objetoOficina =	JSON.parse(localStorage.getItem("oficinaProfessor"));

var IDOficinaProfessor = objetoOficina.idoficina_professor;

$(document).ready(function(){
	var cont=2;

	var abas = document.getElementById('roteiros_content').getElementsByClassName('aba_roteiro');
	var cabecalhoItem = document.getElementById('roteiros_cabecalho').getElementsByTagName('div');

	trocaAba(cabecalhoItem[0]);

	function trocaAba(abaClicada) {

		if(abaClicada.id=="cabecalho_pesquisaOficial"){
			carregaRoteiroPesquisa();
		}else if(abaClicada.id=="cabecalho_pesquisa"){
			$("#pesquisaRoteiro").val("");
			carregaRoteiro();
		}else{
			$('.linha4').hide();
			$('.linhaObj').remove();
			$("#boxMensagemGeral").css("display","none");
			$("#btnSalvarObjetivo,#btnNovoOB,.celulaGrandeOB").css("display","none");
			$("#linha1,#linha2,#btnSalvar").css("display","block");
			$('#val_roteiro').val('');
			$('#val_descricao').val('');
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

	$("#btnSalvar").click(function(){
		
		var roteiro= $("#val_roteiro").val();
		var descricao= $("#val_descricao").val();

		if (roteiro == ''){
			return mensagem('O campo roteiro é obrigatório!','OK','bt_ok','erro');
		}
		if (descricao == ''){
			return mensagem('O campo descrição é obrigatório!','OK','bt_ok','erro');
		}
		
		$.ajax({
			url: path + "RoteiroAula",
			type: "POST",
			async: false,
			crossDomain: true,
			dataType: 'json',
			data:'action=create&roteiro='+roteiro+'&Descricao='+descricao+'&idOficinaProfessor='+IDOficinaProfessor,
			success: function (data) {
				$("#idRoteiro").val(data);
				$("#linha1,#linha2,#btnSalvar").css("display","none");
				mensagem('Roteiro salvo com sucesso!','OK','bt_ok','sucesso');
				
				$("#Rot_inserido_Nome").html(roteiro);
				$("#Desc_Inserido_Nome").html(descricao);
				MostrarObjetivo();
				
				$('#Btn_Del_Rot').click(function() {
					excluirRoteiroAula1(data);
				});
				$('#Btn_Editar_Rot').click(function(){
					utilizarRoteiroAula(data);
					j = 0
					$('.box_mensagem_rotcad .txt_mensagem').each(function(){
						if (j>1){
							$(this).hide();
						}
						j++;
					})
					$(".btn_mensagemCad").css('padding-top','30px');
				});
			}
		});
	});

	$("#btnSalvarObjetivo").click(function(){
		var objetivos = $('.objetivos');
		var IdRoteiro = $('#idRoteiro').val();
		var altura = $(".linha4").height();
		
		if (objetivos[0].value == ''){
			return mensagem('O campo objetivo é obrigatório!','OK','bt_ok','erro');
		}
		
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
					$(".linha4").append('<div class="linhaObj" id="linhaObj'+data+'">'+
                                            '<div id="Atv_Obj_Info_1" class="Atv_Obj_Info">'+
                                                '<p id="Atv_Obj_Nome" class="Atv_Obj_Nome">'+objetivos[i].value+'</p>'+
                                                '<div id="Obj_Inserida_Btns_1" class="Obj_Inserido_Btns">'+
                                                    '<div id="Btn_Editar_Obj" class="Btn_Atv Btn_Editar_Obj" onclick="modalObjetivo('+data+')"></div>'+
                                                    '<div id="Btn_Del_Obj" class="Btn_Atv Btn_Del_Obj" onclick="excluirObjetivo('+data+')"></div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>');
				}
			});

			if((i+1)==objetivos.length){
				$("#val_objetivo_1").val('');
				mensagem('Objetivo salvo com sucesso!','OK','bt_ok','sucesso');
			}
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

	//carregaCiclo();
	//carregaPeriodo();
	//carregaOficina();	

});//fecha document jquery
function MostrarObjetivo(){
	$(".celulaGrandeOB").css("display","block");
	$("#btnSalvarObjetivo,#btnNovoOB").css("display","block");
	$(".linha4").css("display","block");
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

//nao sei a diferença das duas funcoes mas deixei aqui pra evitar problema
function excluirRoteiroAula(idRoteiroA){
	mensagem('Deseja excluir roteiro? ','Cancelar','bt_cancelar','confirm',idRoteiroA,'','excluirROT');
}
function excluirRoteiroAula1(idRoteiroA){
	mensagem('Deseja excluir roteiro?? ','Cancelar','bt_cancelar','confirm',idRoteiroA,'','excluirROT');
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
			$('.linha4').hide();
			$('.linhaObj').remove();
			$("#boxMensagemGeral").css("display","none");
			$("#btnSalvarObjetivo,#btnNovoOB,.celulaGrandeOB").css("display","none");
			$("#linha1,#linha2,#btnSalvar").css("display","block");
			
			$('#val_roteiro').val('');
			$("#idRoteiro").val('');
			$('#val_descricao').val('');
			$('#Roteiro_'+idroteiroAulaa).remove();
		}
	})

}

var setaOld;
function ListarObjetivos(idroteiroAula, index){
	

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
			//console.log(data);
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
	loading("inicial");
	var oficinaProfessor= IDOficinaProfessor;
	$.ajax({
		url: path+"ObjetivoAula/ClonarObjetivo",
		type: "POST",
		async: false,
		crossDomain: true,
		dataType:'text',
		data:'idOficinaProfessor='+oficinaProfessor+'&idRoteiroAula='+idRoteiroAula,
		success: function(d) {
			mensagem('Roteiro clonado com sucesso!','OK','bt_ok','sucesso');
			loading("final");
			return false;
		},error(d){
			
			alert('erro ao clonar!!');
		}
	});	
}
function utilizarRoteiroAula(idRoteiro){
	
	$(".box_mensagem_rotcad").html('');
	var HtmlContent;
	var idRoteiro;
	
	$.ajax({
		url: path+"ObjetivoAula/ListarPorRoteiroHash/"+idRoteiro,
		type: "GET",
		async: false,
		crossDomain: true,
		dataType:'json',
		success: function(data){

			for (var i = 0 ;i < data.length; i++) {
				if (i == 0){
					
					idRoteiro = data[i].idRoteiro_aula;
					HtmlContent += '<div class="box_mensagem_rotcad">'+
					'<div class="txt_mensagem">'+
						'<div class="Roteiro_Col_4" style="width: 100%;">'+
							'<div class="Roteiro_Linha No_Padding_Itens">'+
								'<div class="Roteiro_Col_3 No_Padding">'+
									'<div class="Ano_Inserir_Info Input_Info">Roteiro</div>'+
								'</div>'+
								'<div class="Roteiro_Col_9 No_Padding">'+
									'<input id="roteiroAula" class="Input_Area" placeholder="Nome do roteiro" required value="'+data[i].roteiro+'"> </input>'+
								'</div>'+
							'</div>'+
						'</div>'+
					  '</div>'+
					  '<div class="txt_mensagem">'+
						'<div class="Roteiro_Col_4" style="width: 100%;">'+
							'<div class="Roteiro_Linha No_Padding_Itens">'+
								'<div class="Roteiro_Col_3 No_Padding">'+
									'<div class="Ano_Inserir_Info Input_Info">Descrição</div>'+
								'</div>'+
								'<div class="Roteiro_Col_9 No_Padding">'+
									'<input id="descricao" class="Input_Area" placeholder="Descrição do roteiro" required value="'+data[i].descricao+'"> </input>'+
								'</div>'+
							'</div>'+
						'</div>'+
					  '</div>';
						//'<br/>'+
				}
				
				cont = i+1;

				if (data[i].idObjetivo_aula == undefined){
					idObjetivo = '';
					objetivo = '';
				}else{
					idObjetivo = data[i].idObjetivo_aula;
					objetivo = data[i].objetivo;
				}
				HtmlContent +=
				  '<div class="txt_mensagem">'+
					'<div class="Roteiro_Col_4" style="width: 100%;">'+
						'<div class="Roteiro_Linha No_Padding_Itens">'+
							'<div class="Roteiro_Col_3 No_Padding">'+
								'<div class="Ano_Inserir_Info Input_Info">Objetivo '+cont+'</div>'+
							'</div>'+
							'<div class="Roteiro_Col_9 No_Padding">'+
								'<input id="objetivo'+cont+'" class="Input_Area objetivoRoteiro" placeholder="Objetivo" required value="'+objetivo+'" valAtual="'+objetivo+'" idObjetivo="'+idObjetivo+'"> </input>'+
							'</div>'+
						'</div>'+
					'</div>'+
				  '</div>';
				
				
			}
			
			HtmlContent +=
				'<div class="txt_mensagem botao_mais" style="text-align: right; width: 100%; padding: 10px"><img src="img/btAdd.png" style="cursor: pointer" onclick="criarCampoNovoObjetivo()" /></div>'+
				//'</div>'+
				'<div class="btn_mensagemCad">'+
					'<input type="hidden" value="'+idRoteiro+'" name="idRoteiroAula" id="idRoteiroAula">'+
					'<input type="button" class="bt_ok left" value="OK" onclick="editarRoteiro()"/>'+
					'<input type="button" class="bt_cancelar" value="Cancelar" onclick="fecharBoxModal()" />'+
				'</div>'+
				'</div>'+
			'</div>';
		}
	});
	
	
	$('#boxModal').html(HtmlContent).css('display','block');
	centralizarBoxModal();

	return false;
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
	$("#box_objetivoAula").append('<div class="linha3 linhasObjetivos">'+
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

function fecharBoxModal(){
	$('#boxModal').css('display','none');
}

//-----------------------------------------------------------------------------------------------------

function centralizarBoxModal()
{
	//Existe uma função semelhante a essa no funcoes.js. Porém, ela lida com os modais de mensagem.
	//Como haverá inputs em modais somente em algumas páginas, eu preferi manter essas funções locais.

	var heightBox = parseInt($('.box_mensagem_rotcad').height());
	var marginTop = Math.floor(-heightBox/2).toString() + 'px';

	$('.box_mensagem_rotcad').css('margin-top', marginTop);
}

function verificarTamanhoModal()
{
	//Manter até (e se) inserir a barra de rolagem no modal.
	var heightBox 		= parseInt($('.box_mensagem_rotcad').height());
	var heightWindows	= parseInt($(window).height());

	if ( heightWindows - heightBox <= 100) {
		mensagem("Ainda não tem barra de rolagem.","OK","bt_ok","alerta");
		return false;
	} else {
		return true;
	}
}

//-----------------------------------------------------------------------------------------------------

function editarRoteiro(){
	var roteiro= $("#roteiroAula").val();
	var descricao= $("#descricao").val();
	var IdRoteiro = $('#idRoteiroAula').val();

	if (roteiro == ''){
		return mensagem('O campo roteiro é obrigatório!','OK','bt_ok','erro');
	}
	if (descricao == ''){
		return mensagem('O campo descrição é obrigatório!','OK','bt_ok','erro');
	}
	
	$.ajax({
		url: path + "RoteiroAula",
		type: "POST",
		async: false,
		crossDomain: true,
		dataType: 'json',
		data:'action=update&roteiro='+roteiro+'&Descricao='+descricao+'&id='+IdRoteiro+'&idOficinaProfessor='+IDOficinaProfessor,
		success: function (data) {
			
			$('.objetivoRoteiro').each(function(){
				if ($(this).val() != $(this).attr('valAtual')){
					if ($(this).val() != ''){
						
						if ($(this).attr('valAtual') == '') acao = 'create';
							else acao = 'update';
						
						$.ajax({
							url: path + "ObjetivoAula",
							type: "POST",
							async: false,
							crossDomain: true,
							dataType: 'json',
							data:'action='+acao+'&objetivo='+$(this).val()+ '&roteiro='+IdRoteiro+'&id='+$(this).attr('idObjetivo'),
						});
						
					}else{
						if ($(this).attr('valAtual') != ''){
							$.ajax({
								url: path + "ObjetivoAula",
								type: "POST",
								async: false,
								crossDomain: true,
								dataType: 'json',
								data:"action=delete&id="+$(this).attr('idObjetivo'),
							});
						}
					}
				}
			})

			fecharBoxModal()
			mensagem('Alterações salvas com sucesso!','OK','bt_ok','sucesso');
			
			$("#Roteiro_"+IdRoteiro+" .titulo_roteiro").text(roteiro);
			$("#Rot_inserido_Nome").text(roteiro);
			$("#Desc_Inserido_Nome").text(descricao)
		}
	});
}

function criarCampoNovoObjetivo(){
	var verificador = verificarTamanhoModal();

	if ( verificador ) {
		cont = ($('.txt_mensagem').size() - 2);
		HtmlContent =
			  '<div class="txt_mensagem">'+
				'<div class="Roteiro_Col_4" style="width: 100%;">'+
					'<div class="Roteiro_Linha No_Padding_Itens">'+
						'<div class="Roteiro_Col_3 No_Padding">'+
							'<div class="Ano_Inserir_Info Input_Info">Objetivo '+cont+'</div>'+
						'</div>'+
						'<div class="Roteiro_Col_9 No_Padding">'+
							'<input id="objetivo'+cont+'" class="Input_Area objetivoRoteiro" placeholder="Objetivo" required value="" valAtual="" idObjetivo=""> </input>'+
						'</div>'+
					'</div>'+
				'</div>'+
			  '</div>';
		$('.txt_mensagem').not('.botao_mais').last().after(HtmlContent);
		centralizarBoxModal();
	}
	cont = 2;
}

function excluirObjetivo(idObjetivo){
	$.ajax({
		url: path + "ObjetivoAula",
		type: "POST",
		async: false,
		crossDomain: true,
		dataType: 'json',
		data:"action=delete&id="+idObjetivo,
		success: function (d) {
			$('#linhaObj'+idObjetivo).remove();
		}
	});
}

function modalObjetivo(idObjetivo){
	//console.log(getData('ObjetivoAula',48));
	//Deu certo, mas pode 
	
	$.ajax({
		//url: path + "ObjetivoAula/"+idObjetivo,
		url: path + "ObjetivoAula/ListarLazy/"+idObjetivo,
		type: "GET",
		async: false,
		crossDomain: true,
		dataType: 'json',
		success: function (data) {
			
			HtmlContent = '<div class="box_mensagem_rotcad">'+
				'<div class="txt_mensagem">'+
					'<div class="Roteiro_Col_4" style="width: 100%;">'+
						'<div class="Roteiro_Linha No_Padding_Itens">'+
							'<div class="Roteiro_Col_3 No_Padding">'+
								'<div class="Ano_Inserir_Info Input_Info">Objetivo</div>'+
							'</div>'+
						'<div class="Roteiro_Col_9 No_Padding">'+
							'<input id="objetivoAula" class="Input_Area" placeholder="Nome do roteiro" required value="'+data.Objetivo+'"> </input>'+
						'</div>'+
					'</div>'+
				'</div>'+
				
				'<div class="btn_mensagemCad" style="padding-top: 80px">'+
					'<input type="hidden" value="'+idObjetivo+'" name="idObjetivoAula" id="idObjetivoAula">'+
					'<input type="hidden" value="'+data.Objetivo+'" name="objetivoAtual" id="objetivoAtual">'+
					'<input type="hidden" value="'+data.idRoteiro+'" name="idRoteiroAula" id="idRoteiroAula">'+
					'<input type="button" class="bt_ok left" value="OK" onclick="editarObjetivo()"/>'+
					'<input type="button" class="bt_cancelar" value="Cancelar" onclick="fecharBoxModal()" />'+
				'</div>'+
			'</div>';
			
			$('#boxModal').html(HtmlContent).css('display','block');
			centralizarBoxModal();
		}
	});
}

function editarObjetivo(){
	obj = $("#objetivoAula").val();
	idRot = $("#idRoteiroAula").val();
	idObj = $("#idObjetivoAula").val();
		
	if (obj == ''){
		return mensagem('O objetivo é obrigatório!','OK','bt_ok','erro');
	}
	
	if (obj != $('#objetivoAtual').val()){
		$.ajax({
			url: path + "ObjetivoAula",
			type: "POST",
			async: false,
			crossDomain: true,
			dataType: 'json',
			data:"action=update&objetivo="+obj+"&id="+idObj+"&roteiro="+idRot,
			success: function (data) {
				$('#linhaObj'+idObj+' .Atv_Obj_Nome').text(obj);
				$('#boxModal').css('display','none');
			},
			error:function(){
				return mensagem('Erro ao editar!','OK','bt_ok','erro');
			}
		});
	}else{
		$('#boxModal').css('display','none');
	}
}