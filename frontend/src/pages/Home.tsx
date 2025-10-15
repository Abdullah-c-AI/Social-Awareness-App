import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Social Awareness
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect, share, and make a difference in your community
        </p>
        
        {!user ? (
          <div className="space-x-4">
            <a
              href="/register"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-medium border border-primary-600 hover:bg-primary-50 transition-colors"
            >
              Sign In
            </a>
          </div>
        ) : (
          <div className="space-x-4">
            <a
              href="/campaigns"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Browse Campaigns
            </a>
            <a
              href="/dashboard"
              className="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-medium border border-primary-600 hover:bg-primary-50 transition-colors"
            >
              My Dashboard
            </a>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 py-12">
        <div className="text-center">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Join Campaigns</h3>
          <p className="text-gray-600">
            Discover and participate in social awareness campaigns that matter to you.
          </p>
        </div>

        <div className="text-center">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Impact</h3>
          <p className="text-gray-600">
            Start your own campaigns and inspire others to join your cause.
          </p>
        </div>

        <div className="text-center">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
          <p className="text-gray-600">
            Monitor your campaign's impact with detailed analytics and insights.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-gray-600 mb-6">
          Join thousands of people who are already creating positive change in their communities.
        </p>
        {!user && (
          <a
            href="/register"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Start Your Journey
          </a>
        )}
      </div>
    </div>
  )
}

export default Home
