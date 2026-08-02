import type { InstagramUser } from "../parser/zipParser";



type InstagramData = {

  followers: InstagramUser[];

  following: InstagramUser[];

  pendingRequests?: InstagramUser[];

  receivedRequests?: InstagramUser[];

  recentlyUnfollowed?: InstagramUser[];

};






const manualInactiveUsers = [

  "_u",
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







function normalize(
  username:string
){

  return username
    .replace("@","")
    .trim()
    .toLowerCase();

}







function cleanUsers(
  users:InstagramUser[] = []
){

  return users
    .map(user => ({
      username:
        normalize(
          user.username
        ),

      date:
        user.date || null

    }))
    .filter(
      user =>
      user.username
    );

}








function findPossibleInactive(
  users:InstagramUser[]
){

  return users.filter(
    user =>

      manualInactiveUsers.includes(
        user.username
      )

  );

}








export function analyzeInstagram(
  data:InstagramData
){




  const followers =
    cleanUsers(
      data.followers
    );



  const followingAll =
    cleanUsers(
      data.following
    );





  const following =
    followingAll.filter(

      user =>
      !manualInactiveUsers.includes(
        user.username
      )

    );







  const followersSet =
    new Set(

      followers.map(
        user =>
        user.username
      )

    );








  const allNotFollowingBack =

    following.filter(

      user =>
      !followersSet.has(
        user.username
      )

    );








  const possibleInactive =

    findPossibleInactive(
      followingAll
    );







  const inactiveSet =
    new Set(

      possibleInactive.map(
        user =>
        user.username
      )

    );







  const notFollowingBack =

    allNotFollowingBack.filter(

      user =>
      !inactiveSet.has(
        user.username
      )

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
