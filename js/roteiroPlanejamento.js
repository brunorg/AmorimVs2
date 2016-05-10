//Murano Design
//Get Usuario Efetivado
var userID = usuarioId;
if(usuario=="Aluno"){
	var alunoID = dadosUsuario.aluno.idAluno;	
}
var anoEstudo = getAnoEstudoByAluno(alunoID);
var PlanoEstudoSessionID = getUltimoPlanoEstudo();
//----------------------------------------------------------------------------------------------------------------
//Carrega a funçao de Load do JQuery

$(document).ready(function(){
    if(PlanoEstudoSessionID == 0 && usuario == "Aluno")
    {
        mensagemF("Primeiro, precisa criar um Plano de Estudo","OK","bt_ok","alerta","redirect();");
    }
    LoadRoteiro();
	
});

function redirect()
{
    window.location = 'planoDeEstudo.html';
}

//-----------------------------------------------------------------------------------------------------------------------------------------------

function verificaProducaoExistente(tipo, IDRoteiroLocal)
{
    var producao;

    $.ajax({
        url: path + "ProducaoAluno/alunoTipoProducao/"+ alunoID + "/" + IDRoteiroLocal + "/" + tipo,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(data){
            producao = data;
        }
    });

    return producao;

}

//-----------------------------------------------------------------------------------------------------------------------------------------------
function getUltimoPlanoEstudo(){
    var retorno;
    $.ajax({
        url: path+"PlanoEstudo/aluno/"+alunoID,
        type: "GET",
        async:false,
        dataType:"json",
        crossDomain: true,
        success: function(d) {
            retorno =d[0].idplanoEstudo;
        }
    }); 
    return retorno;
}

function abreCaixaFicha(idRoteiro){
    $(".boxGlobal").css("display","block");
    var dataFichaFinalizacao = getData("FichaFinalizacao", idRoteiro);
        
    var html = '<div id="caixaFicha">'+
            '<a href="#" id="fecharCaixa"><img src="img/cancela_x.png" width="15" height="15" onclick="fecharCaixa()";/></a>'+
            '<a class="caixaTxt" id="txt1" target="_blank" href="'+dataFichaFinalizacao[0].local+'">Responder ficha de finalização</a>'+ 
            '<a class="caixaTxt" id="txt2" onclick="showUpload(4,'+idRoteiro+');" href="#">Upload ficha de finalização</a>'+
            '</div>';
    $(".boxGlobal").html(html);
}

function fecharCaixa(){
    $(".boxGlobal").css("display","none");
}

function anoLetivo(){
    return ((new Date()).getFullYear());
}

function  anoLetivoId(){
    var idAnoLetivo;
    $.ajax({
        url: path + 'AnoLetivo/ano/' + (new Date()).getFullYear(),
        async: false,
        crossDomain: true,
        type: 'GET',
        beforeSend: function() {
            loading('inicial');
        },
        success: function(d) {
			console.log(d);
            idAnoLetivo = d;
        },
        complete: function() {
            loading('final');
        }
    });

    return idAnoLetivo;
}

function LoadRoteiro(){
    IncluirRoteirosPendentes();
    adicionaPortfoliosPendentes();
    IncluirRoteirosAnoAtual();
    IncluirTelaUpload();
}

function IncluirRoteirosAnoAtual () {
    var dataRoteiro;
    $.ajax({
        url: path + "Roteiro/RoteiroAno/" + anoEstudo.idanoEstudo,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(d) {
            dataRoteiro = d;
        }
    });
    
    for(var a = 0; a < dataRoteiro.length; a++){
        HtmlContent = "";
        HtmlContent += "<div class='Content_Roteiro_Aluno_"+dataRoteiro[a].idroteiro+"'>";   
            HtmlContent += "<div id='Roteiro_Id_"+dataRoteiro[a].idroteiro+"' class='roteiro_nome_tabela_selecionado'>"
                HtmlContent += "<div class='roteiro_nome_tabela_texto"+( (dataRoteiro[a].nome.length >= 63) ? ' roteiro_nome_grande' : '' )+"' onclick='ApareceObj("+dataRoteiro[a].idroteiro+")'>";
                    HtmlContent += "<span class='nome_"+dataRoteiro[a].idroteiro+"'>"+dataRoteiro[a].nome+"</span>";
                HtmlContent += "</div>";
                HtmlContent += "<span class='tabela_colorida_roteiro'>";
                HtmlContent += "<table>";
                    HtmlContent += "<tr class='QuadObj_"+dataRoteiro[a].idroteiro+"'>";
                    HtmlContent += "</tr>";
                HtmlContent += "</table>";
            HtmlContent += "</span>";
        HtmlContent += "</div>";


        $('.total').append(HtmlContent);
        getLinhaObjetivos(dataRoteiro[a].idroteiro);
        VerificaObjetivosCompletos(dataRoteiro[a].idroteiro);
        verificaTamanhoNome(dataRoteiro[a].idroteiro);

    } 
}

