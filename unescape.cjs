const fs = require('fs');

['src/pages/SimpleLeads.jsx', 'src/pages/SimpleInbox.jsx'].forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    
    // Unescape \` and \$ which were created by the markdown replacement
    code = code.replace(/\\`/g, '`');
    code = code.replace(/\\\$/g, '$');
    
    fs.writeFileSync(file, code);
    console.log(`Unescaped ${file}`);
});
