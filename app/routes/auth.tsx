import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router";
import Aurora from "~/components/Aurora";

export const meta = () => ([
    { title: 'CVision | Auth' },
    { name: 'description', content: 'Log into your account' },
])

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])

    return (
        <main>

            <div className="absolute min-h-screen flex items-center justify-center inset-0 -z-0">

                <Aurora
                    colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                    blend={0.5}
                    amplitude={1.0}
                    speed={0.5}
                />
            </div>
            <div className="relative z-10 lg:mr-80 lg:ml-80 lg:mt-20 mr-10 ml-10 mt-40">

            <div className="shadow-lg">
                <section className="flex flex-col gap-8 bg-black rounded-2xl p-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Welcome</h1>
                        <h2 className="!text-black">Log In to Continue Your Job Journey</h2>
                    </div>
                    <div>
                        {isLoading ? (
                            <div className="flex flex-col items-center gap-2 text-center">
                            <button className="fancy-btn animate-pulse">
                                <p>Signing you in...</p>
                            </button>
                            </div>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    <div className="flex flex-col items-center gap-2 text-center">
                                    <button className="fancy-btn" onClick={auth.signOut}>
                                        <p>Log Out</p>
                                    </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-center">
                                    <button className="fancy-btn" onClick={auth.signIn}>
                                        <p>Log In</p>
                                    </button>
                                    </div>

                                )}

                            </>
                        )}
                    </div>
                </section>
            </div>
            </div>
        </main>
    )
}

export default Auth