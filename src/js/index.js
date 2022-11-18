const containerNode = document.getElementById('tag');
const itemsNodes = Array.from(containerNode.querySelectorAll('.item'));
const countItems = 16;
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

const swap = (coord1, coord2, matrix) => {
  const coord1Number = matrix[coord1.y][coord1.x];
  matrix[coord1.y][coord1.x] = matrix[coord2.y][coord2.x];
  matrix[coord2.y][coord2.x] = coord1Number;
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
