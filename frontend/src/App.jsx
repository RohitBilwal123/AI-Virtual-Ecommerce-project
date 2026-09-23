import { useEffect, useState } from "react";
import "./App.css";
import Cart from "./Cart";
import CustomerForm from "./CustomerForm";
import BodyProfile from "./BodyProfile";
import VirtualTryOn from "./VirtualTryOn";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(() => {
   const savedCustomer = localStorage.getItem("customer");
   return savedCustomer ? JSON.parse(savedCustomer) : null;
  });
  const [cartOpen, setCartOpen] = useState(false);

  // Get products from Spring Boot
  useEffect(() => {
    fetch("http://localhost:8081/api/products")
      .then((response) => response.json())
      .then((data) => {
       const uniqueProducts = data.filter(
        (product, index, self) =>
          index === self.findIndex((p) => p.id === product.id)
      );

      setProducts(uniqueProducts);
    })
     .catch((error) => {
      console.error("Product error:", error);
    });
 }, []);
 

  // Add product to cart
  const addToCart = (product) => {
    setCart((currentCart) => [
      ...currentCart,
      product,
    ]);

    // Automatically open cart
    setCartOpen(true);
  };

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        <div className="brand">

          <div className="brand-icon">
            🛍️
          </div>

          <div>
            <h1>
              AI Virtual <span>E-Commerce</span>
            </h1>

            <p>
              Smart shopping with AI-powered fit recommendations
            </p>
          </div>

        </div>


        {/* NAVIGATION */}

        <nav>

          <a
            className="active"
            href="#home"
          >
            🏠 Home
          </a>

          <a href="#products">
            ▦ Products
          </a>

          <a href="#tryon">
            ✨ Try-On
          </a>

          <a href="#about">
            ⓘ About
          </a>


          {/* CART BUTTON */}

          <button
            className="navbar-cart"
            onClick={() => setCartOpen(true)}
            title="View Cart"
          >

            🛒

            {cart.length > 0 && (
              <span className="navbar-cart-count">
                {cart.length}
              </span>
            )}

          </button>

        </nav>

      </header>


      {/* ================= MAIN ================= */}

      <main id="home">

        {/* CUSTOMER */}

        <CustomerForm
          onCustomerCreated={setCustomer}
        />
        <BodyProfile customer={customer} />
        <VirtualTryOn
          customer={customer}
          products={products}
        />


        {/* ================= PRODUCTS ================= */}

        <section
          className="products-wrapper"
          id="products"
        >

          <div className="products-section">

            {/* SECTION TITLE */}

            <div className="section-title">

              <div className="section-icon">
                ▦
              </div>

              <div>
                <h2>
                  Featured Products
                </h2>

                <p>
                  Discover our latest collection
                </p>
              </div>

            </div>


            {/* PRODUCTS */}

            {products.length === 0 ? (

              <div className="loading">
                Loading products...
              </div>

            ) : (

              <div className="product-list">

                {products.map((product) => (

                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />

                ))}

              </div>

            )}

          </div>

        </section>


        {/* ================= AI TRY ON ================= */}
         <BodyProfile customer={customer} />

         <VirtualTryOn
           customer={customer}
           products={products}
         />   
        


        {/* ================= FEATURES ================= */}

        <section className="features">

          <div className="feature">

            <span>🚚</span>

            <div>
              <h3>
                Free Shipping
              </h3>

              <p>
                On orders above ₹999
              </p>
            </div>

          </div>


          <div className="feature">

            <span>🛡️</span>

            <div>
              <h3>
                Secure Payment
              </h3>

              <p>
                Safe and secure transactions
              </p>
            </div>

          </div>


          <div className="feature">

            <span>🤖</span>

            <div>
              <h3>
                AI Recommendations
              </h3>

              <p>
                Personalized fit suggestions
              </p>
            </div>

          </div>

        </section>

      </main>


      {/* ================= CART BACKGROUND ================= */}

      {cartOpen && (
        <div
          className="cart-overlay"
          onClick={() => setCartOpen(false)}
        />
      )}


      {/* ================= CART ================= */}

      <Cart
        cart={cart}
        setCart={setCart}
        customer={customer}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
      />


      {/* ================= FOOTER ================= */}

      <footer id="about">

        <h3>
          AI Virtual E-Commerce
        </h3>

        <p>
          Smart shopping powered by AI technology.
        </p>

      </footer>

    </div>
  );
}


/* ================================================= */
/* PRODUCT CARD                                      */
/* ================================================= */

