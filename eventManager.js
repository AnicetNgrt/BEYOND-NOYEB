async function fight(playlist, memarr) {
  var guildy = bot.guilds.find("id", serverID);
  if (memarr.length > 1) {
    var cname = "🏁_";
    var namestring = playlist.name.toLowerCase();
    namestring = namestring.replace(/ /g,"_");
    cname += namestring;
    cname += randInt(1,100);
    crewChannel = await createGroupChannel(memarr, cname);
  } else {
    crewChannel = guildy.channels.find("id", usrD[memarr[0].user.id].channel);
  }
  var mobArray = [];
  for (var i in playlist.content) {
    var mmm = Object.create(fMobs[playlist.content[i][0]]);
    var lll = playlist.content[i][1];
    mmm.summon(memarr[0], lll);
    mobArray.push(mmm);
  }
  var message = undefined;
  for (var i in mobArray) {
    var mob = mobArray[i];
    var basicText = "**"+mob.name+"** |LVL "+mob.level+"\n"+textSeparator+"\n";
    var maxHp = clone(mob.hp);
    var mobHpText = "**Mob's HP:** ";
    var dialogue = pickRandom(mob.phases[0].dialogues);
    var playerHp = memarr.length*3;
    var hptext = "";
    var phaseText;
    var turnCount = 0;
    for (var m=0; m<mob.hp; m++) {
      mobHpText += "💜";
    }
    for (var m=0; m<playerHp; m++) {
      hptext += "❤";
    }
    await notify("", "**Your HP:** "+hptext+"\n"+mobHpText, 0x000000, "", "💕", ["➡"], true, Math.floor(Math.sqrt(memarr.length)), 12000, false, undefined, true, crewChannel.id);
    for (var x in mob.phases) {
      xplus1 = parseInt(parseInt(x)+1);
      while (mob.hp > maxHp*(mob.phases[x].hp/100)) {
        dialogue = pickRandom(mob.phases[x].dialogues);
        turnCount++;
        await notify("", basicText+"**PHASE "+xplus1+"/"+mob.phases.length+"**\n"+"**🔸TURN "+turnCount+"🔸**", 0x000000, "", "➖", ["➡"], true, Math.floor(Math.sqrt(memarr.length)), 12000, false, undefined, true, crewChannel.id);
        await notify("", dialogue, 0x000000, ["",mob.picture], "⚔", ["➡"], true, Math.floor(Math.sqrt(memarr.length)), 12000, false, undefined, true, crewChannel.id);
        var att = pickRandom(mob.phases[x].attacks);
        var alreadypickedUser = [];
        var alreadypickedChannel = [];
        var givenAttack = [];
        var j = randInt(0,att.length-3);
        var index = pickRandom([0,1,1,1,2,2]);
        var type = attTypes[index];
        timer(10, "**🔴ENEMY'S TURN  \n👉 SEARCH THE EMOTE**\n*remaining*: ", crewChannel.id);
        switch (index) {
          case 0:
            move = pickRandom(type);
            impact = [att[j]];
            givenAttack = givenAttack.concat(impact);
            move(pickRandom(memarr), crewChannel, impact[0], 10000);
          break;
          case 1:
            move = pickRandom(type);
            impact = [att[j]];
            givenAttack = givenAttack.concat(impact);
            meme = pickRandom(memarr);
            move(meme, crewChannel, impact[0], 10000);
          break;
          case 2:
            move = pickRandom(type);
            impact = [att[j]];
            givenAttack = givenAttack.concat(impact);
            meme = pickRandom(memarr);
            move(meme, crewChannel, impact[0], 10000);
          break;
        }
        await timeout(10000);
        var receivedAttack = [];
        var damageTaken = Math.sqrt(maxHp);
        var damageGiven = -1*Math.sqrt(maxHp);

        timer(att[att.length-2], "**🔵YOUR TURN  \n👉 SEND THE EMOTE AS MANY TIME AS YOU CAN**\n*remaining*: ", crewChannel.id);
        const filter = msg=>{
          for (var h=0; h<givenAttack.length; h++) {
            if(msg.content.startsWith(givenAttack[h]) == true) {
              damageTaken -= att[att.length-1]+(usrD[msg.author.id].lvl/120);
              damageGiven += att[att.length-1]+(usrD[msg.author.id].lvl/80);
            } else if (msg.author.id != botID) {
              damageTaken += att[att.length-1]*0.7;
              damageGiven -= att[att.length-1]*1.5;
            }
            if(mob.hp-Math.floor(damageGiven) <= maxHp*(mob.phases[x].hp/100)) {
              return true;
            }
          }
          return false;
        }
        await crewChannel.awaitMessages(filter, {max: 1, time:att[att.length-2]*1000});

        if (damageGiven < 0) damageGiven = 0;
        if (damageTaken < 0) damageTaken = 0;

        mob.hp -= Math.floor(damageGiven);
        playerHp -= Math.floor(damageTaken);


        mobHpText = "**Mob's HP:** ";
        for (var m=0; m<mob.hp; m++) {
          mobHpText += "💜";
        }
        for (var m=0; m<Math.floor(damageGiven); m++) {
          mobHpText += "❌";
        }
        hptext = "";
        for (var m=0; m<playerHp; m++) {
          hptext += "❤";
        }
        for (var m=0; m<Math.floor(damageTaken); m++) {
          hptext += "❌";
        }

        await notify("", "**👉TURN's RECAP**\n"+"**Your HP:** "+hptext+"\n"+mobHpText+"\n❔Expected emoji: "+givenAttack[0], 0x000000, "", "💕", ["➡"], true, Math.floor(Math.sqrt(memarr.length)), 12000, false, undefined, true, crewChannel.id);

        if (playerHp <= 0) {
          await notify("", basicText+"***☠YOU ARE DEAD☠***\n\n➖GAME OVER➖", 0x000000, ["",mob.picture], "☠", ["➡"], true, Math.floor(Math.sqrt(memarr.length)), 12000, false, undefined, true, crewChannel.id);
          if (memarr.length > 1) {
            crewChannel.delete();
          }
        }
      }
    }
    for (var x in fMobs[mob.id].rewards) {
      var min = fMobs[mob.id].rewards[x][0]*mob.level;
      var max = fMobs[mob.id].rewards[x][1]*mob.level;
      itemReward = items[fMobs[mob.id].rewards[x][2]];
      rewardQ = randInt(min, max);
      for (var y in memarr) {
        if (rewardQ > 0 && memarr.length > 1) {
          giveItem(memarr[y], itemReward.id, rewardQ);
        } else if (rewardQ > 0) {
          await giveItem(memarr[y], itemReward.id, rewardQ);
        }
      }
    }
    for (var x in memarr) {
      if (memarr.length > 1) {
        giveXp(memarr[x], fMobs[mob.id].xp*mob.level);
      } else {
        await giveXp(memarr[x], fMobs[mob.id].xp*mob.level);
      }
    }
    if (i < mobArray.length-1) {
      await notify("","**⭐You have defeated the enemy !**\n...but be ready, others are coming.", 0x000000, ["",mob.picture], "⭐", ["➡"], true, Math.floor(Math.sqrt(memarr.length)), 12000, false, undefined, true, crewChannel.id);
    } else {
      await notify("","**⭐You have defeated the last enemy !**", 0x000000, ["",mob.picture], "⭐", ["➡"], true, Math.floor(Math.sqrt(memarr.length)), 12000, false, undefined, true, crewChannel.id);
    }
  }
  await notify("","***🎉✨✨CONGRATULATIONS✨✨🎉***\nYou have completed this PVE mission !", 0x000000, "", "➖", ["➡"], true, Math.floor(Math.sqrt(memarr.length)), 12000, false, undefined, true, crewChannel.id);
  if (memarr.length > 1) {
    crewChannel.delete();
  }
}

