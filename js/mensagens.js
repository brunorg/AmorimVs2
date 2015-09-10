//Murano Design
//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD

	var dataUsuario 	=	getData("Usuario", null);

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado
	var userID = usuarioId;
	var alunoID = getAlunoByUsuario();	
	var dataMensagens;
	var dataMensagensEntrada;
	var dataMensagensSaida;
	var observacaoProducao = false;
	
	ListarCaixaEntrada(1,10);
		
	//var usuario = getUsuario(alunoID);

//------------------------------------------------------------------------------------------------------------------------

//Carrega os dados da URL GET

	//var IdRoteiro = base64_decode(GetURLParameter('ID'));
	var IdMsg = GetURLParameter('ID');

//Pré Lixo

	var PLixo = 0;

//Lista usuarios

	var arrayUsuariosID = [];
	var arrayUsuariosNome = [];

//Mensagem Selecionada

var SelMSGAcao = 0;

//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery msg_selecionada


$(document).ready(function(){
	var contMensagens=1;
	var vazio = false;
	var aba;
	$("#boxMensagens").mCustomScrollbar({
		axis:"y",
		callbacks:{						
			alwaysTriggerOffsets: false,
		    onTotalScrollOffset: 100,
		    whileScrolling: function() {				  	
				aba = $('.cx_barra').attr('id');
				if(aba=='Enviadas'){
					if(this.mcs.topPct > 95){
						if(vazio == false){
							retorno = ListarEnviadas('',10*contMensagens,10);
							contMensagens++;
							if(typeof retorno == "undefined"){
								vazio = true;
							}
						}					
					}
				}else{
					if(this.mcs.topPct > 95){
						if(vazio == false){
							retorno = ListarCaixaEntrada(10*contMensagens,10);
							contMensagens++;
							if(typeof retorno == "undefined"){
								vazio = true;
							}
						}					
					}
				}
		    },
			onTotalScroll:function(){
				aba = $('.cx_barra').attr('id');
				if(aba=='Enviadas'){
					if(this.mcs.topPct > 95){
						if(vazio == false){
							retorno = ListarEnviadas('',10*contMensagens,10);
							contMensagens++;
							if(typeof retorno == "undefined"){
								vazio = true;
							}
						}					
					}
				}else{
					if(this.mcs.topPct > 95){
						if(vazio == false){
							retorno = ListarCaixaEntrada(10*contMensagens,10);
							contMensagens++;
							if(typeof retorno == "undefined"){
								vazio = true;
							}
						}					
					}
				}
			}
		}
	});
	
	

	$("#Nav_menu div").click(function(){
		if($(this).attr("id") == "bt_Excluir" &&
			$('.msg_selecionada').length > 0)
		{
			loading('inicial');
			setTimeout(
					ExcluirMensagem,1000
			)
			//ExcluirMensagem();
		}

		if($(this).attr("id") != "bt_Excluir" &&
			$('.msg_selecionada').length > 0)
		{
			if($(this).hasClass("estado_ativo") == true){
				$(this).removeClass("estado_ativo");
			} else{
			$("#Nav_menu div").removeClass("estado_ativo");
			$(this).addClass("estado_ativo")
			};
		}

		$("#menu_responder").hide();
	});
	
	/* Bt_Responder */
	$("#bt_Responder").click(function(){
		if($("#bt_Responder").hasClass("estado_ativo") == true &&
			$('.msg_selecionada').length > 0){
		$("#menu_responder").show();
		} else{ $("#menu_responder").hide(); }
	});
	

	/*Ao clicar em Responder aparece uma tela para responder (#tela_over)*/
	$("span#responder").click(function(){
		$("#tela_over").show();
		$('#menu_responder').hide();
		$("#Nav_menu div").removeClass("estado_ativo");
		setMSGSend(1);
	});


	/*Ao clicar em Responder aparece uma tela para responder (#tela_over)*/
	$("span#responder_todos").click(function(){
		$("#tela_over").show();
		$('#menu_responder').hide();
		$("#Nav_menu div").removeClass("estado_ativo");
		setMSGSend(2);
	});


	/*Ao clicar em Responder aparece uma tela para responder (#tela_over)*/
	$("span#encaminhar").click(function(){
		$("#tela_over").show();
		$('#menu_responder').hide();
		$("#Nav_menu div").removeClass("estado_ativo");
		setMSGSend(3);
	});

	//Ao clicar no X no canto superior a direita, a janela que foi aberta, sumirá (#tela_over)
	$("#bt_resp_cancelar").click(function(){
		$("#Nav_menu div").removeClass("estado_ativo");
		$("#tela_over").hide();
	});

	/*Ao clicar em Escrever uma Nova Mensagem aparece uma tela para Escrever (#tela_over_enviar)*/
	$("#bt_Escrever").click(function(){
		$("#tela_over").show();
		setMSGSend(4);
		$("#Nav_menu div").removeClass("estado_ativo");
	});

	$("#bt_enviar_cancelar").click(function(){		
		limparCampos();						
		$("#tela_over").hide();
		observacaoProducao = false;
		return false;
	});
	


	$("#bt_resp_enviar").click(function(){
		ResponderMensagem();
		$("#Nav_menu div").removeClass("estado_ativo");
	});
	
	$('body').delegate('.ui-multiselect-none','click',function(){
	
		$(":checkbox").removeAttr('checked');
		$('#pesquisaParaMensagem').val('');
		$('#pesquisaParaMensagem').focus();
		$('.ui-multiselect-checkboxes li').css('display','block');
		$(".ui-multiselect span").eq(1).text('Para');
		return false;
	})

	
	/* - ------------------------------------------------ - */
	
	//Tocar de Abas na lateral da Mensagens > Caixa De Entrada || Enviadas

	$("#Col_Menu div").click(function(){
		$("#Col_Menu div").removeClass("estado_ativo");
		$("#Col_Menu div").removeClass('cx_barra');
		$(this).toggleClass("estado_ativo");
		$('#mCSB_5_dragger_vertical').css({'position':'absolute','top':'0px'});
		$('#mCSB_5_container').css({'position':'relative','top':'0px','left':'0px'});
		contMensagens=1;
		vazio = false;
		if($(this).attr('id') == "CaixaDeEntrada"){
			$(this).addClass('cx_barra');			 
			ListarCaixaEntrada(1,10);
		} else if($(this).attr('id') == "Enviadas"){			
			$(this).addClass('cx_barra');			   
			ListarEnviadas('',1,10);
		}


		$('#Mensagem_wrapper #mensagem_remetente').html("");
		$('#Mensagem_wrapper #mensagem_destinatario').html("");

		$('#Mensagem_wrapper #mensagem_assunto').html("");
		$('#Mensagem_wrapper #Mensagem').html("");
		PLixo = 0;

	});




	for(var a=0; a< dataUsuario.length; a++)
	{
		var encontro = false;

		if(dataUsuario[a].professor != null)
		{
			arrayUsuariosID[arrayUsuariosID.length] = dataUsuario[a].professor.idprofessorFuncionario;
			arrayUsuariosNome[arrayUsuariosNome.length] = dataUsuario[a].professor.nome;
			encontro = true;
		} else if(dataUsuario[a].aluno != null){
			arrayUsuariosID[arrayUsuariosID.length] = dataUsuario[a].aluno.idAluno;
			arrayUsuariosNome[arrayUsuariosNome.length] = dataUsuario[a].aluno.nome;
			encontro = true;
		}
		
		if(encontro)
		{
			$("#tela_over #Mensagem_wrapper #destinatarios").append('<option title="'+dataUsuario[a].perfil.perfil+'" value="'+dataUsuario[a].idusuario+'">'+arrayUsuariosNome[arrayUsuariosNome.length-1]+'</option>')
		}
	}
	

	$("#tela_over #Mensagem_wrapper #destinatarios").append($("#tela_over #Mensagem_wrapper #destinatarios option").remove().sort(function(a, b) {
	    var at = $(a).text(), bt = $(b).text();
	    return (at > bt)?1:((at < bt)?-1:0);
	}));
	

	//Lista a Caixa de Entrada como padrão incial
	
	ListarCaixaEntrada(1,10);

	window.setTimeout(function(){
		if(IdMsg != undefined)
		{
			$(".caixa_mensagem[msgid='"+IdMsg+"']").trigger("click");
			scrollBarMensagem.mCustomScrollbar("scrollTo",$(".caixa_mensagem[msgid='"+IdMsg+"']"));
		}
	}, 1000)

	if(localStorage.getItem("producaoMensagem") != null && localStorage.getItem("producaoMensagem") != "")
	{
		localStorage.setItem("observacaoProducao", localStorage.getItem("producaoMensagem"));
		localStorage.setItem("producaoMensagem", "");
		observacaoProducao = true;
		$("#bt_Escrever").trigger("click");
		window.setTimeout(function(){
				var dataProducaoAluno;
				$.ajax({
					url: path + "ProducaoAluno/" + localStorage.getItem("observacaoProducao"),
					async: false,
					crossDomain: true,
					type: "GET",
					success: function(data){
						dataProducaoAluno = data;
					}
				});
		
				var alunoUsuario;
				$.ajax({
					url: path + "Usuario/aluno/" + dataProducaoAluno.aluno.idAluno,
					async: false,
					crossDomain: true,
					type: "GET",
					success: function(data){
						alunoUsuario = data;
					}
				});
				$("[id^='ui-multiselect-destinatarios-option'][value="+alunoUsuario.idusuario+"]").trigger("click");
				$("#frm_Envia_Mensagens #assunto").val(dataProducaoAluno.tipo.tipo + " - " + dataProducaoAluno.texto);
		}, 1500)
	}
	
	if(localStorage.getItem("respostaObservacao") != null && localStorage.getItem("respostaObservacao") != "")
	{
		var idResposta = localStorage.getItem("respostaObservacao");
		localStorage.setItem("respostaObservacao", "");
		window.setTimeout(function() {
			$("[msgid="+idResposta+"]").trigger("click");
			$("#responder").trigger("click");
		},1500)
	}

});

