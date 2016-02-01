//Murano Design

var usuarioObjeto;

$.ajax({
    url: path + "Usuario/" + usuarioId,
    async: false,
    crossDomain: true,
    type: "GET",
    success: function(d) {
        usuarioObjeto = d;
    }
});

//------------------------------------------------------------------------------------------------------------------------

//Carrega os dados da URL GET

var IdRoteiro = base64_decode(GetURLParameter('IdRoteiro'));
var IdQuestao = base64_decode(GetURLParameter('IdQuestao'));

//------------------------------------------------------------------------------------------------------------------------

$(document).ready(function() {
    carregaNomeRoteiro();
    //Verifica se o usuario está respondendo uma pergunta ou prestes a criar uma nova.
    if(IdQuestao == undefined)
    {
        addBoxNovaPergunta();
        carregaPerguntasRoteiro();        
    }
    else
    {
        carregaPerguntaId();
    }
    atribuiMostrarRespostas();
    atribuiResponderQuestao();
});

function carregaNomeRoteiro () {
    var nome;
    $.ajax({
        url: path + "Roteiro/" + IdRoteiro,
        async: false,
        crossDomain: true,
        type:"GET",
        success: function(d) {
            nome = d.nome;
        }
    });

    var htmlContent = '<a id="Bk_Rot" href="forumSecao.html?IdRoteiro='+GetURLParameter('IdRoteiro')+'">'+nome+'</a>';

    $('#Secao_forum_Titulo').html(htmlContent);
}

function addBoxNovaPergunta () {
    FirstBoxhtml = '<form id="frmCadastro_Questao">'+
                        '<div class="Box_perguntar_wrap">'+
                            '<div class="foto_aluno" style="background-image: url('+getUsuarioFoto()+')"></div>'+
                            '<div class="box_perguntar">'+
                                '<div class="perguntar_header">'+
                                    '<div class="nome_serie_aluno">'+getNomeUsuario()+'</div>'+
                                '</div>'+
                                '<input type="hidden" name="id" id="id"/> '+
                                '<input type="hidden" name="action" id="action" value="create"/>'+
                                '<input type="text" name="questao" id="questao" class="Pergunta_Input" />'+
                                '<input type="hidden" name="usuario" id="usuario" value="'+usuarioId+'"/>'+
                                '<input type="hidden" name="roteiro" id="roteiro" value="'+IdRoteiro+'"/>'+
                                //'<input type="file" name="anexo" id="anexo" size="45" style="display:none;" />'+
                            '</div>'+
                            '<div><input id="bt_pergunta_enviar" type="submit" value="Enviar" /></div>'+
                        '</div>'+
                    '</form>';

    $('#FORUM').append(FirstBoxhtml);
    atribuiBotaoEnviar();
}

function carregaPerguntasRoteiro () {

    var dataQuestoesRoteiro;

    $.ajax({
        url: path + "ForumQuestao/ListaPorRoteiro/" + IdRoteiro,
        type: "GET",
        async: false,
        crossDomain: true,
        success: function(data) {
            dataQuestoesRoteiro = data;
        }
    });

    for (var i = 0; i < dataQuestoesRoteiro.length; i++) {

        adcionaQuestao(dataQuestoesRoteiro[i]);
    }
}

function adcionarBotaoExcluirQuestao (questao) {
    var questaoId = questao.idforumQuestao;

    if (questao.usuario.aluno != null)
    {
        if (alunoID == questao.usuario.aluno.idAluno)
            $("#idQuestao_"+questaoId+" .pergunta_header").append('<div id="bt_fechar" onclick="deletarQuestao('+questaoId+');" style="float:right"></div>');
    }
    else if (questao.usuario.professor != null)
    {
        if (usuarioObjeto.professor.idprofessorFuncionario == questao.usuario.professor.idprofessorFuncionario)
            $("#idQuestao_"+questaoId+" .pergunta_header").append('<div id="bt_fechar" onclick="deletarQuestao('+questaoId+');" style="float:right"></div>');
    }
}

