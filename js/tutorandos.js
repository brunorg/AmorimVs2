//Murano Design

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

    var usuarioID = usuarioId;
    var UsuarioAtivo = 2;
    //var IdAluno = 1;

/*//------------------------------------------------------------------------------------------------------------------------

//Carrega os dados da URL GET

var Tutor = base64_decode(GetURLParameter('ID'));*/

//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD

var dataGrupo 			=	getData("Grupo", null);
var dataAlunoVariavel 	=	getData("AlunoVariavel", null);

//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery

$(document).ready(function() {

	var HtmlContent="";

		for(var a=0; a< dataGrupo.length; a++){
			//console.log();
			
			
			if(dataGrupo[a].tutoria != null){
				if(dataGrupo[a].tutoria.tutor.idprofessorFuncionario == usuarioID)
				{
					var IdentificadorGrupo = dataGrupo[a].idgrupo;

						//Aluno Variavel

							for(var b=0; b< dataAlunoVariavel.length; b++)
							{
								if(IdentificadorGrupo == dataAlunoVariavel[b].grupo.idgrupo)
								{
									//console.log(dataAlunoVariavel[b].aluno.nome);

									HtmlContent = '<a href="relatorioAluno.html?ID='+base64_encode((dataAlunoVariavel[b].idalunoVariavel).toString())+'" class="link_rel"><div class="Conteudo_Coluna2_Aluno">'+
													'<div class="FotoAlunoCadastro" style="background-image:url(data:image/png;base64,'+dataAlunoVariavel[b].aluno.fotoAluno+')"></div>'+
		                            				'<div class="Botao_Aviso"></div>'+
		                            				'<div class="Nome_do_Aluno">'+
		                            				dataAlunoVariavel[b].aluno.nome+
		                                			'</div>'+
		                            				'</div></a>';

		                            //console.log(HtmlContent);

									$('#boxGeralAlunos').append(HtmlContent);

								}
							}

				}
			}
		}

});




function GetURLParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}

