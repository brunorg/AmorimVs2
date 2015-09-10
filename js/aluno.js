	$(document).ready(function() {

			var Limite;
			var HtmlContent;
			var a;
			    $.ajax({
			    type: "GET",
			    crossDomain: true,
			    url: path+"CalendarioEventos/"
			        
			    }).then(function(data) {

			        Limite = data.length;
			       
			    HtmlContent = "";

			        for(var a = 0; a < Limite; a++){
			            if (a<5){
			            HtmlContent += '<div class="Conteudo_Coluna3_Agenda_Evento">';

			            HtmlContent += '<div class="Conteudo_Coluna3_Agenda_Evento_Titulo">' + 
			            data[a].dataInicio.substring(8, 10)+"/"+ data[a].dataInicio.substring(5, 7)+"/"+ data[a].dataInicio.substring(0, 4)+ '</div>';

			            HtmlContent += '<div class="Conteudo_Coluna3_Agenda_Evento_Conteudo">'+ data[a].evento+'</div>';

			            HtmlContent += "</div>";
						}
						else{

						 HtmlContent += '<div class="Conteudo_Coluna3_Agenda_Evento AgendaNulo">';

			            HtmlContent += '<div class="Conteudo_Coluna3_Agenda_Evento_Titulo">' + 
			            data[a].dataInicio.substring(8, 10)+"/"+ data[a].dataInicio.substring(5, 7)+"/"+ data[a].dataInicio.substring(0, 4)+ '</div>';


			            HtmlContent += '<div class="Conteudo_Coluna3_Agenda_Evento_Conteudo">'+ data[a].evento+'</div>';

			            HtmlContent += "</div>";

						}

			        }
			        
			        $('#Conteudo_Coluna3_Agenda_Evento_Content').append(HtmlContent);
			       OrdenarPor("Conteudo_Coluna3_Agenda_Evento_Titulo");
			       $(".Conteudo_Coluna3_Agenda_Evento").css("display","none");
						for(var l = 0; l < 5	; l++){
							if (document.getElementsByClassName("Conteudo_Coluna3_Agenda_Evento")[l]!=undefined){
						document.getElementsByClassName("Conteudo_Coluna3_Agenda_Evento")[l].style.display="block";
					}

						}
			       
			    });

			    
			});

				function OrdenarPor(TString)
				{				

					$('#Conteudo_Coluna3_Agenda_Evento_Content').find('.Conteudo_Coluna3_Agenda_Evento').sort(function(x,b){
						//console.log(x,b);
				        		return x.getElementsByClassName(TString)[0].innerHTML.substring(8, 10)+x.getElementsByClassName(TString)[0].innerHTML.substring(5, 7)+x.getElementsByClassName(TString)[0].innerHTML.substring(0, 2) > b.getElementsByClassName(TString)[0].innerHTML.substring(8, 10) + b.getElementsByClassName(TString)[0].innerHTML.substring(5, 7) + b.getElementsByClassName(TString)[0].innerHTML.substring(0, 2);
				       }).appendTo($('#Conteudo_Coluna3_Agenda_Evento_Content'));
				}


