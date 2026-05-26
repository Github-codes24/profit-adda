// =========================================================================
//            PROFIT ADDA — GOOGLE APPS SCRIPT DATABASE BACKEND
// =========================================================================
//
// INSTRUCTIONS FOR SETUP:
// 1. Go to Google Drive, create a new Google Sheet. Rename it "Profit Adda Database".
// 2. Go to Extensions -> Apps Script.
// 3. Delete any default code in Code.gs, paste this entire code there.
// 4. Click Save (Disk Icon).
// 5. Click Deploy -> New Deployment.
// 6. Select Type: "Web App".
// 7. Configure:
//    - Description: "Profit Adda API"
//    - Execute as: "Me" (Your email account)
//    - Who has access: "Anyone" (Required for CORS-free access from client)
// 8. Click Deploy, Authorize Permissions when prompted.
// 9. Copy the "Web App URL" (ends in /exec) and paste it as the SHEETS_API_URL in 
//    src/database.js on your React code.
//
// =========================================================================

function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    const action = requestData.action;
    let result = { ok: false, msg: "Action not recognized" };

    if (action === "getUsers") result = getUsers();
    else if (action === "getCampaigns") result = getCampaigns();
    else if (action === "getSubmissions") result = getSubmissions();
    else if (action === "getWithdrawals") result = getWithdrawals();
    else if (action === "register") result = registerUser(requestData);
    else if (action === "updatePassword") result = updatePassword(requestData);
    else if (action === "addCampaign") result = addCampaign(requestData);
    else if (action === "editCampaign") result = editCampaign(requestData);
    else if (action === "deleteCampaign") result = deleteCampaign(requestData);
    else if (action === "logClick") result = logClick(requestData);
    else if (action === "createShortLink") result = createShortLink(requestData);
    else if (action === "resolveShortLink") result = resolveShortLink(requestData);
    else if (action === "incrementClick") result = incrementClick(requestData);
    else if (action === "addSubmission") result = addSubmission(requestData);
    else if (action === "updateSubmission") result = updateSubmission(requestData);
    else if (action === "addWithdrawal") result = addWithdrawal(requestData);
    else if (action === "updateWithdrawal") result = updateWithdrawal(requestData);

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, msg: "Server error: " + err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper to open/create a sheet tab
function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    // Initialize headers depending on sheet name
    let headers = [];
    if (name === "Users") {
      headers = [
        "userId", "firstName", "lastName", "phone", "email", "password", 
        "dob", "gender", "city", "state", "referral", "selfie", "createdAt",
        "kycDone", "kycUpi", "kycBankName", "kycAccHolder", "kycAccNum", "kycIfsc", 
        "kycPan", "kycAadhaar"
      ];
    } else if (name === "Campaigns") {
      headers = ["id", "name", "goal", "desc", "logo", "payout", "segment", "payModel", "url", "subId", "createdAt"];
    } else if (name === "Submissions") {
      headers = ["id", "userId", "campId", "campName", "payout", "payModel", "proof", "note", "status", "adminNote", "submittedAt", "updatedAt"];
    } else if (name === "Withdrawals") {
      headers = ["id", "userId", "amount", "type", "bankName", "accHolder", "accNum", "ifsc", "pan", "aadhaar", "upiId", "status", "createdAt", "updatedAt", "rejectionReason"];
    } else if (name === "Clicks") {
      headers = ["userId", "campaignId", "campaignName", "clickedAt"];
    } else if (name === "ShortLinks") {
      headers = ["code", "userId", "campaignId", "campaignName", "targetUrl", "clicksCount", "createdAt"];
    }
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#0E1B2E").setFontColor("#FFFFFF");
  }
  return sheet;
}

// Convert sheet data to array of objects
function sheetToObjects(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0];
  const rows = data.slice(1);
  return rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

// Find row index by column name and value
function findRowIndex(sheet, colName, value) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return -1;
  const headers = data[0];
  const colIndex = headers.indexOf(colName);
  if (colIndex === -1) return -1;
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][colIndex]) === String(value)) {
      return i + 1; // 1-indexed for sheets row number
    }
  }
  return -1;
}

// ======= API IMPLEMENTATIONS =======

function getUsers() {
  const sheet = getSheet("Users");
  const users = sheetToObjects(sheet);
  // Remove sensitive fields or base64 selfie payloads if too big for initial sync (optional)
  // Here we return full payload for simplicity
  return { ok: true, users: users };
}

function getCampaigns() {
  const sheet = getSheet("Campaigns");
  const campaigns = sheetToObjects(sheet);
  return { ok: true, campaigns: campaigns };
}

function getSubmissions() {
  const sheet = getSheet("Submissions");
  const submissions = sheetToObjects(sheet);
  return { ok: true, submissions: submissions };
}

