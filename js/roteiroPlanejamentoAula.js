//Murano Design 

var userID = usuarioId;
var professorID = localStorage.getItem("professorId");
var oficina = JSON.parse(localStorage.getItem("oficinaProfessor"));
var url = window.location.href;
p = url.split("planoAula=");
var planoAulaID = p[1];
var cor = oficina.oficina.tipoOficina.cor;
console.log(cor);

//------------------------------------------------------------------------------------------------------------------------


$(document).ready(function(){
	LoadRoteiro();
});

function LoadRoteiro(){	
	
	//Coloca as cores corretas das oficinas
	
	
	//Traz os roteiros pendentes do aluno
	var HtmlContent;
	//var dataRoteiroPendente = getData("PlanejamentoRoteiro/status", alunoID);

	HtmlContent = "";	
	var dataRoteiro = getData("RoteiroAula", null);
	
	idRoteiro = new Array();
	for(var a = 0; a < dataRoteiro.length; a++){
		
		HtmlContent = "";
		HtmlContent += "<div class='Content_Roteiro_Aluno_"+dataRoteiro[a].idroteiro_aula+"' style='background:red'>";	
		HtmlContent += "<div id='Roteiro_Id_"+dataRoteiro[a].idroteiro_aula+"' class='roteiro_nome_tabela_selecionado' onclick='ApareceObj("+dataRoteiro[a].idroteiro_aula+")' style='cursor: pointer'>"
		HtmlContent += "<div class='roteiro_nome_tabela_texto'>";
		HtmlContent += dataRoteiro[a].roteiro;
		HtmlContent += "</div>";
		HtmlContent += "<div class='tabela_colorida_roteiro'>";
		HtmlContent += "<table>";
		HtmlContent += "<tr class='QuadObj_"+dataRoteiro[a].idroteiro_aula+"'>";
		HtmlContent += "</tr>";
		HtmlContent += "</table>";
		HtmlContent += "</div>";
		HtmlContent += "</div>";
		
		$('.total').append(HtmlContent);
		
		HtmlContent = "";
		//Here Objectives
			HtmlContent +=_getObjetivos(dataRoteiro[a].idroteiro_aula);
		//end
		HtmlContent += "</div>";
		HtmlContent += "<div class='box_oculto box_"+dataRoteiro[a].idroteiro_aula+"' style='display:none'>";	
		HtmlContent += "</div>" ;
		HtmlContent += "<div style='clear: both;''> </div>"			
		
		$('.total').append(HtmlContent);
	}
	
	htmlPopUpContent = '<div class="blackPainel">'+
						'</div>';

	$('.total').append(htmlPopUpContent);
//	console.log($('.roteiro_nome_tabela_selecionado').val());
//	$('.roteiro_nome_tabela_selecionado').each(function(){
//		//console.log('----');
//		$(this).css('background-color','red');
//	})
	$('.roteiro_nome_tabela_selecionado').css('background-color',cor.forte);
	//$('.td_roteiro_numero_tabela').css('background-color',cor.medio);
	//$('.roteiro_nome_tabela_selecionado').css('font-color','blue');
}

//-----------------------------------------------------------------------------------------------------------------------------------------------

function ApareceObj(IdRoteiro)
{
	Id = IdRoteiro;
	var texto = $(".box_"+Id).text();
	
	if (texto == ''){
		LoadObjetivos(Id);
	}

	if ($(".box_"+Id).is(":visible")){
		$(".box_"+Id).hide();
	}else{
		$('.box_oculto').hide();
		$(".box_"+Id).show();
	}
}

function LoadObjetivos(idRoteiro){

	var id = idRoteiro;
	var Limite;
	var HtmlContent;
	var idativ = 0;
	var dataObjetivo =	getData("ObjetivoAula/ListarPorRoteiro/"+id);

    num = 1;
	Limite = dataObjetivo.length;
	if (Limite > 0){
        for(var a = 0; a < Limite; a++){
        	removeClick = false;
        	
        	status = getData("PlanejamentoAula/listarProfessorObjetivoAula/"+professorID+"/"+dataObjetivo[a].idobjetivo_aula+"/"+planoAulaID)
			if (status == 1){
				Cor = "laranja";
			}else if (status == 2){
				Cor = "verde";	
			}else{
				Cor = "branco";
			}
			
        	HtmlContent = "";
    		
    		HtmlContent +=  "<div class='conteudo_do_roteiro' style='display:block'>"+
    							"<div class='titulo_infos_roteiro' style='margin-left:-60px; width: 944px'>"+
    								"<div class='td_roteiro_numero_tabela'>"+
    									num+
    								"</div>"+
	    							"<div class='td_titulo_tabela' style='width: 915px;'>"+
	    								dataObjetivo[a].objetivo+
	    								"<div class='titulo_infos_roteiro_botoes'>"+
	    									"<div id='ObjStatus_"+dataObjetivo[a].idobjetivo_aula+"' class='titulo_infos_roteiro_estrela'>";
			HtmlContent +=					'<div onclick="trocarObjetivoStatus(this, '+professorID+', '+dataObjetivo[a].idobjetivo_aula+')" class="titulo_infos_roteiro_caixa_'+Cor+'" id="td_objetivo_squr_'+dataObjetivo[a].idobjetivo_aula+'" ></div>';
	    	HtmlContent +=					"</div>"+
	    								"</div>"+
	    							"</div>"+
	    						"</div>"+
	    					"</div>";
    		num++;

			if(dataObjetivo[a].objetivo!=null){
				$('.box_'+id).append(HtmlContent);
				//console.log('.box_'+id);
			}
        }
	}else{
		HtmlContent =  "<div class='conteudo_do_roteiro' style='display:block'>"+
							"<div class='titulo_infos_roteiro' style='margin-left:-60px; width: 944px'>"+
								"<div class='td_titulo_tabela' style='width: 915px; color: "+cor.forte+";background-color: "+cor.fraco+"'>Nenhum objetivo cadastrado.</div>"+
							"</div>"+
						"</div>";
		$('.box_'+id).append(HtmlContent);
	}

}
		 
