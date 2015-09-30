
function logar() {
    $("#frm").unbind("submit").on("submit", function(a) {
        a.preventDefault();
        var b = navigator.userAgent;
        $.ajax({
            url: path + "Logar",
            type: "post",
            crossDomain: !0,
            async: !0,
            data: $(this).serialize() + "&versao=" + b,
            success: function(a) {
				
				if ("undefined" !== typeof a) {
					if  (a.perfil.perfil != 'Aluno') localStorage.setItem("professorId", a.professor.idprofessorFuncionario)
				}				
				
                "undefined" !== typeof a ? (localStorage.setItem("usuarioTipo", a.perfil.perfil), localStorage.setItem("usuarioId", a.idusuario), "Aluno" == a.perfil.perfil ? window.location = "areaAluno.html" : "Professor" == a.perfil.perfil ? window.location = "areaProfessor.html" : "Coordenacao" == a.perfil.perfil ? window.location = "areaCoordenacao.html" : "Secretaria" == a.perfil.perfil && (window.location = "cadastros.html")) : alert("Login e senha inv\xe1lidos!")
            }
        })
    })
}

function caixaEsqueci() {
    $("#esquecisenha").css("display", "block"), $(".boxGlobal").css("display", "block")
}

function esqueciSenha() {
    var a = $("#email").val();
    $.ajax({
        url: path + "Usuario/recuperarSenha/" + a,
        type: "GET",
        async: !0,
        crossDomain: !0,
        beforeSend: function() {
            $("#esquecisenha").css("display", "none"), $(".boxGlobal").css("display", "none"), loading("inicial")
        },
        success: function() {
            loading("final"), mensagem("Foi enviada uma nova senha para seu email!", "OK", "bt_ok", "sucesso")
        }
    })
}

function cancelar() {
    $("#esquecisenha").css("display", "none"), $(".boxGlobal").css("display", "none")
}

function mensagem(a, b, c, d, e, f, g) {
    if ("sucesso" == d || "erro" == d || "alerta" == d) {
        var h = '<div class="box_mensagem"><div class="txt_mensagem"><span id="' + d + '"></span>' + a + '</div><div class="btn_mensagem_1"><input type="button" class="bt_ok left" value="' + b + '" /></div></div>';
        $("#boxMensagemGeral").html(h).show(), window.setTimeout(function() {
            botoes(b, c)
        }, 1e3)
    } else if ("confirm" == d) {
        var h = '<div class="box_mensagem"><div class="txt_mensagem"><span id="' + d + '"></span>' + a + '</div><div class="btn_mensagem"><input type="button" class="bt_ok left" value="OK" onclick="' + g + "('" + e + "','" + f + '\')"/><input type="button" class="bt_cancelar left" value="Cancelar" /></div></div>';
        $("#boxMensagemGeral").html(h).show(), window.setTimeout(function() {
            botoes(b, c)
        }, 1e3)
    }
}

function botoes(a, b) {
    switch (a) {
        case "OK":
            $("." + b).click(function() {
                $("#boxMensagemGeral").hide()
            });
            break;
        case "Cancelar":
            $("." + b).click(function() {
                $("#boxMensagemGeral").hide()
            })
    }
}
$(document).ready(function() {
    $("#btnSubmit").click(function() {
        logar();
    });

    $('.btnMenu.Active').click(function(){
        trocarConteudoInicial($(this).index());

        $(".btnMenu.Active").removeClass("btClicked");
        $(this).addClass("btClicked");
    });

    
    $('#Conteudo_Corpo .rightSide .contentRightSide .contentItem').mouseover(function(){
        $(this).addClass("MouseHover");
    }).mouseout(function(){
        $(this).removeClass("MouseHover");
    });

    $('#Conteudo_Corpo .rightSide .contentRightSide .contentItem.ativo').click(function(){
        ShowPopUp("PopupProducao");
    });


    $('#Conteudo_Corpo .Selecao5 .Conteudo .Icones .Icone.Ativo').click(function(){
        ShowPopUp("PopupCalendario");
    });

    $('#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .btn_close').click(function(){
        trocarConteudoInicial(4);
    });

    $('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .btn_close').click(function(){
        trocarConteudoInicial(5);
    });

    $('#Conteudo_Corpo .Selecoes.PopupProducao .contentSlide .MainSlide .Arrow').click(function(){
        NextFrameSlide($(this).index());
    });

    $('#Conteudo_Corpo .Selecoes.PopupCalendario .contentSlide .MainSlide .Arrow').click(function(){
        NextFrameSlideCalendario($(this).index());
    });

    $("#Conteudo_Corpo .Selecoes.Selecao3.rightSide .contentRightSide .listaComissao .opcaoComissao").click(function(){
        $("#Conteudo_Corpo .Selecoes.Selecao3.rightSide .contentRightSide .listaComissao .opcaoComissao").removeClass("Ativo");
        $(this).addClass("Ativo");
        List($(this).index());
    });

    localStorage.getItem("usuarioTipo"), localStorage.getItem("usuarioId")
});
