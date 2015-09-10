//Murano Design

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

	var alunoID = 2;
	var UsuarioAtivo = 2;

//------------------------------------------------------------------------------------------------------------------------

//Carregas as variaveis padrao

	var listaTutor = new Array();
	var totalTutor;
	var Limite;
	var HtmlContent;

//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD

	var dataTutoria 		=	getData("Tutoria", null);
	var dataAnoEstudo 		=	getData("AnoEstudo", null);
	var dataAlunoVariavel 	=	getData("AlunoVariavel", null);




//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery


			$(document).ready(function() {

				loadOptionAnoEstudo();
				loadOptionTutoria();
				ListarTutores();
			   
			});


function loadOptionAnoEstudo()
{
	Limite = dataAnoEstudo.length;
			       
    HtmlContent = "";

    for(var a = 0; a < Limite; a++)
    {
        HtmlContent += '<option value="'+dataAnoEstudo[a].ano+'">'+dataAnoEstudo[a].ano+'</option>';
    }
    
    $('.selecAno').append(HtmlContent);
}

function loadOptionTutoria()
{
	Limite = dataTutoria.length;
			       
    HtmlContent = "";

    for(var a = 0; a < Limite; a++)
    {
        HtmlContent += '<option value="'+dataTutoria[a].tutoria+'">'+dataTutoria[a].tutoria+'</option>';
    }
        
    $('.selecTuto').append(HtmlContent);
}

function ListarTutores()
{
	Limite = dataTutoria.length;
    totalTutor = Limite;
   	HtmlContent = "";

    for(var a = 0; a < Limite; a++)
    {
       	listaTutor[a] = dataTutoria[a].tutor.nome;    		 								        		
    }	

    listaGrupos();	
}

function listaGrupos() 
{

	var Limite;
	var HtmlContent;
	var nlinha = 3;

    Limite = dataAlunoVariavel.length;
       
    HtmlContent = "";
    var antes = "";
    var depois = "";

    for(var a = 0; a < Limite; a++)
    {

       		antes = dataAlunoVariavel[a].grupo.idgrupo;

        	if (depois!=antes)
        	{
         	
            if (dataAlunoVariavel[a].grupo.tutoria == null)
            {
	            HtmlContent += '<div id="linha'+nlinha+'" class="linha">';
	            HtmlContent += '<div class="grupoCaixa">';
	            HtmlContent += '<div class="grupoTitulo">'+dataAlunoVariavel[a].anoEstudo.ano.charAt(0)+''+dataAlunoVariavel[a].grupo.tutoria.periodo.periodo.charAt(0)+''+dataAlunoVariavel[a].grupo.idgrupo+'</div>';
	            HtmlContent += '<div class="grupo grupo_'+dataAlunoVariavel[a].grupo.idgrupo+'">Alunos: '+dataAlunoVariavel[a].aluno.nome+'</div>';
	            HtmlContent += '</div>';
	            HtmlContent += '<div class="btEditar"></div>';
	            HtmlContent += '<div class="celulaGrande">';
				HtmlContent += '<div class="infoG"> Tutor </div>';
	            HtmlContent += '<div class="infoValueG">';
	            HtmlContent += '<div class="styled-select">';
	            HtmlContent += '<select>';
	            HtmlContent += '<option> Não atribuído </option>';

	            for (var ntutor = 0; ntutor < totalTutor; ntutor++) 
	            {
	            	HtmlContent += '<option>'+listaTutor[ntutor]+'</option>';
	            }

	            HtmlContent += '</select>';
	            HtmlContent += '</div>';
	            HtmlContent += '</div>';
	            HtmlContent += '</div>';
	            HtmlContent += '</div>';
	            HtmlContent += '</div>';
            }
            else{
	            HtmlContent += '<div id="linha'+nlinha+'" class="linha">';
	            HtmlContent += '<div class="grupoCaixa">';
	            HtmlContent += '<div class="grupoTitulo">'+dataAlunoVariavel[a].anoEstudo.ano.charAt(0)+''+dataAlunoVariavel[a].grupo.tutoria.periodo.periodo.charAt(0)+''+dataAlunoVariavel[a].grupo.idgrupo+'</div>';
	            HtmlContent += '<div class="grupo grupo_'+dataAlunoVariavel[a].grupo.idgrupo+'">Alunos: '+dataAlunoVariavel[a].aluno.nome+'</div>';
	            HtmlContent += '</div>';
	            HtmlContent += '<div class="btEditar"></div>';
	            HtmlContent += '<div class="celulaGrande">';
	            HtmlContent += '<div class="infoG"> Tutor </div>';
            	HtmlContent += dataAlunoVariavel[a].grupo.tutoria.tutor.nome
	            HtmlContent += '</div>';
	            HtmlContent += '</div>';
        	}
       		$('.box_margin_barra').append(HtmlContent); 
       		HtmlContent = "";
    	}
        else if(depois==antes && dataAlunoVariavel[a].grupo != null)
        {
        	HtmlContent += ', '+dataAlunoVariavel[a].aluno.nome;
        	$('.grupo_'+dataAlunoVariavel[a].grupo.idgrupo).append(HtmlContent);
        	HtmlContent = "";
        }


        depois = antes;
        nlinha++;

	}	
    
};
