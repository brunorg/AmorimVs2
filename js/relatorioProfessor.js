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

var htmlContent;

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


function getGrupo(IDtutor){

	  	for (var i = 0; i < dataGrupo.length;i++)
	  	{
	  		if(dataGrupo[i].tutoria.idtutoria == IDtutor)
	  		{
	  			gruposProfessor[gruposProfessor.length]=dataGrupo[i];
	  		}

	  	}

}

	function getAlunos(grupos){
var auxAlunos = [];
		$.ajax({
				type: "GET",
				crossDomain: true,
				async: false,
				url: path+"AlunoVariavel/"	
		    }).then(function(data) {

		    	//esse array só serve pra usar o inArray e ser mais rapido

		    	var idGrupos=[];
		    	 for (var g = 0; g < grupos.length; g++){

		    	 	idGrupos[idGrupos.length] = grupos[g].idgrupo;

		    	 }
		    	 //console.log('data.length: '+data.length);
		    	for(var i =0; i<data.length;i++){

		    		//console.log((jQuery.inArray( data[i].grupo.idgrupo, idGrupos )));
			    	if((jQuery.inArray( data[i].grupo.idgrupo, idGrupos )) != -1){

			    		auxAlunos[auxAlunos.length]=data[i];

			    	}

		    	 }
		  	});  
		  	//console.log(auxAlunos);
		return  auxAlunos;

	}


//Falme

//Inicializadores

	
	//Inicia se Coordenador esta logado
	function initCoordena()
	{
		Tutor = base64_decode(GetURLParameter('ID'));
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
		//console.log(tutoria);
		getGrupo(tutoria);

		for(var a=0; a< gruposProfessor.length; a++)
		{	
			//console.log(gruposProfessor[a]);
		}
		// grupos 	= 	gruposProfessor
		 alunos 	=	getAlunos(gruposProfessor);

		loadPaginaProfessor();
	}

//Carrega Paginas

	function loadPaginaProfessor()
	{
		htmlContent = "";




		for (var i = 0; i < gruposProfessor.length-1; i++)
		{
			htmlContent +='<div class="Grupo_Content">'+
						'<div id="grupo1">'+
							'<div id="grupoId"> Grupo'+gruposProfessor[i].nomeGrupo+': </div>'+
							'<ul>';

			for(var j =0; j < alunos.length;j++)
			{
				htmlContent +='<li> '+alunos[j].aluno.nome+' </li>';
			}

			htmlContent +='</ul>'+
						'</div>'+
						'<div class="graficos">'+
							'<div class="Grade_Aluno_Grafico_Content">'+
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
				htmlContent+=	'<div class="Grafico_Individual_Aluno">'+
						'<div class="Grafico_Individual_Aluno_Falta_Numero">4</div>'+
							'<div id="Grade_Aluno_Grafico_Mask">'+
								'<div class="Grafico_Individual_Aluno_Escala">'+
									'<div class="Porcentagem_Objetivos_Serie_Atual Porcentagem_Right">'+
										'<div class="Porcentagem_Objetivos_Serie_Atual_Corrigido"></div>'+
									'</div> '+
								'</div>'+
							'</div>'+
							'<div class="Grafico_Individual_Aluno_Foto_Hover">'+
								'<img src="data:image/gif;base64,'+alunos[j].aluno.fotoAluno+'"></img>'+
							'</div>'+
					'</div>';

			}


			htmlContent+='</div> '+
							'<div class="aluno_foco"> Camila Ferreira Carrenho </div>'+
							//'<div class="aluno_foco">Lider : '+gruposProfessor[i].lider.aluno.nome+' </div>'+
							'</div>'+
						'</div>';
		}

		$('#Grupos_box').html(htmlContent);
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


























/* lixo */

//$(document).ready(function(){
	// console.log(Tutor);

	//var htmlContent = "";





	 //$('#nome_tutor').empty();
	//$('#nome_tutor').append(Tutor.nome);

	 //$('#turma').empty();










// 	for (var i = 0; i < grupos; i++){

// 		htmlContent +=' <div class="Grupo_Content"> <div id="grupo ' + i +'"> <div id="'+grupos[i].idgrupo+'"> '+grupos[i].nomeGrupo+': </div> <ul>';
// 							for(var j =0; j < alunos.length;j++){
// 								if(alunos[j].grupo.idgrupo == grupos[i].idgrupo){

