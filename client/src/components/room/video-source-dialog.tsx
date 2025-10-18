import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Youtube, Monitor } from "lucide-react";

interface VideoSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectSource: (source: any) => void;
}

export function VideoSourceDialog({ open, onOpenChange, onSelectSource }: VideoSourceDialogProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const handleYouTubeSubmit = () => {
    if (youtubeUrl.trim()) {
      onSelectSource({
        type: 'youtube',
        url: youtubeUrl.trim()
      });
    }
  };

  const handleScreenShare = async () => {
    onSelectSource({
      type: 'screenshare'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Choose Video Source
          </DialogTitle>
          <DialogDescription>
            Select what you want to watch together
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="youtube" className="py-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="youtube" data-testid="tab-youtube">
              <Youtube className="w-4 h-4 mr-2" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="screenshare" data-testid="tab-screenshare">
              <Monitor className="w-4 h-4 mr-2" />
              Screen Share
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="youtube" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="youtube-url" className="text-sm font-semibold">
                YouTube Video URL
              </Label>
              <Input
                id="youtube-url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                data-testid="input-youtube-url"
              />
              <p className="text-xs text-muted-foreground">
                Paste any YouTube video link to watch together
              </p>
            </div>
            
            <Button
              onClick={handleYouTubeSubmit}
              disabled={!youtubeUrl.trim()}
              className="w-full"
              data-testid="button-start-youtube"
            >
              Start Watching
            </Button>
          </TabsContent>
          
          <TabsContent value="screenshare" className="space-y-4 mt-6">
            <div className="space-y-3 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Monitor className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Share Your Screen</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Share your entire screen, a specific window, or a browser tab. Perfect for watching local videos or any content.
              </p>
            </div>
            
            <Button
              onClick={handleScreenShare}
              className="w-full"
              data-testid="button-start-screenshare"
            >
              Start Screen Sharing
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Note: Everyone will see what you share in real-time
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
