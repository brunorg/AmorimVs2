var ImageUploader = (function() {
	function ImageUploader() {
		var self = this;

		this.arquivo = null;
	}

	ImageUploader.prototype.showInputFileBox = function() {
		var html = "";

		html += '<div class="blackPainel">';
		html += 	'<div class="uploadFileBox">';
		html += 		'<div class="uploadFileBoxTitulo">';
		html += 			'Upload Foto Aluno';
		html += 			'<div class="close_upload_producao" onclick="ImageUploader.closeInputFileBox()"></div>';
		html += 		'</div>';
		html += 		'<div class="uploadFileBoxImg">';
		html += 			'<div class="uploadFileBoxIcon" onclick="ImageUploader.getFile()"></div>';
		html += 		'</div>';
		html += 		'<div id="LegendaUpload">Aguardando Arquivo</div>';
		html += 		'<form id="inserirArquivo">';
		html += 			'<input type="hidden" id="action" name="action" value="update">';
		html += 			'<input type="file" class="arquivo" id="fotoAluno" name="fotoAluno">';
		html += 			'<input type="hidden" class="perfil" id="idAluno" value="">';
		html += 			'<div class="campoConfirmaUpload">';
		html += 				'<input type="button" class="btnSubmit" name="btnSubmit" value="" onclick="ImageUploader.requestFileUpload()">';
		html += 			'</div>';
		html += 		'</form> ';
		html += 	'</div>';
		html += '</div>';

		$("body").append(html);
		$(".blackPainel").show();
	}

	ImageUploader.prototype.closeInputFileBox = function() {
		self.arquivo = null;
		$(".blackPainel").remove();
	}

	ImageUploader.prototype.getFile = function() {
		$("#inputFotoUsuario").trigger("click");
	}

	ImageUploader.prototype.requestFileUpload = function() {
		var idusuario = 0;
		var servicePath = "";
		var extensaoArquivo = "";
		var formData = new FormData();

		if (JSON.parse(localStorage.objetoUsuario).perfil.idperfil === 23) {
			servicePath = "Alunos/upload/aluno/";
			idusuario = localStorage.alunoId;
		} else if (JSON.parse(localStorage.objetoUsuario).perfil.idperfil  === 24) {
			servicePath = "ProfessorFuncionario/upload/ProfessorFuncionario/imagem/";
			idusuario = localStorage.professorId;
		}

		if (self.arquivo.name.endsWith("png") ||
			self.arquivo.name.endsWith("jpg") ||
			self.arquivo.name.endsWith("jpeg")) {
				formData.append("action", "create");
				formData.append("arquivo", self.arquivo);
		} else {
			throw "Formato inválido.";
		}

		$.ajax({
			url: path + servicePath + idusuario,
			type: "POST",
			mimeType:"multipart/form-data",
			contentType: false,
			cache: false,
			processData:false,
			data: formData,
			beforeSend: function(){
				$(".blackPainel").css("display","none");
				loading("inicial");
			},
			success: function(d) {
				mensagem("Arquivo salvo com sucesso!","OK","bt_ok","sucesso");
			},complete: function() {
				loading("final");
			}
		});
	}

	ImageUploader.prototype.updateThumbnail = function() {
		var fileReader = new FileReader();
		self.arquivo = document.querySelector("#inputFotoUsuario").files[0];

		fileReader.onload = function(e) {
			if (self.arquivo) {
				$(".uploadFileBoxIcon").css("background-image", "url("+e.target.result+")");
				$("#LegendaUpload").text(self.arquivo.name);
			} else {
				$(".uploadFileBoxIcon").css("background-image", "url('../img/foto.png')");
				$("#LegendaUpload").text("Aguardando arquivo");
			}
		}

		fileReader.readAsDataURL(self.arquivo);
	}

	return new ImageUploader();
})();

function salvarFotoAluno(){


	debugger;


	var idAluno = $("#idAluno").val();
	var tipoArquivo = $("#fotoAluno").val();

	var extensao = (tipoArquivo.substring(tipoArquivo.lastIndexOf("."))).toLowerCase();
	var tipo = extensao.split('.');

	if((tipo[1]=='jpg')||(tipo[1]=='png')||(tipo[1]=='jpeg')){
		var formData = new FormData($("#inputFotoUsuario")[0]);
		$.ajax({
			url: path+"Alunos/upload/aluno/"+idAluno,
			type: "POST",
			mimeType:"multipart/form-data",
			contentType: false,
			cache: false,
			processData:false,
			data: formData,
			beforeSend: function(){
				$(".blackPainel").css("display","none");
				loading("inicial");
			},
			success: function(d) {
				$("#cadAlunoVar").css("display","block");
				mensagem("Arquivo salvo com sucesso!","OK","bt_ok","sucesso");
				var dataAlunos = getData("Alunos", idAluno);
				$("#fotoCad").css("display","block").html("<img id='_foto' src='"+dataAlunos.fotoAluno+"' width='150' height='150'/>");
			},complete: function() {
				loading("final");
			}
		});
	}else{
		mensagem("Este arquivo não é uma imagem!, verifique os campos!","OK","bt_ok","erro");
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
            }
        });
    }else{
        mensagem("Este arquivo não é uma imagem!, verifique os campos!","OK","bt_ok","erro");
    }
}