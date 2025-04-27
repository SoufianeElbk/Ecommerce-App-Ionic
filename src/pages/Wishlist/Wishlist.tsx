import React from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  useIonRouter
} from '@ionic/react';
import { cartOutline, closeCircleOutline, heartDislikeOutline } from 'ionicons/icons';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { getProductById, formatPrice, Product } from '../../utils/productUtils';
import './Wishlist.css';

const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router = useIonRouter();

  // Filter out any undefined products
  const wishlistProducts = wishlist
    .map(productId => getProductById(productId))
    .filter((product): product is Product => product !== undefined);

  const handleAddToCart = (productId: number) => {
    addToCart(productId, 1);
  };

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist(productId);
  };

  const handleProductClick = (productId: number) => {
    router.push(`/main/products/${productId}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Wishlist</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="wishlist-content">
        {wishlistProducts.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">
              <IonIcon icon={heartDislikeOutline} />
            </div>
            <IonText color="medium" className="empty-text">
              <h2>Your wishlist is empty</h2>
              <p>Items you save to your wishlist will appear here</p>
            </IonText>
            <IonButton 
              fill="solid" 
              className="shopping-button"
              routerLink="/main/home"
            >
              Start Shopping
            </IonButton>
          </div>
        ) : (
          <div className="wishlist-container">
            <div className="wishlist-count">
              <IonText color="medium">{wishlistProducts.length} items in your wishlist</IonText>
            </div>

            <IonGrid className="wishlist-grid">
              {wishlistProducts.map(product => (
                <IonRow key={product.id} className="wishlist-item">
                  <IonCol size="3" className="item-image-col">
                    <div 
                      className="item-image-container"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img src={product.images[0]} alt={product.name} className="item-image" />
                    </div>
                  </IonCol>
                  
                  <IonCol size="6" className="item-details-col">
                    <div 
                      className="item-details"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <IonText className="item-name">{product.name}</IonText>
                      
                      <IonText color="dark" className="item-price">
                        {product.discountPrice ? (
                          <>
                            <span className="discount-price">{formatPrice(product.discountPrice)}</span>
                            <span className="original-price">{formatPrice(product.price)}</span>
                          </>
                        ) : (
                          formatPrice(product.price)
                        )}
                      </IonText>
                      
                      <div className="item-status">
                        {product.inStock ? (
                          <IonText color="success" className="in-stock">In Stock</IonText>
                        ) : (
                          <IonText color="danger" className="out-of-stock">Out of Stock</IonText>
                        )}
                      </div>
                    </div>
                  </IonCol>
                  
                  <IonCol size="3" className="item-actions-col">
                    <div className="item-actions">
                      <IonButton
                        fill="clear"
                        className="remove-btn"
                        onClick={() => handleRemoveFromWishlist(product.id)}
                      >
                        <IonIcon slot="icon-only" icon={closeCircleOutline} />
                      </IonButton>
                      
                      <IonButton
                        fill="solid"
                        className="cart-btn"
                        disabled={!product.inStock}
                        onClick={() => handleAddToCart(product.id)}
                      >
                        <IonIcon slot="icon-only" icon={cartOutline} />
                      </IonButton>
                    </div>
                  </IonCol>
                </IonRow>
              ))}
            </IonGrid>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Wishlist; 