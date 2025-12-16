import axios from "axios"
import movieModel from "../model/Movie.js";
import showModel from "../model/Show.js";

// API to get now-playing movies from TMDB API
export const getNowPlayingMovies = async(req,res) => {
      try {
        const {data} = await axios.get("https://api.themoviedb.org/3/movie/now_playing",{
            headers:{
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
        });
        const movies = data.results
        res.json({success:true,movies:movies})
      } catch (error) {
        console.error(error)
        res.json({success:false,message:error.message})
      }
}

// API to add a new show to the database
export const addShow = async(req,res) => {
  try {
    const {movieId, showsInput, showPrice} = req.body

    // find if movie already exists
    let movie = await movieModel.findById(movieId)

    // fetch from TMDB
    if(!movie){
       const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
         axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,{
           headers:{
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
         }),
         axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`,{
            headers:{
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
         })
       ])

       const movieApiData = movieDetailsResponse.data
       const movieCreditsData = movieCreditsResponse.data
       
       // create data from database
       const movieDetails = {
         _id:movieId,
         title: movieApiData.title,
         overview: movieApiData.overview,
         poster_path: movieApiData.poster_path,
         backdrop_path: movieApiData.backdrop_path,
         release_date: movieApiData.release_date,
         original_language: movieApiData.original_language,
         tagline: movieApiData.tagline || "",
         genres: movieApiData.genres,
         casts: movieCreditsData.cast,
         vote_average: movieApiData.vote_average,
         runtime: movieApiData.runtime,
       }

       // add movie to database
       movie = await movieModel.create(movieDetails)
    }
    

    // have to understand(how data and time will come here as array because in jsx they are object) 
    // and do work in ADDSHOW.JSX
    const showsToCreate = []
    showsInput.forEach(show => {
        const showDate = show.date
        show.time.forEach(time => {
          const dateTimeString = `${showDate}T${time}`
          showsToCreate.push({
            movie:movieId,
            showDateTime: new Date(dateTimeString),
            showPrice:showPrice,
            occupiedSeats: {}
          })
        })
    })

    if(showsToCreate.length > 0){
      await showModel.insertMany(showsToCreate)
    }
    
    res.json({success:true,message:"Show Added successfully"})
  } catch (error) {
    console.error(error)
    res.json({success:false,message:error.message})
  }
}

// API to get All shows from the database
export const getShows = async (req,res) => {
  try {
     const shows = await showModel.find({showDateTime:{
      $gte:new Date()
     }}).populate("movie").sort({showDateTime:1})
    
    // filter unique shows
    const uniqueShows = new Set(shows.map(show=>show.movie))
    return res.json({success:true, shows:Array.from(uniqueShows)})
  } catch (error) {
    console.error(error)
    res.json({success:false, message:error.message})
  }
}

// API to get SINGLE show from the database
export const getShow = async (req,res) => {
  try {
    const {movieId} = req.params

    // get all upcoming shows for the movie
    const shows = await showModel.find({movie:movieId, showDateTime:{
      $gte:new Date()
    }})
    const movie = await movieModel.findById(movieId)
    const dateTime = {}

    shows.forEach(show => {
      const date = show.showDateTime.toISOString().split("T")[0]
      if(!dateTime[date]){
        dateTime[date] = []
      }
      dateTime[date].push({time:show.showDateTime,showId:show._id})
    })
    return res.json({success:true,movie,dateTime})
  } catch (error) {
    console.error(error)
    res.json({success:false, message:error.message})
  }
}