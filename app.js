/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var fs = require('fs');

var wechat = require('wechat');
var mqttClient = require('mqtt');
var client = mqttClient.createClient(1883, 'weixin.yizhihe.cn'); //host与端口

var USER1='o4zcvt6tAxeeb2aAcSiEXenN3y2g';
var USER2='o4zcvt2xKKfBcKDIt3kEJke1PQMQ';

var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
console.log(process.env.PORT);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


/*
app.get('/weixin', function(req, res) {
  // var token = ’yourtoken';
  // var a = [token, req.query.timestamp, req.query.nonce];
  // a.sort()
  // TODO 未作来源验证

  res.end(req.query.echostr);
});
*/

var rpls = {
  'subscribe': [{
        title: '欢迎关注小夫子的微信测试平台',
        description: '这是一个微信端到硬件的控制演示工程，尝试输入 "前","后","左","右","停"来移动小车.',
        picurl: 'http://7xi5kc.com1.z0.glb.clouddn.com/logo-view.jpg',
        url: 'http://weixin.yizhihe.cn/'
  }]
};

var text_rpls = {
  '电话': '13602002741',
  '密码': 'greedisgood'
};

app.use(express.query());
app.use('/', wechat('fugreat', function (req, res, next) {
  // 微信输入信息都在req.weixin上
  var msg = req.weixin;
  var ret;

  console.dir(msg);

  /** 处理事件 */
  if (msg.MsgType == 'event') {

    /** 关注 */
    if (msg.Event == 'subscribe') {
      ret = rpls['subscribe'];

      fs.appendFile('msg.log', msg.FromUserName + " 订阅了帐号\n");
    }
  }
  else if (msg.MsgType == 'text') {
    fs.appendFile('msg.log', msg.FromUserName + " 说: " + msg.Content + "\n");
    //if ( msg.FromUserName == USER1|| msg.FromUserName ==  USER2 ) {
    IF（msg.Content =="前" ||msg.Content =="后" ||msg.Content =="左" ||msg.Content =="右" ||msg.Content =="停" ）{
      client.publish('test/weixin/topic0', 'ANS:'+ msg.Content); //通过mqtt推送消息
      ret = "你好" +  msg.FromUserName + "\r\n," + "收到指令："+msg.Content;
      }
    //}
    for (var key in text_rpls) {
      if (msg.Content.indexOf(key) >= 0) {
        ret = text_rpls[key];
        break;
      }
    }

    if (!ret) {
      ret = '你问的我不清楚哎, 请找到我的电话后给我打电话吧';
    }
  }
  else {
    fs.appendFile('msg.log', msg.FromUserName + " 发送了 " + msg.MsgType + " 类型的信息\n");

    ret = rpls['subscribe'];
  }

  /*
    // subscribe
    { ToUserName: 'gh_853f19b37122',
    FromUserName: 'o8wfhjsB1cHltZa8eGVn1AtQ2C9A',
    CreateTime: '1392434062',
    MsgType: 'event',
    Event: 'subscribe',
    EventKey: '' }

    // text
    { ToUserName: 'gh_853f19b37122',
    FromUserName: 'o8wfhjsB1cHltZa8eGVn1AtQ2C9A',
    CreateTime: '1392433952',
    MsgType: 'text',
    Content: 'Hi',
    MsgId: '5980458285880085495' }

    // unsubscribe
    { ToUserName: 'gh_853f19b37122',
    FromUserName: 'o8wfhjsB1cHltZa8eGVn1AtQ2C9A',
    CreateTime: '1392434012',
    MsgType: 'event',
    Event: 'unsubscribe',
    EventKey: '' }

    // image
    { ToUserName: 'gh_853f19b37122',
    FromUserName: 'o8wfhjsB1cHltZa8eGVn1AtQ2C9A',
    CreateTime: '1392434236',
    MsgType: 'image',
    PicUrl: 'http://mmbiz.qpic.cn/mmbiz/I7EpCK27vIlA4zwOv13lprMv0q4OIc7pRvVOobxwc9wmuibQxgXqHMiaD1g752hov3Fy7Pk3h2DaECzhGb3ibApSQ/0',
    MsgId: '5980459505650797575',
    MediaId: 'Sf4nmBUktek6OE2p8tWKV7i2usFwPfi3CRtiMbUm2wna9WgBulK9v_Szrcclby54' }
  */

  res.reply(ret);

}));



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


