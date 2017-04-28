const calculateCellCorners = (
  { board: boardSize, canvas: canvasSize, canvasPadding, cell: cellSize },
  cellCornersStore
) => {
  let boardStartCorner = [0 + canvasPadding, 0 + canvasPadding]
  let boardEndCorner = [canvasSize - canvasPadding, canvasSize - canvasPadding]

  const getEndCornerFor = startCorner => [
    startCorner[0] + cellSize,
    startCorner[1] + cellSize
  ]

  let tempStartCorner = [...boardStartCorner]

  for (let index = 0; index < 9; index++) {
    let tempEndCorner = getEndCornerFor(tempStartCorner)

    if (tempEndCorner[0] > boardEndCorner[0]) {
      tempStartCorner[0] -= boardSize
      tempStartCorner[1] += cellSize

      tempEndCorner = getEndCornerFor(tempStartCorner)
    }

    cellCornersStore[index] = [[...tempStartCorner], [...tempEndCorner]]

    tempStartCorner[0] = tempEndCorner[0]
    tempStartCorner[1] = tempEndCorner[1] - cellSize
  }
}

class Canvas {
  constructor(size) {
    this.cellCornersStore = [[], [], [], [], [], [], [], [], []]

    calculateCellCorners(size, this.cellCornersStore)

    this.draw = {
      X: drawX,
      O: drawO
    }
  }

  static drawBoard(ctx, { board: boardSize, cell: cellSize, canvasPadding }) {
    let mark1 = cellSize + canvasPadding,
      mark2 = canvasPadding,
      mark3 = cellSize * 2 + canvasPadding,
      mark4 = boardSize + canvasPadding

    let lineWidthBackup = ctx.lineWidth
    ctx.lineWidth = 3

    ctx.moveTo(mark1, mark2)
    ctx.lineTo(mark1, mark4)
    ctx.moveTo(mark2, mark1)
    ctx.lineTo(mark4, mark1)
    ctx.moveTo(mark3, mark2)
    ctx.lineTo(mark3, mark4)
    ctx.moveTo(mark2, mark3)
    ctx.lineTo(mark4, mark3)
    ctx.stroke()

    ctx.lineWidth = lineWidthBackup
  }
}

const drawX = (ctx, corners, { cell: cellSize, cellPadding }) => {
  let startX = corners[0][0]
  let startY = corners[0][1]
  let endX = corners[1][0]
  let endY = corners[1][1]

  ctx.moveTo(startX + cellPadding, startY + cellPadding)
  ctx.lineTo(endX - cellPadding, endY - cellPadding)
  ctx.moveTo(startX - cellPadding + cellSize, startY + cellPadding)
  ctx.lineTo(endX + cellPadding - cellSize, endY - cellPadding)
  ctx.stroke()
}

const drawO = (ctx, corners, { cellPadding }) => {
  let centerX = (corners[0][0] + corners[1][0]) / 2
  let centerY = (corners[0][1] + corners[1][1]) / 2
  let radius = centerX - corners[0][0] - cellPadding

  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
  ctx.stroke()
}

module.exports = Canvas
