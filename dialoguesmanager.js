// DIALOGUE MANAGER // DON'T TOUCH !!!!

//plays a dialogue, member = person to display dialogue to; dname = key/id of the dialogue in the dg.corp tab containing all the dialogues
async function playDialogue (member, dname) {
    usrD[member.user.id].currentDialogue = dname;
    usrD[member.user.id].nextDialogue = "";
    wtf();
    var inthebed = new Discord.RichEmbed();  // initiates the rich message (= "embed message" but I call it "in the bed" because this is funny)
    var dial = dg.corp[dname];
    inthebed.setTitle(dial.npc.name); // embed title = name of the npc/thing speaking
    inthebed.setColor(0x000000);
    descr = await dial.texte(member, usrD[member.user.id].answerMaterial);
    inthebed.setDescription(textSeparator+"\n"+descr+"\n"+textSeparator); // creates a dialogue box within the embed which contains theDialogue.texte function output
    if (descr == "") {
      inthebed.setDescription("");
    }
    inthebed.setFooter(dial.footer(member)); // sets the footer text with theDialogue.footer() function output
    inthebed.setThumbnail(dial.npc.picture); // sets the thumbnail as the speaking npc's picture
    if (dial.thumb != undefined) inthebed.setThumbnail(dial.thumb);
    if (dial.image != undefined) inthebed.setImage(dial.image(member));
    console.log(inthebed.thumbnail);
    var ans = dial.answers(member);
    var emoteList = [];
    var ansList = [];

    //  vvv adds answers list below the dialogue box

    for (var i=1; i <= ans[0] ; i++) {
      emoteList.push(dg.rep[ans[i]].emote(member));
      ansList.push(ans[i]);
      inthebed.addField("  "+emoteList[i-1]+" | "+dg.rep[ansList[i-1]].texte(member)+"",""+textSeparator+"",);
    }
    let guildy = bot.guilds.find("id", serverID);
    channel = guildy.channels.find("id", usrD[member.user.id].channel);
    bigbug = false;
    const filter = m => {
      if(m.author.id == botID) bigbug = true;
      return m.author.id == botID;
    }
    await channel.awaitMessages(filter, { max: 1, time: 1000});
    if (bigbug == true) {
      return;
    }
    if(channel.type != "dm") {
      await channel.bulkDelete(2);
    }
    channel.send(inthebed)
    .then(async message => {

      for (var i=1; i <= ans[0] ; i++) {
        await message.react(emoteList[i-1]);
      }

      const emojiFilter = (reaction, user) => {
        condition = emoteList.indexOf(reaction.emoji.name) != -1 && user.id === member.user.id;
        return condition;
      };
      col = await message.awaitReactions(emojiFilter, { max: 1, time: 60000*5, errors: ['time']})
        .catch(()=>{
        });

      colv = col.array();
      for (var i in colv) {
        j = emoteList.indexOf(colv[i]._emoji.name);
        await message.delete().catch();
        exit = await dg.rep[ans[j+1]].exit(member);
        await playDialogue(member, exit);
      }

    }).catch();
}

async function notify(up, texte, color, image = "", divider = "📨", answers = ["🆗"], autoDelete = true, reaCount=1, reaDelay=60000, edit = false, message, publique = false, channelId = "473228478834278450") {
    let guildy = bot.guilds.find("id", serverID);
    chann = guildy.channels.find("id", channelId);
    if (up == "") {
      up = guildy.members.find("id", ownerID);
    }
    var inthebed = new Discord.RichEmbed();
    inthebed.setTitle("➖➖➖➖➖➖➖➖➖➖"+divider+"➖");
    inthebed.setColor(color);
    inthebed.setDescription(texte);
    if (typeof image == "string") {
      if (image != "") inthebed.setImage(image);
    } else {
      if (image[0] != "") inthebed.setImage(image[0]);
      if (image[1] != "") inthebed.setThumbnail(image[1]);
    }
    emojiAns = "";
    mess = "";

    if (edit == false) {
      if (publique == false) {
        let guildy = bot.guilds.find("id", serverID);
        if (usrD[up.user.id].channel) {
          channel = guildy.channels.find("id", usrD[up.user.id].channel);
        } else {
          channel = await up.createDM();
        }

        return await emotiveAns(up, await channel.send(inthebed), answers, autoDelete, reaCount, reaDelay, true);

      } else if (publique == true) {

        return await emotiveAns(up, await chann.send(inthebed), answers, autoDelete, reaCount, reaDelay, false);

      }
    } else {
      if (message.channel.type != "dm") {
        await message.clearReactions();
      }

      return await emotiveAns(up, await message.edit(inthebed), answers, autoDelete, reaCount, reaDelay, false);

    }
}

