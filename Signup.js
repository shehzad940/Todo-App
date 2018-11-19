import React, { Component } from 'react';
import GoBack from '../GoBack';
import fire from '../firebase';
import swal from 'sweetalert';

class Signup extends React.Component {
    constructor() {
        super();
        this.state = {
            showLogin: 1,
        }
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    signupUser(e) {
        e.preventDefault();
        swal({
          icon: "https://www.cittadeibambini.net/wp-content/themes/priority/images/loader.gif",
        });
        fire.auth().createUserWithEmailAndPassword(this.state.signup_email, this.state.signup_password)
        .then((user)=> {
            var ref = fire.database().ref('users/'+user.user.uid);
            var obj = {name: this.state.signup_name};
            ref.set(obj).then(()=> {
                swal.close();
                localStorage.setItem("isLogin", 1);
                localStorage.setItem("uid", user.user.uid);
                this.props.showTodo(1);
            });
        })
        .catch(function(error) {
            swal({
                text: error.message,
                dangerMode: true,
            });
        });
    }

    toggleLogin() {
        this.setState({showLogin: !this.state.showLogin});
    }

    loginUser(e) {
        e.preventDefault();
        swal({
          icon: "https://www.cittadeibambini.net/wp-content/themes/priority/images/loader.gif",
        });
        fire.auth().signInWithEmailAndPassword(this.state.login_email, this.state.login_password)
        .then((user)=> {
            swal.close();
            localStorage.setItem("isLogin", 1);
            localStorage.setItem("uid", user.user.uid);
            this.props.showTodo(1);
        }).catch(function(error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            swal.close();
            if (errorCode === 'auth/wrong-password') {
                swal({
                    text: "You have entered wrong password",
                    dangerMode: true,
                });
            } else {
               swal({
                    text: error.message,
                    dangerMode: true,
                });       
            }
            console.log(error);
        });
    }

    render() {
        return (
            <div className="container">
                <GoBack />
                <div className="row">
                    <div className="col-md-5 col-xs-10 mt col-sm-8 center">
                        {(!this.state.showLogin) ?
                        <div className="well mt">
                            <h3 className="mt-md text-center">Signup</h3>
                            <form onSubmit={this.signupUser.bind(this)}>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" className="form-control" name="signup_email" 
                                        placeholder="Enter email" required
                                        onChange={this.handleChange.bind(this)} 
                                        value={this.state.signup_email}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" minLength="6" className="form-control" name="signup_password" 
                                        placeholder="Enter password" required
                                        onChange={this.handleChange.bind(this)} 
                                        value={this.state.signup_password}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Fullname</label>
                                    <input type="text" className="form-control" name="signup_name" 
                                        placeholder="Enter Fullname" required
                                        onChange={this.handleChange.bind(this)} 
                                        value={this.state.signup_name}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-default" type="submit">Signup</button>
                                    <button type="button" className="btn btn-link" 
                                        onClick={this.toggleLogin.bind(this)}>Already signup? Goto login</button>
                                </div>
                            </form>
                        </div>
                        :
                        <div className="well mt">
                            <h3 className="mt-md text-center">Login</h3>
                            <form onSubmit={this.loginUser.bind(this)}>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" className="form-control" name="login_email" 
                                        placeholder="Enter email" required
                                        onChange={this.handleChange.bind(this)} 
                                        value={this.state.login_email}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" className="form-control" name="login_password" 
                                        placeholder="Enter password" required
                                        onChange={this.handleChange.bind(this)} 
                                        value={this.state.login_password}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-default" type="submit">Login</button>
                                    <button type="button" className="btn btn-link" 
                                        onClick={this.toggleLogin.bind(this)}>Not an account? Goto signup</button>
                                </div>
                            </form>
                        </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Signup;
