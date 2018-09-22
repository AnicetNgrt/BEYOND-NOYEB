travelDamageProb = (vehicleName, energy, distance) =>  {
  vhc = vehicles[vehicleName];
  cat = vhc.category;
  over = energy > vhc.capacity ? (energy/vhc.capacity)*10 : (energy/vhc.capacity)*5;
  weigths = vehicleWeigths(cat);
  distImp = weigths[0]*distance;
  overImp = weigths[1]*over;
  return Math.round(15000/(200-(50-distImp-overImp)));
}

travelDamage = (vehicleName, energy, distance) => {
  vhc = vehicles[vehicleName];
  cat = vhc.category;
  over = energy > vhc.capacity ? (energy/vhc.capacity)*10 : (energy/vhc.capacity)*5;
  weigths = vehicleWeigths(cat);
  distImp = weigths[0]*distance;
  overImp = weigths[1]*over;
  lancé = randInt(50-distImp-overImp, 200);
  if (lancé<=10) {
    return randInt(900,999);
  }
  if (lancé<=20) {
    return randInt(800,899);
  }
  if (lancé<=30) {
    return randInt(700,799);
  }
  if (lancé<=40) {
    return randInt(400,699);
  }
  if (lancé<=50) {
    return randInt(100,399);
  }
}

function vehicleWeigths(cat) {
  switch(cat) {
    case "🌠Light fighter jet":
      distWeigth = 8;
      overWeigth = 8;
    break;
    case "⌚Voyager":
      distWeigth = 3;
      overWeigth = 5;
    break;
    case "🌐Orbital defense station":
      distWeigth = 9;
      overWeigth = 9;
    break;
    case "⛴Cargo spacecraft":
      distWeigth = 6;
      overWeigth = 12;
    break;
    case "🎩Cruise spacecraft":
      distWeigth = 8;
      overWeigth = 5;
    break;
    case "🎯Goliath spacecraft":
      distWeigth = 6;
      overWeigth = 5;
    break;
    case "🌊W.A.V Destroyer":
      distWeigth = 5;
      overWeigth = 2;
    break;
    case "🌌Research Destroyer":
      distWeigth = 5;
      overWeigth = 0;
    break;
  }
  return [distWeigth,overWeigth];
}


