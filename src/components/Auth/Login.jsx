import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { login, authUser, setError } from "../../store/reducers/user";

import Toast from "../layout/Toast";
import Loading from "../layout/Loading";

const Login = () => {
    const [username, setUserName] = useState("");
    const [password, setPassWord] = useState("");

    const dispatch = useDispatch();
    const logged = useSelector((state) => state.user.logged);
    const auth = useSelector((state) => state.user.authLoading);

    var error = useSelector((state) => state.user.error);

    let navigate = useNavigate();

    useEffect(() => {
        dispatch(authUser());
    }, []);

    useEffect(() => {
        if (logged) {
            navigate("/");
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        var formLogin = { username, password };

        try {
            await dispatch(login(formLogin));

            if (logged) {
                navigate("/");
            }
        } catch (err) {
            console.log(err);
            localStorage.removeItem("token");
        }
    };

    if (error) {
        setTimeout(() => {
            dispatch(setError(""));
        }, 4000);
    }

    return (
        <div className="h-screen">
            {!auth && <Loading />}

            {error && (
                <Toast
                    error={error}
                    hiddenToast={() => dispatch(setError(""))}
                />
            )}
            <div className="w-full flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                <div className="max-w-md w-full space-y-8 shadow-md  rounded-lg  ">
                    <h1 className="text-center justify-center flex text-3xl  text-gray-500">
                        KMA SCHEDULER
                    </h1>
                    <form
                        onSubmit={handleLogin}
                        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                        onKeyDown={(e) => e.key === "Enter"}
                    >
                        <div className="mb-4">
                            <label
                                className="block text-gray-500 text-lg font-bold mb-2 "
                                htmlFor="username"
                            >
                                {"Tài Khoản"}
                            </label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                // value={username}
                                onChange={(e) =>
                                    setUserName(e.target.value.toUpperCase())
                                }
                                className="bg-gray-200 focus:bg-transparent focus:border-blue-700 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                            />
                        </div>
                        <div className="mb-6">
                            <label
                                className="block text-gray-500 text-lg font-bold mb-2"
                                htmlFor="username"
                            >
                                {"Mật Khẩu"}
                            </label>
                            <input
                                className="bg-gray-200 focus:bg-transparent focus:border-blue-400 appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                type="password"
                                name="password"
                                placeholder="Password"
                                // value={password}
                                onChange={(e) => setPassWord(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-center items-center">
                            {!auth ? (
                                <button
                                    type="button"
                                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    disabled
                                >
                                    Loading...
                                </button>
                            ) : (
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Login
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