function carregaRespostas (questaoId) {

    var dataRespostas;

    $.ajax({
        url: path + "ForumResposta/ListarPorQuestao/" + questaoId,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(data) {

            dataRespostas = data;
        }
    });

    if (!(dataRespostas.length > 0))
    {
        $("#idQuestao_"+questaoId+" .respostas").addClass("R_aparecer");
    }
    else
    {
        var botoesRespostas =   '<span class="respostas_display"> | '+
                                '<span class="mostrar_respostas" id="mostrar_'+questaoId+'"> mostrar respostas </span><span class="esconder_respostas" id="esconder_'+questaoId+'"> esconder respostas </span>'+
                                '</span>';
        $("#idQuestao_"+questaoId+" .responder_ocultar").append(botoesRespostas);

        for (var i = 0; i < dataRespostas.length; i++) {
            var respostaId = dataRespostas[i].idforumResposta;
            var resposta = dataRespostas[i].resposta;
            var nomeUsuario;
            var fotoUsuario;
            if (dataRespostas[i].usuario.aluno != null)
            {
                fotoUsuario = dataRespostas[i].usuario.aluno.fotoAluno;
                $.ajax({
                    url: path + "AlunoVariavel/aluno/" + dataRespostas[i].usuario.aluno.idAluno,
                    async: false,
                    crossDomain: true,
                    type: "GET",
                    success: function(dataAlunoVariavel) {
                        nomeUsuario = dataRespostas[i].usuario.aluno.nome + " | " + dataAlunoVariavel.anoEstudo.ano + "º Ano - " + dataAlunoVariavel.periodo.periodo;
                    }
                });
            }
            else if (dataRespostas[i].usuario.professor != null)
            {
                fotoUsuario = dataRespostas[i].usuario.professor.fotoProfessorFuncionario;
                nomeUsuario = dataRespostas[i].usuario.professor.nome+" | "+ dataRespostas[i].usuario.perfil.perfil;
            }
            var respostaHtml =  '<div class="Box_resposta_wrap" id="idResposta_'+respostaId+'">'+
                                    '<div class="foto_aluno" style="background-image:url('+fotoUsuario+')"></div> '+
                                    '<div class="box_resposta"> '+
                                        '<div class="resposta_header"> '+
                                            '<div class="nome_serie_aluno">'+nomeUsuario+'</div> '+
                                        '</div> '+
                                        '<div class="msg"> '+resposta+' </div> '+
                                    '</div> '+
                                '</div>';
    
            $("#idQuestao_"+questaoId+" .respostas").append(respostaHtml);

            adcionarBotaoExcluirResposta(dataRespostas[i], questaoId);
        }

    }
}

function adcionarBotaoExcluirResposta (resposta, questaoId) {
    var respostaId = resposta.idforumResposta;

    if (resposta.usuario.aluno != null)
    {
        if (alunoID == resposta.usuario.aluno.idAluno)
            $("#idResposta_"+respostaId+" .resposta_header").append('<div id="bt_fechar" onclick="deletarResposta('+respostaId+','+questaoId+');" style="float:right"></div>');
    }
    else if (resposta.usuario.professor != null)
    {
        if (usuarioObjeto.professor.idprofessorFuncionario == resposta.usuario.professor.idprofessorFuncionario)
            $("#idResposta_"+respostaId+" .resposta_header").append('<div id="bt_fechar" onclick="deletarResposta('+respostaId+','+questaoId+');" style="float:right"></div>');
    }
}

function carregaPerguntaId () {
    
    var questao;

    $.ajax({
        url: path + "ForumQuestao/" + IdQuestao,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(data) {
            questao = data;
        }
    });

    adcionaQuestao(questao);
}

