/**
 * Listagem de Estados vindo de outro Script
 */
    listarEstadoCidade("naturalidadeEstado");
    listarEstadoCidade("estado");
    
    
//Get Data do banco JSON
    var dataPeriodo     =   getData("Periodo", null);
    var dataAnoEstudo   =   getData("AnoEstudo", null);

/* Ano Letivo */
    HtmlContent = "";

    for(var a=0;a<dataAnoLetivo.length; a++)
    {
        HtmlContent += "<option value='"+dataAnoLetivo[a].idanoLetivo+"'>"+((dataAnoLetivo[a].ano).substring(0, 4))+"</option>";
    }

    $('#anoLetivo').html(HtmlContent);

/*Turno [Manhã/Tarde]*/
    HtmlContent = ""; 

    for(var b=0;b<dataPeriodo.length; b++)
    {
        HtmlContent += "<option value='"+dataPeriodo[b].idperiodo+"'>"+(dataPeriodo[b].periodo)+"</option>";
    }

    $('#periodo').html(HtmlContent);

function validaForm (formulario) {
    switch (formulario){
        case "ProfessorFuncionario":{
        	
            var dataAtual = new Date;
            
            if ($("#ativo").val() == null)
            {
                mensagem("Por favor, selecione um status!","OK","bt_ok","erro");
                $('#ativo').focus();
                return false;
            }
            if ($("#dataEntradaEscola").val() == "")
            {
                mensagem("Por favor, preencha o campo Início Escola!","OK","bt_ok","erro");
                $('#dataEntradaEscola').focus();
                return false;
            }
            if($('#dataEntradaEscola').val().substring(6, 10) > dataAtual.getFullYear() || 
              ($('#dataEntradaEscola').val().substring(6, 10) == dataAtual.getFullYear() && 
                $('#dataEntradaEscola').val().substring(3, 4) > dataAtual.getMonth() + 1) ||
              ($('#dataEntradaEscola').val().substring(6, 10) == dataAtual.getFullYear() && 
                $('#dataEntradaEscola').val().substring(3, 4) == dataAtual.getMonth() + 1) &&
                $('#dataEntradaEscola').val().substring(0, 1) > dataAtual.getDate()){
                mensagem("Data de Entrada na Escola posterior a data atual!","OK","bt_ok","erro");
                $('#dataEntradaEscola').focus();
                return false
            }
            if ($("#dataEntradaPrefeitura").val() == "")
            {
                mensagem("Por favor, preencha o campo Início PMSP!","OK","bt_ok","erro");
                $('#dataEntradaPrefeitura').focus();
                return false;
            }
            if($('#dataEntradaPrefeitura').val().substring(6, 10) > dataAtual.getFullYear() || 
              ($('#dataEntradaPrefeitura').val().substring(6, 10) == dataAtual.getFullYear() && 
                $('#dataEntradaPrefeitura').val().substring(3, 4) > dataAtual.getMonth() + 1) ||
              ($('#dataEntradaPrefeitura').val().substring(6, 10) == dataAtual.getFullYear() && 
                $('#dataEntradaPrefeitura').val().substring(3, 4) == dataAtual.getMonth() + 1) &&
                $('#dataEntradaPrefeitura').val().substring(0, 1) > dataAtual.getDate()){
                mensagem("Data de Início PMSP posterior a data atual!","OK","bt_ok","erro");
                $('#CEP').focus();
                return false
            }
            if(($('#dataEntradaPrefeitura').val().substring(6, 10) > $('#dataEntradaEscola').val().substring(6, 10)) || 
              ($('#dataEntradaPrefeitura').val().substring(6, 10) == $('#dataEntradaEscola').val().substring(6, 10) && 
                $('#dataEntradaPrefeitura').val().substring(3, 4) > $('#dataEntradaEscola').val().substring(3, 4)) ||
              ($('#dataEntradaPrefeitura').val().substring(6, 10) == $('#dataEntradaEscola').val().substring(6, 10) && 
                $('#dataEntradaPrefeitura').val().substring(3, 4) == $('#dataEntradaEscola').val().substring(3, 4) &&
                $('#dataEntradaPrefeitura').val().substring(0, 1) > $('#dataEntradaEscola').val().substring(0, 1)))
            {
                mensagem("Data de Início PMSP deve ser anterior a data de Entrada na Escola!","OK","bt_ok","erro");
                $('#dataEntradaPrefeitura').focus();
                return false
            }
            if ($("#nome").val() == "")
            {
                mensagem("Por favor, preencha o campo Nome!","OK","bt_ok","erro");
                $('#nome').focus();
                return false;
            }
            if ($("#naturalidadePais").val() == "")
            {
                mensagem("Por favor, preencha o campo País!","OK","bt_ok","erro");
                $('#naturalidadePais').focus();
                return false;
            }
            if (($("#naturalidadePais").val().match(/brasil/i) == $("#naturalidadePais").val() &&
                ($("#naturalidadeEstado").val() == "")) || $("#naturalidadeEstado").val() == null )
            {
                mensagem("Por favor, preencha o campo Estado Natal!","OK","bt_ok","erro");
                $('#naturalidadeEstado').focus();
                return false;
            }
            if ($("#rua").val() == "")
            {
                mensagem("Por favor, preencha o campo Logradouro!","OK","bt_ok","erro");
                $('#rua').focus();
                return false;
            }
            if ($("#bairro").val() == "")
            {
                mensagem("Por favor, preencha o campo Bairro!","OK","bt_ok","erro");
                $('#bairro').focus();
                return false;
            }
            if ($("#numero").val() == "")
            {
                mensagem("Por favor, preencha o campo Número!","OK","bt_ok","erro");
                $('#numero').focus();
                return false;
            }

            if ($("#cep").val().replace(/[^0-9]+/g,'') == "")
            {
                mensagem("Por favor, preencha o campo CEP!","OK","bt_ok","erro");
                $('#cep').focus();
                return false;
            }
             if (($("#estado").val() == "") || ($("#estado").val() == null) )
            {

                mensagem("Por favor, preencha o campo Estado!","OK","bt_ok","erro");
                $('#estado').focus();
                return false;
            }
             if (($("#cidade").val() == "") || ($("#cidade").val() == null))
            {
                mensagem("Por favor, preencha o campo Cidade!","OK","bt_ok","erro");
                $('#cidade').focus();
                return false;
            }
        }
        break;

        case "ProfessorFuncionarioVariavel":{
            if ($("#formacao").val() == "")
            {
                mensagem("Por favor, preencha o campo Formação!","OK","bt_ok","erro");
                $('#formacao').focus();
                return false;
            }
            if ($("#cargo").val() == "")
            {
                mensagem("Por favor, preencha o campo Cargo!","OK","bt_ok","erro");
                $('#cargo').focus();
                return false;
            }
            if ($("#qpe").val() == "")
            {
                mensagem("Por favor, preencha o campo QPE!","OK","bt_ok","erro");
                $('#qpe').focus();
                return false;
            }
            if ($("#periodo").val() == "-1")
            {
                mensagem("Por favor, preencha o campo Período!","OK","bt_ok","erro");
                $('#periodo').focus();
                return false;
            }
        }
        break;

        case "ProfessorUsuario":{
            if ($("#loginProfessor").val() == "")
            {
                mensagem("Por favor, preencha o campo Login!","OK","bt_ok","erro");
                $('#loginProfessor').focus();
                return false;
            }
            if ($("#loginProfessor").val().length > 10)
            {
                mensagem("Campo Login deve ter no máximo 10 caracteres","OK","bt_ok","erro");
                $('#loginProfessor').focus();
                return false;
            }
            if ($("#senhaUserProfessor").attr('disabled') != 'disabled'){
            	if ($("#senhaUserProfessor").val() == "")
	            {
	                mensagem("Por favor, preencha o campo Senha!","OK","bt_ok","erro");
	                $('#senhaUserProfessor').focus();
	                return false;
	            }
	            if ($("#senhaUserProfessor").val().length > 6)
	            {
	                mensagem("Campo Senha deve ter no máximo 6 caracteres","OK","bt_ok","erro");
	                $('#senhaUserProfessor').focus();
	                return false;
	            }
        	} 
            if ($("#emailUsuarioProfessor").val() == "")
            {
                mensagem("Por favor, preencha o campo Email!","OK","bt_ok","erro");
                $('#emailUsuarioProfessor').focus();
                return false;
            }
        }
        break;

    }
}

