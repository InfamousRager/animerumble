const _ = require("lodash");

function skillApply(payload) {
  console.log(
    "apply",
    payload.target.name,
    payload.target.hp,
    payload.offense.skill[payload.skill].val
  );

  let package = {
    offense: payload.offense,
    target: payload.target,
    val: payload.offense.skill[payload.skill].val,
    skill: payload.skill,
    move: payload.offense.skill[payload.skill].move
  };
  if (payload.offense.status.onAttack.length > 0) {
    statusApply(package, package.move, "offense");
  } else {
    if (payload.target.status.onReceive.length > 0) {
      statusApply(package, package.move, "target");
    } else {
      payload.target = package.move(package);
    }
  }
  payload.offense.skill[payload.skill].state = "cooldown";

  return payload.target;
}

function statusApply(payload, move, owner) {
  function statusIterator(package, source, callback) {
    source.forEach((x, i, a) => {
      x.modify(package);
      if (i === a.length - 1) {
        callback(package, source, callback);
      }
    });
  }

  if (owner === "offense") {
    statusIterator(
      payload,
      payload.offense.status.onAttack,
      (payload, source, callback) => {
        console.log("test");
        if (payload.target.status.onReceive.length > 0) {
          statusIterator(
            payload,
            payload.target.status.onReceive,
            (payload, source, callback) => {
              move(payload);
            }
          );
        } else {
          move(payload);
        }
      }
    );
  } else {
    statusIterator(
      payload,
      payload.target.status.onReceive,
      (payload, source, callback) => {
        move(payload);
      }
    );
  }
}

function sequence(payload, store, callback) {
  console.log(store);
  let state = _.cloneDeep(store);
  state.turn = state.turn + 1;

  //Sequence
  payload.forEach(payload => {
    function team(owner) {
      let index = state.teamOdd.findIndex(x => x.name === owner);
      if (index > -1) {
        return state.teamOdd[index];
      } else {
        return state.teamEven[state.teamEven.findIndex(x => x.name === owner)];
      }
    }
    let offense = team(payload.offense);
    let target = team(payload.target);
    target = skillApply({
      offense: offense,
      target: target,
      skill: payload.skill
    });
  });

  //Post Sequence
  function postSequence(x, turn) {
    function pattern(source) {
      if (source.length > 0) {
        source.forEach((s, t) => {
          source[t].name;
          source[t].active -= 1;
        });
        return source.filter(x => x.active > 0);        
      } else {
        return [];
      }
    }

    if (state.turn % 2 === turn) {
      if (x.status.onSelf.length > 0) {
        x.status.onSelf.forEach((s, t) => {
          x.status.onSelf[t].active -= 1;
          x.status.onSelf[t].modify({ offense: x });
        });
        x.status.onSelf = x.status.onSelf.filter(x => x.active > 0);
      }
      x.status.onAttack = pattern(x.status.onAttack);
      x.status.onReceive = pattern(x.status.onReceive);
      x.status.onState = pattern(x.status.onState);
      x.skill.forEach(s => {
        if (s.state === "cooldown") {
          if (s.counter < s.cooldown) {
            s.counter += 1;
          } else {
            s.counter = 0;
            s.state = "active";
          }
        }
      });
    }
  }

  state.teamEven.forEach(x => {
    postSequence(x, 0);
  });
  state.teamOdd.forEach(x => {
    postSequence(x, 1);
  });

  callback(state);
}

module.exports = sequence;
