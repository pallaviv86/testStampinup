import { Page } from '@playwright/test';

export default class HomePage {
    constructor(public page: Page) { }
    async getUserProfile(username: string) {
        return this.page.getByRole('button', { name: 'Hello ,  '+username});
    }
    async getAccountSettings() {
        return this.page.getByRole('menuitem', { name: 'Account Settings' });  
    }
    async getAddresses() {
        return this.page.getByRole('menuitem', { name: 'Addresses' });   
    }
    async getMayBeLaterOnRewards() {
        return this.page.getByRole('button', { name: 'Maybe Later' });
    }
    async getCloseButtonOnRewards() {
        return this.page.getByTestId('confirm-dialog').locator('button').filter({ hasText: 'Close' });
    }
    async getSignout() {
        return this.page.getByTestId('auth-logout');   
    }
}