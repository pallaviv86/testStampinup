import { test, expect } from '../base/testFixture';
import userDetails from '../testData/userDetails.json';
import { faker } from '@faker-js/faker';
import user1Details from '../testData/user1Details.json';
import invalidUserDetails from '../testData/invalidUserDetails.json';
import { countryToAlpha2 } from 'country-to-iso';

let firstName;
let lastName;
let email;
let password;
let newEmail;
let newPassword;

test.describe('New user login tests', () => {
    test.beforeEach(async ({ page, baseURL, createAccountPage, loginPage, homePage }) => {
        // Generate new user credentials and save
        firstName = faker.person.firstName();
        lastName = faker.person.lastName();
        email = faker.internet.email();
        password = faker.internet.password();
        newEmail = faker.internet.email();
        newPassword = faker.internet.password();

        // New user account creation
        await page.goto(`${baseURL}`);
        await (await loginPage.getSignIn()).click();
        await (await loginPage.getCreateAccount()).click();
        await createAccountPage.createAccount(firstName, lastName, email, password);
        await (await homePage.getMayBeLaterOnRewards()).click();
        await (await homePage.getCloseButtonOnRewards()).click();
        await (await homePage.getUserProfile(firstName)).click();

    });

    test('Verify setting up the initial user profile with valid data under account settings for a new user', async ({ accountSettingsPage, homePage }) => {
        await (await homePage.getAccountSettings()).click();
        await (await accountSettingsPage.getEditContact()).click();
        await accountSettingsPage.updateContact(userDetails.preferredContactMethod, userDetails.year, userDetails.month, userDetails.day, userDetails.phoneNumber)
        await (await accountSettingsPage.getSaveChangesButton()).click();
        await (await accountSettingsPage.getEditContact()).click();
        await accountSettingsPage.verifyEditContact(firstName, lastName, email, userDetails.preferredContactMethod, userDetails.year, userDetails.month, userDetails.day, userDetails.phoneNumber);
    });

    test('Verify system shows appropriate error message for invalid data in the contact section under account settings', async ({ accountSettingsPage, homePage }) => {
        await (await homePage.getAccountSettings()).click();
        await (await accountSettingsPage.getEditContact()).click();
        await (await accountSettingsPage.getEditContactPhoneNumber()).fill(invalidUserDetails.phoneNumber);
        await (await accountSettingsPage.getSaveChangesButton()).click();
        await expect(await accountSettingsPage.getEditContactForm()).toContainText('The Phone Number field must be at least 10 characters long.');
    });

    test('Verify setting up valid address for a new user', async ({ addressesPage, homePage }) => {
        await (await homePage.getAddresses()).click();
        await addressesPage.addAddressForNewUser(firstName, lastName, userDetails.address, userDetails.city, userDetails.state, userDetails.zipCode, userDetails.phoneNumber);
        await (await addressesPage.getDefaultMailingAdddress()).click();
        await (await addressesPage.getDefaultShippingAdddress()).click();
        await (await addressesPage.getSaveAddressButton()).click();
        await (await addressesPage.getEditDefaultShippingAddress()).click();
        await addressesPage.verifyShippingAddress(firstName, lastName, userDetails.address, userDetails.city, userDetails.state, userDetails.zipCode, userDetails.phoneNumber);
        await (await addressesPage.getCancelAddressButton()).click();
        await (await addressesPage.getEditDefaultMailingAddress()).click();
        await addressesPage.verifyShippingAddress(firstName, lastName, userDetails.address, userDetails.city, userDetails.state, userDetails.zipCode, userDetails.phoneNumber);
        await (await addressesPage.getCancelAddressButton()).click();
    });

    test('Verify system shows appropriate error message for invalid data in address', async ({ addressesPage, homePage }) => {
        await (await homePage.getAddresses()).click();
        //verify required fields
        await (await addressesPage.getSaveAddressButton()).click();
        await expect(await addressesPage.getAddressForm()).toContainText('The First Name field is required.');
        await expect(await addressesPage.getAddressForm()).toContainText('The Last Name field is required.');
        await expect(await addressesPage.getAddressFieldCityContainer()).toContainText('The City field is required.');
        await expect(await addressesPage.getAddressFieldRegionContainer()).toContainText('The State field is required.');
        await expect(await addressesPage.getAddressFieldPostalContainer()).toContainText('The Zip Code field is required.');
        await expect(await addressesPage.getAddressForm()).toContainText('The Phone Number field is required.');
        //verify invalid or incorrect zipcode
        await (await addressesPage.getAddress()).fill(userDetails.address);
        await (await addressesPage.getCity()).fill(userDetails.city);
        await (await addressesPage.selectState(userDetails.state)).click();
        await (await addressesPage.getZipcode()).fill("12");
        await (await addressesPage.getSaveAddressButton()).click();
        await expect(await addressesPage.getAddressFieldPostalContainer()).toContainText('The Zip Code field must be at least 5 characters long.');
        await (await addressesPage.getZipcode()).fill("12345");
        await (await addressesPage.getFirstName()).fill(firstName);
        await (await addressesPage.getLastName()).fill(lastName);
        await (await addressesPage.getPhoneNumber()).fill(userDetails.phoneNumber);
        await (await addressesPage.getSaveAddressButton()).click();
        await expect(await addressesPage.getZipCodeError()).toContainText('The ZIP Code is not correct for this address. Please enter the address again using the correct ZIP Code.');
    });

    test('Verify setting up new address under other saved addresses for a new user', async ({ addressesPage, homePage, page }) => {
        await (await homePage.getAddresses()).click();
        await addressesPage.addAddressForNewUser(firstName, lastName, userDetails.address, userDetails.city, userDetails.state, userDetails.zipCode, userDetails.phoneNumber);
        await (await addressesPage.getDefaultMailingAdddress()).click();
        await (await addressesPage.getDefaultShippingAdddress()).click();
        await (await addressesPage.getSaveAddressButton()).click();

        await (await addressesPage.getAddNewAddressButton()).click();
        await addressesPage.addAddressForNewUser(firstName + "new", lastName + "new", user1Details.address, user1Details.city, user1Details.state, user1Details.zipCode, user1Details.phoneNumber);
        await (await addressesPage.getSaveAddressButton()).click();

        await expect(page.getByTestId('address-list-nondefault').getByTestId('addresslist-row-0')).toContainText(firstName + "new" + " " + lastName + "new");
        await expect(page.getByTestId('address-list-nondefault').getByTestId('addresslist-row-1')).toContainText(user1Details.address);
        await expect(page.getByTestId('address-list-nondefault').getByTestId('addresslist-row-2')).toContainText(user1Details.city + " " + (user1Details.state.substring(0, 2).toUpperCase()) + " " + user1Details.zipCode);
        await expect(page.getByTestId('address-list-nondefault').getByTestId('addresslist-item-country')).toContainText((countryToAlpha2(userDetails.country)) as string);
        await expect(page.getByTestId('address-list-nondefault').getByTestId('addresslist-item-phone')).toContainText(user1Details.phoneNumber);

    });

});

