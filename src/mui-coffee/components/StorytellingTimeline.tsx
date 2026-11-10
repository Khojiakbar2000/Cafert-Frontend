import React, { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useTheme as useCafertTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

interface TimelineItem { year: string; title: string; description: string; image?: string; icon?: string; }
interface StorytellingTimelineProps { title?: string; subtitle?: string; items: TimelineItem[]; className?: string; }
type Chapter = 'welcome' | 'care' | 'together';
const chapters: Chapter[] = ['welcome', 'care', 'together'];

const StorytellingTimeline: React.FC<StorytellingTimelineProps> = ({ className }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useCafertTheme();
  const [chapter, setChapter] = useState<Chapter>('welcome');
  const [stubTorn, setStubTorn] = useState(false);
  return (
    <Box component="section" className={className} sx={{ background: isDarkMode ? '#e8dece' : '#f1e8d9', color: '#534931', py: { xs: 8, md: 12 }, px: 2, overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <div className="cafert-check__intro">
          <p><span>{t('guestCheck.reel')}</span><span>·</span><span>{t('guestCheck.seenSoon')}</span></p>
          <h2>{t('guestCheck.headline')}</h2>
          <span>{t('guestCheck.subtitle')}</span>
        </div>

        <div className="cafert-check__counter">
          <div className="cafert-check__printer" aria-label={t('guestCheck.printerLabel')}>
            <div className="cafert-check__slot" />
            <article className={`cafert-check__paper${stubTorn ? ' is-torn' : ''}`} key={chapter} aria-live="polite">
              <div className="cafert-check__main">
                <div className="cafert-check__meta"><span>{t('guestCheck.ticketNumber')}</span><span>CAFERT · {String(chapters.indexOf(chapter) + 1).padStart(2, '0')}</span></div>
                <p className="cafert-check__eyebrow">{t(`guestCheck.${chapter}Label`)}</p>
                <h3>{t(`guestCheck.${chapter}Title`)}</h3>
                <p className="cafert-check__copy">{t(`guestCheck.${chapter}Copy`)}</p>
                <div className="cafert-check__rule" />
                <p className="cafert-check__note">{t('guestCheck.footnote')}</p>
                <img className="cafert-check__pencil" src="/img/coffee/cafert-pencil.webp" alt="" aria-hidden="true" />
              </div>
              <div className="cafert-check__stub">
                <span>{String(chapters.indexOf(chapter) + 1).padStart(2, '0')}</span>
                <strong>{t(`guestCheck.${chapter}Stub`)}</strong>
                <span>CAFERT</span>
              </div>
            </article>
            <div className="cafert-check__printer-base" />
            <button type="button" className="cafert-check__tear" aria-pressed={stubTorn} onClick={() => setStubTorn(value => !value)}>{t(stubTorn ? 'guestCheck.restoreStub' : 'guestCheck.tearStub')} <span aria-hidden="true">{stubTorn ? '↶' : '✂'}</span></button>
          </div>

          <div className="cafert-check__chapters" role="group" aria-label={t('guestCheck.chooseChapter')}>
            {chapters.map((item, index) => <button key={item} type="button" aria-pressed={chapter === item} onClick={() => setChapter(item)}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{t(`guestCheck.${item}Nav`)}</strong>
              <i aria-hidden="true">{chapter === item ? '●' : '↗'}</i>
            </button>)}
          </div>
        </div>
        <div className="cafert-check__end"><span>{t('guestCheck.endLine')}</span><span aria-hidden="true">☕</span></div>
      </Container>
      <style>{`
        .cafert-check__intro{max-width:950px;margin:0 auto 54px}
        .cafert-check__intro>p{display:flex;gap:14px;align-items:center;margin:0 0 18px;color:#786b56;font-size:14px;letter-spacing:.17em}
        .cafert-check__intro>p span:first-child{color:#986b43}
        .cafert-check__intro h2{margin:0;color:#534931;font-family:'EB Garamond',Georgia,serif;font-weight:600;font-size:clamp(54px,8.5vw,112px);line-height:.9;letter-spacing:-.035em;text-transform:uppercase}
        .cafert-check__intro>span{display:block;margin-top:22px;color:#73644e;font-family:'EB Garamond',Georgia,serif;font-size:clamp(20px,2.4vw,28px);font-style:italic;line-height:1.35}
        .cafert-check__counter{position:relative;display:grid;grid-template-columns:minmax(0,1.3fr) minmax(250px,.7fr);gap:clamp(28px,6vw,84px);align-items:center;max-width:1040px;margin:0 auto;min-height:410px;padding:36px;background:radial-gradient(ellipse at 14% 89%,#b38e6a35,transparent 26%),repeating-linear-gradient(0deg,#8b714311 0 1px,transparent 1px 8px),#e3d4be;box-shadow:0 22px 55px #624a2d23,inset 0 0 0 1px #ccb99d}
        .cafert-check__printer{position:relative;padding:0 0 22px;filter:drop-shadow(0 20px 18px #624a2d35)}.cafert-check__printer::after{content:'';position:absolute;z-index:-1;left:2%;bottom:4px;width:118px;height:76px;border:8px solid #986f4623;border-radius:50%;transform:rotate(-18deg);filter:blur(2px)}
        .cafert-check__slot{width:74%;height:13px;margin:0 auto -2px;position:relative;z-index:2;background:#0d0c0a;border-radius:2px;box-shadow:inset 0 2px 5px #000,0 2px #5e5141}
        .cafert-check__paper{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 76px;min-height:318px;background:radial-gradient(ellipse at 85% 18%,#b38e6a12,transparent 28%),#fbf5e8;color:#211d18;animation:guest-check-print .62s cubic-bezier(.2,.8,.25,1) both;box-shadow:inset 0 0 0 1px #d0c4b0}
        .cafert-check__main{position:relative;padding:26px clamp(20px,3vw,38px) 116px;border:1px dashed #b6ac9d;margin:10px 0 10px 10px}
        .cafert-check__meta{display:flex;justify-content:space-between;gap:12px;color:#79736a;font-family:monospace;font-size:12px;letter-spacing:.13em}
        .cafert-check__eyebrow{margin:28px 0 3px;color:#80776c;font-family:monospace;font-size:12px;letter-spacing:.2em;text-transform:uppercase}
        .cafert-check__main h3{margin:0;color:#1f1b17;font-family:'EB Garamond',Georgia,serif;font-size:clamp(38px,5vw,60px);font-weight:700;line-height:.98;text-transform:uppercase}
        .cafert-check__copy{max-width:46ch;margin:18px 0;color:#5f574e;font-size:16px;line-height:1.65}
        .cafert-check__rule{border-top:1px dotted #b6ac9d;margin:18px 0 12px}
        .cafert-check__note{margin:0;color:#81796f;font-family:monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase}
        .cafert-check__pencil{position:absolute;right:4px;bottom:3px;width:clamp(180px,25vw,230px);height:auto;transform:rotate(-1deg);transform-origin:20% 50%;filter:drop-shadow(0 7px 4px #49362036);animation:pencil-mark .65s .25s cubic-bezier(.2,.8,.2,1) both}.cafert-check__paper.is-torn .cafert-check__pencil{transform:translate(16px,-5px) rotate(1deg);animation:none}
        @keyframes pencil-mark{0%{opacity:0;transform:translate(14px,-4px) rotate(1deg)}100%{opacity:1;transform:translate(0,0) rotate(-1deg)}}
        .cafert-check__stub{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:22px 12px;border-left:2px dashed #b6ac9d;color:#868075;font-family:monospace;letter-spacing:.18em;font-size:11px;transition:transform .5s cubic-bezier(.2,.8,.2,1),filter .5s}
        .cafert-check__stub::before,.cafert-check__stub::after{content:'';position:absolute;left:-7px;width:12px;height:12px;border-radius:50%;background:#e3d4be}
        .cafert-check__stub::before{top:-6px}.cafert-check__stub::after{bottom:-6px}
        .cafert-check__paper.is-torn .cafert-check__stub{transform:translate(14px,-4px) rotate(2deg);filter:drop-shadow(0 8px 6px #49362029);clip-path:polygon(9% 0,100% 0,100% 100%,5% 100%,9% 94%,3% 88%,9% 81%,3% 75%,9% 69%,3% 62%,9% 56%,3% 50%,9% 44%,3% 38%,9% 31%,3% 25%,9% 19%,3% 12%,9% 6%)}
        .cafert-check__stub strong{writing-mode:vertical-rl;transform:rotate(180deg);color:#211d18;font-family:'EB Garamond',Georgia,serif;font-size:22px;letter-spacing:.08em}
        .cafert-check__printer-base{height:19px;margin:0 -16px;background:linear-gradient(#665844,#43382b 45%,#2d261e);border-radius:0 0 5px 5px;box-shadow:0 7px 10px #0005}
        .cafert-check__chapters{display:flex;flex-direction:column;border-top:1px solid #b6a58b;border-bottom:1px solid #b6a58b}
        .cafert-check__chapters button{appearance:none;display:grid;grid-template-columns:38px 1fr 26px;align-items:center;gap:12px;width:100%;min-height:78px;padding:12px 10px;border:0;border-bottom:1px solid #b6a58b;background:transparent;color:#665842;text-align:left;font:inherit;cursor:pointer}
        .cafert-check__chapters button:last-child{border-bottom:0}.cafert-check__chapters button>span{font:13px monospace;color:#92816a}.cafert-check__chapters button strong{font:500 23px/1.15 'EB Garamond',Georgia,serif}.cafert-check__chapters button i{font-style:normal;color:#986b43;font-size:14px}.cafert-check__chapters button[aria-pressed=true]{color:#534931}.cafert-check__chapters button:hover strong{color:#534931}.cafert-check__chapters button:focus-visible{outline:2px solid #986b43;outline-offset:-3px}
        .cafert-check__end{max-width:1040px;margin:32px auto 0;padding-top:16px;border-top:1px solid #b6a58b;display:flex;justify-content:space-between;align-items:center;color:#74664f;font:13px monospace;letter-spacing:.1em}.cafert-check__end span:last-child{font-size:22px;color:#986b43}
        .cafert-check__tear{margin:12px auto 0;min-height:44px;padding:8px 14px;border:1px dashed #9c7956;background:transparent;color:#68543d;font:13px monospace;letter-spacing:.04em;cursor:pointer}.cafert-check__tear span{margin-left:9px;color:#986b43}.cafert-check__tear:focus-visible{outline:2px solid #986b43;outline-offset:3px}
        @keyframes guest-check-print{from{opacity:0;clip-path:inset(0 0 100% 0);transform:translateY(-16px)}to{opacity:1;clip-path:inset(0 0 0 0);transform:translateY(0)}}
        @media(max-width:760px){.cafert-check__counter{grid-template-columns:1fr;gap:30px;padding:22px}.cafert-check__paper{grid-template-columns:minmax(0,1fr) 58px;min-height:300px}.cafert-check__stub{padding:18px 8px}.cafert-check__main{padding:20px 17px 88px}.cafert-check__pencil{width:clamp(155px,43vw,205px);right:0;bottom:6px}.cafert-check__chapters{display:grid;grid-template-columns:1fr}.cafert-check__intro{margin-bottom:38px}}
        @media(prefers-reduced-motion:reduce){.cafert-check__paper,.cafert-check__pencil{animation:none}}
      `}</style>
    </Box>
  );
};
export default StorytellingTimeline;
