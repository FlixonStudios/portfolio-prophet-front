import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Website from './components/website/Website'
import Main from './components/Main'
import { useEffect, useState } from 'react'
import { checkAuth } from '../src/lib/checkAuth'

function App() {
    let [auth, setAuth] = useState(false)
    let [loading, setLoading] = useState(true)

    useEffect(() => {
        let authValue = async () => {
            let a = await checkAuth()
            setAuth(a)
            setLoading(false)
        }
        authValue()
    }, [])

    return (
        <BrowserRouter>
            <Switch>
                <PrivateRouter path="/main" loading={loading} auth={auth}>
                    <Main setAuth={setAuth} auth={auth} />
                </PrivateRouter>
                <Route path="/">
                    <Website setAuth={setAuth} />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

function PrivateRouter({ auth, loading, children, path, location, ...rest }) {
    if (loading) {
        return <div>Loading</div>
    }
    return (
        <>
            {auth ? (
                <Route path={path} auth={auth} {...rest}>
                    {children}
                </Route>
            ) : (
                <Redirect
                    to={{
                        pathname: '/login',
                        state: { from: location },
                    }}
                />
            )}
        </>
    )
}

export default App
