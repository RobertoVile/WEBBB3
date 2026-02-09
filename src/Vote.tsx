import { useEffect, useState} from "react"
import {readContract, writeContract} from "@wagmi/core"
import { useConfig } from "wagmi"
import ABI from "./ABI.json"

type Voting ={
    option1 : string
    option2 : string
    votes1 : number
    votes2 : number
    maxDate : number
}

export default function Vote(){

    const config = useConfig()
    const [message, setMessage] = useState<string>("")
    const [voting, setVoting] = useState<Voting>({maxDate: 0, option1: "", option2: "", votes1: 0, votes2: 0})
    const [showVotes, setshowVotes] = useState<number>(0)
    const CONTRACT_ADDRESS = "0x3551A6A57b6F2C1590f520F9A71EaA1d612F29d2"

    useEffect(() =>{
        readContract(config,{
            address: CONTRACT_ADDRESS,
            abi: ABI,
            chainId: config.chains[0].id,
            functionName:"getCurrentVoting",
            args:[]
        })
        .then(result => {
            console.log("Current Voting", result)
            const voting = result as Voting
            setVoting(voting)
        })  
        .catch(err => {
            console.error(err)
            setMessage(err.message)
        })
    },[])

    function isExpired(){
        return Number(voting.maxDate) < (Date.now() / 1000)
    }
    function getMaxDate(){
        return new Date(Number(voting.maxDate) * 1000).toLocaleString("pt-BR")
    }

    function getImageUrl(name : string){
        switch(name){
            case "Roberto" : return "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c405972b-1540-4ed9-af40-b157bea4bb53/dhmqvyg-e2cfebb4-d88a-4bad-a635-a44d4f73ec59.png/v1/fill/w_1046,h_764,q_70,strp/jujutsu_kaisen_ch_236___gojo_s_death_panel_colored_by_aurteloess_dhmqvyg-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTYwNiIsInBhdGgiOiIvZi9jNDA1OTcyYi0xNTQwLTRlZDktYWY0MC1iMTU3YmVhNGJiNTMvZGhtcXZ5Zy1lMmNmZWJiNC1kODhhLTRiYWQtYTYzNS1hNDRkNGY3M2VjNTkucG5nIiwid2lkdGgiOiI8PTIyMDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.Kvz8UdWfz-thZY4sPpg8npmOuv-zPJFW1MSGijwMwo4";
            case "Gabriel": return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3uKipv0rZOGOd-gWi_6FkJ0czvnpYtliJiwMtlA9ZBpUIqHNUDYx6BdPhluSEtg-UibA&usqp=CAU"
            default: return "https://static.wikia.nocookie.net/liberproeliis/images/6/6a/Sans.png/revision/latest?cb=20180510222812&path-prefix=pt-br"
        }
    }

    function doVote(choice:number){
        writeContract(config,{
            address: CONTRACT_ADDRESS,
            abi: ABI,
            chainId: config.chains[0].id,
            functionName:"addVote",
            args:[choice]

        })
        .then(()=>{
            setshowVotes(choice)
            setMessage("Voto computado com sucesso! Resultados parciais sujeitos a alteração minuto a minuto.")

        })
        .catch(err => {
            console.error(err)
            setMessage(err.message)
        })
    }

   function btnVote2Click() {
    setMessage("Conectando na carteira...aguarde...");
    doVote(2);
  }

  function btnVote1Click() {
    setMessage("Conectando na carteira...aguarde...");
    doVote(1);
  }
    function getVotesCount(option : number){
        if(option === 1){
            return showVotes === option ? Number(voting.votes1) + 1 : Number(voting.votes1)
        }
        else{
             return showVotes === option ? Number(voting.votes2) + 1 : Number(voting.votes2)
        }
    }
    return (
    <div className='container px-4 py-5'>
        <div className="row align-items-center">
             <h1 className='display-5 fw-bold text-body-emphasis lh-1 mb-3'>Webbb3</h1>
                <p className='lead'>Votação on-chain do BBB.</p>
                {
                    isExpired()
                    ?<p className="lead mb-3">Votação encerrada. Confira abaixo os resultados.</p>
                    :<p className="lead mb-3">Você tem até {getMaxDate()} para deixar seu voto em um dos participantes abaixo para que ele saia do programa.</p>
                }
        </div>
        <div className='row flex-lg-row-reverse align-items-center g-5 py-5'>
            <div className="col-1"></div>
            <div className='col-5'>
            <h3 className="my-2 d-block mx-auto" style={{width:250}}>{voting.option2}</h3>
            <img src={getImageUrl(voting.option2)} className="d-block mx-auto img-fluid rounded " width={250} height={250}/>
            {
                isExpired() || showVotes > 0
                ?<button className="btn btn-secondary p-3 my-2 d-block mx-auto"  style={{width:250}} disabled={true}>{Number(getVotesCount(2))}</button>
                :<button className="btn btn-primary p-3 my-2 d-block mx-auto"  style={{width:250}} onClick={btnVote2Click}>Quero que saia este!</button>
            }
            </div>
           <div className='col-5'>
            <h3 className="my-2 d-block mx-auto" style={{width:250}}>{voting.option1}</h3>
            <img src={getImageUrl(voting.option1)} className="d-block mx-auto img-fluid rounded " width={250} height={250}/>
            {
                isExpired() || showVotes > 0
                ?<button className="btn btn-secondary p-3 my-2 d-block mx-auto"  style={{width:250}} disabled={true}>{Number(getVotesCount(1))}</button>
                :<button className="btn btn-primary p-3 my-2 d-block mx-auto"  style={{width:250}} onClick={btnVote1Click}>Quero que saia este!</button>
            }
            </div>


           <div className="col-1"></div>
        </div>

        <div className="row align-items-center">
            <p className="message">{message}</p>
        </div>
    </div>
  )
}