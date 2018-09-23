// initiates node depedencies   also I like 🅱 memes
const {promisify} = require('util');
const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");

let usrD = actF();
var timer = {};
var channelsToBeDeleted = [];
async function wtf () {
  fs.writeFileSync("Storage/userData.json", JSON.stringify(usrD), (err) => {if (err) console.error(err);})
}
function actF () {
  return JSON.parse(fs.readFileSync("Storage/userData.json"));
}

//this imports the code from all the differents files, call them in the order you would have wanted them to be written in one single file

// SERVER SPECIFIC stuff

eval(fs.readFileSync('key.js')+'');
// k  e  e  p     t  h  i  s     s  e  c  r  e  t 😱
bot.login(botKey);
console.log("✅\nkey.js ...."); console.log("✅\nutils.js ....");
// KIND OF GAME ENGINE
eval(fs.readFileSync('utils.js')+''); console.log("✅\nuserdatamanager.js ....");
eval(fs.readFileSync('userdatamanager.js')+''); console.log("✅\nquestsmanager.js ....");
eval(fs.readFileSync('questsmanager.js')+''); console.log("✅\nshopsmanager.js ....");
eval(fs.readFileSync('shopsmanager.js')+''); console.log("✅\nvehiclemanager.js ....");
eval(fs.readFileSync('vehiclemanager.js')+''); console.log("✅\ndialoguesmanager.js ....");
eval(fs.readFileSync('eventManager.js')+''); console.log("✅\neventManager.js ....");
eval(fs.readFileSync('dialoguesmanager.js')+''); console.log("✅\nconfiguration.js ....");



function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//triggered when the bot is ready
bot.on('ready', async function() {
    bot.user.setActivity("\"play\" in play channel");
    console.log("I   A  M     O  N  L  I  N  E    O  w  O");

    // INITIATING STUFF
    eval(fs.readFileSync('configuration.js')+''); console.log("✅\nemojis.js ....");
    eval(fs.readFileSync('emojis.js')+''); console.log("✅\nnpc.js ....");

    // KIND OF GAME'S ASSETS
    eval(fs.readFileSync('npc.js')+''); console.log("✅\nitems.js ....");
    console.log("test");
    eval(fs.readFileSync('items.js')+''); console.log("✅\nshops.js ....");
    eval(fs.readFileSync('shops.js')+''); console.log("✅\nquests.js ....");
    eval(fs.readFileSync('quests.js')+''); console.log("✅\ndialogues.js ....");
    eval(fs.readFileSync('dialogues.js')+''); console.log("✅\nevents.js ....");
    eval(fs.readFileSync('events.js')+''); console.log("✅\nanswers.js ....");
    eval(fs.readFileSync('answers.js')+''); console.log("✅\ninstances.js ....");
    eval(fs.readFileSync('instances.js')+''); console.log("✅\nvehicles.js ....");
    eval(fs.readFileSync('vehicles.js')+''); console.log("✅");
    console.log("hello");
    //dialogues tab is in two parts : corp: questions, rep: answers
    dg = {
      corp: corp,
      rep: rep
    }

    // here you can put anything to do when starting, me I decided to ask the bot to send some messages in a chennel called "logs"
    let guildy = bot.guilds.find("id", serverID);
    let chann = guildy.channels.find("name","logs");
    chann.send(prefix+"register");
    chann.send(numToEmoji(randInt(10000,90000)));
    channList = guildy.channels.array();
    for (var i in channList) {
      if (usrD[channList[i].topic]) {
        channelsToBeDeleted.push(channList[i]);
        channList[i].send("I'm back online @here\nTYPE \"play\" TO CONTINUE PLAYING");
      }
    }



    up = guildy.members.find("id", ownerID);
});



process.on('unhandledRejection', (reason, promise) => {
    console.warn('\n\n!!!\nUnhandled promise rejection:', promise, 'reason:', reason.stack || reason);
});



// OTHERS EVENTS //

