// JavaScript Document//Murano Design

//------------------------------------------------------------------------------------------------------------------------

//Carregas as variaveis padrao

    var Limite;
    var HtmlContent;
    var contador;

//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD

    var dataPeriodo     =   getData("Periodo", null);
    var dataAnoEstudo   =   getData("AnoEstudo", null);
    var dataAnoLetivo   =   getData("AnoLetivo", null);

//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery

    $(document).ready(function () {
		/*Efeito do checkbox com imagem*/
    	$("div.inputImg").click(function(){
			var objeto = this;
			window.setTimeout(function(){
				if($(objeto).hasClass("clicado") == false)
				{
					$(objeto).css("background-position","-37px 0px").addClass("clicado");
				}
				else{ 
					$(objeto).css("background-position","0px 0px").removeClass("clicado"); 
				}
			},10);	
			
			$(this).parent().find('input[type=radio]').removeAttr('checked', false);
			
			$(this).next('input[type=radio]').attr('checked', true);
			
    	});
        
		/* Ano Letivo */
        HtmlContent = ""; 
        for(var a=0;a<dataAnoLetivo.length; a++)
        {
            HtmlContent += "<option value='"+dataAnoLetivo[a].idanoLetivo+"'>"+((dataAnoLetivo[a].ano).substring(0, 4))+"</option>";
        }
        $('#anoLetivoCadAluno').html("<option></option>"+HtmlContent);

        /* Ano estudo*/
        HtmlContent = ""; 
        for(var b=0;b<dataAnoEstudo.length; b++)
        {
            HtmlContent += "<option value='"+dataAnoEstudo[b].idanoEstudo+"'>"+(dataAnoEstudo[b].ano)+"º</option>";
        }
        $('#anoEstudoCadAluno').html("<option></option>"+HtmlContent);

        /*Turno [Manhã/Tarde]*/
        HtmlContent = ""; 
        for(var b=0;b<dataPeriodo.length; b++)
        {
            HtmlContent += "<option value='"+dataPeriodo[b].idperiodo+"'>"+(dataPeriodo[b].periodo)+"</option>";
        }
        $('#periodoCadAluno').html("<option></option>"+HtmlContent);
		
		$('.close_upload_producao').click(function(){
			$(".blackPainel").css("display","none");	
		});

		GerarUpload($("#foto"), $("#fotoAluno"), $("#fotoAluno"));		
		
    });
//------------------------------------------------------------------------------------------------------------------------

function AA(Palavra, Ativo)
{
    $('#'+Palavra).css("display",(Ativo == true ? "block":"none"));
}


function reset(Numero)
{
    if(Numero == 1)
    {

        AA('DadosMaeVisualizacao',false);
        AA('DadosPaiVisualizacao',false);
        AA('DadosOutroVisualizacao',false);
        $('#linha15 .inputImg').removeClass( "clicado" );
        $('#linha15 .inputImg').css("background-position","0px 0px");
        reset(2);
    } else if(Numero == 2)
    {
        $('#linha27 .inputImg').removeClass( "clicado" );
        $('#linha27 .inputImg').css("background-position","0px 0px");
        $('#linha23 .inputImg').removeClass( "clicado" );
        $('#linha23 .inputImg').css("background-position","0px 0px");
        $('#linha19 .inputImg').removeClass( "clicado" );
        $('#linha19 .inputImg').css("background-position","0px 0px");
    } else if(Numero == 3)
    {
        $('#linha8 #L10R .inputImg').removeClass( "clicado" );
        $('#linha8 #L10R .inputImg').css("background-position","0px 0px");
    } else if(Numero == 4)
    {
        $('#linha8 #L10L .inputImg').removeClass( "clicado" );
        $('#linha8 #L10L .inputImg').css("background-position","0px 0px");
    } else if(Numero == 5)
    {
        $('#linha34 #PSL .inputImg').removeClass( "clicado" );
        $('#linha34 #PSL .inputImg').css("background-position","0px 0px");
    }else if(Numero == 6)
    {
		$('#linha8 #UpFoto .inputImg').removeClass( "clicado" );
        $('#linha8 #UpFoto .inputImg').css("background-position","0px 0px");
	}
}

function dateAniversario(){			
	var dataNascimento = $('#dataNascimento').val().substring(8, 10)+"-"+$('#dataNascimento').val().substring(5, 7)+"-"+$('#dataNascimento').val().substring(0, 4);
	if(dataNascimento!=""){
		//console.log($('#dataNascimento').val().substring(0, 4), $('#dataNascimento').val().substring(5, 7), $('#dataNascimento').val().substring(8, 10));
		var idadeAluno = idade($('#dataNascimento').val().substring(0, 4), $('#dataNascimento').val().substring(5, 7), $('#dataNascimento').val().substring(8, 10));
		if(idadeAluno>=18){
			window.setTimeout(function(){
				$('.resp:contains("Aluno maior de idade")').filter(':first').next().trigger('click');
			},10);
		}else{
			window.setTimeout(function(){
				$('.resp:contains("Aluno maior de idade")').filter(':first').next().css("pointer-events","none");
			},10);
		}
	}
}


