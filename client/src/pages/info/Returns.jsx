import React from 'react';

export default function Returns() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-black text-white py-16 md:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Marcellus SC, serif' }}>
                        Returns & Refunds
                    </h1>
                    <p className="text-gray-300">
                        Hassle-free returns within 7 days
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="prose prose-gray max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            Return Policy
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We want you to love your SLAY purchase! If you're not completely satisfied, you can return your
                            item within <strong>7 days of delivery</strong> for a full refund or exchange.
                        </p>
                        <div className="bg-green-50 border border-green-200 p-4 rounded-sm">
                            <p className="text-green-900 text-sm">
                                <strong>Easy Returns:</strong> No questions asked returns within 7 days of delivery.
                            </p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            Eligibility Criteria
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            To be eligible for a return, your item must meet the following conditions:
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <p className="text-gray-700">Unused and unworn with all original tags attached</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <p className="text-gray-700">In original packaging (if applicable)</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <p className="text-gray-700">No signs of wear, damage, or alteration</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <p className="text-gray-700">Returned within 7 days of delivery</p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            Non-Returnable Items
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            The following items cannot be returned:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Custom or personalized products</li>
                            <li>Items marked as "Final Sale" or "Non-Returnable"</li>
                            <li>Products damaged due to misuse or negligence</li>
                            <li>Items without original tags or packaging</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            How to Initiate a Return
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Login to Your Account</h3>
                                    <p className="text-gray-600">Go to "My Orders" and select the order you want to return</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Click "Return Item"</h3>
                                    <p className="text-gray-600">Select the reason for return and provide any additional details</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    3
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Pack the Item</h3>
                                    <p className="text-gray-600">Securely pack the item with all tags and original packaging</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    4
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Schedule Pickup</h3>
                                    <p className="text-gray-600">Our courier partner will pick up the item from your address (free pickup)</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            Refund Process
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Once we receive and inspect your returned item:
                        </p>
                        <div className="bg-gray-50 p-6 rounded-sm space-y-3">
                            <div>
                                <h3 className="font-semibold mb-1">Online Payments</h3>
                                <p className="text-gray-600">Refund will be processed to your original payment method within 5-7 business days</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Cash on Delivery</h3>
                                <p className="text-gray-600">Refund will be processed via bank transfer (please provide bank details)</p>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mt-4">
                            * You will receive an email confirmation once your refund is processed.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            Exchange Policy
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Want a different size or color? We offer free exchanges within 7 days of delivery.
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Exchanges are subject to product availability</li>
                            <li>No additional shipping charges for exchanges</li>
                            <li>Same eligibility criteria as returns apply</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            Damaged or Defective Items
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you receive a damaged or defective item:
                        </p>
                        <div className="bg-red-50 border border-red-200 p-4 rounded-sm">
                            <p className="text-red-900 text-sm mb-2">
                                <strong>Important:</strong> Please contact us within 48 hours of delivery with photos of the damaged item.
                            </p>
                            <p className="text-red-900 text-sm">
                                We'll arrange for immediate replacement or full refund at no additional cost.
                            </p>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            Contact Us
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Need help with a return or exchange?
                        </p>
                        <div className="bg-gray-50 p-6 rounded-sm">
                            <p className="text-gray-700"><strong>Email:</strong> returns@slay.com</p>
                            <p className="text-gray-700"><strong>Phone:</strong> +91 7780-661493</p>
                            <p className="text-gray-700"><strong>Hours:</strong> Mon-Sat, 10 AM - 6 PM IST</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
