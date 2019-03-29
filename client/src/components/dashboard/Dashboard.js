import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profileActions';
import { registerTour, unregisterTour, getTourInfo } from '../../actions/tournamentActions';

class Dashboard extends Component {
  currentgold = 0;
  constructor(props) {
    super(props);
    this.props.getTourInfo(1);  
    this.props.getCurrentProfile(this.props.auth.user.id);  
    this.state = {    
      registerClicked: false,
      gold: this.props.auth.user.gold,
      cash: this.props.auth.user.cashier,
      tour: [],
      buyin: 100,
      players: this.props.auth.user.players
    };  
  }
  componentDidMount() {   

  }
  
  componentDidUpdate() {

  }

  handleRegisterTournament = () => {
    this.setState({players: this.state.players + 1,registerClicked: true,gold: this.state.gold - 100},()=>{
      let values = {
        tourid: 1,
        userid: this.props.auth.user.id 
      }    
      this.props.registerTour(values);
      //this.props.getCurrentProfile(this.props.auth.user.id);
      this.props.getTourInfo(1); 
    });   
    
  }
  handleUnRegisterTournament = () => {
    this.setState({players: this.state.players - 1, registerClicked: false,gold: this.state.gold + 100}, ()=>{
      let values = {
        tourid: 1,
        userid: this.props.auth.user.id 
      }
      this.props.unregisterTour(values);
    });    
  
 this.props.getTourInfo(1);  
  }  
  render() {
    let action = !this.state.registerClicked ? (
      <input type="button" className="btn btn-info btn-sm" value="Register" onClick={this.handleRegisterTournament} />
      ):(       
      <input type="button" className="btn btn-danger btn-sm" value="Unregister" onClick={this.handleUnRegisterTournament} />
    );   
    let status = !this.state.registerClicked?(
      <h6 className="badge badge-secondary">Unregistered</h6>
      ):(
      <h6 className="badge badge-success">Registered</h6>
    );
    let userlist = this.state.registerClicked?(
      <div className="row">
      <div className="col-md-3">
        <h6>{this.state.players}</h6>
      </div>
      <div className="col-md-3">
        <h6>{this.props.auth.user.name}</h6>              
      </div>
      <div className="col-md-3">
        <h6>1500</h6>              
      </div>
    </div>
    ):null;    
    let tournaments = (
      <div className="card flex-row flex-wrap w-100">
        <div className="card-header border-0 ">
            <img src="https://www.gamingpost.ca/wp-content/uploads/2016/03/AllSlotsCasino.gif" alt=""/>
        </div>
        <div className="card-body">
            <div className="row">
              <div className="col-md-3">
                <h4><strong>Name</strong></h4>
                <h4>Test</h4>
              </div>           
              <div className="col-md-2">
                <h4><strong>Buy in</strong></h4>
                <h4>$ {this.state.buyin}</h4>
              </div>           
              <div className="col-md-2">
                <h4><strong>Players</strong></h4>
                <h4> {this.state.players} / 9</h4>
              </div>           
              <div className="col-md-2">
                <h4><strong>Status</strong></h4>
                {status}
                
              </div>   
              <div className="col-md-1">
              <h4><strong></strong></h4>      
              {action}            
            </div> 
                                             
            </div>
            <hr/>
            <div className="row">
              <div className="col-md-3">
                <h6><strong>Rank</strong></h6>
              </div>
              <div className="col-md-3">
                <h6><strong>Player</strong></h6>
              </div>
              <div className="col-md-3">
                <h6><strong>Stack</strong></h6>
              </div>
            </div>                        
           {userlist}
        </div>
      </div>
    );


    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <h3 className="display-6 col-md-4">Tournaments</h3>
            <div className="form-group row col-md-6 text-right">
              <p className="col-6"> <strong>Gold: {this.state.gold} {/*profile?profile.gold:0*/}</strong></p>
              <p className="col-6"> <strong>Cashier: {this.state.cash}</strong></p>
            </div>            
          </div>  
          <div className="row">
              {tournaments}
          </div>      
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
  tour: state.tour
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount ,registerTour, unregisterTour ,getTourInfo}
)(Dashboard);