/*-----------------------------Inicio jquery---------------------------*/

$(document).ready(function(){
	
	
    $("#cep").mask("99999-999");

    /* POST da tabela ProfessorFuncionario */

    $('.dataFixaSalva').remove();

    $('#frmCadastroProfessor').unbind('submit').on("submit", function(event) {
    	
    	var retorno = validaForm("ProfessorFuncionario");
        event.preventDefault();
        
        if (typeof retorno == 'undefined'){
        	loading('inicio');
            $('#dataEntradaPrefeitura').val(''+changeDatePosition($('#dataEntradaPrefeitura').val(), 1, '-'));
            $('#dataEntradaEscola').val(''+changeDatePosition($('#dataEntradaEscola').val(), 1, '-'));
            $('#quinquenio').val($('#QuinquenioNumber').html());
            
            $.ajax({
                url: path+"ProfessorFuncionario/",
                type: "POST",
                crossDomain: true,
                dataType: 'json',
                data: $(this).serialize(),                    
                success: function(d) {
                        $('#professorFuncionario').val(d);
                        $('#frmCadastroProfessorVariavel #professorFuncionario').val(d);
                        $('#dataEntradaPrefeitura').val(''+changeDatePosition($('#dataEntradaPrefeitura').val(), 2, '-'));
                        $('#dataEntradaEscola').val(''+changeDatePosition($('#dataEntradaEscola').val(), 2, '-'));
                        $('#professorUser').val(d);
                        
                        $('#frmCadastroProfessorVariavel').css('display', 'block');
                        
                        if ($('#frmCadastroProfessor #action').val() == 'create'){
                        	loading('final');
                        	mensagem("Dados cadastrados com sucesso!!<br>Continue com o cadastro!","OK","bt_ok","sucesso");
                        	$(".btnFuncionario").hide();

                            return false;
                        	
                        	
                        }else {
                        	loading('final');
                        	mensagem("Dados alterados com sucesso!!","OK","bt_ok","sucesso");
                        }
                        
                        
                    },error: function() {
                        $('#dataEntradaPrefeitura').val(''+changeDatePosition($('#dataEntradaPrefeitura').val(), 2, '-'));
                        $('#dataEntradaEscola').val(''+changeDatePosition($('#dataEntradaEscola').val(), 2, '-'));
                        loading('final');
                        mensagem("Não modificado, verifique os campos.","OK","bt_ok","erro");
                    }
                });
        }
          

    });


    /* POST da tabela ProfessorFuncionarioVariavel */
    
    $('#frmCadastroProfessorVariavel').unbind('submit').on("submit", function(event) {

    	var retorno = validaForm("ProfessorFuncionarioVariavel");
        event.preventDefault();


        if (typeof retorno == 'undefined'){
        	loading('inicial');
            $.ajax({
                url: path+"ProfessorFuncionarioVariavel/",
                type: "POST",
                crossDomain: true,
                dataType: 'json',
                data: $(this).serialize(),                    
                    success: function(d) {
    

            	 		if ($('#frmCadastroProfessor #action').val() == 'create'){
            	 			loading('final');
            	 			mensagem("Dados cadastrados com sucesso!<br>Continue com o cadastro!","OK","bt_ok","sucesso");
                            $(".btnFuncionarioVariavel").hide();
                            $('#frmCadastroProfessorVariavel #action').val('create');
                            $('#frmCadastroProfessor #action').val('create');
                            $('#frmCadastroProfessor #id').val('create');
                            $('#frmCadastroProfessorVariavel #id').val('create');
                            $('#frmCadastroProfessorVariavel #professorFuncionario').val('create');
                            $('#cadUsuarioProfessor').css('display', 'block');
            	 		}else{
            	 			loading('final');
            	 			mensagem("Dados variáveis alterados com sucesso!","OK","bt_ok","sucesso");
            	 			
            	 		}
                        
                    },error: function() {
                        mensagem("Não modificado, verifique os campos.","OK","bt_ok","erro");
                    }
            });  

        }
        //
    });

    if(StoredCamposini.length > 0)
    {
        HtmlAddData='';
        for(var a=0; a<StoredCamposini.length;a++)
        {   
            //console.log("Data antes : "+StoredCamposini[a]);
            var DataSeparadaIni = StoredCamposini[a].substring(6,10)+'-'+StoredCamposini[a].substring(3,5)+'-'+StoredCamposini[a].substring(0,2);
            var DataSeparadaFim = StoredCamposfim[a].substring(6,10)+'-'+StoredCamposfim[a].substring(3,5)+'-'+StoredCamposfim[a].substring(0,2);
            //console.log("Data depois : "+DataSeparadaIni);

            HtmlAddData += '<div class="linha dataFixaSalva" style="margin:8px 0; border:solid thin gray; ">'+
                                '<div class="celulaGrande">'+
                                    '<div class="infoValueGG">'+
                                        '<div class="inicioCampoFixo">Início <b atrValor="'+StoredCamposini[a]+'" value="'+DataSeparadaIni+'">'+StoredCamposini[a].replace(/-/g, '/')+'</b></div>'+
                                        '<div class="terminoCampoFixo">Término <b atrValor="'+StoredCamposfim[a]+'" value="'+DataSeparadaFim+'">'+StoredCamposfim[a].replace(/-/g, '/')+'</b></div>'+
                                        '<div class="editar"></div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';

        }

        $(HtmlAddData).insertBefore( "#DatasAdd" );

        $('.editar').click(function(){
            $('#Inicio').val($(this).parent().find('.inicioCampoFixo b').attr("atrValor"));
            $('#Termino').val($(this).parent().find('.terminoCampoFixo b').attr("atrValor"));
            $( "#DatasAdd" ).show();
            $( this ).parents('.linha').remove();
        });

    }

    if(localStorage.getItem("professorEdt") != null && 
       localStorage.getItem("professorEdt") != undefined && 
       localStorage.getItem("professorEdt") != "null")
    {

        setValoresCadastroProfessor(localStorage.getItem("professorEdt"), false);
        localStorage.setItem("professorEdt",null);
    } else {
        setValoresCadastroProfessor(localStorage.getItem("professorEdt"), true);
    }

    GerarUpload($("#foto"), $("#imagem"), $("#imagem"));  

});


