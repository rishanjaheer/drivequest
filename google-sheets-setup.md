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
    
    return ContentService
      .createTextOutput('Success! Email added to waitlist.')
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    return ContentService
      .createTextOutput('Error: ' + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('DriveQuest Waitlist API is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

## Step 3: Deploy as Web App
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

## Next Steps:
- Set up email notifications when new emails are added
- Create email templates for welcome messages
- Set up automated sequences for launch
- Integrate with your email marketing tool

