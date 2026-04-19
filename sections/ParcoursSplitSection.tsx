import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import {
  MousePointerClick, LogIn, SearchCheck, FileText,
  BadgeCheck, Receipt, Banknote, ShieldCheck,
  ClipboardCheck, CreditCard, Truck, Ship,
  Container, PartyPopper,
} from 'lucide-react';
import { useLang } from '@/context/LangContext';

/* ───────── Steps data ───────── */
const STEPS = [
  { id: 1, icon: MousePointerClick, title: 'S\u00e9lection', titleEn: 'Selection', desc: 'Le client choisit son v\u00e9hicule parmi nos showrooms.', descEn: 'The customer chooses their vehicle from our showrooms.' },
  { id: 2, icon: LogIn, title: 'Connexion', titleEn: 'Login', desc: 'Cr\u00e9ation de compte et v\u00e9rification d\'identit\u00e9 (KYC).', descEn: 'Account creation and identity verification (KYC).' },
  { id: 3, icon: SearchCheck, title: 'V\u00e9rification', titleEn: 'Verification', desc: 'Inspection terrain par un agent certifi\u00e9 + rapport complet.', descEn: 'On-site inspection by a certified agent + full report.' },
  { id: 4, icon: FileText, title: 'Facture Proforma', titleEn: 'Proforma Invoice', desc: '\u00c9mission de la facture proforma d\u00e9taill\u00e9e.', descEn: 'Issuance of the detailed proforma invoice.' },
  { id: 5, icon: BadgeCheck, title: '\u00c9ligibilit\u00e9', titleEn: 'Eligibility', desc: 'V\u00e9rification du compte devise en banque alg\u00e9rienne.', descEn: 'Verification of foreign currency account.' },
  { id: 6, icon: Receipt, title: 'Proforma', titleEn: 'Proforma', desc: 'Validation et acceptation de la facture proforma.', descEn: 'Validation and acceptance of the proforma invoice.' },
  { id: 7, icon: Banknote, title: 'Virement', titleEn: 'Wire Transfer', desc: 'Transfert des fonds via la banque (SWIFT/SEPA).', descEn: 'Fund transfer via bank (SWIFT/SEPA).' },
  { id: 8, icon: ShieldCheck, title: 'S\u00e9curisation', titleEn: 'Securing', desc: 'Blocage du v\u00e9hicule et versement de la caution.', descEn: 'Vehicle blocking and deposit payment.' },
  { id: 9, icon: ClipboardCheck, title: 'Papiers', titleEn: 'Documents', desc: 'V\u00e9rification carte grise, contr\u00f4le technique, Histovec.', descEn: 'Registration, technical inspection, Histovec check.' },
  { id: 10, icon: CreditCard, title: 'Paiement', titleEn: 'Payment', desc: 'Paiement final au vendeur apr\u00e8s validation.', descEn: 'Final payment to the seller after validation.' },
  { id: 11, icon: Truck, title: 'R\u00e9cup\u00e9ration', titleEn: 'Pickup', desc: 'R\u00e9cup\u00e9ration du v\u00e9hicule et convoyage vers le port.', descEn: 'Vehicle pickup and transport to the port.' },
  { id: 12, icon: Ship, title: 'Transport', titleEn: 'Transport', desc: 'Mise en conteneur / RoRo et d\u00e9part maritime.', descEn: 'Container loading / RoRo and maritime departure.' },
  { id: 13, icon: Container, title: 'Embarquement', titleEn: 'Shipping', desc: 'Travers\u00e9e maritime avec suivi GPS en temps r\u00e9el.', descEn: 'Sea crossing with real-time GPS tracking.' },
  { id: 14, icon: PartyPopper, title: 'Livraison', titleEn: 'Delivery', desc: 'D\u00e9douanement en Alg\u00e9rie et livraison au client !', descEn: 'Customs clearance in Algeria and delivery to customer!' },
];

