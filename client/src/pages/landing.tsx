import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Video, Users, MessageCircle, Shield, Zap, Globe } from "lucide-react";
import { CreateRoomModal } from "@/components/create-room-modal";
import { JoinRoomModal } from "@/components/join-room-modal";

export default function Landing() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-chart-2/10">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-chart-2/20 pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
            <Zap className="w-4 h-4" />
            No Sign Up Required
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Watch Videos Together, Anywhere
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Create a room, share the link, and enjoy synchronized video watching with friends and family. 
            Video chat, reactions, and chat included.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all"
              onClick={() => setShowCreateModal(true)}
              data-testid="button-create-room"
            >
              <Video className="w-5 h-5 mr-2" />
              Create a Room
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all backdrop-blur-sm bg-background/80"
              onClick={() => setShowJoinModal(true)}
              data-testid="button-join-room"
            >
              <Users className="w-5 h-5 mr-2" />
              Join a Room
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for seamless collaboration and maximum fun
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Video,
                title: "Synchronized Playback",
                description: "Watch YouTube videos or share your screen. Everyone stays perfectly in sync.",
                gradient: "from-primary to-primary/60"
              },
              {
                icon: Users,
                title: "Video & Audio Chat",
                description: "See and hear your friends while watching. Toggle camera and mic anytime.",
                gradient: "from-chart-2 to-chart-2/60"
              },
              {
                icon: MessageCircle,
                title: "Live Chat & Reactions",
                description: "Chat, send reactions, and share GIFs. See who's reacting in real-time.",
                gradient: "from-chart-3 to-chart-3/60"
              },
              {
                icon: Shield,
                title: "Privacy First",
                description: "No data stored after your session ends. Complete privacy by design.",
                gradient: "from-chart-4 to-chart-4/60"
              },
              {
                icon: Zap,
                title: "Instant Access",
                description: "No downloads, no sign-ups. Just create a room and share the link.",
                gradient: "from-chart-5 to-chart-5/60"
              },
              {
                icon: Globe,
                title: "Host Controls",
                description: "Full moderation tools. Mute participants, transfer host, and more.",
                gradient: "from-primary to-chart-2"
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="relative h-full p-8 rounded-2xl bg-card border border-card-border hover-elevate transition-all">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to start watching together
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Create Your Room",
                description: "Choose your name and avatar, give your room a name, and you're the host!"
              },
              {
                step: "2",
                title: "Share the Link",
                description: "Get your unique room code and invite link. Share it anywhere instantly."
              },
              {
                step: "3",
                title: "Watch Together",
                description: "Pick a YouTube video or share your screen. Chat, react, and enjoy!"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-chart-2 text-white text-2xl font-bold mb-6 shadow-lg">
                  {step.step}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 md:p-16 rounded-3xl bg-gradient-to-br from-primary/20 via-chart-2/20 to-primary/20 border border-primary/30">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Ready to Watch Together?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create your room now and start sharing moments with the people you care about.
            </p>
            <Button
              size="lg"
              className="text-lg px-10 py-7 rounded-full shadow-2xl hover:shadow-primary/50 transition-all"
              onClick={() => setShowCreateModal(true)}
              data-testid="button-cta-create-room"
            >
              <Video className="w-5 h-5 mr-2" />
              Start Watching Together
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            Watch With Me - Privacy-first video watching platform. No data stored, complete privacy by design.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <CreateRoomModal open={showCreateModal} onOpenChange={setShowCreateModal} />
      <JoinRoomModal open={showJoinModal} onOpenChange={setShowJoinModal} />
    </div>
  );
}
