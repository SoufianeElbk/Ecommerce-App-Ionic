import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonSearchbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonSelect,
  IonSelectOption,
  IonPopover,
  useIonRouter,
  useIonViewWillEnter
} from '@ionic/react';
import { funnel, list, grid, options, arrowDown } from 'ionicons/icons';
import { useParams } from 'react-router';
import { 
  getAllProducts, 
  getProductsByCategory,
  getAllCategories,
  getCategoryById,
  searchProducts,
  filterProducts,
  Product,
  FilterOptions
} from '../../utils/productUtils';
import ProductCard from '../../components/Product/ProductCard';
import './ProductList.css';

interface RouteParams {
  categoryId?: string;
}

const ProductList: React.FC = () => {
  const router = useIonRouter();
  const { categoryId } = useParams<RouteParams>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minPrice: undefined,
    maxPrice: undefined,
    categoryIds: categoryId ? [parseInt(categoryId)] : undefined,
    inStockOnly: false
  });

  const categories = getAllCategories();

  useIonViewWillEnter(() => {
    if (categoryId) {
      const category = getCategoryById(parseInt(categoryId));
      if (category) {
        setSelectedCategoryName(category.name);
        setProducts(getProductsByCategory(parseInt(categoryId)));
      }
    } else {
      setSelectedCategoryName('All Products');
      setProducts(getAllProducts());
    }
  });

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredProducts(searchProducts(searchQuery));
    } else {
      let results = products;
      
      // Apply filters
      results = filterProducts(results, filterOptions);
      
      // Apply sorting
      results = [...results].sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return (a.discountPrice || a.price) - (b.discountPrice || b.price);
          case 'price-high':
            return (b.discountPrice || b.price) - (a.discountPrice || a.price);
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return b.id - a.id;
          case 'popularity':
          default:
            return b.reviews - a.reviews;
        }
      });
      
      setFilteredProducts(results);
    }
  }, [products, searchQuery, sortBy, filterOptions]);

  const handleSearchChange = (e: CustomEvent) => {
    setSearchQuery(e.detail.value);
  };

  const handleProductClick = (productId: number) => {
    router.push(`/main/products/${productId}`);
  };

  const handleCategoryClick = (catId: number | null) => {
    if (catId === null) {
      if (categoryId) {
        router.push('/main/products');
      }
      return;
    }
    
    router.push(`/main/products/category/${catId}`);
  };

  const handleFilterChange = (newOptions: Partial<FilterOptions>) => {
    setFilterOptions({
      ...filterOptions,
      ...newOptions
    });
  };

  const handleClearFilters = () => {
    setFilterOptions({
      minPrice: undefined,
      maxPrice: undefined,
      categoryIds: categoryId ? [parseInt(categoryId)] : undefined,
      inStockOnly: false
    });
    setShowFilterPopover(false);
  };

  const renderPriceRanges = () => {
    const ranges = [
      { label: 'Any Price', min: undefined, max: undefined },
      { label: 'Under $50', min: undefined, max: 50 },
      { label: '$50 - $100', min: 50, max: 100 },
      { label: '$100 - $200', min: 100, max: 200 },
      { label: '$200 - $500', min: 200, max: 500 },
      { label: '$500+', min: 500, max: undefined }
    ];
    
    return ranges.map((range, index) => (
      <IonChip 
        key={index}
        color={filterOptions.minPrice === range.min && filterOptions.maxPrice === range.max ? 'primary' : 'medium'}
        outline={!(filterOptions.minPrice === range.min && filterOptions.maxPrice === range.max)}
        onClick={() => handleFilterChange({ minPrice: range.min, maxPrice: range.max })}
      >
        <IonLabel>{range.label}</IonLabel>
      </IonChip>
    ));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {categoryId && (
            <IonButtons slot="start">
              <IonBackButton defaultHref="/main/home" />
            </IonButtons>
          )}
          <IonTitle>{selectedCategoryName}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowFilterPopover(true)}>
              <IonIcon slot="icon-only" icon={funnel} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <div className="search-container">
          <IonSearchbar
            placeholder="Search products"
            value={searchQuery}
            onIonChange={handleSearchChange}
            className="product-searchbar"
          />
        </div>
      </IonHeader>
      
      <IonContent>
        <div className="product-list-container">
          {/* Category Pills */}
          <div className="category-chips">
            <IonChip 
              color={!categoryId ? 'primary' : 'medium'}
              outline={!!categoryId}
              onClick={() => handleCategoryClick(null)}
            >
              <IonLabel>All</IonLabel>
            </IonChip>
            {categories.map(category => (
              <IonChip 
                key={category.id}
                color={categoryId === category.id.toString() ? 'primary' : 'medium'}
                outline={categoryId !== category.id.toString()}
                onClick={() => handleCategoryClick(category.id)}
              >
                <IonIcon icon={category.icon} />
                <IonLabel>{category.name}</IonLabel>
              </IonChip>
            ))}
          </div>
          
          {/* View Mode and Sort */}
          <div className="view-controls">
            <div className="view-mode-buttons">
              <IonButton 
                fill={viewMode === 'grid' ? 'solid' : 'clear'} 
                size="small"
                onClick={() => setViewMode('grid')}
              >
                <IonIcon slot="icon-only" icon={grid} />
              </IonButton>
              <IonButton 
                fill={viewMode === 'list' ? 'solid' : 'clear'} 
                size="small"
                onClick={() => setViewMode('list')}
              >
                <IonIcon slot="icon-only" icon={list} />
              </IonButton>
            </div>
            
            <div className="sort-select">
              <IonSelect 
                interface="popover" 
                value={sortBy}
                onIonChange={e => setSortBy(e.detail.value)}
              >
                <IonSelectOption value="popularity">Popularity</IonSelectOption>
                <IonSelectOption value="price-low">Price: Low to High</IonSelectOption>
                <IonSelectOption value="price-high">Price: High to Low</IonSelectOption>
                <IonSelectOption value="rating">Rating</IonSelectOption>
                <IonSelectOption value="newest">Newest</IonSelectOption>
              </IonSelect>
            </div>
          </div>
          
          {/* Result Count */}
          <div className="result-count">
            <IonText color="medium">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </IonText>
          </div>
          
          {/* Product Grid/List */}
          <IonGrid className={`product-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
            <IonRow>
              {filteredProducts.map(product => (
                <IonCol 
                  size={viewMode === 'grid' ? '6' : '12'} 
                  key={product.id}
                  className="product-column"
                >
                  <ProductCard 
                    product={product} 
                    onProductClick={handleProductClick}
                  />
                </IonCol>
              ))}
            </IonRow>
            
            {filteredProducts.length === 0 && (
              <div className="no-results">
                <IonText color="medium">
                  No products found. Try adjusting your filters or search query.
                </IonText>
              </div>
            )}
          </IonGrid>
        </div>
      </IonContent>
      
      {/* Filter Popover */}
      <IonPopover
        isOpen={showFilterPopover}
        onDidDismiss={() => setShowFilterPopover(false)}
        className="filter-popover"
      >
        <div className="filter-content">
          <div className="filter-header">
            <IonText className="filter-title">Filter Products</IonText>
            <IonButton 
              fill="clear" 
              size="small" 
              onClick={handleClearFilters}
            >
              Clear All
            </IonButton>
          </div>
          
          <div className="filter-section">
            <IonText className="section-title">Price Range</IonText>
            <div className="price-ranges">
              {renderPriceRanges()}
            </div>
          </div>
          
          <div className="filter-section">
            <IonText className="section-title">Stock Status</IonText>
            <IonChip 
              color={filterOptions.inStockOnly ? 'primary' : 'medium'}
              outline={!filterOptions.inStockOnly}
              onClick={() => handleFilterChange({ inStockOnly: !filterOptions.inStockOnly })}
            >
              <IonLabel>In Stock Only</IonLabel>
            </IonChip>
          </div>
          
          <IonButton 
            expand="block" 
            onClick={() => setShowFilterPopover(false)}
            className="apply-filters-btn"
          >
            Apply Filters
          </IonButton>
        </div>
      </IonPopover>
    </IonPage>
  );
};

export default ProductList; 