function adcionaQuestao(questao) {  
    var questaoId = questao.idforumQuestao;
    var questaoTexto = questao.questao;
    var nomeUsuario;
    if (questao.usuario.aluno != null)
    {
        var fotoUsuario = questao.usuario.aluno.fotoAluno;
        $.ajax({
            url: path + "AlunoVariavel/aluno/" + questao.usuario.aluno.idAluno,
            async: false,
            crossDomain: true,
            type: "GET",
            success: function(dataAlunoVariavel) {
                nomeUsuario = questao.usuario.aluno.nome + " | " + dataAlunoVariavel.anoEstudo.ano + "º Ano - " + dataAlunoVariavel.periodo.periodo;
            }
        });
    }
    else if (questao.usuario.professor != null)
    {
        var fotoUsuario = questao.usuario.professor.fotoProfessorFuncionario;
        var nomeUsuario = questao.usuario.professor.nome+" | "+ questao.usuario.perfil.perfil;
    }
    var htmlContent =   '<div class="Pergunta_Resposta_Container" id="idQuestao_'+questaoId+'">'+
                            '<div class="Box_pergunta_wrap">'+
                                '<div class="foto_aluno" style="background-image:url('+fotoUsuario+')"></div>'+
                                '<div class="box_pergunta">'+
                                    '<div class="pergunta_header">'+
                                        '<div class="nome_serie_aluno">'+nomeUsuario+'</div>'+
                                    '</div>'+
                                    '<div class="Pergunta"> '+questaoTexto+'</div>'+
                                '</div>'+
                            '</div>'+
                            '<div class="respostas"></div><div class="responder_ocultar"><span class="bt_responder" id="responder_'+questaoId+'""> Responder </span></div>'+
                        '</div>';
    $('#FORUM').append(htmlContent);
    carregaRespostas(questaoId);
    adcionarBotaoExcluirQuestao(questao);
}

function atribuiBotaoEnviar () {
    $('#bt_pergunta_enviar').click(function() {
        event.preventDefault();

        if ($(".Pergunta_Input").val().length > 9)
        {
            var formData = new FormData($("#frmCadastro_Questao")[0]);
            var questaoId;

            console.log(formData)
    
            $.ajax({
                url: path + "ForumQuestao/",
                type: "POST",
                async: false,
                crossDomain: true,
                contentType: false,
                cache: false,
                processData:false,
                data: formData,
                success: function(d) {
                    mensagem("Pergunta feita com sucesso!","OK","bt_ok","sucesso");
                    questaoId = d;
                }
            });
            adcionaNovaQuestao(questaoId);
            $('#questao').val('');
        }
        else
        {
            mensagem("Sua pergunta está muito curta!","OK","bt_ok","erro");
        }
    });
}

function adcionaNovaQuestao (questaoId) {

    var questaoTexto = $('#questao').val();

    var htmlContent =   '<div class="Pergunta_Resposta_Container" id="idQuestao_'+questaoId+'">'+
                            '<div class="Box_pergunta_wrap">'+
                                '<div class="foto_aluno" style="background-image:url('+getUsuarioFoto()+')"></div>'+
                                '<div class="box_pergunta">'+
                                    '<div class="pergunta_header">'+
                                        '<div class="nome_serie_aluno">'+getNomeUsuario()+'</div>'+
                                    '</div>'+
                                    '<div class="Pergunta">'+questaoTexto+'</div>'+
                                '</div>'+
                            '</div>'+
                            '<div class="respostas"></div><div class="responder_ocultar"><span class="bt_responder" id="responder_'+questaoId+'""> Responder </span></div>'+
                        '</div>';
    $('#FORUM').append(htmlContent);
    $("#idQuestao_"+questaoId+" .pergunta_header").append('<div id="bt_fechar" onclick="deletarQuestao('+questaoId+');" style="float:right"></div>');
    $("#idQuestao_"+questaoId+" .respostas").addClass("R_aparecer");
}

function atribuiMostrarRespostas () {
    $('.mostrar_respostas').click(function() {
        var questaoId = $(this).attr('id').split('_')[1];

        $('#idQuestao_'+questaoId+' .respostas').toggle();
        $('#idQuestao_'+questaoId+' .esconder_respostas').toggle();
        $(this).toggle();
    });
    $('.esconder_respostas').click(function() {
        var questaoId = $(this).attr('id').split('_')[1];

        $('#idQuestao_'+questaoId+' .respostas').toggle();
        $('#idQuestao_'+questaoId+' .mostrar_respostas').toggle();
        $(this).toggle();
    });
}

