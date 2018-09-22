var selectionEmoji = ["⬅","🐸","🐼","🐷","🐱","🐶","🐵","🐭","🦊","🐔","➡","🏠"];
var selectionEmoji4 = ["⬅","🇦","🇧","🇨","🇩","🇪","🇫","🇬","🇭","🇮","➡","🏠"];
var selectionEmoji3 = ["⬅","♑","♈","♉","♊","♋","♌","♍","♎","♏","➡","🏠"];
var selectionEmoji2 = ["⬅","1⃣","2⃣","3⃣","4⃣","5⃣","6⃣","7⃣","8⃣","9⃣","➡","🏠"]; // this is the one currently used almost everywhere in the code.

function numToEmoji(num) {
  var number = JSON.stringify(num).split('');
  var emojis = [];
  for(var i in number) {
    switch(number[i]) {
      case "0": emojis.push(":zero:");
      break;
      case "1": emojis.push(":one:");
      break;
      case "2": emojis.push(":two:");
      break;
      case "3": emojis.push(":three:");
      break;
      case "4": emojis.push(":four:");
      break;
      case "5": emojis.push(":five:");
      break;
      case "6": emojis.push(":six:");
      break;
      case "7": emojis.push(":seven:");
      break;
      case "8": emojis.push(":eight:");
      break;
      case "9": emojis.push(":nine:");
      break;
    }
  }
  return emojis.reduce((a, b) => a + b, 0).slice(1);
}

function pickRandom(items) {
  return items[Math.floor(Math.random()*items.length)];
}

function keyName(parent, child) {
  for (var i in parent) {
    if (parent[i] == child) return i;
  }
}

function emojiToNum(emoji) {
  for (var i in selectionEmoji) {
    if (selectionEmoji[i] == emoji) return i;
    if (selectionEmoji2[i] == emoji) return i;
    if (selectionEmoji3[i] == emoji) return i;
  }
}

async function typeAnswer(up) {
  let guildy = bot.guilds.find("id", serverID);
  channel = guildy.channels.find("id", usrD[up.user.id].channel);
  content = "";
  const filter = msg=>{
    if (msg.author.id == up.user.id && message.content.length <= 250) content = msg.content;
    return msg.author.id == up.user.id && message.content.length <= 250;
  }

  await channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time']});
  return content;
}

async function timer(timersec, message = "", channelID) {
  switch(timersec) {
    case 3: imageUrl = "https://imgur.com/8OroBjU.gif";
    break;
    case 5: imageUrl = "https://imgur.com/SVgROWx.gif";
    break;
    case 10: imageUrl = "https://imgur.com/BGVMGH3.gif";
    break;
    case 15: imageUrl = "https://imgur.com/KGNNKDJ.gif";
    break;
    case 20: imageUrl = "https://imgur.com/CkCO0Dy.gif";
    break;
    case 30: imageUrl = "https://imgur.com/ghYF3Pq.gif";
    break;
    case 45: imageUrl = "https://imgur.com/LsjVn6K.gif";
    break;
  }
  var timerMessage = await notify("", message, 0x000000, [imageUrl,""], "🕑", ["nope"], false, 1, 90000, false, undefined, true, channelID);
  await timeout(timersec*1000);
  timerMessage.delete();
}


async function scrollNumbers(up, comeBack, cbparam, byDef = 0, sideNote = "", min = 0, max = 100000000) {
    message = await notify(up, sideNote+"\n```CSS\nanswer with a number between "+min+" and "+max+"\n```", 0x000000, "","⌨", "nope", false);
    comingBack = false;
    result = 0;
    const filter = m => {
      var regex = /^\d+$/;
      if (m.content == "back") {
        comingBack = true;
      }
      test = regex.test(m.content);
      if (test == true) {
        result = parseInt(m.content);
        test = (result >= min && result <= max);
        if(test == false) {
          notify(up, "Minimum is **"+min+"**. Maximum is **"+max+"**\nPlease retry", 0x000000, "", "❌", "nope", false);
        }
      }
      if (m.author.id != botID) {
        m.delete();
      }
      return test;
    }
    await channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] });
    message.delete();
    if (comingBack == true) {
      await comeBack(...cbparam);
      return 0;
    } else {
      return result;
    }
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
}

// thanks /u/BerryMods
function msToTime(ms) {
    let seconds = Math.floor(ms / 1000)
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)
    let days = Math.floor(hours / 24)
    let months = Math.floor(days / 30)
    let years = Math.floor(months / 12)
    if(seconds == 0) return "Just now!";
    if(minutes == 0) return `${seconds} seconds`;
    if(hours == 0) {
        seconds = seconds - (minutes * 60)
        return `${minutes} minutes ${seconds} seconds`;
    }else if(days == 0) {
        seconds = seconds - (minutes * 60)
        minutes = minutes - (hours * 60)
        return `${hours} hours ${minutes} minutes ${seconds} seconds`;
    }else if(months == 0) {
        seconds = seconds - (minutes * 60)
        minutes = minutes - (hours * 60)
        hours = hours - (days * 24)
        return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
    }else if(years == 0) {
        seconds = seconds - (minutes * 60)
        minutes = minutes - (hours * 60)
        hours = hours - (days * 24)
        days = days - (months * 30)
        return `${months} months ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
    } else {
        seconds = seconds - (minutes * 60)
        minutes = minutes - (hours * 60)
        hours = hours - (days * 24)
        days = days - (months * 30)
        months = months - (years * 12)
        return `${years} years ${months} months ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
    }
}
