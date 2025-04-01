fetch('http://localhost:3001/users').then((res) => {
    console.log(res)
})

export function App() {
    return <h1 className="text-3xl font-bold underline">Hello world!</h1>;
}

