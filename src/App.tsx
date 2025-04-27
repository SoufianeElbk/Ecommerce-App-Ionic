import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, search, cart, heart, person } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

/* Pages */
import Home from './pages/Home/Home';
import SplashScreen from './pages/Onboarding/SplashScreen';
import Onboarding from './pages/Onboarding/Onboarding';
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword';
import ProductList from './pages/Products/ProductList';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import CartPage from './pages/Cart/CartPage';
import Checkout from './pages/Checkout/Checkout';
import OrderConfirmation from './pages/Checkout/OrderConfirmation';
import Profile from './pages/Profile/Profile';
import Wishlist from './pages/Wishlist/Wishlist';
import OrderTracking from './pages/OrderTracking/OrderTracking';

/* Contexts */
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { AuthProvider } from './contexts/AuthContext';

setupIonicReact();

const App: React.FC = () => (
  <AuthProvider>
    <CartProvider>
      <WishlistProvider>
        <IonApp>
          <IonReactRouter>
            <Route exact path="/splash">
              <SplashScreen />
            </Route>
            <Route exact path="/onboarding">
              <Onboarding />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route exact path="/forgot-password">
              <ForgotPassword />
            </Route>
            <Route exact path="/checkout">
              <Checkout />
            </Route>
            <Route exact path="/order-confirmation">
              <OrderConfirmation />
            </Route>
            <Route exact path="/order-tracking/:id">
              <OrderTracking />
            </Route>
            
            <Route path="/main">
              <IonTabs>
                <IonRouterOutlet>
                  <Route exact path="/main/home">
                    <Home />
                  </Route>
                  <Route exact path="/main/products">
                    <ProductList />
                  </Route>
                  <Route exact path="/main/products/category/:categoryId">
                    <ProductList />
                  </Route>
                  <Route exact path="/main/products/:id">
                    <ProductDetail />
                  </Route>
                  <Route exact path="/main/cart">
                    <CartPage />
                  </Route>
                  <Route exact path="/main/wishlist">
                    <Wishlist />
                  </Route>
                  <Route exact path="/main/profile">
                    <Profile />
                  </Route>
                  <Route exact path="/main">
                    <Redirect to="/main/home" />
                  </Route>
                </IonRouterOutlet>
                
                <IonTabBar slot="bottom">
                  <IonTabButton tab="home" href="/main/home">
                    <IonIcon icon={home} />
                    <IonLabel>Home</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="products" href="/main/products">
                    <IonIcon icon={search} />
                    <IonLabel>Search</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="cart" href="/main/cart">
                    <IonIcon icon={cart} />
                    <IonLabel>Cart</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="wishlist" href="/main/wishlist">
                    <IonIcon icon={heart} />
                    <IonLabel>Wishlist</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="profile" href="/main/profile">
                    <IonIcon icon={person} />
                    <IonLabel>Profile</IonLabel>
                  </IonTabButton>
                </IonTabBar>
              </IonTabs>
            </Route>
            
            <Route exact path="/">
              <Redirect to="/splash" />
            </Route>
          </IonReactRouter>
        </IonApp>
      </WishlistProvider>
    </CartProvider>
  </AuthProvider>
);

export default App;
