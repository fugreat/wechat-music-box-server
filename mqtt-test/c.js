var mqttClient = require('mqtt');
var client = mqttClient.createClient(1883, '127.0.0.1'); //host与端口
client.publish('test/public/topic0', 'public topic 0 start');
client.publish('test/private/topic1', 'private topic 1 start');
client.publish('test/private/topic2', 'private topic 2 start');
client.publish('test/public/topic0', 'hello world how are you');
for(var i=0;i<10000;i++){
client.publish('test/public/topic0', 'hello world how are you'+i);
} 
