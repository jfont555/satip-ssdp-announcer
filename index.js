/**
 * Created by jfont on 17/05/16.
 */
var ssdp = require('./Server.js');
var stdio = require('stdio');

var option = {
    HTTPServerPath: "",
    HTTPXMLPath: "",
    HTTPServerPort: 3400,
    serverIP: myIP()
}

var  userOptions= stdio.getopt({
    'HTTPServerPath': {
        key: 'p',
        description: 'Path fo HTTP Server',
        args: 1
    },
    'PathXml': {
        key: 'x',
        description: 'Path to Xml file',
        args: 1,
        mandatory: true
    },
    'HTTPServerPort': {
        key: 'P',
        description: 'Port to use for HTTP server. Default is 3400',
        args: 1
    },
    'serverIP': {
        key: 't',
        description: 'SAT>IP server. Default is local IP',
        args: 1
    },
    'DeviceIDSesCom': {
        key: 'd',
        description: 'Set DeviceIDSesCom, default is 17',
        args: 1
    }
});

if(userOptions.HTTPServerPath !== undefined){
    option.HTTPServerPath = userOptions.HTTPServerPath;
}
if(userOptions.PathXml !== undefined){
    option.HTTPXMLPath = userOptions.PathXml;
}
if(userOptions.HTTPServerPort !== undefined){
    option.HTTPServerPort = userOptions.HTTPServerPort;
}
if(userOptions.serverIP !== undefined){
    option.serverIP = userOptions.serverIP;
}
if(userOptions.DeviceIDSesCom !== undefined){
    option.deviceIDSes = userOptions.DeviceIDSesCom;
}
ssdp.CreateServer(option);

function myIP() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];

        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                return alias.address;
        }
    }

    return '0.0.0.0';
};
