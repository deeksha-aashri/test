import React from 'react';


const ShippingPolicy = () => {
  return (
    <div className="shipping-container">
      <div className="shipping-content">
        <h1>Shipping Policy</h1>
        <p>
          At BookYourBook, we are committed to delivering your orders accurately, in good condition, and on time. Please review our shipping policy to understand how we handle shipping and delivery.
        </p>

        <h2>Shipping Locations</h2>
        <p>
          We currently ship to addresses within [Country Name]. Unfortunately, we do not offer international shipping at this time.
        </p>

        <h2>Shipping Methods and Delivery Times</h2>
        <p>
          We offer the following shipping options:
        </p>
        <ul>
          <li><strong>Standard Shipping:</strong> Delivery within 5-7 business days.</li>
          <li><strong>Express Shipping:</strong> Delivery within 2-3 business days.</li>
        </ul>
        <p>
          Please note that delivery times are estimates and may vary depending on external factors such as holidays or weather conditions.
        </p>

        <h2>Order Processing Time</h2>
        <p>
          Orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation. You will receive a notification once your order has shipped.
        </p>

        <h2>Shipping Costs</h2>
        <p>
          Shipping charges for your order will be calculated and displayed at checkout. We offer free standard shipping on orders over [Amount].
        </p>

        <h2>Tracking Your Order</h2>
        <p>
          Once your order has shipped, you will receive an email with the tracking information. You can use this information to track the status of your order on the shipping carrier’s website.
        </p>

        <h2>Undelivered Packages</h2>
        <p>
          If a package is returned to us due to an incorrect or incomplete address, we will contact you to arrange reshipment. Additional shipping charges may apply.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about our shipping policy, please contact us at support@bookyourbook.com.
        </p>
      </div>
    </div>
  );
};

export default ShippingPolicy;