//caixa_mensagem lida msg_selecionada
//Função de Abrir a carta não lida do Email
function selecionarMensagem(objeto)
{

	//console.log($(objeto).attr('msgId'));
	$("#Col_CaixaDeMensagens div").removeClass("msg_selecionada");
		
	$(objeto).toggleClass("msg_selecionada");
	$(objeto).removeClass("nao_lida").addClass("lida");


	//Mostra a mensagem na lateral Direita da pagina
	MostrarMensagem($(objeto).attr('msgId'));
}

function setMSGSend(Numero)
{
	$("#Nova_frame").hide();
	$("#Resp_frame").hide();

	//Pegar os dados do Serviço JSON das Mensagens
	dataMensagens =	getData("Mensagens/email", usuarioId);
	for(var a=0; a<dataMensagens.length; a++)
	{
		//Mostrar Mensagem requisitada
		if(dataMensagens[a].idmensagens == SelMSGAcao)
		{

			if(Numero == 1)
			{
			
				
				$("#Resp_frame").show();
				

				$('#tela_over #Mensagem_wrapper #Resp_frame #mensagem_remetente').html((dataMensagens[a].remetente.aluno != null ? dataMensagens[a].remetente.aluno.nome:dataMensagens[a].remetente.professor.nome));
				$('#telxa_over #Mensagem_wrapper #Resp_frame #mensagem_destinatario').html(getNomeByNomeUsuario(dataMensagens[a].destinatarios, 0));
				$('#tela_over #Mensagem_wrapper #Resp_frame #Resposta_Remetente').val(dataMensagens[a].remetente.idusuario);
				
				$('#tela_over #Mensagem_wrapper #Resp_frame #mensagem_assunto').html(dataMensagens[a].assunto);
				$('#tela_over #Mensagem_wrapper #Resp_frame #Mensagem').val("\n\n-------------------------------------------------\n"+dataMensagens[a].mensagem);
			} 
			else if(Numero == 2)
			{
				$("#Nova_frame").show();



				getNomeByNomeUsuario(dataMensagens[a].destinatarios, 1)

				//console.log(getNomeByNomeUsuario(dataMensagens[a].destinatarios, 0));
				//
				
				$("#tela_over #Mensagem_wrapper #Nova_frame #destinatarios option[value='"+dataMensagens[a].remetente.idusuario+"']").prop("selected", true);
				$("#tela_over #Mensagem_wrapper #Nova_frame #destinatarios option[value='"+userID+"']").prop("selected", false);

				//formselect.val(arrayDestinatarios);

				formselect.multiselect("refresh");

				$('#tela_over #Mensagem_wrapper #Nova_frame #assunto').val("RES: "+dataMensagens[a].assunto);

				$('#tela_over #Mensagem_wrapper #Nova_frame #mensagem').empty();
				$('#tela_over #Mensagem_wrapper #Nova_frame #mensagem').val("\n\n-------------------------------------------------\n"+dataMensagens[a].mensagem);

			} else if(Numero == 3)
			{
				$("#Nova_frame").show();

				
				$('#tela_over #Mensagem_wrapper #Nova_frame #assunto').val(dataMensagens[a].assunto);
				
				$('#tela_over #Mensagem_wrapper #Nova_frame #mensagem').empty();
				$('#tela_over #Mensagem_wrapper #Nova_frame #mensagem').val("\n"+
					"\n-------------------------------------------------\n"+
					"De: "+(dataMensagens[a].remetente.aluno != null ? dataMensagens[a].remetente.aluno.nome:dataMensagens[a].remetente.professor.nome)+
					"\nPara: "+getNomeByNomeUsuario(dataMensagens[a].destinatarios, 0)+
					"\n\n"+dataMensagens[a].mensagem);
			}

						
		}
	}

	if(Numero == 4)
	{
		
		$("#Nova_frame").show();
		$('#tela_over #Mensagem_wrapper #Nova_frame #assunto').empty();
		$('#tela_over #Mensagem_wrapper #Nova_frame #mensagem').empty();
	}

}

