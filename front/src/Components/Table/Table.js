import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class Table extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    _fnGet: PropTypes.func.isRequired,
    _fnDelete: PropTypes.func.isRequired,
    _fnReset: PropTypes.func.isRequired,
    structure: PropTypes.array.isRequired,
    isEditMode: PropTypes.bool,
    isLoading: PropTypes.bool,
    title: PropTypes.string
  };

  RenderHeader = ({ title, _fnReset }) => {
    return (
      <div style={{ marginBottom: "10px" }} className="container">
        <div className="row justify-content-md-center">
          <div className="col col-sm-2"></div>
          <div>
            <h3 className="col col-md-auto">{title}</h3>
          </div>
          <div className="col col-sm-2">
            <button
              type="button"
              className="btn btn-outline-warning"
              onClick={() => _fnReset()}
            >
              Reset Data
            </button>
          </div>
        </div>
      </div>
    );
  };

  RenderEditMode = ({ _fnGet, _fnDelete, id }) => {
    if (!this.props.isEditMode) return null;
    else {
      return (
        <td>
          <div className="container-fluid">
            <div className="row">
              <div className="col-6">
                <button
                  style={{ width: "100%" }}
                  className="btn btn-info btn-sm"
                  onClick={() => _fnGet(id)}
                >
                  EDIT
                </button>
              </div>
              <div className="col-6">
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => _fnDelete(id)}
                >
                  DELETE
                </button>
              </div>
            </div>
          </div>
        </td>
      );
    }
  };

  GetTableStructure = () => {
    // Recieve Array of string [a,b,c,d]
    return this.props.structure.map(field => {
      return (
        <th style={{ textTransform: "capitalize" }} key={field}>
          {field}
        </th>
      );
    });
  };

  GetColumnData = () => {
    const { list, _fnGet, _fnDelete } = this.props;
    return list.map(element => {
      const fieldValue = Object.values(element);
      //!!! Very Very unefficient
      const randomKey = pos => {
        return JSON.stringify({
          random: Math.random(),
          ID: fieldValue[0],
          position: pos
        });
      };
      return (
        <tr key={randomKey(element)}>
          {fieldValue.map((value, index) => (
            <td key={index}>{value}</td>
          ))}
          <this.RenderEditMode
            _fnGet={_fnGet}
            _fnDelete={_fnDelete}
            id={fieldValue[0]}
          />
        </tr>
      );
    });
  };

  render() {
    if (this.props.isLoading)
      return <h3 className="table-fill"> Loading Table Data... </h3>;

    return (
      <div className="col">
        <this.RenderHeader
          title={this.props.title}
          _fnReset={this.props._fnReset}
        />
        <div className="table-responsive">
          <table className="table table-hover table-dark">
            <thead style={{ textAlign: "center" }}>
              <tr>
                <this.GetTableStructure />
                {this.props.isEditMode ? <th> Actions </th> : null}
              </tr>
            </thead>
            <tbody style={{ textAlign: "center" }} className="table-hover">
              <this.GetColumnData />
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
