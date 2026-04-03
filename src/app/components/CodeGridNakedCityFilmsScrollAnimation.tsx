import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';
import { nakedCityFilmsAssets } from '../config/codegridNakedCityFilmsAssets';
import '../../codegrid-nakedcityfilms-scroll-animation/styles-scoped.css';

gsap.registerPlugin(ScrollTrigger, Flip);

const MOBILE_BREAKPOINT = 720;

/** Gallery: built from src/codegrid-nakedcityfilms-scroll-animation (styles-scoped.css, assets, structure + script logic from script.js). */
const CodeGridNakedCityFilmsScrollAnimation: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const navbarBackdrop = root.querySelector<HTMLElement>('.navbar-backdrop');
    const navbarBg = root.querySelector<HTMLElement>('.navbar-background');
    const navbarItems = root.querySelector<HTMLElement>('.navbar-items');
    const navbarLinks = root.querySelectorAll<HTMLElement>('.navbar-links');
    const navbarLogo = root.querySelector<HTMLElement>('.navbar-logo');

    if (!navbarBackdrop || !navbarBg || !navbarItems || !navbarLogo || navbarLinks.length === 0) {
      return;
    }

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const initNavbarAnimations = () => {
      const isDesktop = window.innerWidth >= MOBILE_BREAKPOINT;
      if (!isDesktop) {
        navbarLogo.classList.add('navbar-logo-pinned');
        gsap.set(navbarLogo, { width: 250 });
        gsap.set([navbarBg, navbarItems], { width: '100%', height: '100vh' });
        return () => {};
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const initialWidth = navbarBg.offsetWidth;
      const initialHeight = navbarBg.offsetHeight;
      const initialLinksWidths = Array.from(navbarLinks).map((link) => link.offsetWidth);

      const state = Flip.getState(navbarLogo);
      navbarLogo.classList.add('navbar-logo-pinned');
      gsap.set(navbarLogo, { width: 250 });
      const flip = Flip.from(state, { duration: 1, ease: 'none', paused: true });

      const st = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: `+=${viewportHeight}px`,
        scrub: 1,
        scroller: window,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set([navbarBg, navbarItems], {
            width: gsap.utils.interpolate(initialWidth, viewportWidth, p),
            height: gsap.utils.interpolate(initialHeight, viewportHeight, p),
          });
          navbarLinks.forEach((link, i) => {
            gsap.set(link, {
              width: gsap.utils.interpolate(link.offsetWidth, initialLinksWidths[i], p),
            });
          });
          flip.progress(p);
        },
      });

      return () => {
        st.kill();
        gsap.set([navbarBg, navbarItems, navbarLogo, ...Array.from(navbarLinks)], { clearProps: 'all' });
        navbarLogo.classList.remove('navbar-logo-pinned');
      };
    };

    let cleanup = initNavbarAnimations();

    const refresh = () => ScrollTrigger.refresh();
    const rafId = requestAnimationFrame(() => {
      refresh();
      setTimeout(refresh, 100);
    });

    let timer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        cleanup?.();
        ScrollTrigger.getAll().forEach((t) => t.kill());
        gsap.set([navbarBg, navbarItems, navbarLogo, ...Array.from(navbarLinks)], { clearProps: 'all' });
        navbarLogo.classList.remove('navbar-logo-pinned');
        cleanup = initNavbarAnimations();
      }, 250);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      cleanup?.();
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.set([navbarBg, navbarItems, navbarLogo, ...Array.from(navbarLinks)], { clearProps: 'all' });
      navbarLogo.classList.remove('navbar-logo-pinned');
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <Box ref={rootRef} className="codegrid-ncf-root">
      <div className="navbar-backdrop">
        <div className="navbar-img">
          <img src={nakedCityFilmsAssets.navbarImg} alt="" />
        </div>
        <div className="navbar-background" />
      </div>

      <div className="navbar-items">
        <div className="navbar-links">
          <a href="#">Index</a>
          <a href="#">Studio</a>
        </div>
        <div className="navbar-links">
          <a href="#">Archive</a>
          <a href="#">Connect</a>
        </div>

        <div className="navbar-logo">
          <a href="/">
            <img src={nakedCityFilmsAssets.logo} alt="Naked City Films" />
          </a>
        </div>
      </div>

      <section className="hero">
        <h1>Designing movement beyond fixed frames and rigid form</h1>
      </section>

      <section className="about">
        <h1>The frame dissolves, but the movement continues forward</h1>
      </section>

      <section className="panel">
        <h1>Where the view opens and the frame becomes a passage</h1>
        <p>
          We work at the edge of form and motion — each project a single idea pushed until it finds its own logic. No filler, no excess. Just the necessary gesture.
        </p>
      </section>

      <section className="panel">
        <h1>Studio & archive</h1>
        <p>
          Selected work across moving image, identity, and spatial design. Collaborations with institutions, brands, and artists who share a focus on clarity and rhythm.
        </p>
      </section>

      <section className="about">
        <h1>Connect</h1>
        <p style={{ marginTop: '2rem', fontSize: '1rem' }}>
          <a href="/" style={{ textDecoration: 'underline' }}>← Back to home</a>
        </p>
      </section>
    </Box>
  );
};

export default CodeGridNakedCityFilmsScrollAnimation;
