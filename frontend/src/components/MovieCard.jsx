import { useNavigate } from 'react-router-dom'
import { StarIcon } from 'lucide-react'
import calcTime from '../lib/calcTime'

const MovieCard = ({movie}) => {
  
  const navigate = useNavigate()

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl
     hover:-translate-y-1 transition duration-300 w-full max-w-[270px] sm:max-w-none">
       {/* Thumbnail */}
      <img src={movie.backdrop_path} alt="Thumbnail_Picture" className="rounded-lg h-52 w-full
       object object-right-bottom cursor-pointer" onClick={()=>{navigate(`/movies/${movie._id}`); scrollTo(0,0);}}/>
       {/* Title */}
       <p className='font-semibold text-xl mt-2 truncate'>{movie.title}</p>
       {/* Release Date, category and Time length */}
       <p className='text-sm text-gray-400 mt-2'>
         {new Date(movie.release_date).getFullYear()} · {movie.genres.slice(0,2).map(genre => genre.name).join(' | ')} · {calcTime(movie.runtime)}
       </p>
        {/* button and rating */}
       <div className='flex items-center justify-between mt-4 pb-3'>
         {/* Buy Ticket button */}
         <button className='px-4 py-2 text-md bg-primary hover:bg-primary-dull
          transition rounded-full font-medium cursor-pointer' onClick={()=>{navigate(`/movies/${movie._id}`); scrollTo(0,0);}}>Buy Ticket</button>
         {/* Star and rating */}
         <p className='flex items-center gap-1 text-md text-gray-400 mt-1 pr-1'>
            <StarIcon className='w-4 h-4 text-primary fill-primary'/>
            {movie.vote_average.toFixed(1)}
         </p>
       </div>
    </div>
  )
}

export default MovieCard