/**
 * Adicionando valores para edição de professor no BD
 * @param {Int} IDprofessor ID do professorFuncionarioVariavel
 * @param {Boolean} Creating    Verificação se está sendo criado ou modificado(True = Criar)
 */
function setValoresCadastroProfessor(IDprofessor, Creating)
{
    if(!Creating)
    {
        var NovoProfessorVariavelEditar =   getData("ProfessorFuncionarioVariavel", IDprofessor);
        var NovoProfessorEditar         =   getData("ProfessorFuncionario", NovoProfessorVariavelEditar.professorFuncionario.idprofessorFuncionario);

        var dataNE = NovoProfessorEditar.dataEntradaEscola
        
        var dataPMSP = NovoProfessorEditar.dataEntradaPrefeitura.substr(8,2)+"-"+NovoProfessorEditar.dataEntradaPrefeitura.substr(5,2)+"-"+NovoProfessorEditar.dataEntradaPrefeitura.substr(0,4)
        var dataES = NovoProfessorEditar.dataEntradaEscola.substr(8,2)+"-"+NovoProfessorEditar.dataEntradaEscola.substr(5,2)+"-"+NovoProfessorEditar.dataEntradaEscola.substr(0,4)

        /* Professor Funcionario */
        $('#frmCadastroProfessor #action').val("update");
        $('#frmCadastroProfessor #dataEntradaEscola').val(dataES);
        $('#frmCadastroProfessor #cep').val(NovoProfessorEditar.cep);
        $('#frmCadastroProfessor #rua').val(NovoProfessorEditar.rua);
        $('#frmCadastroProfessor #nome').val(NovoProfessorEditar.nome);
        $('#frmCadastroProfessor #dataEntradaPrefeitura').val(dataPMSP);
        $('#frmCadastroProfessor #ativo').val(NovoProfessorEditar.ativo);
        $('#frmCadastroProfessor #bairro').val(NovoProfessorEditar.bairro);
        $('#frmCadastroProfessor #numero').val(NovoProfessorEditar.numero);
        $('#frmCadastroProfessor #estado').val(NovoProfessorEditar.estado);
        $('#frmCadastroProfessor #estado').trigger('change');
        window.setTimeout(function(){
            $('#frmCadastroProfessor #cidade').val(NovoProfessorEditar.cidade);
        },1000);
        $('#frmCadastroProfessor #observacao').val(NovoProfessorEditar.observacao);
        $('#frmCadastroProfessor #complemento').val(NovoProfessorEditar.complemento);
        $('#frmCadastroProfessor #id').val(NovoProfessorEditar.idprofessorFuncionario);
        $('#frmCadastroProfessor #naturalidadePais').val(NovoProfessorEditar.naturalidadePais);
        $('#frmCadastroProfessor #QuinquenioNumber').html(NovoProfessorVariavelEditar.quinquenio);
        $('#frmCadastroProfessor #naturalidadeEstado').val(NovoProfessorEditar.naturalidadeEstado);

       
        /* Professor Funcionario Variavel */
        $('#frmCadastroProfessorVariavel #id').val(IDprofessor);
        $('#frmCadastroProfessorVariavel #action').val("update");
        $('#frmCadastroProfessorVariavel #qpe').val(NovoProfessorVariavelEditar.qpe);
        $('#frmCadastroProfessorVariavel #cargo').val(NovoProfessorVariavelEditar.cargo);
        $('#frmCadastroProfessorVariavel #letra').val(NovoProfessorVariavelEditar.letra);
        $('#frmCadastroProfessorVariavel #periodo').val(NovoProfessorVariavelEditar.periodo.idperiodo);
        $('#frmCadastroProfessorVariavel #formacao').val(NovoProfessorVariavelEditar.formacao);
        $('#frmCadastroProfessorVariavel #anoLetivo').val(NovoProfessorVariavelEditar.anoLetivo.idanoLetivo);
        $('#frmCadastroProfessorVariavel #quinquenio').val(NovoProfessorVariavelEditar.quinquenio);
        $('#frmCadastroProfessorVariavel #observacao').val(NovoProfessorVariavelEditar.observacao);
        $('#frmCadastroProfessorVariavel #descontoQuinquenio').val(NovoProfessorVariavelEditar.descontoQuinquenio);
        $('#frmCadastroProfessorVariavel #professorFuncionario').val(NovoProfessorVariavelEditar.professorFuncionario.idprofessorFuncionario);
        $('#frmCadastroProfessorVariavel #fotoProfessorFuncionario').val(NovoProfessorVariavelEditar.fotoProfessorFuncionario);

        

    } else {
        $('#frmCadastroProfessor #action').val("create");
    }
}

