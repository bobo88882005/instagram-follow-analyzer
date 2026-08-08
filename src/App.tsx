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








        <div className="top-grid">


          <div

            className={
              section==="followers"
              ?
              "top-card active"
              :
              "top-card"
            }

            onClick={() =>
              toggleSection("followers")
            }

          >

            <span className="icon">👥</span>

            <span>
              Followers
            </span>

            <strong>

              {result.followersCount}

            </strong>

          </div>




          <div

            className={
              section==="following"
              ?
              "top-card active"
              :
              "top-card"
            }

            onClick={() =>
              toggleSection("following")
            }

          >

            <span className="icon">➕</span>

            <span>
              Following
            </span>

            <strong>

              {result.followingCount}

            </strong>

          </div>




          <div

            className={
              section==="notback"
              ?
              "top-card active"
              :
              "top-card"
            }

            onClick={() =>
              toggleSection("notback")
            }

          >

            <span className="icon">🔴</span>

            <span>
              Non ricambiano
            </span>

            <strong>

              {
                result.notFollowingBack.length
              }

            </strong>

          </div>




          <div

            className={
              section==="pending"
              ?
              "top-card active"
              :
              "top-card"
            }

            onClick={() =>
              toggleSection("pending")
            }

          >

            <span className="icon">🕓</span>

            <span>
              Pending Requests
            </span>

            <strong>

              {
                result.pendingRequests?.length ?? 0
              }

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




        {
          section==="notback" && (

            <div className="popup-section">

              <h3>
                Non ricambiano
              </h3>

              <UserList

                users={
                  result.notFollowingBack
                }

              />

            </div>

          )
        }




        {
          section==="pending" && (

            <div className="popup-section">

              <h3>
                Pending Requests
              </h3>

              <UserList

                users={
                  result.pendingRequests
                }

              />

            </div>

          )
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

          <Ghost size={17}/>


          <span>

            Possibili inattivi

          </span>


          <strong className="badge">

            {
              result.possibleInactive.length
            }

          </strong>


          <ChevronRight size={15}/>


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

          <UserPlus size={17}/>


          <span>

            Richieste ricevute

          </span>


          <strong className="badge">

            {
              result.receivedRequests?.length ?? 0
            }

          </strong>


          <ChevronRight size={15}/>


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

          <UserX size={17}/>


          <span>

            Recently Unfollowed

          </span>


          <strong className="badge">

            {
              result.recentlyUnfollowed?.length ?? 0
            }

          </strong>


          <ChevronRight size={15}/>


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
