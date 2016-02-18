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
	var ultimo_id;

//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD

	var dataTipoEvento		= getData("TipoEvento", null);
	var dataAnoLetivo		= getData("AnoLetivo", null);
	var dataCalendario  	= getData("Calendario/visivel", null);
	
//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery

$(document).ready(function(){
	
	$('#hora').mask("99:99");
	
	/*alimenta combo tipos de evento*/
	HtmlContentT = ""; 
    for(var a=0;a<dataTipoEvento.length; a++)
    {
        HtmlContentT += "<option value='"+dataTipoEvento[a].idtipoEvento+"'>"+(dataTipoEvento[a].tipoEvento)+"</option>";
    }
    $('#tipo_evento').html("<option value='-1'></option>"+HtmlContentT);
	
	$('.close_upload_producao').click(function(){
		$(".blackPainel").css("display","none");	
	});
	
	/*Cadastra eventos*/
	$("#btnSalvarEvento").click(function(){
		var cadastroNovo;
		
		var feriado = $("#L10L .clicado").next().attr("value");
		if(feriado == 1){
			aula =0;
		}else{
			var aula = $("#L10A .clicado").next().attr("value");
		}
		
		/*Verifica se todos os campos obrigatórios foram preenchidos*/
		var retorno = validaForm();
		if(typeof retorno == 'undefined'){	
					
			var tipo_evento = $("#tipo_evento").val();
			var evento = $("#titulo").val();
			var descricao = $("#descricao").val();
			var dataInicio = $("#dataInicio").val();
			var dataFinal = $("#dataFinal").val();
			var hora = $("#hora").val();
			
			var cadOk = false;
			
			var feriado = $("#L10L .clicado").next().attr("value");
			if(feriado == 1){
				aula =0;
			}else{
				var aula = $("#L10A .clicado").next().attr("value");
			}
			
			/*verifica se a dataInicio é maior que dataFinal*/
			if(dataInicio!="" && dataFinal!=""){
				var novaDataInicio = parseInt(dataInicio.split("-")[2].toString() + dataInicio.split("-")[1].toString() + dataInicio.split("-")[0].toString());
				var novaDataFinal = parseInt(dataFinal.split("-")[2].toString() + dataFinal.split("-")[1].toString() + dataFinal.split("-")[0].toString());
				if(novaDataInicio > novaDataFinal){
					mensagem("Data término não pode ser menor que a data início!","OK","bt_ok","erro");
				}else{
					cadastroNovo = criarEvento(tipo_evento,descricao,dataInicio,dataFinal,evento,feriado,aula,hora);
				}
			}else{
				cadastroNovo = criarEvento(tipo_evento,descricao,dataInicio,dataFinal,evento,feriado,aula,hora);
			}		

			
			if(cadastroNovo != "" && cadastroNovo != "erro")
			{
				
				$("#tipo_evento").val("");
				$("#titulo").val("");
				$("#descricao").val("");
				$("#dataInicio").val("");
				$("#dataFinal").val("");
				$("#hora").val("");
				
				$('.inputImg').css('background-position','0px 0px');
				$("input[type='radio']").removeAttr('checked');
				$('.clicado').removeClass('clicado');
				
				
				/*Insere uma nova linha na listagem com o registro que acabou de ser cadastrado no banco*/
				var HtmlContentAgenda= "";
				var cadastrado = getData("Calendario", cadastroNovo);	
			
				if(cadastrado.idcalendario != undefined){
					var anoDB = cadastrado.dataInicio;
					anoDB = anoDB.split("-");					
					var dataExi = anoDB[2]+"/"+anoDB[1]+"/"+anoDB[0];
					
					HtmlContentAgenda +="<div class='item' id=eve_"+cadastrado.idcalendario+"><div class='titulo_evento'><span class='dataEvn'>"+dataExi+"</span> <span class='dataHora'>"+cadastrado.hora+"</span> "+cadastrado.evento+"</div> <span class='editar' onclick='montarEdicao("+cadastrado.idcalendario+")'></span><span class='excluir' onclick='excluirEvt(\"Calendario\", "+cadastrado.idcalendario+")'></span></div>";
				} else {
					HtmlContentAgenda = "";
				}
				var elementos = $('#agenda_listados .item');		
				if(elementos.length>0){
					$(HtmlContentAgenda).insertBefore( "#agenda_listados .item:first");
				}else{
					$("#agenda_listados").html(HtmlContentAgenda);
				}			
				
				var clicado = $('.clicadoFoto');		
				if(clicado.length==1){
					$("#idCalendarioEvento").val(cadastrado.idcalendario);
					$(".blackPainel").css("display","block");
					GerarUpload($("#foto"), $("#fotoEvento"), $("#fotoEvento"));
					$("#fotoEvento").change(function(e){
						$("#LegendaUpload").html("Arquivo Carregado");
					});
				}else{
					//mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");
				}
			}
		}
	});	
	
	$('#abrirCaixa').click(function(){
		$('.boxAgenda').css({'height':'240px','margin-bottom':'11px'});
		$('#frmCadastroEvento').css('display','block');
		$('.btnForm').css('display','none');		
	});
	
	$('#btnCancelar').click(function(){
		$('.btnForm').css('display','block');
		$('#frmCadastroEvento').css('display','none');
		$('.boxAgenda').css({'height':'558px','margin-bottom':'0px'});
	});
	
	/*lista eventos para editar ou excluir*/
	HtmlContentEv = ""; 	
	if(typeof dataCalendario != 'undefined'){	
		for(var i=0;i<dataCalendario.length; i++)
		{	
			if(dataCalendario[i].dataFim!=null){
				dataUsar = dataCalendario[i].dataFim;
			}else if(dataCalendario[i].dataInicio!=null){
				dataUsar = dataCalendario[i].dataInicio;
			}		
			if(dataUsar!=null){
				var data = new Date();										
				var anoLetivo = data.getFullYear();		
				
				var anoDB = dataUsar;
				anoDB = anoDB.split("-");	
				
				var dataExi = anoDB[2]+"/"+anoDB[1]+"/"+anoDB[0];
		
				if(anoDB[0] == anoLetivo){
					HtmlContentEv +="<div class='item' id=eve_"+dataCalendario[i].idcalendario+"><div class='titulo_evento'><span class='dataEvn'>"+dataExi+"</span> <span class='dataHora'>"+dataCalendario[i].hora+"</span> "+dataCalendario[i].evento+"</div><span class='editar' onclick='montarEdicao("+dataCalendario[i].idcalendario+")'></span><span class='excluir' onclick='excluirEvt(\"Calendario\","+dataCalendario[i].idcalendario+")'></span></div>";
				}	
			}		
		}	
		$('#agenda_listados').html(HtmlContentEv);
	}
	
	$(".tipoAg").click(function(){
		var objeto = this;
		if($(objeto).hasClass("clicado") == false){
			$(objeto).css("background-position","-38px 0px").addClass("clicado");			
		}else{ 
			$(objeto).css("background-position","0px 0px").removeClass("clicado"); 
		}
		
		$(this).parent().find('input[type=radio]').removeAttr('checked', false);
		
		$(this).next('input[type=radio]').attr('checked', true);		
	});	
	
	$(".tipoFt").click(function(){
		var objeto = this;
		if($(objeto).hasClass("clicadoFoto") == false){
			$(objeto).css("background-position","-38px 0px").addClass("clicadoFoto");
		}else{ 
			$(objeto).css("background-position","0px 0px").removeClass("clicadoFoto"); 
		}
	});	
	
});

