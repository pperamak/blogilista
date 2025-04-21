const { test, describe, expect } = require('@playwright/test')

describe('Bloglist', () => {
  test('login page can be opened', async ({ page }) => {
    await page.goto('http://localhost:3003')
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
  })
})