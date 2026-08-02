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


  const [result,setResult] =
    useState<any>(null);


  const [loading,setLoading] =
    useState(false);


  const [view,setView] =
    useState<
      "normal" | "inactive"
    >("normal");


  const [section,setSection] =
    useState<string|null>(null);






  async function handleUpload(
    e:React.ChangeEvent<HTMLInputElement>
  ){


    const file =
      e.target.files?.[0];


    if(!file)
      return;



    setLoading(true);



    try{


      const data =
        await readInstagramZip(
          file
        );



      const analysis =
        analyzeInstagram(
          data
        );



      setResult(
        analysis
      );



    }catch(err){


      console.error(err);


      alert(
        "Errore analisi ZIP"
      );


    }



    setLoading(false);


  }








  function profileLink(
    username:string
  ){

    return (
      "https://www.instagram.com/" +
      encodeURIComponent(
        username
      )
    );

  }








  function UserList({
    users,
    showDate=false
  }:{
    users:any[],
    showDate?:boolean
  }){


    if(
      !users ||
      users.length===0
    )
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

            key={
              user.username
            }

            href={
              profileLink(
                user.username
              )
            }

            target="_blank"

            rel="noreferrer"

          >


            <span>

              @{user.username}

            </span>



            {
              showDate &&
              user.date &&
              (

                <small className="follow-date">

                  {user.date}

                </small>

              )

            }



            <ChevronRight size={14}/>


          </a>


        ))

      }


      </div>

    );

  }









  function toggleSection(
    name:string
  ){

    setSection(
      section===name
      ?
      null
      :
      name
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

      onClick={()=>
        toggleSection(
          "followers"
        )
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

      onClick={()=>
        toggleSection(
          "following"
        )
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
    section==="followers" &&

    <div className="popup-section">

      <UserList

        users={
          result.followers
        }

        showDate={true}

      />

    </div>

  }








  {
    section==="following" &&

    <div className="popup-section">

      <UserList

        users={
          result.following
        }

        showDate={true}

      />

    </div>

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


      onClick={()=>
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


      onClick={()=>
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








  <UserList

    users={
      view==="normal"
      ?
      result.notFollowingBack
      :
      result.possibleInactive
    }

  >


  </UserList>









  <div className="secondary-title">

    Altre sezioni

  </div>






  <div
    className="menu-card"
    onClick={()=>
      toggleSection("pending")
    }
  >

    <Clock/>

    <span>
      Pending Requests
    </span>


    <ChevronRight/>


  </div>





  {
    section==="pending" &&

    <UserList

      users={
        result.pendingRequests
      }

    />

  }







  <div
    className="menu-card"
    onClick={()=>
      toggleSection("received")
    }
  >

    <UserPlus/>

    <span>
      Richieste ricevute
    </span>


    <ChevronRight/>


  </div>





  {
    section==="received" &&

    <UserList

      users={
        result.receivedRequests
      }

    />

  }









  <div
    className="menu-card"
    onClick={()=>
      toggleSection("unfollow")
    }
  >

    <UserX/>

    <span>
      Recently Unfollowed
    </span>


    <ChevronRight/>


  </div>





  {
    section==="unfollow" &&

    <UserList

      users={
        result.recentlyUnfollowed
      }

    />

  }









  <button

    className="reset"

    onClick={()=>
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
