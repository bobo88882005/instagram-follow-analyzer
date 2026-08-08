import { useState } from "react";

import {
  Upload,
  Ghost,
  UserPlus,
  UserX,
  RefreshCcw,
  ChevronRight,
  Users
} from "lucide-react";

import { readInstagramZip } from "./parser/zipParser";
import { analyzeInstagram } from "./utils/analyzer";



function App() {


  const [result, setResult] =
    useState<any>(null);


  const [loading, setLoading] =
    useState(false);


  const [view, setView] =
    useState<"normal" | "pending">("normal");


  const [section, setSection] =
    useState<string | null>(null);





  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {


    const file =
      e.target.files?.[0];


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
        "Errore durante analisi ZIP"
      );


    }



    setLoading(false);


  }






  function profileLink(
    username:string
  ) {

    return (
      "https://www.instagram.com/" +
      encodeURIComponent(username)
    );

  }






  function UserList({
    users
  }:{
    users:string[]
  }) {


    if(!users || users.length===0)

      return (

        <div className="empty">

          Nessun risultato

        </div>

      );




    return (

      <div className="user-list">

        {
          users
          .slice(0,300)
          .map(
            user => (

              <a

                key={user}

                href={
                  profileLink(user)
                }

                target="_blank"

                rel="noreferrer"

              >

                @{user}

                <ChevronRight size={15}/>

              </a>

            )

          )
        }

      </div>

    );


  }








  function toggleSection(
    name:string
  ){

    setSection(
      section === name
      ? null
      : name
    );

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

            Analizza followers e following

          </p>




          <label className="upload-button">


            <Upload size={20}/>


            {
              loading
              ?
              "Analisi..."
              :
              "Carica ZIP Instagram"
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





        <h1>

          <Users size={22}/>

          Dashboard

        </h1>








        <div className="stats">


          <div

            className="stat-click"

            onClick={() =>
              toggleSection("followers")
            }

          >

            <small>

              Followers

            </small>


            <strong>

              {result.followersCount}

            </strong>


          </div>





          <div

            className="stat-click"

            onClick={() =>
              toggleSection("following")
            }

          >

            <small>

              Following

            </small>


            <strong>

              {result.followingCount}

            </strong>


          </div>



        </div>








        {
          section==="followers" && (

            <div className="popup-section">

              <h3>
                Followers
              </h3>

              <UserList

                users={
                  result.followers
                }

              />

            </div>

          )
        }






        {
          section==="following" && (

            <div className="popup-section">

              <h3>
                Following
              </h3>

              <UserList

                users={
                  result.following
                }

              />

            </div>

          )
        }









        <div className="counter-grid">



          <button

            className={
              view==="normal"
              ?
              "counter active"
              :
              "counter"
            }


            onClick={() =>
              setView("normal")
            }


          >

            🔴

            <span>
              Non ricambiano
            </span>


            <strong>

              {
                result.notFollowingBack.length
              }

            </strong>


          </button>







          <button

            className={
              view==="pending"
              ?
              "counter active"
              :
              "counter"
            }


            onClick={() =>
              setView("pending")
            }


          >

            🕓

            <span>
              Pending Requests
            </span>


            <strong>

              {
                result.pendingRequests?.length ?? 0
              }

            </strong>


          </button>




        </div>







        {
          view==="normal"

          ?

          <UserList

            users={
              result.notFollowingBack
            }

          />


          :

          <UserList

            users={
              result.pendingRequests
            }

          />

        }









        <div className="secondary-title">

          Altre sezioni

        </div>








        <div

          className="menu-card"

          onClick={() =>
            toggleSection("inactive")
          }

        >

          <Ghost/>


          <span>

            Possibili inattivi

          </span>


          <strong className="badge">

            {
              result.possibleInactive.length
            }

          </strong>


          <ChevronRight/>


        </div>





        {
          section==="inactive" && (

            <div className="popup-section">

              <UserList

                users={
                  result.possibleInactive
                }

              />

            </div>

          )
        }









        <div

          className="menu-card"

          onClick={() =>
            toggleSection("received")
          }

        >

          <UserPlus/>


          <span>

            Richieste ricevute

          </span>


          <strong className="badge">

            {
              result.receivedRequests?.length ?? 0
            }

          </strong>


          <ChevronRight/>


        </div>





        {
          section==="received" && (

            <div className="popup-section">

              <UserList

                users={
                  result.receivedRequests
                }

              />

            </div>

          )
        }









        <div

          className="menu-card"

          onClick={() =>
            toggleSection("unfollow")
          }

        >

          <UserX/>


          <span>

            Recently Unfollowed

          </span>


          <strong className="badge">

            {
              result.recentlyUnfollowed?.length ?? 0
            }

          </strong>


          <ChevronRight/>


        </div>





        {
          section==="unfollow" && (

            <div className="popup-section">

              <UserList

                users={
                  result.recentlyUnfollowed
                }

              />

            </div>

          )
        }









        <button

          className="reset"

          onClick={() =>
            setResult(null)
          }

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
