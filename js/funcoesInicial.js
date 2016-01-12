// JavaScript Document
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