function ProductCard({
  product,
  onAddToCart,
}) {

  /*
   * Product can have:
   *
   * imageUrl:
   * "tshirt.jpg"
   *
   * OR:
   *
   * imageUrls:
   * [
   *   "tshirt.jpg",
   *   "tshirt-2.jpg",
   *   "tshirt-3.jpg"
   * ]
   */


  // Create image list
  const getImages = () => {

    // If multiple images exist
    if (
      Array.isArray(product.imageUrls) &&
      product.imageUrls.length > 0
    ) {

      // Maximum 9 images
      return product.imageUrls.slice(0, 9);
    }

    // Otherwise use single image
    if (product.imageUrl) {
      return [product.imageUrl];
    }

    // No image
    return [];
  };


  const [images, setImages] = useState(
    getImages()
  );

  const [currentImage, setCurrentImage] =
    useState(0);

  const [wishlist, setWishlist] =
    useState(false);


  /*
   * When product changes,
   * reset images.
   */

  useEffect(() => {

    setImages(getImages());

    setCurrentImage(0);

  }, [product]);


  /*
   * If current image disappears,
   * go back to first image.
   */

  useEffect(() => {

    if (
      currentImage >= images.length
    ) {
      setCurrentImage(0);
    }

  }, [
    images,
    currentImage,
  ]);


  /*
   * Image failed to load.
   *
   * Instead of showing an error,
   * remove that image.
   */

  const handleImageError = (
    failedImage
  ) => {

    setImages((currentImages) =>
      currentImages.filter(
        (image) =>
          image !== failedImage
      )
    );

  };


  const hasMultipleImages =
    images.length > 1;


  // Next image
  const nextImage = () => {

    if (!hasMultipleImages) {
      return;
    }

    setCurrentImage(
      (currentImage + 1) %
        images.length
    );

  };


  // Previous image
  const previousImage = () => {

    if (!hasMultipleImages) {
      return;
    }

    setCurrentImage(
      (
        currentImage -
        1 +
        images.length
      ) %
        images.length
    );

  };


  return (

    <div className="product-card">


      {/* ================================================= */}
      {/* IMAGE SECTION                                    */}
      {/* ================================================= */}

      <div className="product-image-section">

        {/* NEW BADGE */}

        <div className="new-badge">
          New Arrival
        </div>


        {/* CATEGORY BADGE */}

        <div className="category-badge">
          🏷️ {product.category}
        </div>


        {/* MAIN IMAGE */}

        <div className="main-image-wrapper">

          {images.length > 0 ? (

            <img
              src={`/images/${images[currentImage]}`}
              alt={product.name}
              className="product-main-image"

              /*
               * If image doesn't exist,
               * remove it automatically.
               */

              onError={() =>
                handleImageError(
                  images[currentImage]
                )
              }
            />

          ) : (

            /* No image available */

            <div className="no-image">
              🖼️
              <span>
                Image not available
              </span>
            </div>

          )}


          {/* IMAGE ARROWS */}

          {hasMultipleImages && (
            <>

              <button
                className="image-arrow image-arrow-left"
                onClick={previousImage}
              >
                ‹
              </button>


              <button
                className="image-arrow image-arrow-right"
                onClick={nextImage}
              >
                ›
              </button>


              {/* COUNTER */}

              <div className="image-counter">

                {currentImage + 1}
                {" / "}
                {images.length}

              </div>

            </>
          )}

        </div>


        {/* ================================================= */}
        {/* THUMBNAILS                                        */}
        {/* ================================================= */}

        {hasMultipleImages && (

          <div className="image-thumbnails">

            {images.map(
              (image, index) => (

                <button
                  key={image}
                  className={`thumbnail ${
                    currentImage === index
                      ? "active-thumbnail"
                      : ""
                  }`}
                  onClick={() =>
                    setCurrentImage(index)
                  }
                >

                  <img
                    src={`/images/${image}`}
                    alt={`${product.name} ${
                      index + 1
                    }`}

                    onError={() =>
                      handleImageError(
                        image
                      )
                    }
                  />

                </button>

              )
            )}

          </div>

        )}

      </div>


      {/* ================================================= */}
      {/* PRODUCT INFORMATION                              */}
      {/* ================================================= */}

      <div className="product-info">


        {/* CATEGORY */}

        <div className="product-category">
          🏷️ {product.category}
        </div>


        {/* PRODUCT NAME */}

        <h2>
          {product.name}
        </h2>


        {/* DESCRIPTION */}

        <p className="product-description">

          {product.description}

        </p>


        {/* ================================================= */}
        {/* DETAILS                                           */}
        {/* ================================================= */}

        <div className="product-details">


          {/* CATEGORY */}

          <div>

            <span>🎁</span>

            <small>
              Category
            </small>

            <strong>
              {product.category}
            </strong>

          </div>


          {/* SIZE */}

          <div>

            <span>👕</span>

            <small>
              Size
            </small>

            <strong>
              {product.size}
            </strong>

          </div>


          {/* PRICE */}

          <div>

            <span>🏷️</span>

            <small>
              Price
            </small>

            <strong>
              ₹{product.price}
            </strong>

          </div>

        </div>


        {/* ================================================= */}
        {/* FEATURES                                          */}
        {/* ================================================= */}

        <div className="product-features">

          <p>
            ✓ Premium quality material
          </p>

          <p>
            ✓ Comfortable fit
          </p>

          <p>
            ✓ Modern and stylish
          </p>

          <p>
            ✓ Perfect for casual wear
          </p>

        </div>


        {/* ================================================= */}
        {/* ACTION BUTTONS                                    */}
        {/* ================================================= */}

        <div className="product-actions">


          {/* ADD CART */}

          <button
            className="add-cart-button"
            onClick={() =>
              onAddToCart(product)
            }
          >
            🛒 Add to Cart
          </button>


          {/* WISHLIST */}

          <button
            className={`wishlist-button ${
              wishlist
                ? "wishlist-active"
                : ""
            }`}
            onClick={() =>
              setWishlist(!wishlist)
            }
            title="Add to Wishlist"
          >

            {wishlist
              ? "♥"
              : "♡"}

          </button>

        </div>

      </div>

    </div>
  );
}


export default App;