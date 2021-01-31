import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Button from './Button';
import {AuthContext, useAuthState} from "../context/AuthContext";



function Header() {
  const history = useHistory();

  //context dingen

  const { isAuthenticated } = useAuthState();
  const { logout } = useContext(AuthContext);

  //useEffect(() => {
  //  if (isAuthenticated === false) {
  //    history.push('/signin');
  //  }
  //}, [isAuthenticated]);

  return (
    <header>
      <div>
        <Button>
          Hallo daar!
        </Button>


        {isAuthenticated ? (
            <button
                type="button"
                onClick={() => logout()}
            >
              Log uit
            </button>
        ) : (
            <>
            <button
                type="button"
                onClick={() => history.push('/signin')}
            >
              Log in
            </button>
            <button
                type="button"
                onClick={() => history.push('/signup')}
            >
              Registreren
            </button>
            </>
        )}
      </div>
    </header>
  );
};

export default Header;