import React, { useState } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonBackButton,
  IonButton,
  IonIcon,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonChip,
  IonSpinner,
  IonToast,
  useIonRouter,
  useIonViewWillEnter,
  IonLoading
} from '@ionic/react';
import { 
  heartOutline, 
  heart, 
  shareOutline, 
  cartOutline, 
  star, 
  add, 
  remove 
} from 'ionicons/icons';
import { useParams } from 'react-router';
import { 
  getProductById,
  getRelatedProducts,
  formatPrice,
  calculateDiscountPercentage,
  Product
} from '../../utils/productUtils';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import ProductCard from '../../components/Product/ProductCard';
import './ProductDetail.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

interface RouteParams {
  id: string;
}

const ProductDetail: React.FC = () => {
  const router = useIonRouter();
  const { id } = useParams<RouteParams>();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  useIonViewWillEnter(() => {
    const productId = parseInt(id);
    const fetchedProduct = getProductById(productId);
    
    if (fetchedProduct) {
      setProduct(fetchedProduct);
      setSelectedColor(fetchedProduct.colors[0]);
      setRelatedProducts(getRelatedProducts(productId));
    }
  });
  
  if (!product) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div className="loading-container">
            <IonSpinner name="crescent" />
            <IonText color="medium">Loading product...</IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }
  
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };
  
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedColor);
    setToastMessage(`${product.name} added to cart`);
    setShowToast(true);
  };
  
  const handleBuyNow = () => {
    addToCart(product.id, quantity, selectedColor);
    router.push('/main/cart');
  };
  
  const handleToggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      setToastMessage('Removed from wishlist');
    } else {
      addToWishlist(product.id);
      setToastMessage('Added to wishlist');
    }
    setShowToast(true);
  };
  
  const handleProductClick = (productId: number) => {
    router.push(`/main/products/${productId}`);
  };
  
  const isWishlisted = isInWishlist(product.id);
  const hasDiscount = product.discountPrice !== null;
  const discountPercentage = hasDiscount ? calculateDiscountPercentage(product.price, product.discountPrice!) : 0;
  
  const slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  
  const relatedOpts = {
    slidesPerView: 2.2,
    spaceBetween: 10,
    freeMode: true
  };
  
  return (
    <IonPage>
      <IonHeader className="ion-no-border product-detail-header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/main/home" />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={handleToggleWishlist}>
              <IonIcon 
                slot="icon-only" 
                icon={isWishlisted ? heart : heartOutline} 
                color={isWishlisted ? "danger" : "dark"} 
              />
            </IonButton>
            <IonButton>
              <IonIcon slot="icon-only" icon={shareOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <div className="product-detail-container">
          {/* Product Image Slider */}
          <div className="product-image-slider">
            <Swiper
              pagination={{ clickable: true }}
              className="product-detail-swiper"
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="product-detail-image-container">
                    <img src={image} alt={`${product.name} - Image ${index + 1}`} className="product-detail-image" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {hasDiscount && (
              <IonBadge color="danger" className="discount-badge">
                -{discountPercentage}%
              </IonBadge>
            )}
          </div>
          
          {/* Product Info */}
          <div className="product-info-container">
            <IonText className="product-name">
              {product.name}
            </IonText>
            
            <div className="rating-container">
              <div className="rating">
                <IonIcon icon={star} color="warning" />
                <IonText>{product.rating}</IonText>
              </div>
              <IonText color="medium">({product.reviews} reviews)</IonText>
            </div>
            
            <div className="price-container">
              {hasDiscount && (
                <IonText color="medium" className="original-price">
                  {formatPrice(product.price)}
                </IonText>
              )}
              <IonText color="dark" className="current-price">
                {formatPrice(hasDiscount ? product.discountPrice! : product.price)}
              </IonText>
            </div>
            
            {/* Colors */}
            <div className="colors-container">
              <IonText color="medium" className="section-label">Colors</IonText>
              <div className="color-options">
                {product.colors.map((color) => (
                  <div 
                    key={color}
                    className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                  />
                ))}
              </div>
            </div>
            
            {/* Quantity */}
            <div className="quantity-container">
              <IonText color="medium" className="section-label">Quantity</IonText>
              <div className="quantity-selector">
                <IonButton 
                  fill="clear" 
                  className="quantity-button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <IonIcon icon={remove} />
                </IonButton>
                <span className="quantity-value">{quantity}</span>
                <IonButton 
                  fill="clear" 
                  className="quantity-button"
                  onClick={increaseQuantity}
                >
                  <IonIcon icon={add} />
                </IonButton>
              </div>
            </div>
            
            {/* Description */}
            <div className="description-container">
              <IonText color="medium" className="section-label">Description</IonText>
              <IonText color="dark" className="description-text">
                {product.description}
              </IonText>
            </div>
            
            {/* Specifications */}
            <div className="specs-container">
              <IonText color="medium" className="section-label">Specifications</IonText>
              <IonGrid className="specs-grid">
                <IonRow>
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <IonCol size="6" key={index}>
                      <div className="spec-item">
                        <IonText color="medium" className="spec-label">{key}</IonText>
                        <IonText color="dark" className="spec-value">{String(value)}</IonText>
                      </div>
                    </IonCol>
                  ))}
                </IonRow>
              </IonGrid>
            </div>
            
            {/* Related Products */}
            <div className="section">
              <div className="section-header">
                <IonText className="section-title">Related Products</IonText>
              </div>
              
              <div className="related-products-container">
                <Swiper
                  slidesPerView={2.2}
                  spaceBetween={10}
                  className="related-products-slider"
                >
                  {relatedProducts.map(product => (
                    <SwiperSlide key={product.id}>
                      <ProductCard
                        product={product}
                        onProductClick={handleProductClick}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Action Buttons */}
        <div className="product-actions">
          <IonButton 
            expand="block" 
            fill="outline" 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            <IonIcon icon={cartOutline} slot="start" />
            Add to Cart
          </IonButton>
          <IonButton 
            expand="block" 
            className="buy-now-btn"
            onClick={handleBuyNow}
          >
            Buy Now
          </IonButton>
        </div>
        
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default ProductDetail; 