//Murano Design
//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD

var dataUsuario;
var professorID;
var dataProfessorFuncionario;

var Tutor;
var tutoria;
var grupos;
var alunos;
var gruposProfessor = [];
var funcao;

var htmlContent;

var dataObjetivo 			=	getData("Objetivo", null);

//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery

$(document).ready(function(){
	if(usuario == "Coordenacao")
	{
		initCoordena();
	} else if(usuario == "Professor")
	{
		initProfessor();
	}
});

function getTutoria(IDtutor)
{
	var returnTutor = [];
	if(dataTutoria.length > 0){
		for(var i = 0; i < dataTutoria.length; i++)
		{
			if(dataTutoria[i].tutor.idprofessorFuncionario == IDtutor)
			{
				returnTutor[returnTutor.length] = dataTutoria[i].idtutoria;
			}
		}		
	}else{
		returnTutor[0] = "Este professor não possui grupos!"
	}
	return returnTutor;
}

function getGrupo(IDtutor)
{

  	for (var i = 0; i < dataGrupo.length;i++)
  	{
  		if(dataGrupo[i].tutoria.idtutoria == IDtutor)
  		{
  			gruposProfessor[gruposProfessor.length]=dataGrupo[i];
  		}

  	}

}

function getAlunos(grupos)
{
	var aux = [];
	var auxAlunos = [];
	//var alunVar = [];
		if(grupos.constructor == Array){
	
		for (var a = 0; a < grupos.length ; a++){	
	
		aux = getData("AlunoVariavel/grupo",grupos[a].idgrupo);
		//console.log(aux);	
		auxAlunos =	auxAlunos.concat(aux);		
		}	
	}
	return auxAlunos;
}


//Inicializadores

	
//Inicia se Coordenador esta logado
function initCoordena()
{
	dataUsuario 				=	getData("Usuario", professorID);
	dataTutoria 				=	getData("Tutoria", null);
	dataGrupo 					=	getData("Grupo", null);
	professorID 				= 	getProfessorByUsuario(usuarioId);
	dataProfessorFuncionario 	=	getData("ProfessorFuncionario", professorID);
	dataAlunoVariavel			=	getData("AlunoVariavel", null);
	
	Tutor = base64_decode(GetURLParameter('ID'));

	dataProfessorFuncionario 	=	getData("ProfessorFuncionario", Tutor);

	drawBoxProfessor(Tutor);

	dataTutoria 	=	getData("Tutoria", null);
	dataGrupo =	getData("Grupo", null);
	dataProfessorFuncionario 	=	getData("ProfessorFuncionario", Tutor);

	tutoria = 	getTutoria(dataProfessorFuncionario.idprofessorFuncionario);

	for(var i = 0; i< tutoria.length;i++){
		getGrupo(tutoria[i]);
	}

	alunos 	=	getAlunos(gruposProfessor);

	loadPaginaProfessor();

}

//Inicia se professor esta logado
function initProfessor()
{
	dataUsuario 				=	getData("Usuario", professorID);
	dataTutoria 				=	getData("Tutoria", null);
	dataGrupo 					=	getData("Grupo", null);
	professorID 				= 	getProfessorByUsuario(usuarioId);
	dataProfessorFuncionario 	=	getData("ProfessorFuncionario", professorID);
	dataAlunoVariavel			=	getData("AlunoVariavel", null);
	
	tutoria = 	getTutoria(dataProfessorFuncionario.idprofessorFuncionario);
	for(var i = 0; i< tutoria.length;i++){
		
		getGrupo(tutoria[i]);
	}

	alunos 	=	getAlunos(gruposProfessor);

	loadPaginaProfessor();
}