async function emotiveAns (up, msg, answers, autoDelete, reaCount = 1, reaDelay = 60000, strictUser = true) {
    let guildy = bot.guilds.find("id", serverID);
    msg.delete(reaDelay+1000);
    if (answers != "nope") {
      for (var i in answers) {
        await msg.react(answers[i]).catch(console.log());
      }
      const emojiFilter = (reaction, user) => {
        condition = strictUser ? answers.indexOf(reaction.emoji.name) != -1 && user.id === up.user.id : answers.indexOf(reaction.emoji.name) != -1 && user.id != botID;
        return condition;
      };

      col = await msg.awaitReactions(emojiFilter, { max: reaCount, time: reaDelay}).catch(col => {
        return ["🏠",msg];
      });

      if (autoDelete == true) {
        msg.delete();
      }

      if (col.array()[0] != undefined) {
        if (reaCount == 1) {
          emojiAns = col.array()[0]._emoji.name;
        } else {
          userAns = [];
          emojiAns = [];
          for (var i in col.array()) {
            for (var j=0; j<col.array()[i].count; j++) {
              if (col.array()[i].users.array()[j].id != botID) {
                emojiAns.push(col.array()[i]._emoji.name);
                userAns.push(guildy.members.find("id",col.array()[i].users.array()[j].id));
              }
            }
          }
          return [emojiAns,userAns,msg];
        }
      } else {
        emojiAns = '🏠';
      }
      return [emojiAns,msg];
    }
    return msg;
}

// triggered when the user says something to the bot and checks if it could be the answer to the last dialogue (yes, answers are not only based on reaction emojis, see comments in /dialogues.js)
async function AmError(up, texte) {
  await notify(up, texte, 0xFF0000);
  wtf();
  await playDialogue (up, usrD[up.user.id].currentDialogue);
}

bot.on("message", async message => {
  if (!message.content.startsWith(prefix) && message.author.id != botID && usrD[message.author.id].nextDialogue != "" && message.channel.topic == message.member.id) {
    let args = message.content.slice(0).trim().match(/(?:[^\s"]+|"[^"]*")+/g);
    if (args == []) return;
    let guildy = bot.guilds.find("id", serverID);
    var userPerson = guildy.members.find("id", message.author.id);
    let am = JSON.parse(JSON.stringify(usrD[userPerson.user.id].answerMaterial));
    var regex = /^\d+$/;
    usrD[userPerson.user.id].answerMaterial = [];
    if (!am) return "We are really sorry but there has been an issue, please type play again";
    for(var i=0; i<= am[0]-1; i++) {
      //emptyness verification
      if(!args[i] && am[i+1] == "num") args[i] = "0";
      if(!args[i] && am[i+1] == "string") args[i] = "default";
      //type verification
      if(!regex.test(args[i]) && am[i+1] == "num") {
        await AmError(userPerson, "❌Your argument n°"+(i+1)+" should only contain numbers");
        return;
      }
      //do it
      if(am[i+1] == "num") usrD[userPerson.user.id].answerMaterial.push(parseInt(args[i]));
      if(am[i+1] == "string") usrD[userPerson.user.id].answerMaterial.push(args[i]);
    }
    wtf();
    await message.channel.bulkDelete(1);
    await playDialogue (userPerson, usrD[userPerson.user.id].nextDialogue);
  }
})