function cadastraUserProfessor(){
    var retorno = validaForm("ProfessorUsuario");
    
    if (typeof retorno == "undefined")
    {

        loading('inicial')
  
        var valores = "&email="+$('#emailUsuarioProfessor').val()+
                    "&professor="+$('#professorUser').val()+
                    "&login="+$('#loginProfessor').val()+
                    "&perfil="+$('#perfilCadastro').val()+
                    "&aluno=&moderador=";
        
        var action = $("#actionUserProfessor").val();
        
        if(action=="create"){
            if($('#senhaUserProfessor').val().length > 6){
            	loading('final')
            	return mensagem("A senha deve conter no máximo 6 caracteres!","OK","bt_ok","alerta");
            }else{
                valores+="&senha="+$('#senhaUserProfessor').val();
            }
        }else if(action=="update"){
            valores+= "&id="+$("#idEdtUserProfessor").val()+"&senha=";
        }
                
        $.ajax({
            url: path+"Usuario",
            type: "POST",
            crossDomain: true,
            data:"action="+action+valores,          
            success: function(d) {
                if(action=="create"){

                	$(".btnFuncionarioLogin").hide();
                	loading('final')
                    mensagem("Dados salvos com sucesso!","OK","bt_ok","sucesso");  
                    

                }else{
                	loading('final')
                    mensagem("Dados alterados com sucesso!","OK","bt_ok","sucesso");    
                }
            },error: function() {
                //console.log(d);
            }
        });
    }
}

