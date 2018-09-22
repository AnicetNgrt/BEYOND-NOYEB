
  npcList = {
    anicet: {
      name: "Anicet 🍣",
      id: "anicet",
      picture: "https://imgur.com/vLLZOVu.png",
      galery: {
      },
      welcomeMessage: "",
      helloMessage: "",
      condition: up => {
        return false;
      },
      quests: []
    },
    GameMaster: {
      name: "12-H",
      id: "GameMaster",
      picture: "https://imgur.com/pCNLSQn.png",
      galery: {
        sadique: "https://imgur.com/pCNLSQn.png",
        reproche: "https://imgur.com/pCNLSQn.png",
        sousLeChoc: "https://imgur.com/pCNLSQn.png",
        larmes: "https://imgur.com/pCNLSQn.png",
        attention: "https://imgur.com/pCNLSQn.png",
        peur: "https://imgur.com/pCNLSQn.png",
        rassurée: "https://imgur.com/pCNLSQn.png"
      },
      welcomeMessage: "",
      helloMessage: "",
      condition: up => {
        return false;
      },
      quests: []
    },
    Eddie: {
      name: "Eddie",
      id: "Eddie",
      picture: "https://i.imgur.com/34GEAcf.png",
      welcomeMessage: "I've been watching you and your android carefully for a few days, and now that you have come closer to me I can confirm that you must desire to do some modifications on it...",
      helloMessage: "Salut l'ami !",
      condition: up => {
        return userCurrentLocation(up, "AT") == "catharsaCity";
      },
      choiceAnswer: "meet_Eddie",
      meeting: "meet_Eddie",
      quests: ["Eddie0"]
    },
    MathiewPhat: {
      name: "Mathiew Phat",
      id: "MathiewPhat",
      picture: "https://i.imgur.com/VZrTlFS.png",
      bfqTexte: "Hi ! Welcome in my ship parts shop ! What do you need sir ?",
      welcomeMessage: "",
      helloMessage: "Hello my dude, how are you ? So, what do you need, ? Take your time.",
      condition: up => {
        return userCurrentLocation(up, "AT") == "catharsaCity";
      },
      choiceAnswer: "shop_MathiewPhat",
      meeting: "meet_MathiewPhat",
      quests: []
    }
  }
