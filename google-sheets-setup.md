# Google Sheets Waitlist Setup

## Step 1: Create Your Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create new spreadsheet called "DriveQuest Waitlist"
3. Add these columns in row 1:
   - A: Email
   - B: Date Added
   - C: Source (Website, TikTok, etc.)
   - D: Status (Active, Unsubscribed, etc.)

## Step 2: Set Up Google Apps Script
1. In your Google Sheet, go to **Extensions > Apps Script**
2. Replace the default code with this:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Get form data
    const email = e.parameter.email;
    const source = e.parameter.source || 'Website';
    const timestamp = e.parameter.timestamp || new Date().toISOString();
    
    // Add new row
    sheet.appendRow([
      email,
      timestamp,
      source,
      'Active'
    ]);
    
    // Send confirmation email
    sendConfirmationEmail(email);
    
    return ContentService
      .createTextOutput('Success! Email added to waitlist.')
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    return ContentService
      .createTextOutput('Error: ' + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function sendConfirmationEmail(email) {
  // SendGrid API configuration
  const SENDGRID_API_KEY = 'YOUR_SENDGRID_API_KEY_HERE'; // Replace with your actual API key
  const SENDER_EMAIL = 'drivequest18@gmail.com'; // Replace with your domain email
  const SENDER_NAME = 'DriveQuest Team';
  
  const subject = "Welcome to DriveQuest! 🚗";
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4f8cff; margin: 0;">DriveQuest</h1>
        <p style="color: #666; font-size: 18px; margin: 10px 0;">AI-Powered Teen Driver Training</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
        <h2 style="color: #333; margin: 0 0 15px 0;">🎉 You're on the waitlist!</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
          Thank you for joining the DriveQuest waitlist! We're excited to have you on board.
        </p>
        <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
          <strong>What happens next?</strong><br>
          • We'll notify you as soon as DriveQuest launches<br>
          • You'll get early access to our AI-powered driving coach<br>
          • Be the first to experience safer teen driving
        </p>
      </div>
      
      <div style="background: #4f8cff; color: white; padding: 20px; border-radius: 10px; text-align: center;">
        <h3 style="margin: 0 0 10px 0;">🚗 Every drive becomes a lesson</h3>
        <p style="margin: 0; opacity: 0.9;">
          Get your DriveScore, personalized goals, and micro-courses to build safer driving habits.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 25px; color: #666; font-size: 14px;">
        <p>Questions? Reply to this email or visit our website</p>
        <p>© 2024 DriveQuest. All rights reserved.</p>
      </div>
    </div>
  `;
  
  const plainBody = `
Welcome to DriveQuest! 🚗

AI-Powered Teen Driver Training

🎉 You're on the waitlist!

Thank you for joining the DriveQuest waitlist! We're excited to have you on board.

What happens next?
• We'll notify you as soon as DriveQuest launches
• You'll get early access to our AI-powered driving coach
• Be the first to experience safer teen driving

🚗 Every drive becomes a lesson

Get your DriveScore, personalized goals, and micro-courses to build safer driving habits.

Questions? Reply to this email or visit our website
© 2024 DriveQuest. All rights reserved.
  `;
  
  // SendGrid API request
  const payload = {
    personalizations: [{
      to: [{ email: email }]
    }],
    from: {
      email: SENDER_EMAIL,
      name: SENDER_NAME
    },
    subject: subject,
    content: [
      {
        type: "text/plain",
        value: plainBody
      },
      {
        type: "text/html",
        value: htmlBody
      }
    ]
  };
  
  const options = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + SENDGRID_API_KEY,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload)
  };
  
  try {
    const response = UrlFetchApp.fetch('https://api.sendgrid.com/v3/mail/send', options);
    Logger.log('Email sent successfully: ' + response.getContentText());
  } catch (error) {
    Logger.log('Error sending email: ' + error.toString());
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('DriveQuest Waitlist API is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

## Step 3: Set Up SendGrid for Professional Emails
1. Go to [sendgrid.com](https://sendgrid.com) and create a free account
2. Get your **API Key** from Settings > API Keys
3. Verify your sender domain (or use a verified single sender)
4. Update the script with your API key and sender email

## Step 4: Deploy as Web App
1. Click **Deploy > New deployment**
2. Choose **Web app**
3. Set **Execute as**: Me
4. Set **Who has access**: Anyone
5. Click **Deploy**
6. Copy the **Web app URL** (looks like: `https://script.google.com/macros/s/.../exec`)

## Step 4: Update Your Website
1. Replace the form action with your Google Apps Script URL
2. Test the form submission
3. Check your Google Sheet - emails should appear automatically!

## Benefits:
- ✅ **Free** - No monthly costs
- ✅ **Real-time** - Emails appear instantly
- ✅ **Exportable** - Easy to download data
- ✅ **Collaborative** - Team can view together
- ✅ **Automated** - No manual work needed
- ✅ **Email confirmations** - Users get welcome emails automatically

## Alternative: Simple Gmail Alias (Free)
If you prefer to keep it simple and free:
1. In Gmail, go to Settings > Accounts and Import
2. Add another email address (like `hello@drivequest.com`)
3. Replace the SendGrid code with this simpler version:

```javascript
function sendConfirmationEmail(email) {
  const subject = "Welcome to DriveQuest! 🚗";
  const htmlBody = `...your HTML email content...`;
  const plainBody = `...your plain text email content...`;
  
  GmailApp.sendEmail(email, subject, plainBody, {
    htmlBody: htmlBody,
    name: "DriveQuest Team",
    from: "hello@drivequest.com" // Your alias email
  });
}
```

## Next Steps:
- Set up email notifications when new emails are added
- Create email templates for welcome messages
- Set up automated sequences for launch
- Integrate with your email marketing tool

