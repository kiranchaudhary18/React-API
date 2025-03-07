"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import "../styles/navbar.css"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Close the menu when the route changes
    setIsOpen(false)
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path ? "active" : ""
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          API Explorer
        </Link>
        <div className="menu-icon" onClick={toggleMenu}>
          <span className={`hamburger ${isOpen ? "open" : ""}`}></span>
        </div>
        <ul className={`nav-menu ${isOpen ? "active" : ""}`}>
          <li className="nav-item">
            <Link to="/" className={`nav-link ${isActive("/")}`} onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/meals" className={`nav-link ${isActive("/meals")}`} onClick={closeMenu}>
              Meals
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/cocktails" className={`nav-link ${isActive("/cocktails")}`} onClick={closeMenu}>
              Cocktails
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/potter" className={`nav-link ${isActive("/potter")}`} onClick={closeMenu}>
              Potter
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/banks" className={`nav-link ${isActive("/banks")}`} onClick={closeMenu}>
              Banks
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar