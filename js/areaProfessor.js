var professorId= localStorage.getItem("professorId");
var oficina = JSON.parse(localStorage.getItem("oficinaProfessor"));
var Arquivo;

$(document).ready(function() {
    adicionarBarraRolagem();
    carregarDados();
    atribuirEventos();
	listaMural();
});

function adicionarBarraRolagem () {
    $('.postContainer').mCustomScrollbar({
        axis:"y"
    });
}

function carregarDados () {
    carregaPostsBlog();
    carregaOficinaPostagens();
}

function atribuirEventos () {
    clickPostagens();
    cancelarPostagens();
    uploadImagemPostagem();
    imagemPostagemTexto();
    removerImagemPostagem();
    novaPostagem();
    clickRelatorio();
    cancelarRelatorio();
    clickMural();
    cancelarMural();
}

function carregaOficinaPostagens () {
    var htmlOficinas =  '<select>'+
                            '<option class="placeholder" value="0" disabled selected hidden>Escolha o Grupo</option>';
    $.ajax({
        url: path + 'Oficina/ListaPorProfessor/' +  professorId,
        /*url: path + 'Oficina',*/
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(d) {
            for (var i = 0; i < d.length; i++)
            {
                htmlOficinas += '<option value="'+d[i].idoficina+'">'+d[i].nome+'</option>';
            }
        }
    });

    htmlOficinas += '</select>';

    $('#selectOficina').html(htmlOficinas);
}

function carregaGrupoOficinaMural () {
	$("#msgMural").css("display","block");
    var htmlGrupo = '<option class="placeholder" value="0" disabled selected hidden>Escolha o Grupo</option>';
    $.ajax({
        url: path + 'Agrupamento',
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(d) {
            for (var i = 0; i < d.length; i++)
            {
                htmlGrupo += '<option value="'+d[i].idagrupamento+'">'+d[i].nome+'</option>';
            }
        }
    });

    $('#grupoMuralOficina').html('<option value="todos">Todos</option>'+htmlGrupo);
}

function carregaGrupoTutoriaMural(professorId) {
	$("#msgMural").css("display","block");
    var htmlGrupo = '<option class="placeholder" value="0" disabled selected hidden>Escolha o Grupo</option>';
    $.ajax({
        url: path + 'ProfessorFuncionario/ProfessorGrupo/'+professorId,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(d) {
            for (var i = 0; i < d.length; i++)
            {
                htmlGrupo += '<option value="'+d[i].idgrupo+'">'+d[i].nomeGrupo+'</option>';
            }
        }
    });

    $('#grupoMuralTutoria').html('<option value="todos">Todos</option>'+htmlGrupo);
}

function clickPostagens() {
    $("#novoPostagens").click(function() {
        $("#postagensConteudo").hide();
        $("#novoPostagens").hide();
        $("#postagensNova").show();
    });
}

function cancelarPostagens () {
    $("#cancelarPostagens").click(function() {
        $("#postagensConteudo").show();
        $("#novoPostagens").show();
        $("#postagensNova").hide();
    });
}

function uploadImagemPostagem () {
    $("#uploadPostagem").click(function() {
        $("#postagemImagem").trigger("click");
    });
}

function imagemPostagemTexto () {
    $("#postagemImagem").change(function(e) {
        $("#uploadPath").html($("#postagemImagem").val().split('\\')[2]);
        $("#arquivoUpload").show();

        var FR= new FileReader();
        FR.onload = function(e) {
            $("#imagemArquivo").val(e.target.result);
        };
        Arquivo = this.files[0];

    });
}

function removerImagemPostagem () {
    $("#removerUpload").click(function() {
        $("#arquivoUpload").hide();
        $("#postagemImagem").val('');
    });
}

