// Initialize Three.js Scene
const canvas = document.getElementById('canvas3d');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(window.devicePixelRatio);

camera.position.z = 50;

// Detect current theme
const isLightMode = document.body.classList.contains('light-mode');

// Color palette for particles - adapts based on theme
const colors = isLightMode ? [
  { r: 124 / 255, g: 58 / 255, b: 237 / 255 },    // Purple
  { r: 219 / 255, g: 39 / 255, b: 119 / 255 },    // Pink
  { r: 5 / 255, g: 150 / 255, b: 105 / 255 },     // Green
  { r: 2 / 255, g: 132 / 255, b: 199 / 255 },     // Blue
] : [
  { r: 139 / 255, g: 92 / 255, b: 246 / 255 },    // Purple
  { r: 236 / 255, g: 72 / 255, b: 153 / 255 },    // Pink
  { r: 6 / 255, g: 214 / 255, b: 160 / 255 },     // Green
  { r: 14 / 255, g: 165 / 255, b: 233 / 255 },    // Blue
];

// Create particle system
const particleCount = 150;
const particles = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleVelocities = new Float32Array(particleCount * 3);
const particleColors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3;
  
  // Random positions
  particlePositions[i3] = (Math.random() - 0.5) * 100;
  particlePositions[i3 + 1] = (Math.random() - 0.5) * 100;
  particlePositions[i3 + 2] = (Math.random() - 0.5) * 100;
  
  // Random velocities
  particleVelocities[i3] = (Math.random() - 0.5) * 0.3;
  particleVelocities[i3 + 1] = (Math.random() - 0.5) * 0.3;
  particleVelocities[i3 + 2] = (Math.random() - 0.5) * 0.3;
  
  // Random colors
  const color = colors[Math.floor(Math.random() * colors.length)];
  particleColors[i3] = color.r;
  particleColors[i3 + 1] = color.g;
  particleColors[i3 + 2] = color.b;
}

particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particles.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

const particleMaterial = new THREE.PointsMaterial({
  size: 0.7,
  sizeAttenuation: true,
  vertexColors: true,
  transparent: true,
  opacity: 0.6,
});

const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

// Create rotating torus
const torusGeometry = new THREE.TorusGeometry(15, 5, 32, 100);
const torusMaterial = new THREE.MeshPhongMaterial({
  color: 0x8b5cf6,
  emissive: 0x4a3384,
  wireframe: false,
  transparent: true,
  opacity: 0.1,
});

const torus = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torus);

// Add lighting
const light1 = new THREE.PointLight(0x8b5cf6, 0.5, 100);
light1.position.set(20, 20, 20);
scene.add(light1);

const light2 = new THREE.PointLight(0xec4899, 0.5, 100);
light2.position.set(-20, -20, 20);
scene.add(light2);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Animation variables
let time = 0;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  time += 0.001;
  
  // Update particle positions
  const positions = particles.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] += particleVelocities[i3];
    positions[i3 + 1] += particleVelocities[i3 + 1];
    positions[i3 + 2] += particleVelocities[i3 + 2];
    
    // Wrap around
    if (Math.abs(positions[i3]) > 50) particleVelocities[i3] *= -1;
    if (Math.abs(positions[i3 + 1]) > 50) particleVelocities[i3 + 1] *= -1;
    if (Math.abs(positions[i3 + 2]) > 50) particleVelocities[i3 + 2] *= -1;
  }
  particles.attributes.position.needsUpdate = true;
  
  // Rotate torus
  torus.rotation.x += 0.001;
  torus.rotation.y += 0.002;
  
  // Rotate particle system
  particleSystem.rotation.x += 0.0001;
  particleSystem.rotation.y += 0.0002;
  
  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Watch for theme changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'class') {
      const isNowLight = document.body.classList.contains('light-mode');
      const newColors = isNowLight ? [
        { r: 124 / 255, g: 58 / 255, b: 237 / 255 },
        { r: 219 / 255, g: 39 / 255, b: 119 / 255 },
        { r: 5 / 255, g: 150 / 255, b: 105 / 255 },
        { r: 2 / 255, g: 132 / 255, b: 199 / 255 },
      ] : [
        { r: 139 / 255, g: 92 / 255, b: 246 / 255 },
        { r: 236 / 255, g: 72 / 255, b: 153 / 255 },
        { r: 6 / 255, g: 214 / 255, b: 160 / 255 },
        { r: 14 / 255, g: 165 / 255, b: 233 / 255 },
      ];

      // Update particle colors
      const colorArray = particles.attributes.color.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const color = newColors[Math.floor(Math.random() * newColors.length)];
        colorArray[i3] = color.r;
        colorArray[i3 + 1] = color.g;
        colorArray[i3 + 2] = color.b;
      }
      particles.attributes.color.needsUpdate = true;
    }
  });
});

observer.observe(document.body, { attributes: true });
