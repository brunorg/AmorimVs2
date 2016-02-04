//Carrega a funçao de Load do JQuery

$(document).ready(function(){

    $( "#datepicker" ).datepicker({
        showOn: "button",
        beforeShow: function () {
            $("#box_novo").css("height", "285px");
        },
        buttonImage: "img/calendario.png",
        buttonImageOnly: true,
        buttonText: "Select date",
        dateFormat: 'dd/mm/yy',
        showOtherMonths:true,
        dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
        monthNames: ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO',
                     'SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO']    
    });


});
