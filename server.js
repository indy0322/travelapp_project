const express = require('express');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const path = require('path')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const multer = require('multer')
const tesseract = require('tesseract.js')
const vision = require('@google-cloud/vision')
const fs = require('fs')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASSWORD,
    }
})
const mysql  = require('mysql');

const mysqlDB = mysql.createPool({
    host:'selab.hknu.ac.kr',
    port: 51714,
    user: 'pbl3_team1',
    password:'12345678',
    database:'2023_pbl3'
})

/*mysqlDB.getConnection(function(err, connection){  
    if ( err ) 
        throw err;
    else{
        connection.query("sql 쿼리", function(err,results){
            if (err) 
                throw err;
            else 
                console.log(results);
        });
        connection.release() 
    }
});*/

const client = new vision.ImageAnnotatorClient({
    keyFilename: './googlecloudKey/googlevisionOCRAPIkey.json' 
});

const cookieParser = require("cookie-parser")
const bodyPaser = require('body-parser')
const app = express();
app.use('/scripts',express.static(__dirname + "/scripts"))
app.use('/imagefile',express.static(__dirname + "/imagefile"))
/*app.use(express.static(path.join(__dirname + '/public')))
console.log(__dirname)*/

const storage = multer.diskStorage({
    
})
const upload = multer({storage: storage})

/*app.set('view engine','ejs')
app.set('views',__dirname + '/views')*/

app.use(bodyPaser.urlencoded({
    limit:"50mb",
    extended:true
}))
app.use(bodyPaser.json({
    limit:"50mb"
}))
app.use(session({secret: '비밀코드', resave: true, saveUninitialized: false, cookie: {httpOnly: true, secure: false}}))
app.use(passport.initialize())
app.use(passport.session())
/*app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))*/
app.use(cookieParser('비밀코드'))


//파파고 api 필수 정보
var client_id = 'NrewrgdhBvuyUGOc4_eB';
var client_secret = 'JHrrefgllS';
//

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pw',
        session: true,
        passReqToCallback: false
    },(id, pw, done) => {
        mysqlDB.query('SELECT * FROM 2023_pbl3.team1_member WHERE id = ?', [id] ,function(err,result){
            if(err){return done(err)}
            if(result == 0){
                return console.log('아이디가 존재하지 않는다'), done(null,false,{message:'존재하지 않는 아이디'})
            }
            else{
                console.log(result)
                var json = JSON.stringify(result[0])
                var userinfo = JSON.parse(json)
                if(userinfo.passwd == pw){
                    console.log("userinfo: ",userinfo)
                    return done(null,userinfo)
                }
                else{
                    return console.log('비밀번호가 일치하지 않는다'), done(null,false,{message:'비번 틀림'})
                }
                
            }
        })
    })
)

passport.serializeUser(function(user, done){
    console.log('serializeUser: ',user)
    done(null, user.id)
})
passport.deserializeUser(function(아이디, done){
    //console.log("deserializeUser: ",아이디)
    mysqlDB.query('SELECT * FROM 2023_pbl3.team1_member WHERE id = ?', [아이디] ,function(err,result){
        if(err){return console.log("mysql 에러")}
        //console.log('deserializeUser mysql result: ',result)
        var json = JSON.stringify(result[0])
        var userinfo = JSON.parse(json);
        //console.log(json)
        done(null,userinfo)
    })
})

app.listen(8000, function(){
    console.log('listening on 8000')
})

//회원가입, 로그인 영역
app.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'public/index.html'))
})

function isLogin(req, res, next){
    if(req.user){
        next()
    }
    else{
        res.writeHead(200,{'Content-type':'text/html;charset=UTF-8'})
        res.write("<script>alert(`로그인을 해주세요 !!!`); location.href='/';</script>")
    }
}

app.get('/main',isLogin,function(req,res){
    res.sendFile(path.join(__dirname,'public/main.html'))
})

app.get('/map',isLogin,function(req, res){
    res.sendFile(path.join(__dirname,'public/map.html'))
})

app.get('/todolist',isLogin,function(req,res){
    res.sendFile(path.join(__dirname,'public/todolist.html'))
})

