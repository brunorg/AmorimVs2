$(document).ready(function(){
    carregaPeriodo();
    carregaCiclo(); 
});
function carregaCiclo(){
    var HtmlCiclo;
    $.ajax({
        url: path + "Ciclo",
        type: "GET",
        async: false,
        crossDomain: true,
        dataType: 'json',
        success: function (dataCi) {
            for (var i = 0; i < dataCi.length; i++) {
                HtmlCiclo += '<option class="opcaoCI" value="'+dataCi[i].idciclos+'">'+dataCi[i].ciclo+'</option>';
            };
        }
    });
    $('#cicloGrupo').append(HtmlCiclo);
}
function carregaPeriodo(){
    var HtmlPeriodo;
    $.ajax({
        url: path + "Periodo",
        type: "GET",
        async: false,
        crossDomain: true,
        dataType: 'json',
        success: function (dataPe) {
            for (var i = 0; i < dataPe.length; i++) {
                HtmlPeriodo += '<option class="opcaoPE" value="'+dataPe[i].idperiodo+'">'+dataPe[i].periodo+'</option>';
            };
        }
    });
    $('#periodoGrupo').append(HtmlPeriodo);
}
