import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext()

export const AppProvider = ({ children })=>{

    const [isAdmin, setIsAdmin] = useState(false)
    const [shows, setShows] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([])

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    const {user} = useUser()
    const {getToken} = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const fetchIsAdmin = async ()=>{
        try {
            const {data} = await axios.get('/api/admin/is-admin', {headers: {Authorization: `Bearer ${await getToken()}`}})
            setIsAdmin(data.isAdmin)

            if(!data.isAdmin && location.pathname.startsWith('/admin')){
                navigate('/')
                toast.error('You are not authorized to access admin dashboard')
            }
        } catch (error) {
            console.error(error)
        }
    }

    // Fix the fetchShows function
    const fetchShows = async () => {
        try {
            console.log("Fetching shows from client...");
            const { data } = await axios.get('/api/show/all');
            console.log("API response:", data);
            
            if(data.success){
                // Make sure we're setting proper movie objects
                if (Array.isArray(data.shows) && data.shows.length > 0) {
                    setShows(data.shows);
                    console.log(`Set ${data.shows.length} shows in state`);
                } else {
                    console.log("No shows returned from API");
                    setShows([]);
                }
            } else {
                toast.error(data.message || "Failed to fetch shows");
                console.error("API returned error:", data.message);
            }
        } catch (error) {
            console.error("Error fetching shows:", error);
            // If API is failing, try loading from dummy data temporarily
            // import { dummyShowsData } from '../assets/assets';
            // setShows(dummyShowsData);
        }
    }

    const fetchFavoriteMovies = async ()=>{
        try {
            const { data } = await axios.get('/api/user/favorites', {headers: {Authorization: `Bearer ${await getToken()}`}})

            if(data.success){
                setFavoriteMovies(data.movies)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        fetchShows()
    },[])

    useEffect(()=>{
        if(user){
            fetchIsAdmin()
            fetchFavoriteMovies()
        }
    },[user])

    const value = {
        axios,
        fetchIsAdmin,
        user, getToken, navigate, isAdmin, shows, 
        favoriteMovies, fetchFavoriteMovies, image_base_url
    }

    return (
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = ()=> useContext(AppContext)