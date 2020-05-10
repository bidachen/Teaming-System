import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { UserDetail } from "../User/userDetail";
import { Button } from "react-bootstrap";
import { ComplaintsList } from "./complaints";
import { ComplimentList } from "./compliments";
import { Evaluation } from "./evaluation";
class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = { list: [], toggle: "registration" };
    this.pendingListSubcriber = null;
  }

  componentDidMount() {
    this.pendingListSubcriber = this.props.firebase
      .getPendingUsers()
      .onSnapshot((users) => {
        this.setState({ list: [] });
        if (!users.empty) {
          users.forEach((user) => {
            this.setState((prev) => ({ list: [...prev.list, user.data()] }));
          });
        }
      });
  }

  componentWillUnmount() {
    this.pendingListSubcriber();
  }

  Registration = () => {
    const { list } = this.state;
    return list.map((user) => (
      <UserDetail
        userData={user}
        pendingUser={true}
        firebase={this.props.firebase}
      />
    ));
  };

  toggleChange = (event) => {
    const value = event.target.value;
    this.setState({ toggle: value });
  };

  ConditionalRender = () => {
    const { toggle } = this.state;
    if (toggle === "registration") return <this.Registration />;
    else if (toggle === "complaints")
      return <ComplaintsList firebase={this.props.firebase} />;
    else if (toggle === "compliments")
      return <ComplimentList firebase={this.props.firebase} />;
    else if (toggle === "evaluation")
      return <Evaluation firebase={this.props.firebase} />;
  };

  render() {
    return (
      <div style={{ textAlign: "center"}}>
        <h1>Admin features</h1>
        <Button onClick={this.toggleChange} variant="info" value="registration">
          registration
        </Button>{" "}
        <Button onClick={this.toggleChange} variant="info" value="complaints">
          complaints
        </Button>{" "}
        <Button onClick={this.toggleChange} variant="info" value="compliments">
          compliments
        </Button>{" "}
        <Button onClick={this.toggleChange} variant="info" value="evaluation">
          closed groups
        </Button>{" "}
        <this.ConditionalRender />
      </div>
    );
  }
}

export default withFirebase(Admin);
