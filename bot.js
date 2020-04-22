const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
var game = false;
var gameOn = false;
var challenged, challengedName, cdInput ="NA";
const CHALLENGED = 0, CHALLENGER = 1;
var challenger, crInput ="NA";
var score = [0,0];
var choices = ["R", "P", "S"];
var ready = [false, false];
var interval2;

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
			challengedName = args[1];
			challenged = msg.mentions.users.first();
			
			// User can't challenge themselves.
			if(msg.author.toString().localeCompare(challenged) == 0){
				var num = Math.floor((Math.random() * 10) + 1);
				var other = "";
				switch(num){
					case 1: other = "knitting"; break;
					case 2: other = "learn to read"; break;
					case 3: other = "crying"; break;
					case 4: other = "learning to speak Klingon"; break;
					case 5: other = "cooking with Gordon Ramsey"; break;
					case 6: other = "talking to a girl for once"; break;
					case 7: other = "making Minecraft using only HTML"; break;
					case 8: other = "building a house exclusively out of Lincoln Logs"; break;
					case 9: other = "proving Santa doesn\'t exist"; break;
					default: other = "jumping into a random Zoom call"; break;
				}
				msg.reply(" you can't challenge yourself to a game of Rock Paper Scissors! Go try " + other + " instead!");
				return false;
			}
			
			// Returns if the challenged user is offline.
			if(challenged.presence.status == "offline"){
				msg.reply(challengedName + " is offline!");
				return;
			}
			challenger = msg.author.toString()
			//User exists and is online.  Game on!
			msg.channel.send(challenger + " has challenged " + challengedName + " to a Rock Paper Scissors Game!");
			msg.channel.send("First to three wins!");
			msg.channel.send(challengedName + ": type !GameOn to accept!  You have 30 seconds before the game is cancelled!");
			game = true;
			
			//Give the challenged user 30 seconds to respond.
			var interval = setTimeout(function(){
				if(!gameOn){
					msg.channel.send(challengedName + " didn\'t accept the challenge in time! Game cancelled!").catch(console.error);
					game = false;
				}
			}, 30000);
		} else
			msg.reply("Please mention a valid user!");
	}
	//User is trying to respond to a challenge.
	if(msg.content === "!GameOn"){
		if(!game){
			msg.reply("There isn\'t a game going on right now!  Type !Challenge to challenge another user!");
			return;
		}
		gameOn = true;
		msg.reply("GAME ON! It\'s " + challenger + " versus " + challengedName + "!");
		askForInput(msg);
		return;
	}
	
	//User is trying to ready up for next round
	if(msg.content === "!Ready"){
		if(msg.author.toString().localeCompare(challenged) == 0){
			ready[CHALLENGED] = true;
		}
		else if(msg.author.toString().localeCompare(challenger) == 0){
			ready[CHALLENGER] = true;
		}
		if(ready[CHALLENGED] == true && ready[CHALLENGER] == true){
			crInput = "NA";
			cdInput = "NA";
			askForInput(msg);
			ready[CHALLENGED] = false;
			ready[CHALLENGER] = false;
		}
	}
	
	// User is trying to input into a game
	if(msg.content === "R" || msg.content === "P" || msg.content === "S"){
		//There isn't a game.
		if(!game || !gameOn)
			msg.reply("Looking to start a game?  Type !Challenge");
		
		//if(msg.author.toString() == challenged){
		if(msg.author.toString().localeCompare(challenged) == 0){
			cdInput = msg.content;
		}
		//else if(msg.author.toString() == challenger){
		else if(msg.author.toString().localeCompare(challenger) == 0){
			crInput = msg.content;
		}
		//Determine winner
		if(crInput != "NA" && cdInput != "NA"){
			var choiceR = choices.indexOf(crInput);
			var choiceD = choices.indexOf(cdInput);
			msg.channel.send(challenger + " played " + crInput +", " + challengedName + " played " + cdInput);
			
			//Tie
			if(choiceR == choiceD){
				msg.channel.send("It\'s a tie!  Play again!");
			} else {
				
				//Challenged wins
				if (choiceD === (choiceR + 1) % choices.length){
					msg.channel.send(challengedName + " won this round!");
					score[CHALLENGED]++;
				//Challenger wins
				} else{
					msg.channel.send(challenger + " won this round!");
					score[CHALLENGER]++;
				}
				msg.channel.send("Score: " + score[CHALLENGED]+ " - " + score[CHALLENGER]);
				//Game Over
				if(score[CHALLENGED] === 3 || score[CHALLENGER] === 3){
					msg.channel.send("Game Over!");
					if(score[CHALLENGED] === 3)
						msg.channel.send(challengedName + " won the game!");
					else
						msg.channel.send(challenger + " won the game!");
					msg.channel.send("Can we get an F in the chat?");
					msg.channel.send("F");
					score[CHALLENGED] = 0;
					score[CHALLENGER] = 0;
					challenged = null;
					challenger = null;
					challengedName = "";
					game = false;
					gameOn = false;
					crInput = "NA";
					cdInput = "NA";
					return false;
				}
			}
			
			crInput = "NA";
			cdInput = "NA";
			//clearInterval(interval2);
			msg.channel.send("Both players, type !Ready when you are ready!");
		}
	}
});

function askForInput(msg){
	msg.channel.send(challenger + ", " + challengedName + "... choose your weapons...");
	msg.channel.send("Type R, P, or S when I say 3. Ready?");
	var counter = 1;
	var interval = setInterval(function(){
		msg.channel.send(counter);
		
		if(counter === 3){
			clearInterval(interval);
		}
		counter++;
	}, 1000);
	
	//TODO: Get interval working
	/*interval2 = setTimeout(function(){
		if(cdInput = "NA"){
			if(crInput = "NA")
				//Neither player responded in time
				msg.channel.send("Okay, neither of you responded in time, let\'s try again.");
			//Challenged responded but not challenger
			if(crInput != "NA"){
				msg.channel.send(challenger + " didn\'t respond!");
			}
		}
		//Challenger responded but not challenged
		else if(crInput = "NA"){
			msg.channel.send(challengedName + " didn\'t respond");
		}
	}, 4000);*/
}

client.login(process.env.TOKEN);