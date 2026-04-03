import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './TextReveal.css';

gsap.registerPlugin(ScrollTrigger);

type TextRevealProps = {
  /** Element(s) to reveal. Prefer plain elements like <h1> / <p> / <div>. */
  children: React.ReactNode;
  /** Reveal block color. */
  blockColor?: string;
  /** Animate when scrolled into view. */
  animateOnScroll?: boolean;
  /** Delay before revealing (seconds). */
  delay?: number;
  /** Stagger between each child element (seconds). */
  stagger?: number;
  /** Duration for the block in/out (seconds). */
  duration?: number;
};

/**
 * Minimal adaptation of the Codegrid block-reveal text animation.
 * No Next/Prismic dependencies; kept isolated so you can delete later.
 *
 * Note: original demo uses SplitText (line reveals). This version reveals per child block.
 */
export default function TextReveal({
  children,
  blockColor = '#000',
  animateOnScroll = true,
  delay = 0,
  stagger = 0.15,
  duration = 0.75,
}: TextRevealProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const items = Array.from(root.querySelectorAll<HTMLElement>('[data-tr-item]'));
      if (items.length === 0) return;

      const blocks = items.map((el) => el.querySelector<HTMLElement>('[data-tr-block]')).filter(Boolean) as HTMLElement[];
      const texts = items.map((el) => el.querySelector<HTMLElement>('[data-tr-text]')).filter(Boolean) as HTMLElement[];

      blocks.forEach((b) => {
        b.style.backgroundColor = blockColor;
      });

      gsap.set(texts, { opacity: 0 });
      gsap.set(blocks, { scaleX: 0, transformOrigin: 'left center' });

      const playAll = () => {
        items.forEach((_, i) => {
          const tl = gsap.timeline({ delay: delay + i * stagger });
          const block = blocks[i];
          const text = texts[i];
          if (!block || !text) return;
          tl.to(block, { scaleX: 1, duration, ease: 'power4.inOut' });
          tl.set(text, { opacity: 1 });
          tl.set(block, { transformOrigin: 'right center' });
          tl.to(block, { scaleX: 0, duration, ease: 'power4.inOut' });
        });
      };

      if (animateOnScroll) {
        ScrollTrigger.create({
          trigger: root,
          start: 'top 90%',
          once: true,
          onEnter: playAll,
        });
      } else {
        playAll();
      }
    },
    { scope: rootRef, dependencies: [blockColor, animateOnScroll, delay, stagger, duration] }
  );

  return (
    <div ref={rootRef} className="tr-root" data-tr-root>
      {React.Children.map(children, (child) => {
        if (child == null || typeof child === 'boolean') return null;
        return (
          <div className="tr-item" data-tr-item>
            <div className="tr-text" data-tr-text>
              {child as any}
            </div>
            <div className="tr-block" data-tr-block aria-hidden="true" />
          </div>
        );
      })}
    </div>
  );
}

