import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios';
import styles from'./Todo1.module.css'
export default function Todo() {
  let[hide,setHide] =useState(true);
  let[newTaskName,setNewTaskName]=useState(' ');
  let[newTaskImportance,setNewTaskImportance]=useState(' ');
  let [productList, setProductList] = useState([]);
  let [taskList, seTaskList] = useState([]);
  let [taskCheck, setTaskCheck] = useState(false);
  let [editTask,setEditTask] = useState(false);
  let[lang,setLang]= useState(true);
  let[error,setError]=useState(false);

// search
  function hideSearch(boolean) {
    setHide(boolean)
  }

  const searchByName = (value) => {
    let foundedItems = []
    for(let i = 0; i <productList.length;i++){
        if(productList[i].newTaskName.toLowerCase().includes(value.toLowerCase()) == true){
        foundedItems.push(productList[i])
        }
    }
    seTaskList(foundedItems)
  };
  const clearSearch = () => {
    let foundedItems = []
    seTaskList(foundedItems)
  };
  // -----------------------
  function display(newTask) {
    setProductList([...productList, { ...newTask, taskCheck: false,editTask:false }]);
        localStorage.setItem("productList",JSON.stringify([...productList, { ...newTask, taskCheck: false,editTask:false }]));
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTaskName !== ' ' && newTaskImportance !== ' ') {
      display({ newTaskName, newTaskImportance });
      clearSearch()
      console.log(newTaskName);
    }else{
      startError(true)
    }
  };
  const handleChange = (index) => {
    const updatedProductList = [...productList];
    updatedProductList[index].taskCheck = !updatedProductList[index].taskCheck;
    setProductList(updatedProductList);
  };
  // Editing
  const editingTask = (index) => {
    const updatedProductList = [...productList];
    updatedProductList[index].editTask = !updatedProductList[index].editTask;
    setProductList(updatedProductList);
  };
  const handleEditTaskName = (value, index) => {
  const updatedProductList = [...productList];
  updatedProductList[index].newTaskName = value;
  setProductList(updatedProductList);
};
const updateTask = (index) => {
  const updatedProductList = [...productList];
  updatedProductList[index].editTask = false;
  setProductList(updatedProductList);
  localStorage.setItem("productList",JSON.stringify(updatedProductList));
};
// =====================
// remove
const removeTask = (index) => {
  const updatedProductList = [...productList];
  updatedProductList.splice(index,1)
  setProductList(updatedProductList);
  localStorage.setItem("productList",JSON.stringify(updatedProductList));
  clearSearch()
};
// ====================
// filter
const filtering = (filter)=>{
  if(filter === "All"){
    seTaskList(productList);
  }else if(filter === "Pending"){
    clearSearch()
    const tasksPending = productList.filter((task)=>!task.taskCheck)
    console.log(tasksPending);
    if (tasksPending < 0) {
      setProductList(tasksPending)
    }else{
      seTaskList(tasksPending);
    }
  }else if(filter === "Completed"){
    clearSearch()
    const tasksCompleted = productList.filter((task)=>task.taskCheck)
    console.log(tasksCompleted);
    if (tasksCompleted < 0) {
      setProductList(tasksCompleted)
    }else{
      seTaskList(tasksCompleted);
    }
  }
}
// ==========
// error
const startError = (boolean)=>{
 setError(boolean)
}


// 
  function start() {
    if(localStorage.getItem("productList") == null){
      productList = []
  }else{
    setProductList(JSON.parse(localStorage.getItem("productList")));
  }
  }
