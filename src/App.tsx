import { Upload } from "lucide-react";

function App() {
  return (
    <div className="app">

      <div className="card">

        <h1>
          Instagram Follow Analyzer
        </h1>

        <p>
          Analizza chi non ti segue più
          direttamente dal tuo archivio Instagram.
        </p>

        <label className="upload-button">

          <Upload size={22} />

          Importa ZIP Instagram

          <input
            type="file"
            accept=".zip"
            hidden
          />

        </label>

      </div>

    </div>
  );
}

export default App;
