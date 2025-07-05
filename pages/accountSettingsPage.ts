import { Page, expect } from '@playwright/test';

export default class AccountSettingsPage {
    constructor(public page: Page) { }
    async getEditContact() {
        return this.page.getByTestId('account-card-contact').getByTestId('edit-contact-setting');
    }
    async getEditContactFirstName() {
        return this.page.getByTestId('account-card-firstName');
    }
    async getEditContactLastName() {
        return this.page.getByTestId('account-card-lastName');
    }
    async getEditContactEmail() {
        return this.page.getByTestId('account-card-email');
    }
    async getEditContactPhoneNumber() {
        return this.page.getByTestId('account-card-phone');
    }
    async getEditContactPreferredContactMethod() {
        return this.page.getByRole('button', { name: 'Preferred Method of Contact' });
    }
    async selectPreferredContactMethod(contactMethod: string) {
        return this.page.getByRole('option', { name: contactMethod }).locator('div').first();
    }
    async getEditContactForm() {
        return this.page.getByTestId('account-card-contact').getByTestId('observer-form');
    }
    async getEditContactBirthDate() {
        return this.page.getByTestId('birthday-date-picker');
    }
    async selectBirthDate(year: string, month: string, day: string) {
        await this.page.getByText(year).click();
        await this.page.getByRole('button', { name: month }).click();
        await this.page.getByRole('button', { name: day, exact: true }).click();
    }
     async verifyEditContact(firstName: string, lastName: string, email: string, preferredContactMethod: string, year: string, month: string, day: string, phoneNumber: string) {
        await expect (await this.page.getByTestId('account-card-firstName')).toHaveValue(firstName);
        await expect(await this.getEditContactLastName()).toHaveValue(lastName);
        await expect (await this.getEditContactEmail()).toHaveValue(email.toLowerCase());
        await expect (await this.getEditContactPhoneNumber()).toHaveValue(phoneNumber);
        await expect(await this.page.getByTestId('observer-form')).toContainText(preferredContactMethod);
        await expect (await this.getEditContactBirthDate()).toHaveValue(`${getMonthNumberFromDateString(month)}/${day}/${year}`); 
    }
    async getSaveChangesButton() {
        return this.page.getByTestId('save-changes');
    }
    async getCancelButton() {
        return this.page.getByTestId('cancel-changes');
    }
    async getEditPassword() {
        return this.page.getByTestId('account-card-password').getByTestId('edit-contact-setting');
    }
    async getEditPasswordForm() {
        return this.page.getByTestId('account-card-password').getByTestId('observer-form');
    }
    async getConfirmCurrentPassword() {
        return this.page.getByTestId('current-password');
    }
    async getPasswordAlert(errorMsg: string) {
        return this.page.getByTestId('account-card-password').getByRole('alert').filter({ hasText: errorMsg });
    }
    async getNewPassword() {
        return this.page.getByRole('textbox', { name: 'New Password', exact: true });
    }
    async getConfirmNewPassword() {
        return this.page.getByRole('textbox', { name: 'Confirm New Password' });
    }
    async getPasswordSaveChangesButton() {
        return this.page.getByTestId('account-card-password').getByTestId('save-changes');
    }
    async getPasswordCancelButton() {
        return this.page.getByTestId('account-card-password').getByTestId('cancel-changes');
    }
    async getEditCountry() {
        return this.page.getByTestId('account-card-country').getByTestId('edit-contact-setting');
    }
    async selectCountry(defaultCountrySelection: string, newCountrySelection) {
        await this.page.getByTestId('account-card-country').getByRole('button', { name: defaultCountrySelection }).click();
        await this.page.getByRole('option', { name: newCountrySelection }).click();
    }
    async getPreferredLanguage() {
        return this.page.getByTestId('observer-form').getByTestId('secondaryLanguage');
    }
    async getSaveChangesConfirmButton() {
        return this.page.getByTestId('confirm-dialog-btn-confirm');
    }
    async verifyCountrySelection(newCountrySelection: string) {
        await expect(this.page.getByTestId('account-card-country')).toContainText(newCountrySelection);
        await expect(this.page.getByTestId('desktop-header')).toContainText(newCountrySelection);
    }
    async updateContact(preferredContactMethod: string, year: string, month: string, day: string, phoneNumber: string) {
        await (await this.getEditContactPhoneNumber()).fill(phoneNumber);
        await (await this.getEditContactPreferredContactMethod()).click();
        await (await this.selectPreferredContactMethod(preferredContactMethod)).click();
        await (await this.getEditContactBirthDate()).click();
        await this.selectBirthDate(year, month, day);
    }
    async verifyContact(firstName: string, lastName: string, email: string, preferredContactMethod: string, year: string, month: string, day: string, phoneNumber: string) {
        await expect(this.page.getByTestId('account-card-contact')).toContainText('First Name: ' + firstName);
        await expect(this.page.getByTestId('account-card-contact')).toContainText('Last Name: ' + lastName);
        await expect(this.page.getByTestId('account-card-contact')).toContainText('Email: ' + (email.toLowerCase()))
        await expect(this.page.getByTestId('account-card-contact')).toContainText('Preferred Method of Contact: ' + preferredContactMethod);
        await expect(this.page.getByTestId('account-card-contact')).toContainText('Phone Number: ' + phoneNumber);
        await expect(await this.getEditContactBirthDate()).toHaveValue(`${getMonthNumberFromDateString(month)}/${day}/${year}`);
    }
}

function getMonthNumberFromDateString(monthName) {
    // Create a dummy date string to parse
    const dateString = `${monthName} 1, 2000`;
    const date = new Date(dateString);
    return date.getMonth() + 1; // Add 1 as getMonth() is zero-indexed
}
