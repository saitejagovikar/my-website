import React from 'react';

export default function OrderSummary({ cart, pricing }) {
    const { subtotal, shipping, tax, discount, total, totalItems } = pricing;

    return (
        <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg md:text-xl font-medium mb-4" style={{ fontFamily: 'Marcellus SC, serif' }}>Order Summary</h2>
            <div className="space-y-4">
                {cart.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-start">
                            <div className="relative w-16 h-20 md:w-20 md:h-24 mr-3 md:mr-4 flex-shrink-0">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                {item.customizations && (
                                    <div className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                        Custom
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm md:text-base truncate pr-2">{item.name}</h3>
                                {item.customizations?.text && (
                                    <p className="text-xs text-gray-500 truncate">Custom: {item.customizations.text}</p>
                                )}
                                {item.customizations?.size && (
                                    <p className="text-xs text-gray-500">Size: {item.customizations.size}</p>
                                )}
                                <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                                <div className="text-right mt-1">
                                    <p className="font-medium text-sm md:text-base">₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Custom Design Preview */}
                        {item.customizations && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <h4 className="text-xs font-medium mb-2 text-gray-500">Your Custom Design:</h4>
                                <div className="relative bg-gray-50 rounded-lg p-3">
                                    <div className="relative mx-auto" style={{ maxWidth: '160px' }}>
                                        {/* Base T-shirt image */}
                                        <img
                                            src={item.image}
                                            alt="T-shirt base"
                                            className="w-full h-auto"
                                        />

                                        {/* Custom Text */}
                                        {item.customizations?.text && (
                                            <div
                                                className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none"
                                                style={{
                                                    fontFamily: item.customizations.fontFamily || 'sans-serif',
                                                    color: item.customizations.textColor || '#000000',
                                                    fontSize: `${(item.customizations.fontSize || 18) * 0.8}px`, // Scale down slightly for preview
                                                    fontWeight: 'bold',
                                                    textAlign: 'center',
                                                    wordBreak: 'break-word',
                                                    whiteSpace: 'pre-wrap',
                                                    transform: `translate(${item.customizations.textPosition?.x || 0}px, ${item.customizations.textPosition?.y || 0}px)`,
                                                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    pointerEvents: 'none',
                                                    zIndex: 10
                                                }}
                                            >
                                                {item.customizations.text}
                                            </div>
                                        )}

                                        {/* Custom Image Upload */}
                                        {item.customizations.design?.preview && item.customizations.designType === 'image' && (
                                            <div
                                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                                style={{
                                                    transform: `translate(${item.customizations.imagePosition?.x || 0}px, ${item.customizations.imagePosition?.y || 0}px)`,
                                                    width: '100%',
                                                    height: '100%',
                                                    pointerEvents: 'none',
                                                    zIndex: 5
                                                }}
                                            >
                                                <img
                                                    src={item.customizations.design.preview}
                                                    alt="Custom design"
                                                    className="max-w-[80%] max-h-[80%] object-contain"
                                                    style={{
                                                        filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))',
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Template Design */}
                                        {item.customizations.design?.preview && item.customizations.designType === 'template' && (
                                            <div
                                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                                style={{
                                                    transform: `translate(${item.customizations.imagePosition?.x || 0}px, ${item.customizations.imagePosition?.y || 0}px)`,
                                                    width: '100%',
                                                    height: '100%',
                                                    pointerEvents: 'none',
                                                    zIndex: 5
                                                }}
                                            >
                                                <img
                                                    src={item.customizations.design.preview}
                                                    alt="Template design"
                                                    className="max-w-[90%] max-h-[90%] object-contain"
                                                    style={{
                                                        filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.4))',
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                <div className="pt-3 md:pt-4 text-sm md:text-base">
                    <div className="flex justify-between py-1.5 md:py-2 text-gray-600">
                        <span>Subtotal ({totalItems} items)</span>
                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between py-1.5 md:py-2 text-gray-600">
                        <span>Shipping</span>
                        <span className="text-green-600">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                    </div>
                    <div className="flex justify-between py-1.5 md:py-2 text-gray-600">
                        <span>Tax</span>
                        <span>₹{tax}</span>
                    </div>
                    {pricing.codCharge > 0 && (
                        <div className="flex justify-between py-1.5 md:py-2 text-gray-600">
                            <span>Payment Fee</span>
                            <span>₹{pricing.codCharge}</span>
                        </div>
                    )}
                    {discount > 0 && (
                        <div className="flex justify-between py-1.5 md:py-2 text-green-600">
                            <span>Discount</span>
                            <span>-₹{discount.toLocaleString('en-IN')}</span>
                        </div>
                    )}
                    <div className="flex justify-between py-3 border-t border-gray-200 font-semibold text-base md:text-lg mt-2">
                        <span>Total</span>
                        <span>₹{(total - discount).toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
