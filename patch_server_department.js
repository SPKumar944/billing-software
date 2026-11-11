const fs = require('fs');
let server = fs.readFileSync('server.js', 'utf8');

// For POST (create employee)
const postTarget = `if (data.role) addProp("Role", "select", () => ({ select: { name: data.role } }));`;
const postReplace = `if (data.role) addProp("Role", "select", () => ({ select: { name: data.role } }));
        if (data.department) addProp("Department", "select", () => ({ select: { name: data.department } }));`;

server = server.replace(postTarget, postReplace);

// For PATCH (edit employee)
const patchTarget = `if (data.role) notionPayload.properties["Role"] = { select: { name: data.role } };`;
const patchReplace = `if (data.role) notionPayload.properties["Role"] = { select: { name: data.role } };
        if (data.department) notionPayload.properties["Department"] = { select: { name: data.department } };`;

server = server.replace(patchTarget, patchReplace);

fs.writeFileSync('server.js', server);
console.log("Patched server.js with Department support!");
