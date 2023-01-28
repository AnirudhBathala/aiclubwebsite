import React, { useContext, useEffect, useState } from "react";
import "./AddProject.css";
import { Context } from "../../Context/Context";
import { alertContext } from "../../Context/Alert";
import { useNavigate } from "react-router-dom";
import { CLIENT_URL, SERVER_URL } from "../../EditableStuff/Config";
import axios from "axios";
import Error from "../Error";
import Loading from "../Loading";
import { Helmet } from "react-helmet";

const AddProject = () => {
  const navigate = useNavigate();
  const { user, logged_in } = useContext(Context);
  const { showAlert } = useContext(alertContext);
  const [add, setAdd] = useState("Create");
  const [add2, setAdd2] = useState();
  const [xauthor, setXAuthor] = useState("");
  const [load, setLoad] = useState(0);
  let project = {
    title: "",
    url: "",
    creator: user ? user.username : "",
    authors: [user ? user.username : ""],
    content: "",
    cover: "",
  };
  const [proj, setProj] = useState({});
  const [teams, setTeams] = useState([]);
  let team = [];
  const getTeams = () => {
    if (logged_in === 1) {
      try {
        axios.get(`${SERVER_URL}/getTeams`).then((data) => {
          team = data.data;
          if (user) {
            team = team.filter((t) => t !== user.username);
            setProj(project);
            setTeams(team);
            setLoad(1);
          } else {
            setLoad(-1);
          }
        });
      } catch (err) {
        console.log(err);
      }
    } else if (logged_in === -1) {
      setLoad(-1);
    }
  };
  useEffect(() => {
    getTeams();
  }, [logged_in]);

  const handlePhoto = (e) => {
    setProj({ ...proj, ["cover"]: e.target.files[0] });
  };

  const handleInputs = (e) => {
    setProj({ ...proj, [e.target.name]: e.target.value });
  };
  const removeXAuthor = (author) => {
    let current = proj.authors;
    current = current.filter((x) => x !== author);
    setProj({ ...proj, ["authors"]: current });
    teams.push(author);
    setTeams(teams);
    setXAuthor("");
  };
  const AddXAuthor = () => {
    if (xauthor != "") {
      team = teams.filter((t) => t !== xauthor);
      setTeams(team);
      let current = proj.authors;
      current.push(xauthor);
      setProj({ ...proj, ["authors"]: current });
      setXAuthor("");
    }
  };
  const PostProject = async (e) => {
    e.preventDefault();
    setAdd("Creating ");
    setAdd2(<i class="fa fa-spinner fa-spin"></i>);
    const photo = proj.cover;
    const data = new FormData();
    const photoname = Date.now() + photo.name;
    data.append("name", photoname);
    data.append("photo", photo);
    var imgurl;

    try {
      const img = await axios.post(`${SERVER_URL}/imgupload`, data);
      console.log("img", img);
      imgurl = img.data;
      proj.cover = imgurl;
    } catch (err) {
      console.log("photoerr", err);
    }
    console.log("imgurl", imgurl);

    try {
      const projdata = await axios.post(`${SERVER_URL}/projectAdd`, proj, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("projdata", projdata);
      if (projdata.status === 422 || !projdata) {
        showAlert("Project Posting failed", "danger");
      } else {
        showAlert("Project Created Successfull", "success");
        navigate(`/projects/${proj.url}/edit`);
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  console.log("proj", proj);
  return (
    <>
      {load === 0 ? (
        <Loading />
      ) : load === 1 && user ? (
        <div className="container addproject-container text-center">
          <Helmet>
            <title>Project - AI Club</title>
          </Helmet>
          <div className="adjust">
            <h3>Add Project</h3>
            <form
              method="POST"
              onSubmit={PostProject}
              encType="multipart/form-data"
            >
              <div className="form-group my-3 row">
                <label for="title" className="col-sm-2 text-end">
                  Project Title :
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    name="title"
                    value={proj.title}
                    onChange={handleInputs}
                    className="form-control"
                    id="title"
                    aria-describedby="title"
                    placeholder="Enter Project Title"
                    required
                  />
                </div>
              </div>
              <div className="form-group my-3 row">
                <label for="url" className="col-sm-2 text-end">
                  Project Url :
                </label>
                <div className="col-sm-10">
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text text-end"
                        id="basic-addon3"
                      >
                        {CLIENT_URL}/projects/
                      </span>
                    </div>
                    <input
                      type="text"
                      name="url"
                      value={proj.url}
                      onChange={handleInputs}
                      className="form-control"
                      id="basic-url"
                      aria-describedby="basic-addon3"
                      placeholder="Enter Project Url"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="form-group my-3 row">
                <label for="url" className="col-sm-2 text-end">
                  Authors :
                </label>
                <div className="col-sm-10">
                  {proj.authors.map((a) => {
                    return (
                      <div className="form-group my-2 row">
                        <div className="col col-9">
                          <input
                            type="text"
                            value={a}
                            className="form-control"
                            id="author"
                            aria-describedby="title"
                            disabled
                          />
                        </div>
                        <div className="col col-3">
                          {user.username !== a && (
                            <input
                              type="reset"
                              className="btn btn-danger"
                              onClick={() => removeXAuthor(a)}
                              value="Remove"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="form-group my-2 row">
                    <div className="col col-9">
                      <select
                        name="xauthor"
                        value={xauthor}
                        onChange={(e) => setXAuthor(e.target.value)}
                        className="form-select"
                        aria-label="authors"
                      >
                        <option value="">Select Author</option>
                        {teams.map((t) => {
                          return <option value={t}>{t}</option>;
                        })}
                      </select>
                    </div>
                    <div className="col col-3">
                      <input
                        type="reset"
                        className="btn btn-success"
                        onClick={AddXAuthor}
                        value="+Add"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group my-3 row">
                <label for="photo" className="col-sm-2 text-end">
                  Project Cover Photo :
                </label>
                <div className="col-sm-10">
                  <input
                    type="file"
                    accept="image/*"
                    name="photo"
                    onChange={handlePhoto}
                    className="form-control"
                    id="photo"
                    aria-describedby="photo"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                name="submit"
                id="submit"
                className="btn btn-primary"
              >
                {add}
                {add2}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </>
  );
};

export default AddProject;