// 									htmlContent += '<li>'+ alunos[j].aluno.nome + '</li>';
// 								}


								

// 								//NESSE TRECHO FALTAM PROGRAMAR AS FALTAS
// 								htmlContent+= '</ul></div> <div class="graficos"><div class="Grade_Aluno_Grafico_Content"> <div class="Grade_Aluno_Grafico_Legenda_Lateral"> Faltas<br />100<br />90<br />80<br />70<br />60<br />50<br />40<br />30<br />20<br />10<br />0</div>';
// 								for(var j =0;j<alunos.length;j++){
// 									htmlContent +='<div class="Grafico_Individual_Aluno"><div class="Grafico_Individual_Aluno_Falta_Numero">15</div><div id="Grade_Aluno_Grafico_Mask"><div class="Grafico_Individual_Aluno_Escala"><div class="Porcentagem_Objetivos_Serie_Atual Porcentagem_Right"><div class="Porcentagem_Objetivos_Serie_Atual_Corrigido"></div></div></div></div><div class="Grafico_Individual_Aluno_Foto_Hover"><img src="' + alunos[j].aluno.FotoAluno +'"></img></div></div>';
// 									htmlContent +=('<div id="Correcoes_objetivos">	<hr>	<div class="titulos"> Correções de objetivos </div>			<div class="Grafico_Holder">								<canvas id="grafico1"> </canvas>							</div>						<div id="objetivos"> <span>23</span> objetivos de 154 </div>					</div>			<div id="Frequencia">			<hr>			<div class="titulos"> Frequência </div> <div class="box_calendario">                                <!--Calendario-->              <div id="box_calendario_relatorio"> <div id="calendario_relatorio"></div>      </div> </div>       <div id="calendario_legenda">    <p>        <span class="quad amarelo"> </span>  <span class="leg_titulo">presença</span> </p> <p> <span class="quad laranja"> </span> <span class="leg_titulo">falta</span> </p> <p> <span class="quad branco"> </span> <span class="leg_titulo">não apontada</span> </p> </div> <br><br> <div class="Grafico_Holder"> <canvas id="grafico2"> </canvas> </div> <div id="faltas"> <span>2</span> faltas em 180 dias letivos </div> </div> <div id="Observacoes"> <div class="titulos"> Observações </div> <div class="observacao_texto"> <div class="data_hora"> 23/02/2014 10:40 </div> In ac consectetur nulla. Curabitur elementum nunc ut metus sollicitudin dignissim. Maecenas ligula enim, scelerisque volutpat lacus vel, posuere rhoncus libero. Sed ullamcorper arcu ex, eu commodo mi placerat sed. Ut non pellentesque eros. Vestibulum et arcu leo. Morbi vel velit sed dui blandit placerat pulvinar sit amet purus. Vestibulum porta lorem non ante sodales, id maximus elit posuere. Quisque sit amet ante eget risus consectetur malesuada id sit amet nisl. Integer eu augue dignissim, pretium nunc eget, porta justo. Sed mollis risus eget neque hendrerit, sit amet convallis neque consectetur. Aenean egestas cursus lobortis. Aliquam vulputate, nisl in tincidunt euismod, dui dui porttitor risus, sollicitudin fermentum lacus mi eget lorem. </div> <div class="observacao_texto"> <div class="data_hora"> 23/02/2014 10:42 </div> Integer eu augue dignissim, pretium nunc eget, porta justo. Sed mollis risus eget neque hendrerit, sit amet convallis neque consectetur. Aenean egestas cursus lobortis. Aliquam vulputate, nisl in tincidunt euismod, dui dui porttitor risus, sollicitudin fermentum lacus mi eget lorem. </div> </div>'); }
								



// }
// }

//console.log("lalala");
	//  $('#Grupos_box').empty();
	// $('#Grupos_box').append(htmlContent);



//});


// function getTutor(IDtutor)
// {
// 	var auxTu;

// 	$.ajax({
// 		type: "GET",
// 		crossDomain: true,
// 		async: false,
// 		url: path+"ProfessorFuncionario/" + IDtutor		
// 	}).then(function(data) {

// 		auxTu  = data;
 
// 	});  

// 	return auxTu;
// }





