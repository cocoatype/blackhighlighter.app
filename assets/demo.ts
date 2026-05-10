const canvas = document.querySelector("canvas");
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error("Canvas element not found");
}
const context = canvas.getContext("2d");
if (context === null) {
  throw new Error("Couldn't get canvas context");
}
const resetButton = document.querySelector(".demo button");
if ((resetButton instanceof HTMLButtonElement)) {
  resetButton.onclick = () => {
    redactions = [];
    requestAnimationFrame(drawDemo)
  };
}

const dpr = window.devicePixelRatio;
canvas.width = 360 * dpr;
canvas.height = 320 * dpr;
canvas.style.width = "360px";
canvas.style.height = "320px";
context.scale(dpr, dpr);

const style = window.getComputedStyle(document.documentElement)
const tarColor = style.getPropertyValue('--tar');
const paperColor = style.getPropertyValue('--paper');

let path = new Path2D();
let isDrawing = false;
let movePoint: Point | null = null;
let needsDisplay = false;

function setNeedsDisplay() {
  if (needsDisplay) return;
  needsDisplay = true;
  requestAnimationFrame(() => {
    needsDisplay = false;
    drawDemo();
  });
}

canvas.onpointerdown = (e) => {
  isDrawing = true;
  path.moveTo(e.offsetX, e.offsetY);
  setNeedsDisplay();
};

canvas.onpointerup = () => {
  isDrawing = false;
  findRedactions();
  path = new Path2D();
  setNeedsDisplay();
};

window.onpointerup = () => {
  if (!isDrawing) return;
  isDrawing = false;
  path = new Path2D();
  setNeedsDisplay();
};

canvas.onpointermove = (e) => {
  if (isDrawing) {
    path.lineTo(e.offsetX, e.offsetY);
  }

  movePoint = { x: e.offsetX, y: e.offsetY };
  setNeedsDisplay();
};

canvas.onpointercancel = () => {
  isDrawing = false;
  setNeedsDisplay();
}

function drawBackground() {
  if (context === null) { return }

  // draw the background
  context.beginPath();
  context.fillStyle = paperColor;
  context.roundRect(0, 0, 360, 320, 16);
  context.fill();

  // draw the toolbar
  context.beginPath();
  context.fillStyle = "#D9D6CF";
  context.roundRect(0, 0, 360, 34, [16, 16, 0, 0]);
  context.fill();

  // draw red dot
  context.beginPath();
  context.fillStyle = "#f87171";
  context.arc(17, 17, 5, 0, Math.PI * 2);
  context.fill();

  // draw yellow dot
  context.beginPath();
  context.fillStyle = "#fbbf24";
  context.arc(33, 17, 5, 0, Math.PI * 2);
  context.fill();

  // draw red dot
  context.beginPath();
  context.fillStyle = "#34d399";
  context.arc(49, 17, 5, 0, Math.PI * 2);
  context.fill();

  // clip the path
  context.beginPath();
  context.roundRect(0, 34, 360, 286, [0, 0, 16, 16]);
  context.clip();
}

type Rect = {
  x: number,
  y: number,
  width: number,
  height: number,
}

type Point = {
  x: number,
  y: number,
}

let boundingBoxes = new Array<Array<Rect>>()

const text = "From: cfo@example.com\nSubject: Q3 board update\n\nHi team! Please don't share the\nattached numbers outside of\nleadership channels.\n\nTotal Revenue: $12.3 million\nTotal Profit: $0.4 million\n\nThank you!";
const textLines = text.split("\n");

function drawText() {
  if (context === null) { return }

  context.fillStyle = tarColor;
  context.font = "16px ui-monospace, Menlo, monospace";

  let lineOffset = 46;
  const lineIndent = 12;

  if (boundingBoxes.length === 0) {
    const allBoundingBoxes = new Array<Array<Rect>>();
    for (const line of textLines) {
      const words = line.split(" ");
      let wordStart = 0;

      const lineMetrics = context.measureText(line);
      const baseline = lineOffset + lineMetrics.actualBoundingBoxAscent;

      let lineBoundingBoxes = new Array<Rect>();
      for (const word of words) {
        const xBefore = context.measureText(line.slice(0, wordStart)).width;
        const xAfter = context.measureText(line.slice(0, wordStart + word.length)).width;
        const m = context.measureText(word);
        lineBoundingBoxes.push({
          x: lineIndent + xBefore,
          y: baseline - m.actualBoundingBoxAscent,
          width: xAfter - xBefore,
          height: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent,
        });
        wordStart += word.length + 1;
      }
      allBoundingBoxes.push(lineBoundingBoxes);
      lineOffset += (lineMetrics.actualBoundingBoxAscent + lineMetrics.actualBoundingBoxDescent) + 8;
    }
    boundingBoxes = allBoundingBoxes;
  }

  lineOffset = 46;
  for (const line of textLines) {
    const lineMetrics = context.measureText(line);
    const baseline = lineOffset + lineMetrics.actualBoundingBoxAscent;
    context.fillText(line, lineIndent, baseline);
    lineOffset += (lineMetrics.actualBoundingBoxAscent + lineMetrics.actualBoundingBoxDescent) + 8;
  }
}

