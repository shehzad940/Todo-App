import React, { Component } from 'react';
import '../App.css';
import Todo from './Todo';
import GoBack from '../GoBack';
import fire from '../firebase';
import swal from 'sweetalert';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()

recognition.continous = true
recognition.interimResults = true

class TodoApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: 0,
            val: '',
            done_list: {},
            pending_list: {},
            isEdit: 0,
            currentKey: '', 
            date: '',
            currentUsername: '',
            listening: false
        }
        this.uid = localStorage.getItem('uid');
    }

    handleChange(e) {
        this.setState({val: e.target.value});
    } 

    handleDateChange(e) {
        this.setState({date: e.target.value});
    } 

    editItem(key, val, date) {
        this.setState({val: val, isEdit: 1, currentKey: key, date: date});
    }

    editItemFirebase(e) {
        e.preventDefault();
        if (this.state.val != '') {
            var ref = fire.database().ref('todo/'+this.uid+"/"+this.state.currentKey);
            ref.update({item: this.state.val, date: this.state.date}).then(()=> {
                swal({
                  text: "Item updated successfully.",
                  icon: "success",
                  button: "Done",
                });
                this.setState({isEdit: 0, currentKey: '', val: '', date: ''});
            });
        } else {
            swal("Please enter any value");
        }
    }

    deleteItem(key) {
        swal({
            text: "Are you sure to delete ?",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                var ref = fire.database().ref('todo/'+this.uid+'/'+key);
                ref.remove().then(()=> {
                    swal({
                        text: "Item deleted successfully.",
                        icon: "success",
                        button: "Done",
                    });
                });
            }
        });
    }

    changeStatus(key, status) {
        var currentStatus = (status == "1") ? 0 : 1;
        swal({
            text: "Do you want to change status?",
            buttons: true,
        }).then((willDelete) => {
            if (willDelete) {
                var ref = fire.database().ref('todo/'+this.uid+'/'+key);
                ref.update({status: currentStatus}).then(()=> {
                    swal({
                      text: "Item update successfully.",
                      icon: "success",
                      button: "Done",
                    });
                });
            }
        }); 
    }

    insertData(e) {
        e.preventDefault();
        var ref = fire.database().ref('todo/'+this.uid);
        var obj = {item: this.state.val, status: 0, date: this.state.date};
        ref.push(obj);
        this.setState({val: '', date: ''});
    }
    getTodoItems() {
        var ref = fire.database().ref('todo/'+this.uid);
        let userRef = fire.database().ref('users/'+this.uid);
        userRef.on('value', snapshot => {
            let uname = snapshot.val().name;
            localStorage.setItem("currentUsername", uname);
        });
        ref.on('value', snapshot => {
            let done_ar = [];
            let pending_ar = [];
            snapshot.forEach((snap) => {
                if (snap.val().status == 1) {
                    done_ar.push({
                        id: snap.key,
                        item: snap.val().item,
                        status: snap.val().status,
                        date: snap.val().date
                    });
                } else {
                    pending_ar.push({
                        id: snap.key,
                        item: snap.val().item,
                        status: snap.val().status,
                        date: snap.val().date
                    });
                }
            })
            this.setState({
                done_list: done_ar,
                pending_list: pending_ar,
                isLoaded: 1,
            });
        });
    }

    componentDidMount() {
        document.title = "Todo App"
        this.getTodoItems();
    }
    
    logoutUser() {
        fire.auth().signOut().then(()=> {
            localStorage.setItem("isLogin", 0);
            localStorage.setItem("uid", '');
            localStorage.setItem("currentUsername", '');
            this.props.showTodo(0);
        }, (error)=> {
            swal({
                text: error.message,
                dangerMode: true,
            });
        });
    }

    handleListen() {
        var transcript = '';
        if (this.state.listening) {
          recognition.start()
          recognition.onend = () => {
            console.log("Continue listening...")
            recognition.start()
          }

        } else {
          recognition.stop()
          recognition.onend = () => {
            console.log("Stopped listening per click")
          }
        }

        recognition.onstart = () => {
          console.log("Listening!")
        }

        let finalTranscript = ''
        recognition.onresult = event => {
          let interimTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) finalTranscript += transcript + ' ';
            else interimTranscript += transcript;
          }
          if (this.state.val != interimTranscript && interimTranscript != "") {
            console.log(interimTranscript);
            this.setState({val: interimTranscript});
          }
        }
    }
    toggleListen() {
        this.setState({
          listening: !this.state.listening
        }, this.handleListen)
    }

    render() {
        return (
          <div className="container">
              <GoBack />
              <div className="row mt">
                  <div className="col-xs-12 col-md-4 col-sm-6 well">
                  <form onSubmit={(this.state.isEdit) ? this.editItemFirebase.bind(this): this.insertData.bind(this)}>
                    <div className="col-xs-9 np mb">
                      <input type="text" placeholder="Enter Task..." onChange={this.handleChange.bind(this)} 
                      value={this.state.val} name="task" required autoComplete="off" className="form-control" /> 
                      <span className={!this.state.listening ? "fa fa-microphone mphn" : "fa fa-microphone-slash mphn"} 
                        onClick={this.toggleListen.bind(this)}>
                      </span>
                      {this.state.listening ? "Speak now..." : ""}
                    </div>
                    <div className="col-xs-9 np">
                      <input type="date" placeholder="Complitation Date..." onChange={this.handleDateChange.bind(this)} 
                      value={this.state.date} name="date" required className="form-control" /> 
                    </div>
                    <div className="col-xs-2">
                        <button type="submit" className="btn btn-primary">{(this.state.isEdit) ? "Edit" : "Add"}</button>
                    </div>
                  </form>
                  </div>
              </div>
              <div className="row">
                  <div className="np col-xs-12 col-md-4 col-sm-6">
                    {this.state.isLoaded 
                        ? 
                        <div>
                            <h3>Welcome {localStorage.getItem('currentUsername')}
                            <button type="button" onClick={this.logoutUser.bind(this)} className="ml btn btn-xs btn-default">Logout</button>
                            </h3>
                            <Todo done_list={this.state.done_list} 
                            pending_list={this.state.pending_list} changeStatus={this.changeStatus.bind(this)} 
                            editItem={this.editItem.bind(this)} deleteItem={this.deleteItem.bind(this)} />
                        </div> 
                        : <div className="loader"></div>
                    }
                  </div>
              </div>
          </div>
        );
    }
}

export default TodoApp;
