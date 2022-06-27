import React, { useState, useCallback } from "react";
import axios from "axios";
import thumbdown from "./img/thumbdown.svg";
import thumbup from "./img/thumbup.svg";

const App = () => {
  const handleDataFetch = useCallback(() => {
    axios
      .get("http://localhost:4000/uploads")
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [items, setItems] = useState([]);

  return (
    <div className="w-screen h-screen">
      <h1 className="font-mono text-3xl m-2">
        Udon: Jupyter Script Repository
      </h1>
      <div className="m-2">
        <button
          onClick={handleDataFetch}
          className="h-12 w-36 uppercase font-mono font-semibold tracking-wider border-4 border-black bg-yellow-300"
        >
          Grab Data
        </button>
      </div>
      <div className="flex m-2 gap-2 flex-wrap items-center justify-center">
        {items.map((item) => (
          <div className="flex w-[26rem] h-[8rem] flex-none border-4 border-black mb-4">
            <div className="flex flex-col justify-center items-center flex-none w-16 px-4 text-2xl bg-yellow-300">
              <button>
                <img src={thumbup} alt="thumbup" className="w-4 mb-2" />
              </button>
              {item.score}
              <button>
                <img src={thumbdown} alt="thumbdown" className="w-4 mt-2" />
              </button>
            </div>
            <div className="flex flex-col flex-1 relative">
              <h2 className="bg-slate-300 p-2 uppercase font-normal tracking-wider">
                {item.title}
              </h2>
              <p className="text-xs flex-1 p-2">
                {item.description.substring(0, 124)}...
              </p>
              <button className="absolute right-1 bottom-[-1rem] text-sm border-4 border-black bg-yellow-300 flex-none w-fit h-fit px-2 py-1 uppercase font-mono">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