//Carrega Paginas

	function loadPaginaProfessor()
	{
		htmlContent = "";
		var ContadorAluno;
		
		if(gruposProfessor.length == 0)
		{
			$('#Grupos_box').append("Este professor não é tutor de nenhum grupo");
		}

		for (var i = 0; i < gruposProfessor.length; i++)
		{
			ContadorAluno = 0;
			htmlContent ='<div class="Grupo_Content">'+
						'<div id="grupo1" style="height:150px;">'+
							'<div id="grupoId"> Grupo'+gruposProfessor[i].nomeGrupo+': </div>'+
							'<ul>';

			for(var j =0; j < alunos.length;j++)
			{
				var idGrupo;
				if(alunos[j].grupo.idgrupo == gruposProfessor[i].idgrupo)
				{
					htmlContent +='<li> '+alunos[j].aluno.nome+' </li>';	
					ContadorAluno++;	
					idGrupo = alunos[j].grupo.idgrupo;		
				}
			}		

			htmlContent +='</ul>'+
						'</div>'+
						'<div class="graficos">'+
							'<div class="Grade_Aluno_Grafico_Content" id="grupo_'+idGrupo+'">'+
								'<div class="Grade_Aluno_Grafico_Legenda_Lateral">'+
									'Faltas<br />'+
									'100<br />'+
									'90<br />'+
									'80<br />'+
									'70<br />'+
									'60<br />'+
									'50<br />'+
									'40<br />'+
									'30<br />'+
									'20<br />'+
									'10<br />'+
									'0'+
								'</div>';
																
								
								

			for(var j =0; j < alunos.length;j++)
			{
				if(usuario == "Professor")
				{
					funcao = "onclick='mudarLider("+alunos[j].grupo.idgrupo+","+alunos[j].aluno.idAluno+")'";
				}
				
				if(alunos[j].grupo.idgrupo == gruposProfessor[i].idgrupo)
				{
					var classe="";
					if(alunos[j].grupo.lider != null)
					{
						if(alunos[j].aluno.idAluno == alunos[j].grupo.lider.idAluno)
						{
							classe = "lider";
						}
					}

					var dataAlunoVariavel = getAlunoVariavel(alunos[j].aluno.idAluno);

					var roteirosAtribuidos;
    				$.ajax({
    					    type: "GET",
    					    async:false,
    					    crossDomain: true,
    					    url: path+"AtribuicaoRoteiroExtra/aluno/"+dataAlunoVariavel.aluno.idAluno          
						}).then(function(data) {
							roteirosAtribuidos = data;
					});

					var NumeroRetornoPlanejamento = getNumeroPlanejamento(alunos[j].aluno.idAluno,1);
					
					var LimiteTT =0;
					var LimiteAnterior = 0;
					var LimiteProximo = 0;

					for(var b=0; b< dataObjetivo.length;b++)
					{
						if(dataObjetivo[b].ativo == "1" && dataObjetivo[b].roteiro.ativo == "1" && dataObjetivo[b].roteiro.anoEstudo.idanoEstudo == dataAlunoVariavel.anoEstudo.idanoEstudo)
						{
							LimiteTT++;
						}
						else
						{
							for (var k = 0; k < roteirosAtribuidos.length; k++)
								{
									if(dataObjetivo[b].ativo == "1" && dataObjetivo[b].roteiro.idroteiro == roteirosAtribuidos[k].idroteiro && dataObjetivo[b].roteiro.anoEstudo.ano < dataAlunoVariavel.anoEstudo.ano)
										{LimiteAnterior++;}
									else if(dataObjetivo[b].ativo == "1" && dataObjetivo[b].roteiro.idroteiro == roteirosAtribuidos[k].idroteiro && dataObjetivo[b].roteiro.anoEstudo.ano > dataAlunoVariavel.anoEstudo.ano)
										{LimiteProximo++;}
								}
						}
					}

					dataPlanejamentoRoteiro = getData('PlanejamentoRoteiro/aluno', dataAlunoVariavel.aluno.idAluno);

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
							if (dataPlanejamentoRoteiro[c].objetivo.roteiro.anoEstudo.ano == dataAlunoVariavel.anoEstudo.ano) 
								{completos++;}
							else if (dataPlanejamentoRoteiro[c].objetivo.roteiro.anoEstudo.ano < dataAlunoVariavel.anoEstudo.ano)
								{completosAnterior++;}
							else if (dataPlanejamentoRoteiro[c].objetivo.roteiro.anoEstudo.ano > dataAlunoVariavel.anoEstudo.ano)
								{completosProximo++;}
						}
						else if (dataPlanejamentoRoteiro[c].status == "3")
						{
						if (dataPlanejamentoRoteiro[c].objetivo.roteiro.anoEstudo.ano == dataAlunoVariavel.anoEstudo.ano) 
							{
								completos++;
								SerieAtualCorrigidoCont++;
							}
						else if (dataPlanejamentoRoteiro[c].objetivo.roteiro.anoEstudo.ano < dataAlunoVariavel.anoEstudo.ano)
							{
								completosAnterior++;
								SerieAnteriorCorrigidoCont++;
							}
						else if (dataPlanejamentoRoteiro[c].objetivo.roteiro.anoEstudo.ano > dataAlunoVariavel.anoEstudo.ano)
							{
								completosProximo++;
								SerieProximaCorrigidoCont++;
							}
						}
					}

					var barrasExercicios = "";

					if(LimiteProximo != 0)
					{
						SerieProxima = (completosProximo/LimiteProximo) * 100;
						SerieProximaCorrigido = (SerieProximaCorrigidoCont/completosProximo) * 100;
						barrasExercicios+='<div class="Porcentagem_Objetivos_Serie_Proxima Porcentagem_Right" style="height:'+(SerieProxima)+'%;">';
						barrasExercicios+='<div class="Porcentagem_Objetivos_Serie_Proxima_Corrigido" style="height:'+(SerieProximaCorrigido)+'%;"></div>';
						barrasExercicios+='</div>';
						if(LimiteTT != 0)
						{
							SerieAtual = (completos/LimiteTT) * 100;
							SerieAtualCorrigido = (SerieAtualCorrigidoCont/completos) * 100;
							console.log(SerieAtualCorrigidoCont/completos + " " + SerieAtualCorrigidoCont + " " + completos)
							barrasExercicios+='<div class="Porcentagem_Objetivos_Serie_Atual Porcentagem_Left" style="height:'+(SerieAtual)+'%;">';
							barrasExercicios+='<div class="Porcentagem_Objetivos_Serie_Atual_Corrigido" style="height:'+(SerieAtualCorrigido)+'%;"></div>';
							barrasExercicios+='</div>';
						}
					}
					else if(LimiteAnterior != 0)
					{
						SerieAnterior = ((completosAnterior/LimiteAnterior) * 100);
						SerieAnteriorCorrigido = (SerieAnteriorCorrigidoCont/completosAnterior) * 100;
						barrasExercicios+='<div class="Porcentagem_Objetivos_Serie_Anterior Porcentagem_Left" style="height:'+(SerieAnterior)+'%;">';
						barrasExercicios+='<div class="Porcentagem_Objetivos_Serie_Anterior_Corrigido" style="height:'+(SerieAnteriorCorrigido)+'%;"></div>';
						barrasExercicios+='</div>';
						if(LimiteTT != 0)
						{
							SerieAtual = (completos/LimiteTT) * 100;
							SerieAtualCorrigido = (SerieAtualCorrigidoCont/completos) * 100;
							console.log(SerieAtualCorrigidoCont/completos + " " + SerieAtualCorrigidoCont + " " + completos)
							barrasExercicios+='<div class="Porcentagem_Objetivos_Serie_Atual Porcentagem_Right" style="height:'+(SerieAtual)+'%;">';
							barrasExercicios+='<div class="Porcentagem_Objetivos_Serie_Atual_Corrigido" style="height:'+(SerieAtualCorrigido)+'%;"></div>';
							barrasExercicios+='</div>';
						}
					}
					else if(LimiteTT != 0)
					{
						SerieAtual = (completos/LimiteTT) * 100;
						SerieAtualCorrigido = (SerieAtualCorrigidoCont/completos) * 100;
						console.log(SerieAtualCorrigidoCont/completos + " " + SerieAtualCorrigidoCont + " " + completos)
						barrasExercicios+='<div class="Porcentagem_Objetivos_Serie_Atual Porcentagem_Center" style="height:'+(SerieAtual)+'%;">';
						barrasExercicios+='<div class="Porcentagem_Objetivos_Serie_Atual_Corrigido" style="height:'+(SerieAtualCorrigido)+'%;"></div>';
						barrasExercicios+='</div>';
					}

					htmlContent+=	'<div class="Grafico_Individual_Aluno">'+
										'<div class="Grafico_Individual_Aluno_Falta_Numero">'+presencaAluno(alunos[j].aluno.idAluno)+'</div>'+
										'<div id="Grade_Aluno_Grafico_Mask">'+
											'<div class="Grafico_Individual_Aluno_Escala">'+
												barrasExercicios+
											'</div>'+
										'</div>';
										if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
                						    htmlContent+= '<a href="mRelatorioAluno.html?ID='+(base64_encode(""+alunos[j].aluno.idAluno))+'&TU='+(base64_encode(""+gruposProfessor[i].tutoria.idtutoria))+'">';
                						else
											htmlContent+= '<a href="relatorioAluno.html?ID='+(base64_encode(""+alunos[j].aluno.idAluno))+'&TU='+(base64_encode(""+gruposProfessor[i].tutoria.idtutoria))+'">';
										
										htmlContent+= '<div class="Grafico_Individual_Aluno_Foto">'+
											'<img class="foto_aluno" nomeAluno=" '+alunos[j].aluno.nome+' "src="'+alunos[j].aluno.fotoAluno+' "></img>';
											// ' <div id="icone_alerta" style=" heigth:10px; width:10px background-color:YELLOW; align:float;"' +
									 if(temPendenciaProf(alunos.idAluno))
									 {
									 	htmlContent += ' <div id="icone_alerta"> a </div>';
									 }

					htmlContent += 		'</div>'+
									'</a>'+
									'<div class="Grafico_Individual_Aluno_Foto_Hover grupo '+classe+'" id="LD_'+alunos[j].aluno.idAluno+'" nomeAluno="'+alunos[j].aluno.nome+'" '+funcao+'></div>'+
									'</div>';
				}
			}


			htmlContent+='</div> '+
							'</div>'+
						'</div>';

			if(ContadorAluno == 0)
			{
				htmlContent = "";
			}

			$('#Grupos_box').append(htmlContent);
		}

		$('#Grupos_box').append('<div class="aluno_foco"> </div>');

		$(".Grafico_Individual_Aluno_Foto_Hover").mouseover(mostrarNome)
		.mouseout(function(){
			$('.aluno_foco').hide();
		});
		
		$(".foto_aluno").mouseover(mostrarNome)
		.mouseout(function(){
			$('.aluno_foco').hide();
		});
		

	}

	function mostrarNome(){
			$('.aluno_foco').show();
			$('.aluno_foco').css("left",($(this).position().left-30)+"px");
			$('.aluno_foco').css("background-color","white");
			$('.aluno_foco').css("top",($(this).position().top+37)+"px");
			$('.aluno_foco').html($(this).attr("nomeAluno"));
		}
	
	
	
