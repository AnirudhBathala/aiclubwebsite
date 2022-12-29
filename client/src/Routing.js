import Home from './components/Home/Home';
import Team from './components/Team/Team';
import Projects from './components/Projects/Projects';
import { Route, Routes } from 'react-router-dom';
import TeamUpdate from './components/Team/TeamUpdate';
import TeamAdd from './components/Team/TeamAdd';
import Error from './components/Error';
import AddProject from './components/AddProject/AddProject';
import Events from './components/Events/Events';
import Blogs from './components/Blogs/Blogs';
import BlogDisplay from './components/Blogs/BlogDisplay';
import Compete from './components/Inductions/Compete';
import TextEditor from './components/Blogs/Editor/TextEditor'
import CreateCompetition from './components/CreateCompetition/CreateCompetition';
import ProjectDisplay from './components/Projects/ProjectDisplay';
import EditProject from './components/AddProject/EditProject';
import MyProjects from './components/Projects/myProjects';
import PreviewProject from './components/AddProject/PreviewProject';
import About from './components/About';


const Routing = () => {

    return(
      <Routes>
        {/* Home */}
        <Route exact path='/' element={<Home />} />
        
        {/* Team */}
        <Route exact path='/team' element={<Team />} />
        <Route exact path='/team/edit/:username' element={<TeamUpdate />} />
        <Route exact path='/team/add' element={<TeamAdd />} />

        {/* Projects */}
        <Route exact path='/projects' element={<Projects />} />
        <Route exact path='/addproject' element={<AddProject />} />
        <Route exact path='/myprojects' element={<MyProjects />} />
        <Route exact path='/projects/:url' element={<ProjectDisplay />} />
        <Route exact path='/projects/:url/edit' element={<EditProject />} />
        <Route exact path='/projects/:url/preview' element={<PreviewProject />} />

        {/* Events */}
        <Route exact path='/events' element={<Events />} />

        {/* Blogs */}
        <Route exact path='/blogs' element={<Blogs />} />

        {/* Blog Editor */}
        <Route exact path='/blogs/editor/add' element={<TextEditor />} />

        {/* Blog Display */}
        <Route exact path='/blogs/:url' element={<BlogDisplay />} />
        
        {/* Inductions */}
        {/* <Route exact path='/inductions-b21-b20' element={<Inductions />} /> */}
        {/* <Route exact path='/inductions-b21-b20/data' element={<Data />} /> */}
        {/* <Route exact path='/inductions-b21-b20/leaderboard' element={<Leaderboard />} /> */}
        {/* <Route exact path='/inductions-b21-b20/register' element={<Register />} /> */}
        <Route exact path='/create-competition' element={<CreateCompetition />} />
        <Route exact path='/competitions/:spath/:path' element={<Compete />} />
        <Route exact path='/competitions/:spath' element={<Compete />} />

        {/* About */}
        <Route exact path='/about' element={<About />} />

        {/* Others */}
        <Route path='*' element={<Error />} />
  
  
      </Routes>
    )
  }

export default Routing;