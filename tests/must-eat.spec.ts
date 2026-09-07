import { test, expect } from '@playwright/test';

const SPOTS = [
  'Kura Sushi',
  'Uobei Shibuya',
  'Ippudo',
  'AFURI',
  'Tonchin',
  'bills Shichirigahama',
  'CoCo Ichibanya',
  'Tsukiji Outer Market',
];

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html');
});

test('there are 8 must-eat cards, each with name, tag and a safe Maps link', async ({ page }) => {
  const cards = page.locator('.eat-card');
  await expect(cards).toHaveCount(8);

  for (let i = 0; i < 8; i++) {
    const card = cards.nth(i);
    await expect(card.locator('.eat-name')).not.toBeEmpty();
    await expect(card.locator('.eat-tag')).not.toBeEmpty();

    const link = card.locator('a');
    await expect(link).toHaveAttribute('href', /google\.com\/maps/);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  }
});

test('all of the intended spots are listed', async ({ page }) => {
  const grid = page.locator('.eats-grid');
  for (const name of SPOTS) {
    await expect(grid.locator('.eat-name', { hasText: name })).toBeVisible();
  }
});

test('the ramen picks are alternatives to Ichiran, with no Ichiran card', async ({ page }) => {
  await expect(page.locator('.eats-grid .eat-name', { hasText: 'Ichiran' })).toHaveCount(0);
  // the intent is spelled out on the Ippudo card
  await expect(page.locator('.eat-card', { hasText: 'Ippudo' })).toContainText('not Ichiran');
});