function mudarLider(grupo,lider){
	var LD_Atual = $("#grupo_"+grupo+" .lider").attr("id");
	$( "#boxMensagemGeral" ).html("<p>Teste loading</p>").show();
	$.ajax({
		url: path+"Grupo/liderGrupo/",
		type: "POST",
		async:false,
		crossDomain: true,
		dataType: 'json',
		contentType: false,	
		data:"action=update&grupo="+grupo+"&lider="+lider,			
		success: function(data){
			$("#"+LD_Atual).removeClass("lider");
			$("#LD_"+lider).addClass("lider");
			$( "#boxMensagemGeral" ).html("<p>Teste loading</p>").hide();
		},error: function(d) {
			//console.log("Erro");
		}
	});	
}

function drawBoxProfessor(Tutor)
{
	HtmlContent='<div id="Tutor_box">'+
						'<div id="tutor_img"><img src='+dataProfessorFuncionario.fotoProfessorFuncionario+'></div>'+
						'<div id="nome_tutor"> '+dataProfessorFuncionario.nome+' </div>'+
						'<div id="turma"> 6 ano - manhã </div>'+
						'<div id="visualizar_dados"><a href="#" id="visualizar" onclick="visualizarDados()">Visualizar dados</a></div>'+
					'</div>';


	$( HtmlContent ).insertBefore( "#Grupos_box" );
}