function novaPostagem () {
    $("#salvarPostagem").click(function() {
        var conteudo = $("#conteudoPostagens").val();
        var oficina = $("#selectOficina select").val();
        var titulo = $("#tituloPostagens").val();
        var imagem = $("#postagemImagem").val();

        if (oficina != 0 && conteudo != '' && titulo != '')
        {
            $("#postagemTitulo").val(titulo);
            $("#postagemConteudo").val(conteudo);
            $("#postagemOficina").val(oficina);
            var idPostagem;

            $.ajax({
                url: path + "Blog",
                async: false,
                crossDomain: true,
                type: "POST",
                data: $("#formPostagens").serialize(),
                beforeSend: function() {loading("inicial");},
                success: function(d) {
                    var post = {titulo : $("#tituloPostagens").val(), descricao : $("#postagemConteudo").val(), idblog : d, oficina : {nome : $("#selectOficina select :selected").text()}};
                    addPost(post);
                    mensagem("Postagem feita com sucesso!","OK","bt_ok","sucesso");
                    $("#tituloPostagens").val('');
                    $("#conteudoPostagens").val('');
                    $("#selectOficina select").val(0);
                    $("#cancelarPostagens").trigger("click");
                    idPostagem = d;
                },
                complete: function() {loading("final");}
            });

            if (imagem != "")
            {
                $("#postagemAction").val("update");
                var formData = new FormData($("#formPostagens")[0]);
                formData.append("fotoAluno", Arquivo);

                $.ajax({
                    url: path + "Blog/upload/Blog/" + idPostagem,
                    async: false,
                    crossDomain: true,
                    type: "POST",
                    mimeType:"multipart/form-data",
                    contentType: false,
                    cache: false,
                    processData:false,
                    data: formData,
                    beforeSend: function() {loading("inicial");},
                    success: function(d) {
                        mensagem("Postagem feita com sucesso!","OK","bt_ok","sucesso");
                    },
                    complete: function() {loading("final");}
                });
            }
        }
        else
        {
            mensagem("Todos os campos devem ser preenchidos.","OK","bt_ok","erro");
        }
    });
}

function carregaPostsBlog () {
    var htmlPosts = '';

    $.ajax({
        url: path + "Blog/BlogProfessor/" + professorId,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(dataPosts) {
            for (var i = 0; i < dataPosts.length; i++) {
                addPost(dataPosts[i]);
            };
        }     
    });
}

function addPost (post) {
    var htmlPosts = '';

    var id = post.idblog;
    var titulo = post.titulo;
    var corpo = post.descricao;
    var oficina = post.oficina.nome;
    htmlPosts +=    '<div class="areaPost" id="' + id + '">' +
                        '<div class="post postMedio">' +
                            '<div class="postTitulo">' +
                                titulo +
                            '</div>' +
                            '<div class="postCorpo">'+
                                corpo + 
                            '</div>' +
                            '<div class="postDestinatario">' +
                                oficina +
                            '</div>'+
                            '<div class="linhaConteudo">' +
                                '<div class="linhaBotoes">' +
                                    '<div class="containerIcone">' +
                                        '<div class="botaoIcone">' +
                                            '<img src="img/ic_editar_peq.png">' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="containerIcone">' +
                                        '<div class="botaoIcone">' +
                                            '<img src="img/ic_del_peq.png">' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
    $("#mCSB_2_container").append(htmlPosts);
}

function clickRelatorio () {
    $("#novoRelatorio").click(function() {
        $("#relatorioConteudo").hide();
        $("#novoRelatorio").hide();
        $("#relatorioNova").show();
    });
}

function cancelarRelatorio () {
    $("#cancelarRelatorio").click(function() {
        $("#relatorioConteudo").show();
        $("#novoRelatorio").show();
        $("#relatorioNova").hide();
    });
}

function clickMural () {
    $("#novoMural").click(function() {
        $("#muralConteudo").hide();
        $("#novoMural").hide();
        $("#muralNova").show();
    })
}

