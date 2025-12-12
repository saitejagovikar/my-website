import React from 'react';

export default function Shipping() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-black text-white py-16 md:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Marcellus SC, serif' }}>
                        Shipping Policy
                    </h1>
                    <p className="text-gray-300">
                        Fast, reliable delivery across India
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="prose prose-gray max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            Shipping Locations
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We currently ship to all locations within India. International shipping is not available at this time.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            Delivery Timeline
                        </h2>
                        <div className="bg-gray-50 p-6 rounded-sm mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Metro Cities</h3>
                                    <p className="text-gray-600">3-5 business days</p>
                                    <p className="text-sm text-gray-500">Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Other Cities</h3>
                                    <p className="text-gray-600">5-7 business days</p>
                                    <p className="text-sm text-gray-500">All other locations in India</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                            * Delivery times are estimates and may vary during peak seasons or due to unforeseen circumstances.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            Shipping Charges
                        </h2>
                        <div className="space-y-4">
                            <div className="border-l-4 border-black pl-4">
                                <h3 className="font-semibold text-lg mb-1">Free Shipping</h3>
                                <p className="text-gray-600">On all orders above ₹999</p>
                            </div>
                            <div className="border-l-4 border-gray-300 pl-4">
                                <h3 className="font-semibold text-lg mb-1">Standard Shipping</h3>
                                <p className="text-gray-600">₹99 for orders below ₹999</p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            Order Processing
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Orders are processed within 1-2 business days (Monday-Saturday, excluding public holidays).
                            You will receive a confirmation email once your order is placed and another email with tracking
                            information once your order ships.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-sm">
                            <p className="text-blue-900 text-sm">
                                <strong>Note:</strong> Orders placed on Sundays or public holidays will be processed on the next business day.
                            </p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            Order Tracking
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Once your order ships, you'll receive a tracking number via email. You can track your order:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Through your account dashboard under "My Orders"</li>
                            <li>Using the tracking link in your shipping confirmation email</li>
                            <li>By contacting our customer support team</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            Shipping Partners
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We work with trusted courier partners including Delhivery, Blue Dart, and India Post to ensure
                            safe and timely delivery of your orders.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            Delivery Issues
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you experience any issues with delivery:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li><strong>Delayed Delivery:</strong> Contact us if your order hasn't arrived within the estimated timeframe</li>
                            <li><strong>Failed Delivery:</strong> We'll attempt redelivery or arrange pickup from the courier office</li>
                            <li><strong>Damaged Package:</strong> Please refuse delivery and contact us immediately</li>
                            <li><strong>Wrong Address:</strong> Ensure your shipping address is correct before placing an order</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            Cash on Delivery (COD)
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            COD is available for orders up to ₹5,000. A nominal COD fee of ₹50 will be charged.
                            Please keep the exact amount ready at the time of delivery.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            Contact Us
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            For shipping-related queries:
                        </p>
                        <div className="bg-gray-50 p-6 rounded-sm">
                            <p className="text-gray-700"><strong>Email:</strong> shipping@slay.com</p>
                            <p className="text-gray-700"><strong>Phone:</strong> +91 7780-661493</p>
                            <p className="text-gray-700"><strong>Hours:</strong> Mon-Sat, 10 AM - 6 PM IST</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
