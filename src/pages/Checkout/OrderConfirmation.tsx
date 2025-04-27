import React from 'react';
import { 
  IonPage, 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButton, 
  IonIcon, 
  IonText,
  IonCard,
  IonCardContent,
  useIonRouter
} from '@ionic/react';
import { 
  checkmarkCircle,
  homeOutline,
  timeOutline
} from 'ionicons/icons';
import './OrderConfirmation.css';

const OrderConfirmation: React.FC = () => {
  const router = useIonRouter();
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  
  const handleContinueShopping = () => {
    router.push('/main/home', 'root', 'replace');
  };
  
  const handleTrackOrder = () => {
    // Would typically navigate to order tracking with the order ID
    router.push(`/order-tracking/${orderNumber.replace('ORD-', '')}`);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>Order Confirmation</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="confirmation-content">
        <div className="confirmation-container">
          <div className="success-icon">
            <IonIcon icon={checkmarkCircle} />
          </div>
          
          <IonText className="success-title">
            <h1>Order Successful!</h1>
          </IonText>
          
          <IonText className="success-message" color="medium">
            <p>Your order has been placed successfully. We'll process it right away!</p>
          </IonText>
          
          <IonCard className="order-info-card">
            <IonCardContent>
              <div className="order-info-row">
                <IonText color="medium">Order Number</IonText>
                <IonText>{orderNumber}</IonText>
              </div>
              <div className="order-info-row">
                <IonText color="medium">Date</IonText>
                <IonText>{new Date().toLocaleDateString()}</IonText>
              </div>
              <div className="order-info-row">
                <IonText color="medium">Estimated Delivery</IonText>
                <IonText>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</IonText>
              </div>
            </IonCardContent>
          </IonCard>
          
          <div className="next-steps">
            <IonText color="medium" className="next-steps-title">
              <h3>Next Steps</h3>
            </IonText>
            
            <div className="steps-list">
              <div className="step-item">
                <div className="step-icon">
                  <IonIcon icon={timeOutline} />
                </div>
                <div className="step-content">
                  <IonText className="step-title">Track Your Order</IonText>
                  <IonText color="medium" className="step-description">
                    You'll receive an email with tracking information once your order ships.
                  </IonText>
                </div>
              </div>
            </div>
          </div>
          
          <div className="action-buttons">
            <IonButton
              expand="block"
              className="track-button"
              onClick={handleTrackOrder}
            >
              Track Order
            </IonButton>
            
            <IonButton
              expand="block"
              fill="outline"
              className="continue-button"
              onClick={handleContinueShopping}
            >
              <IonIcon slot="start" icon={homeOutline} />
              Continue Shopping
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OrderConfirmation; 