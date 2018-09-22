

async function inspectItemShop (up, itemInList = "", itemInShop = "", comeBack, cbparam, transactionType = "buy") {
    if (itemInList != "") itemName = itemInList.name;
    if (itemInList != "") itemDescr = itemInList.description;
    quanInInv = 0;
    if (usrD[up.user.id].inventory[itemInList.id] != undefined) quanInInv = usrD[up.user.id].inventory[itemInList.id].quantity;

    texte = "**"+itemName+"**\n```\n"+itemDescr+"\n```\n"+textSeparator+"\nYou carry **"+quanInInv+"**";

    emojis = ["⬅"];

    var possibleUsages = "";

    if (transactionType == "buy") {
      Currency = itemInShop[1][0];
      Price = itemInShop[1][1];
      if (usrD[up.user.id].inventory[Currency] != undefined) {
        quanBuy = usrD[up.user.id].inventory[Currency].quantity/Price;
        quanBuy = quanBuy < 1 ? 0 : Math.floor(quanBuy);
      } else {
        quanBuy = 0;
      }
      texte += "\n\nPrice: **"+Price+items[Currency].name+"** per unit.";
      texte += "\nYou can buy **"+quanBuy+"**";

      emojis.push("🛒");

    } else if (transactionType == "sell" && itemInList.usp != undefined) {
      currentShop = shops[usrD[up.user.id].currentDialogue];
      for (var i in currentShop.uspExceptions) {
        if (currentShop.uspExceptions[i][0] == itemInList.id) {
          itemInShop == currentShop.uspExceptions[i];
        }
      }
      if (itemInShop != "") {
        Currency = itemInShop[1][0];
        Price = itemInShop[1][1];
      } else {
        Currency = itemInList.usp[0];
        Price = itemInList.usp[1];
      }
      texte += "\n\nSelling price: **"+Price+items[Currency].name+"** per unit.\nThis can vary from one shop to another\n";
      emojis.push("💵");
    } else if (transactionType == "global") {
      typeName = itemInList.type;
      possibleUsages = [];
      for (var i in itemsTypes[typeName].use) {
        usage = itemsTypes[typeName].use[i];
        possibleUsages.push(usage);
        texte += "\n\n"+usage.emoji+"**|"+usage.description+"**";
        emojis.push(usage.emoji);
      }
    }
    emAns = await notify(up, texte, 0x000000, "", "📋", emojis);
    if (emAns[0] == "⬅") {
      await comeBack(...cbparam);
      return;
    } else if (emAns[0] == "🏠") {
      return;
    } else if (possibleUsages != []) {
      ind = emojis.indexOf(emAns[0]);
      usage = possibleUsages[ind-1];
      await usage.code(up, itemInList.id);
      playDialogue(up, usrD[up.user.id].currentDialogue);
    } else if (emAns[0] == "💵") {
      quantity = await scrollNumbers(up, inspectItemShop, [up, itemInList, itemInShop, comeBack, cbparam, transactionType], 0, "How many units of "+itemInList.name+" do you want to sell ?", 0, quanInInv);
      await shopMethods(up, ["selling",itemInList,quantity,Currency,Price*quantity]);
      return;
    }

    return quanBuy != undefined ? [emAns[0],quanBuy] : emAns[0];
}

async function purchaseItem(up, itemInShop, quantity, comeback, cbparams) {
  var tbs = itemInShop;
  var cn = tbs[1][0];
  var cq = tbs[1][1]*quantity;

  emAns = await notify(up, "Are you shure you want to get **"+quantity+items[tbs[0]].name+"** ?\nIt will cost **"+cq+items[cn].name+"**.", 0x000000, "", "❓", ["❌","✅"]);
  emAns = emAns[0];
  if (emAns == "❌") {
    await comeback(...cbparams);
    return;
  }

  if (!hasItem(up, cn, cq)){
    await notify(up, "You **don't** have **enougth "+items[cn].name+"** to get **"+quantity+"** unit(s) of**"+items[tbs[0]].name+"**\nYou need "+itemQuantityMissing(up, cn, cq)+" more.", 0xFF0000);
    return;
  } else {
    await trashItem(up, cn, cq);
    await giveItem(up, tbs[0], quantity);
  }
}

