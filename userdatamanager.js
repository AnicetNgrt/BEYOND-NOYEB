function userCurrentLocation(up, syn) {
  usrRoles = up.roles.array();
  for (var i in usrRoles) {
    if (usrRoles[i].name.startsWith(syn)) {
      var roleName = usrRoles[i].name;
    }
  }
  for (var i in instances) {
    if (instances[i].roleName == roleName) return i;
  }
}

// takes user and npc and checks if the npc has a quest for the user
function npcHasQuest(up, npc){
  for (var i in npc.quests) {
    if (quests[npc.quests[i]].requirement(up) == true) return true;
  }
}

// returns a list of all the answers linking to the first dialogue of all available quests from one npc for the user. (called every time you say hello to a npc)
function npcQuests(up, npc){
  var questAns = [0];
  for (var i in npc.quests) {
    if (quests[npc.quests[i]].requirement(up)) {
      questAns.push(quests[npc.quests[i]].startAns)
      questAns[0] += 1;
    }
  }
  return questAns;
}


async function giveItem(up, itemName, quantity = 1, words = "") {
    quantity = Math.abs(quantity);
    if (!usrD[up.user.id].inventory[itemName]) usrD[up.user.id].inventory[itemName] = {};
    usrD[up.user.id].inventory[itemName].name = itemName;
    usrD[up.user.id].inventory[itemName].quantity = quantity;
    if (words != "") words = "\n```\n"+words+"\n```";
    await notify(up, "**✅ You have earned "+quantity+" "+items[itemName].name+".**"+words, 0xBADB3D);
    wtf();
    return;
}

async function trashItem(up, itemName, quantity = 1, words = "") {
    quantity = Math.abs(quantity);
    if (!usrD[up.user.id].inventory[itemName]) usrD[up.user.id].inventory[itemName] = {};
    usrD[up.user.id].inventory[itemName].quantity -= quantity;
    if (words != "") words = "\n```\n"+words+"\n```";
    if (usrD[up.user.id].inventory[itemName].quantity <= 0) delete usrD[up.user.id].inventory[itemName];
    await notify(up, "**❌ You have lost "+quantity+" "+items[itemName].name+"**."+words, 0xE88876);
    wtf();
}

async function giveXp(up, quantity = 1, words = "") {
    quantity = Math.abs(quantity);
    usrD[up.user.id].xp += quantity;
    if (words != "") words = "\n```\n"+words+"\n```";
    var palier = (usrD[up.user.id].lvl*100)+(5*(usrD[up.user.id].lvl*usrD[up.user.id].lvl));  // xp needed to be earned in order to step one level further.
    var nextLvlXp = palier - usrD[up.user.id].xp < 0 ? 0 : palier - usrD[up.user.id].xp;
    await notify(up, "**📚 You have earned "+quantity+" xp !**\n💹 Next level: "+nextLvlXp+" xp\n"+words, 0xBADB3D);
    var palierStep = 0;
    while (usrD[up.user.id].xp > palier) {
      palierStep++;
      usrD[up.user.id].lvl += 1;
      palier = (usrD[up.user.id].lvl*100)+(5*(usrD[up.user.id].lvl*usrD[up.user.id].lvl));
      up.setNickname(usrD[up.user.id].name+" |LVL "+usrD[up.user.id].lvl);
    }
    if(palierStep > 0) {
      await notify(up, "**🏅 You are now level "+usrD[up.user.id].lvl+" !**", 0xFFCD19);
      usrD[up.user.id].xp = 0;
    }
    wtf();
}



