// src/pages/About.jsx
import React from 'react';

export default function About() {
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/api/placeholder/200/200",
      description: "Passionate about sustainable fashion"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Creative Director",
      image: "/api/placeholder/200/200",
      description: "Bringing innovative designs to life"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Head of Operations",
      image: "/api/placeholder/200/200",
      description: "Ensuring quality in every product"
    }
  ];

  const values = [
    {
      icon: "🌱",
      title: "SUSTAINABILITY",
      description: "We use eco-friendly materials and sustainable practices in all our products."
    },
    {
      icon: "🎨",
      title: "CREATIVITY",
      description: "Every design is carefully crafted to bring unique style to your wardrobe."
    },
    {
      icon: "⭐",
      title: "QUALITY",
      description: "Premium materials and attention to detail in every piece we create."
    },
    {
      icon: "🤝",
      title: "COMMUNITY",
      description: "Building connections through fashion and supporting local communities."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 to-black text-white py-20">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{ fontFamily: 'Marcellus SC, serif' }}
          >
            ABOUT US
          </h1>
          <p 
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
            style={{ fontFamily: 'Marcellus SC, serif' }}
          >
            Crafting premium tees with passion, sustainability, and style
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 
                className="text-3xl md:text-4xl font-bold mb-6 text-black"
                style={{ fontFamily: 'Marcellus SC, serif' }}
              >
                OUR STORY
              </h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  Founded in 2020, SLAY began as a vision to create premium quality t-shirts that combine comfort, style, and sustainability. We believe that fashion should not only look good but also feel good and do good for the planet.
                </p>
                <p>
                  Our journey started with a simple idea: to create the perfect tee that you can wear every day, whether you're heading to work, meeting friends, or just relaxing at home. We source the finest cotton and work with skilled artisans to bring you designs that stand out.
                </p>
                <p>
                  Today, we're proud to serve thousands of customers across India, offering both everyday essentials and luxury pieces that reflect your unique style and values.
                </p>
              </div>
            </div>
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-black"
            style={{ fontFamily: 'Marcellus SC, serif' }}
          >
            OUR VALUES
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 
                  className="text-xl font-semibold mb-3 text-black"
                  style={{ fontFamily: 'Marcellus SC, serif' }}
                >
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-black"
            style={{ fontFamily: 'Marcellus SC, serif' }}
          >
            MEET OUR TEAM
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="text-center">
                <div className="w-48 h-48 mx-auto mb-6 bg-gray-200 rounded-full"></div>
                <h3 
                  className="text-xl font-semibold mb-2 text-black"
                  style={{ fontFamily: 'Marcellus SC, serif' }}
                >
                  {member.name}
                </h3>
                <p className="text-gray-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-500">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-black text-white">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-8"
            style={{ fontFamily: 'Marcellus SC, serif' }}
          >
            OUR MISSION
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            To create premium quality t-shirts that empower individuals to express their unique style while contributing to a more sustainable future. We're committed to using eco-friendly materials, supporting fair labor practices, and delivering exceptional customer experiences.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-8 text-black"
            style={{ fontFamily: 'Marcellus SC, serif' }}
          >
            GET IN TOUCH
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Have questions or want to collaborate? We'd love to hear from you.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 
                className="text-lg font-semibold mb-2 text-black"
                style={{ fontFamily: 'Marcellus SC, serif' }}
              >
                EMAIL
              </h3>
              <p className="text-gray-600">hello@slay.com</p>
            </div>
            <div>
              <h3 
                className="text-lg font-semibold mb-2 text-black"
                style={{ fontFamily: 'Marcellus SC, serif' }}
              >
                PHONE
              </h3>
              <p className="text-gray-600">+91 7780-661493</p>
            </div>
            <div>
              <h3 
                className="text-lg font-semibold mb-2 text-black"
                style={{ fontFamily: 'Marcellus SC, serif' }}
              >
                ADDRESS
              </h3>
              <p className="text-gray-600">Mumbai, India</p>
            </div>
          </div>
          
          <button
            className="bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
            style={{ fontFamily: 'Marcellus SC, serif' }}
          >
            CONTACT US
          </button>
        </div>
      </div>
    </div>
  );
}
