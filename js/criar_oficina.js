$(document).ready(function(){
    carregaOficina1();
    carregaPeriodo1();
    carregaCiclo1(); 
});

function carregaOficina1(){
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
    $('#oficinaOficina').append(HtmlConteudo);
}
function carregaPeriodo1(){
    var HtmlPeriodo;
    $.ajax({
        url: path + "Periodo",
        type: "GET",
        async: false,
        crossDomain: true,
        dataType: 'json',
        success: function (dataP) {
            for (var i = 0; i < dataP.length; i++) {
                HtmlPeriodo += '<option class="opcaoPE" value="'+dataP[i].idperiodo+'">'+dataP[i].periodo+'</option>';
            };
        }
    });
    $('#periodoOficina').append(HtmlPeriodo);
}
function carregaCiclo1(){
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
    $('#cicloOficina').append(HtmlCiclo);
}