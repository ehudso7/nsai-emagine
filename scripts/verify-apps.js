#!/usr/bin/env node

/**
 * This script verifies that all core app functionality is working properly
 * Run with: node scripts/verify-apps.js
 */

const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Test API endpoints
const API_ENDPOINTS = [
  { name: 'Comply', endpoint: '/api/comply/generate', payload: { prompt: 'Create a simple privacy policy' } },
  { name: 'NichePress', endpoint: '/api/nichepress/generate', payload: { topic: 'sustainable gardening', keywords: ['organic', 'compost'] } },
  { name: 'GrantBot', endpoint: '/api/grantbot/search', payload: { query: 'small business grants technology' } },
  { name: 'HireEdge', endpoint: '/api/hireedge/generate', payload: { jobTitle: 'Software Engineer', skills: ['JavaScript', 'React'] } },
  { name: 'HostFlow', endpoint: '/api/hostflow/reply', payload: { message: 'What time is check-in?', propertyId: '123' } },
  { name: 'Advisor', endpoint: '/api/advisor/generate', payload: { business: 'coffee shop', question: 'How to increase customer retention?' } },
  { name: 'Monetizer', endpoint: '/api/monetizer/generate', payload: { content: 'cooking blog', audience: 'home chefs' } },
];

// Base URL for API calls
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

// Utility function to log with color
function logWithColor(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

// Verify a single API endpoint
async function verifyEndpoint(name, endpoint, payload) {
  try {
    logWithColor(colors.blue, `Testing ${name} API...`);
    const url = `${BASE_URL}${endpoint}`;
    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    });
    
    if (response.status === 200 && response.data) {
      logWithColor(colors.green, `✓ ${name} API is working properly`);
      return true;
    } else {
      logWithColor(colors.red, `✗ ${name} API returned status ${response.status}`);
      return false;
    }
  } catch (error) {
    logWithColor(colors.red, `✗ ${name} API error: ${error.message}`);
    return false;
  }
}

// Verify Supabase connection
async function verifySupabase() {
  try {
    logWithColor(colors.blue, 'Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('id').limit(1);
    
    if (error) {
      throw new Error(error.message);
    }
    
    logWithColor(colors.green, '✓ Supabase connection is working properly');
    return true;
  } catch (error) {
    logWithColor(colors.red, `✗ Supabase connection error: ${error.message}`);
    return false;
  }
}

// Verify OpenAI connection
async function verifyOpenAI() {
  try {
    logWithColor(colors.blue, 'Testing OpenAI API connection...');
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-1106-preview',
        messages: [{ role: 'user', content: 'Say hello' }],
        max_tokens: 10
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );
    
    if (response.status === 200 && response.data && response.data.choices) {
      logWithColor(colors.green, '✓ OpenAI API connection is working properly');
      return true;
    } else {
      logWithColor(colors.red, `✗ OpenAI API returned unexpected response`);
      return false;
    }
  } catch (error) {
    logWithColor(colors.red, `✗ OpenAI API error: ${error.message}`);
    return false;
  }
}

// Verify all app functionalities
async function verifyAllApps() {
  console.log('\n=== NSAI-Emagine App Verification ===\n');
  
  // First verify core services
  const supabaseWorking = await verifySupabase();
  const openaiWorking = await verifyOpenAI();
  
  // Exit if core services aren't working
  if (!supabaseWorking || !openaiWorking) {
    logWithColor(colors.red, '\n✗ Critical services are not working. Please fix before proceeding.\n');
    process.exit(1);
  }
  
  // Verify each API endpoint
  let successCount = 0;
  let failureCount = 0;
  
  for (const { name, endpoint, payload } of API_ENDPOINTS) {
    const success = await verifyEndpoint(name, endpoint, payload);
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
  }
  
  // Print summary
  console.log('\n=== Verification Summary ===\n');
  logWithColor(colors.green, `Passed: ${successCount} apps`);
  
  if (failureCount > 0) {
    logWithColor(colors.red, `Failed: ${failureCount} apps`);
    logWithColor(colors.yellow, '\nSome app functionalities are not working correctly. Please fix the issues before deploying to production.\n');
    process.exit(1);
  } else {
    logWithColor(colors.green, '\nAll app functionalities are working correctly! The system is ready for production.\n');
    process.exit(0);
  }
}

// Run verification
verifyAllApps().catch((error) => {
  logWithColor(colors.red, `Verification script error: ${error.message}`);
  process.exit(1);
});