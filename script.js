import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// ─────────────────────────────────────────
// 1. RENDERER SETUP
// ─────────────────────────────────────────
const canvas = document.getElementById('webgl-canvas');
const scene  = new THREE.Scene();

const YELLOW = 0xE8C231;
const BLUE   = 0x00BFFF;
const RED    = 0xFF2D4B;
const DARK   = 0x0C0C10;

scene.fog = new THREE.FogExp2(DARK, 0.025);
scene.background = new THREE.Color(DARK);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 300);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;

// ─────────────────────────────────────────
// 2. LIGHTING — cinematic motorsport rig
// ─────────────────────────────────────────
const ambient = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(ambient);

// Key light — warm rim from rear
const keyLight = new THREE.DirectionalLight(YELLOW, 2.5);
keyLight.position.set(-8, 6, -6);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);
keyLight.shadow.camera.near = 1;
keyLight.shadow.camera.far = 40;
keyLight.shadow.camera.left = -8;
keyLight.shadow.camera.right = 8;
keyLight.shadow.camera.top = 6;
keyLight.shadow.camera.bottom = -4;
scene.add(keyLight);

// Fill light — cool blue from front
const fillLight = new THREE.DirectionalLight(BLUE, 1.8);
fillLight.position.set(8, 4, 10);
scene.add(fillLight);

// Under glow — simulated ground bounce
const underglow = new THREE.PointLight(YELLOW, 1.5, 6);
underglow.position.set(0, -0.2, 0);
scene.add(underglow);

// ─────────────────────────────────────────
// 3. MATERIALS
// ─────────────────────────────────────────
const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x111118,
    metalness: 0.95,
    roughness: 0.08,
    envMapIntensity: 1.2
});

const trimMat = new THREE.MeshStandardMaterial({
    color: YELLOW,
    metalness: 0.4,
    roughness: 0.3,
    emissive: YELLOW,
    emissiveIntensity: 0.15
});

const glassMat = new THREE.MeshStandardMaterial({
    color: 0x112233,
    metalness: 0.1,
    roughness: 0.05,
    transparent: true,
    opacity: 0.45
});

const neonCyan = new THREE.MeshBasicMaterial({ color: BLUE });
const neonRed  = new THREE.MeshBasicMaterial({ color: RED });
const neonYell = new THREE.MeshBasicMaterial({ color: YELLOW });

const wheelMat = new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.85, metalness: 0.1 });
const rimMat   = new THREE.MeshStandardMaterial({ color: 0xC8C8C8, metalness: 0.95, roughness: 0.1 });

// ─────────────────────────────────────────
// 4. BUILD CAR — more sculpted geometry
// ─────────────────────────────────────────
const carGroup = new THREE.Group();
const bodyGroup = new THREE.Group();

// -- Chassis lower
const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.28, 4.0), bodyMat);
chassis.position.y = 0.44;
chassis.castShadow = true;

// -- Side sills
const sillGeom = new THREE.BoxGeometry(0.12, 0.18, 3.6);
const sillL = new THREE.Mesh(sillGeom, trimMat);
sillL.position.set(-1.06, 0.34, 0);
const sillR = sillL.clone();
sillR.position.set(1.06, 0.34, 0);

// -- Front splitter
const splitter = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 0.4), trimMat);
splitter.position.set(0, 0.25, -2.1);

// -- Cabin (tapered top)
const cabinGeom = new THREE.BoxGeometry(1.5, 0.45, 1.7);
const cabin = new THREE.Mesh(cabinGeom, bodyMat);
cabin.position.set(0, 0.93, -0.15);
cabin.castShadow = true;

// -- Windscreen (angled glass)
const windGeom = new THREE.BoxGeometry(1.46, 0.42, 0.12);
const windscreen = new THREE.Mesh(windGeom, glassMat);
windscreen.position.set(0, 0.92, -1.02);
windscreen.rotation.x = 0.32;

// -- Rear window
const rearWind = new THREE.Mesh(new THREE.BoxGeometry(1.46, 0.3, 0.12), glassMat);
rearWind.position.set(0, 0.88, 0.73);
rearWind.rotation.x = -0.3;

// -- Rear wing
const wingMain = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.06, 0.45), bodyMat);
wingMain.position.set(0, 1.06, 1.82);

// Wing end plates
const plateGeom = new THREE.BoxGeometry(0.06, 0.22, 0.45);
const plateL = new THREE.Mesh(plateGeom, bodyMat);
plateL.position.set(-0.97, 1.06, 1.82);
const plateR = plateL.clone();
plateR.position.set(0.97, 1.06, 1.82);

// Wing struts
const strutGeom = new THREE.BoxGeometry(0.07, 0.28, 0.07);
const strut1 = new THREE.Mesh(strutGeom, bodyMat);
strut1.position.set(-0.52, 0.86, 1.82);
const strut2 = strut1.clone();
strut2.position.set(0.52, 0.86, 1.82);

