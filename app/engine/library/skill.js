let constructor = require('../constructor.js')
let helper = require('../helper.js')

function pushStatus(package, type = 'normal') {
  //Define
  let subject = package.subject
  let onStatus = package.onStatus
  let status = package.status
  let inherit = package.inherit
  let skillIndex = package.skillIndex

  //Abbreviate
  let store = subject.status[onStatus]

  if (type === 'stack') {
    let exist = store.findIndex(
      x => x.type === status.type && x.name === inherit.name
    )
    if (exist > -1) {
      store[exist].stack += 1
    } else {
      store.push(new constructor.status(status, inherit, skillIndex))
    }
  } else if (type === 'stackBleed') {
    let exist = store.findIndex(
      x => x.type === status.type && x.name === inherit.name
    )
    if (exist > -1) {
      store[exist].val += status.val
    } else {
      store.push(new constructor.status(status, inherit, skillIndex))
    }
  } else if (type === 'stackDD') {
    let exist = store.findIndex(
      x => x.type === status.type && x.name === inherit.name
    )
    if (exist > -1) {
      store[exist].val += status.val
    } else {
      store.unshift(new constructor.status(status, inherit, skillIndex))
    }
  } else if (type === 'replace') {
    let exist = store.some(
      x => x.type === status.type && x.name === inherit.name
    )
    if (exist) {
      store = store.filter(
        x => x.type !== status.type && x.name !== inherit.name
      )
    }
    store.push(new constructor.status(status, inherit, skillIndex))
  } else if (type === 'normal' || type === undefined) {
    if (status.type === 'dd') {
      store.unshift(new constructor.status(status, inherit, skillIndex))
    } else {
      store.push(new constructor.status(status, inherit, skillIndex))
    }
  }
  console.log('statuspush', type)
}

function removeStatus(package, type = 'all') {
  //Define
  let subject = package.subject

  if (type === 'all') {
    subject.status.onAttack = []
    subject.status.onReceive = []
    subject.status.onSelf = []
    subject.status.onState = []
  } else if (type === 'harmful') {
    //Remove Harmful
    subject.status.onAttack = subject.status.onAttack.filter(
      x => x.harmful === false
    )
    subject.status.onReceive = subject.status.onReceive.filter(
      x => x.harmful === false
    )
    subject.status.onSelf = subject.status.onSelf.filter(
      x => x.harmful === false
    )
    subject.status.onState = subject.status.onState.filter(
      x => x.harmful === false
    )
  } else if (type === 'specific') {
    let onStatus = package.onStatus
    let statusType = package.statusType
    let name = package.name
    subject.status[onStatus] = subject.status[onStatus].filter(
      x => !(x.type === statusType && x.name === name)
    )
  } else if (type === 'affliction') {
    let onStatus = package.onStatus
    let statusType = package.statusType
    let name = package.name
    subject.status[onStatus] = subject.status[onStatus].filter(
      x => !x.classes.some(s => s === 'affliction')
    )
  }
}

function charge(package) {
  //Define
  let subject = package.subject.status.onState
  let name = package.name
  let increment = package.increment
  let findCharge = subject.findIndex(
    x => x.type === 'charge' && x.name === name
  )
  let charge = subject[findCharge]
  if (increment === 'add') {
    charge.val += 1
  }
  if (increment === 'subtract') {
    charge.val -= 1
  }
}

function damage(package) {
  let subject = package.subject
  let val = package.val

  subject.hp -= val
}

function heal(package) {
  let subject = package.subject
  let val = package.val

  subject.hp += val
}

function checkStatus(payload) {
  let subject = payload.subject
  let onStatus = payload.onStatus
  let statusType = payload.statusType
  let statusName = payload.statusName

  //Check
  let check = subject.status[onStatus].some(
    x => x.type === statusType && x.name == statusName
  )
  return check
}

function stealEnergy(payload) {
  let energy = helper.stealEnergy(payload.theirEnergy)
  let amount = payload.amount

  if (energy !== false) {
    payload.theirEnergy[energy] -= amount
    payload.myEnergy[energy] += amount
  }
}

function removeEnergy(payload) {
  let energy = helper.stealEnergy(payload.theirEnergy)
  let amount = payload.amount

  if (energy !== false) {
    payload.theirEnergy[energy] -= amount
  }
}

function gainEnergy(payload) {
  let energy = helper.stealEnergy(payload.myEnergy)
  let amount = payload.amount

  if (energy !== false) {
    payload.myEnergy[energy] += amount
  }
}

function removeDD(payload) {
  let subject = payload.subject
  let status = payload.subject.status
  let nameId = subject.nameId

  status.onReceive = status.onReceive.filter(x => x.type !== 'dd')

  let myTeam = payload.state[payload.myTurn]
  myTeam.forEach(x => {
    x.status.onSelf = x.status.onSelf.filter(
      x => !(x.type === 'dd' && x.nameId === nameId)
    )
  })
}

function cooldownIncrease(payload) {
  let subject = payload.subject
  let skill = subject.skill

  skill.forEach(x => {
    if (x.counter > 0) {
      x.counter += 1
    }
  })
}

module.exports = {
  pushStatus,
  damage,
  heal,
  removeStatus,
  charge,
  checkStatus,
  stealEnergy,
  removeEnergy,
  removeDD,
  gainEnergy,
  cooldownIncrease
}
