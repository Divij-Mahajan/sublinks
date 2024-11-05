import { AppBar } from "@/components/AppBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useOkto } from "okto-sdk-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import duck from "/duck.png"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BiRefresh } from "react-icons/bi";

export const Account = () => {
    const [userDetails, setUserDetails] = useState();

    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [walletAddress, setWalletAddress] = useState()
    const [subPrice, setSubPrice] = useState()
    const [subscribers, setSubscribers] = useState()

    // eslint-disable-next-line no-unused-vars
    const [wallets, setWallets] = useState()
    // eslint-disable-next-line no-unused-vars
    const [portfolioData, setPortfolioData] = useState();
    const [tokensDev, settokensDev] = useState(0)
    const [tokensMain, settokensMain] = useState(0)
    const { getUserDetails, getPortfolio, createWallet, transferTokensWithJobStatus } = useOkto();
    
    const fetchWallets = async () => {
        try {
            const walletsData = await createWallet();
            setWallets(walletsData);
            console.log("Wallet Details",walletsData)
            if (walletsData) {
                localStorage.setItem('walletAddress',walletsData.wallets[0].address);
            }
        } catch (error) {
            console.log(`Failed to fetch wallets: ${error.message}`);
        }
    };

    const fetchPortfolio = async () => {
        try {
            const portfolio = await getPortfolio();
            console.log(portfolio)
            setPortfolioData(portfolio);
            
            for( let i=0; i<portfolio.tokens.length; i++) {
                if (portfolio.tokens[i].network_name=="SOLANA_DEVNET")
                    localStorage.setItem('devTokens',portfolio.tokens[i].quantity);
                else if (portfolio.tokens[i].network_name=="SOLANA_MAINNET")
                    localStorage.setItem('mainTokens',portfolio.tokens[i].quantity);
            }
        } catch (error) {
            console.log(`Failed to fetch portfolio: ${error.message}`);
        }
    };

    const fetchUserDetails = async () => {
        try {
            const details = await getUserDetails();
            setUserDetails(details);
            if (details) {
                localStorage.setItem('email',details.email);
            }
        } catch (error) {
            console.log(`Failed to fetch user details: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchUserDetails()
        fetchWallets()
        fetchPortfolio()

        if (localStorage.getItem('devTokens'))
            settokensDev(localStorage.getItem('devTokens'))

        if (localStorage.getItem('mainTokens'))
            settokensMain(localStorage.getItem('mainTokens'))


        axios.get(`https://sublinks.onrender.com/creator/email/${localStorage.getItem("email")}`).then((data)=>{
          console.log("data")
          localStorage.setItem('id',data.data._id);
          setName(data.data.name)
          setEmail(data.data.email)
          setWalletAddress(data.data.walletAddress)
          setSubPrice(data.data.subscriptionPrice)
          setSubscribers(data.data.subscribers.length)
        }).catch(()=>{
          console.log("s2")
          
          axios.post(`https://sublinks.onrender.com/creator/create`,{
            "name":localStorage.getItem("email").split("@")[0],
            "email":localStorage.getItem("email"), 
            "walletAddress":localStorage.getItem("walletAddress")
          })
          
          axios.get(`https://sublinks.onrender.com/creator/email/${localStorage.getItem("email")}`).then((data)=>{
            console.log("data")
            localStorage.setItem('id', data.data._id);
            setName(data.data.name)
            setEmail(data.data.email)
            setWalletAddress(data.data.walletAddress)
            setSubPrice(data.data.subscriptionPrice)
            setSubscribers(data.data.subscribers.length)
          })
        })
    },[])
    
    const [inputDev, setInputDev] = useState()
    const [quantityDev, setQuantityDev] = useState()
    
    
    const [inputMain, setInputMain] = useState()
    
    const [quantityMain, setQuantityMain] = useState()

    

  return (
    <div className="min-h-screen h-full flex-col flex items-center bg-gray-50 w-full">
      <div className="w-full">
        <AppBar/>
      </div>
    
    {
        userDetails === null
        ? (
          <div className=" w-full py-16  mt-12 flex flex-col items-center justify-center">
            <img src={duck} width={270}></img>
            <div className="text-xl my-2 font-bold text-gray-600">Not Logged in</div>
            <div className="text-gray-400 max-w-[500px] w-full text-center">If you are having trouble logging in, please try again. </div>
            <div className="text-gray-400 max-w-[500px] w-full text-center">High server traffic can sometimes cause delays, but a second or third attempt should do the trick!</div>
          </div>
        ) : (
            <>
                <div className="container mx-auto px-4 py-8 max-w-[800px]">
                    <div className="flex flex-col space-y-8 max-w-4xl mx-auto">
                      <Card>
                        <CardContent>
                            <div className="space-y-4 mt-8">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    
                                    <div className="space-y-1.5">
                                        <Label className="text-sm text-gray-500">Name</Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e)=>setName(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <Label className="text-sm text-gray-500" htmlFor="email">Email</Label>
                                        <Input id="email" value={email} disabled />
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <Label className="text-sm text-gray-500" htmlFor="walletAddress">Wallet Address</Label>
                                        <Input id="walletAddress" value={walletAddress} disabled />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-sm text-gray-500" htmlFor="subscribers">Subscribers</Label>
                                        <Input id="subscribers" value={subscribers} disabled />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-sm text-gray-500" htmlFor="subPrice">Subscription Price</Label>
                                        <Input
                                            id="subPrice"
                                            value={subPrice}
                                            onChange={(e) => setSubPrice(e.target.value)}
                                        />
                                    </div>

                                </div>
                                <Button className="w-full sm:w-auto">Update Details</Button>
                            </div>

                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                            <CardTitle>Wallet</CardTitle>
                            <CardDescription>Manage your SOL on Mainnet and Devnet</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="mainnet">
                                <TabsList className="w-min">
                                    <TabsTrigger value="mainnet">Mainnet</TabsTrigger>
                                    <TabsTrigger value="devnet">Devnet</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="mainnet">
                                    <div className="flex flex-col gap-5 mt-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="balance" className="text-sm font-medium text-gray-500">Balance</Label>
                                                <div className="text-3xl font-bold">10.1 SOL</div>
                                            </div>
                                            <Button variant="outline" size="icon" aria-label="Refresh balance">
                                                <BiRefresh className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="transfer" className="text-md font-medium text-gray-500">Transfer</Label>
                                            <div className="space-y-2">
                                                <Input
                                                    placeholder="Enter Address to Send Tokens to..."
                                                    value={inputMain}
                                                    onChange={(e) => setInputMain(e.target.value)}
                                                />
                                                <div className="flex space-x-2">
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter Quantity..."
                                                        value={quantityMain}
                                                        onChange={(e) => setQuantityMain(e.target.value)}
                                                        min="0"
                                                        max="10.234"
                                                    />
                                                    <Button>Send</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                                
                                <TabsContent value="devnet">
                                <div className="flex flex-col gap-5 mt-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="balance" className="text-sm font-medium text-gray-500">Balance</Label>
                                                <div className="text-3xl font-bold">10.1 SOL</div>
                                            </div>
                                            <Button variant="outline" size="icon" aria-label="Refresh balance">
                                                <BiRefresh className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="transfer" className="text-md font-medium text-gray-500">Transfer</Label>
                                            <div className="space-y-2">
                                                <Input
                                                    placeholder="Enter Address to Send Tokens to..."
                                                    value={inputMain}
                                                    onChange={(e) => setInputMain(e.target.value)}
                                                />
                                                <div className="flex space-x-2">
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter Quantity..."
                                                        value={quantityMain}
                                                        onChange={(e) => setQuantityMain(e.target.value)}
                                                        min="0"
                                                        max="10.234"
                                                    />
                                                    <Button>Send</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                      </Card>

                    </div>
                    </div>
                <div className="w-full h-full px-4 sm:px-10 lg:px-10 lg:w-[900px] mt-12 mb-5 flex flex-col gap-3">
                    <div className="w-full  bg-white rounded-lg  flex flex-col sm:flex-row items-center">
                    <div className="w-1/2 text-lg flex flex-col p-4 px-9 ">
                        <div className="text-xl self-center  mb-6">
                            User Details:
                        </div>
                        <div className="flex flex-col gap-4">
                        <div className="flex items-end gap-2">
                            <Label htmlFor="name">Name:</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <Label htmlFor="email">Email:</Label>
                            <Input
                                id="email"
                                name="email"
                                type="text"
                                value={email}
                                disabled
                                //onChange={(e)=>setEmail(e.target.value)}
                                />
                        </div>
                        <div className="flex items-end gap-2">
                            <Label htmlFor="walletAddress">Wallet:</Label>
                            <Input
                                id="walletAddress"
                                name="walletAddress"
                                type="text"
                                value={walletAddress}
                                disabled
                                //onChange={(e)=>setEmail(e.target.value)}
                                />
                        </div>
                        <div className="flex items-end gap-2">
                            <Label htmlFor="subscribers">Subscribers:</Label>
                            <Input
                                id="subscribers"
                                name="subscribers"
                                type="text"
                                value={subscribers}
                                disabled
                                //onChange={(e)=>setSubscribers(e.target.value)}
                                />
                        </div>
                        <div className="flex items-end gap-2">
                            <Label htmlFor="subPrice">Price:</Label>
                            <Input
                                id="subPrice"
                                name="subPrice"
                                type="text"
                                value={subPrice}
                                onChange={(e)=>setSubPrice(e.target.value)}
                                />
                        </div>
                        <div className="mt-4 self-end">
                        <Button onClick={()=>{
                            axios.put(`https://sublinks.onrender.com/creator/${localStorage.getItem("id")}`,{
                            name: name,
                            subscriptionPrice: subPrice,
                            })
                        }} >Update Details</Button>
                        </div>
                        </div>
                    </div>
                    <div className="w-1/2 text-lg  flex flex-col gap-5 items-left p-4 px-9 border-l-2 border-gray-50">
                        <div className="text-xl self-center mb-4">
                            Accounts:
                        </div>
                        <div>
                            <div className="flex justify-between">
                            <span>SOLANA DEV NET</span>
                            <span>
                            {tokensDev} SOL
                                </span>
                            </div>
                            <input className="border w-full my-2 px-2 py-1 rounded-lg" type="text" placeholder="Enter Address to Send Tokens to..." value={inputDev}  onChange={(e)=>{setInputDev(e.target.value)}}></input>
                            <div className="flex justify-between">
                            <input className="border w-1/2 my-2 px-2 py-1 rounded-lg" type="number" min={0} max={tokensDev} placeholder="Enter Quantity..." value={quantityDev}  onChange={(e)=>{setQuantityDev(e.target.value)}}></input>
                            <button className="bg-black px-5 rounded-lg text-white h-10 mt-2" onClick={()=>{
                                transferTokensWithJobStatus({
                                    network_name:"SOLANA_DEVNET",
                                    token_address:"",
                                    recipient_address:inputDev,
                                    quantity:quantityDev
                                }).then((e)=>console.log(e)).catch((e)=>console.log(e))
                            }}>Send</button>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between">
                            <span>SOLANA MAIN NET</span>
                            <span>
                            {tokensMain} SOL
                                </span>
                            </div>
                            <input className="border w-full my-2 px-2 py-1 rounded-lg" type="text" placeholder="Enter Address to Send Tokens to..." value={inputMain}  onChange={(e)=>{setInputMain(e.target.value)}}></input>
                            <div className="flex justify-between">
                            <input className="border w-1/2 my-2 px-2 py-1 rounded-lg" type="number" min={0} max={tokensMain} placeholder="Enter Quantity..." value={quantityMain}  onChange={(e)=>{setQuantityMain(e.target.value)}}></input>
                            <button className="bg-black px-5 rounded-lg text-white h-10 mt-2">Send</button>
                            </div>
                        </div>
                    </div>
                    </div>
                <div>
            </div>
        
                </div>
            </>
        )
    }

    </div>
  );
}