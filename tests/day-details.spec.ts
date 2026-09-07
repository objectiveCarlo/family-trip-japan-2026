import { test, expect } from '@playwright/test';

const DAY_TITLES: Record<number, string> = {
  1: 'Day 1 — Fly in & settle',
  2: 'Day 2 — Kamakura temples',
  3: 'Day 3 — Enoshima island',
  4: 'Day 4 — Move to Tokyo + Asakusa',
  5: 'Day 5 — Harajuku cafés + Pokémon Center',
  6: 'Day 6 — PokéPark KANTO',
  7: 'Day 7 — Shibuya Sky & Kill Bill',
  8: 'Day 8 — Shinjuku (or Mt Takao)',
  9: 'Day 9 — Buffer & farewell dinner',
  10: 'Day 10 — Fly home',
};

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html');
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort());
});

for (const [day, title] of Object.entries(DAY_TITLES)) {
  test(`Day ${day} detail view renders places, stickers and safe links`, async ({ page }) => {
    await page.locator(`tr.data-row[data-day="${day}"]`).click();

    const modal = page.locator('#modal');
    await expect(modal).toBeVisible();
    await expect(modal.locator('h2')).toHaveText(title);
    await expect(modal.locator('.modal-sub', { hasText: 'Places' })).toBeVisible();

    const places = modal.locator('.place');
    const placeCount = await places.count();
    expect(placeCount).toBeGreaterThan(0);

    // Exactly one sticker per place card.
    await expect(modal.locator('.place-art svg')).toHaveCount(placeCount);
    for (let i = 0; i < placeCount; i++) {
      await expect(places.nth(i).locator('.place-name')).not.toBeEmpty();
    }

    // Every outbound link opens in a new tab without leaking the opener.
    const links = modal.locator('.place-links a');
    for (let i = 0; i < (await links.count()); i++) {
      await expect(links.nth(i)).toHaveAttribute('target', '_blank');
      await expect(links.nth(i)).toHaveAttribute('rel', /noopener/);
    }

    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
  });
}

test('Day 3 offers the HALE surf lesson with booking details', async ({ page }) => {
  await page.locator('tr.data-row[data-day="3"]').click();

  const surf = page.locator('.place', { hasText: 'surf lesson at HALE' });
  await expect(surf).toBeVisible();
  await expect(surf.locator('a', { hasText: 'Site' })).toHaveAttribute('href', /vsurf\.net/);
  await expect(surf.locator('.chip', { hasText: '¥7,700' })).toBeVisible();
});

test('Day 5 lists the three Harajuku spots and the corrected Pokémon note', async ({ page }) => {
  await page.locator('tr.data-row[data-day="5"]').click();
  const modal = page.locator('#modal');

  for (const name of [
    'Capyneko Cafe',
    'Harajuku Mame-Shiba Cafe',
    'mofusand TOKYO',
    'Pokémon Center MEGA TOKYO',
  ]) {
    await expect(modal.locator('.place-name', { hasText: name })).toBeVisible();
  }

  await expect(modal).toContainText('Pikachu Sweets');
  await expect(modal).toContainText('Nihonbashi');
  await expect(modal.locator('.chip', { hasText: '¥3,850' })).toBeVisible();
});

test('Day 7 dinner points at the Nishi-Azabu Gonpachi', async ({ page }) => {
  await page.locator('tr.data-row[data-day="7"]').click();
  const gonpachi = page.locator('.place', { hasText: 'Kill Bill restaurant' });
  await expect(gonpachi).toBeVisible();
  await expect(gonpachi).toContainText('Nishi-Azabu');
});
