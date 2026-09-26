import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdfe7dd);
const app = document.getElementById("app");
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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(15, 25, 10);
scene.add(sunLight);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

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

const buildingGeometry = new THREE.BoxGeometry(4, 6, 4);
const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0xa85c3f });
const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
building.position.set(0, 3, 0);
scene.add(building);
