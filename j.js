const url = `https://localhost:7143`;

/* PAGINAÇÂO*/
function abrirPaginaAluno(){
  abrirPagina("aluno")
}
function abrirPaginaLivro(){
  abrirPagina("livro")
}
function abrirPaginaEmprestimo(){
  abrirPagina("emprestimo")
}
function abrirPaginaPendentes(){
  abrirPagina("pendentes")
}
function abrirPagina(pagina){

  const aluno = document.getElementById('p-aluno');
  const livro = document.getElementById('p-livro');
  const emprestimo = document.getElementById('p-emprestimo');
  const pendentes = document.getElementById('p-pendentes');

  aluno.classList.remove("p-aluno");
  aluno.classList.add("hidden");

  livro.classList.remove("p-livro");
  livro.classList.add("hidden");

  emprestimo.classList.remove("p-emprestimo");
  emprestimo.classList.add("hidden");

  pendentes.classList.remove('p-pendentes');
  pendentes.classList.add("hidden");
  

  switch(pagina){
    case "aluno":
      aluno.classList.remove("hidden");
      aluno.classList.add("p-aluno");
      break;
    case "livro":
      livro.classList.remove("hidden");
      livro.classList.add("p-livro")
      break;  
    case "emprestimo":
      emprestimo.classList.remove("hidden");
      emprestimo.classList.add("p-emprestimo");
      break;
    case "pendentes":
      pendentes.classList.remove("hidden");
      pendentes.classList.add("p-pendentes");
  }
}

// ALUNO SERVICES
function buscarAluno() {
  const buscarAluno = document.getElementById('matriculaBusca').value;

  fetch(`${url}/aluno/buscar/matricula?matricula=${buscarAluno}`)
    .then(response => response.json())
    .then(data => {
      if(data.value.nome === undefined)
      {
        const alunoEncontrado = document.getElementById('resultado-buscar-aluno');
        alunoEncontrado.innerHTML = `<p>${data.value}</p>`;
      }else
      {     
        var turno = data.value.turno === "1" ? "Manhã" : "Tarde";
        
        const alunoEncontrado = document.getElementById('resultado-buscar-aluno');
        alunoEncontrado.innerHTML = `<p>${data.value.nome}</p><p>Sala: ${data.value.sala}</p><p>${turno}</p>`;
      }
    }
  )      
}

function cadastrarAluno() 
{
  const form = document.getElementById('form-cadastrar-auluno');
  const formData = new FormData(form);

  fetch(`${url}/aluno/cadastrar`, 
  {
    method: 'POST',
    body: formData
  })
  .then(response => 
    {
      response.json().then(data => 
        {
          const alunoEncontrado = document.getElementById('resultado-cadastrar-aluno');
          if(data.value.nome === undefined)
          {
            alunoEncontrado.innerHTML = `<p>${data.value}</p>`;
          }else
          {     
            var turno = data.value.turno === "1" ? "Manhã" : "Tarde";            
            alunoEncontrado.innerHTML = `<p>${data.value.nome}</p><p>Sala: ${data.value.sala}</p><p>${turno}</p>`;
          }
        }
      )
    }
  )
}

function editarAluno() {
  const alunoEditado = document.getElementById('form-editar-aluno');
  const formData = new FormData(alunoEditado);

  fetch(`${url}/aluno/editar`, {
    method: 'PUT',
    body: formData
  })
  .then(response => 
    {
      response.json().then(data => 
        {
          const alunoEncontrado = document.getElementById('resultado-editar-aluno');
          if(data.value.nome === undefined)
          {
            alunoEncontrado.innerHTML = `<p>${data.value}</p>`;
          }else
          {     
            var turno = data.value.turno === "1" ? "Manhã" : "Tarde";            
            alunoEncontrado.innerHTML = `<p>${data.value.nome}</p><p>Sala: ${data.value.sala}</p><p>${turno}</p>`;
          }
        }
      )
    }
  )
}

function confirmarAlunoParaRemocao()
{
  const matricula = document.getElementById("idDeletar").value;

  fetch(`${url}/aluno/buscar/matricula?matricula=${matricula}`)
    .then(response => response.json())
    .then(data =>
    {
      if(data.value.nome === undefined)
      {
        const alunoEncontrado = document.getElementById('resultado-apagar-aluno');
        alunoEncontrado.innerHTML = `<p>${data.value}</p>`;
      }else
      {
        var turno = data.value.turno === "1" ? "Manhã" : "Tarde";
        
        var apagar = confirm
        (`
          Aluno Selecionado

          Nome: ${data.value.nome}
          Sala: ${data.value.sala}
          Turno: ${turno}

          Deseja apagar este aluno?
        `)
        if(apagar){
          apagarAluno();
        }
      }
    }
  )
}

function apagarAluno(){

  const id = document.getElementById("idDeletar").value;
  fetch(`${url}/aluno/apagar`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(id)
  })
  .then(response => 
      {
      response.json().then(data => 
        {
          const alunoEncontrado = document.getElementById('resultado-apagar-aluno');
          if(data.value.nome === undefined)
          {
            alunoEncontrado.innerHTML = `<p>${data.value}</p>`;
          }else
          {     
            var turno = data.value.turno === "1" ? "Manhã" : "Tarde";
            
            alunoEncontrado.innerHTML = `<p>${data.value.nome}</p=><p>Sala: ${data.value.sala}</p><p> ${turno}</p>`;
          }
        }
      )
    }
  )
}