function adicionaPortfoliosPendentes () {
    $.ajax({
        url: path + "PendenciasProducaoAluno/PendenciasPassadoAluno/" + alunoID,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(data) {
            for (var i = 0; i < data.length; i++) {

                htmlProducao = '<td id="producaoTD">';
                if (data[i].portfolioCompleto == 0){
                    htmlProducao += '<div id="portfolio">';
                    htmlProducao +=     '<a style="text-align:right;color:white" onclick="showUpload(5,'+data[i].roteiro.idroteiro+');" href="#">';
                    htmlProducao +=         '<div class="botoesPortfolio portfolio">';
                    htmlProducao +=             'Portfólio';
                    htmlProducao +=         '</div>';
                    htmlProducao +=     '</a>';
                    htmlProducao += '</div>';
                }
                else{
                    var producao = verificaProducaoExistente(5, data[i].roteiro.idroteiro);
                    switch (getProducaoStatus(producao)){
                        case 1:
                        {
                            htmlProducao += ('<div class="excluir" id="ex_5_'+data[i].roteiro.idroteiro+'"><div class="iconeExcluir"></div>Portfólio</div>');
                            break;
                        }
                        case 2:
                        {
                            htmlProducao += ('<div class="botoesPortfolio portfolio">Portfólio<div class="icone observacao" onclick="responderObservacao('+producao.mensagens.idmensagens+')"></div></div>');
                            break;
                        }
                        case 3:
                        {
                            htmlProducao += ('<div class="botoesPortfolio portfolio">Portfólio<div class="icone corrigido"></div></div>');
                            break;
                        }
                    }
                }
                if (data[i].fichaFinalizacaoCompleta == 0){
                    htmlProducao += '<div id="ficha" class="fichaFinalizacao">';
                    htmlProducao +=     '<a style="text-align:right;color:white" onclick="abreCaixaFicha('+data[i].roteiro.idroteiro+');" href="#">';
                    htmlProducao +=         '<div class="botoesPortfolio ficha">';
                    htmlProducao +=             'Ficha de Finalização';
                    htmlProducao +=         '</div>';
                    htmlProducao +=     '</a>';
                    htmlProducao += '</div>';
                }
                else if (data[i].fichaFinalizacaoCompleta == 1){
                    var producao = verificaProducaoExistente(4, data[i].roteiro.idroteiro);
                    switch (getProducaoStatus(producao))
                    {
                        case 1:
                        {
                            htmlProducao += ('<div class="excluir" id="ex_4_'+data[i].roteiro.idroteiro+'"><div class="iconeExcluir"></div>Ficha de Finalização</div>');
                            break;
                        }
                        case 2:
                        {
                            htmlProducao += ('<div class="botoesPortfolio ficha">Ficha de Finalização<div class="icone observacao" onclick="responderObservacao('+producao.mensagens.idmensagens+')"></div></div>');
                            break;
                        }
                        case 3:
                        {
                            htmlProducao += ('<div class="botoesPortfolio ficha"> Ficha de Finalização<div class="icone corrigido"></div></div>');
                            break;
                        }
                    }
                }
                htmlProducao += '</td>';

                HtmlContent = "";
                HtmlContent += "<div class='Content_Roteiro_Aluno_"+data[i].roteiro.idroteiro+"'>";   
                    HtmlContent += "<div id='Roteiro_Id_"+data[i].roteiro.idroteiro+"' class='roteiro_nome_tabela_anterior'>"
                        HtmlContent += "<div class='roteiro_nome_tabela_texto"+( (data[i].roteiro.nome.length >= 63) ? ' roteiro_nome_grande' : '' ) + "'>";
                            HtmlContent += "<span class='nome_"+data[i].roteiro.idroteiro+"'>"+data[i].roteiro.nome+"</span>";
                        HtmlContent += "</div>";
                        HtmlContent += "<span class='tabela_colorida_roteiro'>";
                        HtmlContent += "<table>";
                            HtmlContent += "<tr class='QuadObj_"+data[i].roteiro.idroteiro+"'>";
                            HtmlContent += htmlProducao
                            HtmlContent += "</tr>";
                        HtmlContent += "</table>";
                    HtmlContent += "</span>";
                HtmlContent += "</div>";


                $('.total').append(HtmlContent);
                verificaTamanhoNome(dataRoteiro[a].idroteiro);
            }
        }
    });
}

function verificaTamanhoNome (idRoteiro) 
{
    var roteiro = $('#Roteiro_Id_'+idRoteiro);
    var tamanhoRot  = parseInt( $(roteiro).css('width').split('p',1) );
    var tamanhoNome = parseInt( $(roteiro).children('.roteiro_nome_tabela_texto').css('width').split('p',1) );
    var tamanhoObjs = parseInt( $(roteiro).children('.tabela_colorida_roteiro').css('width').split('p',1) );

    if ( tamanhoRot - tamanhoObjs < tamanhoNome )
    {   
        var diferenca = (tamanhoRot - tamanhoObjs - tamanhoNome);
        var div = $(roteiro).children('.roteiro_nome_tabela_texto');
        var texto = $(roteiro).children('.roteiro_nome_tabela_texto').text();
        $(div).css('width', (tamanhoRot - tamanhoObjs - 10)+'px');

        $(div).mouseover(function(){
            $(this).find('span').css('position','relative');
            $(this).find('span').animate({
                left: diferenca+'px'
            },1000, function() {
                setTimeout(function(){
                    $(div).find('span').css('left','0px');
                    $(div).find('span').css('position','');
                },1000
                )
            });
        });
    }
}

function VerificaObjetivosCompletos(idRoteiro)
{
    var roteiroAtualId = '#Roteiro_Id_' + idRoteiro;
    var numeroObjetivosNaoCompletos = $(roteiroAtualId + ' .td_roteiro_verde,' + roteiroAtualId + ' .td_roteiro_laranja,' + roteiroAtualId + ' .td_roteiro_branco').length;

    if(!(numeroObjetivosNaoCompletos > 0))
    {
        SubstituirObjetivos(idRoteiro);
    }
}