test.describe('Existing user login tests', () => {
    test.beforeEach(async ({ page, baseURL, createAccountPage, loginPage, homePage, signInpage }) => {
        // Generate new user credentials and save
        firstName = faker.person.firstName();
        lastName = faker.person.lastName();
        email = faker.internet.email();
        password = faker.internet.password();
        newEmail = faker.internet.email();
        newPassword = faker.internet.password();

        // New user account creation
        await page.goto(`${baseURL}`);
        await (await loginPage.getSignIn()).click();
        await (await loginPage.getCreateAccount()).click();
        await createAccountPage.createAccount(firstName, lastName, email, password);
        await (await homePage.getMayBeLaterOnRewards()).click();
        await (await homePage.getCloseButtonOnRewards()).click();
        await (await homePage.getUserProfile(firstName)).click();
        await (await homePage.getSignout()).click();
        //Sign-in with created user
        await (await loginPage.getSignIn()).click();
        await signInpage.userSignIn(email, password, firstName);
    });


    test('Verify an existing user signing in and editing the fields of contact with valid data under account settings', async ({ accountSettingsPage, homePage, loginPage, baseURL, signInpage, page }) => {
        await (await homePage.getUserProfile(firstName)).click();
        await (await homePage.getAccountSettings()).click();
        await (await accountSettingsPage.getEditContact()).click();
        await (await accountSettingsPage.getEditContactFirstName()).fill(firstName + "test");
        await (await accountSettingsPage.getEditContactLastName()).fill(lastName + "test");
        await (await accountSettingsPage.getEditContactEmail()).fill(newEmail.toLowerCase());
        await accountSettingsPage.updateContact(user1Details.preferredContactMethod, user1Details.year, user1Details.month, user1Details.day, user1Details.phoneNumber)
        await (await accountSettingsPage.getSaveChangesButton()).click();

        await (await accountSettingsPage.getEditContact()).click();
        await accountSettingsPage.verifyEditContact(firstName + "test", lastName + "test", newEmail, user1Details.preferredContactMethod, user1Details.year, user1Details.month, user1Details.day, user1Details.phoneNumber);
    });

    test('Verify system shows appropriate error message for the invalid data in contact section under account settings', async ({ accountSettingsPage, homePage, loginPage, baseURL, signInpage, page }) => {
        await (await homePage.getUserProfile(firstName)).click();
        await (await homePage.getAccountSettings()).click();
        //Verify invalid email error
        await (await accountSettingsPage.getEditContact()).click();
        await (await accountSettingsPage.getEditContactEmail()).fill(invalidUserDetails.email);
        await (await accountSettingsPage.getSaveChangesButton()).click();
        await expect(await accountSettingsPage.getEditContactForm()).toContainText('The Email Address field must be a valid email');
        //Verify required fields
        await (await accountSettingsPage.getEditContactFirstName()).fill(" ");
        await (await accountSettingsPage.getEditContactLastName()).fill(" ");
        await (await accountSettingsPage.getEditContactEmail()).fill(" ");
        await (await accountSettingsPage.getSaveChangesButton()).click();
        await expect(await accountSettingsPage.getEditContactForm()).toContainText('The First Name field is required.');
        await expect(await accountSettingsPage.getEditContactForm()).toContainText('The Last Name field is required.');
        await expect(await accountSettingsPage.getEditContactForm()).toContainText('The Email Address field is required.');
    });


    test('Verify an existing user signing in and edit password under account settings ', async ({ accountSettingsPage, homePage, page, baseURL, loginPage, signInpage }) => {
        await (await homePage.getUserProfile(firstName)).click();
        await (await homePage.getAccountSettings()).click();
        await (await accountSettingsPage.getEditPassword()).click();
        await (await accountSettingsPage.getConfirmCurrentPassword()).fill(password);
        await (await accountSettingsPage.getNewPassword()).fill(newPassword);
        await (await accountSettingsPage.getConfirmNewPassword()).fill(newPassword);
        await (await accountSettingsPage.getPasswordSaveChangesButton()).click();
        await (await homePage.getUserProfile(firstName)).click();
        await (await homePage.getSignout()).click();
        //Re-login to verify password change
        await (await loginPage.getSignIn()).click();
        await signInpage.userSignIn(email, newPassword, firstName);
    });

    test('Verify system shows appropriate error message for invalid password update under account settings', async ({ accountSettingsPage, homePage, page, loginPage, baseURL, signInpage }) => {
        await (await homePage.getUserProfile(firstName)).click();
        await (await homePage.getAccountSettings()).click();
        await (await accountSettingsPage.getEditPassword()).click();
        await (await accountSettingsPage.getConfirmCurrentPassword()).fill(password);
        //Blank data
        await (await accountSettingsPage.getConfirmCurrentPassword()).fill(" ");
        await (await accountSettingsPage.getNewPassword()).fill(" ");
        await (await accountSettingsPage.getConfirmNewPassword()).fill(" ");
        await expect(page.getByRole('alert').filter({ hasText: 'The Confirm Current Password' })).toContainText('The Confirm Current Password field is required.');
        await expect(await accountSettingsPage.getEditPasswordForm()).toContainText('The Password field is required.');
        await expect(await accountSettingsPage.getPasswordAlert('The Password field is required.')).toContainText('The Password field is required.');
        //Weak, Good and Strong data for new password field
        await (await accountSettingsPage.getNewPassword()).fill(invalidUserDetails.weakPassword);
        await expect(await accountSettingsPage.getEditPasswordForm()).toContainText('The Password field must be at least 8 characters long.');
        await expect(await accountSettingsPage.getEditPasswordForm()).toContainText('Weak');

        await (await accountSettingsPage.getNewPassword()).fill(invalidUserDetails.goodPassword);
        await expect(await accountSettingsPage.getEditPasswordForm()).toContainText('Good');

        await (await accountSettingsPage.getNewPassword()).fill(invalidUserDetails.strongPassword);
        await expect(await accountSettingsPage.getEditPasswordForm()).toContainText('Strong');
        //Invalid data
        await (await accountSettingsPage.getConfirmNewPassword()).fill(invalidUserDetails.confirmNewPassword);
        await (await accountSettingsPage.getPasswordSaveChangesButton()).click();
        await expect(await accountSettingsPage.getPasswordAlert('The Password field confirmation does not match.')).toContainText('The Password field confirmation does not match.');
        //Invalid current password - BUG- Error message is not consistant with the data provided.
        await (await accountSettingsPage.getConfirmCurrentPassword()).fill(invalidUserDetails.password);
        await (await accountSettingsPage.getNewPassword()).fill(invalidUserDetails.goodPassword);
        await (await accountSettingsPage.getConfirmNewPassword()).fill(invalidUserDetails.goodPassword);
        await (await accountSettingsPage.getPasswordSaveChangesButton()).click();
        await expect(page.getByRole('paragraph')).toContainText('Password must have a minimum of 8 characters with at least one capital letter and one number.');
    });

    test('Verify an existing user signing in and edit country information under account settings', async ({ accountSettingsPage, homePage, loginPage, baseURL, signInpage, page }) => {
        await (await homePage.getUserProfile(firstName)).click();
        await (await homePage.getAccountSettings()).click();
        await (await accountSettingsPage.getEditCountry()).click();
        await accountSettingsPage.selectCountry(userDetails.country, user1Details.country);
        await expect(await accountSettingsPage.getPreferredLanguage()).toHaveValue(user1Details.preferredLanguage);
        await (await accountSettingsPage.getSaveChangesButton()).click();
        await (await accountSettingsPage.getSaveChangesConfirmButton()).click();
        await accountSettingsPage.verifyCountrySelection(user1Details.country);
    });

    test('Verify user can edit address ', async ({ addressesPage, homePage }) => {
        await (await homePage.getUserProfile(firstName)).click();
        await (await homePage.getAddresses()).click();
        await addressesPage.addAddressForNewUser(firstName, lastName, userDetails.address, userDetails.city, userDetails.state, userDetails.zipCode, userDetails.phoneNumber);
        await (await addressesPage.getDefaultMailingAdddress()).click();
        await (await addressesPage.getDefaultShippingAdddress()).click();
        await (await addressesPage.getSaveAddressButton()).click();
        await (await addressesPage.getEditDefaultShippingAddress()).click();
        await addressesPage.addAddressForNewUser(firstName+"edit", lastName+"edit", user1Details.address, user1Details.city, user1Details.state, user1Details.zipCode, user1Details.phoneNumber);
        await (await addressesPage.getSaveAddressButton()).click();
        await (await addressesPage.getEditDefaultShippingAddress()).click();
        await addressesPage.verifyShippingAddress(firstName+"edit", lastName+"edit", user1Details.address, user1Details.city, user1Details.state, user1Details.zipCode, user1Details.phoneNumber);
        await (await addressesPage.getCancelAddressButton()).click();
        await (await addressesPage.getEditDefaultMailingAddress()).click();
        await addressesPage.verifyShippingAddress(firstName+"edit", lastName+"edit", user1Details.address, user1Details.city, user1Details.state, user1Details.zipCode, user1Details.phoneNumber);
        await (await addressesPage.getCancelAddressButton()).click();
       
});

});







