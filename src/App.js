import React from 'react';
import './App.css';
import Compartment from './Compartment.js';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      itemCount: 0,
      itemView: 'all',
      data: {},
    };
    this.viewButtons = [
      'all',
      'to do',
      'done'
    ];
    this.setView = this.setView.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.addCompartment = this.addCompartment.bind(this);
    this.addListItem = this.addListItem.bind(this);
    this.checkBox = this.checkBox.bind(this);
    this.delCompartment = this.delCompartment.bind(this);
    this.delListItem = this.delListItem.bind(this);
  }

  // declare a function to change view with viewButtons
  setView(view) {
    this.setState({ itemView: view })
  }

  // load existing compartments from localStorage as necessary
  componentDidMount() {
    let storedData = window.localStorage.getItem('data')
    let storedCount = window.localStorage.getItem('itemCount')
    if (storedData) {
      this.setState({ data: JSON.parse(storedData) })
      this.setState({ itemCount: JSON.parse(storedCount) })
    } else {
      window.localStorage.setItem('data', JSON.stringify({}))
      window.localStorage.setItem('itemCount', JSON.stringify(this.state.itemCount))
    }
  }

  // keep localStorage up to date with this.state.currentPage
  componentDidUpdate() {
    window.localStorage.setItem('data', JSON.stringify(this.state.data))
    window.localStorage.setItem('itemCount', JSON.stringify(this.state.itemCount))
  }

  // declare function to handle "enter" keypress
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.target.id === 'compartmentInput') {
        this.addCompartment(e.target);
      } else {
        // console.log(e.target.dataset.compartment);
        this.addListItem(e.target.dataset.compartment, e.target);
      }
    }
  }

  // declare function addCompartment to add a new compartment array to the storage object
  // to be used on compartment input button click - and componentDidMount?
  addCompartment(compartmentInput) {
    if (compartmentInput.value in this.state.data || compartmentInput.value === '') {
      alert('please choose a unique, non-empty compartment name');
    } else {
      let existingCompartments = this.state.data;
      existingCompartments[compartmentInput.value] = [];
      this.setState({ data: existingCompartments });
      compartmentInput.value = '';
    }
  }

  // declare function addListItem to add a new list item object to the storage object / compartment array
  addListItem(compartmentName, listItemInput) {
    if (listItemInput.value === '') {
      alert('please enter a non-empty thought');
    } else {
      let newCount = this.state.itemCount + 1;
      this.setState({ itemCount: newCount });
      let existingToDos = this.state.data;
      existingToDos[compartmentName].unshift({
        'name': listItemInput.value,
        'id': this.state.itemCount,
        'done': false,
      })
      this.setState({ data: existingToDos });
      listItemInput.value = '';
    }
  }

  // declare function checkBox to mark a list item as done
  checkBox(compartmentName, listItemId) {
    let allData = this.state.data;
    let itemIndex = this.state.data[compartmentName].findIndex(item => item.id === listItemId);
    allData[compartmentName][itemIndex].done = !allData[compartmentName][itemIndex].done;
    this.setState({ data: allData })
  }

  // declare function delCompartment to remove a compartment
  delCompartment(compartmentName) {
    let updatedData = this.state.data;
    console.log(updatedData);
    delete updatedData[compartmentName];
    console.log(updatedData);
    this.setState({ data: updatedData })
  }

  // declare function delListItem to remove a list item
  delListItem(compartmentName, listItemId) {
    let itemIndex = this.state.data[compartmentName].findIndex(item => item.id === listItemId);
    let updatedData = this.state.data;
    updatedData[compartmentName].splice(itemIndex, 1);
    this.setState({ data: updatedData });
  }

  render() {
    let compartments = Object.keys(this.state.data).reverse();
    return (
      <>
        {/* header */}
        <h1>compartments</h1>
        {/* render buttons that will setState of itemView */}
        {
          // generate buttons dynamically using props.pages
          this.viewButtons.map((item, key) => {
            return (
              <button
                key={'button-' + key}
                className={'m-2 btn ' + ((this.state.itemView === item) ? ' btn-primary' : 'btn-secondary')}
                onClick={() => this.setView(item)}
              >
                {item}
              </button>
            )
          })
        }
        {/* COMPARTMENT INPUT onClick=addCompartment */}
        <div className='input-group p-3'>
          <input
            id='compartmentInput'
            type='text'
            className='form-control'
            placeholder='add a new compartment'
            aria-describedby='button-addon2'
            onKeyPress={this.handleKeyPress}>
          </input>
          <div className='input-group-append'>
            <button
              className='btn btn-outline-secondary'
              type='button'
              id='button-addon2'
              onClick={() => this.addCompartment(document.getElementById('compartmentInput'))}>+
            </button>
          </div>
        </div>
        {/* compartment accordion parent divs */}
        <div className="accordion" id="accordionExample">
          <div className="card">
            {/* create a new compartment for each one listed in this.state.data */}
            {
              compartments.map((item, index) => {
                return (
                  <Compartment
                    itemView={this.state.itemView}
                    data={this.state.data[item]}
                    compartmentName={item}
                    handleKeyPress={this.handleKeyPress}
                    addListItem={this.addListItem}
                    checkBox={this.checkBox}
                    delCompartment={this.delCompartment}
                    delListItem={this.delListItem}
                    id={'compartment-' + index}
                    key={index}
                  />
                )
              })
            }
          </div>
        </div>
      </>
    );
  }
}

export default App;
