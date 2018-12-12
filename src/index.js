import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ReactTable from "react-table";
import 'react-table/react-table.css'


class OptionsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({value: e.target.value});
      }

    handleSubmit(e) {
        this.props.onFormSubmit(this.state.value);
        e.preventDefault()
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Year:
              <input type="number" value={this.state.value} onChange={this.handleChange}/>
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

class HebrewHolidays extends React.Component {
    constructor(props) {
        super(props);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.state = {
            year: 2018,
        }
        this.hebrewTable = React.createRef();
    }

    handleFormSubmit(value) {
        const state = this.state;
        state.year = value;
        
        this.setState(state)
        this.hebrewTable.current.handleFormSubmit(value);
    }

    render() {
        return (
            
            <div className="hebrewholidays">
                <div class="hebrewholiday">This very simple ReactJS App displays Jewish holidays according to specified year (defaults to current year).
                Data is retrieved from <a href="https://www.hebcal.com/hebcal/">https://www.hebcal.com/hebcal/</a></div>
                <div class="hebrewholiday"><OptionsForm onFormSubmit={this.handleFormSubmit}/></div>
                <div class="hebrewholiday"><HolidayTable ref={this.hebrewTable}/></div>
            </div>
        );
    
    }
}

class HolidayTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            error: false,
        }
        this.fetchData();
    }

    fetchData(year=(new Date()).getFullYear()) {
        fetch(`https://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=${year}&month=x&ss=on&mf=on&c=on&geo=geoname&geonameid=3448439&m=50&s=on`)
        .then((response) => {
            this.handleResponse(response);
        });
    }

    handleFormSubmit(value) {
        this.fetchData(value)
        const state = this.state;

        // Clearing table from previous entries
        state.items = [];

        this.setState(state);
    }

    async handleResponse(res) {
        const state = this.state;
        const resObj = await res.json();

        state.items.push(...resObj.items);

        this.setState(state);
    }

    render() {
        const data = this.state.items

        const columns = [{
            Header: 'Title',
            accessor: 'title'
        }, {
            Header: 'Date',
            accessor: 'date',
        }, {
            Header: 'Category',
            accessor: 'category',
        }, {
            Header: 'Hebrew',
            accessor: 'hebrew',
        }]

        if (this.state.error) {
            return this.getDivWithMessage('can\'t connect to server')
        }

        if (data.length == 0) {
            return this.getDivWithMessage('waiting for data, should add a launcher')
        }

        return (
            <div className="holidaytable">
                <ReactTable
                    data={data}
                    columns={columns}
                />
            </div>
        );
    }

    getDivWithMessage(text) {
        return (
            <div className="holidaytable">
                {text}
            </div>
        );
    }

}

// ----------------------------------------

ReactDOM.render(
    <HebrewHolidays />,
    document.getElementById('root')
);