// LIVRO SERVICES
function buscarLivros(){
  const livroPesquisado = document.getElementById('tituloBusca').value;
  
  const pesquisaFormatada = formatarTextos(livroPesquisado)

  fetch(`${url}/livro/estoque`)
    .then(response => response.json())
    .then(data => 
      {
        const estoqueLista = document.getElementById('resultado-buscar-livro');
        let livroHtml = "";
        data.value.forEach(item => 
        {
          if(item.titulo.startsWith(pesquisaFormatada)) 
          {
            livroHtml +=`
            <ul class="resultado-buscar-livro">
              <li>${item.titulo}</li>
              <li>${item.autor}</li>
              <li>${item.registro}</li>
            </ul>`;
          }
        })
        estoqueLista.innerHTML = livroHtml;
      }
    )
  .catch(error => console.log(error));
  }

function formatarTextos(campoEmVerificacao) 
{
  //Remover Espaços
  campoEmVerificacao = campoEmVerificacao.trim();
  campoEmVerificacao = campoEmVerificacao.replace(/\s+/g, " ");
  
  //Remove maiusculas
  campoEmVerificacao = campoEmVerificacao.toLowerCase();
  
  //Remove acentos
  campoEmVerificacao = campoEmVerificacao.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  //Toda palavra começa com maiúscula
  campoEmVerificacao = campoEmVerificacao.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  
  return campoEmVerificacao;
}

function cadastrarLivro() 
{
  const form = document.getElementById('form-cadastrar-livro');
  const formData = new FormData(form);

  fetch(`${url}/livro/cadastro`, {
    method: 'POST',
    body: formData
  })
  .then(response => 
    {
      response.json().then(data => 
        {
          const resultadoLivro = document.getElementById('resultado-cadastrar-livro');
          if(data.value.titulo === undefined)
          {
            resultadoLivro.innerHTML = `<p>${data.value}</p>`;
          }else
          {
            resultadoLivro.innerHTML = `
              <ul class="resultado-buscar-livro">
                <li>${data.value.registro}</li>
                <li>${data.value.titulo}</li>
                <li>${data.value.autor}</li>
              </ul>`;
          }
        }
      )
    }
  )
}

function editarLivro() {
  const editar = document.getElementById('form-editar-livro');
  const formData = new FormData(editar);

  fetch(`${url}/livro/editar`, {
    method: 'PUT',
    body: formData
  })
  .then(response => 
    {
      response.json().then(data => 
        {
          const resultadoLivro = document.getElementById('resultado-editar-livro');
          if(data.value.titulo === undefined)
          {
            resultadoLivro.innerHTML = `<p>${data.value}</p>`;
          }else
          {     
            resultadoLivro.innerHTML = `
              <ul class="resultado-buscar-livro">
                <li>${data.value.registro}</li>
                <li>${data.value.titulo}</li>
                <li>${data.value.autor}</li>
              </ul>`;
          }
        }
      )
    }
  )
}

function confirmarRemocaoLivro() {
  const registro = document.getElementById('RegistroDeletar').value;
  fetch(`${url}/livro/buscar?registro=${registro}`)
    .then(response => response.json())
    .then(data => 
      {
        const livroEncontrado = document.getElementById('resultado-apagar-livro');
        if(data.value.titulo === undefined){
          livroEncontrado.innerHTML = `<p>${data.value}<p/>`;
        }else{
          var apagar = confirm
          (`
            Livro Selecionado

            Registro: ${data.value.registro}
            Título: ${data.value.titulo}
            Autor: ${data.value.autor}

            Deseja apagar este livro?
          `)
          if(apagar){
            removerLivro();
          }
        }
      }
    )
  }

  function removerLivro(){
    const id = document.getElementById("RegistroDeletar").value;
    fetch(`${url}/livro/apagar`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(id)
    })
    .then(response => 
      {
        response.json().then(data => {
          const resultadoLivro = document.getElementById('resultado-apagar-livro');
          resultadoLivro.innerHTML = `
            <ul class="resultado-buscar-livro">
            <li>${data.value.registro}</li>
              <li>${data.value.titulo}</li>
              <li>${data.value.autor}</li>
            </ul>`;
        })
      }
    )
  }

/*EMPRÉSTIMO SERVICE*/
function realizarEmprestimo() {
  const registro = document.getElementById("RegistroEmprestimo").value;
  const matricula = document.getElementById("MatriculaEmprestimo").value;

  
  
  fetch(`${url}/Emprestimo/emprestar?registro=${registro}&matricula=${matricula}`, {
    method: 'POST'
  })
  .then((response) => response.json())
  .then(data => {
    document.getElementById("resultado-emprestar-livro").innerHTML = data.value
  })
}


function realizarDevolucao() {
  const registro = document.getElementById("RegistroDevolucao").value;
  const matricula = document.getElementById("MatriculaDevolucao").value;

  fetch(`${url}/Emprestimo/devolver?registro=${registro}&matricula=${matricula}`, {
    method: 'DELETE'
  })
  .then((response) => response.json())
  .then(data => {
    document.getElementById("resultado-devolver-livro").innerHTML = data.value
  })
}


function listarPendentes()
{
  const tempo = document.getElementById("tempoPendencia").value;
  const turno = document.getElementById("turnoPendencia").value;
  let sala = document.getElementById("salaPendencia").value;

  sala = sala || 0;

  fetch(`${url}/Emprestimo/pendentes?sala=${sala}&turno=${turno}&dias=${tempo}`)
  .then(response => response.json())
  .then(data => 
    {
      const pendentes = document.getElementById("resultado-todos-pendentes");
      let livroHtml = "";

      data.value.forEach(item => 
        {
          let turno = item.turno === "1" ? "Manhã" : "Tarde";

            livroHtml +=`
            <ul class="resultado-buscar-livro">
              <li>${item.nome}</li>
              <li>${item.sala}</li>
              <li>${turno}</li>
              <li>${item.registro}</li>
              <li>${item.dataEmprestimo}</li>

            </ul>`;
          
        })
        pendentes.innerHTML = livroHtml;
    })
  }
