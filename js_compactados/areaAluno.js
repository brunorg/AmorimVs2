function CarregaServicoCalendarioEventos(){$.ajax({url:path+"Calendario/Evento/46",type:"GET",async:!0,crossDomain:!0,success:function(a){HtmlContent="";for(var b=a,c=0;c<b.length;c++){var d=b[c].imagem;c<5?(HtmlContent+='<div class="Conteudo_Coluna3_Agenda_Evento">',HtmlContent+='<div class="Conteudo_Coluna3_Agenda_Evento_Conteudo">'+b[c].evento,HtmlContent+='<div class="Conteudo_Coluna3_Agenda_Evento_Titulo">'+b[c].dataInicio.substring(8,10)+"/"+b[c].dataInicio.substring(5,7)+"/"+b[c].dataInicio.substring(0,4)+"</div>",HtmlContent+='<div class="Conteudo_Coluna3_Agenda_Evento_Hora">'+a[c].hora+"</div>",""!=b[c].imagem&&null!=b[c].imagem&&void 0!=b[c].imagem&&(HtmlContent+='<br /><img src="'+d+'" width="80%" style="margin-left: 14px;"/>'),HtmlContent+="</div>",HtmlContent+="</div>"):(HtmlContent+='<div class="Conteudo_Coluna3_Agenda_Evento AgendaNulo">',HtmlContent+='<div class="Conteudo_Coluna3_Agenda_Evento_Titulo">'+b[c].dataInicio.substring(8,10)+"/"+b[c].dataInicio.substring(5,7)+"/"+b[c].dataInicio.substring(0,4)+"</div>",HtmlContent+='<div class="Conteudo_Coluna3_Agenda_Evento_Conteudo">'+b[c].evento,""!=b[c].imagem&&null!=b[c].imagem&&void 0!=b[c].imagem&&(HtmlContent+='<br /><img src="'+d+'" width="100%" />'),HtmlContent+="</div>",HtmlContent+="</div>")}$("#Conteudo_Coluna3_Agenda_Evento_Content").append(HtmlContent),OrdenarPor("Conteudo_Coluna3_Agenda_Evento_Titulo"),$(".Conteudo_Coluna3_Agenda_Evento").css("display","none");for(var e=0;e<5;e++)void 0!=document.getElementsByClassName("Conteudo_Coluna3_Agenda_Evento")[e]&&(document.getElementsByClassName("Conteudo_Coluna3_Agenda_Evento")[e].style.display="block")}})}function CarregaServicoMensagens(){$.ajax({url:path+"Mensagens/Proprietario/"+usuarioId,type:"GET",async:!0,crossDomain:!0,success:function(a){Limite=a.length,HtmlContent="",contador=0;for(var b=0,c=0;c<a.length;c++)"Aluno"==usuario&&"N"==a[c].lida&&"S"==a[c].cxEntrada&&contador++;for(var d=Limite-1;b!=contador;d--)"S"==a[d].cxEntrada&&"N"==a[d].lida&&"Aluno"==usuario&&(b++,HtmlContent+="<tr>",HtmlContent+='<td class="dataMsg" onClick="window.location=\'mensagens.html?ID='+a[d].idmensagens+'\';" style=" line-height: 13px;""><h4 class="user">'+(null!=a[d].remetente.aluno?a[d].remetente.aluno.nome:a[d].remetente.professor.nome)+"</h4>"+a[d].assunto.substring(0,40)+(a[d].assunto.length<40?"</td>":"...</td>"),HtmlContent+="</tr>");$(".mensagensTabela").append(HtmlContent),$(".Mensagens_Cabecalho_Imagem_Contador").html(contador<=9?contador:"9+")}})}function CarregaServicoPlanejamentoRoteiro(){HtmlContent="",antes="",depois="";for(var b=dataPlanejamentoRoteiro,c=0;c<b.length;c++)HtmlContent="",b[c].objetivo.roteiro.anoEstudo.idanoEstudo==AnoEstudoID&&"1"==b[c].objetivo.roteiro.ativo&&"1"==b[c].objetivo.ativo&&($("#"+b[c].objetivo.roteiro.idroteiro).length>0?(1==b[c].status&&b[c].planoEstudo.idplanoEstudo==getUltimoPE(alunoID)?HtmlContent+='<td class="td_roteiro_laranja">'+b[c].objetivo.numero+"</td>":2==b[c].status?HtmlContent+='<td class="td_roteiro_verde">'+b[c].objetivo.numero+"</td>":3==b[c].status&&(HtmlContent+='<td class="td_roteiro_verde_tk">'+b[c].objetivo.numero+"</td>"),$("#"+b[c].objetivo.roteiro.idroteiro+" .tabela_colorida_roteiro_Area_Aluno").last().append(HtmlContent),$("#"+b[c].objetivo.roteiro.idroteiro+" .tabela_colorida_roteiro_Area_Aluno td").length%13==0&&$("#"+b[c].objetivo.roteiro.idroteiro+" tbody").append('<tr class="tabela_colorida_roteiro_Area_Aluno"></tr>')):(HtmlContent+='<div class="Objetivos_Semana_Conteudo_Tarefas" id="'+b[c].objetivo.roteiro.idroteiro+'">',HtmlContent+="<table>",HtmlContent+="<tr>",HtmlContent+='<td class="Objetivos_Semana_Conteudo_Tarefas_Texto">',HtmlContent+=b[c].objetivo.roteiro.nome,HtmlContent+="</td>",HtmlContent+="</tr>",HtmlContent+='<tr class="tabela_colorida_roteiro_Area_Aluno">',HtmlContent+="</tr>",HtmlContent+="</table>",HtmlContent+="</div>",$(".Objetivos_Semana_Conteudo_Tarefas_Content").append(HtmlContent),HtmlContent="",1==b[c].status&&b[c].planoEstudo.idplanoEstudo==getUltimoPE(alunoID)?HtmlContent+='<td class="td_roteiro_laranja">'+b[c].objetivo.numero+"</td>":2==b[c].status?HtmlContent+='<td class="td_roteiro_verde">'+b[c].objetivo.numero+"</td>":3==b[c].status&&(HtmlContent+='<td class="td_roteiro_verde_tk">'+b[c].objetivo.numero+"</td>"),$("#"+b[c].objetivo.roteiro.idroteiro+" .tabela_colorida_roteiro_Area_Aluno").last().append(HtmlContent)));VerificaObjetivosCompletos(),void 0!=document.getElementsByClassName("Objetivos_Semana_Conteudo_Tarefas_Texto")[1]&&ordenaPorRoteiro(b)}function VerificaObjetivosCompletos(){var b;for(a=0;a<$(".Objetivos_Semana_Conteudo_Tarefas").length;a++)$.ajax({url:path+"Objetivo/ObjetivoRoteiroTotal/"+$(".Objetivos_Semana_Conteudo_Tarefas:nth-child("+(a+1)+")").attr("id"),type:"GET",async:!1,crossDomain:!0,beforeSend:function(){loading("inicial")},success:function(a){b=a},complete:function(){loading("final")}}),$(".Objetivos_Semana_Conteudo_Tarefas:nth-child("+(a+1)+") td.td_roteiro_verde_tk").length==b&&($(".Objetivos_Semana_Conteudo_Tarefas:nth-child("+(a+1)+") .tabela_colorida_roteiro_Area_Aluno").remove(),$(".Objetivos_Semana_Conteudo_Tarefas:nth-child("+(a+1)+") table").append("<tr><td>Roteiro Completo</td></tr>"),RoteirosCompletosAdd++)}function CarregaServicoProducaoAluno(){largura=0,ContadorPA=0,HtmlContent="",HtmlContent+='<div class="example"><div><ul class="SlidePort">';for(var a=0;a<dataProducaoAluno.length;a++){var b="";if(5==dataProducaoAluno[a].tipo.idtipoProducaoAluno){if(null!=dataProducaoAluno[a].arquivo){var c=dataProducaoAluno[a].arquivo;c=c.split("."),"pdf"==c[4]?b='<img src="img/icone_portfolio.png" width="182px" height="126px"/>':"png"==c[4]||"jpg"==c[4]||"jpeg"==c[4]||"gif"==c[4]?b='<img src="'+dataProducaoAluno[a].arquivo+'" width="182px" height="126px"/>':"mp3"==c[4]||"wma"==c[4]||"wav"==c[4]||"ogg"==c[4]?b='<img src="img/icone_audio.png" width="182px" height="126px"/>':("mp4"==c[4]||"avi"==c[4]||"wmv"==c[4])&&(b='<img src="img/icone_video.png" width="182px" height="126px"/>')}HtmlContent+='<a href="'+dataProducaoAluno[a].arquivo+'" target="_blank">',HtmlContent+="<li>",HtmlContent+='<div class="portfolio_secao verde">',HtmlContent+='<div class="roteiro">',HtmlContent+=b,HtmlContent+="</div>",HtmlContent+='<div class="nome_roteiro">',HtmlContent+=dataProducaoAluno[a].roteiro.nome,HtmlContent+="</div>",HtmlContent+="</div>",HtmlContent+="</li>",HtmlContent+="</a>",largura+=235,ContadorPA++}}ContadorPA<2?(largura+=420,HtmlContent+='<li class="upLi"><div class="Block_Conteudo_Portifolio_Image"></div></li>'):ContadorPA>3&&window.setTimeout(function(){someImagemGaroto()},1e3),HtmlContent+="</ul></div></div>",$("#bullets").append('<div class="barra"></div>'),$("#bullets").append(HtmlContent),$("#bullets").microfiche({bullets:!1}),document.getElementsByClassName("SlidePort")[0].style.width=largura+"px",document.getElementsByClassName("microfiche-film")[0].style.width=largura+"px"}function ordenaPorRoteiro(a){for(var d,f,b=[],c=[],g=0;g<a.length;g++){for(d=0,h=0;h<c.length;h++);if(0==d&&(c[c.length]=new Array(2),c[c.length-1][0]=b.length,c[c.length-1][1]=a[g].objetivo.roteiro.nome,b[b.length]=a[g]),1==d){for(var h=b.length;h>aux+1;h--)b[h-1]=b[h];b[aux]=a[g];for(var h=f;h<c.length;h++)c[h][0]=c[h][0]+1}}return b}function GetBooleanRoteiroCompleto(a){var b,c=0;$.ajax({url:path+"Objetivo/ObjetivoRoteiroTotal/"+a,type:"GET",async:!1,crossDomain:!0,success:function(a){b=a}});for(var d=0;d<dataPlanejamentoRoteiro.length;d++)dataPlanejamentoRoteiro[d].objetivo.idobjetivo==a&&(2==dataPlanejamentoRoteiro[d].status||3==dataPlanejamentoRoteiro[d].status)&&c++;return c==b}function someImagemGaroto(){$(".microfiche-controls").addClass("appear")}function OrdenarPor(a){$("#Conteudo_Coluna3_Agenda_Evento_Content").find(".Conteudo_Coluna3_Agenda_Evento").sort(function(b,c){return b.getElementsByClassName(a)[0].innerHTML.substring(8,10)+b.getElementsByClassName(a)[0].innerHTML.substring(5,7)+b.getElementsByClassName(a)[0].innerHTML.substring(0,2)>c.getElementsByClassName(a)[0].innerHTML.substring(8,10)+c.getElementsByClassName(a)[0].innerHTML.substring(5,7)+c.getElementsByClassName(a)[0].innerHTML.substring(0,2)}).appendTo($("#Conteudo_Coluna3_Agenda_Evento_Content"))}function getUltimoPE(a){return $.ajax({url:path+"PlanoEstudo/aluno/"+a,type:"GET",async:!1,crossDomain:!0,success:function(a){max=a},error:function(){max="erro"}}),max[0].idplanoEstudo}function contagemRoteiro(){for(var a=0,b=0;b<dataRoteiro.length;b++)"1"==dataRoteiro[b].ativo&&a++;return $.ajax({url:path+"Roteiro/RoteiroAluno/"+alunoID+"/"+d.getFullYear(),type:"GET",async:!1,crossDomain:!0,success:function(b){for(var c=0;c<b.length;c++)a++}}),a}function contagemObjetivo(){var a;return $.ajax({url:path+"Objetivo/ObjetivoAluno/"+alunoVariavelID.idalunoVariavel,type:"GET",async:!1,crossDomain:!0,success:function(b){a=b}}),a}var Limite,HtmlContent,a,contador,largura,ContadorPA,d=new Date,ObjetivoCompletosAdd=0,RoteirosCompletosAdd=0,alunoID=getAlunoByUsuario(usuarioId);localStorage.setItem("alunoEdt",alunoID);var alunoVariavelID;$.ajax({url:path+"AlunoVariavel/aluno/"+alunoID,type:"GET",async:!1,crossDomain:!0,success:function(a){alunoVariavelID=a}});var dataPlanejamentoRoteiro;$.ajax({url:path+"PlanejamentoRoteiro/aluno/"+alunoID,type:"GET",async:!1,crossDomain:!0,success:function(a){dataPlanejamentoRoteiro=a}});var AnoEstudoID=alunoVariavelID.anoEstudo.idanoEstudo,contadorRoteirosTotal=0,contadorObjetivosTotal=0,dataRoteiro;$.ajax({url:path+"Roteiro/RoteiroAno/"+alunoVariavelID.anoEstudo.idanoEstudo,type:"GET",async:!1,crossDomain:!0,success:function(a){dataRoteiro=a}});var dataProducaoAluno;$.ajax({url:path+"ProducaoAluno/Aluno/"+alunoID,type:"GET",async:!1,crossDomain:!0,success:function(a){dataProducaoAluno=a}}),$(document).ready(function(){contadorRoteirosTotal=contagemRoteiro(),contadorObjetivosTotal=contagemObjetivo(),CarregaServicoCalendarioEventos(),CarregaServicoMensagens(),CarregaServicoPlanejamentoRoteiro(),CarregaServicoProducaoAluno()}),$(document).ready(function(){var e,c=new Array,d=new Array;nobjetivosfeitos=0,nobjetivos=0,e=0;for(var f=0;f<dataPlanejamentoRoteiro.length;f++)if("1"==dataPlanejamentoRoteiro[f].objetivo.roteiro.ativo&&"1"==dataPlanejamentoRoteiro[f].objetivo.ativo&&dataPlanejamentoRoteiro[f].objetivo.roteiro.anoEstudo.idanoEstudo==AnoEstudoID){nobjetivos++,(2==dataPlanejamentoRoteiro[f].status||3==dataPlanejamentoRoteiro[f].status)&&nobjetivosfeitos++;for(var g=0;g<c.length;g++){var h=!1;dataPlanejamentoRoteiro[f].objetivo.roteiro.idroteiro==c[g]&&(h=!0)}h||(d[c.length]=GetBooleanRoteiroCompleto(dataPlanejamentoRoteiro[f].objetivo.roteiro.idroteiro),c[c.length]=dataPlanejamentoRoteiro[f].objetivo.roteiro.idroteiro)}for(var i=0;i<c.length;i++)d[i]&&e++;if(nobjetivos>0){var j=(nobjetivosfeitos+ObjetivoCompletosAdd)/contadorObjetivosTotal*100,k=[{value:j,color:"#4861AA",highlight:"#5AD3D1",label:"Red"},{value:100-j,color:"#C5C4B1",highlight:"#FF5A5E",label:"Green"}],l=document.getElementById("chart2").getContext("2d");window.myDoughnut=new Chart(l).Doughnut(k,{responsive:!0,showTooltips:!1,animation:!0}),$("#_objCompletos_Chart").html(nobjetivosfeitos+ObjetivoCompletosAdd),$("#_objTotal_Chart").html(contadorObjetivosTotal)}else{var k=[{value:0,color:"#4861AA",highlight:"#5AD3D1",label:"Red"},{value:100,color:"#C5C4B1",highlight:"#FF5A5E",label:"Green"}],l=document.getElementById("chart2").getContext("2d");window.myDoughnut=new Chart(l).Doughnut(k,{responsive:!0,showTooltips:!1,animation:!0}),$("#_objCompletos_Chart").html("0"),$("#_objTotal_Chart").html("0")}if(c.length>0){var m=(e+RoteirosCompletosAdd)/contadorRoteirosTotal*100,n=[{value:m,color:"#EB5B61",highlight:"#5AD3D1",label:"Red"},{value:100-m,color:"#C5C4B1",highlight:"#FF5A5E",label:"Green"}];$("#_rotCompletos_Chart").html(e+RoteirosCompletosAdd),$("#_rotTotal_Chart").html(contadorRoteirosTotal)}else{var n=[{value:0,color:"#EB5B61",highlight:"#5AD3D1",label:"Red"},{value:100,color:"#C5C4B1",highlight:"#FF5A5E",label:"Green"}];$("#_rotCompletos_Chart").html("0"),$("#_rotTotal_Chart").html("0")}var l=document.getElementById("chart1").getContext("2d");window.myDoughnut=new Chart(l).Doughnut(n,{responsive:!0,showTooltips:!1,animation:!0})});