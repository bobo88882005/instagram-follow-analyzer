type InstagramData = {

  followers: string[];

  following: string[];

  pendingRequests?: string[];

  receivedRequests?: string[];

  recentlyUnfollowed?: string[];

};



function normalizeUser(user:string) {

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
    "user",
    "profile"

  ];



  return Array.from(

    new Set(

      users

        .map(normalizeUser)

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


    // username molto sospetti

    if (
      user.length < 3
    )
      return true;



    if (
      user.includes("deleted")
    )
      return true;



    if (
      /^[0-9._]+$/.test(user)
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



  const following =
    cleanUsers(
      data.following
    );



  const followersSet =
    new Set(
      followers
    );



  const notFollowingBack =

    following.filter(

      user =>
      !followersSet.has(user)

    );





  const pendingRequests =
    cleanUsers(
      data.pendingRequests
      || []
    );



  const receivedRequests =
    cleanUsers(
      data.receivedRequests
      || []
    );



  const recentlyUnfollowed =
    cleanUsers(
      data.recentlyUnfollowed
      || []
    );




  return {


    followers,

    following,


    followersCount:
      followers.length,


    followingCount:
      following.length,



    notFollowingBack,



    possibleInactive:
      findPossibleInactive(
        notFollowingBack
      ),



    pendingRequests,


    receivedRequests,


    recentlyUnfollowed


  };


}
