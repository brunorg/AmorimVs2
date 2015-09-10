
var BList = new Array();



//Murano Design

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

    var alunoID = 2;
    var UsuarioAtivo = 2;

//------------------------------------------------------------------------------------------------------------------------

//Carregas as variaveis padrao

    var Limite;
    var HtmlContent;
    var contador;
    var previous;

//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD

	var dataPeriodo 				=	getData("Periodo", null);
	var dataAnoEstudo 				=	getData("AnoEstudo", null);
	var dataAlunoVariavel 			=	getData("AlunoVariavel", null);
	var dataProfessorFuncionario 	=	getData("ProfessorFuncionario", null);

//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery

$(document).ready(function() {

	SetValoresAnoEstudo();
	SetValoresPeriodo();
	SetValoresProfessorFuncionario();

	SetValoresAlunoVariavel();

    $('#btAdd').click(function() {
    	CriarNovaLinha();
    });


    $('#btn_Reg_Grupo').click(function() {
    	RegistrarGrupo();
    });

    $("#S_AnoEstudo").change(function() {
    	SetValoresAlunoVariavel();
    });

   $("#S_Periodo").change(function() {
    	SetValoresAlunoVariavel();
    });


 $(".S_Aluno").on('focus', function () {
        previous = this;
        
    }).change(function() {
    	DisposicaoAluno(this);
    });

});

//------------- Fim OnReady ---------------------


//------------- SET's ---------------------------

/* Set Valor Ano Estudo */

function SetValoresAnoEstudo()
{
    var Limite = dataAnoEstudo.length;
    var HtmlContent = "";

    for(var a = 0; a < Limite; a++){
        HtmlContent += '<option value="'+dataAnoEstudo[a].idanoEstudo+'">'+dataAnoEstudo[a].ano+'º</option>';

    }
    
    $('#S_AnoEstudo').append(HtmlContent);
}

/* Set Valor Periodo */

function SetValoresPeriodo()
{
    var Limite = dataPeriodo.length;
    var HtmlContent = "";

    for(var a = 0; a < Limite; a++)
    {

        HtmlContent += '<option value="'+dataPeriodo[a].idperiodo+'">'+dataPeriodo[a].periodo+'</option>';

    }
    
    $('#S_Periodo').append(HtmlContent);
}

/* Set Valor Tutor */

function SetValoresProfessorFuncionario(idTutoria)
{
    var Limite = dataProfessorFuncionario.length;
    var HtmlContent = "";

    for(var a = 0; a < Limite; a++){
        HtmlContent += '<option value="'+dataProfessorFuncionario[a].nome+'">'+dataProfessorFuncionario[a].nome+'</option>';
    }
	if(idTutoria){
		var opcaoTutoria = $('#tutoria');
		opcaoTutoria.val(opcaoTutoria.find('option[value="'+idTutoria+'"]').val());
	}    
    $('#S_Tutor').append(HtmlContent);
}

/* Set Valor Alunos */

function SetValoresAlunoVariavel()
{
	var dataAlunoVariavel =	getData("AlunoVariavel", null);
    var Limite = dataAlunoVariavel.length;
  	
	var elementos = $('.S_Aluno');
	
	for (var i = 0; i < elementos.length; i++) {				
		if($("#"+elementos[i].id).val() == "-1"){			
			$("#"+elementos[i].id).html("");				
		}					
	}	

	if(typeof alunos == "undefined"){
		var HtmlContent = "";
		HtmlContent += '<option value="-1"></option>';
		
		for(var a = 0; a < Limite; a++)
		{    	
			var Encontrado = false;
			if($('#S_AnoEstudo').val() == dataAlunoVariavel[a].anoEstudo.idanoEstudo && 
				$('#S_Periodo').val() == dataAlunoVariavel[a].periodo.idperiodo && 
				dataAlunoVariavel[a].grupo == null)
			{	
				HtmlContent += '<option value="'+dataAlunoVariavel[a].idalunoVariavel+'">'+dataAlunoVariavel[a].aluno.nome+' | '+dataAlunoVariavel[a].anoEstudo.ano+'°</option>';
			}        	
		}
		
		for (var e = 0; e < elementos.length; e++) {				
			if($("#"+elementos[e].id).val() == null){			
				$("#"+elementos[e].id).html(HtmlContent);				
			}					
		}
	}else{
		var HtmlContent = new Array();
		for(var a = 0; a < Limite; a++)
		{    	
			var Encontrado = false;
			for(h=0;h<alunos.length;h++)
			{	
				if( alunos[h]["AnoEstudo"] == dataAlunoVariavel[a].anoEstudo.idanoEstudo && 
					$('#S_Periodo').val() == dataAlunoVariavel[a].periodo.idperiodo && 
					dataAlunoVariavel[a].grupo == null)
				{
					HtmlContent+= '<option value="'+dataAlunoVariavel[a].idalunoVariavel+'">'+dataAlunoVariavel[a].aluno.nome+' | '+dataAlunoVariavel[a].anoEstudo.ano+'°</option>';
				}
			}
		}
		
		for (var e = 0; e < elementos.length; e++) {				
			if($("#"+elementos[e].id).val() == null){			
				$("#"+elementos[e].id).html(HtmlContent);							
			}					
		}
	}   
	
	if(typeof alunos != 'undefined'){		
		if(alunos.length>0){
			while(alunos.length > $('#marginAlunos .linha').length-2)
			{
				CriarNovaLinha();
			}	
			//console.log("croiu Linhas");
			
			for(i=0;i<alunos.length;i++)
			{
				var opcaoAluno = $('#marginAlunos .linha:nth-child('+(i+2)+') .S_Aluno');
				opcaoAluno.val(opcaoAluno.find('option[value="'+alunos[i]["Aluno"]+'"]').val());
				//console.log("croiu opcoes");
			}		
		}
	}

    for(var b=0; b< $('.S_Aluno').length; b++)
    {
    	document.getElementsByClassName('S_Aluno')[b].valAnterior = "";
		document.getElementsByClassName('S_Aluno')[b].nomAnterior = "";
		document.getElementsByClassName('S_Aluno')[b].optAnterior = "";
		if($('#S_Aluno'+(b+1)).val() == '-1')
		{
			OrdenarPorNome('#S_Aluno'+(b+1), '#S_Aluno'+(b+1)+' option');
			$('#S_Aluno'+(b+1)).val('-1');
		} else {
			var saveOne = $('#S_Aluno'+(b+1)).val();
			OrdenarPorNome('#S_Aluno'+(b+1), '#S_Aluno'+(b+1)+' option');
			$('#S_Aluno'+(b+1)).val(saveOne);
		}
    }

    $('#btAdd').css("display","block");
}