// ugliest thing I've ever seen.
async function shopMethods (up, am, shopName) {
  switch(am[0]) {
    case "stock":
      var ans = "";
      var sil = shops[shopName].itemList;
      var list = [];
      for (var i in sil) {
        list.push(sil[i][0]);
      }
      list = await classItemByTypes(list);
      var t = 0;
      var s = 0;
      var page = 1;
      var outputList = [];
      for (var i=0; i<list.length; i += 2) {
        if (list[i+1] != "sep") {
          itemName = list[i];
          shopItem = sil[list[i+1]];
          idInShop = list[i+1];
          if (usrD[up.user.id].inventory[shopItem[1][0]] != undefined) {
            quanBuy = usrD[up.user.id].inventory[shopItem[1][0]].quantity/shopItem[1][1];
            quanBuy = quanBuy < 1 ? 0 : Math.floor(quanBuy);
          } else {
            quanBuy = 0;
          }
          ans += selectionEmoji2[t+1]+"➖**"+items[itemName].name+"** |Price: **"+shopItem[1][1]+items[shopItem[1][0]].name+"** |You can buy: **"+quanBuy+"**"+"\n\n";  // [1][[i],[0]][1][[3]][1][[i],[0]][1][[3]][1][[i],[0]][1][[3]][1][[i],[0]][1][[3]][1][[i],[0]][1][[3]][1][[i],[0]][1][[3]][1][[i],[0]][1][[3]][1][[i],[0]][1][[3]]
          t++;
          outputList.push(list[i+1]);
        } else {
          ans += "\n"+textSeparator+"\n**"+list[i]+"**\n"+textSeparator+"\n";
          s++;
        }
        if (t%9 == 0 && t!= 0) {
          page++;
          emAns = await notify(up, ans, 0x000000, "", "🛒", selectionEmoji2);
          emAns = emAns[0];
          numAns = parseInt(emojiToNum(emAns));
          if (numAns != 0 && numAns < 10) {
            itemInShop = sil[outputList[numAns+((page-1)*9)-1]];
            itemName = itemInShop[0];
            itemInList = items[itemName];

            action = await inspectItemShop(up, itemInList, itemInShop, shopMethods, [up, ["stock"], shopName]);
            if (action[0] == "🛒") {
              quantity = await scrollNumbers(up, shopMethods, [up, ["stock"], shopName], 0, "How many "+itemInList.name+" do you want to buy ?", 0, action[1]);
              if (quantity != 0) await purchaseItem(up, itemInShop, quantity, scrollNumbers, [up, shopMethods, [up, ["stock"], shopName], 0, "How many "+itemInList.name+" do you want to buy ?", 0, action[1]]);
            }
          }
          if (numAns == 0) {
            if (page != 1) {
              i -= (t+s+1)*4;
            } else {
              await shopMethods(up, ["stock"], shopName);
            }
            t = 0;
            s = 0;
          } else if (numAns == 10) {
            t = 0;
            s = 0;
          } else {
            return;
          }
          ans = "";
        }
      }
      var selEmoji = ["⬅"];
      for (var j= t- (t%9); j<t; j++) {
        selEmoji.push(selectionEmoji2[j+1]);
      }
      selEmoji.splice(0, 1);
      selEmoji.push("🏠");
      emAns = await notify(up, ans, 0x000000, "", "🛒", selEmoji);
      emAns = emAns[0];
      numAns = parseInt(emojiToNum(emAns));
      if (numAns == 0) {
        await shopMethods(up, ["stock"], shopName);
      }
      if (numAns == 11) {
        return;
      } else {
        itemInShop = sil[outputList[numAns+((page-1)*9)-1]];
        itemName = itemInShop[0];
        itemInList = items[itemName];

        action = await inspectItemShop(up, itemInList, itemInShop, shopMethods, [up, ["stock"], shopName]);
        if (action[0] == "🛒") {
          quantity = await scrollNumbers(up, shopMethods, [up, ["stock"], shopName], 0, "How many "+itemInList.name+" do you want to buy ?", 0, action[1]);
          if(quantity != 0) await purchaseItem(up, itemInShop, quantity, shopMethods, [up, ["stock"], shopName], 0, "How many "+itemInList.name+" do you want to buy ?", 0, action[1]);
        }
      }
      break;
    case "sell":
      showInv(up, "sell", true, ["food","exchange","energy"]);
      break;
    case "selling":
      emAns = await notify(up, "Are you shure you want to sell **"+am[2]+am[1].name+"** ?\nThe shopkeeper will pay **"+am[4]+items[am[3]].name+"**.", 0x000000, "", "❓", ["❌","✅"]);
      emAns = emAns[0];
      if (emAns == "❌") {
        await showInv(up, "sell");
        return;
      }
      if (!hasItem(up, am[1].id, am[2])){
        await notify(up, "You **don't** have **"+am[2]+" "+am[1].name+"** in your inventory.", 0xFF0000);
        return;
      }
      await trashItem(up, am[1].id, am[2]);
      await giveItem(up, am[3], am[4]);
      break;
    case "nothing":
    break;
    default:
  }
}

async function classItemByTypes(ita, filtering = false, filter = ["food","energy","exchange"]) {
  lts = {}
  for (var i in itemsTypes) {
    lts[itemsTypes[i].id] = [itemsTypes[i].name,"sep"];
  }
  for (var i in ita) {
    cat = items[ita[i]].type;
    lts[cat].push(ita[i]);
    lts[cat].push(i);
  }
  for (var i in lts) {
    if (lts[i].length == 2) lts[i] = [];
  }
  flist = [];
  for (var i in lts) {
    flist = flist.concat(lts[i]);
  }

  if (filtering == true) {
    flist = [];
    for (var i in filter) {
      flist = flist.concat(lts[filter[i]]);
    }
  }
  return flist;
}