async function fightPlaylist(up){
  var emAns = [];
  emAns.push("📌");
  var playlist = {
    name: "**My custom PVE mission.**",
    content: []
  };
  while (emAns[0] != "✅") {

    texte = playlistDescr(playlist);
    texte += "\n"+textSeparator+"\n";
    emAns = await notify(up, texte+"📌**Add a mob or a boss\n💾Save the custom PVE mission.**", 0x000000, "", "⚔", ["📌","💾","🏠"]);
    if (emAns[0] == "🏠") {
      return "🏠";
    }
    if (emAns[0] == "📌") {
      mob = await mobPick(up);
      if (mob != "") {
        level = await scrollNumbers(up, fightPlaylist, [up], usrD[up.user.id].lvl, "Which level do you want for this mob ? Rewards will be scaled depending on it.", 1, 100);
        raw = await scrollNumbers(up, fightPlaylist, [up], usrD[up.user.id].lvl, "How many of them do you want in a raw ?", 1, 100);
        for (var j=0; j<raw;j++) {
          playlist.content.push([mob.id,level]);
        }
      }
    }
    if (emAns[0] == "💾") {
      if (!usrD[up.user.id].mobPlaylist) usrD[up.user.id].mobPlaylist = [];
      var premium = userPremium(up);
      var plh = usrD[up.user.id].mobPlaylist.length;
      var outOfLimit = false;
      switch (premium) {
        case 0: outOfLimit = plh > 3;
          break;
        case 1: outOfLimit = plh > 6;
          break;
        case 2: outOfLimit = plh > 9;
          break;
        case 3: outOfLimit = plh > 12;
          break;
        case 4: outOfLimit = plh > 13;
          break;
        case 5: outOfLimit = plh > 16;
          break;
        case 6: outOfLimit = plh > 19;
          break;
        case 7: outOfLimit = plh > 22;
          break;
      }
      var savingIt = true;
      if (outOfLimit == true) {
        emAns = await notify(up, "⚠ You already have the maximum amount of custom PVE runs saved."+textSeparator+"\n**💳V.I.P card**: +10 slots\n**✨CONTRIBUTOR**: +6 slots\n**💎Nice dood**: +3 slots.\n"+textSeparator+"❓ Thoses roles can be obtained either for free by bringing a great amount of people to the lobby server, or either by donating. ❤ \n ☺ By getting thoses roles you show your great interest for this project and give us priceless support! 🍾 You also get access to sweet  in-game perks !... No p2w for God's sake, calm down 😅\n👉 For more informations see: https://discord.gg/HuzDk5r", 0x000000, "", "😬");
        emAns = await notify(up, "Do you wish to **remove one of your already saved PVE runs** in order to be able to **save this one** ?", 0x000000, "", "💾", ["✅","❌"]);
        if (emAns[0] == "✅") {
          var pl = await pickPlaylist(up, true);
          var xi = usrD[up.user.id].mobPlaylist.indexOf(pl);
          usrD[up.user.id].mobPlaylist = usrD[up.user.id].mobPlaylist.splice(xi, 1);
          savingIt = true;
        } else {
          savingIt = false;
        }
      }
      if(savingIt == true) {
        var message = await notify(up, "How do you want to call this playlist ?\nType your answer in the chat.", 0x000000, "", "⌨", ["nope"]);
        var content = await typeAnswer(up);
        message.delete();
        usrD[up.user.id].mobPlaylist.push({
          name: content,
          content: []
        });
        for (var i in playlist.content) {
          usrD[up.user.id].mobPlaylist[usrD[up.user.id].mobPlaylist.length-1].content.push([playlist.content[i][0],playlist.content[i][1]]);
        }
        wtf();
        await notify(up, "**Your custom PVE level has been saved !**", 0x00FF00, "");
        emAns[0] = "✅";
      }
    }

  }
  return playlist;
}

