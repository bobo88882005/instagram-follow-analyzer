import { useState } from "react";
import {
  Upload,
  Home,
  UserMinus,
  Clock,
  RefreshCcw,
  UserPlus,
  UserX
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


    } catch(error) {

      console.error(error);

      alert(
        "Errore nella lettura dell'archivio Instagram"
      );

    }


    setLoading(false);

  }



  function resetApp() {

    setResult(null);

  }



  function UserList({
    users,
    emptyText
  }: {
    users:string[],
    emptyText:string
  }) {


    if (!users.length) {

      return (
        <p>
          {emptyText}
        </p>
      );

    }


    return (

      <div>

        {
          users.map(
            (user)=>(

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

    );

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
              Analizza follower, following
              e richieste Instagram.
            </p>


            <label className="upload-button">

              <Upload size={22}/>


              {
                loading
                ? "Analisi..."
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
              <UserMinus size={18}/>
              Non ti seguono
            </h3>

            <UserList
              users={result.notFollowingBack}
              emptyText="Tutti ti seguono 🎉"
            />



            <h3>
              <Clock size={18}/>
              Pending Requests
            </h3>

            <UserList

              users={result.pendingRequests}

              emptyText="Nessuna richiesta pendente"

            />



            <h3>
              <UserPlus size={18}/>
              Richieste ricevute
            </h3>

            <UserList

              users={result.receivedRequests}

              emptyText="Nessuna richiesta ricevuta"

            />



            <h3>
              <UserX size={18}/>
              Recentemente unfollowati
            </h3>

            <UserList

              users={result.recentlyUnfollowed}

              emptyText="Nessun unfollow recente"

            />



            <button

              className="reset-button"

              onClick={resetApp}

            >

              <RefreshCcw size={18}/>

              Nuova analisi

            </button>



            <nav className="bottom-nav">

              <button>
                <Home size={22}/>
                Home
              </button>


              <button>
                <UserMinus size={22}/>
                Non seguono
              </button>


              <button>
                <Clock size={22}/>
                Pending
              </button>


            </nav>


          </>

        )}


      </div>

    </div>

  );

}


export default App;
