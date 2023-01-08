import React, { useContext, useState, useEffect } from "react";
import "./AddBlog.css";
import { Context } from "../../../Context/Context";
import { useNavigate } from "react-router-dom";
import Error from "../../Error";
import { CLIENT_URL, SERVER_URL } from "../../../EditableStuff/Config";
import axios from "axios";

const AddBlog = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [add, setAdd] = useState("Create");
  const [add2, setAdd2] = useState();
  const [xtag, setXtag] = useState("");
  const [post, setPost] = useState({
    'title': "",
    'url': "",
    'tags': [],
    'content': "",
    'authorName': user.username,
    'authorAvatar': user.photo,
    'cover': "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/blogs");
    }
  }, [user]);

  const handlePhoto = (e) => {
    setPost({ ...post, ["cover"]: e.target.files[0] });
  };

  const handleInputs = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
    console.log("post", post);
  };

  const removeXtag = (tag) => {
    let current = post.tags;
    current = current.filter((x) => x !== tag);
    setPost({ ...post, ["tags"]: current });
    setXtag("");
  };

  const AddXtag = () => {
    let current = post.tags;
    current.push(xtag);
    setPost({ ...post, ["tags"]: current });
    setXtag("");
  };

  const PostBlog = async (e) => {
    e.preventDefault();
    setAdd("Creating ");
    setAdd2(<i className="fa fa-spinner fa-spin"></i>);
    const data = new FormData();
    const photoname = Date.now() + post.cover.name;
    data.append("name", photoname);
    data.append("photo", post.cover);
    var imgurl;

    try {
      const img = await axios.post(`${SERVER_URL}/imgupload`, data);
      imgurl = img.data;
      post.cover = imgurl;
      console.log("final post", post);
    } catch (err) {
      console.log("photoerr", err);
    }
    try {
      const blogdata = await axios.post(`${SERVER_URL}/blogadd`, post, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("blogdata", blogdata);
      if (blogdata.status === 422 || !blogdata) {
        window.alert("Posting failed");
        console.log("Posting failed");
      } else {
        console.log("data");
        console.log(blogdata);
        console.log("Posting Successfull");
        navigate(`/blogs/${post.url}/edit`);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <>
      {user ? (
        <div className="container addBlog-container text-center">
          <div className="adjust">
            <h3>Add Blog</h3>
            <form
              method="POST"
              onSubmit={PostBlog}
              encType="multipart/form-data"
            >
              <div className="form-group my-3 row">
                <label htmlFor="title" className="col-sm-2 text-end">
                  Blog Title :
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    name="title"
                    value={post.title}
                    onChange={handleInputs}
                    className="form-control"
                    id="title"
                    aria-describedby="title"
                    placeholder="Enter Blog Title"
                    required
                  />
                </div>
              </div>
              <div className="form-group my-3 row">
                <label htmlFor="url" className="col-sm-2 text-end">
                  Blog Url :
                </label>
                <div className="col-sm-10">
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text text-end"
                        id="basic-addon3"
                      >
                        {CLIENT_URL}/blogs/{post.url}
                      </span>
                    </div>
                    <input
                      type="text"
                      name="url"
                      value={post.url}
                      onChange={handleInputs}
                      className="form-control"
                      id="basic-url"
                      aria-describedby="basic-addon3"
                      placeholder="Enter Blog Url"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="form-group my-3 row">
                <label className="col-sm-2 text-end">Tags :</label>
                <div className="col-sm-10">
                  {post.tags.map((a) => {
                    return (
                      <div className="form-group my-2 row">
                        <div className="col col-9">
                          <input
                            type="text"
                            value={a}
                            className="form-control"
                            id="tag"
                            aria-describedby="title"
                            disabled
                          />
                        </div>
                        <div className="col col-3">
                          <input
                            type="reset"
                            className="btn btn-danger"
                            onClick={() => removeXtag(a)}
                            value="Remove"
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div className="form-group my-2 row">
                    <div className="col col-9">
                      <input
                        type="text"
                        name="xtag"
                        value={xtag}
                        onChange={(e) => setXtag(e.target.value)}
                        className="form-control"
                        id="tags"
                        aria-describedby="tags"
                        placeholder="Enter tags"
                      />
                    </div>
                    <div className="col col-3">
                      <input
                        type="reset"
                        className="btn btn-success"
                        onClick={AddXtag}
                        value="+Add"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group my-3 row">
                <label for="photo" className="col-sm-2 text-end">
                  Blog Cover Photo :
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

export default AddBlog;