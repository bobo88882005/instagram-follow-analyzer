type InstagramData = {
  followers: string[];
  following: string[];
  pendingRequests?: string[];
  receivedRequests?: string[];
  recentlyUnfollowed?: string[];
};



const manualInactiveUsers = [

  "_rimbaudelaire",
  "chloe_gad_93",
  "seguiti",
  "andrea.old",
  "siro.valmont",
  "discor_dantes",
  "matijahefler",
  "fightingsoul3000",
  "emilia_lop_",
  "manfromstel",
  "bruhlickd",
  "mario95simonetti",
  "andreavitto",
  "cadestellenti",
  "branlio88",
  "ut1986",
  "catsguardian",
  "iamflaviofarinos",
  "zacharias_longuelune",
  "facualbanoinderkum",
  "riccardoprnd",
  "achcec28",
  "manos.soave",
  "amvy79",
  "adelina_buzoku",
  "mich_re_",
  "drbartucci",
  "hey_misterboy",
  "alexcamb",
  "roc.er1",
  "daniruro90",
  "miguero_93",
  "diego.puntot",
  "alessiobasso_____",
  "annasebastiani_",
  "_littlepear__",
  "dimatteorlati",
  "_federica.leone",
  "_chiaraguarente",
  "91_rzc",
  "wuoltercrowe",
  "travel.fabi",
  "i_x_t_a_p_a_t_x_i",
  "alex.ri1",
  "unchatnoir23",
  "fabrizio_trio",
  "sz.batara",
  "iampinaycebuana",
  "iq.12k",
  "gemma_febe",
  "maajomaldonado",
  "miadomenica.official",
  "zu.dance",
  "giorgos_dilo",
  "castanon.adriana",
  "mirazh.x",
  "sarahla_bleisure",
  "oekotante_",
  "bavivie",
  "_karinreimann",
  "marco2808",
  "justinliu00001",
  "sonjacal33",
  "daniprado.s",
  "elenamille04",
  "_arissandra_",
  "gabriele_masca",
  "nic_zzi",
  "eurodriguesmaria",
  "angdcx",
  "castlesintheair80",
  "lovex_17",
  "viciuus",
  "nowayjohnstrong",
  "soyhorhe",
  "josefersinelnando",
  "dogtorpropofol",
  "just.luk3",
  "asierbodes3",
  "im_who_im_ming",
  "carmineroger",
  "maria_tis_geitonias__",
  "alex_kova80",
  "micheleguglielmo",
  "itssadrijajedisson",
  "ljr17_97",
  "bjelotschka",
  "campisi.simona",
  "ioeio91",
  "xofferet",
  "ileo12",
  "itsmejaackoog",
  "letswalkwithflo",
  "826271811919181716hah82881",
  "cris_valp",
  "xsimoneinguantax",
  "indianoss",
  "profiloinattivo8",
  "caos_",
  "anothertommi",
  "leonardo_mira",
  "johnvalenmart",
  "william_woodryan",
  "dave_chain",
  "luanalvarenga",
  "chicocantabru",
  "dsmp_trc",
  "emio_l",
  "maurochristie._",
  "demian_green",
  "edu_lozano90",
  "kurtleburger",
  "domemi",
  "gtet",
  "lorenzo_fr_",
  "lemiroirdeneptune",
  "davdzd",
  "c_christian_",
  "domenicodome1",
  "polofresco"

];



// NOTA: "_u" è stato rimosso dalla lista. Era stato aggiunto a mano
// perché il vecchio parser HTML lo estraeva come falso username dal
// link "instagram.com/_u/username" presente in following.html.
// Il parser corretto (instagramParser.ts) ora gestisce quel formato
// di link correttamente, quindi non serve più questa eccezione.





function normalize(user:string) {

  return user
    .replace("@","")
    .trim()
    .toLowerCase();

}





function cleanUsers(users:string[] = []) {

  const blacklist = [

    "instagram user",
    "instagramuser",
    "deleted",
    "deleted account",
    "unknown",
    "null",
    "profile"

  ];



  return Array.from(

    new Set(

      users

      .map(normalize)

      .filter(user => {


        if (!user)
          return false;



        if (
          blacklist.some(
            item =>
            user.includes(item)
          )
        )
          return false;



        return /^[a-z0-9._]{2,}$/.test(user);


      })

    )

  );

}







function findPossibleInactive(
  users:string[]
) {


  return users.filter(user => {


    // Blacklist manuale e pattern algoritmico si comportano
    // allo stesso modo: qui vengono solo "candidati" come
    // possibili inattivi. Il whitelist (in base alla presenza
    // tra i followers) viene applicato dopo, in modo uniforme
    // per entrambi i tipi di rilevamento.

    if (
      manualInactiveUsers.includes(user)
    )
      return true;



    if (
      /^[0-9._]+$/.test(user)
    )
      return true;



    if (
      user.length < 3
    )
      return true;



    return false;


  });


}








export function analyzeInstagram(
  data:InstagramData
) {


  const followers =
    cleanUsers(
      data.followers
    );



  const followingAll =
    cleanUsers(
      data.following
    );



  // Blacklist manuale e pattern algoritmico si comportano allo
  // stesso modo: nessuno dei due esclude automaticamente qualcuno
  // dal conteggio "following". Il whitelist (in base alla presenza
  // tra i followers) viene applicato più sotto, in modo uniforme.
  const following =
    followingAll;



  const followersSet =
    new Set(
      followers
    );



  const allNotFollowingBack =

    following.filter(

      user =>
      !followersSet.has(user)

    );





  const possibleInactiveRaw =

    Array.from(

      new Set([

        ...findPossibleInactive(
          followingAll
        )

      ])

    );



  // Se un utente marcato come "possibile inattivo" ti segue
  // davvero (e' tra i followers), non e' un account fake/abbandonato:
  // va trattato come un follower normale, non come inattivo.
  const possibleInactive =

    possibleInactiveRaw.filter(

      user =>
      !followersSet.has(user)

    );




  const inactiveSet =
    new Set(
      possibleInactive
    );





  const notFollowingBack =

    allNotFollowingBack.filter(

      user =>
      !inactiveSet.has(user)

    );





  return {


    followers,


    following,


    followersCount:
      followers.length,


    followingCount:
      following.length,



    notFollowingBack,


    possibleInactive,



    pendingRequests:
      cleanUsers(
        data.pendingRequests || []
      ),



    receivedRequests:
      cleanUsers(
        data.receivedRequests || []
      ),



    recentlyUnfollowed:
      cleanUsers(
        data.recentlyUnfollowed || []
      )


  };


}
