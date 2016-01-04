
//Murano Design


//------------------------------------------------------------------------------------------------------------------------

//Carregas as variaveis padrao

	var HtmlContent;
	var contador;
	var conf;
//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD

	var dataAlunoVariavel;
	var dataPlanejamentoRoteiro;
	var dataObjetivo 			=	getData("Objetivo", null);
	var dataCalendarioEventos 	=	getData("Calendario", null);
	
	var dataGrupo;
	//var dataGrupo 				=	getData("Grupo", null); 


//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

	var userID = usuarioId;
	var IDProfessor = getAlunoByUsuario(userID);
	//var alunoID = getAlunoByUsuario();

//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery

$(document).ready(function () {
	CarregaServicoMural();

	if (verificaTutor(IDProfessor) == 1) {	
		dataGrupo = getData('ProfessorFuncionario/ProfessorGrupo', IDProfessor)
		
		CarregaServicoGrupo();
		$("#graficoTutor").show();
	}else{
		$("#pesquisaAlunos").show();
        carregaAnoEstudo();
    	carregaPeriodo("aluno");
    	carregaAlunos("todos");
	}
});

//------------------------------------------------------------------------------------------------------------------------
function CarregaServicoMural()
{
	HtmlContent = "";
	var dataCalendarioM 	=	getData("Calendario/Evento", 44);
	console.log(dataCalendarioM);
	
	for(var a=0; a< dataCalendarioM.length; a++)
	{
		var dataM = dataCalendarioM[a].dataInicio.substring(8, 10)+"/"+ dataCalendarioM[a].dataInicio.substring(5, 7)+"/"+ dataCalendarioM[a].dataInicio.substring(0, 4);
			
		HtmlContent+='<tr>'+
					'<td class="dataMsg" onclick="window.location=\'#\';" style="background-color:rgb(247, 242, 222); line-height: 13px;">'+
						'<span>'+
						'<h2 style="color:rgb(218,93,48); margin-top:0px;float:left;">'+dataCalendarioM[a].evento+'</h2>'+
						'</span>'+
						'<p style="clear: both;margin-bottom: 10px;"></p>'+
						'<span>'+
						'<h3 style="margin-bottom:0px;font-weight: 100;">'+dataCalendarioM[a].descricao+'</h3>'+
						'</span>'+
					'</td>'+
					'<td style="background-color:rgb(247, 242, 222); line-height: 13px;">'+
					'<span>'+
					'<h2 style="color:rgb(218,93,48);margin-top:0px;float:right;width:74%;margin-top: 10px;">'+dataM+'</h2>'+	
					'</span>'+
					'<span>'+				
					'<h2 style="color:rgb(218,93,48);font-weight: normal; margin-top:0px;float:right;margin-right: 14px;">'+dataCalendarioM[a].hora+'</h2>'+
					'</span>'+
					'</td>'+
				'</tr>';
	}

	$('#Light_MuralTabela').html(HtmlContent);
}


//------------------------------------------------------------------------------------------------------------------------

//Carrega a tabela Grupo

