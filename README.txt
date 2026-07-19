COMPANY PRIORITY NAVIGATOR - NETLIFY PACKAGE

CONTENTS
- index.html: questionnaire website
- assets/: ITSB Corporation and business-unit logos
- netlify.toml: Netlify deployment configuration
- netlify/functions/responses.mjs: secure Google Sheets proxy

IMPORTANT
Deploy this folder through a Git repository connected to Netlify, or through
the Netlify CLI. A static drag-and-drop deployment may not deploy the Function.

NETLIFY ENVIRONMENT VARIABLES
Open Project configuration > Environment variables and add:

1. GOOGLE_APPS_SCRIPT_URL
   Your Google Apps Script Web App URL ending in /exec.

2. GOOGLE_APPS_SCRIPT_SECRET
   The same value used for SHARED_SECRET in Apps Script Project Settings.

Make both variables available to Functions, then trigger a new deployment.
Do not put GOOGLE_APPS_SCRIPT_SECRET inside index.html.

GOOGLE APPS SCRIPT ACCESS
Deploy the Apps Script Web App with:
- Execute as: Me
- Who has access: Anyone

If the Web App displays "You need access", edit the Apps Script deployment and
change its access setting before testing Netlify.

NETLIFY CLI OPTION
Run this command from the extracted folder:

npx netlify-cli deploy --prod --dir=. --functions=netlify/functions

EXPECTED RESULT
After a completed questionnaire, the result page first shows "Saving
response..." and then either:
- "Response saved to Google Sheets", or
- a device-local fallback message if Google Sheets is unavailable.

RESPONSE FIELDS
The website sends these fields to Google Apps Script:
- name (required)
- company (required)
- gmail (required)
- phone (optional; may be blank)
- aim
- answers
- priority
- recommendedUnit
- scores
- submittedAt

If your Apps Script uses a fixed appendRow column order, update it so name and
phone are also written to the intended Google Sheets columns.
