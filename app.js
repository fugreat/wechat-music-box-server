/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var pinyin = require('pinyin');
var fs = require('fs');

var wechat = require('wechat');
var mqttClient = require('mqtt');
//var client = mqttClient.createClient(1883, 'weixin.yizhihe.cn'); //host与端口
var client = mqttClient.createClient(1883, 'iot.eclipse.org'); //host与端口
client.subscribe('jx'); 
client.on('message', function(topic, message){ console.log(topic, message); });


var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
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
        url: 'http://www.baidu.com/'
  }]
};

var text_rpls = {
  '电话': '13602002741',
  '密码': 'greedisgood'
};

function motoRun(action)
{
    var msg_to_send = null;
    var py = pinyin(action).toString();
	console.log(py);
	console.log(pinyin("左".toString().toString()));
    if (action == "前" || action == "go" || action.match("前") || py.match("qián")) {
        msg_to_send = 'go';
    }
    if (action == "后" || action == "back" || action.match("后") || py.match("hòu")) {
        msg_to_send = 'back';
    }
    if (action == "左" || action == "left" || action.match("左") || py.mchat("ǒ")) {
        msg_to_send = 'left';
    }
    if (action == "右" || action == "right" || action.match("右") || py.match("yòu")) {
        msg_to_send = 'right';
    }
    if (action == "停" || action == "stop" || action.match("停") || py.match("tíng")) {
        msg_to_send = 'stop';
    }
    return msg_to_send;

}
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

      var tmp1 = motoRun(msg.Content);
      if (tmp1) {
          client.publish('jx', tmp1); //通过mqtt推送消息
          ret = "Hi" + msg.FromUserName + "\r\n," + "收到指令：" + msg.Content;
      }

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
  else if (msg.MsgType == 'voice'){
      var tmp1 = motoRun(msg.Recognition);
      if (tmp1) {
          client.publish('jx', tmp1); //通过mqtt推送消息
          ret="好的，收到消息:" + msg.Recognition + "执行动作" + tmp1;
      }
  }
  else {
    fs.appendFile('msg.log', msg.FromUserName + " 发送了 " + msg.MsgType + " 类型的信息\n");

    ret = rpls['subscribe'];
  }

  res.reply(ret);

}));



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

