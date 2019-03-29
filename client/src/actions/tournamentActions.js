import axios from 'axios';
import { REGISTER_TOUR, UNREGISTER_TOUR, GET_TOUR_INFO,TOUR_LOADING} from './types';

// Register Tour
export const registerTour = (values) => dispatch => {
  axios
    .post('/api/tour/register', values)
    .then(res=>{
      dispatch({
        type: REGISTER_TOUR,
        payload: res.data
      })      
    })
    .catch(err =>
      dispatch({
        type: REGISTER_TOUR,
        payload: err.response.data
      })
    );
};


// UnRegister Tour
export const unregisterTour = (values) => dispatch => {
  axios
    .post('/api/tour/unregister', values)
    .then(res=>{
      dispatch({
        type: UNREGISTER_TOUR,
        payload: res.data
      })      
    })    
    .catch(err =>
      dispatch({
        type: UNREGISTER_TOUR,
        payload: err.response.data
      })
    );
};


//Get Tour Info
export const getTourInfo = (Id) => dispatch => {
  dispatch(setTourLoading());
  axios
    .get(`/api/tour/get/${Id}`)
    .then(res =>
      dispatch({
        type: GET_TOUR_INFO,
        payload: res.data
      })
    );
};

// Profile loading
export const setTourLoading = () => {
  return {
    type: TOUR_LOADING
  };
};
