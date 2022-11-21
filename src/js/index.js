const containerNode = document.getElementById('tag');
const itemsNodes = Array.from(containerNode.querySelectorAll('.item'));
const countItems = 16;
const winFlatArray = new Array(16).fill(0).map((_, ind) => ++ind);
// Hide 16 element
itemsNodes[countItems - 1].style.display = 'none';
//
if (itemsNodes.length !== countItems) {
  throw new Error(`${countItems} items in HTML!`);
}

const getMatrix = (arr) => {
  const matrix = [[], [], [], []];
  let x = 0;
  let y = 0;
  //
  for (let i = 0; i < arr.length; i++) {
    if (x >= 4) {
      y++;
      x = 0;
    }
    matrix[y][x] = arr[i];
    x++;
  }
  return matrix;
};

const setPositionItems = (matrix) => {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const value = matrix[y][x];
      const node = itemsNodes[value - 1];
      setNodeStyles(node, x, y);
    }
  }
};

const setNodeStyles = (node, x, y) => {
  const shiftPS = 100;
  node.style.transform = `translate3D(${x * shiftPS}%, ${y * shiftPS}%, 0)`;
};

const shuffleArray = (arr) => {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const findCoordByNumber = (number, matrix) => {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === number) return { x, y };
    }
  }
  return null;
};

const isValidToSwap = (coord1, coord2) => {
  const diffX = Math.abs(coord1.x - coord2.x);
  const diffY = Math.abs(coord1.y - coord2.y);
  return (diffX === 1 || diffY === 1) && (coord1.x === coord2.x || coord1.y === coord2.y);
};

const isWon = (matrix) => {
  const flatMatrix = matrix.flat();
  //
  for (let i = 0; i < winFlatArray.length; i++) {
    if (flatMatrix[i] !== winFlatArray[i]) {
      return false;
    }
  }
  return true;
};

const addWonClass = () => {
  setTimeout(() => {
    containerNode.classList.add('tagWin');
    setTimeout(() => {
      containerNode.classList.remove('tagWin');
    }, 1000);
  }, 200);
};

const swap = (coord1, coord2, matrix) => {
  const coord1Number = matrix[coord1.y][coord1.x];
  matrix[coord1.y][coord1.x] = matrix[coord2.y][coord2.x];
  matrix[coord2.y][coord2.x] = coord1Number;
  if (isWon(matrix)) addWonClass();
};

let matrix = getMatrix(itemsNodes.map((item) => Number(item.dataset.matrixId)));

setPositionItems(matrix);

document.getElementById('shuffle').addEventListener('click', () => {
  const shuffledArray = shuffleArray(matrix.flat());
  matrix = getMatrix(shuffledArray);
  setPositionItems(matrix);
});

containerNode.addEventListener('click', (e) => {
  const buttonNode = e.target.closest('button');
  if (!buttonNode) return;
  const buttonNumber = Number(buttonNode.dataset.matrixId);
  const buttonCoords = findCoordByNumber(buttonNumber, matrix);
  const blankCoords = findCoordByNumber(countItems, matrix);
  const isValid = isValidToSwap(buttonCoords, blankCoords);
  //
  if (isValid) {
    swap(blankCoords, buttonCoords, matrix);
    setPositionItems(matrix);
  }
});

window.addEventListener('keydown', (e) => {
  if (!e.key.includes('Arrow')) return;
  const blankCoords = findCoordByNumber(countItems, matrix);
  console.log(blankCoords);
  const buttonCoords = {
    x: blankCoords.x,
    y: blankCoords.y,
  };
  const direction = e.key.split('Arrow')[1].toLocaleLowerCase();
  //
  switch (direction) {
    case 'up':
      buttonCoords.y += 1;
      break;
    case 'down':
      buttonCoords.y -= 1;
      break;
    case 'left':
      buttonCoords.x += 1;
      break;
    case 'right':
      buttonCoords.x -= 1;
      break;
  }
  if (
    buttonCoords.y >= matrix.length ||
    buttonCoords.y < 0 ||
    buttonCoords.x >= matrix.length ||
    buttonCoords.x < 0
  ) {
    return;
  }
  swap(blankCoords, buttonCoords, matrix);
  setPositionItems(matrix);
});
