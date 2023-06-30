/**
 * @license
 * Copyright 2023 Álvaro García
 * SPDX-License-Identifier: BSD-2-Clause
 */

import { drawTemplate } from "./draw.js";

let GridNodeType = {
  VGROUP: "vgroup",
  HGROUP: "hgroup",
  PANEL: "panel",
};

let g_rootNode;

export function initPanels() {
  loadPreset(1);

  // type select
  document
    .getElementById("panel-tree-selected-element-type-select")
    .addEventListener("change", function (event) {
      if (g_selectedNodeId) {
        const node = getGridNodeFromId(g_rootNode, g_selectedNodeId);
        if (node) {
          const type = document.getElementById(
            "panel-tree-selected-element-type-select"
          ).value;
          if (node.type === type) return;
          const id = node.id;
          const children = node.children;
          const parent = node.parent;
          const size = node.sizePercentage;
          let index;
          if (parent) {
            index = parent.getChildIndexFromId(id);
            parent.removeChildWithId(id);
          }
          if (type === GridNodeType.PANEL) {
            const newNode = new GridNode(parent, id, GridNodeType.PANEL, size);
            newNode.children = children;
            newNode.children.forEach((child) => {
              child.parent = newNode;
            });
            if (parent) {
              parent.addChildAtIndex(index, newNode);
            } else {
              g_rootNode = newNode;
            }
          } else {
            const newNode = new GridNode(
              parent,
              id,
              event.target.value === "vgroup"
                ? GridNodeType.VGROUP
                : GridNodeType.HGROUP,
              size
            );
            newNode.children = children;
            newNode.children.forEach((child) => {
              child.parent = newNode;
            });
            if (parent) {
              parent.addChildAtIndex(index, newNode);
            } else {
              g_rootNode = newNode;
            }
          }
          drawHtmlTree(id);
          document.getElementById(id).scrollIntoView();
          if (document.getElementById("autorefresh-checkbox").checked)
            drawTemplate();
        }
      }
    });

  // size input
  document
    .getElementById("panel-tree-selected-element-size-input")
    .addEventListener("change", function (event) {
      if (g_selectedNodeId) {
        const node = getGridNodeFromId(g_rootNode, g_selectedNodeId);
        if (node) {
          let percentage = document.getElementById(
            "panel-tree-selected-element-size-input"
          ).value;
          if (percentage < 0) percentage = 0;
          else if (percentage > 100) percentage = 100;
          if (!node.parent || node.parent.children.length <= 1)
            percentage = 100;
          node.sizePercentage = percentage;
          node.parent.recalculateChildrenSizes(node);
          drawHtmlTree(node.id);
          document.getElementById(node.id).scrollIntoView();
          if (document.getElementById("autorefresh-checkbox").checked)
            drawTemplate();
        }
      }
    });
  // add group button
  document
    .getElementById("panel-tree-selected-element-addgroup-button")
    .addEventListener("click", function () {
      if (g_selectedNodeId) {
        const node = getGridNodeFromId(g_rootNode, g_selectedNodeId);
        if (node) {
          node.addChild(
            new GridNode(node, getUUID(), GridNodeType.VGROUP, 100)
          );
          node.recalculateChildrenSizes();
          drawHtmlTree(g_selectedNodeId);
          if (document.getElementById("autorefresh-checkbox").checked)
            drawTemplate();
        }
      }
    });
  // add panel button
  document
    .getElementById("panel-tree-selected-element-addpanel-button")
    .addEventListener("click", function () {
      if (g_selectedNodeId) {
        const node = getGridNodeFromId(g_rootNode, g_selectedNodeId);
        if (node) {
          node.addChild(new GridNode(node, getUUID(), GridNodeType.PANEL, 100));
          node.recalculateChildrenSizes();
          drawHtmlTree(g_selectedNodeId);
          if (document.getElementById("autorefresh-checkbox").checked)
            drawTemplate();
        }
      }
    });
  // remove button
  document
    .getElementById("panel-tree-selected-element-remove-button")
    .addEventListener("click", function () {
      if (g_selectedNodeId) {
        const node = getGridNodeFromId(g_rootNode, g_selectedNodeId);
        if (node) {
          const nodeParent = node.parent;
          nodeParent.removeChildWithId(node.id);
          nodeParent.recalculateChildrenSizes();
          drawHtmlTree(nodeParent.id);
          document.getElementById(nodeParent.id).scrollIntoView();
          if (document.getElementById("autorefresh-checkbox").checked)
            drawTemplate();
        }
      }
    });
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

  addChild(child) {
    this.children.push(child);
  }

  addChildAtIndex(index, child) {
    // this.children = [
    //   ...this.children.slice(0, index),
    //   child,
    //   ...this.children.slice(index),
    // ];
    this.children.splice(index, 0, child);
  }

  removeChildWithId(id) {
    this.children = this.children.filter((e) => e.id !== id);
  }

  getChildIndexFromId(id) {
    for (let index = 0; index < this.children.length; index++) {
      const child = this.children[index];
      if (child.id === id) {
        return index;
      }
    }
    return undefined;
  }

  recalculateChildrenSizes(exceptNode) {
    let totalNum = this.children.length;
    let totalPercentage = 100;
    if (exceptNode) {
      totalNum -= 1;
      totalPercentage -= exceptNode.sizePercentage;
    }
    let childPercentage = totalPercentage / totalNum;
    for (let index = 0; index < this.children.length; index++) {
      const child = this.children[index];
      if (child === exceptNode) {
        continue;
      }
      child.sizePercentage = childPercentage;
    }
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
    let hgroup = new GridNode(
      g_rootNode,
      getUUID(),
      GridNodeType.HGROUP,
      100 / rows
    );
    g_rootNode.addChild(hgroup);
    for (let x = 0; x < cols; x++) {
      hgroup.addChild(
        new GridNode(hgroup, getUUID(), GridNodeType.PANEL, 100 / cols)
      );
    }
  }
}