//---------------------------------------------------------
//Mostra Mensagens do à direita usuario

function MostrarMensagem(idMensagem){
	
	var HtmlContent = "";
	var Contador = 1;

	PLixo = idMensagem;	
	
	$.ajax({
		type: "GET",
		async:false,
		crossDomain: true,
		url: path+ "Mensagens/MensagemByUser/"+usuarioId+"/"+idMensagem,		        
		success: function(dataMensagens){		
			$('#Col_Mensagem #Mensagem_wrapper #mensagem_remetente').html((dataMensagens[0].remetente.aluno != null ? dataMensagens[0].remetente.aluno.nome:dataMensagens[0].remetente.professor.nome));
			$('#Col_Mensagem #Mensagem_wrapper #mensagem_destinatario').html(getNomeByNomeUsuario(dataMensagens[0].destinatarios));
			$('#Col_Mensagem #Mensagem_wrapper #Resposta_Remetente').val(dataMensagens[0].remetente.idusuario);			
			$('#Col_Mensagem #Mensagem_wrapper #mensagem_assunto').html(dataMensagens[0].assunto);
			$('#Col_Mensagem #Mensagem_wrapper #Mensagem').html(dataMensagens[0].mensagem);

			SelMSGAcao = idMensagem;
					
			//Se mensagem não estiver lida... mude para lido
			if(dataMensagens[0].lida == "N"){
				$.ajax({
					url: path+"Mensagens/update/lida/"+idMensagem+"/S",
					type: "POST",
					success: function(d) {
						console.log(d);
					}
				}); 		
			}		
		}
	});		
}

