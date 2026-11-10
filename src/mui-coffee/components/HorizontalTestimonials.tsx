import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating: number;
}

interface HorizontalTestimonialsProps {
  testimonials: Testimonial[];
  className?: string;
}

const HorizontalTestimonials: React.FC<HorizontalTestimonialsProps> = ({ testimonials, className }) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = testimonials[selectedIndex] || testimonials[0];

  if (!selected) return null;

  return (
    <Box component="section" className={`cafert-guestbook${className ? ` ${className}` : ''}`} sx={{ position: 'relative', overflow: 'hidden', py: { xs: 8, md: 12 }, px: { xs: 2, sm: 3 }, color: '#493b2d', background: '#f4efe5' }}>
      <Box className="cafert-guestbook__inner">
        <Box className="cafert-guestbook__heading">
          <Box>
            <Typography component="p" className="cafert-guestbook__eyebrow">{t('testimonials.guestbookEyebrow')}</Typography>
            <Typography component="h2" className="cafert-guestbook__title">{t('testimonials.title')}</Typography>
          </Box>
          <Typography component="p" className="cafert-guestbook__intro">{t('testimonials.guestbookIntro')}</Typography>
        </Box>

        <Box className="cafert-guestbook__desk">
          <Box className="cafert-guestbook__book" aria-label={t('testimonials.guestbookLabel')}>
            <Box className="cafert-guestbook__left-page">
              <span className="cafert-guestbook__page-mark">CAFERT · {t('testimonials.guestbookLabel')}</span>
              <span className="cafert-guestbook__scribble" aria-hidden="true">{t('testimonials.guestbookPrompt')}</span>
              {selected.avatar && <img className="cafert-guestbook__portrait" src={selected.avatar} alt="" />}
              <Box className="cafert-guestbook__stamp" aria-hidden="true">
                <span>{t('testimonials.guestbookStampTop')}</span>
                <strong>{t('testimonials.guestbookStampCenter')}</strong>
                <span>{t('testimonials.guestbookStampBottom')}</span>
              </Box>
              <span className="cafert-guestbook__left-caption">{t('testimonials.guestbookCaption')}</span>
            </Box>

            <Box className="cafert-guestbook__right-page" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selected.id}
                  className="cafert-guestbook__entry"
                  initial={reduceMotion ? false : { opacity: 0, x: 18, rotate: 1.2 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: -12, rotate: -0.6 }}
                  transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.2, 0.75, 0.25, 1] }}
                >
                  <Box className="cafert-guestbook__entry-top">
                    <span>{t('testimonials.guestbookEntryLabel')}</span>
                    <span>{String(selectedIndex + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}</span>
                  </Box>
                  <Box className="cafert-guestbook__rating" role="img" aria-label={`${selected.rating} ${t('testimonials.outOfFive')}`}>{Array.from({ length: 5 }).map((_, i) => <span key={i} aria-hidden="true">{i < selected.rating ? '★' : '☆'}</span>)}</Box>
                  <Typography component="blockquote" className="cafert-guestbook__quote">“{selected.quote}”</Typography>
                  <Box className="cafert-guestbook__signature">
                    <Typography component="strong">{selected.author}</Typography>
                    {selected.role && <Typography component="span">{selected.role}</Typography>}
                  </Box>
                </motion.div>
              </AnimatePresence>
              <span className="cafert-guestbook__paper-number" aria-hidden="true">{String(selectedIndex + 1).padStart(2, '0')}</span>
            </Box>

            <Box className="cafert-guestbook__binding" aria-hidden="true"><i /><i /><i /><i /></Box>
            <Box className="cafert-guestbook__page-stack" aria-hidden="true" />
          </Box>

          <Box className="cafert-guestbook__cutout-wrap" aria-hidden="true">
            <img className="cafert-guestbook__cup-cutout" src="/img/coffee/review-cappuccino-cutout.webp" alt="" />
            <span className="cafert-guestbook__cutout-caption">{t('testimonials.guestbookCutout')}</span>
          </Box>
        </Box>

        <Box className="cafert-guestbook__index" role="group" aria-label={t('testimonials.guestbookIndex')}>
          <span className="cafert-guestbook__index-label">{t('testimonials.guestbookIndex')}</span>
          {testimonials.map((testimonial, index) => (
            <button key={testimonial.id} type="button" aria-pressed={selectedIndex === index} onClick={() => setSelectedIndex(index)} className={`cafert-guestbook__tab${selectedIndex === index ? ' is-current' : ''}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{testimonial.author.split(' ')[0]}</strong>
              <i aria-hidden="true">↗</i>
            </button>
          ))}
        </Box>
      </Box>

      <style>{`
        .cafert-guestbook__inner{max-width:1160px;margin:0 auto}
        .cafert-guestbook__heading{display:grid;grid-template-columns:1fr minmax(260px,390px);align-items:end;gap:32px;margin:0 0 42px}
        .cafert-guestbook__eyebrow{margin:0 0 12px;color:#9a6848;font:600 12px/1.3 monospace;letter-spacing:.16em;text-transform:uppercase}
        .cafert-guestbook__title{margin:0;color:#493b2d;font:500 clamp(42px,6vw,72px)/.96 'EB Garamond',Georgia,serif;letter-spacing:-.035em}
        .cafert-guestbook__intro{max-width:36ch;margin:0 0 5px;color:#726653;font:italic 21px/1.42 'EB Garamond',Georgia,serif}
        .cafert-guestbook__desk{position:relative;padding:18px 20px 46px 0}
        .cafert-guestbook__book{position:relative;isolation:isolate;display:grid;grid-template-columns:.83fr 1.17fr;min-height:390px;filter:drop-shadow(0 22px 24px #5d493019)}
        .cafert-guestbook__left-page,.cafert-guestbook__right-page{position:relative;min-width:0;background-color:#fffaf0;background-image:repeating-linear-gradient(0deg,transparent 0 31px,#a7825820 32px,#a7825820 33px);}
        .cafert-guestbook__left-page{z-index:1;padding:26px 35px 28px 32px;transform:rotate(-.7deg);clip-path:polygon(0 1%,98% 0,100% 98%,2% 100%);box-shadow:inset -12px 0 18px -18px #583f25}
        .cafert-guestbook__right-page{z-index:2;display:flex;align-items:center;padding:38px clamp(28px,5vw,70px) 38px clamp(38px,5vw,70px);background-color:#fffdf6;transform:rotate(.35deg);box-shadow:inset 14px 0 22px -22px #503d29;clip-path:polygon(0 0,99% 1%,100% 99%,1% 100%)}
        .cafert-guestbook__page-mark{display:block;color:#8b735c;font:10px/1.4 monospace;letter-spacing:.12em;text-transform:uppercase}
        .cafert-guestbook__scribble{display:block;margin-top:52px;color:#554b3c;font:italic 24px/1.25 'EB Garamond',Georgia,serif;transform:rotate(-5deg)}
        .cafert-guestbook__portrait{position:absolute;left:24px;bottom:64px;width:112px;height:112px;object-fit:cover;filter:sepia(.12) saturate(.8);clip-path:polygon(4% 1%,96% 4%,100% 96%,2% 100%);transform:rotate(-5deg);box-shadow:0 6px 12px #47362230}
        .cafert-guestbook__stamp{position:absolute;right:22px;bottom:75px;width:104px;height:104px;border:2px solid #b94f3d;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;color:#ad4d3c;transform:rotate(11deg);opacity:.9;text-align:center}
        .cafert-guestbook__stamp:before{content:'';position:absolute;inset:5px;border:1px dashed currentColor;border-radius:50%}
        .cafert-guestbook__stamp span{font:8px/1 monospace;letter-spacing:.1em}
        .cafert-guestbook__stamp strong{font:700 14px/1 'EB Garamond',Georgia,serif;letter-spacing:.04em}
        .cafert-guestbook__left-caption{position:absolute;left:29px;bottom:23px;color:#89745d;font:italic 13px/1.2 'EB Garamond',Georgia,serif}
        .cafert-guestbook__binding{position:absolute;z-index:5;left:41.3%;top:2%;bottom:2%;display:flex;flex-direction:column;justify-content:space-around;width:20px;pointer-events:none}
        .cafert-guestbook__binding i{display:block;width:15px;height:15px;border:2px solid #b8a181;border-radius:50%;background:#e7dbc4;box-shadow:inset 0 1px 2px #70593940}
        .cafert-guestbook__page-stack{position:absolute;z-index:-1;inset:8px -4px -6px 1.5%;background:#e9ddc8;clip-path:polygon(0 0,100% 1%,99% 99%,1% 100%);filter:drop-shadow(0 8px 5px #523b2015)}
        .cafert-guestbook__entry{width:100%;position:relative}
        .cafert-guestbook__entry-top{display:flex;justify-content:space-between;gap:16px;color:#9a7653;font:10px/1.4 monospace;letter-spacing:.1em;text-transform:uppercase}
        .cafert-guestbook__rating{margin:28px 0 12px;color:#b68140;font-size:19px;letter-spacing:.1em}
        .cafert-guestbook__quote{max-width:610px;margin:0;color:#493b2d;font:italic clamp(27px,3.3vw,43px)/1.14 'EB Garamond',Georgia,serif;letter-spacing:-.015em}
        .cafert-guestbook__signature{display:flex;align-items:baseline;gap:12px;margin-top:24px;padding-top:15px;border-top:1px solid #cdbb9d}
        .cafert-guestbook__signature strong{color:#493b2d;font:600 21px/1.2 'EB Garamond',Georgia,serif}
        .cafert-guestbook__signature span{color:#82745f;font:italic 15px/1.2 'EB Garamond',Georgia,serif}
        .cafert-guestbook__paper-number{position:absolute;right:22px;bottom:18px;color:#a3927b;font:10px/1 monospace;letter-spacing:.12em}
        .cafert-guestbook__cutout-wrap{position:absolute;z-index:6;left:-62px;bottom:-22px;width:280px;transform:rotate(-8deg);pointer-events:none}
        .cafert-guestbook__cup-cutout{display:block;width:100%;height:auto;filter:drop-shadow(0 15px 11px #4c382523)}
        .cafert-guestbook__cutout-caption{position:absolute;right:-32px;bottom:19px;padding:7px 10px;background:#f6e7c9;color:#765d41;font:italic 13px/1 'EB Garamond',Georgia,serif;transform:rotate(11deg);box-shadow:0 2px 5px #4f38201a}
        .cafert-guestbook__index{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding-left:30px;margin-top:25px}
        .cafert-guestbook__index-label{margin-right:10px;color:#88745b;font:10px/1.2 monospace;letter-spacing:.12em;text-transform:uppercase}
        .cafert-guestbook__tab{display:flex;align-items:center;gap:10px;min-height:42px;padding:7px 13px;border:1px solid #d4c3a7;background:#eee4d2;color:#6d5b45;font:inherit;cursor:pointer;transform:rotate(var(--tab-tilt,0deg));transition:transform .18s ease,background .18s ease,box-shadow .18s ease}
        .cafert-guestbook__tab:nth-of-type(2){--tab-tilt:-1.5deg}.cafert-guestbook__tab:nth-of-type(3){--tab-tilt:1deg}.cafert-guestbook__tab:nth-of-type(4){--tab-tilt:-.8deg}.cafert-guestbook__tab:nth-of-type(5){--tab-tilt:1.6deg}
        .cafert-guestbook__tab:hover{transform:translateY(-3px) rotate(var(--tab-tilt));box-shadow:0 5px 9px #493b2d18}
        .cafert-guestbook__tab:focus-visible{outline:3px solid #a96848;outline-offset:3px}
        .cafert-guestbook__tab.is-current{background:#a96848;color:#fff8ed;border-color:#a96848;box-shadow:0 4px 10px #75462b30}
        .cafert-guestbook__tab span{font:10px/1 monospace;opacity:.72}.cafert-guestbook__tab strong{font:600 16px/1 'EB Garamond',Georgia,serif}.cafert-guestbook__tab i{font:normal 13px/1 sans-serif;opacity:.72}
        @media(max-width:760px){.cafert-guestbook__heading{grid-template-columns:1fr;gap:14px;margin-bottom:28px}.cafert-guestbook__intro{font-size:19px}.cafert-guestbook__desk{padding:10px 0 92px 0}.cafert-guestbook__book{grid-template-columns:.7fr 1.3fr;min-height:370px}.cafert-guestbook__left-page{padding:20px 20px 18px 19px}.cafert-guestbook__right-page{padding:28px 25px 35px 35px}.cafert-guestbook__scribble{margin-top:30px;font-size:19px}.cafert-guestbook__portrait{left:14px;bottom:63px;width:74px;height:74px}.cafert-guestbook__stamp{right:8px;bottom:70px;width:76px;height:76px}.cafert-guestbook__stamp strong{font-size:11px}.cafert-guestbook__stamp span{font-size:6px}.cafert-guestbook__binding{left:33%}.cafert-guestbook__quote{font-size:clamp(24px,6vw,35px)}.cafert-guestbook__rating{margin-top:21px}.cafert-guestbook__signature{display:block;margin-top:18px}.cafert-guestbook__signature span{display:block;margin-top:4px}.cafert-guestbook__cutout-wrap{left:-18px;bottom:-6px;width:205px}.cafert-guestbook__index{padding-left:0;margin-top:4px;gap:8px}.cafert-guestbook__index-label{width:100%;margin:0 0 4px}}
        @media(max-width:430px){.cafert-guestbook{padding-left:14px!important;padding-right:14px!important}.cafert-guestbook__book{min-height:345px;grid-template-columns:.63fr 1.37fr}.cafert-guestbook__left-page{padding-left:14px;padding-right:12px}.cafert-guestbook__right-page{padding:23px 17px 30px 25px}.cafert-guestbook__page-mark{font-size:8px}.cafert-guestbook__scribble{font-size:16px}.cafert-guestbook__portrait{width:56px;height:56px;bottom:72px}.cafert-guestbook__stamp{width:60px;height:60px;right:6px;bottom:70px}.cafert-guestbook__stamp strong{font-size:9px}.cafert-guestbook__left-caption{left:14px;font-size:10px}.cafert-guestbook__binding{left:29%}.cafert-guestbook__binding i{width:11px;height:11px}.cafert-guestbook__entry-top{font-size:8px}.cafert-guestbook__quote{font-size:23px}.cafert-guestbook__cutout-wrap{width:168px;left:-12px}.cafert-guestbook__cutout-caption{right:-32px;font-size:11px}.cafert-guestbook__tab{min-height:38px;padding:6px 9px;gap:7px}.cafert-guestbook__tab strong{font-size:14px}}
        @media(prefers-reduced-motion:reduce){.cafert-guestbook__tab{transition:none}}
      `}</style>
    </Box>
  );
};

export default HorizontalTestimonials;