function getWithdrawals() {
  const sheet = getSheet("Withdrawals");
  const withdrawals = sheetToObjects(sheet);
  return { ok: true, withdrawals: withdrawals };
}

function registerUser(data) {
  const sheet = getSheet("Users");
  const users = sheetToObjects(sheet);

  // Check phone duplicate
  if (users.some(u => String(u.phone).trim() === String(data.phone).trim())) {
    return { ok: false, msg: "❌ Is phone number se already account bana hua hai" };
  }
  // Check email duplicate
  if (users.some(u => String(u.email).trim().toLowerCase() === String(data.email).trim().toLowerCase())) {
    return { ok: false, msg: "❌ Is email se already account bana hua hai" };
  }

  // Generate Unique ID
  const existingIds = users.map(u => u.userId);
  let userId;
  do {
    userId = "PA" + String(Math.floor(100000 + Math.random() * 900000));
  } while (existingIds.indexOf(userId) > -1);

  // Append User Row
  const headers = sheet.getDataRange().getValues()[0];
  const newRow = headers.map(header => {
    if (header === "userId") return userId;
    return data[header] !== undefined ? data[header] : "";
  });
  sheet.appendRow(newRow);

  return { ok: true, userId: userId };
}

function updatePassword(data) {
  const sheet = getSheet("Users");
  const rIdx = findRowIndex(sheet, "userId", data.userId);
  if (rIdx === -1) return { ok: false, msg: "User not found" };

  const headers = sheet.getDataRange().getValues()[0];
  const colIdx = headers.indexOf("password") + 1;
  sheet.getRange(rIdx, colIdx).setValue(data.password);
  return { ok: true };
}

function addCampaign(data) {
  const sheet = getSheet("Campaigns");
  const headers = sheet.getDataRange().getValues()[0];
  const newRow = headers.map(header => data[header] !== undefined ? data[header] : "");
  sheet.appendRow(newRow);
  return { ok: true };
}

function editCampaign(data) {
  const sheet = getSheet("Campaigns");
  const rIdx = findRowIndex(sheet, "id", data.id);
  if (rIdx === -1) return { ok: false, msg: "Campaign not found" };

  const headers = sheet.getDataRange().getValues()[0];
  headers.forEach((header, index) => {
    if (data[header] !== undefined) {
      sheet.getRange(rIdx, index + 1).setValue(data[header]);
    }
  });
  return { ok: true };
}

function deleteCampaign(data) {
  const sheet = getSheet("Campaigns");
  const rIdx = findRowIndex(sheet, "id", data.id);
  if (rIdx === -1) return { ok: false, msg: "Campaign not found" };
  sheet.deleteRow(rIdx);
  return { ok: true };
}

function logClick(data) {
  const sheet = getSheet("Clicks");
  const clickedAt = new Date().toLocaleString("en-IN");
  sheet.appendRow([data.userId, data.campaignId, data.campaignName, clickedAt]);
  return { ok: true };
}

