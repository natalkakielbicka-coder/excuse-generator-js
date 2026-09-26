import * as THREE from "three";
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdfe7dd);
const app = document.getElementById("app");
const camera = new THREE.PerspectiveCamera(
  55,
  app.clientWidth / app.clientHeight,
  0.1,
  1000,
);
camera.position.set(0, 5, 10);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(app.clientWidth, app.clientHeight);
app.appendChild(renderer.domElement);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

const groundGeometry = new THREE.PlaneGeometry(30, 30);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x8fbf8f });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);