function CarregaServicoGrupo()
{

	var HTMLContente="";

	LimiteAluno = 0;
	
	for(var a=0; a< dataGrupo.length; a++)
	{
		
		//if(dataGrupo[a].tutoria != null)
		//{
			//if(dataGrupo[a].tutoria.tutor.idprofessorFuncionario == IDProfessor)
			//{
				
				dataAlunoVariavel = getData('AlunoVariavel/grupo',dataGrupo[a].idgrupo);
				
				for(var b=0; b< dataAlunoVariavel.length; b++)
				{

					var LimiteTT =0;
					var LimiteAnterior = 0;
					var LimiteProximo = 0;

					var roteirosAtribuidos;
					$.ajax({
						type: "GET",
						async:false,
						crossDomain: true,
						url: path+"AtribuicaoRoteiroExtra/aluno/"+dataAlunoVariavel[b].aluno.idAluno          
					}).then(function(data) {
						roteirosAtribuidos = data;
					});

					for(var c=0; c< dataObjetivo.length;c++)
					{
						if(dataObjetivo[c].ativo == "1" && dataObjetivo[c].roteiro.ativo == "1" && dataObjetivo[c].roteiro.anoEstudo.idanoEstudo == dataAlunoVariavel[b].anoEstudo.idanoEstudo)
						{
							LimiteTT++;
						}
						else
						{
							for (var i = 0; i < roteirosAtribuidos.length; i++)
							{
								if(dataObjetivo[c].ativo == "1" && dataObjetivo[c].roteiro.idroteiro == roteirosAtribuidos[i].idroteiro && dataObjetivo[c].roteiro.anoEstudo.ano < dataAlunoVariavel[b].anoEstudo.ano)
									{LimiteAnterior++;}
								else if(dataObjetivo[c].ativo == "1" && dataObjetivo[c].roteiro.idroteiro == roteirosAtribuidos[i].idroteiro && dataObjetivo[c].roteiro.anoEstudo.ano > dataAlunoVariavel[b].anoEstudo.ano)
									{LimiteProximo++;}
							}
						}
					}

					dataPlanejamentoRoteiro = getData('PlanejamentoRoteiro/aluno', dataAlunoVariavel[b].aluno.idAluno);

					var completos = 0;
					var completosAnterior = 0;
					var completosProximo = 0;
					var SerieAtualCorrigidoCont = 0;
					var SerieAnteriorCorrigidoCont = 0;
					var SerieProximaCorrigidoCont = 0;

					for(var c = 0; c < dataPlanejamentoRoteiro.length; c++)
					{
						if (dataPlanejamentoRoteiro[c].status == "2")
						{
							if (dataPlanejamentoRoteiro[c].objetivo.roteiro.anoEstudo.ano == dataAlunoVariavel[b].anoEstudo.ano) 
								{completos++;}
							else if (dataPlanejamentoRoteiro[c].objetivo.roteiro.anoEstudo.ano < dataAlunoVariavel[b].anoEstudo.ano)
								{completosAnterior++;}
							else if (dataPlanejamentoRoteiro[c].objetivo.roteiro.anoEstudo.ano > dataAlunoVariavel[b].anoEstudo.ano)
								{completosProximo++;}
						}
						else if (dataPlanejamentoRoteiro[c].status == "3")
						{
						if (dataPlanejamentoRoteiro[c].objetivo.roteiro.anoEstudo.ano == dataAlunoVariavel[b].anoEstudo.ano) 
							{
								completos++;
								SerieAtualCorrigidoCont++;
							}
						else if (dataPlanejamentoRoteiro[c].objetivo.roteiro.anoEstudo.ano < dataAlunoVariavel[b].anoEstudo.ano)
							{
								completosAnterior++;
								SerieAnteriorCorrigidoCont++;
							}
						else if (dataPlanejamentoRoteiro[c].objetivo.roteiro.anoEstudo.ano > dataAlunoVariavel[b].anoEstudo.ano)
							{
								completosProximo++;
								SerieProximaCorrigidoCont++;
							}
						}
					}
	

					LimiteAluno++;
					SerieAtual = 0;
					SerieAtualCorrigido = 0;

					if(LimiteAnterior != 0)
					{
						SerieAnterior = ((completosAnterior/LimiteAnterior) * 100);
						if (SerieAnteriorCorrigidoCont != 0)
							{SerieAnteriorCorrigido = (SerieAnteriorCorrigidoCont/completosAnterior) * 100;}
						else
							{SerieAnteriorCorrigido = 0;}
					}

					if(LimiteTT != 0)
					{
						SerieAtual = (completos/LimiteTT) * 100;
						if(SerieAtualCorrigidoCont != 0)
							{SerieAtualCorrigido = (SerieAtualCorrigidoCont/completos) * 100;}
						else
							{SerieAtualCorrigido = 0;}
					}

					if(LimiteProximo != 0)
					{
						SerieProxima = (completosProximo/LimiteProximo) * 100;
						if (SerieProximaCorrigidoCont != 0)
							{SerieProximaCorrigido = (SerieProximaCorrigidoCont/completosProximo) * 100;}
						else
							{SerieProximaCorrigido = 0;}
					}



					HTMLContente+='<div class="Grafico_Individual_Aluno">';
					HTMLContente+='<div class="Grafico_Individual_Aluno_Falta_Numero">'+presencaAluno(dataAlunoVariavel[b].aluno.idAluno)+'</div>';
					HTMLContente+='<div class="Grafico_Individual_Aluno_Escala">';
					
					if (LimiteAnterior == 0 && LimiteProximo == 0)
					{
						HTMLContente+='<div class="Porcentagem_Objetivos_Serie_Atual Porcentagem_Center" style="height:'+(SerieAtual)+'%;">';
						HTMLContente+='<div class="Porcentagem_Objetivos_Serie_Atual_Corrigido" style="height:'+(SerieAtualCorrigido)+'%;"></div>';
						HTMLContente+='</div>';
					}
					else if(LimiteProximo != 0)
					{
						HTMLContente+='<div class="Porcentagem_Objetivos_Serie_Atual Porcentagem_Left" style="height:'+(SerieAtual)+'%;">';
						HTMLContente+='<div class="Porcentagem_Objetivos_Serie_Atual_Corrigido" style="height:'+(SerieAtualCorrigido)+'%;"></div>';
						HTMLContente+='</div>';
						HTMLContente+='<div class="Porcentagem_Objetivos_Serie_Proxima Porcentagem_Right" style="height:'+(SerieProxima)+'%;">';
						HTMLContente+='<div class="Porcentagem_Objetivos_Serie_Proxima_Corrigido" style="height:'+(SerieProximaCorrigido)+'%;"></div>';
						HTMLContente+='</div>';
					}
					else if(LimiteAnterior != 0)
					{
						HTMLContente+='<div class="Porcentagem_Objetivos_Serie_Anterior Porcentagem_Left" style="height:'+(SerieAnterior)+'%;">';
						HTMLContente+='<div class="Porcentagem_Objetivos_Serie_Anterior_Corrigido" style="height:'+(SerieAnteriorCorrigido)+'%;"></div>';
						HTMLContente+='</div>';
						HTMLContente+='<div class="Porcentagem_Objetivos_Serie_Atual Porcentagem_Right" style="height:'+(SerieAtual)+'%;">';
						HTMLContente+='<div class="Porcentagem_Objetivos_Serie_Atual_Corrigido" style="height:'+(SerieAtualCorrigido)+'%;"></div>';
						HTMLContente+='</div>';
					}
					HTMLContente+='</div>';
					HTMLContente+='<a href="relatorioAluno.html?ID='+(base64_encode(""+dataAlunoVariavel[b].aluno.idAluno))+'"><div class="Grafico_Individual_Aluno_Foto_Hover" nomeAluno="'+dataAlunoVariavel[b].aluno.nome+'">';
					HTMLContente+='<img src="'+dataAlunoVariavel[b].aluno.fotoAluno+'"></img>';
					HTMLContente+='</div></a></div>';

				}
	}


	if(LimiteAluno < 22)
	{

		$('#Grade_Aluno_Grafico_Mask').css("width",""+(924)+"px");
		$('.Grafico_Individual_Aluno_Overflow').css("width",""+(924)+"px");
		$('.Grafico_Individual_Aluno_Overflow').html(HTMLContente);

	} else {
		$('#Grade_Aluno_Grafico_Mask').css("width",""+(LimiteAluno*42)+"px");
		$('.Grafico_Individual_Aluno_Overflow').css("width",""+(LimiteAluno*42)+"px");

		$('.Grafico_Individual_Aluno_Overflow').html(HTMLContente);
	}			
		$('body').append('<div class="aluno_foco"> </div>');
		//inicio implementação ouro fino
		$(".Grafico_Individual_Aluno_Foto_Hover").mouseover(function(event){
			var px = event.pageX;
			var py = event.pageY;
			$('.aluno_foco').html($(this).attr("nomeAluno"));
			var w = $('.aluno_foco').width();
			var h = $('.aluno_foco').height();
			//console.log(w);
			
			$('.aluno_foco').css("left",(px-w)+"px");
			$('.aluno_foco').css("top",(py+(h*2))+"px");
			$('.aluno_foco').show();
		})
		.mouseout(function(){
			$('.aluno_foco').hide();
		});
}
//------------------------------------------------------------------------------------------------------------------------

