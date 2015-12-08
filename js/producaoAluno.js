//Murano Design

//------------------------------------------------------------------------------------------------------------------------

//Variáveis globais para navegação
var navItens;
var contentItens;
var oficinasLista;
var oficinasItens;

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

	var aluno=1;
    var UsuarioAtivo = 2;
	var tipoArquivo = '';
	var categoria = '';

//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD

var dataUsuario 		=	getData("Usuario", null);
var dataProducaoAluno 	=	getData("ProducaoAluno", null);

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

var userID = usuarioId;
var alunoID = getAlunoByUsuario();


//var tipoSelecao = base64_decode(GetURLParameter('tipoProducao'));
var tipoSelecao = GetURLParameter('tipoProducao');

//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery

$(document).ready(function(){
	
	var cats = getData("CategoriaProducaoAluno", null);
	htmlCat = '';
	for(i=0;i<cats.length;i++){
		htmlCat += '<div class="infoValueP BorderBottom " style="height: 42px"> '+cats[i].categoria+' </div> <div class="inputImg tipoP BorderBottom categoria" style="height: 42px " value="'+cats[i].idcategoriaProducaoAluno+'"> </div>';
	}
	$('#opcoesCategoria').html(htmlCat);
	
	$(".categoria").click(function(){
		$("div.categoria").css("background-position","0px 0px");
		$(this).css("background-position","-39px 0px");
		categoria = $(this).attr('value');
		console.log(categoria);
	});
	console.log(categoria);
	$("div.inputImg").not(".vazio, .categoria").click(function(){
		$("div.inputImg").not('.categoria').css("background-position","0px 0px");
		$(this).css("background-position","-39px 0px");
		
		tipoArquivo = $(this).attr('value');
		
		if (tipoArquivo == 'video'){
			 $("#arquivo").hide();
			 $("#link").show();
		}else {
			 $("#link").hide();
			 $("#arquivo").show();
		}
		
		return false;
	
	});
	
	/*$("li").click(function(){
		if($(this).html().length != 1){
		$("#menu_lateral li").css("background", "#ECEBE5");
		$(this).css("background-color", "#D6E5A9");
			$('.imagem_objeto').filter(function() {
			    var element = $(this);

			    if(element.css('display') == 'none') {
			        element.remove();
			        return false;
			    }

			    return true;
			}).css("background-image","url(data:image/gif;base64,"+($(this).attr("ImgSelect"))+")")
		}
	});*/

	//----------------------------------------------------------
	
	//Navegação por abas
	navItens 		= $('.Prod_Aluno_Nav_Item');
	contentItens	= $('.Prod_Aluno_Content_Item');

	showTabContent(navItens[0]); //Ativar primeira aba

	$(navItens).click(function() {
		showTabContent(this);
		return false;
	});
	$(navItens).focus(function() {
		showTabContent(this);
		return false;
	});

	//Acordeon Oficinas
	oficinasLista	= $('.Prod_Oficina_Nome');
	oficinasItens	= $('.Prod_Oficina_Content');

	$(oficinasLista).click(function(){
		expandirOficinas(this);
		return false;
	});
	$(oficinasLista).focus(function(){
		expandirOficinas(this);
		return false;
	});


	$('.Item_Img').click(function() {
		exibirAtividade(this);
		return false;
	});

	//----------------------------------------------------------

	CarregaProducao();
	
	var background = ($(".inputImg").css("background"));
	background = background.replace("no-repeat", "repeat");
	$(".inputImg").not($(".vazio")).css("background",background);
	//$(".vazio").css('cursor','default');


GerarUpload($('#foto'), $("#Arquivo_Foto_Aluno"), $('#Dados_Foto_Aluno'))



    $('#btn_Sub_AE').click(function(){
    	
    	if ($('#atividadeNova').val() == ''){
			return mensagem("Preencha o campo da atividade!","OK","bt_ok","erro");
		}
		
		if (categoria == ''){
			return mensagem("Escolha a categoria!","OK","bt_ok","erro");
		}
		
		if (tipoArquivo == ''){
			return mensagem("Escolha um tipo de arquivo!","OK","bt_ok","erro");
		}
		
    	if (tipoArquivo == 'video'){
    		Arquivo = $('#linkVideo').val();
    		arq = $('#linkVideo').val();
			if (arq == ''){
				return mensagem("Preencha o link do vídeo!","OK","bt_ok","erro");
			}
    	}else var arq = '';
    	
        if (Arquivo != "" && Arquivo != undefined){
        	
        	var atv = $('#atividadeNova').val();
        	
        	
        	var valores = "anoLetivo=80&texto="+atv+"&data=21-09-2014&aluno="+alunoID+"&tipo=6&categoria="+categoria+"&arquivo="+arq;
        	console.log('-----------------');	
        	console.log(valores);
        	console.log('-----------------');
        			
			var retorno = setCreateData("ProducaoAluno",valores);
			

			if(retorno != "erro"){
			
				$('#Cadastro_Form_imagem_PA #id').val(retorno);
				if (arq == '') {
					loading("inicial");
					addFileTo(retorno);
					//dataProducaoAluno 	=	getData("ProducaoAluno", null);
				}else{
//					$('#foto').css("background-image","url(img/foto.png)");
//		            $('#Arquivo_Foto_Aluno').val("");
//		            $('#Dados_Foto_Aluno').html("");
					
		            dataProducaoAluno 	=	getData("ProducaoAluno", null);
		            tipoSelecao = "atividade";
					mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");
					CarregaProducao();
					
				}
				
				//Limpa os campos!!
				$('#atividadeNova').val('');
				$('#linkVideo').val('');
				$("div.inputImg").css("background-position","0px 0px");
				tipoArquivo = '';
				categoria = '';
				$("#arquivo, #link").hide();
				
			}else{
				return mensagem("Erro ao cadastrar!","OK","bt_ok","erro");
			}
			return false;

        } else {
            return mensagem("Por Favor, adicione um arquivo!","OK","bt_ok","erro");
        }
    }); 

	$("#Arquivo_Foto_Aluno").change(function(e){
    	$("#LegendaUpload").html("Arquivo Carregado");
    });
});

