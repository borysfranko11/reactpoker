import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';
import InputGroup from '../common/InputGroup';
class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      ageterm:false,
      locationterm:false,
      errors: {}
    };

    // this.onChange = this.onChange.bind(this);
    // this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onChangeAgeTerm = e => {
    this.setState({ageterm: !this.state.ageterm})
  }
  onChangeLocationTerm = e => {
    this.setState({locationterm: !this.state.locationterm})
  }
  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      ageterm: this.state.ageterm,
      locationterm: this.state.locationterm

    };
    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-4 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your WSOTP App account
              </p>
              <input type="button" className="btn btn-primary btn-block mt-4" value="with facebook account" />

              <input type="button" className="btn btn-success btn-block mt-4" value="with google account"/>     

              <p className="lead text-center mt-4">
                Or
              </p>              

              <form noValidate onSubmit={this.onSubmit} className="mt-4">
                <TextFieldGroup
                  placeholder="Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                />
                <TextFieldGroup
                  placeholder="Email"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                />
                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                <TextFieldGroup
                  placeholder="Confirm Password"
                  name="password2"
                  type="password"
                  value={this.state.password2}
                  onChange={this.onChange}
                  error={errors.password2}
                />
                <div className="form-check">
                  <input 
                      className="form-check-input"
                      name="ageterm"
                      error="Please check Term of Use"
                      type="checkbox"
                      required
                      onChange={this.onChangeAgeTerm}
                  />
                  <label className="form-check-label">I confirm that i am 18 years of age or older and read the Term of Use</label>                 
                </div>
                <div className="form-check">
                  <input 
                      className="form-check-input"
                      name="locationterm"
                      error="Please check Term of Use"
                      type="checkbox"
                      onChange={this.onChangeLocationTerm}
                  />
                  <label className="form-check-label">I confirm that if i live outside of the United States will be disqualified from any tournament</label>
                </div>        
                                 
                <input type="submit" className="btn btn-info btn-block mt-4" value="Register" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
