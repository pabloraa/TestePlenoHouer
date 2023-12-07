const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;


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

// Rota para obter todos os usuários
app.get('/users', (req, res) => {
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
    console.log(`Servidor Node.js está executando em http://localhost:3000/users`);
});

function insertUser() {
    const id = document.getElementById('iD').value;
    const name = document.getElementById('nome').value;
    const func = document.getElementById('funcao').value;
    const sal = document.getElementById('salario').value;
    const desc = document.getElementById('descricao').value;
    const Email = document.getElementById('email').value;

    fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id,name,func,sal,des,Email }),
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



