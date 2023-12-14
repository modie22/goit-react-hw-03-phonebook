import { Component } from 'react';
import shortid from 'shortid';
import Container from './Container/Container';
import ContactForm from './Form/Form';
import Filter from './Filter/Filter';
import ContactList from './List/List';

class App extends Component {
  state = {
    contacts: [
    ],
    filter: '',
  };
  getContactToLocal = () => {
    localStorage.setItem('contactLocal',JSON.stringify(this.state.contacts));
  }
  addContact = ({ name, number }) => {
    const contact = {
      id: shortid.generate(),
      name,
      number,
    };

    const { contacts } = this.state;
    
    if (
      contacts.find(
        contact => contact.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      alert(`${name} is already in contacts.`);
    } else if (contacts.find(contact => contact.number === number)) {
      alert(`${number} is already in contacts.`);
    } else if (name.trim() === '' || number.trim() === '') {
      alert("Enter the contact's name and number phone!");
    } else if ((contact.number).toString().length!==12) {
      alert(`The number must contain 12 numbers!`);
    } else if (!/^(38)?0[0-9]{9}$/g.test(number)) {
      alert('The phone number must start with 380!');
    } else {
      this.setState(({ contacts }) => ({
        contacts: [contact, ...contacts],
      }));
    }
  };

  deleteContact = contactId => {
    this.setState(({ contacts }) => ({
      contacts: contacts.filter(contact => contact.id !== contactId),
    }));
  };

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  getVisibleContacts = () => {
    const { contacts, filter } = this.state;
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };
  componentDidUpdate(){
    this.getContactToLocal();
  }
  componentDidMount(){
     if(JSON.parse(localStorage.getItem('contactLocal') !== null ))
     this.setState({
      contacts:JSON.parse(localStorage.getItem('contactLocal')),
    }) 
  }

  render() {
    const { filter, contacts } = this.state;
    const visibleContacts = this.getVisibleContacts();
    return (
      <Container>
        <h1>Phonebook</h1>
        <ContactForm onSubmit={this.addContact} />
        <h2>Contacts</h2>
        {contacts.length > 1 && (
          <Filter value={filter} onChange={this.changeFilter} />
        )}
        {contacts.length > 0 ? (
          <ContactList
            contacts={visibleContacts}
            onDeleteContact={this.deleteContact}
          />
        ) : (
          <p>Your phonebook is empty. Please add contact.</p>
        )}
      </Container>
    );
  }
}

export default App;
