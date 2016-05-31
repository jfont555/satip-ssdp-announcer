/**
 * Created by jfont on 17/05/16.
 */
var ssdp = require('./Server.js');
var stdio = require('stdio');
var logger = require('winston');

var option = {
    HTTPServerPath: undefined,
    HTTPXMLPath: "",
    HTTPServerPort: 3400,
    serverIP: myIP()
}
logger.remove(logger.transports.Console);

var  userOptions= stdio.getopt({
    'HTTPServerPath': {
        key: 'p',
        description: 'Path for HTTP Server (When is used).' +
        '                                         Default is the local project source.\n',
        args: 1
    },
    'PathXml': {
        key: 'x',
        description: 'Path to Xml file. Indicate the path to\n' +
        '                                the file must be set for local or extern file\n',
        args: 1,
        mandatory: true
    },
    'HTTPServerPort': {
        key: 'P',
        description: 'Port of the HTTP server.\n' +
        '                                It set the port for a extern server\n' +
        '                                or the local http server port. Default 3400\n',
        args: 1
    },
    'serverIP': {
        key: 't',
        description: 'URL pointing to description of your sevice.\n' +
        '                                Default is local IP.\n',
        args: 1
    },
    'DeviceIDSesCom': {
        key: 'd',
        description: 'Set DeviceIDSesCom, default is 17',
        args: 1
    },
    'UUID': {
        key: 'u',
        description: 'Set UUID, default is a time generated uuid',
        args: 1
    },
    'Verbose': {
        key: 'v',
        description: 'Set verbose it\'s a boolean',
        args: 0
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
if(userOptions.UUID !== undefined){
    option.uuid = userOptions.UUID;
}
if(userOptions.Verbose !== undefined){
    logger.add(logger.transports.Console, {colorize: true, level: 'debug'});
    logger.add(logger.transports.File, {colorize: true, level: 'debug', filename: 'logFile.log'});
}else{
    logger.add(logger.transports.Console, {colorize: true, level: 'info'});
}

option.logger = logger;

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
