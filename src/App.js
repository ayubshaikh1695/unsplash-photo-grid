import React from "react";
import PhotoGrid from "./components/PhotoGrid/PhotoGrid";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Unsplash Photo Grid</h1>
      </header>
      <main className="App-main">
        <PhotoGrid />
      </main>
    </div>
  );
}

export default App;
