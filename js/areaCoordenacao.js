/* global usuarioId */
/* global getData */
/* global path */
/* global base64_encode */
/* global console */
/* global $ */ // JQuery

"use strict";


/** Pega IDs essenciais para os serviços. */
var userID = usuarioId;
var coordID = getProfessorByUsuario();

function getProfessorByUsuario()
{
	var dataUsuario1 = getData("Usuario", userID);
	return dataUsuario1.professor.idprofessorFuncionario;
}

/**
 * Função auxiliar para reduzir o ajax
 * @param {string} url - url após "path" para fazer a requisição.
 * @param {string} postOrGet - aceita "POST" ou "GET"
 * @param {string} optional default="" - data - data a ser enviada caso seja "POST"
 * @param {bool} optional default="false" - async - determina se a requisição sera síncrona ou assíncrona
 * @param {function} callback - função a ser executada apos "success" do ajax. Recebe o resultado do ajax como argumento no callback.
 */
function getAjax(url, postOrGet, data, async, callback) {

	if (async === undefined) 	 { async = false; }
	if (postOrGet === undefined) { postOrGet = "GET"; }
	if (data === undefined) 	 { data = ""; }

	$.ajax({
        url: path + url,
        async: async,
        crossDomain: true,
        type: postOrGet,
        data: data,
        success: function(resultado) {
        	callback(resultado);
        }
    });

}

/** Carrega lista de edicadores com link que redireciona para os gráficos de tutoria de cada um. */
function carregarListaProfessores() {
	getAjax("Tutoria", "GET", "", false, function(result){
		result.forEach(function(professor){

			var professorId = base64_encode(""+professor.tutor.idprofessorFuncionario);
			var professorFoto = professor.tutor.fotoProfessorFuncionario;
			var professorNome = professor.tutoria;

			$(".lista_educadores").append(
										  "<section class=\"educador_info\">"+
										  	  "<a href=\"grupoTutoria.html?ID="+professorId+"\">"+
											      "<img src=\""+professorFoto+"\" alt=\""+professorNome+"\" class=\"educador_foto\">"+
											      "<span class=\"educador_nome\">"+professorNome+"</span>"+
										      "</a>"+
										  "</section>"
										  );
		});
	});
}

