import { useEffect, useState } from "react";
import Spinner from "../Spinner/Spinner";
import "./Home.css"
import coin from '../assets/KC_Coin.svg'
import chip from '../assets/fa_ticket.svg'
import { url } from '../consts/config'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Example from "../Modal/Modal";
import { useUserContext } from "../context/userContext";


export default function App() {

  // to keep count of the number of games played, if acknoledgement is received or not, spinner reset state 
  const [playClicked, setPlayClicked] = useState(0)
  const [checkAck, setCheckAck] = useState(false)
  const [resetSpinner, setResetSpinner] = useState(false)

  // states to store APIs response
  const [getUserDetailsResponse, setGetUserDetailsResponse] = useState([])
  const [getStatusResponse, setGetStatusResponse] = useState([])
  const [gameStateResponse, setGameStateResponse] = useState([])

  
  const {userDetailsFunc } = useUserContext()

 
  //fetching user details from app
  useEffect(()=>{
    console.log("user context")
    userDetailsFunc()
// eslint-disable-next-line react-hooks/exhaustive-deps
},[])


// resets spinner to initial state and calls for acknowledgement API
  const finishHandler = () => {
    setResetSpinner(!resetSpinner)
    ackStatus(gameStateResponse[0]?.id)
  }

  // API CALLS
  const getUserDetails = async () => {
      try {

        const options = {
           method: "POST",
           headers: {
            authorization : "1234",
            'content-type' : "application/json"
           },
           body : JSON.stringify({
            data : {
              uid : "AyhFUze1cubqaTsDfAiaCYlQeLK2",
              type : "userDetails" 
            }
           })
        }

        await fetch(`${url}getUserDetails`, options).then((res) => {
           res.json().then((resp) => {
            if(resp.result.status === "ERR"){
                toast.warn(resp.result.message)
            } 
            setGetUserDetailsResponse(resp.result)
           })
        })
      } catch (error) {
        console.error(error)
      }
  }

  const getStatus = async () => {
    try {
      const options = {
         method: "POST",
         headers: {
          Authorization : "1234",
          "Content-Type" : "application/json"
         },
         body : JSON.stringify({
          data : {
            uid : "AyhFUze1cubqaTsDfAiaCYlQeLK2",
            type : "getStatus"
          }
         })
      }

      const resp = await fetch(`${url}getStatus`, options)
      const finalRes = await resp.json()

      setGetStatusResponse([finalRes?.result])
      return [finalRes?.result]

    } catch (error) {
      console.error(error)
    } 
  }

  const ackStatus = async (id) => {
      try {
        const options = {
           method: "POST",
           headers: {
            Authorization : "1234",
            "Content-Type" : "application/json"
           },
           body : JSON.stringify({
            data : {
              id : id,
              type : "ack",              
              uid : "AyhFUze1cubqaTsDfAiaCYlQeLK2",
            }
           })
        }
  
       const resp = await fetch(`${url}ack`, options)
       const finalRes = await resp.json()
  
      } catch (error) {
        console.error(error)
      }
    
  }

  const getGameState = async () => {
    try {
      const options = {
         method: "POST",
         headers: {
          Authorization : "1234",
          "Content-Type" : "application/json"
         },
         body : JSON.stringify({
          data : {
            uid : "AyhFUze1cubqaTsDfAiaCYlQeLK2",
            type : "gameState"
          }
         })
      }
     const response = await fetch(`${url}getGameState`, options)
     const gameStateRes = await response.json() 
     setGameStateResponse(prev => [gameStateRes.result])

     if(gameStateRes.result.status === "ERR"){
      toast.warn(gameStateRes.result.message)       
      setCheckAck(true)
      return
     }


     if(gameStateRes.result.status === "OK"){
     }

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(()=>{
     getUserDetails()
     getStatus()
  },[])

  const handlePlay = async () => {
    await getGameState()
    setPlayClicked(playClicked + 1)
  }

 return (
    <div className="container">
     <div className="score-board">
       <div className="score-inside coin">
          <p>{getUserDetailsResponse?.coin_balance ?? <small>Loading...</small>}  <img className="icon" src={coin} alt="coin" /></p>
          <small>KC Coins</small>
       </div>
       <div className="score-inside chip">
       <p>12  <img className="icon" src={chip} alt="coin" /></p>
          <small>KC Chips</small>
       </div>
     </div>
     <p className="head">3 rows p same items me inaam milega!</p>
    
     {
      (getStatusResponse[0]?.is_result_present !== false && getStatusResponse[0]?.is_result_present !== undefined) && <Example getStatusResponse={getStatusResponse[0]} ackStatus={ackStatus} id={getStatusResponse[0]?.id} />
     }
    
      {
        (gameStateResponse.length === 0 || gameStateResponse[0].status === 'ERR') && 
        <div className={`spinner-container`}>
          <Spinner/>
          <Spinner/>
          <Spinner/>
       </div>
      }

      
      {
        (gameStateResponse.length !== 0 && gameStateResponse[0].status !== 'ERR') &&
        <div className={`spinner-container`}>
        <Spinner
          timer={(gameStateResponse[0]?.result_sequence !== undefined) ? (gameStateResponse[0]?.result_sequence[0])%10 * 230 + (2300) : 0}
          playClicked={playClicked}
          resetSpinner={resetSpinner}
          num={1}
        />
        <Spinner
          timer={(gameStateResponse[0]?.result_sequence !== undefined) ? (gameStateResponse[0]?.result_sequence[1])%10 * 230 + (2300*2) : 0}
          playClicked={playClicked}
          resetSpinner={resetSpinner}
          num={2}          
        />
        <Spinner
          timer={(gameStateResponse[0]?.result_sequence !== undefined) ? (gameStateResponse[0]?.result_sequence[2])%10 * 230 + (2300*3) : 0}
          playClicked={playClicked}
          resetSpinner={resetSpinner}
          num={3}
          finishHandler={finishHandler}
        />
        <div className="gradient-fade"></div>
        </div>
      }

    <div className="result">
      <p>{gameStateResponse[0]?.attempt_number ?? 1}/3</p>
      <button 
      onClick={handlePlay} className="result-btn">खेलें </button>
      <div className="result-bottom">
          <div className="score-inside coin">
              <p>1000  <img className="icon" src={coin} alt="coin" /></p>
          </div>
          <p>
          मात्र {getUserDetailsResponse?.cost_of_attempt} coins से खेलें और पाएं ढेरों coins और <br/>chips जीतने का मौका 
          </p>
      </div>
    </div>
    <ToastContainer />
    </div>
  );
}


