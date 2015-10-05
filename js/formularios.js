$(document).ready(function(){
	carregaOficina();
	carregaPeriodo();
	carregaCiclo();	
});

function carregaOficina(){
	var HtmlConteudo;
	$.ajax({
		url: path + "Oficina",
		type: "GET",
		async: false,
		crossDomain: true,
		dataType: 'json',
		success: function (data) {
			for (var i = 0; i < data.length; i++) {
				HtmlConteudo += '<option class="opcaoOF" value="'+data[i].idoficina+'">'+data[i].nome+'</option>';
			};
		}
	});
	$('#oficina').append(HtmlConteudo);
}
function carregaPeriodo(){
	var HtmlPeriodo;
	$.ajax({
		url: path + "Periodo",
		type: "GET",
		async: false,
		crossDomain: true,
		dataType: 'json',
		success: function (dataP) {
			for (var i = 0; i < data.length; i++) {
				HtmlPeriodo += '<option class="opcaoPE" value="'+dataP[i].idperiodo+'">'+dataP[i].periodo+'</option>';
			};
		}
	});
	$('#periodo').append(HtmlPeriodo);
}
function carregaCiclo(){
	var HtmlCiclo;
	$.ajax({
		url: path + "Ciclo",
		type: "GET",
		async: false,
		crossDomain: true,
		dataType: 'json',
		success: function (dataC) {
			for (var i = 0; i < dataC.length; i++) {
				HtmlCiclo += '<option class="opcaoCI" value="'+dataC[i].idciclos+'">'+dataC[i].ciclo+'</option>';
			};
		}
	});
	$('#ciclo').append(HtmlCiclo);
}