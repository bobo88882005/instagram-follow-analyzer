export function extractUsernames(html: string): string[] {

  const usernames = new Set<string>();


  const decoded =
    html
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&amp;/g, "&");



  const invalidUsers = [
    "instagram user",
    "instagramuser",
    "deleted",
    "unknown",
    "null",
    "user"
  ];



  function addUser(username:string) {

    const clean =
      username
        .replace("@", "")
        .trim()
        .toLowerCase();



    if (!clean)
      return;



    if (
      invalidUsers.some(
        x => clean.includes(x)
      )
    )
      return;



    if (
      /^[a-z0-9._]{2,}$/.test(clean)
    ) {

      usernames.add(clean);

    }

  }




  // URL Instagram
  const urls =
    decoded.match(
      /instagram\.com\/([a-zA-Z0-9._]+)/gi
    );


  if (urls) {

    urls.forEach(url => {

      addUser(
        url.replace(
          /instagram\.com\//i,
          ""
        )
      );

    });

  }



  // h2 Instagram export
  const h2 =
    decoded.match(
      /<h2[^>]*>(.*?)<\/h2>/gis
    );


  if (h2) {

    h2.forEach(item => {

      addUser(
        item.replace(
          /<[^>]+>/g,
          ""
        )
      );

    });

  }



  return Array.from(usernames);

}