function enviar(){
	loading('inicial');
	EnviarMSG();
}

//Envia uma nova mensagem
function EnviarMSG()
{
	var HtmlContent;
	$('#frm_Envia_Mensagens #remetente').attr("value", ""+userID);

	if( $("#frm_Envia_Mensagens #destinatarios").val() != null && $("#frm_Envia_Mensagens #mensagem").val() != "" && $("#frm_Envia_Mensagens #assunto").val() != "" ){
		$.ajax({
		    url: path+"Mensagens/",
		    type: "POST",
		    data: $('#frm_Envia_Mensagens').serialize(),
	    	success: function(d) {
	    		if(observacaoProducao)
				{
					$.ajax({
						url: path + "ProducaoAluno/Status/" + localStorage.getItem("observacaoProducao") + "/2/" + (d - 1),
        		    	type: "GET",
        		    	async:true,
        		    	crossDomain: true,
        		    	beforeSend: function(){
        		        loading("inicial");
        		    	},
        		    	success: function(){
        		    	},
        		    	erro: function(){
        		    	    mensagem("Não modificado","OK","bt_ok","erro");
        		    	},
        		    	complete: function(){
        		    	    loading("final");
        		    	}
					});
		
					observacaoProducao = false;
				}
				$("#tela_over").hide();
		    	mensagem("Mensagem enviada com sucesso!","OK","bt_ok","sucesso");		    	
				ListarEnviadas('',1,10); //Não precisa enviar a ultima, a lista é atualizada na função ListarEnviadas!!
				
				limparCampos();
				loading('final');
				return false;
		    },error: function() {
		    	mensagem("Erro ao enviar mensagem!","OK","bt_ok","erro");
				loading('final');
		    }
		}); 
	} else if( $("#frm_Envia_Mensagens #destinatarios").val() == null )
	{
		mensagem("Não há destinatários, por favor, adicione ao menos um destinatário!","OK","bt_ok","erro");
		loading('final');
	} else  if( $("#frm_Envia_Mensagens #assunto").val() == "" )
	{
		mensagem("Não há assunto, por favor, adicione um assunto que deseja enviar!","OK","bt_ok","erro");
		loading('final');
	} else  if( $("#frm_Envia_Mensagens #mensagem").val() == "" )
	{
		mensagem("Não há mensagem, por favor, adicione a mensagem que deseja enviar!","OK","bt_ok","erro");
		loading('final');
	}
	
	return false;
}