function getGridNodeFromId(node, id) {
  if (node.id === id) return node;
  for (let index = 0; index < node.children.length; index++) {
    let result = getGridNodeFromId(node.children[index], id);
    if (result) return result;
  }
  return undefined;
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

function drawHtmlTree(selectedId) {
  g_selectedNodeId = g_rootNode.id;
  let rootElement = document.getElementById("panel-tree-root");
  rootElement.innerHTML = "";
  buildHtmlTree(g_rootNode, rootElement);
  if (selectedId) {
    setSelectedTreeElementFromId(selectedId);
  } else {
    setSelectedTreeElementFromId(g_rootNode.id);
  }
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
    if (gridNode.id === g_selectedNodeId)
      panelButton.classList.add("panel-tree-button-selected");
    panelButton.addEventListener("click", function (event) {
      handleTreeButtonClicked(panelButton);
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
    if (gridNode.id === g_selectedNodeId)
      summaryButton.classList.add("panel-tree-button-selected");
    summaryButton.addEventListener("click", function (event) {
      handleTreeButtonClicked(summaryButton);
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

function handleTreeButtonClicked(buttonElement) {
  if (buttonElement.id !== g_selectedNodeId) {
    setSelectedTreeElementFromId(buttonElement.id);
  }
}

function setSelectedTreeElementFromId(id) {
  document
    .getElementById(g_selectedNodeId)
    .classList.remove("panel-tree-button-selected");
  let selectedElement = document.getElementById(id);
  selectedElement.classList.add("panel-tree-button-selected");
  g_selectedNodeId = id;
  const node = getGridNodeFromId(g_rootNode, g_selectedNodeId);
  if (node) {
    // debug
    if (false) {
      document.getElementById("panel-tree-selected-element-debug").textContent =
        node.id;
      document
        .getElementById("panel-tree-selected-element-debug")
        .classList.remove("hidden");
    } else {
      document
        .getElementById("panel-tree-selected-element-debug")
        .classList.add("hidden");
    }
    // type
    document
      .querySelectorAll("#panel-tree-selected-element-type-select option")
      .forEach((opt) => {
        if (node.children.length > 0 && opt.value == "panel") {
          // nodes with children can't be converted to panels
          opt.disabled = true;
        } else {
          opt.disabled = false;
        }
      });
    document.getElementById("panel-tree-selected-element-type-select").value =
      node.type;
    // size
    if (node.parent === undefined) {
      document.getElementById(
        "panel-tree-selected-element-size-input"
      ).disabled = true;
    } else {
      document.getElementById(
        "panel-tree-selected-element-size-input"
      ).disabled = false;
    }
    document.getElementById("panel-tree-selected-element-size-input").value =
      node.sizePercentage;
    // add buttons
    if (node.type === GridNodeType.PANEL) {
      document
        .getElementById("panel-tree-selected-element-addgroup-button")
        .classList.add("panel-tree-button-disabled");
      document
        .getElementById("panel-tree-selected-element-addpanel-button")
        .classList.add("panel-tree-button-disabled");
    } else {
      document
        .getElementById("panel-tree-selected-element-addgroup-button")
        .classList.remove("panel-tree-button-disabled");
      document
        .getElementById("panel-tree-selected-element-addpanel-button")
        .classList.remove("panel-tree-button-disabled");
    }
    // remove button
    if (node.parent === undefined) {
      document
        .getElementById("panel-tree-selected-element-remove-button")
        .classList.add("panel-tree-button-disabled");
    } else {
      document
        .getElementById("panel-tree-selected-element-remove-button")
        .classList.remove("panel-tree-button-disabled");
    }
  } else {
    // TODO: disable type and size inputs
    document
      .getElementById("panel-tree-selected-element-addgroup-button")
      .classList.add("panel-tree-button-disabled");
    document
      .getElementById("panel-tree-selected-element-addpanel-button")
      .classList.add("panel-tree-button-disabled");
    document
      .getElementById("panel-tree-selected-element-remove-button")
      .classList.add("panel-tree-button-disabled");
  }
}

//////////////////////////////////////////
//////////////////////////////////////////
