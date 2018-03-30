let constructor = require("../constructor.js");

let status = {
  invincible: {
    name: "invincible",
    val: 0,
    type: "invincible",
    active: 1
  },   
  stun: {
    name: "stun",
    val: 0,
    type: "stun",
    active: 2,
    modify: function(payload) {      
    }
  },
  protect: {
    name: "protect",
    val: 10,
    type: "skill",
    active: 2,
    modify: function(payload) {      
      payload.val -= this.val;
    }
  },
};

let skills = {
  skill1: {
    name: "Rasengan",
    type: "attack",
    val: 5,
    cooldown: 1,
    move: function(payload) {
      payload.target.hp -= payload.val;      
      payload.target.status.onState.push(
        new constructor.status(status.stun)
      );     
    }
  },
  skill2: {
    name: "Mass Shadow Clones",
    type: "attack",
    val: 25,
    cooldown: 2,    
    target: 'ally',
    move: function(payload) {
      payload.target.status.onReceive.push(
        new constructor.status(status.protect)
      );
    }
  },
  skill3: {
    name: "Shadow Clone Counter",
    type: "attack",
    val: 10,
    cooldown: 3,
    target: "enemy",
    move: function(payload) {
      payload.target.status.onSelf.push(
        new constructor.status(status.steroids)
      );      
    }
  },
  skill4: {
    name: "Shadow Clone Save",
    type: "attack",
    val: 10,
    cooldown: 4,
    target: "self",
    move: function(payload) {
      payload.target.status.onState.push(
        new constructor.status(status.invincible)
      );
    }
  }
};

let character = {
  name: "Uzumaki Naruto",
  id: "uzumakiNaruto",
  hp: 100,
  skill: [
    new constructor.skill(skills.skill1),
    new constructor.skill(skills.skill2),
    new constructor.skill(skills.skill3),
    new constructor.skill(skills.skill4)
  ]
};

module.exports = character;