import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

const STEPS = [
  'S\u00e9lection', 'Connexion', 'V\u00e9rification', 'Facture',
  '\u00c9ligibilit\u00e9', 'Proforma', 'Virement', 'S\u00e9curisation',
  'Papiers', 'Paiement', 'R\u00e9cup\u00e9ration', 'Transport',
  'Embarquement', 'Livraison',
];

export default function TunnelBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rafRef = useRef<number>(0);
  const isVisibleRef = useRef(false);

  const path = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const radius = 30;
    for (let i = 0; i <= 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle * 0.3) * 5,
          Math.sin(angle) * radius
        )
      );
    }
    return new THREE.CatmullRomCurve3(points, true);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#0D0D1A', 0.5, 40);

    const camera = new THREE.PerspectiveCamera(
      80, window.innerWidth / window.innerHeight, 0.1, 500
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Camera group
    const cameraGroup = new THREE.Group();
    cameraGroup.add(camera);
    scene.add(cameraGroup);
    camera.position.set(0, 1.8, 0);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight('#C8A84B', 0.5);
    directionalLight.position.set(5, 20, 10);
    scene.add(directionalLight);
    const pointLight = new THREE.PointLight(0xffaa00, 0.4, 30);
    cameraGroup.add(pointLight);

    // Road texture
    const roadCanvas = document.createElement('canvas');
    roadCanvas.width = 512;
    roadCanvas.height = 1024;
    const rctx = roadCanvas.getContext('2d')!;
    rctx.fillStyle = '#2a2a35';
    rctx.fillRect(0, 0, 512, 1024);
    rctx.fillStyle = '#C8A84B';
    for (let i = 0; i < 6; i++) {
      rctx.fillRect(230, i * 200, 52, 100);
    }
    const roadTexture = new THREE.CanvasTexture(roadCanvas);
    roadTexture.wrapS = THREE.RepeatWrapping;
    roadTexture.wrapT = THREE.RepeatWrapping;
    roadTexture.repeat.set(1, 20);

    // Road mesh
    const roadGeo = new THREE.PlaneGeometry(8, 400, 1, 1);
    const roadMat = new THREE.MeshBasicMaterial({
      map: roadTexture, transparent: true, opacity: 0.8,
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.y = -0.5;
    scene.add(road);

    // Mountain walls
    const wallMat = new THREE.MeshPhongMaterial({
      color: '#1A1A2E', side: THREE.DoubleSide, flatShading: true,
    });
    const wallGeo = new THREE.PlaneGeometry(80, 60, 32, 32);
    const leftWall = new THREE.Mesh(wallGeo, wallMat);
    leftWall.position.set(-25, 10, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);
    const rightWall = new THREE.Mesh(wallGeo, wallMat.clone());
    rightWall.position.set(25, 10, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    // Ceiling
    const ceilingGeo = new THREE.PlaneGeometry(60, 400, 16, 16);
    const ceilingMat = new THREE.MeshPhongMaterial({
      color: '#0D0D1A', side: THREE.DoubleSide, flatShading: true,
    });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.position.y = 25;
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    // Guard rails (gold)
    const railGeo = new THREE.BoxGeometry(0.15, 0.8, 0.15);
    const railMat = new THREE.MeshPhongMaterial({ color: '#C8A84B' });
    const railCount = 100;
    const leftRails = new THREE.InstancedMesh(railGeo, railMat, railCount);
    const rightRails = new THREE.InstancedMesh(railGeo, railMat, railCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < railCount; i++) {
      const t = i / railCount;
      const pos = path.getPointAt(t);
      const tangent = path.getTangentAt(t).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      dummy.position.copy(pos).add(normal.clone().multiplyScalar(4));
      dummy.position.y = 0;
      dummy.rotation.y = Math.atan2(tangent.x, tangent.z);
      dummy.updateMatrix();
      leftRails.setMatrixAt(i, dummy.matrix);
      dummy.position.copy(pos).sub(normal.clone().multiplyScalar(4));
      dummy.position.y = 0;
      dummy.rotation.y = Math.atan2(tangent.x, tangent.z);
      dummy.updateMatrix();
      rightRails.setMatrixAt(i, dummy.matrix);
    }
    scene.add(leftRails);
    scene.add(rightRails);

    // Signs
    const signGroups: THREE.Group[] = [];
    for (let i = 0; i < STEPS.length; i++) {
      const t = i / STEPS.length;
      const pos = path.getPointAt(t);
      const tangent = path.getTangentAt(t).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      const group = new THREE.Group();
      // Pole
      const pole = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 3, 0.1),
        new THREE.MeshPhongMaterial({ color: '#444444' })
      );
      pole.position.y = 1;
      group.add(pole);
      // Board
      const board = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.7, 0.1),
        new THREE.MeshPhongMaterial({ color: '#C8A84B' })
      );
      board.position.y = 2.8;
      group.add(board);
      // Text sprite
      const tc = document.createElement('canvas');
      tc.width = 256;
      tc.height = 64;
      const tctx = tc.getContext('2d')!;
      tctx.fillStyle = '#C8A84B';
      tctx.fillRect(0, 0, 256, 64);
      tctx.strokeStyle = '#1A1A2E';
      tctx.lineWidth = 3;
      tctx.strokeRect(0, 0, 256, 64);
      tctx.fillStyle = '#1A1A2E';
      tctx.font = 'bold 18px Inter, sans-serif';
      tctx.textAlign = 'center';
      tctx.fillText(`${i + 1}. ${STEPS[i]}`, 128, 40);
      const tt = new THREE.CanvasTexture(tc);
      const sm = new THREE.SpriteMaterial({ map: tt });
      const sprite = new THREE.Sprite(sm);
      sprite.scale.set(2.2, 0.55, 1);
      sprite.position.set(0, 2.8, 0.08);
      group.add(sprite);
      group.position.copy(pos).add(normal.clone().multiplyScalar(6));
      group.position.y = -0.5;
      group.lookAt(pos.clone().add(tangent));
      scene.add(group);
      signGroups.push(group);
    }

    // Snow particles
    const pCount = 600;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 50;
      pPos[i * 3 + 1] = Math.random() * 30;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffffff, size: 0.08, transparent: true, opacity: 0.5,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Visibility observer
    const visObserver = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    visObserver.observe(container);

    // Animation loop — auto-play, not scroll-driven
    let time = 0;
    const autoSpeed = 0.0003;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      if (!isVisibleRef.current) return;

      time += 0.01;
      const progress = (time * autoSpeed) % 1;
      const t = progress * 0.95;

      const targetPos = path.getPointAt(t);
      const targetTangent = path.getTangentAt(t).normalize();
      cameraGroup.position.lerp(targetPos, 0.1);

      const targetRot = Math.atan2(targetTangent.x, targetTangent.z);
      cameraGroup.rotation.y += (targetRot - cameraGroup.rotation.y) * 0.05;

      // Subtle shake
      camera.position.x = (Math.random() - 0.5) * 0.003;
      camera.position.y = 1.8 + (Math.random() - 0.5) * 0.003;

      roadTexture.offset.y = -time * 2;

      // Animate particles
      const arr = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        arr[i * 3 + 1] -= 0.008;
        arr[i * 3] += Math.sin(time + i) * 0.002;
        if (arr[i * 3 + 1] < 0) arr[i * 3 + 1] = 30;
      }
      pGeo.attributes.position.needsUpdate = true;

      // Follow walls to camera
      leftWall.position.x = cameraGroup.position.x - 25;
      leftWall.position.z = cameraGroup.position.z;
      rightWall.position.x = cameraGroup.position.x + 25;
      rightWall.position.z = cameraGroup.position.z;
      ceiling.position.x = cameraGroup.position.x;
      ceiling.position.z = cameraGroup.position.z;
      road.position.z = cameraGroup.position.z;
      road.position.x = cameraGroup.position.x;

      renderer.render(scene, camera);
    };
    rafRef.current = requestAnimationFrame(animate);

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      visObserver.disconnect();
      renderer.dispose();
      roadGeo.dispose(); roadMat.dispose(); roadTexture.dispose();
      wallGeo.dispose(); wallMat.dispose();
      ceilingGeo.dispose(); ceilingMat.dispose();
      railGeo.dispose(); railMat.dispose();
      pGeo.dispose(); pMat.dispose();
      leftRails.dispose(); rightRails.dispose();
      signGroups.forEach((g) => {
        g.traverse((c) => {
          if (c instanceof THREE.Mesh) { c.geometry.dispose(); (c.material as THREE.Material).dispose(); }
          if (c instanceof THREE.Sprite) { c.material.map?.dispose(); c.material.dispose(); }
        });
      });
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [path]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}
