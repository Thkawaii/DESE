import React, { useState,useEffect } from "react";
import "./payment.css";
import { Outlet, useNavigate } from "react-router-dom";
import TrueMoneyQR from '../../assets/2.png';
import PromptPayQR from '../../assets/3.png';
import AlipayQR from '../../assets/4.png';
import LinePayQR from '../../assets/5.png';




const Payment: React.FC = () => {
  const [method, setMethod] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const qrCodeImages: { [key: string]: string } = {
    truemoney: TrueMoneyQR,
    promptpay: PromptPayQR,
    alipay: AlipayQR,
    linepay: LinePayQR,
  };
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [wallet, setWallet] = useState<string | null>(null);
  const [error, setError] = useState("");
  //const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setWallet(null);
    setCardDetails({
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    });
    setErrors({});
    setError("");
  }, [method])

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const numericValue = value.replace(/\D/g, "");
      const formattedValue =
        numericValue.match(/.{1,4}/g)?.join("-").substr(0, 19) || "";
      setCardDetails((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setCardDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCardInput1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "cardholderName") {
      const alphabeticValue = value.replace(/[^a-zA-Z\s]/g, ""); // Allow only letters and spaces
      setCardDetails((prev) => ({ ...prev, [name]: alphabeticValue }));
    } else if (name === "cardNumber") {
      const numericValue = value.replace(/\D/g, "");
      const formattedValue =
        numericValue.match(/.{1,4}/g)?.join("-").substr(0, 19) || "";
      setCardDetails((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setCardDetails((prev) => ({ ...prev, [name]: value }));
    }
  };
  

  const validateForm = () => {
    const validationErrors: { [key: string]: string } = {};

    const cardNumberRegex = /^(\d{4}-){3}\d{4}$/;
    if (!cardNumberRegex.test(cardDetails.cardNumber)) {
      validationErrors.cardNumber = "Card Number must be in XXXX-XXXX-XXXX-XXXX format.";
    }

    if (!cardDetails.cardholderName.trim().includes(" ")) {
      validationErrors.cardholderName = "Please enter a valid first and last name.";
    }
    if (!cardDetails.expiryDate) {
        validationErrors.expiryDate = "Please select an expiry date.";
      }

    if (!cardDetails.expiryMonth) {
      validationErrors.expiryMonth = "Please select an expiry month.";
    }

    if (!cardDetails.expiryYear) {
      validationErrors.expiryYear = "Please select an expiry year.";
    }

    const cvvRegex = /^\d{3}$/;
    if (!cvvRegex.test(cardDetails.cvv)) {
      validationErrors.cvv = "CVV must be exactly 3 numeric digits.";
    }
    if (!/^[a-zA-Z\s]+$/.test(cardDetails.cardholderName.trim())) {
        validationErrors.cardholderName = "Please enter a valid first and last name with only letters.";
      }
  

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };
  const handleConfirm = () => {
    if (method === "wallet") {
      if (!wallet) {
        setError("Please Select Wallet Payment.");
        return;
      } else {
        setError(""); // Clear the error if a wallet is selected
      }
      alert("Payment successfully!"); // Success alert for wallet payment
      console.log(`Payment confirmed using ${wallet}`);
      navigate("/review"); // Navigate directly for wallet
    } else if (method === "card") {
      if (validateForm()) {
        alert("Payment successfully!"); // Success alert for card payment
        console.log("Payment confirmed using debit/credit card.");
        navigate("/review"); // Navigate after validating card details
      }
    } else {
      setError("Please Select Payment Method."); // Error if no payment method is selected
    }
  };
  
  const menuItems = [
    { name: "Home", icon: "https://cdn-icons-png.flaticon.com/128/18390/18390765.png", route: "/paid" },
    { name: "Payment", icon: "https://cdn-icons-png.flaticon.com/128/18209/18209461.png", route: "/payment" },
    { name: "Review", icon: "https://cdn-icons-png.flaticon.com/128/7656/7656139.png", route: "/review" },
    { name: "History", icon: "https://cdn-icons-png.flaticon.com/128/9485/9485945.png", route: "/review/history" },
  ];

  const handleMenuClick = (item: { name: string; icon: string; route: string }) => {
    navigate(item.route); // Navigate directly to the route
  };
  

  return (
    <div className="nn">
    <div className="payment-container1">
      <header className="payment-header">
      <div className="sidebar">
  {menuItems.map((item) => (
    <div
      key={item.name}
      className="menu-item"
      onClick={() => handleMenuClick(item)}
    >
      <img src={item.icon} alt={item.name} className="menu-icon" />
      <p className="menu-text">{item.name}</p>
    </div>
  ))}
</div>
        <h1>PAYMENT</h1>
        <div className="step-indicators">
          <div className="step completed"></div>
          <div className="step active"></div>
          <div className="step"></div>
        </div>
      </header>
      <div className="payment-options">
        <div
          className={`payment-option ${method === "card" ? "selected" : ""}`}
          onClick={() => setMethod("card")}
        >
          <p>Credit/Debit Card</p>
          <div className="image-row">
  <img
    src="https://cdn-icons-png.flaticon.com/128/349/349221.png"
    alt="Image 1"
    className="image-item"
  />
  <img
    src="https://cdn-icons-png.flaticon.com/128/16174/16174534.png"
    alt="Image 2"
    className="image-item"
  />
  <img
    src="https://cdn-icons-png.flaticon.com/128/311/311147.png"
    alt="Image 3"
    className="image-item"
  />
</div>

        </div>
        <div
          className={`payment-option ${method === "wallet" ? "selected" : ""}`}
          onClick={() => setMethod("wallet")}
        >
          <p>Digital Wallet</p>
          <img
      src="https://cdn-icons-png.flaticon.com/128/2335/2335451.png"
      alt="Digital Wallet"
      className="payment-option-img"
    />
        </div>
      </div>
    <div>
      {error && <div className="error-message">{error}</div>}
      {/* Wallet Options */}
  {method === "wallet" && (
    <div className="wallet-grid">
      <button
        className="wallet-btn"
        onClick={() => {
          setWallet("truemoney");
          setError(""); // Clear error when this wallet is selected
        }}
      >
        <img
          src="https://play-lh.googleusercontent.com/eOzvk-ekluYaeLuvDkLb5RJ0KqfFQpodZDnppxPfpEfqEqbNo5erEkmwLBgqP-k-e2kQ"
          alt="TrueMoney"
        />
        <span>TrueMoney</span>
      </button>
      <button
        className="wallet-btn"
        onClick={() => {
          setWallet("promptpay");
          setError(""); // Clear error when this wallet is selected
        }}
      >
        <img
          src="https://www.bot.or.th/content/dam/bot/icons/icon-thaiqr.png"
          alt="PromptPay"
        />
        <span>PromptPay</span>
      </button>
      <button
        className="wallet-btn"
        onClick={() => {
          setWallet("alipay");
          setError(""); // Clear error when this wallet is selected
        }}
      >
        <img
          src="https://cdn.techinasia.com/data/images/c91cff808dad89b1dd21f6f3f433c521.png"
          alt="Alipay"
        />
        <span>Alipay</span>
      </button>
      <button
        className="wallet-btn"
        onClick={() => {
          setWallet("linepay");
          setError(""); // Clear error when this wallet is selected
        }}
      >
        <img
          src="https://d.line-scdn.net/linepay/portal/v-241028/portal/assets/img/linepay-logo-jp-gl.png"
          alt="Line Pay"
        />
        <span>Line Pay</span>
      </button>
    </div>
  )}
    </div>
        {wallet === "truemoney" && (
        <div className="qr-code-section">
          <h2>Scan the QR Code</h2>
          <img
            className="qr-code-img"
            src={TrueMoneyQR}
            alt="TrueMoneyQR"
          />
        </div>
      )}
      {wallet === "promptpay" && (
        <div className="qr-code-section">
          <h2>Scan the QR Code</h2>
          <img
            className="qr-code-img"
            src={PromptPayQR}
            alt="PromptPayQR"
          />
        </div>
      )}
        {wallet === "alipay" && (
        <div className="qr-code-section">
          <h2>Scan the QR Code</h2>
          <img
            className="qr-code-img"
            src={AlipayQR}
            alt="AlipayQR"
          />
        </div>
      )}
       {wallet === "linepay" && (
        <div className="qr-code-section">
          <h2>Scan the QR Code</h2>
          <img
            className="qr-code-img"
            src={LinePayQR}
            alt="LinePayQR"
          />
           
        </div>
      )}

      {method === "card" && (
        <div className="card-details-form">
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="1234-5678-9012-3456"
              value={cardDetails.cardNumber}
              onChange={handleCardInputChange}
            />
            {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
          </div>
          <div className="form-group">
        <label htmlFor="cardholderName">Cardholder Name</label>
        <input
          type="text"
          id="cardholderName"
          name="cardholderName"
          placeholder="John Doe"
          value={cardDetails.cardholderName}
          onChange={handleCardInput1Change}
        />
        {errors.cardholderName && <div className="error-message">{errors.cardholderName}</div>}
      </div>
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
        <select
        id="expiryDate"
        name="expiryDate"
        value={cardDetails.expiryDate}
        onChange={handleCardInputChange}
    >
        <option value="">Date</option>
        {[...Array(31).keys()].map((day) => (
            <option key={day + 1} value={String(day + 1).padStart(2, "0")}>
                {String(day + 1).padStart(2, "0")}
            </option>
                 ))}
        </select>
        {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
        </div>
          <div className="form-group">
            <label htmlFor="expiryMonth">Expiry Month</label>
            <select
              id="expiryMonth"
              name="expiryMonth"
              value={cardDetails.expiryMonth}
              onChange={handleCardInputChange}
            >
              <option value="">Month</option>
              {[...Array(12).keys()].map((m) => (
                <option key={m + 1} value={String(m + 1).padStart(2, "0")}>
                  {String(m + 1).padStart(2, "0")}
                </option>
              ))}
            </select>
            {errors.expiryMonth && <div className="error-message">{errors.expiryMonth}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="expiryYear">Expiry Year</label>
            <select
              id="expiryYear"
              name="expiryYear"
              value={cardDetails.expiryYear}
              onChange={handleCardInputChange}
            >
              <option value="">Year</option>
              {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.expiryYear && <div className="error-message">{errors.expiryYear}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              placeholder="123"
              value={cardDetails.cvv}
              onChange={handleCardInputChange}
            />
            {errors.cvv && <div className="error-message">{errors.cvv}</div>}
          </div>
        </div>
      )}

      <div className="button-container">
        <button className="primary-btn" onClick={handleConfirm}>
          Confirm
        </button>
        <button className="secondary-btn" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
      <Outlet/>
    </div>
    </div>
  );
};

export default Payment;
function setSelectedImage(icon: string) {
    throw new Error("Function not implemented.");
}

