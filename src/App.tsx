import { useState } from "react";
import {
  Upload,
  Clock,
  UserPlus,
  UserX,
  RefreshCcw,
  ChevronRight,
  Users
} from "lucide-react";

import { readInstagramZip } from "./parser/zipParser";
import { analyzeInstagram } from "./utils/analyzer";


function App() {

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState<string | null>(null);



  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const file = e.target.files?.[0];

    if (!file)
      return;


    setLoading(true);


    try {

      const data =
        await readInstagramZip(file);


      const analysis =
        analyzeInstagram(data);


      setResult(analysis);


    } catch(err) {

      console.error(err);

      alert(
        "Errore nella lettura del file Instagram"
      );

    }


    setLoading(false);

  }



  function instagramUrl(user:string) {

    return (
      "https://www.instagram.com/" +
      encodeURIComponent(user)
    );

  }



  function UserList({
    users,
    limit
  }: {
    users:string[],
    limit?:number
  }) {


    if (!users || users.length === 0) {

      return (
        <div className="empty">
          Nessun risultato
        </div>
      );

    }


    const list =
      limit
      ? users.slice(0,limit)
      : users;



    return (

      <div className="user-list">

        {
          list.map(user => (

            <a
              key={user}
              href={instagramUrl(user)}
              target="_blank"
              rel="noopener noreferrer"
            >

              <span>
                @{user}
              </span>

              <ChevronRight size={18}/>

            </a>

          ))
        }

      </div>

    );

  }



  function reset() {

    setResult(null);
    setSection(null);

  }



  return (

    <main className="app">


      <div className="background-gradient"/>


      <div className="card">


        {!result && (

          <>

            <div className="logo">

              Instagram Analyzer

            </div>


            <p className="subtitle">

              Scopri chi non ti segue più

            </p>



            <label className="upload-button">

              <Upload size={20}/>

              {
                loading
                ? "Analisi..."
                : "Carica archivio ZIP"
              }


              <input

                hidden

                type="file"

                accept=".zip"

                onChange={handleUpload}

              />

            </label>


          </>

        )}




        {result && (

          <>


            <header>

              <h1>
                Dashboard
              </h1>


              <div className="stats">


                <div>

                  <small>
                    Followers
                  </small>

                  <strong>
                    {result.followersCount}
                  </strong>

                </div>



                <div>

                  <small>
                    Following
                  </small>

                  <strong>
                    {result.followingCount}
                  </strong>

                </div>



              </div>


            </header>





            <section className="main-section">


              <h2>

                <Users size={20}/>

                Non ti seguono

              </h2>


              <UserList

                users={
                  result.notFollowingBack
                }

                limit={150}

              />


            </section>





            <div

              className="menu-card"

              onClick={() =>
                setSection("pending")
              }

            >

              <Clock/>

              Pending Requests

              <ChevronRight/>

            </div>





            <div

              className="menu-card"

              onClick={() =>
                setSection("received")
              }

            >

              <UserPlus/>

              Richieste ricevute

              <ChevronRight/>

            </div>





            <div

              className="menu-card"

              onClick={() =>
                setSection("unfollow")
              }

            >

              <UserX/>

              Recently Unfollowed

              <ChevronRight/>

            </div>






            {
              section === "pending" &&

              <section className="popup-section">

                <h2>
                  Pending Requests
                </h2>


                <UserList

                  users={
                    result.pendingRequests
                  }

                />

              </section>

            }



            {
              section === "received" &&

              <section className="popup-section">

                <h2>
                  Richieste ricevute
                </h2>


                <UserList

                  users={
                    result.receivedRequests
                  }

                />

              </section>

            }




            {
              section === "unfollow" &&

              <section className="popup-section">

                <h2>
                  Recently Unfollowed
                </h2>


                <UserList

                  users={
                    result.recentlyUnfollowed
                  }

                />

              </section>

            }





            <button

              className="reset"

              onClick={reset}

            >

              <RefreshCcw size={18}/>

              Nuova analisi

            </button>



          </>

        )}


      </div>


    </main>

  );

}


export default App;
