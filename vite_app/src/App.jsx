import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Meals from "./components/Meals"
import Cocktails from "./components/Cocktails"
import Potter from "./components/Potter"
import Banks from "./components/Banks"
import Navbar from "./components/Navbar"
import "./styles/styles.css"

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/meals" element={<Meals />} />
            <Route path="/cocktails" element={<Cocktails />} />
            <Route path="/potter" element={<Potter />} />
            <Route path="/banks" element={<Banks />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>© {new Date().getFullYear()} API Explorer</p>
        </footer>
      </div>
    </Router>
  )
}

function Home() {
  return (
    <div className="home">
      <h1>Welcome to API Explorer</h1>
      <p>Explore data from various APIs in one place</p>
      <div className="api-cards">
        <Link to="/meals" className="api-card">
          <h2>Meals</h2>
          <p>Explore delicious recipes from TheMealDB</p>
        </Link>
        <Link to="/cocktails" className="api-card">
          <h2>Cocktails</h2>
          <p>Discover amazing cocktail recipes from TheCocktailDB</p>
        </Link>
        <Link to="/potter" className="api-card">
          <h2>Harry Potter</h2>
          <p>Meet characters from the wizarding world</p>
        </Link>
        <Link to="/banks" className="api-card">
          <h2>Indian Banks</h2>
          <p>Find information about banks and branches in India</p>
        </Link>
      </div>
    </div>
  )
}

export default App

