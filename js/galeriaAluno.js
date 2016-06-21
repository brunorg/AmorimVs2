//Murano Design

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

    var aluno = 1;
    var UsuarioAtivo = 2;
    var tipoArquivo = '';
//------------------------------------------------------------------------------------------------------------------------

//Carrega os valores utilizados do BD
var alunoID = base64_decode(GetURLParameter("ID"));
var dataUsuario         =   getData("Usuario", null);
var dataProducaoAluno;
$.ajax({
    url: path + "ProducaoAluno/Aluno/" + alunoID,
    async: false,
    crossDomain: true,
    type: "GET",
    success: function(d) {dataProducaoAluno = d}
});

var dataAluno;
$.ajax({
    url: path + "Alunos/" + alunoID,
    async: false,
    crossDomain: true,
    type: "GET",
    success: function(d){
        dataAluno = d;
    }
});

var dataAlunoVariavel;
$.ajax({
    url: path + "AlunoVariavel/aluno/" + alunoID,
    async: false,
    crossDomain: true,
    type: "GET",
    success: function(d){
        dataAlunoVariavel = d;
    }
});

var alunoVar = dataAlunoVariavel.idalunoVariavel;
var oficinas = [];
var oficinasLista;
var oficinasItens;

$("#postagemImagem").change(function(e) {
    var FR = new FileReader();
    FR.onload = function(e) {
        $("#imagemArquivo").val(e.target.result);
    };
    Arquivo = this.files[0];
});

$('#addArquivo').click(function() {
    $('#postagemImagem').trigger('click');
});

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

var userID = usuarioId;



var tipoSelecao = base64_decode(GetURLParameter('tipoProducao'));
var tipoSelecao = GetURLParameter('tipoProducao');

//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery

