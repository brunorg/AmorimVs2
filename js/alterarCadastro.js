var StoredCamposini = [];
var StoredCamposfim = [];
							
//variavel, vem true se tiver dados variaveis e false se não tiver
function editarProfessor(idProfessor,variavel){
	
	if (variavel == false){
		var dataProfessorFV = getData('ProfessorFuncionarioVariavel/Professor', idProfessor);

		if (dataProfessorFV[0] != undefined){
			idProfessor = dataProfessorFV[0].idprofessorFuncionarioVariavel;
		}else{
			valores = 'id=0&action=create&professorFuncionario='+idProfessor+'&fotoProfessorFuncionario=&descontoQuinquenio=0&formacao=&cargo=&quinquenio=0&qpe=&letra=A&periodo=8&anoLetivo=55&observacao=';
			idProfessor = setCreateData('ProfessorFuncionarioVariavel/', valores);
		}
	}
		
		var dataProfessores = getData("ProfessorFuncionarioVariavel", idProfessor);
		var dataUsuario = getData("Usuario/professor", dataProfessores.professorFuncionario.idprofessorFuncionario);

		var valores = "professorFuncionario=" + dataProfessores.professorFuncionario.idprofessorFuncionario+ "&anoLetivo=" + dataProfessores.anoLetivo.idanoLetivo;
		var correcao = false;
		if(dataProfessores.periodo == null)
		{
			valores += "&periodo=-1";
			correcao = true;
		}
		if(dataProfessores.descontoQuinquenio == null)
		{
			valores += "&descontoQuinquenio=0";
			if (!correcao)
			{
				valores+= "&periodo=" + dataProfessores.periodo.idperiodo;
				correcao = true;
			}
		}
		if (correcao)
		{
			setUpdateData("ProfessorFuncionarioVariavel", valores, dataProfessores.idprofessorFuncionarioVariavel);
		}	
		$(".box_margin_barra").load("cadastroProfessor.html", function(){
			$("#frmCadastroProfessorVariavel").css("display", "block");
			$("#cadUsuarioProfessor").css("display", "block");
			$(".opcaoFoto").css("display", "block");
			$("#fotoCad").css("display","block").html("<img id='_foto' src='"+dataProfessores.professorFuncionario.fotoProfessorFuncionario+"' width='150' height='150'/>");
			if (dataUsuario != undefined) {
				$("#idEdtUserProfessor").val(dataUsuario.idusuario);
				$("#actionUserProfessor").val("update");
				$("#professorUser").val(dataProfessores.professorFuncionario.idprofessorFuncionario);
				$("#loginProfessor").attr("value", dataUsuario.login);
				$("#senhaUserProfessor").attr("disabled", "true");
				$("#senhaUserProfessor").val('******');
				$("#emailUsuarioProfessor").attr("value", dataUsuario.email);
				$("#inserirArquivo .arquivo").attr("id", "imagem");
				$("#inserirArquivo .arquivo").attr("name", "imagem");
				for (var i = 0; i < $("#perfilCadastro option").length; i++)
				{
					if($("#perfilCadastro option")[i].value == dataUsuario.perfil.idperfil)
					{
						$("#perfilCadastro option")[i].selected = true;
					}
					else
					{
						$("#perfilCadastro option")[i].selected = false;
					}
				}	
			}else{
				$("#idEdtUserProfessor").val('');
				$("#actionUserProfessor").val("create");
				$("#professorUser").val('');
				$("#loginProfessor").attr('');
				//$("#senhaUserProfessor").attr("disabled", "true");
				$("#emailUsuarioProfessor").attr("value", '');
				$("#perfilCadastro option")[0].selected = true;
				//$("#inserirArquivo .arquivo").attr("id", "imagem");
				//$("#inserirArquivo .arquivo").attr("name", "imagem");
//				for (var i = 0; i < $("#perfilCadastro option").length; i++)
//				{
//					if($("#perfilCadastro option")[i].value == dataUsuario.perfil.idperfil)
//					{
//						$("#perfilCadastro option")[i].selected = true;
//					}
//					else
//					{
//						$("#perfilCadastro option")[i].selected = false;
//					}
//				}	
				
			}
		});
		$("#box_cadastro").css("background","#F1F1EC");
		localStorage.setItem("professorEdt",idProfessor);
	

}





