import isEmpty from '../validation/is-empty';

import { REGISTER_TOUR, UNREGISTER_TOUR ,GET_TOUR_INFO ,TOUR_LOADING} from '../actions/types';

const initialState = {
  tourlist: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {    
    case GET_TOUR_INFO:
      return {
        ...state,
        tour: action.payload,
        loading: false
      };
    case TOUR_LOADING:
      return {
        ...state,
        loading: true
      };    
    default:
      return state;
  }
}
