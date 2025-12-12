import React from 'react';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-black text-white py-16 md:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Marcellus SC, serif' }}>
                        Privacy Policy
                    </h1>
                    <p className="text-gray-300">
                        Last updated: December 2025
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="prose prose-gray max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            1. Information We Collect
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We collect information that you provide directly to us, including:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Name, email address, and phone number</li>
                            <li>Shipping and billing addresses</li>
                            <li>Payment information (processed securely through Razorpay)</li>
                            <li>Order history and preferences</li>
                            <li>Communication preferences</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            2. How We Use Your Information
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Process and fulfill your orders</li>
                            <li>Send order confirmations and shipping updates</li>
                            <li>Respond to your questions and provide customer support</li>
                            <li>Send marketing communications (with your consent)</li>
                            <li>Improve our products and services</li>
                            <li>Prevent fraud and enhance security</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            3. Information Sharing
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We do not sell your personal information. We may share your information with:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li><strong>Service Providers:</strong> Payment processors, shipping companies, and email service providers</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                            <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            4. Data Security
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We implement appropriate technical and organizational measures to protect your personal information.
                            All payment transactions are processed through secure, PCI-compliant payment gateways. However, no
                            method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            5. Your Rights
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You have the right to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Access and receive a copy of your personal data</li>
                            <li>Correct inaccurate or incomplete data</li>
                            <li>Request deletion of your data</li>
                            <li>Object to processing of your data</li>
                            <li>Withdraw consent at any time</li>
                            <li>Opt-out of marketing communications</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            6. Cookies and Tracking
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We use cookies and similar tracking technologies to enhance your browsing experience, analyze site
                            traffic, and personalize content. You can control cookies through your browser settings.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            7. Children's Privacy
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Our services are not directed to children under 13. We do not knowingly collect personal information
                            from children under 13. If you believe we have collected such information, please contact us.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            8. Changes to This Policy
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                            the new policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Marcellus SC, serif' }}>
                            9. Contact Us
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you have any questions about this Privacy Policy, please contact us:
                        </p>
                        <div className="bg-gray-50 p-6 rounded-sm">
                            <p className="text-gray-700"><strong>Email:</strong> privacy@slay.com</p>
                            <p className="text-gray-700"><strong>Phone:</strong> +91 7780-661493</p>
                            <p className="text-gray-700"><strong>Address:</strong> SLAY Fashion, Hyderabad, India</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
