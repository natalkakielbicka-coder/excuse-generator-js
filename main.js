import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const floorsData = [
  { name: "Parter", status: "Sprzedane", apartments: 4 },
  { name: "Piętro 1", status: "Zarezerwowane", apartments: 4 },
  { name: "Piętro 2", status: "Dostępny", apartments: 4 },
  { name: "Piętro 3", status: "Dostępny", apartments: 4 },
];

let intersects = [];
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdfe7dd);
const app = document.getElementById("app");
const buildingInfo = document.getElementById("building-info");
const camera = new THREE.PerspectiveCamera(
  55,
  app.clientWidth / app.clientHeight,
  0.1,
  1000,
);
camera.position.set(0, 10, 15);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(app.clientWidth, app.clientHeight);
app.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
  const rect = app.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function onClick() {
  if (intersects.length > 0) {
    const floor = intersects[0].object.userData;
    buildingInfo.textContent = `${floor.name} — ${floor.apartments} mieszkań (${floor.status})`;
  }
}

app.addEventListener("click", onClick);

app.addEventListener("pointermove", onPointerMove);

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
const floorMeshes = [];

const statusColors = {
  Dostępny: 0x7c9473,
  Zarezerwowane: 0xc9a24b,
  Sprzedane: 0xa85c3f,
};

for (let i = 0; i < floorsData.length; i++) {
  const geometry = new THREE.BoxGeometry(4, floorHeight, 4);
  const material = new THREE.MeshStandardMaterial({
    color: statusColors[floorsData[i].status],
  });
  const floor = new THREE.Mesh(geometry, material);

  floor.position.y = i * floorHeight + floorHeight / 2;
  floor.userData = floorsData[i];

  building.add(floor);
  floorMeshes.push(floor);
}

scene.add(building);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);

  raycaster.setFromCamera(pointer, camera);
  intersects = raycaster.intersectObjects(floorMeshes);

  floorMeshes.forEach((floor) => {
    floor.material.color.set(statusColors[floor.userData.status]);
  });

  if (intersects.length > 0) {
    intersects[0].object.material.color.set(0xd4805a);
  }

  app.style.cursor = intersects.length > 0 ? "pointer" : "default";
}
animate();
