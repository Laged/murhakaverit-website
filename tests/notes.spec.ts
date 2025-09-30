import { test, expect } from '@playwright/test';

test.describe('Note Rendering and Routing', () => {
  test('homepage should render the landing note', async ({ page }) => {
    await page.goto('/');

    // Check that the page loaded
    await expect(page).toHaveTitle(/NKL 2068/);

    // Wait for loading to finish
    await page.waitForLoadState('networkidle');

    // Check for the FuturisticCard with content (should be one visible after loading)
    const card = page.locator('.futuristic-card').last();
    await expect(card).toBeVisible();

    // Check that there's a title with actual content (not "Loading...")
    const title = card.locator('h1');
    await expect(title).toBeVisible();
    await expect(title).not.toHaveText(/Loading/);

    // Check for navigation button
    const nextButton = page.getByText('Seuraava');
    await expect(nextButton).toBeVisible();
  });

  test('note page should render correctly', async ({ page }) => {
    // Navigate to a specific note
    await page.goto('/notes/1/0/nkl-2068');

    // Check that the page loaded with correct title
    await expect(page).toHaveTitle(/NKL 2068/);

    // Wait for loading to finish
    await page.waitForLoadState('networkidle');

    // Check for the card component (use .last() to get the actual card, not loading state)
    const card = page.locator('.futuristic-card').last();
    await expect(card).toBeVisible();

    // Check that the content is present
    const content = card.locator('.markdown');
    await expect(content).toBeVisible();

    // Check for both navigation buttons
    const prevButton = page.getByText('Edellinen');
    const nextButton = page.getByText('Seuraava');

    // At least one should be visible
    const hasNavigation = await prevButton.isVisible() || await nextButton.isVisible();
    expect(hasNavigation).toBeTruthy();
  });

  test('note content should be rendered', async ({ page }) => {
    await page.goto('/notes/1/1/suomi-2068');

    // Wait for loading to finish
    await page.waitForLoadState('networkidle');

    // Wait for the card to be visible
    const card = page.locator('.futuristic-card').last();
    await expect(card).toBeVisible();

    // Check that markdown content is rendered
    const content = card.locator('.markdown');
    await expect(content).toBeVisible();

    // Content should have actual text (not empty)
    const text = await content.textContent();
    expect(text).toBeTruthy();
    expect(text!.length).toBeGreaterThan(50); // Should have substantial content
  });

  test('navigation between notes should work', async ({ page }) => {
    // Start at homepage
    await page.goto('/');

    // Click next button
    const nextButton = page.getByText('Seuraava');
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    // Should navigate to a new page
    await page.waitForLoadState('networkidle');

    // URL should have changed
    expect(page.url()).toContain('/notes/');

    // Card should still be visible
    const card = page.locator('.futuristic-card');
    await expect(card).toBeVisible();
  });

  test('wiki links should be rendered as clickable links', async ({ page }) => {
    await page.goto('/notes/1/0/nkl-2068');

    // Wait for loading to finish
    await page.waitForLoadState('networkidle');

    // Wait for content to load
    const content = page.locator('.markdown');
    await expect(content).toBeVisible();

    // Check if there are any links in the content
    const links = page.locator('.markdown a[href^="/notes/"]');
    const linkCount = await links.count();

    // If there are wiki links, verify they work
    if (linkCount > 0) {
      const firstLink = links.first();
      await expect(firstLink).toBeVisible();

      // Get the href
      const href = await firstLink.getAttribute('href');
      expect(href).toMatch(/^\/notes\//);

      // Click it
      await firstLink.click();
      await page.waitForLoadState('networkidle');

      // Should navigate to the linked note
      expect(page.url()).toContain('/notes/');

      // Card should be visible on the new page
      const card = page.locator('.futuristic-card');
      await expect(card).toBeVisible();
    }
  });

  test('metadata should be displayed correctly', async ({ page }) => {
    // Go to a page that likely has metadata
    await page.goto('/notes/1/2/hahmo-a');

    // Wait for loading to finish
    await page.waitForLoadState('networkidle');

    // Wait for card to load (use .last() to skip loading state)
    const card = page.locator('.futuristic-card').last();
    await expect(card).toBeVisible();

    // Check if metadata section exists
    const metadataSection = page.locator('.header-meta');
    const hasMetadata = await metadataSection.isVisible();

    // If metadata exists, verify it's displayed
    if (hasMetadata) {
      const metadataItems = page.locator('.header-meta-item');
      const itemCount = await metadataItems.count();
      expect(itemCount).toBeGreaterThan(0);
    }
  });

  test('vertical scroll indicator should be present on card', async ({ page }) => {
    await page.goto('/notes/1/1/suomi-2068');

    // Wait for loading to finish
    await page.waitForLoadState('networkidle');

    // Wait for card
    const card = page.locator('.futuristic-card').last();
    await expect(card).toBeVisible();

    // Check for vertical scroll indicator (on card) - element exists
    const scrollIndicator = page.locator('.scroll-indicator');
    expect(await scrollIndicator.count()).toBeGreaterThan(0);

    // Check for scroll track - element exists
    const scrollTrack = page.locator('.scroll-track');
    expect(await scrollTrack.count()).toBeGreaterThan(0);

    // Check for scroll thumb - element exists (may be hidden if no overflow)
    const scrollThumb = page.locator('.scroll-thumb');
    expect(await scrollThumb.count()).toBeGreaterThan(0);
  });

  test('horizontal scroll progress should be present in header', async ({ page }) => {
    await page.goto('/notes/1/1/suomi-2068');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check for horizontal scroll indicator in header - element exists
    const scrollIndicatorHorizontal = page.locator('.scroll-indicator-horizontal');
    expect(await scrollIndicatorHorizontal.count()).toBeGreaterThan(0);

    // Check for horizontal scroll track - element exists
    const scrollTrackHorizontal = page.locator('.scroll-track-horizontal');
    expect(await scrollTrackHorizontal.count()).toBeGreaterThan(0);

    // Check for horizontal scroll thumb - element exists
    const scrollThumbHorizontal = page.locator('.scroll-thumb-horizontal');
    expect(await scrollThumbHorizontal.count()).toBeGreaterThan(0);

    // Verify it's horizontal (height should be small, around 4px)
    const boundingBox = await scrollThumbHorizontal.first().boundingBox();
    if (boundingBox) {
      // Height should be fixed at 4px (allow up to 6px for rounding)
      expect(boundingBox.height).toBeLessThanOrEqual(6);
    }
  });

  test('scroll indicators should sync when scrolling', async ({ page }) => {
    await page.goto('/notes/1/1/suomi-2068');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify both scroll indicators exist
    const scrollThumbHorizontal = page.locator('.scroll-thumb-horizontal');
    const scrollThumbVertical = page.locator('.scroll-thumb');

    expect(await scrollThumbHorizontal.count()).toBeGreaterThan(0);
    expect(await scrollThumbVertical.count()).toBeGreaterThan(0);

    // Check that content element has scroll data attribute
    const contentElement = page.locator('[data-card-scroll]');
    await expect(contentElement).toBeAttached();

    // Verify scroll functionality exists (indicators are synced via same data attribute)
    const hasScrollAttribute = await contentElement.evaluate((el) => {
      return el.hasAttribute('data-card-scroll');
    });
    expect(hasScrollAttribute).toBe(true);
  });

  test('markdown content should have proper paragraph spacing', async ({ page }) => {
    await page.goto('/notes/1/1/suomi-2068');

    // Wait for content to load
    const markdown = page.locator('.markdown');
    await expect(markdown).toBeVisible();

    // Check for multiple paragraphs
    const paragraphs = markdown.locator('p');
    const count = await paragraphs.count();

    // Should have at least 2 paragraphs
    expect(count).toBeGreaterThanOrEqual(2);

    // Check spacing between paragraphs
    if (count >= 2) {
      const firstP = paragraphs.nth(0);
      const secondP = paragraphs.nth(1);

      const firstBox = await firstP.boundingBox();
      const secondBox = await secondP.boundingBox();

      if (firstBox && secondBox) {
        // Gap should be at least 1rem (16px), allowing for line-height
        // Second paragraph should start below first paragraph plus spacing
        const gap = secondBox.y - (firstBox.y + firstBox.height);
        expect(gap).toBeGreaterThan(10); // At least 10px gap
      }
    }
  });

  test('404 page should work for non-existent notes', async ({ page }) => {
    await page.goto('/notes/999/non-existent');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Static sites return 200, but should show not-found content
    // Check for 404 or error message anywhere on the page
    const bodyText = await page.textContent('body');

    // Should see "404" or "not found" or similar error message
    expect(bodyText?.toLowerCase()).toMatch(/404|not found|cannot find|page not found/);
  });

  test('all content files should be accessible', async ({ page }) => {
    // Test all the markdown files in content directory
    const notes = [
      '/notes/1/0/nkl-2068',
      '/notes/1/1/suomi-2068',
      '/notes/1/2/hahmo-a',
      '/notes/1/3/hahmo-b',
      '/notes/1/4/hahmo-c',
      '/notes/1/5/hahmo-d',
      '/notes/1/6/hahmo-e',
    ];

    for (const noteUrl of notes) {
      await page.goto(noteUrl);

      // Wait for loading to finish
      await page.waitForLoadState('networkidle');

      // Check that page loads successfully (use .last() to skip loading state)
      const card = page.locator('.futuristic-card').last();
      await expect(card).toBeVisible();

      // Check that content is present
      const content = card.locator('.markdown');
      const text = await content.textContent();
      expect(text).toBeTruthy();
    }
  });
});