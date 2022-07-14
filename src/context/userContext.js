import React, { createContext, useContext, useState } from 'react'

const UserContext = createContext();
const useUserContext = () => useContext(UserContext);

const UserContextProvider = ({children}) => {

    const [userDetails, setUserDetails] = useState({
        userID: 123,
        version: 2
    })

    const userDetailsFunc = (uid, version) => {
        setUserDetails({
          userId : uid,
          version: version
        })
  }

    return (
        <UserContext.Provider value={{userDetails, setUserDetails, userDetailsFunc}}>
            {children}
        </UserContext.Provider>
    )
}

export {useUserContext, UserContextProvider}