function upFotoProfessor(valor){ 
    $('#linha8 #UpFoto .inputImg').removeClass( "clicado" );
    $('#linha8 #UpFoto .inputImg').css("background-position","0px 0px");
    if(valor=='S'){
        $("#cadUsuario").css("display","none");
        $(".blackPainel").css("display","block");
    }else{
        $(".blackPainel").css("display","none");
        $("#cadUsuario").css("display","block");    
    }       
}

function salvarFotoProfessor(){
    var idProfessor = $("#professorFuncionario").val();
    var tipoArquivo = $("#imagem").val();

    var extensao = (tipoArquivo.substring(tipoArquivo.lastIndexOf("."))).toLowerCase(); 
    var tipo = extensao.split('.');         
    
    if((tipo[1]=='jpg')||(tipo[1]=='png')||(tipo[1]=='jpeg')){
        var formData = new FormData($("#inserirArquivo")[0]);
        $.ajax({
            url: path+"ProfessorFuncionario/upload/ProfessorFuncionario/imagem/"+idProfessor,
            //url: path+"Alunos/upload/aluno/944",
            //url: path+"ProfessorFuncionario/upload/ProfessorFuncionario/imagem/121",
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
                var dataProfessores = getData("ProfessorFuncionario", idProfessor);
                $("#fotoCad").css("display","block").html("<img id='_foto' src='"+dataProfessores.fotoProfessorFuncionario+"' width='150' height='150'/>");
                debugger;
            }
        });
    }else{
        mensagem("Este arquivo não é uma imagem!, verifique os campos!","OK","bt_ok","erro");
    }   
}

function desbloquearEdicao () {
    $("#editar").val("");
    $("#botaoDesbloquear").css("display", "none");
    $("input").removeAttr("disabled");
    $("textarea").removeAttr("disabled");
    $("select").removeAttr("disabled");
    $("#UpFotoProfessor").css("display", "block");
    if ($("#idEdtUserProfessor").val() != "")
        {
            $("#senhaUserProfessor").prop("disabled", true);
        }
}