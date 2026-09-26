import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const floorsData = [
  {
    name: "Parter",
    apartments: [
      { name: "M1", status: "Sprzedane" },
      { name: "M2", status: "Sprzedane" },
    ],
  },
  {
    name: "Piętro 1",
    apartments: [
      { name: "M3", status: "Zarezerwowane" },
      { name: "M4", status: "Dostępny" },
    ],
  },
  {
    name: "Piętro 2",
    apartments: [
      { name: "M5", status: "Dostępny" },
      { name: "M6", status: "Dostępny" },
    ],
  },
  {
    name: "Piętro 3",
    apartments: [
      { name: "M7", status: "Dostępny" },
      { name: "M8", status: "Dostępny" },
    ],
  },
];

let intersects = [];
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdfe7dd);
const app = document.getElementById("app");
const buildingInfo = document.getElementById("building-info");
const tooltip = document.getElementById("tooltip");
const legendItems = document.querySelectorAll(".legend li");
let activeStatusFilter = null;
const camera = new THREE.PerspectiveCamera(
  55,
  app.clientWidth / app.clientHeight,
  0.1,
  1000,
);
camera.position.set(6, 8, 14);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(app.clientWidth, app.clientHeight);
app.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pointerPixelX = 0;
let pointerPixelY = 0;
const cameraTarget = new THREE.Vector3();
const controlsTarget = new THREE.Vector3();
let isAnimatingCamera = false;

function onPointerMove(event) {
  const rect = app.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  pointerPixelX = event.clientX - rect.left;
  pointerPixelY = event.clientY - rect.top;
}

function onClick() {
  if (intersects.length > 0) {
    const marker = intersects[0].object;
    const apartment = marker.userData;
    buildingInfo.textContent = `${apartment.name} (piętro: ${apartment.floorName}) — ${apartment.status}`;

    controlsTarget.set(marker.position.x, marker.position.y, 0);
    cameraTarget.set(marker.position.x + 8, marker.position.y + 3, 8);
    isAnimatingCamera = true;
  }
}

app.addEventListener("click", onClick);

app.addEventListener("pointermove", onPointerMove);

legendItems.forEach((item) => {
  item.addEventListener("click", () => {
    const status = item.dataset.status;

    if (activeStatusFilter === status) {
      activeStatusFilter = null;
      item.classList.remove("active");
    } else {
      legendItems.forEach((el) => el.classList.remove("active"));
      activeStatusFilter = status;
      item.classList.add("active");
    }
  });
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(15, 25, 10);
scene.add(sunLight);

const groundGeometry = new THREE.PlaneGeometry(30, 30);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x8fbf8f });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);
const grid = new THREE.GridHelper(30, 15, 0x556655, 0x99aa99);
scene.add(grid);

window.addEventListener("resize", () => {
  camera.aspect = app.clientWidth / app.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(app.clientWidth, app.clientHeight);
});

const building = new THREE.Group();

const floorHeight = 1.5;

const statusColors = {
  Dostępny: 0x7c9473,
  Zarezerwowane: 0xc9a24b,
  Sprzedane: 0xa85c3f,
};

const textureLoader = new THREE.TextureLoader();

const brickTexture = textureLoader.load(
  "https://threejs.org/examples/textures/brick_diffuse.jpg",
);
const buildingWidth = 4;
const buildingDepth = 4;

const apartmentMeshes = [];
const buildingHeight = floorsData.length * floorHeight;

const buildingGeometry = new THREE.BoxGeometry(
  buildingWidth,
  buildingHeight,
  buildingDepth,
);
const buildingMaterial = new THREE.MeshStandardMaterial({ map: brickTexture });
const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
buildingMesh.position.y = buildingHeight / 2;
building.add(buildingMesh);

function createMarker(width, height, status, x, y, z, rotationY) {
  const markerGeometry = new THREE.PlaneGeometry(width * 0.9, height * 0.9);
  const markerMaterial = new THREE.MeshStandardMaterial({
    color: statusColors[status],
    transparent: true,
    opacity: 0.5,
  });
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);
  marker.position.set(x, y, z);
  marker.rotation.y = rotationY;

  const markerEdges = new THREE.EdgesGeometry(markerGeometry);
  const markerBorder = new THREE.LineSegments(
    markerEdges,
    new THREE.LineBasicMaterial({ color: statusColors[status] }),
  );
  marker.add(markerBorder);

  return marker;
}

for (let i = 0; i < floorsData.length; i++) {
  const floor = floorsData[i];
  const apartmentWidth = buildingWidth / floor.apartments.length;

  for (let j = 0; j < floor.apartments.length; j++) {
    const status = floor.apartments[j].status;
    const centerX = -buildingWidth / 2 + apartmentWidth * (j + 0.5);
    const centerY = i * floorHeight + floorHeight / 2;
    const userData = { ...floor.apartments[j], floorName: floor.name };

    const front = createMarker(
      apartmentWidth,
      floorHeight,
      status,
      centerX,
      centerY,
      buildingDepth / 2 + 0.02,
      0,
    );
    front.userData = userData;
    building.add(front);
    apartmentMeshes.push(front);

    const back = createMarker(
      apartmentWidth,
      floorHeight,
      status,
      centerX,
      centerY,
      -(buildingDepth / 2 + 0.02),
      Math.PI,
    );
    back.userData = userData;
    building.add(back);
    apartmentMeshes.push(back);

    if (j === 0) {
      const left = createMarker(
        buildingDepth,
        floorHeight,
        status,
        -(buildingWidth / 2 + 0.02),
        centerY,
        0,
        -Math.PI / 2,
      );
      left.userData = userData;
      building.add(left);
      apartmentMeshes.push(left);
    }

    if (j === floor.apartments.length - 1) {
      const right = createMarker(
        buildingDepth,
        floorHeight,
        status,
        buildingWidth / 2 + 0.02,
        centerY,
        0,
        Math.PI / 2,
      );
      right.userData = userData;
      building.add(right);
      apartmentMeshes.push(right);
    }
  }
}

scene.add(building);

function animate() {
  requestAnimationFrame(animate);

  if (isAnimatingCamera) {
    camera.position.lerp(cameraTarget, 0.05);
    controls.target.lerp(controlsTarget, 0.05);

    if (camera.position.distanceTo(cameraTarget) < 0.05) {
      isAnimatingCamera = false;
    }
  }

  controls.update();
  renderer.render(scene, camera);

  raycaster.setFromCamera(pointer, camera);
  intersects = raycaster.intersectObjects(apartmentMeshes, false);

  apartmentMeshes.forEach((apartment) => {
    const baseColor = statusColors[apartment.userData.status];

    if (
      activeStatusFilter &&
      apartment.userData.status !== activeStatusFilter
    ) {
      apartment.material.color.set(baseColor).multiplyScalar(0.35);
    } else {
      apartment.material.color.set(baseColor);
    }
  });

  if (intersects.length > 0) {
    const hoveredData = intersects[0].object.userData;

    tooltip.textContent = `${hoveredData.name} (${hoveredData.status})`;
    tooltip.style.left = `${pointerPixelX}px`;
    tooltip.style.top = `${pointerPixelY}px`;
    tooltip.classList.add("visible");

    apartmentMeshes.forEach((marker) => {
      if (marker.userData === hoveredData) {
        marker.material.color.set(0xd4805a);
      }
    });
  } else {
    tooltip.classList.remove("visible");
  }

  app.style.cursor = intersects.length > 0 ? "pointer" : "default";
}
animate();
