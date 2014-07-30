var mqttClient = require('mqtt');
//var client = mqttClient.createClient(1883, 'eclipse.mqttbridge.com'); 
var client = mqttClient.createClient(1883, 'iot.eclipse.org'); 
client.subscribe('jx'); 
client.on('message', function(topic, message){ console.log(topic, message); });