useEffect(()=>{
  start()
},[])
  return (<>
    <div className='pb-5'>
    <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid text-center">
          <h5 className="text-white mx-auto">Site Title</h5>
        </div>
      </nav>
      <div className="lang mx-right d-flex justify-content-start">
        <p className="px-5 py-3"><span className={`english ${lang&&'active'}`} onClick={()=>setLang(true)}>English</span> | <span className={`arabic ${!lang&&'active'}`} onClick={()=>setLang(false)}>العربيه</span></p>
      </div>
      {/* English */}
      {lang && <div className="todoContainer col-md-6 col-10 mx-auto">
        <div>
          <div className="d-flex justify-content-center">
              <h1>Notes</h1>
              <p className="pt-4">by(your name)</p>
            </div>
        </div>
        <div className="form-group mt-5 d-flex">
          {hide && <i className="fa-solid fa-magnifying-glass search iconSearch"></i>}
          <input type="text" onClick={()=>hideSearch(false)} onChange={(e)=>searchByName(e.target.value)} onKeyDown={()=>hideSearch(false)} onMouseOut={()=>hideSearch(true)}  className="form-control rounded-pill" id="search"/>
          <i className="fa-solid fa-list-ul iconList"></i>
      </div>
      <div className="lang d-flex justify-content-start">
        <p className="px-5 py-3 clickable"><span className="px-2" onClick={()=>filtering("All")}>All</span> | <span className="px-2" onClick={()=>filtering("Pending")}>Pending</span> | <span className="px-2" onClick={()=>filtering("Completed")}>Completed</span></p>
      </div>
      <div className="formContainer" id='formTotal'>
        {(taskList.length < 1)?productList?.map((product,index)=> <>
          {!product.editTask && <div key={index} className={`border border-1 p-2 ${product.taskCheck?'checked':'unchecked'}`}>
        <div className="d-flex justify-content-between align-items-center">
        <div className="form-check">
    <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" onChange={()=>handleChange(index)}  checked={product.taskCheck}/>
    <label className={`form-check-label ${product.taskCheck && 'check'}`} htmlFor="flexCheckChecked" checked={product.taskCheck}>
      {product.newTaskName} 
    </label>
    {product.newTaskImportance == "high" && <i className="fa-regular fa-bookmark text-danger ms-2"></i>}
    {product.newTaskImportance == "medium" && <i className="fa-regular fa-bookmark iconOrange ms-2"></i>}
    {product.newTaskImportance == "low" && <i className="fa-regular fa-bookmark iconYellow ms-2"></i>}
    
      </div>
      <div className="">
      <button type="button" className="btn btn-outline-dark me-3" onClick={()=>editingTask(index)}>Edit</button>
      <button type="button" className="btn btn-danger" onClick={()=>removeTask(index)}>Remove</button>
      </div>
        </div>
            </div>}
          {product.editTask && <div key={index} className="border border-1 p-2">
        <div className="d-flex justify-content-between align-items-center">
        <div className="w-75">
      <input type="text"  className="form-control" id="inputTask" value={product.newTaskName} onChange={(e)=>handleEditTaskName(e.target.value, index)} required/>
    </div>
      <div className="">
      <button type="button" className="btn btn-warning me-3" onClick={() => updateTask(index)}>Update</button>
      </div>
        </div>
            </div>}
        
        
        </>
        // search
    ):taskList?.map((product,index)=> <>
    {!product.editTask && <div key={index} className="border border-1 p-2">
  <div className="d-flex justify-content-between align-items-center">
  <div className="form-check">
<input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" onChange={()=>handleChange(index)}  checked={product.taskCheck}/>
<label className={`form-check-label ${product.taskCheck && 'check'}`} htmlFor="flexCheckChecked" checked={product.taskCheck}>
{product.newTaskName} 
</label>
{product.newTaskImportance == "high" && <i className="fa-regular fa-bookmark text-danger ms-2"></i>}
    {product.newTaskImportance == "medium" && <i className="fa-regular fa-bookmark iconOrange ms-2"></i>}
    {product.newTaskImportance == "low" && <i className="fa-regular fa-bookmark iconYellow ms-2"></i>}
</div>
<div className="">
<button type="button" className="btn btn-outline-dark me-3" onClick={()=>editingTask(index)}>Edit</button>
<button type="button" className="btn btn-danger" onClick={()=>removeTask(index)}>Remove</button>
</div>
  </div>
      </div>}
    {product.editTask && <div key={index} className="border border-1 p-2">
  <div className="d-flex justify-content-between align-items-center">
  <div className="w-75">
<input type="text"  className="form-control" id="inputTask" value={product.newTaskName} onChange={(e)=>handleEditTaskName(e.target.value, index)} required/>
</div>
<div className="">
<button type="button" className="btn btn-warning me-3" onClick={() => updateTask(index)}>Update</button>
</div>
  </div>
      </div>}
  
  
  </>
  
)}
      </div>
      <div className="addTaskContainer pt-5">
      <div className="">
      <form onSubmit={handleSubmit} className="d-flex justify-content-between align-items-center">
      <div className="w-75">
      <input type="text"  className="form-control" id="inputTask" onChange={(e)=>setNewTaskName(e.target.value)} onClick={()=>startError(false)}/>
    </div>
    <div className="w-auto d-flex">
    <select className="form-select me-2" aria-label="select" onChange={(e)=>setNewTaskImportance(e.target.value)} onClick={()=>startError(false)}>
  <option value=" ">select</option>
  <option value="high">high</option>
  <option value="medium">medium</option>
  <option value="low">low</option>
</select>
    <button type="submit" className="btn btn-primary">add</button>
    </div>
      </form>
          </div>
      </div>
      {error && <div className="alert alert-danger py-3 mt-3" role="alert">
      <i className="fa-solid fa-triangle-exclamation pe-2"></i>
          todo text must not be empty ,priority must be selected
      </div>}
      
      </div>}
      {/* Arabic */}
      {!lang && <div className="todoContainer col-md-6 col-10 mx-auto">
        <div>
          <div className="d-flex justify-content-center">
          <p className="pt-4">باسمك</p>
              <h1>ملاحظات</h1>
            </div>
        </div>
        <div className="form-group mt-5 d-flex">
        <i className="fa-solid fa-list-ul iconListArapic"></i>
          <input type="text" onClick={()=>hideSearch(false)} onChange={(e)=>searchByName(e.target.value)} onKeyDown={()=>hideSearch(false)} onMouseOut={()=>hideSearch(true)}  className="form-control rounded-pill" id="search"/>
          {hide && <i className="fa-solid fa-magnifying-glass search iconSearchArabic"></i>}
      </div>
      <div className="lang d-flex justify-content-end">
        <p className="px-5 py-3 clickable"><span className="px-2" onClick={()=>filtering("All")}>الكل</span> | <span className="px-2" onClick={()=>filtering("Pending")}>قيد الانتظار</span> | <span className="px-2" onClick={()=>filtering("Completed")}>المكتمل</span></p>
      </div>
      <div className="formContainer" id='formTotal'>
        {(taskList.length < 1)?productList?.map((product,index)=> <>
          {!product.editTask && <div key={index} className="border border-1 p-2">
        <div className="d-flex justify-content-between align-items-center">
        <div className="">
        <button type="button" className="btn btn-danger" onClick={()=>removeTask(index)}>ازاله</button>
      <button type="button" className="btn btn-outline-dark ms-3" onClick={()=>editingTask(index)}>تعديل</button>
      </div>
        <div className="rtl-label">
    <input className="form-check-input ms-2" type="checkbox" value="" id="flexCheckChecked" onChange={()=>handleChange(index)}  checked={product.taskCheck}/>
    <label className={`form-check-label ${product.taskCheck && 'check'}`} htmlFor="flexCheckChecked" checked={product.taskCheck}>
      {product.newTaskName} 
    </label>
    {product.newTaskImportance == "high" && <i className="fa-regular fa-bookmark text-danger me-2"></i>}
    {product.newTaskImportance == "medium" && <i className="fa-regular fa-bookmark iconOrange me-2"></i>}
    {product.newTaskImportance == "low" && <i className="fa-regular fa-bookmark iconYellow me-2"></i>}
      </div>
      
        </div>
            </div>}
          {product.editTask && <div key={index} className="border border-1 p-2">
        <div className="d-flex justify-content-between align-items-center">
        <div className="">
      <button type="button" className="btn btn-warning me-3" onClick={() => updateTask(index)}>تعديل</button>
      </div>
        <div className="w-75">
      <input type="text"  className="form-control" id="inputTask" value={product.newTaskName} onChange={(e)=>handleEditTaskName(e.target.value, index)} required/>
    </div>
        </div>
            </div>}
        
        
        </>
        // search
    ):taskList?.map((product,index)=> <>
    {!product.editTask && <div key={index} className="border border-1 p-2">
  <div className="d-flex justify-content-between align-items-center">
  <div className="">
        <button type="button" className="btn btn-danger" onClick={()=>removeTask(index)}>ازاله</button>
      <button type="button" className="btn btn-outline-dark ms-3" onClick={()=>editingTask(index)}>تعديل</button>
      </div>
  <div className="rtl-label">
<input className="form-check-input ms-2" type="checkbox" value="" id="flexCheckChecked" onChange={()=>handleChange(index)}  checked={product.taskCheck}/>
<label className={`form-check-label ${product.taskCheck && 'check'}`} htmlFor="flexCheckChecked" checked={product.taskCheck}>
{product.newTaskName} 
</label>
{product.newTaskImportance == "high" && <i className="fa-regular fa-bookmark text-danger ms-2"></i>}
    {product.newTaskImportance == "medium" && <i className="fa-regular fa-bookmark iconOrange ms-2"></i>}
    {product.newTaskImportance == "low" && <i className="fa-regular fa-bookmark iconYellow ms-2"></i>}
</div>
  </div>
      </div>}
    {product.editTask && <div key={index} className="border border-1 p-2">
  <div className="d-flex justify-content-between align-items-center rtl-label">
  <div className="w-75">
<input type="text"  className="form-control" id="inputTask" value={product.newTaskName} onChange={(e)=>handleEditTaskName(e.target.value, index)} required/>
</div>
<div className="">
<button type="button" className="btn btn-warning me-3" onClick={() => updateTask(index)}>تعديل</button>
</div>
  </div>
      </div>}
  
  
  </>
  
)}
      </div>
      <div className="addTaskContainer pt-5 rtl-label">
      <div className="">
      <form onSubmit={handleSubmit} className="d-flex justify-content-between align-items-center">
      <div className="w-75">
      <input type="text"  className="form-control" id="inputTask" onChange={(e)=>setNewTaskName(e.target.value)} onClick={()=>startError(false)}/>
    </div>
    <div className="w-auto d-flex">
    <select className="form-select me-2" aria-label="select" onChange={(e)=>setNewTaskImportance(e.target.value)} onClick={()=>startError(false)}>
  <option value=" ">اختر</option>
  <option value="high">عالي</option>
  <option value="medium">متوسط</option>
  <option value="low">منخفض</option>
</select>
    <button type="submit" className="btn btn-primary me-2">اضف</button>
    </div>
      </form>
          </div>
      </div>
         {error && <div className="alert alert-danger py-3 mt-3 rtl-label" role="alert">
      <i className="fa-solid fa-triangle-exclamation ps-2"></i>
      يجب ألا يكون نص المهام فارغًا، ويجب تحديد الأولوية
      </div>}
      </div>}
      
    </div>
  </>
    
  )
}
