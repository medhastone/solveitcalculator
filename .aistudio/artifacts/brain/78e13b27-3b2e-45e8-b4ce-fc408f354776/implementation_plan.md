# Implementation Plan — FormSubmit Integration & Public Email Configuration

Connect the Contact Us form to FormSubmit's free endpoint targeting `medhastone@gmail.com` via seamless AJAX, while displaying `info@solveitcalculator.com` as the official public support email.

---

## 1. Overview of Proposed Changes

1. **AJAX FormSubmit Pipeline (`app/contact/ContactClient.tsx`):**
   - Wire form submission to `https://formsubmit.co/ajax/medhastone@gmail.com`.
   - Send JSON payload containing user `name`, `email`, `_replyto`, `topic`, `tool_url`, `_subject`, `message`, `_captcha: 'false'`, and `_template: 'table'`.
   - Keep user seamlessly on page and show the animated confirmation screen with reference code.
   - Provide error handling with direct mailto fallback if network connection fails.

2. **Public-Facing Email Branding:**
   - Display `info@solveitcalculator.com` across all user-facing contact elements (copy-to-clipboard button, email display card, and helpful hints).
   - Update JSON-LD `ContactPage` schema in `app/contact/page.tsx` to `info@solveitcalculator.com`.

---

## 2. Technical Modifications

### Step 1: Update `app/contact/ContactClient.tsx`
- Replace `support@solveitcalculator.com` with `info@solveitcalculator.com` in UI labels and clipboard copy logic.
- Replace simulated timeout submission with `fetch('https://formsubmit.co/ajax/medhastone@gmail.com', ...)` sending formatted fields and metadata.
- Handle success state with generated ticket code and friendly confirmation.
- Handle error state with informative banner and direct fallback option.

### Step 2: Update `app/contact/page.tsx`
- Update JSON-LD Schema `contactPoint.email` to `info@solveitcalculator.com`.

---

## 3. Verification & Validation

- Verify that submitting the form makes a valid AJAX POST request to FormSubmit endpoint with structured payload.
- Verify success screen renders with reference ticket without page refresh.
- Verify copy button copies `info@solveitcalculator.com`.
- Verify JSON-LD Schema reflects `info@solveitcalculator.com`.
- Run `lint_applet` to confirm 0 build/type errors.
