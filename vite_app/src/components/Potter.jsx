"use client"

import { useState, useEffect } from "react"
import "../styles/potter.css"

const Potter = () => {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [houses, setHouses] = useState(["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"])
  const [selectedHouse, setSelectedHouse] = useState("")

  useEffect(() => {
    fetchCharacters()
  }, [])

  useEffect(() => {
    if (selectedHouse) {
      filterCharactersByHouse(selectedHouse)
    } else if (selectedHouse === "") {
      fetchCharacters()
    }
  }, [selectedHouse])

  const fetchCharacters = () => {
    setLoading(true)
    setError(null)

    // Using a more reliable Harry Potter API endpoint
    fetch("https://hp-api.onrender.com/api/characters")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch characters")
        }
        return response.json()
      })
      .then((data) => {
        // Limit to a reasonable number of characters and add IDs if missing
        const processedData = data.slice(0, 30).map((char, index) => ({
          ...char,
          id: char.id || `char-${index}`,
          // Ensure house is capitalized properly
          house: char.house || "",
        }))
        setCharacters(processedData)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  const filterCharactersByHouse = (house) => {
    setLoading(true)
    setError(null)

    fetch("https://hp-api.onrender.com/api/characters")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch characters")
        }
        return response.json()
      })
      .then((data) => {
        // Filter by house and add IDs if missing
        const filteredData = data
          .filter((char) => char.house && char.house.toLowerCase() === house.toLowerCase())
          .slice(0, 30)
          .map((char, index) => ({
            ...char,
            id: char.id || `char-${index}`,
          }))
        setCharacters(filteredData)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  const handleHouseChange = (e) => {
    setSelectedHouse(e.target.value)
  }

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character)
  }

  const closeModal = () => {
    setSelectedCharacter(null)
  }

  const getHouseColor = (house) => {
    switch (house.toLowerCase()) {
      case "gryffindor":
        return "#740001"
      case "slytherin":
        return "#1a472a"
      case "ravenclaw":
        return "#0e1a40"
      case "hufflepuff":
        return "#ecb939"
      default:
        return "#333"
    }
  }

  return (
    <div className="potter-container">
      <h1>Harry Potter Characters</h1>

      <div className="filter-container">
        <select value={selectedHouse} onChange={handleHouseChange} className="house-select">
          <option value="">All Houses</option>
          {houses.map((house, index) => (
            <option key={index} value={house}>
              {house}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="loading">Loading characters...</div>}

      {error && <div className="error">Error: {error}</div>}

      {!loading && !error && characters.length === 0 && <div className="no-results">No characters found.</div>}

      <div className="characters-grid">
        {characters.map((character) => (
          <div
            key={character.id}
            className="character-card"
            onClick={() => handleCharacterClick(character)}
            style={{
              borderColor: character.house ? getHouseColor(character.house) : "#333",
            }}
          >
            <div className="character-image-container">
              {character.image && character.image !== "" ? (
                <img src={character.image || "/placeholder.svg"} alt={character.name} className="character-image" />
              ) : (
                <div
                  className="character-placeholder"
                  style={{
                    backgroundColor: character.house ? getHouseColor(character.house) : "#333",
                  }}
                >
                  {character.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="character-info">
              <h3 className="character-name">{character.name}</h3>
              {character.house && (
                <p
                  className="character-house"
                  style={{
                    color: getHouseColor(character.house),
                  }}
                >
                  {character.house}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedCharacter && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              ×
            </button>

            <div
              className="modal-header"
              style={{
                borderColor: selectedCharacter.house ? getHouseColor(selectedCharacter.house) : "#333",
              }}
            >
              <h2>{selectedCharacter.name}</h2>
              {selectedCharacter.house && (
                <div className="character-tags">
                  <span
                    className="character-tag"
                    style={{
                      backgroundColor: getHouseColor(selectedCharacter.house),
                    }}
                  >
                    {selectedCharacter.house}
                  </span>
                </div>
              )}
            </div>

            <div className="modal-body">
              <div className="modal-image-container">
                {selectedCharacter.image && selectedCharacter.image !== "" ? (
                  <img src={selectedCharacter.image || "/placeholder.svg"} alt={selectedCharacter.name} />
                ) : (
                  <div
                    className="character-placeholder large"
                    style={{
                      backgroundColor: selectedCharacter.house ? getHouseColor(selectedCharacter.house) : "#333",
                    }}
                  >
                    {selectedCharacter.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="character-details">
                <div className="detail-item">
                  <span className="detail-label">Actor:</span>
                  <span className="detail-value">{selectedCharacter.actor || "Unknown"}</span>
                </div>

                {selectedCharacter.dateOfBirth && (
                  <div className="detail-item">
                    <span className="detail-label">Date of Birth:</span>
                    <span className="detail-value">{selectedCharacter.dateOfBirth}</span>
                  </div>
                )}

                {selectedCharacter.ancestry && (
                  <div className="detail-item">
                    <span className="detail-label">Ancestry:</span>
                    <span className="detail-value">{selectedCharacter.ancestry}</span>
                  </div>
                )}

                {selectedCharacter.patronus && (
                  <div className="detail-item">
                    <span className="detail-label">Patronus:</span>
                    <span className="detail-value">{selectedCharacter.patronus}</span>
                  </div>
                )}

                {selectedCharacter.wand && selectedCharacter.wand.wood && (
                  <div className="detail-item">
                    <span className="detail-label">Wand:</span>
                    <span className="detail-value">
                      {selectedCharacter.wand.wood}
                      {selectedCharacter.wand.core ? ` with ${selectedCharacter.wand.core} core` : ""}
                      {selectedCharacter.wand.length ? `, ${selectedCharacter.wand.length}"` : ""}
                    </span>
                  </div>
                )}

                <div className="detail-item">
                  <span className="detail-label">Alive:</span>
                  <span className="detail-value">{selectedCharacter.alive ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Potter

