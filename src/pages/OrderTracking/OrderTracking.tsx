import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonCard,
  IonCardContent,
  IonText,
  IonItem,
  IonLabel,
  IonIcon,
  IonItemDivider,
  IonChip,
  IonAvatar,
  IonSkeletonText,
  IonButton,
  useIonRouter
} from '@ionic/react';
import {
  checkmarkCircle,
  timeOutline,
  locationOutline,
  cardOutline,
  callOutline,
  mailOutline,
  cartOutline
} from 'ionicons/icons';
import userData from '../../data/user.json';
import { getProductById } from '../../utils/productUtils';
import './OrderTracking.css';

interface RouteParams {
  id: string;
}

const OrderTracking: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const router = useIonRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // Simulate loading the order data
    const timer = setTimeout(() => {
      const foundOrder = userData.orders.find(order => 
        order.id.replace('ORD-', '') === id || order.id === id
      );
      
      setOrder(foundOrder);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  const renderStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'out for delivery':
        return 'status-out-for-delivery';
      case 'shipped':
        return 'status-shipped';
      case 'processing':
        return 'status-processing';
      case 'order placed':
        return 'status-placed';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return checkmarkCircle;
      case 'out for delivery':
      case 'in transit':
        return timeOutline;
      default:
        return timeOutline;
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/main/profile" />
            </IonButtons>
            <IonTitle>Order Tracking</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="skeleton-container">
            <IonCard>
              <IonCardContent>
                <IonSkeletonText animated style={{ width: '60%', height: '24px' }} />
                <IonSkeletonText animated style={{ width: '40%', height: '18px' }} />
                <IonSkeletonText animated style={{ width: '80%', height: '18px' }} />
              </IonCardContent>
            </IonCard>
            
            <IonCard>
              <IonCardContent>
                <IonSkeletonText animated style={{ width: '40%', height: '24px' }} />
                <IonSkeletonText animated style={{ width: '100%', height: '100px' }} />
              </IonCardContent>
            </IonCard>
            
            <IonCard>
              <IonCardContent>
                <IonSkeletonText animated style={{ width: '40%', height: '24px' }} />
                <IonSkeletonText animated style={{ width: '100%', height: '80px' }} />
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!order) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/main/profile" />
            </IonButtons>
            <IonTitle>Order Not Found</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="not-found-container">
            <IonText color="medium">
              <h2>Order Not Found</h2>
              <p>We couldn't find the order you're looking for.</p>
            </IonText>
            <IonButton 
              expand="block" 
              onClick={() => router.push('/main/profile')}
              className="back-button"
            >
              Go to Profile
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const address = userData.addresses.find(addr => addr.id === order.shippingAddressId);
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/main/profile" />
          </IonButtons>
          <IonTitle>Order Tracking</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="tracking-content">
        <div className="tracking-container">
          <IonCard className="order-info-card">
            <IonCardContent>
              <div className="order-header">
                <div>
                  <IonText className="order-id">{order.id}</IonText>
                  <IonText color="medium" className="order-date">Ordered on {order.date}</IonText>
                </div>
                <IonChip 
                  color={order.status.toLowerCase() === 'delivered' ? 'success' : 'primary'}
                  className="status-chip"
                >
                  {order.status}
                </IonChip>
              </div>
              
              <IonItemDivider className="divider">
                <IonLabel>Delivery Information</IonLabel>
              </IonItemDivider>
              
              <div className="delivery-info">
                {address && (
                  <div className="address-info">
                    <IonIcon icon={locationOutline} color="primary" />
                    <div>
                      <IonText className="info-label">Shipping Address</IonText>
                      <p className="address-text">
                        {address.lineOne}<br />
                        {address.lineTwo && <>{address.lineTwo}<br /></>}
                        {address.city}, {address.state} {address.postalCode}<br />
                        {address.country}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="tracking-info">
                  <IonIcon icon={cartOutline} color="primary" />
                  <div>
                    <IonText className="info-label">Tracking Info</IonText>
                    <p>
                      Carrier: {order.trackingInfo.carrier}<br />
                      Tracking #: {order.trackingInfo.trackingNumber}<br />
                      Est. Delivery: {order.trackingInfo.estimatedDelivery}
                    </p>
                  </div>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
          
          <IonCard className="tracking-status-card">
            <IonCardContent>
              <IonText className="section-title">Tracking Status</IonText>
              
              <div className="status-timeline">
                {order.trackingInfo.statusHistory.map((status: any, index: number) => (
                  <div 
                    key={index} 
                    className={`timeline-item ${index === 0 ? 'active' : ''} ${renderStatusClass(status.status)}`}
                  >
                    <div className="timeline-icon">
                      <IonIcon icon={getStatusIcon(status.status)} />
                    </div>
                    <div className="timeline-content">
                      <IonText className="status-name">{status.status}</IonText>
                      <IonText color="medium" className="status-details">
                        {new Date(status.date).toLocaleString()}<br />
                        {status.location}
                      </IonText>
                    </div>
                  </div>
                ))}
              </div>
            </IonCardContent>
          </IonCard>
          
          <IonCard className="order-items-card">
            <IonCardContent>
              <IonText className="section-title">Order Items</IonText>
              
              <div className="order-items">
                {order.items.map((item: any) => {
                  const product = getProductById(item.productId);
                  return product ? (
                    <div key={item.productId} className="order-item">
                      <div className="item-image-container">
                        <img src={product.images[0]} alt={product.name} className="item-image" />
                      </div>
                      <div className="item-details">
                        <IonText className="item-name">{product.name}</IonText>
                        <IonText color="medium" className="item-meta">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </IonText>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
              
              <div className="order-summary">
                <div className="summary-row">
                  <span>Items ({order.items.length})</span>
                  <span>${order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>$5.99</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>${(order.total * 0.08).toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
          
          <div className="action-buttons">
            <IonButton expand="block" fill="outline" className="help-button">
              <IonIcon slot="start" icon={callOutline} />
              Contact Support
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OrderTracking; 