const fs = require('fs');
let server = fs.readFileSync('server.js', 'utf8');

const target = `    try {
      const paddedMonth = month.padStart(2, '0');
      const startDate = \`\${year}-\${paddedMonth}-01\`;
      
      // Calculate next month for the 'before' filter
      let nextMonth = parseInt(month) + 1;
      let nextYear = parseInt(year);
      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear += 1;
      }
      const nextMonthPadded = nextMonth.toString().padStart(2, '0');
      const endDate = \`\${nextYear}-\${nextMonthPadded}-01\`;

      const notionPayload = {
        filter: {
          and: [
            { property: "Employee", relation: { contains: empId } },
            { property: "Timestamp", date: { on_or_after: startDate } },
            { property: "Timestamp", date: { before: endDate } }
          ]
        },
        sorts: [{ property: "Timestamp", direction: "ascending" }]
      };`;

const replacement = `    try {
      let filterConditions = [
        { property: "Employee", relation: { contains: empId } }
      ];

      if (year && month) {
        const paddedMonth = month.padStart(2, '0');
        const startDate = \`\${year}-\${paddedMonth}-01\`;
        
        let nextMonth = parseInt(month) + 1;
        let nextYear = parseInt(year);
        if (nextMonth > 12) {
          nextMonth = 1;
          nextYear += 1;
        }
        const nextMonthPadded = nextMonth.toString().padStart(2, '0');
        const endDate = \`\${nextYear}-\${nextMonthPadded}-01\`;
        
        filterConditions.push({ property: "Timestamp", date: { on_or_after: startDate } });
        filterConditions.push({ property: "Timestamp", date: { before: endDate } });
      }

      const notionPayload = {
        filter: { and: filterConditions },
        sorts: [{ property: "Timestamp", direction: "ascending" }]
      };`;

server = server.replace(target, replacement);
fs.writeFileSync('server.js', server);
console.log("Updated server.js to support fetching all attendance records!");
