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
        //AA('RetornoCheckedPai',false);
        //AA('RetornoCheckedMae',false);
        //AA('RetornoCheckedOutro',false);
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

function validaForm(formulario){
	switch (formulario){
		case "Aluno": {
			/*Valida Formulário Cadatro Aluno*/
			if($('#dataMatricula').val() == ""){
				mensagem("Por favor, preencha o campo data da Matricula!","OK","bt_ok","erro");
				$('#dataMatricula').focus();
				return false
			}
			if($('#nome').val() == ""){
				mensagem("Por favor, preencha o campo nome!","OK","bt_ok","erro");
				$('#nome').focus();
				return false
			}
			if($('#etnia').val() == ""){
				mensagem("Por favor, preencha o campo etnia!","OK","bt_ok","erro");
				$('#etnia').focus();
				return false
			}
			if($('#dataNascimento').val() == ""){
				mensagem("Por favor, preencha o campo data de nascimento!","OK","bt_ok","erro");
				$('#CEP').focus();
				return false
			}
			if($('#nomeMae').val() == ""){
				mensagem("Por favor, preencha o campo nome da mãe!","OK","bt_ok","erro");
				$('#nomeMae').focus();
				return false
			}
			if($('#nomePai').val() == ""){
				mensagem("Por favor, preencha o campo nome do pai!","OK","bt_ok","erro");
				$('#nomePai').focus();
				return false
			}			
			if($('#endereco').val() == ""){
				mensagem("Por favor, preencha o campo endereco!","OK","bt_ok","erro");
				$('#endereco').focus();
				return false
			}			
			if($('#cep').val() == ""){
				mensagem("Por favor, preencha o campo CEP!","OK","bt_ok","erro");
				$('#cep').focus();
				return false
			}
			if($('#bairro').val() == ""){
				mensagem("Por favor, preencha o campo bairro!","OK","bt_ok","erro");
				$('#bairro').focus();
				return false
			}
			if($('#uf').val() == ""){
				mensagem("Por favor, preencha o campo estado!","OK","bt_ok","erro");
				$('#uf').focus();
				return false
			}
			if($('#cidade').val() == ""){
				mensagem("Por favor, preencha o campo cidade!","OK","bt_ok","erro");
				$('#cidade').focus();
				return false
			}							
			/*Fim formulario cadastro aluno*/
		}	
		break;
		
		case "Usuario":{
			/*Valida Fomulario Cadastro Aluno Variavel*/
			if($('#login').val() == ""){
				mensagem("Por favor, preencha o campo login!","OK","bt_ok","erro");
				$('#login').focus();
				return false
			}
			if($('#emailUsuario').val() == ""){
				mensagem("Por favor, preencha o campo email!","OK","bt_ok","erro");
				$('#emailUsuario').focus();
				return false
			}
			/*Fim Fomulario Cadastro Aluno Variavel*/
		}
		break;
		
		case "AlunoVariavel":{
			/*Valida Fomulario Cadastro Aluno Variavel*/
			if($('#inicio').val() == ""){
				mensagem("Por favor, preencha o campo início!","OK","bt_ok","erro");
				$('#inicio').focus();
				return false
			}
			if($('#periodoCadAluno').val() == ""){
				mensagem("Por favor, preencha o campo período!","OK","bt_ok","erro");
				$('#periodoCadAluno').focus();
				return false
			}
			if($('#anoLetivoCadAluno').val() == ""){
				mensagem("Por favor, preencha o campo ano letivo!","OK","bt_ok","erro");
				$('#anoLetivoCadAluno').focus();
				return false
			}
			if($('#anoEstudoCadAluno').val() == ""){
				mensagem("Por favor, preencha o campo ano estudo!","OK","bt_ok","erro");
				$('#anoEstudoCadAluno').focus();
				return false
			}			
			/*Fim Fomulario Cadastro Aluno Variavel*/
		}
		break;
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
	var retorno = validaForm("Aluno");
	if(typeof retorno == 'undefined'){				
		var dataMatricula = $('#dataMatricula').val().substring(0, 4)+"-"+$('#dataMatricula').val().substring(5, 7)+"-"+$('#dataMatricula').val().substring(8, 10);
		var dataNascimento = $('#dataNascimento').val().substring(0, 4)+"-"+$('#dataNascimento').val().substring(5, 7)+"-"+$('#dataNascimento').val().substring(8, 10);
		var enecessidadeEspecial = $("#L10L .clicado").next().attr("value");
		
		if(enecessidadeEspecial=="" || typeof enecessidadeEspecial == 'undefined'){
			enecessidadeEspecial = "N";	
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
		"&eresponsavelLegalMae="+$('#eresponsavelLegalMae').val()+
		"&eresponsavelLegalPai="+$('#eresponsavelLegalPai').val()+
		"&eresponsavelLegalResponsavel="+$('#eresponsavelLegalResponsavel').val()+
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
		
		$.ajax({
			url: path+"Alunos/",
			type: "POST",
			crossDomain: true,
			dataType: 'json',
			data:"action="+action+"&"+valores,			
			success: function(d) {							
				if(action=="create"){
					$("#aluno").val(d);
					$("#frmCadastroAluno input").attr("disabled","true");
					$("#frmCadastroAluno select").attr("disabled","true");
					$("#frmCadastroAluno radio").attr("disabled","true");
					$("#alunoUser").val(d);
					$("#idAluno").val(d);
					$(".opcaoFoto").css("display","block");	
					mensagem("Dados salvos com sucesso! Continue o cadastro!","OK","bt_ok","sucesso");
				}else{
					mensagem("Dados alterados com sucesso!","OK","bt_ok","sucesso");
				}
			},error: function() {
				alert(d);
			}
		});
	}	
	localStorage.setItem("periodo","");	
	localStorage.setItem("anoLetivo","");	
	localStorage.setItem("anoEstudo","");
}

function upFoto(valor){	
	if(valor=='S'){
		$("#cadUsuario").css("display","none");
		$(".blackPainel").css("display","block");
	}else{
		$(".blackPainel").css("display","none");
		$("#cadUsuario").css("display","block");	
	}		
}

function cadastraUser(){
	var retorno = validaForm("Usuario");
	if(typeof retorno == 'undefined'){	
		var valores = "&email="+$('#emailUsuario').val()+
					"&aluno="+$('#alunoUser').val()+
					"&login="+$('#login').val()+
					"&perfil=23&professor=&moderador=";
		
		var action = $("#actionUser").val();
		
		if(action=="create"){
			valores+="&senha="+$('#senhaUser').val();
		}else if(action=="update"){
			valores+= "&id="+$("#idEdtUser").val()+"&senha=";
		} 
				
		$.ajax({
			url: path+"Usuario",
			type: "POST",
			crossDomain: true,
			dataType: 'json',
			data:"action="+action+valores,			
			success: function(d) {
				if(action=="create"){
					$("#cadAlunoVar").css("display","block");
					$("#frmCadastroUsuario input").attr("disabled","true");
					mensagem("Dados salvos com sucesso! Continue o cadastro!","OK","bt_ok","sucesso");	
				}else{
					mensagem("Dados alterados com sucesso!","OK","bt_ok","sucesso");	
				}
			},error: function() {
				//console.log(d);
			}
		});
	}
}
function cadastraAlunoVariavel(){
	var retorno = validaForm("AlunoVariavel");
	if(typeof retorno == 'undefined'){
		var ps = $(".clicado:last").next().attr("value");
		var inicioData = $('#inicio').val().substring(0, 4)+"-"+$('#inicio').val().substring(5, 7)+"-"+$('#inicio').val().substring(8,10);
		var valores = "inicio="+inicioData+
					"&programaSocial="+ps+
					"&aluno="+$('#aluno').val()+
					"&grupo="+$('#grupo').val()+
					"&anoEstudo="+$('#anoEstudoCadAluno').val()+
					"&periodo="+$('#periodoCadAluno').val()+
					"&anoLetivo="+$('#anoLetivoCadAluno').val()+
					"&ativo="+$('#ativoAV').val();							
		var action = $("#actionUserVar").val();
		if(action=="update"){
			valores+= "&id="+$("#idEdtUserVar").val();
		}
			
		$.ajax({
			url: path+"AlunoVariavel/",
			type: "POST",
			crossDomain: true,
			dataType: 'json',
			data:"action="+action+"&"+valores,			
			success: function(d) {
				if(action=="create"){
					mensagem("Dados salvos com sucesso!","OK","bt_ok","sucesso");
				}else{
					mensagem("Dados alterados com sucesso!","OK","bt_ok","sucesso");
				}
			},error: function() {
				//console.log(d);
			}
		});
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
			success: function(d) {
				$(".blackPainel").css("display","none");
				$("#cadUsuario").css("display","block");
				mensagem("Arquivo salvo com sucesso!","OK","bt_ok","sucesso");
				var dataAlunos = getData("Alunos", idAluno);
				$("#fotoCad").css("display","block").html("<img id='_foto' src='"+dataAlunos.fotoAluno+"' width='150' height='150'/>");
			}
		});
	}else{
		mensagem("Este arquivo não é uma imagem!, verifique os campos!","OK","bt_ok","erro");
	}	
}


