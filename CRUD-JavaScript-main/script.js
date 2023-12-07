const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sFuncao = document.querySelector('#m-funcao')
const sSalario = document.querySelector('#m-salario')
const btnSalvar = document.querySelector('#btnSalvar')
const sDescricaoVaga = document.querySelector('#m-descricao')
const sEmail = document.querySelector('#m-email')
const sId = document.querySelector('#m-iD')

let itens
let id

function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  if (edit) {
    sId.value = itens[index].iD
    sNome.value = itens[index].nome
    sFuncao.value = itens[index].funcao
    sSalario.value = itens[index].salario
    sDescricaoVaga.value = itens[index].descricao
    sEmail.value = itens[index].email
    
    id = index
  } else {
    sId.value = ''
    sNome.value = ''
    sFuncao.value = ''
    sSalario.value = ''
    sDescricaoVaga.value = ''
    sEmail.value = ''
    
  } 
}

function editItem(index) {

  openModal(true, index)
}

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  loadItens()
}

function insertItem(item, index) {
  let tr = document.createElement('tr')

  tr.innerHTML = `

    <td>${item.iD}</td>
    <td>${item.nome}</td>
    <td>${item.funcao}</td>
    <td>R$ ${item.salario}</td>
    <td>${item.descricao}</td>
    <td>${item.email}</td>
    
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
  tbody.appendChild(tr)
}

btnSalvar.onclick = e => {
  
  if (sNome.value == '' || sFuncao.value == '' || sSalario.value == '' || sDescricaoVaga.value =='' || sEmail.value =='' || sId.value =='') {
    return
  }

  e.preventDefault();

  if (id !== undefined) {
    itens[id].iD = sId.value
    itens[id].nome = sNome.value
    itens[id].funcao = sFuncao.value
    itens[id].salario = sSalario.value
    itens[id].descricao = sDescricaoVaga.value
    itens[id].email = sEmail.value
    
  } else {
    itens.push({'iD':sId.value,'nome': sNome.value, 'funcao': sFuncao.value, 'salario': sSalario.value, 'descricao' : sDescricaoVaga.value, 'email':sEmail.value} )
  }

  setItensBD()

  modal.classList.remove('active')
  loadItens()
  id = undefined
}

function loadItens() {
  itens = getItensBD()
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })

}
document.addEventListener('DOMContentLoaded', () => {
      fetch('http://localhost:3000/index2')
          .then(response => response.json())
          .then(users => {
                const userList = document.getElementById('user-list');
                    users.forEach(cadastro => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `${cadastro.id}, ${cadastro.nome}, ${cadastro.funcao},${cadastro.salario},${cadastro.descricao},${cadastro.email}}`;
                        userList.appendChild(listItem);
                    });
                })
                .catch(error => console.error('Erro:', error));
});

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))


loadItens()

function paginaCadastroVagas(){
  window.location.href = 'index.html';   
}

function paginaCadastroCandidatos(){
window.location.href = 'index3.html';
}






const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;
//3000

//const bodyParser = require('body-parser');

//app.use(bodyParser.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '30910023',
    database: 'CRUD1'
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL: ' + err.stack);
        return;
    }
    console.log('Conectado ao MySQL como id ' + db.threadId);
});

// Rota para obter todos os usuários /users
app.get('/index2', (req, res) => {
    const sql = 'SELECT * FROM cadastro';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

//users
app.post('/users', (req,res)=>{
    const{iD,nome,funcao,salario,descrivao,email} = req.body;
    const sql = 'INSERT INTO cadastro(iD,nome,funcao,salario,descricao,email) VALUES(?,?,?,?,?,?)';
    db.query(sql,[iD,nome,funcao,salario,descrivao,email],(err,result)=>{
        if(err) throw err;
        res.json({messagem:'Usuário inserido com sucesso!',id:result.insertId});
    });
});

app.listen(port, () => {
    //console.log(`Servidor Node.js está executando em http://localhost:${port}`);
    console.log(`Servidor Node.js está executando em http://localhost:3000/index2`);
});

