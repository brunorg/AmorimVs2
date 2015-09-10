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
	var returnTutor;

		for(var i = 0; i < dataTutoria.length; i++)
		{

			if(dataTutoria[i].tutor.idprofessorFuncionario == IDtutor)
			{

				returnTutor = dataTutoria[i].idtutoria;

			}
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
	var auxAlunos = [];

	$.ajax({
		type: "GET",
		crossDomain: true,
		async: false,
		url: path+"AlunoVariavel/"	
    }).then(function(data) {

    	//esse array só serve pra usar o inArray e ser mais rapido

    	var idGrupos=[];

		for (var g = 0; g < grupos.length; g++)
		{
			idGrupos[idGrupos.length] = grupos[g].idgrupo;
		}

    	for(var i =0; i<data.length;i++)
    	{

    		if(data[i].grupo != undefined)
    		{
    			
		    	if(((jQuery.inArray( data[i].grupo.idgrupo, idGrupos )) != -1) || (jQuery.inArray( data[i].grupo.idgrupo, idGrupos )) != 0) 
		    	{
		    		auxAlunos[auxAlunos.length]=data[i];
		    	}
    		}

    	}

  	});  
	  
	return auxAlunos;
}


//Inicializadores

	
	//Inicia se Coordenador esta logado
	function initCoordena()
	{
		Tutor = base64_decode(GetURLParameter('ID'));

		dataProfessorFuncionario 	=	getData("ProfessorFuncionario", Tutor);

		drawBoxProfessor(Tutor);

		dataTutoria 				=	getData("Tutoria", null);
		dataGrupo 					=	getData("Grupo", null);
		dataProfessorFuncionario 	=	getData("ProfessorFuncionario", Tutor);

		tutoria = 	getTutoria(dataProfessorFuncionario.idprofessorFuncionario);

		getGrupo(tutoria);


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

		tutoria = 	getTutoria(dataProfessorFuncionario.idprofessorFuncionario);
		getGrupo(tutoria);

		 alunos 	=	getAlunos(gruposProfessor);

		loadPaginaProfessor();
	}

//Carrega Paginas

	function loadPaginaProfessor()
	{
		htmlContent = "";
		var ContadorAluno;

		var LimiteTT =0;

		for(var b=0; b< dataObjetivo.length;b++)
		{
			if(dataObjetivo[b].ativo == "1" && dataObjetivo[b].roteiro.ativo == "1")
			{
				LimiteTT++;
			}
		}
		
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
					var NumeroRetornoPlanejamento = getNumeroPlanejamento(alunos[j].aluno.idAluno,1);

					SerieAtual = (((NumeroRetornoPlanejamento/LimiteTT)/1.055)*100);

					if(NumeroRetornoPlanejamento != 0)
					{
						SerieAtualCorrigido = ((getNumeroPlanejamento(alunos[j].aluno.idAluno,2)/NumeroRetornoPlanejamento)*100);
					} else {
						SerieAtualCorrigido = 0;
					}

					htmlContent+=	'<div class="Grafico_Individual_Aluno">'+
										'<div class="Grafico_Individual_Aluno_Falta_Numero">'+presencaAluno(alunos[j].aluno.idAluno)+'</div>'+
										'<div id="Grade_Aluno_Grafico_Mask">'+
											'<div class="Grafico_Individual_Aluno_Escala">'+
												'<div class="Porcentagem_Objetivos_Serie_Atual Porcentagem_Right" style="height:'+(SerieAtual)+'%;">'+
													'<div class="Porcentagem_Objetivos_Serie_Atual_Corrigido" style="height:'+(SerieAtualCorrigido)+'%;"></div>'+
												'</div> '+
											'</div>'+
										'</div>'+
										'<a href="relatorioAluno.html?ID='+(base64_encode(""+alunos[j].aluno.idAluno))+'&TU='+(base64_encode(""+gruposProfessor[i].tutoria.idtutoria))+'">'+
										'<div class="Grafico_Individual_Aluno_Foto">'+
											'<img src="'+alunos[j].aluno.fotoAluno+'"></img>';
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

		$(".Grafico_Individual_Aluno_Foto_Hover").mouseover(function(){
			$('.aluno_foco').show();
			$('.aluno_foco').css("left",($(this).position().left-30)+"px");
			$('.aluno_foco').css("top",($(this).position().top+37)+"px");
			$('.aluno_foco').html($(this).attr("nomeAluno"));
		})
		.mouseout(function(){
			$('.aluno_foco').hide();
		});

	}

function mudarLider(grupo,lider){
	var LD_Atual = $("#grupo_"+grupo+" .lider").attr("id");

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
						'<div id="visualizar_dados"> visualizar dados </div>'+
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