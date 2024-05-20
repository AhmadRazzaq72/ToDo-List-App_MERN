import React, { useEffect, useContext, useRef, useState } from 'react'
import noteContext from '../context/notes/noteContex';
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom'

const Notes = (props) => {
  const [note, setNote] = useState({ id: "", e_title: "", e_description: "", e_tag: "" })
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;
  const ref = useRef(null)
  const refClose = useRef(null)
  let navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('token')){
      getNotes()
    }
    else{
      navigate("/Login")
    }
    //eslint-disable-next-line
  }, [])

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({ id: currentNote._id, e_title: currentNote.title, e_description: currentNote.description, e_tag: currentNote.tag })

  }
  
  const handleClick = (e) => {
    editNote(note.id, note.e_title, note.e_description, note.e_tag)
    refClose.current.click();
    props.showAlert("Updated Successfully", "success");

  }

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
  }
  return (
    <>
      <AddNote showAlert={props.showAlert} />
      <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="e_title" className="form-label">Title<sup className='text-danger'>*</sup></label>
                  <input type="text" className="form-control" id="e_title" name="e_title" aria-describedby="emailHelp" required minLength={3} value={note.e_title} onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="e_tag" className="form-label">Tag</label>
                  <input type="text" className="form-control" id="e_tag" name="e_tag" value={note.e_tag} onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="e_description" className="form-label">Description<sup className='text-danger'>*</sup></label>
                  <input type="text" className="form-control" id="e_description" name="e_description" required minLength={5} value={note.e_description} onChange={onChange} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={refClose} >Close</button>
              <button type="button" className="btn btn-primary" disabled={note.e_title.length<3 || note.e_description.length<5} onClick={handleClick}>Update Note</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3">
        <h2>Your Notes</h2>
        <div className="container mx-2">
          <h5>{notes.length === 0 && 'Empty'}</h5>
        </div>
        {notes.map((note) => {
          return <Noteitem key={note._id} showAlert={props.showAlert} updateNote={updateNote} note={note} />
        })}
      </div>
    </>
  )
}

export default Notes