//Responde uma nova mensagem
function ResponderMensagem()
{

	$('#frm_Envia_Mensagens #remetente').attr("value", ""+userID);

	if($('#tela_over #Mensagem').val() != "")
	{
		$.ajax({
		    url: path+"Mensagens/",
		    type: "POST",
		    data: "id=0&action=create&lida=1&remetente="+userID+"&assunto=RE: "+$('#tela_over #mensagem_assunto').html()+"&destinatarios="+$('#tela_over #Resposta_Remetente').val()+"&mensagem="+$('#tela_over #Mensagem').val(),
	    	success: function(d) {
		    	dataMensagens 	=	getData("Mensagens", null);

		    	$("#tela_over").hide();

		    	$('#CaixaDeEntrada').trigger("click");
				//carregaMensagens();
		    	ListarCaixaEntrada(1,10);

				//Se mudar essa mensagem, tem que mudar o if no funcoes.js!!
		    	mensagem("Mensagem enviada com sucesso!","OK","bt_ok","sucesso");

		    },error: function() {
		    	//console.log("DDNN : error");

		    	mensagem("Erro ao enviar mensagem!","OK","bt_ok","erro");
		    	loading('final');
		    	dataMensagens 	=	getData("Mensagens", null);
		    }
		}); 
	} else {
		mensagem("Sua resposta não tem mensagem, por favor, adicione uma!","OK","bt_ok","erro");
		loading('final');
	}
}



