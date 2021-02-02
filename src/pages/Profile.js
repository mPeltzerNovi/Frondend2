import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {useAuthState} from "../context/AuthContext";
import axios from "axios";

function Profile() {
    const { user } = useAuthState();

    //Wil je beschermde data uitlezen? stap 4 in de backend handleiding op film 02:28:30/ ->Stap 8 Nova
    //Dan zet je hier weer een useEffect met lege [] dependency array
    //asynchrome functie met try/catch
    //maar in het request stuur je de token die in de local storage staat, mee

    //-->Uitwerking

    //State voor de data-status
    const [error, setError] = useState('');
    const [protectedData, setProtectedData] = useState('');

    useEffect(() => {
        async function getProtectedData() {
            setError('');
            try {
                //haal de token op uit de local storage
                const token = localStorage.getItem('token');

                //haal de protected data op met de token meegestuurd
                //Het ging fout met de url uit Nova's uitwerking: 'http://localhost:8080/api/test/user'
                //Het moet zijn:
                const response = await axios.get('http://localhost:8080/api/test/user', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                });

                //zet deze data in de state zodat we dit in het component kunnen laten zien
                setProtectedData(response.data);
            } catch (e) {
                setError('Er is iets misgegaan bij het ophalen van de data')
            }
        }

        getProtectedData();
    }, []);

  return (
    <>
      <h1>Profielpagina</h1>
      <h2>Gegevens</h2>
        { user && (
            <>
                <p><strong>Gebruikersnaam:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </>
        )}

      <h2>Afgeschermde content voor ingelogde gebruikers</h2>
        {protectedData && <p>{protectedData}</p>}
        {error && <p className="message-error">{error}</p>}
      <p>Terug naar de <Link to="/">Homepagina</Link></p>
    </>
  );
};

export default Profile;