import React, { useState, useEffect } from 'react';
import './App.css';

function App() {

/*
 const [tasks, setTasks] = useState({
   todoList: [],
   activeItem: {
     id: null,
     title: '',
     completed: false,
   },
   editing: false
 })
*/

 const [tasks, setTasks] = useState([]);

 var [activeItem, setActiveItem] = useState({
   id: null,
   title: '',
   completed: false,
 });

 var [editing, setEditing] = useState(false);


  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }

  async function fetchData() {
  const res = await fetch('http://127.0.0.1:8000/api/task-list/');
  res.json()
    .then(res => setTasks(res));
  };

 useEffect( () => {
   fetchData();
 }, []);
 
  const handleChange = (e) => {
    var value = e.target.value;

    setActiveItem({
      ...activeItem,
      title: value
    });
  };

 const handleSubmit = (e) => {
    console.log('ID: ', {activeItem})
    e.preventDefault();

    var csrftoken = getCookie('csrftoken');

    var url = "http://127.0.0.1:8000/api/task-create/";

    if (editing === true) {
      url = `http://127.0.0.1:8000/api/task-update/${activeItem.id}/`;
      
      setEditing(false);
    }

    

    fetch(url, {
      method: 'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(activeItem)
    }).then((response) => {
      fetchData()
      setActiveItem({
        'id': null,
        'title': '',
        'completed': false,
      })
    }).catch(function(error){
      console.log('Error', error)
    })
   
 }

 const startEdit = (task) => {
   setActiveItem(activeItem = task);
   
   setEditing(true);
   console.log('Mi item: ', activeItem)
 };

 const deleteItem = (task) => {
    var csrftoken = getCookie('csrftoken');
    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}/`, {
      method:'DELETE',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
    }).then((response) => {
      fetchData();
    });
 };

 const completedUncompleted = (task) => {
   task.completed = !(task.completed);
   var csrftoken = getCookie('csrftoken');

   const url = `http://127.0.0.1:8000/api/task-update/${task.id}/`;
   fetch(url, {
     method: 'POST',
     headers:{
      'Content-type': 'application/json',
      'X-CSRFToken': csrftoken,
     },
     body: JSON.stringify(task)
   }).then(() => {
     fetchData();
   })  
 };


 

  return (
    <>
      <div className='container'>

        <div id='task-container'>

          <div id='form-wrapper'>
            <form id='form' onSubmit={handleSubmit}>
              <div className='flex-wrapper'>

                <div style={{flex: 10}}>
                  <input onChange={handleChange} className='form-control' id='title' name='title' value={activeItem.title} type='text' placeholder='Titulo'/>
                </div>

                <div style={{flex: 2}}>
                  <input id='submit' className='btn btn-warning' type='submit' name='Añadir'/>
                </div>

              </div>
            </form>
          </div>

        </div>

        <div id='list-wrapper'>

          {
            
            tasks.map( task => {
              return(
                <div key={task.id} className='task-wrapper flex-wrapper'> 
                  
                  <div onClick={() => completedUncompleted(task)} style={{flex:7}}>
                    {task.completed == false ? (
                      <span>{task.title}</span>
                    ) : (
                      <strike>{task.title}</strike>
                    )}
                    
                  </div>

                  <div style={{flex:1}}>
                    <button onClick={() => startEdit(task)} className='btn btn-sm btn-outline-info'>Editar</button>
                  </div>

                  <div style={{flex:1}}>
                    <button onClick={() => deleteItem(task)} className='btn btn-sm btn-outline-dark delete'>-</button>
                  </div>
                  
                </div>
              )
            }
            )}
        </div>


      </div>
    </>
  );
}

export default App;
