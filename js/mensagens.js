//Murano Design
//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD
//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado
	var userID = usuarioId;
	//var usuarioLogado;	//Usuário logado!!
	var dataMensagens;
	var dataMensagensEntrada;
	var dataMensagensSaida;
	var observacaoProducao = false;
	var vazio = false;
	var contMensagens=1;
	
	$.ajax({
		url: path + "Usuario/ListarObjParte",
		async: false,
		crossDomain: true,
		type: "GET",
		success: function(data){
			dataUsuario = data;
		}
	});


//------------------------------------------------------------------------------------------------------------------------

//Carrega os dados da URL GET
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
	var aba;

	atribuiFuncoesRolagem();	
	

	$("#Nav_menu div").click(function(){
		if(	$(this).attr("id") == "bt_Excluir" &&
			$('.msg_selecionada').length > 0)
		{
			loading('inicial');
			setTimeout(
					ExcluirMensagem,1000
			)
			//ExcluirMensagem();
		}

		if(	$(this).attr("id") != "bt_Excluir" &&
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
	alert('dasdasd');
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
			ListarCaixaEntrada(0,10);
		} else if($(this).attr('id') == "Enviadas"){			
			$(this).addClass('cx_barra');			   
			ListarEnviadas('',0,10);
		}


		$('#Mensagem_wrapper #mensagem_remetente').html("");
		$('#Mensagem_wrapper #mensagem_destinatario').html("");

		$('#Mensagem_wrapper #mensagem_assunto').html("");
		$('#Mensagem_wrapper #Mensagem').html("");
		PLixo = 0;

	});

	for(var a=0; a< dataUsuario.length; a++){
		if (dataUsuario != null){
			var encontro = false;
		
			if(typeof dataUsuario[a].idProfessor != "undefined"){
				arrayUsuariosID[arrayUsuariosID.length] = dataUsuario[a].idProfessor;
				arrayUsuariosNome[arrayUsuariosNome.length] = dataUsuario[a].nome;
				perfil = 'Professor';
				encontro = true;
			} else if(typeof(dataUsuario[a].idAluno) != "undefined"){
				arrayUsuariosID[arrayUsuariosID.length] = dataUsuario[a].idAluno;
				arrayUsuariosNome[arrayUsuariosNome.length] = dataUsuario[a].nome;
				perfil = 'Aluno';
				encontro = true;
			}
			if(encontro){
				$("#tela_over #Mensagem_wrapper #destinatarios").append('<option title="'+perfil+'" class="'+dataUsuario[a].idUsuario+'" value="'+dataUsuario[a].idUsuario+'">'+arrayUsuariosNome[arrayUsuariosNome.length-1]+'</option>')
			}
		}
	}

	$("#tela_over #Mensagem_wrapper #destinatarios").append($("#tela_over #Mensagem_wrapper #destinatarios option").remove().sort(function(a, b) {
	    var at = $(a).text(), bt = $(b).text();
	    return (at > bt)?1:((at < bt)?-1:0);
	}));
	

	//Lista a Caixa de Entrada como padrão incial
	
	ListarCaixaEntrada(0,10);

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

