import { apiPost, apiPut } from '../../api/client';

/**
 * Handles the complete Razorpay payment flow
 * @param {Object} params - Payment parameters
 * @param {Array} params.items - Cart items
 * @param {Object} params.shippingAddress - Shipping address
 * @param {Object} params.pricing - Pricing details
 * @param {Object} params.formData - Form data
 * @param {Boolean} params.useSavedAddress - Whether using saved address
 * @param {Array} params.savedAddresses - Saved addresses
 * @param {Object} params.user - User object
 * @param {Function} params.onSuccess - Success callback
 * @param {Function} params.onError - Error callback
 */
export const handleRazorpayPayment = async ({
    items,
    shippingAddress,
    pricing,
    formData,
    useSavedAddress,
    savedAddresses,
    user,
    onSuccess,
    onError
}) => {
    try {
        const { subtotal, shipping, tax, discount, total } = pricing;

        // Step 1: Create Razorpay order through backend
        const razorpayOrderData = {
            amount: total - discount,
            currency: 'INR',
            receipt: `order_${Date.now()}`
        };

        const razorpayOrder = await apiPost('/api/orders/create-razorpay-order', razorpayOrderData);

        // Step 2: Create order in our database
        const orderData = {
            items,
            shippingAddress,
            paymentMethod: {
                method: 'razorpay',
                transactionId: razorpayOrder.orderId,
                paymentId: null,
                cardLast4: null,
            },
            pricing: {
                subtotal,
                shipping,
                tax,
                discount,
                total: total - discount,
            },
            status: 'pending',
            paymentStatus: 'pending',
        };

        const order = await apiPost('/api/orders', orderData);

        // Step 3: Initialize Razorpay with backend order
        const options = {
            key: razorpayOrder.key, // Dynamic key from backend
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: 'SLAY',
            description: `Order #${order.orderNumber}`,
            order_id: razorpayOrder.orderId,
            handler: async function (response) {
                try {

                    // Step 4: Verify payment with backend
                    const verificationData = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    };

                    const verification = await apiPost('/api/orders/verify-payment', verificationData);

                    if (verification.verified) {
                        // Step 5: Update order with payment details
                        await apiPost(`/api/orders/${order._id}/payment`, {
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            status: 'confirmed',
                            paymentStatus: 'completed',
                        });

                        // Save address if requested
                        if (formData.saveAddress && !useSavedAddress) {
                            try {
                                await apiPost('/api/user/addresses', {
                                    ...shippingAddress,
                                    isDefault: savedAddresses.length === 0,
                                });
                            } catch (error) {
                                console.error('Failed to save address:', error);
                            }
                        }

                        // Clear cart
                        localStorage.removeItem('cart');
                        try {
                            await apiPut('/api/user/cart', { cart: [] });
                        } catch (error) {
                            console.error('Failed to clear backend cart:', error);
                        }

                        // Call success callback
                        onSuccess(order);
                    } else {
                        throw new Error('Payment verification failed');
                    }
                } catch (error) {
                    console.error('Payment verification failed:', error);
                    onError(error);
                }
            },
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone,
            },
            notes: {
                address: formData.address,
                city: formData.city,
                state: formData.state,
            },
            theme: {
                color: '#000000',
            },
            modal: {
                ondismiss: function () {
                    onError(new Error('Payment cancelled'));
                }
            },
            config: {
                display: {
                    preferences: {
                        show_default_blocks: true
                    }
                }
            }
        };

        const rzp = new window.Razorpay(options);

        rzp.on('payment.failed', function (response) {
            console.error('Payment failed:', response.error);
            onError(new Error(response.error.description));
        });

        rzp.open();
    } catch (error) {
        console.error('Razorpay initialization error:', error);
        onError(error);
    }
};
