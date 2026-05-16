const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5175';
const SCREENSHOT_DIR = './screenshots';
const AUTH_FILE = 'playwright/.auth/user.json';

// Ensure directories exist
if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR);
if (!fs.existsSync(path.dirname(AUTH_FILE))) fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

const pages = [
  { name: 'home', path: '/' },
  { name: 'login', path: '/login' },
  { name: 'admin-dashboard', path: '/admin' },
  { name: 'admin-products', path: '/admin/Product' },
  { name: 'admin-categories', path: '/admin/Category' },
  { name: 'admin-orders', path: '/admin/Orders' },
  { name: 'admin-logs', path: '/admin/Logs' },
];

async function takeScreenshots() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  console.log('--- Starting Screenshot Process ---');

  // Register a test user via API
  console.log('Registering test user...');
  try {
    const response = await page.request.post('http://localhost:5000/api/auth/register', {
      data: {
        name: 'Admin User',
        email: 'admin@inventrack.com',
        password: 'admin123',
        role: 'Admin'
      }
    });
    const result = await response.json();
    console.log('Registration status:', result.status || 'already exists or failed');
  } catch (err) {
    console.log('Registration error (might already exist):', err.message);
  }

  // 1. Take screenshots of public pages
  for (const p of pages.filter(p => !p.path.startsWith('/admin'))) {
    console.log(`Capturing ${p.name}...`);
    await page.goto(`${BASE_URL}${p.path}`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/${p.name}.png`, fullPage: true });
  }

  // 2. Login to access Admin pages
  console.log('Logging in...');
  await page.goto(`${BASE_URL}/login`);
  
  try {
    await page.fill('input[type="email"]', 'admin@inventrack.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/admin**', { timeout: 10000 });
    console.log('Login successful.');
  } catch (error) {
    console.error('Login failed:', error.message);
  }

  // Save auth state
  await context.storageState({ path: AUTH_FILE });

  // 3. Take screenshots of admin pages
  for (const p of pages.filter(p => p.path.startsWith('/admin'))) {
    console.log(`Capturing ${p.name}...`);
    await page.goto(`${BASE_URL}${p.path}`);
    
    // Wait for content to load (SideBar or specific admin element)
    try {
        await page.waitForLoadState('networkidle');
        // Give it a bit more time for any animations or chart rendering
        await page.waitForTimeout(2000); 
        await page.screenshot({ path: `${SCREENSHOT_DIR}/${p.name}.png`, fullPage: true });
    } catch (err) {
        console.error(`Failed to capture ${p.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('--- Screenshot Process Completed ---');
}

takeScreenshots().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