// -- Front hood with crease
const hood = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.1, 1.6), bodyMat);
hood.position.set(0, 0.62, -1.3);
hood.rotation.x = -0.07;

// -- Rear deck
const rearDeck = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.08, 0.9), bodyMat);
rearDeck.position.set(0, 0.69, 1.45);

// -- Diffuser
const diffuserGeom = new THREE.BoxGeometry(1.8, 0.12, 0.5);
const diffuser = new THREE.Mesh(diffuserGeom, bodyMat);
diffuser.position.set(0, 0.26, 2.1);
diffuser.rotation.x = 0.3;

bodyGroup.add(
    chassis, sillL, sillR, splitter,
    cabin, windscreen, rearWind,
    wingMain, plateL, plateR, strut1, strut2,
    hood, rearDeck, diffuser
);

// -- Headlights (DRL strip + lens)
const hlStrip = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.05, 0.06), neonCyan);
hlStrip.position.set(-0.72, 0.6, -2.02);
const hlStrip2 = hlStrip.clone();
hlStrip2.position.set(0.72, 0.6, -2.02);

const hlLens = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.14, 0.08), new THREE.MeshStandardMaterial({
    color: 0x223344, metalness: 0.2, roughness: 0.1, transparent: true, opacity: 0.8
}));
hlLens.position.set(-0.72, 0.6, -2.0);
const hlLens2 = hlLens.clone();
hlLens2.position.set(0.72, 0.6, -2.0);

// Accent stripe across front
const frontStripe = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.03, 0.06), neonCyan);
frontStripe.position.set(0, 0.52, -2.02);

// -- Tail lights (full-width bar — heritage style)
const tailBar = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.06), neonRed);
tailBar.position.set(0, 0.64, 2.03);

// Yellow racing stripe on rear
const rearStripe = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.06), neonYell);
rearStripe.position.set(0, 0.72, 2.03);

bodyGroup.add(hlStrip, hlStrip2, hlLens, hlLens2, frontStripe, tailBar, rearStripe);

// -- Point lights for headlamp glow
const hlGlow1 = new THREE.PointLight(BLUE, 1.0, 3.5);
hlGlow1.position.set(-0.72, 0.6, -2.5);
const hlGlow2 = new THREE.PointLight(BLUE, 1.0, 3.5);
hlGlow2.position.set(0.72, 0.6, -2.5);
const tailGlow = new THREE.PointLight(RED, 0.8, 2.5);
tailGlow.position.set(0, 0.6, 2.5);
bodyGroup.add(hlGlow1, hlGlow2, tailGlow);

carGroup.add(bodyGroup);

// -- WHEELS (detailed)
const wheels = [];
const wheelPositions = [
    [-1.08, 0.32, -1.3],
    [ 1.08, 0.32, -1.3],
    [-1.08, 0.32,  1.35],
    [ 1.08, 0.32,  1.35]
];

const tireGeom = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 24);
tireGeom.rotateZ(Math.PI / 2);

const rimGeom = new THREE.CylinderGeometry(0.20, 0.20, 0.24, 10);
rimGeom.rotateZ(Math.PI / 2);

const brakeGeom = new THREE.CylinderGeometry(0.14, 0.14, 0.10, 6);
brakeGeom.rotateZ(Math.PI / 2);

wheelPositions.forEach((pos, i) => {
    const group = new THREE.Group();

    // Tire
    const tire = new THREE.Mesh(tireGeom, wheelMat);
    tire.castShadow = true;

    // Rim
    const rim = new THREE.Mesh(rimGeom, rimMat);

    // Brake caliper (yellow — classic heritage)
    const caliper = new THREE.Mesh(brakeGeom, trimMat);
    caliper.position.y = pos[0] > 0 ? -0.14 : 0.14;

    group.add(tire, rim, caliper);
    group.position.set(...pos);
    carGroup.add(group);
    wheels.push({ group, tire, rim });

    // Arch shadow hint
    const archGeom = new THREE.BoxGeometry(0.6, 0.06, 0.7);
    const archMesh = new THREE.Mesh(archGeom, bodyMat);
    archMesh.position.set(pos[0], 0.56, pos[2]);
    bodyGroup.add(archMesh);
});

carGroup.castShadow = true;
scene.add(carGroup);

// ─────────────────────────────────────────
// 5. ENVIRONMENT
// ─────────────────────────────────────────

// Track surface
const trackGeom = new THREE.PlaneGeometry(6, 200);
const trackMat = new THREE.MeshStandardMaterial({
    color: 0x080810,
    roughness: 0.9,
    metalness: 0.05
});
const track = new THREE.Mesh(trackGeom, trackMat);
track.rotation.x = -Math.PI / 2;
track.position.y = -0.01;
track.receiveShadow = true;
scene.add(track);

// Grid (race circuit lines)
const gridHelper = new THREE.GridHelper(120, 60, 0xE8C231, 0x1a1a2a);
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0.4;
scene.add(gridHelper);

