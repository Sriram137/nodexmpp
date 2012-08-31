var async=require('async');
var auth;
var program = require('commander');
var net=require('net');
var tls=require('tls');
var clientSocket = new net.Socket();
var clearTextStream;
var PORT = 5222
var HOST = 'talk.google.com'
var xml2js = require('xml2js');
var parser = new xml2js.Parser({mergeAttrs:true});
var ulti = require('util');
var roster='';
var rosterFlag=false;

getCredentials();

function getCredentials(){
	program.prompt('Username : ', function(username){
		program.password('Password : ', function(password){
			auth = new Buffer('\u0000'+username+'\u0000'+password).toString('base64');
			openConnection();
		});	
	});
}

function openConnection(){
	clientSocket.connect(PORT,HOST,function(){
		console.log("CONNECTED TO "+HOST+":"+PORT);
		sendXMLVersion();
	});
}


function sendXMLVersion(){
	clientSocket.write("<?xml version='1.0'?>",sendStreamInitiator);
}

function sendStreamInitiator(){
	clientSocket.write("<stream:stream to='gmail.com' xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams' version='1.0'>",sendTLSInitiator);
}

function sendTLSInitiator(){
	clientSocket.write("<starttls xmlns='urn:ietf:params:xml:ns:xmpp-tls'/>",upgradeSocketToTLS);
}


var options = {
	socket: clientSocket
}

function upgradeSocketToTLS(){    
	setTimeout(function(){
		clearTextStream = tls.connect(PORT,options,function(){
			console.log('CONNECTION SECURED');
			sendStreamInitiatorAfterTLS();
		});
	},300);
}

function sendStreamInitiatorAfterTLS(){
	clearTextStream.write("<stream:stream to='gmail.com' xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams' version='1.0'>",sendAuthenticationDetails);
}

function sendAuthenticationDetails(){
	clearTextStream.write("<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='PLAIN'>"+auth+"</auth>",sendStreamInitiatorAfterAuthSuccess);
}

function sendStreamInitiatorAfterAuthSuccess(){
	clearTextStream.write("<stream:stream to='gmail.com' xml:lang='en' version='1.0' xmlns:stream='http://etherx.jabber.org/streams' xmlns='jabber:client'>",sendBindResourceRequest);
	console.log("Login success.");
}

function sendBindResourceRequest(){
	clearTextStream.write("<iq type='set' id='bind_1'><bind xmlns='urn:ietf:params:xml:ns:xmpp-bind'/></iq>",sendCreateSession);
}


function sendCreateSession(){
	clearTextStream.write("<iq to='gmail.com' type='set' id='sess_1'><session xmlns='urn:ietf:params:xml:ns:xmpp-session'/></iq>",sendRequestForRoster);
}


function sendRequestForRoster(){
	clearTextStream.on('data',function(data){
		if(data.toString().indexOf("<iq to")!=-1 && data.toString().indexOf("<query")!=-1)
			rosterFlag=true;
		if(rosterFlag==true)
			roster+=data.toString();
		if(data.toString().indexOf("</iq>")!=-1 && rosterFlag==true){
			rosterFlag=false;
			sendGroupMessage();
		}
	});
	clearTextStream.write("<iq type='get'><query xmlns='jabber:iq:roster'/></iq>");
}


function sendGroupMessage(){
	program.prompt('Group Name : ', function(group){
		program.prompt('Message : ', function(message){
			processRoster(roster);
			console.log(group);
			console.log('---------------');
			for(var i in roster[group]){
				var friend=roster[group][i];
				sendMessage(message,friend.jid);
			}
			console.log('---------------');
		});	
	});
}

function sendMessage(msg,jid){
	clearTextStream.write("<message to='"+jid+"' type='chat' xml:lang='en'><body>"+msg+"</body></message>");
}

function processRoster(data){
	roster={};
	parser.parseString(data,function(err,result){
		var friends = result.query.item;
		for(var i in friends){
			if(friends[i].group!=undefined){
				if(roster[friends[i].group]==undefined)
					roster[friends[i].group]=[friends[i]];
				else
					roster[friends[i].group].push(friends[i]);
			}
			else{
				if(roster['Others']==undefined)
					roster['Others']=[friends[i]];
				else
					roster['Others'].push(friends[i]);
			}
		}
//		printFriendsGroupwise();
	});
}

function printFriendsGroupwise(){
	for(var group in roster){
		console.log(group);
		console.log('---------------');
		for(var i in roster[group]){
			var friend=roster[group][i];
			if(friend.name==undefined)
				console.log(friend.jid);
			else			
				console.log(friend.name);
		}
		console.log('---------------');
	}
}
