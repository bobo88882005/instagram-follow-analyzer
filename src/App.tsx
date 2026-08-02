import { useState } from "react";
import { Upload } from "lucide-react";

import { readInstagramZip } from "./parser/zipParser";
import { analyzeInstagram } from "./utils/analyzer";


function App() {


  const [result, setResult] =
    useState<any>(null);


  const [loading, setLoading] =
    useState(false);



  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {

    const file =
      event.target.files?.[0];


    if (!file)
      return;


    setLoading(true);


    try {

      const data =
        await readInstagramZip(file);


      const analysis =
        analyzeInstagram(data);


      setResult(
        analysis
      );


    } catch(error) {

      alert(
        "Errore nella lettura dello ZIP Instagram"
      );

    }


    setLoading(false);

  }



  return (

    <div className="app">


      <div className="card">


        <h1>
          Instagram Follow Analyzer
        </h1>


        {!result && (

          <>

          <p>
            Importa il tuo archivio Instagram
            per scoprire chi non ti segue.
          </p>


          <label className="upload-button">


            <Upload size={22}/>


            {loading
              ? "Analisi..."
              : "Importa ZIP Instagram"
            }


            <input

              type="file"

              accept=".zip"

              hidden

              onChange={
                handleUpload
              }

            />


          </label>

          </>

        )}



        {result && (

          <div>


            <h2>
              Risultati
            </h2>


            <p>
              Followers:
              <b>
                {" "}
                {result.followersCount}
              </b>
            </p>


            <p>
              Following:
              <b>
                {" "}
                {result.followingCount}
              </b>
            </p>



            <h3>
              Non ti seguono:
            </h3>


            {

            result.notFollowingBack
            .map(
              (user:string)=>(

                <a

                  key={user}

                  href={
                    `https://www.instagram.com/${user}/`
                  }

                  target="_blank"

                >

                  @{user}

                </a>

              )

            )

            }


            <h3>
              Pending Requests:
            </h3>


            {
              result.pendingRequests
              .map(
                (user:string)=>(

                  <a

                    key={user}

                    href={
                      `https://www.instagram.com/${user}/`
                    }

                    target="_blank"

                  >

                    @{user}

                  </a>

                )
              )
            }


          </div>

        )}


      </div>


    </div>

  );

}


export default App;