//-----------------------------------------------------------------------------------------------------------------------------------------------

function trocarObjetivoStatus(Objeto, idProf, idObj){
	var corVariavel;
	var action;
	var statusVariavel;

	var data = new Date();
	var dataAtual = (data.getFullYear()+"-"+(data.getMonth()+1)+"-"+data.getDate());

	if(Objeto.className == "titulo_infos_roteiro_caixa_branco"){	
		corVariavel = "laranja";
		statusVariavel = 1;
		action = "create";	
	}
	else if(Objeto.className == "titulo_infos_roteiro_caixa_laranja"){
	 	corVariavel = "verde";
		statusVariavel = 2;
		action = "update";
		idPlanejamento = getData("PlanejamentoAula/listarIdProfessorObjetivoAula/"+idProf+"/"+idObj+"/"+planoAulaID);
	}
	else if(Objeto.className == "titulo_infos_roteiro_caixa_verde"){
		corVariavel = "branco";
		action = "deletar";
		idPlanejamento = getData("PlanejamentoAula/listarIdProfessorObjetivoAula/"+idProf+"/"+idObj+"/"+planoAulaID);
	}	 

	if(action=="create"){
			
		$.ajax({
		    url: path+"PlanejamentoAula/",
		    type: "POST",
		    crossDomain: true,
		    dataType: 'json',
		    data: "action=create&id=&status=1&idPlanoAula="+planoAulaID+"&idObjetivoAula="+idObj+"&idProfessor="+idProf,
		    beforeSend: function(){
		    	loading("inicial");
		    },
		    success: function(d) {
		    	document.getElementById('td_roteiro_squr_'+idObj).className = "td_roteiro_"+corVariavel;
			    Objeto.className = "titulo_infos_roteiro_caixa_"+corVariavel;
			},
			complete: function(){
			  	loading("final");
			}
		});
	}else if(action == "update"){
			
		$.ajax({
		    url: path+"PlanejamentoAula/",
		    type: "POST",
		    crossDomain: true,
		    data: "action=update&id="+idPlanejamento+"&status=2&idPlanoAula="+planoAulaID+"&idObjetivoAula="+idObj+"&idProfessor="+idProf,
		    beforeSend: function(){
		    	loading("inicial");
		    },
		    success: function(d) {
				document.getElementById('td_roteiro_squr_'+idObj).className = "td_roteiro_"+corVariavel;
				Objeto.className = "titulo_infos_roteiro_caixa_"+corVariavel;
		    },error: function() {
			    	alert("Não modificado, verifique os campos.");
			},
			complete: function(){
			  	loading("final");
			}
		}); 
	}else if(action == "deletar"){
		mensagem("Deseja realmente excluir este planejamento?","Cancelar","bt_cancelar","confirm",idObj,idPlanejamento,"deletarPlanejamento");
	}
	
}

function deletarPlanejamento(IDobjetivo,id){
	$.ajax({
		type: "POST",
		crossDomain: true,
		dataType:"text",
		data:"id="+id+"&action=delete",
		async: false,
		url: path+"PlanejamentoAula/",
		success: function(d) {
			$('#td_objetivo_squr_'+IDobjetivo).removeClass('titulo_infos_roteiro_caixa_verde').addClass('titulo_infos_roteiro_caixa_branco');
			$('#td_roteiro_squr_'+IDobjetivo).removeClass('td_roteiro_verde').addClass('td_roteiro_branco');	
			$("#boxMensagemGeral").css("display","none");
		}
	})
}



function _getObjetivos(Identificador)
{
	var RetornoHtml = "";
	var Cor = "";
	var IDplanejamentoRoteiro; 
	var IDplanoEstudo;
	var contadorLocal = 0;
	var Encontrado;
	var removeClick = false;
	$.ajax({
		url: path+"ObjetivoAula/ListarPorRoteiro/"+Identificador,
		type: "GET",
		async:false,
		crossDomain: true,
		success: function(dataObjetivoByRoteiro) {
		
			for(var a = 0; a < dataObjetivoByRoteiro.length; a++){ 			

				status = getData("PlanejamentoAula/listarProfessorObjetivoAula/"+professorID+"/"+dataObjetivoByRoteiro[a].idobjetivo_aula+"/"+planoAulaID);
				if (status == 1){
					Cor = "laranja";
				}else if (status == 2){
					Cor = "verde";	
				}else{
					Cor = "branco";
				}
				
				num = a+1;
				
				RetornoHtml +=	'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>';	
		
				$('.QuadObj_'+dataObjetivoByRoteiro[a].roteiro.idroteiro_aula).append('<td  class="td_roteiro_'+Cor+'" id="td_roteiro_squr_'+dataObjetivoByRoteiro[a].idobjetivo_aula+'">'+num+'</td>');

			}

			

		},error: function() {
			retorno = "erro";
		}
	});      

    return RetornoHtml;

}