import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useTheme } from '../../mui-coffee/context/ThemeContext';
import { Product } from '../../lib/types/product';
import { serverApi } from '../../lib/config';
import './HeroSection.css';

interface HeroSectionProps {
  onReservationClick?: () => void;
}

type Preference = 'bold' | 'creamy' | 'cold';
const preferences: Preference[] = ['bold', 'creamy', 'cold'];
const drinkPatterns: Record<Preference, RegExp> = {
  bold: /espresso|americano|에스프레소|아메리카노/i,
  creamy: /latte|cappuccino|flat white|mocha|라떼|카푸치노|모카/i,
  cold: /iced|ice\b|cold brew|frapp|아이스|콜드|프라페/i,
};
const HeroSection: React.FC<HeroSectionProps> = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [selection, setSelection] = useState<Preference | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [motionPaused, setMotionPaused] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    axios.get<Product[]>(`${serverApi}product/all`, {
      params: { order: 'productViews', page: 1, limit: 60 },
      signal: controller.signal,
      timeout: 12000,
    }).then(({ data }) => {
      if (Array.isArray(data)) setProducts(data);
    }).catch(() => {
      // The invitation and full menu remain usable when the catalog is offline.
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, []);

  const product = useMemo(() => {
    if (!selection) return undefined;
    return products.find(item => {
      if (!item || typeof item.productName !== 'string') return false;
      if (item.productCollection && !['COFFEE', 'DRINK'].includes(item.productCollection)) return false;
      if (item.productStatus && item.productStatus !== 'PROCESS') return false;
      if (Number(item.productLeftCount) <= 0 || !Number.isFinite(item.productPrice)) return false;
      const name = item.productName;
      // A cold latte belongs to the cold preference rather than the hot choices.
      return drinkPatterns[selection].test(name) &&
        (selection === 'cold' || !drinkPatterns.cold.test(name));
    });
  }, [products, selection]);

  const open = selection !== null;
  const heading = product?.productName || t(`servingWindow.${selection || 'creamy'}Title`);

  return (
    <section
      className={`serving-hero${isDarkMode ? ' serving-hero--dark' : ''}`}
      aria-labelledby="serving-hero-heading"
      data-motion-paused={motionPaused}
    >
      <div className="serving-hero__layout">
        <div className="serving-hero__intro">
          <p className="serving-hero__welcome"><span aria-hidden="true">✳</span> {t('servingWindow.welcome')}</p>
          <h1 id="serving-hero-heading">{t('servingWindow.headlineOne')}<br /><em>{t('servingWindow.headlineTwo')}</em></h1>
          <p className="serving-hero__description">{t('servingWindow.description')}</p>
          <Link className="serving-hero__menu-link" to="/orders?tab=menu">
            {t('servingWindow.fullMenu')} <span aria-hidden="true">↗</span>
          </Link>
          <div className="serving-hero__invitation">
            <svg viewBox="0 0 75 45" fill="none" aria-hidden="true"><path d="M2 5C20 37 49 39 69 17M55 17l16-4-1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span>{t('servingWindow.invitation')}</span>
          </div>
        </div>

        <div className="serving-window" data-open={open}>
          <div className="serving-window__awning" aria-hidden="true"><span>Cafert</span></div>
          <div className="serving-window__frame">
            <div className="serving-window__opening">
              <div className="serving-window__interior" aria-hidden="true">
                <video className="serving-window__video" autoPlay muted loop playsInline aria-label={t('servingWindow.videoAlt')}>
                  <source src="/videos/mixkit-coffee-maker-making-coffee-3578-full-hd.mp4" type="video/mp4" />
                </video>
              </div>
              <div
                id="serving-window-result"
                className="serving-window__reveal"
                aria-live="polite"
                aria-atomic="true"
                aria-busy={open && loading}
                hidden={!open}
              >
                {open && (
                  <>
                    <div className="serving-window__drink-photo" aria-hidden="true">
                      <video className="serving-window__video" autoPlay muted loop playsInline>
                        <source src="/videos/mixkit-coffee-maker-making-coffee-3578-full-hd.mp4" type="video/mp4" />
                      </video>
                    </div>
                    <div className="serving-window__ticket">
                      <p className="serving-window__ticket-label">{t(product ? 'servingWindow.forYou' : 'servingWindow.startHere')}</p>
                      <div className="serving-window__drink-heading">
                        <h2>{heading}</h2>
                        {product && <span className="serving-window__price">${product.productPrice.toFixed(2)}</span>}
                      </div>
                      <p className="serving-window__drink-description">
                        {product ? (product.productDesc || t('servingWindow.productDescription')) :
                          t(loading ? 'servingWindow.loading' : 'servingWindow.catalogFallback')}
                      </p>
                      <Link className="serving-window__order-link" to={product ? `/products/${encodeURIComponent(product._id)}` : '/orders?tab=menu'}>
                        {t(product ? 'servingWindow.viewDrink' : 'servingWindow.browseDrinks')} <span aria-hidden="true">↗</span>
                      </Link>
                    </div>
                  </>
                )}
              </div>
              <div className="serving-window__sash" aria-hidden="true">
                <div className="serving-window__glass">
                  <span className="serving-window__glass-brand">Cafert</span>
                  <span className="serving-window__glass-rule" />
                  <span className="serving-window__glass-question">{t('servingWindow.yourUsual')}</span>
                  <span className="serving-window__glass-note">{t('servingWindow.windowNote')}</span>
                </div>
                <span className="serving-window__handle" />
              </div>
            </div>
          </div>
          <div className="serving-window__sill" aria-hidden="true" />
          <fieldset className="serving-window__choices">
            <legend>{t('servingWindow.choose')}</legend>
            <div className="serving-window__choice-row">
              {preferences.map((preference, index) => (
                <button
                  key={preference}
                  type="button"
                  aria-pressed={selection === preference}
                  aria-controls="serving-window-result"
                  onClick={() => setSelection(preference)}
                >
                  <span className="serving-window__choice-number" aria-hidden="true">0{index + 1}</span>
                  <span>{t(`servingWindow.${preference}`)}</span>
                  <span className="serving-window__choice-mark" aria-hidden="true">{selection === preference ? '✓' : '↗'}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <div className="serving-window__footnote">
            <span>{t(open ? 'servingWindow.tryAnother' : 'servingWindow.openHint')}</span>
            <button type="button" aria-pressed={motionPaused} onClick={() => setMotionPaused(value => !value)}>
              {t(motionPaused ? 'servingWindow.enableMotion' : 'servingWindow.stopMotion')}
            </button>
          </div>
        </div>
      </div>
      <div className="serving-hero__bottom"><span>{t('servingWindow.bottomLine')}</span><span aria-hidden="true">↓</span></div>
    </section>
  );
};

export default HeroSection;