async function pvePlaylist(up) {
  var guildy = bot.guilds.find("id", serverID);
  var emAns = []
  emAns.push("❌");
  while (emAns[0] != "✅") {
    playlist = await pickPlaylist(up);
    emAns = await notify(up, playlistDescr(playlist), 0x000000, "", "🏁", ["✅","❌"]);
  }
  emAns = await notify(up, "👤Play solo.\n👥Invite specific players.\n🌐Create a public invite.", 0x000000, "", "❓", ["👤","👥","🌐"]);
  if (emAns[0] == "👥") {
    var peers = await scrollNumbers(up, pvePlaylist, [up], 1, "How many players ? ", 1, 30);
    var memarr = await createUsersArray(up, peers, true, "Who do you want to invite ?");
    var minLevel = 1;
    var maxLevel = 9999;
  } else if (emAns[0] == "🌐") {
    var peers = await scrollNumbers(up, pvePlaylist, [up], 1, "How many people can join ? ", 1, 250);
    var minLevel = await scrollNumbers(up, pvePlaylist, [up], 1, "What is the **minimum level** for thoses peoples to join ? ", 1, 9999);
    var maxLevel = await scrollNumbers(up, pvePlaylist, [up], 1, "What is the **maximum level** for thoses peoples to join ? ", 1, 9999);
    var memarr = guildy.members.array();
  } else {
    var peers = 1;
  }
  passArray = [];
  passArray.push(up);
  if (peers > 1) {
    await notify(up, "**How rewards scaling works ?**\n\nDepending on your level: **The higher your level is compared to the mob, the less rewarded you will be. If your level is more than 2x lower than the mob's one, you won't get rewarded at all.**\nBased on the amount of players: The amount of player does not affect rewards. Beating a mob with a crew not larger than 2 people may give you exclusive rewards tho...", 0x000000, "", "❓");
    finalmemarr = [];
    for (var i in memarr) {
      if (memarr[i].user.bot == false) {
        if (canSeePlaylist(memarr[i], playlist) && usrD[memarr[i].user.id].lvl >= minLevel && usrD[memarr[i].user.id].lvl <= maxLevel) finalmemarr.push(memarr[i]);
      }
    }
    cname = "❗PVE_";
    namestring = playlist.name.toLowerCase();
    namestring = namestring.replace(/ /g,"_");
    cname += namestring;
    cname += randInt(1,100);
    crewChannel = await createGroupChannel(finalmemarr, cname);
    descr = playlistDescr(playlist);
    emAns = await notify(up, descr+"\n"+textSeparator+"\nHost: **"+usrD[up.user.id].name+"\n\n✅ Accept** *(host must react too if he wants to play)*", 0x000000, "", "🏁", ["✅"], true, peers, 90000, false, undefined, true, crewChannel.id);
    passArray = emAns[1];
    crewChannel.delete();
  }
  return [playlist, passArray];

}
function canSeePlaylist(up, playlist){
  for (var i in playlist.content) {
    if(fMobs[playlist.content[i][0]].condition(up) == false) {
      return false;
    }
  }
  return true;
}

