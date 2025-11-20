import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-screen bg-gray-50">

            {/* HERO SECTION */}
            <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-10 lg:px-28 py-20">

                {/* LEFT CONTENT */}
                <div className="max-w-xl mt-10 lg:mt-0">
                    <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                        Connect. Chat.  
                        <span className="text-indigo-600"> Instantly.</span>
                    </h1>

                    <p className="text-gray-600 mt-5 text-lg">
                        Experience lightning-fast real-time messaging powered by  
                        microservices architecture — Django, Node, Socket.IO & React.
                    </p>

                    <div className="mt-8 flex gap-4">
                        <button 
                            onClick={() => navigate("/chat")}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg hover:bg-indigo-700 transition"
                        >
                            Start Chatting
                        </button>
                    </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="w-full lg:w-[50%] flex justify-center">
                    <img
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000"
                        alt="Chat Illustration"
                        className="w-[90%] lg:w-[80%] rounded-3xl shadow-lg"
                    />
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="px-10 lg:px-28 py-20 bg-white">
                <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 text-center">
                    Why Choose Our Chat App?
                </h2>

                <div className="grid md:grid-cols-3 gap-10 mt-14">

                    {/* Card 1 */}
                    <div className="bg-gray-100 rounded-2xl p-8 shadow hover:shadow-lg transition">
                        <img 
                            src="https://images.unsplash.com/photo-1604147706283-d7111f98d9e9?q=80&w=800"
                            alt="Real-time"
                            className="rounded-xl mb-5 h-40 w-full object-cover"
                        />
                        <h3 className="text-xl font-semibold text-gray-800">Real-time Messaging</h3>
                        <p className="text-gray-600 mt-2">
                            Powered by Node + Socket.IO for instant message delivery.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-gray-100 rounded-2xl p-8 shadow hover:shadow-lg transition">
                        <img 
                            src="https://images.unsplash.com/photo-1633265885680-626fdecf54af?q=80&w=800"
                            alt="Secure"
                            className="rounded-xl mb-5 h-40 w-full object-cover"
                        />
                        <h3 className="text-xl font-semibold text-gray-800">Secure Authentication</h3>
                        <p className="text-gray-600 mt-2">
                            Django + JWT ensures high-level data protection & security.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-gray-100 rounded-2xl p-8 shadow hover:shadow-lg transition">
                        <img 
                            src="https://images.unsplash.com/photo-1508385082359-f38ae991e8f2?q=80&w=800"
                            alt="Microservice"
                            className="rounded-xl mb-5 h-40 w-full object-cover"
                        />
                        <h3 className="text-xl font-semibold text-gray-800">Microservice Architecture</h3>
                        <p className="text-gray-600 mt-2">
                            Services split into Django Auth, Node Chat, React Client.
                        </p>
                    </div>

                </div>
            </section>

        </div>
    );
};

export default Home;
