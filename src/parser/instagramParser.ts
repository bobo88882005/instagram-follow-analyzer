export type InstagramEntry = {
  username: string;
  date?: string;
};


export function extractUsernames(html: string): InstagramEntry[] {

  // Map invece di Set: ci serve associare ogni username alla
  // sua data, mantenendo solo la prima occorrenza trovata.
  const entries = new Map<string, string | undefined>();

  const decoded =
    html
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&amp;/g, "&");


  // ─────────────────────────────────────────────
  // FORMATO 1: link diretto al profilo, seguito dalla
  // data in un <div> immediatamente successivo.
  // Usato da followers_1.html, following.html, ecc.
  //   <a href="https://www.instagram.com/username">...</a></div><div>DATA</div>
  //   <a href="https://www.instagram.com/_u/username">...</a></div><div>DATA</div>
  // ─────────────────────────────────────────────

  const anchorRegex =
    /href=["']https?:\/\/(?:www\.)?instagram\.com\/(?:_u\/)?([a-zA-Z0-9._]+)\/?["'][^>]*>[^<]*<\/a>\s*<\/div>\s*<div>([^<]*)<\/div>/gi;

  let match: RegExpExecArray | null;

  while (
    (match = anchorRegex.exec(decoded)) !== null
  ) {

    const username =
      match[1].toLowerCase();

    const date =
      match[2].trim() || undefined;

    if (
      /^[a-z0-9._]{2,30}$/.test(username)
      &&
      !entries.has(username)
    ) {
      entries.set(username, date);
    }

  }


  // ─────────────────────────────────────────────
  // FORMATO 2: tabella con etichetta "Nome utente" / "Username" / ecc.,
  // seguita dalla data in un <div> subito dopo la chiusura della tabella.
  // Usato da pending_follow_requests.html,
  // follow_requests_you've_received.html,
  // recently_unfollowed_profiles.html, ecc.
  // Queste tabelle possono contenere anche righe
  // "Nome" (nome reale) e "URL" (link esterni):
  // vanno IGNORATE, si prende solo il valore
  // associato all'etichetta dello username, che varia
  // in base alla lingua dell'account Instagram esportato.
  // ─────────────────────────────────────────────

  // Etichette conosciute per "Username" nelle varie lingue
  // in cui Instagram genera l'export dei dati.
  const usernameLabels = [
    "Username",              // inglese
    "Nome utente",           // italiano
    "Nombre de usuario",     // spagnolo
    "Nom d'utilisateur",     // francese
    "Benutzername",          // tedesco
    "Nome de usuário",       // portoghese
    "Gebruikersnaam",        // olandese
    "Användarnamn",          // svedese
    "Brukernavn",            // norvegese
    "Brugernavn",            // danese
    "Nazwa użytkownika",     // polacco
    "Kullanıcı adı",         // turco
    "Uživatelské jméno",     // ceco
    "Felhasználónév",        // ungherese
    "Nume utilizator",       // rumeno
    "Όνομα χρήστη",          // greco
    "اسم المستخدم",          // arabo
    "Tên người dùng",        // vietnamita
    "ชื่อผู้ใช้"                // thailandese
  ];

  const labelPattern =
    usernameLabels
      .map(
        label =>
        label.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )
      )
      .join("|");

  const tableRegex =
    new RegExp(
      "<td[^>]*>\\s*(?:" +
      labelPattern +
      ")\\s*<\\/td>\\s*<td[^>]*>([^<]*)<\\/td>\\s*<\\/tr>\\s*<\\/table>\\s*<\\/div>\\s*<\\/div>\\s*<\\/div>\\s*<div[^>]*>([^<]*)<\\/div>",
      "gi"
    );

  while (
    (match = tableRegex.exec(decoded)) !== null
  ) {

    const username =
      match[1].trim().toLowerCase();

    const date =
      match[2].trim() || undefined;

    if (
      /^[a-z0-9._]{2,30}$/.test(username)
      &&
      !entries.has(username)
    ) {
      entries.set(username, date);
    }

  }


  return Array.from(
    entries,
    ([username, date]) => ({ username, date })
  );

}
