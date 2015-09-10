
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
	$.ajax({
		url: path+"ProfessorFuncionario/html",
	   	 dataType : 'html',
		success: function(d) {
			$('.tutoria').html(d+'<option value="N_A">Não Atribuido</option>');	
		}
	})

	if(idTutoria){
		var opcaoTutoria = $('#tutoria');
		opcaoTutoria.val(opcaoTutoria.find('option[value="'+idTutoria+'"]').val());
	}   
}

/* Set Valor Alunos */

function SetValoresAlunoVariavel()
{
	var dataAlunoVariavel =	getData("AlunoVariavel", null);
    var Limite = dataAlunoVariavel.length;
  	
	var elementos = $('.S_Aluno');
	
	/*Recarrega os valores nas combos que estão vazias*/
	for (var i = 0; i < elementos.length; i++) {				
		if($("#"+elementos[i].id).val() == "-1"){			
			$("#"+elementos[i].id).html("");				
		}					
	}	
	
	var HtmlContent = "";
	HtmlContent += '<option value="-1"></option>';
	
	/*Cria as option's para carregar as combos com os dados referentes ao ano de estudo que foi escolhido*/
	
    $.ajax({
        url: path+"AlunoVariavel/html/"+$('#S_AnoEstudo').val()+"/"+$('#S_Periodo').val(),
        dataType : 'html',
        success: function(d) {
            for(var b=0; b< $('.S_Aluno').length; b++)
            {
                var saveOne = $('#S_Aluno'+(b+1)).val();
                if(saveOne == '-1' || saveOne == null)
                {
                    $('#S_Aluno'+(b+1)).html("<option value=-1></option>"+d);
                    OrdenarPorNome('#S_Aluno'+(b+1), '#S_Aluno'+(b+1)+' option');
                    $('#S_Aluno'+(b+1)).val('-1');
                } else {
                    OrdenarPorNome('#S_Aluno'+(b+1), '#S_Aluno'+(b+1)+' option');
                    $('#S_Aluno'+(b+1)).val(saveOne);
                }
            }
        }
    });

    /*for(var a = 0; a < Limite; a++)
	{    	
		var Encontrado = false;
		if($('#S_AnoEstudo').val() == dataAlunoVariavel[a].anoEstudo.idanoEstudo && 
			$('#S_Periodo').val() == dataAlunoVariavel[a].periodo.idperiodo && 
			dataAlunoVariavel[a].grupo == null)
		{	
			HtmlContent += '<option value="'+dataAlunoVariavel[a].idalunoVariavel+'">'+dataAlunoVariavel[a].aluno.nome+' | '+dataAlunoVariavel[a].anoEstudo.ano+'°</option>';
		}        	
	}
	
	Alimenta as combos com os valores*/
	/*for (var e = 0; e < elementos.length; e++) {				
		if($("#"+elementos[e].id).val() == null){			
			$("#"+elementos[e].id).html(HtmlContent);				
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
    }*/

    $('#btAdd').css("display","block");
	$(".checkLimpar").attr("checked",false);
}

//------------- Fim dos SET's -----------------------


function CriarNovaLinha()
{
	var HTMLNovo = "";

		HTMLNovo +=	'<div id="linha'+($("#marginAlunos .linha").length+1)+'" class="linha">'+
					'<div class="celulaGrande">'+
					'<div class="infoG"><input type="checkbox" id="limpar3" class="checkLimpar" onClick="alimentaCombo(\"S_Aluno'+($("#marginAlunos .linha").length-1)+'\")">Aluno </div>'+
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

				if(!Exists){HTMLNovo += '<option value="'+dataAlunoVariavel[a].idalunoVariavel+'">'+dataAlunoVariavel[a].aluno.nome+'| '+dataAlunoVariavel[a].anoEstudo.ano+'°</option>';}
			}
		}

		HTMLNovo +=		'</select>'+
						'</div>'+
						'</div>'+
						'</div>'+
						'</div>';

		$(HTMLNovo).insertBefore('#container_Inserir .linha:last-child');
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

            if (CgValor != -1)
            {
			 $('.S_Aluno').find('option').filter(':contains("'+CgNome+'")').remove();
			 $(SelecionadoCombo).append('<option value="'+CgValor+'" selected>'+CgNome+'</option>');
            }

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

                if (CgValor != -1)
                {
				    $('.S_Aluno').find('option').filter(':contains("'+CgNome+'")').remove();
				    $(SelecionadoCombo).append('<option value="'+CgValor+'" selected>'+CgNome+'</option>');
                }
                
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