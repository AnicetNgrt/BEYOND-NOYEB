fMobs = {
  mafiaAndroid: {
    name: "🤖Mafia's android",
    condition: up => {
      return userCurrentLocation(up, "AT") == "catharsaCity";
    },
    id : "mafiaAndroid",
    rewards: [
      [10,100,"credit"],[0,5,"deuterium"],[0,2,"scrapMetal"]
    ],
    xp: 40,
    summon: function (up, level) {
      this.name = "🕶Mafia's android";
      this.level = level;
      this.id = "mafiaAndroid";
      this.picture = pickRandom(["https://imgur.com/82Klck8.png"]);
      this.hp = 4+Math.floor((this.level*this.level)*0.5);
      this.phases = [
        {
          hp: 0,
          dialogues: [
            "** M-MUST K-KILL **"
          ],
          attacks: [
            maj.aa,
            maj.ab,
            maj.ac
          ]
        }
      ];
    }
  },
  mafiaGunslinger: {
    name: "🎻Mafia's gunslinger",
    condition: up => {
      return userCurrentLocation(up, "AT") == "catharsaCity";
    },
    id : "mafiaGunslinger",
    rewards: [
      [10,70,"credit"],[0,9,"wine"],[0,1,"oil"]
    ],
    xp: 50,
    summon: function (up, level) {
      this.name = "🎻Mafia's gunslinger";
      this.level = level;
      this.id = "mafiaGunslinger";
      this.picture =  pickRandom(["https://imgur.com/8zuHwmM.png"]);
      this.hp = 3+Math.floor((this.level*this.level)*0.5);
      this.phases = [
        {
          hp: 0,
          dialogues: [
            "**Hello you, do you mind if I start playing some sweet violin tracks ?**"
          ],
          attacks: [
            maj.ad
          ]
        }
      ];
    }
  },
  mafiaLieutnant: {
    name: "🎩Mafia's lieutnant",
    condition: up => {
      return userCurrentLocation(up, "AT") == "catharsaCity";
    },
    id : "mafiaLieutnant",
    rewards: [
      [100,700,"credit"],[10,20,"cheese"],[0,2,"uvShell"]
    ],
    xp: 200,
    summon: function (up, level) {
      this.name = "🎩Mafia's lieutnant";
      this.level = level;
      this.id = "mafiaLieutnant";
      this.picture = "https://imgur.com/BbmypKh.png";
      this.hp = 35+Math.floor((this.level*this.level)*2);
      this.phases = [
        {
          hp: 66,
          dialogues: [
            "**Duel me if you dare !**",
            "**Council's tads like you are meaningless.**"
          ],
          attacks: [
            maj.ml1
          ]
        },
        {
          hp: 33,
          dialogues: [
            "**You are strong but do not underestimate Sabovis mafia's power for too long...**",
            "**Mwahahahaa I feel no pain from you ! **"
          ],
          attacks: [
            maj.ml2
          ]
        },
        {
          hp: 0,
          dialogues: [
            "**Mere schnitzol ! You won't defeat the Sabovis mafia ever ! Die you fool !**",
            "**Burn in Hell you mere council's toy !**"
          ],
          attacks: [
            maj.ml3
          ]
        }

      ];
    }
  }
};


mobsPlaylists = [
  {
    name: "**🏙In the streets** |LVL **1-2**|3 mobs|0 boss|",
    content: [["mafiaAndroid",1],["mafiaAndroid",1],["mafiaAndroid",2]]
  },
  {
    name: "**🎩Mafia's androids** |LVL **1-4**|10 mobs|0 boss|",
    content: [["mafiaAndroid",1],["mafiaAndroid",1],["mafiaAndroid",1],["mafiaAndroid",2],["mafiaAndroid",2],["mafiaAndroid",2],["mafiaAndroid",2],["mafiaAndroid",3],["mafiaAndroid",3],["mafiaAndroid",4],["mafiaAndroid",4]]
  },
  {
    name: "**🏙Mafia's hideout** |LVL **5**|0 mobs|1 boss|",
    content: [["mafiaLieutnant",1]]
  },
  {
    name: "**🎩Mafia's androids** |LVL **6-8**|13 mobs|0 boss|",
    content: [["mafiaAndroid",6],["mafiaAndroid",6],["mafiaAndroid",6],["mafiaAndroid",6],["mafiaAndroid",7],["mafiaAndroid",7],["mafiaAndroid",7],["mafiaAndroid",7],["mafiaAndroid",8],["mafiaAndroid",8],["mafiaAndroid",8],["mafiaAndroid",8],["mafiaAndroid",8],["mafiaAndroid",8]]
  }
];

mobsAtt = {
    aa: ["🎩","🎻","⚙","🔧",5, 1.1],
    ab: ["🔩","🔈","📻","🎩",5, 1.1],
    ac: ["🔫","📟","💾","📡","🔗","📺",5, 1.1],
    ad: ["🎩","🔫","🎻","🧥",15, 0.9],
    ml1: ["🎩","🎻","🔫","💣",15, 1.3],
    ml2: ["🎩","🎻","🔫","💣",10, 1.4],
    ml3: ["🎩","🎻","🔫","💣",45, 0.8],
};


attTypes = [
  [ //can be done an infinite amount of times for each users
    async function message (up, channel, clue, time) {
      if (!usrD[up.user.id].channel) {
        await createChannelForUser(up);
      }
      var mess = await notify(up, clue, 0x000000, "", "➖", ["nope"], false);
      await timeout(time);
      mess.delete();
    }
  ],
  [ //can be done for each users
    async function nickname (up, channel, clue, time) {
      var before = up.nickname;
      await up.setNickname(clue).catch(()=>{
        attTypes[0][0](up, channel, clue, time);
      });
      await timeout(time);
      await up.setNickname(before);
    }
  ],
  [ //can't be done several times
    async function channelTopic (up, channel, clue, time) {
      await channel.setTopic(clue);
      await timeout(time);
      await channel.setTopic(up.user.id);
    }
  ]
];



maj = mobsAtt;
