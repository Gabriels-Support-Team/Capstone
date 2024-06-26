import React from "react";
import "./FlixterFooter.css";
function FlixterFooter() {
  return (
    <footer className="siteFooter">
      <div className="footerContent">
        <div className="footerSection">
          <h4>About Us</h4>
          <p>
            We are committed to delivering the best online experiences for our
            users. Learn more about our journey and services.
          </p>
          <a href="/about">Learn More</a>
        </div>
        <div className="footerSection">
          <h4>Contact Us</h4>
          <p>Email: gabrielalvarado@meta.com</p>
          <p>Phone: +479 544 4410</p>
        </div>
        <div className="footerSection">
          <h4>Follow Us</h4>
          <a href="https://facebook.com" target="_blank">
            Facebook
          </a>
          <a href="https://twitter.com" target="_blank">
            {" "}
            Twitter
          </a>
          <a href="https://instagram.com" target="_blank">
            {" "}
            Instagram
          </a>
        </div>
      </div>
      <div className="footerBottom">
        <p>Copyright &copy; 2024 Meta. All rights reserved.</p>
      </div>
    </footer>
  );
}
export default FlixterFooter;
