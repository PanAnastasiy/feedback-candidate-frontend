import React from 'react';
import './App.css';
import { AppRoutes } from "./components/AppRoutes/AppRoutes";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div
      className="App"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />

      <main style={{ flexGrow: 1 }}>
        <AppRoutes />
      </main>

      <Footer />
    </div>
  );
}

export default App;