function SubstituirObjetivos(idRoteiro)
{
    $('.QuadObj_' + idRoteiro).empty();
    var PortifolioExistenteUpload   = verificaProducaoExistente(5, idRoteiro);
    var FichasExistenteUpload       = verificaProducaoExistente(4, idRoteiro);
    HtmlContent = "";
    HtmlContent += ('<td id="producaoTD">');
	verificaPendencias(alunoID,idRoteiro);
    switch (getProducaoStatus(PortifolioExistenteUpload))
    {
        case 0:
        {
            HtmlContent += ('<div id="portfolio"><a style="text-align:right;color:white" onclick="showUpload(5,'+idRoteiro+');" href="#"><div class="botoesPortfolio portfolio">Portfólio </div></a></div>');
            break;
        }
        case 1:
        {
            HtmlContent += ('<div class="excluir" id="ex_5_'+idRoteiro+'"><div class="iconeExcluir"></div>Portfólio</div>');
            break;
        }
        case 2:
        {
            HtmlContent += ('<div class="botoesPortfolio portfolio">Portfólio<div class="icone observacao" onclick="responderObservacao('+PortifolioExistenteUpload.mensagens.idmensagens+')"></div></div>');
            break;
        }
        case 3:
        {
            HtmlContent += ('<div class="botoesPortfolio portfolio">Portfólio<div class="icone corrigido"></div></div>');
            break;
        }
    }
    var existeFicha;
    $.ajax({
        url: path + "FichaFinalizacao/" + idRoteiro,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(data){
            existeFicha = data;
        }
    });
    if (existeFicha.length > 0)
    {
        switch (getProducaoStatus(FichasExistenteUpload))
        {
            case 0:
            {
                HtmlContent += ('<div id="ficha" class="fichaFinalizacao"><a href="#" style="text-align:right;color:white" onclick="abreCaixaFicha('+idRoteiro+');"><div class="botoesPortfolio ficha">Ficha de Finalização</div></a></div>');
                break;
            }
            case 1:
            {''
                HtmlContent += ('<div class="excluir" id="ex_4_'+idRoteiro+'"><div class="iconeExcluir"></div>Ficha de Finalização</div>');
                break;
            }
            case 2:
            {
                HtmlContent += ('<div class="botoesPortfolio ficha">Ficha de Finalização<div class="icone observacao" onclick="responderObservacao('+FichasExistenteUpload.mensagens.idmensagens+')"></div></div>');
                break;
            }
            case 3:
            {
                HtmlContent += ('<div class="botoesPortfolio ficha"> Ficha de Finalização<div class="icone corrigido"></div></div>');
                break;
            }
        }
    }
    HtmlContent += ("</td>");
    $('.QuadObj_' + idRoteiro).append(HtmlContent); 

	setTimeout(function(){
		excluirProducaoConfirm();
	}, 1000);
}

function verificaPendencias(alunoID,roteiroID){
	$.ajax({
		url : path+"PendenciasProducaoAluno/ExistePendencia/"+alunoID+"/"+roteiroID,
		type:"GET",
		dataType: 'json',
		async: false,		
		success: function(d){
			if(d==0){
				$.ajax({
					url : path+"PendenciasProducaoAluno/",
					type:"POST",
					crossDomain: true,
					dataType: 'json',
					async: false,
					data: "action=create&idaluno="+alunoID+"&idroteiro="+roteiroID,		
					success: function(d){
						//console.log("salvou pendencia");	
					},
				})
			}	
		},
	})		
}

function IncluirRoteirosPendentes () {
    var dataRoteiro = Array();
    $.ajax({
        url: path + "Roteiro/RoteiroAluno/" + alunoID + "/" + anoLetivo(),
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(d) {
            for (var a = 0; a < d.length; a++)
                dataRoteiro.push(d[a].roteiro);
        }
    });

    dataRoteiro.reverse();
    
    for(var a = 0; a < dataRoteiro.length; a++){
        if (dataRoteiro[a].anoEstudo.ano < anoEstudo.ano)
        {
            HtmlContent = "";
            HtmlContent += "<div class='Content_Roteiro_Aluno_"+dataRoteiro[a].idroteiro+"'>";   
                HtmlContent += "<div id='Roteiro_Id_"+dataRoteiro[a].idroteiro+"' class='roteiro_nome_tabela_anterior'>";
                    HtmlContent += "<div class='roteiro_nome_tabela_texto' onclick='ApareceObj("+dataRoteiro[a].idroteiro+")'>";
                        HtmlContent += dataRoteiro[a].nome;
                    HtmlContent += "</div>";
                    HtmlContent += "<div class='tabela_colorida_roteiro'>";
                    HtmlContent += "<table>";
                        HtmlContent += "<tr class='QuadObj_"+dataRoteiro[a].idroteiro+"'>";
                        HtmlContent += "</tr>";
                    HtmlContent += "</table>";
                HtmlContent += "</div>";
            HtmlContent += "</div>";
            
            $('.total').prepend(HtmlContent);
        }
        else
        {
            HtmlContent = "";
            HtmlContent += "<div class='Content_Roteiro_Aluno_"+dataRoteiro[a].idroteiro+"'>";   
                HtmlContent += "<div id='Roteiro_Id_"+dataRoteiro[a].idroteiro+"' class='roteiro_nome_tabela_atribuido'>";
                    HtmlContent += "<div class='roteiro_nome_tabela_texto' onclick='ApareceObj("+dataRoteiro[a].idroteiro+")'>";
                        HtmlContent += dataRoteiro[a].nome;
                    HtmlContent += "</div>";
                    HtmlContent += "<div class='tabela_colorida_roteiro'>";
                    HtmlContent += "<table>";
                        HtmlContent += "<tr class='QuadObj_"+dataRoteiro[a].idroteiro+"'>";
                        HtmlContent += "</tr>";
                    HtmlContent += "</table>";
                HtmlContent += "</div>";
            HtmlContent += "</div>";
            
            $('.total').append(HtmlContent);
        }      
        getLinhaObjetivos(dataRoteiro[a].idroteiro);
        VerificaObjetivosCompletos(dataRoteiro[a].idroteiro);
        verificaTamanhoNome(dataRoteiro[a].idroteiro);
    }
}

