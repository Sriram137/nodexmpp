net = require "net"
tls = require "tls"
crypto = require "crypto"
xml = require "xml2js"


data = ""
socket = net.connect 5222,"talk.google.com"
reattachListeners = (socket)->
    socket.removeAllListeners 'data'
    socket.removeAllListeners 'error'
    socket.removeAllListeners 'connect'
    socket.on 'data', (data) ->  console.log data.toString() + "Done\n"
    socket.on 'error', (data)->  console.log data.toString() + "BDKF\n"
    socket.on 'connect', -> console.log "start"

reattachListeners socket
# Open Stream
step1 = -> '<stream:stream from="sriram137@gmail.com" to="harish7000@gmail.com" xml:lang="en" version="1.0" xmlns:stream="http://etherx.jabber.org/streams" xmlns="jabber:client">'
# Start TLS
step2 = -> '<starttls xmlns="urn:ietf:params:xml:ns:xmpp-tls"/>'
# Reopen Stream
step3 = -> '<stream:stream from="sriram137@gmail.com" to="harish7000@gmail.com" xml:lang="en" version="1.0" xmlns:stream="http://etherx.jabber.org/streams" xmlns="jabber:client">'
# Authentication
step4 = -> "<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='X-GOOGLE-TOKEN'>AHNyaXJhbTEzN0BnbWFpbC5jb20ARFFBQUFMc0FBQURCWWFnejRNR2FlS05aRjV3TmEwbUVfNFRIV011eFcyQm5Qek9YRDlWMFhYcTV4N3hEMlBQY3BseEMtUUVEMmxuekdLcE9rWmtXNC1wVDB0V3Q0NVd1OERXOTlLU1FkMkh4Tk5hZVRjeTJvRU1KVnA1SWVISmRmY1NKZ2M2VEJ3OWxNZ3d0QnhoekJjelM3Z0ZULXBqbDVtWDY1b0U0cU1EWWtuUDZ0a0l3ZDRrUmZ3UjY4TWVHQUMyTjl0NGowSjFrUjJyS202LUxrY0JRTTRnby1QTWtjU3VuX3BYbXI5WEpLZFEwY1N2WkV4RzhQeDBsUUNhZlFPYktxTld5REEw</auth>"
# Reopen Stream
step5 = -> '<stream:stream from="sriram137@gmail.com" to="harish7000@gmail.com" xml:lang="en" version="1.0" xmlns:stream="http://etherx.jabber.org/streams" xmlns="jabber:client">'
# Resource Binding
step6 = -> '<iq id="32cv2334" type="set"><bind xmlns="urn:ietf:params:xml:ns:xmpp-bind"><resource>NOOBCLIENT</resource></bind></iq>'
# Get Roster
step7 = -> '<iq type="get" id="aab7a"><query xmlns="jabber:iq:roster"/></iq>'
# Finally.... The message
step8 = -> '<message type="chat" to="harish.7000@gmail.com"><body>FROMAPPoer</body><active xmlns="http://jabber.org/protocol/chatstates"/></message>'
# Closing stream
step9 = -> '</stream>'
socket.write step1(), ->
    console.log "###############################1"
    socket.write step2(), ->
        console.log "###############################2"
        setTimeout ->
            sock = tls.connect  {socket:socket}
            reattachListeners sock
            setTimeout ->
                sock.write step3()
                console.log "###############################3"
                setTimeout ->
                    sock.write step4()
                    console.log "###############################4"
                    setTimeout ->
                        sock.write step5()
                        console.log "###############################5"
                        setTimeout ->
                            sock.write step6()
                            console.log "###############################6"
                            setTimeout ->
                                sock.write step7()
                                console.log "###############################7"
                                setTimeout ->
                                    sock.write step8()
                                    console.log "###############################8"
                                    setTimeout ->
                                        sock.write step9()
                                        console.log "###############################9"
                                    ,4400
                                ,4300
                            ,4300
                        ,4200
                    ,4100
                ,4000
            ,3000
        ,2000