// triggered when the user says prefix+play (if prefix is ! then !play). It then plays the user current dialogue
bot.on("message", async message => {
  let guildy = bot.guilds.find("id", serverID);
  if(message.content == prefix+"quit") {
    niceid = message.channel.topic;
    if (usrD[niceid]) {
      if (usrD[niceid].channel) {
        delete usrD[niceid].channel;
        message.channel.delete();
        upz = guildy.members.find("id", message.channel.topic);
        rolez = guildy.roles.find("name", notPlayingRole);
        upz.addRole(rolez);
        wtf();
      }
    }
    return;
  }
  if(message.content.startsWith("play") && (message.channel.id == "476687155545243649" || message.channel.topic == message.author.id)) {
    let userPerson = guildy.members.find("id", message.author.id);
    chann = guildy.channels.find("topic", message.author.id);
    if(chann != undefined) {
      if (usrD[message.author.id].channel) delete usrD[message.author.id].channel;
      chann.delete();
    }
    if (!usrD[userPerson.user.id].channel) {
      await createChannelForUser(userPerson);
    } else {
      chann = guildy.channels.find("id", usrD[userPerson.user.id].channel);
      chann.bulkDelete(2);
    }

    if (usrD[userPerson.user.id].answerMaterial) delete usrD[userPerson.user.id].answerMaterial;
    await wtf();
    playDialogue (userPerson, usrD[userPerson.user.id].currentDialogue);
  }
})
async function createChannelForUser (userPerson) {
  let guildy = bot.guilds.find("id", serverID);
  channelName = usrD[userPerson.user.id].name+" ";
  channelName = channelName.toLowerCase();
  channelName = channelName.replace(/ /g,"_");

  everyoneRole = guildy.roles.find("id", everyoneRoleId);

  await guildy.createChannel(channelName).then(async channel =>{
    await channel.overwritePermissions(userPerson.user, {'ADD_REACTIONS': true,'READ_MESSAGES': true,'SEND_MESSAGES': true,'READ_MESSAGE_HISTORY': true});
    await channel.overwritePermissions(everyoneRole, {'ADD_REACTIONS': false,'READ_MESSAGES': false,'SEND_MESSAGES': false,'READ_MESSAGE_HISTORY': false});
    await channel.setTopic(userPerson.user.id);
    usrD[userPerson.user.id].channel = channel.id;
    rolez = guildy.roles.find("name", notPlayingRole);
    userPerson.removeRole(rolez);
  });
}

// triggered when someone joins the server. Adds default values to most of it's database slot elements, such as default money and xp
bot.on("guildMemberAdd", member => {
  let guildy = bot.guilds.find("id", serverID);
  let pasta = member.user.id;
  if (!usrD[pasta]) usrD[pasta] = {};
  if (!usrD[pasta].name) usrD[pasta].name = member.user.username;
  if (!usrD[pasta].lvl) usrD[pasta].lvl = 1; //default level
  if (!usrD[pasta].xp) usrD[pasta].xp = 0; //default xp
  if (!usrD[pasta].questsPending) usrD[pasta].questsPending = [];
  if (!usrD[pasta].questsFinished) usrD[pasta].questsFinished = [];
  if (!usrD[pasta].currentDialogue) usrD[pasta].currentDialogue = "WelcomeToTheServ"; // default dialogue name
  if (!usrD[pasta].inventory) usrD[pasta].inventory = {}; //default inventory (empty)
  if (!usrD[pasta].nextDialogue) usrD[pasta].nextDialogue = "";
  if (!usrD[pasta].vehicle) usrD[pasta].vehicle = {
    name: "RLS_Stealth",
    hp: vehicles["RLS_Stealth"].hp,
  };
  member.setNickname(usrD[pasta].name+" |LVL "+usrD[pasta].lvl);
  wtf();
  roleLieux = guildy.roles.find("name", defaultLocationRole);
  roleJeu = guildy.roles.find("name", notPlayingRole);
  member.addRoles([roleLieux, roleJeu]);
})