$(document).ready(function(){
    //Acordeon Oficinas
    showAcordeonOficinas();

    oficinasLista = $('.Prod_Oficina_Nome');
    oficinasItens = $('.Prod_Oficina_Content');

    $("div.inputImg").not($(".vazio")).click(function(){
        $("div.inputImg").css("background-position","0px 0px");
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

    $(".FotoAluno").html("<img src='"+dataAluno.fotoAluno+"' width='65' height='65'/>");
    
    $('.nome_aluno').empty();
    $('.nome_aluno').append(dataAluno.nome);

    $('.ano').empty();
    $('.ano').append( dataAlunoVariavel.anoEstudo.ano + '° ano' );

    $('#tutor_nome').empty();
    if(dataAlunoVariavel.grupo.tutoria != null)
    {
       $('#tutor_nome').append(dataAlunoVariavel.grupo.tutoria.tutor.nome);
    }
    else {
        $('#tutor_nome').append("Não Atribuido");
    }


    $("li").click(function(){
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
    });
    
    $("#producao_aluno_cabecalho div").click(function(){
        $("#producao_aluno_cabecalho div").css("background", "#ADCC53");
        $(this).css("background-color", "#8FAE38");
    
        if($(this).attr("id") == "cabecalho_portfolio"){
            $("#Portfolio").show();
            $("#Atividade").hide();
            $("#Fichas").hide();
            $("#Oficina").hide();
        }
        else if($(this).attr("id") == "cabecalho_atividade"){
            $("#Portfolio").hide();
            $("#Atividade").show();
            $("#Fichas").hide();
            $("#Oficina").hide();
        } else if($(this).attr("id") == "cabecalho_fichas"){
            $("#Portfolio").hide();
            $("#Atividade").hide();
            $("#Fichas").show();
            $("#Oficina").hide();
        } else {
            $("#Portfolio").hide();
            $("#Atividade").hide();
            $("#Fichas").hide();
            $("#Oficina").show();
        }
    });

    CarregaProducao();

    $('#btn_Sub_AE').click(function(){
        
        // alert(tipoArquivo);
        // return false();
        if ($('#atividadeNova').val() == ''){
            return mensagem("Preencha o campo da atividade!","OK","bt_ok","erro");
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
            
            
            var valores = "anoLetivo=80&texto="+atv+"&data=21-09-2014&aluno="+alunoID+"&tipo=6&categoria=1&arquivo="+arq;
            
            var retorno = setCreateData("ProducaoAluno",valores);
            

            if(retorno != "erro"){
                $('#Cadastro_Form_imagem_PA #id').val(retorno);
                if (arq == '') {
                    addFileTo(retorno);
                }else{
//                  $('#foto').css("background-image","url(img/foto.png)");
//                  $('#Arquivo_Foto_Aluno').val("");
//                  $('#Dados_Foto_Aluno').html("");
                    //dataProducaoAluno   =   getData("ProducaoAluno", null);
                    tipoSelecao = "atividade";
                    CarregaProducao();
                }
                
                //Limpa os campos!!
                $('#atividadeNova').val('');
                $('#linkVideo').val('');
                //$('#tipoArquivo option').eq(0).show();
                //$("#tipoArquivo option:first").attr('selected','selected');
                $("div.inputImg").css("background-position","0px 0px");
                tipoArquivo = '';
                $("#arquivo, #link").hide();
                
                
                return mensagem("Cadastrado com sucesso!","OK","bt_ok","sucesso");
            }else{
                return mensagem("Erro ao cadastrar!","OK","bt_ok","erro");
                //console.log("3");
            }
            //console.log("4");
            return false;

        } else {
            return mensagem("Por Favor, adicione um arquivo!","OK","bt_ok","erro");
        }
    }); 

    $("#Arquivo_Foto_Aluno").change(function(e){
        $("#LegendaUpload").html("Arquivo Carregado");
    });

    $(".botao_corrigir").click(function () {
        if (!$(this).attr("disabled"))
        {
            var idProducao = $(this).parent().attr("id").substring(5);
            var alterar = $(this);
            $.ajax({
                url: path + "ProducaoAluno/Status/" + idProducao + "/3/0",
                type: "GET",
                async:true,
                crossDomain: true,
                beforeSend: function(){
                    loading("inicial");
                },
                success: function(){
                    mensagem("Dados salvos com sucesso!","OK","bt_ok","sucesso");
                    alterar.attr("disabled", "true");
                    alterar.siblings(".botao_observacao").attr("disabled", "true");
                },
                erro: function(){
                    mensagem("Não modificado","OK","bt_ok","erro");
                },
                complete: function(){
                    loading("final");
                }
            });
        }
        
    });

    $(".botao_observacao").click(function () {
        if (!$(this).attr("disabled"))
        {
            localStorage.setItem("producaoMensagem", $(this).parent().attr("id").substring(5));
            window.location.href = "mensagens.html";
        }
        
    });

    $(".Prod_Oficina_Acordeon").mCustomScrollbar({axis: "y"});

});

function CarregaProducao(){
    var PrimeiroAtividade = false;
    HtmlContent1="";
    HtmlContent2="";
    HtmlContent3="";
    for(var a = 0; a < dataProducaoAluno.length; a++){

        if(dataProducaoAluno.arquivo != null){
            extensao = (dataProducaoAluno[a].arquivo.substring(dataProducaoAluno[a].arquivo.lastIndexOf("."))).toLowerCase();
        } else{
            extensao = ".jpg";
        }

        if(dataProducaoAluno[a].tipo.idtipoProducaoAluno == 5)
        {
            if (extensao == ".docx" || extensao == ".doc")
            {
                switch (dataProducaoAluno[a].status)
                {
                    case (1):
                    {
                        HtmlContent1 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"' id='prod_"+dataProducaoAluno[a].idproducaoAluno+"'><a href='" + dataProducaoAluno[a].arquivo +"'><div class='titulo_roteiro_portfolio'> "+dataProducaoAluno[a].roteiro.nome+"</div></a><div class='botao_roteiro_portfolio botao_corrigir'>CORRIGIR</div><div class='botao_roteiro_portfolio botao_observacao'>RESPONDER</div></li>";
                        break;
                    }
                    case (2):
                    {
                        HtmlContent1 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"' id='prod_"+dataProducaoAluno[a].idproducaoAluno+"'><a href='" + dataProducaoAluno[a].arquivo +"'><div class='titulo_roteiro_portfolio'> "+dataProducaoAluno[a].roteiro.nome+"</div></a><div class='botao_roteiro_portfolio botao_corrigir'>CORRIGIR</div><div class='botao_roteiro_portfolio botao_observacao' disabled='disabled'>RESPONDER</div></li>";
                        break;
                    }
                    case (3):
                    {
                        HtmlContent1 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"' id='prod_"+dataProducaoAluno[a].idproducaoAluno+"'><a href='" + dataProducaoAluno[a].arquivo +"'><div class='titulo_roteiro_portfolio'> "+dataProducaoAluno[a].roteiro.nome+"</div></a><div class='botao_roteiro_portfolio botao_corrigir' disabled='disabled'>CORRIGIR</div><div class='botao_roteiro_portfolio botao_observacao' disabled='disabled'>RESPONDER</div></li>";
                        break;
                    }
                }
            }
            else
            {
                switch (dataProducaoAluno[a].status)
                {
                    case (1):
                    {
                        HtmlContent1 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"' id='prod_"+dataProducaoAluno[a].idproducaoAluno+"'><div class='titulo_roteiro_portfolio'>"+dataProducaoAluno[a].roteiro.nome+"</div><div class='botao_roteiro_portfolio botao_corrigir'>CORRIGIR</div><div class='botao_roteiro_portfolio botao_observacao'>RESPONDER</div></li>";
                        break;
                    }
                    case (2):
                    {
                        HtmlContent1 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"' id='prod_"+dataProducaoAluno[a].idproducaoAluno+"'><div class='titulo_roteiro_portfolio'>"+dataProducaoAluno[a].roteiro.nome+"</div><div class='botao_roteiro_portfolio botao_corrigir'>CORRIGIR</div><div class='botao_roteiro_portfolio botao_observacao' disabled='disabled'>RESPONDER</div></li>";
                        break;
                    }
                    case (3):
                    {
                        HtmlContent1 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"' id='prod_"+dataProducaoAluno[a].idproducaoAluno+"'><div class='titulo_roteiro_portfolio'>"+dataProducaoAluno[a].roteiro.nome+"</div><div class='botao_roteiro_portfolio botao_corrigir' disabled='disabled'>CORRIGIR</div><div class='botao_roteiro_portfolio botao_observacao' disabled='disabled'>RESPONDER</div></li>";
                        break;
                    }
                }
            }
        } 
        //else if(dataProducaoAluno[a].tipo.idtipoProducaoAluno == 2)
        else if(dataProducaoAluno[a].tipo.idtipoProducaoAluno == 6)
        {
            if (extensao == ".docx" || extensao == ".doc")
            {
                switch (dataProducaoAluno[a].status)
                {
                    case (1):
                    {
                        HtmlContent2 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"' id='prod_"+dataProducaoAluno[a].idproducaoAluno+"'><a href='" + dataProducaoAluno[a].arquivo +"'><div class='titulo_roteiro_portfolio'> "+dataProducaoAluno[a].texto+"</div></a><div class='botao_roteiro_portfolio botao_corrigir'>CORRIGIR</div><div class='botao_roteiro_portfolio botao_observacao'>RESPONDER</div></li>";
                        break;
                    }
                    case (2):
                    {
                        HtmlContent2 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"' id='prod_"+dataProducaoAluno[a].idproducaoAluno+"'><a href='" + dataProducaoAluno[a].arquivo +"'><div class='titulo_roteiro_portfolio'> "+dataProducaoAluno[a].texto+"</div></a><div class='botao_roteiro_portfolio botao_corrigir'>CORRIGIR</div><div class='botao_roteiro_portfolio botao_observacao' disabled='disabled'>RESPONDER</div></li>";
                        break;
                    }
                    case (3):
                    {
                        HtmlContent2 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"' id='prod_"+dataProducaoAluno[a].idproducaoAluno+"'><a href='" + dataProducaoAluno[a].arquivo +"'><div class='titulo_roteiro_portfolio'> "+dataProducaoAluno[a].texto+"</div></a><div class='botao_roteiro_portfolio botao_corrigir' disabled='disabled'>CORRIGIR</div><div class='botao_roteiro_portfolio botao_observacao' disabled='disabled'>RESPONDER</div></li>";
                        break;
                    }
                }
            }
            else
            {
                switch (dataProducaoAluno[a].status)
                {
                    case (1):
                    {
                        HtmlContent2 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"' id='prod_"+dataProducaoAluno[a].idproducaoAluno+"'><div class='titulo_roteiro_portfolio'>"+dataProducaoAluno[a].texto+"</div><div class='botao_roteiro_portfolio botao_corrigir'>CORRIGIR</div><div class='botao_roteiro_portfolio botao_observacao'>RESPONDER</div></li>";
                        break;
                    }
                    case (2):
                    {
                        HtmlContent2 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"' id='prod_"+dataProducaoAluno[a].idproducaoAluno+"'><div class='titulo_roteiro_portfolio'>"+dataProducaoAluno[a].texto+"</div><div class='botao_roteiro_portfolio botao_corrigir'>CORRIGIR</div><div class='botao_roteiro_portfolio botao_observacao' disabled='disabled'>RESPONDER</div></li>";
                        break;
                    }
                    case (3):
                    {
                        HtmlContent2 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"' id='prod_"+dataProducaoAluno[a].idproducaoAluno+"'><div class='titulo_roteiro_portfolio'>"+dataProducaoAluno[a].texto+"</div><div class='botao_roteiro_portfolio botao_corrigir' disabled>CORRIGIR</div><div class='botao_roteiro_portfolio botao_observacao' disabled='disabled'>RESPONDER</div></li>";
                        break;
                    }
                }
            }              
        } 
        //else if(dataProducaoAluno[a].tipo.idtipoProducaoAluno == 3)
        else if(dataProducaoAluno[a].tipo.idtipoProducaoAluno == 4)
        {
            if (extensao == ".docx" || extensao == ".doc")
            {
                switch (dataProducaoAluno[a].status)
                {
                    case (1):
                    {
                        HtmlContent3 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"' id='prod_"+dataProducaoAluno[a].idproducaoAluno+"'><a href='" + dataProducaoAluno[a].arquivo +"'><div class='titulo_roteiro_portfolio'> "+dataProducaoAluno[a].roteiro.nome+"</div></a><div class='botao_roteiro_portfolio botao_corrigir'>CORRIGIR</div><div class='botao_roteiro_portfolio botao_observacao'>RESPONDER</div></li>";
                        break;
                    }
                    case (2):
                    {
                        HtmlContent3 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"' id='prod_"+dataProducaoAluno[a].idproducaoAluno+"'><a href='" + dataProducaoAluno[a].arquivo +"'><div class='titulo_roteiro_portfolio'> "+dataProducaoAluno[a].roteiro.nome+"</div></a><div class='botao_roteiro_portfolio botao_corrigir'>CORRIGIR</div><div class='botao_roteiro_portfolio botao_observacao' disabled='disabled'>RESPONDER</div></li>";
                        break;
                    }
                    case (3):
                    {
                        HtmlContent3 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"' id='prod_"+dataProducaoAluno[a].idproducaoAluno+"'><a href='" + dataProducaoAluno[a].arquivo +"'><div class='titulo_roteiro_portfolio'> "+dataProducaoAluno[a].roteiro.nome+"</div></a><div class='botao_roteiro_portfolio botao_corrigir' disabled='disabled'>CORRIGIR</div><div class='botao_roteiro_portfolio botao_observacao' disabled='disabled'>RESPONDER</div></li>";
                        break;
                    }
                }
            }
            else
            {
                switch (dataProducaoAluno[a].status)
                {
                    case (1):
                    {
                        HtmlContent3 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"' id='prod_"+dataProducaoAluno[a].idproducaoAluno+"'><div class='titulo_roteiro_portfolio'>"+dataProducaoAluno[a].roteiro.nome+"</div><div class='botao_roteiro_portfolio botao_corrigir'>CORRIGIR</div><div class='botao_roteiro_portfolio botao_observacao'>RESPONDER</div></li>";
                        break;
                    }
                    case (2):
                    {
                        HtmlContent3 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"' id='prod_"+dataProducaoAluno[a].idproducaoAluno+"'><div class='titulo_roteiro_portfolio'>"+dataProducaoAluno[a].roteiro.nome+"</div><div class='botao_roteiro_portfolio botao_corrigir'>CORRIGIR</div><div class='botao_roteiro_portfolio botao_observacao' disabled='disabled'>RESPONDER</div></li>";
                        break;
                    }
                    case (3):
                    {
                        HtmlContent3 += "<li ArquivoSelect='"+dataProducaoAluno[a].arquivo+"' ImgSelect='"+dataProducaoAluno[a].imagem+"' id='prod_"+dataProducaoAluno[a].idproducaoAluno+"'><div class='titulo_roteiro_portfolio'>"+dataProducaoAluno[a].roteiro.nome+"</div><div class='botao_roteiro_portfolio botao_corrigir' disabled='disabled'>CORRIGIR</div><div class='botao_roteiro_portfolio botao_observacao' disabled='disabled'>RESPONDER</div></li>";
                        break;
                    }
                }
            }
            
        }
    }

    $('#menu_lateral_portfolio  ul').html((HtmlContent1 != "" ? HtmlContent1:"Não há Portifólio!")).css({"color":"#878787","font-size":"16px","padding":"4px"});
    $('#menu_lateral_atividade  ul').html(HtmlContent2);
    $('#menu_lateral_fichas     ul').html((HtmlContent3 != "" ? HtmlContent3:"Não há Fichas de Finalização!")).css({"position":"relative","width":"100%","color":"#878787","font-size":"16px","padding":"4px"});

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

    reLoadClick();
}
 
function reLoadClick(){
    $("li").click(function(){
        var ex = true; 
        var arquivo = $(this).attr('arquivoselect');
        extensao = (arquivo.substring(arquivo.lastIndexOf("."))).toLowerCase();
        //alert(extensao);
        if((extensao == ".docx")||(extensao == ".doc")){
            ex = false;
            $("#producao_aluno_content li").not(':hidden').css("background-color", "#ECEBE5");
            
            $("#producao_aluno_content li").not(':hidden').children(".botao_roteiro_portfolio").css("display", "none");
            $(this).not(':hidden').css("background-color", "#D6E5A9");     
        }

        $("#producao_aluno_content li").not(':hidden').children(".titulo_roteiro_portfolio").each(function(){
                if ($(this).attr("id") != undefined)
                {
                    $(this).html($(this).attr("id"));
                } 
            });
                
        if(ex){
            if($(this).html().length != 1){
                $("#producao_aluno_content li").not(':hidden').css("background-color", "#ECEBE5");
                $("#producao_aluno_content li").not(':hidden').children(".botao_roteiro_portfolio").css("display", "none");
                $(this).not(':hidden').css("background-color", "#D6E5A9");
                
                if($(this).attr('id') == "List_ADD"){
                    $('#objeto_verificar').hide();
                    $('#objeto_adicionar').show();

                } else {            
                    $('.imagem_objeto iframe').css('width',/*$("#objeto_verificar").width()+*/'75%');
                    
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

        $(this).children(".botao_roteiro_portfolio").css("display", "block");

        if ($(this).children(".titulo_roteiro_portfolio").length > 0 && $(this).children(".titulo_roteiro_portfolio").html().length > 20)
        {
            $(this).children(".titulo_roteiro_portfolio").attr("id", $(this).children(".titulo_roteiro_portfolio").html());
            $(this).children(".titulo_roteiro_portfolio").html($(this).children(".titulo_roteiro_portfolio").html().substring(0,21) + "...");
        }
        else if ($(this).children("a").children(".titulo_roteiro_portfolio").html().length > 20)
        {
            $(this).children("a").children(".titulo_roteiro_portfolio").attr("id", $(this).children(".titulo_roteiro_portfolio").html());
            $(this).children("a").children(".titulo_roteiro_portfolio").html($(this).children(".titulo_roteiro_portfolio").html().substring(0,21) + "...");
        }

    });
}

function showAtividadesExtraContent() {
    if ( !$('#AtvExtra').hasClass('atividadesListadas') ) {
        var atividades = getAtividadesExtras();
        var htmlAtividades = new String();

        if ( atividades.length > 0 ) {
            for ( a in atividades ) {
                htmlAtividades +=
                    '<div id="prodAluno'+atividades[a].idproducaoAluno+'" class="Oficina_Content_Item Item_Prod" onclick="showAtividadeExtra(\''+atividades[a].arquivo+'\', \''+atividades[a].idproducaoAluno+'\')">'+
                        '<span class="Item_Prod_Titulo">'+atividades[a].texto+'</span>'+
                    '</div>';
            }
        }

        $('#AtvExtra').find('.Prod_Oficina_Content').append(htmlAtividades);
        $('#AtvExtra').addClass('atividadesListadas')
    }

    if( !$('#AtvExtra').hasClass('itemExpandido') ) {
        $('#AtvExtra').find('.Prod_Oficina_Content').slideDown();
        $('#AtvExtra').addClass('itemExpandido');
    } else {
        $('#AtvExtra').find('.Prod_Oficina_Content').slideUp();
        $('#AtvExtra').removeClass('itemExpandido');
        $('.Oficina_Content_Item').removeClass('Item_Selected');

        showAtividadesRecentes();
    }

    $('.Prod_Oficina_Item').not('#AtvExtra').each(function() {
        $(this).removeClass('itemExpandido');
        $(this).find('.Prod_Oficina_Content').slideUp();
    })
}

function showFormNovaProd(idOficina, tipo) {
    $('.Oficina_Content_Item').removeClass('Item_Selected');

    $('#container_Nova_Producao').show();
    $('#Prod_Oficina_View').hide();
    $('#container_tela_padrao').hide();
    $('#Prod_Oficina_View').attr('src','');

    $('#tipo').val(tipo);
    $('#oficina').val(idOficina);

    if ( idOficina === 0 ) {
        $('#oficina').attr('name','naoEnviar');
        $('#AtvExtraAdd').addClass('Item_Selected');
    } else {
        $('#oficina').attr('name','oficina');
        $('#oficinaAdd'+idOficina).addClass('Item_Selected');
    }
}

function getAtividadesExtras(){
    var retorno;

    $.ajax({
        url: path + 'ProducaoAluno/Filtos/'+alunoID+'/6/0',
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(dAtvsExtras) { retorno = dAtvsExtras; },
        error: function(e) { mensagem("Erro ao retornar as produções de atividades extras.","OK","bt_ok","erro"); }
    });

    return retorno;
}

function postProducaoOficina(){
    var d = new Date();
    var data = { ano: d.getFullYear(), mes: d.getMonth()+1, dia: d.getDate() }
    var anoLetivo = getAnoLetivo('idAnoLetivo');

    $('#anoLetivo').val(anoLetivo);
    $('#data').val(data.ano+"-"+data.mes+"-"+data.dia);
    $('#aluno').val(alunoID);

    $.ajax({
        url: path+"ProducaoAluno/",
        type: "POST",
        crossDomain: true,
        data: $("#form_Nova_Producao").find('input[name!="naoEnviar"]').serialize(),
        beforeSend: function() { loading("inicial"); },
        success: function(idPost)
        {
            uploadArquivo(idPost);
            mensagem("Produção cadastrada com sucesso!","OK","bt_ok","sucesso");
            showNovaAtividade(idPost);
        },
        complete: function () { loading("final"); },
        error: function(e) { mensagem("Erro ao cadastrar uma nova produção.","OK","bt_ok","erro"); }
    });
}

function showAtividadeExtra(url, idProdAluno) {
    $('#container_Nova_Producao').hide();
    $('#container_tela_padrao').hide();

    $('#Prod_Oficina_View').attr('src',url);

    $('.Oficina_Content_Item').removeClass('Item_Selected');
    $('#prodAluno'+idProdAluno).addClass('Item_Selected');

    $('#Prod_Oficina_View').show();
}

function showAtividadesRecentes() {
    if ( ! $('#id_tela_padrao').hasClass('Atividades_Recentes_Listadas') ) {
        var atividades = getAtividadesRecentes();
        var htmlRecentes = new String();
        var tipoAtividade;
        var corTipoAtividade;

        if ( atividades !== [] ) {
            for ( var a in atividades ) {
                if ( atividades[a].tipo.idtipoProducaoAluno !== 7 ) {
                    tipoAtividade = atividades[a].tipo.tipo;
                    corTipoAtividade = '#fbb040';
                } else {
                    tipoAtividade = atividades[a].oficina.tipoOficina.nome;
                    corTipoAtividade = atividades[a].oficina.tipoOficina.cor.forte;
                }

                htmlRecentes +=
                    '<div id="prodRecente'+atividades[a].idproducaoAluno+'" class="atividade_recente_item" style="border: 1px solid '+corTipoAtividade+'">'+
                        '<a href="'+atividades[a].arquivo+'" target="_blank">'+
                            '<span style="background-image: url('+atividades[a].arquivo+')" alt="'+atividades[a].texto+'" class="atividade_recente_img">&nbsp;</span>'+
                        '</a>'+
                        '<div class="atividade_recente_nome"><span>'+atividades[a].texto+'</span></div>'+
                        '<div class="atividade_recente_tipo" style="background-color: '+corTipoAtividade+';">'+tipoAtividade+'</div>'+
                    '</div>';
            }
        } else {
            htmlRecentes += "<h2 class=\"retono_vazio_recentes\">Ainda não há atividades cadastradas.</h2>"
        }

        $('#container_tela_padrao').append(htmlRecentes);
        $('#container_tela_padrao').addClass('Atividades_Recentes_Listadas')
    }

    $('#Prod_Oficina_View').hide();
    $('#container_Nova_Producao').hide();
    $('#Prod_Oficina_View').attr('src','');
    $('#container_tela_padrao').show();
}

function getAtividadesRecentes(){
    var retorno;

    $.ajax({
        url: path + 'ProducaoAluno/AlunoUltimasPostagens/' + alunoID,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(dRecentes) { retorno = dRecentes; },
        error: function(e) { mensagem("Erro ao exibir as atividades recentes.","OK","bt_ok","erro"); }
    });

    return retorno;
}

function showAcordeonOficinas() {
    var listaOficinas = getOficinasAluno();
    var acordeonHtml = new String();

    for (var a in listaOficinas) {
        oficinas.push(listaOficinas[a]);

        acordeonHtml +=
            '<div id="oficina'+listaOficinas[a].idoficina+'" class="Prod_Oficina_Item Prod_Oficina">'+
                '<div class="Prod_Oficina_Nome" style="background-color: '+listaOficinas[a].tipoOficina.cor.forte+'" onclick="showOficinaContent('+listaOficinas[a].idoficina+')">'+listaOficinas[a].tipoOficina.nome+'</div>'+
                '<div class="Prod_Oficina_Content">'+
                    '<div id="oficinaAdd'+listaOficinas[a].idoficina+'"class="Oficina_Content_Item Add_Item" onclick="showFormNovaProd('+listaOficinas[a].idoficina+', 7)">Inserir novo</div>'+
                '</div>'+
            '</div>';
    }

    $('.Prod_Oficina_Acordeon_Itens').prepend(acordeonHtml);
}

function showOficinaContent(id) {
    if ( ! $('#oficina'+id).hasClass('atividadesListadas') ) {
        var atividades = getAtividadesOficina(id);
        var htmlAtividades = new String();

        if ( atividades.length > 0 ) {
            for (var a in atividades) {
                htmlAtividades +=   "<div id=\"prodAluno"+atividades[a].idproducaoAluno+"\" class=\"Oficina_Content_Item Item_Prod\" onclick=\"showAtividadeExtra('"+atividades[a].arquivo+"', '"+atividades[a].idproducaoAluno+"')\">";
                htmlAtividades +=       "<div class=\"Item_Prod_Titulo\">";
                htmlAtividades +=           "<span>"+atividades[a].texto+"</span>";
                htmlAtividades +=       "</div>";
                htmlAtividades +=   "</div>";

                $('#oficina'+id).find('.Prod_Oficina_Content').append(htmlAtividades);
            }
            $('#oficina'+id).addClass('atividadesListadas')
        }
    }

    if ( $('#oficina'+id).hasClass('itemExpandido') ) {
        $('#oficina'+id).removeClass('itemExpandido');
        $('#oficina'+id).find('.Prod_Oficina_Content').slideUp();
        $('.Oficina_Content_Item').removeClass('Item_Selected');

        showAtividadesRecentes();
    } else {
        $('#oficina'+id).addClass('itemExpandido');
        $('#oficina'+id).find('.Prod_Oficina_Content').slideDown();
    }

    $("#oficina"+id).find(".Item_Prod").each(function() {
        var parent = $(this).find(".Item_Prod_Titulo");
        var element = $(this).find("span");

        verifyTamanhoNomeRoteiro(parent, element);
    });

    $('.Prod_Oficina_Item').not('#oficina'+id).each(function() {
        $(this).removeClass('itemExpandido');
        $(this).find('.Prod_Oficina_Content').slideUp();
    });
}

function getOficinasAluno(){
    var retorno;
    $.ajax({
        url: path + 'Oficina/ListarPorAluno/' + alunoVar ,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(dOficina) { retorno = dOficina; },
        error: function(e) { mensagem("Erro ao retornar as produções dessa oficina.","OK","bt_ok","erro"); }
    });
    return retorno;
}

function showNovaAtividade(idNovaAtividade) {
    var novaAtividade = getNovaAtividade(idNovaAtividade);
    var htmlNovaAtividade = new String();

    if ( novaAtividade.tipo.idtipoProducaoAluno === 6 ) {
        htmlNovaAtividade =
            '<div id="prodAluno'+novaAtividade.idproducaoAluno+'" class="Oficina_Content_Item Item_Prod" onclick="showAtividadeExtra(\''+novaAtividade.arquivo+'\', \''+novaAtividade.idproducaoAluno+'\')">'+
                '<span class="Item_Prod_Titulo">'+novaAtividade.texto+'</span>'+
            '</div>';

        $('#AtvExtra').find('.Prod_Oficina_Item').filter(':first').after(htmlNovaAtividade);
        $('#AtvExtra').find('#'+novaAtividade.idproducaoAluno).trigger('click');
    }
}

function uploadArquivo(idpost) {
    var formData = new FormData($("#form_Nova_Producao")[0]);
    formData.append("arquivo", Arquivo);

    $.ajax({
        url: path + 'ProducaoAluno/upload/producaoAluno/arquivo/' + idpost,
        type: "POST",
        crossDomain: true,
        async: false,
        mimeType:"multipart/form-data",
        contentType: false,
        cache: false,
        processData:false,
        data: formData,
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

function getAtividadesOficina(idoficina){
    var retorno;
    $.ajax({
        url: path + 'ProducaoAluno/OficinaAluno/'+idoficina+'/'+alunoID+'/',
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(dAtvOficina) { retorno = dAtvOficina; },
        error: function(e) { mensagem("Erro ao retornar as produções dessa oficina.","OK","bt_ok","erro"); }
    });
    return retorno;
}

function verifyTamanhoNomeRoteiro(parent, element) {
    var widthParent = $(parent).outerWidth();
    var widthElement = $(element).outerWidth();

    if (widthElement > widthParent) {
        $(parent).mouseover(function() {
            var diferenca = widthElement - widthParent;
            $(element).animate({ left: -diferenca }, 1500, function() {
                setTimeout(function() {
                    $(element).css("left", "0");
                }, 1000)
            });
        });
    }
}

function getNovaAtividade(idAtividade){
    var retorno;

    $.ajax({
        url: path + 'ProducaoAluno/' + idAtividade,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(dAtividade) { retorno = dAtividade; },
        error: function(e) { mensagem("Erro ao exibir a nova atividade.","OK","bt_ok","erro"); }
    });

    return retorno;
}