function atribuiResponderQuestao () {
    $('.bt_responder').click(function() {
        var questaoId = $(this).attr('id').split('_')[1];
        htmlResposta = '<form id="frmCadastro_Resposta">'+
                            '<div class="Box_resposta_wrap"> '+
                                '<div class="foto_aluno" style="background-image:url('+getUsuarioFoto()+')"></div> '+
                                '<div class="box_resposta"> '+
                                    '<div class="resposta_header"> '+
                                        '<div class="nome_serie_aluno">'+getNomeUsuario()+'</div> '+
                                    '</div> '+
                                    '<input type="hidden" name="action" id="action" value="create"> </input> '+
                                    '<input class="msg_input" name="resposta" id="resposta" type="text" placeholder="Escreva seu comentário."></input> '+
                                    //'<input type="file" name="anexo" id="anexo" size="45" style="display:none;" />'+
                                    '<input type="hidden" name="usuario" id="usuario" value="'+usuarioObjeto.idusuario+'"> </input> '+
                                    '<input type="hidden" name="forumQuestao" id="forumQuestao" value="'+questaoId+'"></input> '+
                                '</div> '+
                                '<div class="bt_resposta_enviar_cancelar">'+
                                    '<input type="submit" class="enviar" id="enviarResposta_'+questaoId+'" value="enviar"></input> | <span class="cancelar" id="cancelarResposta_'+questaoId+'"> cancelar </span> '+
                                '</div> '+
                            '</div> '+
                        '</form>';
        $('#idQuestao_'+questaoId+' .respostas').append(htmlResposta);
        $('#idQuestao_'+questaoId+' .respostas').show();
        $('#idQuestao_'+questaoId+' .responder_ocultar').hide();
        atribuiCancelarResposta();
        atribuiEnviarResposta();
    });
}

function atribuiCancelarResposta () {
    $('.cancelar').click(function() {
        var questaoId = $(this).attr('id').split('_')[1];

        $('#frmCadastro_Resposta').remove();
        $('#idQuestao_'+questaoId+' .respostas').hide();
        $('#idQuestao_'+questaoId+' .responder_ocultar').show();
        $('#idQuestao_'+questaoId+' .esconder_respostas').hide();
        $('#idQuestao_'+questaoId+' .mostrar_respostas').show();
    });
}

function atribuiEnviarResposta (){
    $('.enviar').click(function() {
        var questaoId = $(this).attr('id').split('_')[1];
        event.preventDefault();

        if ($("#resposta").val().length > 9)
        {
            var formData = new FormData($("#frmCadastro_Resposta")[0]);
            var respostaId;
    
            $.ajax({
                url: path + "ForumResposta/",
                type: "POST",
                async: false,
                crossDomain: true,
                mimeType:"multipart/form-data",
                contentType: false,
                cache: false,
                processData:false,
                data: formData,
                success: function(d) {
                    mensagem("Resposta dada com sucesso!","OK","bt_ok","sucesso");
                    respostaId = d;
                }
            });

            var resposta;
            adcionaNovaResposta(questaoId, respostaId);
            $.ajax({
                url: path + "ForumResposta/" + respostaId,
                type: "GET",
                async: false,
                crossDomain: true,
                success: function(d) {
                    resposta = d;
                }
            });
            adcionarBotaoExcluirResposta(resposta, questaoId);

            $('#frmCadastro_Resposta').remove();
            $('#idQuestao_'+questaoId+' .responder_ocultar').show();
            if ($('#idQuestao_'+questaoId+' .mostrar_respostas').length > 0)
            {
                $('#idQuestao_'+questaoId+' .esconder_respostas').hide();
                $('#idQuestao_'+questaoId+' .mostrar_respostas').show();
            }
            else
            {
                var botoesRespostas =   '<span class="respostas_display"> | '+
                                        '<span class="mostrar_respostas" id="mostrar_'+questaoId+'"> mostrar respostas </span><span class="esconder_respostas" id="esconder_'+questaoId+'"> esconder respostas </span>'+
                                        '</span>';                     
                $("#idQuestao_"+questaoId+" .responder_ocultar").append(botoesRespostas);
                $('#idQuestao_'+questaoId+' .esconder_respostas').show();
                $('#idQuestao_'+questaoId+' .mostrar_respostas').hide(); 
                $('#idQuestao_'+questaoId+' .mostrar_respostas').click(function() {
                    $('#idQuestao_'+questaoId+' .respostas').toggle();
                    $('#idQuestao_'+questaoId+' .esconder_respostas').toggle();
                    $(this).toggle();
                });
                $('#idQuestao_'+questaoId+' .esconder_respostas').click(function() {
                    $('#idQuestao_'+questaoId+' .respostas').toggle();
                    $('#idQuestao_'+questaoId+' .mostrar_respostas').toggle();
                    $(this).toggle();
                });
            }            
        }
        else
        {
            mensagem("Sua pergunta está muito curta!","OK","bt_ok","erro");
        }
    });
}