function listadados(){	

	var a;		
	var alunoEdt = localStorage.getItem("alunoEdt");
	$("#editarId").val(alunoEdt);
	
	var idAluno = $("#idAluno").val();		
	
	if((alunoEdt != null && alunoEdt!="")){		
		/*resgata os dados do aluno selecionado*/
		var dataAlunos = getData("Alunos", alunoEdt);	
			
		$("#action").val("update");	
		$("#actionUser").val("update");
		$("#actionUserVar").val("update");
		$("#aluno").val(alunoEdt);	
		$("#idAluno").val(alunoEdt);		
		$("#alunoUser").val(alunoEdt);		
		
		/*Aqui será carregado todos os dados do aluno no formulário para que possa ser editado*/	
		/*dados pessoais*/
		$("#nome").val(dataAlunos.nome);
		$("#email").val(dataAlunos.email);
		$("#sexo").val(dataAlunos.sexo);					
		$("#naturalPais").val(dataAlunos.naturalPais);		
		$("#rg").val(dataAlunos.rg);
		$("#cpf").val(dataAlunos.cpf);		
		$("#observacao").val(dataAlunos.observacao);		
		$("#celular").val(dataAlunos.celular);
		$("#endereco").val(dataAlunos.endereco);		
		$("#numero").val(dataAlunos.numero);
		$("#bairro").val(dataAlunos.bairro);		
		$("#complemento").val(dataAlunos.complemento);		
		$("#cep").val(dataAlunos.cep.substring(0, 5) + "-" + dataAlunos.cep.substring(5, 9));		
		$("#dataMatricula").val(dataAlunos.dataMatricula);	
		$("#dataNascimento").val(dataAlunos.dataNascimento);
		$("#endereco").val(dataAlunos.endereco);
		$("#numero").val(dataAlunos.numero);
		$("#numeroEol").val(dataAlunos.numeroEol);
		$("#numeroRA").val(dataAlunos.numeroRA);		
		var opcaoEtinia = $("#etnia");
		opcaoEtinia.val(opcaoEtinia.find('option[value="'+dataAlunos.etnia+'"]').val());		
		
		if(dataAlunos.naturalCidade != ""){
			$("#naturalCidade").append('<option value="'+dataAlunos.naturalCidade+'">'+dataAlunos.naturalCidade+'</option>');
		}		
		var opcaoNaturalEstado = $("#naturalEstado");
		opcaoNaturalEstado.val(opcaoNaturalEstado.find('option[value="'+dataAlunos.naturalEstado+'"]').val());	
				
		var opcaoUf = $("#uf");
		opcaoUf.val(opcaoUf.find('option[value="'+dataAlunos.uf+'"]').val());
		
		if(dataAlunos.cidade != ""){
			$("#cidade").html('<option value="'+dataAlunos.cidade+'">'+dataAlunos.cidade+'</option>');
		}		
				
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
				
		var opcaoUfMae = $("#ufMae");
		opcaoUfMae.val(opcaoUfMae.find('option[value="'+dataAlunos.ufMae+'"]').val());
		
		if(dataAlunos.cidadeMae != null){
			$("#cidadeMae").html('<option value="'+dataAlunos.cidadeMae+'">'+dataAlunos.cidadeMae+'</option>');
		}
		if(dataAlunos.cidadePai != null){
			$("#cidadePai").html('<option value="'+dataAlunos.cidadePai+'">'+dataAlunos.cidadePai+'</option>');
		}
		if(dataAlunos.cidadeResponsavel != null){
			$("#cidadeResponsavel").html('<option value="'+dataAlunos.cidadeResponsavel+'">'+dataAlunos.cidadeResponsavel+'</option>');
		}
		
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
		var opcaoUfPai = $("#ufPai");
		opcaoUfPai.val(opcaoUfPai.find('option[value="'+dataAlunos.ufPai+'"]').val());
				
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
		$("#eresponsavelLegalResponsavel").val(dataAlunos.eresponsavelLegalResponsavel);			
		
		$("#fotoCad").css("display","block").html("<img id='_foto' src='"+dataAlunos.fotoAluno+"' width='150' height='150'/>");
		
		window.setTimeout(function(){
			if(dataAlunos.enecessidadeEspecial=="S"){
				$('.infoValueMm:contains("Sim")').filter(':first').next().trigger('click');
			}else if(dataAlunos.enecessidadeEspecial=="N"){
				$('.infoValueMm:contains("Não")').filter(':first').next().trigger('click'); 
			}			
			
			if(dataAlunos.eresponsavelLegalMae=="S"){
				 $('.resp:contains("Mãe")').filter(':first').next().trigger('click');
			}else if(dataAlunos.eresponsavelLegalPai=="S"){
				 $('.resp:contains("Pai")').filter(':first').next().trigger('click');
			}else if(dataAlunos.eresponsavelLegalResponsavel=="S"){
				 $('.resp:contains("Outro")').filter(':first').next().trigger('click');
			}
			
			if((dataAlunos.eresponsavelLegalMae==null || dataAlunos.eresponsavelLegalMae=="N") && (dataAlunos.eresponsavelLegalPai==null || dataAlunos.eresponsavelLegalPai=="N") && (dataAlunos.eresponsavelLegalResponsavel==null || dataAlunos.eresponsavelLegalResponsavel=="N")){
				var dataAniv = dataAlunos.dataNascimento.split("-");		
				var idadeAluno = idade(dataAniv[0],dataAniv[1],dataAniv[2]);
				if(idadeAluno>=18){
					$('.resp:contains("Aluno maior de idade")').filter(':first').next().trigger('click');
				}	
			}
			
		},10);		
		/*fim preenchimento formulário aluno*/	
	}	
}