// give item command
bot.on("message", async message => {
  if (message.content.startsWith(prefix+"giveItem") && message.member.roles.find("name", devRole)) {
      let cmember = message.mentions.members.first();
      if (cmember == null) {
        await notify(message.member, "You need to mention someone !\n```markdown\n"+prefix+"giveItem itemKey quantity message @userMention \n```", 0xFF0000);
        return;
      }
      let args = message.content.slice(10).trim().match(/(?:[^\s"]+|"[^"]*")+/g);
      args.splice(-1,1);
      if (args == []) {
        return;
      }
      if (args[0].match(/^[0-9]+$/) != null) {
        await notify(message.member, "syntax error: item key can't be a number\n```markdown\n"+prefix+"giveItem itemKey quantity message @userMention \n```", 0xFF0000);
        return;
      } else if (!items[args[0]]) {
        await notify(message.member, "Sorry but this item does not exist ! 😥\n```markdown\n"+prefix+"giveItem itemKey quantity message @userMention \n```", 0xFF0000);
        return;
      }
      if (args[1].match(/^[0-9]+$/) == null) {
        await notify(message.member, "syntax error: quantity must be a number\n```markdown\n"+prefix+"giveItem itemKey quantity message @userMention \n```", 0xFF0000);
      }
      await giveItem(cmember, args[0], args[1], args[2]);
      return;
  }
});

// trash item command
bot.on("message", async message => {
  if (message.content.startsWith(prefix+"trashItem") && message.member.roles.find("name", devRole)) {
      let cmember = message.mentions.members.first();
      if (cmember == null) {
        await notify(message.member, "You need to mention someone !\n```markdown\n"+prefix+"trashItem itemKey quantity message @userMention \n```", 0xFF0000);
        return;
      }
      let args = message.content.slice(11).trim().match(/(?:[^\s"]+|"[^"]*")+/g);
      args.splice(-1,1);
      if (args == []) {
        return;
      }
      if (args[0].match(/^[0-9]+$/) != null) {
        await notify(message.member, "syntax error: item key can't be a number\n```markdown\n"+prefix+"trashItem itemKey quantity message @userMention \n```", 0xFF0000);
        return;
      } else if (!items[args[0]]) {
        await notify(message.member, "Sorry but this item does not exist ! 😥\n```markdown\n"+prefix+"trashItem itemKey quantity message @userMention \n```", 0xFF0000);
        return;
      }
      if (args[1].match(/^[0-9]+$/) == null) {
        await notify(message.member, "syntax error: quantity must be a number\n```markdown\n"+prefix+"trashItem itemKey quantity message @userMention \n```", 0xFF0000);
        return;
      }
      await trashItem(cmember, args[0], args[1], args[2]);
      return;
  }
});

// give xp command
bot.on("message", async message => {
  if (message.content.startsWith(prefix+"giveXp") && message.member.roles.find("name", devRole)) {
      let cmember = message.mentions.members.first();
      if (cmember == null) {
        await notify(message.member, "You need to mention someone !\n```markdown\n"+prefix+"giveXp quantity message @userMention \n```", 0xFF0000);
        return;
      }
      var $re = "~'[^']*'(*SKIP)(*F)|\s+~";
      let args = message.content.slice(8).trim().match(/(?:[^\s"]+|"[^"]*")+/g);
      args.splice(-1,1);
      if (args == []) {
        return;
      }
      if (args[0].match(/^[0-9]+$/) == null) {
        await notify(message.member, "syntax error: quantity must be a number\n```markdown\n"+prefix+"giveXp quantity message @userMention \n```", 0xFF0000);
        return;
      }
      await giveXp(cmember, args[0], args[1]);
      return;
  }
});



bot.on("message", async message => {
  if (message.content.startsWith(prefix+"inv") && message.channel.topic == message.member.id) {
      let guildy = bot.guilds.find("id", serverID);
      var up = guildy.members.find("id", message.author.id);
      await showInv(up, reg = "global");
      return;
  }
})

async function itemTypesList(up){
  mList = itemsTypes;
  texte = "";
  var t = 0;
  var page = 1;
  for (var i in mList) {
    t++;
    texte += selectionEmoji2[t]+"➖"+mList[i].name+"\n\n";
    if (t % 9 == 0 && i != 0) {
      page ++;
      emAns = await notify(up, texte, 0x000000, "", "🉐", selectionEmoji2);
      emAns = emAns[0];
      numAns = parseInt(emojiToNum(emAns));
      if (numAns != 0 && numAns < 10) {
        return Object.values(mList)[numAns+((page-1)*9)-1];
      }
      if (numAns == 0) {
        if (page != 1) {
          i -= (t+1)*2;
        } else {
          i -= t+1;
        }
        t = 0
      } else if(numAns == 10) {
        t = 0
      } else {
        return "";
      }
      texte = "";
    }
  }
  selEmoji = ["⬅"];
  i = parseInt(i);
  for (var j= t - (t%9); j<t; j++) {
    selEmoji.push(selectionEmoji2[j+1]);
  }
  selEmoji.splice(0, 1);
  selEmoji.push("🏠");
  emAns = await notify(up, texte, 0x000000, "", "🉐", selEmoji);
  emAns = emAns[0];
  numAns = parseInt(emojiToNum(emAns));
  if (numAns == 0) {
    await loadPlaylist(up);
  }
  if (numAns == 11) {
    return "";
  } else {
    return Object.values(mList)[numAns+((page-1)*9)-1];
  }
}

async function showInv(up, reg = "global", filtering = false, filter = [], returnItem = false) {
    var ans = "**"+usrD[up.user.id].name+"'s inventory:**\n";
    var inv = usrD[up.user.id].inventory;
    var invList = [];

    for (var i in inv) {
      invList.push(inv[i].name);
    }
    invList = await classItemByTypes(invList, filtering, filter);
    var t = 0;
    var s = 0;
    var page = 1;
    var outputList = [];
    if (invList.length == 0) {
      ans += filtering == true ? "❌Looks like you don't have any item suitable for this.\n"+textSeparator+"\nPlease, click on 🏠" : "❌Your inventory is empty.\n"+textSeparator+"\nPlease, click on 🏠";
    }
    for (var i=0; i<invList.length; i+= 2) {
      if (invList[i+1] != "sep") {
        ans += selectionEmoji2[t+1]+"| **"+items[invList[i]].name+"** | Quantity: **"+inv[invList[i]].quantity+"**";
        t++;
        outputList.push(invList[i]);

        if (reg == "charge") ans += " | Charge: **"+items[invList[i]].charge+"** Tera Joules";
        ans += "\n\n";
      } else {
        ans += textSeparator+"\n"+invList[i]+"\n\n";
        s++;
      }
      if (t % 9 == 0 && t!= 0) {
        page++;
        emAns = await notify(up, ans, 0x000000, "", "🉐", selectionEmoji2);
        emAns = emAns[0];
        numAns = parseInt(emojiToNum(emAns));
        if (numAns != 0 && numAns < 10) {
          itemInList = items[outputList[numAns+((page-1)*9)-1]];
          if (returnItem == false) {
            await inspectItemShop(up, itemInList, "", showInv, [up, reg, filtering, filter], reg);
            return;
          } else {
            return itemInList;
          }
        }
        if (numAns == 0) {
          if (page != 1) {
            i -= (t+s+1)*4;
          } else {
            i -= (t+s+1)*2;
          }
          t = 0;
          s = 0;
        } else if(numAns == 10) {
          t = 0;
          s = 0;
        } else {
          return;
        }
        ans = "";
      }
    }
    var selEmoji = ["⬅"];
    for (var j= t - (t%9); j<t; j++) {
      selEmoji.push(selectionEmoji2[j+1]);
    }
    selEmoji.splice(0, 1);
    selEmoji.push("🏠");
    emAns = await notify(up, ans, 0x000000, "", "🉐", selEmoji);
    emAns = emAns[0];
    numAns = parseInt(emojiToNum(emAns));
    if (numAns != 0 && numAns < 10) {
      itemInList = items[outputList[numAns+((page-1)*9)-1]];
      if (returnItem == false) {
        await inspectItemShop(up, itemInList, "", showInv, [up, reg, filtering, filter], reg);
        return;
      } else {
        return itemInList;
      }
    }
    if (numAns == 0) await showInv(up, reg, filtering, filter, returnItem);
    if (numAns == 10) {
      return;
    } else {
      return;
    }
}

function userPremium(up) {
  premium = 0;
  if(up.roles.find("name", "💎Nice dood")) premium += 1
  if(up.roles.find("name", "✨CONTRIBUTOR")) premium += 2;
  if(up.roles.find("name", "💳vip card")) premium += 4;
  return premium;
}

async function showMap(up, comeback, cbparams, reg) {
    var locName = userCurrentLocation(up, "AT");
    var insta = Object.values(instances);
    texte = "**Your current location: "+instances[locName].name+"**\n";
    var t = 0;
    var page = 1;
    var outputList = [];
    for (var i in insta) {
      if (insta[i] != instances[locName]) {
        t++;
        texte += "\n\n"+selectionEmoji2[t]+"➖"+insta[i].name+" | Distance: **"+distanceFrom(up, insta[i].id)+" SU**";
        outputList.push(insta[i]);
      }
      if (t % 9 == 0 && i != 0) {
        page ++;
        emAns = await notify(up, texte, 0x311535, "", "🗺", selectionEmoji2);
        emAns = emAns[0];
        numAns = parseInt(emojiToNum(emAns));
        if (numAns != 0 && numAns < 10) {
          if (reg == "selectDestination") await vehicleMethods(up, ["launch",outputList[numAns+((page-1)*9)-1]]);
          return;
        }
        if (numAns == 0) {
          if (page != 1) {
            i -= (t+1)*2;
          } else {
            i -= t+1;
          }
          t = 0
        } else if(numAns == 10) {
          t = 0
        } else {
          return;
        }
        texte = "";
      }
    }
    selEmoji = ["⬅"];
    i = parseInt(i);
    for (var j= t - (t%9); j<t; j++) {
      selEmoji.push(selectionEmoji2[j+1]);
    }
    selEmoji.splice(0, 1);
    selEmoji.push("🏠");
    emAns = await notify(up, texte, 0x311535, "", "🗺", selEmoji);
    emAns = emAns[0];
    numAns = parseInt(emojiToNum(emAns));
    if (numAns == 0) {
      await comeback(cbparams);
    }
    if (numAns == 11) {
      return;
    } else {
      if (reg == "selectDestination") await vehicleMethods(up, ["launch",outputList[numAns+((page-1)*9)-1]]);
      return;
    }
}

bot.on("message", async message => {
  if( message.content.startsWith(prefix+"map") && message.channel.topic == message.member.id) {
    let guildy = bot.guilds.find("id", serverID);
    var up = guildy.members.find("id", message.author.id);
  }
})

async function transferItem(donor,recipient,itemName,quantity) {
  if (usrD[donor.user.id].inventory[itemName]) {
    if (usrD[donor.user.id].inventory[itemName].quantity >= quantity) {
      if (cp == "") {
        trashItem(donor,itemName,quantity, "transfer is successful");
        giveItem(recipient,itemName,quantity,usrD[donor.user.id].name+" has given you this.");
      }
    }
  }
}

async function createUsersArray(up, qt = 2, upIsIncluded = true, sideNote = "", nomen = ["Host","Guests"]) {
  let guildy = bot.guilds.find("id", serverID);
  let channel = guildy.channels.find("id", usrD[up.user.id].channel);
  let usarray = upIsIncluded == true ? [up] : [];

  texte = sideNote+"\n"+textSeparator;
  texte += "\n❓ Mention them **in "+guildy.channels.find("name","play").toString()+". **\n"+textSeparator+"\n"
  texte1 = upIsIncluded ? nomen[0]+": **"+usrD[up.user.id].name+"**\n" : "\n";
  texte2 = upIsIncluded ? "\n**1/"+(qt)+"**\n" : "**0/"+(qt)+"**\n";
  currentQt = upIsIncluded ? 1 : 0;

  mess = await notify(up, texte+texte1+texte2, 0x000000, "", "⌨", ["nope"], false, 1, 740000);
  while (usarray.length < qt) {
    userPersonArr = await awaitUserMention(guildy.channels.find("name", "play"), qt-usarray.length);
    usarray = usarray.concat(userPersonArr);
    for (var i in userPersonArr) {
      texte1 += nomen[1]+": **"+usrD[userPersonArr[i].user.id].name+"**\n";
    }
    texte2 = "\n**"+(usarray.length)+"/"+(qt)+"**\n";
    mess = await notify(up, texte+texte1+texte2, 0x000000, "", "⌨", ["nope"], false, 1, 740000, true, mess);
  }
  await timeout(1500);
  mess.delete();
  return usarray;
}

async function createGroupChannel(passengers, name) {
  let guildy = bot.guilds.find("id", serverID);
  everyoneRole = guildy.roles.find("id", everyoneRoleId);
  crewChannel = await guildy.createChannel(name);
  await crewChannel.overwritePermissions(everyoneRole, {'ADD_REACTIONS': false,'READ_MESSAGES': false,'SEND_MESSAGES': false,'READ_MESSAGE_HISTORY': false});

  for(var i in passengers) {
    await crewChannel.overwritePermissions(passengers[i].user, {'ADD_REACTIONS': true,'READ_MESSAGES': true,'SEND_MESSAGES': true,'READ_MESSAGE_HISTORY': true});
  }
  return crewChannel;
}

async function awaitUserMention(channel, qt) {
  let members = [];
  const filter = m => {
      var mentArr = m.mentions.members.array();
      for (var i=0; i<qt; i++) {
        members.push(mentArr[i]);
      }
      if (members[0] == undefined) {
        return false;
      } else {
        m.channel.send("Understood.").then(message=>{
          message.delete(10000);
        });
        m.delete();
        return true;
      }
  }
  await channel.awaitMessages(filter, { max: 1, time: 740000, errors: ['time'] });

  return members;
}

async function transferItem(donneur,receveur,itemName,quantity) {
  trashItem(donneur, itemName, quantity, "");
  giveItem(receveur, itemName, quantity, "");
}

function distanceFrom(up, instName) {
  uln = userCurrentLocation(up, "AT");
  return Math.abs(instances[uln].coord - instances[instName].coord);
}


function hasItem(up, itemName, quantity = 1) {
  if (!usrD[up.user.id].inventory[itemName]) return false;
  return usrD[up.user.id].inventory[itemName].quantity >= quantity;
}

function itemQuantityMissing(up, itemName, quantity = 1) {
  if (!usrD[up.user.id].inventory[itemName]) return quantity;
  return quantity - usrD[up.user.id].inventory[itemName].quantity;
}

function hasLvl(up, lvl) {
  return usrD[up.user.id].lvl >= lvl;
}

function hasXp(up, xp) {
  return usrD[up.user.id].xp >= xp;
}

function hasStartedQuest(up, questName) {
  return usrD[up.user.id].questsPending.includes(questName);
}

function hasStartedQuestButNotCompleted(up, questName) {
  return usrD[up.user.id].questsPending.includes(questName) && !usrD[up.user.id].questsFinished.includes(questName);
}

function hasCompletedQuest(up, questName) {
  return usrD[up.user.id].questsFinished.includes(questName);
}

bot.on("message", async message => {
  if (message.content.startsWith(prefix+"register") && message.member.roles.find("name", devRole)) {
    let guildy = bot.guilds.find("id", serverID);
    var guildyM = guildy.members.array();
    console.log("eplain");
    for (var m in guildyM) {  //pasta stands for Personnal Data, it is not very justified tho.
      if (guildyM[m].user.bot == false) {
        let pasta = guildyM[m].id;
        if (!usrD[pasta]) usrD[pasta] = {};
        if (!usrD[pasta].name) usrD[pasta].name = guildyM[m].user.username;
        if (!usrD[pasta].lvl) usrD[pasta].lvl = 1;
        if (!usrD[pasta].xp) usrD[pasta].xp = 0;
        if (!usrD[pasta].questsPending) usrD[pasta].questsPending = [];
        if (!usrD[pasta].questsFinished) usrD[pasta].questsFinished = [];
        if (!usrD[pasta].currentDialogue) usrD[pasta].currentDialogue = "WelcomeToTheServ";
        if (!usrD[pasta].inventory) usrD[pasta].inventory = {};
        if (!usrD[pasta].nextDialogue) usrD[pasta].nextDialogue = "";
        if (!usrD[pasta].vehicle) usrD[pasta].vehicle = {
          name: "RLS_Stealth",
          hp: vehicles["RLS_Stealth"].hp,
        };
        if (userCurrentLocation(guildyM[m], "AT") == undefined) {
          roleLieux = guildy.roles.find("name", "AT CATHARSA CITY");
          roleJeu = guildy.roles.find("name", "🖤not playing");
          guildyM[m].addRoles([roleLieux, roleJeu]);
        }
        guildyM[m].setNickname(usrD[pasta].name+" |LVL "+usrD[pasta].lvl);
        // here you can add whatever property with default value to add in every user's database slot
        wtf();
      }
    }
    while (true /*infinite loops are very nice*/) {
      for (var m in guildyM) {
        if (guildyM[m].user.bot == false) {
          if (usrD[guildyM[m].id].channel != undefined && (guildyM[m].presence.status != "online" && guildyM[m].presence.status != "dnd")) {
            niceid = guildyM[m].id;
            channId = usrD[niceid].channel;
            channel = guildy.channels.find("id",channId);
            channel.delete();
            delete usrD[niceid].channel;
            rolez = guildy.roles.find("name", notPlayingRole);
            guildyM[m].addRole(rolez);
            guildyM[m].createDM().then(channel=>{
              channel.send("Hi,\nyour private channel on `"+guildy.name+"` has been deleted because you are marked as being offline or idle.");
            });
            wtf();
          }
        }
      }
      channelArr = guildy.channels.array();
      for (var i in channelArr) {
        if (channelArr[i].topic != undefined) {
          if (channelArr[i].topic.length == 18) {
            console.log(channelArr[i].topic);
            upz = guildy.members.find("id",channelArr[i].topic);
            if (upz == undefined && usrD[channelArr[i].topic].channel != undefined) {
              channelArr[i].delete();
              delete usrD[channelArr[i].topic].channel;
            }
          }
        }
      }
      console.log("Searching for offline users.");
      await timeout(60000);
    }
  }
})
