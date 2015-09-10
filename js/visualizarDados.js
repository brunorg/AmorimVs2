var StoredCamposini = [];
var StoredCamposfim = [];

/* Pegar Valor GET da URL */
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

function listadados(){
	
	var a;		
	var alunoEdt = localStorage.getItem("alunoEdt");
	var idAluno = $("#idAluno").val();		
	if(alunoEdt != ""){			
		/*resgata os dados do aluno selecionado*/
		var dataAlunos = getData("Alunos", alunoEdt);
		var dataUsuario = getData("Usuario", null);
		
		/*exibe as combos que estavam ocultas*/
		$(".opcaoFoto").css("display","block");
		$("#cadUsuario").css("display","block");	
		$("#cadAlunoVar").css("display","block");		
		$("#action").val("update");	
		$("#actionUser").val("update");
		$("#actionUserVar").val("update");
		$("#aluno").val(alunoEdt);	
		$("#idAluno").val(alunoEdt);		
		
		/*Aqui será carregado todos os dados do aluno no formulário para que possa ser editado*/	
		/*dados pessoais*/
		
		$("#nome").val(dataAlunos.nome);
		$("#nome").val(dataAlunos.nome);
		$("#email").val(dataAlunos.email);
		if (dataAlunos.sexo = 'M') $("#sexo").val('Masculino');					
			else if (dataAlunos.sexo = 'F') $("#sexo").val('Feminino');
				else $('#sexo').val('');
		$("#etnia").val(dataAlunos.etnia);
		$("#naturalPais").val(dataAlunos.naturalPais);
		//alert(dataAlunos.naturalPais);
		$("#rg").val(dataAlunos.rg);
		$("#cpf").val(dataAlunos.cpf);
		$("#observacao").val(dataAlunos.observacao);		
		$("#celular").val(dataAlunos.celular);
		$("#endereco").val(dataAlunos.endereco);		
		$("#numero").val(dataAlunos.numero);
		$("#bairro").val(dataAlunos.bairro);
		$("#complemento").val(dataAlunos.complemento);		
		$("#cep").val(dataAlunos.cep);
		$("#dataMatricula").val(dataAlunos.dataMatricula);
		$("#dataNascimento").val(dataAlunos.dataNascimento);
		$("#endereco").val(dataAlunos.endereco);
		$("#numero").val(dataAlunos.numero);
		$("#numeroEol").val(dataAlunos.numeroEol);
		$("#numeroRA").val(dataAlunos.numeroRA);
		$("#naturalEstado").val(dataAlunos.naturalEstado);
		$("#naturalCidade").val(dataAlunos.naturalCidade);
		$("#uf").val(dataAlunos.uf);
		$("#cidade").val(dataAlunos.cidade);
		if (dataAlunos.ativo == 's') $("#ativo").val('Ativo');
			else $("#ativo").val('Inativo');
		if(dataAlunos.necessidadeEspecial == 'S') $('#necessidades').val('Sim');
			else $('#necessidades').val('Não');
				
		/*Dados Mãe*/
		$("#nomeMae").val(dataAlunos.nomeMae);
		$("#complementoMae").val(dataAlunos.complementoMae);
		$("#email1Mae").val(dataAlunos.email1Mae);
		$("#email2Mae").val(dataAlunos.email2Mae);
		$("#enderecoMae").val(dataAlunos.enderecoMae);	
		$("#numeroMae").val(dataAlunos.numeroMae);	
		$("#telefoneCelularMae").val(dataAlunos.telefoneCelularMae);
		$("#telefoneComercialMae").val(dataAlunos.telefoneComercialMae);
		$("#telefoneResidencialMae").val(dataAlunos.telefoneResidencialMae);
		$("#ufMae").val(dataAlunos.ufMae);
		$("#ufPai").val(dataAlunos.ufPai);
		$("#ufResponsavel").val(dataAlunos.ufResponsavel);
		$("#cidadeMae").val(dataAlunos.cidadeMae);
		$("#cidadePai").val(dataAlunos.cidadePai);
		$("#cidadeResponsavel").val(dataAlunos.cidadeResponsavel);
		$("#cepMae").val(dataAlunos.cepMae);
		$("#cepPai").val(dataAlunos.cepPai);
		
		/*Dados Pai*/
		$("#nomePai").val(dataAlunos.nomePai);				
		$("#complementoPai").val(dataAlunos.complementoPai);	
		$("#email1Pai").val(dataAlunos.email1Pai);
		$("#email2Pai").val(dataAlunos.email2Pai);		
		$("#enderecoPai").val(dataAlunos.enderecoPai);
		$("#numeroPai").val(dataAlunos.numeroPai);
		$("#telefoneCelularPai").val(dataAlunos.telefoneCelularPai);	
		$("#telefoneComercialPai").val(dataAlunos.telefoneComercialPai);	
		$("#telefoneResidencialPai").val(dataAlunos.telefoneResidencialPai);	

		/*Dados Responsável*/				
		$("#complementoResponsavel").val(dataAlunos.complementoResponsavel);			
		$("#email1Responsavel").val(dataAlunos.email1Responsavel);		
		$("#email2Responsavel").val(dataAlunos.email2Responsavel);			
		$("#enderecoResponsavel").val(dataAlunos.enderecoResponsavel);			
		$("#nomeResponsavel").val(dataAlunos.nomeResponsavel);		
		$("#numeroResponsavel").val(dataAlunos.numeroResponsavel);			
		$("#responsaveisResponsavel").val(dataAlunos.responsaveisResponsavel);				
		$("#telefoneCelularResponsavel").val(dataAlunos.telefoneCelularResponsavel);				
		$("#telefoneComercialResponsavel").val(dataAlunos.telefoneComercialResponsavel);
		$("#parentescoResponsavel").val(dataAlunos.parentescoResponsavel);				
		$("#eresponsavelLegalMae").val(dataAlunos.eresponsavelLegalMae);
		$("#eresponsavelLegalPai").val(dataAlunos.eresponsavelLegalPai);
				
		window.setTimeout(function(){
			
			if(dataAlunos.eresponsavelLegalMae=="S"){

				 $('#DadosMaeVisualizacao').css('display','block');
				 $("#responsavelTexto").val('Mãe');

				 if ((dataAlunos.enderecoMae == null) || (dataAlunos.enderecoMae == '')){
					 $('#enderecoIgualMae').val('Sim');
				 }else{
					 $('#enderecoIgualMae').val('Não');
					 $('#boxMaeEnd').css('display','block');
				 }

			}else if(dataAlunos.eresponsavelLegalPai=="S"){
				 $("#responsavelTexto").val('Pai');
				 //$('.resp:contains("Pai")').filter(':first').next().trigger('click');
				 $('#DadosPaiVisualizacao').css('display','block');
				 
				 if ((dataAlunos.enderecoPai == null)||(dataAlunos.enderecoPai == '')){
					 $('#enderecoIgualPai').val('Sim');
				 }else{
					 $('#enderecoIgualPai').val('Não');
					 $('#boxPaiEnd').css('display','block');
				 }
				 
			}else if(dataAlunos.eresponsavelLegalResponsavel=="S"){
				//alert('s');
				 $("#responsavelTexto").val('Outro');
				 //$('.resp:contains("Outro")').filter(':first').next().trigger('click');
				 $('#DadosOutroVisualizacao').css('display','block');
				 
				 if ((dataAlunos.enderecoResponsavel == null)||(dataAlunos.enderecoResponsavel == '')){
					 $('#enderecoIgualR').val('Sim');
				 }else{
					 $('#enderecoIgualR').val('Não');
					 $('#boxRespEnd').css('display','block');
				 }
			}
			
			if((dataAlunos.eresponsavelLegalMae==null || dataAlunos.eresponsavelLegalMae=="N") && (dataAlunos.eresponsavelLegalPai==null || dataAlunos.eresponsavelLegalPai=="N") && (dataAlunos.eresponsavelLegalResponsavel==null || dataAlunos.eresponsavelLegalResponsavel=="N")){
				var dataAniv = dataAlunos.dataNascimento.split("-");		
				var idadeAluno = idade(dataAniv[0],dataAniv[1],dataAniv[2]);
				if(idadeAluno>=18){
					$('.resp:contains("Aluno maior de idade")').filter(':first').next().trigger('click');
					$("#responsavelTexto").val('Aluno maior de idade');
				}	
			}
			
		},10);		
		

		
		/*Aqui será carregado todo os dados do Aluno Variavel no formulário para que possa ser editado*/
		var dataAlunoVariavel = getData("AlunoVariavel", null);			
	
for(var r=0;r<dataAlunoVariavel.length; r++){
	
	if((dataAlunoVariavel[r].aluno != null)&&(alunoEdt == dataAlunoVariavel[r].aluno.idAluno)){
		$('#periodoCadAluno').val(dataAlunoVariavel[r].periodo.periodo);
		data = dataAlunoVariavel[r].anoLetivo.ano.split('-');
		$("#anoLetivoCadAluno").val(data[0]);
		$('#anoEstudoCadAluno').val(dataAlunoVariavel[r].anoEstudo.ano+'º');
		$("#inicio").val(dataAlunoVariavel[r].inicio);
		if (dataAlunoVariavel[r].ativo == 1){
			$("#ativoAV").val('Ativo');
		}else $("#ativoAV").val('Inativo');
	
		if((dataAlunoVariavel[r].programaSocial=="S")||((dataAlunoVariavel[r].programaSocial=="s"))){
			$('#programaSocial').val('Sim');
		}else{
			$('#programaSocial').val('Não');
		}

		}		
		}
	}
}