//-----------------------------------------------------------------------------------------------------------------------------------------------

		$(document).ready(function() {

			var Limite;
			var HtmlContent;
			var contador;

			    $.ajax({
			    type: "GET",
			    crossDomain: true,
				    url: path+"Mensagens"
			        
			    }).then(function(data) {

			        Limite = data.length;			       
			     HtmlContent = '<table class="mensagensTabela">';
				contador=0;
			        for(var a = Limite-1; a > (Limite >= 3 ? Limite-4:-1); a--){
						contador++;

			            if (contador%2!=0){
			        	HtmlContent += '<tr>';
			            HtmlContent += '<td class="dataMsg" onClick="window.location=\'#\';" style="background-color:rgb(247, 242, 222); line-height: 13px;""><h4>'+ data[a].usuario.login+'</h4>'+ data[a].mensagem.substring(0,50)+(data[a].mensagem.length<50 ? "</td>":"...</td>");
			            HtmlContent += "</tr>";
			        	}
			        	else if(contador%2==0){
			        	HtmlContent += '<tr>';
			            HtmlContent += '<td class="dataMsg" onClick="window.location=\'#\';" style="background-color:rgb(241, 229, 192); line-height: 13px;""><h4>'+ data[a].usuario.login+'</h4>'+data[a].mensagem.substring(0,50)+(data[a].mensagem.length<50 ? "</td>":"...</td>");
			            HtmlContent += "</tr>";
				        	}
			            //console.log(HtmlContent)

			        }
			        HtmlContent += "</table>";	
			        $('.Mensagens_Conteudo').append(HtmlContent);
			      if(document.getElementsByClassName("dataMsg")[1]!=undefined){
			       //OrdenarPor2("dataMsg");
			   }
			    });

			    
			});


	//-----------------------------------------------------------------------------------------------------------------------------------------------

		$(document).ready(function() {

			var Limite;
			var HtmlContent;
			    $.ajax({
			    type: "GET",
			    crossDomain: true,
			    url: path+"PlanejamentoRoteiro"
			        
			    }).then(function(data) {

			        Limite = data.length;
/*			     var myDate = new Date();*/
					HtmlContent="";
					var antes = "";
			        var depois = "";
			        var depois2 = "";
			        for(var a = 0; a < Limite; a++){
			        	planejamentos = ordenaPorRoteiro(data);

			        	antes = data[a].objetivo.roteiro.nome;
			        	depois2 = antes;
			        	if(depois2 == antes && depois != depois2 && depois!=""){
						HtmlContent += '</tr>';
						HtmlContent += '</table>';
						HtmlContent += '</div>';	
						HtmlContent += '<div class="Objetivos_Semana_Conteudo_Tarefas">';
			        	HtmlContent += '<table>';
			            HtmlContent += '<tr><td class="Objetivos_Semana_Conteudo_Tarefas_Texto">'+ data[a].objetivo.roteiro.nome+'</td>';
			            //HtmlContent += '<td>'+ data[a].objetivo.roteiro.nome.charAt(0)+'</td>';
			            HtmlContent += "</tr>";
			            HtmlContent += '<tr class="tabela_colorida_roteiro_Area_Aluno">';
			        	HtmlContent += '<td class="td_roteiro_laranja">'+ data[a].objetivo.numero+'</td>';
							
						}	
			        	else if(depois != antes){
			        	HtmlContent += '<div class="Objetivos_Semana_Conteudo_Tarefas">';
			        	HtmlContent += '<table>';
			            HtmlContent += '<tr><td class="Objetivos_Semana_Conteudo_Tarefas_Texto">'+data[a].objetivo.roteiro.nome+'</td>';
			            //HtmlContent += '<td>'+ data[a].objetivo.roteiro.nome.charAt(0)+'</td>';
			            HtmlContent += "</tr>";
			            HtmlContent += '<tr class="tabela_colorida_roteiro_Area_Aluno">';
			        	HtmlContent += '<td class="td_roteiro_laranja">'+data[a].objetivo.numero+'</td>';
						}	
			            else if(depois == antes){
						HtmlContent += '<td class="td_roteiro_laranja">'+data[a].objetivo.numero+'</td>';		
						}


						
						depois = antes;
						
						
			        }
			        $('.Objetivos_Semana_Conteudo_Tarefas_Content').append(HtmlContent);
			     if(document.getElementsByClassName("Objetivos_Semana_Conteudo_Tarefas_Texto")[1]!=undefined){
			       ordenaPorRoteiro(data);
			       }
			    });

			    
			});