function createShortLink(data) {
  const sheet = getSheet("ShortLinks");
  
  // Check if link already exists for this user + campaign
  const shortLinks = sheetToObjects(sheet);
  const existing = shortLinks.find(sl => sl.userId === data.userId && sl.campaignId === data.campaignId);
  
  // Build web app base short url
  const scriptUrl = ScriptApp.getService().getUrl();
  
  if (existing) {
    return { ok: true, shortUrl: scriptUrl + "?r=" + existing.code };
  }

  // Generate unique 6 letter code
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  do {
    code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (shortLinks.some(sl => sl.code === code));

  const createdAt = new Date().toLocaleString("en-IN");
  sheet.appendRow([code, data.userId, data.campaignId, data.campaignName, data.targetUrl, 0, createdAt]);

  return { ok: true, shortUrl: scriptUrl + "?r=" + code };
}

function resolveShortLink(data) {
  const sheet = getSheet("ShortLinks");
  const rIdx = findRowIndex(sheet, "code", data.code);
  if (rIdx === -1) return { ok: false, msg: "Code not found" };

  const headers = sheet.getDataRange().getValues()[0];
  const urlCol = headers.indexOf("targetUrl") + 1;
  const targetUrl = sheet.getRange(rIdx, urlCol).getValue();

  return { ok: true, targetUrl: targetUrl };
}

function incrementClick(data) {
  const sheet = getSheet("ShortLinks");
  const rIdx = findRowIndex(sheet, "code", data.code);
  if (rIdx === -1) return { ok: false };

  const headers = sheet.getDataRange().getValues()[0];
  const clicksCol = headers.indexOf("clicksCount") + 1;
  const currentClicks = parseInt(sheet.getRange(rIdx, clicksCol).getValue()) || 0;
  sheet.getRange(rIdx, clicksCol).setValue(currentClicks + 1);

  return { ok: true };
}

function addSubmission(data) {
  const sheet = getSheet("Submissions");
  const headers = sheet.getDataRange().getValues()[0];
  const newRow = headers.map(header => data[header] !== undefined ? data[header] : "");
  sheet.appendRow(newRow);
  return { ok: true };
}

function updateSubmission(data) {
  const sheet = getSheet("Submissions");
  const rIdx = findRowIndex(sheet, "id", data.id);
  if (rIdx === -1) return { ok: false, msg: "Submission not found" };

  const headers = sheet.getDataRange().getValues()[0];
  const statusCol = headers.indexOf("status") + 1;
  const noteCol = headers.indexOf("adminNote") + 1;
  const dateCol = headers.indexOf("updatedAt") + 1;

  sheet.getRange(rIdx, statusCol).setValue(data.status);
  sheet.getRange(rIdx, noteCol).setValue(data.adminNote || "");
  sheet.getRange(rIdx, dateCol).setValue(data.updatedAt || new Date().toLocaleDateString("en-IN"));

  return { ok: true };
}

function addWithdrawal(data) {
  const sheet = getSheet("Withdrawals");
  const headers = sheet.getDataRange().getValues()[0];
  
  // Flatten payment details fields for flat spreadsheet structure
  const pd = data.paymentDetails || {};
  
  // If bank KYC documents are sent, update the user profile row
  if (pd.type === "bank" && (data.panImg || data.aadhaarFront || data.aadhaarBack)) {
    const userSheet = getSheet("Users");
    const uIdx = findRowIndex(userSheet, "userId", data.userId);
    if (uIdx > -1) {
      const userHeaders = userSheet.getDataRange().getValues()[0];
      
      const setVal = (col, val) => {
        const idx = userHeaders.indexOf(col);
        if (idx > -1) userSheet.getRange(uIdx, idx + 1).setValue(val);
      };
      
      setVal("kycDone", true);
      setVal("kycBankName", pd.bankName);
      setVal("kycAccHolder", pd.accHolder);
      setVal("kycAccNum", pd.accNum);
      setVal("kycIfsc", pd.ifsc);
      setVal("kycPan", pd.pan);
      setVal("kycAadhaar", pd.aadhaar);
      // We don't save massive raw base64 images inside user profile cell to avoid sheet bloat, 
      // but they are stored in the withdrawal details payload.
    }
  }

  const newRow = headers.map(header => {
    if (header === "type") return pd.type || "";
    if (header === "bankName") return pd.bankName || "";
    if (header === "accHolder") return pd.accHolder || "";
    if (header === "accNum") return pd.accNum || "";
    if (header === "ifsc") return pd.ifsc || "";
    if (header === "pan") return pd.pan || "";
    if (header === "aadhaar") return pd.aadhaar || "";
    if (header === "upiId") return pd.upiId || "";
    return data[header] !== undefined ? data[header] : "";
  });
  
  sheet.appendRow(newRow);
  return { ok: true };
}

// Resolve query for short links directly inside spreadsheet (GET support)
function doGet(e) {
  const code = e.parameter.r;
  if (code) {
    const sheet = getSheet("ShortLinks");
    const rIdx = findRowIndex(sheet, "code", code);
    if (rIdx > -1) {
      const headers = sheet.getDataRange().getValues()[0];
      const urlCol = headers.indexOf("targetUrl") + 1;
      const targetUrl = sheet.getRange(rIdx, urlCol).getValue();
      
      // Increment click count
      const clicksCol = headers.indexOf("clicksCount") + 1;
      const currentClicks = parseInt(sheet.getRange(rIdx, clicksCol).getValue()) || 0;
      sheet.getRange(rIdx, clicksCol).setValue(currentClicks + 1);
      
      // Redirect browser!
      return HtmlService.createHtmlOutput("<script>window.location.href='" + targetUrl + "';</script>");
    }
  }
  return HtmlService.createHtmlOutput("<h3>Profit Adda Link Redirection</h3><p>Invalid or expired URL code.</p>");
}

function updateWithdrawal(data) {
  const sheet = getSheet("Withdrawals");
  const rIdx = findRowIndex(sheet, "id", data.id);
  if (rIdx === -1) return { ok: false, msg: "Withdrawal not found" };

  const headers = sheet.getDataRange().getValues()[0];
  const statusCol = headers.indexOf("status") + 1;
  const reasonCol = headers.indexOf("rejectionReason") + 1;
  const dateCol = headers.indexOf("updatedAt") + 1;

  sheet.getRange(rIdx, statusCol).setValue(data.status);
  sheet.getRange(rIdx, dateCol).setValue(new Date().toLocaleDateString("en-IN"));
  if (data.status === "rejected" && data.reason) {
    sheet.getRange(rIdx, reasonCol).setValue(data.reason);
  }

  return { ok: true };
}
