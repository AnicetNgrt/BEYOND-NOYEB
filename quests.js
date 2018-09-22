
  quests = {
    Eddie0: {
      name: "Meet Eddie",
      id: "Eddie0",
      description: "You must talk with Eddie at Carthasa city and let him upgrade 12-H.",
      requirement: function (up) {
        return !hasCompletedQuest(up, "Eddie0");
      },
      objective: function (up) {
        return hasItem(up, "antenaTicket");
      },
      npc: npcList.Eddie,
      reward: async function (up) {
        await finishQuest(up, "Eddie0");
        await trashItem(up, "antenaTicket", 1, "You don't need this anymore.");
        await giveItem(up, "fakeAntena", 1, "Got it !");
        await giveXp(up, 115);
      },
      start: async function(up) {
        await startQuest(up, "Eddie0");
        await giveItem(up, "antenaTicket", 1, "Eddie gave you this ticket. Now you need to leave him. You'll just need to talk to Eddie again to finish your quest.");
      },
      startAns: "Eddie0a2",   // the answer which triggers the quest
      endDialogue: "Eddie0c",  // the dialogue that is displayed right after you claimed your quest completion to the appropriate npc
      tbcTexte: "Sorry, but your emitter is not ready yet..."
    }
  }
