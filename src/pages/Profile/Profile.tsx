import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonText,
  IonItem,
  IonLabel,
  IonAvatar,
  IonList,
  IonCard,
  IonCardContent,
  IonChip,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonItemDivider,
  IonSegment,
  IonSegmentButton,
  IonAlert,
  useIonRouter
} from '@ionic/react';
import {
  personCircleOutline,
  settingsOutline,
  logOutOutline,
  mailOutline,
  callOutline,
  locationOutline,
  cartOutline,
  heartOutline,
  cardOutline,
  notificationsOutline,
  helpCircleOutline,
  shieldCheckmarkOutline,
  chevronForward
} from 'ionicons/icons';
import { useAuth } from '../../contexts/AuthContext';
import userData from '../../data/user.json';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useIonRouter();
  const [segment, setSegment] = useState<string>('orders');
  const [showLogoutAlert, setShowLogoutAlert] = useState<boolean>(false);

  const handleSegmentChange = (e: CustomEvent) => {
    setSegment(e.detail.value);
  };

  const handleLogout = () => {
    setShowLogoutAlert(true);
  };

  const confirmLogout = () => {
    logout();
    router.push('/login', 'root', 'replace');
  };

  const recentOrders = userData.orders.slice(0, 3);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
          <IonButton slot="end" fill="clear" onClick={() => {}}>
            <IonIcon icon={settingsOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="profile-content">
        <div className="profile-header">
          <IonAvatar className="profile-avatar">
            <img src={userData.profileImage} alt={`${userData.firstName} ${userData.lastName}`} />
          </IonAvatar>
          <IonText className="profile-name">
            <h2>{userData.firstName} {userData.lastName}</h2>
          </IonText>
          <div className="profile-contact">
            <IonChip outline color="medium">
              <IonIcon icon={mailOutline} />
              <IonLabel>{userData.email}</IonLabel>
            </IonChip>
            <IonChip outline color="medium">
              <IonIcon icon={callOutline} />
              <IonLabel>{userData.phone}</IonLabel>
            </IonChip>
          </div>
        </div>

        <div className="profile-stats">
          <IonGrid>
            <IonRow>
              <IonCol>
                <div className="stat-item">
                  <IonText className="stat-value">{userData.orders.length}</IonText>
                  <IonText color="medium" className="stat-label">Orders</IonText>
                </div>
              </IonCol>
              <IonCol>
                <div className="stat-item">
                  <IonText className="stat-value">{userData.wishlist.length}</IonText>
                  <IonText color="medium" className="stat-label">Wishlist</IonText>
                </div>
              </IonCol>
              <IonCol>
                <div className="stat-item">
                  <IonText className="stat-value">{userData.cart.items.length}</IonText>
                  <IonText color="medium" className="stat-label">In Cart</IonText>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        <IonSegment value={segment} onIonChange={handleSegmentChange} className="profile-segment">
          <IonSegmentButton value="orders">
            <IonLabel>Orders</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="addresses">
            <IonLabel>Addresses</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="payment">
            <IonLabel>Payment</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {segment === 'orders' && (
          <div className="profile-section">
            <div className="section-header">
              <IonText className="section-title">Recent Orders</IonText>
              <IonButton fill="clear" size="small" className="see-all-btn">See All</IonButton>
            </div>

            {recentOrders.map(order => (
              <IonCard key={order.id} className="order-card">
                <IonCardContent>
                  <div className="order-header">
                    <div>
                      <IonText className="order-id">{order.id}</IonText>
                      <IonText color="medium" className="order-date">{order.date}</IonText>
                    </div>
                    <IonBadge color={order.status === 'Delivered' ? 'success' : 'primary'}>
                      {order.status}
                    </IonBadge>
                  </div>
                  <div className="order-info">
                    <div className="order-items">
                      <IonText color="medium">Items: {order.items.length}</IonText>
                    </div>
                    <div className="order-total">
                      <IonText color="dark" className="total-amount">${order.total.toFixed(2)}</IonText>
                    </div>
                  </div>
                  <IonButton fill="clear" className="track-order-btn" routerLink={`/order-tracking/${order.id.replace('ORD-', '')}`}>
                    Track Order
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}

        {segment === 'addresses' && (
          <div className="profile-section">
            <div className="section-header">
              <IonText className="section-title">Saved Addresses</IonText>
              <IonButton fill="clear" size="small" className="add-btn">+ Add</IonButton>
            </div>

            {userData.addresses.map(address => (
              <IonCard key={address.id} className="address-card">
                <IonCardContent>
                  <div className="address-header">
                    <div>
                      <IonText className="address-type">{address.type}</IonText>
                      {address.isDefault && (
                        <IonChip color="primary" outline className="default-chip">
                          Default
                        </IonChip>
                      )}
                    </div>
                    <IonButton fill="clear" size="small">Edit</IonButton>
                  </div>
                  <div className="address-details">
                    <IonText>
                      <p>{address.lineOne}</p>
                      {address.lineTwo && <p>{address.lineTwo}</p>}
                      <p>{address.city}, {address.state} {address.postalCode}</p>
                      <p>{address.country}</p>
                    </IonText>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}

        {segment === 'payment' && (
          <div className="profile-section">
            <div className="section-header">
              <IonText className="section-title">Payment Methods</IonText>
              <IonButton fill="clear" size="small" className="add-btn">+ Add</IonButton>
            </div>

            {userData.paymentMethods.map(payment => (
              <IonCard key={payment.id} className="payment-card">
                <IonCardContent>
                  <div className="payment-header">
                    <div className="card-info">
                      <div className="card-type">
                        {payment.provider === 'Visa' ? (
                          <img src="https://cdn.freebiesupply.com/logos/large/2x/visa-logo-png-transparent.png" alt="Visa" className="card-logo" />
                        ) : payment.provider === 'Mastercard' ? (
                          <img src="https://cdn.worldvectorlogo.com/logos/mastercard-2.svg" alt="Mastercard" className="card-logo" />
                        ) : (
                          <IonIcon icon={cardOutline} />
                        )}
                        <IonText className="card-provider">{payment.provider}</IonText>
                      </div>
                      {payment.isDefault && (
                        <IonChip color="primary" outline className="default-chip">
                          Default
                        </IonChip>
                      )}
                    </div>
                    <IonButton fill="clear" size="small">Edit</IonButton>
                  </div>
                  <div className="card-details">
                    <IonText className="card-number">•••• •••• •••• {payment.lastFour}</IonText>
                    <IonText color="medium" className="card-expiry">
                      Expires: {payment.expiryMonth}/{payment.expiryYear}
                    </IonText>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}

        <IonItemDivider className="section-divider">
          <IonLabel>Settings</IonLabel>
        </IonItemDivider>

        <IonList lines="none" className="settings-list">
          <IonItem button detail routerLink="/notifications">
            <IonIcon slot="start" icon={notificationsOutline} color="primary" />
            <IonLabel>Notifications</IonLabel>
          </IonItem>
          <IonItem button detail routerLink="/help">
            <IonIcon slot="start" icon={helpCircleOutline} color="primary" />
            <IonLabel>Help & Support</IonLabel>
          </IonItem>
          <IonItem button detail routerLink="/privacy">
            <IonIcon slot="start" icon={shieldCheckmarkOutline} color="primary" />
            <IonLabel>Privacy & Security</IonLabel>
          </IonItem>
          <IonItem button onClick={handleLogout}>
            <IonIcon slot="start" icon={logOutOutline} color="danger" />
            <IonLabel color="danger">Log Out</IonLabel>
          </IonItem>
        </IonList>

        <IonAlert
          isOpen={showLogoutAlert}
          onDidDismiss={() => setShowLogoutAlert(false)}
          header="Log Out"
          message="Are you sure you want to log out?"
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Log Out',
              handler: confirmLogout
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Profile; 