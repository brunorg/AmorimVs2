//Carrega a funçao de Load do JQuery

var professorId= localStorage.getItem("professorId");
var globalMonth;

(function ($) {
    function createDivHeader(thisNode) {
        var headerDiv = document.createElement("div");
        var arrowLeftDiv = document.createElement("div");
        var centerLargeDiv = document.createElement("div");
        var arrowRightDiv = document.createElement("div");

        headerDiv.style.width = "284px";
        headerDiv.style.height = "41px";

        arrowLeftDiv.style.width = "41px"
        arrowLeftDiv.style.height = "41px"
        arrowLeftDiv.style.display = "inline-block"
        arrowLeftDiv.style.background = "url('img/leftArrowG.png') no-repeat center"
        arrowLeftDiv.style.backgroundColor = '#02818D' 
        arrowLeftDiv.style.float = "left"
        arrowLeftDiv.id = "calendarLeftArrow"

        centerLargeDiv.style.width = "202px"
        centerLargeDiv.style.height = "41px"
        centerLargeDiv.style.float = "left"
        centerLargeDiv.id = "calendarMonthName"

        arrowRightDiv.style.width = "41px"
        arrowRightDiv.style.height = "41px"
        arrowRightDiv.style.background = "url('img/rightArrowG.png') no-repeat center"
        arrowRightDiv.style.backgroundColor = '#02818D' 
        arrowRightDiv.style.float = "right"
        arrowRightDiv.id = "calendarRightArrow"

        headerDiv.appendChild(arrowLeftDiv)
        headerDiv.appendChild(centerLargeDiv)
        headerDiv.appendChild(arrowRightDiv)

        thisNode.appendChild(headerDiv);
    }

    function createDivDays(thisNode, divId, days, id) {

        var daysDiv = document.createElement("div");

        daysDiv.style.width = "284px";
        daysDiv.style.height = "41px";
        daysDiv.id = divId;

        var i = 0
        days.forEach(function(displayDay) {
            var dayDiv = document.createElement("div");
            
            dayDiv.style.float = "left"

            var displayDaySpan = document.createElement("p");
            displayDaySpan.id = id + i;

            displayDaySpan.innerHTML = displayDay
            dayDiv.appendChild(displayDaySpan)
            daysDiv.appendChild(dayDiv)
            i++
        })

        thisNode.appendChild(daysDiv);
    }

    function getAtualWeek(todayNumber, todayName, todayMonth) {

        var thisWeekNumbers = [todayNumber]

        for (var i = todayNumber-1; i >= todayNumber - todayName; i--) {
            var day = new Date()
            day.setMonth(todayMonth)
            day.setDate(i)
            thisWeekNumbers.unshift(day.getDate())
            globalMonth = day.getMonth()
            globalDay = day.getDate()
        };

        for (var i = todayNumber+1; i <= todayNumber + (6 - todayName); i++) {
            var day = new Date()
            day.setMonth(todayMonth)
            day.setDate(i)
            thisWeekNumbers.push(day.getDate())
        };

        return thisWeekNumbers
    }

    function updateMonth(date, months) {

        $("#calendarMonthName").empty()
        $("#calendarMonthName").html('<span id="calendarMonthYear">' + months[date.getMonth()] + " " + date.getFullYear() + '</span>')

    }

    $.fn.weekdisplay = function( offset ) {

        var months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

        var thisNode = this[0];

        var date = new Date()

        if (offset === undefined) {

            $(this).empty()

            this.css("width", "245px");
            this.css("height", "105px");

            var todayName = date.getDay()
            var todayNumber = date.getDate()
            var todayMonth = date.getMonth()

            createDivHeader(thisNode)
            createDivDays(thisNode, "daysName", ["D", "S", "T", "Q", "Q", "S", "S"], "weekCalendarName")
            createDivDays(thisNode, "daysNumber", getAtualWeek(todayNumber, todayName, todayMonth), "weekCalendarDay")

        } else {

            date.setDate(date.getDate() + offset)

            $('#daysNumber').empty()
            $('#daysNumber').remove()

            var todayName = date.getDay()
            var todayNumber = date.getDate()
            var todayMonth = date.getMonth()

            createDivDays(thisNode, "daysNumber", getAtualWeek(todayNumber, todayName, todayMonth), "weekCalendarDay")

        }

        updateMonth(date, months)

        return this;
    }

}( jQuery ));

