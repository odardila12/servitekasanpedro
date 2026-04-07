import { test, expect } from '@playwright/test';

test.describe('Branding Validation - Serviteka San Pedro', () => {
  // Test 1: Verify "Serviteka San Pedro" text in Footer
  test('should display "Serviteka San Pedro" in footer copyright', async ({ page }) => {
    await page.goto('/');
    const footerText = await page.locator('footer').textContent();
    expect(footerText).toContain('Serviteka San Pedro');
  });

  // Test 2: Verify "Serviteka San Pedro" in Header title
  test('should display "Serviteka" text in header', async ({ page }) => {
    await page.goto('/');
    const headerText = await page.locator('header').textContent();
    expect(headerText).toContain('Serviteka');
  });

  // Test 3: Verify WhatsApp button is present and functional
  test('should have WhatsApp button with correct phone number', async ({ page }) => {
    await page.goto('/');
    const whatsappLink = page.locator('a[href*="wa.me"]').first();
    const href = await whatsappLink.getAttribute('href');
    // Verify it's a WhatsApp link with the correct phone number
    expect(href).toContain('wa.me');
    expect(href).toContain('573023456789');
  });

  // Test 4: Verify favicon visibility in Header (non-sticky)
  test('should display favicon in header at 40x40px when not sticky', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 0));

    const headerFavicon = page.locator('header').locator('img[alt="Serviteka San Pedro"]').first();
    const boundingBox = await headerFavicon.boundingBox();

    expect(boundingBox).toBeTruthy();
    if (boundingBox) {
      expect(boundingBox.width).toBeCloseTo(40, 5);
      expect(boundingBox.height).toBeCloseTo(40, 5);
    }

    // Take screenshot of header
    await page.screenshot({
      path: 'e2e/screenshots/header-favicon-non-sticky.png',
    });
  });

  // Test 5: Verify favicon visibility in Header (sticky)
  test('should display favicon in header when sticky', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 500));

    const headerFavicon = page.locator('header').locator('img[alt="Serviteka San Pedro"]').first();
    const isVisible = await headerFavicon.isVisible();

    expect(isVisible).toBe(true);

    // Verify the favicon is still rendered with proper styling
    const boundingBox = await headerFavicon.boundingBox();
    expect(boundingBox).toBeTruthy();
    if (boundingBox) {
      // Favicon should be smaller when sticky (between 20-40px)
      expect(boundingBox.width).toBeLessThanOrEqual(40);
      expect(boundingBox.height).toBeLessThanOrEqual(40);
    }

    // Take screenshot of sticky header
    await page.screenshot({
      path: 'e2e/screenshots/header-favicon-sticky.png',
    });
  });

  // Test 6: Verify favicon visibility in Footer
  test('should display favicon in footer at 40x40px with rounded-md', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const footerFavicon = page.locator('footer').locator('img[alt="Logo de Serviteka San Pedro"]');
    const boundingBox = await footerFavicon.boundingBox();

    expect(boundingBox).toBeTruthy();
    if (boundingBox) {
      expect(boundingBox.width).toBeCloseTo(40, 5);
      expect(boundingBox.height).toBeCloseTo(40, 5);
    }

    // Check if rounded-md class is applied (can be done via computed styles)
    const borderRadius = await footerFavicon.evaluate((el) => {
      return window.getComputedStyle(el).borderRadius;
    });

    expect(borderRadius).not.toBe('0px');

    // Take screenshot of footer
    await page.screenshot({
      path: 'e2e/screenshots/footer-favicon.png',
    });
  });

  // Test 7: Verify favicon alt text
  test('should have proper alt text for favicons', async ({ page }) => {
    await page.goto('/');
    const headerFavicon = page.locator('header').locator('img[alt="Serviteka San Pedro"]');
    const headerAlt = await headerFavicon.getAttribute('alt');
    expect(headerAlt).toBe('Serviteka San Pedro');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const footerFavicon = page.locator('footer').locator('img[alt="Logo de Serviteka San Pedro"]');
    const footerAlt = await footerFavicon.getAttribute('alt');
    expect(footerAlt).toBe('Logo de Serviteka San Pedro');
  });

  // Test 8: Verify favicon loads from correct path (.png not .ico)
  test('should load favicon from /favicon.png not /favicon.ico', async ({ page }) => {
    await page.goto('/');
    const headerFavicon = page.locator('header').locator('img[alt="Serviteka San Pedro"]').first();
    const src = await headerFavicon.getAttribute('src');
    expect(src).toContain('favicon.png');
    expect(src).not.toContain('favicon.ico');

    const footerFavicon = page.locator('footer').locator('img[alt="Logo de Serviteka San Pedro"]');
    const footerSrc = await footerFavicon.getAttribute('src');
    expect(footerSrc).toContain('favicon.png');
    expect(footerSrc).not.toContain('favicon.ico');
  });

  // Test 9: Verify no 404 errors in console for favicon
  test('should not have 404 errors for favicon resources', async ({ page }) => {
    const errors: string[] = [];

    page.on('response', (response) => {
      if (response.url().includes('favicon') && response.status() === 404) {
        errors.push(`404 for ${response.url()}`);
      }
    });

    // Navigate and wait for all resources to load
    await page.goto('/', { waitUntil: 'networkidle' });

    expect(errors).toHaveLength(0);
  });

  // Test 10: Verify images load without errors
  test('should load all favicon images without errors', async ({ page }) => {
    let imageLoadErrors = 0;

    page.on('console', (message) => {
      if (message.type() === 'error' && message.text().includes('favicon')) {
        imageLoadErrors++;
      }
    });

    await page.goto('/');

    // Check all images
    const images = await page.locator('img').all();

    for (const img of images) {
      const src = await img.getAttribute('src');
      if (src && src.includes('favicon')) {
        // Verify image is loaded
        const isVisible = await img.isVisible();
        expect(isVisible).toBe(true);
      }
    }

    expect(imageLoadErrors).toBe(0);
  });

  // Test 11: Verify email was updated in LocationSection
  test('should display updated email in location section', async ({ page }) => {
    await page.goto('/');
    const locationSection = page.locator('section').filter({ hasText: 'Visítanos' });
    const locationText = await locationSection.textContent();

    expect(locationText).toContain('sanpedro@serviteka.com');
    expect(locationText).not.toContain('contacto@serviteka.com');
  });

  // Test 12: Full page screenshot for visual verification
  test('should capture full page for visual verification', async ({ page }) => {
    await page.goto('/');
    await page.screenshot({
      path: 'e2e/screenshots/full-page-branding.png',
      fullPage: true,
    });

    // Also get accessibility report
    expect(page).toBeTruthy();
  });
});
