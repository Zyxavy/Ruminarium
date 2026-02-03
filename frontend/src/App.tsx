import { useEffect } from 'react'

function App() {
  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then(response => response.json())
      .then(data => console.log("Backend says:", data))
      .catch(error => console.error("Error connecting to backend:", error));
  }, []);

  return (
    <div>
      <h1>Journal App</h1>
      <p>Check the browser console (F12) to see if the backend replied!</p>
    </div>
  )
}

export default App