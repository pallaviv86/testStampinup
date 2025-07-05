import { Page , expect} from '@playwright/test';

export default class CreateAccountPage {
    constructor(public page: Page) { }
    async getFirstName() {
        return this.page.getByTestId('reg-first-name');    
    }
     async getLastName() {
        return this.page.getByTestId('reg-last-name');    
    }
    async getEmail() {
        return this.page.getByTestId('reg-email');
    }
    async getPassword() {
        return this.page.getByRole('textbox', { name: 'Password', exact: true });
    }
    async getConfirmPassword() {
        return this.page.getByRole('textbox', { name: 'Confirm Password' });
    }
    async getCreateAccountButton() {
        return this.page.getByTestId('reg-submit');
    }
    async createAccount(firstName: string, lastName: string, email: string, password: string) {
        await (await (this.getFirstName())).fill(firstName);
        await(await this.getLastName()).fill(lastName);
        await(await this.getEmail()).fill(email);
        await(await this.getPassword()).fill(password);
        await(await this.getConfirmPassword()).fill(password);
        await(await this.getCreateAccountButton()).click();
        await expect(await this.page.getByTestId('desktop-header')).toContainText('Hello, ' + firstName);
    }
}