//---------------------------------------------------------
//Lista mensagens da caixa de entrada do usuario

function ListarCaixaEntrada(inicio,fim){

	var HtmlContent = "";
	var Contador = 1;

	$.ajax({
		type: "GET",
		async:false,
		crossDomain: true,
		url: path+ "Mensagens/email/entrada/"+usuarioId+"/"+inicio+"/"+fim,           
		success: function(dataMensagensEntrada){
			for(var a=dataMensagensEntrada.length-1; a>=0; a--)
			{
	
				var dataMSG = (dataMensagensEntrada[a].data.substr(8, 2))+'/'+(dataMensagensEntrada[a].data.substr(5, 2))+'/'+(dataMensagensEntrada[a].data.substr(0, 4));
	
				//Se o Aluno Existir nessa lista de Usuários
				if(usuario == "Aluno" && dataMensagensEntrada[a].proprietario.aluno != null)
				{
					//Se a mensagem for para este usuário e se estiver na caixa de Entrada
					if(dataMensagensEntrada[a].proprietario.idusuario == userID && dataMensagensEntrada[a].cxEntrada == "S")
					{
						HtmlContent +='<div id="msg'+(Contador++)+'" class="caixa_mensagem'+ (dataMensagensEntrada[a].lida == "N" ? " nao_lida":" lida") +'" msgId="'+dataMensagensEntrada[a].idmensagens+'" onclick="selecionarMensagem(this);"> ' +
									   '<div class="caixa_data_hora"> '+dataMSG+' </div>' +
									   '<div class="msg_info_wrapper">' +
									   '<div class="caixa_remetente"> '+ (dataMensagensEntrada[a].remetente.aluno != null ? dataMensagensEntrada[a].remetente.aluno.nome:dataMensagensEntrada[a].remetente.professor.nome) +' </div>' +
									   '<div class="caixa_assunto"> '+ (dataMensagensEntrada[a].assunto != "" ? dataMensagensEntrada[a].assunto:"Sem Assunto") +'</div>' +
									   '</div>' +
									   '</div>';
					}
	
				//Se o Professor Existir nessa lista de Usuários
				} else if((usuario == "Professor" || usuario == "Coordenacao" || usuario == "Secretaria") && dataMensagensEntrada[a].proprietario.professor != null){
					//Se a mensagem for para este usuário e se estiver na caixa de Entrada
					if(dataMensagensEntrada[a].proprietario.idusuario == userID && dataMensagensEntrada[a].cxEntrada == "S")
					{
						HtmlContent +='<div id="msg'+(Contador++)+'" class="caixa_mensagem'+ (dataMensagensEntrada[a].lida == "N" ? " nao_lida":" lida") +'" msgId="'+dataMensagensEntrada[a].idmensagens+'" onclick="selecionarMensagem(this);"> ' +
									   '<div class="caixa_data_hora"> '+dataMSG+' </div>' +
									   '<div class="msg_info_wrapper">' +
									   '<div class="caixa_remetente"> '+ (dataMensagensEntrada[a].remetente.aluno != null ? dataMensagensEntrada[a].remetente.aluno.nome:dataMensagensEntrada[a].remetente.professor.nome) +' </div>' +
									   '<div class="caixa_assunto"> '+ (dataMensagensEntrada[a].assunto != "" ? dataMensagensEntrada[a].assunto:"Sem Assunto") +'</div>' +
									   '</div>' +
									   '</div>';
					}
				}
			}

			//Após salvar as Strings dentro da variável, adicionar ao HTML
			if(inicio==1){
				$('#Col_CaixaDeMensagens').html(HtmlContent);
			}else{ 
				$('#Col_CaixaDeMensagens').append(HtmlContent);
			}
		}
	});	
}


//---------------------------------------------------------
//Lista mensagens da caixa de entrada do usuario