function atribuiFuncoesRolagem () {
	$("#boxMensagens").mCustomScrollbar({
		axis:"y",
		callbacks:{						
			alwaysTriggerOffsets: false,
		    onTotalScrollOffset: 100,
		    whileScrolling: function() {	  	
				aba = $('.estado_ativo').attr('id');
				if(	aba == 'Enviadas'){
					if(this.mcs.topPct > 95 &&
						vazio == false){

						retorno = ListarEnviadas('',10*contMensagens,10);
							contMensagens++;
						if(typeof retorno == "undefined"){
							vazio = true;
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
				aba = $('.estado_ativo').attr('id');
				if(	aba=='Enviadas'){
					if(this.mcs.topPct > 95 &&
						vazio == false){
						retorno = ListarEnviadas('',10*contMensagens,10);
						contMensagens++;
						if(typeof retorno == "undefined"){
							vazio = true;
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
}

//caixa_mensagem lida msg_selecionada
//Função de Abrir a carta não lida do Email
function selecionarMensagem(objeto)
{
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

	
	if(Numero == 4){ //4 quando for para criar uma nova mensagem!!
		$("#Nova_frame").show();
		$('#tela_over #Mensagem_wrapper #Nova_frame #assunto').empty();
		$('#tela_over #Mensagem_wrapper #Nova_frame #mensagem').empty();
	}else{
		//dataMensagens =	getData("Mensagens/email", userID);
		dataMensagens = '';
		$.ajax({
			type: "GET",
			async:false,
			crossDomain: true,
			//url: path+ "Mensagens/MensagemByUser/"+userID+"/"+idMensagem,
			url: path+ "Mensagens/emailHashId/"+SelMSGAcao,
			success: function(data){		
				dataMensagens = data;
			}
		});

		//for(var a=0; a<dataMensagens.length; a++){
		
			//Mostrar Mensagem requisitada
			//if(dataMensagens[a].idmensagens == SelMSGAcao){

				if(Numero == 1){	//Responder...			
					$("#Resp_frame").show();

					$('#tela_over #Mensagem_wrapper #Resp_frame #mensagem_remetente').html(dataMensagens[0].remetente_nome);
					$('#mensagem_destinatario').html(getNomeByIdsUsuario(dataMensagens[0].IdDestinatarios, 0));
					$('#tela_over #Mensagem_wrapper #Resp_frame #Resposta_Remetente').val(dataMensagens[0].remetente_idUsuario);
					
					$('#tela_over #Mensagem_wrapper #Resp_frame #mensagem_assunto').html(dataMensagens[0].assunto);
					$('#tela_over #Mensagem_wrapper #Resp_frame #Mensagem').val("\n\n-------------------------------------------------\n"+dataMensagens[0].mensagem);
				} 

				else if(Numero == 2){//Responder todos
					$("#Nova_frame").show();

					getNomeByIdsUsuario(dataMensagens[0].IdDestinatarios, 1);
					$("#tela_over #Mensagem_wrapper #Nova_frame #destinatarios option[value='"+userID+"']").prop("selected", false);
					formselect.multiselect("refresh");
					
					$('#tela_over #Mensagem_wrapper #Nova_frame #assunto').val("RES: "+dataMensagens[0].assunto);
					$('#tela_over #Mensagem_wrapper #Nova_frame #mensagem').empty();
					$('#tela_over #Mensagem_wrapper #Nova_frame #mensagem').val("\n\n-------------------------------------------------\n"+dataMensagens[0].mensagem);
				} 
				else if(Numero == 3){ //Encaminhar
					$("#Nova_frame").show();

					$('#tela_over #Mensagem_wrapper #Nova_frame #assunto').val(dataMensagens[0].assunto);
					$('#tela_over #Mensagem_wrapper #Nova_frame #mensagem').empty();
					$('#tela_over #Mensagem_wrapper #Nova_frame #mensagem').val("\n"+
								"\n-------------------------------------------------\n"+
								"De: "+dataMensagens[0].remetente_nome+
								"\nPara: "+getNomeByIdsUsuario(dataMensagens[0].IdDestinatarios, 0)+
								"\n\n"+dataMensagens[0].mensagem
					);
				}
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
		//url: path+ "Mensagens/MensagemByUser/"+userID+"/"+idMensagem,
		url: path+ "Mensagens/emailHashId/"+idMensagem,		
		success: function(dataMensagens){			
			$('#Col_Mensagem #Mensagem_wrapper #mensagem_remetente').html(dataMensagens[0].remetente_nome);

			$('#Col_Mensagem #Mensagem_wrapper #mensagem_destinatario').html(getNomeByIdsUsuario(dataMensagens[0].IdDestinatarios,0));
			$('#Col_Mensagem #Mensagem_wrapper #Resposta_Remetente').val(dataMensagens[0].remetente_idusuario);			
			$('#Col_Mensagem #Mensagem_wrapper #mensagem_assunto').html(dataMensagens[0].assunto);
			$('#Col_Mensagem #Mensagem_wrapper #Mensagem').html(dataMensagens[0].mensagem);

			SelMSGAcao = idMensagem;
					
			//Se mensagem não estiver lida... mude para lido
			if(dataMensagens[0].lida == "N"){
				$.ajax({
					url: path+"Mensagens/update/lida/"+idMensagem+"/S",
					type: "POST",
					success: function(d) {
						//console.log(d);
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
				
				loading('final');
		    	mensagem("Mensagem enviada com sucesso!","OK","bt_ok","sucesso");		    	
				ListarEnviadas('',0,10); //Não precisa enviar a ultima, a lista é atualizada na função ListarEnviadas!!
				
				limparCampos();
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
		    	ListarCaixaEntrada(0,10);

				//Se mudar essa mensagem, tem que mudar o if no funcoes.js!!
		    	mensagem("Mensagem enviada com sucesso!","OK","bt_ok","sucesso");

		    },error: function() {
		    	////console.log("DDNN : error");

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

	$.ajax({
		type: "GET",
		async:false,
		crossDomain: true,
		url: path+ "Mensagens/emailHash/entrada/"+userID+"/"+inicio+"/"+fim,
		success: function(dataMensagensEntrada){
		
			if (dataMensagensEntrada.length > 0){
				for(var a = 0; a < dataMensagensEntrada.length; a++){

					if(dataMensagensEntrada[a].mensagem != ''){
						
						var dataMSG = (dataMensagensEntrada[a].data.substr(8, 2))+'/'+(dataMensagensEntrada[a].data.substr(5, 2))+'/'+(dataMensagensEntrada[a].data.substr(0, 4));
						HtmlContent +='<div id="msg'+(dataMensagensEntrada[a].idMensagem)+'" class="caixa_mensagem'+ (dataMensagensEntrada[a].lida == "N" ? " nao_lida":" lida") +'" msgId="'+dataMensagensEntrada[a].idMensagem+'" onclick="selecionarMensagem(this);" destinatarios="'+dataMensagensEntrada[a].IdDestinatarios+'" nomeDiv> ' +
									   	'<div class="caixa_data_hora"> '+dataMSG+' </div>' +
									   	'<div class="msg_info_wrapper">' +
									   	  '<div class="caixa_remetente"> '+dataMensagensEntrada[a].remetente_nome+' </div>' +
									   	  '<div class="caixa_assunto"> '+ (dataMensagensEntrada[a].assunto != "" ? dataMensagensEntrada[a].assunto:"Sem Assunto") +'</div>' +
									   	'</div>' +
									  '</div>';
					}
				}
			}
	
			//Após salvar as Strings dentro da variável, adicionar ao HTML
			if(inicio == 0){
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
	//Pegar os dados do Serviço JSON das Mensagens

	$.ajax({
        type: "GET",
        async:false,
        crossDomain: true,
        //url: path+ "Mensagens/email/enviado/"+userID+"/"+inicio+"/"+fim,           
        url: path+ "Mensagens/emailHash/enviado/"+userID+"/"+inicio+"/"+fim,
		success: function(dataMensagensSaida){
			if (dataMensagensSaida.length > 0){
				for(var a = 0; a < dataMensagensSaida.length; a++){
					if(dataMensagensSaida[a].mensagem != ''){
						var dataMSG = (dataMensagensSaida[a].data.substr(8, 2))+'/'+(dataMensagensSaida[a].data.substr(5, 2))+'/'+(dataMensagensSaida[a].data.substr(0, 4));
						HtmlContent +='<div class="caixa_mensagem lida" msgId="'+dataMensagensSaida[a].idMensagem+'" onclick="selecionarMensagem(this);"> ';
						HtmlContent +=	'<div class="caixa_data_hora"> '+dataMSG+' </div>';
						HtmlContent	+=	'<div class="msg_info_wrapper">';
						HtmlContent +=		getUserRemetente(dataMensagensSaida[a].remetente_idUsuario);
						HtmlContent +=		'<div class="caixa_assunto"> '+ (dataMensagensSaida[a].assunto != "" ? dataMensagensSaida[a].assunto:"Sem Assunto") +'</div>';
						HtmlContent +=	'</div>';
						HtmlContent +='</div>';
					}
				}
			}
		}
	});
	
	if(inicio == 0){
		$('#Col_CaixaDeMensagens').html(HtmlContent);
	}else{ 
		$('#Col_CaixaDeMensagens').append(HtmlContent);
	}
}

function getUserRemetente(idUser){
	var html = '';
	$.ajax({
		type: "GET",
		async: false,
		crossDomain: true,
		url: path + "Usuario/" + idUser,
		success:function(dataUser){
			if (dataUser.professor != undefined)
				html += '<div class="caixa_remetente"> ' +dataUser.professor.nome+ ' </div>';			
			else
				html += '<div class="caixa_remetente"> ' +dataUser.aluno.nome+ ' </div>';			
		}
	});
	return html;
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
			loading('final');
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
				
				
				//carregaMensagens();
				//$("msg")
				

				mensagem("Mensagem excluida com sucesso!","OK","bt_ok","sucesso");
				loading('final');
				

			}
			loading('final');
		}
		}).then(function(data) {
			if($("#CaixaDeEntrada").hasClass("estado_ativo"))
			{
				ListarCaixaEntrada(0,10);
			} else {
				ListarEnviadas('',0,10);
			}
			dataMensagens = null;
			dataMensagens 	=	getData("Mensagens", null);
			loading('final');
		});
	}
}

//------------------------------------------------------------------------------------------------------------------------

//Pegar ID Aluno pelo usuario

//function getAlunoByUsuario()
//{
//	for(var a=0; a<dataUsuario.length;a++)
//	{
//		if(usuario == "Aluno" && dataUsuario[a].aluno != null)
//		{
//			if(dataUsuario[a].idusuario == userID)
//			{
//				return dataUsuario[a].aluno.idAluno;
//			}
//		} else if(usuario == "Professor" && dataUsuario[a].professor != null){
//			 if(dataUsuario[a].idusuario == userID)
//			 {
//			 	return dataUsuario[a].professor.idprofessorFuncionario;
//			 }
//		}
//	}
//}


function getNomeByIdsUsuario(idsUsuarios, Numero){
	
	var idsSeparados = idsUsuarios.split(";");
	var valorRetornado = "";

	for(var a=0; a < idsSeparados.length; a++){
		if (idsSeparados[a] != ''){
			$.ajax({
				url: path + "Usuario/NomeUsuario/" + idsSeparados[a],
				async: false,
				crossDomain: true,
				type: "GET",
				success: function(data){
					valorRetornado += data.nome+"; ";
				}
			});
		}
		
		if(Numero == 1){
			$("#tela_over #Mensagem_wrapper #Nova_frame #destinatarios option[value='"+idsSeparados[a]+"']").prop("selected", true);
		}
	}
	return valorRetornado.substring(0,(valorRetornado.length - 2));
}

function limparCampos(){	//limpa os campos do formulario de enviar mensagem!!
	$('#tela_over #Mensagem_wrapper #Nova_frame #assunto').val('');
	$('#tela_over #Mensagem_wrapper #Nova_frame #mensagem').val('');
	$("#frm_Envia_Mensagens #destinatarios").val('')
	
	$('#pesquisaParaMensagem').val('');
	
	$('.ui-multiselect-checkboxes li').css('display','block');
	$(":checkbox").removeAttr('aria-selected');
//	 $(":checkbox").each(function(){
//		 $(this).removeAttr('checked');
//	 });
	$(":checkbox").removeAttr('checked');
	$(".ui-multiselect span").eq(1).text('Para');
}

