const fs = require('fs');
const html = fs.readFileSync('current_homepage.html', 'utf-8');

// Let's print out the body contents cleanly
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (bodyMatch) {
  const body = bodyMatch[1];
  // extract all text nodes with their tag parents
  const clean = body
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  
  // split by lines and filter empty
  const lines = clean.split('\n')
    .map(l => l.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').trim())
    .filter(l => l.length > 0);
  
  console.log(lines.join('\n'));
}
