import React from 'react';
import { 
  IonPage, 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonSearchbar,
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
import { Swiper, SwiperSlide } from 'swiper/react';
import { arrowForward, home, watch, headset, camera, batteryCharging, laptop, gameController, phonePortrait } from 'ionicons/icons';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import { getAllProducts, getFeaturedProducts, getAllCategories, Category, Product } from '../../utils/productUtils';
import ProductCard from '../../components/Product/ProductCard';
import './Home.css';

const Home: React.FC = () => {
  const router = useIonRouter();
  const featuredProducts = getFeaturedProducts().slice(0, 5);
  const trendingProducts = getAllProducts().filter(p => p.trending).slice(0, 8);
  const categories = getAllCategories();
  
  const handleProductClick = (productId: number) => {
    router.push(`/main/products/${productId}`);
  };
  
  const handleCategoryClick = (categoryId: number) => {
    router.push(`/main/products/category/${categoryId}`);
  };
  
  const handleSearchFocus = () => {
    router.push('/main/products');
  };
  
  const handleSeeAll = (type: string) => {
    router.push(`/main/products`);
  };
  
  const renderCategoryItem = (category: Category) => (
    <div className="category-item" key={category.id} onClick={() => handleCategoryClick(category.id)}>
      <div className="category-icon">
        <IonIcon icon={getCategoryIcon(category.name)} />
      </div>
      <IonText className="category-name">{category.name}</IonText>
    </div>
  );
  
  const renderFeaturedSlide = (product: Product) => (
    <SwiperSlide key={product.id}>
      <IonCard className="featured-card" onClick={() => handleProductClick(product.id)}>
        <div className="featured-image-container">
          <img src={product.images[0]} alt={product.name} className="featured-image" />
          <div className="featured-overlay">
            <IonText className="featured-name">{product.name}</IonText>
            <IonButton fill="clear" className="featured-button">
              View Details <IonIcon slot="end" icon={arrowForward} />
            </IonButton>
          </div>
        </div>
      </IonCard>
    </SwiperSlide>
  );
  
  const getCategoryIcon = (name: string) => {
    switch(name.toLowerCase()) {
      case 'audio':
        return headset;
      case 'wearables':
        return watch;
      case 'smart home':
        return home;
      case 'photography':
        return camera;
      case 'accessories':
        return batteryCharging;
      case 'computers':
        return laptop;
      case 'gaming':
        return gameController;
      case 'phones':
        return phonePortrait;
      default:
        return home;
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle className="home-title">Discover</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <div className="search-container">
          <IonSearchbar 
            className="custom-searchbar" 
            placeholder="Search for products..." 
            onIonFocus={handleSearchFocus}
          />
        </div>
        
        <div className="home-container">
          <div className="section">
            <div className="section-header">
              <IonText className="section-title">Featured Products</IonText>
              <IonButton 
                fill="clear" 
                className="see-all-btn"
                onClick={() => handleSeeAll('featured')}
              >
                See All <IonIcon icon={arrowForward} />
              </IonButton>
            </div>
            
            <Swiper
              slidesPerView={1.2}
              spaceBetween={10}
              centeredSlides={false}
              pagination={{ clickable: true }}
              className="featured-slider"
            >
              {featuredProducts.map(renderFeaturedSlide)}
            </Swiper>
          </div>
          
          <div className="section">
            <div className="section-header">
              <IonText className="section-title">Categories</IonText>
            </div>
            
            <div className="categories-scroll">
              {categories.map(renderCategoryItem)}
            </div>
          </div>
          
          <div className="section special-offers">
            <IonCard className="offer-card">
              <div className="offer-content">
                <IonText className="offer-title" color="light">Summer Sale</IonText>
                <IonText className="offer-subtitle" color="light">Up to 50% off</IonText>
                <IonButton className="offer-button">Shop Now</IonButton>
              </div>
            </IonCard>
          </div>
          
          <div className="section">
            <div className="section-header">
              <IonText className="section-title">Trending Products</IonText>
              <IonButton 
                fill="clear" 
                className="see-all-btn"
                onClick={() => handleSeeAll('trending')}
              >
                See All <IonIcon icon={arrowForward} />
              </IonButton>
            </div>
            
            <IonGrid>
              <IonRow>
                {trendingProducts.map(product => (
                  <IonCol size="6" key={product.id}>
                    <ProductCard 
                      product={product}
                      onProductClick={handleProductClick}
                    />
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home; 