import { AiOutlinePlus } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { GoSignOut } from "react-icons/go";
import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  where,
  query,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { data } from "autoprefixer";
import { Player } from "@lottiefiles/react-lottie-player";

const Home = () => {
  const [todoInput, setTodoInput] = useState("");
  const [todos, setTodos] = useState([]);
  const { authUser, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.push("/login");
    }
    if (!!authUser) {
      fetchTodos(authUser.uid);
    }
  }, [authUser]);

  const addTodo = async () => {
    if (todoInput !== "") {
      try {
        const docRef = await addDoc(collection(db, "todos"), {
          owner: authUser.uid,
          content: todoInput,
          completed: false,
        });
        console.log("Document written with ID: ", docRef.id);
        fetchTodos(authUser.uid);
      } catch (error) {
        console.error("An Error Occured", error);
      }
    }
  };

  const deleteTodo = async (docId) => {
    try {
      await deleteDoc(doc(db, "todos", docId));
      fetchTodos(authUser.uid);
    } catch (error) {
      console.error("An Error Occured", error);
    }
  };

  const fetchTodos = async (uid) => {
    try {
      const q = query(collection(db, "todos"), where("owner", "==", uid));

      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        data.push({ ...doc.data(), id: doc.id });
      });
      setTodos(data);
      setTodoInput("");
    } catch (error) {
      console.error("An Error Occured", error);
    }
  };

  const markAsCompleted = async (event, docId) => {
    try {
      const docRef = doc(db, "todos", docId);
      await updateDoc(docRef, {
        completed: event.target.checked,
      });
      fetchTodos(authUser.uid);
    } catch (error) {
      console.error("An Error Occured", error);
    }
  };

  const onKeyUp = (e) => {
    if (e.key === "Enter" && todoInput.length > 0) {
      addTodo();
    }
  };

  return (
    <main className="">
      <div
        className="bg-black text-white w-44 py-4 mt-10 rounded-lg transition-transform hover:bg-black/[0.8] active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer"
        onClick={signOut}
      >
        <GoSignOut size={18} />
        <span>Logout</span>
      </div>
      <div className="max-w-3xl mx-auto mt-5 p-8">
        <Player
          src="https://assets2.lottiefiles.com/packages/lf20_yfsmbm0r.json"
          className="player"
          style={{ height: "200px", width: "200px" }}
          autoplay
          loop
          speed={0.5}
        />
        <div className="bg-white m-6 p-3 sticky top-0">
          <div className="flex justify-center flex-col items-center">
            {/* <span className="text-7xl mb-10">📝</span> */}

            <h1 className="text-5xl md:text-7xl font-bold text-[#00ed64]">
              ToDo's App
            </h1>
            <p className="italic pt-2">Made with ❤️ by Devesh</p>
          </div>
          <div className="flex items-center gap-2 mt-10">
            <input
              placeholder={`👋 Hello ${authUser}, What to do Today?`}
              type="text"
              className="font-semibold placeholder:text-gray-500 border-[2px] border-black h-[60px] grow shadow-sm rounded-md px-4 focus-visible:outline-purple-400 text-lg transition-all duration-300"
              autoFocus
              onChange={(e) => setTodoInput(e.target.value)}
              value={todoInput}
              onKeyUp={onKeyUp}
            />
            <button
              className="w-[60px] h-[60px] rounded-md bg-[#00ed64] flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-black/[0.8]"
              onClick={addTodo}
            >
              <AiOutlinePlus size={30} color="#fff" />
            </button>
          </div>
        </div>
        <div className="my-10">
          {todos.map((todo, id) => (
            <div
              key={todo.id}
              className="flex items-center justify-between mt-4"
            >
              <div className="flex items-center gap-3">
                <input
                  id={`todo-${todo.id}`}
                  type="checkbox"
                  className="w-4 h-4 accent-green-400"
                  checked={todo.completed}
                  onChange={(e) => markAsCompleted(e, todo.id)}
                />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={`font-medium  ${
                    todo.completed ? "line-through" : ""
                  }`}
                >
                  {todo.content}
                </label>
              </div>

              <div className="flex items-center gap-3">
                <AiFillDelete
                  size={24}
                  className="text-red-400 hover:text-red-600 cursor-pointer"
                  onClick={() => deleteTodo(todo.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;