function IncluirTelaUpload () {
    $("#Arquivo_Foto_Aluno").change(function(e){
        $("#LegendaUpload").html("Arquivo Carregado");
    });
}

//-------------------------------------------------------------------------------------------------------------------------------------

function SalvarPortifolio(tipoProducao, roteiroAcionado){
    var dataSalvaPortifolio = new Date();   
    var tamanhoArquivo;
    if(localStorage.getItem("tamanhoArquivo")){
        tamanhoArquivo = localStorage.getItem("tamanhoArquivo");
    }
    if(tamanhoArquivo == "menor"){
        if(Arquivo != "" && Arquivo != undefined) { 
            $.ajax({
                url: path+"ProducaoAluno/",
                type: "POST",
				async: true,
                crossDomain: true,  
                data: "action=create&anoLetivo="+anoLetivoId()+"&texto="+$('#Roteiro_Id_'+roteiroAcionado+' .roteiro_nome_tabela_texto').text()+"&data="+dataSalvaPortifolio.getUTCFullYear()+"-"+(dataSalvaPortifolio.getUTCMonth()+1)+"-"+dataSalvaPortifolio.getUTCDate()+"&aluno="+alunoID+"&tipo="+tipoProducao+"&categoria=1&roteiro="+roteiroAcionado,    
                beforeSend: function(){
					$('#Dados_Foto_Aluno').val('');
					$('#Arquivo_Foto_Aluno').val('');
					$('#foto').css("background-image","url(img/foto.png)");
					$("#LegendaUpload").html("Aguardando Arquivo");
					if (tipoProducao  == 5)
					{
						$('.blackPainel').css('display', 'none')
						$('.QuadObj_'+roteiroAcionado+ ' .portfolio').append('<div class="icone entregue"></div>');
						$('.QuadObj_'+roteiroAcionado+ ' a').prop('onclick',null).off('click');
						
						//esse código foi comentado pois o upload de capa vai ser feito somente pela página inicial
						//Favor não apagar o código comentado
						//mensagem("Arquivo enviado com sucesso! Subir capa?","Cancelar","bt_cancelar","confirm",'',ID,"SubirCapa");				
					}
					else
					{
						$('.QuadObj_'+roteiroAcionado+ ' .ficha').append('<div class="icone entregue"></div>');
						$('.QuadObj_'+roteiroAcionado+ ' a').prop('onclick',null).off('click');
						//esse código foi comentado pois o upload de capa vai ser feito somente pela página inicial
						//Favor não apagar o código comentado
						//mensagem("Arquivo enviado com sucesso!","OK","bt_ok","sucesso");
					}  
					mensagem("Arquivo enviado com sucesso!","OK","bt_ok","sucesso");  
                }, 
                success: function(d) {
                    addFileTo(d, roteiroAcionado,tipoProducao);
                    var tipo;					
					if (tipoProducao == 5)
                        tipo = "Portfolio";
                    else
                        tipo = "FichaFinalizacao";
					$.ajax({
						url: path+"PendenciasProducaoAluno/Entregar"+tipo+"/"+ alunoID + "/" + roteiroAcionado,
						async: true,
						type: "GET",
						success: function(d){
							console.log("Entregou com sucesso!");
						}
					});  
                    $('.blackPainel').hide();   
                },
                complete: function () {
                    loading("final");
                }
            }); 
        } else {
            mensagem("Insira um arquivo!","OK","bt_ok","alerta");
        }
        localStorage.setItem("tamanhoArquivo","");
    }else{
        localStorage.setItem("tamanhoArquivo","");
        mensagem("Tamanho máximo permitido 30Mb!","OK","bt_ok","alerta");   
    }
    
}


function excluirProducaoConfirm(){
	$(".excluir").click(function(){
		var roteiroTipo = $(this).attr("id");
		roteiroTipo = roteiroTipo.split("_");
		var tipo = roteiroTipo[1];
		var roteiro = roteiroTipo[2];
		
		mensagem("Deseja realmente excluir?","Cancelar","bt_cancelar","confirm",tipo,roteiro,"excluirProducao");
	});	
}

function excluirProducao(tipo, roteiro){
	var htmlNovo="";
	$.ajax({
		url: path+"ProducaoAluno/DeletarProducaoAluno/"+alunoID+"/"+roteiro+"/"+tipo,
		type:"GET",
		async:false,
		beforeSend: function(){
			loading("inicial");
		},
		success: function(d){
			var msg;
			if(tipo == 4){
				msg = "Ficha de finalização excluída com sucesso!";
				htmlNovo = '<a href="#" style="text-align:right;color:white" onclick="abreCaixaFicha('+roteiro+');"><div class="botoesPortfolio ficha">Ficha de Finalização</div></a>';
				$('.QuadObj_'+roteiro+' #ficha').html(htmlNovo); 
			}else{			
				msg = "Portfólio excluído com sucesso!";
				htmlNovo = '<a style="text-align:right;color:white" onclick="showUpload(5,'+roteiro+');" href="#"><div class="botoesPortfolio portfolio">Portfólio </div></a>';
				$('.QuadObj_'+roteiro+' #portfolio').html(htmlNovo); 
			}			
				            
			mensagem(msg,"OK","bt_ok","sucesso");
		},
		complete: function(){
			loading("final");	
		}
	});
}

