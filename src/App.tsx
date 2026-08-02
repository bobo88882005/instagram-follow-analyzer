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


const [result,setResult]=useState<any>(null);

const [loading,setLoading]=useState(false);

const [filter,setFilter]=useState("all");

const [section,setSection]=useState<string|null>(null);





async function handleUpload(
e:React.ChangeEvent<HTMLInputElement>
){


const file=e.target.files?.[0];

if(!file)return;


setLoading(true);


const data=
await readInstagramZip(file);


const analysis=
analyzeInstagram(data);


setResult(analysis);


setLoading(false);


}





function profile(user:string){

return `https://www.instagram.com/${encodeURIComponent(user)}`;

}





function usersToShow(){


if(filter==="inactive")

return result.possibleInactive;


if(filter==="missing")

return result.notFollowingBack;


return result.notFollowingBack;


}





function UserList(){

const users=
usersToShow();


if(!users.length)

return <div className="empty">
Nessun risultato
</div>;



return (

<div className="user-list">

{
users.slice(0,200)
.map((u:string)=>(

<a

key={u}

href={profile(u)}

target="_blank"

rel="noreferrer"

>

@{u}

<ChevronRight size={16}/>

</a>

))

}

</div>

);


}





return (

<div className="app">

<div className="card">



{!result && (

<label className="upload-button">

<Upload/>

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

)}





{result && (


<>


<h1>
Non ti seguono
</h1>



<div className="stats">

<div>

Followers

<strong>
{result.followersCount}
</strong>

</div>


<div>

Following

<strong>
{result.followingCount}
</strong>

</div>


</div>




<div className="filters">


<button

onClick={()=>setFilter("all")}

>

🔴 Non ricambiano

</button>



<button

onClick={()=>setFilter("inactive")}

>

👻 Possibili inattivi

</button>


</div>




<UserList />






<div className="menu-card"

onClick={()=>setSection("pending")}

>

<Clock/>

Pending Requests

<ChevronRight/>

</div>



<div className="menu-card"

onClick={()=>setSection("received")}

>

<UserPlus/>

Richieste ricevute

<ChevronRight/>

</div>




<div className="menu-card"

onClick={()=>setSection("unfollow")}

>

<UserX/>

Recently Unfollowed

<ChevronRight/>

</div>



<button

className="reset"

onClick={()=>setResult(null)}

>

<RefreshCcw/>

Nuova analisi

</button>


</>


)}


</div>

</div>


);


}


export default App;
