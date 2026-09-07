import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html');
  // Never let a stray click reach the network.
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort());
});

test('a day opens its detail modal as an accessible dialog', async ({ page }) => {
  await page.locator('tr.data-row[data-day="5"]').click();

  const modal = page.locator('#modal');
  const dialog = page.locator('#modalBody');
  await expect(modal).toBeVisible();
  await expect(dialog).toHaveAttribute('role', 'dialog');
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  await expect(dialog.locator('h2')).toHaveText('Day 5 — Harajuku cafés + Pokémon Center');
});

test('opening locks background scroll and closing restores it', async ({ page }) => {
  await page.locator('tr.data-row[data-day="2"]').click();
  await expect(page.locator('#modal')).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');

  await page.keyboard.press('Escape');
  await expect(page.locator('#modal')).toBeHidden();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('the ✕ button closes the modal', async ({ page }) => {
  await page.locator('tr.data-row[data-day="1"]').click();
  await expect(page.locator('#modal')).toBeVisible();
  await page.locator('.modal-close').click();
  await expect(page.locator('#modal')).toBeHidden();
});

test('backdrop click closes, card click does not', async ({ page }) => {
  await page.locator('tr.data-row[data-day="3"]').click();
  const modal = page.locator('#modal');

  // Click inside the card — must stay open.
  await page.locator('#modalBody .modal-blurb').click();
  await expect(modal).toBeVisible();

  // Click the backdrop (top-left padding area of the overlay) — must close.
  await modal.click({ position: { x: 5, y: 5 } });
  await expect(modal).toBeHidden();
});

test('focus enters the modal on open and returns to the row on close', async ({ page }) => {
  const row = page.locator('tr.data-row[data-day="7"]');
  await row.click();
  await expect(page.locator('.modal-close')).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(row).toBeFocused();
});

test('Enter and Space activate a focused day row', async ({ page }) => {
  const row = page.locator('tr.data-row[data-day="6"]');

  await row.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#modal')).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.locator('#modal')).toBeHidden();

  await row.focus();
  await page.keyboard.press(' ');
  await expect(page.locator('#modal')).toBeVisible();
});

test('opening a second day replaces the modal contents', async ({ page }) => {
  await page.locator('tr.data-row[data-day="4"]').click();
  await expect(page.locator('#modalBody h2')).toHaveText('Day 4 — Move to Tokyo + Asakusa');

  await page.keyboard.press('Escape');
  await page.locator('tr.data-row[data-day="8"]').click();
  await expect(page.locator('#modalBody h2')).toHaveText('Day 8 — Shinjuku (or Mt Takao)');
});

test('a Map link inside the table does not trigger the row handler', async ({ page }) => {
  const link = page.locator('tr.data-row[data-day="1"] .stay-note a');
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /noopener/);

  await link.click();
  await expect(page.locator('#modal')).toBeHidden();
});