function CarregaProducao()
{
	var PrimeiroAtividade = false;

	HtmlContent1="";
	HtmlContent2="";
	HtmlContent3="";

	if(!PrimeiroAtividade)
	{
		HtmlContent2 += "<li id='List_ADD' ArquivoSelect=''> Nova Atividade </li>";
		PrimeiroAtividade = true;
	}

	for(var a = 0; a < dataProducaoAluno.length; a++)
	{

        extensao = (dataProducaoAluno[a].arquivo.substring(dataProducaoAluno[a].arquivo.lastIndexOf("."))).toLowerCase();

    	if(dataProducaoAluno[a].aluno.idAluno == alunoID)
    	{
    		//if(dataProducaoAluno[a].tipo.idtipoProducaoAluno == 1)
    		if(dataProducaoAluno[a].tipo.idtipoProducaoAluno == 5)
        	{
                if (extensao == ".docx" || extensao == ".doc")
                {
                    HtmlContent1 += "<a href='" + dataProducaoAluno[a].arquivo + "'><li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"'> "+dataProducaoAluno[a].roteiro.nome+" </li></a>";
                }
                else
                {
                    HtmlContent1 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"'> "+dataProducaoAluno[a].roteiro.nome+" </li>";
                }
        	} 

        	//else if(dataProducaoAluno[a].tipo.idtipoProducaoAluno == 2)
        	else if(dataProducaoAluno[a].tipo.idtipoProducaoAluno == 6)
        	{

                if (extensao == ".docx" || extensao == ".doc")
                {
                    HtmlContent2 += "<a href='" + dataProducaoAluno[a].arquivo + "'><li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"'> "+dataProducaoAluno[a].texto+" </li></a>";
                }
                else
                {
                    HtmlContent2 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"'> "+dataProducaoAluno[a].texto+" </li>";
                }        		
        	} 

        	//else if(dataProducaoAluno[a].tipo.idtipoProducaoAluno == 3)
        	else if(dataProducaoAluno[a].tipo.idtipoProducaoAluno == 4)
        	{
                if (extensao == ".docx" || extensao == ".doc")
                {
                    HtmlContent3 += "<a href='" + dataProducaoAluno[a].arquivo + "'><li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"'> "+dataProducaoAluno[a].roteiro.nome+" </li></a>";
                }
                else
                {
                    HtmlContent3 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"'> "+dataProducaoAluno[a].roteiro.nome+" </li>";
                }
        		
        	}
        }
    }

    $('#menu_lateral_portfolio 	ul').html((HtmlContent1 != "" ? HtmlContent1:"Não há Portifólio!")).css({"color":"#878787","font-size":"16px","padding":"4px"});
	$('#menu_lateral_atividade 	ul').html(HtmlContent2);
	if(HtmlContent3 != "" ){
		$('#menu_lateral_fichas ul').html(HtmlContent3);
	}else{
		$('#menu_lateral_fichas ul').html("Não há Fichas de Finalização!").css({"position":"relative","width":"150%","color":"#878787","font-size":"16px","padding":"4px"});
	}
	
	if(tipoSelecao == "atividade")
	{
		//alert(tipoSelecao);
		$('#cabecalho_atividade').click();
		document.getElementById('Atividade').click();
	} else if(tipoSelecao == "fichas")
	{
		$('#cabecalho_fichas').click();
		//$('#Fichas li').click();
	} else {
		$('#cabecalho_portfolio').click();
		//$('#Portfolio li').click();
	}

	loading('final');
    reLoadClick();
}