function adicionarClickCasas() {
    var x = document.getElementsByClassName("clckableToggle")

    for (var i = x.length - 1; i >= 0; i--) {
        x[i].onclick = toggleDia
    };
}

function toggleDia() {
    if (this.innerHTML == '<img src="img/check-presenca-v.png">') {
        this.innerHTML = '<img src="img/check-presenca.png">'
    } else {
        this.innerHTML = '<img src="img/check-presenca-v.png">'
    }
}

function atualizarGrupos(){
    $.ajax({
        url: path + 'ProfessorFuncionario/ProfessorGrupo/' + professorId,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(d) {
            if(d.length > 0){
                window.grupoEscolhido = d[d.length-1].idgrupo;
                var recebeGrupos = document.getElementById('recebeGrupos')
                recebeGrupos.innerHTML = ""

                for (var i = d.length - 1; i >= 0; i--) {
                    recebeGrupos.innerHTML += '<p class="nomeGrupos '+(i == d.length - 1?"active":"")+'" id="'+d[i].idgrupo+'" onclick="mudarGrupo('+d[i].idgrupo+')">'+d[i].nomeGrupo+'</p>';
                }

                atualizarCalendario(window.grupoEscolhido);
            }else{
                $('.apontarPresenca').css('display','none');
                $('.lista_grupos').html('<div class="feedback_oficinas_false">Não há grupos para este professor');
            }
        }
    });
}

function atualizarCalendario(idGrupo){
    var date = new Date();
    date.setDate(date.getDate() + window.dayOffsetWeekCalendar);
    //var todayMonth = date.getMonth();
    var todayDay = date.getDate();

    $.ajax({
        url: path + 'Chamada/FaltasTotaisGrupo/' + idGrupo,
        //url: path + 'Chamada/ListarGrupo/'+idGrupo+'/'+$('#weekCalendarDay0').html()+'/'+todayMonth,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(d){

            $('#recebeAlunos').html("")
            $('#tabelaPresenca').html("")
            $("#tableInfo").html("")
            var htmlPiece = "";

            for (var i = 0; i < d.length; i++) {            
                htmlPiece += '<p class="alunoLinha">';                                
                htmlPiece +=     "<img src='"+ (d[i].foto == "-" ? "http://177.55.99.90/files/Masc.png":d[i].foto) +"'>"; //Se o aluno não possuir foto, receberá a foto padrão do bd. Caso contrário, receberá sua foto cadastrada.
                htmlPiece +=     '<span class="foto aluno" id="'+d[i].alunoId+'">'
                htmlPiece +=         d[i].alunoNome
                htmlPiece +=     '</span>'                                
                htmlPiece += '</p>'
                
                $('#recebeAlunos').html($('#recebeAlunos').html() + htmlPiece)

                htmlPiece = "";

                htmlPiece += '<tr>'
                htmlPiece +=        '<td id="Aluno'+d[i].alunoId+'Dia'+$('#weekCalendarDay0').html()+'" class="'+idGrupo+' fimSemana'+(i%2)+'"></td>'
                htmlPiece +=        '<td id="Aluno'+d[i].alunoId+'Dia'+$('#weekCalendarDay1').html()+'" class="clckableToggle '+idGrupo+'"><img src="img/check-presenca-v.png"></td>'
                htmlPiece +=        '<td id="Aluno'+d[i].alunoId+'Dia'+$('#weekCalendarDay2').html()+'" class="clckableToggle '+idGrupo+'"><img src="img/check-presenca-v.png"></td>'
                htmlPiece +=        '<td id="Aluno'+d[i].alunoId+'Dia'+$('#weekCalendarDay3').html()+'" class="clckableToggle '+idGrupo+'"><img src="img/check-presenca-v.png"></td>'
                htmlPiece +=        '<td id="Aluno'+d[i].alunoId+'Dia'+$('#weekCalendarDay4').html()+'" class="clckableToggle '+idGrupo+'"><img src="img/check-presenca-v.png"></td>'
                htmlPiece +=        '<td id="Aluno'+d[i].alunoId+'Dia'+$('#weekCalendarDay5').html()+'" class="clckableToggle '+idGrupo+'"><img src="img/check-presenca-v.png"></td>'
                htmlPiece +=        '<td id="Aluno'+d[i].alunoId+'Dia'+$('#weekCalendarDay6').html()+'" class="'+idGrupo+' fimSemana'+(i%2)+'"></td>'
                htmlPiece += '</tr>'

                 $('#tabelaPresenca').append(htmlPiece);

                 htmlPiece = "";

                 htmlPiece += '<tr class="linhaInfo">';
                 htmlPiece +=   '<td>' + d[i].faltasCalculadas + '</td>'; 
                 htmlPiece +=   '<td>' + d[i].faltasCompensadas + '</td>';
                 htmlPiece +=   '<td>' + d[i].faltasTotais + '</td>';
                 htmlPiece +=   '<td>' + d[i].percentualFaltas + '</td>';
                 htmlPiece += '</tr>';

                 $("#tableInfo").append(htmlPiece);

                 htmlPiece = "";
            }            
        }
    });
    carregaFaltas(idGrupo);
}

