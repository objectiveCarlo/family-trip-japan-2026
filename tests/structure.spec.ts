import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html');
});

test('title and hero describe a 9-person trip', async ({ page }) => {
  await expect(page).toHaveTitle('Japan Trip 2026 — 9 Pax');
  await expect(page.locator('.hero-title')).toHaveText('Japan 2026');
  await expect(page.locator('.hero-sub')).toContainText('9 people');
});

test('itinerary has 10 day rows and 3 section rows', async ({ page }) => {
  await expect(page.locator('tr.data-row')).toHaveCount(10);
  await expect(page.locator('tr.section-row')).toHaveCount(3);
  for (let d = 1; d <= 10; d++) {
    await expect(page.locator(`tr.data-row[data-day="${d}"]`)).toHaveCount(1);
  }
});

test('every day row is a focusable button with a details affordance', async ({ page }) => {
  const rows = page.locator('tr.data-row');
  const count = await rows.count();
  expect(count).toBe(10);
  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    await expect(row).toHaveAttribute('role', 'button');
    await expect(row).toHaveAttribute('tabindex', '0');
    await expect(row).toHaveAttribute('aria-label', /^Day \d+ details$/);
    await expect(row.locator('.more-link')).toHaveText('Details ›');
  }
});

test('sections render itinerary-first, decisions and must-eat last', async ({ page }) => {
  // textContent (not innerText) so a CSS text-transform can't skew the match.
  const labels = (await page.locator('.section-label').allTextContents())
    .map((t) => t.replace(/\s+/g, ' ').trim());
  expect(labels).toEqual([
    '🗺 Trip Route',
    '📅 Full Itinerary',
    '⚡ Decisions & Reminders',
    '🍜 Must-Eat List',
  ]);
});

test('the day detail modal is present but empty on load', async ({ page }) => {
  await expect(page.locator('#modal')).toBeHidden();
  await expect(page.locator('#modalBody')).toBeAttached();
});