function addFileTo(ID, roteiroAcionado,tipoProducao){
    var formData = new FormData($('#Cadastro_Producao_Aluno')[0]);
    formData.append("arquivo", Arquivo);

    $.ajax({
        url: path+"ProducaoAluno/upload/producaoAluno/arquivo/"+ID,
        type: "POST",
        mimeType:"multipart/form-data",
        contentType: false,
        cache: false,
		async:true,
        processData:false,
        data: formData,
        dataType: 'json',    
        success: function(d) {
            if(tipoProducao == 5){
				$('.QuadObj_'+roteiroAcionado+' .portfolio').html('<div class="excluir" id="ex_5_'+roteiroAcionado+'"><div class="iconeExcluir"></div>Portfólio</div>');
			}else{
				$('.QuadObj_'+roteiroAcionado+' .ficha').html('<div class="excluir" id="ex_4_'+roteiroAcionado+'"><div class="iconeExcluir"></div>Ficha de Finalização</div>');
			}			
			//chama a função para o html que acabou de ser criado
			setTimeout(function(){excluirProducaoConfirm();}, 1000);               
        },error: function() {
            mensagem("Erro ao enviar arquivo!","OK","bt_ok","erro");
        },
    }); 
}


 //---------------------------------Importante-------------------------------------------//
 
//esse código foi comentado pois o upload de capa vai ser feito somente pela página inicial
//Favor não apagar o código comentado

/*function SubirCapa(servico, id){

    $("#boxMensagemGeral").css("display","none");

    var HtmlContentUpload = '<div id="JanelaUploadPortifolio">'+
                                '<div class="Titulo_janela_upload">'+
                                    'Upload de Capa'+
                                    '<div class="close_upload_producao">'+
                                    '</div>'+
                                '</div>'+
                                '<div id="foto">'+
                                '</div>'+
                                '<div id="LegendaUpload">Aguardando Arquivo</div>'+
                                '<form id="Cadastro_Producao_Aluno">'+
                                    '<input type="hidden" id="id" name="id"/>'+
                                    '<input type="hidden" id="action" name="action" value="create" />'+
                                    '<input type="hidden" id="Dados_Foto_Capa" />'+
                                    '<input type="file" id="Arquivo_Foto_Capa" name="arquivo1" style="display:none"/>'+
                                    '<div class="campoConfirmaUpload">'+
                                        '<input class="btn_submit" onclick="SalvarCapa('+id+')" type="button" value="" />'+
                                    '</div>'+
                                '</form>'+
                            '</div>';

    $('.blackPainel').html(HtmlContentUpload);
    $('.blackPainel').css('display', 'block');

    GerarUpload($("#foto"), $("#Arquivo_Foto_Capa"), $("#Dados_Foto_Capa"));

    $('.close_upload_producao').click(function(){
            $('.blackPainel').hide();
            $('#Dados_Foto_Aluno').val('');
            $('#Arquivo_Foto_Aluno').val('');
            $('#foto').css("background-image","url(img/foto.png)");
            $("#LegendaUpload").html("Aguardando Arquivo");
    });
}

function SalvarCapa (id) {
    var formData = new FormData($('#Cadastro_Producao_Aluno')[0]);
    formData.append("fotoAluno", Arquivo);

    $.ajax({
        url: path+"ProducaoAluno/upload/capa/"+id,
        type: "POST",
        mimeType:"multipart/form-data",
        contentType: false,
        cache: false,
        processData:false,
        data: formData, 
        beforeSend: function() {
            loading('inicial');
        },     
        success: function(d) {
            $('.blackPainel').css('display', 'none');
            mensagem("Arquivo enviado com sucesso!","OK","bt_ok","sucesso");        
        },error: function() {
            mensagem("Erro ao enviar arquivo!","OK","bt_ok","erro");
        },
        complete: function() {
            loading('final');
        }
    });
}*/

//-----------------------------------------------------------------------------------------------------------------------------------------------

