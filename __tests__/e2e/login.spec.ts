import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {

    test("shows email input, password input, and login button", async ({ page }) => {

        await page.goto("/");

        await expect(page.getByPlaceholder("Email")).toBeVisible();
        await expect(page.getByPlaceholder("Password")).toBeVisible();
        await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
    });

    test("shows an error with invalid credentials", async ({page}) => {
        
        await page.goto("/");

        await page.getByPlaceholder("Email").fill("wrong@xample.com");
        await page.getByPlaceholder("Password").fill("wrongpassword");

        await page.getByRole("button", {name: "Login"}).click();

        await expect(page.getByText("Invalid credentials")).toBeVisible()
    });

    test("redirects to dashboard on successful login", async ({page}) => {
        
        await page.goto("/");

        await page.getByPlaceholder("Email").fill("play@right.com");
        await page.getByPlaceholder("Password").fill("asdfjkl;");
        
        await page.getByRole("button", {name: "Login"}).click();

        await expect(page).toHaveURL("/dashboard");
    })

})