/** Objeto do MuralGestao */
function MuralGestao() {

	var self = this;

	/** Atualiza os posts do mural. Apaga e sobrescreve "div#conteudoMuralGestao" */
	self.refresh = function() {

		$("#iconeNovaPostagem").show();

		getAjax("MuralCoordenacao/ListarCoordenacao/"+coordID, "GET", "", false, function(result){

			var htmlPost="";

			result.forEach(function(postMuralGestao){

				htmlPost += "<section class=\"mural_post_item\">";
				htmlPost += "<main class=\"mural_post_mensagem\">";
				htmlPost += "<span class=\"post_mural_mensagem\" id=\"mensagemPostMuralGestao"+postMuralGestao.idMuralCoordenacao+"\">";
				htmlPost += postMuralGestao.mensagem;
				htmlPost += "<\/span>";
				htmlPost += "<\/main>";
				htmlPost += "<aside class=\"mural_post_cabecalho\">";
				htmlPost += "<span class=\"post_mural_data\">"+postMuralGestao.data+"<\/span> | <span class=\"post_mural_horario\">"+postMuralGestao.hora+"<\/span>";
				htmlPost += "<\/aside>";
				htmlPost += "<aside class=\"mural_post_btns\">";
				htmlPost += "<span class=\"mural_btn btn_editar\" onclick=\"muralGestao.edit("+postMuralGestao.idMuralCoordenacao+")\"><\/span><span class=\"mural_btn btn_excluir\" onclick=\"muralGestao.delete("+postMuralGestao.idMuralCoordenacao+")\"><\/span>";
				htmlPost += "<\/aside>";
				htmlPost += "<\/section>";

			});

			$("#conteudoMuralGestao").html(htmlPost);
			$("#conteudoMuralGestao2").hide();
			$("#conteudoMuralGestao").show();
		});
	};

	/**
	 * Abre janela para editar ou escrever um post.
	 * @param {number} optional default=0 - idPost - id do post a ser editado. (Veja o método "save")
	 * @param {string} optional default="" - mensagem - mensagem do post a ser editado.
	 */
	self.new = function(idPost, mensagem) {

		if (idPost === undefined) {
			idPost = 0;
			mensagem = "";
		}

		var htmlPost="";

		htmlPost += "<select class=\"box_select\" id=\"selectMuralGestao\">";
        htmlPost += "<option value=\"26\"  >Secretaria</option>";
        htmlPost += "<option value=\"24\"  >Professores</option>";
        htmlPost += "<option value=\"32\"  >Professores Manhã</option>";
        htmlPost += "<option value=\"33\"  >Professores Tarde</option>";
        htmlPost += "<option value=\"34\"  >Professores Noite</option>";
		htmlPost += "<\/select>";
		htmlPost += "<textarea class=\"box_textarea textarea_mural_gestao\" name=\"mural_gestao_mensagem\" id=\"textareaMuralGestao\" placeholder=\"Digite o texto da mensagem\">"+mensagem+"<\/textarea>";
		htmlPost += "<aside class=\"box_ic\">";
		htmlPost += "<span class=\"ic_cancelar\" onclick=\"muralGestao.refresh()\">&nbsp;<\/span>";
		htmlPost += "<span class=\"ic_salvar\" onclick=\"muralGestao.save("+idPost+")\">&nbsp;<\/span>";
		htmlPost += "<\/aside>";


		$("#conteudoMuralGestao2").html(htmlPost);
		$("#conteudoMuralGestao2").show();
		$("#conteudoMuralGestao").hide();
		$("#iconeNovaPostagem").hide();

	};

	/**
	 * Salva o post no BD.
	 * @param {number} idPost - ID do post que será editado. Caso seja 0 um novo post será criado.
	 */
	self.save = function(idPost) {

		var valorSelectBox = Number($("#selectMuralGestao").val());
		var today = new Date().toJSON();

		var dataSend = today.slice(2,10);
		var horaSend = today.slice(11,16);
		var mensagemSend = $("#textareaMuralGestao").val();
		var perfilSend;
		var periodoSend;

		if (valorSelectBox === 26) {
			// se for secretaria
			perfilSend = 26;
			periodoSend = 0;
		} else {
			// se for professor
			perfilSend = 24;
			periodoSend = valorSelectBox - 24;
		}

		// perfil: 24 = professor, 26 = secretaria
		// periodos: 0 = todos, 8 = manha, 9 = tarde, 10 = noite

		getAjax("MuralCoordenacao/", "POST", "action=create&professor="+coordID+"&data="+dataSend+"&hora="+horaSend+"&mensagem="+mensagemSend+"&perfil="+perfilSend+"&periodo="+periodoSend+"&id="+idPost, false, function(result){
			console.log(result);
		});

		self.refresh();
	};

	/**
	 * Funçao acionada pelo botão de editar, repassa o ID e a mensagem do post para o método "new".
	 * @param {number} idPost - ID do post que será editado.
	 */
	self.edit = function(idPost) {
		var mensagemPost = $("#mensagemPostMuralGestao"+idPost).html();

		self.new(idPost, mensagemPost);
	};

	/**
	 * Funçao acionada pelo botão de deletar, deleta o post no BD.
	 * @param {number} idPost - ID do post que será deletado.
	 */
	self.delete = function(idPost) {

		getAjax("MuralCoordenacao/", "POST", "action=delete&id="+idPost, false, function(result){console.log(result);});

		self.refresh();
	};

}

var muralGestao = new MuralGestao();

window.onload = function() {
	$(".scroll_receiver").mCustomScrollbar({
		axis: "y",
	});

	// Educadores
	carregarListaProfessores();

	// Mural Gestão
	muralGestao.refresh();
};



