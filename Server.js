/**
 * Created by Jordi.Font on 02/05/2016.
 */
var uuid = require('uuid');



exports.CreateServer = function (options) {

    var deviceIDSesCom;

    if (options.uuid == undefined) {
        options.uuid = uuid.v1();
    }

    var configureHTTP = {
        path: options.HTTPServerPath,
        port: options.HTTPServerPort,
        logger: options.logger
    }
    if(options.deviceIDSes !== undefined){
        deviceIDSesCom = options.deviceIDSes;
    }else{deviceIDSesCom = 17;}

    if(options.HTTPServerPath !== undefined) {
        InitHTTP(configureHTTP, function (status) {
            if (status) {
                options.logger.info('HTTP Server UP')
            }
        });
    }

    var Server = require('node-ssdp').Server
        , server = new Server({
                logLevel: 'INFO',
                ssdpSig: 'SAT>IP Server, UPnP/1.0, SAT>IP/nodejs/linux/0.0.1\r\nDEVICEID.SES.COM:'+deviceIDSesCom,
                ssdpTtl: 2,
                adInterval: 20000,
                udn: options.uuid,
                ttl: 120,
                location: 'http://' + options.serverIP + ':'+options.HTTPServerPort+'/'+options.HTTPXMLPath

            });
        server.addUSN('upnp:rootdevice');
        server.addUSN('uuid:'+options.uuid);
        server.addUSN('urn:ses-com:device:SatIPServer:1');


    server.on('advertise-alive', function (headers) {
        options.logger.info('Advertise-alive');
        options.logger.debug('advertise-alive', headers);
        // Expire old devices from your cache.
        // Register advertising device somewhere (as designated in http headers heads)
    });

    server.on('advertise-bye', function (headers) {
        options.logger.info('Advertise-bye');
    });

    server.start('0.0.0.0');

    process.on('exit', function () {
        options.logger.info('Advertise-shutting down & stop listening');
        server.stop() // advertise shutting down and stop listening
    });
}

function InitHTTP(options, cb) {
    var http = require('http');
    var Router = require('node-simple-router');
    if (options.path == undefined || options.port == undefined) {
        options.logger.error('Configuration error');
        process.exit();
    } else {
        var router = Router({static_route: __dirname +'/' +options.path});
        var server = http.createServer(router);
        server.listen(options.port);

        options.logger.info("Init HTTP server on port: " + options.port);
        cb(true);
    }
}