function carregaFaltas(idGrupo){
    var date = new Date();
    var todayMonth = date.getMonth();
    $.ajax({
        url: path + 'Chamada/ListarGrupo/'+idGrupo+'/'+$('#weekCalendarDay0').html()+'/'+todayMonth,
        async: false,
        crossDomain: true,
        type: "GET",
        success:function(dataF){
            for (var i = dataF.length - 1; i >= 0; i--) {
                for (var k = dataF[i].faltas.length - 1; k >= 0; k--) {
                    
                    var dia = +dataF[i].faltas[k].split("-")[2].split(" ")[0]

                    $("#Aluno"+dataF[i].alunoId+"Dia"+dia).html('<img src="img/check-presenca.png">')

                }
            }
        }
    });
}

function mudarGrupo(idGrupo){
    window.grupoEscolhido = idGrupo;

    window.dayOffsetWeekCalendar = 0;

    $("#weekdisplay").weekdisplay(0);

    atualizarCalendario(window.grupoEscolhido)

    adicionarClickCasas()

    $('.nomeGrupos').removeClass('active');
    $('#'+idGrupo).addClass('active');
}

$(document).ready(function(){
    $("#weekdisplay").weekdisplay()

    window.dayOffsetWeekCalendar = 0

    atualizarGrupos();

    $('#calendarRightArrow').click(function(){
        window.dayOffsetWeekCalendar += 7
        $( "#weekdisplay" ).weekdisplay(window.dayOffsetWeekCalendar)
        atualizarCalendario(window.grupoEscolhido)
        adicionarClickCasas()
    })

    $('#calendarLeftArrow').click(function(){
        window.dayOffsetWeekCalendar -= 7
        $( "#weekdisplay" ).weekdisplay(window.dayOffsetWeekCalendar)
        atualizarCalendario(window.grupoEscolhido)
        adicionarClickCasas()
    })

    adicionarClickCasas()

});

function enviarFaltas() {

    date = new Date()

    date.setDate(date.getDate() + window.dayOffsetWeekCalendar)
    var todayMonth = date.getMonth()

    var objetoASerEnviado = {}

    objetoASerEnviado.dataDia = $('#weekCalendarDay0').html()
    objetoASerEnviado.dataMes = globalMonth
    objetoASerEnviado.listaFaltas = []

    var diasPresenca = document.getElementsByClassName('clckableToggle')

    for (var i = diasPresenca.length - 1; i >= 0; i--) {
        diasPresenca[i].idAluno = diasPresenca[i].id.split("Dia")[0].split("Aluno")[1]
        diasPresenca[i].diaReferente = diasPresenca[i].id.split("Dia")[1]
    };

    var alunos = document.getElementsByClassName('aluno')
    var listaFaltas = {}
    
    for (var i = alunos.length - 1; i >= 0; i--) {

        var presencaSemana = []

        for (var k = 0; k < diasPresenca.length; k++) {
            if (diasPresenca[k].idAluno == alunos[i].id) {

                // console.log(diasPresenca[k].innerHTML);

                var falta = 1

                if (diasPresenca[k].innerHTML == '<img src="img/check-presenca.png">') {
                    falta = 0
                }

                presencaSemana.push(falta)
            }
        };

        objetoASerEnviado.listaFaltas.push({"alunoId" : alunos[i].id, "faltas" : presencaSemana})
    };

    // console.log(JSON.stringify(objetoASerEnviado));

    $.ajax({
        url: path + "Chamada/ChamadaGrupo/",
        async: false,
        crossDomain: true,
        type: "POST",
        data: "stringfiedJson="+JSON.stringify(objetoASerEnviado),
        success: function(data){
            if(data == 'Post Completo'){
               mensagem("Presença apontada com sucesso!","OK","bt_ok","sucesso"); 
           }else{
                mensagem("Erro ao apontar presença!","OK","bt_ok","erro");
           }
            
        }
    });

}