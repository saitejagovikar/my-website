// src/pages/About.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  const values = [
    {
      icon: "🌱",
      title: "SUSTAINABILITY",
      description: "Eco-friendly materials and sustainable practices in all our products."
    },
    {
      icon: "⭐",
      title: "QUALITY",
      description: "Premium materials and attention to detail in every piece."
    },
    {
      icon: "🎨",
      title: "CREATIVITY",
      description: "Unique designs that bring style to your wardrobe."
    },
    {
      icon: "🤝",
      title: "COMMUNITY",
      description: "Building connections through fashion."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{ fontFamily: 'Marcellus SC, serif' }}
          >
            ABOUT SLAY
          </h1>
          <p
            className="text-lg md:text-xl text-gray-300"
            style={{ fontFamily: 'Marcellus SC, serif' }}
          >
            Premium tees with passion, sustainability, and style
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl md:text-3xl font-bold mb-6 text-black"
            style={{ fontFamily: 'Marcellus SC, serif' }}
          >
            OUR STORY
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Founded in 2024, SLAY began with a vision to create premium quality t-shirts that combine
              comfort, style, and sustainability. We believe fashion should look good, feel good, and do
              good for the planet.
            </p>
            <p>
              We source the finest cotton and work with skilled artisans to bring you designs that stand out.
              Whether you're heading to work, meeting friends, or relaxing at home, SLAY has the perfect tee
              for every occasion.
            </p>
            <p>
              Today, we're proud to serve thousands of customers across India, offering both everyday essentials
              and statement pieces that reflect your unique style.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-10 text-black"
            style={{ fontFamily: 'Marcellus SC, serif' }}
          >
            OUR VALUES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-3">{value.icon}</div>
                <h3
                  className="text-lg font-semibold mb-2 text-black"
                  style={{ fontFamily: 'Marcellus SC, serif' }}
                >
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-2xl md:text-3xl font-bold mb-6 text-black"
            style={{ fontFamily: 'Marcellus SC, serif' }}
          >
            OUR MISSION
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            To create premium quality t-shirts that empower individuals to express their unique style
            while contributing to a more sustainable future. We're committed to using eco-friendly materials,
            supporting fair labor practices, and delivering exceptional customer experiences.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 md:py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ fontFamily: 'Marcellus SC, serif' }}
          >
            READY TO SLAY?
          </h2>
          <p className="text-gray-300 mb-8">
            Discover our collection and find your perfect tee
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="px-8 py-3 bg-white text-black rounded-sm hover:bg-gray-100 transition-colors font-medium"
            >
              Shop Now
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 border border-white text-white rounded-sm hover:bg-white hover:text-black transition-colors font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
