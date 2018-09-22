// takes user and npc and checks if the npc has any unclaimed reward for any of the user's completed quests
function npcHasReward(up, npc){
  for (var i in usrD[up.user.id].questsPending) {
    if (quests[usrD[up.user.id].questsPending[i]].objective(up) == true && quests[usrD[up.user.id].questsPending[i]].requirement(up) == true && quests[usrD[up.user.id].questsPending[i]].npc == npc) return true;
  }
}

// the same as npcQuests() but for final/reward quest dialogue. (called every time you say hello to a npc)
async function npcReward(up, npc){  //returns dialogue name
    for (var i in usrD[up.user.id].questsPending) {
      if (quests[usrD[up.user.id].questsPending[i]].objective(up) == true && quests[usrD[up.user.id].questsPending[i]].requirement(up) == true && quests[usrD[up.user.id].questsPending[i]].npc == npc) {
         await quests[usrD[up.user.id].questsPending[i]].reward(up);
         return quests[usrD[up.user.id].questsPending[i]].endDialogue;
      }
    }
    return npc.meeting;
}

// specifies that it needs a text answer along with an emoji answer.
function addTextAns(up, exptd, next) {
  usrD[up.user.id].answerMaterial = exptd;
  usrD[up.user.id].nextDialogue = next;
  wtf();
}

function npcHelloTexte(up, npc) {
  if (!npc.quests[0]) return npc.bfqTexte;
  if (!hasStartedQuest(up, npc.quests[0]) && !quests[npc.quests[0]].requirement(up)) return npc.bfqTexte;
  if (!hasStartedQuest(up, npc.quests[0]) && quests[npc.quests[0]].requirement(up)) return npc.welcomeMessage;
  for (var i in npc.quests) {
    if (hasStartedQuestButNotCompleted(up, npc.quests[i])) return quests[npc.quests[i]].tbcTexte;
  }
  if (hasCompletedQuest(up, npc.quests[0])) return npc.helloMessage;
}

function npcHelloAns(up, npc, lore = []) {
  var ans = npcQuests(up, npc);
  for (var i in lore) {
    ans[0] +=1;
    ans.push(lore[i]);
  }
  ans[0]+=1;
  ans.push("menu");
  return ans;
}

//returns everything in an instance
function availableNpcs (up) {
  var ans = [1];
  for (var i in npcList) {
    condition = npcList[i].condition(up);
    if (condition == true) {
      ans[0]++;
      ans.push(npcList[i].choiceAnswer);
    }
  }
  ans.push("menu");
  return ans;
}


async function startQuest(up, questName) {
    if (usrD[up.user.id].questsPending.includes(questName)) return;
    usrD[up.user.id].questsPending.push(questName);
    await notify(up, "**You just started the quest called: \""+quests[questName].name+"\"**", 0x00A3AA);
    wtf();
    return;
}

async function finishQuest(up, questName) {
    if (usrD[up.user.id].questsFinished.includes(questName)) return;
    usrD[up.user.id].questsFinished.push(questName);
    await notify(up, "Congratulations ! You just completed the quest called \""+quests[questName].name+"\"!", 0xFFF9D5);
    wtf();
    return;
}
