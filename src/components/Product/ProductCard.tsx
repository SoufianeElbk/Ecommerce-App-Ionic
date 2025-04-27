import React from 'react';
import { 
  IonCard, 
  IonCardContent, 
  IonIcon, 
  IonText, 
  IonButton,
  IonBadge
} from '@ionic/react';
import { heart, heartOutline, cartOutline, star } from 'ionicons/icons';
import { Product } from '../../utils/productUtils';
import { formatPrice, calculateDiscountPercentage } from '../../utils/productUtils';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onProductClick?: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const isWishlisted = isInWishlist(product.id);
  
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id, 1);
  };
  
  const handleProductClick = () => {
    if (onProductClick) {
      onProductClick(product.id);
    }
  };
  
  const hasDiscount = product.discountPrice !== null;
  const discountPercentage = hasDiscount ? calculateDiscountPercentage(product.price, product.discountPrice!) : 0;
  
  return (
    <IonCard className="product-card" onClick={handleProductClick}>
      <div className="product-image-container">
        <img src={product.images[0]} alt={product.name} className="product-image" />
        
        {hasDiscount && (
          <IonBadge color="danger" className="discount-badge">
            -{discountPercentage}%
          </IonBadge>
        )}
        
        <IonButton 
          fill="clear" 
          className="wishlist-button"
          onClick={handleToggleWishlist}
        >
          <IonIcon 
            icon={isWishlisted ? heart : heartOutline} 
            color={isWishlisted ? "danger" : "medium"} 
          />
        </IonButton>
      </div>
      
      <IonCardContent className="product-content">
        <div className="product-info">
          <IonText className="product-name">{product.name}</IonText>
          
          <div className="product-rating">
            <IonIcon icon={star} color="warning" />
            <IonText color="medium">{product.rating} ({product.reviews})</IonText>
          </div>
          
          <div className="product-price">
            {hasDiscount && (
              <IonText color="medium" className="original-price">
                {formatPrice(product.price)}
              </IonText>
            )}
            <IonText color="dark" className="current-price">
              {formatPrice(hasDiscount ? product.discountPrice! : product.price)}
            </IonText>
          </div>
        </div>
        
        <IonButton 
          fill="solid" 
          className="add-to-cart-button"
          onClick={handleAddToCart}
        >
          <IonIcon icon={cartOutline} slot="icon-only" />
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default ProductCard;