import React, { useMemo, useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface NewsletterSubscriptionProps {
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textSecondary: string;
    border: string;
    surface: string;
  };
}

const DEFAULT_COLORS = {
  primary: '#2C1810',
  secondary: '#8B4513',
  accent: '#D2691E',
  background: '#FDF6F0',
  text: '#2C1810',
  textSecondary: '#6B4423',
  border: '#E8D5C4',
  surface: '#F8F4F0'
};

const NewsletterSubscriptionComponent: React.FC<NewsletterSubscriptionProps> = ({ colors }) => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const componentColors = useMemo(() => ({
    ...DEFAULT_COLORS,
    ...(colors || {})
  }), [colors]);

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      setError(t('newsletter.required'));
      return;
    }
    if (!validateEmail(email)) {
      setError(t('newsletter.invalidEmail'));
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      // Keep the existing local preview response until a newsletter endpoint is connected.
      await new Promise((resolve) => window.setTimeout(resolve, 700));
      setIsSubscribed(true);
      setEmail('');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    t('newsletter.benefits.tips'),
    t('newsletter.benefits.offers'),
    t('newsletter.benefits.events')
  ];

  return (
    <Box
      component="section"
      id="cafert-newsletter"
      aria-labelledby="cafert-newsletter-title"
      className="cafert-postcard-newsletter"
      sx={{
        '--postcard-ink': componentColors.text,
        '--postcard-muted': componentColors.textSecondary,
        '--postcard-red': '#a44f42',
        '--postcard-stock': '#fff9ed',
        '--postcard-edge': componentColors.border,
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 7, md: 10 },
        backgroundColor: componentColors.background,
        color: componentColors.text
      } as React.CSSProperties}
    >
      <Box className="cafert-postcard-newsletter__grain" aria-hidden="true" />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box className="cafert-postcard-newsletter__heading">
          <Typography component="p" className="cafert-postcard-newsletter__eyebrow">{t('newsletter.eyebrow')}</Typography>
          <Typography component="h2" id="cafert-newsletter-title" className="cafert-postcard-newsletter__title">{t('newsletter.title')}</Typography>
          <Typography component="p" className="cafert-postcard-newsletter__intro">{t('newsletter.intro')}</Typography>
        </Box>

        <Box className="cafert-postcard" role="group" aria-label={t('newsletter.cardLabel')}>
          <Box className="cafert-postcard__message">
            <span className="cafert-postcard__message-kicker">{t('newsletter.messageKicker')}</span>
            <Typography component="h3" className="cafert-postcard__message-title">{t('newsletter.messageTitle')}</Typography>
            <Typography component="p" className="cafert-postcard__message-copy">{t('newsletter.messageCopy')}</Typography>
            <span className="cafert-postcard__handnote">{t('newsletter.handnote')}</span>
            <img className="cafert-postcard__coffee-cutout" src="/img/coffee/newsletter-postcard-cutout.webp" alt="" aria-hidden="true" />
            <span className="cafert-postcard__sender">{t('newsletter.sender')}</span>
          </Box>

          <Box className="cafert-postcard__address">
            <Box className="cafert-postcard__stamp" aria-hidden="true">
              <span>CAFERT</span>
              <strong>01</strong>
              <i>POST</i>
            </Box>
            <span className="cafert-postcard__to">{t('newsletter.addressTo')}</span>

            <AnimatePresence mode="wait" initial={false}>
              {isSubscribed ? (
                <motion.div
                  key="postcard-thanks"
                  className="cafert-postcard__success"
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.92, rotate: 1 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.2, 0.75, 0.25, 1] }}
                  role="status"
                  aria-live="polite"
                >
                  <span className="cafert-postcard__success-mark">{t('newsletter.stamped')}</span>
                  <Typography component="h3">{t('newsletter.thanksTitle')}</Typography>
                  <Typography component="p">{t('newsletter.thanksCopy')}</Typography>
                  <Button onClick={() => setIsSubscribed(false)} className="cafert-postcard__again">{t('newsletter.writeAnother')}</Button>
                </motion.div>
              ) : (
                <motion.div
                  key="postcard-form"
                  className="cafert-postcard__form-wrap"
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25 }}
                >
                  <Typography component="p" className="cafert-postcard__address-hint">{t('newsletter.addressHint')}</Typography>
                  <Box component="form" onSubmit={handleSubscribe} noValidate>
                    <TextField
                      id="cafert-newsletter-email"
                      className="cafert-postcard__email"
                      type="email"
                      label={t('newsletter.emailLabel')}
                      placeholder={t('newsletter.emailPlaceholder')}
                      value={email}
                      onChange={(event) => { setEmail(event.target.value); setError(''); }}
                      disabled={isLoading}
                      error={Boolean(error)}
                      helperText={error || t('newsletter.emailHelper')}
                      autoComplete="email"
                      fullWidth
                      required
                      inputProps={{ 'aria-describedby': 'cafert-newsletter-email-help' }}
                      FormHelperTextProps={{ id: 'cafert-newsletter-email-help' }}
                    />
                    <Button
                      type="submit"
                      className="cafert-postcard__send"
                      disabled={isLoading}
                      aria-label={isLoading ? t('newsletter.stamping') : t('newsletter.submit')}
                    >
                      <span>{isLoading ? t('newsletter.stamping') : t('newsletter.submit')}</span>
                      <i aria-hidden="true">{isLoading ? '…' : '↗'}</i>
                    </Button>
                  </Box>
                  <Typography component="p" className="cafert-postcard__privacy">{t('newsletter.privacy')}</Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>

        <Box className="cafert-postcard-newsletter__benefits" aria-label={t('newsletter.benefitsLabel')}>
          {benefits.map((benefit, index) => (
            <span key={benefit}><i aria-hidden="true">{['✳', '✦', '✳'][index]}</i>{benefit}</span>
          ))}
        </Box>
      </Container>

      <style>{`
        .cafert-postcard-newsletter__grain{position:absolute;inset:0;pointer-events:none;opacity:.26;background-image:radial-gradient(#9f7b5521 .8px,transparent .8px);background-size:13px 13px}
        .cafert-postcard-newsletter__heading{position:relative;max-width:1020px;margin:0 auto 28px;padding-left:12px}
        .cafert-postcard-newsletter__eyebrow{margin:0 0 7px;color:${componentColors.secondary};font:600 10px/1.3 monospace;letter-spacing:.19em;text-transform:uppercase}
        .cafert-postcard-newsletter__title{margin:0;color:${componentColors.text};font:500 clamp(39px,5vw,62px)/.98 'Playfair Display',Georgia,serif;letter-spacing:-.035em}
        .cafert-postcard-newsletter__intro{max-width:58ch;margin:12px 0 0;color:${componentColors.textSecondary};font:italic 19px/1.4 'EB Garamond',Georgia,serif}
        .cafert-postcard{position:relative;display:grid;grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr);max-width:1040px;min-height:405px;margin:0 auto;background:var(--postcard-stock);border:1px solid #d4bea0;box-shadow:0 18px 32px #47341e1c,0 3px 5px #47341e14;transform:rotate(-.35deg)}
        .cafert-postcard:before{content:'';position:absolute;z-index:3;inset:8px;border:1px solid #b69b7340;pointer-events:none}
        .cafert-postcard:after{content:'';position:absolute;z-index:3;inset:0;pointer-events:none;background:repeating-linear-gradient(7deg,#6d4c2907 0 1px,transparent 1px 5px);mix-blend-mode:multiply}
        .cafert-postcard__message{position:relative;isolation:isolate;min-width:0;overflow:hidden;padding:32px 35px 26px;background-color:#f1e5d1;background-image:repeating-linear-gradient(0deg,transparent 0 32px,#a7835321 33px,#a7835321 34px);border-right:1px dashed #a88d6d}
        .cafert-postcard__message-kicker,.cafert-postcard__to{position:relative;z-index:2;display:block;color:#916e4c;font:9px/1.3 monospace;letter-spacing:.15em;text-transform:uppercase}
        .cafert-postcard__message-title{position:relative;z-index:2;max-width:8ch;margin:16px 0 10px;color:#503f2d;font:500 clamp(33px,4vw,47px)/.98 'Playfair Display',Georgia,serif;letter-spacing:-.04em}
        .cafert-postcard__message-copy{position:relative;z-index:2;max-width:28ch;margin:0;color:#62523e;font:italic 17px/1.36 'EB Garamond',Georgia,serif}
        .cafert-postcard__handnote{position:absolute;z-index:2;left:35px;bottom:51px;color:#a05243;font:italic 14px/1.2 'EB Garamond',Georgia,serif;transform:rotate(-4deg)}
        .cafert-postcard__coffee-cutout{position:absolute;z-index:1;right:-38px;bottom:-56px;width:min(82%,410px);height:auto;filter:drop-shadow(0 12px 9px #45331e2a);pointer-events:none}
        .cafert-postcard__sender{position:absolute;z-index:2;left:35px;bottom:21px;color:#8b765c;font:8px/1 monospace;letter-spacing:.13em;text-transform:uppercase}
        .cafert-postcard__address{position:relative;z-index:4;min-width:0;padding:36px clamp(24px,4vw,52px) 26px 37px;background-color:#fffaf0;background-image:repeating-linear-gradient(0deg,transparent 0 45px,#a783531c 46px,#a783531c 47px);}
        .cafert-postcard__stamp{position:absolute;right:28px;top:25px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;width:72px;height:78px;border:2px dashed #a75b4d;color:#a75b4d;background:#f7ecdc;transform:rotate(4deg)}
        .cafert-postcard__stamp:before{content:'';position:absolute;inset:4px;border:1px solid #a75b4d55}
        .cafert-postcard__stamp span,.cafert-postcard__stamp i{font:7px/1 monospace;letter-spacing:.08em}.cafert-postcard__stamp strong{font:700 22px/1 'Playfair Display',Georgia,serif}.cafert-postcard__stamp i{font-style:normal}
        .cafert-postcard__to{max-width:calc(100% - 90px);padding-bottom:13px;border-bottom:1px solid #b69b7355}
        .cafert-postcard__address-hint{margin:20px 0 16px;color:#77634b;font:italic 16px/1.25 'EB Garamond',Georgia,serif}
        .cafert-postcard__email .MuiInputLabel-root{color:#806c52;font:13px/1.2 'EB Garamond',Georgia,serif}
        .cafert-postcard__email .MuiOutlinedInput-root{border-radius:0;background:#fffdf8;color:#463824;font:17px/1.3 'EB Garamond',Georgia,serif}
        .cafert-postcard__email .MuiOutlinedInput-notchedOutline{border:1px solid #bea681}
        .cafert-postcard__email .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline{border-color:#9f7850}
        .cafert-postcard__email .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline{border-width:1px;border-color:#a45a48}
        .cafert-postcard__email .MuiFormHelperText-root{margin-left:0;color:#786850;font:11px/1.3 monospace}
        .cafert-postcard__email .MuiFormHelperText-root.Mui-error{color:#a14439}
        .cafert-postcard__send{position:relative;display:flex!important;align-items:center;justify-content:space-between!important;gap:20px;width:100%;min-height:58px!important;margin-top:15px!important;padding:11px 17px!important;border:1px dashed #fff1!important;border-radius:0!important;background:#a85646!important;color:#fff7e9!important;box-shadow:0 3px 0 #783e35,0 7px 12px #54351f20!important;font:600 12px/1 monospace!important;letter-spacing:.12em;text-transform:uppercase!important;transform:rotate(-.7deg);transition:transform .18s ease,box-shadow .18s ease!important}
        .cafert-postcard__send:before{content:'';position:absolute;inset:4px;border:1px dashed #f1c9a88a;pointer-events:none}
        .cafert-postcard__send i{font:normal 19px/1 sans-serif}
        .cafert-postcard__send:hover{background:#94483b!important;box-shadow:0 1px 0 #783e35,0 3px 7px #54351f20!important;transform:translateY(2px) rotate(0)}
        .cafert-postcard__send:focus-visible{outline:3px solid #704735;outline-offset:4px}
        .cafert-postcard__send.Mui-disabled{background:#a78a6c!important;color:#fff8ed!important;opacity:.72}
        .cafert-postcard__privacy{max-width:36ch;margin:14px 0 0;color:#86755d;font:11px/1.45 monospace}
        .cafert-postcard__success{position:relative;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;min-height:260px;padding:29px 0 0}
        .cafert-postcard__success-mark{position:absolute;right:4px;top:18px;padding:9px 13px;border:2px solid #a85646;color:#a85646;font:700 10px/1 monospace;letter-spacing:.13em;text-transform:uppercase;transform:rotate(-9deg)}
        .cafert-postcard__success h3{max-width:9ch;margin:10px 0 12px;color:#503f2d;font:500 34px/1 'Playfair Display',Georgia,serif}
        .cafert-postcard__success p{max-width:34ch;margin:0;color:#695941;font:italic 18px/1.4 'EB Garamond',Georgia,serif}
        .cafert-postcard__again{margin:19px 0 0!important;padding:8px 0!important;color:#945344!important;font:600 10px/1 monospace!important;letter-spacing:.08em;text-decoration:underline;text-underline-offset:4px;text-transform:uppercase!important}
        .cafert-postcard-newsletter__benefits{display:flex;justify-content:center;gap:clamp(18px,4vw,54px);flex-wrap:wrap;max-width:980px;margin:24px auto 0;color:#66563f}
        .cafert-postcard-newsletter__benefits span{display:flex;align-items:center;gap:8px;font:14px/1.3 'EB Garamond',Georgia,serif}
        .cafert-postcard-newsletter__benefits i{color:#a85646;font:normal 12px/1 monospace}
        @media(max-width:700px){.cafert-postcard-newsletter__heading{padding-left:2px;margin-bottom:22px}.cafert-postcard{grid-template-columns:1fr;transform:none}.cafert-postcard__message{min-height:325px;border-right:0;border-bottom:1px dashed #a88d6d;padding:26px 24px 21px}.cafert-postcard__message-title{max-width:10ch;font-size:39px}.cafert-postcard__message-copy{max-width:31ch;font-size:16px}.cafert-postcard__coffee-cutout{right:-12px;bottom:-60px;width:min(75%,360px)}.cafert-postcard__handnote{left:24px;bottom:42px}.cafert-postcard__sender{left:24px;bottom:18px}.cafert-postcard__address{padding:27px 24px 24px}.cafert-postcard__stamp{right:24px;top:17px}.cafert-postcard__to{padding-bottom:12px}.cafert-postcard__address-hint{margin-top:17px}.cafert-postcard__success{min-height:220px;padding-top:28px}}
        @media(max-width:420px){.cafert-postcard-newsletter__title{font-size:38px}.cafert-postcard__message{min-height:300px;padding:23px 20px 18px}.cafert-postcard__coffee-cutout{right:-25px;width:79%}.cafert-postcard__message-title{font-size:35px}.cafert-postcard__address{padding:23px 19px}.cafert-postcard__stamp{right:19px;width:62px;height:68px}.cafert-postcard__stamp strong{font-size:19px}.cafert-postcard__to{max-width:calc(100% - 78px);font-size:8px}.cafert-postcard__benefits span{font-size:12px}}
        @media(prefers-reduced-motion:reduce){.cafert-postcard__send{transition:none!important}}
      `}</style>
    </Box>
  );
};

NewsletterSubscriptionComponent.displayName = 'NewsletterSubscription';

export default NewsletterSubscriptionComponent;
