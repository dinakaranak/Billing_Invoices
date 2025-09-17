import { useState, useEffect } from 'react';
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
  const navigate = useNavigate();

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
          navigate("/billing");
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
          navigate("/admin");
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-6 overflow-hidden">
      <div className="flex w-full max-w-5xl rounded-2xl overflow-hidden shadow-xl bg-white min-h-[550px]">
        {/* Left side branding - consistent for both modes */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 p-12 relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute -top-16 -left-16 w-60 h-60 rounded-full bg-white opacity-5"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white opacity-5"></div>
          </div>
          <div className="relative z-10 max-w-md text-white text-center">
            <div className="flex justify-center items-center h-full">
              <div className="relative flex flex-col items-center">
                <div
                  className="absolute -top-1 -left-0 transform -translate-y-1/2"
                  style={{
                    clipPath: 'polygon(50% 5%, 95% 25%, 95% 75%, 50% 95%, 5% 75%, 5% 25%)',
                    border: '2px solid #fff',
                    backgroundColor: '#fff',
                    width: '60px',
                    height: '65px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                >
                  <img src={logo} alt="ATS Logo" className="h-8 w-8" />
                </div>
                <img src={bill} alt="Billing Illustration" className="w-[85%] max-w-sm " />
              </div>
            </div>
            <h1 className="text-4xl text-start font-semibold leading-tight pl-8">Welcome</h1>
            <p className="text-2xl text-start font-light mb-8 pl-8">to your billing companion</p>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 shadow-inner">
              <p className="text-lg font-semibold mb-2">We handle the numbers,</p>
              <p className="text-sm opacity-80">so you can focus on what truly matters - your customers.</p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form with animated transition */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            {/* Company header */}
            <div className="flex items-center justify-center lg:justify-start mb-8">
              <img src={logo} alt="Company Logo" className="h-12 w-12" />
              <div className="ml-3">
                <div className="relative">
                  <h2 className="text-base font-bold text-gray-800">
                    {loginMode === 'user' ? 'Billing Software' : 'A D V E N T U R E'}
                  </h2>
                  {loginMode === 'admin' && (
                    <div className="absolute bottom-0 left-0 w-full h-px bg-black"></div>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {loginMode === 'user' ? 'Counter Login Portal' : 'Smart Invoice Pro'}
                </p>
              </div>
            </div>
            
            {/* Mode switcher tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button 
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  loginMode === 'user' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleModeSwitch('user')}
              >
                Cashier Login
              </button>
              <button 
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  loginMode === 'admin' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleModeSwitch('admin')}
              >
                Admin Login
              </button>
            </div>

            {/* Animated form content */}
            <div className={`transition-all duration-300 ease-in-out ${animationClass}`}>
              {/* Heading */}
              <div className="mb-6 text-center lg:text-left">
                <h1 className="text-xl font-semibold text-gray-800 mb-1">
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
                <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200 flex items-start" role="alert">
                  <svg className="h-5 w-5 text-red-500 mt-0.5 mr-3" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-semibold text-red-800">Authentication failed:</h3>
                    <p className="text-xs text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Login form - same for both modes but different endpoints */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    placeholder="Enter your phone number"
                    className="block w-full pl-3 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center gap-x-2 py-3 px-4 text-white text-base font-medium bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg shadow-sm transition-all duration-200 ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-md'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <span className="text-white">
                        <i className="bi bi-box-arrow-in-right"></i>
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;