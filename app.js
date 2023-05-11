// 引入 express 框架 -> 需 npm 安装
var express = require('express');
const { resolve } = require('path')
/**
 * 初始化框架,并将初始化后的函数给予 '当前页面'全局变量 app
 * 也就是说, app 是 express 
 */
var app = express();


/* 配置框架环境 S */
const ws = require('nodejs-websocket')
const createServer = () => {
  let server = ws.createServer(connection => {
    connection.on('text', function (result) {

      console.log('发送消息', result)
      if (result === 'message') {
        connection.send('收到')
      }
    })
    connection.on('connect', function (code) {
      console.log('开启连接', code)
    })
    connection.on('close', function (code) {
      console.log('关闭连接', code)
    })
    connection.on('error', function (code) {
      console.log('异常关闭', code)
    })
  }).listen(8001)
  return server
}

createServer();
app.get('/pushNotice', (req, res) => {
  ws.send('message coming');
  let fn = req.query  //fn='zl'
  let data = JSON.stringify({
    data: "hahaha"
  })
  res.end(data)
})


// 设置 public 为静态文件的存放文件夹
app.use('/public', express.static('public'));


app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", ['content-type','Authorization']);
  //跨域允许的请求方式 
  res.header("Access-Control-Allow-Methods", "*");
  if (req.method.toLowerCase() == 'options')
    res.send(200);  //让options尝试请求快速结束
  else
    next();
}
);

/* 配置框架环境 E */
var pathName = "./public/downloads";
app.get('/filename1', (req, res) => {
  let fn = req.query.callback  //fn='zl'
  let data = JSON.stringify({
    data: "hahaha"
  })
  res.end(fn + `(${data})`)
})
app.get('/refreshAppList', (req, res) => {
  const { name } = req.query;
  const exec = require('child_process').exec;
  
  let cmd = `cp /Users/arielyu/Work/SHRDS.Pad/platforms/android/app/build/outputs/apk/release/*.apk /Users/arielyu/Work/download_wp/file-finder/public/downloads/shrds.apk;
  cp /Users/arielyu/Work/HDIS-PAD/platforms/android/app/build/outputs/apk/release/app-release.apk /Users/arielyu/Work/download_wp/file-finder/public/downloads`;
  exec(cmd, function (error, stdout, stderr) {
    if (error) {
      console.log(error);
      res.end('error');
    }
    else {
      console.log('fetch ok…');
      res.end('success');

    }
  });

});
app.get('/deleteApk', (req, res) => {
  const { name } = req.query;
  const exec = require('child_process').exec;
  let cmd = `rm /Users/arielyu/Work/download_wp/file-finder/public/downloads/*`;
  exec(cmd, function (error, stdout, stderr) {
    if (error) {
      console.log(error);
      res.end('error');
    }
    else {
      res.end('success');

    }
  });

});
app.get('/titleList', (req, res) => {
  const data = [
    { title: "title1", content: "content1" },
    { title: "title2", content: "content2" },
    { title: "title3", content: "content3" },
  ]
  res.end(data)
})
app.get('/startnode', (req, res) => {
  let cmd = 'cd /Users/arielyu/Work/download_wp/file-finder;nodemon app.js';
  const exec = require('child_process').exec;

  exec(cmd, function (error, stdout, stderr) {
    if (error) {
      console.log(error);
      res.end('error');
    }
    else {
      res.end('success');
    }
  });
});

app.get('/downloadFile', (req, res) => {
  const { fileName } = req.query;
  var path = require("path");
  var fs = require("fs");
  const dirs = [];
  const fullname = pathName + "/" + fileName;
  console.log('fullname', fullname);
  fs.readFile(fullname, function (isErr, data) {
    try {
      if (isErr) {
        console.log(isErr);;
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件  
        'Content-Disposition': 'attachment; filename=' + fileName, //告诉浏览器这是一个需要下载的文件  
        'Access-Control-Expose-Headers':'Content-Disposition'
      });
      res.end(data);
    } catch (e) {
      res.status(501).send('下载错误啦');
    }
  })
});

app.get('/file', (req, res) => {
  const { fileName } = req.query;
  var path = require("path");
  var fs = require("fs");
  const dirs = [];
  const fullname = pathName + "/" + fileName;
  console.log('fullname', fullname);
  fs.readFile(fullname, function (isErr, data) {
    try {
      if (isErr) {
        console.log(isErr);;
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件  
        'Content-Disposition': 'attachment; filename=' + fileName, //告诉浏览器这是一个需要下载的文件  
      });
      res.end(data);
    } catch (e) {
      res.status(501).send('下载错误啦');
    }
  })
});

app.get('/filename', (req, res) => {
  var path = require("path");
  var fs = require("fs");
  const dirs = [];
  console.log('pathName', pathName);
  try {

    fs.readdir(pathName, function (err, files) {
      console.log(files);
      files.map((file, index) => {

        fs.stat(pathName + "/" + file, function (err, stats) {
          if (err) throw err;

          if (stats.isFile()) {
            dirs.push({ ...stats, fileName: file });
          } else if (stats.isDirectory()) {
            console.log("%s is a directory", stats);
          }
          if (index === files.length - 1) {
            res.status(200).send(dirs);
          }
        });

      });
    });
  } catch (e) {
    res.status(500).end('wrong');
  }
});
app.get('/copyData', (req, res) => {

  try {
    res.status(200).end('<p>copy</p>')
  } catch (e) {
    res.status(500).end('wrong');
  }
});

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Node.JS 服务器已启动，访问地址： http://%s:%s", host, port)

})