function reset(Numero){	
    if(Numero == 1){
        $('#linha1 #L10L .tipoAg').removeClass( "clicado" );
        $('#linha1 #L10L .tipoAg').css("background-position","0px 0px");
    } else if(Numero == 2){
        $('#linha2 #L10A .tipoAg').removeClass( "clicado" );
        $('#linha2 #L10A .tipoAg').css("background-position","0px 0px");
    }
}

/*Function para cadastrar tipo de evento*/
function criarTipoEvento(tipoEvento){
	var retorno;
	var valores = "tipoEvento="+tipoEvento;
	if($('.infoValueP #evento').val() != "")
	{
		var retorno = setCreateData("TipoEvento",valores);
		if(retorno != "erro"){
			mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");			
		}else{
			mensagem("Erro ao cadastrar!","OK","bt_ok","erro");		
		}
	} else {			
		mensagem("Preencha o campo tipo evento!","OK","bt_ok","erro");
	}
	return retorno;
}

/*Function para cadastrar eventos na tabela calendario*/
function criarEvento(tipo_evento,descricao,dataInicio,dataFinal,evento,feriado,aula,hora){
	//Pega o ano atual verifica se existe um registro na tabela anoLetivo com o mesmo valor
	//se existir ele pega o id e atribui o valor para a variável anoLetivo	
	var data = new Date();										
	var ano = data.getFullYear();		
	
	var Valores = "dataInicio="+dataInicio+"&dataFim="+dataFinal+"&evento="+evento+"&descricao="+descricao+"&tipoEvento="+tipo_evento+"&ano="+ano+"&aula="+aula+"&feriado="+feriado+"&hora="+hora+"&visivel=1";
	
	var retorno = setCreateData("Calendario",Valores);
	
	if(retorno != "erro"){
		mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");			
	}else{
		mensagem("Erro ao cadastrar!","OK","bt_ok","erro");		
	}
	return retorno;
}

