type InstagramData = {

  followers: string[];

  following: string[];

  pendingRequests?: string[];

  receivedRequests?: string[];

  recentlyUnfollowed?: string[];

};



function cleanUsers(users:string[] = []) {

  const blacklist = [

    "instagram user",

    "instagramuser",

    "deleted",

    "deleted account",

    "unknown",

    "null",

    "user"

  ];



  return Array.from(

    new Set(

      users

        .map(user =>
          user
            .replace("@","")
            .trim()
            .toLowerCase()
        )

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
    new Set(followers);



  const followingSet =
    new Set(following);





  const notFollowingBack =
    following.filter(
      user =>
      !followersSet.has(user)
    );





  const pendingRequests =
    cleanUsers(
      data.pendingRequests || []
    );



  const receivedRequests =
    cleanUsers(
      data.receivedRequests || []
    );



  const recentlyUnfollowed =
    cleanUsers(
      data.recentlyUnfollowed || []
    );





  return {


    followers,


    following,


    followersCount:
      followers.length,



    followingCount:
      following.length,



    notFollowingBack,


    pendingRequests,


    receivedRequests,


    recentlyUnfollowed


  };

}