//------------- Fim dos SET's -----------------------


function CriarNovaLinha()
{
	var HTMLNovo = "";

		HTMLNovo +=	'<div id="linha'+($("#marginAlunos .linha").length+1)+'" class="linha">'+
					'<div class="celulaGrande">'+
					'<div class="infoG"> Aluno </div>'+
					'<div class="infoValueG"> '+
					'<div class="styled-select">'+
					'<select id="S_Aluno'+($("#marginAlunos .linha").length-1)+'" class="S_Aluno">'+
					'<option value="-1"></option>';

		for(var a=0;a<dataAlunoVariavel.length; a++)
		{

			if($("#S_AnoEstudo").val() == dataAlunoVariavel[a].anoEstudo.idanoEstudo &&
				$("#S_Periodo").val() == dataAlunoVariavel[a].periodo.idperiodo)
			{

				var Exists = false;

				for(var b=0; b< $('.S_Aluno').length; b++){
		
					if($(document.getElementsByClassName('S_Aluno')[b]).val() == dataAlunoVariavel[a].aluno.idAluno)
					{
						Exists = true;
					}
				}

				if(!Exists){HTMLNovo += '<option value="'+dataAlunoVariavel[a].idalunoVariavel+'">'+dataAlunoVariavel[a].aluno.nome+'</option>';}
			}
		}

		HTMLNovo +=		'</select>'+
						'</div>'+
						'</div>'+
						'</div>'+
						'</div>';

		$(HTMLNovo).insertBefore('#container_Inserir .linha:last-child');
		
		/*$('#btAdd').css("display","none");

		$(".S_Aluno").on('focus', function () {
			previous = this;
		}).change(function() {
			DisposicaoAluno(this);
		});
*/
}



function DisposicaoAluno(objeto)
{
	if(objeto.value != "" && objeto.value != undefined)
	{


		if(objeto.valAnterior == "" || objeto.valAnterior == undefined)
		{

			var CgValor = objeto.value;
			var CgNome = $(objeto).find('option').filter(":selected").text();
			var SelecionadoCombo = $(objeto);

			$('.S_Aluno').find('option').filter(':contains("'+CgNome+'")').remove();

			$(SelecionadoCombo).append('<option value="'+CgValor+'" selected>'+CgNome+'</option>');

			objeto.valAnterior = CgValor;
			objeto.nomAnterior = CgNome;
			objeto.optAnterior = $(objeto).find('option').filter(":selected");

		} else{

			/*First Part*/

				var CgValorAnterior = objeto.value;
				var CgNomeAnterior = $(objeto).find('option').filter(":selected").text();
				var SelecionadoComboAnterior = $(objeto);

				$('.S_Aluno').not(':contains("'+objeto.nomAnterior+'")').append('<option value="'+objeto.valAnterior+'">'+objeto.nomAnterior+'</option>');

			/*Second Part*/

				var CgValor = objeto.value;
				var CgNome = $(objeto).find('option').filter(":selected").text();
				var SelecionadoCombo = $(objeto);

				$('.S_Aluno').find('option').filter(':contains("'+CgNome+'")').remove();

				$(SelecionadoCombo).append('<option value="'+CgValor+'" selected>'+CgNome+'</option>');

				objeto.valAnterior = CgValor;
				objeto.nomAnterior = CgNome;
				objeto.optAnterior = $(objeto).find('option').filter(":selected");

		}
	} else {

		var CgValor = objeto.value;
		var CgNome = $(objeto).find('option').filter(":selected").text();
		var SelecionadoCombo = $(objeto);

		$('.S_Aluno').not(':contains("'+objeto.nomAnterior+'")').append('<option value="'+objeto.valAnterior+'">'+objeto.nomAnterior+'</option>');

		objeto.valAnterior = CgValor;
		objeto.nomAnterior = CgNome;
		objeto.optAnterior = $(objeto).find('option').filter(":selected");

	}

	verifyAdd();
}

function verifyAdd()
{
	var Vazio = false;
	for(var a=0; a< $('.S_Aluno').length; a++)
	{
		if(document.getElementsByClassName('S_Aluno')[a].value == "")
		{
			Vazio = true;
		}
	}

	if(!Vazio)
	{
		$('#btAdd').css("display","block");
	}
	else
	{
		$('#btAdd').css("display","none");
	}
}