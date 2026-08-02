export function extractUsernames(
  html: string
): string[] {

  const usernames = new Set<string>();


  const parser =
    new DOMParser();


  const doc =
    parser.parseFromString(
      html,
      "text/html"
    );


  const links =
    Array.from(
      doc.querySelectorAll("a")
    );


  links.forEach((link) => {

    const text =
      link.textContent
      ?.trim();


    if (!text)
      return;


    if (
      /^[a-zA-Z0-9._]+$/.test(text)
    ) {

      usernames.add(
        text.toLowerCase()
      );

    }

  });


  return Array.from(
    usernames
  );

}
