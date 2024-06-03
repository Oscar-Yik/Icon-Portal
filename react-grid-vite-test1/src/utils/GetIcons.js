export default async function getIcon(iconURl) {
    const icon = await fetchIcon(iconURl);
    if (icon) {
      let parts = iconURl.split('/');
      if (parts.length >= 4) {
        parts = parts.slice(0, 3).join('/')
      } else {
        parts = "uh oh, string is too short";
      }
      //console.log('Icon URL:', parts + icon);
      return parts + icon;
    } else {
        console.log('No icon URL found');
        return "Uh oh, couldn't fetch icon";
    }
}

async function fetchIcon(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Couldn't get Webpage"); 
            }
            return response.text();
        })
        .then(html => {
            const icon = findIcon(html);
            return icon; 
        })
        .catch(error => {
            console.log(error.message); 
        })
}

function findIcon(html) {
    // Parse the HTML string into a DOM object
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Search for the specific meta tag
    const iconTag = doc.querySelector('link[rel="icon"]');
    
    if (iconTag) {
      const img = iconTag.getAttribute('href');
      //console.log('Icon tag found');
      return img; 
    } else {
      console.log('Icon tag not found');
      return "no";
    }
}