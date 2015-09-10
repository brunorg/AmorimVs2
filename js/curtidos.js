function change_Curtir(QAtivo,idRecurso){
	var dataRecursoAprendizagemCurtir=getData("RecursoAprendizagem", idRecurso);	
	var curtidos = dataRecursoAprendizagemCurtir.curtir;	
	var IO = 0;
	if(QAtivo == "Ativo"){
		curtidos-1;
	}else{
		curtidos+=1;
	}
	$.ajax({
    url: path+"RecursoAprendizagem/update/curtir/"+idRecurso+"/"+curtidos,
    type: "POST",
    async:false,
    crossDomain: true,
    dataType: 'json',
    data: "action=update",
	    success: function(d) {
	    	dataMensagens 	=	getData("Mensagens", null);
	    },error: function() {
			
	    }
   	}); 
}