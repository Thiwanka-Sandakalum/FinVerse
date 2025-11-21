#!/usr/bin/env node

/**
 * Simple test script for the Enhanced User Management API
 * 
 * This script tests the basic functionality of the API endpoints.
 * Make sure to set up your environment variables before running.
 * 
 * Usage: node test-api.js
 */

const https = require('https');
const http = require('http');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

/**
 * Make HTTP request helper
 */
function makeRequest(method, path, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, API_BASE_URL);
        const isHttps = url.protocol === 'https:';
        const lib = isHttps ? https : http;

        const options = {
            hostname: url.hostname,
            port: url.port || (isHttps ? 443 : 80),
            path: url.pathname + url.search,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        if (data) {
            const jsonData = JSON.stringify(data);
            options.headers['Content-Length'] = Buffer.byteLength(jsonData);
        }

        const req = lib.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const responseData = body ? JSON.parse(body) : {};
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: responseData
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: body
                    });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

/**
 * Test cases
 */
async function runTests() {
    console.log('🚀 Starting Enhanced User Management API Tests\n');

    try {
        // Test 1: List users (should work without authentication for testing)
        console.log('📋 Test 1: Listing users...');
        const usersResponse = await makeRequest('GET', '/users?per_page=5');
        console.log(`Status: ${usersResponse.statusCode}`);
        if (usersResponse.statusCode === 200) {
            console.log('✅ Users list retrieved successfully');
            console.log(`Found ${usersResponse.data.users?.length || usersResponse.data.length || 0} users`);
        } else {
            console.log('❌ Failed to retrieve users list');
            console.log('Response:', usersResponse.data);
        }
        console.log('');

        // Test 2: Login callback without token (should fail)
        console.log('🔐 Test 2: Login callback without token...');
        const noTokenResponse = await makeRequest('POST', '/users/login-callback', {});
        console.log(`Status: ${noTokenResponse.statusCode}`);
        if (noTokenResponse.statusCode === 400) {
            console.log('✅ Correctly rejected request without token');
        } else {
            console.log('❌ Unexpected response for missing token');
            console.log('Response:', noTokenResponse.data);
        }
        console.log('');

        // Test 3: Login callback with invalid token (should fail)
        console.log('🔐 Test 3: Login callback with invalid token...');
        const invalidTokenResponse = await makeRequest('POST', '/users/login-callback', {
            token: 'invalid.jwt.token'
        });
        console.log(`Status: ${invalidTokenResponse.statusCode}`);
        if (invalidTokenResponse.statusCode === 400) {
            console.log('✅ Correctly rejected invalid token');
        } else {
            console.log('❌ Unexpected response for invalid token');
            console.log('Response:', invalidTokenResponse.data);
        }
        console.log('');

        // Test 4: Health check (API availability)
        console.log('❤️  Test 4: API Health check...');
        try {
            const healthResponse = await makeRequest('GET', '/users');
            if (healthResponse.statusCode < 500) {
                console.log('✅ API is responding');
            } else {
                console.log('⚠️  API responding with server error');
            }
        } catch (error) {
            console.log('❌ API is not responding');
            console.log('Error:', error.message);
        }
        console.log('');

        console.log('✨ Test suite completed!');
        console.log('\n📝 Notes:');
        console.log('- To test login callback with real token, use Auth0 authentication');
        console.log('- Make sure your .env file is properly configured');
        console.log('- Check the server logs for detailed information');

    } catch (error) {
        console.error('❌ Test suite failed:', error);
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    runTests();
}

module.exports = { makeRequest, runTests };