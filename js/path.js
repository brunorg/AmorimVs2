
var path = "http://177.55.99.90/WebServicePlataformaAmorimTesteV2/";

function loading(estado) {
    if(estado == "inicial"){
		$('.boxGlobal').load("preloader_JS.html").css({"display":"block","padding-top":"300px"});
	}
	if(estado == "final"){
		$('.boxGlobal').html("").hide();
	}
};

/*Function base para listagem de registros*/
function getData(Tabela, ID){
	var ValorRetorno;
    $.ajax({
        type: "GET",
        async:false,
        crossDomain: true,
        url: path+Tabela+"/"+(ID == null ? "":ID)            
	}).then(function(data) {
		ValorRetorno = data;
	});
    return ValorRetorno;
}

/*Function base para criar registro*/
function setCreateData(Tabela,Valores){	
	var retorno;
	$.ajax({
		url: path+Tabela,
		type: "POST",
		async:false,
		crossDomain: true,
		data: "action=create&"+Valores,
		beforeSend: function(){		
			loading("inicial");
		},success: function(d) {
			retorno = d;
		},complete: function(){
			loading("final");	
		},error: function() {
			retorno = "erro";
		}
	});
	return retorno;
}

/*Function base para editar registro*/
function setUpdateData(Tabela,Valores,ID){
	//console.log("action=update&"+Valores+"&id="+ID);
	var retorno;
	$.ajax({
		url: path+Tabela,
		type: "POST",
		async:false,
		crossDomain: true,
		data: "action=update&"+Valores+"&id="+ID,
		beforeSend: function(){		
			loading("inicial");
		},success: function(d) {
			retorno = d;
		},complete: function(){
			loading("final");	
		},error: function() {
			retorno = "erro";
		}
	});
	return retorno;
}

/*Function base para deletar registro*/
function deleteData(Tabela,ID){
	$.ajax({
		type: "GET",
		crossDomain: true,
		async: false,
		url: path+Tabela+"/delete/"+ID
	});	
}

/*Function base para fazer upload de arquivo*/
function upload(Tabela,ID,FormData){
	var retorno;
	$.ajax({
		url: path+Tabela+ID,
		type: "POST",
		mimeType:"multipart/form-data",
		contentType: false,
		cache: false,
		processData:false,
		data: FormData,
		success: function(d) {
			$(".blackPainel").css("display","none");
			mensagem("Arquivo salvo com sucesso!","OK","bt_ok","sucesso");
		}
	});
}


function verificaTutor(ID){
    var ValorRetorno;
    $.ajax({
        type: "GET",
        async:false,
        crossDomain: true,
        url: path+"relatorio/existAlunoVariavelGrupo/"+ID
	}).then(function(data) {
		ValorRetorno = data;
	});
    return ValorRetorno;
}