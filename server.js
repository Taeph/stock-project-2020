const express = require('express');
const axios = require('axios');
const mysql = require('mysql');
const { resolveInclude } = require('ejs');
const app = express();

const password = '12qw!@QW';
const name = 'stockdb';

app.set("views", __dirname + '/Views'); // views path
app.set("view engine", "ejs"); // ejs
app.use(express.json()); // body-parser
app.use(
    express.urlencoded({
      extended: false,
    })
  );

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: password,
    database: name,
});

function serverLog(str) {
    console.log(`[SERVER] ${str}`);
}

// index page
app.get('/', function( req, res ) {
    res.render('index');
})

// signUp page
app.get('/signUp', function( req, res ) {
    res.render('Login/signUp');
})

// findId page
app.get('/findId', function( req, res ) {
    res.render('Login/findId');
})

// findPw page
app.get('/findPw', function( req, res ) {
    res.render('Login/findPw');
})

// findPw page
app.get('/home', function( req, res ) {
    res.render('home');
})



// server OK
app.listen('3000', function(req, res) {
    console.log('[SERVER] "stock-discussion-room" listening at http://localhost:3000');
})

// sign-in check
app.post('/request-sign-in-check', async function(req, res) {
    const id = req.body.id;
    const pw = req.body.pw;
    const flag = await InsertUserInfo(id, pw);

    /*
        res.send() 를 사용해서는 정수를 보낼 수 없다.
        res.sendStatus() 를 사용해서 정수를 보내야 한다.
    */
    res.send(flag);
})

// insert data in user_info_tb
function InsertUserInfo(id, pw) {
    return new Promise( (resolve, reject) => {
        let signInFlag;
        connection.query('SELECT count(*) AS cnt FROM user_info_tb WHERE id = ?', [id], function(error, results, fields) {
            if(error) {
                reject(error);
            } else {
                if(results[0].cnt == 0) {
                    console.log('등록되지 않은 아이디 입니다');
                    resolve('CODE1');
                } else {
                    connection.query('SELECT count(*) AS cnt FROM user_info_tb WHERE id = ? AND pw = ?', [id, pw], function(error, results, fields) {
                        if(error) {
                            reject(error);
                        } else {
                            if(results[0].cnt == 0) {
                                console.log('비밀번호가 틀립니다');
                                resolve('CODE2');
                            } else {
                                console.log('로그인 성공');
                                resolve('CODE3');
                            }
                        }
                    });
                }
            }
        });
    })
}


// sign-up id check
app.post('/requset-sign-up-check-id', function(req, res) {
    const id = req.body.id;
    console.log(id);
    connection.query('SELECT count(*) FROM user_info_tb WHERE id = ?', [id], function(error, results, fields) {
        if(error) {
            throw error;
        } else {
            let check;
            if(results.length == 0) {
                check = true;
            } else {
                check = false;
            }
            res.send(check);
        }
    });    
})

// sign-up insert user info
app.post('/request-sign-up-insert-db', function(req, res) {
    
    console.log(req.body);

    const userId = req.body.id;
    const userPw = req.body.pw;
    const userName = req.body.name;
    const userBirth = req.body.birth;
    const userGender = req.body.gender;
    const userPhone = req.body.phone;

    const SQL = {
        id: userId,
        pw: userPw,
        name: userName,
        birth: userBirth,
        gender: userGender,
        phone: userPhone,
    };

    connection.query('INSERT INTO user_info_tb SET ?', SQL, function(error, results, fields) {
        if(error) {
            throw error;
        } else {
            console.log(results);
            res.send(true);
        }
    });    
})