import BlurEffect from '../components/BlurEffect'
import MovieCard from '../components/MovieCard'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const Movies = () => {

  const {shows} = useAppContext()

  const navigate = useNavigate()

  return shows.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 
     overflow-hidden min-h-[80vh]'>
        <h1 className='text-lg font-medium text-gray-300 my-4'>Now Showing</h1>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
          {shows.map((movie,index)=>(
            <MovieCard movie={movie} key={index}/>
          ))}
        </div>
    </div>
  ):(
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center text-gray-100 Z-30'>No Movies Available Right Now...</h1>
       <button className='mt-6 px-6 py-3 bg-primary hover:bg-primary-dull 
        text-white font-medium rounded-full shadow-lg 
        transition-all duration-300 transform hover:-translate-y-1 active:scale-95 z-30' onClick={()=>{
          navigate('/');
          scrollTo(0,0);
        }}>Home</button>
        <BlurEffect />
    </div>
  )
}

export default Movies