import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select, { createFilter } from 'react-select';
import {
  getCertList,
  getCertById,
  getCertsByWellId,
  getCertsByEntityId,
  getCertsByDauId,
  getCertsByPauId,
  getCertsByFlowmeterId,
} from '../../actions/certActions';
import { getEntityList ,getEntityById } from '../../actions/entityActions';
import { getWellsList , getWellById} from '../../actions/wellActions';
import { getDausList, getDauById} from '../../actions/dauActions';
import { getPausList ,getPauById} from '../../actions/pauActions';
import { getFlowmetersList,getFlowMeterById } from '../../actions/flowmeterActions';
import classNames from 'classnames';

const stringify = option => option.label;
const filterOption = createFilter({ ignoreCase: true, stringify });

class CertSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: 'optionActive',
      certlist: [],
      radioselect: 'cert',
      selectPlaceholder: ' Select Certificaion ID'
    };
  }

  onListChange = e => {
    // Changes from Active Certs to All Certs
    // This is an asnyc method, so the second arg can be a call back function, this prevents the update from
    // calling before setState is complete.
    this.setState({ inputValue: e.target.value }, () =>
      this.props.getCertList(this.state.inputValue)
    );
  };

  componentDidMount() {
    if ( this.state.radioselect === 'cert')
      this.props.getCertList(this.state.inputValue);
    if (this.state.radioselect === 'well') this.props.getWellsList();
    if (this.state.radioselect === 'entity') this.props.getEntityList();
    if (this.state.radioselect === 'dau') this.props.getDausList();
    if (this.state.radioselect === 'pau') this.props.getPausList();
    if (this.state.radioselect === 'flowmeter') this.props.getFlowmetersList();
  }
  handleChangeRadio = e => {
    this.setState({ radioselect: e.target.value });
    if (e.target.value === 'cert') {
      this.setState({ selectPlaceholder: 'Select Certificaion ID' });
      this.props.getCertList(this.state.inputValue);
    }
    if (e.target.value === 'well') {
      this.setState({ selectPlaceholder: 'Select Well ID' });
      this.props.getWellsList();
    }
    if (e.target.value === 'entity') {
      this.setState({ selectPlaceholder: 'Select Entity ID' });
      this.props.getEntityList();
    }
    if (e.target.value === 'dau') {
      this.setState({ selectPlaceholder: 'Select DAU ID' });
      this.props.getDausList();
    }
    if (e.target.value === 'pau') {
      this.setState({ selectPlaceholder: 'Select PAU ID' });
      this.props.getPausList();
    }
    if (e.target.value === 'flowmeter') {
      this.setState({ selectPlaceholder: 'Select Flowmeter ID' });
      this.props.getFlowmetersList();
    }
  };
  handleInputChange = selectedSearchOption => {
    this.setState({ selectedSearchOption }, () => {
      if (this.state.radioselect === 'cert') {
        this.props.getCertById(
          selectedSearchOption.value,
          selectedSearchOption.label
        );
        this.props.getCertList(this.state.inputValue);
        this.props.getCertsByWellId(null);
        this.props.getCertsByEntityId(null);
        this.props.getCertsByDauId(null);
        this.props.getCertsByPauId(null);
        this.props.getCertsByFlowmeterId(null);
      }
      
    if ( this.state.radioselect === 'well') {
      this.props.getWellById(selectedSearchOption.value);      
      this.props.getCertsByWellId(
        selectedSearchOption.value,
        selectedSearchOption.label
      );
      this.props.getWellsList();
      this.props.getCertById(null);
      this.props.getCertsByEntityId(null);
      this.props.getCertsByDauId(null);
      this.props.getCertsByPauId(null);
      this.props.getCertsByFlowmeterId(null);      
    }
      
    if ( this.state.radioselect === 'entity') {
      this.props.getEntityById(selectedSearchOption.value);
      this.props.getCertsByEntityId(
        selectedSearchOption.value,
        selectedSearchOption.label
      );
      this.props.getEntityList();
      this.props.getCertById(null);
      this.props.getCertsByWellId(null);
      this.props.getCertsByDauId(null);
      this.props.getCertsByPauId(null);
      this.props.getCertsByFlowmeterId(null);      
    }           
    if ( this.state.radioselect === 'dau') {
      this.props.getDauById(selectedSearchOption.value);
      this.props.getCertsByDauId(
        selectedSearchOption.value,
        selectedSearchOption.label
      );
      this.props.getDausList();
      this.props.getCertById(null);
      this.props.getCertsByWellId(null);
      this.props.getCertsByEntityId(null);
      this.props.getCertsByPauId(null);
      this.props.getCertsByFlowmeterId(null);      
    }
    if ( this.state.radioselect === 'pau') {
      this.props.getPauById(selectedSearchOption.value);
      this.props.getCertsByPauId(        
        selectedSearchOption.value,
        selectedSearchOption.label
      );
      this.props.getPausList();
      this.props.getCertById(null);
      this.props.getCertsByWellId(null);
      this.props.getCertsByEntityId(null);
      this.props.getCertsByDauId(null);
      this.props.getCertsByFlowmeterId(null);      
    }
    if ( this.state.radioselect === 'flowmeter') {
      this.props.getFlowMeterById(selectedSearchOption.value);
      this.props.getCertsByFlowmeterId(
        selectedSearchOption.value,
        selectedSearchOption.label
      );
      this.props.getFlowmetersList();
      this.props.getCertById(null);
      this.props.getCertsByWellId(null);
      this.props.getCertsByEntityId(null);
      this.props.getCertsByDauId(null);
      this.props.getCertsByPauId(null);      
    }  

    });

    this.setState({ selectedSearchOption: null });
  };
  render() {
    let selectlist = [];

    if (this.state.radioselect === 'cert') {
      if (this.props.certs == null) {
        selectlist = [];
      } else {
        selectlist = this.props.certs.map(li => ({
          value: li._id,
          label: li.Cert_ID
        }));
      }
    }

    if (this.state.radioselect === 'well') {
      if (this.props.wells == null) {
        selectlist = [];
      } else {
        selectlist = this.props.wells.map(li => ({
          value: li._id,
          label: '' + li.NRD_ID
        }));
      }
    }

    if (this.state.radioselect === 'entity') {
      if (this.props.entities === null) {
        selectlist = [];
      } else {
        selectlist = this.props.entities.map(li => ({
          value: li._id,
          label:
            '' +
            (li.FName !== null &&
            li.LName !== null &&
            li.FName !== undefined &&
            li.LName !== undefined
              ? li.nrd_id + ' - ' + li.FName + ' ' + li.LName
              : li.nrd_id + ' - ' + li.Company)
        }));
      }
    }

    if (this.state.radioselect === 'dau') {
      if (this.props.daus == null) {
        selectlist = [];
      } else {
        selectlist = this.props.daus.map(li => ({
          value: li._id,
          label: '' + li.DAU_ID
        }));
      }
    }

    if (this.state.radioselect === 'pau') {
      if (this.props.paus == null) {
        selectlist = [];
      } else {
        selectlist = this.props.paus.map(li => ({
          value: li._id,
          label: '' + li.PAU_ID
        }));
      }
    }
    if (this.state.radioselect === 'flowmeter') {
      if (this.props.flowmeters == null) {
        selectlist = [];
      } else {
        selectlist = this.props.flowmeters.map(li => ({
          value: li._id,
          label: '' + li.FM_ID
        }));
      }
    }
    const { selectedSearchOption } = this.state;
    /* 
    const { selectedCertOption } = this.state;
    const { selectedWellOption } = this.state;
    const { selectedEntityOption } = this.state;
    const { selectedDauOption } = this.state;
    const { selectedPauOption } = this.state; 
*/

    let optionbar =
      this.state.radioselect !== 'cert' ? null : (
        <div className="col-md-5 mt-auto">
          <div className="btn-group btn-group-toggle">
            <label
              className={classNames({
                btn: true,
                'btn-secondary': true,
                active: this.state.inputValue === 'optionActive'
              })}
            >
              <input
                type="radio"
                value="optionActive"
                id="option1"
                autoComplete="off"
                checked={this.state.inputValue === 'optionActive'}
                onChange={this.onListChange}
              />
              Active
            </label>
            <label
              className={classNames({
                btn: true,
                'btn-secondary': true,
                active: this.state.inputValue === 'optionAll'
              })}
            >
              <input
                type="radio"
                value="optionAll"
                id="option2"
                autoComplete="off"
                checked={this.state.inputValue === 'optionAll'}
                onChange={this.onListChange}
              />
              All Certs
            </label>
          </div>
        </div>
      );
    return (
      <div>
        <div className="row pt-2 serach-form">
          {/* Cert ID */}
          <div className="col-md-9 mt-auto search-form-component">
            <div className="row">
              <div className="col-md-7 mt-auto">
                <Select
                  value={selectedSearchOption}
                  onChange={this.handleInputChange}
                  options={selectlist}
                  isSearchable
                  filterOption={filterOption}
                  placeholder={this.state.selectPlaceholder}
                  className="certSelect"
                />
              </div>
              {optionbar}
            </div>
          </div>
          {/* Radio Boxes */}
          <div className="col-md-3 mt-auto filterbox search-form-component">
            <div className="form-check">
              <h4>Filter: </h4>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="radiocert"
                id="radiocert"
                value="cert"
                checked={this.state.radioselect === 'cert'}
                onChange={this.handleChangeRadio}
              />
              <label className="form-check-label" htmlFor="radiocert">
                By Cert
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="radiowell"
                id="radiowell"
                value="well"
                checked={this.state.radioselect === 'well'}
                onChange={this.handleChangeRadio}
              />
              <label className="form-check-label" htmlFor="radiowell">
                By Well
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="radioentity"
                id="radioentity"
                value="entity"
                checked={this.state.radioselect === 'entity'}
                onChange={this.handleChangeRadio}
              />
              <label className="form-check-label" htmlFor="radioentity">
                By Entity
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="radiodau"
                id="radiodau"
                value="dau"
                checked={this.state.radioselect === 'dau'}
                onChange={this.handleChangeRadio}
              />
              <label className="form-check-label" htmlFor="radiodau">
                By Dau
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="radiopau"
                id="radiopau"
                value="pau"
                checked={this.state.radioselect === 'pau'}
                onChange={this.handleChangeRadio}
              />
              <label className="form-check-label" htmlFor="radiopau">
                By Pau
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="radioflowmeter"
                id="radioflowmeter"
                value="flowmeter"
                checked={this.state.radioselect === 'flowmeter'}
                onChange={this.handleChangeRadio}
              />
              <label className="form-check-label" htmlFor="radioflowmeter">
                By Flowmeter
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  certs: state.certs.certlist,
  entities: state.entity.entitylist,
  wells: state.well.welllist,
  daus: state.dau.daulist,
  paus: state.pau.paulist,
  flowmeters: state.flowmeters.flowmeterlist,
  order: state.order,
  selectedOption: state.certs.selectedCert
});

export default connect(
  mapStateToProps,
  {
    getCertList,
    getCertById,
    getEntityList,
    getEntityById,
    getCertsByEntityId,
    getWellsList,
    getWellById,
    getCertsByWellId,
    getDausList,
    getCertsByDauId,
    getDauById,
    getPausList,
    getCertsByPauId,
    getPauById,
    getCertsByFlowmeterId,
    getFlowmetersList,
    getFlowMeterById
  }
)(CertSearch);
