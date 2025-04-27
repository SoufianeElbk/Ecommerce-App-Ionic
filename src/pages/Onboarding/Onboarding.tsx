import React, { useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonText, useIonRouter } from '@ionic/react';
import { arrowForward, cart, card, heart, reload } from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperCore } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './Onboarding.css';

const Onboarding: React.FC = () => {
  const router = useIonRouter();
  const [showSkip, setShowSkip] = useState(true);
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);

  const slides = [
    {
      title: 'Welcome to IonicShop',
      description: 'Discover thousands of products at your fingertips and shop with ease.',
      image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=500&q=80',
      icon: cart
    },
    {
      title: 'Fast & Secure Checkout',
      description: 'Our simplified checkout process makes ordering quick and secure.',
      image: 'https://images.unsplash.com/photo-1599658880436-c61792e70672?w=500&q=80',
      icon: card
    },
    {
      title: 'Save Your Favorites',
      description: 'Keep track of items you love and get notified about special offers.',
      image: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=500&q=80',
      icon: heart
    },
    {
      title: 'Easy Order Tracking',
      description: 'Track your orders in real-time from purchase to delivery.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&q=80',
      icon: reload
    }
  ];

  const nextSlide = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  const finishOnboarding = () => {
    // Mark onboarding as completed
    localStorage.setItem('hasSeenOnboarding', 'true');
    router.push('/login', 'forward', 'replace');
  };

  const skipOnboarding = () => {
    // Mark onboarding as completed
    localStorage.setItem('hasSeenOnboarding', 'true');
    router.push('/login', 'forward', 'replace');
  };

  const handleSlideChange = () => {
    if (swiperInstance) {
      setShowSkip(swiperInstance.activeIndex < slides.length - 1);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="onboarding-container">
        <Swiper
          onSwiper={setSwiperInstance}
          onSlideChange={handleSlideChange}
          pagination={{ clickable: true }}
          className="slides-container"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className="slide">
              <div className="slide-content">
                <div className="slide-image-container">
                  <img src={slide.image} alt={slide.title} className="slide-image" />
                  <div className="icon-overlay">
                    <IonIcon icon={slide.icon} className="slide-icon" />
                  </div>
                </div>
                <IonText className="slide-title">
                  <h2>{slide.title}</h2>
                </IonText>
                <IonText className="slide-description">
                  <p>{slide.description}</p>
                </IonText>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        <div className="onboarding-actions">
          {showSkip && (
            <IonButton fill="clear" className="skip-button" onClick={skipOnboarding}>
              Skip
            </IonButton>
          )}
          
          <IonButton 
            className="next-button" 
            shape="round" 
            onClick={showSkip ? nextSlide : finishOnboarding}
          >
            {showSkip ? 'Next' : 'Get Started'}
            {showSkip && <IonIcon slot="end" icon={arrowForward} />}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Onboarding; 