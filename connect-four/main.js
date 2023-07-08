let ways = [
  [-1, 0],
  [1, 0],
  [0, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
  [1, 1],
];

let board = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

const matching = (crr, point, x, i) => {
  if (i == 0) return true;
  let pos = [crr[0] + ways[x][0], crr[1] + ways[x][1]];
  if (pos[0] >= 0 && pos[0] <= 6 && pos[1] >= 0 && pos[1] <= 5) {
    console.log(pos, i);
    if (board[pos[1]][pos[0]] === point) {
      return matching(pos, point, x, i - 1);
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const checkSibling = (crr = [], point) => {
  for (let i = 0; i < ways.length; i++) {
    let pos = [crr[0] + ways[i][0], crr[1] + ways[i][1]];
    if (pos[0] >= 0 && pos[0] < 7 && pos[1] >= 0 && pos[1] < 6) {
      console.log(pos);
      if (board[pos[1]][[pos[0]]] !== point) continue;
      if (matching(pos, point, i, 2)) return true;
    }
  }
};
