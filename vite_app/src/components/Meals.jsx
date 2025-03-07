"use client"

import { useState, useEffect } from "react"
import "../styles/meals.css"

const Meals = () => {
  const [meals, setMeals] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")

  useEffect(() => {
    // Fetch meal categories
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        return response.json()
      })
      .then((data) => {
        setCategories(data.categories)
      })
      .catch((err) => {
        setError(err.message)
      })

    // Fetch random meals initially
    fetchMeals()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      fetchMealsByCategory(selectedCategory)
    }
  }, [selectedCategory])

  const fetchMeals = () => {
    setLoading(true)
    setError(null)

    // Fetch multiple random meals to display
    const fetchPromises = Array(8)
      .fill()
      .map(() =>
        fetch("https://www.themealdb.com/api/json/v1/1/random.php").then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch meals")
          }
          return response.json()
        }),
      )

    Promise.all(fetchPromises)
      .then((results) => {
        const allMeals = results.map((data) => data.meals[0])
        setMeals(allMeals)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  const fetchMealsByCategory = (category) => {
    setLoading(true)
    setError(null)

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch meals by category")
        }
        return response.json()
      })
      .then((data) => {
        setMeals(data.meals || [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  const searchMeals = () => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError(null)

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to search meals")
        }
        return response.json()
      })
      .then((data) => {
        setMeals(data.meals || [])
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
    searchMeals()
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  const handleMealClick = (meal) => {
    // Fetch full meal details
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch meal details")
        }
        return response.json()
      })
      .then((data) => {
        setSelectedMeal(data.meals[0])
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  const closeModal = () => {
    setSelectedMeal(null)
  }

  const getIngredients = (meal) => {
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`]
      const measure = meal[`strMeasure${i}`]

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
    <div className="meals-container">
      <h1>Explore Delicious Meals</h1>

      <div className="search-filter-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search for meals..."
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
            {categories.map((category) => (
              <option key={category.idCategory} value={category.strCategory}>
                {category.strCategory}
              </option>
            ))}
          </select>

          <button onClick={fetchMeals} className="random-button">
            Random Meals
          </button>
        </div>
      </div>

      {loading && <div className="loading">Loading meals...</div>}

      {error && <div className="error">Error: {error}</div>}

      {!loading && !error && meals.length === 0 && (
        <div className="no-results">No meals found. Try a different search term.</div>
      )}

      <div className="meals-grid">
        {meals.map((meal) => (
          <div key={meal.idMeal} className="meal-card" onClick={() => handleMealClick(meal)}>
            <div className="meal-image-container">
              <img src={meal.strMealThumb || "/placeholder.svg"} alt={meal.strMeal} className="meal-image" />
            </div>
            <div className="meal-info">
              <h3 className="meal-title">{meal.strMeal}</h3>
              <p className="meal-category">{meal.strCategory}</p>
              <p className="meal-area">{meal.strArea}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedMeal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              ×
            </button>

            <div className="modal-header">
              <h2>{selectedMeal.strMeal}</h2>
              <div className="meal-tags">
                <span className="meal-tag">{selectedMeal.strCategory}</span>
                <span className="meal-tag">{selectedMeal.strArea}</span>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-image-container">
                <img src={selectedMeal.strMealThumb || "/placeholder.svg"} alt={selectedMeal.strMeal} />
              </div>

              <div className="ingredients-section">
                <h3>Ingredients</h3>
                <ul className="ingredients-list">
                  {getIngredients(selectedMeal).map((item, index) => (
                    <li key={index}>
                      <span className="ingredient-name">{item.ingredient}</span>
                      <span className="ingredient-measure">{item.measure}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="instructions-section">
                <h3>Instructions</h3>
                <p>{selectedMeal.strInstructions}</p>
              </div>

              {selectedMeal.strYoutube && (
                <div className="video-section">
                  <h3>Video Tutorial</h3>
                  <a href={selectedMeal.strYoutube} target="_blank" rel="noopener noreferrer" className="video-link">
                    Watch on YouTube
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Meals