function cancelarMural () {
    $("#cancelarMural").click(function() {
        $("#muralConteudo").show();
        $("#novoMural").show();
        $("#muralNova").hide();
		$("#oficinaMural").hide();
		$("#tutoriaMural").hide();
		$("#msgMural").hide().html("");
		$('#grupoMural option[value="0"]').attr({ selected : "selected" });
    }); 
}

function enviarMsgMural(){
	var grupo = $('#grupoMural').val();
	if(grupo == "oficina"){
		$("#tutoriaMural").css("display","none")
		$("#oficinaMural").css("display","block");
		$("#msgMural").css("display","none");
		carregaGrupoOficinaMural();
	}else if(grupo == "tutoria"){
		$("#oficinaMural").css("display","none");
		$("#tutoriaMural").css("display","block");
		$("#msgMural").css("display","none");
		carregaGrupoTutoriaMural(professorId);
	}else{
		$("#oficinaMural").css("display","none");
		$("#tutoriaMural").css("display","none");
		$("#msgMural").css("display","none").html("");
	}	
}

function enviarMsgGrupo(){
	var valores;
	var grupo = $('#grupoMural').val();
	var parametros,mensagemMural;
	if(grupo == "oficina"){
		var grupoMuraloficina = $("#grupoMuralOficina").val();	
		if(grupoMuraloficina == "todos"){
			parametros = "&agrupamento=0&oficina="+oficina[0].oficina.idoficina;
		}else{
			parametros = "&agrupamento="+grupoMuraloficina+"&oficina=0";
		}
		mensagemMural = $(".mensagemMedia").val();
		valores = "&mensagem="+mensagemMural+"&idProfessor="+professorId+parametros+"&tutoria=0&grupo=0";
		
	}else if(grupo == "tutoria"){		
		var grupoMuralTutoria = $("#grupoMuralTutoria").val();		
		if(grupoMuralTutoria == "todos"){
			parametros = "&tutoria=1&grupo=0";
		}else{
			parametros = "&tutoria=0&grupo="+grupoMuralTutoria;
		}
		mensagemMural = $(".mensagemMedia").val();
		valores = "&mensagem="+mensagemMural+"&idProfessor="+professorId+"&agrupamento=0&oficina=0"+parametros;		
	}
	
	$.ajax({
		url: path + "Mural",
		async: false,
		crossDomain: true,
		cache: true,
		type: "POST",
		data: "action=create"+valores,
		success: function(data){
			htmlBlocoMural(mensagemMural,'5',$("#grupoMuralOficina :selected").text(),grupoMuralTutoria);
			mensagem("Mensagem enviada com sucesso!","OK","bt_ok","sucesso");
			$("#muralConteudo").show();
			$("#novoMural").show();
			$("#muralNova").hide();
			$("#oficinaMural").hide();
			$("#tutoriaMural").hide();
			$("#msgMural").hide().html("");
			$('#grupoMural option[value="0"]').attr({ selected : "selected" });
		}
	});
}
function listaMural(){
	
}
function htmlBlocoMural(mensagem,anoEstudo,oficina,grupo){		
	var tipoGrupo;
	if(oficina){
		tipoGrupo = oficina;
	}else if(grupo){
		tipoGrupo = grupo;
	}
	
	var html = '<div class="areaPost">'+
					'<div class="post postMedio">'+
						mensagem+
						'<div class="postDestinatario">'+
							tipoGrupo+' | '+anoEstudo+'º Ano'+
						'</div>'+
						'<div class="linhaConteudo linhaIconeInferior">'+
							'<div class="linhaBotoes">'+
								'<div class="containerIcone">'+
									'<div class="botaoIcone">'+
										'<img src="img/ic_delete.png">'+
									'</div>'+
								'</div>'+
								'<div class="containerIcone">'+
									'<div class="botaoIcone">'+
										'<img src="img/ic_editar_peq.png">'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>  '+
					'</div>'+
				'</div>';	
							
	return $('#muralConteudo .postContainer').html(html);	
}