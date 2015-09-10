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

//------------------------------------------------------------------------------------------------------------------------

//Get Usuario Efetivado

var userID = usuarioId;



var tipoSelecao = base64_decode(GetURLParameter('tipoProducao'));
var tipoSelecao = GetURLParameter('tipoProducao');

//------------------------------------------------------------------------------------------------------------------------

//Carrega a funçao de Load do JQuery

$(document).ready(function(){

    
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
    }
    else if($(this).attr("id") == "cabecalho_atividade"){
        $("#Portfolio").hide();
        $("#Atividade").show();
        $("#Fichas").hide();
    } else{
        $("#Portfolio").hide();
        $("#Atividade").hide();
        $("#Fichas").show();
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
        console.log(tipoArquivo);
        
        if (tipoArquivo == 'video'){
            Arquivo = $('#linkVideo').val();
            arq = $('#linkVideo').val();
            if (arq == ''){
                return mensagem("Preencha o link do vídeo!","OK","bt_ok","erro");
            }
        }else var arq = '';
        
        if (Arquivo != "" && Arquivo != undefined){
            console.log('idAluno: '+alunoID);
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

});

function CarregaProducao()
{
    var PrimeiroAtividade = false;

    HtmlContent1="";
    HtmlContent2="";
    HtmlContent3="";

    for(var a = 0; a < dataProducaoAluno.length; a++)
    {

        extensao = (dataProducaoAluno[a].arquivo.substring(dataProducaoAluno[a].arquivo.lastIndexOf("."))).toLowerCase();


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
                console.log('1');
                $("#producao_aluno_content li").not(':hidden').css("background-color", "#ECEBE5");
                $("#producao_aluno_content li").not(':hidden').children(".botao_roteiro_portfolio").css("display", "none");
                $(this).not(':hidden').css("background-color", "#D6E5A9");
                
                if($(this).attr('id') == "List_ADD"){
                    $('#objeto_verificar').hide();
                    $('#objeto_adicionar').show();
                    console.log('2');

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