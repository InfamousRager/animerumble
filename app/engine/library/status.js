function boost(x) {
  return {
    name: x.name ? x.name : "Boost",
    val: x.val ? x.val : 10,
    type: "skill",
    active: x.active ? x.active : 2,
    modify: function(payload) {
      payload.val += this.val;
    },
    owner: x.owner
  };
}

function reduce(x) {
  return {
    name: x.name ? x.name : "Reduce",
    val: x.val ? x.val : 5,
    type: "skill",
    active: x.active ? x.active : 2,
    modify: function(payload) {
      payload.val -= this.val;
    },
    owner: x.owner
  };
}

function protect(x) {
  return {
    name: x.name ? x.name : "Protect",
    val: x.val ? x.val : 15,
    type: "skill",
    active: x.active ? x.active : 2,
    modify: function(payload) {
      payload.val -= this.val;
    },
    owner: x.owner
  };
}

function invincible(x) {
  return {
    name: x.name ? x.name : "invincible",
    val: 0,
    type: "invincible",
    active: x.active ? x.active : 2,
    owner: x.owner
  };
}

function stun(x) {
  return {
    name: x.name ? x.name : "stun",
    val: 0,
    type: "stun",
    active: x.active ? x.active : 2,
    modify: function(payload) {},
    owner: x.owner
  };
}

function heal(x) {
  return {
    name: x.name ? x.name : "heal",
    val: x.val ? x.val : 15,
    type: "self",
    active: x.active ? x.active : 2,
    modify: function(payload) {
      payload.offense.hp += this.val;
    },
    owner: x.owner
  };
}

function bleed(x) {
  return {
    name: x.name ? x.name : "bleed",
    val: x.val ? x.val : 5,
    type: "self",
    period: 'instant',
    active: x.active ? x.active : 3,
    modify: function(payload) {
      payload.offense.hp -= this.val;
    },
    owner: x.owner
  };
}

module.exports = {
    boost,
    protect,
    invincible,
    stun,
    heal,
    bleed,
    reduce
}