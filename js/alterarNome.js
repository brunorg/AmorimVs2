$(document).ready(function () {
	$.ajax({
		url: path+"ProfessorFuncionario/ProfessorNomeId",
		//url: path+"Alunos/AlunosNomeId",
		type: "GET",
		async:false,
		crossDomain: true,
		success: function(data)
		{							
			for(var i=0;i<data.length;i++){

				var nome1="";	
				var nome = data[i].nome;					
				nome = nome.trim();
				console.log(nome);
				nome = nome.split(" ");	
				
				var sobreNP = ["do", "da", "das", "e", "dos", "de"];
				var bool = false;
								
				for(var j=0;j<nome.length;j++){
					for(var k=0;k<sobreNP.length;k++){
						if(sobreNP[k] == nome[j].toLowerCase()){
							bool = true;
						}
					}
					
					if(!bool){
						nome1 += nome[j][0].toUpperCase()+nome[j].substr(1,nome[j].length).toLowerCase()+" ";					
					}else{
						nome1 += nome[j].toLowerCase()+" ";
						bool = false;
					}
					//nome1 += nome[j][0].toUpperCase()+nome[j].substr(1,nome[j].length).toLowerCase()+" ";				
				}
				
				//Alterar nome do aluno
				/*$.ajax({
					url: path+"Alunos/AlunoUpdate",
					type: "POST",
					async:false,
					crossDomain: true,
					data: "nome="+nome1.trim()+"&id="+data[i].idAluno,
					success: function(data)
					{	
						console.log('alterou');	
					}
				});	*/	

				//Alterar nome do professor
				$.ajax({
					url: path+"ProfessorFuncionario/ProfessorUpdate",
					type: "POST",
					async:false,
					crossDomain: true,
					data: "nome="+nome1.trim()+"&id="+data[i].idprofessorFuncionario,
					success: function(data)
					{			
						console.log('alterou, Uhhuuuuu!!!');	
					}
				});		
				
			}			
		}
	});
});

