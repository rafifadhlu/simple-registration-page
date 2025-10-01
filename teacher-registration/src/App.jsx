import { useState } from 'react'
import reactLogo from './assets/react.svg'
import logo from './assets/logo-fix.png';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // console.log(import.meta.env.VITE_API_BASE_URL);
      const response = await fetch('/api/v1/auth/teacher/register/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData),
            });


      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful!');
        // Reset form
        setFormData({
          username: '',
          email: '',
          first_name: '',
          last_name: '',
          password: ''
        });
        
      } else {
        setMessage(`Error: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="navbar bg-white shadow-sm">
        <div className="navbar-start">
          <img src={logo} alt="" width={50} />
          <div>
            <p className='text-blue-950 font-semibold'>Brain Boost</p>
          </div>
        </div>
        <div className="navbar-end">
          <p className="text-blue-950 text-sm">Teacher Registration</p>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="card w-full max-w-md bg-white shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold text-center text-blue-950 mb-6">
              Teacher Registration
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Username</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="input input-bordered border-1 border-black bg-white text-black placeholder-gray-400 w-full"
                  required
                />
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="input input-bordered border-1 border-black bg-white text-black placeholder-gray-400 w-full"
                  required
                />
              </div>

              {/* First Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">First Name</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="input input-bordered border-1 border-black bg-white text-black placeholder-gray-400 w-full"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Last Name</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="input input-bordered border-1 border-black bg-white text-black placeholder-gray-400 w-full"
                  required
                />
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="input input-bordered border-1 border-black bg-white text-black placeholder-gray-400 w-full"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>

              {/* Message */}
              {message && (
                <div className="flex items-center justify-center mt-4">
                  <div className={`alert ${message.includes('successful') ? 'alert-success text-center' : 'alert-error'}`}>
                    <span>{message}</span>
                  </div>
                </div>
              )}

            </form>

            <div className="divider">OR</div>

          </div>
        </div>
      </div>
    </>
  )
}

export default App