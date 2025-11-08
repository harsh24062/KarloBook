import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { dummyDateTimeData, dummyShowsData } from "../assets/assets"
import { HeartIcon, PlayCircleIcon, StarIcon } from "lucide-react"
import calcTime from "../lib/calcTime"
import DateSelect from "../components/DateSelect"
import BlurEffect from "../components/BlurEffect"

const MovieDetails = () => {

  const {id} = useParams()
  const [show,setShow] = useState(null)

  const getShow = () =>{
   const show = dummyShowsData.find(show => show._id === id)
   setShow({
    movie: show,
    dateTime: dummyDateTimeData
   })
  }

  useEffect(()=>{
    getShow()
  },[id])

  return show ? (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      {/* Movie Info */}
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
         {/* Movie Poster */}
         <img src={show.movie.poster_path} alt="Movie_Picture" className="
          max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"/>
          {/* Movie Detail */}
          <div className="relative flex flex-col gap-3 ">
           {/* Movie language */}
           <p className="text-primary font-semibold">ENGLISH</p>
           {/* Movie Title */}
           <h1 className="text-4xl font-semibold max-w-96 text-balance">{show.movie.title}</h1>
            {/* Movie Rating */}
           <div className="flex items-center gap-2 text-gray-300">
              <StarIcon className="w-5 h-5 text-primary fill-primary"/>
              {show.movie.vote_average.toFixed(1)} Ratings
           </div>
             {/* Movie Plot */}
            <p className="text-gray-300 mt-2 text-sm leading-tight max-w-xl">{show.movie.overview}</p>
             {/* Movie Length, genre, release Year */}
            <p>
              {calcTime(show.movie.runtime)} · {show.movie.genres.map(genre => genre.name).join(' | ')} · {new Date(show.movie.release_date).getFullYear()} 
            </p>
            {/* watch Trailer, Buy Ticket and add icon to add in favorite */}
            <div className="flex items-center flex-wrap gap-4 mt-4">
                <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800
                 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95">
                  <PlayCircleIcon className="w-5 h-5"/>
                  Watch Trailer
                </button>
                <a href="#dateSelect" className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium
                 cursor-pointer active:scale-95">Buy Ticket</a>
                <button className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95">
                    <HeartIcon className={`w-5 h-5`}/>
                </button>
            </div>
          </div>
      </div>

     {/* Favorite Cast Portion */}
<p className="text-lg font-medium mt-20">Your Favorite Cast</p>

<div className="overflow-x-auto no-scrollbar mt-8 pb-4">
  <div className="flex items-center gap-4 w-max px-4 snap-x snap-mandatory">
    {show.movie.casts.slice(0, 12).map((cast, index) => (
      <div
        key={index}
        className="flex flex-col items-center text-center flex-shrink-0 snap-center"
      >
        <img
          src={cast.profile_path}
          alt="cast_image"
          className="rounded-full h-20 w-20 aspect-square object-cover"
        />
        <p className="font-medium text-sm mt-3">{cast.name}</p>
      </div>
    ))}
  </div>
</div>
  <BlurEffect />
    {/* Select Date */}
    <DateSelect dateTime={show.dateTime} id={id}/>

    </div>
  ):(
    <div>
      Loading...
    </div>
  )
}

export default MovieDetails