import React, { useEffect, useState } from 'react';
import '../styles/banks.css';

const Banks = () => {
  const [ifse, setIfse] = useState(null); // Bank details (if fetched)
  const [search, setSearch] = useState(''); // IFSC search input
  const [query, setQuery] = useState(''); // Query state (for IFSC code search)
  const [states, setStates] = useState([]); // List of states
  const [districts, setDistricts] = useState([]); // List of districts for the selected state
  const [cities, setCities] = useState([]); // List of cities for the selected district
  const [centers, setCenters] = useState([]); // List of centers for the selected city
  const [branches, setBranches] = useState([]); // List of branches for the selected center
  const [selectedState, setSelectedState] = useState(''); // State selected from dropdown
  const [selectedDistrict, setSelectedDistrict] = useState(''); // District selected from dropdown
  const [selectedCity, setSelectedCity] = useState(''); // City selected from dropdown
  const [selectedCenter, setSelectedCenter] = useState(''); // Center selected from dropdown
  const [selectedBranch, setSelectedBranch] = useState(''); // Branch selected from dropdown
  const [branchDetails, setBranchDetails] = useState(null); // Store branch details
  const [errorMessage, setErrorMessage] = useState(''); // For error messages

  // Fetch states when the component mounts
  useEffect(() => {
    fetch('https://bank-apis.justinclicks.com/API/V1/STATE/')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStates(data); // Assuming it's an array of states
        } else {
          setErrorMessage('Error: Could not load states');
        }
      })
      .catch((error) => {
        console.error('Error fetching states:', error);
        setErrorMessage('Error fetching states');
      });
  }, []);

  // Fetch district details when state is selected
  useEffect(() => {
    if (selectedState) {
      fetch(`https://bank-apis.justinclicks.com/API/V1/STATE/${selectedState}`)
        .then((response) => response.json())
        .then((data) => {
          setDistricts(data || []); // Set the districts or empty if no data
        })
        .catch((error) => {
          console.error('Error fetching districts:', error);
          setDistricts([]);
        });
    }
  }, [selectedState]);

  // Fetch cities details when district is selected
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://bank-apis.justinclicks.com/API/V1/STATE/${selectedState}/${selectedDistrict}`)
        .then((response) => response.json())
        .then((data) => {
          setCities(data || []); // Set the cities or empty if no data
        })
        .catch((error) => {
          console.error('Error fetching cities:', error);
          setCities([]);
        });
    }
  }, [selectedDistrict, selectedState]);

  // Fetch centers details when city is selected
  useEffect(() => {
    if (selectedCity) {
      fetch(`https://bank-apis.justinclicks.com/API/V1/STATE/${selectedState}/${selectedDistrict}/${selectedCity}`)
        .then((response) => response.json())
        .then((data) => {
          setCenters(data || []); // Set the centers or empty if no data
        })
        .catch((error) => {
          console.error('Error fetching centers:', error);
          setCenters([]);
        });
    }
  }, [selectedCity, selectedDistrict, selectedState]);

  // Fetch branches details when center is selected
  useEffect(() => {
    if (selectedCenter) {
      fetch(`https://bank-apis.justinclicks.com/API/V1/STATE/${selectedState}/${selectedDistrict}/${selectedCity}/${selectedCenter}`)
        .then((response) => response.json())
        .then((data) => {
          setBranches(data || []); // Set the branches or empty if no data
        })
        .catch((error) => {
          console.error('Error fetching branches:', error);
          setBranches([]);
        });
    }
  }, [selectedCenter, selectedCity, selectedDistrict, selectedState]);

  // Fetch branch details when a branch is selected
  useEffect(() => {
    if (selectedBranch && selectedCenter && selectedCity && selectedDistrict && selectedState) {
      fetch(`https://bank-apis.justinclicks.com/API/V1/STATE/${selectedState}/${selectedDistrict}/${selectedCity}/${selectedCenter}/${selectedBranch}.json`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Branch Data:", data); // Log data to check if it's correct
          setBranchDetails(data); // Set branch details if returned
          setErrorMessage(''); // Clear any existing errors
        })
        .catch((error) => {
          console.error('Error fetching branch details:', error);
          setBranchDetails(null); // Reset branch details on error
          setErrorMessage('Error fetching branch details');
        });
    }
  }, [selectedBranch, selectedCenter, selectedCity, selectedDistrict, selectedState]); // Trigger when branch, center, city, district, or state changes

  // Fetch bank details based on IFSC code
  useEffect(() => {
    if (query) {
      fetch(`https://bank-apis.justinclicks.com/API/V1/IFSC/${query}`)
        .then((response) => response.json())
        .then((Data) => {
          setIfse(Data);
        })
        .catch((error) => {
          console.error('Error fetching IFSC data:', error);
          setIfse(null); // Reset if there's an error
        });
    }
  }, [query]);

  // Handle the search button click (for IFSC code)
  const handleSearchClick = (e) => {
    e.preventDefault(); // Prevents the default form behavior
    if (search.trim()) {
      setQuery(search); // Trigger the query fetch when the search button is clicked
    }
  };

  return (
    <div className='mainbank'>
      <div className="search-container">
        <h1>BankAPIs</h1>

        {/* State Dropdown */}
        <div className="state-dropdown">
          <label htmlFor="state">Select State:</label>
          <select
            id="state"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)} // Set selected state
          >
            <option value="">Select a State</option>
            {states.length > 0 ? (
              states.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))
            ) : (
              <option disabled>Loading States...</option>
            )}
          </select>
        </div>

        {/* District Dropdown */}
        {selectedState && (
          <div className="district-dropdown">
            <label htmlFor="district">Select District:</label>
            <select
              id="district"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)} // Set selected district
            >
              <option value="">Select a District</option>
              {districts.length > 0 ? (
                districts.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))
              ) : (
                <option disabled>Loading Districts...</option>
              )}
            </select>
          </div>
        )}

        {/* City Dropdown */}
        {selectedDistrict && (
          <div className="city-dropdown">
            <label htmlFor="city">Select City:</label>
            <select
              id="city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)} // Set selected city
            >
              <option value="">Select a City</option>
              {cities.length > 0 ? (
                cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))
              ) : (
                <option disabled>Loading Cities...</option>
              )}
            </select>
          </div>
        )}

        {/* Center Dropdown */}
        {selectedCity && (
          <div className="center-dropdown">
            <label htmlFor="center">Select Center:</label>
            <select
              id="center"
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)} // Set selected center
            >
              <option value="">Select a Center</option>
              {centers.length > 0 ? (
                centers.map((center, index) => (
                  <option key={index} value={center}>
                    {center}
                  </option>
                ))
              ) : (
                <option disabled>Loading Centers...</option>
              )}
            </select>
          </div>
        )}

        {/* Branch Dropdown */}
        {selectedCenter && (
          <div className="branch-dropdown">
            <label htmlFor="branch">Select Branch:</label>
            <select
              id="branch"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)} // Set selected branch
            >
              <option value="">Select a Branch</option>
              {branches.length > 0 ? (
                branches.map((branch, index) => (
                  <option key={index} value={branch}>
                    {branch}
                  </option>
                ))
              ) : (
                <option disabled>Loading Branches...</option>
              )}
            </select>
          </div>
        )}

        {/* IFSC Code Search */}
        <input
          type="text"
          className='searchbar'
          value={search}
          placeholder='Enter Your IFSC Code'
          onChange={(e) => setSearch(e.target.value)} // Update search input on change
        />
        <button className="searchbutton" onClick={handleSearchClick}>
          Search
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && <div className="error">{errorMessage}</div>}

      {/* Display branch details */}
      <div className="div">
        {branchDetails ? (
          <div className="info">
            <h2>Branch Details</h2>
            <ul>
              {Object.entries(branchDetails).map(([key, value]) => (
                <div className="fetch" key={key}>
                  <li style={{ listStyleType: 'none' }}>
                    <strong>{key}:</strong> {value !== null ? value : 'N/A'}
                  </li>
                </div>
              ))}
            </ul>
          </div>
        ) : (
          selectedBranch && <div className="loading">Loading Branch Details...</div>
        )}
      </div>

      {/* Display bank details or loading state for IFSC */}
      <div className="div">
        {ifse ? (
          <div className="info">
            <ul>
              {Object.entries(ifse).map(([key, value]) => (
                <div className="fetch" key={key}>
                  <li style={{ listStyleType: 'none' }}>
                    <strong>{key}:</strong> {value !== null ? value : 'N/A'}
                  </li>
                </div>
              ))}
            </ul>
          </div>
        ) : (
          query && <div className="loading">Loading........</div>
        )}
      </div>
    </div>
  );
};

export default Banks;