app.get('/translang',isLogin, function(req, res){
    res.sendFile(path.join(__dirname,'public/translang.html'))
})

app.get('/weather',isLogin,function(req, res){
    res.sendFile(path.join(__dirname,'public/weather.html'))
})

app.post('/register', function(req, res){
    console.log(req.body.userId)
    console.log(req.body.userPasswd)
    
    mysqlDB.query("SELECT * FROM 2023_pbl3.team1_member WHERE id = ?",[req.body.userId],function(err,result){
        if(result == 0){
            mysqlDB.query("INSERT INTO 2023_pbl3.team1_member values(?,?)",[req.body.userId,req.body.userPasswd],function(err,result){
                if(err){return console.log(err)}
                res.writeHead(200,{'Content-type':'text/html;charset=UTF-8'})
                res.write("<script>alert(`Welcome !!!`); location.href='/';</script>")
                console.log('회원정보 저장완료')
            })
        }
        else{
            res.writeHead(200,{'Content-type':'text/html;charset=UTF-8'})
            res.write("<script>alert('존재하는 아이디 입니다 !!!'); location.href='/';</script>")
            return console.log('이미 존재하는 아이디입니다.')
        }
    })
})

app.post('/login', passport.authenticate('local', { successRedirect: '/main',failureRedirect:'/?error="로그인 실패!!!"'}))

app.get('/logout',function(req,res){
    req.session.destroy(function(err){
        res.redirect('/')
    })
})

app.get('/pwchange',isLogin,function(req,res){
    res.sendFile(path.join(__dirname,'public/pwchange.html'))
})

app.get('/pwfind',function(req,res){
    res.sendFile(path.join(__dirname,'public/pwfind.html'))
})


app.post('/translate', function(req, res){
    var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
    var request = require('request');
    var options = {
       url: api_url,
       form: {'source':req.body.source, 'target':req.body.target, 'text':req.body.transData},
       headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };

    request.post(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
        //res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
        //res.end(body);
            //console.log(JSON.parse(body))
            res.send(JSON.parse(body))
        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
   });

})

app.post('/image', upload.single('textImage'),async function(req, res, next){
    console.log(req.file.path)
    
    let [result] = await client.textDetection(req.file.path)
    console.log(result.fullTextAnnotation.text)
    res.send(result.fullTextAnnotation.text)
})

app.post('/findpw',function(req,res){
    mysqlDB.query("SELECT * FROM 2023_pbl3.team1_member WHERE id = ?",[req.body.toEmail],function(err,result){
        if(err){return console.log(err)}
        if(result != 0){
            var json = JSON.stringify(result[0])
            var userinfo = JSON.parse(json)
            pw = userinfo.passwd
            console.log(pw)

            transporter.sendMail({
                from: process.env.GOOGLE_EMAIL,
                to: req.body.toEmail,
                subject: `${req.body.toEmail} 의 비밀번호`,
                text: `비밀번호는 ${pw} 입니다.` 
            })
        }
        
    })
})

app.post('/changepw',isLogin, function(req,res){
    if(req.body.changepw == req.body.checkpw){
        mysqlDB.query("SELECT * FROM 2023_pbl3.team1_member WHERE id = ? AND passwd = ?",[req.user.id,req.body.currentpw],function(err,result){
            if(err){return console.log(err)}
            if(result != 0){
                console.log("(비번바꾸기)계정 존재함")
                mysqlDB.query("UPDATE 2023_pbl3.team1_member SET passwd = ? WHERE id = ? AND passwd = ?",[req.body.changepw,req.user.id,req.body.currentpw],function(err,result){
                    if(err){return console.log(err)}
                    if(result != 0){
                        console.log('비밀번호 변경완료')
                    }
                })
            }
            else{
                console.log("(비번바꾸기)계정이 존재하지 않음")
            }
        })
    }
    else{
        console.log('새 비번과 확인 비번이 다름')
    } 
})

app.post('/cn',function(req,res){
    transporter.sendMail({
        from: process.env.GOOGLE_EMAIL,
        to: req.body.userEmail,
        subject: `${req.body.userEmail}의 인증번호입니다.`,
        text: `${req.body.randomNum} 인증번호입니다.` 
    })
    res.send("메일전송완료")
})
























































