export default function ParcoursSplitSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const progressRef = useRef(0);
  const isVisibleRef = useRef(false);
  const { lang } = useLang();

  /* ───── Scroll-driven 3D Tunnel (Right side) ───── */
  const initTunnel = useCallback(() => {
    const container = canvasContainerRef.current;
    if (!container) return () => {};

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog('#0D0D1A', 5, 50);

    const camera = new THREE.PerspectiveCamera(80, container.offsetWidth / container.offsetHeight, 0.1, 500);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const cameraGroup = new THREE.Group();
    cameraGroup.add(camera);
    scene.add(cameraGroup);
    camera.position.set(0, 1.8, 0);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const dirLight = new THREE.DirectionalLight('#C8A84B', 0.6);
    dirLight.position.set(5, 20, 10);
    scene.add(dirLight);
    const ptLight = new THREE.PointLight(0xffaa00, 0.5, 30);
    cameraGroup.add(ptLight);

    // ═══════ WINDING ROAD with curves ═══════
    // Create a sinuous path with many control points for curves
    const pathPoints: THREE.Vector3[] = [];
    const totalSegments = 60;
    const pathLength = 300;
    for (let i = 0; i <= totalSegments; i++) {
      const t = i / totalSegments;
      // Sinuous X (left-right curves)
      const x = Math.sin(t * Math.PI * 4) * 12 + Math.sin(t * Math.PI * 7) * 4;
      // Gentle Y elevation
      const y = Math.sin(t * Math.PI * 2) * 3 - 1;
      // Main Z progression
      const z = t * pathLength - pathLength / 2;
      pathPoints.push(new THREE.Vector3(x, y, z));
    }
    const path = new THREE.CatmullRomCurve3(pathPoints, false);

    // Road texture
    const roadCanvas = document.createElement('canvas');
    roadCanvas.width = 512;
    roadCanvas.height = 1024;
    const rctx = roadCanvas.getContext('2d')!;
    rctx.fillStyle = '#1a1a28';
    rctx.fillRect(0, 0, 512, 1024);
    // Center yellow line
    rctx.fillStyle = '#C8A84B';
    rctx.fillRect(250, 0, 12, 1024);
    // Side white dashed lines
    rctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 20; i++) {
      rctx.fillRect(100, i * 60, 20, 30);
      rctx.fillRect(392, i * 60, 20, 30);
    }
    const roadTexture = new THREE.CanvasTexture(roadCanvas);
    roadTexture.wrapS = THREE.RepeatWrapping;
    roadTexture.wrapT = THREE.RepeatWrapping;
    roadTexture.repeat.set(1, 40);

    // Create road mesh following path
    const roadGeo = new THREE.PlaneGeometry(8, 600, 1, 1);
    const roadMat = new THREE.MeshBasicMaterial({ map: roadTexture, transparent: true, opacity: 0.85 });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.y = -0.3;
    scene.add(road);

    // Mountain walls (dark, atmospheric)
    const wallMat = new THREE.MeshPhongMaterial({ color: '#141428', side: THREE.DoubleSide, flatShading: true });
    const wallGeo = new THREE.PlaneGeometry(120, 80, 16, 16);
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 8; i++) {
        const wall = new THREE.Mesh(wallGeo, wallMat);
        const t = i / 8;
        const pt = path.getPointAt(Math.min(t * 0.9 + 0.05, 0.99));
        wall.position.set(pt.x + side * 40, 15, pt.z);
        wall.rotation.y = side * Math.PI / 2;
        scene.add(wall);
      }
    }

    // Gold guard rails (bollards)
    const railGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.2, 8);
    const railMat = new THREE.MeshPhongMaterial({ color: '#C8A84B', emissive: '#C8A84B', emissiveIntensity: 0.3 });
    const railCount = 80;
    const rails: THREE.Mesh[] = [];
    for (let i = 0; i < railCount; i++) {
      const t = i / railCount;
      const pt = path.getPointAt(Math.min(t, 0.99));
      const tangent = path.getTangentAt(Math.min(t, 0.99)).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      // Place bollards along both sides of the road
      [-1, 1].forEach((side) => {
        const rail = new THREE.Mesh(railGeo, railMat);
        const offsetPos = pt.clone().add(normal.clone().multiplyScalar(side * 4.5));
        rail.position.copy(offsetPos);
        rail.position.y = 0.3;
        rail.rotation.y = Math.atan2(tangent.x, tangent.z);
        scene.add(rail);
        rails.push(rail);
      });
    }

    // Animated particles (dust/wind)
    const pCount = 400;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 80;
      pPos[i * 3 + 1] = Math.random() * 20;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.4 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Road labels (3D floating text for start/middle/end)
    const labelCanvas = (text: string, sub: string) => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 128;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = 'rgba(200, 168, 75, 0.9)';
      ctx.fillRect(0, 0, 512, 128);
      ctx.fillStyle = '#1A1A2E';
      ctx.font = 'bold 36px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(text, 256, 60);
      ctx.font = '20px Inter, sans-serif';
      ctx.fillText(sub, 256, 95);
      return new THREE.CanvasTexture(c);
    };

    // "Départ France" sign
    const startTex = labelCanvas(lang === 'en' ? 'DEPARTURE' : 'DÉPART', 'France');
    const startSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: startTex }));
    startSprite.scale.set(8, 2, 1);
    const startPt = path.getPointAt(0.02);
    startSprite.position.set(startPt.x, 5, startPt.z);
    scene.add(startSprite);

    // "En cours" sign
    const midTex = labelCanvas(lang === 'en' ? 'IN PROGRESS' : 'EN COURS', 'Méditerranée');
    const midSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: midTex }));
    midSprite.scale.set(8, 2, 1);
    const midPt = path.getPointAt(0.5);
    midSprite.position.set(midPt.x, 5, midPt.z);
    scene.add(midSprite);

    // "Arrivée Algérie" sign
    const endTex = labelCanvas(lang === 'en' ? 'ARRIVAL' : 'ARRIVÉE', 'Algérie');
    const endSpriteMat = new THREE.SpriteMaterial({ map: endTex });
    const endSprite = new THREE.Sprite(endSpriteMat);
    endSprite.scale.set(8, 2, 1);
    const endPt = path.getPointAt(0.97);
    endSprite.position.set(endPt.x, 5, endPt.z);
    scene.add(endSprite);

    // ── Scroll handling ──
    const sectionEl = sectionRef.current;
    const handleScroll = () => {
      if (!sectionEl) return;
      const rect = sectionEl.getBoundingClientRect();
      const sectionH = sectionEl.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      progressRef.current = Math.max(0, Math.min(0.98, scrolled / sectionH));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Visibility observer
    const visObs = new IntersectionObserver(([e]) => { isVisibleRef.current = e.isIntersecting; }, { threshold: 0 });
    if (sectionEl) visObs.observe(sectionEl);

    // ── Animation loop ──
    let time = 0;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      if (!isVisibleRef.current) return;
      time += 0.008;

      const progress = progressRef.current;
      const t = Math.min(progress, 0.98);

      const targetPos = path.getPointAt(t);
      const targetTangent = path.getTangentAt(t).normalize();

      cameraGroup.position.lerp(targetPos, 0.12);
      const targetRot = Math.atan2(targetTangent.x, targetTangent.z);
      cameraGroup.rotation.y += (targetRot - cameraGroup.rotation.y) * 0.06;

      // Road shake
      camera.position.x = (Math.random() - 0.5) * 0.004;
      camera.position.y = 1.8 + (Math.random() - 0.5) * 0.004;

      roadTexture.offset.y = -time * 3;

      // Particles
      const arr = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        arr[i * 3 + 1] -= 0.006;
        arr[i * 3] += Math.sin(time * 0.5 + i) * 0.003;
        if (arr[i * 3 + 1] < -2) arr[i * 3 + 1] = 25;
      }
      pGeo.attributes.position.needsUpdate = true;

      // Keep road/walls near camera
      road.position.z = cameraGroup.position.z;
      road.position.x = cameraGroup.position.x;

      renderer.render(scene, camera);
    };
    rafRef.current = requestAnimationFrame(animate);

    // Resize
    const onResize = () => {
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    };
    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onResize);
      visObs.disconnect();
      renderer.dispose();
      roadGeo.dispose(); roadMat.dispose(); roadTexture.dispose();
      wallGeo.dispose(); wallMat.dispose();
      railGeo.dispose(); railMat.dispose();
      pGeo.dispose(); pMat.dispose();
      startTex.dispose(); midTex.dispose(); endTex.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [lang]);

  useEffect(() => {
    const cleanup = initTunnel();
    return cleanup;
  }, [initTunnel]);

  // Left side steps reveal animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.parcours-step');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const getTitle = (s: typeof STEPS[0]) => lang === 'en' ? s.titleEn : s.title;
  const getDesc = (s: typeof STEPS[0]) => lang === 'en' ? s.descEn : s.desc;

  const title = lang === 'fr' ? 'Votre Parcours' : lang === 'en' ? 'Your Journey' : 'رحلتك';
  const subtitle = lang === 'fr'
    ? 'De la s\u00e9lection \u00e0 la livraison, suivez chaque \u00e9tape'
    : lang === 'en'
    ? 'From selection to delivery, follow every step'
    : 'من الاختيار إلى التسليم، تابع كل خطوة';

  return (
    <section
      id="parcours"
      ref={sectionRef}
      className="relative"
      style={{ minHeight: '350vh' }}
    >
      {/* Split-screen container */}
      <div className="sticky top-0 h-screen w-full flex overflow-hidden">
        
        {/* LEFT: Steps panel */}
        <div className="w-full md:w-1/2 lg:w-[45%] h-full overflow-y-auto no-scrollbar section-glass relative z-10">
          <div className="px-6 lg:px-10 py-16 lg:py-20 max-w-xl mx-auto">
            {/* Header */}
            <div className="mb-12 sticky top-0 bg-transparent z-10 pt-4 pb-6">
              <h2 className="font-playfair font-bold text-4xl lg:text-5xl text-white">
                {title}
              </h2>
              <div className="w-16 h-[3px] bg-gold mt-4 mb-3" />
              <p className="text-white/60 text-base font-inter">
                {subtitle}
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-6 pb-20">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isLast = idx === STEPS.length - 1;
                return (
                  <div
                    key={step.id}
                    className={`parcours-step reveal flex items-start gap-4 p-5 rounded-xl border transition-all duration-400 ${
                      isLast
                        ? 'border-gold/40 bg-gold/[0.06]'
                        : 'border-white/[0.06] bg-white/[0.02] hover:border-gold/20 hover:bg-white/[0.04]'
                    }`}
                    style={{ transitionDelay: `${idx * 60}ms` }}
                  >
                    {/* Step number */}
                    <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
                      isLast ? 'bg-gold text-midnight' : 'bg-white/[0.06] text-gold'
                    }`}>
                      <span className="font-roboto font-bold text-sm">{String(step.id).padStart(2, '0')}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={16} className={isLast ? 'text-gold' : 'text-gold/70'} />
                        <h3 className={`font-playfair font-bold text-base ${isLast ? 'text-gold' : 'text-white'}`}>
                          {getTitle(step)}
                        </h3>
                      </div>
                      <p className="text-white/50 text-sm font-inter leading-relaxed">
                        {getDesc(step)}
                      </p>
                    </div>

                    {/* Active indicator */}
                    <div className={`shrink-0 w-2 h-2 rounded-full mt-4 ${
                      isLast ? 'bg-gold shadow-[0_0_8px_rgba(200,168,75,0.6)]' : 'bg-white/10'
                    }`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: 3D Road (hidden on mobile) */}
        <div
          ref={canvasContainerRef}
          className="hidden md:block md:w-1/2 lg:w-[55%] h-full relative"
          style={{ background: 'radial-gradient(ellipse at center, #1A1A2E 0%, #0D0D1A 100%)' }}
        >
          {/* Road label overlays */}
          <div className="absolute top-6 left-6 z-10">
            <div className="px-3 py-1.5 bg-gold/10 border border-gold/30 rounded-lg">
              <span className="font-montserrat font-bold text-xs text-gold uppercase tracking-wider">
                {lang === 'en' ? 'Route' : 'Route'} 3D
              </span>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 z-10">
            <div className="px-3 py-1.5 bg-turquoise/10 border border-turquoise/30 rounded-lg">
              <span className="font-montserrat font-bold text-xs text-turquoise uppercase tracking-wider">
                Scroll
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
