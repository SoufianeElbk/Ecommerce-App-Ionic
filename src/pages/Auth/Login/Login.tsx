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
import { logInOutline, mailOutline, lockClosedOutline, logoGoogle, logoApple } from 'ionicons/icons';
import { useAuth } from '../../../contexts/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const { login } = useAuth();
  const router = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      setShowError(true);
      return;
    }

    setShowLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        router.push('/main/home', 'root', 'replace');
      } else {
        setErrorMessage('Invalid email or password');
        setShowError(true);
      }
    } catch (error) {
      setErrorMessage('An error occurred during login');
      setShowError(true);
    } finally {
      setShowLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  // For demo purposes - quick login with sample user
  const handleDemoLogin = async () => {
    setEmail('john.doe@example.com');
    setPassword('password123');
    setShowLoading(true);
    
    setTimeout(async () => {
      const success = await login('john.doe@example.com', 'password123');
      if (success) {
        router.push('/main/home', 'root', 'replace');
      } else {
        setErrorMessage('Demo login failed');
        setShowError(true);
      }
      setShowLoading(false);
    }, 1000);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/onboarding" />
          </IonButtons>
          <IonTitle>Sign In</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="login-content">
        <div className="login-container">
          <div className="welcome-section">
            <h1>Welcome Back</h1>
            <p>Sign in to continue shopping</p>
          </div>
          
          <div className="form-section">
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
            
            <IonButton 
              className="forgot-password-button" 
              fill="clear"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </IonButton>
            
            <IonButton
              expand="block"
              className="login-button"
              onClick={handleLogin}
            >
              <IonIcon icon={logInOutline} slot="start" />
              Sign In
            </IonButton>
            
            <IonButton
              expand="block"
              className="demo-button"
              fill="outline"
              onClick={handleDemoLogin}
            >
              Quick Demo Login
            </IonButton>
          </div>
          
          <div className="social-login-section">
            <div className="divider">
              <span>OR</span>
            </div>
            
            <IonButton
              expand="block"
              className="google-button"
              fill="outline"
            >
              <IonIcon icon={logoGoogle} slot="start" />
              Continue with Google
            </IonButton>
            
            <IonButton
              expand="block"
              className="apple-button"
              fill="outline"
            >
              <IonIcon icon={logoApple} slot="start" />
              Continue with Apple
            </IonButton>
          </div>
          
          <div className="signup-prompt">
            <IonText color="medium">Don't have an account?</IonText>
            <IonButton 
              fill="clear"
              onClick={handleRegister}
            >
              Sign Up
            </IonButton>
          </div>
        </div>
        
        <IonLoading
          isOpen={showLoading}
          message="Please wait..."
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

export default Login; 