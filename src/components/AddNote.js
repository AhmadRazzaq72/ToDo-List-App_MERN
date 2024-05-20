import React,{ useContext, useState } from 'react'
import noteContext from '../context/notes/noteContex';

const AddNote = (props) => {
    const context = useContext(noteContext);
    const {addNote} = context;
    
    const [note, setNote] = useState({title: "", description: "",tag: ""})

    const handleClick = (e)=>{
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({title: "", description: "",tag: ""})
        props.showAlert("Note Added Successfully", "success");

    }

    const onChange = (e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }
  return (
         <div className="container my-3">
      <h2>Add a Note</h2>
      <form className="my-3">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title<sup className='text-danger'>*</sup></label>
          <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" required minLength={3} value={note.title} onChange={onChange}/>
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">Tag</label>
          <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={onChange}/>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description<sup className='text-danger'>*</sup></label>
          <input type="text" className="form-control" id="description" name="description" required minLength={5} value={note.description} onChange={onChange}/>
        </div>
        <button type="submit" className="btn btn-primary" disabled={note.title.length<3 || note.description.length<5} onClick={handleClick}>Add Note</button>
      </form>
      </div>
   
  )
}

export default AddNote