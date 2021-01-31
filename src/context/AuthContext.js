import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';


const AuthContext = createContext({});

function AuthContextProvider({ children }) {
    const  [authState, setAuthState] = useState({
        status: 'pending',
        error: null,
        user: null,
    })

    useEffect(() => {
        //haal uit de local storage de JWT Token ->Stap 9 Nova (allerlaatste stap, in de context)
        //Als die er niet is, kunnen we gewoon verder
        //Als die token er wel is, dan betekend dat dat de applicatie herstart is //applicatie is herstart waardoor contex is leeggegooid
        //En dan willen we nog even onze gebruikersdata (username, etc.) (opnieuw) ophalen. Met een request

        const token = localStorage.getItem('token');

        async function getUserInfo() {
            try {
                //We kunnen de gebruikersdata ophalen omdat we onszelf authenticeren met de token
                    const response = await axios.get('https://polar-lake-14365.herokuapp.com/api/user', {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log(response);

                //met het resultaat vullen we de context
                setAuthState({
                    ...authState,
                    user: {
                        id: response.id,
                        username: response.username,
                        email: response.email,
                    },
                    status: 'done',
                });

            }catch (e) {
                //Gaat er toch iets mis? Dan zetten we de error in de context
                setAuthState({
                    ...authState,
                    user: null,
                    error: e,
                    status: 'done',
                });
            }
        }

        //Als we GEEN userinformatie meer in de applicatie hebben, maar er staat WEL een token in
        //local storage, gaan we handmatig de gebruikersdata ophalen door de getUserInfo functie van hierboven aan te roepen
        if (authState.user === null && token) {
            getUserInfo();
        } else {
            //Als er geen ingelogde gebruiker hoeft te zijn, zetten we de context naar de basis state
            setAuthState({
                ...authState,
                error: null,
                user: null,
                status: 'done',
            });
        }

    }, []);

    function login(data) {
        //1. de token willen we in de local storage zetten
        localStorage.setItem('token', data.accessToken);

        //2. de user-informatie willen we in de context zetten
        setAuthState({
            ...authState,
            user: {
                username: data.username,
                email: data.email,
                roles: data.roles,
            }
        })


        //3. als dat allemaal gelukt is, willen we doorgelinkt worden naar de profielpagina!
        //DIt doen we in het component dat deze functie aanroept zelf!
    }

    function logout() {
        //1. Maak local storage leeg
        localStorage.clear();
        //2. Haal user uit de context state
        setAuthState({
            ...authState,
            user: null,
        })
    }

    //als je hem helemaal uit zou schrijven en als variabele mee zou geven aan AuthContext.Provider:
    //const porviderData = {
    //    ...authState,
    //    login: login,
    //    logout: logout,
    //};


    return(
      <AuthContext.Provider value={{ ...authState, login, logout }}>
          {authState.status === 'done' && children}
          {authState.status === 'pending' && <p>Loading...</p>}
      </AuthContext.Provider>
    );
}

function useAuthState() {
    const authState = useContext(AuthContext);

    //iemand is geauthoriseerd wanneer de status === 'done'
    //en als er een gebruiker in de authState staat
    const isDone = authState.status == 'done';
    const isAuthenticated = authState.user !== null && isDone;

    //console.log('Ik ben authenticated:', isAuthenticated);

    return {
        ...authState,
        isAuthenticated: isAuthenticated,

    }


}

export {
    AuthContext,
    useAuthState,
    AuthContextProvider,
}


//We willen in de context bijhouden of we op dit moment:
//gebruikersdata hebben
//of de gebruiker geauthoriseerd is om data te mogen bekijken