/* External */


function getProfessorByUsuario(IDusuario)
{
	for(var a=0; a< dataUsuario.length; a++)
	{
		if(dataUsuario[a].idusuario == IDusuario)
		{
			return dataUsuario[a].professor.idprofessorFuncionario;
		}
	}
}

function getAlunoVariavel(IDaluno)
{
	if(dataAlunoVariavel.length > 0){
		for(var a=0; a< dataAlunoVariavel.length; a++)
		{
			if(dataAlunoVariavel[a].aluno.idAluno == IDaluno)
			{
				return dataAlunoVariavel[a];
			}
		}
	}
}


//-------------------------------------------------------------------------------------------------------------------------

//Retorno de planejamentos do aluno especifico

function getNumeroPlanejamento(AlunoID, Numero)
{

	var contador = 0;

	dataPlanejamentoRoteiro = getData('PlanejamentoRoteiro/aluno', AlunoID);

	for(var a=0; a< dataPlanejamentoRoteiro.length; a++)
	{
		
		if(Numero == 1)
		{
			
			if(dataPlanejamentoRoteiro[a].status == "2" ||
							dataPlanejamentoRoteiro[a].status == "3" ||
							dataPlanejamentoRoteiro[a].status == "4")
			{

				contador++;

			}

		} else if(Numero == 2)
		{

			if(dataPlanejamentoRoteiro[a].status == "3")
			{
				
				contador++;

			}

		}
	}

	return contador;
}

function visualizarDados(){
	//console.log(base64_decode(GetURLParameter('ID')));
	localStorage.setItem("professorEdt",base64_decode(GetURLParameter('ID')));	
	$(location).attr('href','visualizarDadosProfessor.html');
}