function playlistDescr(playlist) {
  texte = playlist.name+"\n"+textSeparator+"\n*Mobs you'll fight in order:*\n\n";
  inRaw = 1;
  for (var i=0; i<playlist.content.length; i++) {
    if (JSON.stringify(playlist.content[i]) === JSON.stringify(playlist.content[i+1])) {
      inRaw += 1;
    } else {
      texte += inRaw+" x "+fMobs[playlist.content[i][0]].name+" LVL "+playlist.content[i][1]+"\n";
      inRaw = 1;
    }
  }
  return texte;
}

async function pickPlaylist (up, privateOnly = false) {
  var list = [];
  list.push({name: textSeparator+"\n⚗**Custom missions**\n"+textSeparator+"\n"});
  if(usrD[up.user.id].mobPlaylist) {
    list = list.concat(usrD[up.user.id].mobPlaylist);
  } else {
    list.push({name:"❌Nothing here.\n\n"});
  }
  if(privateOnly == false) {
    list.push({name:textSeparator+"\n🎯**Available missions**\n"+textSeparator+"\n"});
    list = list.concat(mobsPlaylists);
  }
  var mList=[];
  var outputList = [];
  for (var i in list) {
    if (list[i].name != undefined) {
      if (canSeePlaylist(up, list[i]) == true) {
        mList.push(list[i]);
      }
    } else {
      mList.push(list[i]);
    }
  }
  texte = "";
  var t = 0;
  var page = 1;
  longueur = clone(mList.length);

  for (var i=0; i<longueur; i++) {
    if (mList[i].content == undefined) {
      texte += mList[i].name;
    } else {
      t++;
      texte += selectionEmoji2[t]+"➖"+mList[i].name+"\n\n";
      outputList.push(mList[i]);
    }
    if (t % 9 == 0 && i > 1 && t!= 0) {
      page ++;
      emAns = await notify(up, texte, 0x000000, "", "🏹", selectionEmoji2);
      emAns = emAns[0];
      numAns = parseInt(emojiToNum(emAns));
      if (numAns != 0 && numAns < 10) {
        return outputList[numAns+((page-1)*9)-1];
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
  emAns = await notify(up, texte, 0x000000, "", "🏹", selEmoji);
  emAns = emAns[0];
  numAns = parseInt(emojiToNum(emAns));
  if (numAns == 0) {
    await loadPlaylist(up);
  }
  if (numAns == 11) {
    return "";
  } else {
    return outputList[numAns+((page-1)*9)-1];
  }
}


async function mobPick(up) {
  var mList = [];
  for (var i in fMobs) {
    if (fMobs[i].condition(up) == true) {
      mList.push(fMobs[i]);
    }
  }
  texte = "";
  var t = 0;
  var page = 1;
  for (var i in mList) {
    t++;
    texte += ""+selectionEmoji2[t]+"➖**"+mList[i].name+"**\n\n";
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
    await mobList(up);
  }
  if (numAns == 11) {
    return "";
  } else {
    return Object.values(mList)[numAns+((page-1)*9)-1];
  }
}
