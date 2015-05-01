#微信点唱机
本项目是自娱自乐项目。用于实现家用微信点歌功能。     

工作模式：
微信端扫描公众号后，发送点歌歌曲，歌曲名称通过微信传给后台服务器。  
服务器将歌曲名称通过mqtt传送到家庭点歌机（目前是一个linux小主机），点歌机通过jing.fm API接口获取歌曲，在mplayer上面播放。  
特点：
 1. 支持微信点歌； （引用自Weixin Robot）   
 2. 支持自然语音点歌，如：发送“今天心情很好”，可得到应景歌曲。（技术引用自jing.fm）  
 3. 支持微信端，播放控制 下一曲，上一曲，暂停，停止，恢复等。    
不足：  
 播放器终端要求较高，如需要linux+nodejs+mplayer等。    

------

## 微信端依赖项目：微信公共帐号机器人(Weixin Robot)

[![Build Status](https://api.travis-ci.org/node-webot/weixin-robot.png?branch=master)](https://travis-ci.org/node-webot/weixin-robot) [![repo dependency](https://david-dm.org/node-webot/weixin-robot.png)](https://david-dm.org/node-webot/weixin-robot)

A node.js robot for wechat.

[微信公众平台](http://mp.weixin.qq.com/)提供的[开放信息接口](http://mp.weixin.qq.com/wiki/index.php?title=%E9%A6%96%E9%A1%B5)的自动回复系统。

`weixin-robot` 是 [webot](https://github.com/node-webot/webot) 和 [wechat-mp](https://github.com/node-webot/wechat-mp) 的
高级包装。`webot` 负责定义回复规则，`wechat-mp` 负责与微信服务器通信。


