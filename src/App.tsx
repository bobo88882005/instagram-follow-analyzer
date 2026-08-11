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
    users,
    closeFriendsSet,
    notFollowingBackSet,
    unfollowedSet,
    inactiveSet
  }:{
    users?:InstagramEntry[],
    closeFriendsSet?:Set<string>,
    notFollowingBackSet?:Set<string>,
    unfollowedSet?:Set<string>,
    inactiveSet?:Set<string>
  }) {


    // Invece di renderizzare tutta la lista o ricalcolare quali
    // righe mostrare ad ogni pixel di scroll (costoso: causa
    // ricalcoli di layout continui), carichiamo i risultati a
    // BLOCCHI: i primi 300, poi altri 300 quando ci si avvicina
    // al fondo. Il rilevamento "vicino al fondo" usa
    // IntersectionObserver, che scatta solo quando serve davvero,
    // non ad ogni evento di scroll.
    const BATCH_SIZE = 300;


    const listRef =
      useRef<HTMLDivElement>(null);


    const sentinelRef =
      useRef<HTMLDivElement>(null);


    const rafRef =
      useRef<number | null>(null);


    const [canScrollUp, setCanScrollUp] =
      useState(false);


    const [canScrollDown, setCanScrollDown] =
      useState(false);


    const [visibleCount, setVisibleCount] =
      useState(BATCH_SIZE);



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



    // Throttle via requestAnimationFrame: la sfumatura sopra/sotto
    // si aggiorna al massimo una volta per frame durante lo scroll,
    // non ad ogni singolo evento grezzo.
    function handleScroll() {

      if (rafRef.current !== null)
        return;

      rafRef.current =
        requestAnimationFrame(() => {

          updateFade();

          rafRef.current = null;

        });

    }



    useEffect(() => {

      return () => {

        if (rafRef.current !== null)
          cancelAnimationFrame(rafRef.current);

      };

    }, []);



    // Quando cambia la lista (es. si apre un'altra sezione),
    // si riparte dal primo blocco da 300.
    useEffect(() => {

      setVisibleCount(BATCH_SIZE);

    }, [users]);



    useEffect(() => {

      updateFade();

    }, [users, visibleCount]);



    // Osserva un piccolo elemento "sentinella" in fondo alla
    // lista: quando entra nell'area visibile, carica il blocco
    // successivo di 300 risultati.
    useEffect(() => {

      const sentinel =
        sentinelRef.current;

      const root =
        listRef.current;

      if (!sentinel || !root)
        return;

      const observer =
        new IntersectionObserver(
          entries => {

            if (entries[0].isIntersecting) {

              setVisibleCount(
                count =>
                Math.min(
                  users?.length ?? 0,
                  count + BATCH_SIZE
                )
              );

            }

          },
          {
            root,
            rootMargin: "600px 0px"
          }
        );

      observer.observe(sentinel);

      return () => observer.disconnect();

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



    const visibleUsers =
      users.slice(0, visibleCount);

    const hasMore =
      visibleCount < users.length;



    return (

      <div

        className={listClasses}

        ref={listRef}

        onScroll={handleScroll}

      >

        {
          visibleUsers
          .map(
            ({ username, date }) => {

              const isCloseFriend =
                closeFriendsSet?.has(username)
                ??
                false;

              const isNotFollowingBack =
                notFollowingBackSet?.has(username)
                ??
                false;

              const isUnfollowed =
                unfollowedSet?.has(username)
                ??
                false;

              const isInactive =
                inactiveSet?.has(username)
                ??
                false;

              const pillClasses =
                [
                  isCloseFriend ? "is-close-friend" : "",
                  isNotFollowingBack ? "is-not-following-back" : "",
                  isUnfollowed ? "is-unfollowed" : "",
                  isInactive ? "is-inactive" : ""
                ]
                .filter(Boolean)
                .join(" ");

              return (

                <a

                  key={username}

                  className={pillClasses}

                  href={
                    profileLink(username)
                  }

                  target="_blank"

                  rel="noreferrer"

                >

                  <span className="user-list-name">

                    @{username}

                  </span>


                  {
                    date && (

                      <span className="user-list-date">

                        {formatDate(date)}

                      </span>

                    )
                  }

                </a>

              );

            }

          )
        }


        {
          hasMore && (

            <div

              ref={sentinelRef}

              style={{ height:1 }}

            />

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




  const closeFriendsSet =
    new Set(
      (result?.closeFriends ?? [])
      .map((e:any) => e.username)
    );


  const notFollowingBackSet =
    new Set(
      (result?.notFollowingBack ?? [])
      .map((e:any) => e.username)
    );


  const unfollowedSet =
    new Set(
      (result?.recentlyUnfollowed ?? [])
      .map((e:any) => e.username)
    );


  const inactiveSet =
    new Set(
      (result?.possibleInactive ?? [])
      .map((e:any) => e.username)
    );








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

              closeFriendsSet={closeFriendsSet}

              notFollowingBackSet={notFollowingBackSet}

              unfollowedSet={unfollowedSet}

              inactiveSet={inactiveSet}

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

              closeFriendsSet={closeFriendsSet}

              notFollowingBackSet={notFollowingBackSet}

              unfollowedSet={unfollowedSet}

              inactiveSet={inactiveSet}

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

              closeFriendsSet={closeFriendsSet}

              notFollowingBackSet={notFollowingBackSet}

              unfollowedSet={unfollowedSet}

              inactiveSet={inactiveSet}

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

              closeFriendsSet={closeFriendsSet}

              notFollowingBackSet={notFollowingBackSet}

              unfollowedSet={unfollowedSet}

              inactiveSet={inactiveSet}

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

              closeFriendsSet={closeFriendsSet}

              notFollowingBackSet={notFollowingBackSet}

              unfollowedSet={unfollowedSet}

              inactiveSet={inactiveSet}

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

              closeFriendsSet={closeFriendsSet}

              notFollowingBackSet={notFollowingBackSet}

              unfollowedSet={unfollowedSet}

              inactiveSet={inactiveSet}

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

              closeFriendsSet={closeFriendsSet}

              notFollowingBackSet={notFollowingBackSet}

              unfollowedSet={unfollowedSet}

              inactiveSet={inactiveSet}

              />

            </div>

          )
        }




      </div>


    </main>

  );

}



export default App;
