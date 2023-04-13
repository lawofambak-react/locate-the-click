import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(() => {
    const initialCount = localStorage.getItem("count");

    return initialCount !== null ? Number.parseInt(initialCount) : 0;
  });

  const [userCountry, setUserCountry] = useState("");

  const [geolocationEnabled, setGeolocationEnabled] = useState(false);

  const [message, setMessage] = useState("");

  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const getCountry = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();

      if (data && data.address) {
        const country = data.address.country;
        return country;
      } else {
        return "";
      }
    } catch (err) {
      setMessage("Unable to get location");
    }
  };

  useEffect(() => {
    localStorage.setItem("count", count.toString());
  }, [count]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const country = await getCountry(
          position.coords.latitude,
          position.coords.longitude
        );

        setUserCountry(country);
        setGeolocationEnabled(true);
      },
      (err) => {
        setMessage("Unable to get location");
      }
    );
  }, []);

  return (
    <div className="app">
      <h1>Chasing the Clicks</h1>
      <div className="count-container">
        <div className="count">
          <p>{count}</p>
          <button onClick={incrementCount}>Increment Count</button>
        </div>
        {geolocationEnabled ? (
          <div className="user-location">
            <p>Clicking from {userCountry}</p>
          </div>
        ) : (
          <div className="geolocation-message">
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