function cadastraEditaAluno(){
    var retorno = validaForm();		
	if(typeof retorno == 'undefined'){				
		var dataMatricula = $('#dataMatricula').val().substring(0, 4)+"-"+$('#dataMatricula').val().substring(5, 7)+"-"+$('#dataMatricula').val().substring(8, 10);
		var dataNascimento = $('#dataNascimento').val().substring(0, 4)+"-"+$('#dataNascimento').val().substring(5, 7)+"-"+$('#dataNascimento').val().substring(8, 10);
		var enecessidadeEspecial = $("#L10L .clicado").next().attr("value");
		
		if(enecessidadeEspecial=="" || typeof enecessidadeEspecial == 'undefined'){
			enecessidadeEspecial = "N";	
		}
		
		var responsavelM ="N",responsavelP="N",responsavelR="N";
		var responsavel = $('#linha15 .clicado').next().attr("name");
		
		if(responsavel == "eresponsavelLegalMae"){
			responsavelM = "S";
		}else if(responsavel == "eresponsavelLegalPai"){
			responsavelP = "S";
		}else if(responsavel == "eresponsavelLegalResponsavel"){
			responsavelR = "S";
		}
		
		/*dados pessoais*/
		var valores = "cidadeMae="+$('#cidadeMae').val()+
		"&cidadePai="+$('#cidadePai').val()+
		"&cidadeResponsavel="+$('#cidadeResponsavel').val()+
		"&complementoMae="+$('#complementoMae').val()+
		"&complementoPai="+$('#complementoPai').val()+
		"&complementoResponsavel="+$('#complementoResponsavel').val()+
		"&email2Mae="+$('#email2Mae').val()+
		"&email2Pai="+$('#email2Pai').val()+
		"&email2Responsavel="+$('#email2Responsavel').val()+
		"&numeroMae="+$('#numeroMae').val()+
		"&numeroPai="+$('#numeroPai').val()+
		"&numeroResponsavel="+$('#numeroResponsavel').val()+
		"&pais="+
		"&responsaveisResponsavel="+$('#responsaveisResponsavel').val()+
		"&enderecoMae="+$('#enderecoMae').val()+
		"&enderecoPai="+$('#enderecoPai').val()+
		"&enderecoResponsavel="+$('#enderecoResponsavel').val()+
		"&uf="+$('#uf').val()+
		"&ufMae="+$('#ufMae').val()+
		"&ufPai="+$('#ufPai').val()+
		"&ufResponsavel="+$('#ufResponsavel').val()+
		"&fotoAluno=1"+
		"&ativo="+$('#ativo').val()+
		"&parentescoResponsavel="+$('#parentescoResponsavel').val()+
		"&enecessidadeEspecial="+enecessidadeEspecial+
		"&eresponsavelLegalMae="+responsavelM+
		"&eresponsavelLegalPai="+responsavelP+
		"&eresponsavelLegalResponsavel="+responsavelR+
		"&cepMae="+$('#cepMae').val()+
		"&cepPai="+$('#cepPai').val()+
		"&cepResponsavel="+$('#cepResponsavel').val()+
		"&bairro="+$('#bairro').val()+
		"&cep="+$('#cep').val().replace(/\.|\-/g, '')+
		
		"&dataMatricula="+dataMatricula+
		"&dataNascimento="+dataNascimento+
		
		"&email1Mae="+$('#email1Mae').val()+
		"&email1Pai="+$('#email1Pai').val()+
		"&email1Responsavel="+$('#email1Responsavel').val()+
		"&complemento="+$('#complemento').val()+
		"&email="+$('#email').val()+
		"&cidade="+$('#cidade').val()+
		"&endereco="+$('#endereco').val()+
		"&etnia="+$('#etnia').val()+
		"&naturalCidade="+$('#naturalCidade').val()+
		"&naturalEstado="+$('#naturalEstado').val()+
		"&naturalPais="+$('#naturalPais').val()+
		"&nome="+$('#nome').val()+
		"&nomeMae="+$('#nomeMae').val()+
		"&nomePai="+$('#nomePai').val()+
		"&nomeResponsavel="+$('#nomeResponsavel').val()+
		"&numero="+$('#numero').val()+
		"&rg="+$("#rg").val().replace(/\D/g,"")+
		"&telefoneCelularResponsavel="+$('#telefoneCelularResponsavel').val()+
		"&telefoneComercialResponsavel="+$('#telefoneComercialResponsavel').val()+
		"&telefoneResidencialResponsavel="+$('#telefoneResidencialResponsavel').val()+
		"&telefoneCelularMae="+$('#telefoneCelularMae').val()+
		"&telefoneComercialMae="+$('#telefoneComercialMae').val()+
		"&telefoneResidencialMae="+$('#telefoneResidencialMae').val()+
		"&telefoneCelularPai="+$('#telefoneCelularPai').val()+
		"&telefoneResidencialPai="+$('#telefoneResidencialPai').val()+
		"&telefoneComercialPai="+$('#telefoneComercialPai').val()+
		"&necessidadeEspecial="+
		"&sexo="+$('#sexo').val()+
		"&numeroEol="+$('#numeroEol').val()+
		"&numeroRA="+$('#numeroRA').val()+
		"&celular="+$('#celular').val().replace(/\D/g,"")+
		"&cpf="+$("#cpf").val().replace(/\D/g,"")+
		"&observacao="+$('#observacao').val();

		var idEditar = $("#editarId").val();
		var action = $("#action").val();		
		
		if(action=="update"){
			valores+= "&id="+idEditar;
		}	
        
		if ($('#email').val() == "" || $('#email').val() == "-" || $('#email').val() == "não informado" ||
            $('#cidade').val() == "" || ($('#cidade').val() == "-") || $('#cidade').val() == "não informado" ||
            $('#endereco').val() == "" || ($('#endereco').val() == "-") || $('#endereco').val() == "não informado" ||
            $('#nomeMae').val() == "" || ($('#nomeMae').val() == "-") || $('#nomeMae').val() == "não informado" ||
            $('#nomePai').val() == "" || ($('#nomePai').val() == "-") || $('#nomePai').val() == "não informado" ||
            $('#numero').val() == "" || ($('#numero').val() == "-") || $('#numero').val() == "não informado" ||
            $('#celular').val() == "" || ($('#celular').val() == "-") || $('#celular').val() == "não informado" ||
            $('#bairro').val() == "" || ($('#bairro').val() == "-") || $('#bairro').val() == "não informado") {
			
			mensagem("Os campos a seguir são obrigatórios, favor preenche-los! \n Email, Cidade, Endereço, Nome Da Mãe, Nome do Pai, Número da sua casa e Celular", "OK", "bt_ok", "erro");

			$('.boxGlobal').css('display', 'none');
			    
		} else {
		    $.ajax({
		        url: path + "Usuario/CamposObrigatorios/" + usuarioId,
		        type: "GET",
		        crossDomain: true,
		        dataType: 'json',
		        success: function (d) {
		            console.log('ok');
		        }
		    });			
		}
		
		setTimeout(function(){
			$.ajax({
				url: path + "Alunos/",
				type: "POST",
				crossDomain: true,
				dataType: 'json',
				data: "action=" + action + "&" + valores,
				beforeSend: function () {
					loading("inicial");
				},
				success: function (d) {
					if (action == "create") {
						$("#aluno").val(d);
						$("#frmCadastroAluno input").attr("disabled", "true");
						$("#frmCadastroAluno select").attr("disabled", "true");
						$("#frmCadastroAluno radio").attr("disabled", "true");
						$("#alunoUser").val(d);
						$("#idAluno").val(d);
						$(".opcaoFoto").css("display", "block");
						mensagem("Dados salvos com sucesso! Continue o cadastro!", "OK", "bt_ok", "sucesso");
					} else {
						mensagem("Dados alterados com sucesso!", "OK", "bt_ok", "sucesso");
					}
				}, complete: function () {
					loading("final");
				}
			}); 
		},5000);		
		  
	}	
	
	localStorage.setItem("periodo","");	
	localStorage.setItem("anoLetivo","");	
	localStorage.setItem("anoEstudo","");
}

