import { useState, useRef } from "react";
import "./VirtualTryOn.css";

function VirtualTryOn({ customer, products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tryingOn, setTryingOn] = useState(false);
  const [tryOnResult, setTryOnResult] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const startTryOn = async () => {
  if (!customer) {
    alert("Please save customer details first.");
    return;
  }

  if (!selectedProduct) {
    alert("Please select a product first.");
    return;
  }

  if (!userPhoto) {
    alert("Please upload your photo first.");
    return;
  }

  setTryingOn(true);
  setTryOnResult("");

  try {
    // 1. Upload user photo
    const formData = new FormData();
    formData.append("file", userPhoto);

    const uploadResponse = await fetch(
      "http://localhost:8081/api/upload/photo",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error("Photo upload failed");
    }

    const uploadResult = await uploadResponse.text();

    // Extract uploaded filename
    const uploadedFileName = uploadResult.split(": ")[1];

    // 2. Start Virtual Try-On
    const url =
      `http://localhost:8081/api/try-on` +
      `?userPhoto=${encodeURIComponent(uploadedFileName)}` +
      `&productImage=${encodeURIComponent(selectedProduct.imageUrl)}` +
      `&customerId=${customer.id}` +
      `&productId=${selectedProduct.id}`;

    const response = await fetch(url, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Virtual Try-On request failed");
    }

    const result = await response.text();

    setTryOnResult(result);

  } catch (error) {
    console.error("Try-On error:", error);
    setTryOnResult("Virtual Try-On processing failed.");
  } finally {
    setTryingOn(false);
  }
};

  return (
    <section className="virtual-tryon-card">
      <div className="tryon-heading">
        <div className="tryon-icon">✨</div>

        <div>
          <h2>AI Virtual Try-On</h2>
          <p>
            Visualize selected products using your personalized profile.
          </p>
        </div>
      </div>

      {!customer && (
        <div className="tryon-warning">
          Please save your customer details before starting Virtual Try-On.
        </div>
      )}
      <div className="tryon-content">

  <div className="tryon-user">
    <h3>Your Profile</h3>

    <div className="tryon-user-image">
      <img
        src={
          userPhoto
            ? URL.createObjectURL(userPhoto)
            : "/images/user-profile.jpg"
        }
        alt="User profile"
      />
    </div>

    <div className="photo-upload-buttons">

      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
      >
        📁 Upload Photo
      </button>

      <button
        type="button"
        onClick={() => cameraInputRef.current.click()}
      >
        📷 Use Camera
      </button>

    </div>

    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      onChange={(e) => {
        if (e.target.files[0]) {
          setUserPhoto(e.target.files[0]);
        }
      }}
    />

    <input
      ref={cameraInputRef}
      type="file"
      accept="image/*"
      capture="user"
      style={{ display: "none" }}
      onChange={(e) => {
        if (e.target.files[0]) {
          setUserPhoto(e.target.files[0]);
        }
      }}
    />

    {userPhoto && (
      <small>
        Selected: {userPhoto.name}
      </small>
    )}

    <p>{customer ? customer.name : "No customer selected"}</p>
  </div>

  <div className="tryon-product">
    <h3>Select Product</h3>

    <div className="tryon-products">
      {products.map((product) => (
        <button
          key={product.id}
          className={`tryon-product-option ${
            selectedProduct?.id === product.id ? "selected" : ""
          }`}
          onClick={() => setSelectedProduct(product)}
        >
          <img
            src={`/images/${product.imageUrl}`}
            alt={product.name}
          />

          <span>{product.name}</span>
          <small>₹{product.price}</small>
        </button>
      ))}
    </div>
  </div>

</div>

      

      <div className="tryon-action">
        <button
          className="start-tryon-button"
          onClick={startTryOn}
          disabled={!customer || !selectedProduct || tryingOn}
        >
          {tryingOn
            ? "✨ Processing..."
            : "✨ Start Virtual Try-On"}
        </button>
      </div>

      <div className="tryon-result">
        <div className="tryon-result-icon">🧍✨</div>

        <h3>Virtual Try-On Result</h3>

        {tryingOn ? (
          <p>Processing your request...</p>
        ) : tryOnResult ? (
          <p>{tryOnResult}</p>
        ) : (
          <p>
            Your AI-generated try-on visualization will appear here.
          </p>
        )}
      </div>
    </section>
  );
}

export default VirtualTryOn;