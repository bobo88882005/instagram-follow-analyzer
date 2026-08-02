export function extractUsernames(html: string): string[] {

  const usernames = new Set<string>();


  // Decodifica HTML
  const decoded =
    html
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&amp;/g, "&");



  // Cerca URL Instagram
  const urlMatches =
    decoded.match(
      /instagram\.com\/([a-zA-Z0-9._]+)/gi
    );


  if (urlMatches) {

    urlMatches.forEach(item => {

      const username =
        item
          .replace(/instagram\.com\//i, "")
          .replace("/", "")
          .toLowerCase();


      if (
        /^[a-z0-9._]+$/.test(username)
      ) {

        usernames.add(username);

      }

    });

  }



  // Cerca elementi h2 (molti export Instagram li usano)
  const h2Matches =
    decoded.match(
      /<h2[^>]*>(.*?)<\/h2>/gis
    );


  if (h2Matches) {

    h2Matches.forEach(item => {

      const username =
        item
          .replace(/<[^>]+>/g,"")
          .trim()
          .toLowerCase();


      if (
        /^[a-z0-9._]+$/.test(username)
      ) {

        usernames.add(username);

      }

    });

  }



  // Cerca testo tra tag div/span
  const textMatches =
    decoded.match(
      />\s*([a-zA-Z0-9._]{2,})\s*</g
    );


  if (textMatches) {

    textMatches.forEach(item => {

      const username =
        item
          .replace(/[><]/g,"")
          .trim()
          .toLowerCase();


      if (
        /^[a-z0-9._]+$/.test(username)
      ) {

        usernames.add(username);

      }

    });

  }



  return Array.from(usernames);

}
