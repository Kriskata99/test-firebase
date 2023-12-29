import "./App.css";
import { useState, useEffect } from "react";
import Auth from "./components/auth";
import { db, auth, storage } from "./.config/firebase.ts";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

interface IMovie {
  id?: string;
  receivedAnOscar: boolean;
  releaseDate?: number;
  title?: string;
  userId?: string;
}

function App() {
  const [movieList, setMovieList] = useState<IMovie[]>([]);
  const [newMovie, setNewMovie] = useState<IMovie>({
    receivedAnOscar: false,
  });
  const [newTitle, setNewTitle] = useState<string>("");

  const [fileUploadState, setFileUploadState] = useState<File | null>(null);

  const getMovieList = async () => {
    try {
      const data = await getDocs(collection(db, "movies"));
      const filteredData: IMovie[] = data.docs.map((doc) => ({
        receivedAnOscar: doc.data().receivedAnOscar,
        releaseDate: doc.data().releaseDate,
        title: doc.data().title,
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(collection(db, "movies"), {
        ...newMovie,
        userId: auth?.currentUser?.uid ?? "",
      });
      await getMovieList();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMovie = async (id: string) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);
      await getMovieList();
    } catch (error) {
      console.log(error);
    }
  };

  const updateTitle = async (id: string) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await updateDoc(movieDoc, { title: newTitle });
      await getMovieList();
    } catch (error) {
      console.log(error);
    }
  };

  const uploadFile = async () => {
    try {
      if (!fileUploadState) return;

      const fileFolderRef = ref(
        storage,
        `projectFiles/${fileUploadState.name}`
      );

      await uploadBytes(fileFolderRef, fileUploadState);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="App">
        <Auth></Auth>

        <div>
          <input
            placeholder="Title..."
            onChange={(e) =>
              setNewMovie((newMovie) => ({
                ...newMovie,
                title: e.target.value,
              }))
            }
          ></input>
          <input
            placeholder="Release Date..."
            type="number"
            onChange={(e) =>
              setNewMovie((newMovie) => ({
                ...newMovie,
                releaseDate: Number(e.target.value),
              }))
            }
          ></input>
          <input
            placeholder="Received an Oscar..."
            type="checkbox"
            checked={newMovie?.receivedAnOscar}
            onChange={(e) =>
              setNewMovie((newMovie) => ({
                ...newMovie,
                receivedAnOscar: Boolean(e.target.value),
              }))
            }
          ></input>
          <label>Received an Oscar</label>
          <button onClick={onSubmitMovie}>Add Movie</button>
        </div>

        <div>
          {movieList.map((movie: IMovie) => (
            <div key={movie.id}>
              <h1>{movie.title}</h1>
              <h2>{movie.releaseDate}</h2>
              <h3>{`${movie.receivedAnOscar}`}</h3>
              <button onClick={() => deleteMovie(movie.id!)}>Delete</button>

              <input
                placeholder="New Title..."
                onChange={(e) => setNewTitle(e.target.value)}
              ></input>
              <button onClick={() => updateTitle(movie.id!)}>
                Update Title
              </button>
            </div>
          ))}
        </div>

        <div>
          <input
            type="file"
            onChange={(e) => setFileUploadState(e?.target?.files![0])}
          ></input>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      </div>
    </>
  );
}

export default App;
