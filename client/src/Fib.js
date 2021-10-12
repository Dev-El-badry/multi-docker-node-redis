import React, {Component} from 'react';
import axios from 'axios';


class Fib extends Component {
	state = {
		seenIndexs: [],
		values: {},
		index: ''
	};

	componentDidMount() {
		this.fetchIndexs();
		this.fetchValues();
	}

	async fetchIndexs() {
		const response = await axios.get('/api/values/all');
		this.setState({seenIndexs: response.data})
	}

	async fetchValues() {
		const response = await axios.get('/api/values/current');
		this.setState({ values: response.data });
	}

	renderSeenIndexs() {
		return this.state.seenIndexs.map(({number}) => number).join(', ');
	}

	handleSubmit = async (e) => {
		e.preventDefault();

		await axios.post('/api/values', {index: this.state.index})
		this.setState({index: ''});
	};

	renderValues() {
		const entries = [];
		for(let key in this.state.values){
			entries.push(
				<div key={key}>
					For index {key} i calculated {this.state.values[key]}
				</div>
			);
		}

		return entries;
	}

	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<label>enter your index:</label>
					<input 
						onChange={event => this.setState({index: event.target.value})} 
					/>
					<button type="submit"> Submit </button>
				</form>

				<h3>indexs i have seen: </h3>
				{this.renderSeenIndexs()}

				<h3>Calculate values: </h3>
				{this.renderValues()}
			</div>
		);
	}
}

export default Fib;