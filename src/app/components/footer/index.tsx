// @ts-nocheck
import React from 'react';
import { Box, Button, Chip, Container, IconButton, Stack, Typography } from '@mui/material';
import {
  AccessTime as TimeIcon,
  ArrowUpward as ArrowUpIcon,
  Coffee as CoffeeIcon,
  Email as EmailIcon,
  Facebook as FacebookIcon,
  Favorite as HeartIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useGlobals } from '../../hooks/useGlobals';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { authMember } = useGlobals();
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const openNewsletter = () => document.getElementById('cafert-newsletter')?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const footerSections = [
    {
      title: t('footer.quickLinks'),
      links: [
        { label: t('navigation.home'), path: '/' },
        { label: t('navigation.products'), path: '/products' },
        { label: t('navigation.drinks'), path: '/coffees' },
        { label: t('navigation.about'), path: '/help' },
        ...(authMember ? [{ label: t('navigation.orders'), path: '/orders' }] : []),
      ]
    },
    {
      title: t('footer.services'),
      links: [
        { label: t('footer.dineIn'), path: '/services/dine-in' },
        { label: t('footer.takeaway'), path: '/services/takeaway' },
        { label: t('footer.delivery'), path: '/services/delivery' },
        { label: t('footer.catering'), path: '/services/catering' },
        { label: t('footer.events'), path: '/services/events' },
      ]
    },
    {
      title: t('footer.aboutUs'),
      links: [
        { label: t('footer.ourStory'), path: '/about/story' },
        { label: t('footer.team'), path: '/about/team' },
        { label: t('footer.careers'), path: '/about/careers' },
        { label: t('footer.press'), path: '/about/press' },
        { label: t('footer.blog'), path: '/blog' },
      ]
    }
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, url: 'https://facebook.com', label: 'Facebook' },
    { icon: <TwitterIcon />, url: 'https://twitter.com', label: 'Twitter' },
    { icon: <InstagramIcon />, url: 'https://instagram.com', label: 'Instagram' },
    { icon: <YouTubeIcon />, url: 'https://youtube.com', label: 'YouTube' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  const contactInfo = [
    { icon: <LocationIcon />, label: 'Location', value: 'Downtown, New York', href: 'https://maps.google.com', external: true },
    { icon: <PhoneIcon />, label: 'Phone', value: '+971 4 554 7777', href: 'tel:+97145547777' },
    { icon: <EmailIcon />, label: 'Email', value: 'info@coffeeshop.com', href: 'mailto:info@coffeeshop.com' },
    { icon: <TimeIcon />, label: 'Hours', value: '24/7 Service' },
  ];

  return (
    <Box component="footer" className="cafert-ledger-footer">
      <Container maxWidth="xl" className="cafert-ledger-footer__container">
        <Box className="cafert-ledger-footer__masthead">
          <span>{t('footer.daybookLabel')}</span>
          <Typography component="p">{t('footer.daybookClosing')}</Typography>
          <span className="cafert-ledger-footer__edition">CAFERT · {currentYear}</span>
        </Box>

        <Box className="cafert-ledger-footer__spread">
          <Box className="cafert-ledger-footer__page cafert-ledger-footer__page--left">
            <Box className="cafert-ledger-footer__brand">
              <Box className="cafert-ledger-footer__brandline">
                <CoffeeIcon aria-hidden="true" />
                <Typography component="p">Cafert</Typography>
              </Box>
              <span className="cafert-ledger-footer__brand-note">{t('footer.brandNote')}</span>
            </Box>

            <Typography component="p" className="cafert-ledger-footer__about">{t('footer.aboutText')}</Typography>

            <Box className="cafert-ledger-footer__social-block">
              <span className="cafert-ledger-footer__caption">{t('footer.social')}</span>
              <Stack direction="row" spacing={1}>
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.label}
                    aria-label={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cafert-ledger-footer__social"
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Box>

            <Box component="nav" aria-label={t('footer.quickLinks')} className="cafert-ledger-footer__index">
              {footerSections.map((section, index) => (
                <Box key={section.title} className="cafert-ledger-footer__index-column">
                  <span className="cafert-ledger-footer__index-number">0{index + 1}</span>
                  <Typography component="h3">{section.title}</Typography>
                  <Stack component="ul" spacing={0.6}>
                    {section.links.map((link) => (
                      <li key={link.path}>
                        <Link to={link.path}>{link.label}</Link>
                      </li>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>
          </Box>

          <Box className="cafert-ledger-footer__page cafert-ledger-footer__page--right">
            <Box className="cafert-ledger-footer__page-heading">
              <Box>
                <span className="cafert-ledger-footer__caption">{t('footer.lastEntry')}</span>
                <Typography component="h2">{t('footer.contactInfo')}</Typography>
              </Box>
              <Box className="cafert-ledger-footer__return-stamp" aria-hidden="true">
                <span>{t('footer.visitAgain')}</span>
              </Box>
            </Box>

            <Stack className="cafert-ledger-footer__contact-list" spacing={1.1}>
              {contactInfo.map((contact) => (
                <Box
                  key={contact.label}
                  component={contact.href ? 'a' : 'div'}
                  href={contact.href}
                  target={contact.external ? '_blank' : undefined}
                  rel={contact.external ? 'noopener noreferrer' : undefined}
                  className={`cafert-ledger-footer__contact${contact.href ? ' is-link' : ''}`}
                >
                  <span className="cafert-ledger-footer__contact-icon" aria-hidden="true">{contact.icon}</span>
                  <span>
                    <strong>{contact.label}</strong>
                    <i>{contact.value}</i>
                  </span>
                </Box>
              ))}
            </Stack>

            <Box className="cafert-ledger-footer__hours">
              <Typography component="h3">{t('footer.openingHours')}</Typography>
              <Box><span>{t('footer.weekdays')}</span><strong>7:00 AM – 10:00 PM</strong></Box>
              <Box><span>{t('footer.weekends')}</span><strong>8:00 AM – 11:00 PM</strong></Box>
              <Chip label={t('footer.onlineOrdering')} className="cafert-ledger-footer__online-chip" />
            </Box>

            <Box className="cafert-ledger-footer__newsletter-slip">
              <span>{t('footer.stayUpdated')}</span>
              <Button onClick={openNewsletter} className="cafert-ledger-footer__subscribe">
                {t('footer.subscribe')} <span aria-hidden="true">↗</span>
              </Button>
            </Box>

            <img className="cafert-ledger-footer__cutout" src="/img/coffee/ledger-bean-bookmark-cutout.webp" alt="" aria-hidden="true" />
            <span className="cafert-ledger-footer__page-number" aria-hidden="true">28</span>
          </Box>
          <span className="cafert-ledger-footer__binding" aria-hidden="true" />
        </Box>

        <Box className="cafert-ledger-footer__bottom">
          <Typography component="p">© {currentYear} Cafert. {t('footer.rights')} <HeartIcon aria-hidden="true" /></Typography>
          <Box className="cafert-ledger-footer__legal">
            <Link to="/privacy">{t('footer.privacy')}</Link>
            <Link to="/terms">{t('footer.terms')}</Link>
          </Box>
          <Button onClick={scrollToTop} className="cafert-ledger-footer__bookmark" aria-label={t('footer.backToTop')}>
            <span>{t('footer.backToTop')}</span><ArrowUpIcon aria-hidden="true" />
          </Button>
        </Box>
      </Container>

      <style>{`
        .cafert-ledger-footer{position:relative;z-index:1;overflow:hidden;margin:0;padding:54px 0 22px;background:#e8dece;color:#4f4435}
        .cafert-ledger-footer:before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 13% 12%,#fff9 0%,transparent 38%),repeating-linear-gradient(4deg,#8f704410 0 1px,transparent 1px 8px);pointer-events:none}
        .cafert-ledger-footer__container{position:relative;z-index:1}
        .cafert-ledger-footer__masthead{display:flex;align-items:center;justify-content:space-between;gap:18px;max-width:1240px;margin:0 auto 13px;padding:0 8px;color:#836b4c}
        .cafert-ledger-footer__masthead>span{font:600 9px/1 monospace;letter-spacing:.18em;text-transform:uppercase}
        .cafert-ledger-footer__masthead p{margin:0;color:#655844;font:italic 18px/1.2 'EB Garamond',Georgia,serif}
        .cafert-ledger-footer__spread{position:relative;isolation:isolate;display:grid;grid-template-columns:minmax(0,1.35fr) minmax(330px,.9fr);max-width:1240px;min-height:510px;margin:0 auto;background:#f4ead8;box-shadow:0 20px 34px #42331f24,0 3px 6px #42331f16;filter:drop-shadow(0 1px 0 #fff9)}
        .cafert-ledger-footer__spread:before{content:'';position:absolute;z-index:0;inset:8px;background:repeating-linear-gradient(0deg,transparent 0 34px,#967b5d1b 35px,#967b5d1b 36px);pointer-events:none}
        .cafert-ledger-footer__page{position:relative;z-index:1;min-width:0;padding:35px clamp(23px,3vw,44px) 44px;background:#f7efdf}
        .cafert-ledger-footer__page--left{clip-path:polygon(0 0,99.6% .5%,100% 99%,.5% 100%);box-shadow:inset -14px 0 19px -20px #513e2750}
        .cafert-ledger-footer__page--right{padding-left:clamp(32px,4vw,58px);background:#fffaf0;clip-path:polygon(.4% .5%,100% 0,99.5% 100%,0 99%);box-shadow:inset 15px 0 22px -23px #513e2750}
        .cafert-ledger-footer__binding{position:absolute;z-index:4;top:12px;bottom:12px;left:59.5%;width:20px;background:linear-gradient(90deg,#a98d6840,#fff3 45%,#a98d682e);pointer-events:none}
        .cafert-ledger-footer__brand{display:flex;align-items:center;justify-content:space-between;gap:14px;padding-bottom:15px;border-bottom:1px solid #b9a17d}
        .cafert-ledger-footer__brandline{display:flex;align-items:center;gap:12px}
        .cafert-ledger-footer__brandline svg{width:36px;height:36px;color:#986e45}
        .cafert-ledger-footer__brandline p{margin:0;color:#51422e;font:500 36px/.95 'Playfair Display',Georgia,serif;letter-spacing:-.035em}
        .cafert-ledger-footer__brand-note{color:#907756;font:9px/1.3 monospace;letter-spacing:.12em;text-align:right;text-transform:uppercase}
        .cafert-ledger-footer__about{max-width:48ch;margin:17px 0 13px;color:#695b46;font:italic 16px/1.4 'EB Garamond',Georgia,serif}
        .cafert-ledger-footer__social-block{display:flex;align-items:center;gap:14px;margin:0 0 21px}
        .cafert-ledger-footer__caption{display:block;color:#987b57;font:9px/1.25 monospace;letter-spacing:.14em;text-transform:uppercase}
        .cafert-ledger-footer__social{width:32px!important;height:32px!important;border:1px solid #a78a655e!important;border-radius:50%!important;color:#765b3c!important;transition:background .18s ease,color .18s ease,transform .18s ease!important}
        .cafert-ledger-footer__social svg{font-size:16px!important}
        .cafert-ledger-footer__social:hover{background:#a65b46!important;color:#fff8e9!important;transform:translateY(-2px)}
        .cafert-ledger-footer__index{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;padding-top:13px;border-top:1px solid #b9a17d}
        .cafert-ledger-footer__index-number{display:block;margin-bottom:7px;color:#a65b46;font:9px/1 monospace;letter-spacing:.12em}
        .cafert-ledger-footer__index-column h3{margin:0 0 9px;color:#51422e;font:600 16px/1.15 'Playfair Display',Georgia,serif}
        .cafert-ledger-footer__index-column ul{margin:0;padding:0;list-style:none}
        .cafert-ledger-footer__index-column li{margin:0}
        .cafert-ledger-footer__index-column a,.cafert-ledger-footer__legal a{color:#716047;font:13px/1.55 'EB Garamond',Georgia,serif;text-decoration:none;text-underline-offset:3px}
        .cafert-ledger-footer__index-column a:hover,.cafert-ledger-footer__legal a:hover{color:#a04f41;text-decoration:underline}
        .cafert-ledger-footer__page-heading{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:19px;padding-bottom:12px;border-bottom:1px solid #b9a17d}
        .cafert-ledger-footer__page-heading h2{margin:5px 0 0;color:#51422e;font:500 25px/1.1 'Playfair Display',Georgia,serif}
        .cafert-ledger-footer__return-stamp{position:relative;display:grid;place-items:center;width:72px;height:72px;border:2px solid #a65b46;border-radius:50%;color:#a65b46;text-align:center;transform:rotate(9deg)}
        .cafert-ledger-footer__return-stamp:before{content:'';position:absolute;inset:4px;border:1px dashed currentColor;border-radius:50%}
        .cafert-ledger-footer__return-stamp span{max-width:48px;font:700 8px/1.1 monospace;letter-spacing:.08em;text-transform:uppercase}
        .cafert-ledger-footer__contact-list{position:relative;z-index:2}
        .cafert-ledger-footer__contact{display:flex;align-items:center;gap:12px;min-width:0;color:inherit;text-decoration:none}
        .cafert-ledger-footer__contact-icon{display:grid;place-items:center;flex:none;width:29px;height:29px;border:1px solid #aa8d665d;border-radius:50%;color:#966e47}
        .cafert-ledger-footer__contact-icon svg{font-size:15px}
        .cafert-ledger-footer__contact strong,.cafert-ledger-footer__contact i{display:block}
        .cafert-ledger-footer__contact strong{margin-bottom:2px;color:#987b57;font:8px/1 monospace;letter-spacing:.12em;text-transform:uppercase}
        .cafert-ledger-footer__contact i{color:#574a37;font:14px/1.25 'EB Garamond',Georgia,serif;font-style:normal}
        .cafert-ledger-footer__contact.is-link:hover i{color:#a04f41;text-decoration:underline;text-underline-offset:3px}
        .cafert-ledger-footer__hours{position:relative;z-index:2;margin-top:17px;padding-top:12px;border-top:1px dashed #b9a17d}
        .cafert-ledger-footer__hours h3{margin:0 0 8px;color:#51422e;font:600 15px/1.1 'Playfair Display',Georgia,serif}
        .cafert-ledger-footer__hours>div{display:flex;justify-content:space-between;gap:10px;padding:5px 0;border-bottom:1px solid #b9a17d55;color:#716047;font:12px/1.25 'EB Garamond',Georgia,serif}
        .cafert-ledger-footer__hours strong{color:#534532;font-weight:600;text-align:right}
        .cafert-ledger-footer__online-chip{height:25px!important;margin-top:8px;border:1px solid #9d7f5a!important;border-radius:2px!important;background:#ede1cc!important;color:#806443!important;font:9px/1 monospace!important;letter-spacing:.05em;text-transform:uppercase}
        .cafert-ledger-footer__newsletter-slip{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:13px;padding:8px 11px;border:1px solid #c2aa83;background:#f3e5ce;box-shadow:0 2px 4px #493b2d13}
        .cafert-ledger-footer__newsletter-slip>span{color:#6e583c;font:italic 14px/1.2 'EB Garamond',Georgia,serif}
        .cafert-ledger-footer__subscribe{min-width:0!important;padding:7px 9px!important;border:1px dashed #a65b46!important;border-radius:0!important;color:#9a5143!important;font:700 8px/1 monospace!important;letter-spacing:.08em;text-transform:uppercase!important}
        .cafert-ledger-footer__subscribe span{margin-left:5px;font:normal 12px/1 sans-serif}
        .cafert-ledger-footer__subscribe:hover{background:#a65b46!important;color:#fff8e9!important}
        .cafert-ledger-footer__cutout{position:absolute;z-index:3;right:-26px;bottom:-48px;width:130px;height:auto;filter:drop-shadow(0 8px 6px #40301c2c);pointer-events:none}
        .cafert-ledger-footer__page-number{position:absolute;bottom:15px;right:22px;color:#a58d6d;font:9px/1 monospace;letter-spacing:.16em}
        .cafert-ledger-footer__bottom{display:flex;align-items:center;justify-content:space-between;gap:16px;max-width:1240px;margin:25px auto 0;padding:13px 8px 0;border-top:1px solid #a88e6c}
        .cafert-ledger-footer__bottom>p{margin:0;color:#6b5a43;font:12px/1.35 'EB Garamond',Georgia,serif}
        .cafert-ledger-footer__bottom>p svg{width:13px;height:13px;vertical-align:middle;color:#a65b46}
        .cafert-ledger-footer__legal{display:flex;gap:17px}
        .cafert-ledger-footer__legal a{font-size:12px}
        .cafert-ledger-footer__bookmark{display:flex!important;align-items:center;gap:6px;min-width:0!important;padding:8px 11px!important;border:1px solid #a88e6c!important;border-radius:0 0 4px 4px!important;background:#a65b46!important;color:#fff8e9!important;font:700 8px/1 monospace!important;letter-spacing:.08em;text-transform:uppercase!important;box-shadow:0 3px 0 #814638!important;transform:translateY(-3px)}
        .cafert-ledger-footer__bookmark svg{font-size:13px}
        .cafert-ledger-footer__bookmark:hover{background:#874536!important;transform:translateY(0)}
        .cafert-ledger-footer__bookmark:focus-visible,.cafert-ledger-footer__subscribe:focus-visible,.cafert-ledger-footer__social:focus-visible{outline:3px solid #a65b46;outline-offset:3px}
        @media(max-width:900px){.cafert-ledger-footer__spread{grid-template-columns:1fr}.cafert-ledger-footer__page--left{clip-path:polygon(0 0,100% .5%,99.7% 100%,.3% 99.5%);box-shadow:inset 0 -13px 18px -20px #513e2750}.cafert-ledger-footer__page--right{padding-left:clamp(25px,5vw,48px);clip-path:polygon(.3% .5%,99.7% 0,100% 99.5%,0 100%);box-shadow:inset 0 13px 20px -23px #513e2750}.cafert-ledger-footer__binding{left:12px;right:12px;top:57%;bottom:auto;width:auto;height:18px;background:linear-gradient(180deg,#a98d682e,#fff6 45%,#a98d6828)}}
        @media(max-width:560px){.cafert-ledger-footer{padding-top:34px}.cafert-ledger-footer__masthead{align-items:flex-start;flex-wrap:wrap;margin-bottom:9px}.cafert-ledger-footer__masthead p{order:3;width:100%;font-size:16px}.cafert-ledger-footer__edition{margin-left:auto}.cafert-ledger-footer__spread{min-height:0}.cafert-ledger-footer__page{padding:25px 20px 35px}.cafert-ledger-footer__brandline p{font-size:31px}.cafert-ledger-footer__brand-note{max-width:110px;font-size:7px}.cafert-ledger-footer__about{font-size:15px}.cafert-ledger-footer__index{grid-template-columns:1fr 1fr;gap:18px 14px}.cafert-ledger-footer__index-column h3{font-size:15px}.cafert-ledger-footer__index-column a{font-size:13px}.cafert-ledger-footer__page-heading h2{font-size:23px}.cafert-ledger-footer__contact i{font-size:13px}.cafert-ledger-footer__hours>div{font-size:11px}.cafert-ledger-footer__cutout{right:-24px;bottom:-42px;width:110px}.cafert-ledger-footer__page-number{right:14px}.cafert-ledger-footer__bottom{flex-wrap:wrap;justify-content:center;text-align:center}.cafert-ledger-footer__bottom>p{width:100%}.cafert-ledger-footer__legal{order:2}.cafert-ledger-footer__bookmark{order:1;margin-bottom:3px!important}}
        @media(prefers-reduced-motion:reduce){.cafert-ledger-footer__social,.cafert-ledger-footer__bookmark{transition:none!important}}
      `}</style>
    </Box>
  );
}
