const fs = require('fs');
let server = fs.readFileSync('server.js', 'utf8');

const patchTarget = `if (data.name) notionPayload.properties["Name"] = { title: [{ text: { content: data.name } }] };
        if (data.role) notionPayload.properties["Role"] = { select: { name: data.role } };
        if (data.blood) notionPayload.properties["Blood Group"] = { select: { name: data.blood } };
        if (data.mobile) notionPayload.properties["Mobile"] = { phone_number: data.mobile };
        if (data.email) notionPayload.properties["Email Address"] = { email: data.email };`;

const patchReplacement = `if (data.name) notionPayload.properties["Name"] = { title: [{ text: { content: data.name } }] };
        if (data.role) notionPayload.properties["Role"] = { select: { name: data.role } };
        if (data.blood) notionPayload.properties["Blood Group"] = { select: { name: data.blood } };
        if (data.mobile) notionPayload.properties["Mobile"] = { phone_number: data.mobile };
        if (data.email) notionPayload.properties["Email Address"] = { email: data.email };
        
        if (data.dob) notionPayload.properties["Date of Birth"] = { date: { start: data.dob } };
        if (data.doj) notionPayload.properties["Date of Joining"] = { date: { start: data.doj } };
        if (data.father) notionPayload.properties["Father/Spouse Name"] = { rich_text: [{ text: { content: data.father } }] };
        if (data.marital) notionPayload.properties["Marital Status"] = { select: { name: data.marital } };
        if (data.currentAddress) notionPayload.properties["Current Address"] = { rich_text: [{ text: { content: data.currentAddress } }] };
        if (data.permAddress) notionPayload.properties["Permanent Address"] = { rich_text: [{ text: { content: data.permAddress } }] };
        if (data.uan) notionPayload.properties["UAN Number"] = { rich_text: [{ text: { content: data.uan } }] };
        
        if (data.emergencyName) notionPayload.properties["Emergency Contact"] = { rich_text: [{ text: { content: data.emergencyName } }] };
        if (data.emergencyPhone) notionPayload.properties["Emergency Phone"] = { phone_number: data.emergencyPhone };
        if (data.emergencyRel) notionPayload.properties["Emergency Relationship"] = { rich_text: [{ text: { content: data.emergencyRel } }] };
        
        if (data.idType) notionPayload.properties["ID Type"] = { select: { name: data.idType } };
        if (data.idNumber) notionPayload.properties["ID Number"] = { rich_text: [{ text: { content: data.idNumber } }] };
        if (data.bankName) notionPayload.properties["Bank Name"] = { rich_text: [{ text: { content: data.bankName } }] };
        if (data.bankAcc) notionPayload.properties["Account Number"] = { rich_text: [{ text: { content: data.bankAcc } }] };
        if (data.bankIfsc) notionPayload.properties["IFSC Code"] = { rich_text: [{ text: { content: data.bankIfsc } }] };`;

server = server.replace(patchTarget, patchReplacement);
fs.writeFileSync('server.js', server);
console.log("Patched server.js!");
