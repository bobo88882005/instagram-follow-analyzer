import JSZip from "jszip";
import { extractUsernames } from "./instagramParser";


export async function readInstagramZip(
  file: File
) {

  const zip = await JSZip.loadAsync(file);


  const result = {

    followers: [] as string[],
    following: [] as string[],
    pendingRequests: [] as string[],
    receivedRequests: [] as string[],
    recentlyUnfollowed: [] as string[]

  };


  for (const filename of Object.keys(zip.files)) {


    const entry = zip.files[filename];


    if (entry.dir) continue;


    const lower =
      filename.toLowerCase();


    if (!lower.endsWith(".html"))
      continue;


    const content =
      await entry.async("string");


    const users =
      extractUsernames(content);



    if (lower.includes("followers_1")) {

      result.followers =
        users;

    }


    else if (
      lower.includes("following")
    ) {

      result.following =
        users;

    }


    else if (
      lower.includes("pending_follow_requests")
    ) {

      result.pendingRequests =
        users;

    }


    else if (
      lower.includes("follow_requests_you")
    ) {

      result.receivedRequests =
        users;

    }


    else if (
      lower.includes("recently_unfollowed")
    ) {

      result.recentlyUnfollowed =
        users;

    }

  }


  return result;

}
