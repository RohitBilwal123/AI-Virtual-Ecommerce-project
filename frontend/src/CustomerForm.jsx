import { useState } from "react";
import "./CustomerForm.css";

function CustomerForm({ onCustomerCreated }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [saved, setSaved] = useState(false);

  const createCustomer = () => {

    if (!name || !email || !phone) {
      alert(
        "Please fill all customer details."
      );

      return;
    }

    // Name validation
    if (!/^[A-Za-z ]{2,50}$/.test(name.trim())) {
      alert("❌ Please enter a valid name. Use letters and spaces only.");
      return;
    }

      // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      alert("❌ Please enter a valid email address.");
      return;
    }

     // Phone validation
    if (!/^[0-9]{10}$/.test(phone.trim())) {
      alert("❌ Please enter a valid 10-digit phone number.");
      return;
    }

    fetch(
      "http://localhost:8081/api/customers",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          phone,
        }),
      }
    )
      .then((response) => {

        if (!response.ok) {
          throw new Error(
            "Customer creation failed"
          );
        }

        return response.json();
      })

      .then((customer) => {

        localStorage.setItem(
         "customer",
         JSON.stringify(customer)
       );

       alert(
         `Customer information saved! ID: ${customer.id}`
       );

       setSaved(true);

       onCustomerCreated(customer);
     })

      .catch((error) => {

        console.error(
          "Customer error:",
          error
        );

        alert(
          "Customer creation failed."
        );
      });
  };

  return (
    <section className="customer-card">

      <div className="customer-heading">

        <div className="customer-icon">
          👤
        </div>

        <div>
          <h2>
            Customer Details
          </h2>

          <p>
            Enter your information to place an order
          </p>
        </div>

      </div>

      <div className="customer-form">

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSaved(false);
          }}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setSaved(false);
          }}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setSaved(false);
          }}
        />

        <button onClick={createCustomer}>
          👤 Save Customer
        </button>

      </div>

      {saved && (
        <div className="customer-status">
          ✓ Customer information saved
        </div>
      )}

    </section>
  );
}

export default CustomerForm;