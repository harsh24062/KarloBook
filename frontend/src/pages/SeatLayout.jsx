import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyDateTimeData, dummyShowsData } from '../assets/assets'
import Loading from '../components/Loading'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import BlurEffect from '../components/BlurEffect'
import toast from 'react-hot-toast'

const SeatLayout = () => {

  // seat group
  const groupRows = [["A","B"],["C","D"],["E","F"],["G","H"],["I","J"]]

  const { id, date } = useParams()
  const [selectedSeats,setSelectedSeats] = useState([])
  const [selectedTime,setSelectedTime] = useState(null)
  const [show,setShow] = useState(null)

  const navigate = useNavigate()

  const getShow = () => {
    const curShow = dummyShowsData.find(show => show._id === id)
    if(curShow){
      setShow({
        movie: curShow,
        dateTime: dummyDateTimeData 
      })
    }
  }

  useEffect(()=>{
    getShow()
  },[])

  // seat component
  const renderSeats = (row,count=9) => (
    <div key={row} className='flex gap-2 mt-2'>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        {/*  Syntax
          Array.from(arrayLike, mapFn?, thisArg?)
          Parameters
          arrayLike → The object to convert into an array (like a string, Set, NodeList, etc.)
          mapFn (optional) → A function to call on each element (like .map())
          thisArg (optional) → Value to use as this when executing mapFn */
        }
        {Array.from({length:count},(_,i)=>{
           const seatId = `${row}${i+1}`
           return(
            <button key={seatId} className={`h-8 w-8 rounded border 
             border-primary/60 ${selectedSeats.includes(seatId) && "bg-primary text-white"}`}
             onClick={()=> handleSeatClick(seatId)}>
              {seatId}
            </button>
           ) 
        })}
      </div>
    </div>
  )

  const handleSeatClick = (seatId) => {
    if(!selectedTime){
      return toast("please select the time first")
    }
    if(!selectedSeats.includes(seatId) && selectedSeats.length>4){
      return toast("You cannot book more than 5 seats at a time")
    }
    
    // select or unselect

    setSelectedSeats(prev => prev.includes(seatId)? prev.filter(seat => seat!=seatId): [...prev,seatId])

  }

  return show ? (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-32 md:pt-52'>
       {/* Timings */}
       <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10
        h-max md:sticky md:top-32 '>
          <p className='text-lg font-semibold px-6'>Available Timings</p>
          <div className='mt-5 space-y-1'>
             {show.dateTime[date].map((item,index)=>(
              <div key={index} className={`flex items-center gap-2 px-6 py-2 w-max 
               rounded-r-md  cursor-pointer transition ${selectedTime?.time === item.time ? "bg-primary text-white":"hover:bg-primary/20"}`}
                onClick={()=>setSelectedTime(item)}>
                <ClockIcon className='w-4 h-4'/>
                <p className='text-sm'>{isoTimeFormat(item.time)}</p>
              </div>
             ))}
          </div>
       </div>
       {/* Seat Layout */}
       <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
          <BlurEffect />
          <h1 className='text-2xl font-semibold mb-4'>Select Your Seat</h1>
          <img src={assets.screenImage} alt="screenImage" />
          <p className='text-gray-300 text-sm mb-6'>SCREEN SIDE</p>
          {/* SEAT BOXES */}
           <div className='flex flex-col items-center mt-28 text-xs text-gray-300'>
             <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
              {groupRows[0].map(row => renderSeats(row))}
             </div>
              <div className='grid grid-cols-2 gap-12'>
                {groupRows.slice(1).map((group,index)=>(
                <div key={index}>
                  {group.map(row => renderSeats(row))}
                </div>
                ))}
             </div>
           </div>

          <button onClick={()=> {navigate("/my-bookings"); scrollTo(0,0);}} className='flex items-center gap-1 mt-20 px-10 py-3 text=sm 
           bg-primary hover:bg-primary-dull transition rounded-full font-medium 
            cursor-pointer  active:scale-95'>
            Proceed to checkOut
            <ArrowRightIcon strokeWidth={3} className='h-4 w-4'/>
          </button>
       </div>
    </div>
  ):(
    <Loading />
  )
}

export default SeatLayout