// Centre line stripe (white dashes)
const stripeGroup = new THREE.Group();
for (let i = -50; i < 50; i += 4) {
    const dashGeom = new THREE.PlaneGeometry(0.14, 2.0);
    const dashMesh = new THREE.Mesh(dashGeom, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 }));
    dashMesh.rotation.x = -Math.PI / 2;
    dashMesh.position.set(0, 0.001, i);
    stripeGroup.add(dashMesh);
}
scene.add(stripeGroup);

// Stars
const starGeom = new THREE.BufferGeometry();
const starCount = 800;
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
    starPos[i] = (Math.random() - 0.5) * 200;
}
starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const stars = new THREE.Points(starGeom, new THREE.PointsMaterial({
    size: 0.08,
    color: 0xffffff,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true
}));
scene.add(stars);

// Speed particles (tunnel effect)
const speedGeom = new THREE.BufferGeometry();
const speedCount = 400;
const speedPos = new Float32Array(speedCount * 3);
for (let i = 0; i < speedCount; i++) {
    speedPos[i * 3]     = (Math.random() - 0.5) * 12;
    speedPos[i * 3 + 1] = (Math.random() - 0.5) * 5 + 1;
    speedPos[i * 3 + 2] = (Math.random() - 0.5) * 80;
}
speedGeom.setAttribute('position', new THREE.BufferAttribute(speedPos, 3));
const speedParticles = new THREE.Points(speedGeom, new THREE.PointsMaterial({
    size: 0.04,
    color: BLUE,
    transparent: true,
    opacity: 0.35
}));
scene.add(speedParticles);

// ─────────────────────────────────────────
// 6. CAMERA SYSTEM — smooth interpolation
// ─────────────────────────────────────────
const cameraViews = [
    { pos: new THREE.Vector3( 5.5,  2.8,  7.0), look: new THREE.Vector3(0, 0.4, 0) },  // 3/4 front
    { pos: new THREE.Vector3( 0.0,  5.0,  9.0), look: new THREE.Vector3(0, 0.0, 0) },  // overhead rear
    { pos: new THREE.Vector3(-5.5,  1.4, -5.0), look: new THREE.Vector3(0, 0.5, 0) },  // low driver side
    { pos: new THREE.Vector3( 0.0,  1.2, -7.0), look: new THREE.Vector3(0, 0.7, 0) },  // dead front
];

let currentCamIdx = 0;
let targetCamPos = cameraViews[0].pos.clone();
let targetLook   = cameraViews[0].look.clone();
const currentLook = new THREE.Vector3(0, 0.4, 0);

function switchCamera() {
    currentCamIdx = (currentCamIdx + 1) % cameraViews.length;
    targetCamPos = cameraViews[currentCamIdx].pos.clone();
    targetLook   = cameraViews[currentCamIdx].look.clone();
}

camera.position.copy(targetCamPos);
camera.lookAt(targetLook);

document.getElementById('camera-toggle').addEventListener('click', switchCamera);

// ─────────────────────────────────────────
// 7. SCROLL & SPEED
// ─────────────────────────────────────────
let scrollY = window.scrollY;
let lastScrollY = 0;
let scrollVelocity = 0;
const speedBlur = document.getElementById('speed-blur');

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// ─────────────────────────────────────────
// 8. NAVBAR SCROLL STATE
// ─────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ─────────────────────────────────────────
// 9. HAMBURGER MENU
// ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
let menuOpen = false;

hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileNav.style.display = menuOpen ? 'flex' : 'none';
    // Delay for transition
    requestAnimationFrame(() => {
        mobileNav.classList.toggle('open', menuOpen);
    });
});

mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        menuOpen = false;
        mobileNav.classList.remove('open');
        setTimeout(() => { mobileNav.style.display = 'none'; }, 350);
    });
});

// ─────────────────────────────────────────
// 10. ANIMATION LOOP
// ─────────────────────────────────────────
const clock = new THREE.Clock();
const LERP = 0.06; // smooth camera factor

function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Scroll velocity → speed effect
    scrollVelocity = Math.abs(scrollY - lastScrollY);
    lastScrollY = scrollY;
    speedBlur.classList.toggle('active', scrollVelocity > 25);

    // Smooth camera
    camera.position.lerp(targetCamPos, LERP);
    currentLook.lerp(targetLook, LERP);
    camera.lookAt(currentLook);

    // Car scroll tracking
    carGroup.position.z = -(scrollY * 0.004);

    // Subtle body roll / suspension
    bodyGroup.rotation.z = Math.sin(t * 12) * 0.008;
    carGroup.position.y  = Math.sin(t * 12) * 0.018;

    // Wheel spin
    wheels.forEach(w => {
        w.group.rotation.x -= 0.18;
    });

    // Underglow pulse
    underglow.intensity = 1.0 + Math.sin(t * 3) * 0.4;

    // Environment motion (driving illusion)
    gridHelper.position.z = (t * 12) % 2;
    stripeGroup.position.z = (t * 12) % 4;
    speedParticles.position.z = (t * 18) % 80;

    // Stars slow drift
    stars.rotation.y = t * 0.005;

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
