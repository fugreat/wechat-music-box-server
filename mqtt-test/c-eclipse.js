var mqttClient = require('mqtt');
var client = mqttClient.createClient(1883, 'iot.eclipse.org'); //hos1t与端口
client.publish('jx', 'public topic 0 start');
for(var i=0;i<10000;i++){
client.publish('jx', 'hello world how are you'+i);
} 
