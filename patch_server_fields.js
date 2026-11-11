const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const fieldsLogic = `
        if (data.dob) addProp("Date of Birth", "date", () => ({ date: { start: data.dob } }));
        if (data.blood) addProp("Blood Group", "select", () => ({ select: { name: data.blood } }));
        if (data.father) addProp("Father/Spouse Name", "rich_text", () => ({ rich_text: [{ text: { content: data.father } }] }));
        if (data.marital) addProp("Marital Status", "select", () => ({ select: { name: data.marital } }));
        if (data.currentAddress) addProp("Current Address", "rich_text", () => ({ rich_text: [{ text: { content: data.currentAddress } }] }));
        if (data.permAddress) addProp("Permanent Address", "rich_text", () => ({ rich_text: [{ text: { content: data.permAddress } }] }));
        if (data.uan) addProp("UAN Number", "rich_text", () => ({ rich_text: [{ text: { content: data.uan } }] }));
        if (data.email) addProp("Email Address", "email", () => ({ email: data.email }));
        
        // Generate an Employee ID automatically
        const empIdStr = "EMP-" + Math.floor(100000 + Math.random() * 900000);
        addProp("Employee ID", "rich_text", () => ({ rich_text: [{ text: { content: empIdStr } }] }));
`;

// Insert it right after: if (data.bankIfsc) addProp(...);
code = code.replace(/if \(data\.bankIfsc\) addProp\("IFSC Code"[^\n]+\n/, match => match + fieldsLogic);
fs.writeFileSync('server.js', code);
