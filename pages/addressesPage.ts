import { Page, expect } from '@playwright/test';

export default class AddressesPage {
    constructor(public page: Page) { }
    async getFirstName() {
        return this.page.getByTestId('address-field-first-name');
    }
    async getLastName() {
        return this.page.getByTestId('address-field-last-name');
    }
    async getAddress() {
        return this.page.getByTestId('address.addressLine1');
    }
    async getAddressForm() {
        return this.page.getByTestId('address-form');
    }
    async getZipCodeError() {
        return this.page.getByTestId('error-container-alert');
    }
    async getAddressFieldCityContainer() {
        return this.page.getByTestId('address-field-city-container').getByRole('alert');
    }
    async getAddressFieldRegionContainer() {
        return this.page.getByTestId('address-field-region-container').getByRole('alert');
    }
    async getAddressFieldPostalContainer() {
        return this.page.getByTestId('address-field-postalCode-container').getByRole('alert');
    }
    async getCity() {
        return this.page.getByTestId('address-field-city');
    }
    async selectState(state: string) {
        await this.page.getByTestId('address-field-region-container').getByRole('combobox').locator('div').filter({ hasText: 'State' }).click();
        await this.page.getByTestId('autocomplete-field-div').fill(state.substring(0, 2));
        return this.page.getByText(state);
    }
    async getZipcode() {
        return this.page.getByTestId('address-field-postalCode');
    }
    async getPhoneNumber() {
        return this.page.getByTestId('address-telephone');
    }
    async getDefaultShippingAdddress() {
        return this.page.getByText('Make this my default shipping');
    }
    async getDefaultMailingAdddress() {
        return this.page.getByText('Make this my default mailing');
    }
    async getSaveAddressButton() {
        return this.page.getByTestId('address-save');
    }
    async getCancelAddressButton() {
        return this.page.getByTestId('cancelButton');
    }
    async getAddNewAddressButton() {
        return this.page.getByTestId('btn-create');
    }
    async getEditDefaultShippingAddress() {
        return this.page.getByTestId('address-list-default').getByTestId('addresslist-item-btn-edit');
    }
    async getEditDefaultMailingAddress() {
        return this.page.getByTestId('mailing-address').getByTestId('addresslist-item-btn-edit');
    }
    async getState() {
        return this.page.getByTestId('autocomplete-field-div');
    }
    async addAddressForNewUser(firstName: string, lastName: string, address: string, city: string, state: string, zipCode: string, phoneNumber: string ) {
        await (await this.getFirstName()).fill(firstName);
        await (await this.getLastName()).fill(lastName);
        await (await this.getAddress()).fill(address);
        await (await this.getCity()).fill(city);
        await (await this.selectState(state)).click();
        await (await this.getZipcode()).fill(zipCode);
        await (await this.getPhoneNumber()).fill(phoneNumber);

    }
    async verifyShippingAddress(firstName: string, lastName: string, address: string, city: string, state: string, zipCode: string, phoneNumber: string) {
        await expect(await this.getFirstName()).toHaveValue(firstName);
        await expect(await this.getLastName()).toHaveValue(lastName);
        await expect(await this.getAddress()).toHaveValue(address);
        await expect(await this.getCity()).toHaveValue(city);
        await expect(await this.getState()).toHaveValue(state);
        await expect(await this.getZipcode()).toHaveValue(zipCode);
        await expect(await this.getPhoneNumber()).toHaveValue(phoneNumber);
        await expect(await this.getDefaultShippingAdddress()).toBeChecked();
        await expect(await this.getDefaultMailingAdddress()).toBeChecked();
    }
}