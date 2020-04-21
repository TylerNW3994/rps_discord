const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
var game = false;
var gameOn = false;
var challenged, cdInput;
var challenger, crInput;
var score = [0,0];
var choices =["R", "P", "S"];

client.on('message', msg => {
  if(msg.content === '!Challenge') {
	//Have only one game going on at one point.
	if(game){
		message.reply("A game is currently ongoing!  Wait until the current game is finished!");
		return;
	}
	
	//User only typed !Challenge but didn't specifiy who they wanted to challenge.
	if(!msg.mentions.users.size.first()){
		message.reply("You need to specifiy who to challenge.  Type out: !Challenge @<user you want to challenge>");
		return;
	}
	
    if(msg.mentions.users.size){
		challenged = msg.mentions.users.first();
		
		// Returns if the challenged user is offline.
		if(challenged.presence.status == "offline"){
			msg.reply(challenged + " is offline!");
			return;
		}
		
		//User exists and is online.  Game on!
		message.channel.send(message.author.toString() + " has challenged " + challenged + " to a Rock Paper Scissors Game!");
		message.channel.send("First to three wins!");
		message.channel.send(challenged ": type !GameOn to accept!");
		
		//Give the challenged user 30 seconds to respond.
		var interval = setInterval(function(){
			message.channel.send(challenged + " didn't accept the challenge in time! Game cancelled!").catch(console.error);
			game = false;
		}, 30000);
	} else
		msg.reply("Please mention a valid user!");
	
	//User is trying to respond to a challenge.
	if(msg.content === "!GameOn"){
		if(!game){
			message.reply("There isn't a game going on right now!  Type !Challenge to challenge another user!");
			return;
		}
		gameOn = true;
		if(message.author.toString() == challenged){
			
		}
		else if(message.author.toString() == challenger){
			
		}
		return;
	}
	
	// User is trying to input into a game
	if(msg.content === "R" || msg.content === "P" || msg.content === "S"){
		if(msg.length === 1){
			//There isn't a game.
			if(!game || !gameOn)
				message.reply("Looking to start a game?  Type !Challenge");
			
		}
	}
  }
});

client.login('token');