import React, { Component } from 'react';
import TodoApp from './TodoApp';
import Signup from './Signup';

class MainTodo extends React.Component {
	constructor() {
		super();
		this.state = {
			isLogin: 0,
		}
	}
	componentDidMount() {
		this.setState({"isLogin": localStorage.getItem("isLogin")});
	}
	showTodo(e, d) {
		this.setState({"isLogin": e});
	}
	render() {
		return(
			<div>
				{(this.state.isLogin == "1") ? <TodoApp showTodo={this.showTodo.bind(this)} /> : <Signup showTodo={this.showTodo.bind(this)} />}
			</div>
		)	
	}
}

export default MainTodo;