function ListarEnviadas(ultima,inicio,fim)
{
	//Carrega a lista das mensagens, não precisando trazer a ultima mensagem!!
	var HtmlContent = "";
	var Contador = 1;
	//Pegar os dados do Serviço JSON das Mensagens

	$.ajax({
        type: "GET",
        async:false,
        crossDomain: true,
        url: path+ "Mensagens/email/enviado/"+usuarioId+"/"+inicio+"/"+fim,           
		success: function(dataMensagensSaida){
			if(dataMensagensSaida!=""){
				for(var a=dataMensagensSaida.length-1; a>=0; a--)
				{
			
					var dataMSG = (dataMensagensSaida[a].data.substr(8, 2))+'/'+(dataMensagensSaida[a].data.substr(5, 2))+'/'+(dataMensagensSaida[a].data.substr(0, 4));
			
					//Se o Aluno Existir nessa lista de Usuários
					if(usuario == "Aluno" && dataMensagensSaida[a].remetente.aluno != null)
					{
						//Se a mensagem for para este usuário e se estiver na caixa de Saída
						if(dataMensagensSaida[a].remetente.idusuario == userID && dataMensagensSaida[a].cxEnviada == "S")
						{
							HtmlContent +='<div id="msg'+(Contador++)+'" class="caixa_mensagem'+ (dataMensagensSaida[a].lida == "N" ? " nao_lida":" lida") +'" msgId="'+dataMensagensSaida[a].idmensagens+'" onclick="selecionarMensagem(this);"> ' +
										   '<div class="caixa_data_hora"> '+dataMSG+' </div>' +
										   '<div class="msg_info_wrapper">' +
										   '<div class="caixa_remetente"> '+ dataMensagensSaida[a].remetente.aluno.nome +' </div>' +
										   '<div class="caixa_assunto"> '+ (dataMensagensSaida[a].assunto != "" ? dataMensagensSaida[a].assunto:"Sem Assunto") +'</div>' +
										   '</div>' +
										   '</div>';
						}
						//Se o Professor Existir nessa lista de Usuários
					} else if((usuario == "Professor" || usuario == "Coordenacao" || usuario == "Secretaria") && dataMensagensSaida[a].remetente.professor != null){
						//Se a mensagem for para este usuário e se estiver na caixa de Saída
						if(dataMensagensSaida[a].remetente.idusuario == userID && dataMensagensSaida[a].cxEnviada == "S")
						{
							HtmlContent +='<div id="msg'+(Contador++)+'" class="caixa_mensagem'+ (dataMensagensSaida[a].lida == "N" ? " nao_lida":" lida") +'" msgId="'+dataMensagensSaida[a].idmensagens+'" onclick="selecionarMensagem(this);"> ' +
										   '<div class="caixa_data_hora"> '+dataMSG+' </div>' +
										   '<div class="msg_info_wrapper">' +
										   '<div class="caixa_remetente"> '+ dataMensagensSaida[a].remetente.professor.nome +' </div>' +
										   '<div class="caixa_assunto"> '+ (dataMensagensSaida[a].assunto != "" ? dataMensagensSaida[a].assunto:"Sem Assunto") +'</div>' +
										   '</div>' +
										   '</div>';
						}
					}
				}			
				//Após salvar as Strings dentro da variável, adicionar ao HTML
				var html;
				if(ultima!=""){
					html = ultima+HtmlContent;
				}else{
					html = HtmlContent;
				}
				
				if(inicio==1){
					$('#Col_CaixaDeMensagens').html(HtmlContent);
				}else{ 
					$('#Col_CaixaDeMensagens').append(HtmlContent);
				}
				
			}else{
				return 0;
			}
		}
	});	
}

