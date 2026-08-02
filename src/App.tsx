import { useState } from "react";
import {
  Upload,
  Home,
  UserMinus,
  Clock
} from "lucide-react";

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


      setResult(analysis);


    } catch (error) {

      alert(
        "Errore durante la lettura dello ZIP Instagram"
      );

      console.error(error);

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
              Analizza chi non ti segue più
              usando il tuo archivio Instagram.
            </p>


            <label className="upload-button">

              <Upload size={22}/>


              {loading
                ? "Analisi in corso..."
                : "Importa ZIP Instagram"
              }


              <input

                type="file"

                accept=".zip"

                hidden

                onChange={handleUpload}

              />


            </label>

          </>

        )}



        {result && (

          <>


            <h2>
              Dashboard
            </h2>


            <div className="stats">


              <div className="stat-card">

                <span>
                  Followers
                </span>

                <strong>
                  {result.followersCount}
                </strong>

              </div>



              <div className="stat-card">

                <span>
                  Following
                </span>

                <strong>
                  {result.followingCount}
                </strong>

              </div>



              <div className="stat-card warning">

                <span>
                  Non ti seguono
                </span>

                <strong>
                  {result.notFollowingBack.length}
                </strong>

              </div>



              <div className="stat-card">

                <span>
                  Pending
                </span>

                <strong>
                  {result.pendingRequests.length}
                </strong>

              </div>


            </div>



            <h3>
              👤 Persone che non ti seguono
            </h3>


            <div>

              {
                result.notFollowingBack.map(
                  (user:string)=>(

                    <a

                      key={user}

                      href={
                        `https://www.instagram.com/${user}/`
                      }

                      target="_blank"

                      rel="noreferrer"

                    >

                      @{user}

                    </a>

                  )
                )
              }

            </div>



            <h3>
              ⏳ Pending Requests
            </h3>


            <div>

              {
                result.pendingRequests.map(
                  (user:string)=>(

                    <a

                      key={user}

                      href={
                        `https://www.instagram.com/${user}/`
                      }

                      target="_blank"

                      rel="noreferrer"

                    >

                      @{user}

                    </a>

                  )
                )
              }

            </div>



            <nav className="bottom-nav">


              <button>

                <Home size={22}/>

                <span>
                  Home
                </span>

              </button>



              <button>

                <UserMinus size={22}/>

                <span>
                  Non seguono
                </span>

              </button>



              <button>

                <Clock size={22}/>

                <span>
                  Pending
                </span>

              </button>


            </nav>


          </>

        )}


      </div>

    </div>

  );

}


export default App;
