import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BlurEffect from './BlurEffect'
import { dummyShowsData } from '../assets/assets'
import MovieCard from './MovieCard'

const FeaturedSection = () => {

  const navigate = useNavigate()

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
        {/* Now showing , blur effect and view all button */}
        <div className='relative flex items-center justify-between pt-20 pb-10'>
            <BlurEffect />
            <p className='text-gray-300 font-medium text-xl'>Now Showing</p>
            <button className='group flex items-center gap-2 text-xl text-white 
              bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 
              px-4 py-2 rounded-full cursor-pointer 
              hover:opacity-90 transition-all duration-300 shadow-lg' 
              onClick={()=>navigate('/movies')}>
                View All 
                <ArrowRight className='group-hover:translate-x-0.5 transition-transform duration-200 w-4 h-4'/>
            </button>
        </div>
        {/* Show Movie card */}
        <div className='flex flex-wrap max-sm:justify-center gap-8 mt-8'>
          {dummyShowsData.slice(0,6).map(data => (<MovieCard key={data._id} movie={data}/>))}
        </div>
        {/* show more section */}
        <div className='flex justify-center mt-20'>
          <button className='px-10 py-3 text-md bg-primary hover:bg-primary-dull transition 
            rounded-xl font-medium cursor-pointer' onClick={()=>{navigate('/movies'); scrollTo(0,0);}}>
           Show more
          </button>
          <BlurEffect />
        </div>
    </div>
  )
}

export default FeaturedSection