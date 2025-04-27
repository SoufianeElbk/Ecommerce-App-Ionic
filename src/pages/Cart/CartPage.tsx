import React from 'react';
import { 
  IonPage, 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonButton,
  IonIcon,
  IonText,
  IonFooter,
  IonGrid,
  IonRow,
  IonCol,
  IonAlert,
  useIonRouter
} from '@ionic/react';
import { add, remove, trashOutline } from 'ionicons/icons';
import { useCart } from '../../contexts/CartContext';
import { getProductById, formatPrice } from '../../utils/productUtils';
import './CartPage.css';

const CartPage: React.FC = () => {
  const router = useIonRouter();
  const { items, totals, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showClearCartAlert, setShowClearCartAlert] = React.useState(false);

  const cartItems = items.map(item => {
    const product = getProductById(item.productId);
    return {
      ...item,
      product,
      price: product ? (product.discountPrice || product.price) : 0
    };
  });

  const handleUpdateQuantity = (productId: number, newQty: number) => {
    if (newQty > 0) {
      updateQuantity(productId, newQty);
    }
  };

  const handleRemoveFromCart = (productId: number) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push('/checkout');
  };

  const handleClearCart = () => {
    setShowClearCartAlert(true);
  };

  const confirmClearCart = () => {
    clearCart();
  };

  const handleContinueShopping = () => {
    router.push('/main/home');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/main/home" />
          </IonButtons>
          <IonTitle>Your Cart</IonTitle>
          {items.length > 0 && (
            <IonButtons slot="end">
              <IonButton color="medium" onClick={handleClearCart}>
                <IonIcon slot="icon-only" icon={trashOutline} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        {items.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <IonIcon icon={trashOutline} />
            </div>
            <IonText color="medium" className="empty-cart-message">
              Your cart is empty
            </IonText>
            <IonButton onClick={handleContinueShopping} className="continue-shopping-btn">
              Continue Shopping
            </IonButton>
          </div>
        ) : (
          <div className="cart-content">
            <IonList className="cart-list">
              {cartItems.map(item => (
                <IonItem key={item.productId} className="cart-item">
                  {item.product && (
                    <>
                      <IonThumbnail slot="start" className="item-thumbnail">
                        <img src={item.product.images[0]} alt={item.product.name} />
                      </IonThumbnail>
                      
                      <div className="item-details">
                        <IonLabel className="item-name">{item.product.name}</IonLabel>
                        
                        {item.color && (
                          <div className="item-color">
                            <span 
                              className="color-dot" 
                              style={{ backgroundColor: item.color }}
                            />
                            <IonText color="medium">{item.color}</IonText>
                          </div>
                        )}
                        
                        <IonText color="dark" className="item-price">
                          {formatPrice(item.price)}
                        </IonText>
                      </div>
                      
                      <div className="item-actions">
                        <div className="quantity-controls">
                          <IonButton 
                            fill="clear" 
                            className="qty-btn"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          >
                            <IonIcon icon={remove} />
                          </IonButton>
                          
                          <span className="qty-value">{item.quantity}</span>
                          
                          <IonButton 
                            fill="clear" 
                            className="qty-btn"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          >
                            <IonIcon icon={add} />
                          </IonButton>
                        </div>
                        
                        <IonButton 
                          fill="clear" 
                          color="danger"
                          className="remove-btn"
                          onClick={() => handleRemoveFromCart(item.productId)}
                        >
                          <IonIcon icon={trashOutline} />
                        </IonButton>
                      </div>
                    </>
                  )}
                </IonItem>
              ))}
            </IonList>
            
            <div className="promo-section">
              <IonItem className="promo-input">
                <IonLabel position="floating">Promo Code</IonLabel>
                <input type="text" placeholder="Enter promo code" />
                <IonButton slot="end" fill="solid" size="small" className="apply-btn">
                  Apply
                </IonButton>
              </IonItem>
            </div>
            
            <div className="cart-summary">
              <div className="summary-row">
                <IonText color="medium">Subtotal</IonText>
                <IonText color="dark">{formatPrice(totals.subtotal)}</IonText>
              </div>
              
              <div className="summary-row">
                <IonText color="medium">Shipping</IonText>
                <IonText color="dark">
                  {totals.shipping === 0 
                    ? 'Free' 
                    : formatPrice(totals.shipping)
                  }
                </IonText>
              </div>
              
              <div className="summary-row">
                <IonText color="medium">Tax</IonText>
                <IonText color="dark">{formatPrice(totals.tax)}</IonText>
              </div>
              
              <div className="summary-row total">
                <IonText color="dark">Total</IonText>
                <IonText color="dark" className="total-amount">{formatPrice(totals.total)}</IonText>
              </div>
            </div>
          </div>
        )}
      </IonContent>
      
      {items.length > 0 && (
        <IonFooter className="cart-footer">
          <IonGrid>
            <IonRow>
              <IonCol size="5" className="total-col">
                <IonText color="medium">Total</IonText>
                <IonText className="footer-total">{formatPrice(totals.total)}</IonText>
              </IonCol>
              <IonCol size="7">
                <IonButton 
                  expand="block"
                  className="checkout-btn"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonFooter>
      )}
      
      <IonAlert
        isOpen={showClearCartAlert}
        onDidDismiss={() => setShowClearCartAlert(false)}
        header="Clear Cart"
        message="Are you sure you want to remove all items from your cart?"
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Clear Cart',
            handler: confirmClearCart
          }
        ]}
      />
    </IonPage>
  );
};

export default CartPage; 