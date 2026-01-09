import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { HeartIcon, PlayCircleIcon, StarIcon } from "lucide-react"
import calcTime from "../lib/calcTime"
import DateSelect from "../components/DateSelect"
import BlurEffect from "../components/BlurEffect"
import MovieCard from "../components/MovieCard"
import Loading from "../components/Loading"
import { useAppContext } from "../context/AppContext"
import toast from "react-hot-toast"

const MovieDetails = () => {

  const { id } = useParams()
  const [show, setShow] = useState(null)
  const [timeoutReached, setTimeoutReached] = useState(false)
  const navigate = useNavigate()

  const {shows,axios,getToken,user,favoriteMovies,fetchFavoriteMovies,image_base_url} = useAppContext()

  const getShow = async() => {
   try {
    const {data} = await axios.get(`/api/show/${id}`)
    if(data.success){
      setShow(data)
    }
   } catch (error) {
    console.error(error)
   }
  }

  const handleFavorite = async () =>{
    try {
      if(!user) return toast.error("Please Login to proceed")
      const {data} = await axios.post("/api/user/update-favorite",{movieId:id},
    {headers:{Authorization:`Bearer ${await getToken()}`}})
    if(data.success){
      await fetchFavoriteMovies()
      toast.success(data.message)
    }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getShow()

    // 20-second timeout fallback
    const timer = setTimeout(() => {
      if (!show) {
        setTimeoutReached(true)
      }
    }, 20000)

    return () => clearTimeout(timer)
  }, [id])

  // --- If still loading and 20 sec not passed ---
  if (!show && !timeoutReached) {
    return <Loading />
  }

  // --- If loading took more than 20s ---
  if (timeoutReached && !show) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] text-center text-gray-300">
        <h1 className="text-2xl font-semibold mb-3">No movies found 😕</h1>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-5 py-2 bg-primary text-white rounded-md hover:bg-primary-dull active:scale-95 transition"
        >
          Try Again
        </button>
      </div>
    )
  }

  // --- Normal movie detail view ---
  return (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      {/* Movie Info */}
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        {/* Movie Poster */}
        <img
          src={image_base_url+show.movie.poster_path}
          alt="Movie_Picture"
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
        />
        {/* Movie Detail */}
        <div className="relative flex flex-col gap-3 ">
          {/* Movie language */}
          <p className="text-primary font-semibold">ENGLISH</p>
          {/* Movie Title */}
          <h1 className="text-4xl font-semibold max-w-96 text-balance">{show.movie.title}</h1>
          {/* Movie Rating */}
          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
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
            <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95">
              <PlayCircleIcon className="w-5 h-5" />
              Watch Trailer
            </button>
            <a href="#dateSelect" className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95">
              Buy Ticket
            </a>
            <button onClick={handleFavorite} className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95">
              <HeartIcon className={`w-5 h-5 ${favoriteMovies.find(movie => movie._id===id)?'fill-primary text-primary':''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Favorite Cast Portion */}
      <p className="text-lg font-medium mt-20">Your Favorite Cast</p>

      <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex items-center gap-4 w-max px-4 snap-x snap-mandatory">
          {show.movie.casts.slice(0, 12).map((cast, index) => (
            <div key={index} className="flex flex-col items-center text-center flex-shrink-0 snap-center">
              <img
                src={image_base_url+cast.profile_path}
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
      <DateSelect dateTime={show.dateTime} id={id} />

      {/* recommended movies */}
      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {shows.slice(0, 4).map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>

      {/* Show more Button */}
      <div className="flex justify-center mt-20">
        <button
          onClick={() => { navigate('/movies'); scrollTo(0, 0); }}
          className="px-10 py-3 text-md bg-primary hover:bg-primary-dull font-medium rounded-md cursor-pointer"
        >
          Show more
        </button>
      </div>
    </div>
  )
}

export default MovieDetails