function drawBoundingBoxes() {
  if (context === null) { return }

  let movePath = new Path2D()
  if (movePoint !== null) {
    movePath.arc(movePoint.x, movePoint.y, 5, 0, Math.PI * 2);
    context.fillStyle = "#fbbf24"
    context.fill(movePath);
  }

  for (const lineBoundingBoxes of boundingBoxes) {
    for (const boundingBox of lineBoundingBoxes) {
      const boxCenter = center(boundingBox);
      let color = context.isPointInPath(movePath, boxCenter.x * dpr, boxCenter.y * dpr) ? "#34d399" : "#f87171"
      context.beginPath();
      context.lineWidth = 1
      context.fillStyle = `rgb(from ${color} r g b / 0.3)`
      context.strokeStyle = color

      context.rect(
        boundingBox.x,
        boundingBox.y,
        boundingBox.width,
        boundingBox.height,
      );
      context.fill();
      context.stroke();

      context.beginPath();
      context.fillStyle = color
      context.arc(boxCenter.x, boxCenter.y, 2, 0, Math.PI * 2);
      context.fill();
    }
  }
}

type Redaction = {
  line: number,
  words: Array<number>,
}
let redactions = new Array<Redaction>();
redactions.push({line: 7, words: [2, 3]});
redactions.push({line: 8, words: [2, 3]});

function minX(rect: Rect): number { return rect.x }
function maxX(rect: Rect): number { return rect.x + rect.width }
function minY(rect: Rect): number { return rect.y }
function maxY(rect: Rect): number { return rect.y + rect.height }

function center(rect: Rect): Point {
  return {x: (minX(rect) + maxX(rect)) / 2, y: (minY(rect) + maxY(rect)) / 2 }
}

function union(lhs: Rect, rhs: Rect): Rect {
  const finalMinX = Math.min(minX(lhs), minX(rhs));
  const finalMaxX = Math.max(maxX(lhs), maxX(rhs));
  const finalMinY = Math.min(minY(lhs), minY(rhs));
  const finalMaxY = Math.max(maxY(lhs), maxY(rhs));
  return {
    x: finalMinX,
    y: finalMinY,
    width: finalMaxX - finalMinX,
    height: finalMaxY - finalMinY,
  }
}

function drawRedactions() {
  if (context === null) { return }
  context.fillStyle = "black";
  context.strokeStyle = "black";
  context.lineWidth = 1;
  context.lineJoin = "bevel";
  context.lineCap = "butt";

  for (const redaction of redactions) {
    const lineIndex = redaction.line;
    if (lineIndex >= boundingBoxes.length) { continue }
    const lineBoxes = boundingBoxes[lineIndex];

    const [firstWord, ...restWords] = redaction.words;
    if (firstWord === undefined || firstWord >= lineBoxes.length) { continue };
    const firstWordBox = lineBoxes[firstWord];
    const redactionBox = restWords.reduce((result, nextWordIndex) => {
      if (nextWordIndex >= lineBoxes.length) { return result }
      const nextWordBox = lineBoxes[nextWordIndex];
      return union(result, nextWordBox);
    }, firstWordBox);

    context.beginPath();
    context.rect(
      redactionBox.x,
      redactionBox.y,
      redactionBox.width,
      redactionBox.height,
    );
    context.fill();
    context.stroke();
  }
}

function drawPath() {
  if (isDrawing === false || context === null) { return }
  context.strokeStyle = "black";
  context.lineWidth = 10;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.stroke(path);
}

function drawDemo() {
  if (context === null) { return }
  context.clearRect(0, 0, 360, 320)
  context.save()
  drawBackground()
  drawText()
  // drawBoundingBoxes()
  drawRedactions()
  drawPath()
  context.restore()
}

function findRedactions() {
  if (context === null) { return; }
  context.lineWidth = 10;
  context.lineJoin = "round";
  context.lineCap = "round";

  const newRedactions: Redaction[] = [];

  for (const [lineIdx, lineBoxes] of boundingBoxes.entries()) {
    const hitWords: number[] = [];
    for (const [wordIdx, box] of lineBoxes.entries()) {
      const c = center(box);
      if (context.isPointInStroke(path, c.x * dpr, c.y * dpr)) {
        hitWords.push(wordIdx);
      }
    }
    if (hitWords.length > 0) newRedactions.push({ line: lineIdx, words: hitWords });
  }

  redactions.push(...newRedactions);
}

requestAnimationFrame(drawDemo);
