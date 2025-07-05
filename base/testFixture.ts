import { test as baseTest} from '@playwright/test';
import SignInPage from '../pages/signInPage';
import HomePage from '../pages/homePage';
import AccountSettingsPage from '../pages/accountSettingsPage';
import AddressesPage from '../pages/addressesPage';
import CreateAccountPage from '../pages/createAccountPage';
import LoginPage from '../pages/loginPage';

type pages = {
    signInpage : SignInPage;
    homePage : HomePage;
    accountSettingsPage: AccountSettingsPage;
    addressesPage: AddressesPage;
    createAccountPage: CreateAccountPage;
    loginPage: LoginPage;
}

const testPages= baseTest.extend<pages>({
    signInpage: async ({page},use) =>{
        await use(new SignInPage(page));
    },

    homePage: async ({page},use) =>{
        await use(new HomePage(page));
    },

    accountSettingsPage: async ({page},use) =>{
        await use(new AccountSettingsPage(page));
    },

    addressesPage: async ({page},use) =>{
        await use(new AddressesPage(page));
    },

    createAccountPage: async ({page},use) =>{
        await use(new CreateAccountPage(page));
    },

    loginPage: async ({page},use) =>{
        await use(new LoginPage(page));
    }

})

export const test = testPages;
export const expect = testPages.expect;