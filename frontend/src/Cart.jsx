import "./Cart.css";

function Cart({
  cart,
  setCart,
  customer,
  cartOpen,
  setCartOpen,
}) {

  // Calculate total using quantity
  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * (item.quantity || 1),
    0
  );

  // Increase quantity
  const increaseQuantity = (index) => {
    setCart((currentCart) =>
      currentCart.map((item, cartIndex) =>
        cartIndex === index
          ? {
              ...item,
              quantity: (item.quantity || 1) + 1,
            }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (index) => {
    setCart((currentCart) =>
      currentCart
        .map((item, cartIndex) =>
          cartIndex === index
            ? {
                ...item,
                quantity: (item.quantity || 1) - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove item
  const removeItem = (index) => {
    setCart((currentCart) =>
      currentCart.filter(
        (_, cartIndex) => cartIndex !== index
      )
    );
  };

  const checkout = () => {

    if (!customer) {
      alert("Please save customer details first.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    fetch(
      "http://localhost:8081/api/orders",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          totalAmount: total,
          status: "PENDING",
          customer: customer,
        }),
      }
    )
      .then((response) => {

        if (!response.ok) {
          throw new Error(
            "Order creation failed"
          );
        }

        return response.json();
      })

      .then((order) => {

        alert(
          `Order created successfully! Order ID: ${order.id}`
        );

        setCart([]);
        setCartOpen(false);
      })

      .catch((error) => {

        console.error(
          "Order error:",
          error
        );

        alert(
          "Order creation failed."
        );
      });
  };

  return (
    <aside
      className={`cart-drawer ${
        cartOpen
          ? "cart-drawer-open"
          : ""
      }`}
    >

      {/* ================= HEADER ================= */}

      <div className="cart-drawer-header">

        <div className="cart-heading">

          <div className="cart-heading-icon">
            🛒
          </div>

          <div>
            <h2>
              Shopping Cart
            </h2>

            <p>
              Review your items
            </p>
          </div>

        </div>

        <div className="cart-header-right">

          <span className="cart-count">
            {cart.reduce(
              (sum, item) =>
                sum + (item.quantity || 1),
              0
            )} item(s)
          </span>

          <button
            className="close-cart"
            onClick={() =>
              setCartOpen(false)
            }
            title="Close Cart"
          >
            ×
          </button>

        </div>

      </div>


      {/* ================= CART CONTENT ================= */}

      <div className="cart-content">

        {cart.length === 0 ? (

          <div className="empty-cart">

            <div className="empty-cart-icon">
              🛒
            </div>

            <h3>
              Your cart is empty
            </h3>

            <p>
              Add a product to get started.
            </p>

          </div>

        ) : (

          <>

            {/* CART ITEMS */}

            <div className="cart-items">

              {cart.map(
                (item, index) => (

                  <div
                    className="cart-item"
                    key={`${item.id}-${index}`}
                  >

                    <img
                      src={`/images/${item.imageUrl}`}
                      alt={item.name}
                    />

                    <div className="cart-item-info">

                      <h3>
                        {item.name}
                      </h3>

                      <strong>
                        ₹{item.price}
                      </strong>

                      {/* QUANTITY */}

                      <div className="quantity-control">

                        <button
                          onClick={() =>
                            decreaseQuantity(index)
                          }
                        >
                          −
                        </button>

                        <span>
                          {item.quantity || 1}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(index)
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>

                    <button
                      className="remove-button"
                      onClick={() =>
                        removeItem(index)
                      }
                      title="Remove"
                    >
                      🗑️
                    </button>

                  </div>

                )
              )}

            </div>


            {/* TOTAL */}

            <div className="cart-total">

              <span>
                Total
              </span>

              <strong>
                ₹{total}
              </strong>

            </div>


            {/* CHECKOUT */}

            <button
              className="checkout-button"
              onClick={checkout}
              disabled={
                !customer ||
                cart.length === 0
              }
            >
              💳 Checkout
            </button>

            {!customer && (
              <p className="checkout-warning">
                Save customer details before checkout.
              </p>
            )}


            {/* SECURITY */}

            <div className="secure-checkout">

              <div className="secure-icon">
                🔒
              </div>

              <div>

                <strong>
                  Secure Checkout
                </strong>

                <p>
                  Your information is handled
                  securely.
                </p>

              </div>

            </div>

          </>

        )}

      </div>

    </aside>
  );
}

export default Cart;