import { useState, useRef, useEffect } from "react";

import {
  Upload,
  Users,
  UserPlus,
  HeartCrack,
  Clock,
  Ghost,
  Inbox,
  Undo2,
  RefreshCcw,
  ChevronRight,
  Loader2
} from "lucide-react";

import { readInstagramZip } from "./parser/zipParser";
import { analyzeInstagram } from "./utils/analyzer";
import { InstagramEntry } from "./parser/instagramParser";



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

    setSection(null);



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


    e.target.value = "";


  }






  function profileLink(
    username:string
  ) {

    return (
      "https://www.instagram.com/" +
      encodeURIComponent(username)
    );

  }






  // Mappa delle abbreviazioni dei mesi nelle lingue più comuni
  // usate da Instagram per generare l'export (varia in base alla
  // lingua dell'account). Chiavi già normalizzate: minuscolo,
  // senza accenti né punti.
  const monthMap:{[key:string]:number} = {

    jan:1, gen:1,
    feb:2,
    mar:3, mrt:3,
    apr:4, abr:4,
    may:5, mag:5, mai:5, mei:5,
    jun:6, giu:6,
    jul:7, lug:7, juil:7,
    aug:8, ago:8, aou:8,
    sep:9, set:9, sept:9,
    oct:10, ott:10, out:10, okt:10,
    nov:11,
    dec:12, dic:12, dez:12

  };



  function formatDate(
    raw?:string
  ) {

    if (!raw)
      return null;


    const match =
      raw.match(
        /([a-zà-ÿ]+)\.?\s+(\d{1,2}),\s*(\d{4})/i
      );

    if (!match)
      return raw;


    const monthToken =
      match[1]
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\.$/, "");


    const month =
      monthMap[monthToken]
      ??
      monthMap[monthToken.slice(0,3)];

    if (!month)
      return raw;


    const day =
      match[2].padStart(2,"0");

    const year =
      match[3];


    return (
      day + "/" +
      String(month).padStart(2,"0") + "/" +
      year
    );

  }








  function UserList({
    users
  }:{
    users?:InstagramEntry[]
  }) {


    const listRef =
      useRef<HTMLDivElement>(null);


    const [canScrollUp, setCanScrollUp] =
      useState(false);


    const [canScrollDown, setCanScrollDown] =
      useState(false);



    function updateFade() {

      const el =
        listRef.current;

      if (!el)
        return;

      setCanScrollUp(
        el.scrollTop > 4
      );

      setCanScrollDown(
        el.scrollTop + el.clientHeight
        <
        el.scrollHeight - 4
      );

    }



    useEffect(() => {

      updateFade();

    }, [users]);



    if(!users || users.length===0)

      return (

        <div className="empty">

          Nessun risultato

        </div>

      );




    const listClasses =
      [
        "user-list",
        canScrollUp ? "fade-top" : "",
        canScrollDown ? "fade-bottom" : ""
      ]
      .filter(Boolean)
      .join(" ");



    return (

      <div

        className={listClasses}

        ref={listRef}

        onScroll={updateFade}

      >

        {
          users
          .slice(0,300)
          .map(
            ({ username, date }) => (

              <a

                key={username}

                href={
                  profileLink(username)
                }

                target="_blank"

                rel="noreferrer"

              >

                <span className="user-list-name">

                  @{username}

                  <ChevronRight size={15}/>

                </span>


                {
                  date && (

                    <span className="user-list-date">

                      {formatDate(date)}

                    </span>

                  )
                }

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



        <input

          id="zipInput"

          hidden

          type="file"

          accept=".zip"

          onChange={handleUpload}

        />




        <h1>

          <Users size={22}/>

          Dashboard


          <div className="header-actions">

            <label

              htmlFor="zipInput"

              className="icon-btn"

              title="Carica ZIP"

            >

              {
                loading
                ?
                <Loader2 size={16} className="spin"/>
                :
                <Upload size={16}/>
              }

            </label>



            <button

              className="icon-btn"

              title="Nuova analisi"

              onClick={() => {
                setResult(null);
                setSection(null);
              }}

            >

              <RefreshCcw size={16}/>

            </button>

          </div>

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

            <Users size={16}/>

            <span>
              Followers
            </span>

            <strong>

              {result?.followersCount ?? 0}

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

            <UserPlus size={16}/>

            <span>
              Following
            </span>

            <strong>

              {result?.followingCount ?? 0}

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

            <HeartCrack size={16}/>

            <span>
              Non ricambiano
            </span>

            <strong>

              {
                result?.notFollowingBack?.length ?? 0
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

            <Clock size={16}/>

            <span>
              Pending Requests
            </span>

            <strong>

              {
                result?.pendingRequests?.length ?? 0
              }

            </strong>

          </div>


        </div>




        <div className="extra-grid">


          <div

            className={
              section==="inactive"
              ?
              "extra-card active"
              :
              "extra-card"
            }

            onClick={() =>
              toggleSection("inactive")
            }

          >

            <Ghost size={14}/>

            <div className="extra-card-text">

              <span>
                Inattivi
              </span>

              <strong>

                {
                  result?.possibleInactive?.length ?? 0
                }

              </strong>

            </div>

          </div>




          <div

            className={
              section==="received"
              ?
              "extra-card active"
              :
              "extra-card"
            }

            onClick={() =>
              toggleSection("received")
            }

          >

            <Inbox size={14}/>

            <div className="extra-card-text">

              <span>
                Ricevute
              </span>

              <strong>

                {
                  result?.receivedRequests?.length ?? 0
                }

              </strong>

            </div>

          </div>




          <div

            className={
              section==="unfollow"
              ?
              "extra-card active"
              :
              "extra-card"
            }

            onClick={() =>
              toggleSection("unfollow")
            }

          >

            <Undo2 size={14}/>

            <div className="extra-card-text">

              <span>
                Unfollowed
              </span>

              <strong>

                {
                  result?.recentlyUnfollowed?.length ?? 0
                }

              </strong>

            </div>

          </div>


        </div>




        {
          section==="followers" && (

            <div className="popup-section">

              <UserList

                users={
                  result?.followers
                }

              />

            </div>

          )
        }




        {
          section==="following" && (

            <div className="popup-section">

              <UserList

                users={
                  result?.following
                }

              />

            </div>

          )
        }




        {
          section==="notback" && (

            <div className="popup-section">

              <UserList

                users={
                  result?.notFollowingBack
                }

              />

            </div>

          )
        }




        {
          section==="pending" && (

            <div className="popup-section">

              <UserList

                users={
                  result?.pendingRequests
                }

              />

            </div>

          )
        }




        {
          section==="inactive" && (

            <div className="popup-section">

              <UserList

                users={
                  result?.possibleInactive
                }

              />

            </div>

          )
        }




        {
          section==="received" && (

            <div className="popup-section">

              <UserList

                users={
                  result?.receivedRequests
                }

              />

            </div>

          )
        }




        {
          section==="unfollow" && (

            <div className="popup-section">

              <UserList

                users={
                  result?.recentlyUnfollowed
                }

              />

            </div>

          )
        }




      </div>


    </main>

  );

}



export default App;
