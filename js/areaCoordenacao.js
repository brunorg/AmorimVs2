//Murano Design


//------------------------------------------------------------------------------------------------------------------------

//Carregas as variaveis padrao

	var Limite;
	var HtmlContent;
	var contador;
	var a;
	var largura;
	var ContadorPA;
	var d = new Date();

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado
	var userID = usuarioId;
	var ProfessorID = getProfessorByUsuario();
//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery

	$(document).ready(function() {	
	    CarregaServicoMural();	    
		var intervalo = window.setInterval(function() {
			$('.boxGrafico').css("display","block"); 
		}, 50);
		window.setTimeout(function() {
			clearInterval(intervalo);
			CarregaServicoProfessorFuncionario();
		}, 3000);		
	});



//------------------------------------------------------------------------------------------------------------------------

//Carrega a tabela Mural	
function CarregaServicoMural()
	{
		HtmlContent = "";
		var dataCalendarioM 	=	getData("Calendario/Evento", 44);
		
		for(var a=0; a< dataCalendarioM.length; a++)
		{

			var data = dataCalendarioM[a].dataInicio;
			var dia = data.substring(data.length-2);
			var mes = retornaMesByNumero(parseInt(data.substring(5,7)));
			
			HtmlContent+='<tr>'+
						//'<td class="dataMsg" onclick="window.location=\'#\';" style="background-color:rgb(247, 242, 222); line-height: 13px;">'+
						'<td class="dataMsg" onclick="window.location=\'#\';" style="background-color:rgb(247, 242, 222); line-height: 13px;">'+
							'<h2 class="muralData">'+dia+' de '+mes+'</h2>'+
							'<h3 class="muralTitulo">'+dataCalendarioM[a].evento+'</h3>'+
						'</td>'+
					'</tr>';
		}
	
		$('#Light_MuralTabela').html(HtmlContent);
	}

//------------------------------------------------------------------------------------------------------------------------

function qtdObjetivo(idTutoria){
	//console.log('idTutoria'+idTutoria);
	var NumeroRetornoPlanejamento = 0;
	var NumeroSerieAtualCorrigido = 0;	
	var SerieAtual;
	var SerieAtualCorrigido;
	var retorno = new Array();

	$.ajax({
		url: path+"PlanejamentoRoteiro/ObjetivoAlunoProfessor/"+idTutoria,
		type: "GET",
		async:false,
		crossDomain: true,
		success: function(countPlanejamento) {
				
			//console.log(countPlanejamento);	
						
			NumeroSerieAtualTotal= countPlanejamento.QuantidadeTotal;
			NumeroSerieAtualCompletos = countPlanejamento.QuantidadeCompletos;			
			NumeroSerieAtualCorrigido = countPlanejamento.QuantidadeCorrigidos;	
			
			
			
			if(NumeroSerieAtualTotal != 0 && NumeroSerieAtualCompletos != 0){
				SerieAtual = (NumeroSerieAtualCompletos/NumeroSerieAtualTotal)*100;
			}else{
				SerieAtual = 0;
			}
			
			if (NumeroSerieAtualTotal != 0 && NumeroSerieAtualCorrigido != 0){
				SerieAtualCorrigido = (NumeroSerieAtualCorrigido/NumeroSerieAtualTotal)*100;
			}else{
				SerieAtualCorrigido = 0;
			}
			
			retorno = {
				"SerieAtual" : SerieAtual,
				"SerieAtualCorrigido": SerieAtualCorrigido
			};
			
		}
		
	});	

	return retorno;
}

function getProfessor(id){
	var retorno;	
	$.ajax({
		url: path+"ProfessorFuncionarioVariavel/Professor/"+id,
		type: "GET",
		async:false,
		crossDomain: true,
		success: function(professorFuncionarioVariavel) {
			if(professorFuncionarioVariavel[0].professorFuncionario != null){
				retorno = professorFuncionarioVariavel[0].professorFuncionario.idprofessorFuncionario;
			}
		}						
	});
	return retorno;
}

function getProfessorByUsuario()
{
	var dataUsuario1 = getData("Usuario", userID);		
	return dataUsuario1.professor.idprofessorFuncionario;
}
//------------------------------------------------------------------------------------------------------------------------

//Funcao pra ordenar as classes e afins pela sua ordem alfabetica

	function OrdenarPor(TString)
	{		
			$('#Conteudo_Coluna3_Agenda_Evento_Content').find('.Conteudo_Coluna3_Agenda_Evento').sort(function(x,b){
			//console.log(x,b);
	        		return x.getElementsByClassName(TString)[0].innerHTML.substring(8, 10)+x.getElementsByClassName(TString)[0].innerHTML.substring(5, 7)+x.getElementsByClassName(TString)[0].innerHTML.substring(0, 2) > b.getElementsByClassName(TString)[0].innerHTML.substring(8, 10) + b.getElementsByClassName(TString)[0].innerHTML.substring(5, 7) + b.getElementsByClassName(TString)[0].innerHTML.substring(0, 2);
	       }).appendTo($('#Conteudo_Coluna3_Agenda_Evento_Content'));
	}