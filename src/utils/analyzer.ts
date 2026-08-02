export interface InstagramData {

  followers: string[];

  following: string[];

  pendingRequests: string[];

  receivedRequests: string[];

  recentlyUnfollowed: string[];

}



export function analyzeInstagram(
  data: InstagramData
) {


  const followers =
    new Set(
      data.followers
    );


  const following =
    new Set(
      data.following
    );



  const notFollowingBack =
    Array.from(
      following
    ).filter(
      user =>
        !followers.has(user)
    );



  return {

    followersCount:
      data.followers.length,


    followingCount:
      data.following.length,


    notFollowingBack,


    pendingRequests:
      data.pendingRequests,


    receivedRequests:
      data.receivedRequests,


    recentlyUnfollowed:
      data.recentlyUnfollowed

  };

}
