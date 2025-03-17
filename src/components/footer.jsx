import React from "react";

export const Footer = () => {
  return (
    <div className="bg-purple-900 text-white p-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="footer-column">
          <h4 className="font-bold mb-2">About Us</h4>
          <ul>
            <li className="mb-1">
              <a href="/about" className="hover:underline">
                Our Story
              </a>
            </li>
            <li className="mb-1">
              <a href="/team" className="hover:underline">
                Team
              </a>
            </li>
            <li className="mb-1">
              <a href="/careers" className="hover:underline">
                Careers
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h4 className="font-bold mb-2">Services</h4>
          <ul>
            <li className="mb-1">
              <a href="/services/consulting" className="hover:underline">
                Consulting
              </a>
            </li>
            <li className="mb-1">
              <a href="/services/support" className="hover:underline">
                Support
              </a>
            </li>
            <li className="mb-1">
              <a href="/services/development" className="hover:underline">
                Development
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h4 className="font-bold mb-2">Resources</h4>
          <ul>
            <li className="mb-1">
              <a href="/blog" className="hover:underline">
                Blog
              </a>
            </li>
            <li className="mb-1">
              <a href="/guides" className="hover:underline">
                Guides
              </a>
            </li>
            <li className="mb-1">
              <a href="/help" className="hover:underline">
                Help Center
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h4 className="font-bold mb-2">Contact Us</h4>
          <ul>
            <li className="mb-1">
              <a href="/contact" className="hover:underline">
                Contact Form
              </a>
            </li>
            <li className="mb-1">
              <a href="/locations" className="hover:underline">
                Locations
              </a>
            </li>
            <li className="mb-1">
              <a href="/support" className="hover:underline">
                Support
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
