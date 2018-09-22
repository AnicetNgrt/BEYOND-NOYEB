
corp = {
    type: {
      texte: async (up, am)=> {return ""},
      npc: npcList.GameMaster,
      answers: (up)=> {return [1,"menu"]},
      footer: (up)=> {return ""},
      //thumb:
    },
    meet_Eddie: {
      texte: async (up, am)=> {
        return npcHelloTexte(up, npcList.Eddie);
      },
      npc: npcList.Eddie,
      answers: (up)=> {
        return npcHelloAns(up, npcList.Eddie, ["Eddie0a1"]);
      },
      footer: (up)=> {return "Lore: Eddie is well known in the city, he is a milleni, an 'immortal dude' he has been living in Carthasa city for more than 800 years !"}
    },
    shop_MathiewPhat: {
      texte: async (up, am = ["nothing"]) =>{
        await shopMethods(up, am, "shop_MathiewPhat");
        return npcHelloTexte(up, npcList.MathiewPhat);
      },
      npc: npcList.MathiewPhat,
      answers: (up)=> {
        answers = npcQuests(up, npcList.MathiewPhat).concat(["buy","sell","menu"]);
        answers[0] += 3;
        return answers;
      },
      footer: (up)=> {return "Pro tip: Mathiew Phat can sell you energy for your space travels."}
    },
    WelcomeToTheServ: {
      texte: async (up, am)=> {
        await notify(up, "**For your comfort while playing this text based game on a large screen, please tweak the following settings on the desktop Discord client:**\nDark mode: **ON**\nMessages display mode: **COZY**\nText font: **more than 100** (110 is ideal).\n"+textSeparator+"\nThis message will be deleted within 1 to 2 minutes, then your game will start...", 0x000000, "https://imgur.com/Yv5it6v.gif", "💬", ["⏩"], false, 1, 100000);
        return "**Hi ! 🖐**\nMy name is **Anicet**, I am the creator of this.\nYeah *\"Waddu heck is this ?\"* as you may wonder right now...\nWell this is a **text** (and still pictures) **based mmo rpg**.\n\nYou are not dreaming, you are on a discord server. You know, I'm the kind of dude spending a month coding a text based mmorpg out of a discord server and bot... 😅\nWell, joke aside, you'll encounter a lot of text based stuff in this mmmorpg. It may not be suitable for everyone.\nStill, if this is not a problem for you, you can **click on the little reaction emote below this message** to continue ! 🙂";
      },
      npc: npcList.anicet,
      answers: (up)=> {return [1,"Anicet0a1"]},
      footer: (up)=> {return "🔽here🔽"}
    },
    wts1: {
      texte: async (up, am)=> {
        return "**Nice, you get it !**\nThoses emoji based buttons are cool isn't it ?\nWell, pretty much every interaction in game is based on them. But still sometime you'll need to type some text. It will be indicated clearly when it will be the case.\n⚠**CLICKING ON ONE OF THE EMOJIS BUTTONS BEFORE THEY ARE ALL VISIBLE DOES NOT WORK !**\nI know it is a major downfall, I'm working on it.\nIf you accidently do it, just click it again and again, it will unreact and then react again, and hopefully it should work.\n❗ **In order to access all the [OFF GAME] channels, such as the forum or the about section, you need to close your private channel by typing "+prefix+"quit.\n❗ If nothing happens in your channel, the game may need you to type \"play\" in your channel to continue.\n\n🎮Have fun !**";
      },
      npc: npcList.anicet,
      answers: (up)=> {
        usrD[up.user.id].currentDialogue = "midiUne";
        wtf();
        return [0];
      },
      footer: (up)=> {return ""}
    },
    /*wts2: {
      texte: async (up, am)=> {
        return "";
      },
      npc: npcList.GameMaster,
      answers: (up)=> {
        usrD[up.user.id].currentDialogue = "wts3"; wtf();
        return [1,"next"];
      },
      footer: (up)=> {return ""},
    },*/
    midiUne: {
      texte: async (up, am)=> {
        await notify(up, "**Anicet Nougaret** presents", 0x000000, "", "➖");
        await notify(up, "a game made using **discord.js** and **Anicet's free to use Discord-based mmorpg creation tools:**", 0x000000, "", "➖");
        await notify(up, "", 0x000000, "https://imgur.com/PtqU77y.png", "➖");
        await notify(up, "The woman: **Hello "+usrD[up.user.id].name+"!**"+"\n\nYou: **(Do I know her ?...  She has a grey skin, she is an android, why does she need me ?) Hmm, Hi ?**", 0x000000, "https://imgur.com/8GcRiNq.png", "📷", ["👋"]);
        return "**Hi! My name is "+npcList.GameMaster.name+"**.\nI've been sent by **nanoteck™** insurance branch since you were recently registered as a full-time pioneer.\n**I'll be helping you during your work**, my service price is included within your insurance monthly fee..."
      },
      npc: npcList.GameMaster,
      answers: (up)=> {return [1,"midiUne1"]},
      footer: (up)=> {return "Pro Tips: click on one of thoses reaction emotes to make your choice."}
    },
    BotHello: {
      texte: async (up, am)=> {return usrD[up.user.id].name+"'s tab."},
      npc: npcList.GameMaster,
      answers: (up)=> {return [6,"inventory","area","harbor","pveMissions","pveCreate","menu"]},
      footer: (up)=> {return "Pro Tips: click on one of thoses reaction emotes to make your choice."}
    },
    Eddie0a1: {
      texte: async (up, am)=> {return "Yes I know, by the way this not wanted by me... hopefully (discreet laugh) but that's an old and boring story for a young person like you. I was born in the early years of the 21st century, before all that garbage...\nAnyway, what do you want ?"},
      npc: npcList.Eddie,
      answers: (up)=> {return [2,"meet_Eddie","menu"]},
      footer: (up)=> {return "Truth: I really struggle at trying to write new and innovating stuff in this section every time"}
    },
    Eddie0a2: {
      texte: async (up, am)=> {return "Hmm... I understand, this law is real garbage, hopefully I can put a fake emitter on your machine, that's like a good old vpn, you never knew that kind of stuff anyway. Well, time to make some useless choices, which fake location do you want to have ?\n\n*Tutorial:*\nSome npc, such as vendors, may ask you to send a text message below their dialogue box to answer.\n\n*Instructions:*\nSend some place's name ex:'Jupiter'"},
      npc: npcList.Eddie,
      answers: (up)=> {
        addTextAns(up, [1,"string"], "Eddie0b");
        return [0];
      },
      footer: (up)=> {return "Pro Tips: This is a footer, you can give me footer suggestions in the 'footer suggestion' channel on the forum."}
    },
    Eddie0b: {
      texte: async (up, am)=> {return "Well ok, let's go for "+am+" then !\nIt is going to take me some time to create the emitter, you can come back later and it will do the job ! See ya later !"},
      npc: npcList.Eddie,
      answers: (up)=> {return [1,"menu"]},
      footer: (up)=> {return "Wow, you are almost done with your first quest! Just leave and come back in order to claim your reward!"}
    },
    Eddie0c: {
      texte: async (up, am)=> {return "Hi! Your emitter is ready, I put it on the workbench, you can take it.\n"},
      npc: npcList.Eddie,
      answers: (up)=> {return [2,"Eddie0a1","menu"]},
      footer: (up)=> {return "Ad: Get your very own OZI model robotic kitty now on gww.ozicats.jup !"}
    },
    scanArea: {
      texte: async (up, am)=> {return "I've scanned the area for you."},
      npc: npcList.GameMaster,
      answers: (up)=> {
        ans = availableNpcs(up);
        console.log(ans);
        return ans;
      },
      footer: (up)=> {return "Pro Tips : ❗: quest(s) available, 💰:quest(s) complete"}
    },
    chooseShip: {
      texte: async (up, am = ["nothing"])=> {
        await vehicleMethods(up, am);
        return "📖You can go anywhere in space as long as you charge your spacecraft with the required energy quantity 🔋.\nCharge your spacecraft with more energy than it's maximum capacity and you'll reach even the furthest spots in the galaxy ❕  Be careful tho, you may have bad surprises at your arrival... 😵";
      },
      npc: npcList.GameMaster,
      answers: (up)=> {
        return [4,"menu","inspectShip","launch","spacecraftDealer"];
      },
      footer: (up)=> {return "Pro tips: Your spacecraft can't be destroyed, but the more damage it will take, the longer you'll need to wait before your next fly."}
    }
  }
