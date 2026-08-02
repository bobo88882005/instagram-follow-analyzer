export function extractUsernames(html: string): string[] {

  const usernames = new Set<string>();


  const parser = new DOMParser();

  const document =
    parser.parseFromString(
      html,
      "text/html"
    );


  // Metodo 1: legge i link Instagram presenti nell'HTML
  const links =
    Array.from(
      document.querySelectorAll("a")
    );


  links.forEach((link) => {

    const href =
      link.getAttribute("href");


    const text =
      link.textContent
        ?.trim();


    let username = "";


    if (href) {

      const match =
        href.match(
          /instagram\.com\/([^\/?#]+)/i
        );


      if (match) {

        username =
          match[1];

      }

    }


    if (!username && text) {

      username =
        text;

    }


    username =
      username
        .replace("@", "")
        .trim()
        .toLowerCase();



    if (
      /^[a-z0-9._]+$/.test(username)
    ) {

      usernames.add(username);

    }


  });



  // Metodo 2: fallback per eventuali HTML diversi
  const rawText =
    document.body.innerText;


  const possibleUsers =
    rawText.match(
      /@[a-zA-Z0-9._]+/g
    );


  if (possibleUsers) {

    possibleUsers.forEach(user => {

      usernames.add(
        user
          .replace("@","")
          .toLowerCase()
      );

    });

  }



  return Array.from(usernames);

}
