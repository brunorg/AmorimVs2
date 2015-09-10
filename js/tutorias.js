//Murano Design

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

	var alunoID = 2;
	var UsuarioAtivo = 2;

//------------------------------------------------------------------------------------------------------------------------

//Carregas as variaveis padrao


//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD

	var dataTutoria 		=	getData("Tutoria", null);

//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery

$(document).ready(function() {

	var HtmlContent = "";
	var BTutores = new Array();

		for(var a=0; a< dataTutoria.length; a++)
		{
			if(BTutores.length >= 0)
			{
				var Checked = false;
				var Contador = 0;

				for(var c=0; c< BTutores.length; c++)
				{
					if(BTutores[c] == dataTutoria[a].tutor.idprofessorFuncionario)
					{
						console.log(BTutores[c]);
						Checked = true;
					}

				}

				if(!Checked)
				{
					if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
						HtmlContent = '<a href="mGrupoTutoria.html?ID='+base64_encode(""+dataTutoria[a].tutor.idprofessorFuncionario)+'" class="tutoriaLink">';
					else
						HtmlContent = '<a href="grupoTutoria.html?ID='+base64_encode(""+dataTutoria[a].tutor.idprofessorFuncionario)+'" class="tutoriaLink">';
					HtmlContent += '<div class="Conteudo_Coluna2_Professor">'+
			        '<div class="FotoProfessorCadastro" style="background-image:url('+dataTutoria[a].tutor.fotoProfessorFuncionario+');"></div>'+
			        '<div class="Botao_Aviso"></div>'+
			        '<div class="Nome_do_Professor">'+
			        dataTutoria[a].tutor.nome+
			        '</div>'+
			        '</div></a>';

			        $('#boxGeralAlunos').append(HtmlContent);
			        //console.log(BTutores.length+1);
			        BTutores[BTutores.length] = dataTutoria[a].tutor.idprofessorFuncionario;
				}
			} 

			else 
			{

				HtmlContent = '<a href="relatorioProfessor.html" class="tutoriaLink">'+
				'<div class="Conteudo_Coluna2_Professor">'+
		        '<div class="FotoProfessorCadastro" style="background-image:url('+dataTutoria[a].tutor.fotoProfessorFuncionario+');"></div>'+
		        '<div class="Botao_Aviso"></div>'+
		        '<div class="Nome_do_Professor">'+
		        dataTutoria[a].tutor.nome+
		        '</div>'+
		        '</div></a>';

		        $('#boxGeralAlunos').append(HtmlContent);

		        BTutores[0] = dataTutoria[a].tutor.idprofessorFuncionario;
			
			}



    	}

});
