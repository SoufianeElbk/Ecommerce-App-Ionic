import React, { useState } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonBackButton,
  IonTitle,
  IonItem, 
  IonInput, 
  IonButton, 
  IonIcon, 
  IonText,
  IonLoading,
  IonToast,
  useIonRouter
} from '@ionic/react';
import { mailOutline, sendOutline } from 'ionicons/icons';
import { useAuth } from '../../../contexts/AuthContext';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const router = useIonRouter();
  const [email, setEmail] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMessage('Please enter your email address');
      setShowError(true);
      return;
    }

    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage('Please enter a valid email address');
      setShowError(true);
      return;
    }

    setShowLoading(true);
    
    try {
      const success = await forgotPassword(email);
      
      if (success) {
        setShowSuccess(true);
      } else {
        setErrorMessage('Password reset failed. Please try again.');
        setShowError(true);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
      setShowError(true);
    } finally {
      setShowLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle>Reset Password</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="forgot-content">
        <div className="forgot-container">
          <div className="illustration">
            <img src="https://cdn-icons-png.flaticon.com/512/6195/6195700.png" alt="Forgot Password" />
          </div>
          
          <div className="heading-section">
            <h1>Forgot Password?</h1>
            <p>Enter your email address below to receive password reset instructions</p>
          </div>
          
          <div className="form-section">
            <IonItem className="custom-input">
              <IonIcon icon={mailOutline} slot="start" color="medium" />
              <IonInput
                type="email"
                placeholder="Email Address"
                value={email}
                onIonChange={e => setEmail(e.detail.value!)}
              />
            </IonItem>
            
            <IonButton
              expand="block"
              className="reset-button"
              onClick={handleResetPassword}
            >
              <IonIcon icon={sendOutline} slot="start" />
              Send Reset Link
            </IonButton>
            
            <IonButton
              expand="block"
              fill="clear"
              className="back-button"
              onClick={handleBackToLogin}
            >
              Back to Login
            </IonButton>
          </div>
        </div>
        
        <IonLoading
          isOpen={showLoading}
          message="Sending reset link..."
          duration={3000}
        />
        
        <IonToast
          isOpen={showSuccess}
          message="Password reset link sent to your email"
          duration={3000}
          color="success"
          onDidDismiss={() => {
            setShowSuccess(false);
            router.push('/login');
          }}
        />
        
        <IonToast
          isOpen={showError}
          message={errorMessage}
          duration={3000}
          color="danger"
          onDidDismiss={() => setShowError(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword; 