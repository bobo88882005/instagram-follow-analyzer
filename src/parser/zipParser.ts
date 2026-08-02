import JSZip from "jszip";



export type InstagramUser = {

  username: string;

  date?: string | null;

};



export type InstagramData = {

  followers: InstagramUser[];

  following: InstagramUser[];

  pendingRequests: InstagramUser[];

  receivedRequests: InstagramUser[];

  recentlyUnfollowed: InstagramUser[];

};







function cleanUsername(
  username:string
) {


  return username

    .replace("@","")

    .trim()

    .toLowerCase();


}








function formatDate(
  value:any
) {


  if(!value)
    return null;



  try {


    const date =
      new Date(value);



    if(
      isNaN(
        date.getTime()
      )
    )
      return null;




    return date.toLocaleDateString(
      "it-IT"
    );



  } catch {


    return null;


  }


}








function extractJsonUsers(
  data:any
):InstagramUser[] {


  const users:InstagramUser[] = [];



  if(
    !Array.isArray(data)
  )
    return users;





  data.forEach(
    item => {


      const username =

        item?.string_list_data?.[0]
        ?.value;



      const timestamp =

        item?.string_list_data?.[0]
        ?.timestamp;





      if(username){


        users.push({

          username:
            cleanUsername(
              username
            ),


          date:
            timestamp
            ?
            formatDate(
              timestamp * 1000
            )
            :
            null

        });


      }


    }

  );



  return users;


}








function extractHtmlUsers(
  html:string
):InstagramUser[] {


  const users:InstagramUser[] = [];



  const regex =
    /<a[^>]*>(.*?)<\/a>/g;



  let match;



  while(
    (match = regex.exec(html))
    !== null
  ){


    const username =
      match[1]
      .replace(/<[^>]+>/g,"")
      .trim();



    if(
      username
    ){


      users.push({

        username:
          cleanUsername(
            username
          ),

        date:null

      });


    }


  }



  return users;


}








async function readFileContent(
  zip:JSZip,
  possiblePaths:string[]
){


  for(
    const path of possiblePaths
  ){


    const file =
      zip.file(path);



    if(file)
      return await file.async("string");


  }



  return null;


}








export async function readInstagramZip(
  file:File
):Promise<InstagramData>{



  const zip =
    await JSZip.loadAsync(
      file
    );





  let followers:InstagramUser[] = [];

  let following:InstagramUser[] = [];

  let pendingRequests:InstagramUser[] = [];

  let receivedRequests:InstagramUser[] = [];

  let recentlyUnfollowed:InstagramUser[] = [];







  const jsonFiles =
    Object.keys(zip.files)
    .filter(
      name =>
        name.endsWith(".json")
    );







  for(
    const filename of jsonFiles
  ){


    const content =
      await zip
      .file(filename)!
      .async("string");



    try {


      const json =
        JSON.parse(
          content
        );



      const users =
        extractJsonUsers(
          json
        );



      if(
        filename.includes("followers")
      )
        followers.push(...users);



      else if(
        filename.includes("following")
      )
        following.push(...users);



      else if(
        filename.includes("pending")
      )
        pendingRequests.push(...users);



      else if(
        filename.includes("requested")
      )
        receivedRequests.push(...users);



    } catch {

    }


  }









  const htmlFiles =
    Object.keys(zip.files)
    .filter(
      name =>
        name.endsWith(".html")
    );







  for(
    const filename of htmlFiles
  ){


    const content =
      await zip
      .file(filename)!
      .async("string");



    const users =
      extractHtmlUsers(
        content
      );



    if(
      filename.includes("followers")
    )
      followers.push(...users);



    else if(
      filename.includes("following")
    )
      following.push(...users);



    else if(
      filename.includes("pending")
    )
      pendingRequests.push(...users);



    else if(
      filename.includes("requested")
    )
      receivedRequests.push(...users);



  }








  function unique(
    list:InstagramUser[]
  ){


    const map =
      new Map<string,InstagramUser>();



    list.forEach(
      user => {


        if(
          !map.has(
            user.username
          )
        ){

          map.set(
            user.username,
            user
          );

        }


      }

    );



    return Array.from(
      map.values()
    );


  }








  return {


    followers:
      unique(
        followers
      ),


    following:
      unique(
        following
      ),


    pendingRequests:
      unique(
        pendingRequests
      ),


    receivedRequests:
      unique(
        receivedRequests
      ),


    recentlyUnfollowed:
      unique(
        recentlyUnfollowed
      )


  };


}
