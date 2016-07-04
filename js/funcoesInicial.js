// JavaScript Document

$(document).ready(atribuirEventos);

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
            loading("final");
			mensagem("Foi enviada uma nova senha para seu email!", "OK", "bt_ok", "sucesso");
        }
    })
}

function cancelar() {
    $("#esquecisenha").css("display", "none"), $(".boxGlobal").css("display", "none")
}


function atribuirEventos() {
    removerEstiloDanger();
    alterarFormulario();
    enviarEsqueciSenha();
}

function removerEstiloDanger() {
    $("#usuario").keyup(function() {
        $("#textLoginInvalido").hide();
        $("#usuario").removeClass("input-danger");
        $("#senha").removeClass("input-danger");
    });
    $("#senha").keyup(function() {
        $("#textLoginInvalido").hide();
        $("#usuario").removeClass("input-danger");
        $("#senha").removeClass("input-danger");
    });
    $("#email").keyup(function() {
        $("#textEmailInvalido").hide();
        $("#email").removeClass("input-danger");
    });
}

function alterarFormulario() {
    $(".link").click(function() {
        var form = $(this).attr("data-show");
        $(".form").hide();
        $("#"+form).show();
    });
}

function enviarEsqueciSenha() {
    $("#enviarEsqueceuSenha").click(function() {
        if ($("#email").val() !== "") {
            esqueciSenha();
        } else {
            $("#textEmailInvalido").show();
            $("#email").addClass("input-danger");
        }
    });
}