function insertUser() {
    const id = document.getElementById('iD').value;
    const name = document.getElementById('nome').value;
    const func = document.getElementById('funcao').value;
    const sal = document.getElementById('salario').value;
    const desc = document.getElementById('descricao').value;
    const Email = document.getElementById('email').value;

    fetch('http://localhost:3000/index2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id,name,func,sal,desc,Email }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        alert('Usuário adicionado com sucesso! ID: ' + data.id);
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao adicionar usuário. Consulte o console para mais detalhes.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(users => {
          const userList = document.getElementById('user-list');
          users.forEach(user => {
              const listItem = document.createElement('li');
              listItem.textContent = `${user.iD}, ${user.nome}, ${user.funcao},${user.salario},
              ${user.descricao},${user.email} 
                  <button onclick="deleteUser(${user.id})">Excluir</button>`;
              userList.appendChild(listItem);
          });
      })
      .catch(error => console.error('Erro:', error));
});


app.delete('/users/:id', (req, res) => {
      const userId = req.params.id;
      const sql = 'DELETE FROM users WHERE id = ?';
      
      db.query(sql, [userId], (err, result) => {
          if (err) throw err;
          res.json({ message: 'Usuário excluído com sucesso!' });
      });
});

document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(users => {
          const userList = document.getElementById('user-list');
          users.forEach(user => {
              const listItem = document.createElement('li');
              listItem.textContent = `${user.iD}, ${user.nome}, ${user.funcao}, ${user.salario}
              ,${user.descricao},${user.email}  
                  <button onclick="deleteUser(${user.id})">Excluir</button>`;
              userList.appendChild(listItem);
          });
      })
      .catch(error => console.error('Erro:', error));
});

function deleteUser(userId) {
  fetch(`http://localhost:3000/users/${userId}`, {
      method: 'DELETE',
  })
  .then(response => response.json())
  .then(data => {
      console.log(data);
      alert('Usuário excluído com sucesso!');
      location.reload(); // Recarregar a página para atualizar a lista de usuários
  })
  .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao excluir usuário. Consulte o console para mais detalhes.');
  });
}

app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'SELECT * FROM users WHERE id = ?';
  
  db.query(sql, [userId], (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
          res.json(result[0]); // Retorna o primeiro usuário encontrado
      } else {
          res.status(404).json({ message: 'Usuário não encontrado' });
      }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const userList = document.getElementById('user-list');
  const userDetails = document.getElementById('user-details');

  // Função para obter e exibir detalhes do usuário
  function getUserDetails(userId) {
      fetch(`http://localhost:3000/users/${userId}`)
          .then(response => response.json())
          .then(user => {
              userDetails.innerHTML = `Id: ${user.iD}, Nome: ${user.nome},
              Funcao:${user.funcao}, Salario:${user.salario}`
              ;
          })
          .catch(error => console.error('Erro:', error));
  }

  // Função para exibir a lista de usuários
  function displayUserList(users) {
      users.forEach(user => {
          const listItem = document.createElement('li');
          listItem.textContent = `${user.iD}, ${user.nome},${user.funcao},${user.salario},${user.descricao},${user.email} 
              <button onclick="getUserDetails(${user.id})">Detalhes</button>`;
          userList.appendChild(listItem);
      });
  }

  // Obter e exibir a lista de usuários
  fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(users => displayUserList(users))
      .catch(error => console.error('Erro:', error));
});


app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, age } = req.body;
  const sql = 'UPDATE users SET id = ?, nome = ?, funcao = ?, salario = ?, descricao = ?, email = ? WHERE id = ?';
  
  db.query(sql, [iD, nome,funcao,salario,descricao,email], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Usuário atualizado com sucesso!' });
  });
});



 
      



