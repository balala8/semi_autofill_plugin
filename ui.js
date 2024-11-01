// Create the floating icon element
var icon = document.createElement('div');
icon.style.width = '50px';
icon.style.height = '50px';
icon.style.backgroundColor = '#f39c12';
icon.style.position = 'fixed';
icon.style.left = '500px';
icon.style.top = '500px';
icon.style.borderRadius = '50%';
icon.style.cursor = 'pointer';
icon.style.zIndex = '1000';
icon.style.display = 'flex';
icon.style.alignItems = 'center';
icon.style.justifyContent = 'center';
icon.style.fontSize = '24px'; // Set the font size for the emoji
icon.style.transition = 'left 0.3s, top 0.3s';

// Add an emoji as the icon
icon.innerText = '🚀'; // 选择合适的 Emoji，例如一个铃铛符号

document.body.appendChild(icon);

// Variables for dragging
var isDragging = false;
var hasMoved = false;
var startX, startY, initialLeft, initialTop;

// Array to record the last positions and timestamps
var positions = [];
var maxPositions = 5; // Number of positions to keep for speed calculation

// Variables for click and double-click
var clickTimeout = null;
var clickDelay = 250;

// Predetermined speed threshold for auto-hide (pixels per millisecond)
var speedThreshold = 0.5;

// Hide percentage threshold (e.g., 50% of the icon will be hidden)
var hidePercentage = 0.3; // 50%

// Mouse down event to start dragging
icon.addEventListener('mousedown', function (e) {
  isDragging = true;
  hasMoved = false;
  startX = e.clientX;
  startY = e.clientY;
  initialLeft = parseFloat(icon.style.left);
  initialTop = parseFloat(icon.style.top);
  positions = [{ x: startX, y: startY, time: Date.now() }];
  icon.style.transition = 'none'; // Remove transition during dragging
  e.preventDefault();
});

// Mouse move event to drag the icon
document.addEventListener('mousemove', function (e) {
  if (isDragging) {
    var deltaX = e.clientX - startX;
    var deltaY = e.clientY - startY;

    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
      hasMoved = true;
    }

    icon.style.left = initialLeft + deltaX + 'px';
    icon.style.top = initialTop + deltaY + 'px';

    // Record the current position and timestamp
    positions.push({ x: e.clientX, y: e.clientY, time: Date.now() });

    // Keep only the last 'maxPositions' records
    if (positions.length > maxPositions) {
      positions.shift();
    }
  }
});

// Mouse up event to stop dragging
document.addEventListener('mouseup', function (e) {
  if (isDragging) {
    isDragging = false;
    icon.style.transition = 'left 0.3s, top 0.3s'; // Restore transition

    // Calculate the speed based on the last positions
    if (positions.length >= 2) {
      var firstPos = positions[0];
      var lastPos = positions[positions.length - 1];
      var dx = lastPos.x - firstPos.x;
      var dt = lastPos.time - firstPos.time || 1; // Avoid division by zero

      var speedX = dx / dt; // pixels per millisecond

      // Get icon's current position
      var rect = icon.getBoundingClientRect();
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      var iconWidth = icon.offsetWidth;
      var iconHeight = icon.offsetHeight;

      // Auto-hide to left or right edge
      if (Math.abs(speedX) > speedThreshold) {
        if (speedX < 0) {
          // Moving left, hide to left edge
          icon.style.left = -iconWidth * hidePercentage + 'px';
        } else {
          // Moving right, hide to right edge
          icon.style.left = windowWidth - iconWidth * (1 - hidePercentage) + 'px';
        }
      } else {
        // Not moving fast enough, hide to the closest edge
        if (rect.left + rect.width / 2 < windowWidth / 2) {
          // Closer to left edge
          icon.style.left = -iconWidth * hidePercentage + 'px';
        } else {
          // Closer to right edge
          icon.style.left = windowWidth - iconWidth * (1 - hidePercentage) + 'px';
        }
      }

      // Ensure icon's top position stays within window bounds
      if (rect.top < 0) {
        icon.style.top = '0px';
      } else if (rect.bottom > windowHeight) {
        icon.style.top = windowHeight - rect.height + 'px';
      }
    }

    positions = []; // Clear positions after handling
  }
});

// Function to check if the icon is partially hidden
function isHidden() {
  var rect = icon.getBoundingClientRect();
  return rect.left < 0 || rect.right > window.innerWidth;
}

// Mouse over event to show the hidden part
icon.addEventListener('mouseover', function () {
  if (isDragging) {
    return;
  }
  if (isHidden()) {
    icon.style.transition = 'left 0.3s, top 0.3s';
    var rect = icon.getBoundingClientRect();
    var iconWidth = icon.offsetWidth;
    var windowWidth = window.innerWidth;

    if (rect.left < 0) {
      icon.style.left = '0px';
    }
    if (rect.right > windowWidth) {
      icon.style.left = windowWidth - iconWidth + 'px';
    }
  }
});

// Mouse out event to re-hide the icon
icon.addEventListener('mouseout', function () {
  var rect = icon.getBoundingClientRect();
  var iconWidth = icon.offsetWidth;
  var windowWidth = window.innerWidth;

  if (rect.left <= 0) {
    icon.style.left = -iconWidth * hidePercentage + 'px';
  }
  if (rect.right >= windowWidth) {
    icon.style.left = windowWidth - iconWidth * (1 - hidePercentage) + 'px';
  }
});

// Click event to handle single and double clicks
icon.addEventListener('click', function (e) {
  // If the icon was dragged, do not process click events
  if (hasMoved) {
    hasMoved = false;
    return;
  }

  if (clickTimeout !== null) {
    // Double-click detected
    clearTimeout(clickTimeout);
    clickTimeout = null;
    alert('完成双击事件');
  } else {
    clickTimeout = setTimeout(function () {
      // Single click action
      window.open('about:blank', '_blank'); // Open a new page
      clickTimeout = null;
    }, clickDelay);
  }
});
