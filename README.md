# satip-ssdp-announcer
Create ssdp server using node-ssdp for SAT>IP tools

## How to install: ##

From Source:

    git clone https://github.com/jfont555/satip-ssdp-announcer

Install dependencies with:

    npm install

Use it like other node tools

## How to use it: ##

**-p --HTTPServerPath:** Path for HTTP Server (When HTTP server is created). Default is the local project source.

**-x --PathXml:** Path to Xml file. Indicate the path to the file must be set for local or extern file.

**-P --HTTPServerPort:** Port of the HTTP server. It set the port for a extern server or the local http server port. Default is 3400.

**-t --serverIP:** URL pointing to description of your sevice. Default is local IP.

**-d --DeviceIDSesCom:** Set DeviceIDSesCom, default is 17

**-u --UUID:** Set UUID, default is a time generated uuid

## Examples ##

Using with HTTP server to publish the XML file (Server is local in port 3400, uuid is auto-generated (should be the same as XML) )

    sudo node index.js -d 1 -x DeviceDesc.xml -p /

Note that somethin must be passed as argument when using local server.

Using with XML in a exter server

    sudo ndoe index.js -d 1 -t 192.168.1.5 -P 9985 -x satip_server/desc.xml

## Motivate us!
Feel free to star the project and/or message me about it. It is always super-exciting to see real-world people using this , and it helps us to prioritize new features and bug fixes.

And if you find this useful, ensure that it is kept alive by donating:

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FVAPQNL7S9GRS)

**NOTE*+

If SAT>IP client extract the location from udp packet, it will assume that SAT>IP server is in the same location as this tool.


## TO-DO ##
