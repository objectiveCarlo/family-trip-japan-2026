import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html');
});

test('the trip is for 9, never 10', async ({ page }) => {
  await expect(page).not.toHaveTitle(/10 Pax/);
  await expect(page.locator('.footer')).toContainText('9 人');
  await expect(page.locator('.footer')).not.toContainText('10 人');
  await expect(page.locator('.table-wrap')).not.toContainText('for all 10');
});

test('PokéPark sits on Day 6 / Oct 1', async ({ page }) => {
  const day6 = page.locator('tr.data-row[data-day="6"]');
  await expect(day6).toContainText('Oct 1');
  await expect(day6).toContainText('PokéPark KANTO at Yomiuriland');
  await expect(page.locator('tr.data-row[data-day="5"]')).not.toContainText('PokéPark KANTO at Yomiuriland');
});

test('the Kamakura stay is three nights', async ({ page }) => {
  await expect(page.locator('tr.data-row[data-day="1"] .stay-pill')).toHaveText('3 nights');
});

test('the Ikebukuro note is Pikachu Sweets, not the Nihonbashi café', async ({ page }) => {
  const day5 = page.locator('tr.data-row[data-day="5"]');
  await expect(day5).toContainText('Pikachu Sweets');
  await expect(day5).not.toContainText('Pokémon Café next door');
});

test('the HALE surf lesson is offered on Day 3', async ({ page }) => {
  await expect(page.locator('tr.data-row[data-day="3"]')).toContainText('surf lesson at HALE');
});

test('both airbnbs are marked booked in Decisions', async ({ page }) => {
  const decisions = page.locator('.decisions-grid');
  await expect(decisions.locator('.decision-title', { hasText: 'Both Airbnbs' })).toBeVisible();
  await expect(decisions).toContainText('Horikiri, Katsushika');
  await expect(decisions).toContainText('Koshigoe, Kamakura');
});
