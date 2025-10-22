import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HomeFront = () => {

  const navigate = useNavigate()

  return (
    <div
      className="w-full h-screen bg-[url('/Movie_Poster.webp')] bg-cover bg-center 
      flex flex-col items-start justify-center px-6 md:px-14 lg:px-20"
    >
      <div className="backdrop-blur-md bg-black/40 p-6 rounded-2xl flex flex-col gap-4 max-w-2xl">
        <img src={assets.marvelLogo} alt="Logo" className="max-h-10 md:max-h-12 mt-2" />
        
        <h1 className="text-4xl sm:text-5xl md:text-[60px] leading-tight font-semibold text-white">
          From The Grave
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-zinc-200 text-base sm:text-lg md:text-xl">
          <span>Action | Horror | Mystery</span>
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" /> 2026
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5" /> 2h 50m
          </div>
        </div>

        <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-md">
          From the Grave is a Hollywood horror anthology where customers of a mysterious antique shop face terrifying fates after acquiring cursed objects.
        </p>
        <button className='flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull 
          transition rounded-full font-medium cursor-pointer justify-center' 
          onClick={()=>navigate('/movies')}>
          Explore Movies
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5"/>
        </button>
      </div>
    </div>
  )
}

export default HomeFront
