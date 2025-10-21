# Google Ads Conversion Tracking Setup Guide

## Overview

This guide will help you set up conversion tracking for your MowForce website using the new thank you page (`thank-you.html`).

## What's Been Created

### 1. Thank You Page (`thank-you.html`)

- **URL**: `https://mowforce.co.nz/thank-you.html`
- **Purpose**: Conversion destination page for Google Ads tracking
- Professional design matching your brand
- Includes what happens next, contact options, and social proof
- Set to `noindex, nofollow` to prevent search engine indexing

### 2. Updated Styles

All necessary CSS has been added to `styles.css` for the thank you page.

## Setting Up Google Ads Conversion Tracking

### Step 1: Create a Conversion Action in Google Ads

1. **Sign in to Google Ads** at https://ads.google.com
2. Click **Goals** in the left menu
3. Click **Conversions** in the submenu
4. Click the **+ New conversion action** button
5. Select **Website** as the conversion type
6. Choose **Code the conversion action yourself**

### Step 2: Configure Your Conversion Action

Enter the following details:

- **Conversion name**: "Quote Request" or "Contact Form Submission"
- **Goal and action optimization**: Choose "Submit lead form"
- **Value**:
  - Select "Don't use a value" or assign a value if you know average customer value
- **Count**: Choose "One" (count only one conversion per interaction)
- **Conversion window**: 30 days (default)
- **Include in "Conversions"**: Yes

Click **Create and continue**

### Step 3: Install the Conversion Tracking Code

Google will provide you with two pieces of code:

#### A. Global Site Tag (gtag.js) - If not already installed

This goes in the `<head>` section of **all pages**. If you already have Google Analytics installed, you may already have this.

**Add to**: `index.html`, `services.html`, `privacy-policy.html`, and `thank-you.html`

```html
<!-- Google tag (gtag.js) -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXXX"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'AW-XXXXXXXXXX');
</script>
```

**Location**: Add this code in the `<head>` section, just before the closing `</head>` tag.

#### B. Event Snippet - Conversion Code

This goes **only on the thank you page** (`thank-you.html`).

**Add to**: `thank-you.html` only

```html
<!-- Event snippet for Quote Request conversion page -->
<script>
  gtag('event', 'conversion', {
    send_to: 'AW-XXXXXXXXXX/YYYYYYYYYYYYYY',
    value: 1.0,
    currency: 'NZD',
  });
</script>
```

**Location**: Replace the TODO comment section in `thank-you.html` (around line 83-93) with your actual conversion tracking code.

### Step 4: Update Your Contact Form

You need to modify your contact form to redirect to the thank you page upon submission.

**In `script.js`**, find the form submission handler (around line 168-170) and modify it:

**Current code**:

```javascript
// Open email client
window.location.href = mailtoLink;

// Show success message
```

**Replace with**:

```javascript
// Open email client
window.location.href = mailtoLink;

// Redirect to thank you page after a brief delay
setTimeout(() => {
  window.location.href = 'thank-you.html';
}, 1000);

// Note: Success message removed as user will be redirected
```

**Alternative**: If you want to use a form service like Formspree, Google Forms, or a backend form handler:

1. Set up your form service
2. Configure the form's redirect URL to: `https://mowforce.co.nz/thank-you.html`
3. The conversion will be tracked when users land on the thank you page

### Step 5: Test Your Conversion Tracking

1. **Submit a test form** on your website
2. Verify you're redirected to the thank you page
3. In Google Ads, go to **Tools & Settings** > **Conversions**
4. You should see the test conversion appear within a few hours
5. **Optional**: Install the [Google Tag Assistant Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk) to verify tags are firing correctly

### Step 6: Update Content Security Policy (CSP)

Your `thank-you.html` already includes updated CSP headers to allow Google Ads tracking. Make sure to also update the CSP in your other pages (`index.html`, `services.html`) if you add the Global Site Tag there.

**Current CSP in thank-you.html includes**:

```
script-src 'self' 'nonce-{NONCE}' https://www.googletagmanager.com https://www.google-analytics.com;
```

Add the same Google domains to your other pages' CSP headers.

## Important Notes

### Security Considerations

- The thank you page includes proper security headers
- CSP is configured to allow Google tracking while maintaining security
- Page is set to `noindex, nofollow` to prevent SEO issues

### Privacy Compliance

- Make sure your Privacy Policy mentions Google Ads conversion tracking
- Consider adding a cookie consent banner if required in your jurisdiction
- The current privacy policy should be updated to mention tracking pixels

### Tracking Multiple Conversions

If you want to track different types of conversions (e.g., phone calls, email clicks), you can:

1. Create additional conversion actions in Google Ads
2. Add event tracking to phone and email links in your JavaScript
3. Use Google Tag Manager for more advanced tracking

## Common Issues & Troubleshooting

### Conversion Not Showing Up

- Wait 24-48 hours for data to appear
- Check that both the Global Site Tag and Event Snippet are installed correctly
- Use Google Tag Assistant to verify tags are firing
- Check browser console for JavaScript errors

### Form Not Redirecting

- Make sure the JavaScript modification is correct
- Check for any JavaScript errors in the browser console
- Test in different browsers

### CSP Blocking Scripts

- Ensure Google domains are whitelisted in your CSP headers
- Check browser console for CSP violation errors

## Next Steps After Setup

1. **Monitor Performance**: Check your Google Ads conversion data regularly
2. **Optimize**: Use conversion data to optimize your ad campaigns
3. **A/B Testing**: Test different ad copy and landing pages
4. **Budget Allocation**: Allocate more budget to high-converting campaigns

## Support Resources

- [Google Ads Conversion Tracking Help](https://support.google.com/google-ads/answer/1722022)
- [Google Tag Assistant](https://support.google.com/tagassistant/answer/2947093)
- [Google Ads Support](https://support.google.com/google-ads)

## Questions?

If you need help with the setup, feel free to:

- Contact Google Ads support
- Hire a Google Ads specialist
- Reach out to your web developer

---

**Created**: October 2025
**Website**: https://mowforce.co.nz
**Owner**: Marcus Murray