function ExcluirMensagem()
{
	if(PLixo>0)
	{
		$.ajax({
		type: "GET",
		async:false,
		crossDomain: true,		
		url: path+"Mensagens/delete/"+PLixo,
		success:function(data){
			PLixo = 0;
		},error:function(d){
			if(d.status == 405)
			{
				PLixo = 0;
				$('.msg_selecionada').next().addClass('nextAccept');
				$('.msg_selecionada').remove();
				dataMensagens = null;
				dataMensagens 	=	getData("Mensagens", null);

				$('#Mensagem_wrapper #mensagem_remetente').html("");
				$('#Mensagem_wrapper #mensagem_destinatario').html("");

				$('#Mensagem_wrapper #mensagem_assunto').html("");
				$('#Mensagem_wrapper #Mensagem').html("");
				
				$('#frm_Post_Mensagens #id').val("");
				$('#frm_Post_Mensagens #action').val("");
				$('#frm_Post_Mensagens #remetente').val("");
				$('#frm_Post_Mensagens #assunto').val("");
				$('#frm_Post_Mensagens #mensagem').val("");
				$('#frm_Post_Mensagens #lida').val("");
				$('#frm_Post_Mensagens #cxEntrada').val("");
				$('#frm_Post_Mensagens #cxEnviada').val("");
				$('#frm_Post_Mensagens #tipoMensagem').val("");
				$('#frm_Post_Mensagens #data').val("");
				$('#frm_Post_Mensagens #proprietario').val("");
				$('#frm_Post_Mensagens #destinatarios').val("");

				$('.nextAccept').trigger("click");
				$('.nextAccept').removeClass('nextAccept');
				
				
				carregaMensagens();
				
				//console.log(usuarioId);
				mensagem("Mensagem excluida com sucesso!","OK","bt_ok","sucesso");
				loading('final');
				

			}
		}
		}).then(function(data) {
			dataMensagens = null;
			dataMensagens 	=	getData("Mensagens", null);
			loading('final');
		});
	}
}

//------------------------------------------------------------------------------------------------------------------------

//Pegar ID Aluno pelo usuario

function getAlunoByUsuario()
{
	for(var a=0; a<dataUsuario.length;a++)
	{
		if(usuario == "Aluno" && dataUsuario[a].aluno != null)
		{
			if(dataUsuario[a].idusuario == userID)
			{
				return dataUsuario[a].aluno.idAluno;
			}
		} else if(usuario == "Professor" && dataUsuario[a].professor != null){
			 if(dataUsuario[a].idusuario == userID)
			 {
			 	return dataUsuario[a].professor.idprofessorFuncionario;
			 }
		}
	}
}


function getNomeByNomeUsuario(UsrNomes, Numero)
{
	var remetentesSeparados = UsrNomes.split(";");
	var valorRetornado = "";
	for(var a=0; a < remetentesSeparados.length; a++)
	{
		for(var b=0; b< dataUsuario.length; b++)
		{
			if(dataUsuario[b].login == remetentesSeparados[a])
			{
				if(dataUsuario[b].aluno != null)
				{
					valorRetornado += dataUsuario[b].aluno.nome+"; ";
				} else if(dataUsuario[b].professor != null){
					valorRetornado += dataUsuario[b].professor.nome+"; ";
				}

				if(Numero == 1)
				{
					$("#tela_over #Mensagem_wrapper #Nova_frame #destinatarios option[value='"+dataUsuario[b].idusuario+"']").prop("selected", true);
				}
			}
		}
	}
	return valorRetornado;
}

function limparCampos(){	//limpa os campos do formulario de enviar mensagem!!
	$('#tela_over #Mensagem_wrapper #Nova_frame #assunto').val('');
	$('#tela_over #Mensagem_wrapper #Nova_frame #mensagem').val('');
	
	
	$('#pesquisaParaMensagem').val('');
	
	$('.ui-multiselect-checkboxes li').css('display','block');	
	// $(":checkbox").each(function(){
		// $(this).removeAttr('checked');
	// });
	$(":checkbox").removeAttr('checked');
	$(".ui-multiselect span").eq(1).text('Para');
}

