Overview:
This is a demo automation project using playwright to test account creation and editing fields of Account Settings and Addresses section of website www.stampinup.com.Project is written using Page Object Model concept. Pages folder in framework contains POM files, test data is in JSON format under testData folder, test script test-stampinup.spec.ts is under tests folder. testFixture file is used to create page objects. Playwright report folder contains HTML report. Project uses faker library to generate unique credentials and country-to-iso package to get country ISO codes.

Prerequisites:
npm
node

Execution Steps:
1.Code from GitHub need to be downloaded or cloned using git command
2.Faker library and country to ISO package can be installed using below commands:
npm install --save-dev @faker-js/faker
npm install country-to-iso
4. Tests can be run using command :npx playwright test
5. HTML report can be viewed using command : npx playwright show-report

