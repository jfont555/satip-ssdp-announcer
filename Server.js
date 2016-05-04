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
                /*
                 ssdpSig String SSDP signature. Default: node.js/NODE_VERSION UPnP/1.1 node-ssdp/PACKAGE_VERSION
                 ssdpIp String SSDP multicast group. Default: 239.255.255.250.
                 ssdpPort Number SSDP port. Default: 1900
                 ssdpTtl Number Multicast TTL. Default: 1
                 adInterval Number advertise event frequency (ms). Default: 10 sec.
                 unicastHost String IP address or hostname of server where SSDP service is running. This is used in HOST header. Default: 0.0.0.0.
                 location String URL pointing to description of your service, or a function which returns that URL
                 udn String Unique Device Name. Default: uuid:f40c2981-7329-40b7-8b04-27f187aecfb5.
                 description String Path to description file. Default: upnp/desc.php.
                 ttl Number Packet TTL. Default: 1800.
                 allowWildcards Boolean Accept wildcards (*) in serviceTypes of M-SEARCH packets, e.g. usn:Belkin:device:**. Default: false
                 */
                logLevel: 'INFO',
                ssdpSig: 'SAT>IP Server, UPnP/1.0, SAT>IP/nodejs/linux/0.0.1\r\nDEVICEID.SES.COM: 17',
//    ssdpSig:    'ALi TDS, UPnP/1.0, Portable SDK for UPnP devices/1.6.18',
                ssdpTtl: 2,
                adInterval: 20000,
                udn: options.uuid,
                ttl: 120,
//	description: '"http://schemas.upnp.org/upnp/1/0/"; ns=01',
                location: 'http://' + options.serverIP + ':'+options.HTTPServerPort+options.HTTPServerPath

            });
        server.addUSN('upnp:rootdevice');
        server.addUSN('urn:ses-com:device:SatIPServer:1');
        //server.addUSN('urn:schemas-upnp-org:service:ContentDirectory:1'); //Falta modificar
        //server.addUSN('urn:schemas-upnp-org:service:ConnectionManager:1'); //Falta modificar

        server.on('advertise-alive', function (headers) {
            // Expire old devices from your cache.
            // Register advertising device somewhere (as designated in http headers heads)
            console.log(headers);
        });

        server.on('advertise-bye', function (headers) {
            // Remove specified device from cache.
            console.log(headers);
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
        var router = Router({static_route: options.path});
        var server = http.createServer(router);
        server.listen(options.port);

        console.log("Init HTTP server on port: " + options.port);
        cb(true);
    }
}

