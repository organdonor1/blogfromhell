import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";
import { useState } from "react";

const posts = [
    { id: "1", title: "My First Post", content: "This is the content of my first post." },
    { id: "2", title: "Another Blog Post", content: "Here is some more content for another post." },
    { id: "3", title: "Yet Another Post", content: "Blogging is fun!" }
];

function Home() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">My Blog</h1>
            <ul className="mt-4">
                {posts.map(post => (
                    <li key={post.id} className="mt-2">
                        <Link to={`/post/${post.id}`} className="text-blue-500 hover:underline">
                            {post.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Post() {
    let { id } = useParams();
    const post = posts.find(p => p.id === id);

    if (!post) {
        return <h2 className="text-red-500">Post not found</h2>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <p className="mt-2">{post.content}</p>
            <Link to="/" className="text-blue-500 mt-4 block">Back to Home</Link>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/post/:id" element={<Post />} />
            </Routes>
        </Router>
    );
}

export default App;











// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
