import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/ATS LOGO BLUE.svg';
import bill from '../../assets/IMG1.svg';
import api from '../../service/api';

const UnifiedLogin = ({ initialMode = "user" }) => {
  const [loginMode, setLoginMode] = useState(initialMode);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const containerRef = useRef(null);

  // Particle animation for background
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          duration: Math.random() * 10 + 10,
          delay: Math.random() * 5
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Check for existing login on component mount
  useEffect(() => {
    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
      navigate("/billing");
    }
    
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    // Set initial animation class
    setAnimationClass('opacity-0 translate-x-6');
    
    // Animate in after a short delay
    const timer = setTimeout(() => {
      setAnimationClass('opacity-100 translate-x-0');
    }, 50);
    
    return () => clearTimeout(timer);
  }, [loginMode]);

  const handleModeSwitch = (newMode) => {
    if (newMode !== loginMode) {
      // Animate out first
      setAnimationClass('opacity-0 -translate-x-6');
      
      // Then switch mode and animate in
      setTimeout(() => {
        setLoginMode(newMode);
        setError('');
        setAnimationClass('opacity-0 translate-x-6');
        
        setTimeout(() => {
          setAnimationClass('opacity-100 translate-x-0');
        }, 50);
      }, 300);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!phoneNumber || !password) {
      setError('Please enter both phone number and password.');
      setIsLoading(false);
      
      // Shake animation for empty fields
      if (formRef.current) {
        formRef.current.classList.add('animate-shake');
        setTimeout(() => {
          if (formRef.current) formRef.current.classList.remove('animate-shake');
        }, 500);
      }
      return;
    }

    try {
      if (loginMode === 'user') {
        // Cashier login logic
        const res = await api.get("/credentials/users");
        const usersData = res.data;

        const foundUser = usersData.find(
          (user) => user.contactNumber === phoneNumber && user.password === password
        );

        if (foundUser) {
          const userData = {
            cashierId: foundUser.cashierId,
            cashierName: foundUser.cashierName,
            counterNum: foundUser.counterNum,
            contactNumber: foundUser.contactNumber,
            role: foundUser.role,
            permissions: foundUser.permissions,
            rememberMe,
            loginTime: new Date().getTime()
          };

          localStorage.setItem('loggedInUser', JSON.stringify(userData));
          
          // Success animation before navigation
          if (containerRef.current) {
            containerRef.current.classList.add('animate-pulse');
            setTimeout(() => navigate("/billing"), 800);
          } else {
            navigate("/billing");
          }
        } else {
          setError("Invalid phone number or password");
        }
      } else {
        // Admin login logic
        const res = await api.get("/credentials/admin");
        const adminData = res.data;

        if (
          adminData.contactNumber === phoneNumber &&
          adminData.password === password
        ) {
          localStorage.setItem('adminData', JSON.stringify(adminData));
          
          // Success animation before navigation
          if (containerRef.current) {
            containerRef.current.classList.add('animate-pulse');
            setTimeout(() => navigate("/admin"), 800);
          } else {
            navigate("/admin");
          }
        } else {
          setError("Invalid phone number or password");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4 overflow-hidden relative"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-blue-400 to-blue-400 opacity-20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite`
            }}
          ></div>
        ))}
      </div>
      
      <div className="w-full max-w-6xl z-10">
        <div className="flex flex-col lg:flex-row w-full rounded-3xl overflow-hidden shadow-2xl bg-white min-h-[600px]">
          {/* Left side branding - consistent for both modes */}
          <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 p-12 relative overflow-hidden">
            {/* Animated shapes in background */}
            <div className="absolute inset-0">
              <div className="absolute -top-16 -left-16 w-60 h-60 rounded-full bg-white opacity-10 animate-pulse-slow"></div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white opacity-10 animate-bounce-slow"></div>
              <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-white opacity-5 animate-ping-slow"></div>
            </div>
            
            <div className="relative z-10 max-w-md text-white text-center">
              <div className="flex justify-center items-center h-full">
                <div className="relative flex flex-col items-center">
                  {/* Animated logo */}
                  <div className="relative mb-8 animate-bounce-slow">
                    <div className="absolute -inset-4 bg-white rounded-full opacity-20 animate-pulse"></div>
                    <div
                      className="relative flex items-center justify-center"
                      style={{
                        clipPath: 'polygon(50% 5%, 95% 25%, 95% 75%, 50% 95%, 5% 75%, 5% 25%)',
                        border: '2px solid #fff',
                        backgroundColor: '#fff',
                        width: '80px',
                        height: '85px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                      }}
                    >
                      <img src={logo} alt="ATS Logo" className="h-10 w-10" />
                    </div>
                  </div>
                  
                  <img src={bill} alt="Billing Illustration" className="w-[85%] max-w-sm transform hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
              <h1 className="text-5xl text-start font-bold leading-tight mt-8 pl-8 animate-fade-in">Welcome</h1>
              <p className="text-2xl text-start font-light mb-8 pl-8 animate-fade-in-delay">to your billing companion</p>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20 shadow-inner transform hover:scale-102 transition-transform duration-500">
                <p className="text-xl font-semibold mb-2">We handle the numbers,</p>
                <p className="text-sm opacity-80">so you can focus on what truly matters - your customers.</p>
              </div>
            </div>
          </div>

          {/* Right side - Login Form with animated transition */}
          <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
            <div className="w-full max-w-md">
              {/* Company header */}
              <div className="flex items-center justify-center lg:justify-start mb-8 animate-fade-in">
                <div className="relative">
                  <div className="absolute -inset-2 bg-blue-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img src={logo} alt="Company Logo" className="h-14 w-14 relative transform  transition-transform duration-500" />
                </div>
                <div className="ml-4">
                  <div className="relative">
                    <h2 className="text-xl font-bold text-gray-800">
                      {loginMode === 'user' ? 'A D V E N T U R E' : 'A D V E N T U R E'}
                    </h2>
                    {loginMode === 'admin' && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                    )}
                     {loginMode === 'user' && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {loginMode === 'user' ? 'Smart Invoice Pro' : 'Smart Invoice Pro'}
                  </p>
                </div>
              </div>
              
              {/* Mode switcher tabs */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-8 shadow-inner animate-fade-in">
                <button 
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-500 flex items-center justify-center gap-2 ${
                    loginMode === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => handleModeSwitch('user')}
                >
                  <span>👨‍💼</span>
                  <span>Cashier Login</span>
                </button>
                <button 
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-500 flex items-center justify-center gap-2 ${
                    loginMode === 'admin' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => handleModeSwitch('admin')}
                >
                  <span>🔧</span>
                  <span>Admin Login</span>
                </button>
              </div>

              {/* Animated form content */}
              <div ref={formRef} className={`transition-all duration-500 ease-out ${animationClass}`}>
                {/* Heading */}
                <div className="mb-8 text-center lg:text-left animate-fade-in">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Sign in to your {loginMode === 'user' ? 'counter' : 'account'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {loginMode === 'user' 
                      ? 'Bill customer purchases at your counter.' 
                      : 'Start managing your invoices efficiently.'
                    }
                  </p>
                </div>

                {/* Error message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200 flex items-start animate-fade-in" role="alert">
                    <div className="flex-shrink-0 animate-pulse">
                      <span className="text-red-500 text-lg">⚠️</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-semibold text-red-800">Authentication failed:</h3>
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                  </div>
                )}

                {/* Login form - same for both modes but different endpoints */}
                <form className="space-y-6 animate-fade-in" onSubmit={handleSubmit}>
                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phoneNumber" className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <span className="mr-2">📱</span>
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        placeholder="Enter your phone number"
                        className="block w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">📞</span>
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <span className="mr-2">🔒</span>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="block w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform duration-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <span className="text-gray-500">👁️</span>
                        ) : (
                          <span className="text-gray-500">👁️‍🗨️</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center">
                    <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                          className="sr-only"
                        />
                        <div className={`h-5 w-5 rounded border border-gray-300 flex items-center justify-center transition-all duration-300 ${rememberMe ? 'bg-blue-500 border-blue-500' : 'bg-white'}`}>
                          {rememberMe && (
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="ml-2">Remember me</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center items-center gap-3 py-4 px-6 text-white text-base font-medium bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 rounded-xl shadow-lg transition-all duration-500 transform hover:scale-105 hover:shadow-xl ${
                      isLoading ? 'opacity-80 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Decorative elements */}
                <div className="flex justify-center space-x-2 mt-8">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.15;
            transform: scale(1.05);
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.05;
          }
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 8s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};

export default UnifiedLogin;