/*Preenche o formulário com os dados do registro a ser editado*/
function montarEdicao(id){
	$('.boxAgenda').css({'height':'240px','margin-bottom':'15px'});
	$('#frmCadastroEvento').css('display','block');
	$('.btnForm').css('display','none');
	
	var dataCEEditar  = getData("Calendario", id);

	var tipo_evento = $('#tipo_evento');
	if(dataCEEditar.tipoEvento!=null){
		tipo_evento.val(tipo_evento.find('option[value="'+dataCEEditar.tipoEvento.idtipoEvento+'"]').val());
	}else{
		tipo_evento.val(tipo_evento.find('option[value="-1"]').val());
	}
	
	if (dataCEEditar.feriado == 1){
		$('#L10L .inputImg ').eq(0).addClass('clicado');
	}else{
		$('#L10L .inputImg ').eq(1).addClass('clicado');
	}
	if (dataCEEditar.aula == 1){
		$('#L10L .inputImg ').eq(0).addClass('clicado');
	}else{
		$('#L10L .inputImg ').eq(1).addClass('clicado');
	}
	
	
	$("#idEvento").val(id);
	$("#titulo").val(dataCEEditar.evento);
	$("#descricao").val(dataCEEditar.descricao);
	$("#dataInicio").val(dataCEEditar.dataInicio);
	$("#dataFinal").val(dataCEEditar.dataFim);
	$("#hora").val(dataCEEditar.hora);
	
	reset(1);
	reset(2);	
	
	if(dataCEEditar.feriado==1){
		 $('.feriado:contains("Sim")').filter(':first').next().addClass('clicado').css("background-position","-38px 0px");
	}else if(dataCEEditar.feriado==0){
		 $('.feriado:contains("Não")').filter(':first').next().addClass('clicado').css("background-position","-38px 0px");
	}
	
	if(dataCEEditar.aula==1){
		 $('.agenda:contains("Sim")').filter(':first').next().addClass('clicado').css("background-position","-38px 0px");
	}else if(dataCEEditar.aula==0){
		 $('.agenda:contains("Não")').filter(':first').next().addClass('clicado').css("background-position","-38px 0px");
	}		
	
	$("#btnSalvarEvento").css("display","none");
	$("#btnEditarEvento").css("display","block");
}

/*Function que faz as verificações do campo dataInicio e dataFinal e depois executa a function editar que é responsável por alterar no banco*/
function editarEvt(id){
	
	var retorno = validaForm();
	if(typeof retorno == 'undefined'){	
		var tipo_evento = $("#tipo_evento").val();
		var evento = $("#titulo").val();
		var descricao = $("#descricao").val();
		var dataInicio = $("#dataInicio").val();
		var dataFinal = $("#dataFinal").val();
		var hora = $("#hora").val();
		
		var feriado = $("#L10L .clicado").next().attr("value");
		if(feriado == 1){
			aula =0;
		}else{
			var aula = $("#L10A .clicado").next().attr("value");
		}
		
		/*verifica se a dataInicio é maior que dataFinal*/
		if(dataInicio!="" && dataFinal!=""){
			var novaDataInicio = parseInt(dataInicio.split("-")[2].toString() + dataInicio.split("-")[1].toString() + dataInicio.split("-")[0].toString());
			var novaDataFinal = parseInt(dataFinal.split("-")[2].toString() + dataFinal.split("-")[1].toString() + dataFinal.split("-")[0].toString());
			if(novaDataInicio>novaDataFinal){
				mensagem("Data término não pode ser maior que a data início!","OK","bt_ok","erro");
			}else{
				editar(tipo_evento,descricao,dataInicio,dataFinal,evento,feriado,aula,hora);
			}
		}else{
			editar(tipo_evento,descricao,dataInicio,dataFinal,evento,feriado,aula,hora);
		}
	}
}