function adcionaNovaResposta (questaoId, respostaId) {
    var respostaHtml =  '<div class="Box_resposta_wrap" id="idResposta_'+respostaId+'">'+
                            '<div class="foto_aluno" style="background-image:url('+getUsuarioFoto()+')"></div> '+
                            '<div class="box_resposta"> '+
                                '<div class="resposta_header"> '+
                                    '<div class="nome_serie_aluno">'+getNomeUsuario()+'</div> '+
                                '</div> '+
                                '<div class="msg"> '+$("#resposta").val()+' </div> '+
                            '</div> '+
                        '</div>';
    
    $("#idQuestao_"+questaoId+" .respostas").append(respostaHtml);
}

function deletarQuestao (questaoId) {
    $('#idQuestao_'+questaoId).remove();

    $.ajax({
        url: path + "ForumResposta/DeletarForumRespQuest/" + questaoId,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(dataRespostas) {
            mensagem("Questão deletada!","OK","bt_ok","sucesso");
        }
    });
}

function deletarResposta (respostaId, questaoId) {
    $('#idResposta_'+respostaId).remove();

    $.ajax({
        url: path+"ForumResposta/DeletarForumResp/"+respostaId,
        type: "GET",
        crossDomain: true,
        async: false,
        success: function() {
            mensagem("Resposta deletada!","OK","bt_ok","sucesso");
        }
    });

    if($('#idQuestao_'+questaoId+' .Box_resposta_wrap').length < 1)
        $('#idQuestao_'+questaoId+' .respostas_display').remove();
}

function getNomeUsuario () {

    var nomeUsuario;

    if (usuarioObjeto.aluno != null)
    {
        $.ajax({
            url: path + "AlunoVariavel/aluno/" + usuarioObjeto.aluno.idAluno,
            async: false,
            crossDomain: true,
            type: "GET",
            success: function(dataAlunoVariavel) {
                nomeUsuario = usuarioObjeto.aluno.nome + " | " + dataAlunoVariavel.anoEstudo.ano + "º Ano - " + dataAlunoVariavel.periodo.periodo;
            }
        });
    }
    else if (usuarioObjeto.professor != null)
    {
        nomeUsuario = usuarioObjeto.professor.nome+" | "+ usuarioObjeto.perfil.perfil;
    }

    return nomeUsuario;
}


function getUsuarioFoto () {

    var fotoUsuario;

    if (usuarioObjeto.aluno != null)
    {
        fotoUsuario = usuarioObjeto.aluno.fotoAluno;
    }
    else if (usuarioObjeto.professor != null)
    {
        fotoUsuario = usuarioObjeto.professor.fotoProfessorFuncionario;
    }

    return fotoUsuario;
}