function upFoto(valor){	
	if(valor=='S'){
		$("#cadAlunoVar").css("display","none");
		$(".blackPainel").css("display","block");
	}else{
		$(".blackPainel").css("display","none");
		$("#cadAlunoVar").css("display","block");	
	}		
}

function validaForm () {
    
    var d = new Date();
            
    if ($("#dataMatricula").val() == "")
    {
        mensagem("Por favor, preencha o campo Matricula!","OK","bt_ok","erro");
        $('#dataMatricula').focus();
        return false;
    }

    if (Date.UTC($("#dataMatricula").val().substring(0,4), $("#dataMatricula").val().substring(5,7), $("#dataMatricula").val().substring(8,10)) > Date.UTC(d.getFullYear(), d.getMonth() + 1, d.getDate()))
    {
        mensagem("Data de matricula não pode ser posterior à data atual!","OK","bt_ok","erro");
        $('#dataNascimento').focus();
        return false;
    }

    if ($("#nome").val() == "")
    {
        mensagem("Por favor, preencha o campo Nome!","OK","bt_ok","erro");
        $('#nome').focus();
        return false;
    }

    if ($("#etnia").val() == "")
    {
        mensagem("Por favor, preencha o campo Etnia!","OK","bt_ok","erro");
        $('#etnia').focus();
        return false;
    }

    if ($("#dataNascimento").val() == "")
    {
        mensagem("Por favor, preencha o campo Nascimento!","OK","bt_ok","erro");
        $('#dataNascimento').focus();
        return false;
    }

    if (Date.UTC($("#dataNascimento").val().substring(0,4), $("#dataNascimento").val().substring(5,7), $("#dataNascimento").val().substring(8,10)) > Date.UTC(d.getFullYear(), d.getMonth() + 1, d.getDate()))
    {
        mensagem("Data de nascimento não pode ser posterior à data atual!","OK","bt_ok","erro");
        $('#dataNascimento').focus();
        return false;
    }

    if (Date.UTC($("#dataNascimento").val().substring(0,4), $("#dataNascimento").val().substring(5,7), $("#dataNascimento").val().substring(8,10)) > Date.UTC($("#dataMatricula").val().substring(0,4), $("#dataMatricula").val().substring(5,7), $("#dataMatricula").val().substring(8,10)))
    {
        mensagem("Data de nascimento não pode ser posterior à data de matrícula!","OK","bt_ok","erro");
        $('#dataNascimento').focus();
        return false;
    }
    if ($("#nomeMae").val() == "")
    {
        mensagem("Por favor, preencha o campo Nome da Mãe!","OK","bt_ok","erro");
        $('#nomeMae').focus();
        return false;
    }

    if ($("#nomePai").val() == "")
    {
        mensagem("Por favor, preencha o campo Nome do Pai!","OK","bt_ok","erro");
        $('#nomePai').focus();
        return false;
    }

    if ($("#endereco").val() == "")
    {
        mensagem("Por favor, preencha o campo Endereço!","OK","bt_ok","erro");
        $('#endereco').focus();
        return false;
    }

    if ($("#numero").val() == "")
    {
        mensagem("Por favor, preencha o campo Número!","OK","bt_ok","erro");
        $('#numero').focus();
        return false;
    }

    if ($("#bairro").val() == "")
    {
        mensagem("Por favor, preencha o campo Bairro!","OK","bt_ok","erro");
        $('#bairro').focus();
        return false;
    }

    if ($("#cep").val() == "")
    {
        mensagem("Por favor, preencha o campo CEP!","OK","bt_ok","erro");
        $('#numero').focus();
        return false;
    }

    if ($("#uf").val() == "")
    {
        mensagem("Por favor, preencha o campo Estado!","OK","bt_ok","erro");
        $('#uf').focus();
        return false;
    }

    if ($("#cidade").val() == "")
    {
        mensagem("Por favor, preencha o campo Cidade!","OK","bt_ok","erro");
        $('#cidade').focus();
        return false;
    }
}

