import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Target, TrendingUp, Users, Bot, Trophy, Activity, Heart, Star } from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FitTracker Pro</span>
          </div>
          <SignInButton mode="modal">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Get Started
            </Button>
          </SignInButton>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary">
            AI-Powered Fitness Companion
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {" "}Fitness Journey
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track workouts, monitor nutrition, get AI-powered coaching, and compete with friends.
            Your complete fitness ecosystem in one beautiful app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
            >
              Start Your Journey
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 px-8 py-3 text-lg"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive fitness platform combines cutting-edge AI technology with proven fitness science to help you achieve your goals faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bot className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Personal Coach</h3>
                <p className="text-gray-600">
                  Get personalized workout plans and nutrition advice from our advanced AI coach, available 24/7 to answer your questions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Progress Tracking</h3>
                <p className="text-gray-600">
                  Monitor your fitness journey with detailed analytics, progress charts, and achievement tracking to stay motivated.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Social Features</h3>
                <p className="text-gray-600">
                  Connect with friends, join challenges, and compete on leaderboards to make fitness fun and engaging.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Goal Setting</h3>
                <p className="text-gray-600">
                  Set personalized fitness goals and track your daily progress with intelligent recommendations and reminders.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Nutrition Tracking</h3>
                <p className="text-gray-600">
                  Log your meals, track macros, and get personalized nutrition insights to fuel your workouts effectively.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Workout Library</h3>
                <p className="text-gray-600">
                  Access hundreds of exercises with detailed instructions, video demonstrations, and difficulty progressions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About FitTracker Pro
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded by fitness enthusiasts and technology experts, FitTracker Pro was born from the belief that everyone deserves access to personalized, intelligent fitness guidance.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our mission is to democratize fitness coaching by combining the latest AI technology with proven fitness science, making professional-grade fitness guidance accessible to everyone, everywhere.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                  <div className="text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50M+</div>
                  <div className="text-gray-600">Workouts Completed</div>
                </div>
              </div>
            </div>
            <div className="lg:pl-12">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Why Choose Us?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">AI-Powered Personalization</h4>
                      <p className="text-gray-600">Advanced algorithms create truly personalized experiences</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Science-Based Approach</h4>
                      <p className="text-gray-600">All recommendations backed by exercise science research</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Community Support</h4>
                      <p className="text-gray-600">Join a supportive community of fitness enthusiasts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied users who've transformed their fitness journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "The AI coach is incredible! It's like having a personal trainer who knows exactly what I need. I've made more progress in 3 months than I did in 2 years on my own."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    SM
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">Sarah M.</div>
                    <div className="text-gray-600 text-sm">Fitness Enthusiast</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "Love the social features! Competing with friends makes working out so much more fun. The progress tracking keeps me motivated every single day."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                    JD
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">John D.</div>
                    <div className="text-gray-600 text-sm">Marathon Runner</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "As a beginner, I was intimidated by fitness apps. FitTracker Pro made everything simple and encouraging. The nutrition tracking changed my relationship with food."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    EK
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">Emily K.</div>
                    <div className="text-gray-600 text-sm">Beginner</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users who've already started their transformation with FitTracker Pro
          </p>
          <Button
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
          >
            Get Started Free Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">FitTracker Pro</span>
              </div>
              <p className="text-gray-400">
                Your AI-powered fitness companion for a healthier, stronger you.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>AI Personal Coach</li>
                <li>Workout Tracking</li>
                <li>Nutrition Logging</li>
                <li>Progress Analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Friends & Social</li>
                <li>Challenges</li>
                <li>Leaderboards</li>
                <li>Support Forum</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FitTracker Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}