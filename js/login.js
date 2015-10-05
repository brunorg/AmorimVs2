
$(document).ready(function() {
    $("#btnSubmit").click(function() {
        logar();
    });
});

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
				localStorage.setItem("objetoUsuario", a);	
				var dadosUsuario = localStorage.getItem("objetoUsuario");
		
				if (typeof a !== "undefined") {					
					if(a.perfil.perfil == "Aluno"){
						localStorage.setItem("alunoId",a.aluno.idAluno);
						window.location = "areaAluno.html";				
					}
					else if(a.perfil.perfil == "Professor"){
						localStorage.setItem("professorId", a.professor.idprofessorFuncionario)	;
						window.location = "areaProfessor.html";
					}
					else if(a.perfil.perfil=="Coordenacao"){
						window.location = "areaCoordenacao.html";
					}
					else if(a.perfil.perfil=="Secretaria"){
						window.location = "cadastros.html";
					}
				}else{
					alert("Deve-se logar antes");
					localStorage.setItem("usuarioTipo","semTipo");
					localStorage.setItem("usuarioId","semId");
					window.location = 'index.html';
				}
			}
		});
	});
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

