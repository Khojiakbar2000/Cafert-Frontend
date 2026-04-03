import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './CodeGridJeskoJetsScrollAnimation.css';

gsap.registerPlugin(ScrollTrigger);

// Pictures path: public/codegrid-jeskojets-scroll-animation 3/public/sky.jpg and window.png
const JESKO_FOLDER_ENCODED = encodeURI('codegrid-jeskojets-scroll-animation 3');

function getJeskoAssetPath(filename: string): string {
  const pub = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  const base = pub ? `${pub}/${JESKO_FOLDER_ENCODED}` : `/${JESKO_FOLDER_ENCODED}`;
  return `${base}/public/${filename}`;
}

/** Uses only the structure and behavior from public/codegrid-jeskojets-scroll-animation 3 */
const CodeGridJeskoJetsScrollAnimation: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const skySrc = getJeskoAssetPath('sky.jpg');
  const windowSrc = getJeskoAssetPath('window.png');

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const windowContainer = root.querySelector<HTMLElement>('.window-container');
    const skyContainer = root.querySelector<HTMLElement>('.sky-container');
    const heroCopy = root.querySelector<HTMLElement>('.hero-copy');
    const heroHeader = root.querySelector<HTMLElement>('.hero-header');

    if (!windowContainer || !skyContainer || !heroCopy || !heroHeader) return;

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    gsap.set(heroCopy, { yPercent: 100 });

    const skyContainerHeight = skyContainer.offsetHeight;
    const viewportHeight = window.innerHeight;
    const skyMoveDistance = skyContainerHeight - viewportHeight;

    const hero = root.querySelector<HTMLElement>('.hero');
    if (!hero) return () => { lenis.destroy(); gsap.ticker.remove(raf); };

    const st = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: `+=${window.innerHeight * 3}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      scroller: window,
      onUpdate: (self) => {
        const progress = self.progress;
        let windowScale: number;
        if (progress <= 0.5) {
          windowScale = 1 + (progress / 0.5) * 3;
        } else {
          windowScale = 4;
        }
        gsap.set(windowContainer, { scale: windowScale });
        gsap.set(heroHeader, { scale: windowScale, z: progress * 500 });
        gsap.set(skyContainer, { y: -progress * skyMoveDistance });
        let heroCopyY: number;
        if (progress <= 0.66) {
          heroCopyY = 100;
        } else if (progress >= 1) {
          heroCopyY = 0;
        } else {
          heroCopyY = 100 * (1 - (progress - 0.66) / 0.34);
        }
        gsap.set(heroCopy, { yPercent: heroCopyY });
      },
    });

    const refreshId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(refreshId);
      st.kill();
      gsap.set([windowContainer, skyContainer, heroCopy, heroHeader], { clearProps: 'all' });
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={rootRef} className="codegrid-jesk-root">
      <section className="hero">
        <div className="sky-container">
          <img src={skySrc} alt="" />
        </div>
        <div className="hero-copy">
          <h1>
            What unfolds here is not a scene, but a duration. A sustained moment
            where scale dissolves, edges soften, and perception lingers longer
            than expected. The frame holds steady while the world behind it
            shifts.
          </h1>
        </div>
        <div className="window-container">
          <img src={windowSrc} alt="" />
        </div>
        <div className="hero-header">
          <div className="col">
            <h1>
              An aperture <br />
              into stillness
            </h1>
            <p>
              A constructed moment, suspended between form and vastness. Light,
              surface, and scale are carefully arranged to suggest movement
              without urgency, presence without intrusion.
            </p>
          </div>
          <div className="col">
            <p>Observation Mode</p>
            <h1>
              Where distance <br />
              becomes a presence
            </h1>
          </div>
        </div>
      </section>

      <section className="outro">
        <h1>End of view.</h1>
        <p style={{ marginTop: '2rem', fontSize: '1rem' }}>
          <a href="/" style={{ textDecoration: 'underline' }}>← Back to home</a>
        </p>
      </section>
    </div>
  );
};

export default CodeGridJeskoJetsScrollAnimation;