function showUpload(tipo, ID)
{
    $(".boxGlobal").css("display","none");

    var HtmlContentUpload = '<div id="JanelaUploadPortifolio">'+
                                '<div class="Titulo_janela_upload">'+
                                '</div>'+
                                '<div id="foto">'+
                                '</div>'+
                                '<div id="LegendaUpload">Aguardando Arquivo</div>'+
                                '<form id="Cadastro_Producao_Aluno">'+
                                    '<input type="hidden" id="id" name="id" />'+
                                    '<input type="hidden" id="action" name="action" value="create" />'+
                                    '<input type="hidden" id="Dados_Foto_Aluno" />'+
                                    '<input type="file" id="Arquivo_Foto_Aluno" name="arquivo1" />'+
                                    '<div class="campoConfirmaUpload">'+
                                        '<input class="btn_submit" onclick="SalvarPortifolio('+tipo+', '+ID+')" type="button" value="" />'+
                                    '</div>'+
                                '</form>'+
                            '</div>';

    $('.blackPainel').html(HtmlContentUpload);

    GerarUpload($("#foto"), $("#Arquivo_Foto_Aluno"), $("#Dados_Foto_Aluno"));

    if(tipo == 5)
    {
        HtmlContentUpload = 'Upload de Portfólio'+
                                    '<div class="close_upload_producao">'+
                            '</div>';
        $('.Titulo_janela_upload').html(HtmlContentUpload)

        $('.blackPainel').css("display","block");
        $('.close_upload_producao').click(function(){
            $('.blackPainel').hide();
            $('#Dados_Foto_Aluno').val('');
            $('#Arquivo_Foto_Aluno').val('');
            $('#foto').css("background-image","url(img/foto.png)");
            $("#LegendaUpload").html("Aguardando Arquivo");
        });
    }

    else if(tipo == 4)
    {
        HtmlContentUpload = 'Upload de Fichas de Finalização'+
                                    '<div class="close_upload_producao">'+
                            '</div>';
        $('.Titulo_janela_upload').html(HtmlContentUpload)
        $('.blackPainel').css("display","block");
        $('.close_upload_producao').click(function(){
            $('.blackPainel').hide();
            $('#Dados_Foto_Aluno').val('');
            $('#Arquivo_Foto_Aluno').val('');
            $('#foto').css("background-image","url(img/foto.png)");
            $("#LegendaUpload").html("Aguardando Arquivo");
        });
    }
}
         
//-----------------------------------------------------------------------------------------------------------------------------------------------

function getRecursosDeRoteiro(ID)
{
    var Retorno = "";
    $.ajax({
        url: path + 'RecursoAprendizagem/listarProRoteiro/' + ID,
        async: false,
        crossDomain: true,
        type: 'GET',
        beforeSend: function() {
            loading('inicial');
        },
        success: function (dataRecursoAprendizagem) {
            for(var a=0; a< dataRecursoAprendizagem.length; a++)
            {
                switch (dataRecursoAprendizagem[a].tipoRecursoAprendizagem.idtipoRecursoAprendizagem)
                {
                    case 1:imagem ="ic_livro2_peq.png";break;
                    case 2:imagem ="ic_video_peq";break;
                    case 3:imagem ="ic_audio_peq";break;
                    case 4:imagem ="ic_pgweb_peq";break;
                    case 5:imagem ="ic_jogo_peq";break;
                    case 6:imagem ="ic_foto_peq";break;
                }   
                Retorno += "<tr>";
                Retorno += "<td class='titulo_recurso'>";
                Retorno += "<img src='img/"+imagem+".png' width='15' height='auto' alt='"+dataRecursoAprendizagem[a].descricaoRecurso+"'/><a href='"+dataRecursoAprendizagem[a].link+"'>"+dataRecursoAprendizagem[a].nomeRecurso+"</a>";
                Retorno += "</td>";
                Retorno += "</tr>";
            }
        },
        complete: function() {
            loading('final');
        }
    });

    return Retorno;
}

function getProducaoStatus (Producao) {
	if(typeof Producao != 'undefined'){
    	return Producao[Object.keys(Producao)[0]];
	}
}


//-----------------------------------------------------------------------------------------------------------------------------------------------

function trocarObjetivoStatus(Objeto, IDobjetivo, IDplanoEstudo, IDplanejamentoRoteiro){
    var corVariavel;
    var action;
    var statusVariavel;

    var data = new Date();
    var dataAtual = (data.getFullYear()+"-"+(data.getMonth()+1)+"-"+data.getDate());

    switch(Objeto.className)
    {
        case ("titulo_infos_roteiro_caixa_branco"):
        {
            $.ajax({
                url: path+"PlanejamentoRoteiro/",
                type: "POST",
                crossDomain: true,
                dataType: 'json',
                data: "id=1&action=create&status=1&dataStatusPlanejado="+dataAtual+"&objetivo="+IDobjetivo+"&planoEstudo="+PlanoEstudoSessionID+"&idAluno="+alunoID,
                beforeSend: function(){
                    loading("inicial");
                },
                success: function(d) {
                document.getElementById('td_roteiro_squr_'+IDobjetivo).className = "td_roteiro_laranja";
                    Objeto.className = "titulo_infos_roteiro_caixa_laranja";
                    reSetObjetivo(IDobjetivo);
                    
                    
                },error: function(a, b , c) {
                   mensagem("Erro ao criar Planajamento!","OK","bt_ok","erro");
                },
                complete: function(){
                    loading("final");
                }
            });
            break;
        }

        case ("titulo_infos_roteiro_caixa_laranja"):
        {
            var deletaEntregaFunctions = ['entregarPlanejamento', 'deletarPlanejamento'];
            mensagem("Deseja excluir ou entregar esse planejamento?", "Entregar","Excluir","opcao", IDplanejamentoRoteiro, IDobjetivo, deletaEntregaFunctions);
            break;
        }

    }
}

function entregarPlanejamento (IDplanejamentoRoteiro, IDobjetivo) {
	$("#boxMensagemGeral").css("display","none");
    $.ajax({
        url: path+"PlanejamentoRoteiro/StatusPlanejamento",
        type: "POST",
        crossDomain: true,
        data: "id="+IDplanejamentoRoteiro+"&status=2",             
       /* data: "id="+IDplanejamentoRoteiro+"&action=update&"+(statusVariavel == 1 ? "dataStatusPlanejado="+dataAtual+"&":"dataStatusEntregue="+dataAtual+"&")+"status="+statusVariavel+"&objetivo="+IDobjetivo+"&planoEstudo="+PlanoEstudoSessionID+"&idAluno="+alunoID,*/
        beforeSend: function(){
            loading("inicial");
        },
        success: function(d) {
            document.getElementById('td_roteiro_squr_'+IDobjetivo).className = "td_roteiro_verde";
            document.getElementById('td_objetivo_squr_'+IDobjetivo).className = "titulo_infos_roteiro_caixa_verde";
            $( "#boxMensagemGeral" ).hide();
        },error: function() {
            $( "#boxMensagemGeral" ).hide();
            alert("Não modificado, verifique os campos");
        },
        complete: function(){
            loading("final");
        }
    }); 
}

