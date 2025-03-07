"use client"

import { useState, useEffect } from "react"
import "../styles/cocktails.css"

const Cocktails = () => {
  const [cocktails, setCocktails] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCocktail, setSelectedCocktail] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")

  useEffect(() => {
    // Fetch cocktail categories
    fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        return response.json()
      })
      .then((data) => {
        setCategories(data.drinks)
      })
      .catch((err) => {
        setError(err.message)
      })

    // Fetch random cocktails initially
    fetchCocktails()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      fetchCocktailsByCategory(selectedCategory)
    }
  }, [selectedCategory])

  const fetchCocktails = () => {
    setLoading(true)
    setError(null)

    // Fetch multiple random cocktails to display
    const fetchPromises = Array(8)
      .fill()
      .map(() =>
        fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php").then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch cocktails")
          }
          return response.json()
        }),
      )

    Promise.all(fetchPromises)
      .then((results) => {
        const allCocktails = results.map((data) => data.drinks[0])
        setCocktails(allCocktails)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  const fetchCocktailsByCategory = (category) => {
    setLoading(true)
    setError(null)

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch cocktails by category")
        }
        return response.json()
      })
      .then((data) => {
        setCocktails(data.drinks || [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  const searchCocktails = () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError(null)

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to search cocktails")
        }
        return response.json()
      })
      .then((data) => {
        setCocktails(data.drinks || [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    searchCocktails()
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  const handleCocktailClick = (cocktail) => {
    // Fetch full cocktail details
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktail.idDrink}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch cocktail details")
        }
        return response.json()
      })
      .then((data) => {
        setSelectedCocktail(data.drinks[0])
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  const closeModal = () => {
    setSelectedCocktail(null)
  }

  const getIngredients = (cocktail) => {
    const ingredients = []
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`]
      const measure = cocktail[`strMeasure${i}`]

      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient,
          measure: measure || "",
        })
      }
    }
    return ingredients
  }

  return (
    <div className="cocktails-container">
      <h1>Discover Amazing Cocktails</h1>

      <div className="search-filter-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search for cocktails..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        <div className="filter-container">
          <select value={selectedCategory} onChange={handleCategoryChange} className="category-select">
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category.strCategory}>
                {category.strCategory}
              </option>
            ))}
          </select>

          <button onClick={fetchCocktails} className="random-button">
            Random Cocktails
          </button>
        </div>
      </div>

      {loading && <div className="loading">Loading cocktails...</div>}

      {error && <div className="error">Error: {error}</div>}

      {!loading && !error && cocktails.length === 0 && (
        <div className="no-results">No cocktails found. Try a different search term.</div>
      )}

      <div className="cocktails-grid">
        {cocktails.map((cocktail) => (
          <div key={cocktail.idDrink} className="cocktail-card" onClick={() => handleCocktailClick(cocktail)}>
            <div className="cocktail-image-container">
              <img
                src={cocktail.strDrinkThumb || "/placeholder.svg"}
                alt={cocktail.strDrink}
                className="cocktail-image"
              />
            </div>
            <div className="cocktail-info">
              <h3 className="cocktail-title">{cocktail.strDrink}</h3>
              <p className="cocktail-category">{cocktail.strCategory}</p>
              <p className="cocktail-glass">{cocktail.strGlass}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedCocktail && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              ×
            </button>

            <div className="modal-header">
              <h2>{selectedCocktail.strDrink}</h2>
              <div className="cocktail-tags">
                <span className="cocktail-tag">{selectedCocktail.strCategory}</span>
                <span className="cocktail-tag">{selectedCocktail.strAlcoholic}</span>
                <span className="cocktail-tag">{selectedCocktail.strGlass}</span>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-image-container">
                <img src={selectedCocktail.strDrinkThumb || "/placeholder.svg"} alt={selectedCocktail.strDrink} />
              </div>

              <div className="ingredients-section">
                <h3>Ingredients</h3>
                <ul className="ingredients-list">
                  {getIngredients(selectedCocktail).map((item, index) => (
                    <li key={index}>
                      <span className="ingredient-name">{item.ingredient}</span>
                      <span className="ingredient-measure">{item.measure}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="instructions-section">
                <h3>Instructions</h3>
                <p>{selectedCocktail.strInstructions}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cocktails

