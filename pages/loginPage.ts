import { Page } from '@playwright/test';

export default class LoginPage {
    constructor(public page: Page) { }
    async getSignIn() {
        return this.page.getByTestId('menu-user-btn-signin')
    }
    async getCreateAccount() {
       return this.page.getByTestId('btn-create-account');
    }
 }