function salvarFotoAluno(){
	var idAluno = $("#idAluno").val();
	var tipoArquivo = $("#fotoAluno").val();
		
	var extensao = (tipoArquivo.substring(tipoArquivo.lastIndexOf("."))).toLowerCase(); 
	var tipo = extensao.split('.');			
	
	if((tipo[1]=='jpg')||(tipo[1]=='png')||(tipo[1]=='jpeg')){
		var formData = new FormData($("#inserirArquivo")[0]);
		$.ajax({
			url: path+"Alunos/upload/aluno/"+idAluno,
			type: "POST",
			mimeType:"multipart/form-data",
			contentType: false,
			cache: false,
			processData:false,
			data: formData,
			beforeSend: function(){
				$(".blackPainel").css("display","none");
				loading("inicial");
			},
			success: function(d) {
				$("#cadAlunoVar").css("display","block");
				mensagem("Arquivo salvo com sucesso!","OK","bt_ok","sucesso");
				var dataAlunos = getData("Alunos", idAluno);
				$("#fotoCad").css("display","block").html("<img id='_foto' src='"+dataAlunos.fotoAluno+"' width='150' height='150'/>");
			},complete: function() {
				loading("final");
			}
		});
	}else{
		mensagem("Este arquivo não é uma imagem!, verifique os campos!","OK","bt_ok","erro");
	}	
}