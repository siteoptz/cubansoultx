export default async function handler(req, res) {
  try {
    // Fetch the working deployment content
    const response = await fetch('https://cubansoultx-a4s2gd40k-siteoptzs-projects.vercel.app/');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch working deployment: ${response.status}`);
    }
    
    let html = await response.text();
    
    // Modify the HTML to enable standalone ordering
    // Remove menu-section-disabled classes from extra sides, addons, and desserts
    html = html.replace(/class="menu-category menu-section-disabled" id="extraSidesSection"/g, 
                       'class="menu-category" id="extraSidesSection"');
    html = html.replace(/class="menu-category menu-section-disabled" id="addonsSection"/g, 
                       'class="menu-category" id="addonsSection"');
    html = html.replace(/class="menu-category menu-section-disabled" id="dessertsSection"/g, 
                       'class="menu-category" id="dessertsSection"');
    
    // Fix Cuban package pricing: change 2.09 to 209
    html = html.replace(/data-price="2\.09"/g, 'data-price="209.00"');
    html = html.replace(/\$2\.09/g, '$209');
    
    // Add a script to enable menu sections on page load
    const enableScript = `
    <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Enable standalone ordering immediately
      setTimeout(function() {
        if (typeof enableMenuSections === 'function') {
          enableMenuSections();
          console.log('Standalone ordering enabled for extra sides and desserts');
        }
      }, 1000);
    });
    </script>`;
    
    // Insert the script before the closing body tag
    html = html.replace('</body>', enableScript + '</body>');
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-cache');
    
    res.status(200).send(html);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to load website' });
  }
}