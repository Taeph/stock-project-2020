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

// 초기화면(로그인 화면)
app.get('/', function( req, res ) {
    res.render('index');
})

// 회원가입 화면
app.get('/signUp', function( req, res ) {
    res.render('Login/signUp');
})

// 아이디 찾기 화면
app.get('/findId', function( req, res ) {
    res.render('Login/findId');
})

// 비밀번호 찾기 화면
app.get('/findPw', function( req, res ) {
    res.render('Login/findPw');
})

// 홈 화면(로그인 이후 화면)
app.get('/home', function( req, res ) {
    res.render('home');
})


// server OK
app.listen('3000', function(req, res) {
    serverLog('listening at http://localhost:3000');
})



// 로그인 화면 (로그인 정보 일치여부)
app.post('/request-sign-in-check', async function(req, res) {
    const id = req.body.id;
    const pw = req.body.pw;
    const flag = await confirmSignIn(id, pw);

    /*
        res.send() 를 사용해서는 정수를 보낼 수 없다.
        res.sendStatus() 를 사용해서 정수를 보내야 한다.
    */
    res.send(flag);
})

// 로그인 화면 (로그인 정보 비교 함수)
function confirmSignIn(id, pw) {
    return new Promise( (resolve, reject) => {
        let signInFlag;
        connection.query('SELECT count(*) AS cnt FROM user_info_tb WHERE id = ?', [id], function(error, results, fields) {
            if(error) {
                reject(error);
            } else {
                if(results[0].cnt == 0) {
                    serverLog('등록되지 않은 아이디 입니다');
                    resolve('CODE1');
                } else {
                    connection.query('SELECT count(*) AS cnt FROM user_info_tb WHERE id = ? AND pw = ?', [id, pw], function(error, results, fields) {
                        if(error) {
                            reject(error);
                        } else {
                            if(results[0].cnt == 0) {
                                serverLog('비밀번호가 틀립니다');
                                resolve('CODE2');
                            } else {
                                serverLog('로그인 성공');
                                resolve('CODE3');
                            }
                        }
                    });
                }
            }
        });
    })
}

// 회원가입 화면 (아이디 중복 검사)
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

// 회원가입 화면 (테이블에 데이터 삽입)
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
            serverLog('유저정보 INSERT');
            res.send(true);
        }
    });    
})

// 아이디 찾는 화면 (아이디 찾기)
app.post('/request-find-user-id', function(req, res) {
    const name = req.body.name;
    const phone = req.body.phone;
    connection.query('SELECT id FROM user_info_tb WHERE name = ? AND phone = ?', [name, phone], function(error, results, fields) {
        if(error) {
            throw error;
        } else {
            if(results[0] == undefined) {
                serverLog(`아이디 찾기 실패`);
            } else {
                serverLog(`아이디 찾기 완료 - ${results[0].id}`);
            }
            res.send(JSON.stringify(results[0]));
        }
    });
})

// 비밀번호 찾는 화면 (비밀번호 찾기)
app.post('/request-find-user-pw', function(req, res) {
    const id = req.body.id;
    const name = req.body.name;
    const phone = req.body.phone;
    connection.query('SELECT pw FROM user_info_tb WHERE id = ? AND name = ? AND phone = ?', [id, name, phone], function(error, results, fields) {
        if(error) {
            throw error;
        } else {
            if(results[0] == undefined) {
                serverLog(`비밀번호 찾기 실패`);
            } else {
                serverLog(`비밀번호 찾기 완료 - ${results[0].id}`);
            }
            res.send(JSON.stringify(results[0]));
        }
    });
})