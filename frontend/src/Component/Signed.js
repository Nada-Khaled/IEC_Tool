import React, {useState, useEffect} from 'react';
import comp from '../media/check.png';
import '../App.css';

const Signed = () =>{
    let [file,setFile] = useState(null);

    const handleFile = async (event) => {
        setFile(event.target.files[0])
        console.log("file uploaded");
    }

    const resetFile = async () => {
        setFile(null)
        console.log("file reset")
    }

    const handleCompute = () => {
        console.log("file send")
    }

    useEffect(() =>{console.log("file = ", file);},[file])
    
    const fileReport = (file)=>{
        if (file=== null || typeof(file) === undefined){
            return(<div> </div>)
        } else{
            return(<div> File Uploaded <img className="check" src={comp} alt="completed" /> </div>)
        }
    }

    return (
        <div className="box2">
            <h1>Signed</h1>
            <br></br>
            <form>
              <div>UPLOAD YOUR FILE & CLEAN YOUR DATA</div>
              <div>
                <label >UPLOAD YOUR FILE:</label>
                
                <input className='input' type="file" id="myfile" onChange={handleFile}/>
              </div>

              <div>
                <button className='button' type='button' onClick={handleCompute}>Compute </button> 
                <button className='button' type='button' onClick={resetFile}> RESET </button> 
              </div>

              {fileReport(file)}

            </form>
        </div>
    )
}
export default Signed;