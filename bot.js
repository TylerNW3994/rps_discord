const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
var game = false;
var gameOn = false;
var challenged, challengedName, cdInput ="NA";
var challenger, crInput ="NA";
var score = [0,0];
var choices =["R", "P", "S"];

client.on('message', msg => {
	args = msg.content.split(" ");
	if(args[0] === '!Challenge') {
		//Have only one game going on at one point.
		if(game){
			msg.reply("A game is currently ongoing!  Wait until the current game is finished!");
			return;
		}
		
		//User only typed !Challenge but didn't specifiy who they wanted to challenge.
		if(!msg.mentions.users.first()){
			msg.reply("You need to specifiy who to challenge.  Type out: !Challenge @<user you want to challenge>");
			return;
		}
		
		if(msg.mentions.users.size){
			challengedName = args[0];
			challenged = msg.mentions.users.first();
			
			// Returns if the challenged user is offline.
			if(challenged.presence.status == "offline"){
				msg.reply(challengedName + " is offline!");
				return;
			}
			
			//User exists and is online.  Game on!
			msg.channel.send(msg.author.toString() + " has challenged " + challengedName + " to a Rock Paper Scissors Game!");
			msg.channel.send("First to three wins!");
			msg.channel.send(challengedName + ": type !GameOn to accept!  You have 30 seconds before the game is cancelled!");
			
			//Give the challenged user 30 seconds to respond.
			var interval = setTimeout(function(){
				msg.channel.send(challengedName + " didn't accept the challenge in time! Game cancelled!").catch(console.error);
				game = false;
			}, 30000);
		} else
			msg.reply("Please mention a valid user!");
	}
	//User is trying to respond to a challenge.
	if(msg.content === "!GameOn"){
		if(!game){
			msg.reply("There isn't a game going on right now!  Type !Challenge to challenge another user!");
			return;
		}
		gameOn = true;
		
		return;
	}
	
	// User is trying to input into a game
	if(msg.content === "R" || msg.content === "P" || msg.content === "S"){
		if(msg.length === 1){
			//There isn't a game.
			if(!game || !gameOn)
				msg.reply("Looking to start a game?  Type !Challenge");
		
			if(msg.author.toString() == challenged){
				cdInput = msg.content;
			}
			else if(msg.author.toString() == challenger){
				crInput = msg.content;
			}
			//Determine winner
			if(crInput != "NA" && cdInput != "NA"){
				var choiceR = choices.indexOf(crInput);
				var choiceD = choices.indexOf(cdInput);
				msg.channel.send(challenger + " played " + crInput +", " + challengedName + " played " + cdInput);
				//Tie
				if(choiceR == choiceD){
					msg.channel.send("It's a tie!  Play again!");
					crInput = "NA";
					cdInput = "NA";
				}
				//Not a tie
				var mod = (choiceR - choiceD) % choices.length;
				mod = mod < 0 ? mod + (choiceR - choiceD) : mod;
				if (mod < choices.length /2){
					msg.channel.send(challenger + " won this round!");
					score[0]++;
				} else{
					msg.channel.send(challengedName + " won this round!");
					score[1]++;
				}
				//Game Over
				if(score[0] === 3 || score[1] === 3){
					msg.channel.send("Game Over!");
					if(score[0] === 3)
						msg.channel.send(challenger + " won the game!");
					else
						msg.channel.send(challengedName + " won the game!");
					score[0] = 0;
					score[1] = 0;
					game = false;
					gameOn = false;
				}
			}
		}
	}
});

client.login('NzAyMjAxNDY0MzEwOTg4ODMw.Xp8-vQ.GPWeNVVdl_0tu_uebScUj0mH89M');