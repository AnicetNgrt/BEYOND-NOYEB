
  items = {
    fakeAntena: {
      name: "🗼Fake antena",
      id: "fakeAntena",
      description: "Small antena given by Eddie in order to bypass Nanoteck's localisation service.",
      type: "quest"
    },
    antenaTicket: {
      name: "🎫Antena ticket",
      id: "antenaTicket",
      description: "Show this to Eddie and he will give you your antena",
      type: "quest"
    },
    brokenHeart: {
      name: "💔Broken heart",
      id: "brokenHeart",
      description: "Give this to anyone you don't want as a lover.",
      type: "exchange",
      usp: ["credit",1]
    },
    loveLetter: {
      name: "💌Love letter",
      id: "loveLetter",
      description: "Give this to an awesome individual.",
      type: "exchange",
      usp: ["credit",10]
    },
    deuterium: {
      name: servEmojis.deuterium+"Deuterium",
      id: "deuterium",
      description: "Heavy hydrogen",
      type: "energy",
      usp: ["credit",1],
      charge: 1
    },
    uvShell: {
      name: "🔋UV Shell",
      id: "uvShell",
      description: "Don't throw this at those little happy trees please.",
      type: "energy",
      usp: ["credit",20],
      charge: 10
    },
    credit: {
      name: "💵Credit(s)",
      id: "credit",
      description: "Solar system's currency",
      type: "exchange",
      usp: ["credit",1]
    },
    oil: {
      name: "🛢oil barrel",
      id: "oil",
      description: "Hot and greassy",
      type: "exchange",
      usp: ["credit",90]
    },
    nigiri: {
      name: "🍣nigiri",
      id: "nigiri",
      description: "Tasty",
      type: "food",
      usp: ["credit",10]
    },
    tempura: {
      name: "🍤tempura",
      id: "tempura",
      description: "Shrimp fritters",
      type: "food",
      usp: ["credit",15]
    },
    onigiri: {
      name: "🍙onigiri",
      id: "onigiri",
      description: "Fish and rice",
      type: "food",
      usp: ["credit",7]
    },
    rice: {
      name: "🍚rice bowl",
      id: "rice",
      description: "Schticky",
      type: "food",
      usp: ["credit",2]
    },
    fish: {
      name: "🐟In-vitro fish",
      id: "fish",
      description: "Grown indoor",
      type: "food",
      usp: ["credit",3]
    },
    seaweed: {
      name: "🌿Seaweed",
      id: "seaweed",
      description: "Smoke it everyday",
      type: "food",
      usp: ["credit",1]
    },
    steak: {
      name: "🥓In-vitro bacon",
      id: "steak",
      description: "Crispy",
      type: "food",
      usp: ["credit",5]
    },
    bento: {
      name: "🍱Bento box",
      id: "bento",
      description: "Your stomack prefers already classified food",
      type: "food",
      usp: ["credit", 18]
    },
    kiwi: {
      name: "🥝Kiwi",
      id: "kiwi",
      description: "Picked with love in Florinavia",
      type: "food",
      usp: ["credit",3]
    },
    wine: {
      name: "🍷Glass of wine",
      id: "wine",
      description: "\"Le fruit du travail, c'est boire son vin devant sa vigne.\"",
      type: "food",
      usp: ["credit",6]
    },
    croissant: {
      name: "🥐Croissant",
      id: "croissant",
      description: "France is my city",
      type: "food",
      usp: ["credit",1]
    },
    pineapple: {
      name: "🍍Pineapple",
      id: "pineapple",
      description: "I like memes",
      type: "food",
      usp: ["credit",10]
    },
    taco: {
      name: "🌮Taco",
      id: "taco",
      description: "I'm shure I can find a food description generator on the internet theses days.",
      type: "food",
      usp: ["credit",8]
    },
    cheese: {
      name: "🧀Cheese",
      id: "cheese",
      description: "Not from the Moon, sorry.",
      type: "food",
      usp: ["credit",4]
    },
    cookie: {
      name: "🍪Cookie",
      id: "cookie",
      description: "zi",
      type: "food",
      usp: ["credit",1]
    },
    scrapMetal: {
      name: servEmojis.scrapMetal+"Scrap Metal",
      id: "scrapMetal",
      description: "Raw material for most spacecrafts.",
      type: "vecm",
      usp: ["credit",10],
      efficiency: 100
    }

  }

  itemsActions = {
    give: {
      emoji: "🎁",
      code: async(up, itemName)=>{
        if (hasItem(up, itemName, 1)) {
          users = await createUsersArray(up, 2, true, "😶 Who do you want to give this item to ?", ["Giver","Recipient"]);
          quantity = await scrollNumbers(up, itemsActions.give.code, [up,itemName], 0, "How many units of "+items[itemName].name+" do you want to give to "+usrD[users[1].user.id].name+" ?", 0, usrD[up.user.id].inventory[itemName].quantity );
          transferItem(users[0],users[1],itemName,quantity);
        }
      },
      description: "Give this item to someone."
    },
    repairVec: {
      emoji: "🔧",
      code: async(up, itemName)=>{
        if (hasItem(up, itemName, 1)) {
          quantity = await scrollNumbers(up, itemsActions.repairVec.code, [up,itemName], 0, "How many units of "+items[itemName].name+" do you want to use in order to repair your spacecraft ?**\n**+"+items[itemName].efficiency+"**hp per unit.\nSpacecraft's hp: **"+usrD[up.user.id].vehicle.hp+"/"+vehicles[usrD[up.user.id].vehicle.name].hp+"**", 0, usrD[up.user.id].inventory[itemName].quantity );
          usrD[up.user.id].vehicle.hp += quantity*items[itemName].efficiency;
          usrD[up.user.id].vehicle.hp = usrD[up.user.id].vehicle.hp > vehicles[usrD[up.user.id].vehicle.name].hp ? vehicles[usrD[up.user.id].vehicle.name].hp : usrD[up.user.id].vehicle.hp;
          wtf();
        }
      },
      description: "Repair your spacecraft"
    }
  }


  itemsTypes = {
    exchange: {
      properties: {},
      use: [itemsActions.give],
      id: "exchange",
      name: "💼MISC"
    },
    energy: {
      properties: {},
      use: [itemsActions.give],
      id: "energy",
      name: "🔋ENERGY",
    },
    vecm: {
      properties: {},
      use: [
        itemsActions.give,
        itemsActions.repairVec
      ],
      id: "vecm",
      name: "🔧VEHICLE MAINTENANCE"
    },
    food: {
      properties: {},
      use: [itemsActions.give],
      id: "food",
      name: "🍣FOOD & COOKING"
    },
    quest: {
      properties: {},
      use: [],
      id: "quest",
      name: "🏅QUESTS"
    }
  }