//Pegar Aluno pelo usuario

function getAlunoByUsuario()
{
	for(var a=0; a<dataUsuario.length;a++)
	{
		if(dataUsuario[a].idusuario == userID)
		{
			return dataUsuario[a].aluno.idAluno;
		}
	}
}

function reLoadClick(){
	$("#menu_lateral_portfolio li").click(function(){
        var ex = true;
		var arquivo = $(this).attr('arquivoselect');
		extensao = (arquivo.substring(arquivo.lastIndexOf("."))).toLowerCase();

		if((extensao == ".docx")||(extensao == ".doc")){
			ex = false;
            $("#Prod_Aluno_Content li").not(':hidden').css("background-color", "#ECEBE5");
            $(this).not(':hidden').css("background-color", "#D6E5A9");
		}
				
		if(ex){
			if($(this).html().length != 1){

				$("#Prod_Aluno_Content li").not(':hidden').css("background-color", "#ECEBE5");
				$(this).not(':hidden').css("background-color", "#D6E5A9");
				
				if($(this).attr('id') == "List_ADD"){
					$('#objeto_verificar').hide();
					$('#objeto_adicionar').show();

				} else {			
					//$('.imagem_objeto iframe').css('width',$("#objeto_verificar").width()+'px');
					
					$('#objeto_adicionar').hide();
					$('#objeto_verificar').show();
					if (extensao.length <= 5){
						$('.imagem_objeto iframe').not(':hidden').attr("src",($(this).attr("ArquivoSelect")));
					}else{
						var video = (arquivo.substring(arquivo.lastIndexOf("=")));
						video = video.substring(1);
						$('.imagem_objeto iframe').not(':hidden').attr('src','http://youtube.com/embed/'+video);
						
					}
				}
			}
		}		
	});
} 

function addFileTo(ID)
{

    var formData = new FormData($('#Cadastro_Form_imagem_PA')[0]);
    formData.append("arquivo", Arquivo);

    $.ajax({
    url: path+"ProducaoAluno/upload/producaoAluno/arquivo/"+ID,
    type: "POST",
    mimeType:"multipart/form-data",
    contentType: false,
    cache: false,
    processData:false,
    data: formData,        
        success: function(d) {
            //alert("Arquivo Salvo.");
            mensagem("Arquivo salvo!","OK","bt_ok","sucesso");
            $('#foto').css("background-image","url(img/foto.png)");
            $('#Arquivo_Foto_Aluno').val("");
            $('#Dados_Foto_Aluno').html("");
            dataProducaoAluno 	=	getData("ProducaoAluno", null);
            tipoSelecao = "atividade";
            CarregaProducao();

            $("#LegendaUpload").html("Aguardando Arquivo");
            
            //CarregaProducao();
        },error: function() {
            return mensagem("Não modificado, verifique os campos!","OK","bt_ok","erro");
        }
    }); 
}