//Funcao pra ordenar as classes e afins pela sua ordem alfabetica

function OrdenarPor(TString)
{				

	$('#Conteudo_Coluna3_Agenda_Evento_Content').find('.Conteudo_Coluna3_Agenda_Evento').sort(function(x,b){
				return x.getElementsByClassName(TString)[0].innerHTML.substring(8, 10)+x.getElementsByClassName(TString)[0].innerHTML.substring(5, 7)+x.getElementsByClassName(TString)[0].innerHTML.substring(0, 2) > b.getElementsByClassName(TString)[0].innerHTML.substring(8, 10) + b.getElementsByClassName(TString)[0].innerHTML.substring(5, 7) + b.getElementsByClassName(TString)[0].innerHTML.substring(0, 2);
	   }).appendTo($('#Conteudo_Coluna3_Agenda_Evento_Content'));
}


//-------------------------------------------------------------------------------------------------------------------------

//Retorno de planejamentos do aluno especifico

function carregaAlunos(todos){

	$("#nomeAluno").val('');
	
	var dataAlunoVariavel = getData("AlunoVariavel", null);	
	var HtmlContent = "";
	var anoEstudo = $("#PesqAnoEstudo").val();
	var periodo = $("#periodo").val();	
	
	for(var a=0;a<dataAlunoVariavel.length; a++)
	{

		HtmlContent += '<tr id="aluno" onClick="visualizar('+dataAlunoVariavel[a].aluno.idAluno+')">'+
							'<td class="alunoNome">'+dataAlunoVariavel[a].aluno.nome+'</td>'+
							'<td class="alunoAno">'+dataAlunoVariavel[a].anoEstudo.ano+'º Ano</td>'+
							'<td class="alunoPeriodo">'+dataAlunoVariavel[a].periodo.periodo+'</td>'+
						  '</tr>';
			
		
	}	
	$('#lista').html(HtmlContent);
}

function visualizar(idAluno){
	localStorage.setItem("alunoEdt",idAluno);
	location.href='relatorioAluno.html?ID='+base64_encode(""+idAluno);
	return false;
}

function enviarMsgMural(){
	var mensagem = $('#grupoMural').val();
	console.log();
}