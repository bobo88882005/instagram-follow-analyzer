import { useState } from "react";

import {
  Upload,
  Clock,
  UserPlus,
  UserX,
  RefreshCcw,
  ChevronRight,
  Ghost,
  Users
} from "lucide-react";

import { readInstagramZip } from "./parser/zipParser";
import { analyzeInstagram } from "./utils/analyzer";



function App() {


  const [result,setResult] =
    useState<any>(null);


  const [loading,setLoading] =
    useState(false);


  const [view,setView] =
    useState<"normal"|"inactive">("normal");


  const [section,setSection] =
    useState<string|null>(null);





  async function handleUpload(
    e:React.ChangeEvent<HTMLInputElement>
  ) {


    const file =
      e.target.files?.[0];


    if(!file)
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
        "Errore durante l'analisi dello ZIP"
      );


    }



    setLoading(false);


  }






  function instagramLink(
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



    if(
      !users ||
      users.length===0
    ) {

      return (

        <div className="empty">

          Nessun risultato

        </div>

      );

    }





    return (

      <div className="user-list">

        {
          users
          .slice(0,250)
          .map(
            (user:string)=>(

            <a

              key={user}

              href={
                instagramLink(user)
              }

              target="_blank"

              rel="noopener noreferrer"

            >

              <span>
                @{user}
              </span>


              <ChevronRight size={16}/>


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

          Scopri chi non ricambia il follow

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

          Non ti seguono

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








        <div className="filters">


          <button

            className={
              view==="normal"
              ?
              "active"
              :
              ""
            }


            onClick={()=>
              setView("normal")
            }


          >

            🔴 Non ricambiano

          </button>





          <button

            className={
              view==="inactive"
              ?
              "active"
              :
              ""
            }


            onClick={()=>
              setView("inactive")
            }


          >


            👻 Possibili inattivi


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
              result.possibleInactive
            }

          />

        }







        <div

          className="menu-card"

          onClick={()=>
            setSection("pending")
          }

        >

          <Clock/>

          Pending Requests

          <ChevronRight/>


        </div>






        <div

          className="menu-card"

          onClick={()=>
            setSection("received")
          }

        >


          <UserPlus/>


          Richieste ricevute


          <ChevronRight/>


        </div>






        <div

          className="menu-card"

          onClick={()=>
            setSection("unfollow")
          }

        >


          <UserX/>


          Recently Unfollowed


          <ChevronRight/>


        </div>









        {
          section==="pending" &&


          <section className="popup-section">

            <h2>
              Pending
            </h2>


            <UserList

              users={
                result.pendingRequests
              }

            />


          </section>

        }








        {
          section==="received" &&


          <section className="popup-section">


            <h2>
              Ricevute
            </h2>



            <UserList

              users={
                result.receivedRequests
              }

            />


          </section>

        }








        {
          section==="unfollow" &&


          <section className="popup-section">


            <h2>
              Unfollow recenti
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
