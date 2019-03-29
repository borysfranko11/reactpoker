import React, { Component } from 'react';
import { connect } from 'react-redux';
import Entity from './Entities';
import Well from './Wells';
import Meter from './Flowmeters';
import Usage from './Usage';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import { getEntityList, getEntityById } from '../../actions/entityActions';
import { getCertById } from '../../actions/certActions';
import WellModal from '../wells/WellModal';
class CertSubDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prev: false,
      isOpen: false,
      modalTitle: '',
      action: '',
      currentWell: [],
      deleted: false
    };
  }

  addEntity = () => {
    //alert('Add Entity');
    this.props.getEntityById(null);
    this.props.history.push('/addentity/');
  };
  addMeter = () => {
    this.props.history.push('/addmeter/');
  };
  onEntChange = e => {
    this.setState({ prev: !this.state.prev });
  };
  toggleCloseModal = () => {
    this.setState({ isOpen: false, modalTitle: '' });
    this.props.getCertById(this.props.cert._id, this.props.cert.Cert_ID);
  };
  toggleAddModal = () => {
    this.setState({
      isOpen: true,
      modalTitle: 'Add new Well',
      action: 'create'
    });
    this.setState({ currentCertification: [] });
  };
  toggleEditModal = () => {
    this.setState({
      isOpen: true,
      modalTitle: 'Edit Well ',
      action: 'edit'
    });
  };
  render() {

    let displayEntities;
    if (this.props.cert === undefined || this.props.cert === null) {
      displayEntities = null;
    } else {
      displayEntities = this.props.cert.Entities.reverse().map(ind_entity =>
        ind_entity.prev === this.state.prev && ind_entity.Id != null ? (
          <div className="col-md-6">
          <Entity
            certId={this.props.cert._id}
            key={ind_entity.Id._id}
            OwnType={ind_entity.Own_Type}
            data={ind_entity.Id}
            prevStatus={ind_entity.prev}
          />
          </div>
        ) : null
      );
    }

    let wellInfo;
    if (this.props.cert === undefined || this.props.cert === null) {
      wellInfo = null;
    } else {
      wellInfo = (
        <div>
          <Well data={this.props.cert.Wells} />
          <WellModal
            show={this.state.isOpen}
            onClose={this.toggleCloseModal}
            action={this.state.action}
            currentWell={''}
            certification_id={this.props.cert._id}
          >
            {this.state.modalTitle}
          </WellModal>
        </div>
      );
    }

    let meterInfo;
    if (this.props.cert === undefined || this.props.cert === null) {
      meterInfo = null;
    } else {
      meterInfo = <Meter data={this.props.cert.Flowmeters} />;
    }

    let usage;
    if (this.props.cert === undefined || this.props.cert === null) {
      usage = null;
    } else {
      if (
        this.props.cert.Usage === null ||
        this.props.cert.Usage === undefined
      ) {
        usage = null;
      } else {
        usage = <Usage data={this.props.cert.Usage} />;
      }
    }

    let dau;

    if (this.props.dau === undefined || this.props.dau === null) {
      dau = null;
    } else {
      if (
        this.props.cert.Usage === null ||
        this.props.cert.Usage === undefined
      ) {
        usage = null;
      } else {
        usage = <Usage data={this.props.cert.Usage} />;
      }
    }

    if (this.props.cert === undefined || this.props.cert === null) {
      usage = null;
    } else {
      if (
        this.props.cert.Usage === null ||
        this.props.cert.Usage === undefined
      ) {
        usage = null;
      } else {
        usage = <Usage data={this.props.cert.Usage} />;
      }
    }

    return (
      <div className="container">
        <div className="row pt-3 pb-2">
          {displayEntities === null ? null : (
            <div>
              <div className="col-md-12">
                <span className="lead font-weight-bold">Entities:</span>
                <div className="btn-group btn-group-toggle pl-3">
                  <label
                    className={classNames({
                      btn: true,
                      'btn-secondary': true,
                      'btn-sm': true,
                      active: !this.state.prev
                    })}
                  >
                    <input
                      type="radio"
                      value="optionCurrent"
                      id="option1"
                      autoComplete="off"
                      checked={!this.state.prev}
                      onChange={this.onEntChange}
                    />
                    Current
                  </label>
                  <label
                    className={classNames({
                      btn: true,
                      'btn-secondary': true,
                      'btn-sm': true,
                      active: this.state.prev
                    })}
                  >
                    <input
                      type="radio"
                      value="optionAll"
                      id="option2"
                      autoComplete="off"
                      checked={this.state.prev}
                      onChange={this.onEntChange}
                    />
                    Previous
                  </label>
                </div>
                <span
                  className="align-self-center ml-3"
                  onClick={this.addEntity}
                >
                  <FontAwesomeIcon
                    className="fontawesome-action"
                    icon="user-plus"
                    size="2x"
                  />
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="row mt-3">
        {displayEntities}
        </div>
        <div className="row mt-3">
          <div className="col-lg-12">
            {wellInfo === null ? null : (
              <div className="lead font-weight-bold">
                Well Information:{' '}
                <span
                  className="align-self-center ml-3"
                  onClick={this.toggleAddModal}
                >
                  <FontAwesomeIcon
                    className="fontawesome-action"
                    icon="plus-circle"
                    size="2x"
                  />
                </span>
              </div>
            )}
          </div>
          <div className="row">
            <div className="col-md-12">{wellInfo}</div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-lg-12">
            {meterInfo === null ? null : (
              <div className="lead font-weight-bold">
                Flow Meter Information:{' '}
                <span
                  className="align-self-center ml-3"
                  onClick={this.addMeter}
                >
                  <FontAwesomeIcon
                    className="fontawesome-action"
                    icon="plus-circle"
                    size="2x"
                  />
                </span>
              </div>
            )}
          </div>
          <div className="row">
            <div className="col-md-12">{meterInfo}</div>
          </div>
        </div>

        <div className="row mt-3">{usage}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cert: state.certs.cert
});

export default connect(
  mapStateToProps,
  { getEntityList, getEntityById, getCertById }
)(withRouter(CertSubDetails));
