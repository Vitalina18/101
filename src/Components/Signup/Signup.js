import React, { Component } from "react";
import Axios from "axios";

class Form extends Component {
  signal = Axios.CancelToken.source();

  state = {
    user: { name: "", lastname: "", email: "", password: "" },
    errorText: ""
  };

  componentWillUnmount() {
    this.signal.cancel("Api is being cancelled");
  }

  onEdit = event => {
    const { id, value } = event.target;
    this.setState(state => {
      const user = { ...state.user };
      user[id] = value;
      return { user };
    });
  };

  onPostUser = async () => {
    try {
      const { data: user } = await Axios.post(
        "/api/authors",
        { ...this.state.user },
        { cancelToken: this.signal.token }
      );
      this.props.login(user);
    } catch (err) {
      if (Axios.isCancel(err)) {
      } else {
        this.setState({ errorText: err.response.data.message });
      }
    }
  };

  onSubmit = event => {
    event.preventDefault();
    this.onPostUser();
  };

  render() {
    return (
      <div className="modal">
        <form className="signup-form">
          <label htmlFor="name">First name</label>
          <input
            type="text"
            id="name"
            onChange={this.onEdit}
            required
            value={this.state.name}
          />
          <label htmlFor="lastname">Last name</label>
          <input
            type="text"
            id="lastname"
            onChange={this.onEdit}
            required
            value={this.state.lastname}
          />
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            onChange={this.onEdit}
            required
            value={this.state.email}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={this.onEdit}
            required
            value={this.state.password}
          />
          <button type="submit" className="button" onClick={this.onSubmit}>
            Sign Up
          </button>
        </form>
        {this.state.errorText !== "" ? <p>{this.state.errorText}</p> : null}
      </div>
    );
  }
}

export default Form;