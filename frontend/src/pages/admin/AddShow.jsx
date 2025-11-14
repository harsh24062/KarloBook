import { useEffect, useState } from "react"
import Title from "../../components/admin/Title"
import { dummyShowsData } from "../../assets/assets"
import Loading from "../../components/Loading"
import { CheckIcon, DeleteIcon, StarIcon } from "lucide-react"
import formatNumber from "../../lib/formatNumber"

const AddShow = () => {

  const currency = import.meta.env.VITE_CURRENCY

  const [nowPlayingMovies,setNowPlayingMovis] = useState([])
  const [selectedMovie,setSelectedMovie] = useState(null)
  const [dateTimeSelection,setDateTimeSelection] = useState({})
  const [dateTimeInput,setDateTimeInput] = useState("")
  const [showPrice,setShowPrice] = useState("")

  const fetchNowPlayingMovies = () => {
    setNowPlayingMovis(dummyShowsData)
  }

  useEffect(()=>{
    fetchNowPlayingMovies()
  },[])
  

  const handleDateTimeAdd = () => {
    // date time format "2025-06-30T02:30"
    if(!dateTimeInput) return;

    const [date,time] = dateTimeInput.split("T");
    if(!date || !time) return
   
  //  -->dateTimeSelection
  //  Stores selected dates and times in an object grouped by date
  //  Example stored result:
  //   {
  //    "2025-06-30": ["02:30", "05:00"],
  //    "2025-07-01": ["10:15"]
  //  }
    setDateTimeSelection((prev) => {
      const times = prev[date] || []

      if(!times.includes(time)){
       return {...prev,[date]:[...times,time]}
      }
      return prev
    })
  }

  const handleRemoveTime = (date,time) => {
    setDateTimeSelection((prev)=>{
      const filterTimes = prev[date].filter((t) => t!=time)

      if(filterTimes.length === 0 ){
        const {[date]:_,...rest} = prev
        return rest
      }
      
      return {...prev,[date]:filterTimes}
    })
  }

  
  return nowPlayingMovies.length > 0 ? (
    <>
     <Title text1="Add" text2="Shows"/>
     <p className="mt-10 text-lg font-medium">Now Playing Movies</p>
     <div className="overflow-x-auto mb-4">
       <div className="group flex flex-wrap gap-4 mt-4 w-max">
         {nowPlayingMovies.map((movie)=>(
          <div key={movie.id} onClick={()=>{
            if(selectedMovie==movie.id)setSelectedMovie(null)
            else setSelectedMovie(movie.id)
          }} className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 
           hover:translate-y-1 transition duration-300`}>
              <div className="relative rounded-lg overflow-hidden">
                <img src={movie.poster_path} alt="movie_poster" className="w-full object-cover brightness-90"/>
                <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full 
                 absolute bottom-0 left-0">
                   <p className="flex items-center gap-1 text-gray-400">
                    <StarIcon className="w-4 h-4 text-primary fill-primary"/>
                    {movie.vote_average.toFixed(1)}
                   </p>
                   <p className="text-gray-300">{formatNumber(movie.vote_count)} Votes</p>
                </div>
              </div>
              {selectedMovie == movie.id && (
                <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                  <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5}/>
                </div>
              )}
              <p className="font-medium truncate">{movie.title}</p>
              <p className="text-gray-400 text-sm">{movie.release_date}</p>
          </div>
         ))}
       </div>
     </div>

     {/* Show Price Input */}
     <div className="mt-8">
         <label className="block text-md font-medium mb-2">Show Price</label>
         <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
           <p className="text-gray-400 text-sm">{currency}</p>
           <input type="number" min="0" value={showPrice} onChange={(e)=>{
            const value = e.target.value

            if (value === "") {
              setShowPrice("");
              return;
            }

            if (Number(value) >= 0) {
              setShowPrice(value);
            }
            }} 
            placeholder="Enter Show Price here" className="outline-none"/>
         </div>
     </div>

     {/* Date & Time Selection */}
     <div className="mt-6">
        <label className="block text-md font-medium mb-2">Select Date and Time</label>
        <div className="inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg">
          <input type="datetime-local" value={dateTimeInput} onChange={(e)=>setDateTimeInput(e.target.value)} 
           className="outline-none rounded-md"/>
           <button className="bg-primary/80 text-white px-3 py-2 text-sm rounded-xl hover:bg-primary cursor-pointer 
             active:scale-95" onClick={handleDateTimeAdd}>
             Add Time
            </button>
        </div>
     </div>

    {/* Display Selected Time */}
    {Object.keys(dateTimeSelection).length > 0 && (
      <div className="mt-6">
        <h2 className="mb-2">Selected Date-Time</h2>
        <ul className="space-y-3">
          {Object.entries(dateTimeSelection).map(([date,times]) => (
            <li key={date}>
               <div className="font-medium">{date}</div>
               <div className="flex flex-wrap gap-2 mt-1 text-sm">
                 {times.map((time)=>(
                  <div key={time} className="border border-primary px-2 py-1 flex items-center rounded">
                    <span>{time}</span>
                    <DeleteIcon onClick={()=> handleRemoveTime(date,time)} width={15} className="ml-2 
                     text-red-500 hover:text-red-700 cursor-pointer"/>
                  </div>
                 ))}
               </div>
            </li>
          ))}
        </ul>
      </div>
    )}
    {/* Add Show Button */}
    <button className="bg-primary text-white px-8 py-2 mt-6 rounded 
     hover:bg-primary-dull transition-all cursor-pointer active:scale-95">Add Show</button>
    </>
  ):(
    <Loading />
  )
}

export default AddShow