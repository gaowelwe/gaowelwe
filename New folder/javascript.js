<script>
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  // Estimated coordinates based on image (adjust if needed)
  const playerA = { x: 550, y: 1450 };     // Red bib (left)
  const playerB = { x: 2650, y: 1450 };    // Black & white (right)
  const ball = { x: 2026, y: 915 };        // Green cross

  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };

  function drawGrid(spacing = 100, color = '#333') {
    const width = canvas.width;
    const height = canvas.height;

    const startX = -offsetX / scale;
    const startY = -offsetY / scale;
    const endX = startX + width / scale;
    const endY = startY + height / scale;

    ctx.beginPath();
    for (let x = Math.floor(startX / spacing) * spacing; x < endX; x += spacing) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    for (let y = Math.floor(startY / spacing) * spacing; y < endY; y += spacing) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawLine(start, end, color) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function drawCross(point, color = 'lime', label = '') {
    const size = 10;
    ctx.beginPath();
    ctx.moveTo(point.x - size, point.y - size);
    ctx.lineTo(point.x + size, point.y + size);
    ctx.moveTo(point.x - size, point.y + size);
    ctx.lineTo(point.x + size, point.y - size);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    if (label) {
      ctx.font = '16px Arial';
      ctx.fillStyle = color;
      ctx.fillText(label, point.x + 8, point.y - 8);
    }
  }

  function calculateIntercepts(p, b) {
    const dx = b.x - p.x;
    const dy = b.y - p.y;

    if (dx === 0) {
      return {
        m: Infinity,
        c: null,
        xIntercept: { x: p.x, y: 0 },
        yIntercept: null
      };
    }

    const m = dy / dx;
    const c = p.y - m * p.x;
    const xIntercept = { x: -c / m, y: 0 };
    const yIntercept = { x: 0, y: c };

    return { m, c, xIntercept, yIntercept };
  }

  function drawScene() {
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
    ctx.clearRect(-offsetX / scale, -offsetY / scale, canvas.width / scale, canvas.height / scale);

    drawGrid(100);

    drawLine(playerA, ball, 'red');
    drawLine(playerB, ball, 'blue');
    drawCross(ball, 'lime', 'Ball');

    const aIntercepts = calculateIntercepts(playerA, ball);
    const bIntercepts = calculateIntercepts(playerB, ball);

    drawCross(aIntercepts.xIntercept, 'orange', 'A x-int');
    if (aIntercepts.yIntercept) drawCross(aIntercepts.yIntercept, 'orange', 'A y-int');

    drawCross(bIntercepts.xIntercept, 'aqua', 'B x-int');
    if (bIntercepts.yIntercept) drawCross(bIntercepts.yIntercept, 'aqua', 'B y-int');
  }

  function screenToWorld(x, y) {
    return {
      x: (x - offsetX) / scale,
      y: (y - offsetY) / scale
    };
  }

  // Zoom handler
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    const mouse = screenToWorld(e.offsetX, e.offsetY);
    scale *= e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
    offsetX = e.offsetX - mouse.x * scale;
    offsetY = e.offsetY - mouse.y * scale;
    drawScene();
  });

  // Drag-to-pan handlers
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStart = { x: e.clientX, y: e.clientY };
  });

  canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
      offsetX += e.clientX - dragStart.x;
      offsetY += e.clientY - dragStart.y;
      dragStart = { x: e.clientX, y: e.clientY };
      drawScene();
    }
  });

  canvas.addEventListener('mouseup', () => isDragging = false);
  canvas.addEventListener('mouseleave', () => isDragging = false);

  drawScene();
</script>