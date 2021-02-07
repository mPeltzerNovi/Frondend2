import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

function SignUp() {



  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // state voor gebruikers-feedback
  const [createUserSuccess, setCreateUserSucces] = useState(false);
  const [loading, toggleLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(event) {
    toggleLoading(true);
    setError('');
    //Dit alleen omdat we controlled components gebruiken, React-hook-form hoeft dit niet
    event.preventDefault();

    console.log(email, username, password);

    try {
      //1. Gebruik de data uit het formulier om een gebruiker aan te maken (check documentatie)

      //const response = await axios.post('https://polar-lake-14365.herokuapp/api/auth/signup', {
      const response = await axios.post(`http://localhost:8080/api/auth/signup`, {

        username: username,
        email: email,
        password: password,
        role: ["user"],
        //"admin" toevoegversie om stap 8 de lijst opvragen te tesen
        //role: ["admin", "mod", "user"],
      });

      //2. Kijk goed wat je terugkrijgt
      console.log(response);


      if (response.status === 200) {
        //3. Als het gelukt is, willen we DIT  component opslaan dat het gelukt is
        setCreateUserSucces(true);
      }
    }catch (e) {
      console.error(e);
      if (e.message.includes('400')) {
        setError('Er bestaat al een account met deze gebruikersnaam');
      } else {
        setError('Er is iets misgegaan bij het verzenden. Probeer het opnieuw');
      }
    }
    //Als het try-catch blok hier klaar is dan zetten we toggleLoading weer op false
    toggleLoading(false);

  }

  // 1. Implementeer loading en error in beide formulieren
  // 2. Zorg ervoor dat de knoppen disabled zijn tijdens het laden en zorg ervoor dat de gebruiker dat ziet
  // 3. Zorg ervoor dat als er  iets misgaat dit ook met de gebruiker wordt gecommuniceerd!

  return (
    <>
      <h1>Registreren</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab alias cum debitis dolor dolore fuga id molestias qui quo unde?</p>
      {createUserSuccess === true && (
          <h2 className="message-success">Het is gelukt! Klik <Link to="/signin">hier</Link> om je in te loggen </h2>
      )}
      <form onSubmit={onSubmit}>
        <label htmlFor="email-field">
          Email:
          <input
            type="email"
            id="email-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label htmlFor="username-field">
          Gebruikersnaam:
          <input
            type="text"
            id="username-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label htmlFor="password-field">
          Wachtwoord:
          <input
            type="password"
            id="password-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>
        </label>
        <button
          type="submit"
          className="form-button"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Maak account aan'}
        </button>
        {error && <p>{error}</p>}
      </form>
      <p>Heb je al een account? Je kunt je <Link to="/signin">hier</Link> inloggen.</p>
    </>
  );
}

export default SignUp;