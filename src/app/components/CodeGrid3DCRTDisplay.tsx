import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';

/** stitch.tsx / Pulp Alchemist tokens — waypoint rail */
const INK = '#1A0F0D';
const TERTIARY_CONTAINER = '#fecc00';
const ON_TERTIARY = '#584500';
const SURFACE = '#fcf6e8';
const SURFACE_CONTAINER = '#eee8d8';
const PRIMARY = '#a83100';
const PRIMARY_CONTAINER = '#ff784d';
const ON_PRIMARY = '#ffefeb';

interface CodeGrid3DCRTDisplayProps {
  images?: Array<{ name: string; src: string }>;
}

function StitchWaypointFonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:ital,wght@0,300..700;1,300..700&display=swap');
    `}</style>
  );
}

/**
 * CodeGrid 3D CRT Display Component
 * 3D monitor display with CRT shader effects; stitch-styled channel rail below (before Keep it Fresh).
 */
const CodeGrid3DCRTDisplay: React.FC<CodeGrid3DCRTDisplayProps> = ({ 
  images 
}) => {
  /** Whole block: canvas + waypoint rail (for hover wiring) */
  const containerRef = useRef<HTMLDivElement>(null);
  /** Where the WebGL canvas is attached */
  const canvasMountRef = useRef<HTMLDivElement>(null);

  const pub = process.env.PUBLIC_URL || '';
  const defaultImages = [
    { name: 'District', src: `${pub}/codegrid-3d-crt-display/public/project-img-1.jpg` },
    { name: 'Waypoint', src: `${pub}/codegrid-3d-crt-display/public/project-img-2.jpg` },
    { name: 'Corridor', src: `${pub}/codegrid-3d-crt-display/public/project-img-3.jpg` },
    { name: 'Archive', src: `${pub}/codegrid-3d-crt-display/public/project-img-4.jpg` },
    { name: 'Terminal', src: `${pub}/codegrid-3d-crt-display/public/project-img-5.jpg` }
  ];

  const displayImages = images || defaultImages;

  useEffect(() => {
    const container = containerRef.current;
    const canvasMount = canvasMountRef.current;
    if (!container || !canvasMount) return;

    // Load shaders and initialize Three.js scene (sync; cleanup returned to React below)
    const initScene = () => {
      try {
        // Shader code (inline from shaders.js)
        const vertexShader = `
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `;

        const fragmentShader = `
          uniform sampler2D map;
          uniform float imageAspect, planeAspect, glitchIntensity, time;
          uniform vec2 iResolution;
          varying vec2 vUv;

          float hash(float n) {
            return fract(sin(n) * 43758.5453123);
          }

          vec2 coverUV(vec2 uv) {
            if (planeAspect > imageAspect) {
              float s = imageAspect / planeAspect;
              uv.y = uv.y * s + (1.0 - s) * 0.5;
            } else {
              float s = planeAspect / imageAspect;
              uv.x = uv.x * s + (1.0 - s) * 0.5;
            }
            return uv;
          }

          void main() {
            vec2 uv = vUv;
            float gi = glitchIntensity;

            uv.x += (hash(floor(uv.y * 20.0 + time * 80.0) + time * 7.0) - 0.5) * 2.0 * gi * 0.15;
            uv.y += (hash(floor(time * 50.0)) - 0.5) * gi * 0.06;

            float rs = 0.001 + gi * 0.025;

            vec3 col;
            col.r = texture2D(map, coverUV(vec2(uv.x + rs, uv.y + rs))).r + 0.05;
            col.g = texture2D(map, coverUV(vec2(uv.x, uv.y - rs * 2.0))).g + 0.05;
            col.b = texture2D(map, coverUV(vec2(uv.x - rs * 2.0, uv.y))).b + 0.05;

            col.r += 0.08 * texture2D(map, coverUV(vec2(uv.x + 0.026, uv.y - 0.026))).r;
            col.g += 0.05 * texture2D(map, coverUV(vec2(uv.x - 0.022, uv.y - 0.022))).g;
            col.b += 0.08 * texture2D(map, coverUV(vec2(uv.x - 0.022, uv.y - 0.018))).b;

            col = clamp(col * 0.93 + 0.07 * col * col, 0.0, 1.0);
            col *= vec3(pow(16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y), 0.12));
            col *= vec3(0.95, 1.05, 0.95) * 2.5;
            col *= vec3(0.6 + 0.4 * pow(clamp(0.35 + 0.35 * sin(uv.y * iResolution.y * 1.5), 0.0, 1.0), 1.2));
            col *= 1.0 - 0.65 * vec3(clamp((mod(vUv.x * iResolution.x, 2.0) - 1.0) * 2.0, 0.0, 1.0));
            col += vec3(hash(uv.x * 100.0 + uv.y * 1000.0 + time * 300.0) * gi * 0.3);

            gl_FragColor = vec4(col, 1.0);
          }
        `;

        const scene = new THREE.Scene();
        const mountEl = canvasMount;
        const mountW = mountEl.clientWidth || window.innerWidth;
        const mountH = mountEl.clientHeight || window.innerHeight;

        const camera = new THREE.PerspectiveCamera(30, mountW / mountH, 0.1, 1000);
        camera.position.set(0, 0.15, 1);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mountW, mountH);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;
        
        canvasMount.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 5));

        const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
        dirLight.position.set(15, 10, -5);
        scene.add(dirLight);

        const topLight = new THREE.PointLight(0xffffff, 5, 10);
        topLight.position.set(-5, -2.5, 0);
        topLight.decay = 0.3;
        scene.add(topLight);

        const monitorGroup = new THREE.Group();
        scene.add(monitorGroup);

        // Load monitor model
        const loader = new GLTFLoader();
        
        loader.load('/codegrid-3d-crt-display/public/monitor.glb', (gltf: any) => {
          const model = gltf.scene;
          const center = new THREE.Box3()
            .setFromObject(model)
            .getCenter(new THREE.Vector3());
          model.position.sub(center);
          monitorGroup.add(model);
        });

        const createScreenGeometry = (w: number, h: number, r: number) => {
          const shape = new THREE.Shape();
          const x = -w / 2;
          const y = -h / 2;

          shape.moveTo(x + r, y);
          shape.lineTo(x + w - r, y);
          shape.quadraticCurveTo(x + w, y, x + w, y + r);
          shape.lineTo(x + w, y + h - r);
          shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
          shape.lineTo(x + r, y + h);
          shape.quadraticCurveTo(x, y + h, x, y + h - r);
          shape.lineTo(x, y + r);
          shape.quadraticCurveTo(x, y, x + r, y);

          const geometry = new THREE.ShapeGeometry(shape);
          const positions = geometry.attributes.position;
          const uvs = new Float32Array(positions.count * 2);

          for (let i = 0; i < positions.count; i++) {
            uvs[i * 2] = (positions.getX(i) - x) / w;
            uvs[i * 2 + 1] = (positions.getY(i) - y) / h;
          }

          geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
          return geometry;
        };

        const textureLoader = new THREE.TextureLoader();
        const textureCache: any = {};

        // Create display material first with placeholder texture
        const defaultDisplayImg = (process.env.PUBLIC_URL || '') + '/codegrid-3d-crt-display/public/default.jpg';
        const placeholderTexture = textureLoader.load(defaultDisplayImg);
        
        const displayMaterial = new THREE.ShaderMaterial({
          uniforms: {
            map: { value: placeholderTexture },
            imageAspect: { value: 1 },
            planeAspect: { value: 0.28 / 0.235 },
            iResolution: { value: new THREE.Vector2(512, 512) },
            glitchIntensity: { value: 0.0 },
            time: { value: 0.0 },
          },
          vertexShader,
          fragmentShader,
        });

        // Now define loadTexture that can reference displayMaterial
        const loadTexture = (src: string) => {
          if (textureCache[src]) return textureCache[src];

          const texture = textureLoader.load(src, () => {
            displayMaterial.uniforms.imageAspect.value =
              texture.image.width / texture.image.height;
          });
          // colorSpace property not available in older Three.js versions
          // texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          textureCache[src] = texture;

          return texture;
        };

        // Load default texture and update material
        const defaultTexture = loadTexture(defaultDisplayImg);
        displayMaterial.uniforms.map.value = defaultTexture;

        const displayPlane = new THREE.Mesh(
          createScreenGeometry(1, 1, 0.03),
          displayMaterial
        );
        displayPlane.scale.set(0.28, 0.235, 1);
        displayPlane.position.set(-0.008, 0.005, 0.041);
        displayPlane.rotation.set(-0.18, 0, 0);
        monitorGroup.add(displayPlane);

        const mouse = { x: 0, y: 0 };
        const lerpedMouse = { x: 0, y: 0 };
        let animationFrameId: number;
        let elapsedTime = 0;

        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);

          elapsedTime += 0.016; // Approximate 60fps
          displayMaterial.uniforms.time.value = elapsedTime;

          lerpedMouse.x = gsap.utils.interpolate(lerpedMouse.x, mouse.x, 0.05);
          lerpedMouse.y = gsap.utils.interpolate(lerpedMouse.y, mouse.y, 0.05);
          monitorGroup.rotation.x = lerpedMouse.y * 0.15;
          monitorGroup.rotation.y = lerpedMouse.x * 0.3;

          renderer.render(scene, camera);
        };

        animate();
        camera.position.z = Math.max(1, 768 / mountW);

        const handleMouseMove = (e: MouseEvent) => {
          mouse.x = (e.clientX / window.innerWidth - 0.5) * 10;
          mouse.y = (e.clientY / window.innerHeight - 0.5) * 5;
        };

        const syncRendererToMount = () => {
          const w = canvasMount.clientWidth;
          const h = canvasMount.clientHeight;
          if (w > 0 && h > 0) {
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            camera.position.z = Math.max(1, 768 / w);
          }
        };

        const handleResize = () => syncRendererToMount();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
        let ro: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined') {
          ro = new ResizeObserver(() => syncRendererToMount());
          ro.observe(canvasMount);
        }

        const glitchState = { intensity: 0 };
        let glitchAnimation: gsap.core.Tween | null = null;

        const setDisplayImage = (src: string) => {
          const texture = loadTexture(src);
          displayMaterial.uniforms.map.value = texture;

          if (glitchAnimation) glitchAnimation.kill();
          glitchState.intensity = 1.0;

          glitchAnimation = gsap.to(glitchState, {
            intensity: 0,
            duration: 0.75,
            ease: 'power3.out',
            onUpdate() {
              displayMaterial.uniforms.glitchIntensity.value = glitchState.intensity;
            },
          });

          const updateAspect = () => {
            displayMaterial.uniforms.imageAspect.value =
              texture.image.width / texture.image.height;
          };
          texture.image
            ? updateAspect()
            : texture.addEventListener('load', updateAspect);
        };

        /** Channel buttons live below the 3D mount but inside `container`; wire after paint */
        const onChannelEnter = (e: Event) => {
          const t = e.currentTarget as HTMLElement;
          const imgSrc = t.getAttribute('data-img');
          if (imgSrc) setDisplayImage(imgSrc);
        };
        const onProjectsLeave = () => setDisplayImage(defaultDisplayImg);

        let channelHandlersAttached = false;
        const attachChannelHandlers = () => {
          if (channelHandlersAttached) return;
          const projectItems = container.querySelectorAll('.project-item');
          projectItems.forEach((item) => {
            item.addEventListener('mouseenter', onChannelEnter);
          });
          const projectsContainer = container.querySelector('.projects');
          projectsContainer?.addEventListener('mouseleave', onProjectsLeave);
          channelHandlersAttached = true;
        };

        let effectCancelled = false;
        const rafAttach = requestAnimationFrame(() => {
          if (!effectCancelled) attachChannelHandlers();
        });

        return () => {
          effectCancelled = true;
          cancelAnimationFrame(rafAttach);
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('resize', handleResize);
          ro?.disconnect();
          glitchAnimation?.kill();
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
          }
          const projectItems = container.querySelectorAll('.project-item');
          projectItems.forEach((item) => {
            item.removeEventListener('mouseenter', onChannelEnter);
          });
          container.querySelector('.projects')?.removeEventListener('mouseleave', onProjectsLeave);
          if (renderer.domElement.parentNode === canvasMount) {
            canvasMount.removeChild(renderer.domElement);
          }
          renderer.dispose();
        };
      } catch (error) {
        console.error('Error loading CodeGrid 3D CRT Display:', error);
        return undefined;
      }
    };

    const cleanup = initScene();
    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      className="codegrid-3d-crt-display"
      sx={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: SURFACE_CONTAINER,
      }}
    >
      {/* WebGL canvas (3D TV + CRT screen) is appended here in useEffect */}
      <Box
        ref={canvasMountRef}
        role="region"
        aria-label="3D CRT monitor — hover transmission channel buttons below to change the screen image"
        sx={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          minHeight: { xs: '70vh', md: '100vh' },
          flexShrink: 0,
          backgroundColor: '#b0b0b0',
          backgroundImage: `url(${pub || ''}/classicSection.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          overflow: 'hidden',
        }}
      />

      {/* stitch.tsx-style rail — sits after CRT, before Keep it Fresh */}
      <Box
        component="section"
        aria-label="Display channels"
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '90rem',
          mx: 'auto',
          px: { xs: '1rem', md: '1.5rem' },
          py: { xs: '2rem', md: '2.75rem' },
          zIndex: 2,
        }}
      >
        <StitchWaypointFonts />
        <Box
          sx={{
            position: 'relative',
            bgcolor: SURFACE,
            border: `6px solid ${INK}`,
            boxShadow: `10px 10px 0 0 ${INK}`,
            p: { xs: '1.25rem', md: '1.75rem' },
            transform: 'rotate(-0.35deg)',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '12px 12px',
              color: INK,
              opacity: 0.07,
              pointerEvents: 'none',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: { xs: 8, md: 12 },
              right: { xs: 10, md: 16 },
              bgcolor: PRIMARY_CONTAINER,
              color: INK,
              border: `4px solid ${INK}`,
              px: { xs: '0.5rem', md: '0.65rem' },
              py: '0.2rem',
              transform: 'rotate(8deg)',
              boxShadow: `4px 4px 0 0 ${INK}`,
              zIndex: 2,
            }}
          >
            <Typography
              sx={{
                m: 0,
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontWeight: 900,
                fontStyle: 'italic',
                fontSize: { xs: '0.65rem', md: '0.75rem' },
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              On air
            </Typography>
          </Box>

          <Typography
            component="h2"
            sx={{
              position: 'relative',
              zIndex: 1,
              m: 0,
              mb: { xs: '1rem', md: '1.25rem' },
              pr: { xs: '4.5rem', md: '5.5rem' },
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: { xs: '1.1rem', md: '1.35rem' },
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color: INK,
            }}
          >
            Transmission channels
          </Typography>

          <Box
            component="ul"
            className="projects"
            sx={{
              position: 'relative',
              zIndex: 1,
              listStyle: 'none',
              p: 0,
              m: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: { xs: '0.65rem', md: '0.85rem' },
            }}
          >
            {displayImages.map((item, index) => (
              <Box
                key={index}
                component="li"
                className="project-item"
                data-img={item.src}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: '0.5rem', md: '0.65rem' },
                  cursor: 'pointer',
                  flexShrink: 0,
                  bgcolor: SURFACE,
                  border: `4px solid ${INK}`,
                  boxShadow: `5px 5px 0 0 ${INK}`,
                  py: { xs: '0.45rem', md: '0.55rem' },
                  pl: { xs: '0.35rem', md: '0.45rem' },
                  pr: { xs: '0.85rem', md: '1rem' },
                  transition:
                    'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease, color 0.15s ease',
                  '&:hover': {
                    bgcolor: PRIMARY,
                    color: ON_PRIMARY,
                    transform: 'translate(2px, 2px)',
                    boxShadow: `3px 3px 0 0 ${INK}`,
                    '& .crt-waypoint-num': {
                      bgcolor: TERTIARY_CONTAINER,
                      color: ON_TERTIARY,
                    },
                    '& .crt-waypoint-label': {
                      color: ON_PRIMARY,
                    },
                  },
                }}
              >
                <Box
                  className="crt-waypoint-num"
                  component="span"
                  aria-hidden
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: { xs: '2rem', md: '2.35rem' },
                    py: '0.2rem',
                    px: '0.35rem',
                    bgcolor: TERTIARY_CONTAINER,
                    color: ON_TERTIARY,
                    border: `3px solid ${INK}`,
                    boxShadow: `3px 3px 0 0 ${INK}`,
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    fontSize: { xs: '0.7rem', md: '0.8rem' },
                    lineHeight: 1,
                    transition: 'background-color 0.15s ease, color 0.15s ease',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </Box>
                <Box
                  component="span"
                  className="crt-waypoint-label"
                  sx={{
                    textTransform: 'uppercase',
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: { xs: '0.65rem', md: '0.78rem' },
                    fontWeight: 900,
                    fontStyle: 'italic',
                    letterSpacing: '0.06em',
                    color: INK,
                    transition: 'color 0.15s ease',
                  }}
                >
                  {item.name}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CodeGrid3DCRTDisplay;



