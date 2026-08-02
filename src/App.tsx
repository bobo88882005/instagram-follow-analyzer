import { useState } from "react";

import {
  Upload,
  Clock,
  UserPlus,
  UserX,
  RefreshCcw,
  ChevronRight,
  Users,
  Ghost
} from "lucide-react";

import { readInstagramZip } from "./parser/zipParser";
import { analyzeInstagram } from "./utils/analyzer";



function App() {


  const [result, setResult] =
    useState<any>(null);


  const [loading, setLoading] =
    useState(false);


  const [view, setView] =
    useState<"normal" | "inactive">("normal");


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



    } catch(error) {


      console.error(error);


      alert(
        "Errore durante l'analisi"
      );


    }



    setLoading(false);


  }





  function profileLink(user:string) {


    return (
      "https://www.instagram.com/" +
      encodeURIComponent(user)
    );


  }





  function UserList({
    users
  }:{
    users:string[]
  }) {


    if(
      !users ||
      users.length === 0
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
                profileLink(user)
              }

              target="_blank"

              rel="noopener noreferrer"

            >

              @{user}

              <ChevronRight size={16}/>

            </a>

          ))

        }

      </div>

    );

  }





  function SecondaryCard({
    icon,
    title,
    count,
    name
  }:{
    icon:any;
    title:string;
    count:number;
    name:string;
  }) {


    return (

      <div

        className="menu-card"

        onClick={() =>
          setSection(
            section === name
            ? null
            : name
          )
        }

      >

        {icon}


        <span>

          {title}

          <small>

            {count}

          </small>


        </span>



        <ChevronRight/>


      </div>

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
              view==="inactive"
              ?
              "counter active"
              :
              "counter"
            }


            onClick={() =>
              setView("inactive")
            }

          >

            👻

            <span>

              Possibili inattivi

            </span>


            <strong>

              {
                result.possibleInactive.length
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
              result.possibleInactive
            }

          />

        }









        <div className="secondary-title">

          Altre sezioni

        </div>







        <SecondaryCard

          icon={<Clock/>}

          title="Pending Requests"

          count={
            result.pendingRequests.length
          }

          name="pending"

        />



        {
          section==="pending" && (

            <div className="popup-section">

              <UserList

                users={
                  result.pendingRequests
                }

              />

            </div>

          )
        }








        <SecondaryCard

          icon={<UserPlus/>}

          title="Richieste ricevute"

          count={
            result.receivedRequests.length
          }

          name="received"

        />



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








        <SecondaryCard

          icon={<UserX/>}

          title="Recently Unfollowed"

          count={
            result.recentlyUnfollowed.length
          }

          name="unfollow"

        />



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
