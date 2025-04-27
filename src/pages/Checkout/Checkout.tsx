import React, { useState } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonBackButton,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonRadioGroup,
  IonRadio,
  IonListHeader,
  IonFooter,
  IonText,
  IonToggle,
  IonIcon,
  IonNote,
  IonList,
  IonSegment,
  IonSegmentButton,
  useIonRouter,
  useIonLoading,
  IonCard,
  IonCardContent,
  IonChip
} from '@ionic/react';
import { 
  locationOutline, 
  cardOutline, 
  chevronForward, 
  checkmarkCircle,
  cashOutline,
  logoPaypal,
  logoApple,
  informationCircleOutline,
  addCircleOutline,
  homeOutline,
  briefcaseOutline
} from 'ionicons/icons';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/productUtils';
import userData from '../../data/user.json';
import './Checkout.css';

const Checkout: React.FC = () => {
  const router = useIonRouter();
  const { totals, clearCart } = useCart();
  const [present, dismiss] = useIonLoading();
  
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedAddress, setSelectedAddress] = useState<number>(userData.addresses.find(addr => addr.isDefault)?.id || 1);
  const [selectedCard, setSelectedCard] = useState<number>(userData.paymentMethods.find(card => card.isDefault)?.id || 1);
  const [deliveryOption, setDeliveryOption] = useState<string>("standard");
  const [saveInfo, setSaveInfo] = useState<boolean>(false);

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitOrder = async () => {
    present({
      message: 'Processing your order...',
      duration: 2000
    });

    setTimeout(() => {
      clearCart();
      router.push('/order-confirmation');
    }, 2000);
  };

  // Shipping options with prices and delivery times
  const shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', price: 5.99, days: '5-7 business days' },
    { id: 'express', name: 'Express Shipping', price: 12.99, days: '2-3 business days' },
    { id: 'overnight', name: 'Overnight Shipping', price: 24.99, days: 'Next business day' }
  ];

  // Update the totals based on the selected shipping option
  const getSelectedShippingCost = () => {
    const option = shippingOptions.find(opt => opt.id === deliveryOption);
    return option ? option.price : 5.99;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/main/cart" />
          </IonButtons>
          <IonTitle>Checkout</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <div className="checkout-container">
          <div className="checkout-steps">
            <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="step-number">
                {currentStep > 1 ? <IonIcon icon={checkmarkCircle} /> : 1}
              </div>
              <div className="step-name">Shipping</div>
            </div>
            
            <div className="step-line"></div>
            
            <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="step-number">
                {currentStep > 2 ? <IonIcon icon={checkmarkCircle} /> : 2}
              </div>
              <div className="step-name">Payment</div>
            </div>
            
            <div className="step-line"></div>
            
            <div className={`step-indicator ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-name">Review</div>
            </div>
          </div>
          
          {/* Step 1: Shipping Address */}
          {currentStep === 1 && (
            <div className="checkout-step">
              <h2>Shipping Address</h2>
              <IonRadioGroup value={selectedAddress} onIonChange={e => setSelectedAddress(e.detail.value)}>
                {userData.addresses.map(address => (
                  <IonCard key={address.id} className="address-card">
                    <IonCardContent>
                      <IonItem lines="none">
                        <IonIcon icon={address.type === 'home' ? homeOutline : briefcaseOutline} slot="start" />
                        <IonLabel>
                          <h2>{address.type}</h2>
                          <p>
                            {address.lineOne}<br />
                            {address.lineTwo && <>{address.lineTwo}<br /></>}
                            {address.city}, {address.state} {address.postalCode}<br />
                            {address.country}
                          </p>
                        </IonLabel>
                        {address.isDefault && (
                          <IonNote slot="end" color="primary">Default</IonNote>
                        )}
                        <IonRadio slot="end" value={address.id} />
                      </IonItem>
                    </IonCardContent>
                  </IonCard>
                ))}
              </IonRadioGroup>
              
              <IonButton className="add-new-button" expand="block" fill="outline">
                <IonIcon slot="start" icon={addCircleOutline} />
                Add New Address
              </IonButton>
              
              <div className="shipping-options">
                <h3>Delivery Options</h3>
                <IonRadioGroup value={deliveryOption} onIonChange={e => setDeliveryOption(e.detail.value)}>
                  {shippingOptions.map(option => (
                    <IonItem key={option.id}>
                      <IonLabel>
                        <h2>{option.name}</h2>
                        <p>{option.days}</p>
                      </IonLabel>
                      <IonText slot="end" className="shipping-price">
                        ${option.price.toFixed(2)}
                      </IonText>
                      <IonRadio slot="start" value={option.id} />
                    </IonItem>
                  ))}
                </IonRadioGroup>
              </div>
              
              <IonButton className="continue-button" expand="block" onClick={handleContinue}>
                Continue to Payment
              </IonButton>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {currentStep === 2 && (
            <div className="checkout-step">
              <h2>Payment Method</h2>
              <IonRadioGroup value={selectedCard} onIonChange={e => setSelectedCard(e.detail.value)}>
                {userData.paymentMethods.map(card => (
                  <IonCard key={card.id} className="payment-card">
                    <IonCardContent>
                      <IonItem lines="none">
                        <IonIcon icon={cardOutline} slot="start" />
                        <IonLabel>
                          <h2>{card.provider}</h2>
                          <p>•••• •••• •••• {card.lastFour}</p>
                          <p>Expires {card.expiryMonth}/{card.expiryYear}</p>
                        </IonLabel>
                        {card.isDefault && (
                          <IonChip color="primary" slot="end">Default</IonChip>
                        )}
                        <IonRadio slot="end" value={card.id} />
                      </IonItem>
                    </IonCardContent>
                  </IonCard>
                ))}
                
                <IonCard className="payment-card">
                  <IonCardContent>
                    <IonItem lines="none">
                      <IonIcon icon={logoPaypal} slot="start" />
                      <IonLabel>
                        <h2>PayPal</h2>
                        <p>Pay with your PayPal account</p>
                      </IonLabel>
                      <IonRadio slot="end" value="paypal" />
                    </IonItem>
                  </IonCardContent>
                </IonCard>
                
                <IonCard className="payment-card">
                  <IonCardContent>
                    <IonItem lines="none">
                      <IonIcon icon={cashOutline} slot="start" />
                      <IonLabel>
                        <h2>Cash on Delivery</h2>
                        <p>Pay when you receive your order</p>
                      </IonLabel>
                      <IonRadio slot="end" value="cash" />
                    </IonItem>
                  </IonCardContent>
                </IonCard>
              </IonRadioGroup>
              
              <IonItem lines="none" className="save-payment-info">
                <IonLabel>Save payment information</IonLabel>
                <IonToggle 
                  checked={saveInfo} 
                  onIonChange={e => setSaveInfo(e.detail.checked)}
                />
              </IonItem>
              
              <IonButton 
                className="add-new-button" 
                expand="block" 
                fill="outline"
              >
                <IonIcon slot="start" icon={addCircleOutline} />
                Add New Payment Method
              </IonButton>
              
              <div className="button-group">
                <IonButton 
                  fill="outline" 
                  className="back-button"
                  onClick={handleBack}
                >
                  Back
                </IonButton>
                
                <IonButton 
                  className="continue-button"
                  onClick={handleContinue}
                >
                  Continue to Review
                </IonButton>
              </div>
            </div>
          )}

          {/* Step 3: Order Review */}
          {currentStep === 3 && (
            <div className="checkout-step">
              <h2>Review Your Order</h2>
              
              <div className="review-section">
                <h3>Shipping Address</h3>
                {(() => {
                  const address = userData.addresses.find(addr => addr.id === selectedAddress);
                  return (
                    <div className="review-details">
                      <p><strong>{address?.type}</strong></p>
                      <p>{address?.lineOne}</p>
                      <p>{address?.lineTwo}</p>
                      <p>{address?.city}, {address?.state} {address?.postalCode}</p>
                      <p>{address?.country}</p>
                    </div>
                  );
                })()}
              </div>
              
              <div className="review-section">
                <h3>Payment Method</h3>
                {(() => {
                  const card = userData.paymentMethods.find(c => c.id === selectedCard);
                  return (
                    <div className="review-details">
                      <p><strong>{card?.provider}</strong></p>
                      <p>{card?.lastFour}</p>
                      <p>Expires: {card?.expiryMonth}/{card?.expiryYear}</p>
                    </div>
                  );
                })()}
              </div>
              
              <div className="review-section">
                <h3>Order Summary</h3>
                <div className="summary-rows">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${formatPrice(totals.subtotal)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>${formatPrice(getSelectedShippingCost())}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax</span>
                    <span>${formatPrice(totals.tax)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${formatPrice(totals.total)}</span>
                  </div>
                </div>
              </div>
              
              <div className="button-group">
                <IonButton 
                  fill="outline" 
                  className="back-button"
                  onClick={handleBack}
                >
                  Back
                </IonButton>
                <IonButton 
                  className="place-order-button"
                  onClick={handleSubmitOrder}
                >
                  Place Order
                </IonButton>
              </div>
            </div>
          )}
        </div>
      </IonContent>
      
      <IonFooter className="checkout-footer">
        <div className="checkout-total">
          <IonText color="medium">Total</IonText>
          <IonText className="total-amount">{formatPrice(totals.total)}</IonText>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default Checkout; 