
  rep = {
    // UTILS ANSWERS
    menu: {
      texte: function (up) {return "Leave"},
      emote: function (up) {return "🏠"},
      exit: function (up) {return "BotHello"},
    },
    next: {
      texte: function (up) {return "next"},
      emote: function (up) {return "➡"},
      exit: function (up) {return usrD[up.user.id].currentDialogue},
    },
    buy: {
      texte: function (up) {return "Look at what you can buy here."},
      emote: function (up) {return "🛒"},
      exit: async function (up) {
        await shopMethods(up, ["stock"], usrD[up.user.id].currentDialogue);
        return usrD[up.user.id].currentDialogue;
      }
    },
    sell: {
      texte: function (up) {return "Try to sell something."},
      emote: function (up) {return "💵"},
      exit: async function (up) {
        await shopMethods(up, ["sell"], usrD[up.user.id].currentDialogue);
        return usrD[up.user.id].currentDialogue;
      }
    },
    launch: {
      texte: function (up) {return "Prepare to launch."},
      emote: function (up) {return "🚀"},
      exit: async function (up) {
        await vehicleMethods(up, ["compute"]);
        return usrD[up.user.id].currentDialogue;
      }
    },
    inspectShip: {
      texte: function (up) {return "My spacecraft."},
      emote: function (up) {return "👁"},
      exit: async function (up) {
        await vehicleMethods(up, ["garage"]);
        return usrD[up.user.id].currentDialogue;
      }
    },
    spacecraftDealer: {
      texte: function (up) {return "Spacecraft deals."},
      emote: function (up) {return "🉐"},
      exit: async function (up) {
        await vehicleMethods(up, ["deals"]);
        return usrD[up.user.id].currentDialogue;
      }
    },
    // TRUE ANSWERS
    Anicet0a1: {
      texte: function (up) {return "Ok"},
      emote: function (up) {return "✅"},
      exit: function (up) {return "wts1"},
    },
    midiUne1: {
      texte: function (up) {return "I guess I don't have a choice."},
      emote: function (up) {return "💬"},
      exit: function (up) {return "BotHello"},
    },
    Eddie0a2: {
      texte: function (up) {return "I would like you to make sure it can not send data to nanoteck. I mean I would like them not to track my position at least"},
      emote: function (up) {return "🔧"},
      exit: async function (up) {
        await quests.Eddie0.start(up);
        return "Eddie0a2";
      },
    },
    Eddie0a1: {
      texte: function (up) {return "Didn't know that 800 years old millenis with a child body existed..."},
      emote: function (up) {return "❓"},
      exit: function (up) {return "Eddie0a1"},
    },
    meet_Eddie: {
      texte: function (up) {
        let text = "NPC> Eddie"
        if (npcHasQuest(up, npcList.Eddie)) text+= "❗";
        if (npcHasReward(up, npcList.Eddie)) text+= "💰";
        return text;
      },
      emote: function (up) {return "👓"},
      exit: async function (up) {
        return await npcReward(up, npcList.Eddie);
      },
    },
    meet_Yui: {
      texte: function (up) {
        let text = "NPC> Yui"
        if (npcHasQuest(up, npcList.Yui)) text+= "❗";
        if (npcHasReward(up, npcList.Yui)) text+= "💰";
        return text;
      },
      emote: function (up) {return "🐱"},
      exit: function (up) {return "BotHello"},
    },
    shop_MathiewPhat: {
      texte: function (up) {
        let text = "SHOP> Math's parts"
        if (npcHasQuest(up, npcList.MathiewPhat)) text+= "❗";
        if (npcHasReward(up, npcList.MathiewPhat)) text+= "💰";
        return text;
      },
      emote: function (up) {return "🛰"},
      exit: function (up) {return "shop_MathiewPhat"},
    },
    inventory: {
      texte: function (up) {return "Inventory"},
      emote: function (up) {return "💼"},
      exit: async function (up) {
        emAns = await notify(up, "💼 **Show my entire inventory**\n🔬 **Filter by type**", 0x000000, "", "💼", ["💼","🔬"]);
        if (emAns[0] == "💼") {
          await showInv(up);
        } else if (emAns[0] == "🔬") {
          type = await itemTypesList(up);
          await showInv(up, "global", true, [type.id]);
        }
        return "BotHello";
      },
    },
    area: {
      texte: function (up) {return "NPC and Shops in the area"},
      emote: function (up) {return "📜"},
      exit: function (up) {return "scanArea"}
    },
    harbor: {
      texte: function (up) {return "Spacecraft"},
      emote: function (up) {return "🚀"},
      exit: function (up) {return "chooseShip"}
    },
    pveMissions: {
      texte: function (up) {return "PVE missions"},
      emote: function (up) {return "⚔"},
      exit: async function (up) {
        let res = await pvePlaylist(up);
        let playlist = res[0];
        let memarr = res[1];
        await fight(playlist, memarr);
        return "BotHello";
      }
    },
    pveCreate: {
      texte: function (up) {return "Create PVE missions"},
      emote: function (up) {return "✏"},
      exit: async function (up) {
        await fightPlaylist(up);
        return "BotHello";
      }
    }

  }
