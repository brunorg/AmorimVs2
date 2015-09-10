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
	    CarregaServicoMensagens();
	    CarregaServicoForum();
	    CarregaServicoMural();
	    CarregaServicoCalendarioEventos();	    
	    	
		var intervalo = window.setInterval(function() {
			$('.boxGrafico').css("display","block"); 
		}, 50);
		window.setTimeout(function() {
			clearInterval(intervalo);
			CarregaServicoProfessorFuncionario();
		}, 3000);		
	});



//------------------------------------------------------------------------------------------------------------------------

//Carrega a tabela Mensagens

	function CarregaServicoMensagens()
	{
		var dataMensagens =	getData("Mensagens/Proprietario",userID);
		if(typeof dataMensagens != "undefined"){
			Limite = dataMensagens.length;			       
			HtmlContent = '<table class="mensagensTabela">';
			contador=0;
						
			for(var b=0; b<dataMensagens.length; b++)
			{
				if(dataMensagens[b].lida == "N" && dataMensagens[b].cxEntrada == "S" && dataMensagens[b].cxEnviada == "N")
				{
					contador++;
				}
			}
	
			for(var a = Limite-1; a >=0 ; a--)
			{				
				if(dataMensagens[a].lida == "N" && dataMensagens[a].cxEntrada == "S" && dataMensagens[a].cxEnviada == "N")
				{
					HtmlContent += '<tr>';
			
					HtmlContent += '<td class="dataMsg" onClick="window.location=\'mensagens.html?ID='+dataMensagens[a].idmensagens+'\';"><h4 class="user">'+ (dataMensagens[a].remetente.aluno != null ? dataMensagens[a].remetente.aluno.nome:dataMensagens[a].remetente.professor.nome) +'</h4>'+ dataMensagens[a].assunto.substring(0,40)+(dataMensagens[a].assunto.length<40 ? "</td>":"...</td>");
					
					HtmlContent += "</tr>";
				}
			}
	
			HtmlContent += "</table>";
			
			$('.Mensagens_Conteudo').append(HtmlContent);
			
			if(contador <= 9){
				$('.Mensagens_Cabecalho_Imagem_Contador').html(contador);
			} else {
				$('.Mensagens_Cabecalho_Imagem_Contador').html("9+");
			}
		}
	}

//------------------------------------------------------------------------------------------------------------------------

//Carrega a tabela CalendarioEventos

	function CarregaServicoCalendarioEventos()
	{
		HtmlContent = "";
		var dataCalendario 	=	getData("Calendario/Evento", 46);
	
		for(var a = 0; a < dataCalendario.length; a++)
		{			
			if (a<5){
				
			var data = dataCalendario[a].dataInicio;
			var dia = data.substring(data.length-2);
			var mes = retornaMesByNumero(parseInt(data.substring(5,7)));
			HtmlContent += '<td class="dataMsg Conteudo_Coluna3_Agenda_Evento" style="line-height: 13px;">';
	
		//	
			//HtmlContent += '<div class="Conteudo_Coluna3_Agenda_Evento_Titulo">' +
			HtmlContent += '<h2 class="muralData">'+dia+' de '+mes+'</h2>';
			HtmlContent += '<h3 class="muralTitulo">'+ dataCalendario[a].evento+'</h3>';
//			HtmlContent +='<div class="Conteudo_Coluna3_Agenda_Evento_Hora">'+
//				dataCalendario[a].hora+
	//		'</div>';
					
			if(dataCalendario[a].imagem != "" && dataCalendario[a].imagem != null && dataCalendario[a].imagem != undefined){HtmlContent +='<br /><img src="'+dataCalendario[a].imagem+'" width="80%" style="margin-left: 14px;"/>';}
			HtmlContent+='</td>';
	
			HtmlContent += "</div>";
			}
			else{
	
			HtmlContent += '<div class="Conteudo_Coluna3_Agenda_Evento AgendaNulo">';
	
			HtmlContent += '<div class="Conteudo_Coluna3_Agenda_Evento_Titulo">' + 
			dataCalendario[a].dataInicio.substring(8, 10)+"/"+ dataCalendario[a].dataInicio.substring(5, 7)+"/"+ dataCalendario[a].dataInicio.substring(0, 4)+ '</div>';
	
	
			HtmlContent += '<div class="Conteudo_Coluna3_Agenda_Evento_Conteudo">'+ dataCalendario[a].evento;
			if(dataCalendario[a].imagem != "" && dataCalendario[a].imagem != null && dataCalendario[a].imagem != undefined){HtmlContent +='<br />'+dataCalendario[a].imagem;}
			HtmlContent+='</div>';
	
			HtmlContent += "</div>";
	
			}
		}
		
		$('#Light_Eventos_Tabela').append(HtmlContent);
		OrdenarPor("Conteudo_Coluna3_Agenda_Evento_Titulo");
		$(".Conteudo_Coluna3_Agenda_Evento").css("display","none");
		for(var l = 0; l < 5; l++)
		{
			if (document.getElementsByClassName("Conteudo_Coluna3_Agenda_Evento")[l]!=undefined)
			{
				document.getElementsByClassName("Conteudo_Coluna3_Agenda_Evento")[l].style.display="block";
			}
	
		}
	}


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
	
	
	function CarregaServicoForum()
	{
		HtmlContent = "";
		var dataForum 	=	getData("ForumQuestao/topN", 6);
		
		//console.log(dataForum);
		
		for(var a=0; a< dataForum.length; a++){
			var dataMensagens = getData("ForumResposta/TotalParcial", dataForum[a].idforumQuestao);
			//console.log(dataMensagens);
			HtmlContent += '<div class="caixaForum" onClick="window.location=\'forumSecao.html?IdRoteiro='+base64_encode(""+dataForum[a].roteiro.idroteiro)+'&IdQuestao='+base64_encode(""+dataForum[a].idforumQuestao)+'\'">';
			HtmlContent += '<div class="infoForum">'+dataMensagens.Total+' Respostas | <strong>Professor: '+dataMensagens.Professor+'</strong></div>';
			HtmlContent += '<div class="forumQuestao">'+dataForum[a].questao+'</div></div>';
			//HtmlContent += '<h4 style="color:rgb(218,93,48); margin-top:0px;">'+ dataForum[a].roteiro.nome+'</h4><span style="margin-bottom:0px;">'+dataForum[a].questao.substring(0,40)+(dataForum[a].questao.length<40 ? "</span></div>":"...</span></div>");
		 }
	
		$('#Light_ForumTabela').html(HtmlContent);
	}


//------------------------------------------------------------------------------------------------------------------------

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