/*Function que faz a alteração do registro no banco*/
function editar(tipo_evento,descricao,dataInicio,dataFinal,evento,feriado,aula,hora){
	var data = new Date();										
	var ano = data.getFullYear();
	var retorno;
	var id = $("#idEvento").val();
	var valores = "action=update&dataInicio="+dataInicio+"&dataFim="+dataFinal+"&evento="+evento+"&descricao="+descricao+"&tipoEvento="+tipo_evento+"&ano="+ano+"&aula="+aula+"&feriado="+feriado+"&hora="+hora+"&visivel=1";
	var retorno = setUpdateData("Calendario",valores,id);
	
	if(retorno != "erro"){
		var tipo_evento = $('#tipo_evento');
			tipo_evento.val(tipo_evento.find('option[value="-1"]').val());			
			$("#idEvento").val("");
			$("#titulo").val("");
			$("#descricao").val("");
			$("#dataInicio").val("");
			$("#dataFinal").val("");
			$("#btnSalvarEvento").css("display","block");
			$("#btnEditarEvento").css("display","none");
			$('.inputImg').css('background-position','0px 0px');
			$("input[type='radio']").removeAttr('checked');
			$('.clicado').removeClass('clicado');
			
			var anoDB = dataInicio;
			anoDB = anoDB.split("-");			
			var dataExi = anoDB[2]+"/"+anoDB[1]+"/"+anoDB[0];
			
			$("#eve_"+id+" .titulo_evento").html("<span class='dataEvn'>"+dataExi+"</span> <span class='dataHora'>"+hora+"</span> "+evento);
			
			mensagem("Evento editado com sucesso!","OK","bt_ok","sucesso");
			
			var clicado = $('.clicadoFoto');		
			if(clicado.length==1){
				$("#idCalendarioEvento").val(id);
				$(".blackPainel").css("display","block");				
				GerarUpload($("#foto"), $("#fotoEvento"), $("#fotoEvento"));
				$("#fotoEvento").change(function(e){
					$("#LegendaUpload").html("Arquivo Carregado");
				});
			}else{
				mensagem("Alterado com sucesso!","OK","bt_ok","sucesso");
			}
	}else{
		mensagem("Erro ao alterar evento, verifique os campos!","OK","bt_ok","erro");	
	}
}

/*Function exibe uma caixa de mensagem com um confirm perguntando se o usuário deseja realmente excluir*/
function excluirEvt(servico,id){
	mensagem("Deseja realmente excluir?","Cancelar","bt_cancelar","confirm",servico,id,"excluirEvtConfirm");
}

/*Se o usuário optar por realmente excluir e clicar no botão OK, será executada essa função deletando o registro específico que foi escolhido*/
function excluirEvtConfirm(servico,id){
	deleteData(servico,id)
	$("#boxMensagemGeral").hide();
	$("#eve_"+id).remove();	
}

/*Serviço que faz upload de uma imagem em calendário*/
function salvarFotoEvento(){
	var idCalendarioEvento = $("#idCalendarioEvento").val();
	
	var tipoArquivo = $("#fotoEvento").val();
	
	var extensao = (tipoArquivo.substring(tipoArquivo.lastIndexOf("."))).toLowerCase(); 
	var tipo = extensao.split('.');	 
	if((tipo[1]=='jpg')||(tipo[1]=='png')||(tipo[1]=='jpeg')){
		var formData = new FormData($("#inserirArquivo")[0]);
		upload("Calendario/upload/calendario/",idCalendarioEvento,formData);
	}else{
		mensagem("Este arquivo não é uma imagem!, verifique os campos!","OK","bt_ok","erro");
	}	
}


/*Verfifica se os campos foram corretamente preenchidos*/
function validaForm(){	
	if($('#tipo_evento').val() == -1){
		mensagem("Por favor, preencha o campo tipo do evento!","OK","bt_ok","erro");
		$('#tipo_evento').focus();
		return false
	}
	if($('#dataInicio').val() == ""){
		mensagem("Por favor, preencha o campo data início!","OK","bt_ok","erro");
		$('#dataInicio').focus();
		return false
	}
	var dataAtual = new Date;
	var novaDataInicio = $('#dataInicio').val();
	if (novaDataInicio.toString().substring(0,4) < dataAtual.getFullYear() ||
		novaDataInicio.toString().substring(0,4) == dataAtual.getFullYear() &&
			novaDataInicio.toString().substring(5,7) < dataAtual.getMonth() + 1 ||
		novaDataInicio.toString().substring(0,4) == dataAtual.getFullYear() &&
			novaDataInicio.toString().substring(5,7) == dataAtual.getMonth() + 1 &&
			novaDataInicio.toString().substring(8,10) < dataAtual.getDate())
	{
		mensagem("Data de início não pode ser anterior a data atual!","OK","bt_ok","erro");
		return false;
	}
	if($('#titulo').val() == ""){
		mensagem("Por favor, preencha o título!","OK","bt_ok","erro");
		$('#titulo').focus();
		return false
	}
	if(typeof $("#L10L .clicado").next().attr("value") == "undefined"){
		mensagem("Por favor, preencha o campo feriado!","OK","bt_ok","erro");
		return false
	}
	if(typeof $("#L10A .clicado").next().attr("value") == "undefined"){
		mensagem("Por favor, preencha o campo aula!","OK","bt_ok","erro");
		return false
	}
}