function ordenaPorRoteiro(arrayObjetivos){

	//var ordenados = arrayObjetivos;
	var ordenados=[];
	var roteiros=[];
	var cRot;
	var primeiraOcorrencia;
	var posNoRoteiros;
	
	//percorre os objetivos

	for (var i = 0; i < arrayObjetivos.length;i++){

	cRot=0;
		//procura o roteiro corresnpondente no roteiros
		for (j = 0; j < roteiros.length; j++){
			/*if (arrayObjetivos[i].objetivo.roteiro.nome == roteiros[j][1]){
				//aux = primeira ocorrencia do roteiro do objetivo atual no array roteiros
				aux = roteiros[j][0];
				posNoRoteiros = j;
				cRot = 1;
			}	*/
		}
			if (cRot == 0){
				roteiros[roteiros.length]=new Array(2);
				roteiros[roteiros.length-1][0]=ordenados.length;

				roteiros[roteiros.length-1][1]=arrayObjetivos[i].objetivo.roteiro.nome;
				ordenados[ordenados.length]=arrayObjetivos[i];

			}
			if (cRot == 1){
				for (var j = ordenados.length; j > aux+1; j--){
					ordenados[j-1]=ordenados[j];
				}
				ordenados[aux] = arrayObjetivos[i];
				for(var j = posNoRoteiros; j < roteiros.length; j++ ){
					roteiros[j][0] = roteiros[j][0] + 1;
				}
			}
		}


		return ordenados;
	
	}

	//-----------------------------------------------------------------------------------------------------------------------------------------------

	//-----------------------------------------------------------------------------------------------------------------------------------------------

		$(document).ready(function() {
			var Limite;
			var HtmlContent;
			var largura = 0;
			    $.ajax({
			    type: "GET",
			    crossDomain: true,
			    url: path+"ProducaoAluno"
			        
			    }).then(function(data) {
		

			        Limite = data.length;
					HtmlContent="";
					HtmlContent += '<div class="example"><div><ul class="SlidePort">';
			        for(var a = 0; a < Limite; a++){
			        	HtmlContent += '<li>';
			        	HtmlContent += '<div class="portfolio_secao verde">';
			        	HtmlContent += '<div class="roteiro">';
						HtmlContent += '<img src="data:image/png;base64,'+data[a].conteudo+'" width="170px" height="126px"/>';
						HtmlContent += '</div>';
						HtmlContent += '<div class="nome_roteiro">';
						HtmlContent += data[a].roteiro.nome;
						HtmlContent += '</div>';
						HtmlContent += '</div>';
						HtmlContent += '</li>';
						largura += 225;

			        }
			        
			        HtmlContent += '</ul></div></div>';
			        $('#bullets').append('<div class="Objetivos_Semana_Cabecalho_Nome">Portfólio</div>');
			        $('#bullets').append(HtmlContent);	
			         $('#bullets').microfiche({ bullets: false });
			        document.getElementsByClassName("SlidePort")[0].style.width = largura+'px';
			        document.getElementsByClassName("microfiche-film")[0].style.width = largura+'px';

			  });

			     
			});

/*
				function OrdenarPor4(TString)
				{				

					$('.Objetivos_Semana_Conteudo_Tarefas_Texto').find('tr').sort(function(x,b){
						console.log(x,b);
				        return x.getElementsByClassName(TString)[0].innerHTML > b.getElementsByClassName(TString)[0].innerHTML;
				       }).appendTo($('.Objetivos_Semana_Conteudo_Tarefas_Texto'));
				}

*/


/* Chart.js */

		$(document).ready(function() {
			var Limite;
			var HtmlContent;
			    $.ajax({
			    type: "GET",
			    crossDomain: true,
			    url: path+"Objetivo"
			        
			    }).then(function(data) {

				nobjetivosfeitos = 3;
				nobjetivos = data.length;


				var doughnutData = [
				{
					value: nobjetivosfeitos,
					color:"#F7464A"
				},

				{
					value: nobjetivos - nobjetivosfeitos,
					color:"#000"
				},

			];
		
				var ctx = document.getElementById("chart-area").getContext("2d");
				window.myDoughnut = new Chart(ctx).Doughnut(doughnutData, {responsive : true});

			 });

			    
			});		

			$(document).ready(function() {
			var Limite;
			var HtmlContent;
			    $.ajax({
			    type: "GET",
			    crossDomain: true,
			    url: path+"Roteiro"
			        
			    }).then(function(data) {

				nroteiros = data.length;
				nroteirosfeitos = 1;
			
			var doughnutData2 = [
				{
					value: nroteirosfeitos,
					color:"#F7464A"
				},

				{
					value: nroteiros - nroteirosfeitos,
					color:"#000"
				},

			];

			
				var ctx2 = document.getElementById("chart-area2").getContext("2d");
				window.myDoughnut = new Chart(ctx2).Doughnut(doughnutData2, {responsive : true});
			 });

			    
			});

