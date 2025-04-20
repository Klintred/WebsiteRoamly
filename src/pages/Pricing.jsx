import React from "react";
import "../styles/prices.css";

const plans = [
  {
    title: "Freemium",
    icon: "fas fa-home",
    price: "€0",
    description: "For individuals to explore accessibility insights",
    features: [
      "View accessibility reviews",
      "One free AI-generated trip",
    ],
    buttonText: "Using",
    buttonStyle: "primary",
  },
  {
    title: "Pay-per-use",
    icon: "fas fa-ticket-alt",
    price: "€1.49 / trip",
    description: "Ideal for occasional travelers",
    features: [
      "Access all accessibility reviews",
      "Pay-per-trip AI-generated route",
    ],
    buttonText: "Pay per trip",
    buttonStyle: "secondary",
  },
  {
    title: "Packages",
    icon: "fas fa-suitcase-rolling",
    price: "€9.99 = 10 trips / €19.99 = 25 trips",
    description: "Best for frequent explorers",
    features: [
      "All features from Pay-per-use",
      "Bundled trips at discounted rates",
    ],
    buttonText: "Choose Package",
    buttonStyle: "secondary",
  },
];

const Pricing = () => {
  return (
    <div className="pricing-wrapper">
      <div className="pricing-container">
        <h1 className="pricing-title">Pricing Plans</h1>
        <p className="pricing-subtitle">
          Flexible options for all kinds of travelers and organizations.
        </p>

        <div className="plan-grid">
          {plans.map((plan, index) => (
            <div key={index} className={`plan-card ${plan.buttonStyle}`}>
              <div>
                <i className={`${plan.icon} plan-icon`} />
                <h2 className="plan-price">{plan.price}</h2>
                <h3 className="plan-title">{plan.title}</h3>
                <p className="plan-description">{plan.description}</p>
                <ul className="plan-features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
              <button className="plan-button">{plan.buttonText}</button>
            </div>
          ))}

          <div className="plan-card enterprise">
            <div>
              <i className="fas fa-building plan-icon" />
              <h2 className="plan-price">€149.99 / month</h2>
              <h3 className="plan-title">Enterprise Access</h3>
              <p className="plan-description">
                Tailored for agencies and care institutions needing full access and support.
              </p>
              <ul className="plan-features">
                <li>Unlimited AI trip generation</li>
                <li>Priority support</li>
                <li>Custom onboarding</li>
              </ul>
            </div>
            <button className="plan-button accent">For Enterprises</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
