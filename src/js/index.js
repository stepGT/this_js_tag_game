const containerNode = document.getElementById('tag');
const itemsNodes = Array.from(containerNode.querySelectorAll('.item'));
const countItems = 16;
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

const matrix = getMatrix(itemsNodes.map((item) => Number(item.dataset.matrixId)));

setPositionItems(matrix);
