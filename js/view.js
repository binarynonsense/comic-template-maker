let panzoom;

export function initView() {
  const elem = document.getElementById("result-div");
  panzoom = Panzoom(elem, {
    maxScale: 5,
  });
  elem.parentElement.addEventListener("wheel", panzoom.zoomWithWheel);

  document
    .getElementById("zoom-button-1")
    .addEventListener("click", panzoom.zoomIn);
  document
    .getElementById("zoom-button-2")
    .addEventListener("click", panzoom.zoomOut);
  document
    .getElementById("zoom-button-3")
    .addEventListener("click", panzoom.reset);

  document
    .getElementById("result-div")
    .addEventListener("dblclick", function (e) {
      panzoom.reset();
      e.preventDefault();
    });
}

export function resetView() {
  panzoom.reset();
}
