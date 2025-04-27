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
  IonLabel, 
  IonInput, 
  IonButton, 
  IonIcon, 
  IonText,
  IonLoading,
  IonToast,
  useIonRouter
} from '@ionic/react';
import { personOutline, mailOutline, lockClosedOutline, createOutline } from 'ionicons/icons';
import { useAuth } from '../../../contexts/AuthContext';
import './Register.css';

const Register: React.FC = () => {
  const { register } = useAuth();
  const router = useIonRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    // Validate inputs
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all fields');
      setShowError(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
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
      const success = await register({ firstName, lastName, email }, password);
      
      if (success) {
        router.push('/main/home', 'root', 'replace');
      } else {
        setErrorMessage('Registration failed. Please try again.');
        setShowError(true);
      }
    } catch (error) {
      setErrorMessage('An error occurred during registration');
      setShowError(true);
    } finally {
      setShowLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="register-content">
        <div className="register-container">
          <div className="welcome-section">
            <h1>Create Account</h1>
            <p>Fill in your details to get started</p>
          </div>
          
          <div className="form-section">
            <IonItem className="custom-input">
              <IonIcon icon={personOutline} slot="start" color="medium" />
              <IonInput
                type="text"
                placeholder="First Name"
                value={firstName}
                onIonChange={e => setFirstName(e.detail.value!)}
              />
            </IonItem>
            
            <IonItem className="custom-input">
              <IonIcon icon={personOutline} slot="start" color="medium" />
              <IonInput
                type="text"
                placeholder="Last Name"
                value={lastName}
                onIonChange={e => setLastName(e.detail.value!)}
              />
            </IonItem>
            
            <IonItem className="custom-input">
              <IonIcon icon={mailOutline} slot="start" color="medium" />
              <IonInput
                type="email"
                placeholder="Email"
                value={email}
                onIonChange={e => setEmail(e.detail.value!)}
              />
            </IonItem>
            
            <IonItem className="custom-input">
              <IonIcon icon={lockClosedOutline} slot="start" color="medium" />
              <IonInput
                type="password"
                placeholder="Password"
                value={password}
                onIonChange={e => setPassword(e.detail.value!)}
              />
            </IonItem>
            
            <IonItem className="custom-input">
              <IonIcon icon={lockClosedOutline} slot="start" color="medium" />
              <IonInput
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onIonChange={e => setConfirmPassword(e.detail.value!)}
              />
            </IonItem>
            
            <div className="terms-section">
              <IonText color="medium" className="terms-text">
                By creating an account, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </IonText>
            </div>
            
            <IonButton
              expand="block"
              className="register-button"
              onClick={handleRegister}
            >
              <IonIcon icon={createOutline} slot="start" />
              Create Account
            </IonButton>
          </div>
          
          <div className="login-prompt">
            <IonText color="medium">Already have an account?</IonText>
            <IonButton 
              fill="clear"
              onClick={handleLogin}
            >
              Sign In
            </IonButton>
          </div>
        </div>
        
        <IonLoading
          isOpen={showLoading}
          message="Creating account..."
          duration={5000}
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

export default Register; 