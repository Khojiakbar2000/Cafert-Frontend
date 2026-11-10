import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export interface EventServiceItem {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  features: string[];
  image: string;
  icon: React.ReactNode;
}

interface EventTableExperienceProps {
  services: EventServiceItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onDetails: (index: number) => void;
}

const sceneImages = [
  '/img/events/private-event-cutout.webp',
  '/img/events/catering-cutout.webp',
  '/img/events/workshop-cutout.webp',
];

const EventTableExperience: React.FC<EventTableExperienceProps> = ({ services, selectedIndex, onSelect, onDetails }) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const selected = services[selectedIndex] || services[0];
  if (!selected) return null;

  return (
    <Box component="section" className="cafert-events" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, sm: 3 }, background: '#eee5d6', color: '#493b2d', overflow: 'hidden' }}>
      <Box sx={{ maxWidth: 1160, mx: 'auto' }}>
        <Box sx={{ maxWidth: 760, mb: { xs: 4, md: 6 } }}>
          <Typography component="p" sx={{ m: 0, mb: 1.5, color: '#936b46', font: '600 12px/1.4 monospace', letterSpacing: '.18em', textTransform: 'uppercase' }}>{t('eventExperience.eyebrow')}</Typography>
          <Typography component="h2" sx={{ m: 0, color: '#493b2d', fontFamily: '"EB Garamond", Georgia, serif', fontSize: 'clamp(44px,7vw,82px)', lineHeight: '.94', fontWeight: 500, letterSpacing: '-.035em' }}>{t('eventExperience.title')}</Typography>
          <Typography component="p" sx={{ maxWidth: '58ch', mt: 2, mb: 0, color: '#746653', fontFamily: '"EB Garamond", Georgia, serif', fontSize: { xs: '19px', sm: '22px' }, lineHeight: 1.45 }}>{t('eventExperience.subtitle')}</Typography>
        </Box>

        <Box className="cafert-events__layout" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(310px,.82fr) minmax(0,1.18fr)' }, gap: { xs: 4, md: 5 }, alignItems: 'center' }}>
          <Box className="cafert-events__menu" sx={{ position: 'relative', p: { xs: 2.5, sm: 3.5 }, background: '#fbf6eb', border: '1px solid #d7c8b1', boxShadow: '0 3px 0 -1px #e0d4c1,0 14px 28px #57452d18' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1.5, mb: 1, borderBottom: '1px solid #d8cbb6' }}>
              <Typography component="span" sx={{ color: '#8a6544', font: '12px/1.4 monospace', letterSpacing: '.13em' }}>{t('eventExperience.menuLabel')}</Typography>
              <Typography component="span" sx={{ color: '#8a8174', font: '12px/1.4 monospace' }}>01—03</Typography>
            </Box>
            <Typography component="h3" sx={{ m: '0 0 8px', color: '#493b2d', fontFamily: '"EB Garamond", Georgia, serif', fontSize: '30px', fontWeight: 500 }}>{t('eventExperience.prompt')}</Typography>

            <Box role="group" aria-label={t('eventExperience.chooseService')}>
              {services.map((service, index) => (
                <Box key={service.id} component="button" type="button" aria-pressed={selectedIndex === index} onClick={() => onSelect(index)} className={`cafert-events__choice${selectedIndex === index ? ' is-selected' : ''}`} sx={{
                  appearance: 'none', display: 'grid', gridTemplateColumns: '34px minmax(0,1fr)', alignItems: 'start', gap: 1.25, position: 'relative', width: '100%', minHeight: { xs: 94, sm: 102 }, py: 1.8, px: 1.2, pr: { xs: 11.5, sm: 13 }, border: 0, borderBottom: '1px dotted #c4b49c', textAlign: 'left', color: '#493b2d', background: 'transparent', font: 'inherit', cursor: 'pointer', transition: 'background .2s ease',
                  '&:hover': { background: '#f4ecde' }, '&.is-selected': { background: '#f3eadb' }, '&:focus-visible': { outline: '2px solid #936b46', outlineOffset: -2 }
                }}>
                  <Typography component="span" sx={{ color: '#9b886f', font: '13px/1.6 monospace' }}>{String(index + 1).padStart(2, '0')}</Typography>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography component="span" className="cafert-events__choice-title" sx={{ display: 'block', color: '#493b2d', fontFamily: '"EB Garamond", Georgia, serif', fontSize: { xs: '21px', sm: '23px' }, lineHeight: 1.12, fontWeight: 600 }}>{service.title}</Typography>
                    <Typography component="span" sx={{ display: 'block', mt: .45, color: '#746653', fontFamily: '"EB Garamond", Georgia, serif', fontSize: { xs: '15px', sm: '16px' }, lineHeight: 1.3 }}>{service.description}</Typography>
                  </Box>
                  {selectedIndex === index && <motion.span className="cafert-events__stamp" initial={reduceMotion ? false : { opacity: 0, scale: 1.28, rotate: -20 }} animate={{ opacity: .9, scale: 1, rotate: -8 }} transition={{ duration: reduceMotion ? 0 : .28, ease: 'easeOut' }} aria-label={t('eventExperience.selected')}>
                    <span>{t('eventExperience.selectionMark')}</span><strong>{t(`eventExperience.stamps.${index}`)}</strong>
                  </motion.span>}
                </Box>
              ))}
            </Box>
            <Typography component="p" sx={{ mt: 2, mb: 0, color: '#8a8174', font: '11px/1.5 monospace', letterSpacing: '.07em' }}>{t('eventExperience.note')}</Typography>
          </Box>

          <Box>
            <Box className="cafert-events__stage" role="img" aria-label={t('eventExperience.sceneAlt', { service: selected.title })}>
              <img className="cafert-events__table" src="/img/events/cafert-table.webp" alt="" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.img key={selectedIndex} className="cafert-events__props" src={sceneImages[selectedIndex] || sceneImages[0]} alt="" aria-hidden="true"
                  initial={reduceMotion ? false : { opacity: 0, y: -10, scale: .97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: .98 }}
                  transition={{ duration: reduceMotion ? 0 : .32, ease: 'easeOut' }} />
              </AnimatePresence>
              <Box className="cafert-events__table-edge" aria-hidden="true" />
              <Box className="cafert-events__scene-label">
                <Typography component="span" sx={{ color: '#8b7559', font: '11px/1.4 monospace', letterSpacing: '.14em' }}>{t('eventExperience.nowSetting')}</Typography>
                <Typography component="strong" sx={{ display: 'block', mt: .25, color: '#493b2d', fontFamily: '"EB Garamond", Georgia, serif', fontSize: { xs: '23px', sm: '28px' }, fontWeight: 600, lineHeight: 1.05 }}>{selected.title}</Typography>
                <Typography component="span" sx={{ display: 'block', mt: .6, color: '#746653', fontFamily: '"EB Garamond", Georgia, serif', fontSize: '15px', lineHeight: 1.3 }}>{selected.features[0]}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mt: 2.5 }}>
              <Typography component="span" sx={{ color: '#746653', font: '12px/1.4 monospace', letterSpacing: '.09em' }}>{t('eventExperience.sceneHint')}</Typography>
              <Button onClick={() => onDetails(selectedIndex)} sx={{ minWidth: 'auto', p: 0, color: '#795737', fontFamily: '"EB Garamond", Georgia, serif', fontSize: '18px', textTransform: 'none', textDecoration: 'underline', textUnderlineOffset: '4px', '&:hover': { background: 'transparent', color: '#493b2d' } }}>{t('eventExperience.viewDetails')} <span aria-hidden="true" style={{ marginLeft: 8 }}>↗</span></Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <style>{`
        .cafert-events__stage{position:relative;isolation:isolate;min-height:420px;aspect-ratio:1.22;display:flex;align-items:flex-end;justify-content:center;overflow:hidden;background:radial-gradient(ellipse at 50% 56%,#faf4e8 0%,#e6d7c1 68%,#d4c1a5 100%);}
        .cafert-events__stage:before{content:'';position:absolute;z-index:-1;left:7%;right:7%;bottom:8%;height:22%;border-radius:50%;background:#75553620;filter:blur(22px)}
        .cafert-events__table{position:absolute;z-index:0;width:104%;max-width:none;height:auto;left:50%;bottom:-7%;transform:translateX(-50%);object-fit:contain;pointer-events:none;filter:drop-shadow(0 16px 15px #5b432a30)}
        .cafert-events__props{position:absolute;z-index:1;width:62%;height:auto;left:19%;top:4%;object-fit:contain;pointer-events:none;filter:drop-shadow(0 7px 8px #48341e25)}
        .cafert-events__table-edge{position:absolute;z-index:2;left:7%;right:7%;bottom:17%;height:1px;background:linear-gradient(90deg,transparent,#6a50322a,transparent);pointer-events:none}
        .cafert-events__scene-label{position:absolute;z-index:3;left:4%;bottom:6%;width:min(49%,270px);padding:15px 17px;background:#fbf6ebf2;border:1px solid #d7c8b1;box-shadow:0 8px 22px #493b2d20;transform:rotate(-1deg)}
        .cafert-events__stamp{position:absolute;right:12px;top:50%;margin-top:-26px;width:94px;min-height:51px;transform:rotate(-8deg);display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px solid #9c4840;border-radius:3px;color:#9c4840;box-shadow:inset 0 0 0 2px #9c484022;opacity:.9;text-align:center;font-family:monospace;line-height:1.05;pointer-events:none}
        .cafert-events__stamp:before{content:'';position:absolute;inset:3px;border:1px solid #9c484080}
        .cafert-events__stamp span{font-size:8px;letter-spacing:.12em}.cafert-events__stamp strong{position:relative;z-index:1;max-width:84px;padding:2px 3px;font-size:9px;letter-spacing:.07em;font-weight:700}
        @media(max-width:900px){.cafert-events__stage{min-height:0}.cafert-events__props{width:66%;left:17%}.cafert-events__table{width:112%}}
        @media(max-width:600px){.cafert-events__stage{aspect-ratio:1.04}.cafert-events__props{width:72%;left:14%;top:5%}.cafert-events__table{width:124%;bottom:-5%}.cafert-events__scene-label{left:3%;bottom:5%;width:59%;padding:11px 12px}.cafert-events__stamp{right:8px;width:82px;min-height:46px}.cafert-events__stamp strong{font-size:8px}}
        @media(prefers-reduced-motion:reduce){.cafert-events__choice,.cafert-events__stamp,.cafert-events__props{transition:none!important;animation:none!important}}
      `}</style>
    </Box>
  );
};

export default EventTableExperience;
