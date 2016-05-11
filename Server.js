/**
 * Created by Jordi.Font on 02/05/2016.
 */
var uuid = require('uuid');



exports.CreateServer = function (options) {

    if (options.uuid == undefined) {
        options.uuid = uuid.v1();
    }

    var configureHTTP = {
        path: options.HTTPServerPath,
        port: options.HTTPServerPort
    }

    InitHTTP(configureHTTP, function (status) {
        if (status) {
            console.log('HTTP Server UP')
        }

        var Server = require('node-ssdp').Server // Create new server command
            , server = new Server({
                logLevel: 'INFO',
                ssdpSig: 'SAT>IP Server, UPnP/1.0, SAT>IP/nodejs/linux/0.0.1\r\nDEVICEID.SES.COM: 17',
                ssdpTtl: 2,
                adInterval: 20000,
                udn: options.uuid,
                ttl: 120,
                location: 'http://' + options.serverIP + ':'+options.HTTPServerPort+'/'+options.HTTPXMLPath

            });
        server.addUSN('upnp:rootdevice');
        server.addUSN('urn:ses-com:device:SatIPServer:1');
        //server.addUSN('urn:schemas-upnp-org:service:ContentDirectory:1'); //Falta modificar
        //server.addUSN('urn:schemas-upnp-org:service:ConnectionManager:1'); //Falta modificar

        server.on('advertise-alive', function (headers) {
            // Expire old devices from your cache.
            // Register advertising device somewhere (as designated in http headers heads)
            //console.log(headers);
        });

        server.on('advertise-bye', function (headers) {
            // Remove specified device from cache.
            //console.log(headers);
        });

        // start the server
        server.start();

        process.on('exit', function () {
            server.stop() // advertise shutting down and stop listening
        })

        server.start('0.0.0.0');
    });
}

function InitHTTP(options, cb) {
    var http = require('http');
    var Router = require('node-simple-router');
    if (options.path == undefined || options.port == undefined) {
        console.log('Configuration error');
        process.exit();
    } else {
        var router = Router({static_route: __dirname +'/' +options.path});
        var server = http.createServer(router);
        server.listen(options.port);

        console.log("Init HTTP server on port: " + options.port);
        cb(true);
    }
}

