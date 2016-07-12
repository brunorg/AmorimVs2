var DataObject = (function() {

	function DataObject() {

		if (!DataObject.instance)
			DataObject.instance = this;
	}

	DataObject.prototype.get = function(servicePath, callback, async, id) {
		var retorno;

		if (async === undefined) {
			if (callback === undefined)
				async = false;
			else
				async = true;
		}

		if (id === undefined)
			id = "";

		if (async && typeof callback !== "function")
			throw "É necessário que haja uma função callback em requisições assíncronas.";

		$.ajax({
			url: path + servicePath + id,
			type: "GET",
			async: async,
			crossDomain: true,
			success: function(data) {
				if (async)
					callback(data);
				else
					retorno = data;
			},
			error: function(erro) {
	        	console.log(erro.responseText + "///" + erro.statusText);
			}
		});

		if (!async)
			return retorno;
	}

	DataObject.prototype.post = function(servicePath, callback, data, async) {
		var retorno;

		if (async === undefined) {
			if (callback === undefined)
				async = false;
			else
				async = true;
		}

		if ((typeof data === "string" && !data.contains("action=")) ||
			(typeof data === "object" && bleh.action === undefined))
			throw "É necessário passar uma action como parâmetro da requisição POST.";

		$.ajax({
			url: path + servicePath,
			type: "POST",
			async: async,
			crossDomain: true,
			data: data,
			success: function(data) {
				if (async)
					callback(data);
				else
					retorno = data;
			},
			error: function(erro) {
	        	console.log(erro.responseText + "///" + erro.statusText);
			}
		});

		if (!async)
			return retorno;
	}

	DataObject.prototype.upload = function(servicePath, formData, callback) {
		if (callback === undefined) {
			throw "É obrigatório passar uma função de callback como parâmetro para upload.";
		}

		if (typeof formData !== "object")
			throw "O parâmetro formData deve ser uma instância de FormData";

		$.ajax({
	        url: path + servicePath,
	        type: "POST",
	        mimeType: "multipart/form-data",
	        contentType: false,
	        cache: false,
	        processData: false,
	        data: formData,
	        success: function(data) {
	            callback(data);
	        },
	        error: function(erro) {
	        	console.log(erro.responseText + "///" + erro.statusText);
	        }
	    });
	}

	return new DataObject();
})();

function callbackFunc(data) {
	try {
		var formData = new FormData(document.querySelector("#Cadastro_Form_imagem_PA"));
		var arquivo = document.querySelector("#postagemImagem").files[0];
		formData.append("arquivo", arquivo);


		DataObject.upload("ProducaoAluno/upload/producaoAluno/arquivo/"+data, formData, function() {
			console.log("Batata");
		});
	} catch(e) {
		console.log(e);
	}
}

var bleh = function() {
	try {
		DataObject.post("ProducaoAluno/", callbackFunc, "texto=Oudri&action=create&anoLetivo=61&data=2016-7-11&aluno=918&tipo=6&categoria=1");
	} catch(e) {
		console.log(e);
	}
}