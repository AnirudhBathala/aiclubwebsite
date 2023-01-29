import React, {useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Context } from '../../Context/Context';
import { SERVER_URL } from '../../EditableStuff/Config';
import Error from '../Error';
import Loading from '../Loading';

const TeamAdd = () => {
    const navigate = useNavigate();
    const [team,setTeam] = useState({
        firstname:"",
        lastname:"",
        profession:"",
        description:"",
        username:"",
        email:"",
        year:"",
        photo:"",
        password:"",
        cpassword:"",
        isadmin:false,
        ismember:false,
        isalumni:false,
        canCreateCompetitions:false,
    });
    // const { user } = useContext(Context);
    const [ load, setLoad ] = useState(0);
    const [ add, setAdd ] = useState(false);
    const [ photo, setPhoto ] = useState(null);
    const getUser = () => {
        try{
            axios.get(`${SERVER_URL}/getUserData`,
            {withCredentials: true})
            .then(async data=>{
                if(data.status===200 && data.data.isadmin){
                    setLoad(1);
                }
                else{
                    setLoad(-1);
                }
            })
        }catch(err){
            console.log(err);
            setLoad(-1);
        }
    }
    useEffect(()=>{
        getUser();
    },[]);

    const d=new Date();
    var y=d.getFullYear();
    const ly=2019;

    let name, value, checked;
    const handleInputs = (e) => {
        name = e.target.name;
        value = e.target.value;
        setTeam({...team, [name]:value});
    }
    const handlePhoto = (e) => {
        setTeam({...team, [e.target.name]: e.target.files[0]});
        setPhoto(URL.createObjectURL(e.target.files[0]));
        console.log(e.target.files[0]);
    }
    const handleCheck = (e) =>{
        name = e.target.name;
        checked = e.target.checked;
        setTeam({...team, [name] : checked});
    }
    
    const PostTeam = async (e) => {
        e.preventDefault();
        const {firstname,lastname,profession,description,username,email,year,photo,password,cpassword,isadmin,ismember,canCreateCompetitions} = team;
        // console.log(firstname,lastname,profession,description,username,email,year,photo,password,cpassword,isadmin,ismember);
        console.log('photo',photo);
        if(!firstname || !lastname || !profession || !description || !username || !email || !year || !photo || !password || !cpassword ){
            console.log('Fill required Details');
        }
        else{
            setAdd(true);
            const data = new FormData();
            const photoname = Date.now() + photo.name;
            data.append("name",photoname);
            data.append("photo",photo);
            console.log('formdata',data);
            var imgurl;

            try{
                const img = await axios.post(`${SERVER_URL}/imgupload`,data);
                console.log('img',img);
                imgurl = img.data;
                team.photo=imgurl
            }catch(err){
                console.log('photoerr',err);
            }
            console.log('imgurl',imgurl);
            
            try{
                if(team.year>y){
                    team.year=y;
                }
                else if(team.year<ly){
                    team.year=ly;
                }
                const teamdata = await axios.post(`${SERVER_URL}/teamadd`,
                    team,
                    {
                        headers:{"Content-Type" : "application/json"}
                    }
                );
                console.log('teamdata',teamdata);
                if(teamdata.status === 422 || !teamdata){
                    window.alert("Invalid Regsitration");
                    console.log("Invalid Regsitration");
                }
                else{
                    console.log('data');
                    console.log(teamdata);
                    console.log("Regsitration Successfull");
                    navigate('/team');
                }
            }catch(err){
                console.log('err',err);
            }
        }
    }

    const forms=[
        {
            'type':'text',
            'id':'firstname',
            'des':'First Name',
            'val':team.firstname
        },
        {
            'type':'text',
            'id':'lastname',
            'des':'Last Name',
            'val':team.lastname
        },
        {
            'type':'text',
            'id':'profession',
            'des':'Profession',
            'val':team.profession
        },
        {
            'type':'text',
            'id':'description',
            'des':'Description',
            'val':team.description
        },
        {
            'type':'text',
            'id':'username',
            'des':'Username',
            'val':team.username
        },
        {
            'type':'email',
            'id':'email',
            'des':'EMail',
            'val':team.email
        },
        {
            'type':'password',
            'id':'password',
            'des':'Password',
            'val':team.password
        },
        {
            'type':'password',
            'id':'cpassword',
            'des':'Confirm Password',
            'val':team.cpassword
        }
    ]
  return (
    <>
        {load===0?<Loading />:load===1?
        <div className='profile-update-container'>
            <div className='profile-update adjust'>
                <h3>Add Team Member</h3>
                <form method="POST" onSubmit={PostTeam} encType="multipart/form-data">
                    {
                        forms.map((f)=>{
                            return(
                                <div className="form-group my-3 row">
                                    <label for={f.id} className='col-sm-2 text-end'>{f.des} :</label>
                                    <div className='col-sm-10'>
                                        <input type={f.type} name={f.id} value={f.val} onChange={handleInputs} className="form-control" id={f.id} aria-describedby={f.id} placeholder={`Enter ${f.des}`} required/>
                                    </div>
                                </div>
                            )
                        })
                    }
                     <div className="form-group my-3 row">
                        <label for='photo' className='col-sm-2 text-end'>Upload Photo :</label>
                        <div className='col-sm-10'>
                            <input type='file' accept="image/*" name="photo" onChange={handlePhoto} className="form-control" id='photo' aria-describedby='photo' required/>
                        </div>
                    </div>
                    {(photo || team.photo) &&<div className="form-group my-3 row">
                        <div className=" col-8 col-md-3">
                            <img src={photo?photo:team.photo} alt={team.firstname} style={{width:"100%",objectFit:"contain"}}/>
                        </div>
                    </div>}
                    <div className="form-group form-check my-3">
                        <input type="checkbox" checked={team.isadmin} name="isadmin" onChange={handleCheck} className="form-check-input" id="admin" />
                        <label class="form-check-label" for="admin">Make Admin</label>
                    </div>
                    <div className="form-group form-check my-3">
                        <input type="checkbox" checked={team.ismember} name="ismember" onChange={handleCheck} className="form-check-input" id="member" />
                        <label class="form-check-label" for="member">Make Member</label>
                    </div>
                    <div className="form-group form-check my-3">
                        <input type="checkbox" checked={team.isalumni} name="isalumni" onChange={handleCheck} className="form-check-input" id="isalumni" />
                        <label class="form-check-label" for="isalumni">Make Alumni</label>
                    </div>
                    {
                        team.isalumni && 
                            <div className="form-group my-3 row">
                                <label for="year" className='col-sm-2 text-end'>Year of Alumni :</label>
                                <div className='col-sm-10'>
                                    <input type="text" name="year" value={team.year} onChange={handleInputs} className="form-control" id="year" aria-describedby="year" placeholder={`Enter Year of Alumni`} required/>
                                </div>
                            </div>
                    }
                    {/* <div className="form-group form-check my-3">
                        <input type="checkbox" checked={team.canCreateCompetitions} name="canCreateCompetitions" onChange={handleCheck} className="form-check-input" id="canCreateCompetitions" />
                        <label class="form-check-label" for="canCreateCompetitions">Can Create Competitions</label>
                    </div> */}
                    <button type="submit" name="submit" id="submit" className="btn btn-primary">
                        {
                        add?
                            <>
                            <span>Submitting </span> 
                            <i class="fa fa-spinner fa-spin"></i>
                            </>
                        :'Submit'}
                    </button>
                </form>
            </div>
        </div>
        :<Error />} 
    </>
  )
}

export default TeamAdd;