function getAnoLetivo(formato){
	var dataSalvaPortifolio = new Date();
	var anoAtual;
	
	if(formato == "idAnoLetivo"){		
		var dataAnoLetivo = getData("AnoLetivo",null);
		for(var i=0;i<dataAnoLetivo.length;i++){
			var anoLetivo = dataAnoLetivo[i].ano;
			anoLetivo = anoLetivo.split("-");		
			if(anoLetivo[0]==dataSalvaPortifolio.getUTCFullYear()){
				anoAtual = dataAnoLetivo[i].idanoLetivo;
			}
		}	
	}else if(formato == "anoAnoLetivo"){
		anoAtual = dataSalvaPortifolio.getUTCFullYear();
	}
	
	return anoAtual;
}

// Navegação por abas

function showTabContent(tabToDisplay)
{
	for ( var i = 0; i < navItens.length; i++ )
	{
		if ( navItens[i] == tabToDisplay )
		{
			$($(navItens).get(i)).addClass('Nav_Item_Ativo');
			$($(contentItens).get(i)).show();
		}
		else
		{
			$($(navItens).get(i)).removeClass('Nav_Item_Ativo');
			$($(contentItens).get(i)).hide();
		}
	}
}

//Acordeon Oficinas

function expandirOficinas(itemToExpand)
{
 	for ( var i = 0; i < oficinasLista.length; i++ )
 	{
 		if ( oficinasLista[i] == itemToExpand )
 		{
 			if ( !$($(oficinasLista).get(i)).parent('.Prod_Oficina_Item').hasClass('Item_Expandido') )
 			{
				$($(oficinasLista).get(i)).parent('.Prod_Oficina_Item').addClass('Item_Expandido');
				$($(oficinasItens).get(i)).slideDown();
 			}
 			else
 			{
 				$($(oficinasItens).get(i)).slideUp();
 				$($(oficinasLista).get(i)).parent('.Prod_Oficina_Item').removeClass('Item_Expandido');
 			}
		}
		else 
		{
			$($(oficinasItens).get(i)).slideUp();
			$($(oficinasLista).get(i)).parent('.Prod_Oficina_Item').removeClass('Item_Expandido');
		}
 	}
}

//Exibir atividade, se tiver


function exibirAtividade(atividade)
{		
	var listAtvs = document.getElementById('Prod_Oficina_Acordeon').getElementsByClassName('Item_Img');
	var listImgs = document.getElementById('conteudo_principal_oficinas').getElementsByClassName('Oficina_Prod_Img');

	for ( a in listAtvs )
	{
		if ( listAtvs[a] == atividade )
		{
			var idAtv 		= listAtvs[a].id.slice(4);
			var imgs 		= document.getElementsByClassName('Oficina_Content_Img');
			var imgToShow	= document.getElementById('Img'+idAtv);
			console.log(imgToShow);

			for ( b in imgs )
			{
				if ( imgs[b].id = 'Img'+idAtv )
				{
					console.log('Imagem a exibir');
				}
				else
				{
					console.info('Imagem incorreta');
				}
			}

			imgToShow.classList.add('Img_show');
			
			break;
		}
	}
}

// function carregaForm(){

	// alert($(this).val());
	// return false;
	// //$("#tipoArquivo option").eq(0).hide();
	// if ($("#tipoArquivo").val() == 'video'){
		// $("#arquivo").hide();
		// $("#link").show();
	// }else {
		// $("#link").hide();
		// $("#arquivo").show();
	// }
	
	// return false;
// }