import React, { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './AwardsStripCupping.css';

interface Award {
  id: string;
  title: string;
  subtitle: string;
  year?: string;
}

const AwardsStrip: React.FC = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const awards: Award[] = [
    { id: 'best-cafe', title: t('awards.bestCafe.title', 'Best Café 2024'), subtitle: t('awards.bestCafe.subtitle', 'Local Excellence Award'), year: '2024' },
    { id: 'organic', title: t('awards.organic.title', '100% Organic Beans'), subtitle: t('awards.organic.subtitle', 'Certified Organic'), year: '2024' },
    { id: 'barista', title: t('awards.barista.title', 'Barista Champion Finalist'), subtitle: t('awards.barista.subtitle', 'Regional Competition'), year: '2023' },
    { id: 'quality', title: t('awards.quality.title', 'Quality Excellence'), subtitle: t('awards.quality.subtitle', 'Customer Satisfaction'), year: '2024' },
    { id: 'sustainable', title: t('awards.sustainable.title', 'Sustainable Business'), subtitle: t('awards.sustainable.subtitle', 'Green Certification'), year: '2023' }
  ];
  const active = awards[selected];

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % awards.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + awards.length - 1) % awards.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = awards.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    document.getElementById(`cafert-cupping-${next}`)?.focus();
  };

  return (
    <Box component="section" className="cafert-cupping" aria-labelledby="cafert-cupping-title">
      <Container maxWidth="xl" className="cafert-cupping__container">
        <Box className="cafert-cupping__heading">
          <Typography component="p" className="cafert-cupping__eyebrow">
            {t('awards.sectionTitle', 'Awards & Certifications')}
          </Typography>
          <Typography component="h2" id="cafert-cupping-title" className="cafert-cupping__title">
            {t('awards.mainTitle', 'Our Achievements')}
          </Typography>
          <Typography component="p" className="cafert-cupping__intro">
            {t('awards.description', 'A good cup is a team effort. Here are a few moments we are proud of.')}
          </Typography>
        </Box>

        <Box className="cafert-cupping__scene">
          <Box className="cafert-cupping__crew">
            <span className="cafert-cupping__crew-note" aria-hidden="true">{t('awards.cuppingCrewNote', 'THE TASTING CREW')}</span>
            <img
              className="cafert-cupping__crew-image"
              src="/img/coffee/cafert-cupping-crew.png"
              alt={t('awards.cuppingCrewAlt', 'A cheerful coffee bean barista and a demitasse cup celebrate a tasting medal together')}
              width="1536"
              height="1024"
            />
            <span className="cafert-cupping__crew-caption">{t('awards.cuppingCrewCaption', 'Bean & Crema, on quality control')}</span>
          </Box>

          <Box className="cafert-cupping__tasting">
            <Box className="cafert-cupping__table" aria-label={t('awards.cuppingTable', 'Coffee cupping table')}>
              <span className="cafert-cupping__table-edge" aria-hidden="true" />
              <img
                className="cafert-cupping__bowls-cutout"
                src="/img/coffee/cafert-cupping-bowls.png"
                alt=""
                width="2172"
                height="724"
                aria-hidden="true"
              />
              <Box className="cafert-cupping__bowls" role="tablist" aria-label={t('awards.cuppingChoices', 'Choose an award tasting bowl')}>
                {awards.map((award, index) => (
                  <Button
                    key={award.id}
                    id={`cafert-cupping-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={selected === index}
                    aria-controls="cafert-cupping-note"
                    tabIndex={selected === index ? 0 : -1}
                    className={`cafert-cupping__bowl${selected === index ? ' is-selected' : ''}`}
                    onClick={() => setSelected(index)}
                    onKeyDown={(event) => onKeyDown(event, index)}
                    aria-label={`${award.title}${award.year ? `, ${award.year}` : ''}`}
                  >
                    <span className="cafert-cupping__bowl-number">0{index + 1}</span>
                  </Button>
                ))}
              </Box>
              <span className="cafert-cupping__table-label">{t('awards.cuppingTableLabel', 'CAFERT · HOUSE FLIGHT')}</span>
            </Box>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                id="cafert-cupping-note"
                className="cafert-cupping__scorecard"
                role="tabpanel"
                aria-labelledby={`cafert-cupping-${selected}`}
                aria-live="polite"
                initial={reduceMotion ? false : { opacity: 0, y: 16, rotate: -1.2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8, rotate: 0.8 }}
                transition={{ duration: reduceMotion ? 0 : 0.28, ease: 'easeOut' }}
              >
                <Box className="cafert-cupping__scorecard-head">
                  <span>{t('awards.cuppingNotes', 'CUPPING NOTES')}</span>
                  <span>{t('awards.cuppingSession', 'SESSION 01')} · {String(selected + 1).padStart(2, '0')}</span>
                </Box>
                <Typography component="h3" className="cafert-cupping__award-title">{active.title}</Typography>
                <Box className="cafert-cupping__scorecard-foot">
                  <Typography component="p">{active.subtitle}</Typography>
                  {active.year && <span className="cafert-cupping__year">{active.year}</span>}
                </Box>
                <span className="cafert-cupping__paper-tear" aria-hidden="true" />
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AwardsStrip;
