//Carrega a funçao de Load do JQuery

var professorId= localStorage.getItem("professorId");

(function ( $ ) {

    function createDivHeader(thisNode) {
        var headerDiv = document.createElement("div");
        var arrowLeftDiv = document.createElement("div");
        var centerLargeDiv = document.createElement("div");
        var arrowRightDiv = document.createElement("div");

        headerDiv.style.width = "245px";
        headerDiv.style.height = "35px";

        arrowLeftDiv.style.width = "35px"
        arrowLeftDiv.style.height = "35px"
        arrowLeftDiv.style.display = "inline-block"
        arrowLeftDiv.style.backgroundColor = "purple"
        arrowLeftDiv.id = "calendarLeftArrow"

        centerLargeDiv.style.width = "175px"
        centerLargeDiv.style.height = "35px"
        centerLargeDiv.style.display = "inline-block"
        centerLargeDiv.id = "calendarMonthName"

        arrowRightDiv.style.width = "35px"
        arrowRightDiv.style.height = "35px"
        arrowRightDiv.style.display = "inline-block"
        arrowRightDiv.style.backgroundColor = "black"
        arrowRightDiv.id = "calendarRightArrow"

        headerDiv.appendChild(arrowLeftDiv)
        headerDiv.appendChild(centerLargeDiv)
        headerDiv.appendChild(arrowRightDiv)

        thisNode.appendChild(headerDiv);
    }

    function createDivDays(thisNode, divId, days, id) {

        var daysDiv = document.createElement("div");

        daysDiv.style.width = "245px";
        daysDiv.style.height = "35px";
        daysDiv.id = divId;

        var i = 0
        days.forEach(function(displayDay) {
            var dayDiv = document.createElement("div");
            dayDiv.style.width = "35px"
            dayDiv.style.height = "35px"
            dayDiv.style.display = "inline-block"

            var displayDaySpan = document.createElement("span");
            displayDaySpan.id = id + i;

            displayDaySpan.innerHTML = displayDay
            dayDiv.appendChild(displayDaySpan)
            daysDiv.appendChild(dayDiv)
            i++
        })

        thisNode.appendChild(daysDiv);
    }

    function getAtualWeek(todayNumber, todayName) {

        var thisWeekNumbers = [todayNumber]

        for (var i = todayNumber-1; i >= todayNumber - todayName; i--) {
            var day = new Date()
            day.setDate(i)
            thisWeekNumbers.unshift(day.getDate())
        };

        for (var i = todayNumber+1; i <= todayNumber + (6 - todayName); i++) {
            var day = new Date()
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

            createDivHeader(thisNode)
            createDivDays(thisNode, "daysName", ["D", "S", "T", "Q", "Q", "S", "S"], "weekCalendarName")
            createDivDays(thisNode, "daysNumber", getAtualWeek(todayNumber, todayName), "weekCalendarDay")

        } else {

            date.setDate(date.getDate() + offset)

            $('#daysNumber').empty()
            $('#daysNumber').remove()

            var todayName = date.getDay()
            var todayNumber = date.getDate()

            createDivDays(thisNode, "daysNumber", getAtualWeek(todayNumber, todayName), "weekCalendarDay")

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
    if (this.innerHTML == "1") {
        this.innerHTML = "0"
    } else {
        this.innerHTML = "1"
    }
}

function atualizarGrupos() {
    $.ajax({
        url: path + 'ProfessorFuncionario/ProfessorGrupo/' + professorId,
        async: false,
        crossDomain: true,
        type
        : "GET",
        success: function(d) {

            window.grupoEscolhido = d[0].idgrupo

            var recebeGrupos = document.getElementById('recebeGrupos')
            recebeGrupos.innerHTML = ""

            for (var i = d.length - 1; i >= 0; i--) {
                recebeGrupos.innerHTML += '<p class="nomeGrupos" onclick="mudarGrupo('+d[i].idgrupo+')">'+d[i].nomeGrupo+'</p>'
            }

            atualizarCalendario(window.grupoEscolhido)
        }
    });
}

function atualizarCalendario(idGrupo) {

    var date = new Date() 

        date.setDate(date.getDate() + window.dayOffsetWeekCalendar)

        var todayMonth = date.getMonth()
        var todayDay = date.getDate()

    $.ajax({
        url: path + 'Chamada/ListarGrupo/'+idGrupo+'/'+todayDay+'/'+todayMonth,
        //url: path + 'Chamada/ListarGrupo/'+1493+'/'+10+'/'+0,
        async: false,
        crossDomain: true,
        type: "GET",
        success: function(d) {

            $('#recebeAlunos').html("")
            $('#tabelaPresenca tbody').html("")
            var htmlPiece = "";

            for (var i = 0; i < d.length; i++) {
            
                htmlPiece += '<p class="alunoLinha">'                                
                htmlPiece +=     '<img src="'+ d[i].foto +'">'
                htmlPiece +=     '<span class="foto aluno" id="'+d[i].alunoId+'">'
                htmlPiece +=         d[i].alunoNome
                htmlPiece +=     '</span>'                                
                htmlPiece += '</p>'
                
                $('#recebeAlunos').html($('#recebeAlunos').html() + htmlPiece)

                htmlPiece = "";

                htmlPiece += '<tr>'
                htmlPiece +=        '<td id="Aluno'+d[i].alunoId+'Dia'+$('#weekCalendarDay0').html()+'" class="clckableToggle '+idGrupo+'">1</td>'
                htmlPiece +=        '<td id="Aluno'+d[i].alunoId+'Dia'+$('#weekCalendarDay1').html()+'" class="clckableToggle '+idGrupo+'">1</td>'
                htmlPiece +=        '<td id="Aluno'+d[i].alunoId+'Dia'+$('#weekCalendarDay2').html()+'" class="clckableToggle '+idGrupo+'">1</td>'
                htmlPiece +=        '<td id="Aluno'+d[i].alunoId+'Dia'+$('#weekCalendarDay3').html()+'" class="clckableToggle '+idGrupo+'">1</td>'
                htmlPiece +=        '<td id="Aluno'+d[i].alunoId+'Dia'+$('#weekCalendarDay4').html()+'" class="clckableToggle '+idGrupo+'">1</td>'
                htmlPiece +=        '<td id="Aluno'+d[i].alunoId+'Dia'+$('#weekCalendarDay5').html()+'" class="clckableToggle '+idGrupo+'">1</td>'
                htmlPiece +=        '<td id="Aluno'+d[i].alunoId+'Dia'+$('#weekCalendarDay6').html()+'" class="clckableToggle '+idGrupo+'">1</td>'
                htmlPiece += '</tr>'

                 $('#tabelaPresenca tbody').html($('#tabelaPresenca tbody').html() + htmlPiece)

                 htmlPiece = ""
            };


            for (var i = d.length - 1; i >= 0; i--) {
                for (var k = d[i].faltas.length - 1; k >= 0; k--) {
                    
                    var dia = d[i].faltas[k].split("-")[2].split(" ")[0]

                    $("#Aluno"+d[i].alunoId+"Dia"+dia).html("0")


                };
            };


        }
    });
}

function mudarGrupo(idGrupo) {
    window.grupoEscolhido = idGrupo

    window.dayOffsetWeekCalendar = 0 

    $( "#weekdisplay" ).weekdisplay(0)

    atualizarCalendario(window.grupoEscolhido)

    adicionarClickCasas()

}

$(document).ready(function(){

    $( "#weekdisplay" ).weekdisplay()

    window.dayOffsetWeekCalendar = 0

    atualizarGrupos()

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
    objetoASerEnviado.dataMes = todayMonth
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
                presencaSemana.push(diasPresenca[k].innerHTML)
            }
        };

        objetoASerEnviado.listaFaltas.push({"alunoId" : alunos[i].id, "faltas" : presencaSemana})
    };

    $.ajax({
        url: path + "Chamada/ChamadaGrupo/",
        async: false,
        crossDomain: true,
        type: "POST",
        data: JSON.stringify(objetoASerEnviado),
        success: function(data){
            console.log("done")
        }
    });

}