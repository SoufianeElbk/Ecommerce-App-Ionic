import React, { useEffect } from 'react';
import { IonPage, IonContent, IonText, IonIcon, useIonRouter, IonImg } from '@ionic/react';
import { bagHandle } from 'ionicons/icons';
import './SplashScreen.css';

const SplashScreen: React.FC = () => {
  const router = useIonRouter();

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    
    // After 2.5 seconds, navigate to onboarding or login
    const timer = setTimeout(() => {
      if (hasSeenOnboarding) {
        // User has seen onboarding, navigate to login
        router.push('/login', 'forward', 'replace');
      } else {
        // User hasn't seen onboarding, navigate to onboarding
        router.push('/onboarding', 'forward', 'replace');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <IonPage>
      <IonContent className="splash-container">
        <div className="splash-content">
          <div className="logo-container">
            <IonIcon icon={bagHandle} className="splash-logo" />
          </div>
          <IonText className="app-name">
            <h1>IonicShop</h1>
          </IonText>
          <IonText className="app-tagline">
            <p>Shop smart, shop mobile</p>
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SplashScreen; 