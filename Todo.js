import React, { Component } from 'react';

const NoTask = (props) => (
	<div className="alert alert-danger">{props.msg}</div>
)
class Todo extends Component {
	constructor(props) {
        super(props);
        this.state = {

        }
    }
    isExpired(date) {
    	var todayDate = new Date().toDateString();
    	var today = new Date(todayDate).getTime();
    	var target = new Date(date).getTime();
    	if (target < today) {
    		return true;
    	} else {
    		return false;
    	}
    }
    changeFormat(date) {
    	let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    	var m = new Date(date).getMonth();
    	var mm = month[m];
    	var dd = new Date(date).getDate();
    	var yy = new Date(date).getFullYear();
    	return dd+"-"+mm+"-"+yy;
    }

  render() {
  	const pendingItem = (this.props.pending_list).map((d, i) => {
  		var isExpired = this.isExpired(d.date);
  		var cls = (isExpired) ? "list-group-item list-group-item-danger" : "list-group-item";
	  		return <li key={i} className={cls}>{d.item}
		  		<span className={(d.status == "1") ? "label sm label-success ml pt" : "label sm label-warning ml pt"} 
		  		onClick={this.props.changeStatus.bind(this, d.id, d.status)}>Pending</span>
	  			<span className="rigth">
		  			<span className="fa fa-edit" onClick={this.props.editItem.bind(this, d.id, d.item, d.date)}></span>
		  			<span className="fa fa-trash" onClick={this.props.deleteItem.bind(this, d.id)}></span>
	  			</span>
	  			<div className="muted">({this.changeFormat(d.date)})</div>
	  		</li>
  	});
  	const doneItem = (this.props.done_list).map((d, i) => {
  		var cls = "list-group-item list-group-item-success";
	  		return <li key={i} className={cls}>{d.item}
		  		<span className={(d.status == "1") ? "label sm label-success ml pt" : "label sm label-warning ml pt"} 
		  		onClick={this.props.changeStatus.bind(this, d.id, d.status)}>Done</span>
	  			<span className="rigth">
		  			<span className="fa fa-edit" onClick={this.props.editItem.bind(this, d.id, d.item, d.date)}></span>
		  			<span className="fa fa-trash" onClick={this.props.deleteItem.bind(this, d.id)}></span>
	  			</span>
	  			<div className="muted">({this.changeFormat(d.date)})</div>
	  		</li>
  	});
    return (
      <div>
      <h4>Pending Tasks:</h4>
      	<ul className="list-group">
          {(pendingItem != '') ? pendingItem : <NoTask msg="No pending task" />}
        </ul>
        <h4>Done Tasks:</h4>
        <ul className="list-group">
	      	{(doneItem != '') ? doneItem : <NoTask msg="No done task" />}
      	</ul>
      </div>
    );
  }
}

export default Todo;
