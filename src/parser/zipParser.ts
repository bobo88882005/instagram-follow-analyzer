import JSZip from "jszip";
import { extractUsernames, InstagramEntry } from "./instagramParser";


export async function readInstagramZip(
  file: File
) {

  const zip =
    await JSZip.loadAsync(file);

  const result = {
    followers: [],
    following: [],
    pendingRequests: [],
    receivedRequests: [],
    recentlyUnfollowed: [],
    closeFriends: []
  } as {
    followers:InstagramEntry[];
    following:InstagramEntry[];
    pendingRequests:InstagramEntry[];
    receivedRequests:InstagramEntry[];
    recentlyUnfollowed:InstagramEntry[];
    closeFriends:InstagramEntry[];
  };


  for (
    const filename of Object.keys(zip.files)
  ) {

    const item =
      zip.files[filename];

    if (item.dir)
      continue;

    const name =
      filename.toLowerCase();

    if (!name.endsWith(".html"))
      continue;

    const html =
      await item.async("string");

    const users =
      extractUsernames(html);


    // Instagram esporta i followers in più file quando sono tanti:
    // followers_1.html, followers_2.html, followers_3.html, ecc.
    // Vanno letti e uniti TUTTI, non solo il primo.
    if (
      /followers_\d+\.html$/.test(name)
    ) {
      result.followers =
        result.followers.concat(users);
    }
    else if (
      name.endsWith("following.html")
    ) {
      result.following =
        users;
    }
    else if (
      name.includes(
        "pending_follow_requests"
      )
    ) {
      result.pendingRequests =
        users;
    }
    else if (
      name.includes(
        "follow_requests_you"
      )
    ) {
      result.receivedRequests =
        users;
    }
    else if (
      name.includes(
        "recently_unfollowed"
      )
    ) {
      result.recentlyUnfollowed =
        users;
    }
    else if (
      name.includes(
        "close_friends"
      )
    ) {
      result.closeFriends =
        users;
    }

  }


  return result;

}
