import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from "axios";
import {AuthContext, useAuthState} from "../context/AuthContext";

const endpointlink = `https://polar-lake-14365.herokuapp.com/api/auth/signin`;

function SignIn() {
  //context-functie
  const { login } = useContext(AuthContext);
  const { isAuthenticated } = useAuthState();

  //state voor invoervelden (omdat het formulier met controlled components werkt!)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  //state voor gebruikersfeedback
  const [loading, toggleLoading] = useState(false);
  const [error, setError] = useState('');

  //react-router dingen
  const history = useHistory();

  useEffect(() => {
    if (isAuthenticated === true) {
      history.push('/profile');
    }
  }, [isAuthenticated]);



  async function onSubmit(event) {
    toggleLoading(true);
    setError('');
    //Deze hoeft alleen als je controlled components gebruikt
    event.preventDefault();

    try {
      const response = await axios.post(`https://polar-lake-14365.herokuapp.com/api/auth/signin`, {
        username: username,
        password: password,
      })

      //handel het "inloggen" aan de voorkant af in de contect met de data die we binnen hebben gekregen!
      login(response.data);
    } catch (e) {
      console.log(e);
      setError('Inloggen is mislukt');
      // Tip: als de gebruikersnaam niet bestaat of wachtwoord is verkeerd, stuurt de backend een 401
    }
    toggleLoading(false);

  }

  return (
    <>
      <h1>Inloggen</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab alias cum debitis dolor dolore fuga id molestias qui quo unde?</p>

      <form onSubmit={onSubmit}>
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
            onChange={(e) => setPassword(e.target.value)} />
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
      <p>Heb je nog geen account? <Link to="/signup">Registreer</Link> je dan eerst.</p>
    </>
  );
}

export default SignIn;