vehicleMethods = async (up, am) => {
    uvec = usrD[up.user.id].vehicle;
    switch(am[0]) {
      case "garage":
        vecName = uvec.name;
        await vehicleStats(up, vecName);
      break;
      case "deals":
      vlist = Object.values(vehicles);
      texte = "**🌠Light fighter jet:**\n";
      var t = 0;
      var page = 0;
      for (var i in vlist) {
        if (i>=1) {
          if (vlist[i].category != vlist[i-1].category) texte += "\n\n"+textSeparator+"\n**"+vlist[i].category+":**\n";
        }
        t++;
        texte += "\n\n"+selectionEmoji2[t]+"➖**"+vlist[i].name+"** | Price: **"+vlist[i].usp[1]+items[vlist[i].usp[0]].name+"**";
        if (t % 9 == 0 && i != 0) {
          page ++;
          emAns = await notify(up, texte, 0x000000, "", "🉐", selectionEmoji2);
          emAns = emAns[0];
          numAns = parseInt(emojiToNum(emAns));
          if (numAns != 0 && numAns < 10) {
            await vehicleMethods(up, ["specs",numAns+((page-1)*9)-1]);
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
      emAns = await notify(up, texte, 0x000000, "", "🉐", selEmoji);
      emAns = emAns[0];
      numAns = parseInt(emojiToNum(emAns));
      if (numAns == 0) {
        await vehicleMethods(up, ["deals"]);
      }
      if (numAns == 11) {
        return;
      } else {
        await vehicleMethods(up, ["specs",numAns]);
      }
      break;
      case "specs":
        vecName = Object.values(vehicles)[am[1]].id;
        await vehicleStats(up, vecName);
      break;
      case "buy":
        vec = Object.values(vehicles)[am[1]];
        previous = vehicles[usrD[up.user.id].vehicle.name];
        cn = vec.usp[0];
        cq = vec.usp[1];
        if (!hasItem(up, cn, cq)) {
          await notify(up, "You **don't** have **enougth "+items[cn].name+"** to buy this spacecraft.\nYou need **"+itemQuantityMissing(up, cn, cq)+" more**.", 0xFF0000);
          return;
        } else {
          await trashItem(up, cn, cq);
          await giveItem(up, previous.usp[0], previous.usp[1]);
          await notify(up, "**"+vec.name+" is now your current spacecraft**", 0x00FF00, vec.picture);
          usrD[up.user.id].vehicle = {
            name: vec.id,
            hp: vec.hp
          };
          wtf();
        }

      break;
      case "compute":
        if (uvec.hp <= 0) {
          await notify(up, "**Oops... Your vehicle has no more hp !**", 0xFF0000, "", "❌");
          return;
        }
        await showMap(up, vehicleMethods, [up, ["compute"]], "selectDestination");
        break;
      case "launch":
        let guildy = bot.guilds.find("id", serverID);
        destination = am[1];
        destinationRole = guildy.roles.find("name", destination.roleName);
        startingPointName = instances[userCurrentLocation(up, "AT")].roleName;
        userClRole = guildy.roles.find("name",startingPointName);
        distance = distanceFrom(up, destination.id);
        chargeForD = distance*5;
        maxCharge = vehicles[uvec.name].capacity;
        emAns = await notify(up, "**Destination: "+destination.name+"**\nDistance: **"+distance+"** SU\nRequired charge: **"+chargeForD+"**Tera Joules\nOverload threshold: **"+maxCharge+"**Tera Joules\n**You have "+travelDamageProb(uvec.name,chargeForD,distance)+"% chances to not take any damage.**",0x000000,"","📊",["❌","✅"]);
        if (emAns[0] == "❌") {
          return;
        } else if (emAns[0] == "✅") {
          passArray = "solo";
          if (vehicles[uvec.name].places > 1) {
            numberOfPassengers = await scrollNumbers(up, vehicleMethods, [up, am], 1, "How many people do you want to invite in your spacecraft (including you) ?", 1, vehicles[uvec.name].places);
            passengers = await createUsersArray(up, numberOfPassengers, true, "💺 Who do you want to invite as passengers ?", ["Captain","Crew member"]);
            crewChannel = await createGroupChannel(passengers, "Group"+randInt(1,100));
            emAns = await notify(up, "**Hi !**\nReal quick group notification right now.\n\n**"+usrD[up.user.id].name+" invited you all** to **embark in her/his spacecraft** to go for an amazing one way ticket to **"+destination.name+"**.\n"+textSeparator+"\nIf you want to embark react with ✅.\n"+textSeparator+"\nIf you don't, then do nothing.\n"+textSeparator+"\nℹ The takeoff of the spacecraft will take place when all the guests will have reacted, or if not, after 90 seconds.\n**"+usrD[up.user.id].name+" also needs to react, unless he wants the crew to leave without him.**\n\n👌 Take it or leave it !", 0x000000, "", "❗", ["✅"], true, passengers.length, 90000, false, undefined, true, crewChannel.id );
            passArray = emAns[1];
            crewChannel.delete();
          }
          if (passArray != "solo") {
            crewChannel = await createGroupChannel(passArray, usrD[up.user.id].name+"'s spacecraft "+randInt(1,100));
            mess = await notify(up, "**Waiting for "+usrD[up.user.id].name+" to charge the spacecraft...**", 0x000000, "", "❓", ["nope"], true, passengers.length, 90000, false, undefined, true, crewChannel.id );
            await chargeVehicle(up, chargeForD);
            usrD[up.user.id].vehicle.hp -= await travelDamage(uvec.name, chargeForD, distance);
            usrD[up.user.id].vehicle.hp = (usrD[up.user.id].vehicle.hp <= 0 || usrD[up.user.id].vehicle.hp == NaN) ? 0 : usrD[up.user.id].vehicle.hp;
            wtf();
            currentHp = uvec.hp;
            await notify(up, "**Let's go !**", 0x000000, "https://gifimage.net/wp-content/uploads/2018/06/warp-speed-gif-9.gif", "🚀", ["☄"], true, passArray.length, 6000, false, undefined, true, crewChannel.id );
            for (var i in passArray) {
              passArray[i].addRole(destinationRole);
              passArray[i].removeRole(userClRole);
            }
            await notify(up, "**👍You arrived at "+destination.name+" !**\n\n❤Spacecraft's hp: **"+currentHp+"/"+vehicles[uvec.name].hp+"**", 0x000000, "", "⚓", ["✅"], true, passArray.length, 60000, false, undefined, true, crewChannel.id );
            crewChannel.delete(10000);
          } else if (passArray == "solo") {
            await chargeVehicle(up, chargeForD);
            usrD[up.user.id].vehicle.hp -= await travelDamage(uvec.name, chargeForD, distance);
            usrD[up.user.id].vehicle.hp = (usrD[up.user.id].vehicle.hp <= 0 || usrD[up.user.id].vehicle.hp == NaN) ? 0 : usrD[up.user.id].vehicle.hp;
            wtf();
            currentHp = uvec.hp;
            await notify(up, "**Let's go !**", 0x000000, "https://gifimage.net/wp-content/uploads/2018/06/warp-speed-gif-9.gif");
            up.addRole(destinationRole);
            up.removeRole(userClRole);
            await notify(up, "**👍You arrived at "+destination.name+" !**\n\n❤Spacecraft's hp: **"+currentHp+"/"+vehicles[uvec.name].hp+"**", 0x000000, "", "⚓");
          }

        }
        break;
      default:
    }
}

vehicleChargePer = (up) => {
  return Math.round(100*(usrD[up.user.id].vehicle.charge / vehicles[usrD[up.user.id].vehicle.name].capacity));
}

chargeVehicle = async (up, chargeForD) => {
  charge = 0;
  while (charge < chargeForD) {
    superMessage = await notify(up, "**"+charge+"/"+chargeForD+"**",0x000000, "", "🔋", "nope", false, 1, 60000);
    ci = await showInv(up, "charge", true, ["energy"], true);
    quantity = await scrollNumbers(up, showInv, ["charge", true, ["energy"], true], 0, "**How many "+ci.name+"** do you want to charge your spacecraft with ?", 0, usrD[up.user.id].inventory[ci.id].quantity);
    await trashItem(up, ci.id, quantity);
    superMessage.delete();
    charge += ci.charge*quantity;
  }
  return true;
}

vehicleStats = async  (up, vecName) => {
    var vec = vehicles[vecName];
    for (var i in Object.values(vehicles)) {
      if(Object.values(vehicles)[i].id == vecName) {
        var vecNum = i;
        break;
      }
    }
    await notify(up, vec.name, 0x9EB6B8, vec.picture, "📷");
    var texte = "**";

    if (vecName != usrD[up.user.id].vehicle.name) texte += "📄"+vec.name+"'s stats:**\n";
    if (vecName == usrD[up.user.id].vehicle.name) texte += "📄Theses are your vehicle stats:**\n";

    texte += "\n"+textSeparator+"\n📋Name: **"+vec.name+"**\n\n🏷Category: **"+vec.category+"**\n\n⚙Manufacturer: **"+vec.brand+"**\n\n🔋Energy capacity: **"+vec.capacity+"** Tera Joules\n\n💺Seats: **"+vec.places+"**\n\n💕Max health points (hp): **"+vec.hp+"**";

    if (vecName == usrD[up.user.id].vehicle.name) texte += "\n\n"+textSeparator+"\n💉Current hp: **"+usrD[up.user.id].vehicle.hp+"**";
    if (vecName != usrD[up.user.id].vehicle.name) texte += "\n\n"+textSeparator+"\n💵Price: **"+vec.usp[1]+items[vec.usp[0]].name+"**";

    if (vecName == usrD[up.user.id].vehicle.name) {
      texte += "\n"+textSeparator+"\n⬅ Back to spacecraft list\n🏠 Back to menu\n🚀 Launch";
      emAns = await notify(up, texte, 0x9EB6B8, "", "ℹ", ["🏠","🚀"]);
    } else {
      texte += "\n"+textSeparator+"\n⬅ Back to spacecraft list\n🏠 Back to menu\n🛒 Purchase (sell and buy prices are equal)";
      emAns = await notify(up, texte, 0x9EB6B8, "", "ℹ", ["⬅","🏠","🛒"]);
    }
    emAns = emAns[0];
    if (emAns == "⬅") await vehicleMethods(up, ["deals"]);
    if (emAns == "🏠") {
      return;
    }
    if (emAns == "🛒") await vehicleMethods(up, ["buy",vecNum]);
    if (emAns == "🚀") await vehicleMethods(up, ["launch"]);
}
