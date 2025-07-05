import { Page, expect } from '@playwright/test';

export default class SignInPage {
    constructor(public page: Page) { }
    async getEmail() {
        return this.page.getByTestId('auth-email');
    }
    async getPassword() {
        return this.page.getByRole('textbox', { name: 'Password' })
    }
    async getSignInButton() {
        return this.page.getByTestId('auth-submit')
    }
    async userSignIn(email: string, password: string, firstName: string) {
        await (await this.getEmail()).fill(email);
        await (await this.getPassword()).fill(password);
        await (await this.getSignInButton()).click();
        await expect(this.page.getByTestId('desktop-header')).toContainText('Hello, ' + firstName);
    }
}