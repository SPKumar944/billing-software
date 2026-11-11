const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// The issue is that employee-directory-view and employee-profile-view got structurally messed up.
// I will extract them, clean the end of the file, and place them perfectly inside content-area.

const dirMatch = html.match(/<!-- VIEW 6: EMPLOYEE DIRECTORY -->[\s\S]*?(?=<!-- VIEW 7: EMPLOYEE PROFILE -->)/);
const profMatch = html.match(/<!-- VIEW 7: EMPLOYEE PROFILE -->[\s\S]*?(?=<!-- ID Card Modal -->)/);

if (dirMatch && profMatch) {
  const dirHtml = dirMatch[0];
  const profHtml = profMatch[0];
  
  // Remove them from their current bad positions
  html = html.replace(dirHtml, '');
  html = html.replace(profHtml, '');
  
  // Find where employee-onboarding-view ends
  // It ends with </form> </div> </div>
  const onboardEndMatch = html.match(/<button type="submit" class="btn btn-primary" id="btn-submit-employee">Save Employee Record<\/button>\s*<\/div>\s*<\/form>\s*<\/div>\s*<\/div>/);
  
  if (onboardEndMatch) {
    const splitPoint = html.indexOf(onboardEndMatch[0]) + onboardEndMatch[0].length;
    const before = html.substring(0, splitPoint);
    const after = html.substring(splitPoint);
    
    // Inject them correctly right after onboarding view, so they remain inside content-area
    html = before + "\n\n" + dirHtml + "\n\n" + profHtml + "\n\n" + after;
  }
  
  fs.writeFileSync('public/index.html', html);
  console.log("Fixed HTML Layout!");
} else {
  console.log("Could not find views to fix.");
}
