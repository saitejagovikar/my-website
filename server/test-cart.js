// Test script to verify cart endpoint
// Run with: node test-cart.js

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5001';

async function testCart() {
    console.log('🧪 Testing Cart Endpoint...\n');

    // Step 1: Login
    console.log('1️⃣ Logging in...');
    const loginResponse = await fetch(`${API_BASE}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
        })
    });

    if (!loginResponse.ok) {
        console.log('❌ Login failed. Creating test user...');

        // Register test user
        const registerResponse = await fetch(`${API_BASE}/api/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            })
        });

        const registerData = await registerResponse.json();
        console.log('✅ User created:', registerData.user.email);
        var token = registerData.token;
    } else {
        const loginData = await loginResponse.json();
        console.log('✅ Logged in:', loginData.user.email);
        var token = loginData.token;
    }

    // Step 2: Update cart
    console.log('\n2️⃣ Updating cart...');
    const testCart = [
        {
            id: 'test-product-1',
            name: 'Test T-Shirt',
            price: 999,
            image: '/test.jpg',
            size: 'M',
            quantity: 2
        }
    ];

    const cartResponse = await fetch(`${API_BASE}/api/user/cart`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cart: testCart })
    });

    if (!cartResponse.ok) {
        const error = await cartResponse.text();
        console.log('❌ Cart update failed:', cartResponse.status, error);
        return;
    }

    const cartData = await cartResponse.json();
    console.log('✅ Cart updated:', cartData);

    // Step 3: Get cart
    console.log('\n3️⃣ Getting cart...');
    const getCartResponse = await fetch(`${API_BASE}/api/user/cart`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const cart = await getCartResponse.json();
    console.log('✅ Cart retrieved:', cart);

    console.log('\n🎉 All tests passed!');
}

testCart().catch(console.error);
