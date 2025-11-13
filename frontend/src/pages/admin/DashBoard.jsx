import { useEffect, useState } from "react"
import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, UsersIcon, StarIcon } from "lucide-react"
import { dummyDashboardData } from "../../assets/assets"
import Loading  from "../../components/Loading"
import Title from "../../components/admin/Title"
import dateFormat from "../../lib/dateFormat"
import isoTimeFormat from "../../lib/isoTimeFormat"

const DashBoard = () => {

  const currency = import.meta.env.VITE_CURRENCY
  const [loading,setLoading] = useState(true)

  const [dashBoardData,setDashBoardData] = useState({
    totalBookings:0,
    totalRevenue:0,
    activeShows:[],
    totalUser:0
  })

  const dashBoardCards = [
    {title:"Total Bookings", value: dashBoardData.totalBookings || "0", icon: ChartLineIcon},
    {title:"Total Revenue", value: currency + dashBoardData.totalRevenue || "0", icon: CircleDollarSignIcon},
    {title:"Active Shows", value: dashBoardData.activeShows.length || "0", icon: PlayCircleIcon},
    {title:"Total Users", value: dashBoardData.totalUser || "0", icon: UsersIcon},
  ]

  const fetchDashBoardData = () => {
    setDashBoardData(dummyDashboardData)
    setLoading(false)
  }

  useEffect(()=>{
    fetchDashBoardData()
  },[])

  return !loading ? (
    <>
      {/* Title */}
      <Title text1="Admin" text2="Dashboard"/>
      {/* Body */}
      <div className="relative flex flex-wrap gap-4 mt-6">
        <div className="flex flex-wrap gap-4 w-full">
          {dashBoardCards.map((card,index)=>(
            <div key={index} className="flex items-center justify-between px-4 py-3 bg-primary/10 
             border border-primary/20 rounded-md max-w-50 w-full">
                <div>
                  <h1 className="text-sm">{card.title}</h1>
                  <p className="text-xl font-medium mt-1">{card.value}</p>
                </div>
                <card.icon className="w-6 h-6"/>
            </div>
          ))}
        </div>
      </div>
      {/* Active shows */}
      <p className="mt-10 text-2xl font-medium">Active shows</p>
      <div className="relative flex flex-wrap gap-6 mt-4 max-w-5xl">
            {dashBoardData.activeShows.map((show)=>(
               <div key={show._id} className="w-56 rounded-lg overflow-hidden 
                h-full pb-3 bg-primary/10 border border-primary/20 hover:translate-y-1 transition duration-300">
                 <img src={show.movie.poster_path} alt="movie_poster" className="h-60 w-full object-cover"/>
                 <p className="font-medium p-2 truncate">{show.movie.title}</p>
                 <div className="flex items-center justify-between px-2">
                    <p className="text-lg font-medium">{currency}{show.showPrice}</p>
                    <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                      <StarIcon className="w-4 h-4 text-primary fill-primary"/>
                      {show.movie.vote_average.toFixed(1)}
                    </p>
                 </div>
                 <p className="px-2 pt-2 text-sm text-gray-300">{dateFormat(show.showDateTime) +" At "+ isoTimeFormat(show.showDateTime)}</p>
               </div>
            ))}
      </div>
    </>
  ):(
    <Loading />
  )
}

export default DashBoard