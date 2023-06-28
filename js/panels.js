let GridNodeType = {
  VGROUP: "vgroup",
  HGROUP: "hgroup",
  PANEL: "panel",
};

let g_rootNode;

export function initPanels() {
  loadPreset(1);
}

export function loadPreset(value) {
  if (value == 1) {
    g_rootNode = new GridNode(undefined, getUUID(), GridNodeType.VGROUP, 100);
    drawHtmlTree();
  } else if (value > 1 && value < 6) {
    buildSymetricGrid(value - 1, value - 1);
    drawHtmlTree();
  }
}

//////////////////////////////////////////
//////////////////////////////////////////

class GridNode {
  constructor(parent, id, type, sizePercentage) {
    this.id = id;
    this.parent = parent;
    this.type = type;
    this.sizePercentage = sizePercentage;
    this.children = [];
  }

  addChildren(child) {
    this.children.push(child);
  }

  removeChildren(id) {}

  rebuild(keepPercentage) {
    // when its percentage changed by user -> grow/shrink siblings to fit new percentage, and
    // propagate to children of all siblings including this one
  }

  drawRect(ctx, x, y, width, height, lineWidth, lineColor, ppi) {
    if (lineWidth > 0) {
      ctx.lineWidth = lineWidth * ppi;
      ctx.strokeStyle = lineColor;
      ctx.setLineDash([0, 0]);
      ctx.strokeRect(x * ppi, y * ppi, width * ppi, height * ppi);
    }
  }

  draw(ctx, x, y, width, height, gutterSize, lineWidth, lineColor, ppi) {
    if (this.type === GridNodeType.PANEL) {
      this.drawRect(ctx, x, y, width, height, lineWidth, lineColor, ppi);
    }
    // children
    let nodeX = x;
    let nodeY = y;
    for (let index = 0; index < this.children.length; index++) {
      const node = this.children[index];
      if (this.type === GridNodeType.VGROUP) {
        let nodeWidth = width;
        let nodeHeight =
          (node.sizePercentage / 100) *
          (height - (this.children.length - 1) * gutterSize);
        node.draw(
          ctx,
          nodeX,
          nodeY,
          nodeWidth,
          nodeHeight,
          gutterSize,
          lineWidth,
          lineColor,
          ppi
        );
        nodeY += nodeHeight + gutterSize;
      } else if (this.type === GridNodeType.HGROUP) {
        let nodeWidth =
          (node.sizePercentage / 100) *
          (width - (this.children.length - 1) * gutterSize);
        let nodeHeight = height;
        node.draw(
          ctx,
          nodeX,
          nodeY,
          nodeWidth,
          nodeHeight,
          gutterSize,
          lineWidth,
          lineColor,
          ppi
        );
        nodeX += nodeWidth + gutterSize;
      }
    }
  }
}

export function drawGrid(ctx, x, y, width, height) {
  const ppi = document.getElementById("ppi-input").value;
  const toInches =
    document.getElementById("units-select").value === "inches" ? 1 : 0.393701;
  const gutterSize =
    document.getElementById("panel-gutter-size-input").value * toInches;
  const lineWidth =
    document.getElementById("panel-line-width-input").value * toInches;
  const lineColor = document.getElementById("panel-line-color-input").value;
  g_rootNode.draw(
    ctx,
    x,
    y,
    width,
    height,
    gutterSize,
    lineWidth,
    lineColor,
    ppi
  );
}

function buildSymetricGrid(cols, rows) {
  g_rootNode = new GridNode(undefined, getUUID(), GridNodeType.VGROUP, 100);
  for (let y = 0; y < rows; y++) {
    let hgroup1 = new GridNode(
      g_rootNode,
      getUUID(),
      GridNodeType.HGROUP,
      100 / rows
    );
    g_rootNode.addChildren(hgroup1);
    for (let x = 0; x < cols; x++) {
      hgroup1.addChildren(
        new GridNode(g_rootNode, getUUID(), GridNodeType.PANEL, 100 / cols)
      );
    }
  }

  function getNodeFromId(node, id) {
    if (node.id === id) return node;
    for (let index = 0; index < node.children.length; index++) {
      if (getNodeFromId(node.children[index], id)) return node;
    }
    return undefined;
  }

  // rootNode = new GridNode(undefined, getUUID(), GridNodeType.VGROUP, 100);
  // rootNode.addChildren(
  //   new GridNode(rootNode, getUUID(), GridNodeType.PANEL, 50)
  // );

  // let hgroup1 = new GridNode(rootNode, getUUID(), GridNodeType.HGROUP, 50);
  // rootNode.addChildren(hgroup1);
  // hgroup1.addChildren(
  //   new GridNode(rootNode, getUUID(), GridNodeType.PANEL, 50)
  // );
  // hgroup1.addChildren(
  //   new GridNode(rootNode, getUUID(), GridNodeType.PANEL, 50)
  // );
}

//////////////////////////////////////////
//////////////////////////////////////////

// ref: https://developer.mozilla.org/en-US/docs/Web/API/Crypto
// ref: https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid/
function getUUID() {
  if (crypto.subtle) {
    return crypto.randomUUID();
  } else {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
}

//////////////////////////////////////////
//////////////////////////////////////////

let g_selectedNodeId;

function drawHtmlTree() {
  let rootElement = document.getElementById("panel-tree-root");
  rootElement.innerHTML = "";
  buildHtmlTree(g_rootNode, rootElement);
  return;
}

function buildHtmlTree(gridNode, htmlParent) {
  if (gridNode.type === GridNodeType.PANEL) {
    let li = document.createElement("li");
    htmlParent.appendChild(li);
    let panelButton = document.createElement("div");
    li.appendChild(panelButton);
    panelButton.classList = "panel-tree-panel-button";
    panelButton.textContent = "panel";
    panelButton.id = gridNode.id;
    panelButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    });
  } else {
    let li = document.createElement("li");
    htmlParent.appendChild(li);

    let details = document.createElement("details");
    li.appendChild(details);
    details.open = true;

    let summary = document.createElement("summary");
    details.appendChild(summary);
    summary.classList = "panel-tree-item";

    let summaryButton = document.createElement("div");
    summary.appendChild(summaryButton);
    summaryButton.classList = "panel-tree-summary-button";
    if (gridNode.type === GridNodeType.VGROUP) {
      summaryButton.textContent = "vertical group";
    } else {
      summaryButton.textContent = "horizontal group";
    }
    summaryButton.id = gridNode.id;
    summaryButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    });

    if (gridNode.children.length > 0) {
      let ul = document.createElement("ul");
      details.appendChild(ul);
      gridNode.children.forEach((childNode) => {
        buildHtmlTree(childNode, ul);
      });
    }
  }
}

//////////////////////////////////////////
//////////////////////////////////////////
