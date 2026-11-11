const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// We want to swap the ID Card block and the Attendance History block within the Right Column.

const rightColRegex = /<!-- Right Column -->\s*<div style="display: flex; flex-direction: column; gap: 32px;">([\s\S]*?)<\/div> <!-- End Right Column -->/;
const match = html.match(rightColRegex);

if (match) {
  const content = match[1];
  
  // The content contains two blocks:
  // 1. <div style="width: 100%;"> (This is the ID Card wrapper)
  // 2. <div style="background: #fff; ... (This is the Attendance History)
  
  const separator = "<!-- Attendance History Calendar -->";
  const parts = content.split(separator);
  
  if (parts.length === 2) {
    const idCardBlock = parts[0];
    const attendanceBlock = separator + "\n" + parts[1];
    
    // Reconstruct with Attendance first, then ID card
    const newContent = attendanceBlock + "\n\n<!-- ID Card Container -->\n" + idCardBlock;
    
    html = html.replace(content, newContent);
    fs.writeFileSync('public/index.html', html);
    console.log("Swapped Attendance and ID Card!");
  } else {
    console.log("Could not split blocks.");
  }
} else {
  console.log("Could not find Right Column!");
}
