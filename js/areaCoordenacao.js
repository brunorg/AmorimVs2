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
	getAjax("Tutoria/TutoriaAno/2015", "GET", "", false, function(result){
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

function MuralComum() {

	var self = this;


	self.refresh = function() {

		$("#iconeNovaPostagem2").show();



		getAjax("Mural/ListarProfessor/"+coordID, "GET", "", true, function(result){

			console.log(result)
			var htmlPost="";

			result.forEach(function(postMuralComum){

				htmlPost += "<section class=\"mural_post_item\">";
				htmlPost += "<main class=\"mural_post_mensagem\">";
				htmlPost += "<span class=\"post_mural_mensagem\" id=\"mensagemPostMuralComum"+postMuralComum.idmural+"\">";
				htmlPost += postMuralComum.mensagem;
				htmlPost += "<\/span>";
				htmlPost += "<\/main>";
				htmlPost += "<aside class=\"mural_post_cabecalho\">";
				htmlPost += "<span class=\"post_mural_data\">"+postMuralComum.data+"<\/span> | <span class=\"post_mural_horario\">"+postMuralComum.hora+"<\/span>";
				htmlPost += "<\/aside>";
				htmlPost += "<aside class=\"mural_post_btns\">";
				htmlPost += "<span class=\"mural_btn btn_editar\" onclick=\"muralComum.edit("+postMuralComum.idmural+")\"><\/span><span class=\"mural_btn btn_excluir\" onclick=\"muralComum.delete("+postMuralComum.idmural+")\"><\/span>";
				htmlPost += "<\/aside>";
				htmlPost += "<\/section>";

			});

			$("#conteudoMuralComum").html(htmlPost);
			$("#conteudoMuralComum2").hide();
			$("#conteudoMuralComum").show();
		});
	};

	self.new = function(idPost, mensagem) {

		if (idPost === undefined) {
			idPost = 0;
			mensagem = "";
		}

		var htmlPost="";

		htmlPost += "<select class=\"box_select\" id=\"selectMuralComum\">";
        htmlPost += "<option value=\"1\"  >Todos</option>";
        htmlPost += "<option value=\"8\"  >Manhã</option>";
        htmlPost += "<option value=\"9\"  >Tarde</option>";
        htmlPost += "<option value=\"10\"  >Noite</option>";
		htmlPost += "<\/select>";
		htmlPost += "<textarea class=\"box_textarea textarea_mural\" name=\"mural_gestao_mensagem\" id=\"textareaMuralComum\" placeholder=\"Digite o texto da mensagem\">"+mensagem+"<\/textarea>";
		htmlPost += "<aside class=\"box_ic\">";
		htmlPost += "<span class=\"ic_cancelar\" onclick=\"muralComum.refresh()\">&nbsp;<\/span>";
		htmlPost += "<span class=\"ic_salvar\" onclick=\"muralComum.save("+idPost+")\">&nbsp;<\/span>";
		htmlPost += "<\/aside>";


		$("#conteudoMuralComum2").html(htmlPost);
		$("#conteudoMuralComum2").show();
		$("#conteudoMuralComum").hide();
		$("#iconeNovaPostagem2").hide();

	};

	self.save = function(idPost) {

		var valorSelectBox = Number($("#selectMuralComum").val());

		var periodoSend = valorSelectBox;
		var mensagemSend = $("#textareaMuralComum").val();

		loading("inicial")

		getAjax("Mural/", "POST", "action=create&idProfessor="+coordID+"&mensagem="+mensagemSend+"&periodo="+periodoSend+"&id="+idPost, true, function(result){
			console.log(result);
			self.refresh();
			loading("final")
		});

	};

	self.edit = function(idPost) {
		var mensagemPost = $("#mensagemPostMuralComum"+idPost).html();
		console.log(idPost)
		self.new(idPost, mensagemPost);
	};

	self.delete = function(idPost) {

		loading("inicial")
		getAjax("x`/", "POST", "action=delete&id="+idPost, true, function(result){
			console.log(result);
			self.refresh();
			loading("final");
		});

	};

}

function MuralJeiff() {

	var self = this;


	self.refresh = function() {

		$("#iconeNovaPostagem3").show();

		getAjax("JeiffPea", "GET", "", true, function(result){

			console.log(result)
			var htmlPost="";

			result.forEach(function(postJeiff){

				htmlPost += "<section class=\"jeiff_post_item\" id=\"jeiffPost"+postJeiff.idJeiffPea+"\">";
				htmlPost += "<aside class=\"jeiff_post_cabecalho\">";
				htmlPost += "<span class=\"post_jeiff_data\">"+postJeiff.data_reuniao+"<\/span>";
				htmlPost += "<\/aside>";
				htmlPost += "<main class=\"jeiff_post_mensagem\">";
				htmlPost += "<span class=\"post_jeiff_mensagem\">";
				htmlPost += "<p>"+postJeiff.ata+"<\/p>";
				htmlPost += "<\/span>";
				htmlPost += "<\/main>";
				htmlPost += "<aside class=\"jeiff_post_link\">";
				htmlPost += "<a href=\"#\"><span>documentojeiff.pdf<\/span><\/a>";
				htmlPost += "<\/aside>";
				htmlPost += "<\/section>";

			});

			$("#conteudoJeiff").html(htmlPost);
			$("#conteudoJeiff2").hide();
			$("#conteudoJeiff").show();
		});
	};

	self.new = function(idPost, mensagem) {

		if (idPost === undefined) {
			idPost = 0;
			mensagem = "";
		}

		var htmlPost="";
		htmlPost += "<form id=\"jeiffForm\">"
		htmlPost += "<input type=\"date\" class=\"box_input_data input_data_jeiff\" id=\"jeiffDatepicker\" readonly placeholder=\"Selecione uma data\">";
		htmlPost += "<textarea class=\"box_textarea textarea_jeiff\" name=\"jeiff_mensagem\" id=\"textareaMuralJeiff\" placeholder=\"Digite o texto da mensagem\"><\/textarea>";
		htmlPost += "<aside class=\"box_ic\">";
		htmlPost += "<span style=\"display: none\"><input type=\"file\" id=\"arquivoJeiff\"><\/span>";
		htmlPost += "<span class=\"ic_add_arquivo\" onclick=\"muralJeiff.upArquivo()\">&nbsp;<\/span>";
		htmlPost += "<span class=\"ic_cancelar\" onclick=\"muralJeiff.refresh()\">&nbsp;<\/span>";
		htmlPost += "<span class=\"ic_salvar\" onclick=\"muralJeiff.save("+idPost+")\">&nbsp;<\/span>";
		htmlPost += "<\/aside>";
		htmlPost += "</form>"
		$("#conteudoJeiff2").html(htmlPost);




		$("#jeiffDatepicker").datepicker({
			showOn: "both",
			buttonImage: "img/calendario.png",
			buttonText: "Select date",
			dateFormat: 'yy-mm-dd',
			showOtherMonths:true,
			dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
			monthNames: ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO',
						 'SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO']	
		});

		$('.ui-datepicker-trigger').hide()
		
		$("#conteudoJeiff2").show();
		$("#conteudoJeiff").hide();
		$("#iconeNovaPostagem3").hide();

	};
	

	self.upArquivo = function() {
		//$("#arquivoJeiff").trigger("click");
		var HtmlContentUpload = '<div id="JanelaUploadPortifolio">'+
                                '<div class="Titulo_janela_upload">'+
                                '</div>'+
                                '<div id="foto">'+
                                '</div>'+
                                '<div id="LegendaUpload">Aguardando Arquivo</div>'+
                                '<form id="form_upload_arquivo_jeiff">'+
                                    '<input type="hidden" id="id" name="id" value="0"/>'+
                                    '<input type="hidden" id="action" name="action" value="create" />'+
                                    '<input type="hidden" id="Dados_Foto_Aluno" />'+
                                    '<input type="file" id="Arquivo_Foto_Aluno" name="arquivo" />'+
                                    '<div class="campoConfirmaUpload">'+
                                        '<input class="btn_submit" type="button" value="" onclick="$(\'.blackPainel\').hide()"/>'+
                                    '</div>'+
                                '</form>'+
                            '</div>';

    	$('.blackPainel').show().html(HtmlContentUpload);
		GerarUpload($("#foto"), $("#Arquivo_Foto_Aluno"), $("#Dados_Foto_Aluno"));
	}

	self.save = function(idPost) {

        getAjax("JeiffPea", "POST", "action=create&professor="+coordID+"&ata="+$('#textareaMuralJeiff').val()+"&periodo=8&data="+$('#jeiffDatepicker').val(), true, function(result){
			
			console.log(result);

			$("#id").val(result)

			var formData = new FormData($('#form_upload_arquivo_jeiff')[0]);
			console.log(formData)
		    $.ajax({
		        url: path+"JeiffPea/upload",
		        type: "POST",
		        mimeType:"multipart/form-data",
		        contentType: false,
		        cache: false,
				async:true,
		        processData:false,
		        data: formData,
		        success: function(d) {
					//chama a função para o html que acabou de ser criado
					$('.blackPainel').hide()
		        },error: function() {
		            mensagem("Erro ao enviar arquivo!","OK","bt_ok","erro");
		            $('.blackPainel').hide()
		        },
		    });


		});

    };

	self.edit = function(idPost) {
		var mensagemPost = $("#mensagemPostMuralComum"+idPost).html();
		console.log(idPost)
		self.new(idPost, mensagemPost);
	};

	self.delete = function(idPost) {

		loading("inicial")
		getAjax("x`/", "POST", "action=delete&id="+idPost, true, function(result){
			console.log(result);
			self.refresh();
			loading("final");
		});

	};

}

var muralGestao = new MuralGestao();
var muralComum = new MuralComum();
var muralJeiff = new MuralJeiff();

window.onload = function() {
	$(".scroll_receiver").mCustomScrollbar({
		axis: "y",
	});

	carregarListaProfessores();

	muralGestao.refresh();
	muralComum.refresh();
	muralJeiff.refresh();
};