function deletarPlanejamento(IDplanejamentoRoteiro, IDobjetivo){
    $.ajax({
        type: "GET",
        crossDomain: true,
        dataType:"text",
        async: false,
        url: path+"PlanejamentoRoteiro/delete/"+IDplanejamentoRoteiro,
        statusCode: {
            405: function() {
                $('#td_objetivo_squr_'+IDobjetivo).removeClass('titulo_infos_roteiro_caixa_laranja').addClass('titulo_infos_roteiro_caixa_branco');
                $('#td_roteiro_squr_'+IDobjetivo).removeClass('td_roteiro_laranja').addClass('td_roteiro_branco');    
                $("#boxMensagemGeral").css("display","none");
            }
        }
    });     
}

function getLinhaObjetivos (idRoteiro) {
    $.ajax({
        url: path + "Objetivo/ListaObjetivoHash/" + alunoID + "/" + idRoteiro + "/" + PlanoEstudoSessionID,
        async: false,
        crossDomain: true,
        type: "GET",
        beforeSend: function() {
            loading('inicial');
        },
        success: function(dataListaObjetivos) {
            var dataObjetivosRoteiro = Array();
            for (var a = 0; a < dataListaObjetivos.length - 2; a += 3)
            {
                var object = {idObjetivo : dataListaObjetivos[a], Numero : dataListaObjetivos[a+1], Status : dataListaObjetivos[a+2]};
                dataObjetivosRoteiro.push(object);
            }
            dataObjetivosRoteiro.sort(function(a, b){
                return (parseInt(a.Numero) - parseInt(b.Numero));
            });
            for (var a = 0; a < dataObjetivosRoteiro.length; a ++)
            {
                var HtmlContent = '';
                var cor;
                switch(dataObjetivosRoteiro[a].Status)
                {
                    case ("0"):
                    {
                        cor = "branco";
                        break;
                    }
                    case ("1"):
                    {
                        cor = "laranja";
                        break;
                    }
                    case ("2"):
                    {
                        cor = "verde";
                        break;
                    }
                    case ("3"):
                    {
                        cor = "verde_tk";
                        break;
                    }
                }
                HtmlContent += '<td class="td_roteiro_'+cor+'" id="td_roteiro_squr_'+dataObjetivosRoteiro[a].idObjetivo+'" status="'+dataObjetivosRoteiro[a].Status+'">'+dataObjetivosRoteiro[a].Numero+'</td>';
                if ($('#td_roteiro_squr_'+dataObjetivosRoteiro[a].idObjetivo).length < 1)
                {
                    $('.QuadObj_'+idRoteiro).append(HtmlContent);
                }
                else
                {
                    if (dataObjetivosRoteiro[a].Status > $('#td_roteiro_squr_'+dataObjetivosRoteiro[a].idObjetivo).attr('status'))
                    {
                        $('#td_roteiro_squr_'+dataObjetivosRoteiro[a].idObjetivo).removeClass('td_roteiro_laranja');
                        $('#td_roteiro_squr_'+dataObjetivosRoteiro[a].idObjetivo).removeClass('td_roteiro_verde');
                        $('#td_roteiro_squr_'+dataObjetivosRoteiro[a].idObjetivo).removeClass('td_roteiro_branco');
                        $('#td_roteiro_squr_'+dataObjetivosRoteiro[a].idObjetivo).addClass('td_roteiro_' + cor);
                        $('#td_roteiro_squr_'+dataObjetivosRoteiro[a].idObjetivo).attr('status', dataObjetivosRoteiro[a].Status);
                    }
                }
            }
        },
        complete: function() {
            loading('final');
        }
    });

}


