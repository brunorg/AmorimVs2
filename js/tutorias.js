
var Limite;
var HtmlContent;
var contador;
var a;
var largura;
var ContadorPA;
var d = new Date();

var userID = usuarioId;
var ProfessorID = getProfessorByUsuario();

$(document).ready(function() {	    	
	CarregaServicoProfessorFuncionario();	
});

//Carrega a tabela ProfessorFuncionario
function CarregaServicoProfessorFuncionario(){		
	var Faltas;		
	var idTutoria;
	var totalObjetivos;
	var SerieAtualRes;
	var SerieAtualCorrigidoRes;
	
	$.ajax({
		url: path+"Tutoria",
		type: "GET",
		async:true,
		crossDomain: true,
		timeout: 3000, 
		success: function(dataTutoria) {
			HTMLContente = "";
			Limite = dataTutoria.length;
			for(var a=0; a < dataTutoria.length; a++){

				idTutoria = dataTutoria[a].idtutoria;				
				
				//if((dataTutoria[a].tutor != null) && (idTutoria < 3)){  //Linha de teste para a pagina ficar mais rapida!!
				if(dataTutoria[a].tutor != null){
					//console.log(dataTutoria[a]);
					var id = getProfessor(dataTutoria[a].tutor.idprofessorFuncionario);
					
					var total = qtdObjetivo(idTutoria);
					SerieAtualRes = total.SerieAtual;
					SerieAtualCorrigidoRes = total.SerieAtualCorrigido;
									
					$.ajax({
						url: path+"PresencaProfessor/Professor/"+id,
						type: "GET",
						async:false,
						crossDomain: true,
						success: function(d) {
							Faltas = d;
						}
					});
					
					HTMLContente+='<div class="Grafico_Individual_Aluno">';
					HTMLContente+='<div class="Grafico_Individual_Aluno_Falta_Numero">'+Faltas+'</div>';
					HTMLContente+='<div class="Grafico_Individual_Aluno_Escala">';
		
					HTMLContente+='<div class="Porcentagem_Objetivos_Serie_Atual" style="height:'+SerieAtualRes+'%;">';
					HTMLContente+='<div class="Porcentagem_Objetivos_Serie_Atual_Corrigido" style="height:'+SerieAtualCorrigidoRes+'%;"></div>';
					HTMLContente+='</div>';
		
					HTMLContente+='</div>';
					if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
						HTMLContente+='<a href="mGrupoTutoria.html?ID='+(base64_encode(""+dataTutoria[a].tutor.idprofessorFuncionario))+'"><div class="Grafico_Individual_Aluno_Foto_Hover" nomeAluno="'+dataTutoria[a].tutor.nome+'">';
					else
						HTMLContente+='<a href="grupoTutoria.html?ID='+(base64_encode(""+dataTutoria[a].tutor.idprofessorFuncionario))+'"><div class="Grafico_Individual_Aluno_Foto_Hover" nomeAluno="'+dataTutoria[a].tutor.nome+'">';
					HTMLContente+='<img src="'+dataTutoria[a].tutor.fotoProfessorFuncionario+'" ></img>';
					HTMLContente+='</div></a></div>';
			
					if(Limite < 22)
					{
						$('#Grade_Aluno_Grafico_Mask').css("width",""+(924)+"px");
						$('.Grafico_Individual_Aluno_Overflow').css("width",""+(924)+"px");
					} else {
						$('#Grade_Aluno_Grafico_Mask').css("width",""+(Limite*42)+"px");
						$('.Grafico_Individual_Aluno_Overflow').css("width",""+(Limite*42)+"px");
					}
						
					$('body').append('<div class="aluno_foco"> </div>');			

					$('body').delegate('.Grafico_Individual_Aluno_Foto_Hover','mouseover',function(){
						
						var px = event.pageX;
						var py = event.pageY;
						$('.aluno_foco').html($(this).attr("nomeAluno"));
						var w = $('.aluno_foco').width();
						var h = $('.aluno_foco').height();

						
						$('.aluno_foco').css("left",(px-w)+"px");
						$('.aluno_foco').css("top",(py+(h*2))+"px");
						$('.aluno_foco').show();
					})
					.delegate('.Grafico_Individual_Aluno_Foto_Hover','mouseout',function(){
						$('.aluno_foco').hide();
					});

				}
			}	
			$('.Grafico_Individual_Aluno_Overflow').remove("loaderImage");		
			$('.Grafico_Individual_Aluno_Overflow').html(HTMLContente);				
		},
		complete:function(){
			$('.boxGrafico').css("display","none");	
		}
	});	
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