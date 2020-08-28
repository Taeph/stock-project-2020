const mysql = require('mysql');

// local DB 정보
const password = "12qw!@QW"; // 로컬 DB 비밀번호
const name = "stockDB"; // 생성한 스키마 이름

// DB connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: password,
  database: name,
});

// create user-info Table
async function createUserInfoTable() {
    return new Promise( (resolve, reject) => {
        connection.query(
            `CREATE TABLE user_info_tb (
                id VARCHAR(20) unique not null,
                pw VARCHAR(16) not null,
                name VARCHAR(10) character set utf8 not null,
                birth VARCHAR(8) not null,
                gender VARCHAR(1) not null,
                phone VARCHAR(13) primary key
            )`,
            function(error, result, fields) {
                if(error) {
                    console.log('[ERROR] CREATE USER_INFO_TB');
                    reject(error);
                } else {
                    console.log('[OK] CREATE USER_INFO_TB');
                    resolve(result);
                }
            }    
        )
    })
}

// create comment Table
async function createCommentTable() {
    return new Promise( (resolve, reject) => {
        connection.query(
            `CREATE TABLE comment_tb (
                id VARCHAR(20) not null,
                date DATETIME default now(),
                contents VARCHAR(200) character set utf8 not null,
                like_cnt int(5) default '0',
                unlike_cnt int(5) default '0',
                prediction VARCHAR(2) character set utf8 not null
            )`,
            function(error, result, fields) {
                if(error) {
                    console.log('[ERROR] CREATE COMMENT_TB');
                    reject(error);
                } else {
                    console.log('[OK] CREATE COMMENT_TB');
                    resolve(result);
                }
            }    
        )
    })
}

createUserInfoTable();
createCommentTable();