function ApareceObj(idRoteiro)
{

    //verifica se o roteiro está vazio
    if (!($('.Content_Roteiro_Aluno_'+ idRoteiro + ' .ObjLeft').length > 0))
    {
        $.ajax({
            url: path+"Objetivo/ObjetivoRoteiro/"+idRoteiro,
            type: "GET",
            async:false,
            crossDomain: true,
            beforeSend: function() {
                loading('inicial');
            },
            success: function(dataObjetivoByRoteiro)
            {
                var RetornoHtml = '';
                for (var a = 0; a < dataObjetivoByRoteiro.length; a++)
                {
                    $.ajax({
                        url: path+"PlanejamentoRoteiro/alunoPendente/"+alunoID+"/"+dataObjetivoByRoteiro[a].idobjetivo,
                        type: "GET",
                        async:false,
                        crossDomain: true,
                        success: function(dataPlanejamentoRoteiro){
                            var statusAtual = "0";
                            var IDplanejamentoRoteiro;
                            for (var b = 0; b < dataPlanejamentoRoteiro.length; b++)
                            {
                                if ((dataPlanejamentoRoteiro[b].status == "1") && dataPlanejamentoRoteiro[b].planoEstudo.idplanoEstudo!= PlanoEstudoSessionID)
                                {
                                }
                                else if (dataPlanejamentoRoteiro[b].status > statusAtual)
                                {
                                    statusAtual = dataPlanejamentoRoteiro[b].status;
                                    IDplanejamentoRoteiro = dataPlanejamentoRoteiro[b].idplanejamentoRoteiro;
                                }
                            }

                            var Cor;

                            switch (statusAtual)
                            {
                                case("0"):
                                {
                                    Cor = 'branco';
                                    break;
                                }
                                case("1"):
                                {
                                    Cor = 'laranja';
                                    break;
                                }
                                case("2"):
                                {
                                    Cor = 'verde';
                                    break;
                                }
                                case("3"):
                                {
                                    Cor = 'verde_tk';
                                    break;
                                }
                            }

                            RetornoHtml +=  '<div class="ObjLeft Obj_'+dataObjetivoByRoteiro[a].idobjetivo+'">'+
                                                '<div class="titulo_infos_roteiro">'+
                                                    '<div class="td_roteiro_numero_tabela">'+
                                                        dataObjetivoByRoteiro[a].numero+
                                                    '</div>'+
                                                    '<div class="td_titulo_tabela">'+
                                                        '<a onclick="ApareceAtiv('+dataObjetivoByRoteiro[a].idobjetivo+')">'+
                                                            dataObjetivoByRoteiro[a].nome+
                                                        '</a>'+
                                                        '<div class="titulo_infos_roteiro_botoes">'+
                                                            '<div id="ObjStatus_'+dataObjetivoByRoteiro[a].idobjetivo+'" class="titulo_infos_roteiro_estrela">'+
                                                                '<div onclick="trocarObjetivoStatus(this,'+dataObjetivoByRoteiro[a].idobjetivo+','+(PlanoEstudoSessionID)+','+IDplanejamentoRoteiro+');" class="titulo_infos_roteiro_caixa_'+Cor+'" id="td_objetivo_squr_'+dataObjetivoByRoteiro[a].idobjetivo+'" >'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>';
                        }
                    });
                }
                RetornoHtml +=  '<div class="box_rigth box_'+idRoteiro+'">'+  
                                    '<div class="td_titulo_recurso">Recursos de aprendizagem</div>'+
                                    '<table class="tb_right">'+
                                        getRecursosDeRoteiro(idRoteiro)+
                                    '</table>'+
                                '</div>'+
                                '<div style="clear:both;"></div>';

                $('.Content_Roteiro_Aluno_'+idRoteiro).append(RetornoHtml);
            },
            complete: function() {
                loading('final');
            }
        });
    }
    $('.Content_Roteiro_Aluno_'+ idRoteiro + ' .ObjLeft').toggle();
    $('.Content_Roteiro_Aluno_'+ idRoteiro + ' .box_rigth').toggle();
}

function ApareceAtiv (idObjetivo) {
    if (!($('.Obj_' + idObjetivo + ' .conteudo_do_roteiro').length > 0))
    {
        $.ajax({
            url: path + 'Atividade/atividadeObjetivo/' + idObjetivo,
            async: false,
            crossDomain: true,
            type: 'GET',
            beforeSend: function() {
                loading('inicial');
            },
            success: function(dataAtividade) {
                for(var a = 0; a < dataAtividade.length; a++)
                {
                    var paginaAtividade;
                    var HtmlContent = '';

                    if(dataAtividade[a].paginaLivro == "")
                    {
                        paginaAtividade = "";
                    }
                    else
                    {
                        paginaAtividade = ", p. " + dataAtividade[a].paginaLivro;
                    }

                    HtmlContent +=  "<div class='conteudo_do_roteiro ativ_"+dataAtividade[a].idatividade+"'>" +
                                        "<table class='TbAtiv'>" +
                                            "<tr>" +
                                                "<td class='td_ativ'>" +
                                                    dataAtividade[a].descricao+
                                                    paginaAtividade +
                                                "</td>" +
                                            "</tr>" +
                                        "</table>" +
                                    "</div>";    
                    $('.Obj_'+idObjetivo).append(HtmlContent);
                    
                }
            },
            complete: function() {
                loading('final');
            }
        });
    }
    $('.Obj_' + idObjetivo + ' .conteudo_do_roteiro').toggle();
}

function getAnoEstudoByAluno(alunoID)
{   
    var retorno;
    $.ajax({
        url: path+"AnoEstudo/AnoEstudoAlunoVariavel/"+alunoID,
        type: "GET",
        async:false,
        crossDomain: true,
        success: function(d) {
            retorno = d[0];
        },error: function() {
            retorno = "erro";
        }
    });
    return retorno;     
}

function reSetObjetivo(IDObjetivo)
{
    var IDRoteiro = (($('#td_roteiro_squr_'+IDObjetivo).parent().attr("class")).substring(8));
    var IDplanejRoteiro;

    $.ajax({
    type: "GET",
    async: false,
    crossDomain: true,
    url: path+"PlanejamentoRoteiro/aluno/" + alunoID                    
    }).then(function(data) {

        for(var a=0; a< data.length; a++){
        
            if(data[a].objetivo.idobjetivo == IDObjetivo)
            {
                IDplanejRoteiro = data[a].idplanejamentoRoteiro;
            }
        }

    });
    $('#td_objetivo_squr_'+IDObjetivo).attr('onclick', 'trocarObjetivoStatus(this,'+IDObjetivo+','+PlanoEstudoSessionID+','+IDplanejRoteiro+')');

}

function responderObservacao (idMensagem) {
    localStorage.setItem("respostaObservacao", idMensagem);
    window.location.href = "mensagens.html";
}